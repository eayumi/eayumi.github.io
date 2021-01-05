/**
 * draws the percentage bar chart for values of the given scale mode [0 == freq, 1 == duration]
 * For the dataset_inner_barchart given in comparison.js, it calculates for each week the percentage of data that was observed 
 * in that week, while also giving the exacat freq and duration for the week in the tooltip.
 * @param {*} scale 
 */
function draw_freq_to_week_histo_comp(data, scale, g) {


    var side = (g == 0) ? 'left' : 'right';

    draw_percentage_bar_chart_per_group(side, JSON.parse(JSON.stringify(data)), scale, g);


}
/**
 * draws the data for the given group
 * @param {String} side used for id 
 * @param {*} data_to_draw the data to draw, determined by week_applies_comp built in comaprison.js
 * @param {*} scale // the scale to draw chart on 
 * @param {*} g  group
 */
function draw_percentage_bar_chart_per_group(side, data_to_draw, scale, g) {

    d3.selectAll('#weekhistochart' + side).remove();

    var margin = { top: 50, right: 50, bottom: 100, left: 50 };
    var width = window.innerWidth / 4 - 50;
    var height = width * 1.5;
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;
    var x_week = d3.scaleBand().range([0, w + width]).padding(0.01);
    var y_week = d3.scaleLinear().range([h, 0]);
    var sum = 0

    for (var i = 0; i < data_to_draw.length; i++) {
        sum += data_to_draw[i].freq[scale]
    }

    for (var i = 0; i < data_to_draw.length; i++) {
        if (sum == 0) {
            data_to_draw[i].freq[scale] = 0;
        } else {
            data_to_draw[i].freq[scale] /= sum;
            data_to_draw[i].freq[scale] *= 100;

        }
    }

    x_week.domain(data_to_draw.map(d => d.Week_Year));

    if (data_to_draw.filter(d => d.freq[scale] != 0).length > 0) {

        y_week.domain([0, d3.max(data_to_draw.map(d => d.freq[scale]))])
    } else {

        y_week.domain([0, 100])
    }


    var overview_weeks = d3.selectAll('#weekhisto_' + side)
        .append("svg")
        .attr('id', 'weekhistochart' + side)
        .attr("height", height)
        .attr("width", width * 2)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var measure = ['Frequency', 'Duration']
    var tip_barchart = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-30, 0])
        .html(function(d) {
            f = d.freq[scale].toFixed(2);
            exact = getTimeString(scale, d.freq[scale] / 100 * sum)
            return f + '%' + '<br>' + measure[scale] + ': ' + exact;
        });
    overview_weeks.call(tip_barchart);

    overview_weeks.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0' + (margin.left) + ',' + h + ')')
        .call(d3.axisBottom(x_week)) //.tickFormat(function(d, i) { return data[i].Week_year; }))
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
        .style('font-size', '13px')
        .text("Week ")
        .append('tspan')
        .text('(week_year)')
        .style('font-size', '9px')
        .style('font-style', 'italic')

    overview_weeks.append("text")
        .attr("transform",
            "translate(" + (width) + " ," +
            (h + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style('font-size', '13px')
        .text("Group " + (g + 1))


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
        .text("Percentage");

    //the bars
    if (data_to_draw.filter(d => d.freq[scale] != 0).length > 0) {
        data_to_draw = data_to_draw.slice();
        overview_weeks.selectAll("bar")
            .data(data_to_draw)
            .enter()
            .append("rect")
            .attr("class", "bar2")
            .attr('id', 'bar_')
            .attr('transform', 'translate(0' + (margin.left + 1) + ', 0)')
            .attr("height", function(d) { return h - y_week(d.freq[scale]); })
            .attr("width", x_week.bandwidth())
            .attr("x", function(d, i) { return i * (w + width) / data_to_draw.length })
            .attr("y", function(d) { return y_week(d.freq[scale]); })
            .attr("fill", group_color[g])
            .on('mouseover', tip_barchart.show)
            .on('mouseout', tip_barchart.hide);
    }


    /**
     * function return text to be displayed in the tooltip for the given bar
     * @param {*} scale determines wether to return just an int or a string in a time format
     * @param {*} x the value for a bar
     */
    function getTimeString(scale, x) {
        if (scale == 1) {
            sec = 1000;
            min = 60000;
            hour = 60 * min;

            var t = x;

            h = Math.floor(t / hour);
            t = t - h * hour;
            m = Math.floor(t / min);
            t = t - m * min;
            s = Math.floor(t / sec);
            ms = t - s * sec;
            return h + 'h ' + m + 'm ' + s + 's'
        }
        return Math.round(x)

    }



}