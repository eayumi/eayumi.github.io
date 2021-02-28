function draw_grouped_bar_chart_vert_score(data_alt, quest, name, opt) {

    //-----------------PREPARE DATA------------------------------------

    single = data_alt.filter(d => d.Group == 0);
    double = data_alt.filter(d => d.Group > 0);

    data_grouped = [{
        Group: 'Single',
        score: [single.filter(d => d[quest] == 1).length,
            single.filter(d => d[quest] == 2).length,
            single.filter(d => d[quest] == 3).length,
            single.filter(d => d[quest] == 4).length,
            single.filter(d => d[quest] == 5).length,
            single.filter(d => d[quest] == 6).length,
            single.filter(d => d[quest] == 7).length,
            single.filter(d => d[quest] == 8).length,
            single.filter(d => d[quest] == 9).length,
            single.filter(d => d[quest] == 10).length

        ]
    }, {
        Group: 'Double',
        score: [double.filter(d => d[quest] == 1).length,
            double.filter(d => d[quest] == 2).length,
            double.filter(d => d[quest] == 3).length,
            double.filter(d => d[quest] == 4).length,
            double.filter(d => d[quest] == 5).length,
            double.filter(d => d[quest] == 6).length,
            double.filter(d => d[quest] == 7).length,
            double.filter(d => d[quest] == 8).length,
            double.filter(d => d[quest] == 9).length,
            double.filter(d => d[quest] == 10).length

        ]
    }]

    data_all = [{
        Group: 'All',
        score: [data_grouped[0].score[0] + data_grouped[1].score[0],
            data_grouped[0].score[1] + data_grouped[1].score[1],
            data_grouped[0].score[2] + data_grouped[1].score[2],
            data_grouped[0].score[3] + data_grouped[1].score[3],
            data_grouped[0].score[4] + data_grouped[1].score[4],
            data_grouped[0].score[5] + data_grouped[1].score[5],
            data_grouped[0].score[6] + data_grouped[1].score[6],
            data_grouped[0].score[7] + data_grouped[1].score[7],
            data_grouped[0].score[8] + data_grouped[1].score[8],
            data_grouped[0].score[9] + data_grouped[1].score[9],
        ]
    }]


    data_single = [{
            categorie: "1",
            values: [{
                value: data_grouped[0].score[0],
                rate: "Single Test Subject"
            }]
        },
        {
            categorie: "2",
            values: [{
                value: data_grouped[0].score[1],
                rate: "Single Test Subject"
            }]
        },
        {
            categorie: "3",
            values: [{
                value: data_grouped[0].score[2],
                rate: "Single Test Subject"
            }]
        }, {
            categorie: "4",
            values: [{
                value: data_grouped[0].score[3],
                rate: "Single Test Subject"
            }]
        },
        {
            categorie: "5",
            values: [{
                value: data_grouped[0].score[4],
                rate: "Single Test Subject"
            }]
        }, {
            categorie: "6",
            values: [{
                value: data_grouped[0].score[5],
                rate: "Single Test Subject"
            }]
        }, {
            categorie: "7",
            values: [{
                value: data_grouped[0].score[6],
                rate: "Single Test Subject"
            }]
        }, {
            categorie: "8",
            values: [{
                value: data_grouped[0].score[7],
                rate: "Single Test Subject"
            }]
        }, {
            categorie: "9",
            values: [{
                value: data_grouped[0].score[8],
                rate: "Single Test Subject"
            }]
        }, {
            categorie: "10",
            values: [{
                value: data_grouped[0].score[9],
                rate: "Single Test Subject"
            }]
        }
    ]
    data_double = [{

            categorie: "1 ",
            values: [{
                value: data_grouped[1].score[0],
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: "2 ",
            values: [{
                value: data_grouped[1].score[1],
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: "3 ",
            values: [{
                value: data_grouped[1].score[2],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "4 ",
            values: [{
                value: data_grouped[1].score[3],
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: "5 ",
            values: [{
                value: data_grouped[1].score[4],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "6 ",
            values: [{
                value: data_grouped[1].score[5],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "7 ",
            values: [{
                value: data_grouped[1].score[6],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "8 ",
            values: [{
                value: data_grouped[1].score[7],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "9 ",
            values: [{
                value: data_grouped[1].score[8],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "10 ",
            values: [{
                value: data_grouped[1].score[9],
                rate: "Pairs of Test Subjects"
            }]
        }

    ]



    data_all = [{
            categorie: "1",
            values: [{
                value: data_all[0].score[0],
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "2",
            values: [{
                value: data_all[0].score[1],
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "3",
            values: [{
                value: data_all[0].score[2],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "4",
            values: [{
                value: data_all[0].score[3],
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "5",
            values: [{
                value: data_all[0].score[4],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "6",
            values: [{
                value: data_all[0].score[5],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "7",
            values: [{
                value: data_all[0].score[6],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "8",
            values: [{
                value: data_all[0].score[7],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "9",
            values: [{
                value: data_all[0].score[8],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "10",
            values: [{
                value: data_all[0].score[9],
                rate: "All Test Subjects"
            }]
        }
    ]
    if (opt == 0) {
        draw_chart(data_single, name, ['rgb(87, 162, 192)']);
        draw_chart(data_double, name, ['rgb(235, 122, 69)']);
        draw_chart(data_all, 'All' + name, ['rosybrown']); //'rgb(87, 162, 192)', 'rgb(235, 122, 69)']);


    } else {
        draw_chart(data_all, name, ['rosybrown']); //'rgb(87, 162, 192)', 'rgb(235, 122, 69)']);

    }

}

function threeOpt(data_alt, quest, name, A, B, C) {

    single = data_alt.filter(d => d.Group == 0);
    double = data_alt.filter(d => d.Group > 0);

    data_grouped = [{
        Group: 'Single',
        score: [
            single.filter(d => d[quest] == 0).length,
            single.filter(d => d[quest] == 1).length,
            single.filter(d => d[quest] == 2).length
        ]
    }, {
        Group: 'Double',
        score: [
            double.filter(d => d[quest] == 0).length,
            double.filter(d => d[quest] == 1).length,
            double.filter(d => d[quest] == 2).length
        ]
    }]

    data_alles = [{
        Group: 'All',
        score: [
            data_grouped[0].score[0] + data_grouped[1].score[0],
            data_grouped[0].score[1] + data_grouped[1].score[1],
            data_grouped[0].score[2] + data_grouped[1].score[2]

        ]
    }]

    data_all = [{
            categorie: A,
            values: [{
                value: data_alles[0].score[0],
                rate: "All Test Subject"
            }]
        },
        {
            categorie: B,
            values: [{
                value: data_alles[0].score[1],
                rate: "All Test Subject"
            }]
        },
        {
            categorie: C,
            values: [{
                value: data_alles[0].score[2],
                rate: "All Test Subject"
            }]
        }
    ]

    data_sp = [{
            categorie: A,
            values: [{
                value: data_grouped[0].score[0],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[0],
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: B,
            values: [{
                value: data_grouped[0].score[1],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[1],
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: C,
            values: [{
                value: data_grouped[0].score[2],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[2],
                rate: "Pairs of Test Subjects"
            }]
        }
    ]

    draw_chart(data_sp, name, ['rgb(87, 162, 192)', 'rgb(235, 122, 69)']);
    draw_chart(data_all, 'All' + name, ['rosybrown']);


}





//draw the chart
function draw_chart(data, name, color) {
    //---------------------CHART---------------------------------


    var margin = { top: 50, right: 10, bottom: 30, left: 40 },
        width = window.innerHeight * 0.9 - margin.left - margin.right,
        height = window.innerHeight * 0.5 - margin.top - margin.bottom;

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

    var label = slice.selectAll(".bartext")
        .data(function(d) { return d.values; })
        .enter()
        .append("text")
        .attr("class", "bartext")
        .attr("text-anchor", "middle")
        .style("opacity", "0")
        .attr("fill", "black")
        .attr("x", function(d) { return x1(d.rate) + (x1.bandwidth() / 2); })
        .attr("y", function(d) { return y(d.value) + 15 })
        .text(function(d) {
            if (d.value == 0) return ""
            return d.value;
        })
        .style('font-size', '12px');

    label.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

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