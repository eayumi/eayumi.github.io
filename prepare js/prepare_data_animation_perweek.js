/**
 * Create data for animation 
 * 
 * 
 * data_animation_nest stores in its i-th entry the an array for a week, which in turn stores the data for the in for the j-th element.
 * It stores for each measured movement: { "Sensorname" ,"From", "To","Total", "Time","Timestamp"}
 * 
 */
function prepare_data_animation_perweek() {

    d3.json('data/data.json').then(function(data) {
        var week = d3.timeFormat('%V-%y')
        console.log(data[0].Timestamp)
        console.log(new Date(data[0].Timestamp))

        console.log(data.length)

        data = data.filter(d => !weeks_out.includes(week(new Date(d.Timestamp))))

        console.log(data.length)
        var data_animation = [];
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
        var data_K_IT_cyr = data.filter(x => x.Sensorname === '_K_IT_cyr'); //Sensor 34

        data_per_element.push(data_K_Schub_Ofen_cyr);
        data_per_element.push(data_K_Schub_Oben_Str);
        data_per_element.push(data_K_Schub_Mitte_cyr);
        data_per_element.push(data_K_Schub_Unten_cyr);
        data_per_element.push(data_K_IT_cyr);


        /*H_Eingang_cyrspec, W_Balkon_cyrspec, W_Wand_Strspec (Sensor 35,36,37) LEFT OUT FOR NOW 
            --> These are measurement of light, temperature, switch, moist*/

        var data_W_Balkon_cyrspec_switch = data.filter(x => x.Sensorname === 'W_Balkon_cyrspec__sw');
        var data_W_Balkon_cyrspec_temp = data.filter(x => x.Sensorname === 'W_Balkon_cyrspec_temp');
        var data_W_Balkon_cyrspec_light = data.filter(x => x.Sensorname === 'W_Balkon_cyrspec_light');
        var data_W_Balkon_cyrspec_moist = data.filter(x => x.Sensorname === 'W_Balkon_cyrspec_moist');

        data_per_element.push(data_W_Balkon_cyrspec_switch);
        data_per_element.push(data_W_Balkon_cyrspec_temp);
        data_per_element.push(data_W_Balkon_cyrspec_light);
        data_per_element.push(data_W_Balkon_cyrspec_moist);

        var data_H_Eingang_cyrspec_switch = data.filter(x => x.Sensorname === "H_Eingang_cyrspec_switch");
        var data_H_Eingang_cyrspec_temp = data.filter(x => x.Sensorname === 'H_Eingag_cyrspec_temp');
        var data_H_Eingang_cyrspec_light = data.filter(x => x.Sensorname === 'H_Eingag_cyrspec_light');
        var data_H_Eingang_cyrspec_moist = data.filter(x => x.Sensorname === 'H_Eingag_cyrspec_moist');

        data_per_element.push(data_H_Eingang_cyrspec_switch);
        data_per_element.push(data_H_Eingang_cyrspec_temp);
        data_per_element.push(data_H_Eingang_cyrspec_light);
        data_per_element.push(data_H_Eingang_cyrspec_moist);


        console.log(data_per_element)
        for (var i = 0; i < 4; i++) {
            data_animation.push([])

            for (var j = 0; j < data_per_element[i].length; j++) {
                d = data_per_element[i][j];

                data_animation[i].push({
                    "Sensorname": d.Sensorname,
                    "From": d.Value1, //Open or Closed or On or Off
                    "To": d.Value2,
                    "Total": d.ValueDiff,
                    "Time": d.Duration,
                    "Timestamp": new Date(d.Timestamp),
                    "Type": 0
                })
            }
        }

        /**
         * The other elements.
         * Handle From, To, Time, differently.
         * 
         * DATA_IRONED. took out all consecutive OPEN's or CLOSED's
         */
        data_ironed = [];
        for (var i = 4; i < data_per_element.length; i++) {
            //data_ironed.push([]);
            data_ironed.push(data_per_element[i]);

            // var toggle = 0;
            // if (data_per_element[i].length > 1) {
            //     toggle = data_per_element[i][0].Value1;
            //     data_ironed[i - 4].push(data_per_element[i][0]);
            // }
            // for (var j = 1; j < data_per_element[i].length; j++) {
            //     if (toggle != data_per_element[i][j].Value1) {
            //         data_ironed[i - 4].push(data_per_element[i][j]);
            //         toggle = data_per_element[i][j].Value1;
            //     }

            // }
        }

        for (var i = 0; i < data_ironed.length; i++) {
            data_animation.push([])
            var type = 0;
            if (data_ironed[i].length > 0) {
                if (['CLOSED', 'OPEN'].includes(data_ironed[i][0].Value1)) {
                    type = 1;
                } else if (['ON', 'OFF'].includes(data_ironed[i][0].Value1)) {
                    type = 2;
                }
                first = new Date(data_ironed[i][0].Timestamp)
                second = first;
            }

            for (var j = 0; j < data_ironed[i].length; j++) {
                d = data_ironed[i][j];
                var val = ((data_ironed[i][j].Value1 == 'OPEN' || data_ironed[i][j].Value1 == 'ON') ? 1 : 0);

                if (data_ironed[i].length - 1 > j) second = new Date(data_ironed[i][j + 1].Timestamp);

                data_animation[i + 4].push({
                    "Sensorname": d.Sensorname,
                    "From": val, //Open or Closed or On or Off
                    "To": -1,
                    "Total": -1,
                    "Time": second - first,
                    "Timestamp": new Date(d.Timestamp),
                    "Type": type
                })
                first = second


            }
            console.log(data_animation[i + 4])
        }

        schrankdoor = [12, 13];
        for (var i = 0; i < 2; i++) {
            index = schrankdoor[i];
            for (var j = 0; j < data_animation[index].length; j++) {
                i_DS = get(data_animation[index][j].Timestamp, data_animation[1]);
                data_animation[index][j].DS = data_animation[1][i_DS].To;
            }

        }
        console.log(weeks_not_out)

        data_animation_nest = []
        for (var i = 0; i < data_animation.length; i++) {
            data_animation_nest[i] = d3.nest().key(function(d) {
                return week(new Date(d.Timestamp))
            }).entries(data_animation[i]);
            // data_animation_nest[i].filter(d => weeks_not_out.includes(d.key))
        }

        console.log('data_animation_nest')
        console.log(data_animation_nest)

        data_animation_per_week = [];

        // toJson(data_animation, 'data_animation.json');
        var sens = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand',
            'K_Fen_Oben_Str', 'K_Fen_Unten_Str',
            'S_Fen_Oben_Str', 'S_Fen_Unten_Str', 'S_Boden_Wand_cyr', 'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
            'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str',
            'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr',
            'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr', 'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
            'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr',
            'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Schub_Oben_cyr', 'K_Ofen_Schub_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr'
        ];
        console.log(sens.length);
        wf = weeks_not_out.map(d => d.Week_Year)

        var empt = [];
        for (var i = 0; i < data_animation_nest.length; i++) empt.push([]);
        data_animation_nest_ = [];
        for (var w = 0; w < wf.length; w++) {
            data_animation_nest_.push({ Week: wf[w], data: empt.slice() })
        }


        //per sensor
        for (var s = 0; s < data_animation_nest.length; s++) {
            //    per week
            for (var w = 0; w < data_animation_nest[s].length; w++) {
                ind_week = wf.indexOf('' + data_animation_nest[s][w].key);
                // console.log(data_animation_nest[s][w].key)

                if (ind_week > 0) {
                    ind_sens = s;
                    // console.log(data_animation_nest[s][w].values)
                    data_animation_nest_[ind_week].data[ind_sens] = data_animation_nest[s][w].values
                }

            }


        }
        console.log('data_animation_nest_')
        console.log(data_animation_nest_)
        toJson(data_animation_nest_, 'data_animation_nest.json');


    });

}


/**
 * binary search to find index of the data instance that would be playing at this time. 
 * @param {} timestamp 
 */
function get(timestamp, data) {
    var left = 0;
    var right = data.length - 1;
    var m = Math.floor((left + right) / 2);
    var found = false;

    while (!found) {
        if (Math.abs(left - right) <= 1 || data[m].Timestamp == timestamp) {
            found = true;
            // console.log('found ' + data[m].Timestamp + " " + right + " " + m + " " + left)

            return m;
        } else if (data[m].Timestamp < timestamp) {
            left = m;
            m = Math.floor((left + right) / 2);

        } else {
            right = m;
            m = Math.floor((left + right) / 2);

        }
    }


}