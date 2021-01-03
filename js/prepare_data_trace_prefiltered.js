/**
 * STEP 2/2 to pre-calculate data files for trace operations.
 * This function takes all unique words found in the data and calculates how often the word occured for up to maxdistance of 2, using levensthein distance.
 * This is very computation intensive.
 * 
 * ...for the given modus (type) and wordlength
 */
function prefilter_new(type, wordlength) {
    var path_AllS = [];
    var path_AllR = [];
    var path_REDR = [];
    var path_REDS = [];
    var path_OCS = [];
    var path_OCR = [];


    var path_AllS10 = [];
    var path_AllR10 = [];
    var path_REDR10 = [];
    var path_REDS10 = [];
    var path_OCS = [];
    var path_OCR = [];

    var weeks_to_filter = ["38-19", "39-19",
        "41-19", "42-19",
        "44-19", "45-19",
        "46-19", "47-19",
        "48-19", "02-20",

        "06-20", "07-20",
        "08-20", "09-20",
        "10-20", "11-20",
        "19-20", "20-20",
        "22-20", "24-20",

        "25-20", "26-20",
        "27-20", "28-20",
        "29-20", "30-20",
        "31-20", "32-20",
        "33-20", "34-20"
    ];

    var hours = [-1, 0, 3, 6, 9, 12, 15, 18, 21];


    var All_R = 4;
    var All_S = 16;

    var OC_R = 4;
    var OC_S = 13;

    var Red_R = 5;
    var Red_S = 13;

    if (wordlength == 5) {
        //Get all paths for wordlength 5 and all modes

        if (type == 'All') {
            for (var i = 0; i < All_S; i++) path_AllS.push(d3.json('../data/data_trace/distances_part_All_S_' + i + '_5.json'))
            for (var i = 0; i < All_R; i++) path_AllR.push(d3.json('../data/data_trace/distances_part_All_R_' + i + '_5.json'));
            // prefilter_data(path_AllS, weeks_to_filter, 'All_S_5');
            prefilter_data(path_AllR, weeks_to_filter, 'All_R_5');
        } else if (type == 'RED') {
            for (var i = 0; i < Red_S; i++) path_REDS.push(d3.json('../data/data_trace/distances_part_RED_S_' + i + '_5.json'));
            for (var i = 0; i < Red_R; i++) path_REDR.push(d3.json('../data/data_trace/distances_part_RED_R_' + i + '_5.json'));
            prefilter_data(path_REDS, weeks_to_filter, 'RED_S_5');
            prefilter_data(path_REDR, weeks_to_filter, 'RED_R_5');
        } else {
            for (var i = 0; i < OC_R; i++) path_OCR.push(d3.json('../data/data_trace/distances_part_OC_R_' + i + '_5.json'));
            for (var i = 0; i < OC_S; i++) path_OCS.push(d3.json('../data/data_trace/distances_part_OC_S_' + i + '_5.json'));

            prefilter_data(path_OCS, weeks_to_filter, 'OC_S_5');
            prefilter_data(path_OCR, weeks_to_filter, 'OC_R_5');
        }
    } else {
        //Get all paths for wordlength 10 and all modes

        All_S = 27;
        Red_S = 15;
        OC_S = 15;

        All_R = 22;
        Red_R = 17;
        OC_R = 17;


        if (type == 'All') {
            for (var i = 0; i < All_S; i++) { path_AllS10.push(d3.json('../data/data_trace/distances_part_All_S_' + i + '_10.json')) }
            for (var i = 0; i < All_R; i++) path_AllR10.push(d3.json('../data/data_trace/distances_part_All_R_' + i + '_10.json'));
            prefilter_data(path_AllS10, weeks_to_filter, 'All_S_10');
            prefilter_data(path_AllR10, weeks_to_filter, 'All_R_10');
        } else if (type == 'RED') {
            for (var i = 0; i < Red_S; i++) path_REDS10.push(d3.json('../data/data_trace/distances_part_RED_S_' + i + '_10.json'));
            for (var i = 0; i < Red_R; i++) path_REDR10.push(d3.json('../data/data_trace/distances_part_RED_R_' + i + '_10.json'));
            prefilter_data(path_REDR10, weeks_to_filter, 'RED_R_10');
            prefilter_data(path_REDS10, weeks_to_filter, 'RED_S_10');

        } else {
            for (var i = 0; i < OC_R; i++) path_OCR.push(d3.json('../data/data_trace/distances_part_OC_R_' + i + '_10.json'));
            for (var i = 0; i < OC_S; i++) path_OCS.push(d3.json('../data/data_trace/distances_part_OC_S_' + i + '_10.json'));

            prefilter_data(path_OCS, weeks_to_filter, 'OC_S_10');
            prefilter_data(path_OCR, weeks_to_filter, 'OC_R_10');
        }
    }
    document.getElementById('doneStep2').innerHTML = 'DONE';


    /**
     * Function that filters the data for differnt values of hour, weekday and week and then calculates the frequency of words.
     * By keeping the words and their frequency seperatly per week, we are able to calculate most common words of different groups better in the final view.
     * @param {} path 
     * @param {*} weeks2filter 
     * @param {*} name 
     */
    function prefilter_data(path, weeks2filter, name) {
        console.log(weeks2filter)

        Promise.all(path).then(function(datas) {
            console.log(datas)
            console.log(weeks2filter)
            const DIST = 3;
            /**
             * 2:Week -1,
             * 1:Group -1,0,2
             * 0:Weedkday -1,0,1,2,3,4,5,6
             * Time top 30 per hour
             */
            var temp = [];

            for (var i = 0; i < weeks2filter.length; i++) {

                temp = apply_filter_weeks([weeks2filter[i]], datas);

                for (var k = 0; k < hours.length; k++) {

                    temp3 = apply_filter_hour(hours[k], temp);

                    toJson(temp3, 'data_prefiltered_' + name + '_' + weeks2filter[i] + '_' + hours[k] + '.json')

                    console.log('data_prefiltered_' + name + '_' + weeks2filter[i] + '_' + hours[k]);

                    console.log(temp3)


                }

            }


            /**
             * filters data and only counts words that were observe in the given weeks
             * @param {} weeks 
             * @param {*} datas_to_filter 
             */
            function apply_filter_weeks(weeks, datas_to_filter) {

                var datas_filtered = [];

                for (var i = 0; i < datas_to_filter.length; i++) {
                    var data_ = JSON.parse(JSON.stringify(datas_to_filter[i]));

                    for (var j = 0; j < data_.length; j++) {
                        d = data_[j]
                        f = 0;
                        for (var k = 0; k < DIST; k++) {
                            (d.dist[k].Inf) = (d.dist[k].Inf).filter(x => weeks.includes(x.w));
                            d.dist[k].freq = d.dist[k].Inf.length;
                            f += d.dist[k].Inf.length
                        }
                        d.freq = f;

                    }

                    //     data_ = data_.filter(x => (x.dist.map(y => y.freq)).reduce(reducer, 0) > 0);
                    datas_filtered.push(data_.filter(d => d.freq != 0));

                }

                // console.log('data_filtered group [' + weeks + ']  length ' + datas_filtered.length);

                return datas_filtered;
            }


            function apply_filter_weekday(weekday, datas_to_filter) {
                var datas_filtered = [];
                for (var i = 0; i < datas_to_filter.length; i++) {
                    var data_ = JSON.parse(JSON.stringify(datas_to_filter[i]));
                    if (weekday != -1) {
                        for (var j = 0; j < data_.length; j++) {
                            d = data_[j];
                            f = 0;
                            for (var k = 0; k < DIST; k++) {
                                (d.dist[k].Inf) = (d.dist[k].Inf).filter(x => x.wd == weekday);
                                d.dist[k].freq = d.dist[k].Inf.length;
                                f += d.dist[k].Inf.length

                            }
                            d.freq = f;


                        }
                    }
                    // data_ = data_.filter(x => (x.dist.map(y => y.freq)).reduce(reducer, 0) > 0);
                    datas_filtered.push(data_.filter(d => d.freq != 0));

                }
                console.log('datas_filtered weekday ' + weekday + '  length ' + datas_filtered.length);

                return datas_filtered;

            }

            /**
             * filters data and only counts words that were observe in the given hours
             * @param {*} hour 
             * @param {*} datas_to_filter 
             */
            function apply_filter_hour(hour, datas_to_filter) { // 2 hour steps
                console.log(hour)
                var datas_filtered = [];
                for (var i = 0; i < datas_to_filter.length; i++) {
                    var data_ = JSON.parse(JSON.stringify(datas_to_filter[i]));
                    if (hour != -1) {
                        for (var j = 0; j < data_.length; j++) {
                            d = data_[j]
                            f = 0;
                            for (var k = 0; k < DIST; k++) {
                                (d.dist[k].Inf) = (d.dist[k].Inf).filter(x => (
                                    (parseInt(x.from.substring(0, 3)) >= hour && parseInt(x.from.substring(0, 3)) < (hour + 3)) &&
                                    (parseInt(x.to.substring(0, 3)) >= hour && parseInt(x.to.substring(0, 3)) < (hour + 3))
                                ));
                                d.dist[k].freq = d.dist[k].Inf.length;
                                f += d.dist[k].Inf.length;
                            }
                            d.freq = f;
                        }
                    }
                    //  data_ = data_.filter(x => (x.dist.map(y => y.freq)).reduce(reducer, 0) > 0);
                    datas_filtered.push(data_.filter(d => d.freq != 0));


                }
                console.log('datas_filtered hour ' + hour + '  length ' + datas_filtered.length);
                return datas_filtered;

            }


        })

    }




}