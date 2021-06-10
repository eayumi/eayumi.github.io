function prepare_data_table() {
    d3.json('../data/data.json').then(function(data) {

        var data_processed = [];
        console.log(data_profile)
        console.log(weeks_single)



        var week_to_find_index = data_profile.map(x => x.Week_Year)
        var week = d3.timeFormat('%V-%y');
        var weekday = d3.timeFormat('%a');
        var year = d3.timeFormat('%y');

        data = data.filter(d => !weeks_out.includes(week(new Date(d.Timestamp))))

        for (var i = 0; i < data.length; i++) {
            d = data[i];
            date = new Date(d.Timestamp);
            theWeek = week(date)
            k = week_to_find_index.indexOf(theWeek)
            if (k != -1) {
                prof = data_profile[k];
                if (weeks_single.includes(theWeek)) {
                    data_processed.push({
                        Sensorname: d.Sensorname,
                        Timestamp: d.Timestamp,
                        Week: theWeek,
                        Weekday: weekday(date),
                        Group: 0,
                        Gender: prof.Gender1,
                        Age: prof.Age1,
                        Occ: prof.OccupationCategory1
                    });
                } else {

                    data_processed.push({
                        Sensorname: d.Sensorname,
                        Timestamp: d.Timestamp,
                        Week: theWeek,
                        Weekday: weekday(date),
                        Group: 1,
                        Gender: (prof.Gender1 == prof.Gender2) ? prof.Gender1 : 2,
                        Age: (prof.Age1 == prof.Age2 && prof.Age1 != "") ? prof.Age1 : '-',
                        Occ: (prof.OccupationCategory1 == prof.OccupationCategory2 && prof.OccupationCategory1 != "") ? prof.OccupationCategory1 : '-'
                    });

                }
            }


        }

        console.log(data.length);
        var data_per_element = []

        var data_Drehwand = data_processed.filter(x => x.Sensorname === 'Drehwand'); //Sensor T3
        var data_Drehschrank = data_processed.filter(x => x.Sensorname === 'Drehschrank'); //Sensor T2
        var data_LampeAussenwand = data_processed.filter(x => x.Sensorname === 'LampeAussenwand'); //Sensor T1
        var data_LampeDrehwand = data_processed.filter(x => x.Sensorname === 'LampeDrehwand'); //Sensor T4
        data_processed
        data_per_element.push(data_Drehwand);
        data_per_element.push(data_Drehschrank);
        data_per_element.push(data_LampeAussenwand);
        data_per_element.push(data_LampeDrehwand);

        var data_K_Fen_Oben_Str = data_processed.filter(x => x.Sensorname === 'K_Fen_Oben_Str'); //Sensor 1
        var data_K_Fen_Unten_Str = data_processed.filter(x => x.Sensorname === 'K_Fen_Unten_Str'); //Sensor 2

        data_per_element.push(data_K_Fen_Oben_Str);
        data_per_element.push(data_K_Fen_Unten_Str);

        var data_S_Fen_Oben_Str = data_processed.filter(x => x.Sensorname === 'S_Fen_Oben_Str'); //Sensor 3
        var data_S_Fen_Unten_Str = data_processed.filter(x => x.Sensorname === 'S_Fen_Unten_Str'); //Sensor 4
        var data_S_Boden_Wand_cyr = data_processed.filter(x => x.Sensorname === 'S_Boden_Wand_cyr'); //Sensor 5
        var data_S_Kueche_Wand_cyr = data_processed.filter(x => x.Sensorname === 'S_Boden_Kueche_cyr'); //Sensor 6
        var data_S_Schub_Wand_cyr = data_processed.filter(x => x.Sensorname === 'S_Schub_Wand_cyr'); //Sensor 7
        var data_S_Schub_Kueche_cyr = data_processed.filter(x => x.Sensorname === 'S_Schub_Kueche_cyr'); //Sensor 8

        data_per_element.push(data_S_Fen_Oben_Str);
        data_per_element.push(data_S_Fen_Unten_Str);
        data_per_element.push(data_S_Boden_Wand_cyr);
        data_per_element.push(data_S_Kueche_Wand_cyr);
        data_per_element.push(data_S_Schub_Wand_cyr);
        data_per_element.push(data_S_Schub_Kueche_cyr);

        var data_H_Putz_cyr = data_processed.filter(x => x.Sensorname === 'H_Putz_cyr'); //Sensor 9
        var data_H_Garderobe_cyr = data_processed.filter(x => x.Sensorname === 'H_Graderobe_cyr'); //typo //Sensor 10
        var data_H_Tuer_Str = data_processed.filter(x => x.Sensorname === 'H_Tuer_Str'); //Sensor 11

        data_per_element.push(data_H_Putz_cyr);
        data_per_element.push(data_H_Garderobe_cyr);
        data_per_element.push(data_H_Tuer_Str);

        var data_B_Tuer_Str = data_processed.filter(x => x.Sensorname === 'B_Tuer_Str'); //Sensor 12
        var data_B_Schrank_cyr = data_processed.filter(x => x.Sensorname === 'B_Schrank_cyr'); //Sensor 13
        var data_B_Wasch_cyr = data_processed.filter(x => x.Sensorname === 'B_Wasch_cyr'); //Sensor 14

        data_per_element.push(data_B_Tuer_Str);
        data_per_element.push(data_B_Schrank_cyr);
        data_per_element.push(data_B_Wasch_cyr);

        var data_W_Schub_Bad_cyr = data_processed.filter(x => x.Sensorname === 'W_Schub_Bad_cyr'); //Sensor 15
        var data_W_Schub_Wand_cyr = data_processed.filter(x => x.Sensorname === 'W_Schub_Wand_cyr'); //Sensor 16
        var data_W_Boden_Bad_cyr = data_processed.filter(x => x.Sensorname === 'W_Boden_Bad_cyr'); //Sensor 17
        var data_W_Boden_Wand_cyr = data_processed.filter(x => x.Sensorname === 'W_Boden_Wand_cyr'); //Sensor 18
        var data_W_Fen_Bad_Str = data_processed.filter(x => x.Sensorname === 'W_Fen_Bad_Str'); //Sensor 19
        var data_W_Fen_Wand_Str = data_processed.filter(x => x.Sensorname === 'W_Fen_Wand_Str'); //Sensor 20

        data_per_element.push(data_W_Schub_Bad_cyr);
        data_per_element.push(data_W_Schub_Wand_cyr);
        data_per_element.push(data_W_Boden_Bad_cyr);
        data_per_element.push(data_W_Boden_Wand_cyr);
        data_per_element.push(data_W_Fen_Bad_Str);
        data_per_element.push(data_W_Fen_Wand_Str);


        var data_K_Schrank_Oben_01_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_01_cyr'); //Sensor 21
        var data_K_Schrank_Oben_02_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_02_cyr'); //Sensor 22
        var data_K_Schrank_Oben_03_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_03_cyr'); //Sensor 23
        var data_K_Schrank_Oben_04_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_04_cyr'); //Sensor 24
        var data_K_Schrank_Oben_05_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_05_cyr'); //Sensor 25

        data_per_element.push(data_K_Schrank_Oben_01_cyr);
        data_per_element.push(data_K_Schrank_Oben_02_cyr);
        data_per_element.push(data_K_Schrank_Oben_03_cyr);
        data_per_element.push(data_K_Schrank_Oben_04_cyr);
        data_per_element.push(data_K_Schrank_Oben_05_cyr);

        var data_K_Kuehl_cyr = data_processed.filter(x => x.Sensorname === 'K_Kuehl_cyr'); //Sensor 26
        var data_K_Abfall_cyr = data_processed.filter(x => x.Sensorname === 'K_Abfall_cyr'); //Sensor 27
        var data_K_Wasch_Str = data_processed.filter(x => x.Sensorname === 'K_Wasch_Str'); //Sensor 28
        var data_K_Ofen_Str = data_processed.filter(x => x.Sensorname === 'K_Ofen_Str'); //Sensor 29

        data_per_element.push(data_K_Kuehl_cyr);
        data_per_element.push(data_K_Abfall_cyr);
        data_per_element.push(data_K_Wasch_Str);
        data_per_element.push(data_K_Ofen_Str);

        var data_K_Schub_Ofen_cyr = data_processed.filter(x => x.Sensorname === 'K_Ofen_Schub_cyr'); //Sensor 30
        var data_K_Schub_Oben_Str = data_processed.filter(x => x.Sensorname === 'K_Schub_Oben_cyr'); //Sensor 31
        var data_K_Schub_Mitte_cyr = data_processed.filter(x => x.Sensorname === 'K_Schub_Mitte_cyr'); //Sensor 32
        var data_K_Schub_Unten_cyr = data_processed.filter(x => x.Sensorname === 'K_Schub_Unten_cyr'); //Sensor 33

        data_per_element.push(data_K_Schub_Ofen_cyr);
        data_per_element.push(data_K_Schub_Oben_Str);
        data_per_element.push(data_K_Schub_Mitte_cyr);
        data_per_element.push(data_K_Schub_Unten_cyr);

        var sensors = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand', 'K_Fen_Oben_Str', 'K_Fen_Unten_Str', 'S_Fen_Oben_Str', 'S_Fen_Unten_Str',
            'S_Boden_Wand_cyr', 'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
            'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str', 'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr', 'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr', 'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
            'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr',
            'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Ofen_Schub_cyr', 'K_Schub_Oben_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr'
        ]

        // Summerized ----------------

        var data_table = [];
        for (var i = 0; i < sensors.length; i++) {
            data_table.push({
                "Sensor": sensors[i],
                "All": 0,
                "Single": 0,
                "Pairs": 0,
                "eight": 0,
                "three": 0,
                "four": 0,
                "six": 0,
                "Student": 0,
                "Employed": 0,
                "UnRet": 0,
                "Part": 0,
                "female": 0,
                "male": 0,
                "mixed": 0,
                "Mon": 0,
                "Tue": 0,
                "Wed": 0,
                "Thu": 0,
                "Fri": 0,
                "Sat": 0,
                "Sun": 0,
                //Percentage
                "AllP": 0,
                "SingleP": 0,
                "PairsP": 0,
                "eightP": 0,
                "threeP": 0,
                "fourP": 0,
                "sixP": 0,
                "StudentP": 0,
                "EmployedP": 0,
                "UnRetP": 0,
                "PartP": 0,
                "femaleP": 0,
                "maleP": 0,
                "mixedP": 0,
                "MonP": 0,
                "TueP": 0,
                "WedP": 0,
                "ThuP": 0,
                "FriP": 0,
                "SatP": 0,
                "SunP": 0,
                //Average
                "AllA": 0,
                "SingleA": 0,
                "PairsA": 0,
                "eightA": 0,
                "threeA": 0,
                "fourA": 0,
                "sixA": 0,
                "StudentA": 0,
                "EmployedA": 0,
                "UnRetA": 0,
                "PartA": 0,
                "femaleA": 0,
                "maleA": 0,
                "mixedA": 0,
                "MonA": 0,
                "TueA": 0,
                "WedA": 0,
                "ThuA": 0,
                "FriA": 0,
                "SatA": 0,
                "SunA": 0

            });

        }
        var singles = data_profile.filter(d => d.Person2 == '').length;
        var pairs = data_profile.filter(d => d.Person2 != '').length;
        var all = singles + pairs;

        var eight = data_profile.filter(d => (d.Age1 == d.Age2 && d.Age1 == "18-30") || (d.Age2 == '' && d.Age1 == "18-30")).length;
        var three = data_profile.filter(d => (d.Age1 == d.Age2 && d.Age1 == "30-45") || (d.Age2 == '' && d.Age1 == "30-45")).length;
        var four = data_profile.filter(d => (d.Age1 == d.Age2 && d.Age1 == "45-60") || (d.Age2 == '' && d.Age1 == "45-60")).length;
        var six = data_profile.filter(d => (d.Age1 == d.Age2 && d.Age1 == "60-75") || (d.Age2 == '' && d.Age1 == "60-75")).length;

        var stds = data_profile.filter(d => (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "A") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "A")).length;
        var epms = data_profile.filter(d => (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "B") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "B")).length;
        var unrs = data_profile.filter(d => (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "D") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "D")).length;
        var parts = data_profile.filter(d => (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "C") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "C")).length;

        var female = data_profile.filter(d => (d.Gender1 == d.Gender2 && d.Gender1 == "w") || (d.Gender2 == '' && d.Gender1 == "w")).length;
        var male = data_profile.filter(d => (d.Gender1 == d.Gender2 && d.Gender1 == "m") || (d.Gender2 == '' && d.Gender1 == "m")).length;
        var mix = data_profile.filter(d => (d.Gender1 != d.Gender2 && d.Gender2 !== "")).length;


        var totalAll = 0,
            totSingle = 0,
            totParis = 0,
            toteight = 0,
            totfour = 0,
            totthree = 0,
            totsix = 0,
            totA = 0,
            totB = 0,
            totC = 0,
            totD = 0,
            totf = 0,
            totm = 0,
            totmix = 0,
            totmon = 0,
            tottue = 0,
            totwed = 0,
            totthr = 0,
            totfri = 0,
            totsat = 0,
            totsun = 0;


        for (var i = 0; i < sensors.length; i++) {

            data_table[i].All = data_per_element[i].length;
            data_table[i].Single = data_per_element[i].filter(d => d.Group == 0).length;
            data_table[i].Pairs = data_per_element[i].filter(d => d.Group == 1).length;

            data_table[i].eight = data_per_element[i].filter(d => d.Age == '18-30').length;
            data_table[i].three = data_per_element[i].filter(d => d.Age == '30-45').length;
            data_table[i].four = data_per_element[i].filter(d => d.Age == '45-60').length;
            data_table[i].six = data_per_element[i].filter(d => d.Age == '60-75').length;

            data_table[i].Student = data_per_element[i].filter(d => d.Occ == 'A').length;
            data_table[i].Employed = data_per_element[i].filter(d => d.Occ == 'B').length;
            data_table[i].UnRet = data_per_element[i].filter(d => d.Occ == 'D').length;
            data_table[i].Part = data_per_element[i].filter(d => d.Occ == 'C').length;

            data_table[i].female = data_per_element[i].filter(d => d.Gender == 'w').length;
            data_table[i].male = data_per_element[i].filter(d => d.Gender == 'm').length;
            data_table[i].mixed = data_per_element[i].filter(d => d.Gender == 2).length;

            data_table[i].Mon = data_per_element[i].filter(d => d.Weekday == "Mon").length;
            data_table[i].Tue = data_per_element[i].filter(d => d.Weekday == "Tue").length;
            data_table[i].Wed = data_per_element[i].filter(d => d.Weekday == "Wed").length;
            data_table[i].Thu = data_per_element[i].filter(d => d.Weekday == "Thu").length;
            data_table[i].Fri = data_per_element[i].filter(d => d.Weekday == "Fri").length;
            data_table[i].Sat = data_per_element[i].filter(d => d.Weekday == "Sat").length;
            data_table[i].Sun = data_per_element[i].filter(d => d.Weekday == "Sun").length;

            //upd

            totalAll += data_table[i].All;
            totSingle += data_table[i].Single;
            totParis += data_table[i].Pairs;
            toteight += data_table[i].eight;
            totthree += data_table[i].three;
            totfour += data_table[i].four;
            totsix += data_table[i].six;
            totA += data_table[i].Student;
            totB += data_table[i].Employed;
            totC += data_table[i].Part;
            totD += data_table[i].UnRet;
            totf += data_table[i].female;
            totm += data_table[i].male;
            totmix += data_table[i].mixed;
            totmon += data_table[i].Mon;
            tottue += data_table[i].Tue;
            totwed += data_table[i].Wed;
            totthr += data_table[i].Thu;
            totfri += data_table[i].Fri;
            totsat += data_table[i].Sat;
            totsun += data_table[i].Sun;
        }
        for (var i = 0; i < sensors.length; i++) {

            //----Average Per Week----
            data_table[i].AllA = (data_per_element[i].length / all).toFixed(2);
            data_table[i].SingleA = (data_table[i].Single / singles).toFixed(2);
            data_table[i].PairsA = (data_table[i].Pairs / pairs).toFixed(2);

            data_table[i].eightA = (data_table[i].eight / eight).toFixed(2);
            data_table[i].threeA = (data_table[i].three / three).toFixed(2);
            data_table[i].fourA = (data_table[i].four / four).toFixed(2);
            data_table[i].sixA = (data_table[i].six / six).toFixed(2);

            data_table[i].StudentA = (data_table[i].Student / stds).toFixed(2);
            data_table[i].EmployedA = (data_table[i].Employed / epms).toFixed(2);
            data_table[i].UnRetA = (data_table[i].UnRet / unrs).toFixed(2);
            data_table[i].PartA = (data_table[i].Part / parts).toFixed(2);

            data_table[i].femaleA = (data_table[i].female / female).toFixed(2);
            data_table[i].maleA = (data_table[i].male / male).toFixed(2);
            data_table[i].mixedA = (data_table[i].mixed / mix).toFixed(2);

            data_table[i].MonA = (data_table[i].Mon / all).toFixed(2);
            data_table[i].TueA = (data_table[i].Tue / all).toFixed(2);
            data_table[i].WedA = (data_table[i].Wed / all).toFixed(2);
            data_table[i].ThuA = (data_table[i].Thu / all).toFixed(2);
            data_table[i].FriA = (data_table[i].Fri / all).toFixed(2);
            data_table[i].SatA = (data_table[i].Sat / all).toFixed(2);
            data_table[i].SunA = (data_table[i].Sun / all).toFixed(2);
        }




        for (var i = 0; i < sensors.length; i++) {
            //----Average Per Week----
            data_table[i].AllP = (data_per_element[i].length * 100 / totalAll).toFixed(2);
            data_table[i].SingleP = (data_table[i].Single * 100 / totSingle).toFixed(2);
            data_table[i].PairsP = (data_table[i].Pairs * 100 / totParis).toFixed(2);

            data_table[i].eightP = (data_table[i].eight * 100 / toteight).toFixed(2);
            data_table[i].threeP = (data_table[i].three * 100 / totthree).toFixed(2);
            data_table[i].fourP = (data_table[i].four * 100 / totfour).toFixed(2);
            data_table[i].sixP = (data_table[i].six * 100 / totsix).toFixed(2);

            data_table[i].StudentP = (data_table[i].Student * 100 / totA).toFixed(2);
            data_table[i].EmployedP = (data_table[i].Employed * 100 / totB).toFixed(2);
            data_table[i].UnRetP = (data_table[i].UnRet * 100 / totD).toFixed(2);
            data_table[i].PartP = (data_table[i].Part * 100 / totC).toFixed(2);

            data_table[i].femaleP = (data_table[i].female * 100 / totf).toFixed(2);
            data_table[i].maleP = (data_table[i].male * 100 / totm).toFixed(2);
            data_table[i].mixedP = (data_table[i].mixed * 100 / totmix).toFixed(2);

            data_table[i].MonP = (data_table[i].Mon * 100 / totmon).toFixed(2);
            data_table[i].TueP = (data_table[i].Tue * 100 / tottue).toFixed(2);
            data_table[i].WedP = (data_table[i].Wed * 100 / totwed).toFixed(2);
            data_table[i].ThuP = (data_table[i].Thu * 100 / totthr).toFixed(2);
            data_table[i].FriP = (data_table[i].Fri * 100 / totfri).toFixed(2);
            data_table[i].SatP = (data_table[i].Sat * 100 / totsat).toFixed(2);
            data_table[i].SunP = (data_table[i].Sun * 100 / totsun).toFixed(2);
        }
        //Only year 2020

        // Summerized ----------------

        var data_table_igong = [];
        for (var i = 0; i < sensors.length; i++) {
            data_table_igong.push({
                "Sensor": sensors[i],
                "All": 0,
                "Single": 0,
                "Pairs": 0,
                "eight": 0,
                "three": 0,
                "four": 0,
                "six": 0,
                "Student": 0,
                "Employed": 0,
                "UnRet": 0,
                "Part": 0,
                "female": 0,
                "male": 0,
                "mixed": 0,
                "Mon": 0,
                "Tue": 0,
                "Wed": 0,
                "Thu": 0,
                "Fri": 0,
                "Sat": 0,
                "Sun": 0,
                //Percentage
                "AllP": 0,
                "SingleP": 0,
                "PairsP": 0,
                "eightP": 0,
                "threeP": 0,
                "fourP": 0,
                "sixP": 0,
                "StudentP": 0,
                "EmployedP": 0,
                "UnRetP": 0,
                "PartP": 0,
                "femaleP": 0,
                "maleP": 0,
                "mixedP": 0,
                "MonP": 0,
                "TueP": 0,
                "WedP": 0,
                "ThuP": 0,
                "FriP": 0,
                "SatP": 0,
                "SunP": 0,
                //Average
                "AllA": 0,
                "SingleA": 0,
                "PairsA": 0,
                "eightA": 0,
                "threeA": 0,
                "fourA": 0,
                "sixA": 0,
                "StudentA": 0,
                "EmployedA": 0,
                "UnRetA": 0,
                "PartA": 0,
                "femaleA": 0,
                "maleA": 0,
                "mixedA": 0,
                "MonA": 0,
                "TueA": 0,
                "WedA": 0,
                "ThuA": 0,
                "FriA": 0,
                "SatA": 0,
                "SunA": 0

            });

        }
        var singles = data_profile.filter(d => d.Week_Year.substring(3) == '20' && d.Person2 == '').length;
        var pairs = data_profile.filter(d => d.Week_Year.substring(3) == '20' && d.Person2 != '').length;
        var all = singles + pairs;

        var eight = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Age1 == d.Age2 && d.Age1 == "18-30") || (d.Age2 == '' && d.Age1 == "18-30")).length;
        var three = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Age1 == d.Age2 && d.Age1 == "30-45") || (d.Age2 == '' && d.Age1 == "30-45")).length;
        var four = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Age1 == d.Age2 && d.Age1 == "45-60") || (d.Age2 == '' && d.Age1 == "45-60")).length;
        var six = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Age1 == d.Age2 && d.Age1 == "60-75") || (d.Age2 == '' && d.Age1 == "60-75")).length;

        var stds = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "A") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "A")).length;
        var epms = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "B") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "B")).length;
        var unrs = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "D") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "D")).length;
        var parts = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "C") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "C")).length;

        var female = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Gender1 == d.Gender2 && d.Gender1 == "w") || (d.Gender2 == '' && d.Gender1 == "w")).length;
        var male = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Gender1 == d.Gender2 && d.Gender1 == "m") || (d.Gender2 == '' && d.Gender1 == "m")).length;
        var mix = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Gender1 != d.Gender2 && d.Gender2 !== "")).length;

        console.log(singles);

        var totalAll = 0,
            totSingle = 0,
            totParis = 0,
            toteight = 0,
            totfour = 0,
            totthree = 0,
            totsix = 0,
            totA = 0,
            totB = 0,
            totC = 0,
            totD = 0,
            totf = 0,
            totm = 0,
            totmix = 0,
            totmon = 0,
            tottue = 0,
            totwed = 0,
            totthr = 0,
            totfri = 0,
            totsat = 0,
            totsun = 0;


        for (var i = 0; i < sensors.length; i++) {


            data_per_element[i] = data_per_element[i].filter(d => year(new Date(d.Timestamp)) == '20')


            data_table_igong[i].All = data_per_element[i].length;
            data_table_igong[i].Single = data_per_element[i].filter(d => d.Group == 0).length;
            data_table_igong[i].Pairs = data_per_element[i].filter(d => d.Group == 1).length;

            data_table_igong[i].eight = data_per_element[i].filter(d => d.Age == '18-30').length;
            data_table_igong[i].three = data_per_element[i].filter(d => d.Age == '30-45').length;
            data_table_igong[i].four = data_per_element[i].filter(d => d.Age == '45-60').length;
            data_table_igong[i].six = data_per_element[i].filter(d => d.Age == '60-75').length;

            data_table_igong[i].Student = data_per_element[i].filter(d => d.Occ == 'A').length;
            data_table_igong[i].Employed = data_per_element[i].filter(d => d.Occ == 'B').length;
            data_table_igong[i].UnRet = data_per_element[i].filter(d => d.Occ == 'D').length;
            data_table_igong[i].Part = data_per_element[i].filter(d => d.Occ == 'C').length;

            data_table_igong[i].female = data_per_element[i].filter(d => d.Gender == 'w').length;
            data_table_igong[i].male = data_per_element[i].filter(d => d.Gender == 'm').length;
            data_table_igong[i].mixed = data_per_element[i].filter(d => d.Gender == 2).length;

            data_table_igong[i].Mon = data_per_element[i].filter(d => d.Weekday == "Mon").length;
            data_table_igong[i].Tue = data_per_element[i].filter(d => d.Weekday == "Tue").length;
            data_table_igong[i].Wed = data_per_element[i].filter(d => d.Weekday == "Wed").length;
            data_table_igong[i].Thu = data_per_element[i].filter(d => d.Weekday == "Thu").length;
            data_table_igong[i].Fri = data_per_element[i].filter(d => d.Weekday == "Fri").length;
            data_table_igong[i].Sat = data_per_element[i].filter(d => d.Weekday == "Sat").length;
            data_table_igong[i].Sun = data_per_element[i].filter(d => d.Weekday == "Sun").length;

            //upd

            totalAll += data_table_igong[i].All;
            totSingle += data_table_igong[i].Single;
            totParis += data_table_igong[i].Pairs;
            toteight += data_table_igong[i].eight;
            totthree += data_table_igong[i].three;
            totfour += data_table_igong[i].four;
            totsix += data_table_igong[i].six;
            totA += data_table_igong[i].Student;
            totB += data_table_igong[i].Employed;
            totC += data_table_igong[i].Part;
            totD += data_table_igong[i].UnRet;
            totf += data_table_igong[i].female;
            totm += data_table_igong[i].male;
            totmix += data_table_igong[i].mixed;
            totmon += data_table_igong[i].Mon;
            tottue += data_table_igong[i].Tue;
            totwed += data_table_igong[i].Wed;
            totthr += data_table_igong[i].Thu;
            totfri += data_table_igong[i].Fri;
            totsat += data_table_igong[i].Sat;
            totsun += data_table_igong[i].Sun;
        }
        for (var i = 0; i < sensors.length; i++) {

            //----Average Per Week----
            data_table_igong[i].AllA = (data_per_element[i].length / all).toFixed(2);
            data_table_igong[i].SingleA = (data_table_igong[i].Single / singles).toFixed(2);
            data_table_igong[i].PairsA = (data_table_igong[i].Pairs / pairs).toFixed(2);

            data_table_igong[i].eightA = (data_table_igong[i].eight / eight).toFixed(2);
            data_table_igong[i].threeA = (data_table_igong[i].three / three).toFixed(2);
            data_table_igong[i].fourA = (data_table_igong[i].four / four).toFixed(2);
            data_table_igong[i].sixA = (data_table_igong[i].six / six).toFixed(2);

            data_table_igong[i].StudentA = (data_table_igong[i].Student / stds).toFixed(2);
            data_table_igong[i].EmployedA = (data_table_igong[i].Employed / epms).toFixed(2);
            data_table_igong[i].UnRetA = (data_table_igong[i].UnRet / unrs).toFixed(2);
            data_table_igong[i].PartA = (data_table_igong[i].Part / parts).toFixed(2);

            data_table_igong[i].femaleA = (data_table_igong[i].female / female).toFixed(2);
            data_table_igong[i].maleA = (data_table_igong[i].male / male).toFixed(2);
            data_table_igong[i].mixedA = (data_table_igong[i].mixed / mix).toFixed(2);

            data_table_igong[i].MonA = (data_table_igong[i].Mon / all).toFixed(2);
            data_table_igong[i].TueA = (data_table_igong[i].Tue / all).toFixed(2);
            data_table_igong[i].WedA = (data_table_igong[i].Wed / all).toFixed(2);
            data_table_igong[i].ThuA = (data_table_igong[i].Thu / all).toFixed(2);
            data_table_igong[i].FriA = (data_table_igong[i].Fri / all).toFixed(2);
            data_table_igong[i].SatA = (data_table_igong[i].Sat / all).toFixed(2);
            data_table_igong[i].SunA = (data_table_igong[i].Sun / all).toFixed(2);
        }

        for (var i = 0; i < sensors.length; i++) {
            //----Average Per Week----
            data_table_igong[i].AllP = (data_per_element[i].length * 100 / totalAll).toFixed(2);
            data_table_igong[i].SingleP = (data_table_igong[i].Single * 100 / totSingle).toFixed(2);
            data_table_igong[i].PairsP = (data_table_igong[i].Pairs * 100 / totParis).toFixed(2);

            data_table_igong[i].eightP = (data_table_igong[i].eight * 100 / toteight).toFixed(2);
            data_table_igong[i].threeP = (data_table_igong[i].three * 100 / totthree).toFixed(2);
            data_table_igong[i].fourP = (data_table_igong[i].four * 100 / totfour).toFixed(2);
            data_table_igong[i].sixP = (data_table_igong[i].six * 100 / totsix).toFixed(2);

            data_table_igong[i].StudentP = (data_table_igong[i].Student * 100 / totA).toFixed(2);
            data_table_igong[i].EmployedP = (data_table_igong[i].Employed * 100 / totB).toFixed(2);
            data_table_igong[i].UnRetP = (data_table_igong[i].UnRet * 100 / totD).toFixed(2);
            data_table_igong[i].PartP = (data_table_igong[i].Part * 100 / totC).toFixed(2);

            data_table_igong[i].femaleP = (data_table_igong[i].female * 100 / totf).toFixed(2);
            data_table_igong[i].maleP = (data_table_igong[i].male * 100 / totm).toFixed(2);
            data_table_igong[i].mixedP = (data_table_igong[i].mixed * 100 / totmix).toFixed(2);

            data_table_igong[i].MonP = (data_table_igong[i].Mon * 100 / totmon).toFixed(2);
            data_table_igong[i].TueP = (data_table_igong[i].Tue * 100 / tottue).toFixed(2);
            data_table_igong[i].WedP = (data_table_igong[i].Wed * 100 / totwed).toFixed(2);
            data_table_igong[i].ThuP = (data_table_igong[i].Thu * 100 / totthr).toFixed(2);
            data_table_igong[i].FriP = (data_table_igong[i].Fri * 100 / totfri).toFixed(2);
            data_table_igong[i].SatP = (data_table_igong[i].Sat * 100 / totsat).toFixed(2);
            data_table_igong[i].SunP = (data_table_igong[i].Sun * 100 / totsun).toFixed(2);
        }

        //profile
        var data_profile_table = [{
            "name": "Single",

            "subjects": weeks_single.length,
            "eight": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Age1 == "18-30").length,
            "three": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Age1 == "30-45").length,
            "four": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Age1 == "45-60").length,
            "six": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Age1 == "60-75").length,
            "Student": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.OccupationCategory1 == "A").length,
            "Employed": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.OccupationCategory1 == "B").length,
            "UnRet": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.OccupationCategory1 == "D").length,
            "Part": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.OccupationCategory1 == "C").length,
            "female": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Gender1 == "w").length,
            "male": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Gender1 == "m").length,
            "mixed": '-'
        }, {
            "name": "Pairs",
            "subjects": weeks_double.length * 2 + " (" + weeks_double.length + ")",
            "eight": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age1 == "18-30").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age2 == "18-30").length,
            "three": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age1 == "30-45").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age2 == "30-45").length,
            "four": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age1 == "45-60").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age2 == "45-60").length,
            "six": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age1 == "60-75").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age2 == "60-75").length,
            "Student": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory1 == "A").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory2 == "A").length,
            "Employed": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory1 == "B").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory2 == "B").length,
            "UnRet": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory1 == "D").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory2 == "D").length,
            "Part": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory1 == "C").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory2 == "C").length,
            "female": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Gender1 == "w").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Gender2 == "w").length,
            "male": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Gender1 == "m").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Gender2 == "m").length,
            "mixed": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Genders.includes('w') && d.Genders.includes('m')).length
        }];

        console.log(data_table);
        console.log(data_profile_table)
        console.log(data_table_igong)


        toJson(data_table, 'data_table.json')
        toJson(data_table_igong, 'data_table_2020.json')


        toJson(data_profile_table, 'data_profile_table.json')




    });

}

function prepare_data_table_Besucher() {
    d3.json('../data/data_Besucher.json').then(function(data) {

        var data_processed = [];
        console.log(data_profile)
        console.log(weeks_single)



        var week_to_find_index = data_profile.map(x => x.Week_Year)
        var week = d3.timeFormat('%V-%y');
        var weekday = d3.timeFormat('%a');
        var year = d3.timeFormat('%y');

        data = data.filter(d => !weeks_out.includes(week(new Date(d.Timestamp))))

        for (var i = 0; i < data.length; i++) {
            d = data[i];
            date = new Date(d.Timestamp);
            theWeek = week(date)
            k = week_to_find_index.indexOf(theWeek)
            if (k != -1) {
                prof = data_profile[k];
                if (weeks_single.includes(theWeek)) {
                    data_processed.push({
                        Sensorname: d.Sensorname,
                        Timestamp: d.Timestamp,
                        Week: theWeek,
                        Weekday: weekday(date),
                        Group: 0,
                        Gender: prof.Gender1,
                        Age: prof.Age1,
                        Occ: prof.OccupationCategory1
                    });
                } else {

                    data_processed.push({
                        Sensorname: d.Sensorname,
                        Timestamp: d.Timestamp,
                        Week: theWeek,
                        Weekday: weekday(date),
                        Group: 1,
                        Gender: (prof.Gender1 == prof.Gender2) ? prof.Gender1 : 2,
                        Age: (prof.Age1 == prof.Age2 && prof.Age1 != "") ? prof.Age1 : '-',
                        Occ: (prof.OccupationCategory1 == prof.OccupationCategory2 && prof.OccupationCategory1 != "") ? prof.OccupationCategory1 : '-'
                    });

                }
            }


        }

        console.log(data.length);
        var data_per_element = []

        var data_Drehwand = data_processed.filter(x => x.Sensorname === 'Drehwand'); //Sensor T3
        var data_Drehschrank = data_processed.filter(x => x.Sensorname === 'Drehschrank'); //Sensor T2
        var data_LampeAussenwand = data_processed.filter(x => x.Sensorname === 'LampeAussenwand'); //Sensor T1
        var data_LampeDrehwand = data_processed.filter(x => x.Sensorname === 'LampeDrehwand'); //Sensor T4
        data_processed
        data_per_element.push(data_Drehwand);
        data_per_element.push(data_Drehschrank);
        data_per_element.push(data_LampeAussenwand);
        data_per_element.push(data_LampeDrehwand);

        var data_K_Fen_Oben_Str = data_processed.filter(x => x.Sensorname === 'K_Fen_Oben_Str'); //Sensor 1
        var data_K_Fen_Unten_Str = data_processed.filter(x => x.Sensorname === 'K_Fen_Unten_Str'); //Sensor 2

        data_per_element.push(data_K_Fen_Oben_Str);
        data_per_element.push(data_K_Fen_Unten_Str);

        var data_S_Fen_Oben_Str = data_processed.filter(x => x.Sensorname === 'S_Fen_Oben_Str'); //Sensor 3
        var data_S_Fen_Unten_Str = data_processed.filter(x => x.Sensorname === 'S_Fen_Unten_Str'); //Sensor 4
        var data_S_Boden_Wand_cyr = data_processed.filter(x => x.Sensorname === 'S_Boden_Wand_cyr'); //Sensor 5
        var data_S_Kueche_Wand_cyr = data_processed.filter(x => x.Sensorname === 'S_Boden_Kueche_cyr'); //Sensor 6
        var data_S_Schub_Wand_cyr = data_processed.filter(x => x.Sensorname === 'S_Schub_Wand_cyr'); //Sensor 7
        var data_S_Schub_Kueche_cyr = data_processed.filter(x => x.Sensorname === 'S_Schub_Kueche_cyr'); //Sensor 8

        data_per_element.push(data_S_Fen_Oben_Str);
        data_per_element.push(data_S_Fen_Unten_Str);
        data_per_element.push(data_S_Boden_Wand_cyr);
        data_per_element.push(data_S_Kueche_Wand_cyr);
        data_per_element.push(data_S_Schub_Wand_cyr);
        data_per_element.push(data_S_Schub_Kueche_cyr);

        var data_H_Putz_cyr = data_processed.filter(x => x.Sensorname === 'H_Putz_cyr'); //Sensor 9
        var data_H_Garderobe_cyr = data_processed.filter(x => x.Sensorname === 'H_Graderobe_cyr'); //typo //Sensor 10
        var data_H_Tuer_Str = data_processed.filter(x => x.Sensorname === 'H_Tuer_Str'); //Sensor 11

        data_per_element.push(data_H_Putz_cyr);
        data_per_element.push(data_H_Garderobe_cyr);
        data_per_element.push(data_H_Tuer_Str);

        var data_B_Tuer_Str = data_processed.filter(x => x.Sensorname === 'B_Tuer_Str'); //Sensor 12
        var data_B_Schrank_cyr = data_processed.filter(x => x.Sensorname === 'B_Schrank_cyr'); //Sensor 13
        var data_B_Wasch_cyr = data_processed.filter(x => x.Sensorname === 'B_Wasch_cyr'); //Sensor 14

        data_per_element.push(data_B_Tuer_Str);
        data_per_element.push(data_B_Schrank_cyr);
        data_per_element.push(data_B_Wasch_cyr);

        var data_W_Schub_Bad_cyr = data_processed.filter(x => x.Sensorname === 'W_Schub_Bad_cyr'); //Sensor 15
        var data_W_Schub_Wand_cyr = data_processed.filter(x => x.Sensorname === 'W_Schub_Wand_cyr'); //Sensor 16
        var data_W_Boden_Bad_cyr = data_processed.filter(x => x.Sensorname === 'W_Boden_Bad_cyr'); //Sensor 17
        var data_W_Boden_Wand_cyr = data_processed.filter(x => x.Sensorname === 'W_Boden_Wand_cyr'); //Sensor 18
        var data_W_Fen_Bad_Str = data_processed.filter(x => x.Sensorname === 'W_Fen_Bad_Str'); //Sensor 19
        var data_W_Fen_Wand_Str = data_processed.filter(x => x.Sensorname === 'W_Fen_Wand_Str'); //Sensor 20

        data_per_element.push(data_W_Schub_Bad_cyr);
        data_per_element.push(data_W_Schub_Wand_cyr);
        data_per_element.push(data_W_Boden_Bad_cyr);
        data_per_element.push(data_W_Boden_Wand_cyr);
        data_per_element.push(data_W_Fen_Bad_Str);
        data_per_element.push(data_W_Fen_Wand_Str);


        var data_K_Schrank_Oben_01_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_01_cyr'); //Sensor 21
        var data_K_Schrank_Oben_02_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_02_cyr'); //Sensor 22
        var data_K_Schrank_Oben_03_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_03_cyr'); //Sensor 23
        var data_K_Schrank_Oben_04_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_04_cyr'); //Sensor 24
        var data_K_Schrank_Oben_05_cyr = data_processed.filter(x => x.Sensorname === 'K_Schrank_Oben_05_cyr'); //Sensor 25

        data_per_element.push(data_K_Schrank_Oben_01_cyr);
        data_per_element.push(data_K_Schrank_Oben_02_cyr);
        data_per_element.push(data_K_Schrank_Oben_03_cyr);
        data_per_element.push(data_K_Schrank_Oben_04_cyr);
        data_per_element.push(data_K_Schrank_Oben_05_cyr);

        var data_K_Kuehl_cyr = data_processed.filter(x => x.Sensorname === 'K_Kuehl_cyr'); //Sensor 26
        var data_K_Abfall_cyr = data_processed.filter(x => x.Sensorname === 'K_Abfall_cyr'); //Sensor 27
        var data_K_Wasch_Str = data_processed.filter(x => x.Sensorname === 'K_Wasch_Str'); //Sensor 28
        var data_K_Ofen_Str = data_processed.filter(x => x.Sensorname === 'K_Ofen_Str'); //Sensor 29

        data_per_element.push(data_K_Kuehl_cyr);
        data_per_element.push(data_K_Abfall_cyr);
        data_per_element.push(data_K_Wasch_Str);
        data_per_element.push(data_K_Ofen_Str);

        var data_K_Schub_Ofen_cyr = data_processed.filter(x => x.Sensorname === 'K_Ofen_Schub_cyr'); //Sensor 30
        var data_K_Schub_Oben_Str = data_processed.filter(x => x.Sensorname === 'K_Schub_Oben_cyr'); //Sensor 31
        var data_K_Schub_Mitte_cyr = data_processed.filter(x => x.Sensorname === 'K_Schub_Mitte_cyr'); //Sensor 32
        var data_K_Schub_Unten_cyr = data_processed.filter(x => x.Sensorname === 'K_Schub_Unten_cyr'); //Sensor 33

        data_per_element.push(data_K_Schub_Ofen_cyr);
        data_per_element.push(data_K_Schub_Oben_Str);
        data_per_element.push(data_K_Schub_Mitte_cyr);
        data_per_element.push(data_K_Schub_Unten_cyr);

        var sensors = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand', 'K_Fen_Oben_Str', 'K_Fen_Unten_Str', 'S_Fen_Oben_Str', 'S_Fen_Unten_Str',
            'S_Boden_Wand_cyr', 'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
            'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str', 'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr', 'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr', 'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
            'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr',
            'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Ofen_Schub_cyr', 'K_Schub_Oben_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr'
        ]

        // Summerized ----------------

        var data_table = [];
        for (var i = 0; i < sensors.length; i++) {
            data_table.push({
                "Sensor": sensors[i],
                "All": 0,
                "Single": 0,
                "Pairs": 0,
                "eight": 0,
                "three": 0,
                "four": 0,
                "six": 0,
                "Student": 0,
                "Employed": 0,
                "UnRet": 0,
                "Part": 0,
                "female": 0,
                "male": 0,
                "mixed": 0,
                "Mon": 0,
                "Tue": 0,
                "Wed": 0,
                "Thu": 0,
                "Fri": 0,
                "Sat": 0,
                "Sun": 0,
                //Percentage
                "AllP": 0,
                "SingleP": 0,
                "PairsP": 0,
                "eightP": 0,
                "threeP": 0,
                "fourP": 0,
                "sixP": 0,
                "StudentP": 0,
                "EmployedP": 0,
                "UnRetP": 0,
                "PartP": 0,
                "femaleP": 0,
                "maleP": 0,
                "mixedP": 0,
                "MonP": 0,
                "TueP": 0,
                "WedP": 0,
                "ThuP": 0,
                "FriP": 0,
                "SatP": 0,
                "SunP": 0,
                //Average
                "AllA": 0,
                "SingleA": 0,
                "PairsA": 0,
                "eightA": 0,
                "threeA": 0,
                "fourA": 0,
                "sixA": 0,
                "StudentA": 0,
                "EmployedA": 0,
                "UnRetA": 0,
                "PartA": 0,
                "femaleA": 0,
                "maleA": 0,
                "mixedA": 0,
                "MonA": 0,
                "TueA": 0,
                "WedA": 0,
                "ThuA": 0,
                "FriA": 0,
                "SatA": 0,
                "SunA": 0

            });

        }
        var singles = data_profile.filter(d => d.Person2 == '').length;
        var pairs = data_profile.filter(d => d.Person2 != '').length;
        var all = singles + pairs;

        var eight = data_profile.filter(d => (d.Age1 == d.Age2 && d.Age1 == "18-30") || (d.Age2 == '' && d.Age1 == "18-30")).length;
        var three = data_profile.filter(d => (d.Age1 == d.Age2 && d.Age1 == "30-45") || (d.Age2 == '' && d.Age1 == "30-45")).length;
        var four = data_profile.filter(d => (d.Age1 == d.Age2 && d.Age1 == "45-60") || (d.Age2 == '' && d.Age1 == "45-60")).length;
        var six = data_profile.filter(d => (d.Age1 == d.Age2 && d.Age1 == "60-75") || (d.Age2 == '' && d.Age1 == "60-75")).length;

        var stds = data_profile.filter(d => (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "A") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "A")).length;
        var epms = data_profile.filter(d => (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "B") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "B")).length;
        var unrs = data_profile.filter(d => (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "D") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "D")).length;
        var parts = data_profile.filter(d => (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "C") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "C")).length;

        var female = data_profile.filter(d => (d.Gender1 == d.Gender2 && d.Gender1 == "w") || (d.Gender2 == '' && d.Gender1 == "w")).length;
        var male = data_profile.filter(d => (d.Gender1 == d.Gender2 && d.Gender1 == "m") || (d.Gender2 == '' && d.Gender1 == "m")).length;
        var mix = data_profile.filter(d => (d.Gender1 != d.Gender2 && d.Gender2 !== "")).length;


        var totalAll = 0,
            totSingle = 0,
            totParis = 0,
            toteight = 0,
            totfour = 0,
            totthree = 0,
            totsix = 0,
            totA = 0,
            totB = 0,
            totC = 0,
            totD = 0,
            totf = 0,
            totm = 0,
            totmix = 0,
            totmon = 0,
            tottue = 0,
            totwed = 0,
            totthr = 0,
            totfri = 0,
            totsat = 0,
            totsun = 0;


        for (var i = 0; i < sensors.length; i++) {

            data_table[i].All = data_per_element[i].length;
            data_table[i].Single = data_per_element[i].filter(d => d.Group == 0).length;
            data_table[i].Pairs = data_per_element[i].filter(d => d.Group == 1).length;

            data_table[i].eight = data_per_element[i].filter(d => d.Age == '18-30').length;
            data_table[i].three = data_per_element[i].filter(d => d.Age == '30-45').length;
            data_table[i].four = data_per_element[i].filter(d => d.Age == '45-60').length;
            data_table[i].six = data_per_element[i].filter(d => d.Age == '60-75').length;

            data_table[i].Student = data_per_element[i].filter(d => d.Occ == 'A').length;
            data_table[i].Employed = data_per_element[i].filter(d => d.Occ == 'B').length;
            data_table[i].UnRet = data_per_element[i].filter(d => d.Occ == 'D').length;
            data_table[i].Part = data_per_element[i].filter(d => d.Occ == 'C').length;

            data_table[i].female = data_per_element[i].filter(d => d.Gender == 'w').length;
            data_table[i].male = data_per_element[i].filter(d => d.Gender == 'm').length;
            data_table[i].mixed = data_per_element[i].filter(d => d.Gender == 2).length;

            data_table[i].Mon = data_per_element[i].filter(d => d.Weekday == "Mon").length;
            data_table[i].Tue = data_per_element[i].filter(d => d.Weekday == "Tue").length;
            data_table[i].Wed = data_per_element[i].filter(d => d.Weekday == "Wed").length;
            data_table[i].Thu = data_per_element[i].filter(d => d.Weekday == "Thu").length;
            data_table[i].Fri = data_per_element[i].filter(d => d.Weekday == "Fri").length;
            data_table[i].Sat = data_per_element[i].filter(d => d.Weekday == "Sat").length;
            data_table[i].Sun = data_per_element[i].filter(d => d.Weekday == "Sun").length;

            //upd

            totalAll += data_table[i].All;
            totSingle += data_table[i].Single;
            totParis += data_table[i].Pairs;
            toteight += data_table[i].eight;
            totthree += data_table[i].three;
            totfour += data_table[i].four;
            totsix += data_table[i].six;
            totA += data_table[i].Student;
            totB += data_table[i].Employed;
            totC += data_table[i].Part;
            totD += data_table[i].UnRet;
            totf += data_table[i].female;
            totm += data_table[i].male;
            totmix += data_table[i].mixed;
            totmon += data_table[i].Mon;
            tottue += data_table[i].Tue;
            totwed += data_table[i].Wed;
            totthr += data_table[i].Thu;
            totfri += data_table[i].Fri;
            totsat += data_table[i].Sat;
            totsun += data_table[i].Sun;
        }
        for (var i = 0; i < sensors.length; i++) {

            //----Average Per Week----
            data_table[i].AllA = (data_per_element[i].length / all).toFixed(2);
            data_table[i].SingleA = (data_table[i].Single / singles).toFixed(2);
            data_table[i].PairsA = (data_table[i].Pairs / pairs).toFixed(2);

            data_table[i].eightA = (data_table[i].eight / eight).toFixed(2);
            data_table[i].threeA = (data_table[i].three / three).toFixed(2);
            data_table[i].fourA = (data_table[i].four / four).toFixed(2);
            data_table[i].sixA = (data_table[i].six / six).toFixed(2);

            data_table[i].StudentA = (data_table[i].Student / stds).toFixed(2);
            data_table[i].EmployedA = (data_table[i].Employed / epms).toFixed(2);
            data_table[i].UnRetA = (data_table[i].UnRet / unrs).toFixed(2);
            data_table[i].PartA = (data_table[i].Part / parts).toFixed(2);

            data_table[i].femaleA = (data_table[i].female / female).toFixed(2);
            data_table[i].maleA = (data_table[i].male / male).toFixed(2);
            data_table[i].mixedA = (data_table[i].mixed / mix).toFixed(2);

            data_table[i].MonA = (data_table[i].Mon / all).toFixed(2);
            data_table[i].TueA = (data_table[i].Tue / all).toFixed(2);
            data_table[i].WedA = (data_table[i].Wed / all).toFixed(2);
            data_table[i].ThuA = (data_table[i].Thu / all).toFixed(2);
            data_table[i].FriA = (data_table[i].Fri / all).toFixed(2);
            data_table[i].SatA = (data_table[i].Sat / all).toFixed(2);
            data_table[i].SunA = (data_table[i].Sun / all).toFixed(2);
        }




        for (var i = 0; i < sensors.length; i++) {
            //----Average Per Week----
            data_table[i].AllP = (data_per_element[i].length * 100 / totalAll).toFixed(2);
            data_table[i].SingleP = (data_table[i].Single * 100 / totSingle).toFixed(2);
            data_table[i].PairsP = (data_table[i].Pairs * 100 / totParis).toFixed(2);

            data_table[i].eightP = (data_table[i].eight * 100 / toteight).toFixed(2);
            data_table[i].threeP = (data_table[i].three * 100 / totthree).toFixed(2);
            data_table[i].fourP = (data_table[i].four * 100 / totfour).toFixed(2);
            data_table[i].sixP = (data_table[i].six * 100 / totsix).toFixed(2);

            data_table[i].StudentP = (data_table[i].Student * 100 / totA).toFixed(2);
            data_table[i].EmployedP = (data_table[i].Employed * 100 / totB).toFixed(2);
            data_table[i].UnRetP = (data_table[i].UnRet * 100 / totD).toFixed(2);
            data_table[i].PartP = (data_table[i].Part * 100 / totC).toFixed(2);

            data_table[i].femaleP = (data_table[i].female * 100 / totf).toFixed(2);
            data_table[i].maleP = (data_table[i].male * 100 / totm).toFixed(2);
            data_table[i].mixedP = (data_table[i].mixed * 100 / totmix).toFixed(2);

            data_table[i].MonP = (data_table[i].Mon * 100 / totmon).toFixed(2);
            data_table[i].TueP = (data_table[i].Tue * 100 / tottue).toFixed(2);
            data_table[i].WedP = (data_table[i].Wed * 100 / totwed).toFixed(2);
            data_table[i].ThuP = (data_table[i].Thu * 100 / totthr).toFixed(2);
            data_table[i].FriP = (data_table[i].Fri * 100 / totfri).toFixed(2);
            data_table[i].SatP = (data_table[i].Sat * 100 / totsat).toFixed(2);
            data_table[i].SunP = (data_table[i].Sun * 100 / totsun).toFixed(2);
        }
        //Only year 2020

        // Summerized ----------------

        var data_table_igong = [];
        for (var i = 0; i < sensors.length; i++) {
            data_table_igong.push({
                "Sensor": sensors[i],
                "All": 0,
                "Single": 0,
                "Pairs": 0,
                "eight": 0,
                "three": 0,
                "four": 0,
                "six": 0,
                "Student": 0,
                "Employed": 0,
                "UnRet": 0,
                "Part": 0,
                "female": 0,
                "male": 0,
                "mixed": 0,
                "Mon": 0,
                "Tue": 0,
                "Wed": 0,
                "Thu": 0,
                "Fri": 0,
                "Sat": 0,
                "Sun": 0,
                //Percentage
                "AllP": 0,
                "SingleP": 0,
                "PairsP": 0,
                "eightP": 0,
                "threeP": 0,
                "fourP": 0,
                "sixP": 0,
                "StudentP": 0,
                "EmployedP": 0,
                "UnRetP": 0,
                "PartP": 0,
                "femaleP": 0,
                "maleP": 0,
                "mixedP": 0,
                "MonP": 0,
                "TueP": 0,
                "WedP": 0,
                "ThuP": 0,
                "FriP": 0,
                "SatP": 0,
                "SunP": 0,
                //Average
                "AllA": 0,
                "SingleA": 0,
                "PairsA": 0,
                "eightA": 0,
                "threeA": 0,
                "fourA": 0,
                "sixA": 0,
                "StudentA": 0,
                "EmployedA": 0,
                "UnRetA": 0,
                "PartA": 0,
                "femaleA": 0,
                "maleA": 0,
                "mixedA": 0,
                "MonA": 0,
                "TueA": 0,
                "WedA": 0,
                "ThuA": 0,
                "FriA": 0,
                "SatA": 0,
                "SunA": 0

            });

        }
        var singles = data_profile.filter(d => d.Week_Year.substring(3) == '20' && d.Person2 == '').length;
        var pairs = data_profile.filter(d => d.Week_Year.substring(3) == '20' && d.Person2 != '').length;
        var all = singles + pairs;

        var eight = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Age1 == d.Age2 && d.Age1 == "18-30") || (d.Age2 == '' && d.Age1 == "18-30")).length;
        var three = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Age1 == d.Age2 && d.Age1 == "30-45") || (d.Age2 == '' && d.Age1 == "30-45")).length;
        var four = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Age1 == d.Age2 && d.Age1 == "45-60") || (d.Age2 == '' && d.Age1 == "45-60")).length;
        var six = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Age1 == d.Age2 && d.Age1 == "60-75") || (d.Age2 == '' && d.Age1 == "60-75")).length;

        var stds = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "A") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "A")).length;
        var epms = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "B") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "B")).length;
        var unrs = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "D") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "D")).length;
        var parts = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.OccupationCategory1 == d.OccupationCategory2 && d.OccupationCategory1 == "C") || (d.OccupationCategory2 == '' && d.OccupationCategory1 == "C")).length;

        var female = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Gender1 == d.Gender2 && d.Gender1 == "w") || (d.Gender2 == '' && d.Gender1 == "w")).length;
        var male = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Gender1 == d.Gender2 && d.Gender1 == "m") || (d.Gender2 == '' && d.Gender1 == "m")).length;
        var mix = data_profile.filter(d => d.Week_Year.substring(3) == '20' && (d.Gender1 != d.Gender2 && d.Gender2 !== "")).length;

        console.log(singles);

        var totalAll = 0,
            totSingle = 0,
            totParis = 0,
            toteight = 0,
            totfour = 0,
            totthree = 0,
            totsix = 0,
            totA = 0,
            totB = 0,
            totC = 0,
            totD = 0,
            totf = 0,
            totm = 0,
            totmix = 0,
            totmon = 0,
            tottue = 0,
            totwed = 0,
            totthr = 0,
            totfri = 0,
            totsat = 0,
            totsun = 0;


        for (var i = 0; i < sensors.length; i++) {


            data_per_element[i] = data_per_element[i].filter(d => year(new Date(d.Timestamp)) == '20')


            data_table_igong[i].All = data_per_element[i].length;
            data_table_igong[i].Single = data_per_element[i].filter(d => d.Group == 0).length;
            data_table_igong[i].Pairs = data_per_element[i].filter(d => d.Group == 1).length;

            data_table_igong[i].eight = data_per_element[i].filter(d => d.Age == '18-30').length;
            data_table_igong[i].three = data_per_element[i].filter(d => d.Age == '30-45').length;
            data_table_igong[i].four = data_per_element[i].filter(d => d.Age == '45-60').length;
            data_table_igong[i].six = data_per_element[i].filter(d => d.Age == '60-75').length;

            data_table_igong[i].Student = data_per_element[i].filter(d => d.Occ == 'A').length;
            data_table_igong[i].Employed = data_per_element[i].filter(d => d.Occ == 'B').length;
            data_table_igong[i].UnRet = data_per_element[i].filter(d => d.Occ == 'D').length;
            data_table_igong[i].Part = data_per_element[i].filter(d => d.Occ == 'C').length;

            data_table_igong[i].female = data_per_element[i].filter(d => d.Gender == 'w').length;
            data_table_igong[i].male = data_per_element[i].filter(d => d.Gender == 'm').length;
            data_table_igong[i].mixed = data_per_element[i].filter(d => d.Gender == 2).length;

            data_table_igong[i].Mon = data_per_element[i].filter(d => d.Weekday == "Mon").length;
            data_table_igong[i].Tue = data_per_element[i].filter(d => d.Weekday == "Tue").length;
            data_table_igong[i].Wed = data_per_element[i].filter(d => d.Weekday == "Wed").length;
            data_table_igong[i].Thu = data_per_element[i].filter(d => d.Weekday == "Thu").length;
            data_table_igong[i].Fri = data_per_element[i].filter(d => d.Weekday == "Fri").length;
            data_table_igong[i].Sat = data_per_element[i].filter(d => d.Weekday == "Sat").length;
            data_table_igong[i].Sun = data_per_element[i].filter(d => d.Weekday == "Sun").length;

            //upd

            totalAll += data_table_igong[i].All;
            totSingle += data_table_igong[i].Single;
            totParis += data_table_igong[i].Pairs;
            toteight += data_table_igong[i].eight;
            totthree += data_table_igong[i].three;
            totfour += data_table_igong[i].four;
            totsix += data_table_igong[i].six;
            totA += data_table_igong[i].Student;
            totB += data_table_igong[i].Employed;
            totC += data_table_igong[i].Part;
            totD += data_table_igong[i].UnRet;
            totf += data_table_igong[i].female;
            totm += data_table_igong[i].male;
            totmix += data_table_igong[i].mixed;
            totmon += data_table_igong[i].Mon;
            tottue += data_table_igong[i].Tue;
            totwed += data_table_igong[i].Wed;
            totthr += data_table_igong[i].Thu;
            totfri += data_table_igong[i].Fri;
            totsat += data_table_igong[i].Sat;
            totsun += data_table_igong[i].Sun;
        }
        for (var i = 0; i < sensors.length; i++) {

            //----Average Per Week----
            data_table_igong[i].AllA = (data_per_element[i].length / all).toFixed(2);
            data_table_igong[i].SingleA = (data_table_igong[i].Single / singles).toFixed(2);
            data_table_igong[i].PairsA = (data_table_igong[i].Pairs / pairs).toFixed(2);

            data_table_igong[i].eightA = (data_table_igong[i].eight / eight).toFixed(2);
            data_table_igong[i].threeA = (data_table_igong[i].three / three).toFixed(2);
            data_table_igong[i].fourA = (data_table_igong[i].four / four).toFixed(2);
            data_table_igong[i].sixA = (data_table_igong[i].six / six).toFixed(2);

            data_table_igong[i].StudentA = (data_table_igong[i].Student / stds).toFixed(2);
            data_table_igong[i].EmployedA = (data_table_igong[i].Employed / epms).toFixed(2);
            data_table_igong[i].UnRetA = (data_table_igong[i].UnRet / unrs).toFixed(2);
            data_table_igong[i].PartA = (data_table_igong[i].Part / parts).toFixed(2);

            data_table_igong[i].femaleA = (data_table_igong[i].female / female).toFixed(2);
            data_table_igong[i].maleA = (data_table_igong[i].male / male).toFixed(2);
            data_table_igong[i].mixedA = (data_table_igong[i].mixed / mix).toFixed(2);

            data_table_igong[i].MonA = (data_table_igong[i].Mon / all).toFixed(2);
            data_table_igong[i].TueA = (data_table_igong[i].Tue / all).toFixed(2);
            data_table_igong[i].WedA = (data_table_igong[i].Wed / all).toFixed(2);
            data_table_igong[i].ThuA = (data_table_igong[i].Thu / all).toFixed(2);
            data_table_igong[i].FriA = (data_table_igong[i].Fri / all).toFixed(2);
            data_table_igong[i].SatA = (data_table_igong[i].Sat / all).toFixed(2);
            data_table_igong[i].SunA = (data_table_igong[i].Sun / all).toFixed(2);
        }

        for (var i = 0; i < sensors.length; i++) {
            //----Average Per Week----
            data_table_igong[i].AllP = (data_per_element[i].length * 100 / totalAll).toFixed(2);
            data_table_igong[i].SingleP = (data_table_igong[i].Single * 100 / totSingle).toFixed(2);
            data_table_igong[i].PairsP = (data_table_igong[i].Pairs * 100 / totParis).toFixed(2);

            data_table_igong[i].eightP = (data_table_igong[i].eight * 100 / toteight).toFixed(2);
            data_table_igong[i].threeP = (data_table_igong[i].three * 100 / totthree).toFixed(2);
            data_table_igong[i].fourP = (data_table_igong[i].four * 100 / totfour).toFixed(2);
            data_table_igong[i].sixP = (data_table_igong[i].six * 100 / totsix).toFixed(2);

            data_table_igong[i].StudentP = (data_table_igong[i].Student * 100 / totA).toFixed(2);
            data_table_igong[i].EmployedP = (data_table_igong[i].Employed * 100 / totB).toFixed(2);
            data_table_igong[i].UnRetP = (data_table_igong[i].UnRet * 100 / totD).toFixed(2);
            data_table_igong[i].PartP = (data_table_igong[i].Part * 100 / totC).toFixed(2);

            data_table_igong[i].femaleP = (data_table_igong[i].female * 100 / totf).toFixed(2);
            data_table_igong[i].maleP = (data_table_igong[i].male * 100 / totm).toFixed(2);
            data_table_igong[i].mixedP = (data_table_igong[i].mixed * 100 / totmix).toFixed(2);

            data_table_igong[i].MonP = (data_table_igong[i].Mon * 100 / totmon).toFixed(2);
            data_table_igong[i].TueP = (data_table_igong[i].Tue * 100 / tottue).toFixed(2);
            data_table_igong[i].WedP = (data_table_igong[i].Wed * 100 / totwed).toFixed(2);
            data_table_igong[i].ThuP = (data_table_igong[i].Thu * 100 / totthr).toFixed(2);
            data_table_igong[i].FriP = (data_table_igong[i].Fri * 100 / totfri).toFixed(2);
            data_table_igong[i].SatP = (data_table_igong[i].Sat * 100 / totsat).toFixed(2);
            data_table_igong[i].SunP = (data_table_igong[i].Sun * 100 / totsun).toFixed(2);
        }

        //profile
        var data_profile_table = [{
            "name": "Single",

            "subjects": weeks_single.length,
            "eight": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Age1 == "18-30").length,
            "three": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Age1 == "30-45").length,
            "four": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Age1 == "45-60").length,
            "six": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Age1 == "60-75").length,
            "Student": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.OccupationCategory1 == "A").length,
            "Employed": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.OccupationCategory1 == "B").length,
            "UnRet": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.OccupationCategory1 == "D").length,
            "Part": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.OccupationCategory1 == "C").length,
            "female": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Gender1 == "w").length,
            "male": data_profile.filter(d => weeks_single.includes(d.Week_Year) && d.Gender1 == "m").length,
            "mixed": '-'
        }, {
            "name": "Pairs",
            "subjects": weeks_double.length * 2 + " (" + weeks_double.length + ")",
            "eight": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age1 == "18-30").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age2 == "18-30").length,
            "three": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age1 == "30-45").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age2 == "30-45").length,
            "four": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age1 == "45-60").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age2 == "45-60").length,
            "six": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age1 == "60-75").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Age2 == "60-75").length,
            "Student": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory1 == "A").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory2 == "A").length,
            "Employed": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory1 == "B").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory2 == "B").length,
            "UnRet": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory1 == "D").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory2 == "D").length,
            "Part": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory1 == "C").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.OccupationCategory2 == "C").length,
            "female": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Gender1 == "w").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Gender2 == "w").length,
            "male": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Gender1 == "m").length + data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Gender2 == "m").length,
            "mixed": data_profile.filter(d => weeks_double.includes(d.Week_Year) && d.Genders.includes('w') && d.Genders.includes('m')).length
        }];

        console.log(data_table);
        console.log(data_profile_table)
        console.log(data_table_igong)


        toJson(data_table, 'data_table_Besucher.json')
        toJson(data_table_igong, 'data_table_2020_Besucher.json')


        //toJson(data_profile_table, 'data_profile_table.json')




    });

}