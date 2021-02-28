function enterButton(index) {

    x = document.getElementById('border' + index).value;
    y = x.split(',')
    console.log(y)
    y = y.map(d => parseInt(d))
    console.log(y)
    draw_elements(y, index);

    identify_transitions(0, x, 0, index, true)
}


function identify_transitions(data, borders, element, index, timeopt) {
    d3.json('../data/data_snaps_densityPlot.json').then(function(data_alt) {
        borders = [10, 70, 150]
        data_alt = data_alt.filter(d => d.Element == index && d.Week == '43-20');

        var i = 0;
        var cur_zone = 0;
        var transitions = [];
        const last = borders.length;
        console.log(data_alt);
        var data_ring = [0];
        for (var k = 0; k < borders.length; k++) data_ring.push(0)

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
        console.log(transitions);

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




        const maxrange = [237, 186, 157, 320];
        var v = borders;
        v.unshift(0)

        data_ring_time = transitions.map(d => ({ zone: d.zone, dur: d.duration }))
        console.log(data_ring_time);

        ringgraph_trans_time(data_ring_time, 'ring' + index, borders.length + 1, v, maxrange[index]);

        v.push(maxrange[index])
            //   ringgraph_trans_within(data_ring, 'ring', v);



    });
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
        .domain([0, nbzones])
        .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function(d) { return d.value })

    var data_ready = pie(d3.entries((data.map(d => d.dur))))
    console.log(data_ready)


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
                .attr('id', 'DS' + i + '_' + j)
                .attr("width", 34.55)
                .attr("height", 68.03)
                .style('opacity', 0.5)
                .attr('transform', 'translate(515 501.1) rotate(' + (borders[j] + 77) + ' ,30.37, 3.95)')

        } else if (index == 2) {



            d3.selectAll('#Ebene_1')
                .append('g')
                .append('circle')
                .attr('class', 'LA-lines_bulb')
                .attr('id', 'LA' + i + '_' + j)
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
                .attr('id', 'LA' + i + '_rect1' + j)
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
                .attr('id', 'LA' + i + '_rect2' + j)
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
                .attr('id', 'LA' + i + '_' + j)
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
                .attr('id', 'LD' + i + '_' + j)
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
                .attr('id', 'LD' + i + '_rect1' + j)
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
                .attr('id', 'LD' + i + '_rect2' + j)
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
                .attr('id', 'LD' + i + '_' + j)
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
        width = window.innerWidth / 2 - margin.left - margin.right,
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