function piecharts() {
    d3.json('../data/Questionnaire.json').then(function(data_alt) {


            //-----------------PREPARE DATA------------------------------------
            data = [];
            data_raw = [];

            bins = [];
            decs = data_alt.map(d => d['q1.5']);

            for (i = 0; i < decs.length; i++) {
                powTwo = [16, 8, 4, 2, 1];
                x = [0, 0, 0, 0, 0];

                if (decs[i] == "") {
                    bins.push(-1)
                } else {
                    for (j = 0; j < 5; j++) {
                        if (decs[i] >= powTwo[j]) {
                            x[4 - j] = 1;
                            decs[i] = decs[i] - powTwo[j];
                        }
                    }
                    bins.push(x);
                }

            }


            for (i = 0; i < data_alt.length; i++) {
                bin = bins[i]
                if (bin == -1) {
                    data_raw.push({
                        Week_Year: data_alt[i].Week,
                        DS: bin,
                        DW: bin,
                        LD: bin,
                        LA: bin,
                        PO: bin,
                        Group: data_alt[i].Group
                    })
                } else {
                    data_raw.push({
                        Week_Year: data_alt[i].Week,
                        DS: bin[0],
                        DW: bin[1],
                        LD: bin[2],
                        LA: bin[3],
                        PO: bin[4],
                        Group: data_alt[i].Group
                    })
                }
            }



            data.push({ name: 'Drehschrank', Ja: 0, Nein: 0 })


            single = data_raw.filter(d => d.Group == 0);
            double = data_raw.filter(d => d.Group > 0);

            data_single = [
                { Ja: single.filter(d => d.DS == 1).length, Nein: single.filter(d => d.DS == 0).length },
                { Ja: single.filter(d => d.DW == 1).length, Nein: single.filter(d => d.DW == 0).length },
                { Ja: single.filter(d => d.LD == 1).length, Nein: single.filter(d => d.LD == 0).length },
                { Ja: single.filter(d => d.LA == 1).length, Nein: single.filter(d => d.LA == 0).length },
                { Ja: single.filter(d => d.PO == 1).length, Nein: single.filter(d => d.PO == 0).length }
            ];
            data_double = [
                { Ja: double.filter(d => d.DS == 1).length, Nein: double.filter(d => d.DS == 0).length },
                { Ja: double.filter(d => d.DW == 1).length, Nein: double.filter(d => d.DW == 0).length },
                { Ja: double.filter(d => d.LD == 1).length, Nein: double.filter(d => d.LD == 0).length },
                { Ja: double.filter(d => d.LA == 1).length, Nein: double.filter(d => d.LA == 0).length },
                { Ja: double.filter(d => d.PO == 1).length, Nein: double.filter(d => d.PO == 0).length }
            ];
            data_all = [
                { Ja: data_single[0].Ja + data_double[0].Ja, Nein: data_single[0].Nein + data_double[0].Nein },
                { Ja: data_single[1].Ja + data_double[1].Ja, Nein: data_single[1].Nein + data_double[1].Nein },
                { Ja: data_single[2].Ja + data_double[2].Ja, Nein: data_single[2].Nein + data_double[2].Nein },
                { Ja: data_single[3].Ja + data_double[3].Ja, Nein: data_single[3].Nein + data_double[3].Nein },
                { Ja: data_single[4].Ja + data_double[4].Ja, Nein: data_single[4].Nein + data_double[4].Nein }
            ];




            draw_piecharts('Single Test Subjects', data_single[0], 'Qonefiveone')
            draw_piecharts('Pairs of Test Subjects', data_double[0], 'Qonefiveone')
            draw_piecharts('All Test Subjects', data_all[0], 'Qonefiveone')

            draw_piecharts('Single Test Subjects', data_single[1], 'Qonefivetwo')
            draw_piecharts('Pairs of Test Subjects', data_double[1], 'Qonefivetwo')
            draw_piecharts('All Test Subjects', data_all[1], 'Qonefivetwo')


            draw_piecharts('Single Test Subjects', data_single[2], 'Qonefivethree')
            draw_piecharts('Pairs of Test Subjects', data_double[2], 'Qonefivethree')
            draw_piecharts('All Test Subjects', data_all[2], 'Qonefivethree')


            draw_piecharts('Single Test Subjects', data_single[3], 'Qonefivefour')
            draw_piecharts('Pairs of Test Subjects', data_double[3], 'Qonefivefour')
            draw_piecharts('All Test Subjects', data_all[3], 'Qonefivefour')


            draw_piecharts('Single Test Subjects', data_single[4], 'Qonefivefive')
            draw_piecharts('Pairs of Test Subjects', data_double[4], 'Qonefivefive')
            draw_piecharts('All Test Subjects', data_all[4], 'Qonefivefive')



        }


    )
}

function qtwofive(data_alt, q, name, opt) {

    single = data_alt.filter(d => d.Group == 0);
    double = data_alt.filter(d => d.Group > 0);
    data_single = [
        { Ja: single.filter(d => d[q] == 1).length, Nein: single.filter(d => (d[q] == 0 || d[q] == 2)).length }
    ];
    data_double = [
        { Ja: double.filter(d => d[q] == 1).length, Nein: double.filter(d => (d[q] == 0 || d[q] == 2)).length }
    ]
    data_all = [
        { Ja: data_single[0].Ja + data_double[0].Ja, Nein: data_single[0].Nein + data_double[0].Nein }

    ];

    if (opt == 1) {
        draw_piecharts('Pairs of Test Subjects', data_double[0], name)

    } else {
        draw_piecharts('Single Test Subjects', data_single[0], name)
        draw_piecharts('Pairs of Test Subjects', data_double[0], name)
        draw_piecharts('All Test Subjects', data_all[0], name)
    }

}

function draw_piecharts(title, data, name) {

    //-----------------DRAW CHART------------------------------------

    // set the dimensions and margins of the graph
    var width = window.innerWidth / 4
    height = window.innerWidth / 4
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#" + name)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(['skyblue', 'lightcoral']);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function(d) { return d.value; })
    var data_ready = pie(d3.entries(data))
        // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d) { return (color(d.data.key)) })
        .attr("stroke", "rgb(235, 122, 69)")
        .style("stroke-width", "0px")
        .style("opacity", 1)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d) { return d.data.key + "(" + d.value + ")" })
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .style("font-size", 12)

    svg.append("text")
        .attr("x", margin.right)
        .attr("y", width / 2 - width * 0.01)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .text(title);

}