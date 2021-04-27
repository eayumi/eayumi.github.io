function cleaveland() {
    datafile = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];

    for (var i = 0; i < 4; i++) {
        cdot(datafile[i]);
    }
}

function cdot(datafile) {

    var graph = d3.json('../data/data.json').then(function(data) {
        var weekday = d3.timeFormat("%Y-%m-%d");
        data = data.filter(d => d.Sensorname == datafile);

        var nest_days = d3.nest()
            .key(function(d) {
                return weekday(new Date(d.Timestamp));
            }).entries(data);

        var data_r = nest_days.map(function(d) {
            return {
                "date": weekday(new Date(d.key)),
                'max': +Math.max.apply(Math, d.values.map(function(o) { return Math.max(o.Value1, o.Value2); })),
                'min': +Math.min.apply(Math, d.values.map(function(o) { return Math.min(o.Value1, o.Value2); }))

            }
        });
        var first = new Date(data_r[0].date);
        var last = new Date(data_r[data_r.length - 1].date);

        var data_ready = [];
        var i = 0;
        for (var d = first; d.getTime() <= last.getTime(); d.setDate(d.getDate() + 1)) {
            datestr = dateToYMD(d); //dateToYMD is a helper function I declared that formats a date

            if (data_r.filter(x => x.date === datestr).length > 0) {
                //this date exists in your data, copy it
                data_ready.push(data_r[i]);
                i++;
            } else {
                //this date does not exist, create a default
                data_ready.push(createDefault(datestr));
            }
        }
        data_ready.push(data_r[data_r.length - 1]);


        // set the dimensions and margins of the graph
        var margin = { top: 50, right: 50, bottom: 100, left: 100 },
            width = 700,
            height = data_ready.length * 10,
            w = width - margin.left - margin.right,
            h = height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(".scatter" + datafile)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var max_max = d3.max(data_ready, d => d.max) + 5;
        var min_min = d3.min(data_ready, d => d.min) - 5;
        // Add X axis
        var x = d3.scaleLinear()
            .domain([min_min, max_max])
            .range([0, w]);
        svg.append("g")
            .attr("transform", "translate(0," + h + ")")
            .call(d3.axisBottom(x).ticks(w / 50))

        // Y axis
        var y = d3.scaleBand()
            .range([0, h])
            .domain(data_ready
                .map(function(d) {
                    return d.date
                })).padding(1);


        svg.append("g")
            .attr('class', 'axis')
            .call(d3.axisLeft(y).ticks(20))
            .style('font-size', '8px');

        // Lines
        svg.selectAll("myline")
            .data(data_ready)
            .enter()
            .append("line")
            .attr("x1", function(d) { return x(d.min); })
            .attr("x2", function(d) { return x(d.max); })
            .attr("y1", function(d) { return y(d.date); })
            .attr("y2", function(d) { return y(d.date); })
            .attr("stroke", "grey")
            .attr("stroke-width", "1px")

        // Circles of variable 1
        svg.selectAll("mycircle")
            .data(data_ready)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.min); })
            .attr("cy", function(d) { return y(d.date); })
            .attr("r", "3")
            .style("fill", function(d) { if (d.min == 0 && d.max == 0) { return "darkgrey" } else if (d.min < 0) { return "crimson" } else { return "#69b3a2" } })

        // Circles of variable 2
        svg.selectAll("mycircle")
            .data(data_ready)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.max); })
            .attr("cy", function(d) { return y(d.date); })
            .attr("r", "3")
            .style("fill", function(d) {
                if (d.min == 0 && d.max == 0) {
                    return "darkgrey"
                } else if (datafile == 'Drehwand' && d.max > 237) {
                    return "crimson"
                } else if (datafile == 'Drehschrank' && d.max > 186) {
                    return "crimson"

                } else if (datafile == 'LampeAussenwand' && d.max > 157) {
                    return "crimson"

                } else if (datafile == 'LampeDrehwand' && d.may > 320) {
                    return "crimson"

                } else {
                    return "#4C4082"
                }
            });
        svg.append("text")
            .attr('x', w / 2)
            .attr('y', h + margin.top + 0)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .text("Daily Movement Range of " + datafile);


        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(10)
        }


        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-w)
                .tickFormat("")
            );

    })

}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

function createDefault(date) {
    return {
        'date': date,
        'min': 0,
        'max': 0
    };
}