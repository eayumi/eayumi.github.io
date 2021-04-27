//scatterplot Drehwand from - to (position)
function deg_per_ms_scatter() {
    datafile = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand'];

    for (var i = 0; i < 4; i++) {
        scat(datafile[i]);
    }
}

function scat(datafile) {

    var graph = d3.json('../data/data.json').then(function(data) {

        data = data.filter(d => d.Sensorname == datafile);
        console.log(data)

        data = data.filter(x => x.Duration < 100000); //Sensor T4
        console.log(data)

        // set the dimensions and margins of the graph
        var margin = { top: 70, right: 50, bottom: 70, left: 70 },
            width = 650,
            height = 650,
            w = width - margin.left - margin.right,
            h = height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(".scatter" + datafile)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var minDuration = 0;
        var minValueDiff = 0;
        var maxDuration = d3.max(data, function(d) { return d.Duration; }) + 100;
        var maxValueDiff = d3.max(data, function(d) { return d.ValueDiff; }) + 10;

        var x = d3.scaleLinear()
            .range([0, w])
            .domain([minValueDiff, maxValueDiff]);

        svg.append("g")
            .attr("class", "axis")
            .attr('transform', 'translate(0' + margin.left + ',' + h + ')')
            .call(d3.axisBottom(x).ticks(20))
            .selectAll("text")
            .attr('class', 'text');

        //lable for x axis
        svg.append("text")
            .attr('class', 'text')
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (h + 40) + ")")
            .style("text-anchor", "middle")
            .style('font-size', '12px')
            .text("Angle Movement");

        // Add Y axis
        var y = d3.scaleLinear()
            .range([h, 0])
            .domain([minDuration, maxDuration]);

        svg.append("g")
            .attr("class", "axis")
            .attr('transform', 'translate(0' + margin.left + ', 0)')
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr('class', 'text');

        svg.append("text")
            .attr('class', 'text')
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", -(h / 2) + 20)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .style('font-size', '12px')
            .text("Time in ms");

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
            .attr("cx", function(d) { return x(d.ValueDiff); })
            .attr("cy", function(d) { return y(d.Duration); })
            .attr("r", 1)
            .style("fill", "black")

        //adding title
        svg.append("text")
            .attr('class', 'text')
            .attr('x', width / 2)
            .attr('y', h + margin.top + 0)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .text(datafile);


    });

}