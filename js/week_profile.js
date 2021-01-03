function week_profile(data_) {
    var week = d3.timeFormat("%V-%y");
    var day = d3.timeFormat("%Y-%m-%d");
    var weekday = d3.timeFormat('%a');
    //Each Sensordata files data must be nested into an array of {week: {weekday}}
    //date formats
    var sensors = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
    var datas = [] //[dw, ds, la, ld];

    // console.log(data_)

    var data_weeks = d3.nest().key(function(d) {
        return (d.Week)
    }).entries(data_).map(x => x.key);

    var first = new Date('2019-09-09');
    var last = new Date(data_[data_.length - 1].Timestamp);

    for (var i = 0; i < 4; i++) datas.push(data_.filter(x => x.Sensorname == sensors[i]));

    // pad with zero freq-values for dates the sensor did not register anything
    //Start


    var nest_weeks_and_days = [
        [],
        [],
        [],
        []
    ]
    var nest_day = [];
    for (data in datas) {
        nest_day[data] = d3.nest().key(function(d) {
            return day(new Date(d.Timestamp))
        }).entries(datas[data]);
    }

    // console.log(nest_day);
    var dates_padded = [
        [],
        [],
        [],
        []
    ];

    for (data in nest_day) {
        dates_padded[data] = pad(first, last, nest_day[data], data_weeks);
        first = new Date('2019-09-09');
    }
    // console.log(dates_padded)

    for (k in dates_padded) {
        nest_weeks_and_days[k] = d3.nest()
            .key(function(d) {
                return week(new Date(d.key));
            }).entries(dates_padded[k]);
        // console.log(nest_weeks_and_days[k])
        for (p in nest_weeks_and_days[k]) {
            // console.log(nest_weeks_and_days[k][p])
            nest_weeks_and_days[k][p].values = nest_weeks_and_days[k][p].values.map(function(d) {
                return { date: weekday(new Date(d.key)), freq: d.values.length }
            });
        }

    }

    var wd = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 };
    var dw = { 0: 'Mon', 1: 'Tue', 2: 'Wed', 3: 'Thu', 4: 'Fri', 5: 'Sat', 6: 'Sun' };


    for (d in nest_weeks_and_days) {
        var sum_values = {
            key: 'avg',
            values: [
                { date: "Mon", freq: 0 },
                { date: "Tue", freq: 0 },
                { date: "Wed", freq: 0 },
                { date: "Thu", freq: 0 },
                { date: "Fri", freq: 0 },
                { date: "Sat", freq: 0 },
                { date: "Sun", freq: 0 }
            ]
        };
        var weeks = nest_weeks_and_days[d].length;

        for (var i = 0; i < weeks; i++) {
            var cur = nest_weeks_and_days[d][i].values;

            for (var j = 0; j < 7; j++) {
                if (cur.length <= j || wd[cur[j].date] != j) {
                    cur.push({ date: dw[j], freq: 0 })
                }
            }
        }
        for (var i = 0; i < weeks; i++) {

            for (var j = 0; j < 7; j++) {

                sum_values.values[j].freq += nest_weeks_and_days[d][i].values[j].freq;
            }
        }

        for (var j = 0; j < 7; j++) {
            sum_values.values[j].freq /= weeks;
        }
        nest_weeks_and_days[d].push(sum_values)
    }


    // console.log(nest_weeks_and_days)
    //At this point sensor data are neatly nested



    // set the dimensions and margins of the graph
    var margin = { top: 50, right: 100, bottom: 80, left: 50 },
        width = window.innerHeight,
        w = width - margin.left - margin.right;

    var x = d3.scaleBand()
        .range([0, w])
        .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);


    var keys = nest_weeks_and_days[d].map(function(x) { return { key: x.key, selected: false } })

    var names = ['Rotatable Wall', 'Rotatable Closet', 'Lamp B', 'Lamp A'];
    for (d in nest_weeks_and_days) {

        //d is the dth element of [DW,DS,LA,LD]
        draw_multiline_graph(d, nest_weeks_and_days[d], sensors[d], names[d], keys, x, nest_weeks_and_days[d].map(j => d3.max(j.values, k => k.freq)));
    }

}
// append the svg object to the body of the page
function draw_multiline_graph(index, data, name, titlename, keys, x, max_per_week) {

    const ELEMENTS = max_per_week.length - 1;
    // console.log(max_per_week)
    // set the dimensions and margins of the graph
    var margin = { top: 50, right: 100, bottom: 80, left: 50 },
        width = window.innerHeight,
        height = width * 0.9,
        w = width - margin.left - margin.right,
        h = height - margin.top - margin.bottom;

    var avg = d3.select("#div_week_p" + index)
        .append("svg")
        .attr('id', 'week_p' + index)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var y = d3.scaleLinear()
        .domain([0, d3.max(max_per_week)])
        .range([h, 0]);

    var xAxis = g => g
        .attr('transform', 'translate(0,' + h + ')')
        .call(d3.axisBottom(x))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -h)
            .attr("stroke-opacity", 0.1))
        .attr('font-size', '10px')
        .call(g => g.append("text")
            .attr("x", w / 2)
            .attr("y", 0)
            .style('font-size', '13px')
            .attr("text-anchor", "end")
            .text('Date')
        )

    var yAxis = g => g
        .attr('class', 'wk_yaxis')
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", w)
            .attr("stroke-opacity", 0.1))
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -((h - margin.left) / 2))
            .style('font-size', '13px')
            .attr("text-anchor", "end")
            .text('Frequency')
        )

    var line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.freq));

    avg.append("g")
        .call(xAxis);
    avg.append("g")
        .call(yAxis);


    //---------------------------------------SETUP DONE-----------------------------------------------------------------
    avg.append("text")
        .attr('x', w / 2).attr('y', h + margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Frequency of Usage" +
            titlename + " per Day per Week");



    for (d in data) {
        //draw each line
        var color_line = (data[d].key == 'avg') ? 'black' : d3.interpolateYlGnBu(keys.map(x => x.key).indexOf(data[d].key) / (ELEMENTS - 1) * 0.7 + 0.3); // myColorS(d);
        drawline_week_profile(avg, line, color_line, data[d].key, data[d].values, x, y, name)
    }

    //draw the interactive legend on the right of the graph.
    //on click, make corresponding line disappear
    keys_ = keys.slice();
    keys_.pop();
    console.log(keys_)
    var prev_max = d3.max(max_per_week);

    avg.selectAll("myLegend")
        .data(keys_)
        .enter()
        .append('g')
        .append("text")
        .attr('x', w + 20)
        .attr('y', function(d, i) {
            return h / ELEMENTS * i + margin.bottom / 2;
        })
        .text(function(d) { return 'week ' }).style("fill", "black")
        .style("font-size", 13)
        .append("tspan")
        .text(function(d) { return d.key; })
        .style("fill", function(d, i) { return d3.interpolateYlGnBu(keys_.indexOf(d) / (ELEMENTS - 1) * 0.7 + 0.3) })
        .style("font-weight", 700)
        .style("font-size", 13)
        .style('cursor', 'pointer')
        .attr("transform", "translate(" + 0 + ", " + (-25) + ")")
        .on("click", click_scale)
        .on('mouseover', function(d) {
            console.log(d)
            d3.select('.line' + d.key + name).style('stroke', 'red');
            d3.select('.circlecol' + d.key + name).style('fill', 'red');
            d3.select('.circle' + d.key + name).style('stroke', 'red');


        })
        .on('mouseout', function(d) {
            console.log(d)
            c = d3.interpolateYlGnBu(keys_.indexOf(d) / (ELEMENTS - 1) * 0.7 + 0.3);
            d3.select('.line' + d.key + name).style('stroke', c);
            d3.select('.circlecol' + d.key + name).style('fill', c);
            d3.select('.circle' + d.key + name).style('stroke', c);


        });

    function click_scale(d, i) {

        var currentOpacity = d3.selectAll(".line" + d.key + name).style("opacity")
        var currentColor = d3.select(this).style("fill");
        var currentOpacityCircle = d3.selectAll(".circle" + d.key + name).style("opacity")

        d3.selectAll(".line" + d.key + name).transition().style("opacity", currentOpacity == 1 ? 0 : 1)
        d3.selectAll(".circle" + d.key + name).transition().style("opacity", currentOpacityCircle == 1 ? 0 : 1)

        d3.select(this).style("fill", currentColor == "grey" ? d3.interpolateYlGnBu(keys.indexOf(d) / (ELEMENTS - 1) * 0.7 + 0.3) : "grey");
        keys_[i].selected = (keys_[i].selected) ? false : true;


        // console.log(keys)
        //  console.log(max_per_week.filter(x => !keys_[max_per_week.indexOf(x)].selected))


        function reScale() {
            var newmax = max_per_week[max_per_week.length - 1];
            for (var j = 0; j < keys_.length; j++) {
                if (!keys_[j].selected) newmax = Math.max(newmax, max_per_week[j])
            }

            // console.log('NEWMAX' + newmax)

            // console.log(data[i].key)


            y = y.domain([0, newmax])
            prev_max = newmax;
            // line.y(function(d) {
            //     return y.domain([0, newmax])(d.freq)
            // });
            apply(newmax, i, data);
        }

        reScale();

        d3.selectAll(".line" + d.key + name).transition().style("opacity", currentOpacity == 1 ? 0 : 1);
        d3.selectAll(".circle" + d.key + name).transition().style("opacity", currentOpacityCircle == 1 ? 0 : 1);

        avg.selectAll('.wk_yaxis').remove();
        avg.append('g').call(yAxis);




        // Change the opacity: from 0 to 1 or from 1 to 0


        // console.log('out')
    }

    function apply(newm, i, dat) {
        y.domain([0, newm])
        console.log(dat)

        if (i != -1) {
            avg.selectAll(".line" + dat[i].key + name)
                .attr("d", line(dat[i].values));

            avg.selectAll(".circle" + dat[i].key + name)
                .attr("cy", d => y.domain([0, newm])(d.freq))
        }
        for (dd in dat) {
            if (dd != i) {
                avg.selectAll(".line" + dat[dd].key + name)
                    .transition()
                    .duration(1000)
                    .attr("d", line(dat[dd].values));

                avg.selectAll(".circle" + dat[dd].key + name)
                    .transition()
                    .duration(1000)
                    .attr("cy", d => y.domain([0, newm])(d.freq))

            }
        }
    }

}

/**
 * Funtction that draws a line (of data of a week) in a given svg (ie given element)
 * @param {} svg 
 * @param {*} line d3.line()
 * @param {*} color_line colour of the line
 * @param {*} week the week the data corresponds to
 * @param {*} data 
 * @param {*} x scale
 * @param {*} y scale
 * @param {*} name of the element
 */
function drawline_week_profile(svg, line, color_line, week, data, x, y, name) {


    //  var l_linelength = length(line(data));

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-30, 0])
        .html(function(d) {
            return (week == 'avg') ? ('weekly average' + '<br> freq: ' + d.freq) : ("week: " + week + '<br> freq: ' + d.freq);
        })
    svg.call(tip);
    var off = x('Tue') / 2;
    // console.log('OFF ' + off)
    //the line
    stroke_w = (week == 'avg') ? 2 : 1;

    svg.append("path")
        .attr("class", "line" + week + name)
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", color_line)
        .attr("stroke-width", stroke_w)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr('transform', 'translate(' + off + ',0)')


    //the dots on the line
    svg.append("g")
        .attr("fill", color_line)
        .attr("stroke", color_line)
        .attr("stroke-width", 1)
        .attr("class", "circlecol" + week + name)
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "circle" + week + name)
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.freq))
        .attr("r", 3)
        .attr("opacity", 1)
        .attr('transform', 'translate(' + off + ',0)')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);



}


function createDefault_week_profile(date) {
    return {
        "key": date,
        'values': []
    }
}

function pad(first, last, data, weeks) {
    var day = d3.timeFormat("%Y-%m-%d");
    var week = d3.timeFormat("%V-%y");


    var result = [];
    var i = 0;

    for (var d = first; d.getTime() <= last.getTime(); d.setDate(d.getDate() + 1)) {
        datestr = day(d);
        if (weeks.includes(week(d))) {
            if (data.filter(x => x.key == datestr).length > 0) {
                //this date exists in your data, copy it
                result.push(data[i]);
                i++;
            } else {
                //this date does not exist, create a default
                result.push({
                    "key": datestr,
                    'values': []
                });
            }
        }
    }
    return result;
}