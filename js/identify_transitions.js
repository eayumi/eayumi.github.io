function enterButton(index) {

    var x = document.getElementById('border' + index).value;
    var y = x.split(',')
    y = y.map(d => parseInt(d))
    console.log(y.length)
    draw_elements(y, index);


    var weeks_single = ["38-19", "39-19", "47-19", "02-20", "06-20", "07-20", "08-20", "10-20", "26-20", "28-20", "30-20", "32-20", "36-20", "38-20", "43-20", "44-20", "49-20", "50-20", "51-20"];
    var weeks_double = ["41-19", "42-19", "44-19", "45-19", "46-19", "48-19", "09-20", "11-20", "19-20", "20-20", "22-20", "24-20", "25-20", "27-20", "29-20", "31-20", "33-20", "34-20", "35-20", "37-20", "39-20", "40-20", "41-20", "42-20", "45-20", "46-20", "47-20", "48-20", "52-20"];

    var group = 0;
    var wkd = 'Mon';

    identify_transitions(0, y, 0, index, true, wkd, weeks_single)
    identify_transitions(0, y, 1, index, true, wkd, weeks_double)
    identify_transitions(1, y, 1, index, true, wkd, weeks_single, weeks_double)


    document.getElementById('wkd_input').addEventListener("change", function(event) {
        wkd = document.getElementById('wkd_input').value;
        identify_transitions(0, y, 0, index, true, wkd, weeks_single)
        identify_transitions(0, y, 1, index, true, wkd, weeks_double)
        identify_transitions(1, y, 1, index, true, wkd, weeks_single, weeks_double)


    });


}


function identify_transitions(design, borders, g, index, timeopt, wkd, weeks, weeks_) {
    d3.json('../data/data_snaps_densityPlot.json').then(function(data_raw) {
        var data_histo1 = [0];
        var data_histo2 = [0];

        for (var k = 0; k < borders.length; k++) {
            data_histo2.push(0);
            data_histo1.push(0);
        }
        var t1 = getTransData(weeks)
        var t2 = [];
        if (design == 1) t2 = getTransData(weeks_)

        function getTransData(w) {
            if (wkd == 0) {
                var data_alt = data_raw.filter(d => d.Element == index && w.includes(d.Week));
            } else {
                var data_alt = data_raw.filter(d => d.Element == index && w.includes(d.Week) && d.Weekday == wkd);
            }
            console.log(data_raw)
            console.log(data_alt)


            var i = 0;
            var cur_zone = 0;
            var transitions = [];
            const last = borders.length;
            var data_ring = [0];
            for (var k = 0; k < borders.length; k++) {
                data_ring.push(0);
            }
            while (i < borders.length) {
                if (data_alt[0].element_ang[index] < borders[i]) {
                    transitions.push({
                        zone: i,
                        numb: 0,
                        start: data_alt[0].Timestamp,
                        duration: 0
                    })
                    cur_zone = i
                    break;
                } else if (i == borders.length - 1) {
                    transitions.push({
                        zone: i,
                        numb: 0,
                        start: data_alt[0].Timestamp,
                        duration: 0

                    })
                    cur_zone = i

                } else {
                    i++

                }
            }

            function return_zone(angle) {
                z = 0;
                while (z < last) {
                    if (angle < borders[z]) {
                        return z;
                    } else {
                        z++
                    }
                }
                return z
            }

            i = 0;
            j = 0;

            while (i < data_alt.length) {
                new_zone = return_zone(data_alt[i].element_ang[index]);
                data_ring[new_zone]++;



                if (new_zone != cur_zone) {
                    transitions.push({
                        zone: new_zone,
                        numb: 0,
                        start: data_alt[i].Timestamp,
                        duration: 0

                    })
                    cur_zone = new_zone;
                    transitions[j].duration = new Date(data_alt[i].Timestamp) - new Date(transitions[j].start)

                    j++

                } else {
                    transitions[j].numb++;
                }
                i++
            }
            return transitions //,data_ring;
        }

        const maxrange = [237, 186, 157, 320];

        var b = borders.slice();
        b.unshift(0)
        b.push(maxrange[index])


        if (design == 1) {
            var tot1 = 0;
            var tot2 = 0;
            for (var i = 0; i < t1.length; i++) {
                data_histo1[t1[i].zone] += t1[i].duration;
                tot1 += t1[i].duration;
            }
            for (var i = 0; i < t2.length; i++) {
                data_histo2[t2[i].zone] += t2[i].duration;
                tot2 += t2[i].duration;

            }

            data_all = data_histo1.map((d, i) => ({
                categorie: '[' + b[i] + '-' + b[i + 1] + ']',
                values: [{
                    value: data_histo1[i] / tot1,
                    rate: "Single Test Subjects"
                }, {
                    value: data_histo2[i] / tot2,
                    rate: "Pairs Test Subjects"
                }]
            }))
            histo_trans_time(data_all, ['rgb(87, 162, 192)', 'rgb(235, 122, 69)'], 'histo' + index)
        }



        var v = borders.slice();
        v.unshift(0)

        data_ring_time = t1.map(d => ({ zone: d.zone, dur: d.duration }))

        if (g == 0) ringgraph_trans_time(data_ring_time, 'ringS' + index, borders.length + 1, v, maxrange[index]);
        if (g == 1) ringgraph_trans_time(data_ring_time, 'ringD' + index, borders.length + 1, v, maxrange[index]);


        //   ringgraph_trans_within(data_ring, 'ring', v);



    });
}

function histo_trans_time(data, color, name) {
    d3.selectAll('#ring' + name).remove();


    var margin = { top: 50, right: 20, bottom: 30, left: 40 },
        width = window.innerHeight * 1 - margin.left - margin.right,
        height = window.innerHeight * 0.6 - margin.top - margin.bottom;

    var x0 = d3.scaleBand()
        .rangeRound([0, width]).padding(0.1);

    var x1 = d3.scaleBand();

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(x0)
        .tickSize(0)

    var yAxis = d3.axisLeft()
        .scale(y)

    var color = d3.scaleOrdinal()
        .range(color);

    var svg = d3.select('#' + name).append("svg")
        .attr('id', 'ring' + name)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var categoriesNames = data.map(function(d) { return d.categorie; });
    var rateNames = data[0].values.map(function(d) { return d.rate; });

    x0.domain(categoriesNames);
    x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style('opacity', '0')
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight', 'bold')
        .text("Value");

    svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

    var slice = svg.selectAll(".slice")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

    slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("width", x1.bandwidth())
        .attr("x", function(d) { return x1(d.rate); })
        .style("fill", function(d) { return color(d.rate) })
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return height - y(0); })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(d.rate));
        });
    slice.selectAll("rect")
        .transition()
        .delay(function(d) { return Math.random() * 1000; })
        .duration(1000)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });

    //label

    //Legend
    var legend = svg.selectAll(".legend")
        .data(data[0].values.map(function(d) { return d.rate; }).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + ((i * 20) - margin.top) + ")"; })
        .style("opacity", "0")
        .style('font-size', '12px')


    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    legend.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");
}


function ringgraph_trans_time(data, name, nbzones, v, rightmost) {
    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = window.innerWidth / 2 - margin.left - margin.right,
        height = width;

    d3.selectAll('#ring' + name).remove();

    var svg = d3.select('#' + name)
        .append("svg")
        .attr('id', 'ring' + name)
        .attr("width", width + 50)
        .attr("height", height + 50)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var margin = 110
    var radius = Math.min(width, height) / 2 - margin;

    // Create dummy data
    //  var data = [9, 20, 30, 8, 12, 3, 7, 14]

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain([0, 10])
        .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function(d) { return d.value })

    var data_ready = pie(d3.entries((data.map(d => d.dur))))


    // The arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.5) // This is the size of the donut hole
        .outerRadius(radius * 1)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) { return (color(data[i].zone)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    var legend = svg.selectAll(".legend")
        .data(v)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + ((i * 20) - 50) + ")"; })
        .style("opacity", "1")
        .style('font-size', '12px')


    legend.append("rect")
        .attr("x", width / 2 + 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) { return color(i); });

    legend.append("text")
        .attr("x", width / 2 + 10)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d, i) {
            if (i == v.length - 1) { return ('[' + d + '-' + rightmost + ']') } else { return ('[' + d + '-' + v[i + 1] + ']') }
        });

    legend.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");


}

function draw_elements(borders, index) {
    const maxrange = [237, 186, 157, 320]; //maxrange of the corresponding elements


    if (index == 0) {

        d3.selectAll('.DW-lines').remove();
    } else if (index == 1) {
        d3.selectAll('.DS-lines').remove() //LA
    } else if (index == 2) {
        d3.selectAll('.LA-lines_bulb').remove();
        d3.selectAll('.LA-lines_rect1').remove();
        d3.selectAll('.LA-lines_rect2').remove();
        d3.selectAll('.LA-lines_rect3').remove();
    } else {
        d3.selectAll('.LD-lines_bulb').remove();
        d3.selectAll('.LD-lines_rect1').remove();
        d3.selectAll('.LD-lines_rect2').remove();
        d3.selectAll('.LD-lines_rect3').remove();


    }

    for (j = 0; j < borders.length; j++) {
        if (index == 0) {
            d3.selectAll('#Ebene_1')
                .append('svg')
                .attr('width', 800)
                .attr('height', 800)
                .append('rect')
                .attr('class', 'DW-lines')
                .attr("width", 4.53)
                .attr("height", 161.57)
                .style('opacity', 0.8)
                .attr('transform', 'translate(549.28,333.47) rotate(52.7)')
                .attr('transform', 'translate(453.737 364.794) rotate(' + (borders[j] - 209) + ',2.263, 42.486)')

        } else if (index == 1) {

            d3.selectAll('#Ebene_1')
                .append('svg')
                .attr('width', 800)
                .attr('height', 800)
                .append('rect')
                .attr('class', 'DS-lines')
                .attr("width", 34.55)
                .attr("height", 68.03)
                .style('opacity', 0.5)
                .attr('transform', 'translate(515 501.1) rotate(' + (borders[j] + 77) + ' ,30.37, 3.95)')

        } else if (index == 2) {



            d3.selectAll('#Ebene_1')
                .append('g')
                .append('circle')
                .attr('class', 'LA-lines_bulb')
                .attr("cx", 766.46)
                .attr("cy", 439.282)
                .attr("r", 4)
                .attr('transform', 'translate(-39.25,-8.7) rotate(' + (borders[j] - 91.9) + ',37.25,8.7)')
                .style('stroke', 'none')
                .style('opacity', 1)

            d3.selectAll('#Ebene_1')
                .append('svg')
                .attr('width', 1000)
                .attr('height', 1000)
                .append('rect')
                .attr('class', 'LA-lines_rect1')
                .attr('x', 762.14)
                .attr('y', 447.36)
                .attr("width", 0.7)
                .attr("height", 82.4789) //+1
                .attr('transform', 'translate(-35.25,-8.0589) rotate(' + (borders[j] - 91.7) + ',33.25,8.0589)')
                .style('opacity', 1)


            d3.selectAll('#Ebene_1')
                .append('svg')
                .attr('width', 1000)
                .attr('height', 1000)
                .append('rect')
                .attr('class', 'LA-lines_rect2')
                .attr('x', 763.78)
                .attr('y', 442.25)
                .attr("width", 2)
                .attr("height", 4.314)
                .attr('transform', 'translate(-37.5,-7.5) rotate(' + (borders[j] - 91.7) + ',35.5,7.5)')
                .style('opacity', 1)


            d3.selectAll('#Ebene_1')
                .append('svg')
                .attr('width', 800)
                .attr('height', 800)
                .append('rect')
                .attr('class', 'LA-lines_rect3')
                .attr('x', 757.91)
                .attr('y', 454.53)
                .attr("width", 1.11558 / 3)
                .attr("height", 2.61228)
                .attr('transform', 'translate(-31.78,-6.6) rotate(' + ((borders[j] - 91.7)) + ',29.78,6.6)')
                .style('opacity', 1)


        } else {

            d3.selectAll('#Ebene_1')
                .append('g')
                .append('circle')
                .attr('class', 'LD-lines_bulb')
                .attr("cx", 548)
                .attr("cy", 407.2)
                .attr("r", 4)
                .attr('transform', 'translate(0.01,-0.1) rotate(' + (borders[j] - 200 + 5.9) + ',0,0.1)')
                .style('stroke', 'none')
                .style('opacity', 1)

            d3.selectAll('#Ebene_1')
                .append('svg')
                .attr('width', 1000)
                .attr('height', 1000)
                .append('rect')
                .attr('class', 'LD-lines_rect1')
                .attr('x', 457.8)
                .attr('y', 407.03)
                .attr("height", 0.7)
                .attr("width", 81.4789) //+1
                .attr('transform', 'translate(0.3,0.25) rotate(' + (borders[j] - 200 + 5.5) + ',-0.3,-0.25)')
                .style('opacity', 1)


            d3.selectAll('#Ebene_1')
                .append('svg')
                .attr('width', 1000)
                .attr('height', 1000)
                .append('rect')
                .attr('class', 'LD-lines_rect2')
                .attr('x', 544.5 - 4.8)
                .attr('y', 415.05 - 8.85)
                .attr("height", 2)
                .attr("width", 4.214)
                .attr('transform', 'translate(0.0,0.6) rotate(' + (borders[j] - 200 + 5.4) + ',0.0,-0.6)')
                .style('opacity', 1)


            d3.selectAll('#Ebene_1')
                .append('svg')
                .attr('width', 800)
                .attr('height', 800)
                .append('rect')
                .attr('class', 'LD-lines_rect3')
                .attr('x', 525.15)
                .attr('y', 413.09 - 7)
                .attr("height", 1.11558 / 3)
                .attr("width", 2.61228)
                .attr('transform', 'translate(0.15,' + (1.11558 / 6) + ') rotate(' + (borders[j] - 200 + 5.75) + ',-0.1,' + (-1.11558 / 6) + ')')
                .style('opacity', 1)


        }
    }

}


function ringgraph_trans_within(data, name, extdborder) {
    var margin = { top: 0, right: 50, bottom: 50, left: 50 },
        width = window.innerWidth * 0.4 - margin.left - margin.right,
        height = width;

    var svg = d3.select('#' + name)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var margin = 110
    var radius = Math.min(width, height) / 2 - margin;

    // Create dummy data
    //  var data = [9, 20, 30, 8, 12, 3, 7, 14]

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain([0, data.length])
        .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function(d) { return d.value; })

    var data_ready = pie(d3.entries(data))
    console.log(data_ready)

    // The arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.5) // This is the size of the donut hole
        .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) { return (color(i)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Add the polylines between chart and labels:
    svg.selectAll('allPolylines')
        .data(data_ready)
        .enter()
        .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
            var posA = arc.centroid(d) // line insertion in the slice
            var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            var posC = outerArc.centroid(d); // Label position = almost the same as posB
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
        })

    // Add the polylines between chart and labels:
    svg.selectAll('allLabels')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d, i) {
            return 'Zone [' + extdborder[i] + '-' + extdborder[i + 1] + '] (' + d.value + ')'
        })
        .attr('font-size', '12px')
        .attr('transform', function(d) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function(d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })


}