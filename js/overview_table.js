function factcheck() {

    d3.json('../data/data.json').then(function(data) {
        data = data.filter(d => new Date(d.Timestamp) < new Date('08-24-2020'));
        console.log(new Date('08-24-2020'))
        console.log(data[data.length - 1])
        var data_per_element = []
        var data_Drehwand = data.filter(x => x.Sensorname === 'Drehwand'); //Sensor T3
        var data_Drehschrank = data.filter(x => x.Sensorname === 'Drehschrank'); //Sensor T2
        var data_LampeAussenwand = data.filter(x => x.Sensorname === 'LampeAussenwand'); //Sensor T1
        var data_LampeDrehwand = data.filter(x => x.Sensorname === 'LampeDrehwand'); //Sensor T4

        //i:  0 to 3
        console.log(data_Drehschrank)

        data_per_element.push(data_Drehwand);
        data_per_element.push(data_Drehschrank);
        data_per_element.push(data_LampeAussenwand);
        data_per_element.push(data_LampeDrehwand);

        var data_K_Fen_Oben_Str = data.filter(x => x.Sensorname === 'K_Fen_Oben_Str'); //Sensor 1
        var data_K_Fen_Unten_Str = data.filter(x => x.Sensorname === 'K_Fen_Unten_Str'); //Sensor 2

        data_per_element.push(data_K_Fen_Oben_Str);
        data_per_element.push(data_K_Fen_Unten_Str);

        var data_S_Fen_Oben_Str = data.filter(x => x.Sensorname === 'S_Fen_Oben_Str'); //Sensor 3
        var data_S_Fen_Unten_Str = data.filter(x => x.Sensorname === 'S_Fen_Unten_Str'); //Sensor 4
        var data_S_Boden_Wand_cyr = data.filter(x => x.Sensorname === 'S_Boden_Wand_cyr'); //Sensor 5
        var data_S_Kueche_Wand_cyr = data.filter(x => x.Sensorname === 'S_Boden_Kueche_cyr'); //Sensor 6
        var data_S_Schub_Wand_cyr = data.filter(x => x.Sensorname === 'S_Schub_Wand_cyr'); //Sensor 7
        var data_S_Schub_Kueche_cyr = data.filter(x => x.Sensorname === 'S_Schub_Kueche_cyr'); //Sensor 8

        data_per_element.push(data_S_Fen_Oben_Str);
        data_per_element.push(data_S_Fen_Unten_Str);
        data_per_element.push(data_S_Boden_Wand_cyr);
        data_per_element.push(data_S_Kueche_Wand_cyr);
        data_per_element.push(data_S_Schub_Wand_cyr);
        data_per_element.push(data_S_Schub_Kueche_cyr);

        var data_H_Putz_cyr = data.filter(x => x.Sensorname === 'H_Putz_cyr'); //Sensor 9
        var data_H_Garderobe_cyr = data.filter(x => x.Sensorname === 'H_Graderobe_cyr'); //typo //Sensor 10
        var data_H_Tuer_Str = data.filter(x => x.Sensorname === 'H_Tuer_Str'); //Sensor 11

        data_per_element.push(data_H_Putz_cyr);
        data_per_element.push(data_H_Garderobe_cyr);
        data_per_element.push(data_H_Tuer_Str);

        var data_B_Tuer_Str = data.filter(x => x.Sensorname === 'B_Tuer_Str'); //Sensor 12
        var data_B_Schrank_cyr = data.filter(x => x.Sensorname === 'B_Schrank_cyr'); //Sensor 13
        var data_B_Wasch_cyr = data.filter(x => x.Sensorname === 'B_Wasch_cyr'); //Sensor 14

        data_per_element.push(data_B_Tuer_Str);
        data_per_element.push(data_B_Schrank_cyr);
        data_per_element.push(data_B_Wasch_cyr);

        var data_W_Schub_Bad_cyr = data.filter(x => x.Sensorname === 'W_Schub_Bad_cyr'); //Sensor 15
        var data_W_Schub_Wand_cyr = data.filter(x => x.Sensorname === 'W_Schub_Wand_cyr'); //Sensor 16
        var data_W_Boden_Bad_cyr = data.filter(x => x.Sensorname === 'W_Boden_Bad_cyr'); //Sensor 17
        var data_W_Boden_Wand_cyr = data.filter(x => x.Sensorname === 'W_Boden_Wand_cyr'); //Sensor 18
        var data_W_Fen_Bad_Str = data.filter(x => x.Sensorname === 'W_Fen_Bad_Str'); //Sensor 19
        var data_W_Fen_Wand_Str = data.filter(x => x.Sensorname === 'W_Fen_Wand_Str'); //Sensor 20


        data_per_element.push(data_W_Schub_Bad_cyr);
        data_per_element.push(data_W_Schub_Wand_cyr);
        data_per_element.push(data_W_Boden_Bad_cyr);
        data_per_element.push(data_W_Boden_Wand_cyr);
        data_per_element.push(data_W_Fen_Bad_Str);
        data_per_element.push(data_W_Fen_Wand_Str);


        var data_K_Schrank_Oben_01_cyr = data.filter(x => x.Sensorname === 'K_Schrank_Oben_01_cyr'); //Sensor 21
        var data_K_Schrank_Oben_02_cyr = data.filter(x => x.Sensorname === 'K_Schrank_Oben_02_cyr'); //Sensor 22
        var data_K_Schrank_Oben_03_cyr = data.filter(x => x.Sensorname === 'K_Schrank_Oben_03_cyr'); //Sensor 23
        var data_K_Schrank_Oben_04_cyr = data.filter(x => x.Sensorname === 'K_Schrank_Oben_04_cyr'); //Sensor 24
        var data_K_Schrank_Oben_05_cyr = data.filter(x => x.Sensorname === 'K_Schrank_Oben_05_cyr'); //Sensor 25

        data_per_element.push(data_K_Schrank_Oben_01_cyr);
        data_per_element.push(data_K_Schrank_Oben_02_cyr);
        data_per_element.push(data_K_Schrank_Oben_03_cyr);
        data_per_element.push(data_K_Schrank_Oben_04_cyr);
        data_per_element.push(data_K_Schrank_Oben_05_cyr);

        var data_K_Kuehl_cyr = data.filter(x => x.Sensorname === 'K_Kuehl_cyr'); //Sensor 26
        var data_K_Abfall_cyr = data.filter(x => x.Sensorname === 'K_Abfall_cyr'); //Sensor 27
        var data_K_Wasch_Str = data.filter(x => x.Sensorname === 'K_Wasch_Str'); //Sensor 28
        var data_K_Ofen_Str = data.filter(x => x.Sensorname === 'K_Ofen_Str'); //Sensor 29

        data_per_element.push(data_K_Kuehl_cyr);
        data_per_element.push(data_K_Abfall_cyr);
        data_per_element.push(data_K_Wasch_Str);
        data_per_element.push(data_K_Ofen_Str);

        var data_K_Schub_Ofen_cyr = data.filter(x => x.Sensorname === 'K_Ofen_Schub_cyr'); //Sensor 30
        var data_K_Schub_Oben_Str = data.filter(x => x.Sensorname === 'K_Schub_Oben_cyr'); //Sensor 31
        var data_K_Schub_Mitte_cyr = data.filter(x => x.Sensorname === 'K_Schub_Mitte_cyr'); //Sensor 32
        var data_K_Schub_Unten_cyr = data.filter(x => x.Sensorname === 'K_Schub_Unten_cyr'); //Sensor 33
        var data_K_IT_cyr = data.filter(x => x.Sensorname === 'K_IT_cyr'); //Sensor 34

        data_per_element.push(data_K_Schub_Ofen_cyr);
        data_per_element.push(data_K_Schub_Oben_Str);
        data_per_element.push(data_K_Schub_Mitte_cyr);
        data_per_element.push(data_K_Schub_Unten_cyr);



        var names = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand', 'K_Fen_Oben_Str', 'K_Fen_Unten_Str', 'S_Fen_Oben_Str', 'S_Fen_Unten_Str', 'S_Boden_Wand_cyr',
            'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
            'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str', 'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr', 'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr',
            'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
            'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr',
            'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Ofen_Schub_cyr', 'K_Schub_Oben_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr'
        ]
        console.log(data_per_element)


        var week = d3.timeFormat('%V-%y')
        var day = d3.timeFormat('%a')


        /*
         * read more about this demo:
         * https://www.vis4.net/blog/posts/making-html-tables-in-d3-doesnt-need-to-be-a-pain/
         *
         * in case you're wondering about d3.f or appendMany(), please check out d3-jetpack
         * https://github.com/gka/d3-jetpack
         */

        // the table rows, typically loaded from data file using d3.csv


        // the table rows, typically loaded from data file using d3.csv
        var table_data_absolute = [];
        var table_data_relative = [];
        console.log(weeks_single)

        for (var i = 0; i < 37; i++) {
            var op = 0
            var cl = 0
            var sdata = data_per_element[i].filter(d => weeks_single.includes(week(new Date(d.Timestamp))) && !weeks_out.includes(week(new Date(d.Timestamp))));
            var ddata = data_per_element[i].filter(d => weeks_double.includes(week(new Date(d.Timestamp))) && !weeks_out.includes(week(new Date(d.Timestamp))));
            data_per_element[i] = data_per_element[i].filter(d => !weeks_out.includes(week(new Date(d.Timestamp))))


            if (i > 3) {
                op = sdata.filter(d => d.Value1 == 'OPEN').length + ddata.filter(d => d.Value1 == 'OPEN').length;
                cl = ddata.filter(d => d.Value1 == 'CLOSED').length + ddata.filter(d => d.Value1 == 'CLOSED').length;

            }
            var s = data_per_element[i].filter(d => weeks_single.includes(week(new Date(d.Timestamp))) && !weeks_out.includes(week(new Date(d.Timestamp)))).length;
            var d = data_per_element[i].filter(d => weeks_double.includes(week(new Date(d.Timestamp))) && !weeks_out.includes(week(new Date(d.Timestamp)))).length;
            var sd = (s < d) ? 'Double' : 'Single';
            table_data_absolute.push({
                Element: data_per_element[i][0].Sensorname,
                All: (s + d),
                Single: s,
                Double: d,
                open: op,
                close: cl,
                Monday: data_per_element[i].filter(d => 'Mon' == (day(new Date(d.Timestamp)))).length,
                Tuesday: data_per_element[i].filter(d => 'Tue' == (day(new Date(d.Timestamp)))).length,
                Wednesday: data_per_element[i].filter(d => 'Wed' == (day(new Date(d.Timestamp)))).length,
                Thursday: data_per_element[i].filter(d => 'Thu' == (day(new Date(d.Timestamp)))).length,
                Friday: data_per_element[i].filter(d => 'Fri' == (day(new Date(d.Timestamp)))).length,
                Saturday: data_per_element[i].filter(d => 'Sat' == (day(new Date(d.Timestamp)))).length,
                Sunday: data_per_element[i].filter(d => 'Sun' == (day(new Date(d.Timestamp)))).length,
                color: sd


            })

            var all = s + d
            s = parseFloat((s / 11).toFixed(2));
            d = parseFloat((d / 17).toFixed(2));
            var sd = (s < d) ? 'Double' : 'Single';
            // console.log(s + " " + d + " " + sd)

            table_data_relative.push({
                Element: data_per_element[i][0].Sensorname,
                All: (all / data_profile.length).toFixed(2),
                Single: s,
                Double: d,
                open: op,
                close: cl,
                Monday: (data_per_element[i].filter(d => 'Mon' == (day(new Date(d.Timestamp)))).length / all).toFixed(2),
                Tuesday: (data_per_element[i].filter(d => 'Tue' == (day(new Date(d.Timestamp)))).length / all).toFixed(2),
                Wednesday: (data_per_element[i].filter(d => 'Wed' == (day(new Date(d.Timestamp)))).length / all).toFixed(2),
                Thursday: (data_per_element[i].filter(d => 'Thu' == (day(new Date(d.Timestamp)))).length / all).toFixed(2),
                Friday: (data_per_element[i].filter(d => 'Fri' == (day(new Date(d.Timestamp)))).length / all).toFixed(2),
                Saturday: (data_per_element[i].filter(d => 'Sat' == (day(new Date(d.Timestamp)))).length / all).toFixed(2),
                Sunday: (data_per_element[i].filter(d => 'Sun' == (day(new Date(d.Timestamp)))).length / all).toFixed(2),
                color: sd
            })

        }
        // column definitions
        var columns = ['Element', 'All', 'Single', 'Double', 'open', 'close', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        //All absteigen
        table_data_absolute.sort(function(a, b) { return b.All - a.All; });
        //All aufsteigend
        // table_data.sort(function(a, b) { return b.All - a.All; });
        tabulate(table_data_absolute, columns);
        var columns = ['Element', 'All', 'Single', 'Double', 'open', 'close', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        table_data_relative.sort(function(a, b) { return b.All - a.All; });

        tabulate(table_data_relative, columns);
        // //Single absteigen
        // table_data.sort(function(a, b) { return b.Single - a.Single; });
        // // //Single aufsteigend
        // // table_data.sort(function(a, b) { return b.Single - a.Single; });
        // tabulate(table_data, columns);

        // // //Double absteigen
        // table_data_relative.sort(function(a, b) { return b.Double - a.Double; });
        // // //Double aufsteigend
        // table_data.sort(function(a, b) { return b.Double - a.Double; });






        function tabulate(data, columns) {
            var table = d3.select('body').append('table')
            var thead = table.append('thead')
            var tbody = table.append('tbody');

            // append the header row
            thead.append('tr')
                .selectAll('th')
                .data(columns).enter()
                .append('th')
                .text(function(column) { return column; });


            // create a row for each object in the data
            var rows = tbody.selectAll('tr')
                .data(data)
                .enter()
                .append('tr');

            // create a cell in each row for each column
            var j = 0;
            var found = false;
            var cells = rows.selectAll('td')
                .data(function(row) {

                    return columns.map(function(column) {
                        return { column: column, value: row[column] };
                    });
                })
                .enter()
                .append('td')
                .text(function(d) { return d.value; })
                .style('color', function(d, i) {
                    if (j > 36) {
                        return 'black';
                    } else if (found && d.column == 'Double') {
                        found = false;
                        return 'black';

                    } else if (table_data_absolute[j].color == d.column && d.column == 'Single') {
                        j++;
                        found = true;
                        return 'steelblue';
                    } else if (!found && table_data_absolute[j].color == d.column && d.column == 'Double') {
                        j++;
                        found = false;
                        return 'steelblue';
                    } else if (!found && d.column == 'Double') {
                        j++;
                        found = false;

                        return 'black'
                    }

                    return 'black';
                })
            return table;
        }



    });

    //     d3.json('data/both.json').then(function(data) {
    //         var weeks_double = ['41', '44', '45', '46', '48', '49', '50', '03', '05', '09', '10'];
    //         var weeks_single = ['37', '38', '39', '42', '47', '51', '52', '01', '02', '04', '06', '07', '08'];
    //         var weeks_all = ['37', '38', '39', '41', '42', '44', '45', '46', '47', '48', '49', '50', '51', '52', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
    //         var weeks_out = ['37', '40', '43', '49', '50', '51', '52', '01', '03', '04', '05'];
    //         var week = d3.timeFormat('%V')
    //         var day = d3.timeFormat('%a')

    //         var data_single = data.filter(d => weeks_single.includes(d.Week) && !weeks_out.includes(d.Week));
    //         var data_double = data.filter(d => weeks_double.includes(d.Week) && !weeks_out.includes(d.Week));

    // var col = ['Number','Female','Male','Age ']




    //     });
}