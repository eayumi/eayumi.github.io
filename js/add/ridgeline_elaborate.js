var timestamp = d3.timeFormat('%Y-%m-%d %H:%M:%S.%L');
var weekday = d3.timeFormat('%A');
var weeknr = d3.timeFormat('%V');
var timej = d3.timeFormat('%H:%M:%S.%L');

var starttime = (new Date(('2020-02-03 00:00:00.000')));
var endtime = new Date(('2020-02-03 23:59:59.999'));

var margin = { top: 80, bottom: 50, right: 1, left: 140 },
    width = 750,
    height = 1140,
    w = width - margin.right - margin.left,
    h = height - margin.bottom - margin.top,
    overlap = 1;


var selectedSensor = 'LampeAussenwand';
var selectedWeekday = 'Monday';
var selectedGroup = 'All';
var tempGroup = 'All';

var GenderS = ['w', 'm'];
var GenderD = ['ww', 'mm', 'wm'];
var Age = [0, 1, 2, 3];
var Empolyment = ['A', 'E', 'S', 'R', 'U'];

var choicesEmployment = [];
var choicesGenderS = [];
var choicesGenderD = [];
var choicesAge = [];

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var sensors = ['LampeAussenwand', 'LampeDrehwand', 'Drehwand', 'Drehschrank',
    'K_Fen_Oben_Str',
    'K_Fen_Unten_Str',
    'S_Fen_Oben_Str',
    'S_Fen_Unten_Str',
    'S_Boden_Wand_cyr',
    'S_Boden_Kueche_cyr',
    'S_Schub_Wand_cyr',
    'S_Schub_Kueche_cyr',

    'H_Putz_cyr',
    'H_Graderobe_cyr',
    'H_Tuer_Str',

    'B_Tuer_Str',
    'B_Schrank_cyr',
    'B_Wasch_cyr',

    'W_Schub_Bad_cyr',
    'W_Schub_Wand_cyr',
    'W_Boden_Bad_cyr',
    'W_Boden_Wand_cyr',
    'W_Fen_Bad_Str',
    'W_Fen_Wand_Str',

    'K_Schrank_Oben_01_cyr',
    'K_Schrank_Oben_02_cyr',
    'K_Schrank_Oben_03_cyr',
    'K_Schrank_Oben_04_cyr',
    'K_Schrank_Oben_05_cyr',
    'K_Kuehl_cyr',
    'K_Abfall_cyr',
    'K_Wasch_Str',
    'K_Ofen_Str',
    'K_Schub_Oben_cyr',
    'K_Ofen_Schub_cyr',
    'K_Schub_Mitte_cyr',
    'K_Schub_Unten_cyr',
    'K_IT_cyr',

    'W_Balkon_cyrspec_switch',
    'W_Balkon_cyrspec_temp',
    'W_Balkon_cyrspec_light',
    'W_Balkon_cyrspec_moist',

    'H_Eingang_cyrspec_switch',
    'H_Eingag_cyrspec_temp',
    'H_Eingag_cyrspec_light',
    'H_Eingag_cyrspec_moist'
];
var openclosedSensors = [
    'K_Fen_Oben_Str', 'K_Fen_Unten_Str',
    'S_Fen_Oben_Str', 'S_Fen_Unten_Str', 'S_Boden_Wand_cyr', 'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
    'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str',
    'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr',
    'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr', 'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
    'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr',
    'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Schub_Oben_cyr', 'K_Ofen_Schub_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr', 'K_IT_cyr'
];
var onoffSensors = ['W_Balkon_cyrspec_switch', 'H_Eingang_cyrspec_switch'];

var groups = ['All', 'Single', 'Double'];


// var weeks_double = ['41', '44', '45', '46', '48', '49', '50', '03', '05', '09', '10'];
// var weeks_single = ['37', '38', '39', '42', '47', '51', '52', '01', '02', '04', '06', '07', '08'];
// var weeks_all = ['37', '38', '39', '41', '42', '44', '45', '46', '47', '48', '49', '50', '51', '52', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

function ridgeline_elaborate() {

    //var graph = d3.json('data/data.json').then(function(datas) {
    Promise.all([d3.json('../data/data.json')]).then(function(valuess) {
        var datas = valuess[0].map(function(d) {
            d.Timestamp = d.Timestamp.slice(2);
            return d;
        });
        var doubleData = data_profile.filter(d => d.Group == 1);
        var singleData = data_profile.filter(d => d.Group == 0);

        //FIRST filter data accoring to the 4 sensors
        var data_LA,
            data_LD,
            data_DW,
            data_DS,
            data_K_Fen_Oben_Str = [], //Sensor 1
            data_K_Fen_Unten_Str = [],
            data_S_Fen_Oben_Str = [], //Sensor 3
            data_S_Fen_Unten_Str = [], //Sensor 4
            data_S_Boden_Wand_cyr = [], //Sensor 5
            data_S_Boden_Kueche_cyr = [],

            data_S_Schub_Wand_cyr = [], //Sensor 7
            data_S_Schub_Kueche_cyr = [], //Sensor 8

            data_H_Putz_cyr = [], //Sensor 9
            data_H_Garderobe_cyr = [], //Sensor 10
            data_H_Tuer_Str = [], //Sensor 11

            data_B_Tuer_Str = [], //Sensor 12
            data_B_Schrank_cyr = [], //Sensor 13
            data_B_Wasch_cyr = [], //Sensor 14

            data_W_Schub_Bad_cyr = [], //Sensor 15
            data_W_Schub_Wand_cyr = [], //Sensor 16
            data_W_Boden_Bad_cyr = [], //Sensor 17
            data_W_Boden_Wand_cyr = [], //Sensor 18
            data_W_Fen_Bad_Str = [], //Sensor 19
            data_W_Fen_Wand_Str = [], //Sensor 20

            data_K_Schrank_Oben_01_cyr = [], //Sensor 21
            data_K_Schrank_Oben_02_cyr = [], //Sensor 22
            data_K_Schrank_Oben_03_cyr = [], //Sensor 23
            data_K_Schrank_Oben_04_cyr = [], //Sensor 24
            data_K_Schrank_Oben_05_cyr = [], //Sensor 25
            data_K_Kuehl_cyr = [], //Sensor 26
            data_K_Abfall_cyr = [], //Sensor 27
            data_K_Wasch_Str = [], //Sensor 28
            data_K_Ofen_Str = [], //Sensor 29
            data_K_Schub_Oben_cyr = [], //Sensor 30
            data_K_Ofen_Schub_cyr = [], //Sensor 31
            data_K_Schub_Mitte_cyr = [], //Sensor 32
            data_K_Schub_Unten_cyr = [], //Sensor 33
            data_K_IT_cyr = [], //Sensor 34

            /*H_Eingang_cyrspec, W_Balkon_cyrspec, W_Wand_Strspec (Sensor 35,36,37) LEFT OUT FOR NOW 
                --> These are measurement of light, temperature, switch, moist
            */
            data_W_Balkon_cyrspec_switch = [],
            data_W_Balkon_cyrspec_temp = [],
            data_W_Balkon_cyrspec_light = [],
            data_W_Balkon_cyrspec_moist = [],

            data_H_Eingang_cyrspec_switch = [],
            data_H_Eingang_cyrspec_temp = [],
            data_H_Eingang_cyrspec_light = [],
            data_H_Eingang_cyrspec_moist = [];


        data_LA = datas.filter(x => x.Sensorname == 'LampeAussenwand');
        data_LD = datas.filter(x => x.Sensorname == 'LampeDrehwand');
        data_DW = datas.filter(x => x.Sensorname == 'Drehwand');
        data_DS = datas.filter(x => x.Sensorname == 'Drehschrank');

        data_K_Fen_Oben_Str = datas.filter(x => x.Sensorname === 'K_Fen_Oben_Str'); //Sensor 1
        data_K_Fen_Unten_Str = datas.filter(x => x.Sensorname === 'K_Fen_Unten_Str'); //Sensor 2

        data_S_Fen_Oben_Str = datas.filter(x => x.Sensorname === 'S_Fen_Oben_Str'); //Sensor 3
        data_S_Fen_Unten_Str = datas.filter(x => x.Sensorname === 'S_Fen_Unten_Str'); //Sensor 4
        data_S_Boden_Wand_cyr = datas.filter(x => x.Sensorname === 'S_Boden_Wand_cyr'); //Sensor 5
        data_S_Boden_Kueche_cyr = datas.filter(x => x.Sensorname === 'S_Boden_Kueche_cyr'); //Sensor 6
        data_S_Schub_Wand_cyr = datas.filter(x => x.Sensorname === 'S_Schub_Wand_cyr'); //Sensor 7
        data_S_Schub_Kueche_cyr = datas.filter(x => x.Sensorname === 'S_Schub_Kueche_cyr'); //Sensor 8

        data_H_Putz_cyr = datas.filter(x => x.Sensorname === 'H_Putz_cyr'); //Sensor 9
        data_H_Garderobe_cyr = datas.filter(x => x.Sensorname === 'H_Graderobe_cyr'); //Sensor 10
        data_H_Tuer_Str = datas.filter(x => x.Sensorname === 'H_Tuer_Str'); //Sensor 11

        data_B_Tuer_Str = datas.filter(x => x.Sensorname === 'B_Tuer_Str'); //Sensor 12
        data_B_Schrank_cyr = datas.filter(x => x.Sensorname === 'B_Schrank_cyr'); //Sensor 13
        data_B_Wasch_cyr = datas.filter(x => x.Sensorname === 'B_Wasch_cyr'); //Sensor 14
        data_W_Schub_Bad_cyr = datas.filter(x => x.Sensorname === 'W_Schub_Bad_cyr'); //Sensor 15
        data_W_Schub_Wand_cyr = datas.filter(x => x.Sensorname === 'W_Schub_Wand_cyr'); //Sensor 16
        data_W_Boden_Bad_cyr = datas.filter(x => x.Sensorname === 'W_Boden_Bad_cyr'); //Sensor 17
        data_W_Boden_Wand_cyr = datas.filter(x => x.Sensorname === 'W_Boden_Wand_cyr'); //Sensor 18
        data_W_Fen_Bad_Str = datas.filter(x => x.Sensorname === 'W_Fen_Bad_Str'); //Sensor 19
        data_W_Fen_Wand_Str = datas.filter(x => x.Sensorname === 'W_Fen_Wand_Str'); //Sensor 20

        data_K_Schrank_Oben_01_cyr = datas.filter(x => x.Sensorname === 'K_Schrank_Oben_01_cyr'); //Sensor 21
        data_K_Schrank_Oben_02_cyr = datas.filter(x => x.Sensorname === 'K_Schrank_Oben_02_cyr'); //Sensor 22
        data_K_Schrank_Oben_03_cyr = datas.filter(x => x.Sensorname === 'K_Schrank_Oben_03_cyr'); //Sensor 23
        data_K_Schrank_Oben_04_cyr = datas.filter(x => x.Sensorname === 'K_Schrank_Oben_04_cyr'); //Sensor 24
        data_K_Schrank_Oben_05_cyr = datas.filter(x => x.Sensorname === 'K_Schrank_Oben_05_cyr'); //Sensor 25
        data_K_Kuehl_cyr = datas.filter(x => x.Sensorname === 'K_Kuehl_cyr'); //Sensor 26
        data_K_Abfall_cyr = datas.filter(x => x.Sensorname === 'K_Abfall_cyr'); //Sensor 27
        data_K_Wasch_Str = datas.filter(x => x.Sensorname === 'K_Wasch_Str'); //Sensor 28
        data_K_Ofen_Str = datas.filter(x => x.Sensorname === 'K_Ofen_Str'); //Sensor 29
        data_K_Schub_Oben_cyr = datas.filter(x => x.Sensorname === 'K_Schub_Oben_cyr'); //Sensor 30
        data_K_Ofen_Schub_cyr = datas.filter(x => x.Sensorname === 'K_Ofen_Schub_cyr'); //Sensor 31
        data_K_Schub_Mitte_cyr = datas.filter(x => x.Sensorname === 'K_Schub_Mitte_cyr'); //Sensor 32
        data_K_Schub_Unten_cyr = datas.filter(x => x.Sensorname === 'K_Schub_Unten_cyr'); //Sensor 33
        data_K_IT_cyr = datas.filter(x => x.Sensorname === 'K_IT_cyr'); //Sensor 34

        data_W_Balkon_cyrspec_switch = datas.filter(x => x.Sensorname === 'W_Balkon_cyrspec_switch');
        data_W_Balkon_cyrspec_temp = datas.filter(x => x.Sensorname === 'W_Balkon_cyrspec_temp');
        data_W_Balkon_cyrspec_light = datas.filter(x => x.Sensorname === 'W_Balkon_cyrspec_light');
        data_W_Balkon_cyrspec_moist = datas.filter(x => x.Sensorname === 'W_Balkon_cyrspec_moist');

        data_H_Eingang_cyrspec_switch = datas.filter(x => x.Sensorname === 'H_Eingang_cyrspec_switch');
        data_H_Eingang_cyrspec_temp = datas.filter(x => x.Sensorname === 'H_Eingag_cyrspec_temp');
        data_H_Eingang_cyrspec_light = datas.filter(x => x.Sensorname === 'H_Eingag_cyrspec_light');
        data_H_Eingang_cyrspec_moist = datas.filter(x => x.Sensorname === 'H_Eingag_cyrspec_moist');


        var datalist = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []

        ];
        var datapoints = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        var datapoints_raw = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []

        ];
        var datapoints_all = {
            'Monday': {
                Datapoints: [],
                Datapoints_raw: []
            },
            'Tuesday': {
                Datapoints: [],
                Datapoints_raw: []
            },
            'Wednesday': {
                Datapoints: [],
                Datapoints_raw: []
            },
            'Thursday': {
                Datapoints: [],
                Datapoints_raw: []
            },
            'Friday': {
                Datapoints: [],
                Datapoints_raw: []
            },
            'Saturday': {
                Datapoints: [],
                Datapoints_raw: []
            },
            'Sunday': {
                Datapoints: [],
                Datapoints_raw: []
            }

        }

        var dropdownButton1 = d3.select('#button').append('select');
        var dropdownButton2 = d3.select('#buttonDay').append('select');
        var dropdownButton3 = d3.select('#buttonGroup').append('select');
        var submitButton = d3.select('#SubmitButton');




        var filterBox = d3.select('#filterOption')
            .append("svg")
            .attr('width', 60)
            .attr('height', 200)
            .append("g");

        datalist = [data_LA, data_LD, data_DW, data_DS,
            data_K_Fen_Oben_Str, //4
            data_K_Fen_Unten_Str, //5
            data_S_Fen_Oben_Str, //6
            data_S_Fen_Unten_Str, //7
            data_S_Boden_Wand_cyr, //8
            data_S_Boden_Kueche_cyr, //9
            data_S_Schub_Wand_cyr, //10
            data_S_Schub_Kueche_cyr, //11

            data_H_Putz_cyr, //12
            data_H_Garderobe_cyr, //13
            data_H_Tuer_Str, //14

            data_B_Tuer_Str, //15
            data_B_Schrank_cyr, //16
            data_B_Wasch_cyr, //17

            data_W_Schub_Bad_cyr, //18
            data_W_Schub_Wand_cyr, //19
            data_W_Boden_Bad_cyr, //20
            data_W_Boden_Wand_cyr, //21
            data_W_Fen_Bad_Str, //22
            data_W_Fen_Wand_Str, //23

            data_K_Schrank_Oben_01_cyr, //24
            data_K_Schrank_Oben_02_cyr, //25
            data_K_Schrank_Oben_03_cyr, //26
            data_K_Schrank_Oben_04_cyr, //27
            data_K_Schrank_Oben_05_cyr, //28
            data_K_Kuehl_cyr, //29
            data_K_Abfall_cyr, //30
            data_K_Wasch_Str, //31
            data_K_Ofen_Str, //32
            data_K_Schub_Oben_cyr, //33
            data_K_Ofen_Schub_cyr, //34
            data_K_Schub_Mitte_cyr, //35
            data_K_Schub_Unten_cyr, //36
            data_K_IT_cyr, //37

            data_W_Balkon_cyrspec_switch, //38/
            data_W_Balkon_cyrspec_temp, //39
            data_W_Balkon_cyrspec_light, //40
            data_W_Balkon_cyrspec_moist, //41

            data_H_Eingang_cyrspec_switch, //42
            data_H_Eingang_cyrspec_temp, //43
            data_H_Eingang_cyrspec_light, //44
            data_H_Eingang_cyrspec_moist //45
        ];

        //calculate all datapoints: datapoints

        for (var i = 0; i < 4; i++) {
            for (d in datalist[i]) {
                timestamps = datalist[i][d].Timestamp;
                date = new Date(timestamps);
                datapoints_raw[i].push({
                    index: parseInt(d),
                    week: weeknr(date),
                    val: datalist[i][d].Value1,
                    weekday: weekday(date),
                    time: new Date('2020-02-03 ' + timestamps.slice(11, 22)),
                    timestamp: timestamps,
                    line: 'linear',
                    type: 'double'
                });

                timestamps = d3.timeMillisecond.offset(date, datalist[i][d].Duration);
                date = new Date(timestamps);
                datapoints_raw[i].push({
                    index: parseInt(d) + .5,
                    week: weeknr(date),
                    val: datalist[i][d].Value2,
                    weekday: weekday(date),
                    time: new Date('2020-02-03 ' + timej(date)),
                    timestamp: timestamp(timestamps),
                    line: 'linear',
                    type: 'double'
                });
            }

        }



        for (var i = 4; i < datalist.length; i++) {
            for (d in datalist[i]) {

                timestamps = datalist[i][d].Timestamp;
                date = new Date(timestamps);
                var val, line = 'linear',
                    type = 'measure';

                if (datalist[i][d].Value1 == 'ON' || datalist[i][d].Value1 == 'OPEN') {
                    val = 1;
                    line = 'step';
                    if (datalist[i][d].Value1 == 'ON') {
                        type = 'onoff'
                    } else {
                        type = 'openclosed'
                    }

                } else if (datalist[i][d].Value1 == 'OFF' || datalist[i][d].Value1 == 'CLOSED') {
                    val = 0;
                    line = 'step';
                    if (datalist[i][d].Value1 == 'OFF') {
                        type = 'onoff'
                    } else {
                        type = 'openclosed'
                    }

                } else {
                    val = datalist[i][d].Value1;
                }

                datapoints_raw[i].push({
                    index: parseInt(d),
                    week: weeknr(date),
                    val: val,
                    weekday: weekday(date),
                    time: new Date('2020-02-03 ' + timestamps.slice(11, 22)),
                    timestamp: timestamps,
                    line: line,
                    type: type
                });
            }

        }

        var temp = datapoints_raw;
        for (weekdayd in weekdays) {
            datapoints_raw = temp;

            for (i in datapoints_raw) {
                datapoints[i] = d3.nest().key(function(d) {
                        return d.week;
                    }).key(function(d) {
                        return d.weekday;
                    })
                    .entries(datapoints_raw[i]);

                datapoints[i] = datapoints[i].filter(q => q.key != '40' && q.key != '43');


                datapoints[i].map(function(d) {
                    d.values = d.values.filter(q => q.key == weekdays[weekdayd]);

                    if (d.values.length == 0) {
                        if (onoffSensors.includes(sensors[i]) || openclosedSensors.includes(sensors[i])) {
                            line = 'step'
                        } else {
                            line = 'measure';
                        }
                        d.values = [{
                            key: weekdays[weekdayd],
                            values: [{
                                index: -1,
                                week: d.key,
                                val: 0,
                                weekday: weekdays[weekdayd],
                                timestamp: 'start',
                                time: (starttime),
                                line: line
                            }, {
                                index: -2,
                                week: d.key,
                                val: 0,
                                weekday: weekdays[weekdayd],
                                timestamp: 'end',
                                time: (endtime),
                                line: line

                            }]
                        }];

                    } else {

                        if (i < 4) {

                            if (d.values[0].index > 0) { //ie there are values recorded before this time
                                ind = d.values[0].values[0].index * 2 - 1;
                                ang = datapoints_raw[i][ind].val;
                            } else {
                                ang = d.values[0].values[0].val;
                            }

                            d.values[0].values.unshift({
                                index: -1,
                                week: d.key,
                                val: ang,
                                weekday: weekdays[weekdayd],
                                timestamp: 'start',
                                time: (starttime),
                                line: 'first'

                            });

                            len = d.values[0].values.length;

                            if (d.values[0].values[len - 1].index > 0) {
                                ang = d.values[0].values[len - 1].val;

                                d.values[0].values.push({
                                    index: -2,
                                    week: d.key,
                                    val: ang,
                                    weekday: weekdays[weekdayd],
                                    timestamp: 'end',
                                    time: (endtime),
                                    line: 'last'
                                });
                            }
                        } else if (onoffSensors.includes(sensors[i]) || openclosedSensors.includes(sensors[i])) {

                            if (d.values[0].index > 0) {
                                ind = d.values[0].values[0].index - 1;
                                ang = (datapoints_raw[i][ind].val + 1) % 2;
                            } else {
                                ang = (d.values[0].values[0].val + 1) % 2;
                            }

                            d.values[0].values.unshift({
                                index: -1,
                                week: d.key,
                                val: ang,
                                weekday: weekdays[weekdayd],
                                timestamp: 'start',
                                time: (starttime),
                                line: 'first',
                                type: d.values[0].values[0].type

                            });

                            len = d.values[0].values.length;

                            if (d.values[0].values[len - 1].index > 0) {
                                ang = d.values[0].values[len - 1].val;

                                d.values[0].values.push({
                                    index: -2,
                                    week: d.key,
                                    val: ang,
                                    weekday: weekdays[weekdayd],
                                    timestamp: 'end',
                                    time: (endtime),
                                    line: 'last',
                                    type: d.values[0].values[0].type
                                });
                            }

                        } else {

                            if (d.values[0].index > 0) {
                                ind = d.values[0].values[0].index - 1;
                                ang = datapoints_raw[i][ind].val;
                            } else {
                                ang = d.values[0].values[0].val;
                            }

                            d.values[0].values.unshift({
                                index: -1,
                                week: d.key,
                                val: ang,
                                weekday: weekdays[weekdayd],
                                timestamp: 'start',
                                time: (starttime),
                                line: 'first',
                                type: 'measure'

                            });

                            len = d.values[0].values.length;

                            if (d.values[0].values[len - 1].index > 0) {
                                ang = d.values[0].values[len - 1].val;

                                d.values[0].values.push({
                                    index: -2,
                                    week: d.key,
                                    val: ang,
                                    weekday: weekdays[weekdayd],
                                    timestamp: 'end',
                                    time: (endtime),
                                    line: 'last',
                                    type: 'measure'
                                });
                            }

                        }
                    }
                });

                datapoints_all[weekdays[weekdayd]].Datapoints_raw.push(datapoints_raw[i].filter(q => q.weekday == weekdays[weekdayd] && q.week != '40' && q.week != '43'));

                datapoints[i].map(function(d) { d.values = d.values[0].values; });
            }

            for (i in datapoints) {
                k = 0;
                dweeks = datapoints[i].map(d => d.key);
                if (dweeks.length != weeks_all.length) {
                    for (j in weeks_all) {
                        if (!dweeks.includes(weeks_all[j])) {
                            datapoints[i].splice(j, 0, {
                                key: weeks_all[j],
                                values: [{
                                    index: -1,
                                    val: 0,
                                    week: weeks_all[j],
                                    weekday: weekdays[weekdayd],
                                    timestamp: 'start',
                                    time: (starttime),
                                    line: 'step'
                                }, {
                                    index: -2,
                                    week: weeks_all[j],
                                    val: 0,
                                    weekday: weekdays[weekdayd],
                                    timestamp: 'end',
                                    time: (endtime),
                                    line: 'step'
                                }]
                            })
                        }
                        k++;
                    }
                }
                datapoints_all[weekdays[weekdayd]].Datapoints.push(datapoints[i]);

            }

        }

        var data = datapoints_all['Monday'].Datapoints[0];
        var data_raw = datapoints_all['Monday'].Datapoints_raw[0];




        dropdownButton1
            .selectAll('myOptions')
            .data(sensors)
            .enter()
            .append('option')
            .text(d => d)
            .attr('value', function(d, i) { return i });

        dropdownButton2
            .selectAll('myOptions')
            .data(weekdays)
            .enter()
            .append('option')
            .text(d => d)
            .attr('value', function(d, i) { return d });
        dropdownButton3
            .selectAll('myOptions')
            .data(['All', 'Single', 'Double'])
            .enter()
            .append('option')
            .text(d => d)
            .attr('value', function(d, i) { return d });

        var res = weeks_all.map(function(d) { return "week " + d }) // list of group names
            //console.log(res)

        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                "translate(" + (margin.left) + "," + margin.top + ")");

        //x: scale for time
        var x = d3.scaleTime()
            .domain([starttime, endtime]) //d3.extent(data_raw, d => d.time))
            .range([0, w]);

        //y: scale for name ie week
        var y = d3.scalePoint()
            .domain(res)
            .range([0, h]);

        function make_x_gridlines() {
            return d3.axisBottom(x)
                .ticks(24)
        }
        //z: scale for val
        var z = d3.scaleLinear()
            .domain([d3.min(data_raw, d => d.val), d3.max(data_raw, d => d.val)]).nice()
            .range([0, -y.step() + 2]);

        var xax = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (((res.length + 1) * 40) + 12) + ")")
            .call(d3.axisBottom(x).tickFormat(function(d) {
                return d3.timeFormat("%H:%M")(new Date(d))
            }).ticks(24))
            .style('font-size', '8px');


        var yax = svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).tickSize(0))
            .call(g => g.select(".domain").remove())
            .style('font-size', '12px');

        var area = d3.area() //.curve(d3.curveStepAfter) //.curve(d3.curveBasis)
            // .defined(d => !isNaN(d))
            .x(function(d) {
                return x(d.time);
            })
            .y0(0)
            .y1(function(d) { return z(d.val); })

        var gridlines = svg.append("g")
            .attr("class", "grid")
            .attr('transform', 'translate(0' + 0 + ',' + (((res.length + 1) * 40) + 12) + ')')
            .call(make_x_gridlines()
                .tickSize(-(((res.length + 2) * 40) + 17))
                .tickFormat("")
            )

        var line = area.lineY1();

        var first = true;
        var initalGraph = function(data) {



            var selectgroups = svg.selectAll(".groups")
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'groups');


            var initialPath = selectgroups.selectAll('.line')
                .data(data)
                .enter()
                .append('path');

            initialPath
                .attr('transform', (d, i) => 'translate(0, ' + h / (res.length - 1) * i + ')')
                .attr("fill", "none")
                .attr("stroke", 'black')
                .attr("stroke-width", 0.1)
                .attr("d", function(q) {

                    return line(q.values)
                })
                .attr('class', 'line');




            initialPath
                .attr('transform', (d, i) => 'translate(0, ' + h / (res.length - 1) * i + ')')
                .attr('fill', function(d) {
                    if (weeks_single.includes(d.key)) {
                        return 'SkyBlue';
                    } else {
                        return 'PaleVioletRed';
                    }
                })
                .attr("clip-path", "url(#clip)")
                .attr('d', function(q) {
                    return area(q.values)
                })
                .attr('class', 'line');




            //update(0, 'Monday')


        }

        selectedSensor = 'LampeAussenwand';
        selectedWeekday = 'Monday';
        selectedGroup = 'All';

        initalGraph(data);

        //SENSOR
        dropdownButton1.on('change', function(d) {
            selectedSensor = d3.select(this).property('value');
            selectedGroup = dropdownButton3.property('value');
            selectedWeekday = dropdownButton2.property('value');
            // update(selectedSensor, selectedWeekday, selectedGroup);


            if (selectedGroup == tempGroup) {
                update(selectedSensor, selectedWeekday, selectedGroup, 0, choicesEmployment, choicesGenderS, choicesGenderD, choicesAge);

            } else {
                update(selectedSensor, selectedWeekday, selectedGroup, 1, choicesEmployment, choicesGenderS, choicesGenderD, choicesAge);
            }

        });

        //WEEKDAY
        dropdownButton2.on('change', function(d) {
            selectedSensor = dropdownButton1.property('value');
            selectedWeekday = d3.select(this).property('value');
            selectedGroup = dropdownButton3.property('value');
            //update(selectedSensor, selectedWeekday, selectedGroup);

            if (selectedGroup == tempGroup) {
                update(selectedSensor, selectedWeekday, selectedGroup, 0, choicesEmployment, choicesGenderS, choicesGenderD, choicesAge);

            } else {
                update(selectedSensor, selectedWeekday, selectedGroup, 1, choicesEmployment, choicesGenderS, choicesGenderD, choicesAge);
            }
        });

        //GROUP 
        dropdownButton3.on('change', function(d) {
            selectedSensor = dropdownButton1.property('value');
            selectedWeekday = dropdownButton2.property('value');
            selectedGroup = d3.select(this).property('value');
            tempGroup = selectedGroup;


            update(selectedSensor, selectedWeekday, selectedGroup, 1, choicesEmployment, choicesGenderS, choicesGenderD, choicesAge);
        });


        submitButton.on('click', function() {
            choicesEmployment = [];
            choicesGenderS = [];
            choicesGenderD = [];
            choicesAge = [];

            d3.selectAll(".checkE").each(function(d) {
                cb = d3.select(this);

                if (cb.property("checked")) {
                    choicesEmployment.push(cb.property("value"));
                }
            });
            //console.log(choicesEmployment)

            d3.selectAll('.checkGS').each(function(d) {
                cb = d3.select(this);

                if (cb.property("checked")) {
                    choicesGenderS.push(cb.property("value"));
                }
            });
            //console.log(choicesGenderS)

            d3.selectAll('.checkGD').each(function(d) {
                cb = d3.select(this);

                if (cb.property("checked")) {
                    choicesGenderD.push(cb.property("value"));
                }
            });
            //console.log(choicesGenderD)

            d3.selectAll('.checkA').each(function(d) {
                cb = d3.select(this);
                if (cb.property("checked")) {
                    choicesAge.push(parseInt(cb.property("value")));
                }
            });
            //console.log(choicesAge)

            selectedSensor = dropdownButton1.property('value');
            selectedWeekday = dropdownButton2.property('value');
            selectedGroup = dropdownButton3.property('value');


            update(selectedSensor, selectedWeekday, selectedGroup, 1, choicesEmployment, choicesGenderS, choicesGenderD, choicesAge);


        });


        function update(selectedSensor, w, group, update, choicesEmployment, choicesGenderS, choicesGenderD, choicesAge) {

            var i = selectedSensor,
                j = 0;

            if (w == 'Monday') {
                j = 0;
            } else if (w == 'Tuesday') {
                j = 1;
            } else if (w == 'Wednesday') {
                j = 2;
            } else if (w == 'Thursday') {
                j = 3;
            } else if (w == 'Friday') {
                j = 4;
            } else if (w == 'Saturday') {
                j = 5;
            } else {
                j = 6;
            }
            //console.log(weekdays[j], selectedSensor)

            data = datapoints_all[weekdays[j]].Datapoints[i];
            data_raw = datapoints_all[weekdays[j]].Datapoints_raw[i];

            //var res = weeks.map(function(d) { return "week " + d }) // list of group names
            var groupweeks = weeks_all;
            var weekstoconsider = weeks_all;

            if (group == 'Single') {
                if (choicesAge.length == 0 && choicesEmployment.length == 0 && choicesGenderS.length == 0) {

                    weekstoconsider = weeks_single;

                } else {
                    if (choicesAge.length == 0) {
                        choicesAge = Age;
                    }
                    if (choicesGenderS.length == 0) {
                        choicesGenderS = GenderS;
                    }
                    if (choicesEmployment.length == 0) {
                        choicesEmployment = Empolyment;
                    }
                    filtered_singleData = singleData.filter(x => choicesGenderS.includes(x.Gender) && choicesAge.includes(x.Age) && choicesEmployment.includes(x.JobCategory));

                    weekstoconsider = filtered_singleData.map(d => d.Week + "");

                }

                groupweeks = weeks_single;

                data = data.filter(x => weeks_single.includes(x.key));

            } else if (group == 'Double') {
                //console.log(data)

                if (choicesAge.length == 0 && choicesEmployment.length == 0 && choicesGenderD.length == 0) {

                    weekstoconsider = weeks_double;


                } else {
                    if (choicesAge.length == 0) {
                        choicesAge = Age;
                    }
                    if (choicesGenderD.length == 0) {
                        choicesGenderD = GenderD;
                    }
                    if (choicesEmployment.length == 0) {
                        choicesEmployment = Empolyment;
                    }

                    filtered_doubleData = doubleData.filter(x =>
                        (choicesGenderD.includes((x.GenderII + x.GenderI)) || choicesGenderD.includes((x.GenderI + x.GenderII))) &&
                        (choicesAge.includes(x.AgeI) || choicesAge.includes(x.AgeII)) &&
                        (choicesEmployment.includes(x.JobCategoryI) || choicesEmployment.includes(x.JobCategoryII)));

                    weekstoconsider = filtered_doubleData.map(d => d.Week + "");

                }

                groupweeks = weeks_double;

                data = data.filter(x => weeks_double.includes(x.key));

            } else {

                if (choicesAge.length == 0 && choicesEmployment.length == 0 && choicesGenderS.length == 0 && choicesGenderD.length == 0) {

                    weekstoconsider = weeks_all;

                } else {

                    var weekstoconsider1 = [];
                    var weekstoconsider2 = [];
                    //single
                    if (choicesAge.length == 0 && choicesEmployment.length == 0 && choicesGenderS.length == 0) {

                        weekstoconsider1 = weeks_single;

                    } else {
                        if (choicesAge.length == 0) {
                            choicesAge = Age;
                        }
                        if (choicesGenderS.length == 0) {
                            choicesGenderS = GenderS;
                        }
                        if (choicesGenderD.length == 0) {
                            choicesGenderD = GenderD;
                        }
                        if (choicesEmployment.length == 0) {
                            choicesEmployment = Empolyment;
                        }

                        filtered_singleData = singleData.filter(x => choicesGenderS.includes(x.Gender) && choicesAge.includes(x.Age) && choicesEmployment.includes(x.JobCategory));

                        weekstoconsider1 = filtered_singleData.map(d => d.Week + "");

                    }
                    //double
                    if (choicesAge.length == 0 && choicesEmployment.length == 0 && choicesGenderD.length == 0) {

                        weekstoconsider2 = weeks_double;

                    } else {
                        if (choicesAge.length == 0) {
                            choicesAge = Age;
                        }
                        if (choicesGenderS.length == 0) {
                            choicesGenderS = GenderS;
                        }
                        if (choicesGenderD.length == 0) {
                            choicesGenderD = GenderD;
                        }
                        if (choicesEmployment.length == 0) {
                            choicesEmployment = Empolyment;
                        }

                        filtered_doubleData = doubleData.filter(x =>
                            (choicesGenderD.includes((x.GenderII + x.GenderI)) || choicesGenderD.includes((x.GenderI + x.GenderII))) &&
                            (choicesAge.includes(x.AgeI) || choicesAge.includes(x.AgeII)) &&
                            (choicesEmployment.includes(x.JobCategoryI) || choicesEmployment.includes(x.JobCategoryII)));

                        weekstoconsider2 = filtered_doubleData.map(d => d.Week + "");

                    }
                    //combine
                    weekstoconsider = weekstoconsider1.concat(weekstoconsider2);

                    weekstoconsider.sort();
                    //console.log(weekstoconsider)

                }

                groupweeks = weeks_all;

            }

            //console.log(data)

            var res = groupweeks.map(function(d) { return "week " + d }) // list of group names

            if (data_raw.length > 1 && data_raw[1].line == 'step') {
                area = d3.area().curve(d3.curveStepAfter) //.curve(d3.curveBasis)
                    // .defined(d => !isNaN(d))
                    .x(function(d) {
                        return x(d.time);
                    })
                    .y0(0)
                    .y1(function(d) { return z(d.val); });
                //console.log('step')
            } else {
                area = d3.area() //.curve(d3.curveStepAfter) //.curve(d3.curveBasis)
                    // .defined(d => !isNaN(d))
                    .x(function(d) {
                        return x(d.time);
                    })
                    .y0(0)
                    .y1(function(d) { return z(d.val); })
                    //console.log('notstep')
            }


            //z: scale for val
            var max = 1
            var min = 0

            for (var k = 0; k < 7; k++) {

                dr = datapoints_all[weekdays[k]].Datapoints_raw[i];
                dr = dr.filter(x => groupweeks.includes(x.week))
                dr.push({ val: 0 })

                max = Math.max(max, d3.max(dr, d => d.val));
                // min = Math.min(min, d3.min(dr, d => d.val))


            }

            //data.map(d => d.values.sort(function(a, b) { return b.timestamp > a.timestamp; }));

            y.domain(res).range([0, res.length * 40]);
            z.domain([min, max]).nice()
                .range([0, -40]);

            if (update == 0) {
                updateSVG();
            } else {
                updateReplaceSVG();
            }



            function updateSVG() {
                var selectgroup = svg.selectAll('.groups').data(data);

                selectgroup.selectAll('path.line')
                    .data(data)
                    .transition()
                    .duration(1000)
                    // .delay(function(d, i) { return (i * 200) })
                    .attr('transform', (d, i) => { if (first) { return ('translate(0, ' + h / (res.length - 1) * i + ')') } else { return ('translate(0, ' + (res.length * 40) / (res.length - 1) * i + ')'); } })
                    .attr("fill", "none")
                    .attr("stroke", function(d) {
                        if (weekstoconsider.includes(d.key)) {
                            return 'black'
                        } else {
                            return 'gray'
                        }
                    })
                    .attr("stroke-width", 1)
                    .attr("d", function(q) {
                        return line(q.values);

                    });

                selectgroup.selectAll('path.line')
                    .data(data)
                    .transition()
                    .duration(1000)
                    //.delay(function(d, i) { return (i * 200) })
                    .attr('transform', (d, i) => { if (first) { return ('translate(0, ' + h / (res.length - 1) * i + ')') } else { return ('translate(0, ' + (res.length * 40) / (res.length - 1) * i + ')'); } })
                    .attr('fill', function(d) {
                        if (weekstoconsider.includes(d.key)) {

                            if (weeks_single.includes(d.key)) {
                                return 'SkyBlue';
                            } else {
                                return 'PaleVioletRed';
                            }
                        } else {
                            if (weeks_single.includes(d.key)) {
                                return 'rgb(108, 164, 185, 0.2)' //'lightcyan';
                            } else {
                                return 'rgb(148, 80, 102, 0.2)' //'mistyrose';

                            }
                        }
                    })
                    .attr('d', function(q) {
                        return area(q.values);

                    });


            }


            function updateReplaceSVG() {
                ////////////----------------------------------------------------------------------
                //svg.selectAll('.gropus').remove();
                // svg.selectAll('.x axis').remove();
                //       svg.selectAll('.y axis').remove();
                // svg.selectAll('#chart').remove();
                first = false;
                //IDEA1: remove everything and create plot from scratch
                svg.selectAll('.groups').remove()
                    //svg.selectAll('.line').remove() //redundant, included in groups remove
                    //svg.selectAll('g').remove() //x, y axis remain
                yax.remove() //does remove y axis
                    //ok. removed expet for x axis. now re-draw
                xax.remove()

                gridlines.remove()

                xax = svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (((res.length) * 40) + 2) + ")")
                    .call(d3.axisBottom(x).tickFormat(function(d) {
                        return d3.timeFormat("%H:%M")(new Date(d))
                    }).ticks(24))
                    .style('font-size', '8px');



                yax = svg.append("g")
                    .attr("class", "y axis")
                    .call(d3.axisLeft(y).tickSize(0))
                    .call(g => g.select(".domain").remove())
                    .style('font-size', '12px');

                yax.selectAll('.tick')
                    .each(function(d, i) {
                        //console.log(d)

                        if (!weekstoconsider.includes(d.substr(5, 6))) {
                            d3.select(this).style('color', 'gray')
                                // return 'black'
                        } else {
                            // return 'lightgrey'
                        }

                    });

                gridlines = svg.append("g")
                    .attr("class", "grid")
                    .attr('transform', 'translate(0' + 0 + ',' + (((res.length) * 40) + 2) + ')')
                    .call(make_x_gridlines()
                        .tickSize(-(((res.length + 1) * 40) + 7))
                        .tickFormat("")
                    )

                var selectgroups = svg.selectAll(".groups")
                    .data(data)
                    .enter()
                    .append('g')
                    .attr('class', 'groups');

                var initialPath = selectgroups.selectAll('.line')
                    .data(data)
                    .enter()
                    .append('path');

                initialPath
                //.transition().duration(500)
                    .attr('transform', (d, i) => 'translate(0, ' + (res.length * 40) / (res.length - 1) * i + ')')
                    .attr("fill", "none")
                    .attr("stroke-width", 0.1)
                    .attr("d", function(q) {
                        return line(q.values)
                    })
                    .attr("stroke", function(d) {
                        if (weekstoconsider.includes(d.key)) {
                            return 'black'
                        } else {
                            return 'gray'
                        }
                    })
                    .attr('class', 'line');

                initialPath
                    .attr('transform', (d, i) => 'translate(0, ' + (res.length * 40) / (res.length - 1) * i + ')')
                    .attr('fill', function(d) {
                        if (weekstoconsider.includes(d.key)) {

                            if (weeks_single.includes(d.key)) {
                                return 'SkyBlue';
                            } else {
                                return 'PaleVioletRed';
                            }
                        } else {
                            if (weeks_single.includes(d.key)) {
                                return 'rgb(108, 164, 185, 0.2)' //'lightcyan';
                            } else {
                                return 'rgb(148, 80, 102, 0.2)' //'mistyrose';
                            }
                        }
                    })
                    .transition()
                    .duration(1000)
                    .attr('d', function(q) {
                        return area(q.values)
                    })
                    .attr('class', 'line');

            }


        }
    });
}