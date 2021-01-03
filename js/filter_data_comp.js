var filterfirst = true;
var useData = [];
/**
 * function that filters data_processed.json and data_scatter_matrix.json with the given current filters,
 * and saves the filtered result (data_g1,data_g2),
 * and then calls other functions that use the data.
 * This way, we need to do filter the data only once once.
 * And all visualizations are linked together.
 * 
 */
function filter_data_comp() {

    //var filter = [-1, -1, -1, -1, -1] //Weekday, Week, Group,TimeFrom,TimeTo

    console.log('FILTER_DATA()')

    d3.json('../data/data_processed.json').then(function(data_g1) {

        //current filters
        var filter_g1 = window.glb_filter_comp[0];
        var filter_g2 = window.glb_filter_comp[1];

        var data_g2 = JSON.parse(JSON.stringify(data_g1));

        //data for case where weekday is not considered in the visualization
        var data_no_weekday_filter_g1 = [];
        var data_no_weekday_filter_g2 = [];

        //weeks only
        wf1 = weeks_filter_comp[0].map(x => x.Week_Year);
        wf2 = weeks_filter_comp[1].map(x => x.Week_Year);



        var dw = { '0': 'Mon', '1': 'Tue', '2': 'Wed', '3': 'Thu', '4': 'Fri', '5': 'Sat', '6': 'Sun' };
        var wkd = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 };

        //FOR GROUP 1
        //Week
        if (wf1.length != 0) {
            data_g1 = data_g1.filter(x => wf1.includes(x.Week));
        }
        console.log('data_g1')
        console.log(data_g1)

        //Weekday
        if (filter_g1[0].length != 0) {
            data_no_weekday_filter_g1 = data_g1.slice();
            data_g1 = data_g1.filter(x => (filter_g1[0]).includes(dw[x.Weekday]))

        }

        //All, Single,Double, 
        if (filter_g1[1] != -1) {
            data_g1 = data_g1.filter(x => x.Group == filter_g1[1])
            if (filter_g1[0].length != 0) data_no_weekday_filter_g1 = data_no_weekday_filter_g1.filter(x => x.Group == filter_g1[1])

        }
        if (filter_g1[3] != -1 || filter_g1[4] != -1) {
            data_g1 = time_filter(data_g1, filter_g1[3], filter_g1[4]);
            if (filter_g1[0].length != 0) data_no_weekday_filter_g1 = time_filter(data_no_weekday_filter_g1, filter_g1[3], filter_g1[4]);

        }
        //FOR GROUP 2

        //Week
        if (wf1.length != 0) {
            data_g2 = data_g2.filter(x => wf2.includes(x.Week));
        }
        //Weekday
        if (filter_g2[0].length != 0) {
            data_no_weekday_filter_g2 = data_g2.slice();
            data_g2 = data_g2.filter(x => (filter_g2[0]).includes(dw[x.Weekday]))
        }
        //All, Single,Double, 
        if (filter_g2[1] != -1) {
            data_g2 = data_g2.filter(x => x.Group == filter_g2[1])

            if (filter_g2[0].length != 0) data_no_weekday_filter_g2 = data_no_weekday_filter_g2.filter(x => x.Group == filter_g2[1])

        }
        if (filter_g2[3] != -1 || filter_g2[4] != -1) {
            data_g2 = time_filter(data_g2, filter_g2[3], filter_g2[4]);


            if (filter_g2[0].length != 0) data_no_weekday_filter_g2 = time_filter(data_no_weekday_filter_g2, filter_g2[3], filter_g2[4]);

        }

        if (filter_g2[0].length == 0) data_no_weekday_filter_g2 = data_g2;
        if (filter_g1[0].length == 0) data_no_weekday_filter_g1 = data_g1;


        /**
         * filter data such that we are left with data instances in interval of [from_time; to_time].
         * @param {*} data
         * @param {*} from_time  format: %H:%M 
         * @param {*} to_time   format: %H:%M
         */
        function time_filter(data, from_time, to_time) {
            var data_time_filtered = [];
            var date = '1996-12-19 '; //date here doesnt matter
            var time = d3.timeFormat('%H:%M');


            if (from_time != -1 && to_time != -1) {
                from_time = time(new Date(date + from_time));
                to_time = time(new Date(date + to_time));

                for (var i = 0; i < data.length; i++) {
                    t = (new Date(data[i].Timestamp));
                    k = (data[i].Duration == '') ? 0 : data[i].Duration;
                    dt = time(new Date(t.getMilliseconds() + k));
                    df = time(new Date(data[i].Timestamp));


                    if (df >= from_time && dt <= to_time) data_time_filtered.push(data[i]);
                }

            } else if (to_time == -1) {
                from_time = time(new Date(date + from_time));


                for (var i = 0; i < data.length; i++) {
                    df = time(new Date(data[i].Timestamp));


                    if (df >= from_time) data_time_filtered.push(data[i]);
                }

            } else {

                to_time = time(new Date(date + to_time));

                for (var i = 0; i < data.length; i++) {
                    t = (new Date(data[i].Timestamp));
                    k = (data[i].Duration == '') ? 0 : data[i].Duration;
                    dt = time(new Date(t.getMilliseconds() + k));


                    if (dt <= to_time) data_time_filtered.push(data[i]);
                }

            }

            return data_time_filtered;
        }

        data_in_g1 = data_g1.filter(x => !weeks_out.includes(x.Week))
        data_in_g2 = data_g2.filter(x => !weeks_out.includes(x.Week))

        //call functions with this data --> already called before, This means we need to first remove previous visualizations.
        if (!filterfirst) {
            console.log('FILTER_REMOVE')
            for (var i = 0; i < 4; i++) {
                // d3.selectAll("#perday" + i).remove()
                d3.selectAll("#week_p" + i + '_left').remove();
                d3.selectAll("#week_p" + i + '_right').remove();

            }
            d3.selectAll("#myLegend").remove();
            d3.selectAll('#overview_weeks_barchart').remove();
            d3.selectAll('#turnPerWeekday_barchart').remove();
            d3.selectAll('#freq_per_angle_svgs_comp').remove();
            d3.selectAll('#Rfreq_per_angle_svgs_comp').remove();
            d3.selectAll('#tofrom').remove();
            d3.selectAll('#parsetcomp_').remove();




        }
        filterfirst = false;
        var parsetweeks = [];
        parsetweeks[0] = (weeks_filter_comp[0].length == 0) ? data_profile : weeks_filter_comp[0]
        parsetweeks[1] = (weeks_filter_comp[1].length == 0) ? data_profile : weeks_filter_comp[1]

        //All, Single,Double, 
        if (filter_g1[1] != -1) {
            parsetweeks[0] = parsetweeks[0].filter(x => x.Group == filter_g1[1])

        }
        if (filter_g2[1] != -1) {
            parsetweeks[1] = parsetweeks[1].filter(x => x.Group == filter_g2[1])


        }

        //call functions to update all other visualizations with the appropriate data
        Promise.all([
            parset_comp(parsetweeks),
            week_profile_comp(data_no_weekday_filter_g1.filter(x => !weeks_out.includes(x.Week)), data_no_weekday_filter_g2.filter(x => !weeks_out.includes(x.Week))),
            week_overview_comp(data_in_g1, data_in_g2),
            freqDistr_abs_comp(data_g1, data_g2),
            freqDistr_rot_comp(data_g1, data_g2),
            ToFromScatter_comp(data_g1, data_g2)

        ]);
        //do the same for data_scatter_matrix.json
        d3.json('../data/data_scatter_matrix.json').then(function(data) {

            var data_sm_g1 = data;
            var data_sm_g2 = JSON.parse(JSON.stringify(data_sm_g1));

            if (wf1.length != 0) {
                data_sm_g1 = data_sm_g1.filter(x => wf1.includes(x.Week));
            }
            console.log('data_g1')
            console.log(data_sm_g1)

            //Weekday
            if (filter_g1[0].length != 0) {
                // data_no_weekday_filter_g1 = data_sm_g1.slice();
                data_sm_g1 = data_sm_g1.filter(x => (filter_g1[0]).includes(x.Weekday))

            }
            console.log(data_sm_g1)

            //All, Single,Double, 
            if (filter_g1[1] != -1) {
                data_sm_g1 = data_sm_g1.filter(x => x.Group == filter_g1[1])
                    // if (filter_g1[0].length != 0) data_no_weekday_filter_g1 = data_no_weekday_filter_g1.filter(x => x.Group == filter_g1[1])

            }
            console.log(data_sm_g1)

            if (filter_g1[3] != -1 || filter_g1[4] != -1) {
                data_sm_g1 = time_filterSM(data_sm_g1, filter_g1[3], filter_g1[4]);
                // if (filter_g1[0].length != 0) data_no_weekday_filter_g1 = time_filterSM(data_no_weekday_filter_g1, filter_g1[3], filter_g1[4]);

            }
            console.log(data_sm_g1)

            //Week
            if (wf1.length != 0) {
                data_sm_g2 = data_sm_g2.filter(x => wf2.includes(x.Week));
            }
            //Weekday
            if (filter_g2[0].length != 0) {
                // data_no_weekday_filter_g2 = data_sm_g2.slice();
                data_sm_g2 = data_sm_g2.filter(x => (filter_g2[0]).includes(x.Weekday))
            }
            //All, Single,Double, 
            if (filter_g2[1] != -1) {
                data_sm_g2 = data_sm_g2.filter(x => x.Group == filter_g2[1])

                // if (filter_g2[0].length != 0) data_no_weekday_filter_g2 = data_no_weekday_filter_g2.filter(x => x.Group == filter_g2[1])

            }
            if (filter_g2[3] != -1 || filter_g2[4] != -1) {
                data_sm_g2 = time_filterSM(data_sm_g2, filter_g2[3], filter_g2[4]);

                // if (filter_g2[0].length != 0) data_no_weekday_filter_g2 = time_filterSM(data_no_weekday_filter_g2, filter_g2[3], filter_g2[4]);

            }

            // if (filter_g2[0].length == 0) data_no_weekday_filter_g2 = data_sm_g2;
            // if (filter_g1[0].length == 0) data_no_weekday_filter_g1 = data_sm_g1;

            d3.selectAll("#matrix").remove();
            //update scatter plot matrix.
            scatter_matrix_comp(data_sm_g1, data_sm_g2);

            /**
             * filter data such that we are left with data instances in interval of [from_time; to_time]
             * @param {*} data
             * @param {*} from_time  format: %H:%M 
             * @param {*} to_time   format: %H:%M
             */
            function time_filterSM(data, from_time, to_time) {
                console.log(from_time + "  " + to_time)
                var data_time_filtered = [];
                var date = '1996-12-19 ';
                var time = d3.timeFormat('%H:%M');

                if (from_time != -1 && to_time != -1) {
                    from_time = time(new Date(date + '' + from_time));
                    to_time = time(new Date(date + '' + to_time));

                    for (var i = 0; i < data.length; i++) {

                        df = time(new Date(data[i].Timestamp));


                        if (df >= from_time && df <= to_time) data_time_filtered.push(data[i]);
                    }

                } else if (to_time == -1) {
                    from_time = time(new Date(date + from_time));


                    for (var i = 0; i < data.length; i++) {
                        df = time(new Date(data[i].Timestamp));


                        if (df >= from_time) data_time_filtered.push(data[i]);
                    }

                } else {

                    to_time = time(new Date(date + '' + to_time));

                    for (var i = 0; i < data.length; i++) {
                        t = (new Date(data[i].Timestamp));
                        dt = time(t);


                        if (dt <= to_time) data_time_filtered.push(data[i]);
                    }

                }
                // console.log(data_time_filtered)

                return data_time_filtered;
            }

        })


        console.log('WEEKPRO')




    });
}