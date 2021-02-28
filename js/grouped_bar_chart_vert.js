function grouped_bar_chart_vert() {
    d3.json('../data/Questionnaire.json').then(function(data) {
            draw_grouped_bar_chart_vert(data, "q1.1", 'Qone') //['Drehschrank', 'Drehwand', 'Lampe Drehwand', 'Lampe Aussenwand'])
                //['Rotatable Closet','Rotatable Wall','Lamp A','Lamp B']
            draw_grouped_bar_chart_vert(data, "q1.3", 'Qonethree')
            draw_grouped_bar_chart_vert(data, "q1.4", 'Qonefour')
            draw_grouped_bar_chart_vert_nonbin(data, "q1.6", 'Qonesix')

            draw_grouped_bar_chart_vert_score(data, "q1.81", 'Qoneeightone', 0)
            draw_grouped_bar_chart_vert_score(data, "q1.83", 'Qoneeighttwo', 0)
            draw_grouped_bar_chart_vert_score(data, "q1.83", 'Qoneeightthree', 0)
            draw_grouped_bar_chart_vert_score(data, "q1.84", 'Qoneeightfour', 0)
            draw_grouped_bar_chart_vert_score(data, "q1.85", 'Qoneeightfive', 0)

            threeOpt(data, 'q2.11', 'Qtwooneone', 'zu klein', 'weder noch', 'zu gross')
            threeOpt(data, 'q2.12', 'Qtwoonetwo', 'zu hell', 'weder noch', 'zu dunkel')


            draw_grouped_bar_chart_vert_score(data, "q2.2", 'Qtwotwo', 0)

            draw_grouped_bar_chart_vert_score(data, "q2.31", 'Qtwothreeone', 1)
            draw_grouped_bar_chart_vert_score(data, "q2.32", 'Qtwothreetwo', )
            draw_grouped_bar_chart_vert_score(data, "q2.33", 'Qtwothreethree', 1)
            draw_grouped_bar_chart_vert_score(data, "q2.34", 'Qtwothreefour', 1)
            draw_grouped_bar_chart_vert_score(data, "q2.35", 'Qtwothreefive', 1)
            draw_grouped_bar_chart_vert_score(data, "q2.36", 'Qtwothreesix', 1)

            qtwofive(data, 'q2.5', 'Qtwofive', 0)

            threeOpt(data, 'q2.6', 'Qtwosix', 'zu kalt', 'angenehm', 'zu warm')

            draw_grouped_bar_chart_vert_score(data, "q3.1", 'Qthreeone', 0)

            qtwofive(data, 'q4.1', 'Qfourone', 0)

            qtwofive(data, 'q5.2', 'Qfivetwo', 1)
            qtwofive(data, 'q5.4', 'Qfivefour', 1)






        }


    )
}

function draw_grouped_bar_chart_vert(data_alt, quest, name) {




    //-----------------PREPARE DATA------------------------------------
    data = [];
    bins = [];

    decs = data_alt.map(d => d[quest])

    for (i = 0; i < decs.length; i++) {
        powTwo = [8, 4, 2, 1];
        x = [0, 0, 0, 0];
        //  x=[0,0,0,0];

        if (decs[i] == "") {
            bins.push(-1)
        } else {
            for (j = 0; j < 4; j++) {
                if (decs[i] >= powTwo[j]) {
                    x[j] = 1;
                    decs[i] = decs[i] - powTwo[j];
                }
            }
            bins.push(x);
        }

    }


    for (i = 0; i < data_alt.length; i++) {
        bin = bins[i]
        if (bin == -1) {
            data.push({
                Week_Year: data_alt[i].Week,
                DS: bin,
                DW: bin,
                LD: bin,
                LA: bin,
                Group: data_alt[i].Group
            })
        } else {
            data.push({
                Week_Year: data_alt[i].Week,
                DS: bin[0],
                DW: bin[1],
                LD: bin[2],
                LA: bin[3],
                Group: data_alt[i].Group
            })
        }
    }



    single = data.filter(d => d.Group == 0);
    double = data.filter(d => d.Group > 0);
    data_grouped = [{
        Group: 'Single',
        DS: single.filter(d => d.DS == 1).length,
        DW: single.filter(d => d.DW == 1).length,
        LD: single.filter(d => d.LD == 1).length,
        LA: single.filter(d => d.LA == 1).length,
    }, {
        Group: 'Double',
        DS: double.filter(d => d.DS == 1).length,
        DW: double.filter(d => d.DW == 1).length,
        LD: double.filter(d => d.LD == 1).length,
        LA: double.filter(d => d.LA == 1).length,
    }];

    data_alles = [{
        Group: 'All',
        DS: data_grouped[0].DS + data_grouped[1].DS,
        DW: data_grouped[0].DW + data_grouped[1].DW,
        LD: data_grouped[0].LD + data_grouped[1].LD,
        LA: data_grouped[0].LA + data_grouped[1].LA,
    }];


    data_sp = [{
            categorie: "Drehschrank",
            values: [{
                    value: data_grouped[0].DS,
                    rate: "Single Test Subject"
                },
                {
                    value: data_grouped[1].DS,
                    rate: "Pairs of Test Subjects"
                }
            ]
        },
        {
            categorie: "Drehwand",
            values: [{
                    value: data_grouped[0].DW,
                    rate: "Single Test Subject"
                },
                {
                    value: data_grouped[1].DW,
                    rate: "Pairs of Test Subjects"
                }
            ]
        },
        {
            categorie: "Lampe Drehwand",
            values: [{
                    value: data_grouped[0].LD,
                    rate: "Single Test Subject"
                },
                {
                    value: data_grouped[1].LD,
                    rate: "Pairs of Test Subjects"
                }
            ]
        }, {
            categorie: "Lampe Aussenwand",
            values: [{
                    value: data_grouped[0].LA,
                    rate: "Single Test Subject"
                },
                {
                    value: data_grouped[1].LA,
                    rate: "Pairs of Test Subjects"
                }
            ]
        }

    ]

    data_all = [{
            categorie: "Drehschrank",
            values: [{
                value: data_alles[0].DS,
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "Drehwand",
            values: [{
                value: data_alles[0].DW,
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "Lampe Drehwand",
            values: [{
                value: data_alles[0].LD,
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "Lampe Aussenwand",
            values: [{
                value: data_alles[0].LA,
                rate: "All Test Subjects"
            }]
        }

    ]

    //---------------------CHART---------------------------------
    draw(data_sp, ['rgb(87, 162, 192)', 'rgb(235, 122, 69)'], name);
    draw(data_all, ['rosybrown'], 'All' + name);

    function draw(data, color, name) {
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
}

function draw_grouped_bar_chart_vert_nonbin(data_alt, quest, name) {

    //-----------------PREPARE DATA------------------------------------

    single = data_alt.filter(d => d.Group == 0);
    double = data_alt.filter(d => d.Group > 0);
    data_grouped = [{
        Group: 'Single',
        w: single.filter(d => d[quest] == 'w').length,
        m: single.filter(d => d[quest] == 'm').length,
        y: single.filter(d => d[quest] == 'y').length,
        n: single.filter(d => d[quest] == 'n').length,
    }, {
        Group: 'Double',
        w: double.filter(d => d[quest] == 'w').length,
        m: double.filter(d => d[quest] == 'm').length,
        y: double.filter(d => d[quest] == 'y').length,
        n: double.filter(d => d[quest] == 'n').length,
    }];

    data_alles = [{
        Group: 'All',
        w: data_grouped[0].w + data_grouped[1].w,
        m: data_grouped[0].m + data_grouped[1].m,
        y: data_grouped[0].y + data_grouped[1].y,
        n: data_grouped[0].n + data_grouped[1].n,
    }];


    data_sp = [{
            categorie: "Eine Woche",
            values: [{
                    value: data_grouped[0].w,
                    rate: "Single Test Subject"
                },
                {
                    value: data_grouped[1].w,
                    rate: "Pairs of Test Subjects"
                }
            ]
        },
        {
            categorie: "Einen Monat",
            values: [{
                    value: data_grouped[0].m,
                    rate: "Single Test Subject"
                },
                {
                    value: data_grouped[1].m,
                    rate: "Pairs of Test Subjects"
                }
            ]
        },
        {
            categorie: "Ein Jahr und länger",
            values: [{
                    value: data_grouped[0].y,
                    rate: "Single Test Subject"
                },
                {
                    value: data_grouped[1].y,
                    rate: "Pairs of Test Subjects"
                }
            ]
        }, {
            categorie: "Nein, lieber nicht",
            values: [{
                    value: data_grouped[0].n,
                    rate: "Single Test Subject"
                },
                {
                    value: data_grouped[1].n,
                    rate: "Pairs of Test Subjects"
                }
            ]
        }

    ]


    data_all = [{
            categorie: "Eine Woche",
            values: [{
                value: data_alles[0].w,
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "Einen Monat",
            values: [{
                value: data_alles[0].m,
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "Ein Jahr und länger",
            values: [{
                value: data_alles[0].y,
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "Nein, lieber nicht",
            values: [{
                value: data_alles[0].n,
                rate: "All Test Subjects"
            }]
        }

    ]


    //---------------------CHART---------------------------------
    draw(data_sp, ['rgb(87, 162, 192)', 'rgb(235, 122, 69)'], name)
    draw(data_all, ['rosybrown'], 'All' + name)

    function draw(data, color, name) {

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

}