function draw_grouped_bar_chart_vert_score(data_alt, quest, selector1, selector2, tog, name) {

    //-----------------PREPARE DATA------------------------------------

    single = data_alt.filter(d => d.Group == 0);
    double = data_alt.filter(d => d.Group > 0);

    var data_grouped = [{
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

    var data_alll = [{
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
            data_grouped[0].score[9] + data_grouped[1].score[9]
        ]
    }]

    var avg_single = 0;
    var avg_double = 0;
    var avg_all = 0;
    var tot_ans_single = 0;
    var tot_ans_double = 0;
    var tot_ans;
    var avg_single_round;
    var avg_double_round;


    for (var i = 0; i < 10; i++) {
        tot_ans_single += data_grouped[0].score[i];
        avg_single += ((i + 1) * data_grouped[0].score[i]);
        tot_ans_double += data_grouped[1].score[i];
        avg_double += ((i + 1) * data_grouped[1].score[i]);

    }
    avg_all = avg_single + avg_double;
    avg_single /= tot_ans_single;
    avg_double /= tot_ans_double;
    avg_single = avg_single.toFixed(2);
    avg_double = avg_double.toFixed(2);
    avg_all /= (tot_ans_double + tot_ans_single);
    avg_all = avg_all.toFixed(2);

    avg_single_round = Math.round(avg_single);
    avg_double_round = Math.round(avg_double);




    var data_sp = [{

            categorie: "1",
            values: [{
                value: data_grouped[0].score[0],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[0],
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: "2",
            values: [{
                value: data_grouped[0].score[1],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[1],
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: "3",
            values: [{
                value: data_grouped[0].score[2],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[2],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "4",
            values: [{
                value: data_grouped[0].score[3],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[3],
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: "5",
            values: [{
                value: data_grouped[0].score[4],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[4],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "6",
            values: [{
                value: data_grouped[0].score[5],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[5],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "7",
            values: [{
                value: data_grouped[0].score[6],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[6],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "8",
            values: [{
                value: data_grouped[0].score[7],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[7],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "9",
            values: [{
                value: data_grouped[0].score[8],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[8],
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "10",
            values: [{
                value: data_grouped[0].score[9],
                rate: "Single Test Subject"
            }, {
                value: data_grouped[1].score[9],
                rate: "Pairs of Test Subjects"
            }]
        }

    ]

    var data_sp_perc = [{

            categorie: "1",
            values: [{
                value: (data_grouped[0].score[0] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[0] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: "2",
            values: [{
                value: (data_grouped[0].score[1] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[1] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: "3",
            values: [{
                value: (data_grouped[0].score[2] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[2] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "4",
            values: [{
                value: (data_grouped[0].score[3] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[3] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: "5",
            values: [{
                value: (data_grouped[0].score[4] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[4] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "6",
            values: [{
                value: (data_grouped[0].score[5] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[5] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "7",
            values: [{
                value: (data_grouped[0].score[6] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[6] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "8",
            values: [{
                value: (data_grouped[0].score[7] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[7] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "9",
            values: [{
                value: (data_grouped[0].score[8] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[8] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        }, {
            categorie: "10",
            values: [{
                value: (data_grouped[0].score[9] / tot_ans_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[9] / tot_ans_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        }

    ]


    var data_all = [{
            categorie: "1",
            values: [{
                value: data_alll[0].score[0],
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "2",
            values: [{
                value: data_alll[0].score[1],
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "3",
            values: [{
                value: data_alll[0].score[2],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "4",
            values: [{
                value: data_alll[0].score[3],
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "5",
            values: [{
                value: data_alll[0].score[4],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "6",
            values: [{
                value: data_alll[0].score[5],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "7",
            values: [{
                value: data_alll[0].score[6],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "8",
            values: [{
                value: data_alll[0].score[7],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "9",
            values: [{
                value: data_alll[0].score[8],
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "10",
            values: [{
                value: data_alll[0].score[9],
                rate: "All Test Subjects"
            }]

        }
    ]

    var tot_ans = tot_ans_single + tot_ans_double


    var data_all_perc = [{
            categorie: "1",
            values: [{
                value: (data_alll[0].score[0] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "2",
            values: [{
                value: (data_alll[0].score[1] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "3",
            values: [{
                value: (data_alll[0].score[2] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "4",
            values: [{
                value: (data_alll[0].score[3] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "5",
            values: [{
                value: (data_alll[0].score[4] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "6",
            values: [{
                value: (data_alll[0].score[5] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "7",
            values: [{
                value: (data_alll[0].score[6] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "8",
            values: [{
                value: (data_alll[0].score[7] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "9",
            values: [{
                value: (data_alll[0].score[8] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "10",
            values: [{
                value: (data_alll[0].score[9] / tot_ans).toFixed(4),
                rate: "All Test Subjects"
            }]

        }
    ]



    document.getElementById(name + 'descriptiontextS').innerHTML = 'Durchschnitt (Single): ' + avg_single
    document.getElementById(name + 'descriptiontextD').innerHTML = 'Durchschnitt (Pairs): ' + avg_double
    document.getElementById(name + 'descriptiontextA').innerHTML = 'Durchschnitt (Alle): ' + avg_all

    draw_chart(data_all, data_all_perc, 'All' + name, ['rosybrown', 'grey'], -1, name); //'rgb(87, 162, 192)', 'rgb(235, 122, 69)']);

    draw_chart(data_sp, data_sp_perc, name, ['rgb(87, 162, 192)', 'rgb(235, 122, 69)', 'grey'], -1, name);
    draw_chart_group(data_sp, data_sp_perc, quest, selector1, selector2, tog, name, ['rgb(87, 162, 192)', 'rgb(235, 122, 69)', 'grey'], -1, name, 'score');





}

function threeOpt(data_alt, quest, selector1, selector2, tog, name, A, B, C) {

    single = data_alt.filter(d => d.Group == 0);
    double = data_alt.filter(d => d.Group > 0);

    var data_grouped = [{
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

    var data_alles = [{
        Group: 'All',
        score: [
            data_grouped[0].score[0] + data_grouped[1].score[0],
            data_grouped[0].score[1] + data_grouped[1].score[1],
            data_grouped[0].score[2] + data_grouped[1].score[2]

        ]
    }]
    var tot_single = single.filter(d => d[quest] >= 0 && d[quest] <= 2).length;
    var tot_double = double.filter(d => d[quest] >= 0 && d[quest] <= 2).length;

    var data_all = [{
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

    var data_sp = [{
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
    var data_sp_perc = [{
            categorie: A,
            values: [{
                value: (data_grouped[0].score[0] / tot_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[0] / tot_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: B,
            values: [{
                value: (data_grouped[0].score[1] / tot_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[1] / tot_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        },
        {
            categorie: C,
            values: [{
                value: (data_grouped[0].score[2] / tot_single).toFixed(4),
                rate: "Single Test Subject"
            }, {
                value: (data_grouped[1].score[2] / tot_double).toFixed(4),
                rate: "Pairs of Test Subjects"
            }]
        }
    ]



    //draw the chart

    //-----------------------------------------------------------------------------------


    var margin = { top: 50, right: 10, bottom: 30, left: 40 },
        width = window.innerHeight * 0.9 - margin.left - margin.right,
        height = window.innerHeight * 0.6 - margin.top - margin.bottom;

    //    if (w == -1) width *= 1.3
    var color = d3.scaleOrdinal()
        .range(['rgb(87, 162, 192)', 'rgb(235, 122, 69)']);

    var color_all = d3.scaleOrdinal()
        .range(['rosybrown']);


    var x0 = d3.scaleBand()
        .rangeRound([0, width]).padding(0.1);
    var x0_all = d3.scaleBand()
        .rangeRound([0, width]).padding(0.1);
    var x0_g = d3.scaleBand()
        .rangeRound([0, width]).padding(0.1);

    var x1 = d3.scaleBand();
    var x1_all = d3.scaleBand();
    var x1_g = d3.scaleBand();


    var y = d3.scaleLinear()
        .range([height, 0]);
    var y_all = d3.scaleLinear()
        .range([height, 0]);
    var y_g = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(x0)
        .tickSize(0);
    var xAxis_all = d3.axisBottom()
        .scale(x0_all)
        .tickSize(0);
    var xAxis_g = d3.axisBottom()
        .scale(x0_g)
        .tickSize(0)

    var yAxis = d3.axisLeft()
        .scale(y);
    var yAxis_all = d3.axisLeft()
        .scale(y_all);
    var yAxis_g = d3.axisLeft()
        .scale(y_g)


    var svg = d3.select('#' + name).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg_all = d3.select('#All' + name).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg_g = d3.select('#Group' + name).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var categoriesNames = data_sp.map(function(d) { return d.categorie; });
    var categoriesNames_g = data_sp.map(function(d) { return d.categorie; });
    var categoriesNames_all = data_all.map(function(d) { return d.categorie; });

    var rateNames = data_sp[0].values.map(function(d) { return d.rate; });
    var rateNames_g = data_sp[0].values.map(function(d) { return d.rate; });
    var rateNames_all = data_all[0].values.map(function(d) { return d.rate; });


    x0.domain(categoriesNames);
    x0_all.domain(categoriesNames_all);
    x0_g.domain(categoriesNames_g);
    x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
    x1_all.domain(rateNames_all).rangeRound([0, x0_all.bandwidth()]);
    x1_g.domain(rateNames_g).rangeRound([0, x0_g.bandwidth()]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg_all.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_all);
    svg_g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_g);

    y.domain([0, d3.max(data_sp, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })])
    y_all.domain([0, d3.max(data_all, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })])
    y_g.domain([0, d3.max(data_g, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })])


    svg.append("g")
        .attr("class", "y axis")
        .attr("id", 'yax') //changed
        .style('opacity', '0')
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight', 'bold')
        .text("Value");

    svg_all.append("g")
        .attr("class", "y axis")
        .attr("id", 'yax') //changed
        .style('opacity', '0')
        .call(yAxis_all)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight', 'bold')
        .text("Value");
    svg_g.append("g")
        .attr("class", "y axis")
        .attr("id", 'yax') //changed
        .style('opacity', '0')
        .call(yAxis_g)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight', 'bold')
        .text("Value");

    svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');
    svg_g.select('.y').transition().duration(500).delay(1300).style('opacity', '1');
    svg_all.select('.y').transition().duration(500).delay(1300).style('opacity', '1');


    update(data, true, false);
    update_g(data, true, false);


    var slice_all = svg_all.selectAll(".slice")
        .data(data_all)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0_all(d.categorie) + ",0)"; });

    var u_all = slice_all.selectAll("rect")
        .data(function(d) { return d.values; })

    u_all.enter().append("rect")
        .attr('class', 'bar')
        .attr("x", function(d) { return x1_all(d.rate); })
        .attr("y", function(d) { return y_all(0); })
        .attr("width", x1_all.bandwidth())
        .attr("height", function(d) { return height - y_all(0); })
        .style("fill", function(d) { return color(d.rate) })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
        })
        .on("mouseout", function(d, i) {
            d3.select(this).style("fill", color(d.rate));
        });
    slice_all.selectAll("rect")
        .transition()
        .delay(function(d) { return Math.random() * 1000; })
        .duration(1000)
        .attr("y", function(d) { return y_all(d.value); })
        .attr("height", function(d) { return height - y_all(d.value); });

    //label


    var label_all = slice_all.selectAll(".bartext")
        .data(function(d) { return d.values; })
        .enter()
        .append("text")
        .attr("class", "bartext")
        .attr("text-anchor", "middle")
        .style("opacity", "0")
        .attr("fill", "black")
        .attr("x", function(d) { return x1_all(d.rate) + (x1_all.bandwidth() / 2); })
        .attr("y", function(d) { return y_all(d.value) - 3 })
        .text(function(d) {
            if (d.value == 0) return ""
            if (perc) return (d.value * 100).toFixed(1) + "%"
            return d.value;
        })
        .style('font-size', '12px');

    label_all.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

    //Legend
    var legend_all = svg_all.selectAll(".legend")
        .data(data_all[0].values.map(function(d) { return d.rate; }))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + ((i * 20) - margin.top) + ")"; })
        .style("opacity", "0")
        .style('font-size', '12px')


    legend_all.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); });

    legend_all.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    legend_all.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");


    d3.selectAll('.check' + name).on('change', function() {
        var datas_group = [];

        datas_group = filter_data(selector1, selector2, quest, 'threeopt', [], 'title', A, B, C);
        data_group = datas_group[0];
        data_group_perc = datas_group[1];

        if (this.checked) {
            update_g(data_group_perc, false, true)
            update(data_sp_perc, false, true)
        } else {
            update(data_sp, false, false)
            update_g(data_group, false, false)

        }

    });


    d3.selectAll('#' + tog).on('click', function() {
        console.log('apply')
        console.log(tog)
        var datas_group = [];

        datas_group = filter_data(selector1, selector2, quest, 'threeopt', [], 'title', A, B, C);

        data_group = datas_group[0];
        data_group_perc = datas_group[1];

        console.log(d3.select('.check' + name).property("checked"))
        if (d3.select('.check' + name).property("checked")) {
            update_g(data_group_perc, false, true)
        } else {
            update_g(data_group, false, false)

        }

    });



    function update(data_, first, perc) {
        if (perc) {
            var yAxis = d3.axisLeft().tickFormat(d => Math.round(d * 100))
                .scale(y)
        } else {
            var yAxis = d3.axisLeft()
                .scale(y)
        }
        if (!first) svg.selectAll(".bartext").remove()
        svg.selectAll("#yax").remove()

        y.domain([0, d3.max(data_, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })])

        svg.selectAll([".bar", ".slice"])
            .remove()
            .exit()
            .data(data_)

        var slice = svg.selectAll(".slice")
            .data(data_)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

        var u = slice.selectAll("rect")
            .data(function(d) { return d.values; })

        u.enter().append("rect")
            .attr('class', 'bar')
            .attr("x", function(d) { return x1(d.rate); })
            .attr("y", function(d) { return y(0); })
            .attr("width", x1.bandwidth())
            .attr("height", function(d) { return height - y(0); })
            .style("fill", function(d) { return color(d.rate) })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
            })
            .on("mouseout", function(d, i) {
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
            .attr("y", function(d) { return y(d.value) - 3 })
            .text(function(d) {
                if (d.value == 0) return ""
                if (perc) return (d.value * 100).toFixed(1) + "%"
                return d.value;
            })
            .style('font-size', '12px');

        label.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

        //Legend
        var legend = svg.selectAll(".legend")
            .data(data_[0].values.map(function(d) { return d.rate; }))
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

        // Remove old elements

        svg.append("g")
            .attr("class", "y axis")
            .attr("id", 'yax')
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

    }

    function update_g(data_, first, perc) {

        if (perc) {
            var yAxis_g = d3.axisLeft().tickFormat(d => Math.round(d * 100))
                .scale(y_g)
        } else {
            var yAxis_g = d3.axisLeft()
                .scale(y_g)
        }
        if (!first) svg_g.selectAll(".bartext").remove()
        svg_g.selectAll("#yax").remove()

        y_g.domain([0, d3.max(data_, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })])

        svg_g.selectAll([".bar", ".slice"])
            .remove()
            .exit()
            .data(data_)

        var slice_g = svg_g.selectAll(".slice")
            .data(data_)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0_g(d.categorie) + ",0)"; });

        var u_g = slice_g.selectAll("rect")
            .data(function(d) { return d.values; })

        u_g.enter().append("rect")
            .attr('class', 'bar')
            .attr("x", function(d) { return x1(d.rate); })
            .attr("y", function(d) { return y_g(0); })
            .attr("width", x1.bandwidth())
            .attr("height", function(d) { return height - y_g(0); })
            .style("fill", function(d) { return color(d.rate) })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
            })
            .on("mouseout", function(d, i) {
                d3.select(this).style("fill", color(d.rate));
            });
        slice_g.selectAll("rect")
            .transition()
            .delay(function(d) { return Math.random() * 1000; })
            .duration(1000)
            .attr("y", function(d) { return y_g(d.value); })
            .attr("height", function(d) { return height - y_g(d.value); });

        //label


        var label_g = slice_g.selectAll(".bartext")
            .data(function(d) { return d.values; })
            .enter()
            .append("text")
            .attr("class", "bartext")
            .attr("text-anchor", "middle")
            .style("opacity", "0")
            .attr("fill", "black")
            .attr("x", function(d) { return x1(d.rate) + (x1.bandwidth() / 2); })
            .attr("y", function(d) { return y_g(d.value) - 3 })
            .text(function(d) {
                if (d.value == 0) return ""
                if (perc) return (d.value * 100).toFixed(1) + "%"
                return d.value;
            })
            .style('font-size', '12px');

        label_g.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

        //Legend
        var legend_g = svg_g.selectAll(".legend")
            .data(data_[0].values.map(function(d) { return d.rate; }))
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + ((i * 20) - margin.top) + ")"; })
            .style("opacity", "0")
            .style('font-size', '12px')


        legend_g.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) { return color(d); });

        legend_g.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        legend_g.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

        // Remove old elements

        svg_g.append("g")
            .attr("class", "y axis")
            .attr("id", 'yax')
            .style('opacity', '0')
            .call(yAxis_g)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Value");

        svg_g.select('.y').transition().duration(500).delay(1300).style('opacity', '1');
    }



    //-----------------------------------------------------------------------------------

}