///based on code found at https://observablehq.com/@d3/scatterplot-matrix
/**
 *  
 * It draws the scatter plot matrix for the dataset of two groups.
 * Each cell is a scatter plot, and every point is defined by the angle positions held by
 * two rotational elements at the same time. 
 * The datasets are sets of states of the Mockup. ie the timestamp and all angles postitions of the four rotational elements held at that time. 
 */
function scatter_matrix_single(dataset) {
    let datafile = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];

    var weeks_draw = weeks_filter;

    var width = window.innerHeight / 3 * 4,
        size = (width - 100) / 4,
        padding = 20;


    var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(8);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(5);


    var domainByTrait = {},
        traits = ['DW', 'DS', 'LA', 'LD'],
        n = traits.length;

    domainByTrait['DW'] = [-20, 290];
    domainByTrait['DS'] = [-20, 210];
    domainByTrait['LA'] = [-20, 170];
    domainByTrait['LD'] = [-20, 340];


    console.log(traits)
    console.log(domainByTrait)

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    var brush = d3.brush()
        .on("start", brushstart)
        .on("brush", brushmove)
        .on("end", brushend)
        .extent([
            [0, 0],
            [size, size]
        ]);

    var svg = d3.select("#scatter_matrix")
        .append("svg")
        .attr('id', 'matrix')
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");


    svg.selectAll(".x.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) {
            x.domain(domainByTrait[d]);
            d3.select(this).call(xAxis);
        });

    svg.selectAll(".y.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) {
            y.domain(domainByTrait[d]);
            d3.select(this).call(yAxis);

        });

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", "1em")
        .style('font-size', '13px')
        .text(function(d, i) { console.log(d.x); return datafile[i]; });

    cell.call(brush);

    function plot(p) {
        var cell = d3.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.selectAll("circle")
            .data(dataset)
            .enter().append("circle")
            .attr("cx", function(d) { return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 1.2)
            .style('opacity', function(d, i) {
                if (i > 1 && dataset[i - 1][p.x] == dataset[i][p.x] && dataset[i - 1][p.y] == dataset[i][p.y]) { return 0; } else { return 0.5 } ///hooooodd
            })
            .style("fill", function(d) {
                //   console.log(weeks_all.indexOf(d['Timestamp']))
                return 'steelblue'
                    // if (weeks_single.includes(d['Timestamp'])) {
                    //     return 'PaleVioletRed';
                    // } else {
                    //     return 'steelblue';

                // }
            });
    }


    var brushCell;

    // Clear the previously-active brush, if any.
    function brushstart(p) {
        if (brushCell !== this) {
            d3.select(brushCell).call(brush.move, null);
            brushCell = this;
            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);
        }
    }

    // Highlight the selected circles.
    function brushmove(p) {
        var e = d3.brushSelection(this);
        svg.selectAll("circle").classed("hidden", function(d) {
            return !e ?
                false :
                (
                    e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0] ||
                    e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
                );
        });
    }

    // If the brush is empty, select all circles.
    function brushend() {
        var e = d3.brushSelection(this);
        if (e === null) svg.selectAll(".hidden").classed("hidden", false);
    }
}

/**
 * returns the data for each cell
 * @param {} a 
 * @param {*} b 
 */
function cross(a, b) {
    var c = [],
        n = a.length,

        i, j;
    for (i = 0; i < n; i++)
        for (j = i; j < n; j++) {
            c.push({ x: a[j], i: j, y: b[i], j: i }); //leave Right lower triangle empty
        }
    console.log(c)
    return c;

}