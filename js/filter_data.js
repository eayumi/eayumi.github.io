/**
 * function that filters data_processed.json and data_scatter_matrix.json with the given current filters,
 * and saves the filtered result (data),
 * and then calls other functions that use the data.
 * This way, we need to do filter the data only once once.
 * And all visualizations are linked together.
 * 
 */
var filterfirst = true;
var useData = [];


function filter_data() {

    //var filter = [-1, -1, -1, -1, -1] //Weekday, Week, Group,TimeFrom,TimeTo
    console.log('weeks_filter')
    console.log(weeks_filter)

    var dw = { '0': 'Mon', '1': 'Tue', '2': 'Wed', '3': 'Thu', '4': 'Fri', '5': 'Sat', '6': 'Sun' }


    console.log('FILTER_DATA()')

    Promise.all([d3.json('../data/data_processed.json'), d3.json('../data/data_processed_Besucher.json')]).then(function(datas) {

        var checkBox = document.getElementById("check_besucher");
        if (checkBox == null || checkBox.checked == false) {
            var data = datas[0];
            console.log('normal data')
        } else {
            var data = datas[1];
            console.log('without B data')
        }
        var data = datas[0];
        var filter = window.glb_filter;
        console.log(data)
        console.log(filter)
        wf = weeks_filter.map(x => x.Week_Year);
        //apply filter on data

        //Week
        if (wf.length != 0) {
            data = data.filter(x => wf.includes(x.Week));
        }
        //Weekday
        if (filter[0].length != 0) {
            data = data.filter(x => (filter[0]).includes(dw[x.Weekday]))
        }
        //All, Single,Double, SvsD
        if (filter[1] != -1) {
            data = data.filter(x => x.Group == filter[1])

        }
        if (filter[3] != -1 && filter[4] != -1) {
            data = time_filter(data, filter[3], filter[4]);
        }



        /**
         * filter data such that we are left with data instances in interval of [from_time; to_time]
         * @param {*} data
         * @param {*} from_time  format: %H:%M 
         * @param {*} to_time   format: %H:%M
         */
        function time_filter(data, from_time, to_time) {
            var data_time_filtered = [];
            var date = '1996-12-19 ';
            var time = d3.timeFormat('%H:%M');


            if (from_time != -1 && to_time != -1) {
                from_time = time(new Date(date + from_time));
                to_time = time(new Date(date + to_time));

                for (var i = 0; i < data.length; i++) {
                    t = (new Date(data[i].Timestamp));
                    k = (data[i].Duration == '') ? 0 : data[i].Duration;
                    dt = time(new Date(t.getMilliseconds() + k));
                    df = time(new Date(data[i].Timestamp));
                    console.log(dt)
                    console.log(df)

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

        // var weeks_out = ['37', '40', '43', '49', '50', '51', '52', '01', '03', '04', '05'];
        var elements = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];

        console.log(data);
        console.log(data.filter(x => !weeks_out.includes(x.Week)))

        data_in = data.filter(x => !weeks_out.includes(x.Week)).filter(d => elements.includes(d.Sensorname));
        console.log(data_in)

        //call functions with this data
        if (!filterfirst) {
            for (var i = 0; i < 4; i++) {
                d3.selectAll("#perday" + i).remove()
                d3.selectAll("#week_p" + i).remove();
            }
            d3.selectAll("#myLegend").remove();
            d3.selectAll("#turnPerWeekday_barchart").remove();
            d3.selectAll("#overview_weeks_barchart").remove();
            d3.selectAll('#freq_per_angle').remove();
            d3.selectAll('#freq_per_angle_svgs').remove();
            d3.selectAll('#tofrom').remove();
            d3.selectAll('#parsetsingle').remove();


        }
        var parsetweeks = (weeks_filter.length == 0) ? data_profile : weeks_filter

        if (filter[1] != -1) {
            parsetweeks = parsetweeks.filter(x => x.Group == filter[1])

        }
        //update the visualizations
        Promise.all([
            parset(parsetweeks),
            // perday(data_in),
            week_profile(data_in),
            week_overview(data_in),
            freq_per_angle(data_in),
            freq_per_angle_abs(data_in),
            ToFromScatter(data_in)
        ]);

        filterfirst = false;
        //do the same for data_scatter_matrix.json
        d3.json('../data/data_scatter_matrix.json').then(function(data) {


            if (wf.length != 0) {
                data = data.filter(x => wf.includes(x.Week));
            }

            //Weekday
            if (filter[0].length != 0) {
                data = data.filter(x => (filter[0]).includes(x.Weekday))
            }

            //All, Single,Double, 
            if (filter[1] != -1) {
                data = data.filter(x => x.Group == filter[1])

            }

            if (filter[3] != -1 || filter[4] != -1) {
                data = time_filterSM(data, filter[3], filter[4]);

            }

            d3.selectAll("#matrix").remove();
            console.log(data)
                //update scatter plot matrix.
            scatter_matrix_single(data);

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

    });
}