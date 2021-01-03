//scatterplot Drehwand from - to (position)
/**
 * Draws the To-From Scatter Plots for the given data of each group. 
 * (For the two group comparison view)
 * It offeres to toggle the view. Either plot the data for both groups in one or in two separate plots.
 * rotatable elements. This is done by caling the plotToFromScatter_comp function with the parameter summary = true
 * 
 * @param {*} data 
 */
function ToFromScatter_comp(data_g1, data_g2) {
    datafile = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
    var margin = { top: 70, right: 70, bottom: 70, left: 70 }

    for (var i = 0; i < 4; i++) {
        plotToFromScatter_comp(i, false, ("#scatter_comp_" + i),
            data_g1.filter(d => d.Sensorname == datafile[i]),
            data_g2.filter(d => d.Sensorname == datafile[i]), margin)
    }
}

/**
 * Draws the To-From Scatter Plots for the given data. 
 * Each scatter plot shows every rotation given in the data for one specific rotatable element. 
 * Each point in the plot stands for the angles the element was moved from and to. The opacity is set, so that clusters are more prominent.
 * It offeres to toggle the view. Either plot the data for both groups in one or in two separate plots.
 * rotatable elements.  
 * @param {*} index 
 * @param {*} summary 
 * @param {*} div 
 * @param {*} data_g1 
 * @param {*} data_g2 
 * @param {*} margin 
 */
function plotToFromScatter_comp(index, summary, div, data_g1, data_g2, margin) {
    // set the dimensions and margins of the graph
    var width_tog = Math.min(((window.innerWidth * 0.9) / 2), window.innerHeight * 0.9 - 50);
    var height_tog = width_tog;
    var names = ['Rotatable Wall', 'Rotatable Closet', 'Lamp B', 'Lamp A'];

    var w = width_tog - margin.left - margin.right,
        h = height_tog - margin.top - margin.bottom;

    // append the svg object to the body of the page, for the combined plot
    var svg = d3.select(div)
        .append("svg")
        .attr('id', 'tofrom')
        .attr("width", width_tog)
        .attr("height", height_tog)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
        .attr("width", width_tog)
        .attr("height", width_tog)
        .attr("fill", "white");

    var svg_inline = [];
    //side to give each plot different id (left == group 1, right == group 2)
    var side = ['_left', '_right'];

    //the spearate plots
    for (var g = 0; g < 2; g++) {

        svg_inline[g] = d3.select('#scatter_' + i + side[g])
            .append("svg")
            .attr('id', 'tofrom')
            .attr("width", width_tog)
            .attr("height", height_tog)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg_inline[g].append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "white");
    }


    // Add X axis
    var minTo = Math.min(d3.min(data_g1, function(d) { return d.To; }), d3.min(data_g2, function(d) { return d.To; }));
    var minFrom = Math.min(d3.min(data_g1, function(d) { return d.From; }), d3.min(data_g2, function(d) { return d.From; }));
    var maxTo = Math.max(d3.max(data_g1, function(d) { return d.To; }), d3.max(data_g2, function(d) { return d.To; }));
    var maxFrom = Math.max(d3.max(data_g1, function(d) { return d.From; }), d3.max(data_g2, function(d) { return d.From; }));

    var min = Math.min(minTo, minFrom, 0);
    var max = Math.max(maxTo, maxFrom) + 10;

    var x = d3.scaleLinear()
        .range([0, w])
        .domain([min, max]);

    var y = d3.scaleLinear()
        .range([h, 0])
        .domain([min, max]);

    //combined plot
    //x axis
    svg.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(0' + margin.left + ',' + h + ')')
        .call(d3.axisBottom(x).ticks(20))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)"
        });
    // Add Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(0' + margin.left + ', 0)')
        .call(d3.axisLeft(y).ticks(20))
        .selectAll("text");

    //lable for x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (width_tog / 2) + " ," +
            (h + margin.top - 20) + ")")
        .style("text-anchor", "middle")
        .style('font-size', '15px')
        .text("To (degrees) of " + names[index]) //+ " with range of [0°, " + maxrange[index] + '°]')

    //label y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", (margin.top * 2) - (height_tog / 2))
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style('font-size', '15px')
        .text("From (degrees)");

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(10)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(10)
    }


    //Separaret Plot
    for (var g = 0; g < 2; g++) {
        svg_inline[g].append("g")
            .attr("class", "axis")
            .attr('transform', 'translate(0' + margin.left + ',' + h + ')')
            .call(d3.axisBottom(x).ticks(20))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)"
            });
        // Add Y axis
        svg_inline[g].append("g")
            .attr("class", "axis")
            .attr('transform', 'translate(0' + margin.left + ', 0)')
            .call(d3.axisLeft(y).ticks(20))
            .selectAll("text");

        //lable for x axis
        svg_inline[g].append("text")
            .attr("transform",
                "translate(" + (width_tog / 2) + " ," +
                (h + margin.top - 20) + ")")
            .style("text-anchor", "middle")
            .style('font-size', '15px')
            .text("To (degrees) " + names[index])
            .append('tspan')
            .attr('x', 0)
            .attr('dy', '1.2em')
            .append('tspan')
            .text('Group ' + (1 + g))


        //label y axis
        svg_inline[g].append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x", (margin.top * 2) - (height_tog / 2))
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .style('font-size', '15px')
            .text("From (degrees)");

        // add the X gridlines
        svg_inline[g].append("g")
            .attr("class", "grid")
            .attr('transform', 'translate(0' + margin.left + ',' + h + ')')
            .call(make_x_gridlines()
                .tickSize(-h)
                .tickFormat("")
            )


        // add the Y gridlines
        svg_inline[g].append("g")
            .attr("class", "grid")
            .attr('transform', 'translate(0' + margin.left + ', 0)')
            .call(make_y_gridlines()
                .tickSize(-w)
                .tickFormat("")
            )

        data_inline = (g == 0) ? data_g1 : data_g2;
        // Add dots
        svg_inline[g].selectAll("dot")
            .data(data_inline)
            .enter()
            .append("circle")
            .attr('class', 'changeop')

        .attr('transform', 'translate(0' + margin.left + ', 0)')
            .attr("cx", function(d) { return x(d.To); })
            .attr("cy", function(d) { return y(d.From); })
            .attr("r", function() {
                return 1.5
            })
            .style("fill", group_color[g])
            .attr('opacity', 0.7)

    }


    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr('transform', 'translate(0' + margin.left + ',' + h + ')')
        .call(make_x_gridlines()
            .tickSize(-h)
            .tickFormat("")
        )


    // add the Y gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr('transform', 'translate(0' + margin.left + ', 0)')
        .call(make_y_gridlines()
            .tickSize(-w)
            .tickFormat("")
        )


    // Add dots
    svg.selectAll("dot")
        .data(data_g1)
        .enter()
        .append("circle")
        .attr('class', 'changeop')

    .attr('transform', 'translate(0' + margin.left + ', 0)')
        .attr("cx", function(d) { return x(d.To); })
        .attr("cy", function(d) { return y(d.From); })
        .attr("r", function() {
            if (summary) { return 0.7 }
            return 1.5
        })
        .style("fill", group_color[0])
        .attr('opacity', 0.7)
    svg.selectAll("dot")
        .data(data_g2)
        .enter()
        .append("circle")
        .attr('class', 'changeop')
        .attr('transform', 'translate(0' + margin.left + ', 0)')
        .attr("cx", function(d) { return x(d.To); })
        .attr("cy", function(d) { return y(d.From); })
        .attr("r", function() {
            if (summary) { return 0.7 }
            return 1.5
        })
        .style("fill", group_color[1])
        .attr('opacity', 0.7)

    //adding title
    svg.append("text")
        .attr('x', width_tog / 2).attr('y', h + margin.top + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text(data[0].Sensorname);

    d3.select("#tofromopacity").on("input", function() {
        var op = d3.select("#tofromopacity").property('value') / 100;

        svg.selectAll('.changeop')
            .attr('opacity', 0.1)
    });


}