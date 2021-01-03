/**
 * Draws the Frequency distribution bar chart per rotation size for every element, for the data pre-filtered in filter_data.js
 * @param {*} data
 */
function freq_per_angle_abs(data) {
    var elements = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 90, bottom: 100, left: 90 },
        width = window.innerWidth * 0.7;
    var height = window.innerHeight * 0.7,
        w = width - margin.left - margin.right,
        h = height - margin.top - margin.bottom;

    for (var i = 0; i < 4; i++) {
        drawHisto_freq_per_abs(i);
    }
    /**
     * Draws the bar chart, showing frequency of position changes by a specific angle, for the given data
     * 
     * @param {int} index 
     */
    function drawHisto_freq_per_abs(index) {


        //DO PLOT ON 'TO' DATA
        var data_nest = d3.nest().key(function(d) { return Math.round(d.Total) }).entries(data.filter(d => d.Sensorname == elements[index]));
        var data_ready = data_nest.map(d => d.values = { "angle": d.key, "freq": d.values.length });
        data_ready.slice(1, 1)

        //consle.log(data_ready)

        data_ready.sort(function(x, y) {
            return d3.ascending(parseInt(x.angle), parseInt(y.angle));
        });

        var minang = data_ready[0].angle;
        var maxang = data_ready[data_ready.length - 1].angle;
        var j = 0;

        //padding
        for (var i = minang; i < maxang; i++) {
            if (j < data_ready.length && (data_ready[j].angle != i)) {
                data_ready.push({ "angle": "" + i, "freq": 0 });
            } else {
                j++;
            }
        }
        //consle.log(data_ready);

        data_ready.sort(function(x, y) {
            return d3.ascending(parseInt(x.angle), parseInt(y.angle));
        });

        draw_charts(true, width, height, margin, '#freq_per_ang_abs_', 20, "Frequency " + elements[index] + " is Rotated by Given Amount in degrees ");


        ih = window.innerHeight / 2 * 0.8;
        //consle.log(ih)
        ih = (ih - 100 < 0) ? 200 : ih;
        draw_charts(false, width / 2, ih, { top: 40, right: 90, bottom: 50, left: 90 }, '#freq_per_ang_abs_tog_', 0, elements[index]);


        function draw_charts(draw, width, height, margin, name, ticks, title) {

            var w = width - margin.left - margin.right,
                h = height - margin.top - margin.bottom;

            var svg = d3.selectAll(name + index)
                .append("svg")
                .attr('id', 'freq_per_angle')
                .attr("height", height)
                .attr("width", width)
                .append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .style('font-size', '12px')
                .html(function(d) { return 'freq: ' + d.freq + '<br>' + 'deg: ' + d.angle });

            svg.call(tip);

            var x = d3.scaleBand().range([0, w]).padding(0.1);
            var y = d3.scaleLinear().range([h, 0]);


            x.domain(data_ready.map(function(d) { return d.angle; }));

            var max = d3.max(data_ready, function(d) { return +d.freq; });
            y.domain([0, max]).ticks(ticks);


            //lable for x axis
            if (draw) {

                //add the x axis
                svg.append('g')
                    .attr('class', 'axis')
                    .attr('transform', 'translate(0' + margin.left + ',' + (h) + ')')
                    .call(d3.axisBottom(x))

                svg.selectAll(".tick text")
                    .each(function(d, i) {
                        if (d % 10 !== 0) d3.select(this).remove();
                    });

                svg.append("text")
                    .attr("transform",
                        "translate(" + (width / 2) + " ," +
                        (h + margin.bottom / 2) + ")")
                    .style("text-anchor", "middle")
                    .style('font-size', '30px')
                    .text("Angle");
            } else {
                //add the x axis
                svg.append('g')
                    .attr('class', 'axis')
                    .attr('transform', 'translate(0' + margin.left + ',' + (h) + ')')
                    .call(d3.axisBottom(x).tickSize(0));

                svg.selectAll(".tick text")
                    .each(function(d, i) {
                        d3.select(this).remove();
                    });


                svg.append("text")
                    .attr("transform",
                        "translate(" + (width / 2) + " ," +
                        (h + margin.top / 2) + ")")
                    .style("text-anchor", "middle")
                    .style('font-size', '20px')
                    .text(title);

            }

            //add the y axis
            svg.append("g")
                .attr("class", "axis")
                .attr('transform', 'translate(0' + margin.left + ', 0)')
                .call(d3.axisLeft(y));

            //lable for y axis
            if (draw) {
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 25)
                    .attr("x", (margin.bottom) - (height / 2))
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .style('font-size', '30px')
                    .text("Frequency");
            } else {
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", margin.left / 3)
                    .attr("x", (margin.top / 2) - (height / 3))
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .style('font-size', '30px')
                    .text("Frequency");

            }

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
                    return x(d.angle)
                })
                .attr("y", function(d) { return y(d.freq); })
                .attr("fill", function(d) {
                    if (d.angle < 0) {
                        return 'crimson';
                    } else {
                        return 'steelblue';
                    }
                }).on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            //adding title
            if (draw) {
                svg.append("text")
                    .attr('x', width / 2)
                    .attr('y', h + margin.bottom - 12)
                    .attr("text-anchor", "middle")
                    .style("font-size", "16x")
                    .text("Frequency of Size of Rotations per Angle for " + elements[index])
            }

        }

    }
}