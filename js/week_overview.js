/**
 * Draws two histograms: 
 * 1. Histogram of the Frequency of Usage per Week
 * 2. Histogram of the Average Frequency of Usage per Weekday
 * for each of the four rotatable elements.
 * @param {*} data 
 */
function week_overview(data) {
    //the rotatable elements
    var elements = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
    var names = ['Rotatable Wall', 'Rotatable Closet', 'Lamp B', 'Lamp A'];

    var margin = { top: 50, right: 100, bottom: 100, left: 50 };
    var week = d3.timeFormat('%V-%y')

    var width = window.innerWidth / 4;
    var height = window.innerHeight * 0.7;
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;

    //suffix indicates to what view the scale belongs to
    var x_week = d3.scaleBand().range([0, w + width]).padding(0.01);
    var x_weekday = d3.scaleBand().range([0, w + (width / 2)]).padding(0.01);

    var y_week = d3.scaleLinear().range([h, 0]);
    var y_weekday = d3.scaleLinear().range([h, 0]);

    //data to draw the  frequency of usage per week
    var dataset_weeks = [
        [],
        [],
        [],
        []
    ];
    //data to draw the average frequency of usage per weekday
    var dataset_avg = [
        [],
        [],
        [],
        []
    ];

    //max frequencyies
    var max_weeks = 0;
    var max_avg = [0, 0, 0, 0, 0];

    //Find all weeks in the range of the data
    var first = new Date(data[0].Timestamp);
    var last = new Date(data[data.length - 1].Timestamp);

    var weekarray = []; //temp

    //get all weeks that lie between (including) the given first and last date
    weekarray = d3.timeWeek.range(first, last, 1).map(d => week(d))


    //Generate dataset to draw the barchats with, per element
    for (var el = 0; el < 4; el++) {
        element = elements[el];
        var max_ = 0;
        //nest_weeks_and_days is an array of objects corresponging to weeks and every week contains an array of objects corresopoinging to weekdays
        var nest_weeks_and_days = d3.nest()
            .key(function(d) {
                return week(new Date(d.Timestamp));
            }).key(function(d) {
                return d.Weekday;
            }).entries(data.filter(x => x.Sensorname === element));

        //perweek = array of objects {week: weeknr, freq: #accesses in total over the whole week}   
        //perdayinweek = array of objects {week: weeknr, freq: [#accesses in total on that day]}
        var perweek = [];

        for (d in nest_weeks_and_days) {
            perweek.push({
                "week": nest_weeks_and_days[d].key,
                "freq": nest_weeks_and_days[d].values.reduce(function(total, curval) {
                    return total + curval.values.length;
                }, 0)
            });
        }

        var getweekindex = perweek.map(x => x.week);


        //pad 
        for (var i = 0; i < weekarray.length; i++) {
            if (getweekindex.indexOf(weekarray[i]) == -1) {
                dataset_weeks[el].push({
                    "week": weekarray[i],
                    "freq": 0
                });

            } else {
                dataset_weeks[el].push(perweek[getweekindex.indexOf(weekarray[i])]);

            }
        }
        //calculate the average per weekday
        var freq_per_weekday_per_week = nest_weeks_and_days.map(d => d.values = { "week": d.key, "values": d.values.map(k => k.values = { "weekday": k.key, "freq": (k.values).length }) });
        var freq_week_flat = [];

        //flatten, st. we get an array of {weekday, freq}
        for (d in freq_per_weekday_per_week) {
            for (k in freq_per_weekday_per_week[d].values) {
                var x = freq_per_weekday_per_week[d].values[k];
                freq_week_flat.push(x);

            }

        }


        //sum up freq of the same weekday
        dataset_avg[el] = [0, 0, 0, 0, 0, 0, 0];


        for (var i = 0; i < freq_week_flat.length; i++) {
            dataset_avg[el][freq_week_flat[i].weekday] += freq_week_flat[i].freq;
        }

        var total = freq_per_weekday_per_week.length;
        //calcuate avg
        for (var d = 0; d < 7; d++) {
            dataset_avg[el][d] = dataset_avg[el][d] / total;
            max_ = Math.max(max_, dataset_avg[el][d])

        }
        max_avg[el + 1] = max_;

    }
    //max freq for each element (the scale will be global over all four elements)
    var max0 = d3.max(dataset_weeks[0], function(d) { return d.freq; });
    var max1 = d3.max(dataset_weeks[1], function(d) { return d.freq; });
    var max2 = d3.max(dataset_weeks[2], function(d) { return d.freq; });
    var max3 = d3.max(dataset_weeks[3], function(d) { return d.freq; });

    max_weeks_all = Math.max(max0, max1, max2, max3);

    var max_weeks = [max_weeks_all, max0, max1, max2, max3]
    max_avg[0] = d3.max(max_avg);

    var avg_weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


    x_week.domain(weekarray);
    y_week.domain([0, max_weeks[0]]);

    x_weekday.domain(avg_weekday);
    y_weekday.domain([0, max_avg[0]]);

    //draw the histogram for each element
    for (var i = 0; i < 4; i++) {
        barchart_week_and_avg_weekday_overview_comp(max_weeks, max_avg, i, dataset_weeks[i], dataset_avg[i], elements[i], names[i], margin, width, height, w, h, x_week, x_weekday, y_week, y_weekday);
    }
}

/**
 * Draw the histograms
 * @param {Int} max_weeks 
 * @param {Int} max_avg 
 * @param {Int} index 
 * @param {*} perweekPadded 
 * @param {*} avg_wkd_freq 
 * @param {String} element name
 * @param {Int} margin 
 * @param {Int} width 
 * @param {Int} height 
 * @param {Int} w 
 * @param {Int} h 
 * @param {scale} x_week 
 * @param {scale} x_weekday 
 * @param {scale} y_week 
 * @param {scale} y_weekday 
 */
function barchart_week_and_avg_weekday_overview_comp(max_weeks, max_avg, index, perweekPadded, avg_wkd_freq, element, elemetname, margin, width, height, w, h, x_week, x_weekday, y_week, y_weekday) {

    var avg_weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];



    var overview_weeks = d3.selectAll('#week_overview_' + element)
        .append("svg")
        .attr('id', 'overview_weeks_barchart')
        .attr("height", height)
        .attr("width", width * 2.5)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var overview_avg_wkd = d3.selectAll('#week_avg_' + element)
        .append("svg")
        .attr('id', 'turnPerWeekday_barchart')
        .attr("height", height)
        .attr("width", width * 1)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .style('font-size', '12px')
        .html(function(d) { return 'freq: ' + d.freq });

    var tip_wkd = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .style('font-size', '12px')
        .html(function(d) { return 'freq: ' + d.toFixed(2) });

    overview_weeks.call(tip);
    overview_avg_wkd.call(tip_wkd);

    var toggle = 0;
    var scaletype = ['global', 'local']

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
            return "rotate(-45)"
        });

    //lable for x axis
    overview_weeks.append("text")
        .attr("transform",
            "translate(" + (width) + " ," +
            (h + margin.top) + ")")
        .style("text-anchor", "middle")
        .style('font-size', '13px')
        .text("Week ")
        .append('tspan')
        .text('(week_year)')
        .style('font-size', '9px')
        .style('font-style', 'italic')

    //add the y axis
    overview_weeks.append("g")
        .attr('id', 'yax_weekoverview')
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
        .style('font-size', '13px')
        .text("Frequency");

    //the bars
    overview_weeks.selectAll("bar")
        .data(perweekPadded)
        .enter()
        .append("rect")
        .attr("class", "bar2")
        .attr('id', 'bar_' + element)
        .attr('transform', 'translate(0' + (margin.left + 1) + ', 0)')
        .attr("height", function(d) { return h - y_week(d.freq); })
        .attr("width", x_week.bandwidth())
        .attr("x", function(d, i) { return i * (w + width) / perweekPadded.length })
        .attr("y", function(d) { return y_week(d.freq); })
        .attr("fill", 'steelblue')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('click', function() {
            //toggle btw. local and global scale
            toggle = (toggle + 1) % 2;

            y_week.domain([0, max_weeks[toggle * (index + 1)]])
            d3.selectAll('#bar_' + element).transition().duration(1000)
                .attr("height", function(d) { return h - y_week(d.freq); })
                .attr('y', function(d) { return y_week(d.freq); })

            overview_weeks.selectAll('#yax_weekoverview').remove();
            overview_weeks.append('g').attr('id', 'yax_weekoverview')
                .attr("class", "axis")
                .attr('transform', 'translate(0' + (margin.left + margin.right) + ', 0)')
                .call(d3.axisLeft(y_week))
                .style('font-size', '9px');

            overview_weeks.selectAll('#overviewweekstitle')
                .text("Frequency of " + elemetname + " per Week on a " + scaletype[toggle] + ' Scale');

        });


    //adding title
    overview_weeks.append("text")
        .attr('id', 'overviewweekstitle')
        .attr('x', ((width - margin.right - margin.left) * 0.5 + margin.right + margin.left))
        .attr('y', h + margin.top + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Frequency of " + elemetname + " per Week on a " + scaletype[toggle] + ' Scale');

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
        .attr('id', 'yax_weekoverview_avg')
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
        .attr('id', 'week_label' + element)
        .text("Frequency");


    var toggle_avg = 0;
    //the bars
    overview_avg_wkd.selectAll("bar")
        .data(avg_wkd_freq)
        .enter().append("rect")
        .attr('id', 'bar_avg' + element)
        .attr("class", "bar")
        .attr('transform', 'translate(0' + (margin.left + 1) + ', 0)')
        .attr("height", function(d) { return h - y_weekday(d); })
        .attr("width", x_weekday.bandwidth())
        .attr("x", function(d, i) { return i * (w + (width / 2)) / avg_wkd_freq.length })
        .attr("y", function(d) { return y_weekday(d); })
        .on('mouseover', tip_wkd.show)
        .on('mouseout', tip_wkd.hide)
        .on('click', function() {
            toggle_avg = (toggle_avg + 1) % 2;


            y_weekday.domain([0, max_avg[toggle_avg * (index + 1)]])

            d3.selectAll('#bar_avg' + element).transition().duration(1000)
                .attr("height", function(d) { return h - y_weekday(d); })
                .attr('y', function(d) { return y_weekday(d); })

            overview_avg_wkd.selectAll('#yax_weekoverview_avg').remove();

            overview_avg_wkd.append('g').attr('id', 'yax_weekoverview_avg')
                .attr("class", "axis")
                .attr('transform',
                    "translate(" + ((width) * 0.5) + " ," +
                    margin.left + ', 0)')
                .call(d3.axisLeft(y_weekday))
                .style('font-size', '9px');

            overview_avg_wkd.selectAll('#turnperweektitle')
                .text("Average Frequency of" + elemetname + " on a " + scaletype[toggle_avg] + " Scale");

            var label = ['(Uniform Scale)', '']
            d3.selectAll('#week_label' + element).remove();
            overview_avg_wkd.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 10)
                .attr("x", (margin.top * 2) - (height / 2))
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .style('font-size', '12px')
                .attr('id', 'week_label' + element)
                .text("Frequency ");
        });



    //adding title
    overview_avg_wkd.append("text")
        .attr('id', 'turnperweektitle')
        .attr('x', ((width - margin.right - margin.left) * 0.5 + margin.right + margin.left))
        .attr('y', h + margin.top + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Average Frequency of " + elemetname + " on a " + scaletype[toggle_avg] + " Scale");


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