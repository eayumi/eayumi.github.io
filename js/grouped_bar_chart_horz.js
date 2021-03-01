function grouped_bar_chart_horz() {

    Promise.all([d3.json('../data/Questionnaire.json'), d3.json('../data/textdesc.json')]).then(function(datas) {
        var data = datas[0]
        textdesc = datas[1][0]


        draw_grouped_bar_chart_horz(data, textdesc, "q1.21", 'Qonetwo', [32, 16, 8, 4, 1], ['Raumformung', 'Privatsphäre', 'Beleuchtung', 'Lüftung', 'Andere'], 0.7) //['Drehschrank', 'Drehwand', 'Lampe Drehwand', 'Lampe Aussenwand']
        draw_grouped_bar_chart_horz(data, textdesc, "q1.7", 'Qoneseven', [512, 256, 128, 64, 32, 16, 8, 4, 2, 1], ['Raum', 'Podest', 'Akustische Trennung', 'Stauraum', 'Handhabung', 'Fixierung Lampen', 'Drehwand', 'Spiegel', 'Andere', 'N/A'], 1)

        draw_grouped_bar_chart_horz(data, textdesc, "q2.4", 'Qtwofour', [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1], ['Vorhang', 'Boden', 'Chromstahl', 'Bad', 'Wand', 'Griffe', 'Balkon', 'Tisch', 'Drehwand', 'Andere', 'N/A'], 1)

        draw_grouped_bar_chart_horz(data, textdesc, "q3.2", 'Qthreetwo', [16, 8, 4, 2, 1], ['Nicht gut', 'Visuell', 'Gut', 'Schlafraum', 'Fenster'], 0.6)
        draw_grouped_bar_chart_horz(data, textdesc, "q3.3", 'Qthreethree', [4096, 2048, 1024, 512, 256, 64, 32, 16, 8, 4, 2, 1], ['Schlafen', 'Tag/Nacht', 'Besuch', 'Küche', 'Privatsphäre', 'Beleuchtung', 'Belüftung', 'Verbindung', 'Arbeitsraum', 'halb offen', 'Nein, keine', 'Raum'], 1.1)

        draw_grouped_bar_chart_horz(data, textdesc, "q5.1", 'Qfiveone', [32, 16, 8, 4, 2, 1], ['Vereinbarung', 'Raumteiler', 'relativ fix', 'Situativ', 'Individuell', ' N/A'], 0.7)
        draw_grouped_bar_chart_horz(data, textdesc, "q5.3", 'Qfivethree', [16, 8, 4, 2, 1], ['keine Absprache', 'Absprache', 'Situativ', 'Andere', 'N/A'], 0.6)

        draw_grouped_bar_chart_horz(data, textdesc, "q6.1", 'Qsixone', [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1], ['Sitzgelegenheit', 'Drehwand', 'Beleuchtung', '(individueller) Stauraum', 'Temperatur', 'Arbeitsplatz', 'Arreiterung', 'Garderobe', 'Bad', 'Andere', 'N / A', 'Küche', 'Schlafraum'], 1.1)
        draw_grouped_bar_chart_horz(data, textdesc, "q6.2", 'Qsixtwo', [512, 256, 128, 32, 16, 8, 4, 2, 1], ['Dimension', 'Grösse', 'Podest', 'Funktionalität', 'Akustische Trennung', 'Griffe', 'Lampen', 'Drehschrank', 'N/A'], 0.9)
        draw_grouped_bar_chart_horz(data, textdesc, "q6.3", 'Qsixthree', [128, 64, 2, 1], ['Tisch', 'Lampen', 'Andere', 'Bett'], 0.6)
        draw_grouped_bar_chart_horz(data, textdesc, "q6.4", 'Qsixfour', [128, 64, 32, 8, 2, 1], ['Tag/Nacht', 'Verschlossen (S)', 'Offen (S)', 'Elemente', 'N/A', 'Morgens'], 0.8)
        draw_grouped_bar_chart_horz(data, textdesc, "q6.5", 'Qsixfive', [128, 64, 32, 16, 8, 4, 2, 1], ['Schlaf', 'Podestsitz', 'Trennung', 'Besuch', 'Lüftung', 'Arbeit', 'Kochen', 'N/A'], 0.8)
        draw_grouped_bar_chart_horz(data, textdesc, "q6.6", 'Qsixsix', [16, 8, 4, 2, 1], ['Ja', 'Nein', 'Arbeitsplatz', 'Jahreszeit', 'N/A'], 0.6)

    })
}


function draw_grouped_bar_chart_horz(data_alt, textdesc, quest, name, powTwo, title, h) {

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

    data = [];
    data_all = [];

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
        data_all.push({
            categorie: title[i],
            values: [{
                value: a[i],
                rate: "All Test Subjects",
                index: i
            }]
        })
    }


    //---------------------CHART---------------------------------



    var margin = { top: 50, right: 20, bottom: 30, left: 120 },
        width = window.innerHeight * 1 - margin.left - margin.right,
        height = window.innerHeight * h - margin.top - margin.bottom;

    var color = d3.scaleOrdinal()
        .range(['rgb(87, 162, 192)', 'rgb(235, 122, 69)']);

    var color_all = d3.scaleOrdinal()
        .range(['rosybrown']);

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



    var categoriesNames = data.map(function(d) { return d.categorie; });
    var categoriesNames_all = data_all.map(function(d) { return d.categorie; });

    var rateNames = data[0].values.map(function(d) { return d.rate; });
    var rateNames_all = data_all[0].values.map(function(d) { return d.rate; });


    var x = d3.scaleLinear().range([0, width]);
    var x_all = d3.scaleLinear().range([0, width]);


    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(5)
        .tickSize(0);

    var xAxis_all = d3.axisBottom()
        .scale(x_all)
        .ticks(5)
        .tickSize(0);

    var y0 = d3.scaleBand()
        .rangeRound([0, height]).padding(0.1);

    var y0_all = d3.scaleBand()
        .rangeRound([0, height]).padding(0.1);

    var y1 = d3.scaleBand();
    var y1_all = d3.scaleBand();


    var yAxis = d3.axisLeft()
        .scale(y0)

    var yAxis_all = d3.axisLeft()
        .scale(y0_all)

    y0.domain(categoriesNames);
    y1.domain(rateNames).rangeRound([0, y0.bandwidth()]);
    x.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

    y0_all.domain(categoriesNames_all);
    y1_all.domain(rateNames_all).rangeRound([0, y0_all.bandwidth()]);
    x_all.domain([0, d3.max(data_all, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);


    //----------------------------------------
    svg.append("g")
        .attr("class", "x axis")
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
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_all)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight', 'bold')
        .text("Value");



    var slice = svg.selectAll(".slice")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) {
            return "translate(0 , " + y0(d.categorie) + ")";
        }) //


    slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("height", y1.bandwidth())
        .attr("y", function(d) { return y1(d.rate); })
        .style("fill", function(d) { return color(d.rate) })
        .attr("x", function(d) { return 0 })
        .attr("width", function(d) { return 0; })
        .on("click", function(d, i) {

            document.getElementById(name + 'description').innerHTML = textdesc[name][d.index]
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

    svg.append("g")
        .attr("class", "y axis")
        .style('opacity', '0')
        .call(yAxis)


    svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

    svg_all.append("g")
        .attr("class", "y axis")
        .style('opacity', '0')
        .call(yAxis_all)


    svg_all.select('.y').transition().duration(500).delay(1300).style('opacity', '1');


    //description



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
        .attr("x", function(d) { return x(d.value) - margin.right + 10 })
        .text(function(d) {
            if (d.value == 0) return ""
            return d.value;
        })
        .style('font-size', '12px');

    label.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");

    var label_all = slice_all.selectAll(".bartext")
        .data(function(d) { return d.values; })
        .enter()
        .append("text")
        .attr("class", "bartext")
        .attr("text-anchor", "middle")
        .style("opacity", "0")
        .attr("fill", "black")
        .attr("y", function(d) { return y1_all(d.rate) + (y1_all.bandwidth() / 2) + 4; })
        .attr("x", function(d) { return x_all(d.value) - margin.right + 10 })
        .text(function(d) {
            if (d.value == 0) return ""
            return d.value;
        })
        .style('font-size', '12px');

    label_all.transition().duration(500).delay(function(d, i) { return 1300 + 100 * i; }).style("opacity", "1");


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


    var legend_all = svg_all.selectAll(".legend")
        .data(data_all[0].values.map(function(d) { return d.rate; }).reverse())
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
}