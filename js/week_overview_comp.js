/**
 * Draws two histograms: 
 * 1. Histogram of the Frequency of Usage per Week
 * 2. Grouped Histogram of the Average Frequency of Usage per Weekday
 * for each of the four rotatable elements.
 * The differnt groups can be differentiated by the colour of the bars
 * @param {*} data_g1
 * @param {*} data_g2 
 *  
 */
function week_overview_comp(data_g1, data_g2) {

    //the rotatable elements

    var elements = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
    var names = ['Rotatable Wall', 'Rotatable Closet', 'Lamp B', 'Lamp A'];

    var margin = { top: 50, right: 60, bottom: 100, left: 50 };
    var week = d3.timeFormat('%V-%y')

    var width = window.innerWidth / 4;
    var height = window.innerHeight * 0.6;
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;

    //suffix indicates to what view the scale belongs to
    var x_week = d3.scaleBand().range([0, w + width]).padding(0.01);
    var y_week = d3.scaleLinear().range([h, 0]);

    var x_weekday = d3.scaleBand().range([0, w + (width / 3)])
    var y_weekday = d3.scaleLinear().range([h, 0]);

    //data to be used to draw barcharts
    var dataset_weeks = [
        [],
        [],
        [],
        []
    ];
    var dataset_avg = [
        [],
        [],
        [],
        []
    ];
    var max_weeks = 0;
    var max_avg = [0, 0, 0, 0, 0];

    //Find all weeks in the range of the data
    var f1 = (data_g1.length == 0) ? new Date() : new Date(data_g1[0].Timestamp);
    var f2 = (data_g2.length == 0) ? new Date() : new Date(data_g2[0].Timestamp);
    var l1 = (data_g1.length == 0) ? new Date('2020-08-23') : new Date(data_g1[data_g1.length - 1].Timestamp);
    var l2 = (data_g2.length == 0) ? new Date('2020-08-23') : new Date(data_g2[data_g2.length - 1].Timestamp);

    var first = (f1 < f2) ? f1 : f2;
    var last = (l1 > l2) ? l1 : l2;
    if (data_g1.length + data_g2.length == 0) first = new Date('2019-09-09');
    if (data_g1.length + data_g2.length == 0) last = new Date('2020-08-23');


    var weekarray = [];
    //get all weeks that lie between (including) the given first and last date
    weekarray = d3.timeWeek.range(first, last, 1).map(d => week(d))


    //Generate dataset to draw the barchats with, per element
    for (var el = 0; el < 4; el++) {
        element = elements[el];
        var max_ = 0;
        var nest_weeks_and_days = [
            [],
            []
        ];

        //nest_weeks_and_days is an array of objects corresponging to weeks (KW nr.) and every week contains an array of objects corresopoinging to weekdays
        nest_weeks_and_days[0] = d3.nest()
            .key(function(d) {
                return week(new Date(d.Timestamp)); // d.Week later.
            }).key(function(d) {
                return d.Weekday;
            }).entries(data_g1.filter(x => x.Sensorname === element));

        nest_weeks_and_days[1] = d3.nest()
            .key(function(d) {
                return week(new Date(d.Timestamp)); // d.Week later.
            }).key(function(d) {
                return d.Weekday;
            }).entries(data_g2.filter(x => x.Sensorname === element));
        //perweek = array of objects {week: weeknr, freq: #accesses in total over the whole week}   
        //perdayinweek = array of objects {week: weeknr, freq: [#accesses in total on that day]}
        var perweek = [
            [],
            []
        ];



        for (var g = 0; g < 2; g++) {
            for (d in nest_weeks_and_days[g]) {
                perweek[g].push({
                    "week": nest_weeks_and_days[g][d].key,
                    "freq": nest_weeks_and_days[g][d].values.reduce(function(total, curval) {
                        return total + curval.values.length;
                    }, 0)
                });
            }
        }
        var wks = nest_weeks_and_days[1].map(d => d.key);
        var both = (nest_weeks_and_days[0].map(d => d.key).filter(d => wks.includes(d.key)));

        //the actual padding
        var getweekindex = [];
        getweekindex[0] = perweek[0].map(x => x.week);
        getweekindex[1] = perweek[1].map(x => x.week);

        console.log('getweekindex')
        console.log(getweekindex)


        for (var i = 0; i < weekarray.length; i++) {
            a = getweekindex[0].indexOf(weekarray[i]);
            b = getweekindex[1].indexOf(weekarray[i]);

            if (a == -1 && b == -1) {
                dataset_weeks[el].push({
                    "week": weekarray[i],
                    "freq": [0, 0]
                });
            } else if (a == -1) {
                dataset_weeks[el].push({
                    "week": weekarray[i],
                    "freq": [0, perweek[1][b].freq]
                });

            } else if (b == -1) {
                dataset_weeks[el].push({
                    "week": weekarray[i],
                    "freq": [perweek[0][a].freq, 0]
                });

            } else {
                dataset_weeks[el].push({
                    "week": weekarray[i],
                    "freq": [perweek[0][a].freq, perweek[1][b].freq]
                });
            }

        }

        //calc. avg per weekday over all weeks
        var freq_per_weekday_per_week = [
            [],
            []
        ];
        freq_per_weekday_per_week[0] = nest_weeks_and_days[0].map(d => d.values = { "week": d.key, "values": d.values.map(k => k.values = { "weekday": k.key, "freq": (k.values).length }) });
        freq_per_weekday_per_week[1] = nest_weeks_and_days[1].map(d => d.values = { "week": d.key, "values": d.values.map(k => k.values = { "weekday": k.key, "freq": (k.values).length }) });


        var freq_week_flat = [
            [],
            []
        ];


        //flatten, st. we get an array of {weekday, freq}
        for (var g = 0; g < 2; g++) {
            for (d in freq_per_weekday_per_week[g]) {
                for (l in freq_per_weekday_per_week[g][d].values) {

                    var x = freq_per_weekday_per_week[g][d].values[l];
                    freq_week_flat[g].push(x);

                }
            }
        }


        //sum up freq of the same weekday
        dataset_avg[el] = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];

        for (var g = 0; g < 2; g++) {
            for (var i = 0; i < freq_week_flat[g].length; i++) {
                dataset_avg[el][g][freq_week_flat[g][i].weekday] += freq_week_flat[g][i].freq;
            }
        }

        var totalweeks = [freq_per_weekday_per_week[0].length, freq_per_weekday_per_week[1].length];

        //calcuate avg
        for (var g = 0; g < 2; g++) {
            for (var d = 0; d < 7; d++) {
                dataset_avg[el][g][d] = dataset_avg[el][g][d] / totalweeks[g];
                max_ = Math.max(max_, dataset_avg[el][g][d])
            }
        }
        max_avg[el + 1] = max_;


    }
    //max freq for each element (the scale will be global over all four elements)
    var max0 = d3.max(dataset_weeks[0], function(d) { return Math.max(d.freq[0], d.freq[1]) });
    var max1 = d3.max(dataset_weeks[1], function(d) { return Math.max(d.freq[0], d.freq[1]) });
    var max2 = d3.max(dataset_weeks[2], function(d) { return Math.max(d.freq[0], d.freq[1]) });
    var max3 = d3.max(dataset_weeks[3], function(d) { return Math.max(d.freq[0], d.freq[1]) });

    max_weeks_all = Math.max(max0, max1, max2, max3);

    var max_weeks = [max_weeks_all, max0, max1, max2, max3]
    max_avg[0] = d3.max(max_avg);


    var avg_weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    x_week.domain(weekarray);
    y_week.domain([0, max_weeks[0]])

    x_weekday.domain(avg_weekday);
    y_weekday.domain([0, max_avg[0]])
        //draw the histogram for each element
    for (var i = 0; i < elements.length; i++) {
        barchart_week_and_avg_weekday_overview_comp(both, i, dataset_weeks[i], dataset_avg[i], elements[i], names[i], margin, width, height, w, h, x_week, x_weekday, y_week, y_weekday);
    }
}


/**
 * Draw the histograms
 * @param {*} both 
 * @param {*} i 
 * @param {*} perweekPadded 
 * @param {*} avg_wkd_freq 
 * @param {*} element 
 * @param {*} margin 
 * @param {*} width 
 * @param {*} height 
 * @param {*} w 
 * @param {*} h 
 * @param {*} x_week 
 * @param {*} x_weekday 
 * @param {*} y_week 
 * @param {*} y_weekday 
 */
function barchart_week_and_avg_weekday_overview_comp(both, i, perweekPadded, avg_wkd_freq, element, name, margin, width, height, w, h, x_week, x_weekday, y_week, y_weekday) {
    var avg_weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    var overview_avg_wkd = d3.selectAll('#week_avg_comp_' + element)
        .append("svg").attr('id', 'turnPerWeekday_barchart')
        .attr("height", height)
        .attr("width", width * 1.5)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var overview_weeks = d3.selectAll('#week_overview_comp_' + element)
        .append("svg").attr('id', 'overview_weeks_barchart')
        .attr("height", height)
        .attr("width", width * 2)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .style('font-size', '12px')
        .html(function(d, i) { return 'freq_1: ' + perweekPadded[i].freq[0] + '<br>' + 'freq_2: ' + perweekPadded[i].freq[1] });

    var tip_wkd = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .style('font-size', '12px')
        .html(function(d, i) { return 'freq_1: ' + (avg_wkd_freq[0][i]).toFixed(2) + '<br>' + 'freq_2: ' + (avg_wkd_freq[1][i]).toFixed(2) });

    overview_weeks.call(tip);
    overview_avg_wkd.call(tip_wkd);

    //--------------------------------------FREQUENCY OF USAGE PER WEEK------------------------------------
    //add the x axis
    overview_weeks.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0' + margin.left + ',' + h + ')')
        .call(d3.axisBottom(x_week).tickFormat(function(d, i) { return perweekPadded[i].week; }))
        .selectAll("text")
        .style("text-anchor", "end")
        .style('font-size', '10px')
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-60)"
        });

    //lable for x axis
    overview_weeks.append("text")
        .attr("transform",
            "translate(" + (width) + " ," +
            (h + margin.top) + ")")
        .style("text-anchor", "middle")
        .style('font-size', '12px')
        .text("Week ")
        .append('tspan')
        .text('(week_year)')
        .style('font-size', '10px')
        .style('font-style', 'italic')

    //add the y axis
    overview_weeks.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(0' + margin.left + ', 0)')
        .call(d3.axisLeft(y_week))
        .style('font-size', '9px');


    //lable for y axis
    overview_weeks.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 4)
        .attr("x", (margin.top * 2) - (height / 2))
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style('font-size', '12px')
        .text("Frequency");

    //the bars
    /**
     * In case both groups have freq >0 for the same week:
     * Case the frequencies are diffrernt:
     * draw the larger first, than the smaller in the corresponding group colour
     * Case the frequencies are same:
     * draw the bar in purple
     */
    for (var g = 0; g < 2; g++) {

        overview_weeks.selectAll("bar")
            .data(perweekPadded)
            .enter()
            .append("rect")
            .attr("class", "bar2")
            .attr('transform', 'translate(0' + (margin.left + 1) + ', 0)')
            .attr("height", function(d) {
                if (g == 0) {
                    if (d.freq[0] <= d.freq[1]) {
                        return h - y_week(d.freq[1]);
                    }
                    return h - y_week(d.freq[0]);
                } else {
                    if (d.freq[0] <= d.freq[1]) {
                        return h - y_week(d.freq[0]);
                    }
                    return h - y_week(d.freq[1]);
                }
            })
            .attr("width", x_week.bandwidth())
            .attr("x", function(d, i) { return i * (w + width) / perweekPadded.length })
            .attr("y", function(d) {
                if (g == 0) {
                    if (d.freq[0] <= d.freq[1]) {
                        return y_week(d.freq[1]);
                    }
                    return y_week(d.freq[0]);
                } else {
                    if (d.freq[0] <= d.freq[1]) {
                        return y_week(d.freq[0]);
                    }
                    return y_week(d.freq[1]);
                }
            })
            .attr("fill", function(d) {
                if (g == 0) {
                    if (d.freq[0] < d.freq[1]) {
                        return group_color[1];
                    } else if (d.freq[0] > d.freq[1]) {
                        return group_color[0];
                    }
                    return 'purple'
                } else {
                    if (d.freq[0] < d.freq[1] && d.freq[0] == 0) {
                        return group_color[0];
                    } else if (d.freq[0] > d.freq[1] && d.freq[1] == 0) {
                        return group_color[1];
                    }
                    return 'purple'
                }
            })
            // .attr('opacity', 0.5)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    }

    //adding title
    overview_weeks.append("text")
        .attr('x', width).attr('y', h + margin.top + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Frequency of Use per Week for " + name);

    //---------------------------------------------------FREQUENCY OF USAGE PER WEEK: END ----------------------------------------------------
    //--------------------------------------------AVERAGE FREQUENCY OF USAGE PER WEEKDAY: START-------------------------------------------------
    //add the x axis
    overview_avg_wkd.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0' + margin.left + ',' + h + ')')
        .call(d3.axisBottom(x_weekday).ticks(27).tickFormat(function(d, i) { return avg_weekday[i]; }))
        .style('font-size', '9px');


    //lable for x axis
    overview_avg_wkd.append("text")
        .attr("transform",
            "translate(" + ((width - margin.right - margin.left) * 0.5 + margin.right + margin.left) + " ," +
            (h + margin.top) + ")")
        .style("text-anchor", "middle")
        .style('font-size', '12px')
        .text("Weekday");

    //add the y axis
    overview_avg_wkd.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(0' + margin.left + ', 0)')
        .call(d3.axisLeft(y_weekday))
        .style('font-size', '9px');


    //lable for y axis
    overview_avg_wkd.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x", (margin.top * 2) - (height / 2))
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style('font-size', '12px')
        .text("Frequency");


    console.log(avg_wkd_freq)



    //the bars
    off = 0.2 * x_weekday.bandwidth();
    for (var g = 1; g >= 0; g--) {
        overview_avg_wkd.selectAll("bar")
            .data(avg_wkd_freq[g])
            .enter().append("rect")
            .attr("class", "bar_")
            .attr('transform', 'translate(0' + (margin.left + (w + (width) / 3) / (109)) + ', 0)')
            .attr("height", function(d) { return h - y_weekday(d); })
            .attr("width", (x_weekday.bandwidth() / 2.4))
            .attr("x", function(d, i) { return i * (x_weekday.bandwidth()) + (g * (x_weekday.bandwidth() / 2.4)) })
            .attr("y", function(d) { return y_weekday(d); })
            .attr("fill", group_color[g])
            .on('mouseover', tip_wkd.show)
            .on('mouseout', tip_wkd.hide);
    }

    //adding title
    overview_avg_wkd.append("text")
        .attr('x', ((width - margin.right - margin.left) * 0.5 + margin.right + margin.left))
        .attr('y', h + margin.top + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Average Frequency of Use per Weekday for " + name);


    //---------------------------------------------AVERAGE FREQUENCY OF USAGE PER WEEKDAY: END---------------------------------------------

}


//HELPER FUNCTION
/**
 * return string of fomrat %Y-%m-%d given a date
 * @param {*} date 
 */
function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}