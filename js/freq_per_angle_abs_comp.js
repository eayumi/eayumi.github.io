//bar chart_ freq X angle position per Drehelement
//RED bars = minus values
//BLACK bars = zero angle

/**
 * Draws the Frequency distribution bar chart per angle for every element, for the data pre-filtered in filter_data_comp.js
 * @param {*} data_g1 
 * @param {*} data_g2 
 */
function freqDistr_abs_comp(data_g1, data_g2) {
    var element = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
    var names = ['Rotatable Wall', 'Rotatable Closet', 'Lamp B', 'Lamp A'];


    // set the dimensions and margins of the graph
    var margin = { top: 100, right: 90, bottom: 100, left: 70 },
        width = window.innerWidth * 0.5;
    var height = width * 0.7,
        w = width - margin.left - margin.right,
        h = height - margin.top - margin.bottom;

    //draw bar charts for each group and each element
    for (var i = 0; i < 4; i++) {
        draw_histo(i, '_left', data_g1, 0);
        draw_histo(i, '_right', data_g2, 1);

    }


    /**
     * Draws the bar chart of the given element and group, showing frequency of rotation TO a specific angle, for the given data
     * 
     * @param {int} index the index of the element
     * @param {string} side used for id
     * @param {} data 
     * @param {int} g group
     */
    function draw_histo(index, side, data, g) {
        var maxrange = [238, 187, 158, 321]


        //map data to 'to' angle, rounded and nest per angle
        var data_nest = d3.nest().key(function(d) {
            to = Math.round(d.To);
            return to
        }).entries(data.filter(x => x.Sensorname == element[index]));

        var data_ready = data_nest.map(d => d.values = { "angle": d.key, "freq": d.values.length });

        data_ready.sort(function(x, y) {
            return d3.ascending(parseInt(x.angle), parseInt(y.angle));
        });

        var minang = data_ready[0].angle;
        var maxang = data_ready[data_ready.length - 1].angle;

        var j = 0;

        //padding: insert angles that are missing with freq 0
        for (var i = minang; i < maxang; i++) {
            if (j < data_ready.length && !(data_ready[j].angle == i)) {

                data_ready.push({ "angle": i, "freq": 0 });
            } else if (j == data_ready.length) {

                data_ready.push({ "angle": i, "freq": 0 });

            } else {
                j++;
            }
        }

        data_ready.sort(function(x, y) {
            return d3.ascending(parseInt(x.angle), parseInt(y.angle));
        });


        var svg = d3.selectAll("#freq_per_ang_abs_" + index + side)
            .append("svg")
            .attr('id', 'freq_per_angle_svgs_comp')
            .attr("height", height)
            .attr("width", width)
            .append('g')
            .attr("transform", "translate(" + 0 + "," + margin.top + ")");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .style('font-size', '12px')
            .html(function(d, i) { return 'freq: ' + d.freq + '<br>' + 'angle: ' + d.angle });

        svg.call(tip);

        //scales

        var x = d3.scaleBand().range([0, w]);
        var y = d3.scaleLinear().range([h, 0]);

        data_ready = data_ready.slice(1) //.slice(0, data_ready.length - 1)

        x.domain(data_ready.map(function(d) { return d.angle; }))
        var max = d3.max(data_ready, function(d) { return +d.freq; });

        y.domain([0, max]).ticks(20);


        var off = (10 + minang % 10) % 10;

        //add the x axis
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0' + margin.left + ',' + (h) + ')')
            .call(d3.axisBottom(x).tickValues(d3.range(0, maxang, 25))) //.tickFormat(d => (((10 + d % 10) % 10) == off) ? d : ''))

        //lable for x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (h + margin.top / 2 - 10) + ")")
            .style("text-anchor", "middle")
            .attr('font-size', '12px') //12
            .text("Angle");

        //add the y axis
        svg.append("g")
            .attr("class", "axis")
            .attr('transform', 'translate(0' + margin.left + ', 0)')
            .call(d3.axisLeft(y));

        //lable for y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x", (margin.bottom * 2 - h * 1.3))
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .attr('font-size', '12px') //12
            .text("Frequency");

        //the bars
        svg.selectAll("bar")
            .data(data_ready)
            .enter()
            .append("rect")
            .attr("class", "bar2")
            .attr('transform', 'translate(0' + margin.left + ', 0)')
            .attr("height", function(d) { return h - y(d.freq); })
            .attr("width", x.bandwidth())
            .attr("x", function(d, i) {
                return i * (w) / data_ready.length
            })
            .attr("y", function(d) { return y(d.freq); })
            .attr("fill", function(d) {
                if (d.angle < 0 || d.angle > maxrange[index]) { //indicates anlges outside the elements rotation range
                    return 'crimson';
                } else {
                    return group_color[g];
                }
            }).on('mouseover', tip.show)
            .on('mouseout', tip.hide);


        //adding title
        svg.append("text")
            .attr('x', width / 2).attr('y', h + margin.top - 30)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .text("Frequency of Use per Angle for of Group " + (1 + g) + ' for ' + names[index])
            .style("font-size", "13px")
            .style('font-style', 'normal');



    }

}
/**
 * Draws the Frequency distribution bar chart per rotation size for every element, for the data pre-filtered in filter_data_comp.js
 * @param {*} data_g1 
 * @param {*} data_g2 
 */
function freqDistr_rot_comp(data_g1, data_g2) {
    var element = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
    var maxrange = [237, 186, 157, 320];

    // set the dimensions and margins of the graph
    var margin = { top: 100, right: 90, bottom: 100, left: 70 },
        width = window.innerWidth * 0.5,
        height = width * 0.7,
        w = width - margin.left - margin.right,
        h = height - margin.top - margin.bottom;

    for (var i = 0; i < 4; i++) {
        draw_histo(i, '_left', data_g1, 0);
        draw_histo(i, '_right', data_g2, 1);

    }

    /**
     * Draws the bar chart, showing frequency of position changes by a specific angle, for the given data
     * 
     * @param {int} index 
     */
    function draw_histo(index, side, data, g) {
        var names = ['Rotatable Wall', 'Rotatable Closet', 'Lamp B', 'Lamp A'];


        //staple all values that lie outside the pre-defined range

        //DO PLOT ON 'TO' DATA
        var data_nest = d3.nest().key(function(d) {
            to = Math.round(d.Total);
            return to
        }).entries(data.filter(x => x.Sensorname == element[index]));

        var data_ready = data_nest.map(d => d.values = { "angle": d.key, "freq": d.values.length });

        //consle.log(data_nest)
        data_ready.sort(function(x, y) {
            return d3.ascending(parseInt(x.angle), parseInt(y.angle));
        });

        var minang = data_ready[0].angle;
        var maxang = data_ready[data_ready.length - 1].angle;

        //consle.log(minang + ' ' + maxang)

        var j = 0;

        //padding
        for (var i = minang; i < maxang; i++) {
            if (j < data_ready.length && !(data_ready[j].angle == i)) {

                data_ready.push({ "angle": i, "freq": 0 });
            } else if (j == data_ready.length) {

                data_ready.push({ "angle": i, "freq": 0 });

            } else {
                j++;
            }
        }

        data_ready.sort(function(x, y) {
            return d3.ascending(parseInt(x.angle), parseInt(y.angle));
        });

        console.log("#Rfreq_per_ang_" + index + side)
        console.log(data_ready)
        var svg = d3.selectAll("#Rfreq_per_ang_abs_" + index + side)
            .append("svg")
            .attr('id', 'Rfreq_per_angle_svgs_comp')
            .attr("height", height)
            .attr("width", width)
            .append('g')
            .attr("transform", "translate(" + 0 + "," + margin.top + ")");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .style('font-size', '12px')
            .html(function(d, i) { return 'freq: ' + d.freq + '<br>' + 'angle: ' + d.angle });

        svg.call(tip);

        var x = d3.scaleBand().range([0, w]);
        var y = d3.scaleLinear().range([h, 0]);

        data_ready = data_ready.slice(1) //.slice(0, data_ready.length - 1)

        x.domain(data_ready.map(function(d) { return d.angle; }))
        var max = d3.max(data_ready, function(d) { return +d.freq; });

        y.domain([0, max]).ticks(20);


        var off = (10 + minang % 10) % 10;
        //add the x axis
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (h) + ')')
            .call(d3.axisBottom(x).tickValues(d3.range(0, maxang, 25))) //.tickFormat(d => (((10 + d % 10) % 10) == off) ? d : ''))

        //lable for x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (h + margin.top / 2 - 10) + ")")
            .style("text-anchor", "middle")
            .attr('font-size', '12px')
            .text("Angle");

        //add the y axis
        svg.append("g")
            .attr("class", "axis")
            .attr('transform', 'translate(0' + margin.left + ', 0)')
            .call(d3.axisLeft(y));

        //lable for y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x", (margin.bottom * 2 - h * 1.3))
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .attr('font-size', '13px')
            .text("Frequency");

        //the bars
        svg.selectAll("bar")
            .data(data_ready)
            .enter()
            .append("rect")
            .attr("class", "bar2")
            .attr('transform', 'translate(0' + margin.left + ', 0)')
            .attr("height", function(d) { return h - y(d.freq); })
            .attr("width", x.bandwidth())
            .attr("x", function(d, i) {
                return i * (w) / data_ready.length
            })
            .attr("y", function(d) { return y(d.freq); })
            .attr("fill", function(d) {
                if (d.angle < 0 || d.angle > maxrange[index]) {
                    return 'crimson';
                    // } else if (d.angle == 0) {
                    //     return "black";

                } else {
                    return group_color[g];
                }
            }).on('mouseover', tip.show)
            .on('mouseout', tip.hide);


        //adding title
        svg.append("text")
            .attr('x', width / 2).attr('y', h + margin.top - 30)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .text("Frequency of Size of Rotations per Angle of Group" + +(1 + g) + ' for ' + names[index])
            .style("font-size", "13px")
            .style('font-style', 'normal');



    }

}