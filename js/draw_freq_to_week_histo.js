/**
 * draws the percentage bar chart for values of the given scale mode [0 == freq, 1 == duration]
 * For the dataset_inner_barchart given in single_choice.js, it calculates for each week the percentage of data that was observed 
 * in that week, while also giving the exacat freq and duration for the week in the tooltip.
 * @param {int} scale 
 */
function draw_freq_to_week_histo(scale) {
    d3.selectAll('#weekhistochart').remove();

    console.log('au')
    var margin = { top: 50, right: 50, bottom: 100, left: 50 };
    var week = d3.timeFormat('%V-%y')

    // var bar = 15;
    var width = window.innerWidth / 4 - 50;
    var height = width * 1.5;
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;

    var x_week = d3.scaleBand().range([0, w + width]).padding(0.01);

    var y_week = d3.scaleLinear().range([h, 0]);
    var data = week_applies.filter(d => d.freq[scale] != 0);


    var sum = 0

    for (var i = 0; i < data.length; i++) {
        sum += data[i].freq[scale]
    }

    for (var i = 0; i < data.length; i++) {
        if (sum == 0) {
            data[i].freq[scale] = 0;
        } else {
            data[i].freq[scale] /= sum;
            data[i].freq[scale] *= 100;

        }
    }
    x_week.domain(data.map(d => d.Week_Year));
    y_week.domain([0, d3.max(week_applies.map(d => d.freq[scale]))])
    console.log('#weekhisto');

    var measure = ['Frequency', 'Duration']


    var overview_weeks = d3.selectAll('#weekhisto')
        .append("svg")
        .attr('id', 'weekhistochart')
        .attr("height", height)
        .attr("width", width * 2)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-30, 0])
        .html(function(d) {
            console.log(d)
            f = d.freq[scale].toFixed(2);
            exact = getTimeString(scale, d.freq[scale] / 100 * sum);
            return f + '%' + '<br>' + measure[scale] + ': ' + exact;
        });

    overview_weeks.call(tip);

    overview_weeks.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0' + margin.left + ',' + h + ')')
        .call(d3.axisBottom(x_week)) //.tickFormat(function(d, i) { return data[i].Week_year; }))
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
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar2")
        .attr('id', 'bar_')
        .attr('transform', 'translate(0' + (margin.left + 1) + ', 0)')
        .attr("height", function(d) { return h - y_week(d.freq[scale]); })
        .attr("width", x_week.bandwidth())
        .attr("x", function(d, i) { return i * (w + width) / data.length })
        .attr("y", function(d) { return y_week(d.freq[scale]); })
        .attr("fill", 'steelblue')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);




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
        return x

    }

}