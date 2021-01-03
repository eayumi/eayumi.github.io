var dataDW = [];
var dataDS = [];
var dataLA = [];
var dataLD = [];

var paused = false;
var o_slider = 0; //offset of slider of the progress bar
var off = 0; // ? 
var diff = 0;
var sp = 0; //index for current speed of animation
var temp = '--:--:--'; //placeholder

var timej = d3.timeFormat('%H:%M:%S.%L');
var day = d3.timeFormat('%Y-%m-%d');

var weekday = d3.timeFormat('%A');
var week = d3.timeFormat('%V-%y');

var timeslider = d3.timeFormat('%A  %H:%M:%S'); // time format used for the clock 
var list_activity_time = d3.timeFormat('%a  %H:%M:%S'); //time format used in the activity list

var slider = 0; //position of slider (how many ms have passed)
var clock;
var raf_clock; //references raf for the clock
var last_time = new Date().getTime();
var abso_first = new Date("2019-09-11 17:07:30.000");
var ddddd = abso_first;
var endtime = new Date().getTime();
var animation = null;


//var startTime = new Date('2019-09-11 17:07:30.000');
//var startDate = new Date();

/**
 * This function start and controls animation of the senordata held in data_animation_nest.json
 * It shows animation of the elements in the Mock-up per week, and offers control like pause, play, restart, speedup, skip and jump to using a progress slider.
 * For this it makes use of timeline.js. This animates the elements for given array of objects that hold the anlges to rotate to/ amount to translate and the timing and duration
 * for each transformation. 
 * 
 * The animation is implemented using custom timelines (timeline.js). Each elements corresponds to its own timeline  and the animation is done using requestAnimationFrame.
 */
function timeline_nest() {

    d3.json('../data/data_animation_nest.json').then(function(datas) {

        //wf hold all weeks from first to last of the study, including those that were removed from evaluaition.
        wf = weeks_not_out.map(d => d.Week_Year);

        //these will hole each the custom timline for an element, for the indicated type of transformation
        var timelines_rotation = [];
        var timelines_transition = []; //also contains custom timelines for elements were transfomation is changning the fill

        //the weeks that were removed form evaluation are listed as well, but disabled.
        d3.selectAll('#week_anim')
            .selectAll('myOptions')
            .data(wf)
            .enter()
            .append('option')
            .text(function(d) { return d; }) // text showed in the menu
            .attr("value", function(d, i) { return i; })
            .each(function(d, i) {
                if (i == 1) {
                    d3.select(this).property('selected', true);
                }
                k = 0;
                sss = datas[i].data.map(d => d.length);
                for (var j = 0; j < datas[i].data.length; j++) k += sss[j]
                if (k == 0) {
                    d3.select(this).property("disabled", true)
                }
            });

        //when another week is selected, show animation of data for said week
        d3.selectAll('#week_anim').on('change', function() {
            console.log(this.value);
            d3.selectAll('#thetable').remove();
            cancelAnimationFrame(raf_clock);
            for (var i = 0; i < timelines_rotation.length; i++) {
                timelines_rotation[i].terminate();
                timelines_rotation[i] = null;

            }
            for (var i = 0; i < timelines_transition.length; i++) {
                timelines_transition[i].terminate();
                timelines_transition[i] = null;

            }
            timelines_rotation = [];
            timelines_transition = [];
            animation = null;
            animation = forweek(datas[this.value].data);
        });
        //When the page is first loaded, start with the animation of the first (not disabeled) week
        animation = forweek(datas[1].data);
        speedup.addEventListener('click', function() {


            sp = (sp + 1) % 6; //next factor


            for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].speedup(speeds[sp]);
            for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].speedup(speeds[sp]);

            //on hover, show current speed facotr
            this.title = 'current speed: x' + speeds[sp];

        });
        /**
         * Start animation of the (given) sensor data for some specific week.
         * It also updates the activity list.
         * @param {*} data 
         */
        function forweek(data) {
            //1. stop and terminate animation of all elements and of the clock



            //The sensors
            var sens = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand',
                'K_Fen_Oben_Str', 'K_Fen_Unten_Str',
                'S_Fen_Oben_Str', 'S_Fen_Unten_Str', 'S_Boden_Wand_cyr', 'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
                'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str',
                'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr',
                'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr', 'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
                'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr',
                'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Schub_Oben_cyr', 'K_Ofen_Schub_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr'
            ];
            /**
             * 2. ACTIVITY LIST
             */

            //Concatinate the data for each element, but only those we animate. Some were left out of it (environment-related sensors and K_IT).
            data_animation_concat = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].length > 0 && sens.includes(data[i][0].Sensorname)) {
                    data_animation_concat = data_animation_concat.concat(data[i]);
                }
            }
            //sort by timestamp
            data_animation_concat = data_animation_concat.sort(function(a, b) {
                if (new Date(a.Timestamp) < new Date(b.Timestamp)) return -1;
                return 1
            });

            //draw the list
            tabulate(data_animation_concat, ['Sensorname', 'Timestamp']);

            //end of activity list

            //3. Inizialize values, including first and last timestamp. 
            const min = data_animation_concat[0].Timestamp;
            var max = data_animation_concat[data_animation_concat.length - 1].Timestamp
            endtime = new Date(new Date(max).getMilliseconds() + 30000);
            abso_first = new Date(min);
            ddddd = new Date(min);

            startDate = new Date();


            /**
             * data = data_animation.json
             * 0-3: the 4 rotatable elements
             * --> in this case '.From' holds the  angle to rotate to and '.Time' the duration of the rotation.
             * 4-36: relevant sensors, all OPEN/CLOSE, either  rotate/translate/fill
             * --> in this case '.From' is either OPEN or CLOSED and '.Time' has no value.
             */

            const NR_ELEMENTS = data.length;

            //store the indeces of the elements with state ON/OFF or OPEN/CLOSED and the sensor names
            var on_off = [];
            var open_closed = []
            var openclosedSensors = [
                'K_Fen_Oben_Str', 'K_Fen_Unten_Str',
                'S_Fen_Oben_Str', 'S_Fen_Unten_Str', 'S_Boden_Wand_cyr', 'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
                'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str',
                'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr',
                'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr', 'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
                'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr',
                'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Schub_Oben_cyr', 'K_Ofen_Schub_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr'
            ];
            var onoffSensors = ['W_Balkon_cyrspec_switch', 'H_Eingang_cyrspec_switch'];
            var doorelement = ['H_Putz_cyr', 'H_Graderobe_cyr'];

            //the action type indicates the type of transformation
            //0==rotate/1==translate/2==fill
            var action_type = [
                    0, 0, 0, 0, 0,
                    1, 0, 1, 2, 2,
                    1, 1, 0, 0, 0, // 3 door of drehschrank
                    0, 0, 0, 1, 1,
                    2, 2, 0, 0, 0,
                    0, 0, 0, 0, 0,
                    1, 1, 1, 1, 1,
                    1, 1
                ]
                //the action amount indicates with what values the transformation is to be done.
                //It can be degrees, (x,y) coordinates or a colour, depending on the action type
            var action_amount = [
                    0, 0, 0, 0, 40, [4, -1], 40, [-26.65, -147.82], 'green', 'green', [30, 0],
                    [30, 0], -30, -30, 30,
                    30, 40, 30, [-34, 0],
                    [-34, 0],
                    'green', 'green', -40, 40, 20,
                    20, -30, 30, -20, 20, [0, 10],
                    [0, 34],
                    [0, 14],
                    [0, 8],
                    [0, 5],
                    [0, 10],
                    [0, 15]
                ]
                //The class names of each element. This array is used to faciliate referencing
            var selector_list = [
                ['.drehwand'],
                ['.drehschrank', '.drehschrank-6', '.drehschrank-7', '.drehschrank-8', '.drehschrank-9', '.H_Putz_cyr-7', '.H_Putz_cyr-8', '.H_Graderobe_cyr-7', '.H_Graderobe_cyr-8'],
                ['.LA', '.LA5'],
                ['.LD', '.LD5'],
                ['.K_Fen_Oben_Str-6', '.K_Fen_Oben_Str-7', '.K_Fen_Oben_Str-8', '.K_Fen_Oben_Str-9'],
                ['.K_Fen_Unten_Str-6', '.K_Fen_Unten_Str-7', '.K_Fen_Unten_Str-8', '.K_Fen_Unten_Str-9'],
                ['.S_Fen_Oben_Str-6', '.S_Fen_Oben_Str-7', '.S_Fen_Oben_Str-8', '.S_Fen_Oben_Str-9'],
                ['.S_Fen_Unten_Str-6', '.S_Fen_Unten_Str-7', '.S_Fen_Unten_Str-8', '.S_Fen_Unten_Str-9'],
                ['.S_Boden_Wand_cyr'],
                ['.S_Boden_Kueche_cyr'],
                ['.S_Schub_Wand_cyr', '.S_Schub_Wand_cyr-6', '.S_Schub_Wand_cyr-7'],
                ['.S_Schub_Kueche_cyr', '.S_Schub_Kueche_cyr-6', '.S_Schub_Kueche_cyr-7'],
                ['.H_Putz_cyr-7', '.H_Putz_cyr-8'],
                ['.H_Graderobe_cyr-7', '.H_Graderobe_cyr-8'],
                ['.H_Tuer_Str-7', '.H_Tuer_Str-8'],
                ['.B_Tuer_Str-6', '.B_Tuer_Str-7', '.B_Tuer_Str-8', '.B_Tuer_Str-9'],
                ['.B_Schrank_cyr-8'],
                ['.B_Wasch_cyr'], //
                ['.W_Schub_Bad_cyr', '.W_Schub_Bad_cyr-6', '.W_Schub_Bad_cyr-7'],
                ['.W_Schub_Wand_cyr', '.W_Schub_Wand_cyr-6', '.W_Schub_Wand_cyr-7'],
                ['.W_Boden_Bad_cyr'],
                ['.W_Boden_Wand_cyr'],
                ['.W_Fen_Bad_Str-6', '.W_Fen_Bad_Str-7', '.W_Fen_Bad_Str-8', '.W_Fen_Bad_Str-9'],
                ['.W_Fen_Wand_Str-6', '.W_Fen_Wand_Str-7', '.W_Fen_Wand_Str-8', '.W_Fen_Wand_Str-9'],
                ['.K_Schrank_Oben_01_cyr-8'],
                ['.K_Schrank_Oben_02_cyr-8'],
                ['.K_Schrank_Oben_03_cyr-8'],
                ['.K_Schrank_Oben_04_cyr-8'],
                ['.K_Schrank_Oben_05_cyr-8'],
                ['.K_Kuehl_cyr-7'],
                ['.K_Abfall_cyr-8'],
                ['.K_Wasch_Str-8'],
                ['.K_Ofen_Str-8'],
                ['.K_Ofen_Schub_cyr-8'],
                ['.K_Schub_Oben_cyr-8'],
                ['.K_Schub_Mitte_cyr-8'],
                ['.K_Schub_Unten_cyr-8']
            ]

            console.log(min);
            console.log(max);
            console.log((new Date(max) - new Date(min)));
            //instantiate the progress slider,
            document.getElementById('timeslider').max = (new Date(max) - new Date(min));

            /**
             * DATANEW 
             * holds the data to be used as input when creating timeline. Each object contains the following attributes:
             *  Sensor: Sensorname,
             * From: angle to start form ,
             *  To: angle to end at,
             *  val: total change abs(From-To),
             * Duration: in ms,
             * Timestamp: time the action starts,
             *  Delay_end_start: used for move =  0. time that passes btw 2 movements from after one ended until next starts,
             * move: (=1) move, (=0)do nothing,
             * type: type of action [0=rotation, 1=translation,2=fill]
             */
            var datanew = [];
            for (var i = 0; i < NR_ELEMENTS; i++) {
                if (data[i].length != 0) {
                    if (openclosedSensors.includes(data[i][0].Sensorname)) {
                        open_closed.push(i);
                    } else if (onoffSensors.includes(data[i][0].Sensorname)) {
                        on_off.push(i)
                    }
                }
                datanew.push([]);
            }

            var colour = ['crimson', 'blue', 'green', 'purple', 'rosybrown']; //colours used for the activity graph

            var offset = [-79.4, -104, -129, -129, 0]; //offset of the 0 degree in the floor plan and as defined by the sensor (calibratet in the actual Mock-up)

            var data_progress = []; // used to create the progress/activity graph on top of the slider of the animation.

            data_progress.push({
                val: 0,
                month: abso_first, //month, meant timestamp
                col: 'blue'
            });

            //fehler?
            data_progress.push({
                val: 0,
                month: abso_first,
                col: 'blue'
            });

            /**
             * data preparation. for the 4 the ROTATABLE elements.
             * Per data instance form data[j], that represents one movement, split it into two instances for datanew[j].
             * One represents the movement FROM to TO (given offset since inital poisition of 0° != real 0° position) and how long it takes (Duration) 
             * The other represents the wait btw 2 movements.
             * The two types can be differentiated by either MOVE = 1 (yes) or 0 (no)
             * 
             */
            for (var j = 0; j < 4; j++) {
                if (data[j].length != 0) {
                    //Positioning the 4 sensor ROTATIOM elements to the FROM position of the first measurment
                    //In this case the elements are rotated and therefore handled differently
                    //All movements start at time "2019-09-11 17:07:30.000"
                    var first = abso_first;

                    var second = new Date(data[j][0].Timestamp);

                    var x = second - first;

                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: data[j][0].From + offset[j],
                        To: data[j][0].To + offset[j],
                        val: 0,
                        Duration: 0,
                        Timestamp: abso_first,
                        Delay_end_start: x,
                        move: 0,
                        type: 0
                    });

                    first = second;

                    for (var i = 0; i < data[j].length; i++) {
                        var date = new Date(data[j][i].Timestamp);
                        first = new Date(data[j][i].Timestamp);
                        if (i == data[j].length - 1) {
                            var duration = data[j][i].Time;
                            var delay_end_start = duration;
                        } else {
                            second = new Date(data[j][i + 1].Timestamp);
                            var duration = data[j][i].Time;
                            var delay_end_start = second - first - duration;
                        }
                        //some have negative delay_end_start value ?!
                        // data_connect: adjust duration, such that we shorten the duration. 
                        //st the next movement (the one that had cut in) will start without delay at ITS specified Timestamp
                        if (delay_end_start < 0) {
                            duration += delay_end_start;
                            delay_end_start = 0;
                        }

                        // *some dont continue where they ended.
                        // data_connect: adjust To to the From of next movement, such that we get smooth transitioning
                        // !! CURRENTLY NOT CORRECTED ie. uses TO instead of NEXT FROM

                        data_progress.push({
                            val: data[j][i].From,
                            col: colour[j],
                            month: first
                        });
                        data_progress.push({
                            val: data[j][i].To, //data[j][i + 1].From, 
                            col: colour[j],
                            month: first
                        });

                        //move: 1 == this is a rotaton event
                        datanew[j].push({
                            Sensor: data[j][0].Sensorname,
                            From: data[j][i].From + offset[j],
                            To: data[j][i].To + offset[j], //data[j][i + 1].From + offset[j], 
                            val: data[j][i].To - data[j][i].From, //data[j][i + 1].From - data[j][i].From,
                            Duration: duration,
                            Timestamp: first,
                            Delay_end_start: '', //delay_end_start,
                            move: 1,
                            type: 0
                        });

                        //move: 0 == this is a wait event: element does not move, instead waits 'delay_end_start' ms
                        datanew[j].push({
                            Sensor: data[j][0].Sensorname,
                            From: data[j][i].From + offset[j],
                            To: data[j][i].To + offset[j], //data[j][i + 1].From + offset[j], //*
                            val: '', //data[j][i + 1].From - data[j][i].From,
                            Duration: 111, //duration,
                            Timestamp: new Date(date.setMilliseconds(date.getMilliseconds() + duration)),
                            Delay_end_start: delay_end_start,
                            move: 0,
                            type: 0
                        });


                        data[j][i].Timestamp = first;

                        first = second;
                    }
                }
            }
            /**
             * The other elment who also do rotation
             * But by a fixed amount, set in action_amount
             * and in a fixed duration. either 2000ms or if less until CLOSE action-> that duration.
             */
            //For all the elements that are either OPEN or CLOSED
            /**
             * ! don't need move, since OPEN and CLOSE or both active actions.--> reverse.
             */
            for (var j = 4; j < 36; j++) {
                console.log(action_type[j])

                if (action_type[j] == 0 && data[j].length > 0) { //ROTATION

                    //In this case the elements are rotated and therefore handled differently
                    //All movements start at time "2019-09-11 17:07:30.000"
                    var first = abso_first;
                    var second = new Date(data[j][0].Timestamp);

                    var x = second - first;

                    //move: 0 do nothing until first move
                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: 0,
                        To: -1,
                        val: 0, //amount,
                        Duration: 0, //duration,
                        Timestamp: abso_first,
                        Delay_end_start: x,
                        move: 0,
                        type: 0,
                        DS: (j == 12 || j == 13) ? data[j][0].DS + offset[1] : offset[1]

                    });

                    first = second;

                    for (var i = 0; i < data[j].length - 1; i++) {
                        var date = new Date(data[j][i].Timestamp);

                        first = new Date(data[j][i].Timestamp);
                        second = new Date(data[j][i + 1].Timestamp);

                        var x = second - first;
                        var duration = (x < 2000) ? x : 2000;
                        var delay_end_start = second - first - duration;

                        var open = data[j][i].From;

                        var amount = (open == 1) ? action_amount[j] : (-1 * action_amount[j]);
                        var inital = (open == 1) ? 0 : action_amount[j];
                        var dspoos = 0;

                        if (j == 12 || j == 13) {
                            amount = (open == 1) ? action_amount[j] : (-1 * action_amount[j]); //0;
                            dspoos = data[j][i].DS + offset[1];
                            inital = (open == 1) ? 0 : action_amount[j];


                        }

                        //move: 1 == this is a rotaton event. roate by val starting from From in duration many ms.
                        datanew[j].push({
                            Sensor: data[j][0].Sensorname,
                            From: inital,
                            To: -1,
                            val: amount,
                            Duration: duration,
                            Timestamp: first,
                            Delay_end_start: delay_end_start,
                            move: 1,
                            type: 0,
                            DS: dspoos
                        });

                        //move: 0 == this is a wait event: element does not move, instead waits 'delay_end_start' ms
                        datanew[j].push({
                            Sensor: data[j][0].Sensorname,
                            From: inital,
                            To: -1,
                            val: amount,
                            Duration: duration,
                            Timestamp: new Date(date.setMilliseconds(date.getMilliseconds() + duration)),
                            Delay_end_start: delay_end_start,
                            move: 0,
                            type: 0,
                            DS: dspoos

                        });

                        // data[j][i].Timestamp = first;

                        first = second;
                    }

                    var x = second - first;
                    var duration = (x < 2000) ? x : 2000;
                    var delay_end_start = second - first - duration;

                    var open = data[j][data[j].length - 1].From;
                    //if the envent is to close, then reverse action (i.e. *-1)
                    var amount = (open == 1) ? action_amount[j] : (-1 * action_amount[j]);
                    var inital = (open == 1) ? 0 : action_amount[j];
                    var dspoos = 0;

                    //spetial handling for the doors of the drehwand (DS). Since their center of rotation changes, when the DS is rotated
                    if (j == 12 || j == 13) { //sensors for the doors of DS
                        amount = (open == 1) ? action_amount[j] : (-1 * action_amount[j]); //0;
                        inital = (open == 1) ? 0 : action_amount[j];
                        dspoos = data[j][i].DS + offset[1];


                    }
                    //move: 1 == this is a rotaton event. roate by val starting from From in duration many ms.
                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: inital,
                        To: -1,
                        val: amount,
                        Duration: duration,
                        Timestamp: data[j][data[j].length - 1].Timestamp,
                        Delay_end_start: delay_end_start,
                        move: 1,
                        type: 0,
                        DS: dspoos
                    });


                } else if (action_type[j] == 1 && data[j].length > 0) { //TRANSITION
                    console.log('trans')
                        //In this case the elements are translated and therefore handled differently
                        //All movements start at time "2019-09-11 17:07:30.000"
                    var first = abso_first;
                    var second = new Date(data[j][0].Timestamp);
                    var amount = [0, 0]
                    var x = second - first;
                    console.log(data[j][0].Sensorname)

                    //move: 0 do nothing until first move
                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: inital,
                        To: -1,
                        val: amount,
                        Duration: 0,
                        Timestamp: abso_first,
                        Delay_end_start: x,
                        move: 0,
                        type: 0
                    });

                    first = second;

                    for (var i = 0; i < data[j].length - 1; i++) {
                        var date = new Date(data[j][i].Timestamp);

                        first = new Date(data[j][i].Timestamp);
                        second = new Date(data[j][i + 1].Timestamp);

                        var x = second - first;
                        var duration = (x < 2000) ? x : 2000;
                        var delay_end_start = second - first - duration;

                        var to_coord = (data[j][i].From == 1) ? action_amount[j] : ([0, 0]);
                        var from_coord = (data[j][i].From == 0) ? action_amount[j] : ([0, 0]);

                        //move: 1 == this is a transition event. roate by val starting from From in duration many ms.
                        datanew[j].push({
                            Sensor: data[j][0].Sensorname,
                            From: to_coord,
                            To: -1,
                            val: [from_coord[0] - to_coord[0], from_coord[1] - to_coord[1]],
                            Duration: duration,
                            Timestamp: first,
                            Delay_end_start: delay_end_start,
                            move: 1,
                            type: 1
                        });


                        //move: 0 == this is a wait event: element does not move, instead waits 'delay_end_start' ms
                        datanew[j].push({
                            Sensor: data[j][0].Sensorname,
                            From: -1,
                            To: -1,
                            val: to_coord,
                            Duration: duration,
                            Timestamp: new Date(date.setMilliseconds(date.getMilliseconds() + duration)),
                            Delay_end_start: delay_end_start,
                            move: 0,
                            type: 1
                        });


                        // data[j][i].Timestamp = first;

                        first = second;
                    }

                } else if (action_type[j] == 2 && data[j].length > 0) { //FILL

                    //In this case the elements are rotated and therefore handled differently
                    //All movements start at time "2019-09-11 17:07:30.000"
                    var first = abso_first;
                    var second = new Date(data[j][0].Timestamp);
                    var x = second - first;
                    //move: 0 do nothing until first move
                    datanew[j].push({
                        Sensor: data[j][0].Sensorname,
                        From: inital,
                        To: -1,
                        val: 'green',
                        Duration: duration,
                        Timestamp: abso_first,
                        Delay_end_start: x,
                        move: 0,
                        type: 0
                    });

                    first = second;

                    for (var i = 0; i < data[j].length - 1; i++) {
                        var date = new Date(data[j][i].Timestamp);

                        first = new Date(data[j][i].Timestamp);
                        second = new Date(data[j][i + 1].Timestamp);

                        var x = second - first;
                        var duration = (x < 2000) ? x : 2000;
                        var delay_end_start = second - first - duration;

                        var open = data[j][i].From;
                        var amount = (open == 1) ? action_amount[j] : 'none';

                        //move: 1 == this is a transition event. roate by val starting from From in duration many ms.
                        datanew[j].push({
                            Sensor: data[j][0].Sensorname,
                            From: -1,
                            To: -1,
                            val: amount,
                            Duration: duration,
                            Timestamp: first,
                            Delay_end_start: delay_end_start,
                            move: 1,
                            type: 1
                        });

                        //move: 0 == this is a wait event: element does not move, instead waits 'delay_end_start' ms
                        datanew[j].push({
                            Sensor: data[j][0].Sensorname,
                            From: inital,
                            To: -1,
                            val: amount,
                            Duration: delay_end_start,
                            Timestamp: new Date(date.setMilliseconds(date.getMilliseconds() + duration)),
                            Delay_end_start: delay_end_start,
                            move: 0,
                            type: 1
                        });


                        // data[j][i].Timestamp = first;

                        first = second;
                    }



                }
            }





            dataDW = datanew[0];
            dataDS = datanew[1];
            dataLA = datanew[2];
            dataLD = datanew[3];

            var optwidth = 990;
            var optheight = 50;

            var margin_context = { top: 0, right: 0, bottom: 0, left: 0 },
                height_context = optheight - margin_context.top - margin_context.bottom,
                width = optwidth - margin_context.left - margin_context.right;

            //the buttons and other elements of control for the animation
            var playButton = document.getElementById('play');
            var pauseButton = document.getElementById('pause');
            var restartButton = document.getElementById('restart');
            var progress = document.querySelector('.slider');
            var skip = document.getElementById('skip');
            var last = document.getElementById('last')
            var speedup = document.getElementById('speedup');


            //initialize the custom timelines. 
            for (var i = 0; i < action_type.length; i++) {

                if (i == 12 && datanew[i].length > 0) { //closet door
                    console.log('data')
                    console.log(datanew[i])
                    timelines_rotation.push(new custom_timeline_door_rotation(datanew[i], selector_list[i], 3.95, 30.07));
                } else if (i == 13 && datanew[i].length > 0) { //closet door
                    console.log('data')
                    console.log(datanew[i])
                    timelines_rotation.push(new custom_timeline_door_rotation(datanew[i], selector_list[i], -30.12, 30.19));

                } else if (action_type[i] == 0 && datanew[i].length > 0) { //rotational elements
                    timelines_rotation.push(new custom_timeline(datanew[i], selector_list[i]));
                } else if (action_type[i] == 1 && datanew[i].length > 0) { //open-close elements
                    // 
                    timelines_transition.push(new custom_timeline_translate(datanew[i], selector_list[i]));

                } else if (action_type[i] == 2 && datanew[i].length > 0) { //fill elements

                    timelines_transition.push(new custom_timeline_fill(datanew[i], selector_list[i]));
                    console.log('action type fill')

                }

            }

            /**
             * START ANIMATION
             */
            //start the animation of the clock
            raf_clock = requestAnimationFrame(clock);

            //start the animation of each element
            for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].restart();
            for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].restart();


            /**
             * EVENT LISTENERS
             */
            /**
             * PLAY
             * start animation and clock, if it was paused before.
             */
            playButton.addEventListener('click', function() {
                if (paused) {

                    for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].continue();
                    for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].continue();


                    last_time = new Date().getTime();

                    raf_clock = requestAnimationFrame(clock);

                    paused = false;
                }
            });
            /**
             * PAUSE
             * pause animation and clock if not already paused
             */
            pauseButton.addEventListener('click', function() {
                if (!paused) {
                    paused = true;

                    for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].pause();
                    for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].pause();

                    cancelAnimationFrame(raf_clock);
                }

            });

            /**
             * TOGGLE PAUSE/PLAY by pressing spacebar
             * @param {*} e 
             */
            document.body.onkeyup = function(e) {

                    if (e.keyCode === 32) { // this is the spacebar
                        console.log('space')
                        if (!paused) {
                            paused = true;

                            for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].pause();
                            for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].pause();

                            cancelAnimationFrame(raf_clock);
                        } else {

                            for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].continue();
                            for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].continue();



                            last_time = new Date().getTime();

                            raf_clock = requestAnimationFrame(clock);

                            paused = false;

                        }
                    }; // treat all other keys normally;
                }
                /**
                 * RESTART the animation of the week from the start.
                 * If it was paused beofre it plays.
                 */
            restartButton.addEventListener('click', function() {
                cancelAnimationFrame(raf_clock)
                paused = false;
                abso_first = new Date(min);
                for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].restart();
                for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].restart();


                ddddd = abso_first;
                //Set progress value and the slider to 0
                progress.value = 0;
                progress.min = 0;
                //restart clock as well
                clearInterval(clock)
                raf_clock = requestAnimationFrame(clock)



            });
            /**
             * PROGRESS
             * update animation and clock to the state held at the time specified by using the progress bar. 
             * Use function seek to achieve this.
             */
            progress.addEventListener('input', function() {

                for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].seek(parseInt(progress.value) + o_slider, 0);
                for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].seek(parseInt(progress.value) + o_slider, 0);


                cancelAnimationFrame(raf_clock)
                var date = new Date(abso_first);
                console.log(abso_first)
                console.log(date)

                date.setMilliseconds(date.getMilliseconds() + parseInt(progress.value));

                console.log(abso_first)
                console.log(date)

                document.getElementById('tslider').innerHTML = "(" + timeslider(date) + ")";
                document.getElementById("Timer").firstChild.nodeValue = timeslider(date);

                ddddd = date;
                raf_clock = requestAnimationFrame(clock)

            });


            /**
             * SKIP
             * skips transformations to show the next rotation by one of the four main rotatble elements. 
             */
            skip.addEventListener('click', function() {
                //IDEA: find next TIMESTAMP an element moves 
                //chose the earliest among the four
                //and seek the state at the given timestamp and continue with the animation


                var i_DW = timelines_rotation[0].currInd();
                var i_DS = timelines_rotation[1].currInd();
                var i_LA = timelines_rotation[2].currInd();
                var i_LD = timelines_rotation[3].currInd();

                i_DW = (i_DW >= datanew[0].length) ? datanew[0].length - 1 : i_DW;
                i_DS = (i_DS >= datanew[1].length) ? datanew[1].length - 1 : i_DS;
                i_LA = (i_LA >= datanew[2].length) ? datanew[2].length - 1 : i_LA;
                i_LD = (i_LD >= datanew[3].length) ? datanew[3].length - 1 : i_LD;

                i_DW += (datanew[0][i_DW].move == 0) ? (1) : (2);
                i_DS += (datanew[1][i_DS].move == 0) ? (1) : (2);
                i_LA += (datanew[2][i_LA].move == 0) ? (1) : (2);
                i_LD += (datanew[3][i_LD].move == 0) ? (1) : (2);


                i_DW = (i_DW >= datanew[0].length) ? datanew[0].length - 1 : i_DW;
                i_DS = (i_DS >= datanew[1].length) ? datanew[1].length - 1 : i_DS;
                i_LA = (i_LA >= datanew[2].length) ? datanew[2].length - 1 : i_LA;
                i_LD = (i_LD >= datanew[3].length) ? datanew[3].length - 1 : i_LD;


                var earliest = datanew[0][i_DW].Timestamp;
                if (datanew[1][i_DS].Timestamp < earliest) earliest = datanew[1][i_DS].Timestamp;
                if (datanew[2][i_LA].Timestamp < earliest) earliest = datanew[2][i_LA].Timestamp;
                if (datanew[3][i_LD].Timestamp < earliest) earliest = datanew[3][i_LD].Timestamp;

                //calc progressvalue on slider: position of the progress slider and animation
                var progress_val = new Date(earliest) - abso_first;
                ddddd = new Date(earliest);
                last_time = new Date().getTime();

                //update time displayed
                document.getElementById("Timer").firstChild.nodeValue = timeslider(ddddd);
                document.getElementById('tslider').innerHTML = "(" + timeslider(ddddd) + ")";

                progress.value = progress_val;

                //give as input to seek for each element
                for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].seek(progress_val + o_slider, 1);
                for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].seek(progress_val + o_slider, 1);


            });
            /**
             * LAST same as SKIP but goes back to the latest transformation, instead of the next.
             */
            last.addEventListener('click', function() {
                //IDEA: find next TIMESTAMP an element moves
                //chose the last among the four
                //and seek the state at the given timestamp and continue with the animation
                var i_DW = timelines_rotation[0].currInd();
                var i_DS = timelines_rotation[1].currInd();
                var i_LA = timelines_rotation[2].currInd();
                var i_LD = timelines_rotation[3].currInd();

                i_DW = (i_DW >= datanew[0].length) ? datanew[0].length - 1 : i_DW;
                i_DS = (i_DS >= datanew[1].length) ? datanew[1].length - 1 : i_DS;
                i_LA = (i_LA >= datanew[2].length) ? datanew[2].length - 1 : i_LA;
                i_LD = (i_LD >= datanew[3].length) ? datanew[3].length - 1 : i_LD;


                i_DW -= (dataDW[i_DW].move == 0) ? (1) : (2);
                i_DS -= (dataDS[i_DS].move == 0) ? (1) : (2);
                i_LA -= (dataLA[i_LA].move == 0) ? (1) : (2);
                i_LD -= (dataLD[i_LD].move == 0) ? (1) : (2);

                if (i_DW < 0) i_DW = 0;
                if (i_DS < 0) i_DS = 0;
                if (i_LA < 0) i_LA = 0;
                if (i_LD < 0) i_LD = 0;


                var latest = dataDW[i_DW].Timestamp;
                if (dataDS[i_DS].Timestamp > latest) latest = dataDS[i_DS].Timestamp;
                if (dataLA[i_LA].Timestamp > latest) latest = dataLA[i_LA].Timestamp;
                if (dataLD[i_LD].Timestamp > latest) latest = dataLD[i_LD].Timestamp;

                //calc progressvalue on slider

                var progress_val = latest - new Date(abso_first);

                document.getElementById("Timer").firstChild.nodeValue = timeslider(latest);
                document.getElementById('tslider').innerHTML = "(" + timeslider(latest) + ")";
                progress.value = progress_val;


                //give as input to seek for each element   
                ddddd = new Date(latest);
                last_time = new Date().getTime();

                for (var i = 0; i < timelines_rotation.length; i++) timelines_rotation[i].seek(progress_val + o_slider, 1);
                for (var i = 0; i < timelines_transition.length; i++) timelines_transition[i].seek(progress_val + o_slider, 1);


            });

            /**
             * ACTIVIT GRAPH    
             */
            //y axis for the activity graph
            var dataYrange = [d3.min(data_progress, function(d) { return d.val; }), d3.max(data_progress, function(d) { return d.val; })];

            var y2 = d3.scaleLinear()
                .range([height_context, 0])
                .domain(dataYrange);
            /**
             * Draw the graph (multl line graph) for orientation. it mark the timing a rotatable element was moved.
             * @param {*} dataa 
             * @param {*} from_date 
             * @param {*} to_date 
             */
            function update_activity(dataa, from_date, to_date) {

                d3.selectAll('#metric').remove();
                temp = dataa;

                var k;

                if (to_date == 'week') {
                    if (from_date == 'All') {
                        k = dataa;
                    } else {
                        console.log(week(new Date(dataa[0].month)))
                        from_date = parseInt(from_date);
                        k = dataa.filter(d => parseInt(week(new Date(d.month))) == from_date);
                    }
                } else {
                    console.log('dates')
                    to_date = day(to_date)
                    from_date = day(from_date)
                    k = dataa.filter(d => day(new Date(d.month)) <= to_date && day(new Date(d.month)) >= from_date); //get only the data for the given week
                }
                //x axis
                var dataXrange = d3.extent(k, function(d) { return d.month; });

                // maximum date range allowed to display
                var mindate = dataXrange[0], // use the range of the data
                    maxdate = dataXrange[1];

                var x2 = d3.scaleTime()
                    .range([0, width])
                    .domain([mindate, maxdate]);

                var line_context = d3.line()
                    .x(function(d) { return x2(d.month); })
                    .y(function(d) { return y2(d.val); });

                var vis = d3.select("#metric-modal").append("svg")
                    .attr('id', 'metric')
                    .attr("width", width)
                    .attr("height", optheight)
                    .attr("class", "metric-chart");

                var context = vis.append("g")
                    .attr("class", "context")
                    .attr("transform", "translate(" + (margin_context.left + margin_context.right) + "," + margin_context.top + ")");

                for (var j = 0; j < k.length; j += 2) {

                    var set = [k[j], k[j + 1]];

                    context.append("path")
                        .datum(set)
                        .attr("class", "line")
                        .attr("d", line_context)
                        .attr('stroke-width', 0.7)
                        .attr('stroke', d => d[0].col);

                }
                dataa = temp;

            }
            var latest = [];
            if (dataDW.length - 2 >= 0) {
                latest.push(dataDW[dataDW.length - 2].Timestamp)

            }
            if (dataDS.length - 2 >= 0) {
                latest.push(dataDS[dataDS.length - 2].Timestamp)

            }
            if (dataLA.length - 2 >= 0) {
                latest.push(dataLA[dataLA.length - 2].Timestamp)

            }
            if (dataLD.length - 2 >= 0) {
                latest.push(dataLD[dataLD.length - 2].Timestamp)

            }
            var to_datee = latest.sort()[latest.length - 1];

            update_activity(data_progress, ddddd, new Date(max)) //new Date(to_datee))
        }
    });
    //speeds are the factors of speedup that can be achieved, pressing the button increases the factor in the given order, or starts from the beginning
    var speeds = [1, 2, 4, 8, 10, 20];
    /**
     * SPEEDUP the animation by a factor, specified by the speeds array.
     * The factor can be read out by hovering over the button
     */


}


var startDate = new Date();
var speeds = [1, 2, 4, 8, 10, 20];
/**
 * clock displays time and weekday 
 * It is based on the requestAnimationFrame function
 */
var clock = function clock() {
        var now = new Date().getTime();

        var delta = now - last_time;
        last_time = now;
        ddddd.setMilliseconds(ddddd.getMilliseconds() + delta * speeds[sp]);

        document.getElementById("Timer").firstChild.nodeValue = timeslider(ddddd);
        document.getElementById('tslider').innerHTML = "(" + timeslider(ddddd) + ")";
        document.getElementById('timeslider').value = ddddd - abso_first;

        if (parseInt(document.getElementById('timeslider').value) <= (parseInt(document.getElementById('timeslider').max) + 30000)) {
            raf_clock = requestAnimationFrame(clock);
        } else {
            cancelAnimationFrame(raf_clock)
        }
    }
    /**
     * This function return the table containing all sensors and the time they registered an event
     * @param {} data 
     * @param {*} columns 
     */
function tabulate(data, columns) {
    var table = d3.select('#list_activity')
        .append('table')
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    // append the header row
    thead.append('tr')
        .selectAll('th')
        .attr('height', 300)
        .data(columns).enter()
        .append('th')
        .attr('id', 'thetable')
        .text(function(column) {
            return column;
        })
        .style('font-size', '12px');

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .attr('id', 'thetable');

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
        .data(function(row) {
            return columns.map(function(column) {
                return {
                    column: column,
                    value: row[column]
                };
            });
        })
        .enter()
        .append('td')
        .text(function(d) {
            if (d.column == 'Timestamp') d.value = list_activity_time(new Date(d.value));
            console.log(d)
            return d.value;
        })
        .style('font-size', '12px');;

    return table;
}