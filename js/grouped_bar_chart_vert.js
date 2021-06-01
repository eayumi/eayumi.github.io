function grouped_bar_chart_vert() {
    d3.json('../data/Questionnaire.json').then(function(data) {
            draw_grouped_bar_chart_vert(data, "q1.1", $Qone_1, $Qone_2, 'tog11g', 'Qone')
            draw_grouped_bar_chart_vert(data, "q1.3", $Qonethree_1, $Qonethree_2, 'tog13g', 'Qonethree')
            draw_grouped_bar_chart_vert(data, "q1.4", $Qonefour_1, $Qonefour_2, 'tog14g', 'Qonefour')
            draw_grouped_bar_chart_vert_nonbin(data, "q1.6", $Qonesix_1, $Qonesix_2, 'tog16g', 'Qonesix')




            draw_grouped_bar_chart_vert_score(data, "q1.81", $Qoneeightone_1, $Qoneeightone_2, 'tog181g', 'Qoneeightone')
            draw_grouped_bar_chart_vert_score(data, "q1.83", $Qoneeighttwo_1, $Qoneeighttwo_2, 'tog182g', 'Qoneeighttwo')
            draw_grouped_bar_chart_vert_score(data, "q1.83", $Qoneeightthree_1, $Qoneeightthree_2, 'tog183g', 'Qoneeightthree')
            draw_grouped_bar_chart_vert_score(data, "q1.84", $Qoneeightfour_1, $Qoneeightfour_2, 'tog184g', 'Qoneeightfour')
            draw_grouped_bar_chart_vert_score(data, "q1.85", $Qoneeightfive_1, $Qoneeightfive_2, 'tog185g', 'Qoneeightfive')

            threeOpt(data, 'q2.11', $Qtwooneone_1, $Qtwooneone_2, 'tog211g', 'Qtwooneone', 'zu klein', 'weder noch', 'zu gross')
            threeOpt(data, 'q2.12', $Qtwoonetwo_1, $Qtwoonetwo_2, 'tog212g', 'Qtwoonetwo', 'zu hell', 'weder noch', 'zu dunkel')


            draw_grouped_bar_chart_vert_score(data, "q2.2", $Qtwotwo_1, $Qtwotwo_2, 'tog22g', 'Qtwotwo')

            draw_grouped_bar_chart_vert_score(data, "q2.31", $Qtwothreeone_1, $Qtwothreeone_2, 'tog231g', 'Qtwothreeone')
            draw_grouped_bar_chart_vert_score(data, "q2.32", $Qtwothreetwo_1, $Qtwothreetwo_2, 'tog232g', 'Qtwothreetwo')
            draw_grouped_bar_chart_vert_score(data, "q2.33", $Qtwothreethree_1, $Qtwothreethree_2, 'tog233g', 'Qtwothreethree')
            draw_grouped_bar_chart_vert_score(data, "q2.34", $Qtwothreefour_1, $Qtwothreefour_2, 'tog234g', 'Qtwothreefour')
            draw_grouped_bar_chart_vert_score(data, "q2.35", $Qtwothreefive_1, $Qtwothreefive_2, 'tog235g', 'Qtwothreefive')
            draw_grouped_bar_chart_vert_score(data, "q2.36", $Qtwothreesix_1, $Qtwothreesix_2, 'tog236g', 'Qtwothreesix')

            qtwofive(data, 'q2.5', 'Qtwofive', 0, $Qtwofive_1) //pie

            threeOpt(data, 'q2.6', $Qtwosix_1, $Qtwosix_2, 'tog26g', 'Qtwosix', 'zu kalt', 'angenehm', 'zu warm')

            draw_grouped_bar_chart_vert_score(data, "q3.1", $Qthreeone_1, $Qthreeone_2, 'tog31g', 'Qthreeone')

            qtwofive(data, 'q4.1', 'Qfourone', 0, $Qfourone_1)

            qtwofive(data, 'q5.2', 'Qfivetwo', 1, $Qfivetwo_1)
            qtwofive(data, 'q5.4', 'Qfivefour', 1, $Qfivefour_1)






        }


    )
}

function draw_grouped_bar_chart_vert(data_alt, quest, selector1, selector2, tog, name) {
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
    var data_grouped = [{
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

    var data_alles = [{
        Group: 'All',
        DS: data_grouped[0].DS + data_grouped[1].DS,
        DW: data_grouped[0].DW + data_grouped[1].DW,
        LD: data_grouped[0].LD + data_grouped[1].LD,
        LA: data_grouped[0].LA + data_grouped[1].LA,
    }];

    var tot_single = data_grouped[0].DS + data_grouped[0].DW + data_grouped[0].LA + data_grouped[0].LD
    var tot_double = data_grouped[1].DS + data_grouped[1].DW + data_grouped[1].LA + data_grouped[1].LD
    var tot_alles = tot_single + tot_double;
    var data_sp = [{
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

    var data_sp_perc = [{
            categorie: "Drehschrank",
            values: [{
                    value: (data_grouped[0].DS / tot_single).toFixed(4),
                    rate: "Single Test Subject"
                },
                {
                    value: (data_grouped[1].DS / tot_double).toFixed(4),
                    rate: "Pairs of Test Subjects"
                }
            ]
        },
        {
            categorie: "Drehwand",
            values: [{
                    value: (data_grouped[0].DW / tot_single).toFixed(4),
                    rate: "Single Test Subject"
                },
                {
                    value: (data_grouped[1].DW / tot_double).toFixed(4),
                    rate: "Pairs of Test Subjects"
                }
            ]
        },
        {
            categorie: "Lampe Drehwand",
            values: [{
                    value: (data_grouped[0].LD / tot_single).toFixed(4),
                    rate: "Single Test Subject"
                },
                {
                    value: (data_grouped[1].LD / tot_double).toFixed(4),
                    rate: "Pairs of Test Subjects"
                }
            ]
        }, {
            categorie: "Lampe Aussenwand",
            values: [{
                    value: (data_grouped[0].LA / tot_single).toFixed(4),
                    rate: "Single Test Subject"
                },
                {
                    value: (data_grouped[1].LA / tot_double).toFixed(4),
                    rate: "Pairs of Test Subjects"
                }
            ]
        }

    ]

    var data_all = [{
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

    var data_all_perc = [{
            categorie: "Drehschrank",
            values: [{
                value: (data_alles[0].DS / tot_alles).toFixed(4),
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "Drehwand",
            values: [{
                value: (data_alles[0].DW / tot_alles).toFixed(4),
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "Lampe Drehwand",
            values: [{
                value: (data_alles[0].LD / tot_alles).toFixed(4),
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "Lampe Aussenwand",
            values: [{
                value: (data_alles[0].LA / tot_alles).toFixed(4),
                rate: "All Test Subjects"
            }]
        }

    ]

    //---------------------CHART---------------------------------


    //-----------------------------------------------------------------------------------


    var margin = { top: 50, right: 10, bottom: 30, left: 40 },
        width = window.innerHeight * 0.9 - margin.left - margin.right,
        height = window.innerHeight * 0.6 - margin.top - margin.bottom;
    var color = d3.scaleOrdinal()
        .range(['rgb(87, 162, 192)', 'rgb(235, 122, 69)']);

    var color_all = d3.scaleOrdinal()
        .range(['rosybrown']);

    var color_g = d3.scaleOrdinal()
        .range(['darkseagreen', 'darksalmon']);
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
    y_g.domain([0, d3.max(data_sp, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })])


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


    update(data_sp, true, false);
    update_g(data_sp, true, false);


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
        .style("fill", function(d) { return color_all(d.rate) })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color_all(d.rate)).darker(2));
        })
        .on("mouseout", function(d, i) {
            d3.select(this).style("fill", color_all(d.rate));
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
        .style("fill", function(d) { return color_all(d); });

    legend_all.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    legend_all.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");


    d3.selectAll('.check' + name).on('change', function() {
        var datas_group = [];
        ////console.log('check percent')
        ////console.log(name)
        datas_group = filter_data(selector1, selector2, quest, 'vert', [], name);
        data_group = datas_group[0];
        data_group_perc = datas_group[1];

        if (this.checked) {
            update_g(data_group_perc, false, true)
            update(data_sp_perc, false, true)
            update_all(data_all_perc, false, true)

        } else {
            update(data_sp, false, false)
            update_all(data_all, false, false)
            update_g(data_group, false, false)

        }

    });


    d3.selectAll('#' + tog).on('click', function() {
        ////console.log('button')

        var datas_group = [];

        datas_group = filter_data(selector1, selector2, quest, 'vert', [], name);

        data_group = datas_group[0];
        data_group_perc = datas_group[1];

        ////console.log(d3.select('.check' + name).property("checked"))

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
            ////console.log(data_)
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

    function update_all(data_, first, perc) {
        if (perc) {
            var yAxis_all = d3.axisLeft().tickFormat(d => Math.round(d * 100))
                .scale(y_all)
        } else {
            var yAxis_all = d3.axisLeft()
                .scale(y_all)
        }
        if (!first) svg_all.selectAll(".bartext").remove()

        svg_all.selectAll("#yax").remove()
            ////console.log(data_)
        y_all.domain([0, d3.max(data_, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })])

        svg_all.selectAll([".bar", ".slice"])
            .remove()
            .exit()
            .data(data_)

        var slice = svg_all.selectAll(".slice")
            .data(data_)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0_all(d.categorie) + ",0)"; });

        var u = slice.selectAll("rect")
            .data(function(d) { return d.values; })

        u.enter().append("rect")
            .attr('class', 'bar')
            .attr("x", function(d) { return x1_all(d.rate); })
            .attr("y", function(d) { return y_all(0); })
            .attr("width", x1_all.bandwidth())
            .attr("height", function(d) { return height - y_all(0); })
            .style("fill", function(d) { return color_all(d.rate) })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color_all(d.rate)).darker(2));
            })
            .on("mouseout", function(d, i) {
                d3.select(this).style("fill", color_all(d.rate));
            });
        slice.selectAll("rect")
            .transition()
            .delay(function(d) { return Math.random() * 1000; })
            .duration(1000)
            .attr("y", function(d) { return y_all(d.value); })
            .attr("height", function(d) { return height - y_all(d.value); });

        //label


        var label = slice.selectAll(".bartext")
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
            .style("fill", function(d) { return color_all(d); });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        legend.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

        // Remove old elements

        svg_all.append("g")
            .attr("class", "y axis")
            .attr("id", 'yax')
            .style('opacity', '0')
            .call(yAxis_all)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Value");

        svg_all.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

    }

    function update_g(data_, first, perc) {
        ////console.log('group data_')

        ////console.log(data_)
        categoriesNames_g = data_.map(function(d) { return d.categorie; });
        rateNames_g = data_[0].values.map(function(d) { return d.rate; });
        x0_g.domain(categoriesNames_g);
        x1_g.domain(rateNames_g).rangeRound([0, x0_g.bandwidth()]);

        if (perc) {
            var yAxis_g = d3.axisLeft().tickFormat(d => Math.round(d * 100))
                .scale(y_g)
        } else {
            var yAxis_g = d3.axisLeft()
                .scale(y_g)
        }

        if (!first) svg_g.selectAll(".bartext").remove()
        svg_g.selectAll("#yax").remove()
        svg_g.selectAll(".legend").remove()

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
            .attr("x", function(d) { return x1_g(d.rate); })
            .attr("y", function(d) { return y_g(0); })
            .attr("width", x1_g.bandwidth())
            .attr("height", function(d) { return height - y_g(0); })
            .style("fill", function(d) { return color_g(d.rate) })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color_g(d.rate)).darker(2));
            })
            .on("mouseout", function(d, i) {
                d3.select(this).style("fill", color_g(d.rate));
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
            .attr("x", function(d) { return x1_g(d.rate) + (x1_g.bandwidth() / 2); })
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
            .style("fill", function(d) { return color_g(d); });

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

function draw_grouped_bar_chart_vert_nonbin(data_alt, quest, selector1, selector2, tog, name) {

    //-----------------PREPARE DATA------------------------------------

    single = data_alt.filter(d => d.Group == 0);
    double = data_alt.filter(d => d.Group > 0);

    var data_grouped = [{
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

    var data_alles = [{
        Group: 'All',
        w: data_grouped[0].w + data_grouped[1].w,
        m: data_grouped[0].m + data_grouped[1].m,
        y: data_grouped[0].y + data_grouped[1].y,
        n: data_grouped[0].n + data_grouped[1].n,
    }];

    var tot_single = data_grouped[0].w + data_grouped[0].m + data_grouped[0].y + data_grouped[0].n;
    var tot_double = data_grouped[1].w + data_grouped[1].m + data_grouped[1].y + data_grouped[1].n;
    var tot_alles = tot_single + tot_double;

    var data_sp = [{
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

    ];

    var data_sp_perc = [{
            categorie: "Eine Woche",
            values: [{
                    value: (data_grouped[0].w / tot_single).toFixed(4),
                    rate: "Single Test Subject"
                },
                {
                    value: (data_grouped[1].w / tot_double).toFixed(4),
                    rate: "Pairs of Test Subjects"
                }
            ]
        },
        {
            categorie: "Einen Monat",
            values: [{
                    value: (data_grouped[0].m / tot_single).toFixed(4),
                    rate: "Single Test Subject"
                },
                {
                    value: (data_grouped[1].m / tot_double).toFixed(4),
                    rate: "Pairs of Test Subjects"
                }
            ]
        },
        {
            categorie: "Ein Jahr und länger",
            values: [{
                    value: (data_grouped[0].y / tot_single).toFixed(4),
                    rate: "Single Test Subject"
                },
                {
                    value: (data_grouped[1].y / tot_double).toFixed(4),
                    rate: "Pairs of Test Subjects"
                }
            ]
        }, {
            categorie: "Nein, lieber nicht",
            values: [{
                    value: (data_grouped[0].n / tot_single).toFixed(4),
                    rate: "Single Test Subject"
                },
                {
                    value: (data_grouped[1].n / tot_double).toFixed(4),
                    rate: "Pairs of Test Subjects"
                }
            ]
        }

    ]


    var data_all = [{
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

    var data_all_perc = [{
            categorie: "Eine Woche",
            values: [{
                value: (data_alles[0].w / tot_alles).toFixed(4),
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "Einen Monat",
            values: [{
                value: (data_alles[0].m / tot_alles).toFixed(4),
                rate: "All Test Subjects"
            }]
        },
        {
            categorie: "Ein Jahr und länger",
            values: [{
                value: (data_alles[0].y / tot_alles).toFixed(4),
                rate: "All Test Subjects"
            }]
        }, {
            categorie: "Nein, lieber nicht",
            values: [{
                value: (data_alles[0].n / tot_alles).toFixed(4),
                rate: "All Test Subjects"
            }]
        }

    ]


    //---------------------CHART---------------------------------
    //-----------------------------------------------------------------------------------


    var margin = { top: 50, right: 10, bottom: 30, left: 40 },
        width = window.innerHeight * 0.9 - margin.left - margin.right,
        height = window.innerHeight * 0.6 - margin.top - margin.bottom;
    var color = d3.scaleOrdinal()
        .range(['rgb(87, 162, 192)', 'rgb(235, 122, 69)']);

    var color_all = d3.scaleOrdinal()
        .range(['rosybrown']);
    var color_g = d3.scaleOrdinal()
        .range(['darkseagreen', 'darksalmon']);

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
    y_g.domain([0, d3.max(data_sp, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })])


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


    update(data_sp, true, false);
    update_g(data_sp, true, false);


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
        .style("fill", function(d) { return color_all(d.rate) })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color_all(d.rate)).darker(2));
        })
        .on("mouseout", function(d, i) {
            d3.select(this).style("fill", color_all(d.rate));
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
        .style("fill", function(d) { return color_all(d); });

    legend_all.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    legend_all.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");


    d3.selectAll('.check' + name).on('change', function() {
        var datas_group = [];
        ////console.log('check percent')
        ////console.log(name)
        datas_group = filter_data(selector1, selector2, quest, 'nonbin', [], name);
        data_group = datas_group[0];
        data_group_perc = datas_group[1];

        if (this.checked) {
            update_g(data_group_perc, false, true)
            update(data_sp_perc, false, true)
            update_all(data_all_perc, false, true)
        } else {
            update(data_sp, false, false)
            update_g(data_group, false, false)
            update_all(data_all, false, false)


        }

    });


    d3.selectAll('#' + tog).on('click', function() {
        ////console.log('button')

        var datas_group = [];

        datas_group = filter_data(selector1, selector2, quest, 'nonbin', [], name);

        data_group = datas_group[0];
        data_group_perc = datas_group[1];

        ////console.log(d3.select('.check' + name).property("checked"))

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
            ////console.log(data_)
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

    function update_all(data_, first, perc) {
        if (perc) {
            var yAxis_all = d3.axisLeft().tickFormat(d => Math.round(d * 100))
                .scale(y_all)
        } else {
            var yAxis_all = d3.axisLeft()
                .scale(y_all)
        }
        if (!first) svg_all.selectAll(".bartext").remove()

        svg_all.selectAll("#yax").remove()
            ////console.log(data_)
        y_all.domain([0, d3.max(data_, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })])

        svg_all.selectAll([".bar", ".slice"])
            .remove()
            .exit()
            .data(data_)

        var slice = svg_all.selectAll(".slice")
            .data(data_)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0_all(d.categorie) + ",0)"; });

        var u = slice.selectAll("rect")
            .data(function(d) { return d.values; })

        u.enter().append("rect")
            .attr('class', 'bar')
            .attr("x", function(d) { return x1_all(d.rate); })
            .attr("y", function(d) { return y_all(0); })
            .attr("width", x1_all.bandwidth())
            .attr("height", function(d) { return height - y_all(0); })
            .style("fill", function(d) { return color_all(d.rate) })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color_all(d.rate)).darker(2));
            })
            .on("mouseout", function(d, i) {
                d3.select(this).style("fill", color_all(d.rate));
            });
        slice.selectAll("rect")
            .transition()
            .delay(function(d) { return Math.random() * 1000; })
            .duration(1000)
            .attr("y", function(d) { return y_all(d.value); })
            .attr("height", function(d) { return height - y_all(d.value); });

        //label


        var label_all = slice.selectAll(".bartext")
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
        var legend = svg_all.selectAll(".legend")
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
            .style("fill", function(d) { return color_all(d); });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        legend.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

        // Remove old elements

        svg_all.append("g")
            .attr("class", "y axis")
            .attr("id", 'yax')
            .style('opacity', '0')
            .call(yAxis_all)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Value");

        svg_all.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

    }

    function update_g(data_, first, perc) {
        ////console.log('group data_')

        ////console.log(data_)
        categoriesNames_g = data_.map(function(d) { return d.categorie; });
        rateNames_g = data_[0].values.map(function(d) { return d.rate; });
        x0_g.domain(categoriesNames_g);
        x1_g.domain(rateNames_g).rangeRound([0, x0_g.bandwidth()]);

        if (perc) {
            var yAxis_g = d3.axisLeft().tickFormat(d => Math.round(d * 100))
                .scale(y_g)
        } else {
            var yAxis_g = d3.axisLeft()
                .scale(y_g)
        }

        if (!first) svg_g.selectAll(".bartext").remove()
        svg_g.selectAll("#yax").remove()

        svg_g.selectAll(".legend").remove()

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
            .attr("x", function(d) { return x1_g(d.rate); })
            .attr("y", function(d) { return y_g(0); })
            .attr("width", x1_g.bandwidth())
            .attr("height", function(d) { return height - y_g(0); })
            .style("fill", function(d) { return color_g(d.rate) })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color_g(d.rate)).darker(2));
            })
            .on("mouseout", function(d, i) {
                d3.select(this).style("fill", color_g(d.rate));
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
            .attr("x", function(d) { return x1_g(d.rate) + (x1_g.bandwidth() / 2); })
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
            .style("fill", function(d) { return color_g(d); });

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