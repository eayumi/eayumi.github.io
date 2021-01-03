/**
 * Draws the To-From Scatter Plots for the given data. 
 * (For the single group view)
 * It offeres to toggle the view. Either show each plot in detail, or all four 'summarized' within the screen window, to faciliate comparison of the four 
 * rotatable elements. This is done by caling the plotToFromScatter function with the parameter summary = true
 * 
 * @param {*} data 
 */
function ToFromScatter(data) {
    datafile = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];
    var margin = { top: 70, right: 50, bottom: 90, left: 70 },
        width = window.innerHeight * 0.9 - 10;

    var margin_tog = { top: 20, right: 50, bottom: 50, left: 20 },
        width_tog = (window.innerHeight * 0.9) / 2;
    for (var i = 0; i < 4; i++) {
        plotToFromScatter(false, ("#scatter_" + i), data.filter(d => d.Sensorname == datafile[i]), margin, width);
        plotToFromScatter(true, ("#scatter_tog_" + i), data.filter(d => d.Sensorname == datafile[i]), margin_tog, width_tog); //for the one-window-view

    }
}

/**
 * Draws the To-From Scatter Plots for the given data. 
 * Each scatter plot shows every rotation given in the data for one specific rotatable element. 
 * Each point in the plot stands for the angles the element was moved from and to. The opacity is set, so that clusters are more prominent.
 * (For the single group view)
 * It offeres to toggle the view. Either show each plot in detail, or all four within the screen window, to faciliate comparison of the four 
 * rotatable elements.  
 * @param {bool} summary 
 * @param {string} div 
 * @param {*} data 
 * @param {int} margin 
 * @param {int} width 
 */
function plotToFromScatter(summary, div, data, margin, width) {
    // set the dimensions and margins of the graph

    var height = width,
        w = width - margin.left - margin.right,
        h = height - margin.top - margin.bottom;
    var names = ['Rotatable Wall', 'Rotatable Closet', 'Lamp B', 'Lamp A'];


    // append the svg object to the body of the page
    var svg = d3.select(div)
        .append("svg")
        .attr('id', 'tofrom')
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white");

    // Add X axis
    var minTo = d3.min(data, function(d) { return d.To; });
    var minFrom = d3.min(data, function(d) { return d.From; });
    var maxTo = d3.max(data, function(d) { return d.To; });
    var maxFrom = d3.max(data, function(d) { return d.From; });

    var min = Math.min(minTo, minFrom) - 10;
    var max = Math.max(maxTo, maxFrom) + 10;

    var x = d3.scaleLinear()
        .range([0, w])
        .domain([min, max]);

    var y = d3.scaleLinear()
        .range([h, 0])
        .domain([min, max]);


    if (!summary) {
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
            .selectAll("text")
            // .attr('class', 'text');
            //lable for x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (h + margin.top - 20) + ")")
            .style("text-anchor", "middle")
            .style('font-size', '15px')
            .text("To (degrees)");



        //label y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x", (margin.top * 2) - (height / 2))
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .style('font-size', '15px')
            .text("From (degrees)");


    } else {

        //x axis
        svg.append("g")
            .attr("class", "axis")
            .attr('transform', 'translate(0' + margin.left + ',' + h + ')')
            .call(d3.axisBottom(x).ticks(20))

        // Add Y axis
        svg.append("g")
            .attr("class", "axis")
            .attr('transform', 'translate(0' + margin.left + ', 0)')
            .call(d3.axisLeft(y).ticks(20))

        svg.selectAll(".tick")
            .each(function(d, i) {
                d3.select(this).remove();
            });

    }
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
        .data(data)
        .enter()
        .append("circle")
        .attr('transform', 'translate(0' + margin.left + ', 0)')
        .attr("cx", function(d) { return x(d.To); })
        .attr("cy", function(d) { return y(d.From); })
        .attr("r", function() {
            if (summary) { return 1 }
            return 1.5
        })
        .style("fill", "black")
        .style('opacity', 0.5)

    //adding title
    svg.append("text")
        .attr('x', width / 2).attr('y', h + margin.top + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text(data[0].Sensorname);


}