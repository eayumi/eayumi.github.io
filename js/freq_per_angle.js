/**
 * Draws the Frequency distribution bar chart per angle for every element, for the data pre-filtered in filter_data.js
 * @param {*} data
 */
function freq_per_angle(data) {
    var element = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
    var maxrange = [237, 186, 157, 320];

    // set the dimensions and margins of the graph
    var margin = { top: 100, right: 90, bottom: 100, left: 70 },
        width = window.innerWidth * 0.7,
        height = window.innerHeight * 0.8,
        w = width - margin.left - margin.right,
        h = height - margin.top - margin.bottom;


    dist(0);
    dist(1);
    dist(2);
    dist(3);

    //consle.log(window.innerWidth)

    /**
     * Draws the bar chart, showing frequency of position changes TO a specific angle, for the given data and element of the given index
     * 
     * @param {int} index the elment
     */
    function dist(index) {
        var maxrange = [238, 187, 158, 321]

        //staple all values that lie outside the pre-defined range

        //DO PLOT ON 'TO' DATA
        var data_nest = d3.nest().key(function(d) {
            to = Math.round(d.To);
            if (to > maxrange[index] + 10) to = maxrange[index] + 10;
            if (to < -10) to = -10;
            return to
        }).entries(data.filter(x => x.Sensorname == element[index]));
        var data_ready = data_nest.map(d => d.values = { "angle": d.key, "freq": d.values.length });

        //consle.log(data_nest)
        data_ready.sort(function(x, y) {
            return d3.ascending(parseInt(x.angle), parseInt(y.angle));
        });

        var minang = data_ready[0].angle;
        var maxang = data_ready[data_ready.length - 1].angle;


        var j = 0;

        //padding: for angles of freq 0 
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


        var svg = d3.selectAll("#freq_per_angle_" + index)
            .append("svg")
            .attr('id', 'freq_per_angle_svgs')
            .attr("height", height)
            .attr("width", width)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .style('font-size', '12px')
            .html(function(d, i) { return 'freq: ' + d.freq + '<br>' + 'angle: ' + d.angle });

        svg.call(tip);

        var x = d3.scaleBand().range([0, w]);
        var y = d3.scaleLinear().range([h, 0]);

        x.domain(data_ready.map(function(d) { return d.angle; }));

        var max = d3.max(data_ready, function(d) { return +d.freq; });

        y.domain([0, max]).ticks(20);


        var off = (10 + minang % 10) % 10;
        //add the x axis
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0' + margin.left + ',' + (h) + ')')
            .call(d3.axisBottom(x).tickFormat(d => (((10 + d % 10) % 10) == off) ? d : ''))

        //lable for x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (h + margin.top / 2 - 10) + ")")
            .style("text-anchor", "middle")
            .attr('font-size', '15px')
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
            .attr("x", (margin.bottom * 2 - h))
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .attr('font-size', '15px')
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
                    return 'crimson'; //indicates bars outside the rotation range of the element
                } else {
                    return 'steelblue';
                }
            }).on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        //adding title
        svg.append("text")
            .attr('x', width / 2).attr('y', h + margin.top - 20)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .text("Frequency of Use per Angle for " + element[index])
            .append('tspan')
            .text('to')
            .style('font-style', 'italic');

    }

}