var element = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
var markers = [
    [80, 130, 180, 200],
    [0, 90, 180],
    [105, 140],
    [0, 100, 265, 310]
];
var dropdown;
var delta = 0;

function timeshift() {

    dropdown = d3.select('#element').append('select');
    dropdown.selectAll('myOptions')
        .data(['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'])
        .enter()
        .append('option')
        .text(d => d)
        .attr('value', function(d, i) { return i });
    dropdown.style("height", '22.5').style('font-size', '14px');

    cdot(element[0], markers[0])

}

function cdot(datafile, marker) {

    var graph = d3.json('../data/data_processed_elements.json').then(function(data) {
        data = data.filter(d => d.Sensorname == datafile)
        var day = d3.timeFormat("%Y-%m-%d");
        var daycol = d3.timeFormat("%H:%M:%S");


        // set the dimensions and margins of the graph


        var shift_dates = [day(new Date("2019-11-15")), day(new Date("2019-11-30"))];
        var dates = [day(new Date("2019-10-01")), day(new Date(data[data.length - 1].Timestamp))];
        //var dates = [day(new Date("2019-11-13")), day(new Date("2020-01-07"))];

        var out = ['37', '40', '43', '49', '50', '51', '52', '01', '03', '04', '05'];
        data = data.filter(x => in_dates(x.Timestamp))

        function in_dates(date) {
            date = day(new Date(date))

            if (date > dates[0] && date < dates[1]) {

                return true;
            } else {
                return false;
            }
        }

        function in_shift(date) {
            var k = date;
            date = day(new Date(date))
            var shift_d = new Date('2019-11-15 11:19:03.473');
            var shift_q = new Date('2020-01-06 17:01:06.559');


            if (date < shift_dates[0] || (new Date(k) > shift_q)) {
                return false;
            } else {
                if ((new Date(k) < shift_d)) {
                    return false;
                }
                if ((new Date(k) > shift_q)) {
                    return false;
                }

                return true;
            }
        }

        //var offset = 108;
        var offset = 0;

        data.map(function(x) {
            // if (in_shift(x.Timestamp)) {
            //     x.To += offset;
            //     x.From += offset;
            // }
            x.Time = x.Timestamp;
            x.Timestamp = d3.timeFormat("week %V %Y-%m-%d, %a %H:%M:%S")(new Date(x.Timestamp));

        });
        var margin = { top: 50, right: 50, bottom: 100, left: 100 },
            width = window.innerWidth * 0.8,
            //height = 3000,
            height = 6.5 * data.length,
            w = width - margin.left - margin.right,
            h = height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(".scatter" + datafile)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "the_SVG_ID")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var max_max = d3.max(data, d => Math.max(d.To, d.From)) + 5;
        var min_min = d3.min(data, d => Math.min(d.To, d.From)) - 5;
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
            .domain(data
                .map(function(d) {
                    return d.Timestamp
                })).padding(1);


        svg.append("g")
            .attr('class', 'axis')
            .call(d3.axisLeft(y).ticks(20))
            .style('font-size', '5px');

        // add the Y gridlines
        svg.selectAll("myline")
            .data(data)
            .enter().append("line")
            .attr('x1', 0)
            .attr("y1", d => y(d.Timestamp))
            .attr("x2", width - margin.left - margin.right) //<<== and here
            .attr("y2", d => y(d.Timestamp))
            .style("stroke-width", 0.5)
            .style("stroke", function(d) {
                var col = daycol(new Date(d.Time));
                if (('00:00:00') <= col && col < ('06:00:00')) {
                    return 'navy' //'rgb(9, 9, 56)';
                } else if (col >= '06:00:00' && col < '12:00:00') {
                    return 'rgb(248, 165, 57)' //'rgb(250, 209, 133)'
                } else if (col >= '12:00:00' && col < '18:00:00') {
                    return 'rgb(72, 161, 50)' //'rgb(238, 126, 62)';
                } else {
                    return 'rgb(108, 9, 133)' //'rgba(15, 75, 124, 0.863)'
                }
            })

        .style("fill", "none");

        // add the X gridline markers
        svg.selectAll("myline")
            .data(marker)
            .enter().append("line")
            .attr("id", "grid")
            .attr('x1', d => x(d))
            .attr("y1", 0)
            .attr("x2", d => x(d)) //<<== and here
            .attr("y2", height - margin.top - margin.bottom)
            .style("stroke-width", 0.5)
            .style("stroke", "darkgrey")
            .style("fill", "none");


        // Lines
        svg.selectAll("myline")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", function(d) { return x(d.From); })
            .attr("x2", function(d) { return x(d.To); })
            .attr("y1", function(d) { return y(d.Timestamp); })
            .attr("y2", function(d) { return y(d.Timestamp); })
            .attr("stroke", "black")
            .attr("stroke-width", "0.5px");


        var week = d3.timeFormat('%V')
            // Circles of variable 1


        var arc = d3.symbol().type(d3.symbolTriangle).size(10);
        svg.selectAll('mytrig')
            .data(data)
            .enter()
            .append('path')
            .attr('d', arc)
            .style('fill', function(d, i) {
                if (i < data.length - 1) {
                    if (Math.abs(data[i].To - data[i + 1].From) > delta) {
                        return 'red'
                    }
                }
                if (in_shift(d.Timestamp)) {
                    return 'blue'
                }
                if (out.includes(week(new Date(d.Timestamp)))) {
                    return 'grey'
                }

                return 'green'
            })
            .attr('stroke', 'none')
            .attr('transform', function(d) {
                if (d.To < d.From) {
                    return "translate(" + x(d.To) + ',' + y(d.Timestamp) + ") rotate(30)";
                }
                return "translate(" + x(d.To) + ',' + y(d.Timestamp) + ") rotate(210)";

            });


        svg.selectAll("mycircle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.From); })
            .attr("cy", function(d) { return y(d.Timestamp); })
            .attr("r", "2")
            .style('fill', function(d, i) {
                if (i > 0) {
                    if (Math.abs(data[i].From - data[i - 1].To) > delta) {
                        return 'red'
                    }
                }
                if (in_shift(d.Timestamp)) {


                    return 'blue'
                }
                if (out.includes(week(new Date(d.Timestamp)))) {
                    return 'grey'
                }

                return 'green'

            })

        svg.append("text")
            .attr('x', w / 2)
            .attr('y', h + margin.top + 0)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .text("Daily Movement Range of " + datafile);

        for (var i = 0; i < marker.length; i++) {
            d = marker[i];
            svg.append("text")
                .attr('x', x(d))
                .attr('id', 'grid')
                .attr('y', margin.top - 55)
                .attr("text-anchor", "middle")
                .style("font-size", "8px")
                .text(d);
        }

        var count_shift = 0;
        var max_abs = 0;
        var min_abs = 10;
        var max = 0;
        var min = 0;
        var count_shift_neg = 0;
        var totalshift = 0;
        for (i = 0; i < data.length - 1; i++) {
            if (Math.abs(data[i].To - data[i + 1].From) > delta) {
                count_shift++;
                t = (data[i].To - data[i + 1].From);
                if (t < 0) count_shift_neg++;

                max = Math.max(max, t);
                min = Math.min(min, t);
                t = Math.abs(t);
                max_abs = Math.max(max_abs, t);
                min_abs = Math.min(min_abs, t);
            }
            if (Math.abs(data[i].To != data[i + 1].From)) totalshift++;
        }

        document.getElementById('pAnalyse').innerHTML = "The number of mismatched movements given delta is " + count_shift + ", out of " + totalshift + " if delta = 0.\n The " +
            "number of mismatched movements where the next From value is shifted by a negative constant is " + count_shift_neg + ".\n The " +
            "number of mismatched movements where the next From value is shifted by a positive constant is " + (count_shift - count_shift_neg) +
            ".\nThe minimal absolute amount by which a movement is mismatched is " + min_abs.toFixed(2) + ".\n" +
            "The maximal absolute amount by which a movement is mismatched is " + max_abs +
            ".\nThe minimal  amount by which a movement is mismatched is " + min.toFixed(2) + ".\n" +
            "The maximal  amount by which a movement is mismatched is " + max + "."

        dropdown.on('change', function(d) {
            selectedSensor = d3.select(this).property('value');
            if (selectedSensor == 4) {
                d3.select("#the_SVG_ID").remove();

            } else {
                d3.select("#the_SVG_ID").remove();
                cdot(element[selectedSensor], markers[selectedSensor]);

            }

        });
        document.getElementById("inputDelta").addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                delta = this.value;
                d3.select("#the_SVG_ID").remove();
                document.getElementById('pAnalyse').innerHTML = null;
                cdot(datafile, marker);

            }
        });

        document.getElementById("inputAdd").addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                add = parseInt(this.value);
                if (!marker.includes(add)) marker.push(add);
                svg.selectAll("myline")
                    .data([add])
                    .enter().append("line")
                    .attr('id', 'gridL')
                    .attr('x1', d => x(d))
                    .attr("y1", 0)
                    .attr("x2", d => x(d)) //<<== and here
                    .attr("y2", height - margin.top - margin.bottom)
                    .style("stroke-width", 0.5)
                    .style("stroke", "darkgrey")
                    .style("fill", "none");

                svg.append("text")
                    .attr('id', 'grid')
                    .attr('x', x(add))
                    .attr('y', margin.top - 55)
                    .attr("text-anchor", "middle")
                    .style("font-size", "8px")
                    .text(add);
            }
        });
        document.getElementById("inputRemv").addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {

                // Cancel the default action, if needed
                event.preventDefault();
                remv = parseInt(this.value);

                var newmarker = [];
                if (marker.includes(remv)) {

                    for (var i = 0; i < marker.length; i++) {
                        if (marker[i] != remv) {
                            newmarker.push(marker[i]);
                        }
                    }
                    marker = newmarker;
                    console.log(marker)
                    svg.selectAll("#gridL").remove();
                    svg.selectAll("#grid").remove();

                    svg.selectAll("myline")
                        .data(marker)
                        .enter().append("line")
                        .attr('id', 'gridL')
                        .attr('x1', d => x(d))
                        .attr("y1", 0)
                        .attr("x2", d => x(d)) //<<== and here
                        .attr("y2", height - margin.top - margin.bottom)
                        .style("stroke-width", 0.5)
                        .style("stroke", "darkgrey")
                        .style("fill", "none");

                    for (var i = 0; i < marker.length; i++) {
                        d = marker[i];
                        svg.append("text")
                            .attr('x', x(d))
                            .attr('id', 'grid')
                            .attr('y', margin.top - 55)
                            .attr("text-anchor", "middle")
                            .style("font-size", "8px")
                            .text(d);
                    }
                }
            }
        });

    });

}