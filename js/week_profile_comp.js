function week_profile_comp(data_g1, data_g2) {
    var week = d3.timeFormat("%V-%y");
    var day = d3.timeFormat("%Y-%m-%d");
    var weekday = d3.timeFormat('%a');
    //Each Sensordata files data must be nested into an array of {week: {weekday}}
    //date formats
    var sensors = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];


    var wd = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 };
    var dw = { 0: 'Mon', 1: 'Tue', 2: 'Wed', 3: 'Thu', 4: 'Fri', 5: 'Sat', 6: 'Sun' };


    function preprocess_data(data_) {
        var FIRST = new Date('2019-09-09'); //TODO update 
        var last = new Date(data_[data_.length - 1].Timestamp);

        var datas = [] //[dw, ds, la, ld];
            //get all weeks
        var data_weeks = d3.nest().key(function(d) {
            return (d.Week)
        }).entries(data_).map(x => x.key);

        // console.log(data_weeks)
        // console.log(data_)

        for (var i = 0; i < 4; i++) { datas.push(data_.filter(x => x.Sensorname == sensors[i])); }

        var nest_weeks_and_days = [
            [],
            [],
            [],
            []
        ]
        var nest_day = [];

        //for each sensorelement, nest per day 
        for (data in datas) {
            nest_day[data] = d3.nest().key(function(d) {
                return day(new Date(d.Timestamp))
            }).entries(datas[data]);
        }
        // console.log(nest_day)

        // pad  nest_day with zero freq-values for dates the sensor did not register anything
        var dates_padded = [
            [],
            [],
            [],
            []
        ];

        for (data in nest_day) {
            dates_padded[data] = pad(FIRST, last, nest_day[data], data_weeks);
            FIRST = new Date('2019-09-09');
        }
        // console.log(dates_padded)

        for (k in dates_padded) {
            //nest dates_padded by week 
            nest_weeks_and_days[k] = d3.nest()
                .key(function(d) {
                    // console.log(d.key)
                    return week(new Date(d.key));
                }).entries(dates_padded[k]);

            //nest_weeks_and_days --> holds all freq per weekday grouped by week
            for (p in nest_weeks_and_days[k]) {
                nest_weeks_and_days[k][p].values = nest_weeks_and_days[k][p].values.map(function(d) {
                    return { date: weekday(new Date(d.key)), freq: d.values.length }
                });
            }

        }

        // console.log(nest_weeks_and_days)
        //append average of all the data at the end
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

        // console.log(nest_weeks_and_days);

        return (nest_weeks_and_days);
    }
    var promise1 = new Promise((resolve, reject) => { resolve(preprocess_data(data_g1)) });
    var promise2 = new Promise((resolve, reject) => { resolve(preprocess_data(data_g2)) });


    // set the dimensions and margins of the graph
    var margin = { right: 100, left: 50 },
        width = Math.min((window.innerWidth / 2 * 0.95), (window.innerHeight * 0.95)) - 100,
        w = width - margin.left - margin.right;

    var x = d3.scaleBand()
        .range([0, w])
        .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

    //calculate max freq per week for the data of both groups, in order for the graphs of the same element to have the same y-scale in both groups. 

    var max_per_week_g1 = [];
    var max_per_week_g2 = [];
    var keys = [
        [],
        []
    ];
    window.cur_amx = [];
    Promise.all([promise1, promise2]).then(function(data_proc) {

        for (var i = 0; i < 4; i++) {
            var keys_g1 = data_proc[0][i].map(function(x) { return { key: x.key, selected: false } });
            var keys_g2 = data_proc[1][i].map(function(x) { return { key: x.key, selected: false } });


            keys[0].push(keys_g1);
            keys[1].push(keys_g2);


            max_week_1 = data_proc[0][i].map(j => d3.max(j.values, k => k.freq));
            max_week_2 = data_proc[1][i].map(j => d3.max(j.values, k => k.freq));

            max_per_week_g1.push(max_week_1);
            max_per_week_g2.push(max_week_2);



        }
        draw_multiline_graph_all(data_proc, max_per_week_g1, max_per_week_g2, '_left', '_right');


    });


    function draw_multiline_graph_all(data_proc, max_per_week_g1, max_per_week_g2, l, r) {

        for (var index = 0; index < 4; index++) {

            //d is the dth element of [DW,DS,LA,LD]
            draw_multiline_graph(index, data_proc[0][index], data_proc[1][index], sensors[index], keys[0][index], keys[1][index], x, max_per_week_g1[index], max_per_week_g2[index], l, r);
        }

        // append the svg object to the body of the page
        function draw_multiline_graph(index, data_g1, data_g2, name, keys_g1, keys_g2, x, max_per_week_g1, max_per_week_g2, l, r) {
            // set the dimensions and margins of the graph
            const ELEMENT1 = max_per_week_g1.length - 1;
            const ELEMENT2 = max_per_week_g2.length - 1;

            var margin = { top: 50, right: 100, bottom: 80, left: 50 },
                width = Math.min((window.innerWidth / 2 * 0.95), (window.innerHeight * 0.95)) - 100,
                height = Math.min((window.innerWidth / 2 * 0.95), (window.innerHeight * 0.95)) - 120,
                w = width - margin.left - margin.right,
                h = height - margin.top - margin.bottom;

            var svg_g1 = d3.select("#div_week_p" + index + l)
                .append("svg")
                .attr('id', 'week_p' + index + l)
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var svg_g2 = d3.select("#div_week_p" + index + r)
                .append("svg")
                .attr('id', 'week_p' + index + r)
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var y = d3.scaleLinear()
                .domain([0, Math.max(d3.max(max_per_week_g1), d3.max(max_per_week_g2))])

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
                    .attr("y", -40)
                    .attr("x", -((h - margin.left) / 2))
                    .style('font-size', '13px')
                    .attr("text-anchor", "end")
                    .text('Frequency')
                )

            var line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.freq));

            svg_g1.append("g")
                .call(xAxis);
            svg_g1.append("g")
                .call(yAxis);
            svg_g2.append("g")
                .call(xAxis);
            svg_g2.append("g")
                .call(yAxis);


            //---------------------------------------SETUP DONE-----------------------------------------------------------------
            svg_g1.append("text")
                .attr('x', w / 2).attr('y', h + margin.top)
                .attr("text-anchor", "middle")
                .style("font-size", "13px")
                .text("Frequency of Use per Day  and per Week of Group " + 1 + " for " + name);
            svg_g2.append("text")
                .attr('x', w / 2).attr('y', h + margin.top)
                .attr("text-anchor", "middle")
                .style("font-size", "13px")
                .text("Frequency of Use per Day  and per Week of Group " + 2 + " for " + name);


            var s_g1 = keys_g1.length - 1;
            var s_g2 = keys_g2.length - 1;

            var index_g1 = 0;
            var index_g2 = 0;
            // console.log(data_g1)

            for (index_g1 in data_g1) {
                //draw each line
                var color_line = (data_g1[index_g1].key == 'avg') ? 'black' : d3.interpolatePuBuGn(keys_g1.map(x => x.key).indexOf(data_g1[index_g1].key) / (ELEMENT1 - 1) * 0.5 + 0.5); // myColorS(d);
                drawline_week_profile_comp(svg_g1, line, color_line, data_g1[index_g1].key, data_g1[index_g1].values, x, y, name, l)
            }
            for (index_g2 in data_g2) {
                //draw each line
                var color_line = (data_g2[index_g2].key == 'avg') ? 'black' : d3.interpolateYlOrBr(keys_g2.map(x => x.key).indexOf(data_g2[index_g2].key) / (ELEMENT2 - 1) * 0.5 + 0.5); // myColorS(d);
                drawline_week_profile_comp(svg_g2, line, color_line, data_g2[index_g2].key, data_g2[index_g2].values, x, y, name, r)
            }

            //draw the interactive legend on the right of the graph.
            //on click, make corresponding line disappear
            var keys_g1_ = keys_g1.slice();
            var keys_g2_ = keys_g2.slice();

            keys_g1_.pop();
            keys_g2_.pop();

            var prev_max = Math.max(d3.max(max_per_week_g1), d3.max(max_per_week_g2));


            svg_g1.selectAll("myLegend")
                .data(keys_g1_)
                .enter()
                .append('g')
                .append("text")
                .attr('x', w + 20)
                .attr('y', function(d, i) {
                    return h / s_g1 * i + margin.top / 2;
                })
                .text(function(d) { return 'week ' }).style("fill", "black")
                .style("font-size", 13)
                .append("tspan")
                .text(function(d) { return d.key; })
                .style("fill", function(d) { return d3.interpolatePuBuGn(keys_g1_.indexOf(d) / (ELEMENT1 - 1) * 0.5 + 0.5) })
                .style("font-weight", 700)
                .style("font-size", 13)
                .style('cursor', 'pointer')
                .attr("transform", "translate(" + 0 + ", " + (-25) + ")")
                .on("click", function(d, i) {

                        var currentOpacity = d3.selectAll(".line" + d.key + name + l).style("opacity")
                        var currentColor = d3.select(this).style("fill");
                        var currentOpacityCircle = d3.selectAll(".circle" + d.key + name + l).style("opacity")

                        // Change the opacity: from 0 to 1 or from 1 to 0
                        d3.selectAll(".line" + d.key + name + l).transition().style("opacity", currentOpacity == 1 ? 0 : 1)
                        d3.selectAll(".circle" + d.key + name + l).transition().style("opacity", currentOpacityCircle == 1 ? 0 : 1)

                        d3.select(this).style("fill", currentColor == "grey" ? d3.interpolatePuBuGn(keys_g1.indexOf(d) / (ELEMENT1 - 1) * 0.5 + 0.5) : "grey")
                        keys_g1_[i].selected = (keys_g1_[i].selected) ? false : true;

                        // console.log(keys_g1)


                        function reScale() {
                            var newmax = Math.max(max_per_week_g1[ELEMENT1], max_per_week_g2[ELEMENT2]);

                            for (var j = 0; j < keys_g1_.length; j++) {
                                if (!keys_g1_[j].selected) newmax = Math.max(newmax, max_per_week_g1[j])
                            }
                            for (var j = 0; j < keys_g2_.length; j++) {
                                if (!keys_g2_[j].selected) newmax = Math.max(newmax, max_per_week_g2[j])
                            }

                            // console.log('NEWMAX' + newmax)

                            // console.log(data_g1[i].key)

                            y.domain([0, newmax])
                            prev_max = newmax;

                            apply(newmax, i, '_left', data_g1, svg_g1);
                            apply(newmax, -1, '_right', data_g2, svg_g2)
                        }

                        reScale();
                        newavg(svg_g1, keys_g1_, data_g1, name, '_left')


                        svg_g1.selectAll('.wk_yaxis').remove();
                        svg_g1.append('g').call(yAxis);
                        svg_g2.selectAll('.wk_yaxis').remove();
                        svg_g2.append('g').call(yAxis);

                        d3.selectAll(".line" + d.key + name + l).transition().style("opacity", currentOpacity == 1 ? 0 : 1)
                        d3.selectAll(".circle" + d.key + name + l).transition().style("opacity", currentOpacityCircle == 1 ? 0 : 1)

                    }

                ).on('mouseover', function(d) {
                    console.log(d)
                    d3.select('.line' + d.key + name + l).style('stroke', 'red');
                    d3.select('.circlecol' + d.key + name + l).style('fill', 'red');
                    d3.select('.circle' + d.key + name + l).style('stroke', 'red');


                })
                .on('mouseout', function(d) {
                    console.log(d)
                    c = d3.interpolatePuBuGn(keys_g1.indexOf(d) / (ELEMENT1 - 1) * 0.5 + 0.5);
                    d3.select('.line' + d.key + name + l).style('stroke', c);
                    d3.select('.circlecol' + d.key + name + l).style('fill', c);
                    d3.select('.circle' + d.key + name + l).style('stroke', c);


                });;

            svg_g2.selectAll("myLegend")
                .data(keys_g2_)
                .enter()
                .append('g')
                .append("text")
                .attr('x', w + 20)
                .attr('y', function(d, i) {
                    return h / s_g2 * i + margin.top / 2;
                })
                .text(function(d) { return 'week ' }).style("fill", "black")
                .style("font-size", 13)
                .append("tspan")
                .text(function(d) { return d.key; })
                .style("fill", function(d) { return d3.interpolateYlOrBr(keys_g2.indexOf(d) / (ELEMENT2 - 1) * 0.5 + 0.5) })
                .style("font-weight", 700)
                .style("font-size", 13)
                .style('cursor', 'pointer')
                .attr("transform", "translate(" + 0 + ", " + (-25) + ")")
                .on("click", function(d, i) {
                        var currentOpacity = d3.selectAll(".line" + d.key + name + r).style("opacity")
                        var currentColor = d3.select(this).style("fill");
                        var currentOpacityCircle = d3.selectAll(".circle" + d.key + name + r).style("opacity")

                        // Change the opacity: from 0 to 1 or from 1 to 0
                        d3.selectAll(".line" + d.key + name + r).transition().style("opacity", currentOpacity == 1 ? 0 : 1)
                        d3.selectAll(".circle" + d.key + name + r).transition().style("opacity", currentOpacityCircle == 1 ? 0 : 1)

                        d3.select(this).style("fill", currentColor == "grey" ? d3.interpolateYlOrBr(keys_g2.indexOf(d) / (ELEMENT2 - 1) * 0.5 + 0.5) : "grey")
                        keys_g2_[i].selected = (keys_g2_[i].selected) ? false : true;

                        console.log(keys_g1)


                        function reScale() {
                            var newmax = Math.max(max_per_week_g1[ELEMENT1], max_per_week_g2[ELEMENT2]);

                            for (var j = 0; j < keys_g1_.length; j++) {
                                if (!keys_g1_[j].selected) newmax = Math.max(newmax, max_per_week_g1[j])
                            }
                            for (var j = 0; j < keys_g2_.length; j++) {
                                if (!keys_g2_[j].selected) newmax = Math.max(newmax, max_per_week_g2[j])
                            }

                            console.log('NEWMAX' + newmax)

                            console.log(data_g2[i].key)

                            y.domain([0, newmax])
                            prev_max = newmax;

                            apply(newmax, -1, '_left', data_g1, svg_g1);
                            apply(newmax, i, '_right', data_g2, svg_g2)

                        }


                        reScale();
                        newavg(svg_g2, keys_g2_, data_g2, name, '_right')


                        svg_g1.selectAll('.wk_yaxis').remove();
                        svg_g1.append('g').call(yAxis);
                        svg_g2.selectAll('.wk_yaxis').remove();
                        svg_g2.append('g').call(yAxis);

                        d3.selectAll(".line" + d.key + name + r).transition().style("opacity", currentOpacity == 1 ? 0 : 1)
                        d3.selectAll(".circle" + d.key + name + r).transition().style("opacity", currentOpacityCircle == 1 ? 0 : 1)

                    }



                ).on('mouseover', function(d) {
                    console.log(d)
                    d3.select('.line' + d.key + name + r).style('stroke', 'red');
                    d3.select('.circlecol' + d.key + name + r).style('fill', 'red');
                    d3.select('.circle' + d.key + name + r).style('stroke', 'red');


                })
                .on('mouseout', function(d) {
                    console.log(d)
                    c = d3.interpolateYlOrBr(keys_g2.indexOf(d) / (ELEMENT2 - 1) * 0.5 + 0.5);
                    d3.select('.line' + d.key + name + r).style('stroke', c);
                    d3.select('.circlecol' + d.key + name + r).style('fill', c);
                    d3.select('.circle' + d.key + name + r).style('stroke', c);


                });;

            function newavg(svg, k, data, name, side) {
                console.log('newavg')

                d3.selectAll(".line" + 'newavg' + name + side).remove();
                d3.selectAll(".circle" + 'newavg' + name + side).remove();
                var new_avg = {
                    key: 'newavg',
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
                var c = 0;
                for (var ll = 0; ll < k.length; ll++) {
                    if (!k[ll].selected) {
                        c++;
                        for (var j = 0; j < 7; j++) {
                            new_avg.values[j].freq += data[ll].values[j].freq
                        }
                    }
                }
                for (var j = 0; j < 7; j++) {
                    new_avg.values[j].freq = new_avg.values[j].freq / c;
                }

                console.log(data)
                console.log(k)
                console.log(new_avg.values)


                drawline_week_profile_comp(svg, line, 'darkgrey', 'newavg', new_avg.values, x, y, name, side);


            }

            function apply(newm, i, side, dat, svg) {
                y.domain([0, newm]);
                console.log(dat)

                if (i != -1) {
                    svg.selectAll(".line" + dat[i].key + name + side)
                        .attr("d", line(dat[i].values));

                    svg.selectAll(".circle" + dat[i].key + name + side)
                        .attr("cy", d => y.domain([0, newm])(d.freq))
                }

                for (dd in dat) {
                    if (dd != i) {
                        svg.selectAll(".line" + dat[dd].key + name + side).transition()
                            .duration(500)
                            .attr("d", line(dat[dd].values));

                        svg.selectAll(".circle" + dat[dd].key + name + side).transition()
                            .duration(500)
                            .attr("cy", d => y(d.freq))
                    }
                }
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
function drawline_week_profile_comp(svg, line, color_line, week, data, x, y, name, side) {


    //  var l_linelength = length(line(data));

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-30, 0])
        .html(function(d) {
            f = d.freq.toFixed(2);
            return (week == 'avg') ? ('weekly average' + '<br> freq: ' + f) : ("week: " + week + '<br> freq: ' + d.freq);
        })
    svg.call(tip);
    var off = x('Tue') / 2;
    //the line
    stroke_w = (week == 'avg' || week == 'newavg') ? 3 : 1;
    // console.log(data)   
    r_dot = (week == 'avg' || week == 'newavg') ? 4 : 3;


    svg.append("path")
        .attr("class", "line" + week + name + side)
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
        .attr("class", "circlecol" + week + name + side)
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "circle" + week + name + side)
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.freq))
        .attr("r", r_dot)
        .attr("opacity", 1)
        .attr('transform', 'translate(' + off + ',0)')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // label = svg.append("g")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 10)
    //     .selectAll("g")
    //     .data(data)
    //     .join("g")
    //     .attr("class", "text" + week + name + side)
    //     .attr("transform", d => 'translate(' + (off + x(d.date)) + ',' + y(d.freq) + ')');

    // label.append("text")
    //     .each(function(d) {
    //         d3.select(this).attr("text-anchor", "middle").attr("dx", "-1.4em");
    //     })



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