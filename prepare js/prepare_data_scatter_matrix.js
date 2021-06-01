//var startTime = new Date('2019-09-11 20:43:46.000');
//var startDate = new Date();

/**
 * Assumptions made:
 * 1. From the time an element was moved, to the time the element was moved again, consider the position of the element 
 * to be the .To value ie. the position was moved to. 
 * The time_to_next would therefor imply that the element stood at the given position for that many miliseconds, where
 * in fact it was transitioning from the From postition to the To positition first.
 */


function prepare_data_scatter_matrix() {

    d3.json('../data/data.json').then(function(datas) {

        console.log(weeks_single)
        var dataDW = [];
        var dataDS = [];
        var dataLA = [];
        var dataLD = [];
        var temp = '--:--:--';
        var timej = d3.timeFormat('%Y-%m-%d %H:%M:%S.%L');
        var day = d3.timeFormat('%Y-%m-%d');

        var weekday = d3.timeFormat('%a');
        var week = d3.timeFormat('%V-%y');

        var d = new Date('2019-09-11 20:43:45.000');
        var maxrange = [238, 187, 158, 321]
        var datas_raw = [
            [],
            [],
            [],
            []
        ];

        datas_raw[0] = datas.filter(x => x.Sensorname === 'Drehwand'); //Sensor T3
        datas_raw[1] = datas.filter(x => x.Sensorname === 'Drehschrank'); //Sensor T2
        datas_raw[2] = datas.filter(x => x.Sensorname === 'LampeAussenwand'); //Sensor T1
        datas_raw[3] = datas.filter(x => x.Sensorname === 'LampeDrehwand'); //Sensor T4

        var data = [
            [],
            [],
            [],
            []
        ];

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < datas_raw[i].length; j++) {

                var d = datas_raw[i][j];

                if (!weeks_out.includes(week(new Date(d.Timestamp.slice(2))))) {
                    var from = Math.round(d.Value1);
                    var to = Math.round(d.Value2);

                    //staple all values that lie outside the pre-defined range
                    if (from > maxrange[i]) from = maxrange[i];
                    if (from < 0) from = 0;
                    if (to > maxrange[i]) to = maxrange[i];
                    if (to < 0) to = 0;

                    data[i].push({
                        Sensorname: d.Sensorname,
                        "From": from,
                        "To": to,
                        "Total": d.ValueDiff,
                        "Timestamp": d.Timestamp.slice(2)
                    });
                }
            }
        }


        var datanew = [
            [],
            [],
            [],
            []
        ];
        //var offset = [-79.4, -104, -129, -129]

        //Unified strating state for all elements: @"2019-09-11 20:43:46.000"
        for (var j = 0; j < 4; j++) {

            var first = new Date("2019-09-11 20:43:46.000");
            var second = new Date(data[j][0].Timestamp);

            if (day(first) != day(second)) {
                var temp = new Date((day(second)) + ' 00:00:00.000');

                datanew[j].push({
                    Sensor: data[j][0].Sensorname,
                    From: data[j][0].To,
                    To: data[j][0].To,
                    Timestamp: new Date("2019-09-11 20:43:46.000"),


                });

                datanew[j].push({
                    Sensor: data[j][0].Sensorname,
                    From: data[j][0].To,
                    To: data[j][0].To,
                    Timestamp: temp,

                });

            } else {
                datanew[j].push({
                    Sensor: data[j][0].Sensorname,
                    From: data[j][0].To,
                    To: data[j][0].To,
                    Timestamp: new Date("2019-09-11 20:43:46.000"),
                    split: -1 //indicates no split

                });
            }


            for (var i = 0; i < data[j].length - 1; i++) {
                // var date = new Date(data[j][i].Timestamp);
                var first = new Date(data[j][i].Timestamp);
                var second = new Date(data[j][i + 1].Timestamp);

                //* some dont continue where they endet.
                // data_connect: adjust To to the From of next movement, such that we get smooth transitioning

                if (day(first) != day(second)) {
                    //split into two
                    var temp = new Date((day(second) + ' 00:00:00.000'))
                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: data[j][i + 1].From,
                        To: data[j][i + 1].From, //*
                        Timestamp: first
                    });
                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: data[j][i + 1].From,
                        To: data[j][i + 1].From, //*
                        Timestamp: temp
                    });

                } else {

                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: data[j][i + 1].From,
                        To: data[j][i + 1].From, //*
                        Timestamp: first
                    });

                }

            }
        }


        dataDW = datanew[0];
        dataDS = datanew[1];
        dataLA = datanew[2];
        dataLD = datanew[3];



        var datas = datanew[0].concat(datanew[1]);
        datas = datas.concat(datanew[2]);
        datas = datas.concat(datanew[3]);

        datas = datas.sort(function(a, b) { return new Date(a.Timestamp) - new Date(b.Timestamp) });
        console.log(datas)

        /**
         * create data array 'snap_data' that saves all the states observed.
         * A state is defiend by (timestamp, angleDW,angleDS,angleLA,angleLD), where angleXX stands for the position of XX at time Timestamp.
         * Because of how we bilt the array, this state is kept until the timestamp value of the next entry.
         * This time is also saved in time_to_next, so we won't have to compute it later.  
         * 
         * --> like a snapshot taken at time Timestamp
         * 
         **/

        var snap_data = [];
        var dw_angle, ds_angle, la_angle, ld_angle;

        dw_angle = datanew[0][0].From;
        ds_angle = datanew[1][0].From;
        la_angle = datanew[2][0].From;
        ld_angle = datanew[3][0].From;

        var idw = 0,
            ids = 0,
            ila = 0,
            ild = 0;

        snap_data.push({
            Timestamp: timej(new Date("2019-09-11 20:43:46.000")),
            DW: dw_angle,
            DS: ds_angle,
            LA: la_angle,
            LD: ld_angle,
            Week: week(new Date("2019-09-11 20:43:46.000")),
            Weekday: weekday(timej(new Date("2019-09-11 20:43:46.000"))),
            Group: (weeks_single.includes(week(new Date("2019-09-11 20:43:46.000"))) ? 0 : (!weeks_out.includes(week(new Date("2019-09-11 20:43:46.000")))) ? 1 : -1)


        });


        for (var j = 4; j < datas.length; j++) {
            var t = new Date(datas[j].Timestamp);
            console.log((weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1))
            if (t.getHours() == 0 && t.getMinutes() == 0 && t.getMilliseconds() == 0) {
                t_ = new Date(datas[j - 1].Timestamp);

                if (t_.getHours() != 0 || t_.getMinutes() != 0 || t_.getMilliseconds() != 0) {

                    el = datas[j - 1].Sensor;

                    idw = getid(idw, t_, dataDW);
                    ids = getid(ids, t_, dataDS);
                    ila = getid(ila, t_, dataLA);
                    ild = getid(ild, t_, dataLD);

                    dw_angle = dataDW[idw].From;
                    ds_angle = dataDS[ids].From;
                    la_angle = dataLA[ila].From;
                    ld_angle = dataLD[ild].From;



                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,

                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)

                    });




                }
            } else {
                idw = getid(idw, t, dataDW);
                ids = getid(ids, t, dataDS);
                ila = getid(ila, t, dataLA);
                ild = getid(ild, t, dataLD);

                dw_angle = dataDW[idw].From;
                ds_angle = dataDS[ids].From;
                la_angle = dataLA[ila].From;
                ld_angle = dataLD[ild].From;


                if (datas[j].Sensor == 'Drehwand') {
                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,
                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)
                    });


                } else if (datas[j].Sensor == 'Drehschrank') {



                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,
                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)

                    });


                } else if (datas[j].Sensor == 'LampeAussenwand') {


                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,
                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)
                    });


                } else { // 'LampeDrehwand'

                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,
                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)
                    });

                }
            }

        }


        for (var i = 0; i < snap_data.length - 1; i++) {

            snap_data[i].time_to_next = new Date(snap_data[i + 1].Timestamp) - new Date(snap_data[i].Timestamp)

        }
        console.log(snap_data)
        toJson(snap_data, 'data_scatter_matrix.json')
    })


}


function prepare_data_scatter_matrix_Besucher() {

    d3.json('../data/data_Besucher.json').then(function(datas) {

        console.log(weeks_single)
        var dataDW = [];
        var dataDS = [];
        var dataLA = [];
        var dataLD = [];
        var temp = '--:--:--';
        var timej = d3.timeFormat('%Y-%m-%d %H:%M:%S.%L');
        var day = d3.timeFormat('%Y-%m-%d');

        var weekday = d3.timeFormat('%a');
        var week = d3.timeFormat('%V-%y');

        var d = new Date('2019-09-11 20:43:45.000');
        var maxrange = [238, 187, 158, 321]
        var datas_raw = [
            [],
            [],
            [],
            []
        ];

        datas_raw[0] = datas.filter(x => x.Sensorname === 'Drehwand'); //Sensor T3
        datas_raw[1] = datas.filter(x => x.Sensorname === 'Drehschrank'); //Sensor T2
        datas_raw[2] = datas.filter(x => x.Sensorname === 'LampeAussenwand'); //Sensor T1
        datas_raw[3] = datas.filter(x => x.Sensorname === 'LampeDrehwand'); //Sensor T4

        var data = [
            [],
            [],
            [],
            []
        ];

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < datas_raw[i].length; j++) {

                var d = datas_raw[i][j];

                if (!weeks_out.includes(week(new Date(d.Timestamp.slice(2))))) {
                    var from = Math.round(d.Value1);
                    var to = Math.round(d.Value2);

                    //staple all values that lie outside the pre-defined range
                    if (from > maxrange[i]) from = maxrange[i];
                    if (from < 0) from = 0;
                    if (to > maxrange[i]) to = maxrange[i];
                    if (to < 0) to = 0;

                    data[i].push({
                        Sensorname: d.Sensorname,
                        "From": from,
                        "To": to,
                        "Total": d.ValueDiff,
                        "Timestamp": d.Timestamp.slice(2)
                    });
                }
            }
        }


        var datanew = [
            [],
            [],
            [],
            []
        ];
        //var offset = [-79.4, -104, -129, -129]

        //Unified strating state for all elements: @"2019-09-11 20:43:46.000"
        for (var j = 0; j < 4; j++) {

            var first = new Date("2019-09-11 20:43:46.000");
            var second = new Date(data[j][0].Timestamp);

            if (day(first) != day(second)) {
                var temp = new Date((day(second)) + ' 00:00:00.000');

                datanew[j].push({
                    Sensor: data[j][0].Sensorname,
                    From: data[j][0].To,
                    To: data[j][0].To,
                    Timestamp: new Date("2019-09-11 20:43:46.000"),


                });

                datanew[j].push({
                    Sensor: data[j][0].Sensorname,
                    From: data[j][0].To,
                    To: data[j][0].To,
                    Timestamp: temp,

                });

            } else {
                datanew[j].push({
                    Sensor: data[j][0].Sensorname,
                    From: data[j][0].To,
                    To: data[j][0].To,
                    Timestamp: new Date("2019-09-11 20:43:46.000"),
                    split: -1 //indicates no split

                });
            }


            for (var i = 0; i < data[j].length - 1; i++) {
                // var date = new Date(data[j][i].Timestamp);
                var first = new Date(data[j][i].Timestamp);
                var second = new Date(data[j][i + 1].Timestamp);

                //* some dont continue where they endet.
                // data_connect: adjust To to the From of next movement, such that we get smooth transitioning

                if (day(first) != day(second)) {
                    //split into two
                    var temp = new Date((day(second) + ' 00:00:00.000'))
                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: data[j][i + 1].From,
                        To: data[j][i + 1].From, //*
                        Timestamp: first
                    });
                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: data[j][i + 1].From,
                        To: data[j][i + 1].From, //*
                        Timestamp: temp
                    });

                } else {

                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: data[j][i + 1].From,
                        To: data[j][i + 1].From, //*
                        Timestamp: first
                    });

                }

            }
        }


        dataDW = datanew[0];
        dataDS = datanew[1];
        dataLA = datanew[2];
        dataLD = datanew[3];



        var datas = datanew[0].concat(datanew[1]);
        datas = datas.concat(datanew[2]);
        datas = datas.concat(datanew[3]);

        datas = datas.sort(function(a, b) { return new Date(a.Timestamp) - new Date(b.Timestamp) });
        console.log(datas)

        /**
         * create data array 'snap_data' that saves all the states observed.
         * A state is defiend by (timestamp, angleDW,angleDS,angleLA,angleLD), where angleXX stands for the position of XX at time Timestamp.
         * Because of how we bilt the array, this state is kept until the timestamp value of the next entry.
         * This time is also saved in time_to_next, so we won't have to compute it later.  
         * 
         * --> like a snapshot taken at time Timestamp
         * 
         **/

        var snap_data = [];
        var dw_angle, ds_angle, la_angle, ld_angle;

        dw_angle = datanew[0][0].From;
        ds_angle = datanew[1][0].From;
        la_angle = datanew[2][0].From;
        ld_angle = datanew[3][0].From;

        var idw = 0,
            ids = 0,
            ila = 0,
            ild = 0;

        snap_data.push({
            Timestamp: timej(new Date("2019-09-11 20:43:46.000")),
            DW: dw_angle,
            DS: ds_angle,
            LA: la_angle,
            LD: ld_angle,
            Week: week(new Date("2019-09-11 20:43:46.000")),
            Weekday: weekday(timej(new Date("2019-09-11 20:43:46.000"))),
            Group: (weeks_single.includes(week(new Date("2019-09-11 20:43:46.000"))) ? 0 : (!weeks_out.includes(week(new Date("2019-09-11 20:43:46.000")))) ? 1 : -1)


        });


        for (var j = 4; j < datas.length; j++) {
            var t = new Date(datas[j].Timestamp);
            console.log((weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1))
            if (t.getHours() == 0 && t.getMinutes() == 0 && t.getMilliseconds() == 0) {
                t_ = new Date(datas[j - 1].Timestamp);

                if (t_.getHours() != 0 || t_.getMinutes() != 0 || t_.getMilliseconds() != 0) {

                    el = datas[j - 1].Sensor;

                    idw = getid(idw, t_, dataDW);
                    ids = getid(ids, t_, dataDS);
                    ila = getid(ila, t_, dataLA);
                    ild = getid(ild, t_, dataLD);

                    dw_angle = dataDW[idw].From;
                    ds_angle = dataDS[ids].From;
                    la_angle = dataLA[ila].From;
                    ld_angle = dataLD[ild].From;



                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,

                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)

                    });




                }
            } else {
                idw = getid(idw, t, dataDW);
                ids = getid(ids, t, dataDS);
                ila = getid(ila, t, dataLA);
                ild = getid(ild, t, dataLD);

                dw_angle = dataDW[idw].From;
                ds_angle = dataDS[ids].From;
                la_angle = dataLA[ila].From;
                ld_angle = dataLD[ild].From;


                if (datas[j].Sensor == 'Drehwand') {
                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,
                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)
                    });


                } else if (datas[j].Sensor == 'Drehschrank') {



                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,
                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)

                    });


                } else if (datas[j].Sensor == 'LampeAussenwand') {


                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,
                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)
                    });


                } else { // 'LampeDrehwand'

                    snap_data.push({
                        Timestamp: timej(t),
                        DW: dw_angle,
                        DS: ds_angle,
                        LA: la_angle,
                        LD: ld_angle,
                        Week: week(t),
                        Weekday: weekday(t),
                        Group: (weeks_single.includes(week(t)) ? 0 : (!weeks_out.includes(t)) ? 1 : -1)
                    });

                }
            }

        }


        for (var i = 0; i < snap_data.length - 1; i++) {

            snap_data[i].time_to_next = new Date(snap_data[i + 1].Timestamp) - new Date(snap_data[i].Timestamp)

        }
        console.log(snap_data)
        toJson(snap_data, 'data_scatter_matrix_Besucher.json')
    })


}

function getid(id, t, data_search) {
    while (id < data_search.length - 1 && data_search[id + 1].Timestamp < t) {
        id++;
    }
    return id;
}