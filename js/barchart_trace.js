const TOP = 15; //number of words to show in barchart

function barchart() {
    ////console.log('barchart_trace')

    //reserve space
    d3version4.select("#div_timeline_trace")
        .append("svg")
        .attr('id', 'time_trace')
        .attr("width", width)
        .attr('height', 200)


}


/**
 * Draws barchart in the given modes 
 */
function drawBar() {
    document.getElementById('title_word').innerHTML = 'Timeline for ' + '_._._._._';

    var names = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand',
        'K_Fen_Oben_Str', 'K_Fen_Unten_Str',
        'S_Fen_Oben_Str', 'S_Fen_Unten_Str', 'S_Boden_Wand_cyr', 'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
        'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str',
        'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr',
        'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr', 'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
        'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr', 'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Ofen_Schub_cyr', 'K_Schub_Oben_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr'
    ]
    var selector_list = [
        ['.drehwand'],
        ['.drehschrank', '.drehschrank-6', '.drehschrank-7', '.drehschrank-8', '.drehschrank-9', '.H_Putz_cyr-7', '.H_Putz_cyr-8', '.H_Graderobe_cyr-7', '.H_Graderobe_cyr-8'],
        ['.LA', '.LA5'],
        ['.LD', '.LD5'],
        ['.K_Fen_Oben_Str-6', '.K_Fen_Oben_Str-7', '.K_Fen_Oben_Str-8', '.K_Fen_Oben_Str-9'],
        ['.K_Fen_Unten_Str-6', '.K_Fen_Unten_Str-7', '.K_Fen_Unten_Str-8', '.K_Fen_Unten_Str-9'],
        ['.S_Fen_Oben_Str-6', '.S_Fen_Oben_Str-7', '.S_Fen_Oben_Str-8', '.S_Fen_Oben_Str-9'],
        ['.S_Fen_Unten_Str-6', '.S_Fen_Unten_Str-7', '.S_Fen_Unten_Str-8', '.S_Fen_Unten_Str-9'],
        ['.S_Boden_Wand_cyr'],
        ['.S_Boden_Kueche_cyr'],
        ['.S_Schub_Wand_cyr', '.S_Schub_Wand_cyr-6', '.S_Schub_Wand_cyr-7'],
        ['.S_Schub_Kueche_cyr', '.S_Schub_Kueche_cyr-6', '.S_Schub_Kueche_cyr-7'],
        ['.H_Putz_cyr-7', '.H_Putz_cyr-8'],
        ['.H_Garderobe_cyr-7', '.H_Garderobe_cyr-8'],
        ['.H_Tuer_Str-7', '.H_Tuer_Str-8'],
        ['.B_Tuer_Str-6', '.B_Tuer_Str-7', '.B_Tuer_Str-8', '.B_Tuer_Str-9'],
        ['.B_Schrank_cyr-8'],
        ['.B_Wasch_cyr'], //
        ['.W_Schub_Bad_cyr', '.W_Schub_Bad_cyr-6', '.W_Schub_Bad_cyr-7'],
        ['.W_Schub_Wand_cyr', '.W_Schub_Wand_cyr-6', '.W_Schub_Wand_cyr-7'],
        ['.W_Boden_Bad_cyr'],
        ['.W_Boden_Wand_cyr'],
        ['.W_Fen_Bad_Str-6', '.W_Fen_Bad_Str-7', '.W_Fen_Bad_Str-8', '.W_Fen_Bad_Str-9'],
        ['.W_Fen_Wand_Str-6', '.W_Fen_Wand_Str-7', '.W_Fen_Wand_Str-8', '.W_Fen_Wand_Str-9'],
        ['.K_Schrank_Oben_01_cyr-8'],
        ['.K_Schrank_Oben_02_cyr-8'],
        ['.K_Schrank_Oben_03_cyr-8'],
        ['.K_Schrank_Oben_04_cyr-8'],
        ['.K_Schrank_Oben_05_cyr-8'],
        ['.K_Kuehl_cyr-7'],
        ['.K_Abfall_cyr-8'],
        ['.K_Wasch_Str-8'],
        ['.K_Ofen_Str-8'],
        ['.K_Ofen_Schub_cyr-8'],
        ['.K_Schub_Oben_cyr-8'],
        ['.K_Schub_Mitte_cyr-8'],
        ['.K_Schub_Unten_cyr-8']
    ]
    var names_rooms = { 'R': 'Rotation Element', 'K': 'Kitchen', 'S': 'Bedroom', 'H': 'Entrance', 'B': 'Bathroom', 'W': 'Livingroom' }

    var letters_sensor = ['A', 'B', 'C', 'D',
        'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O',
        'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'
    ]

    var wd = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 }

    //get the current modes set

    var modus = d3.select('#mode_select').property('value');
    var sensorletterstring = d3.select('#letter_select').property('value');
    var DIST = d3.selectAll('#dist_select').property('value');
    var wordlength = d3.selectAll('#wordlength_select').property('value');
    var hours = $timetrace_select.multipleSelect('getSelects');



    if (hours.length == 0 || hours[0] == -1) hours = []

    var filter = glb_filter

    var paths = []; // contains all datapaths for the files that contain data applying to given modes
    //weeks_to contains all weeks to consider when calculating most common words.

    var weeks_to = weeks_filter;
    if (weeks_to.length == 0) { //if no weeks selected, consider all
        weeks_to = weeks_not_out;
    }


    if (filter[1] != -1) { //if the test-subjects filter ('single', 'pair') is set
        weeks_to = weeks_to.filter(x => x.Group == filter[1]);

    }
    // the Bewohner.josn file also contains info on test-subjects not yet taken part in the study, or weeks we do not consider for evaluatio in the bachelor thesis. These are filtered out
    weeks_to = weeks_to.filter(x => x.Week_Year.substring(3, 5) == '19' || (parseInt(x.Week_Year.substring(0, 3)) < 35 && x.Week_Year.substring(3, 5) == '20'));

    var string = sensorletterstring;


    //find all the datapaths that apply
    //the datapaths are spilt upto week and timeinterval, not weekdays!
    for (var w = 0; w < weeks_to.length; w++) {
        week = weeks_to[w].Week_Year;
        // console.log(week);
        for (var h = 0; h < hours.length; h++) {
            hour = hours[h]
                // ////console.log('../data/data_trace_prefiltered/data_prefiltered_' + modus + '_' + string + '_' + wordlength + '_' + week + '_' + hour + '.json')
            paths.push(d3.json('../data/data_trace_prefiltered/data_prefiltered_' + modus + '_' + string + '_' + wordlength + '_' + week + '_' + hour + '.json'))
        }
        if (hours.length == 0) {
            hour = -1
                ////console.log('../data/data_trace_prefiltered/data_prefiltered_' + modus + '_' + sensorletterstring + '_' + wordlength + '_' + week + '_' + hour + '.json')
            paths.push(d3.json('../data/data_trace_prefiltered/data_prefiltered_' + modus + '_' + string + '_' + wordlength + '_' + week + '_-1.json'))

        }
    }


    Promise.all(paths).then(function(datases) { //read in all the given files
        // //console.log(datas);
        var newdata = [];

        /**
         * function that returns a sorted list of all words and freqency of occurences of the words for the given macimal distance
         * @param {} datas 
         */
        function getTop15(datas) {

            var newdata_ = [];

            var data = [];
            for (var i = 0; i < datas.length; i++) {
                data = data.concat(datas[i]);
            }


            // complete filters 
            //Weekday filter. if we specified one single week, filter .w for it
            if (filter[0].length != 0 || filter[0].length != 7) {
                for (var j = 0; j < filter[0].length; j++) {

                    for (var i = 0; i < data.length; i++) {
                        var d = data[i].dist
                        for (var p = 0; p <= DIST; p++) {
                            d[p].Inf = d[p].Inf.filter(x => x.wd == wd[filter[0][j]])

                            d[p].freq = d[p].Inf.length;

                        }
                        // if (f > 0) //console.log(data[i])

                    }

                }
            }


            // sum count of all occurences of the words for the given distance 
            for (var i = 0; i < data.length; i++) { //over all weeks
                data[i].freq = 0;
                for (var k = 0; k <= DIST; k++) {

                    data[i].freq += data[i].dist[k].freq;
                }


            }
            //Format:
            // var newdata = [{ word: 'hi', freq: 45 },
            //     { word: 'hdfre', freq: 14 },
            //     { word: 'hdfwi', freq: 42 },
            //     { word: 'hqnwi', freq: 49 },
            //     { word: 'hdseg', freq: 26 },
            // ];

            data.sort(function(a, b) {
                return b.freq - a.freq
            })

            newdata_ = data;
            return newdata_;


        }

        //for each data per week/timeinterval
        for (var i = 0; i < datases.length; i++) {
            newdata = newdata.concat(getTop15(datases[i]));
        }
        //combine
        var nest = []; //contains word and frequency of it per week/timeinterval
        var newdata_com = []; //contains words and their frequencies

        nest = d3.nest().key(function(d) {
            return d.word
        }).entries(newdata);

        //for each word sum up frequency per distance and push into newdata_combined
        for (var i = 0; i < nest.length; i++) {
            c = 0
            v = [{ freq: 0, Inf: [] }, { freq: 0, Inf: [] }, { freq: 0, Inf: [] }]
            for (var j = 0; j < nest[i].values.length; j++) {
                c += nest[i].values[j].freq;
                for (var k = 0; k <= DIST; k++) {

                    v[k].Inf = v[k].Inf.concat(nest[i].values[j].dist[k].Inf)
                    v[k].freq += nest[i].values[j].dist[k].freq
                }
            }
            newdata_com.push({ word: nest[i].key, dist: v, freq: c })
        }

        newdata = newdata_com;
        newdata.sort(function(a, b) {
            return b.freq - a.freq
        });
        newdata = newdata.slice(0, TOP); //get top 15 words


        //-----DRAW BARCHART-----

        //x: freq
        //y: word
        var width = window.innerWidth / 2.5,
            height = width * 0.7,
            margin = { top: 50, left: 120, right: 20, bottom: 20 };


        const svg = d3.selectAll('#div_bar_trace')
            .append("svg")
            .attr('id', 'trace_bar')
            .attr("width", width)
            .attr("height", height);


        y = d3.scaleBand()
            .domain(newdata.map(d => d.word))
            .range([0, height - margin.top - margin.bottom])
            .padding(0.2)

        yAxis = (g) => {
            return g.attr("transform", `translate(${margin.left}, ${margin.top})`)
                .call(d3.axisLeft(y).tickSizeInner(0).tickSizeOuter(0));
        }

        x = d3.scaleLinear()
            .domain([0, d3.max(newdata, d => d.freq)])
            .range([0, width - margin.left - margin.right])
            .nice()

        xAxis = (g) => {
            return g.attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickSizeOuter(0));
        }

        timerInterval = 2000;
        transitionDuration = 500;

        y.domain(newdata.map(d => d.word));
        const t = d3.transition().duration(1000)

        //tip: shows elements/rooms the sensors/correspond to and the frequency
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                var letters = d.word.split('');
                var sensors = [];
                if (sensorletterstring == 'S') {
                    for (var j = 0; j < letters.length; j++) {
                        sensors.push('<br>' + letters[j] + ':  ' + names[letters_sensor.indexOf(letters[j])])
                    }
                } else {

                    for (var j = 0; j < letters.length; j++) {
                        sensors.push('<br>' + letters[j] + ':  ' + names_rooms[letters[j]])
                    }
                }
                return 'freq: ' + d.freq + '' + sensors
            })

        var gView = svg.append("g")
            .classed("view", true)
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Draw the bars.
        let bars = gView.selectAll("rect")
            .data(newdata)
            .join("rect")
            .attr("fill", 'steelblue')
            .attr('class', 'bar')
            .attr("x", 0)
            .attr("y", d => y(d.word))
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .on('click', preview)
            .transition(t)
            .delay(function(d, i) {
                return i * 100; // Gives a slight delay with 100 ms spacing
            })
            .attr("width", d => x(d.freq))
            .attr("height", y.bandwidth());

        /**
         * calls function to draw timeline of a word for a given object d containing the word and the timestamp of each occurence of the word.
         * calls function to draw approximate path of the word.
         * @param {object} d 
         * @param {int} i 
         */
        function preview(d, i) {
            //change title for this chart to contian the word
            document.getElementById('title_word').innerHTML = 'Timeline for ' + d.word;
            // approximate_path(d.word, []);

            //draw timeline of the word
            drawTimeline(newdata[i]);

            // var letters = d.word.split('');
            // var sensors = [];
            // var selectors = [];
            // for (var j = 0; j < letters.length; j++) {
            //     sensors.push(names[letters_sensor.indexOf(letters[j])])
            //     selectors.push(selector_list[letters_sensor.indexOf(letters[j])])

            // }


            approximate_path(newdata[i].word, sensorletterstring)


        }

        // Draw the title.
        let title = svg.append("g")
            .classed("title", true)
            .attr("transform", `translate(${margin.left}, 0)`)
            .append("text")
            .classed("title", true)

        //draw x axis
        svg.append("g")
            .classed("x-axis", true)
            .call(xAxis).attr('font-size', '12px');

        //draw y axis
        let gy = svg.append("g")
            .classed("y-axis", true)
            .call(yAxis).attr('font-size', '12px');

        svg.call(tip)

        return svg.node();

    });

    /**
     * draws timeline of a word for a given object d containing the word and the timestamp of each occurence of the word.
     * @param {object} data_word 
     */
    function drawTimeline(data_word) { //data of word


        var int_to_wd = { '0': 'Mon', '1': 'Tue', '2': 'Wed', '3': 'Thu', '4': 'Fri', '5': 'Sat', '6': 'Sun' }

        //remove previous chart
        d3.selectAll('#time_trace').remove();

        //yax determines the view, either per weekday or week to be shown
        var yax = d3.select('#timeline_layout_select').property('value');


        var data = [];
        var j = 0;
        while (j <= DIST) {
            data = data.concat(data_word.dist[j].Inf);
            j++
        }
        // ////console.log(data)
        var weeks = [];
        for (var i = 0; i < data.length; i++) {
            if (!weeks.includes(data[i].w)) weeks.push(data[i].w)
        }

        //sort the weeks, works because we have less than a year worths weeks
        weeks.sort(function(a, b) {
            a = parseInt(a);
            b = parseInt(b)
            if (a < 10) a += 60;
            if (b < 10) b1 = 60;
            return a - b;
        });
        //will contian weekly/weekdaily data to be visualized (timestamp of each occurence per week or per day), in the format so we can make use of d3-timelines
        var testdata_weekly = [];
        var testdata_weekdaily = [];

        for (var i = 0; i < weeks.length; i++) {
            testdata_weekly.push({
                label: 'week ' + weeks[i] + ' ', //+ testdata[i].times.length + ') ', 
                times: []

            })

            testdata_weekly[i].times.push({
                'starting_time': 0,
                'ending_time': 0
            })
            for (var j = 0; j < 7; j++) {
                testdata_weekdaily.push({
                    label: 'week ' + weeks[i] + ' ' + int_to_wd[j] + ' ',
                    times: []
                })
            }
        }


        for (var i = 0; i < data.length; i++) {
            var ind_w = weeks.indexOf(data[i].w);
            var ind_wd = ind_w * 7 + data[i].wd;

            var from = calc(data[i].from)
            var to = calc(data[i].to)

            // if (to - from >= 0) {

            testdata_weekly[ind_w].times.push({
                'starting_time': from,
                'ending_time': from + 30000
            })

            testdata_weekdaily[ind_wd].times.push({
                    'starting_time': from,
                    'ending_time': from + 30000
                })
                // }

        }
        testdata_weekdaily = testdata_weekdaily.filter(x => x.times.length != 0)
        testdata_weekly = testdata_weekly.filter(x => x.times.length != 0)

        //yaxis label
        for (var i = 0; i < testdata_weekly.length; i++) {
            testdata_weekly[i].label = testdata_weekly[i].label + ' (' + testdata_weekly[i].times.length + ') ';
            testdata_weekly[i].times.sort(function(a, b) {
                return -(b.starting_time + a.starting_time);
            })
        }
        for (var i = 0; i < testdata_weekdaily.length; i++) {
            testdata_weekdaily[i].label = testdata_weekdaily[i].label + ' (' + testdata_weekdaily[i].times.length + ') ';
            testdata_weekdaily[i].times.sort(function(a, b) {
                return -(b.starting_time + a.starting_time);
            })
        }
        /**
         * converts time given as string in format HH:MM to miliseconds
         * @param {String} x 
         */
        function calc(x) {

            return (parseInt(x.substring(0, 3)) * (3600000)) + (parseInt(x.substring(3, 5)) * 60000);

        }
        var width = window.innerWidth * 0.7,
            height = width * 0.6;

        if (yax == 0) {
            drawChart(testdata_weekly);
        } else {
            drawChart(testdata_weekdaily);
        }

        d3.select('#timeline_layout_select').on('change', function() {
            d3.selectAll('#time_trace').remove();
            yax = d3.select(this).property('value');
            if (yax == 0) {
                drawChart(testdata_weekly);
            } else {
                drawChart(testdata_weekdaily);
            }

        });
        /**
         * Draw the actual timeline chart
         * @param {*} testdata 
         */
        function drawChart(testdata) {
            ////console.log(testdata)
            var chart = d3version4.timelines()
                .beginning(0) // we can optionally add beginning and ending times to speed up rendering a little
                // .ending(86370000)
                //  .relativeTime()
                .tickFormat({
                    format: d3.timeFormat("%H:%M"),
                    tickTime: d3version4.timeHours,
                    tickInterval: 1,
                    tickSize: 20,
                })
                .showTimeAxisTick() // toggles tick marks
                .stack() // toggles graph stacking
                //  .itemHeight('10px')
                .margin({ left: 120, right: 30, top: 0, bottom: 0 })
                //    .itemHeight((height) + 'px')
                //  .height(height);
            chart.itemMargin(2);
            chart.itemHeight(20);
            chart.colors(function() { return 'black' })



            var svg_time = d3version4.select("#div_timeline_trace")
                .append("svg")
                .attr('id', 'time_trace')
                .attr("width", width)
                .attr('height', testdata.length * 20 + 300)
                .datum(testdata)
                .call(chart)
                .attr('opacity', 1);

        }

    }


}

/**
 * do binary search on data to find index whose Timestamp is <timestamp
 * @param {*} timestamp 
 * @param {*} data 
 */
function binary_search(timestamp, data) {
    var time = d3.timeFormat('%H:%M')

    var l = 0;
    var r = data.length - 1;
    var m = Math.floor((l + r) / 2);
    while (Math.abs(l - r) > 1) {
        if (time(new Date(data[m].Timestamp)) > timestamp) {
            r = m;
        } else if (time(new Date(data[m].Timestamp)) < timestamp) {
            l = m;
        } else {
            return m;
        }
        m = Math.floor((l + r) / 2);
    }
    return m;


}

function update_trace_bar() {

    d3.selectAll('#trace_bar').remove();
    drawBar();



}



/**
 * Draws approcimation of the path taken for the given word
 * @param {string} words 
 * @param {[string]} selectors 
 */
function approximate_path(words, lettermode) {
    console.log('tracelines')
    console.log(words)
    console.log(words.split(''))

    document.querySelectorAll('.tracecircle').forEach(function(el) {
        el.style.visibility = 'hidden';
    })
    document.querySelectorAll('.traceline').forEach(function(el) {
        el.style.visibility = 'hidden';
    })


    var lines = ["K1_K2", "DS_K2", "DS_DW", "DS_WBoden", "W_WBoden", 'DW_SBoden',
        "Bout_DW", "Bout_B", "Bout_SBoden", "S_SBoden", "DW_WBoden", , "Hin_WBoden", 'Hin_Hin'
    ]

    var linepointename = {
        'S': 'S',
        's': 'SBoden',
        'K': 'K1',
        'k': 'K2',
        'W': 'W',
        'w': 'WBoden',
        'B': 'B',
        'b': 'Bout',
        'ds': 'DS',
        'dw': 'DW',
        'la': 'W',
        'Hin': 'Hin',
        'ld': 'DW'
    }

    var line_room_letter = {
        'A': 'ds',
        'B': 'ds',
        'C': 'ds',
        'D': 'ds',
        'E': 'K',
        'F': 'K',
        'Y': 'K',
        'Z': 'K',
        'a': 'K',
        'b': 'K',
        'c': 'K',
        'd': 'K',
        'e': 'K',
        'f': 'K',
        'g': 'K',
        'h': 'K',
        'i': 'K',
        'j': 'K',
        'k': 'K',
        'G': 'S',
        'H': 'S',
        'I': 'S',
        'J': 'S',
        'K': 'S',
        'L': 'S',
        'M': 'Hin',
        'N': 'Hin',
        'O': 'Hin',
        'P': 'B',
        'Q': 'B',
        'R': 'B',
        'S': 'W',
        'T': 'W',
        'U': 'W',
        'V': 'W',
        'W': 'W',
        'X': 'W'
    }
    var line_letter = {
        'A': 'dw',
        'B': 'ds',
        'C': 'W',
        'D': 'dw',

        'E': 'K',
        'F': 'K',

        'Y': 'K',
        'Z': 'K',
        'a': 'k',
        'b': 'k',
        'c': 'K',
        'd': 'K',
        'e': 'K',
        'f': 'K',
        'g': 'k',
        'h': 'k',
        'i': 'k',
        'j': 'k',
        'k': 'k',


        'G': 'S',
        'H': 'S',
        'I': 's',
        'J': 's',
        'K': 'S',
        'L': 'S',

        'M': 'ds',
        'N': 'ds',
        'O': 'Hin',
        'P': 'b',
        'Q': 'B',
        'R': 'B',

        'S': 'W',
        'T': 'W',
        'U': 'w',
        'V': 'w',
        'W': 'W',
        'X': 'W'
    }
    var circlename = {
        'S': 'S_point',
        's': 'SBoden_point',
        'K': 'K1_point',
        'k': 'K2_point',
        'W': 'W_point',
        'w': 'WBoden_point',
        'B': 'B_point',
        'b': 'Bout_point',
        'ds': 'DS_point',
        'dw': 'DW_point',
        'la': 'W_point',
        'ld': 'DW_point',
        'Hin': 'Hin_point'

    }
    var circlename_room = {
        'S': 'S_point',
        'K': 'K1_point',
        'W': 'W_point',
        'B': 'B_point',
        'ds': 'DS_point',
        'H': 'Hin_point'
    }


    var indirect_next = {
        'S': 's',
        's': '', //['DW', 'DS', 'Hin'],
        'K': 'k',
        'k': 'ds',
        'W': 'w',
        'w': '', //['DW', 'Hin'],
        'B': 'b',
        'b': '', //['DW', 'SBoden'],
        'ds': '', //['DW', 'K2', 'SBoden'],
        'dw': '', //['Wboden', 'SBoden', 'Bout', 'DS'],
        'la': 'w',
        'ld': '', // ['Wboden', 'SBoden', 'Bout', 'DS'],
        'Hin': 'w'

    }

    var next_then = {
        'ds': {
            'Hin': 'w',
            'S': 'dw',
            's': 'dw',
            'W': 'w',
            'b': 'dw',
            'B': 'dw',
            'K': 'k',
            'ld': 'dw',
            'la': 'w'
        },
        'dw': {
            'Hin': 'w',
            'S': 's',
            'W': 'w',
            'B': 'b',
            'K': 'ds',
            'k': 'ds',
            'ld': 'dw',
            'la': 's'
        },
        'la': {
            'ds': 'dw',
            'Hin': 'w',
            'S': 's',
            'W': 'w',
            'B': 'b',
            'K': 'ds',
            'k': 'ds',
            'ld': 'dw',
            'la': 's'
        },
        's': {
            'ds': 'dw',
            'W': 'dw',
            'B': 'b',
            'w': 'dw',
            'K': 'dw',
            'k': 'dw',
            'ld': 'dw',
            'la': 'dw',
            'Hin': 'dw'
        },
        'b': {
            'W': 'ds',
            'Hin': 'dw',
            'ds': 'dw',
            'S': 's',
            'K': 'dw',
            'k': 'dw',
            'ld': 'dw',
            'la': 'ds'
        },
        'w': {
            'B': 'dw',
            'b': 'dw',
            'S': 'dw',
            's': 'dw',
            'K': 'ds',
            'k': 'ds',
            'ds': 'dw',
            'ld': 'dw',
            'la': 'W'
        }
    }
    var room2sensor = {
        'K': 'k',
        'B': 'Q',
        'S': 'G',
        'W': 'U',
        'R': 'A',
        'H': 'O'
    }
    var word_circle = words.split('').map(d => circlename[line_letter[d]]); //circle  ids
    var word_lines = words.split('').map(d => line_letter[d]); //circle  ids



    if (lettermode == 'R') {
        word_circle = words.split('').map(x => room2sensor[x]).map(d => circlename[line_letter[d]]); //circle  ids
        word_lines = words.split('').map(x => room2sensor[x]).map(d => line_letter[d]); //circle  ids

    }
    console.log(word_circle);
    console.log(word_lines);

    for (var j = 0; j < word_circle.length; j++) {
        var circle_names = word_circle[j];
        console.log(circle_names)
        document.getElementById(circle_names).style.visibility = 'visible';

    }

    for (var j = 0; j < word_circle.length - 1; j++) {
        let a = linepointename[word_lines[j]];
        let b = linepointename[word_lines[j + 1]];
        console.log(a)
        console.log(b)
        console.log(word_lines[j])
        console.log(word_lines[j + 1])


        let polyline_name = linepointename[word_lines[j]] + '_' + linepointename[word_lines[j + 1]];
        let polyline_name2 = linepointename[word_lines[j]] + '_' + linepointename[word_lines[j + 1]];

        if (lines.includes(polyline_name)) {
            document.getElementById(polyline_name).style.visibility = 'visible';
            if (polyline_name == 'Hin_Hin') {
                document.getElementById('Hout_point').style.visibility = 'visible';

            }
        } else if (lines.includes(polyline_name2)) {
            document.getElementById(polyline_name2).style.visibility = 'visible';
            if (polyline_name2 == 'Hin_Hin') {
                document.getElementById('Hout_point').style.visibility = 'visible';

            }
        } else {
            //there is no direct line from a to b.
            //bulitd the path!
            var path = [];
            var circ = [];
            console.log(word_lines[j] + '   ' + word_lines[j + 1])
            buildpath(word_lines[j], word_lines[j + 1], path, circ);
            console.log(circ);
            console.log(path);

            for (var i = 0; i < path.length; i++) {
                document.getElementById(path[i]).style.visibility = 'visible';

            }

            if (path.includes('Hin_Hin')) {
                document.getElementById('Hout_point').style.visibility = 'visible';

            }
            // for (var i = 0; i < circ.length; i++) {
            //     console.log(circlename[circ[i]])
            //     document.getElementById(circlename[circ[i]]).style.visibility = 'visible';

            // }

        }

    }

    function buildpath(a, b, path, circ) {

        console.log('A B ' + a + '  ' + b);
        if (a == b) return;

        if (lines.includes(linepointename[a] + '_' + linepointename[b])) {
            console.log('push ' + linepointename[a] + '_' + linepointename[b]);
            path.push(linepointename[a] + '_' + linepointename[b]);
            circ.push(a)
            circ.push(b)


        } else if (lines.includes(linepointename[b] + '_' + linepointename[a])) {
            path.push(linepointename[b] + '_' + linepointename[a]);
            console.log('push ' + linepointename[b] + '_' + linepointename[a]);
            circ.push(a);
            circ.push(b);

        } else if (indirect_next[a] == '') {

            var n = next_then[a][b];
            console.log('n ' + n)
            if (lines.includes(linepointename[a] + '_' + linepointename[n])) {
                path.push(linepointename[a] + '_' + linepointename[n]);
                circ.push(a)
                circ.push(n)
                console.log('push ' + linepointename[a] + '_' + linepointename[n]);
            } else if (linepointename[n] + '_' + linepointename[a]) {
                path.push(linepointename[n] + '_' + linepointename[a]);
                console.log('push ' + linepointename[n] + '_' + linepointename[a]);
                circ.push(a)
                circ.push(n)
            } else {

            }
            buildpath(n, b, path, circ);


        } else {
            var indirect = indirect_next[a];
            console.log('indirect ' + indirect)
            console.log(linepointename[a] + '_' + linepointename[indirect])
            if (lines.includes(linepointename[a] + '_' + linepointename[indirect])) {
                path.push(linepointename[a] + '_' + linepointename[indirect]);
                console.log('push ' + linepointename[a] + '_' + linepointename[indirect]);
                circ.push(a)
                circ.push(indirect)
            } else if (lines.includes(linepointename[indirect] + '_' + linepointename[a])) {
                path.push(linepointename[indirect] + '_' + linepointename[a]);
                console.log('push ' + linepointename[indirect] + '_' + linepointename[a]);
                circ.push(a)
                circ.push(indirect)
            }
            buildpath(indirect, b, path, circ);

        }
    }

}

/*

 var names = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand',
        'K_Fen_Oben_Str', 'K_Fen_Unten_Str',
        'S_Fen_Oben_Str', 'S_Fen_Unten_Str', 'S_Boden_Wand_cyr',
        'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
        'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str', 'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr', 'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr',
        'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
        'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr',
        'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Ofen_Schub_cyr', 'K_Schub_Oben_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr'
    ]
    var letters_room = ['R', 'R', 'R', 'R',
        'K', 'K',
        'S', 'S', 'S', 'S', 'S', 'S',
        'H', 'H', 'H',
        'B', 'B', 'B',
        'W', 'W', 'W', 'W', 'W', 'W',
        'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K'
    ]
    var letters = ['A', 'B', 'C', 'D',
        'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O',
        'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'
    ]

    var room2letters = {
        'K': ['E', 'F', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
        'W': ['S', 'T', 'U', 'V', 'W', 'X'],
        'S': ['G', 'H', 'I', 'J', 'K', 'L'],
        'B': ['M', 'N', 'O'],
        'H': ['P', 'Q', 'R'],
        'R': ['A', 'B', 'C', 'D', ]
    }
    var letter2room = {
        'A': 'R',
        'B': 'R',
        'C': 'R',
        'D': 'R',
        'E': 'K',
        'F': 'K',
        'Y': 'K',
        'Z': 'K',
        'a': 'K',
        'b': 'K',
        'c': 'K',
        'd': 'K',
        'e': 'K',
        'f': 'K',
        'g': 'K',
        'h': 'K',
        'i': 'K',
        'j': 'K',
        'k': 'K',
        'G': 'S',
        'H': 'S',
        'I': 'S',
        'J': 'S',
        'K': 'S',
        'L': 'S',
        'M': 'H',
        'N': 'H',
        'O': 'H',
        'P': 'B',
        'Q': 'B',
        'R': 'B',
        'S': 'W',
        'T': 'W',
        'U': 'W',
        'V': 'W',
        'W': 'W',
        'X': 'W'
    }
*/