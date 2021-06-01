function grouped_bar_chart_horz() {

    Promise.all([d3.json('../data/Questionnaire.json'), d3.json('../data/textdesc.json'), d3.json('../data/quotes.json')]).then(function(datas) {
        var data = datas[0]
        textdesc = datas[1][0]
        var quotes = datas[2][0]


        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q1.21", $Qonetwo_1, $Qonetwo_2, 'Qonetwo', 'tog12g', [32, 16, 8, 4, 1], ['Raumwirkung', 'Privatsphäre', 'Lichtverhältnisse', 'Raumbelüftung', 'Andere'], 0.7) //['Drehschrank', 'Drehwand', 'Lampe Drehwand', 'Lampe Aussenwand']
        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q1.7", $Qoneseven_1, $Qoneseven_2, 'Qoneseven', 'tog17g', [512, 128, 32, 16, 8, 4, 2, 1], ['Bewegliche Teile', 'Podest', 'Akustische Trennung', 'Stauraum', 'Handhabung', 'Fixierung Lampen', 'Spiegel', 'N/A'], 1)

        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q2.4", $Qtwofour_1, $Qtwofour_2, 'Qtwofour', 'tog24g', [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1], ['Vorhang', 'Boden', 'Chromstahl', 'Bad', 'Wand', 'Griffe', 'Balkon', 'Tisch', 'Drehwand', 'Andere', 'N/A'], 1)

        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q3.2", $Qthreetwo_1, $Qthreetwo_2, 'Qthreetwo', 'tog32g', [8, 4, 2, 1], ['Nicht gut', 'Nur Visuell', 'Gut', 'Andere'], 0.6)
        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q3.3", $Qthreethree_1, $Qthreethree_2, 'Qthreethree', 'tog33g', [4096, 2048, 1024, 512, 256, 64, 32, 16, 8, 4, 2, 1], ['Schlafen', 'Tag/Nacht', 'Besuch/Raum', 'Küche', 'Privatsphäre', 'Lichtverhältnisse', 'Belüftung', 'Verbindung', 'Arbeitsraum', 'halb offen', 'Nein, keine', 'Andere'], 1.1)

        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q5.1", $Qfiveone_1, $Qfiveone_2, 'Qfiveone', 'tog51g', [32, 16, 8, 4, 2, 1], ['Vereinbarung', 'Raumteiler', 'relativ fix', 'Situativ', 'Individuell', ' N/A'], 0.7)
        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q5.3", $Qfivethree_1, $Qfivethree_2, 'Qfivethree', 'tog53g', [16, 8, 2, 1], ['keine Absprache', 'Absprache', 'Andere', 'N/A'], 0.6)

        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q6.1", $Qsixone_1, $Qsixone_2, 'Qsixone', 'tog61g', [16192, 8096, 4096, 2048, 256, 128, 64, 32, 16, 8, 4, 2, 1], ['Sitzgelegenheit', 'Drehwand', 'Lichtverhältnisse', 'Stauraum', 'Temperatur', 'Arbeitsplatz', 'Arreiterung', 'Garderobe', 'Bad', 'Küche', 'Schlafraum', 'Andere', 'N/A', ], 1.1)
        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q6.2", $Qsixtwo_1, $Qsixtwo_2, 'Qsixtwo', 'tog62g', [512, 256, 128, 32, 16, 8, 4, 2, 1], ['Dimension', 'Grösse', 'Podest', 'Funktionalität', 'Akustische Trennung', 'Griffe', 'Lampen', 'Drehschrank', 'N/A'], 0.9)
        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q6.3", $Qsixthree_1, $Qsixthree_2, 'Qsixthree', 'tog63g', [256, 128, 64, 4, 2, 1], ['Tisch', 'Lampen', 'Kleiderstange', 'Bett', 'Andere', 'N/A'], 0.6)
        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q6.4", $Qsixfour_1, $Qsixfour_2, 'Qsixfour', 'tog64g', [256, 128, 32, 8, 2, 1], ['Tag/Nacht', 'Verschlossen (S)', 'Offen (S)', 'Elemente', 'Morgens', 'N/A'], 0.8)
        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q6.5", $Qsixfive_1, $Qsixfive_2, 'Qsixfive', 'tog65g', [128, 64, 32, 16, 8, 4, 2, 1], ['Schlaf', 'Podestsitz', 'Trennung', 'Besuch', 'Raumbelüftung', 'Arbeit', 'Kochen', 'N/A'], 0.8)
        draw_grouped_bar_chart_horz(data, textdesc, quotes, "q6.6", $Qsixsix_1, $Qsixsix_2, 'Qsixsix', 'tog66g', [16, 8, 4, 2, 1], ['Ja', 'Nein', 'Arbeitsplatz', 'Jahreszeit', 'N/A'], 0.6)

    })
}


function draw_grouped_bar_chart_horz(data_alt, textdesc, quotes, quest, selector1, selector2, name, tog, powTwo, title, h) {

    //-----------------PREPARE DATA------------------------------------
    data = [];
    bins_single = [];
    bins_double = [];

    decs_single = (data_alt.filter(d => d.Group == 0)).map(d => d[quest])
    decs_double = (data_alt.filter(d => d.Group > 0)).map(d => d[quest])



    bins_single = decode(decs_single);
    bins_double = decode(decs_double);



    function decode(decs) {
        bins = [];
        for (i = 0; i < decs.length; i++) {
            x = []

            if (decs[i] != "") {

                for (j = 0; j < powTwo.length; j++) {
                    if (decs[i] >= powTwo[j]) {
                        x.unshift(1);

                        decs[i] = decs[i] - powTwo[j];
                    } else {
                        x.unshift(0)
                    }

                }
                bins.push(x);
            }
        }

        return bins
    }

    s = [];
    d = [];
    a = [];

    for (var i = 0; i < powTwo.length; i++) {
        s.push(bins_single.map(d => d[i]).filter(d => d == 1).length)
        d.push(bins_double.map(d => d[i]).filter(d => d == 1).length)
        a.push(s[i] + d[i]);
    }

    var data = [];
    var data_all = [];
    var data_all_perc = [];

    var data_perc = [];
    var tot_single = 0;
    var tot_double = 0;
    var tot_alles = 0


    for (var i = 0; i < powTwo.length; i++) {
        data.push({
            categorie: title[i],
            values: [{
                    value: s[i],
                    rate: "Single Test Subject",
                    index: i
                },
                {
                    value: d[i],
                    rate: "Pairs of Test Subjects",
                    index: i

                }
            ]
        });
        tot_single += s[i];
        tot_double += d[i];
        tot_alles += s[i] + d[i];

        data_all.push({
            categorie: title[i],
            values: [{
                value: a[i],
                rate: "All Test Subjects",
                index: i
            }]
        })
        data_all_perc.push({
            categorie: title[i],
            values: [{
                value: parseFloat(a[i]),
                rate: "All Test Subjects",
                index: i
            }]
        })
    }

    for (var i = 0; i < data_all_perc.length; i++) {
        var a = parseFloat(data_all_perc[i].values[0].value);

        data_all_perc[i].values[0].value = (a == 0) ? 0 : ((a / tot_alles * 100).toFixed(1));

    }
    //console.table(data_all_perc)





    for (var i = 0; i < data.length; i++) {
        data_perc.push({
            categorie: title[i],
            values: [{
                    value: ((s[i] == 0) ? 0 : parseFloat((s[i] / tot_single * 100).toFixed(1))),
                    rate: "Single Test Subject",
                    index: i
                },
                {
                    value: ((d[i] == 0) ? 0 : parseFloat((d[i] / tot_double * 100).toFixed(1))),
                    rate: "Pairs of Test Subjects",
                    index: i

                }
            ]
        });
    }




    //---------------------CHART---------------------------------



    var margin = { top: 50, right: 20, bottom: 30, left: 120 },
        width = window.innerHeight * 1 - margin.left - margin.right,
        height = window.innerHeight * h - margin.top - margin.bottom;

    var color = d3.scaleOrdinal()
        .range(['rgb(87, 162, 192)', 'rgb(235, 122, 69)']);

    var color_all = d3.scaleOrdinal()
        .range(['rosybrown']);
    var color_g = d3.scaleOrdinal()
        .range(['darkseagreen', 'darksalmon']);
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



    var categoriesNames = data.map(function(d) { return d.categorie; });
    var categoriesNames_g = data.map(function(d) { return d.categorie; });
    var categoriesNames_all = data_all.map(function(d) { return d.categorie; });

    var rateNames = data[0].values.map(function(d) { return d.rate; });
    var rateNames_g = data[0].values.map(function(d) { return d.rate; });
    var rateNames_all = data_all[0].values.map(function(d) { return d.rate; });


    var x = d3.scaleLinear().range([0, width]);
    var x_g = d3.scaleLinear().range([0, width]);
    var x_all = d3.scaleLinear().range([0, width]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(5)
        .tickSize(0);

    var xAxis_all = d3.axisBottom()
        .scale(x_all)
        .ticks(5)
        .tickSize(0);

    var xAxis_g = d3.axisBottom()
        .scale(x_g)
        .ticks(5)
        .tickSize(0);

    var y0 = d3.scaleBand()
        .rangeRound([0, height]).padding(0.1);
    var y0_all = d3.scaleBand()
        .rangeRound([0, height]).padding(0.1);
    var y0_g = d3.scaleBand()
        .rangeRound([0, height]).padding(0.1);

    var y1 = d3.scaleBand();
    var y1_all = d3.scaleBand();
    var y1_g = d3.scaleBand();

    var yAxis = d3.axisLeft()
        .scale(y0)
    var yAxis_all = d3.axisLeft()
        .scale(y0_all)
    var yAxis_g = d3.axisLeft()
        .scale(y0_g)

    y0.domain(categoriesNames);
    y1.domain(rateNames).rangeRound([0, y0.bandwidth()]);
    x.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

    y0_all.domain(categoriesNames_all);
    y1_all.domain(rateNames_all).rangeRound([0, y0_all.bandwidth()]);
    x_all.domain([0, d3.max(data_all, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

    y0_g.domain(categoriesNames_g);
    y1_g.domain(rateNames_g).rangeRound([0, y0_g.bandwidth()]);
    x_g.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);


    //----------------------------------------
    svg.append("g")
        .attr("class", "x axis")
        .attr("id", "xax")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight', 'bold')
        .text("Value"); //To change the font size of texts

    svg_all.append("g")
        .attr("class", "x axis")
        .attr("id", "xax_all")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_all)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight', 'bold')
        .text("Value");

    svg_g.append("g")
        .attr("class", "x axis")
        .attr("id", "xax_group")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_g)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight', 'bold')
        .text("Value");

    svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');
    svg_all.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

    update(data, true, false);
    update_all(data_all, true, false);


    //all----------------------------------------------------------------------------------
    /*
        var slice_all = svg_all.selectAll(".slice")
            .data(data_all)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) {
                return "translate(0 , " + y0_all(d.categorie) + ")";
            }) //


        slice_all.selectAll("rect")
            .data(function(d) { return d.values; })
            .enter().append("rect")
            .attr("height", y1_all.bandwidth())
            .attr("y", function(d) { return y1_all(d.rate); })
            .style("fill", function(d) { return color_all(d.rate) })
            .attr("x", function(d) { return 0 })
            .attr("width", function(d) { return 0; })
            .on("click", function(d, i) {

                document.getElementById(name + 'description').innerHTML = textdesc[name][d.index]
                document.getElementById(name + 'description_quotes').innerHTML = quotes[name][d.index]
                document.getElementById(name + 'description_title').innerHTML = title[d.index] + ':'
            })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color_all(d.rate)).darker(2));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color_all(d.rate));
            });
        slice_all.selectAll("rect")
            .transition()
            .delay(function(d) { return Math.random() * 1000; })
            .duration(1000)
            .attr("x", function(d) { return 0; })
            .attr("width", function(d) { return x_all(d.value); });
        svg_all.append("g")
            .attr("class", "y axis")
            .style('opacity', '0')
            .call(yAxis_all)


        svg_all.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

        var label_all = slice_all.selectAll(".bartext")
            .data(function(d) { return d.values; })
            .enter()
            .append("text")
            .attr("class", "bartext")
            .attr("text-anchor", "middle")
            .style("opacity", "0")
            .attr("fill", "black")
            .attr("y", function(d) { return y1_all(d.rate) + (y1_all.bandwidth() / 2) + 4; })
            .attr("x", function(d) { return x_all(d.value) - margin.right + 5 })
            .text(function(d) {
                if (d.value == 0) return ""
                return d.value;
            })
            .style('font-size', '12px');

        label_all.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

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
        //all fertig----------------------------------------------------------------------------------
        */

    //sp----------------------------------------------------------------------------------

    function update(data_, first, perc) {

        if (!first) svg.selectAll(".bartext").remove()
        svg.selectAll("#xax").remove()

        categoriesNames = data_.map(function(d) { return d.categorie; });
        rateNames = data_[0].values.map(function(d) { return d.rate; });

        x.domain([0, d3.max(data_, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

        y0.domain(categoriesNames);
        y1.domain(rateNames).rangeRound([0, y0.bandwidth()]);


        svg.selectAll([".bar", ".slice"])
            .remove()
            .exit()
            .data(data_)

        var slice = svg.selectAll(".slice")
            .data(data_)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(0 , " + y0(d.categorie) + ")"; }) //


        var u = slice.selectAll("rect")
            .data(function(d) { return d.values; })

        u.enter().append("rect")
            .attr('class', 'bar')
            .attr("height", y1.bandwidth())
            .attr("y", function(d) { return y1(d.rate); })
            .style("fill", function(d) { return color(d.rate) })
            .attr("x", function(d) { return 0 })
            .attr("width", function(d) { return 0; })
            .on("click", function(d, i) {

                document.getElementById(name + 'description').innerHTML = textdesc[name][d.index]
                document.getElementById(name + 'description_quotes').innerHTML = quotes[name][d.index]
                document.getElementById(name + 'description_title').innerHTML = title[d.index] + ':'
            })
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
            .attr("x", function(d) { return 0; })
            .attr("width", function(d) { return x(d.value); });


        svg.append("g")
            .attr("class", "y axis")
            .style('opacity', '0')
            .call(yAxis)


        svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

        //label

        var label = slice.selectAll(".bartext")
            .data(function(d) { return d.values; })
            .enter()
            .append("text")
            .attr("class", "bartext")
            .attr("text-anchor", "middle")
            .style("opacity", "0")
            .attr("fill", "black")
            .attr("y", function(d) { return y1(d.rate) + (y1.bandwidth() / 2) + 4; })
            .attr("x", function(d) { return x(d.value) - margin.right + 5 })
            .text(function(d) {
                if (d.value == 0) return ""

                if (perc) return d.value + '%';

                return d.value;
            })
            .style('font-size', '12px');

        label.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");


        //Legend
        var legend = svg.selectAll(".legend")
            .data(data[0].values.map(function(d) { return d.rate; }))
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

        //----------------------------------------
        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "xax")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text").attr("id", "xax")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Value"); //To change the font size of texts
    }

    //sp fertig----------------------------------------------------------------------------------
    //all
    function update_all(data_, first, perc) {

        if (!first) svg_all.selectAll(".bartext").remove()
        svg_all.selectAll("#xax_all").remove()

        categoriesNames_all = data_.map(function(d) { return d.categorie; });
        rateNames_all = data_[0].values.map(function(d) { return d.rate; });

        x_all.domain([0, d3.max(data_, function(categorie) { return d3.max(categorie.values, function(d) { return parseFloat(d.value); }); })]);
        //console.log('maxmaxmaxmax')
        //console.log(d3.max(data_, function(categorie) { return d3.max(categorie.values, function(d) { return parseFloat(d.value); }); }))
        y0_all.domain(categoriesNames_all);
        y1_all.domain(rateNames_all).rangeRound([0, y0_all.bandwidth()]);


        svg_all.selectAll([".bar", ".slice"])
            .remove()
            .exit()
            .data(data_)

        var slice = svg_all.selectAll(".slice")
            .data(data_)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(0 , " + y0_all(d.categorie) + ")"; }) //


        var u = slice.selectAll("rect")
            .data(function(d) { return d.values; })

        u.enter().append("rect")
            .attr('class', 'bar')
            .attr("height", y1_all.bandwidth())
            .attr("y", function(d) { return y1_all(d.rate); })
            .style("fill", function(d) { return color_all(d.rate) })
            .attr("x", function(d) { return 0 })
            .attr("width", function(d) { return 0; })
            .on("click", function(d, i) {

                document.getElementById(name + 'description').innerHTML = textdesc[name][d.index]
                document.getElementById(name + 'description_quotes').innerHTML = quotes[name][d.index]
                document.getElementById(name + 'description_title').innerHTML = title[d.index] + ':'
            })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color_all(d.rate)).darker(2));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color_all(d.rate));
            });

        slice.selectAll("rect")
            .transition()
            .delay(function(d) { return Math.random() * 1000; })
            .duration(1000)
            .attr("x", function(d) { return 0; })
            .attr("width", function(d) { return x_all(d.value); });


        svg_all.append("g")
            .attr("class", "y axis")
            .style('opacity', '0')
            .call(yAxis_all)


        svg_all.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

        //label

        var label = slice.selectAll(".bartext")
            .data(function(d) { return d.values; })
            .enter()
            .append("text")
            .attr("class", "bartext")
            .attr("text-anchor", "middle")
            .style("opacity", "0")
            .attr("fill", "black")
            .attr("y", function(d) { return y1_all(d.rate) + (y1_all.bandwidth() / 2) + 4; })
            .attr("x", function(d) { return x_all(d.value) - margin.right + 5 })
            .text(function(d) {
                if (d.value == 0) return ""

                if (perc) return d.value + '%';

                return d.value;
            })
            .style('font-size', '12px');

        label.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");


        //Legend
        var legend = svg_all.selectAll(".legend")
            .data(data[0].values.map(function(d) { return d.rate; }))
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

        //----------------------------------------
        svg_all.append("g")
            .attr("class", "x axis")
            .attr("id", "xax_all")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis_all)
            .append("text").attr("id", "xax_all")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Value"); //To change the font size of texts

        svg_all.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

    }
    //all ferig
    //group----------------------------------------------------------------------------------
    svg_g.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

    update_g(data, true, false);



    d3.selectAll('#' + tog).on('click', function() {
        //console.log('apply')
        //console.log(tog)
        var datas_group = [];

        datas_group = filter_data(selector1, selector2, quest, 'horz', powTwo, title);

        data_group = datas_group[0];
        data_group_perc = datas_group[1];

        //console.log(d3.select('.check' + name).property("checked"))
        if (d3.select('.check' + name).property("checked")) {
            update_g(data_group_perc, false, true)
        } else {
            update_g(data_group, false, false)

        }

    });

    function update_g(data_, first, perc) {

        if (!first) svg_g.selectAll(".bartext").remove()
        svg_g.selectAll("#xax_group").remove()

        svg_g.selectAll(".legend").remove()


        categoriesNames_g = data_.map(function(d) { return d.categorie; });
        rateNames_g = data_[0].values.map(function(d) { return d.rate; });

        x_g.domain([0, d3.max(data_, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

        y0_g.domain(categoriesNames_g);
        y1_g.domain(rateNames_g).rangeRound([0, y0_g.bandwidth()]);


        svg_g.selectAll([".bar", ".slice"])
            .remove()
            .exit()
            .data(data_)

        var slice = svg_g.selectAll(".slice")
            .data(data_)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(0 , " + y0_g(d.categorie) + ")"; }) //


        var u = slice.selectAll("rect")
            .data(function(d) { return d.values; })

        u.enter().append("rect")
            .attr('class', 'bar')
            .attr("height", y1_g.bandwidth())
            .attr("y", function(d) { return y1_g(d.rate); })
            .style("fill", function(d) { return color_g(d.rate) })
            .attr("x", function(d) { return 0 })
            .attr("width", function(d) { return 0; })
            .on("click", function(d, i) {

                document.getElementById(name + 'description').innerHTML = textdesc[name][d.index]
                document.getElementById(name + 'description_quotes').innerHTML = quotes[name][d.index]
                document.getElementById(name + 'description_title').innerHTML = title[d.index] + ':'
            })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color_g(d.rate)).darker(2));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color_g(d.rate));
            });
        slice.selectAll("rect")
            .transition()
            .delay(function(d) { return Math.random() * 1000; })
            .duration(1000)
            .attr("x", function(d) { return 0; })
            .attr("width", function(d) { return x_g(d.value); });


        svg_g.append("g")
            .attr("class", "y axis")
            .style('opacity', '0')
            .call(yAxis_g)
            //----------------------------------------
        svg_g.append("g")
            .attr("class", "x axis")
            .attr("id", "xax_group")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis_g)
            .append("text")
            .attr("id", "xax_group_text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Value"); //To change the font size of texts


        svg_g.select('.y').transition().duration(500).delay(1300).style('opacity', '1');
        svg_g.select('.x').transition().duration(500).delay(1300).style('opacity', '1');

        //label

        var label = slice.selectAll(".bartext")
            .data(function(d) { return d.values; })
            .enter()
            .append("text")
            .attr("class", "bartext")
            .attr("text-anchor", "middle")
            .style("opacity", "0")
            .attr("fill", "black")
            .attr("y", function(d) { return y1_g(d.rate) + (y1_g.bandwidth() / 2) + 4; })
            .attr("x", function(d) { return x_g(d.value) - margin.right + 5 })
            .text(function(d) {
                if (d.value == 0) return ""

                if (perc) return d.value + '%';

                return d.value;
            })
            .style('font-size', '12px');

        label.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");


        //Legend
        var legend = svg_g.selectAll(".legend")
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
            .style("fill", function(d) { return color_g(d); });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        legend.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");


    }





    d3.selectAll('.check' + name).on('change', function() {
        var datas_group = [];

        datas_group = filter_data(selector1, selector2, quest, 'horz', powTwo, title);
        data_group = datas_group[0];
        data_group_perc = datas_group[1];

        if (this.checked) {
            update(data_perc, false, true)
            update_all(data_all_perc, false, true)
            update_g(data_group_perc, false, true)

        } else {
            update(data, false, false)
            update_all(data_all, false, false)
            update_g(data_group, false, false)

        }




    });


    //group fertig----------------------------------------------------------------------------------


}