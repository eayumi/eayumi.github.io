//based on code found at https://observablehq.com/@d3/scatterplot-matrix
/**
 *  
 * It draws the scatter plot matrix for the dataset of two groups.
 * Each cell is a scatter plot, and every point is defined by the angle positions held by
 * two rotational elements at the same time. 
 * The datasets are sets of states of the Mockup. ie the timestamp and all angles postitions of the four rotational elements held at that time.
 * @param {*} data_g1 dataset for group 1
 * @param {*} data_g2 dataset for group 2
 */
function scatter_matrix_comp(data_g1, data_g2) {
    let datafile = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];

    console.log(data_g1);
    console.log(data_g2);



    data_t1 = data_g1.map(d => d.Timestamp);
    data_t2 = data_g2.map(d => d.Timestamp);

    data1 = data_g1.slice();
    data2 = data_g2.slice();



    //We add colour to aid in differentiating points drawn from data_g1 or data_g2. 
    //As data_g1 and data_g2 can intersect, we mark each Timestamp with a .g attribute, indicating the gorup
    //[0 == group 1, 1 == group 2, 2 == both]
    data1.map(function(d) { d.g = 0 });

    data2.map(function(d) {
        if (data_t1.includes(d.Timestamp)) { d.g = 2 } else { d.g = 1 }
    });
    data = data2.concat(data1.filter(d => !data_t2.includes(d.Timestamp))); //dataset without duplicates



    var width = window.innerHeight / 3 * 4,
        size = (width - 100) / 4,
        padding = 20;

    //scale and axes
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

    //the entries per row/column
    var domainByTrait = {},
        traits = ['DW', 'DS', 'LA', 'LD'],
        n = traits.length;

    //the range
    domainByTrait['DW'] = [-20, 290];
    domainByTrait['DS'] = [-20, 210];
    domainByTrait['LA'] = [-20, 170];
    domainByTrait['LD'] = [-20, 340];


    console.log(traits)
    console.log(domainByTrait)

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    //brushing
    var brush = d3.brush()
        .on("start", brushstart)
        .on("brush", brushmove)
        .on("end", brushend)
        .extent([
            [0, 0],
            [size, size]
        ]);

    var svg = d3.selectAll("#scatter_matrix_comp")
        .append("svg")
        .attr('id', 'matrix')
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    // svg.selectAll("myLegend")
    //     .data(weeks_draw)
    //     .enter()
    //     .append('g')
    //     .append("text")
    //     .attr('x', 50)
    //     .attr('y', function(d, i) {
    //         return (-10 * i) + 10
    //     })
    //     .text(function(d) { return "week " + d + " "; })
    //     .style("fill", function(d, i) { return (weeks_filter_comp[0].includes(d.Week)) ? group_color[0] : group_color[1] })
    //     .style("font-weight", 900)
    //     .style("font-size", 10)
    //     .attr("transform", "translate(" + 805 + ", " + (150) + ")")

    //x axis
    svg.selectAll(".x.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) {
            x.domain(domainByTrait[d]);
            d3.select(this).call(xAxis);
        });
    //yaxis
    svg.selectAll(".y.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) {
            y.domain(domainByTrait[d]);
            d3.select(this).call(yAxis);

        });

    //draw each cell
    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits)) //data for the cells
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

    /**
     * draws the scatter plot for a cell
     * @param {} p 
     */
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
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) { return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 1.2)
            .style('opacity', 0.6)
            .style("fill", function(d) {
                if (d.g == 2) return 'purple'
                return group_color[d.g]
            })
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

}