/**
 * It does three things:
 * 1. draw the radial histograms
 * 2. draws elements in the spatial mapping
 * 3. calls function to draw the percentage barcharts.
 * 4. draw rardial histograms per weekday (variables for this have suffix '_wkd')
 * 
 * Most importantly, it calculates the data for the inner and outer histogra.
 * Every state of the Mock-up can be defined by the angles of the four rotational elements and the timestamp the 
 * state was achieved. 
 * The calculation of the dataset of the inner histogram depends on union/intersection/difference of the set of states based on the different states of the elements. 
 *  
 * The 'index' always indicates the current element. This can be checked by looking at the elements array.
 */
//The four rotational elements. 
const elements = ['drehwand', 'drehschrank', 'lampeAussenwand', 'lampeDrehwand']; //for identifying divs.
const elements_des = ['Wall', 'Closet', 'Lamp B', 'Lamp A ']; //for titles.//['Drehwand', 'Drehschrank', 'Aussenwand', 'Drehwand']; //for titles.


const color = ['red', 'green', 'rgb(0, 47, 255)', 'purple']
    //the colors associated with the element at the same index.
var angles = [ //this array hold all angles that are selected for the element at the same index.
    [],
    [],
    [],
    []
];
var currentangle = [0, 0, 0, 0];
const complement = ['orange', 'orange', 'orange', 'orange']; //colour of outer bar, when selected or hovering over not-selected bars
const darkcol = ['rgb(88, 0, 0)', 'rgb(0, 66, 0)', 'rgb(2, 0, 99)', 'rgb(58, 0, 58)']; //colour of inner bar of bars 
const darkest = ['rgb(58, 0, 0)', 'rgb(0, 39, 0)', 'rgb(1, 0, 41)', 'rgb(29, 0, 29)'] //colour of inner bar when it is selected hovering over it

var dw = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 }
var wd = { '0': 'Mon', '1': 'Tue', '2': 'Wed', '3': 'Thu', '4': 'Fri', '5': 'Sat', '6': 'Sun' }


var plus = [0, 0, 0, 0] //[3, 4, 2, 5];
var offset = [79, 103, 117, 200]; //align 0-degree of the radial histograms with that in the floor plan in the spatial mapping
var rotate = [0, 0, 0, 0];
var obj; //used to differentiate mouseup event caused  by click or after multiple selections through mousedown
var dataset_inner_chart = [ //the data for the inner histogram.  for each element, it holds for each angle, the frequency and duration the element was at that angle
    [],
    [],
    [],
    []
];
var weekdays_data_inner_updated = [ //the data for the inner histogram per weekday
    [
        [],
        [],
        [],
        []
    ],
    [
        [],
        [],
        [],
        []
    ],
    [
        [],
        [],
        [],
        []
    ],
    [
        [],
        [],
        [],
        []
    ],
    [
        [],
        [],
        [],
        []
    ],
    [
        [],
        [],
        [],
        []
    ],
    [
        [],
        [],
        [],
        []
    ],
]
var union = [ //used for calcuating dataset_inner.

];
var intersection = [ //used for calcuating dataset_inner. (per element )
    [],
    [],
    [],
    []
];
var added = []; //all angles added since last update to the inner histogram
var removed = []; //all angles removed since last update to the inner histogram

var margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = window.innerWidth / 4 - 10,
    height = window.innerWidth / 4 - 10,
    innerRadius = 42,
    outerRadius = width / 2,
    width_wkd = window.innerWidth / 7,
    height_wkd = width_wkd,
    outerRadius_wkd = (width_wkd / 2),
    innerRadius_wkd = (innerRadius / outerRadius * outerRadius_wkd) * 0.7;

// the outerRadius goes from the middle of the SVG area to the border

var yScales;
var yScales_weekday;

//svgI, I= index of the element, svg containing the radial histogram
var svg0 = d3.selectAll("#" + elements[0])
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

var svg1 = d3.selectAll("#" + elements[1])
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

var svg2 = d3.selectAll("#" + elements[2])
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

var svg3 = d3.selectAll("#" + elements[3])
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

const svg_wkd = [ //initzialized later
    [],
    [],
    [],
    []
];

//divI, I= index of the element, div used for tooltip
const div0 = d3.selectAll("#" + elements[0] + 'div')
    .attr('width', width + 'px')
    .style('left', (innerRadius) + 'px')
    .style('font-size', '12px');

const div1 = d3.selectAll("#" + elements[1] + 'div')
    .attr('width', width + 'px')
    .style('left', innerRadius + 'px')
    .style('font-size', '12px');

const div2 = d3.selectAll("#" + elements[2] + 'div')
    .attr('width', width + 'px')
    .style('left', innerRadius + 'px')
    .style('font-size', '12px');

const div3 = d3.selectAll("#" + elements[3] + 'div')
    .attr('width', width + 'px')
    .style('left', innerRadius + 'px')
    .style('font-size', '12px');

//inital tooltip shown for each element (no values)
for (var k = 0; k < 4; k++) {
    document.getElementById(elements[k] + "div").innerHTML = ('Frequency at Angle: -' +
        '<br>' + 'Outer: -' +
        '<br>' + 'Inner: -')
}
//Title/Name of the rotatable element in the center of the radial histogram
for (var i = 0; i < 4; i++) {
    let svgs = [svg0, svg1, svg2, svg3];
    if (i < 2) {
        svgs[i].append("text")
            .style("text-anchor", "middle")
            .style('font-size', '11px')
            .style('width', 20)
            .text('Rotatable')
            .append('tspan')
            .attr('x', 0)
            .attr('dy', '1.2em')
            .append('tspan')
            .text(elements_des[i]);
    } else {
        svgs[i].append("text")
            .style("text-anchor", "middle")
            .style('font-size', '11px')
            .style('width', 20)
            .text(elements_des[i])

    }
}
var grouping = 4; //bucket size
var grouping_before = 4; //previous bucket size
var scale = 0; // It defines which values to use for the bars, spatial mapping and percentage barchart. [0 == frequency, 1 == duration].


var weekdays = [];
var weeks = [];
var groups = [];
var age = [];
var jobs = [];
var times = [];
var hours = [];

var timeinput = d3.timeFormat('%H:%M'); //time format for the value set by the time-interval filter
const divarr = [div0, div1, div2, div3];
var div_wkd = []; //initialized later

//the filters set (global-filter)
var glb_filter = [
        [], -1, -1, -1, -1, -1
    ] //Weekday, Week, Group,TimeFrom,TimeTo,multiple weeks
const maxrange = [237, 186, 157, 320]; //maxrange of the corresponding elements

/**
 *  
 * Draws elements at 0 degrees, filters data and calls re-initialize, 
 * ultimately initializing several arrays and calling the function to draw the radial histograms
 */
function radial() {
    //change rotation center 
    d3.selectAll('.DS-7').style('transform-origin', '545.73px 505.05px');
    d3.selectAll('.DS-8').style('transform-origin', '545.73px 505.05px');
    d3.selectAll('.DS-9').style('transform-origin', '545.73px 505.05px');

    d3.selectAll('.DW-5').style('transform-origin', '455.8px 407.28px');
    d3.selectAll('.DW-4').style('transform-origin', '455.8px 407.28px');
    d3.selectAll('.dotDW').style('transform-origin', '455.8px 407.28px');

    d3.selectAll('.LA-7').style('transform-origin', '726.8px 522.78px');
    d3.selectAll('.LA-6').style('transform-origin', '726.8px 522.78px');

    d3.selectAll('.LD-6').style('transform-origin', '455.8px 407.28px');
    d3.selectAll('.LD-7').style('transform-origin', '455.8px 407.28px');
    //rotate elements to 0 degrees as defined by sensors
    document.querySelectorAll(['.DW-5', ]).forEach(el => el.style.transform = 'rotate(' + -79.37 + 'deg)');
    document.querySelectorAll(['.DS-7', '.DS-8', '.DS-9']).forEach(el => el.style.transform = 'rotate(' + -103.4 + 'deg)');
    document.querySelectorAll(['.LA-6', ]).forEach(el => el.style.transform = 'rotate(' + -117.54 + 'deg)');
    document.querySelectorAll(['.LD-6']).forEach(el => el.style.transform = 'rotate(' + -199.8 + 'deg)');


    //1. Read in data_snaps, containing all states of the Mockup
    Promise.all([d3.json('../data/data_snaps_densityPlot.json')]).then(function(data) {

        //2.initialize svg and div for weekdayly radial histograms
        for (var i = 0; i < 4; i++) {
            for (var wkd = 0; wkd < 7; wkd++) {

                svg_wkd[i].push(d3.select("#" + elements[i] + '_' + wkd)
                    .append('svg')
                    .attr("width", width_wkd)
                    .attr("height", height_wkd)
                    .append('g')
                    .attr("transform", "translate(" + (width_wkd / 2) + "," + (height_wkd / 2) + ")"))

            }
        }
        for (var i = 0; i < 4; i++) {
            temp = [];
            for (var wkd = 0; wkd < 7; wkd++) {
                div = d3.selectAll("#" + elements[i] + '_' + wkd).append('div')
                    .attr('id', elements[i] + '_' + wkd + 'div')
                    .style("width", 0 + 'px')
                    .style("height", 0 + 'px')
                    .attr('class', 'tooltip')
                    .style('fill', 'none')
                    .style('backround-color', 'none')
                    .style('opacity', 1);
                temp.push(div);
            }
            div_wkd.push(temp);

        }
        var data_snaps = data[0];

        /**
         * Update filter values on change
         * 
         */

        /**Interactively update filters depending on choice of 'Residents' filter 
         * if Group filter is 'All' --> chose 0-th option
         * if 'Single' --> choose 1st option
         * if 'Pairs'/Double --> chose 2nd option
         */
        //TIME INTERVAL FILTERS: capture times set and save in the given variables, everytime it is changed

        var from_time, to_time = -1;

        document.getElementById('input_time_from').addEventListener("input", function(event) {
            from_time = '2019-09-11 ' + document.getElementById("input_time_from").value + ':00';

            //console.log('from time' + from_time)

            from_time = new Date(from_time)

            //console.log(timeinput(from_time))

            if (to_time != -1 && to_time < from_time) {
                d3.select('#input_time_to').style('background-color', '#ffdddd')
                glb_filter[3] = -1;
            } else {
                d3.select('#input_time_to').style('background-color', 'white');

                inp = document.getElementById("input_time_from").value
                glb_filter[3] = inp;

                if (inp.substring(0, 2) == '--') glb_filter[3] = -1;
                if (inp.substring(3, 5) == '--') glb_filter[3] = -1;




            }
        });
        document.getElementById('input_time_to').addEventListener("input", function(event) {
            to_time = '2019-09-11 ' + document.getElementById("input_time_to").value + ':00';

            //console.log('to time' + to_time)
            to_time = new Date(to_time)
                //console.log(timeinput(to_time))
            if (to_time < from_time) {
                d3.select(this).style('background-color', '#ffdddd');
                glb_filter[4] = -1;
            } else {
                d3.select(this).style('background-color', 'white');
                inp = document.getElementById("input_time_to").value
                glb_filter[4] = document.getElementById("input_time_to").value

                if (inp.substring(0, 2) == '--') glb_filter[4] = -1;
                if (inp.substring(3, 5) == '--') glb_filter[4] = -1;

            }

        });

        //on click on the synch symbol at the filters, this is called. It looks up current filters set and updates all views accordingly.
        //note multi-selects return arrays of values
        d3.selectAll('#filterApply').on('click', function() {



            _this = d3.select('#filterApply')
            this.classList.add('icn-spinner-time') //remove class to stop animation
                //GROUP FILTER:[0== single, 1== pairs else none]

            d = $selected_groups.multipleSelect('getSelects');
            group = 0;
            //store the set group filter in these variable, to faciliate other filters

            if (d == [] || d.length == 2) { //selecting both and selecting none both same 
                glb_filter[1] = -1;
                group = -1
            } else {
                if (d[0] == 0) glb_filter[1] = 0;
                if (d[0] == 1) glb_filter[1] = 1;
                group = glb_filter[1]
            }
            //WEEKDAYS FILTERS

            weekdays_ = $weekday_select.multipleSelect('getSelects');
            if (weekdays_.length == 7 || weekdays_.length == 0) {
                weekdays_ = [];
            }

            glb_filter[0] = weekdays_;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 6; j++) {
                    d3.selectAll('#selectAll_' + i + '_' + j).remove();
                }

            }
            //coming filters all determine which weeks are to be considered for all visualizations in the main view. They are the same as week filters, and thus stored in the weeks_filter array.
            //WEEK FILTER

            weeks_filter = data_profile.slice();

            weeks_ = $week_select.multipleSelect('getSelects');
            //console.log(weeks_)
            if (weeks_.length == weeks_all.length || weeks_.length == 0) {
                weeks_ = [];
            } else {
                weeks_filter = weeks_filter.filter(x => weeks_.includes(x.Week));
            }
            //AGE FILTER

            ages = $age_select.multipleSelect('getSelects');
            //console.log(ages)
            if (ages.length == 4 || ages.length == 0) {
                ages = [];
            } else {

                if (group == -1) {
                    weeks_filter = weeks_filter.filter(x => ages.includes(x.Age1) || ages.includes(x.Age2));

                } else {
                    if (group == 0) {
                        weeks_filter = weeks_filter.filter(x => ages.includes(x.Age1));
                    } else {
                        weeks_filter = weeks_filter.filter(x => ages.includes(x.Age1) || ages.includes(x.Age2));

                    }

                }
            }
            //GENDER FILTER
            genders = $gender_select.multipleSelect('getSelects');
            if (genders.length == 2 || genders.length == 0) {
                genders = [];
            } else {
                if (group == -1) {
                    weeks_filter = weeks_filter.filter(x => genders.includes(x.Gender1) || genders.includes(x.Gender2));

                } else {
                    if (group == 0) {
                        weeks_filter = weeks_filter.filter(x => genders.includes(x.Gender1));
                    } else {
                        weeks_filter = weeks_filter.filter(x => genders.includes(x.Gender1) || genders.includes(x.Gender2));

                    }

                }
            }
            //OCCUPATION FILTER
            occ = $occ_select.multipleSelect('getSelects');
            if (occ.length == 4 || occ.length == 0) {
                occ = [];
            } else {
                if (group == -1) {
                    weeks_filter = weeks_filter.filter(x => occ.includes(x.OccupationCategory1) || occ.includes(x.OccupationCategory2));

                } else {
                    if (group == 0) {

                        weeks_filter = weeks_filter.filter(x => occ.includes(x.OccupationCategory1));
                    } else {
                        weeks_filter = weeks_filter.filter(x => occ.includes(x.OccupationCategory1) || occ.includes(x.OccupationCategory2));

                    }

                }
            }
            //HOUSING FILTERS

            housing = $housing_select.multipleSelect('getSelects');
            if (housing.length == 2 || housing.length == 0) {
                housing = [];
            } else {
                if (group == -1) {
                    weeks_filter = weeks_filter.filter(x => housing.includes(x.HousingUnit1) || housing.includes(x.HousingUnit2));

                } else {
                    if (group == 0) {
                        weeks_filter = weeks_filter.filter(x => housing.includes(x.HousingUnit1));
                    } else {
                        weeks_filter = weeks_filter.filter(x => housing.includes(x.HousingUnit1) || housing.includes(x.HousingUnit2));

                    }

                }
            }
            //LIVING SITUATION FILTERS

            living = $living_select.multipleSelect('getSelects');
            if (living.length == 3 || living.length == 0) {
                living = [];
            } else {
                if (group == -1) {
                    weeks_filter = weeks_filter.filter(x => living.includes(x.LivingSize1) || living.includes(x.LivingSize2));

                } else {
                    if (group == 0) {
                        weeks_filter = weeks_filter.filter(x => living.includes(x.LivingSize1));
                    } else {
                        weeks_filter = weeks_filter.filter(x => living.includes(x.LivingSize1) || living.includes(x.LivingSize2));

                    }

                }
            }
            //ROOMSIZE FILTER

            room = $room_select.multipleSelect('getSelects');
            if (room.length == 3 || room.length == 0) {
                room = [];

            } else {
                //console.log(room)
                if (group == -1) {
                    weeks_filter = weeks_filter.filter(x => room.includes(x.RoomsCat1) || room.includes(x.RoomsCat2));

                } else {
                    if (group == 0) {
                        weeks_filter = weeks_filter.filter(x => room.includes(x.RoomsCat1));
                    } else {
                        weeks_filter = weeks_filter.filter(x => room.includes(x.RoomsCat1) || room.includes(x.RoomsCat2));

                    }
                }
            }
            //RECENT CHANGES FILTER

            change = $change_select.multipleSelect('getSelects');
            if (change.length == 3 || change.length == 0) {
                change = [];
            } else {
                if (group == -1) {
                    weeks_filter = weeks_filter.filter(x => change.includes(x.ChangeCat1) || change.includes(x.ChangeCat2));

                } else {
                    if (group == 0) {
                        weeks_filter = weeks_filter.filter(x => change.includes(x.ChangeCat1));
                    } else {
                        weeks_filter = weeks_filter.filter(x => change.includes(x.ChangeCat1) || change.includes(x.ChangeCat2));

                    }
                }
            }

            //update data for all visualizations, reinitialize array and update all visualizations
            filter_data();

            reInitialize(false);
        });

        //when checkbock for the timefilters are not checked, they are disabled
        d3.select('#check_time').on('click', function de_activate_timeInput() {
            // Get the checkbox
            var checkBox = document.getElementById("check_time");

            // If the checkbox is checked, display the output text
            if (checkBox.checked == false) {
                prev_from_time = glb_filter[3];
                prev_to_time = glb_filter[4];
                document.getElementById("input_time_from").disabled = true;
                document.getElementById("input_time_to").disabled = true;
                document.getElementById("check_time").title = 'Enable Time Filter'

            } else {
                document.getElementById("input_time_from").disabled = false;
                document.getElementById("input_time_to").disabled = false;
                document.getElementById("check_time").title = 'Disable Time Filter'

                glb_filter[3] = -1;
                glb_filter[4] = -1;
            }

        });
        //on chnage of GROUPING size
        document.getElementById('input_grouping').addEventListener("keyup", function(event) {

            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // //console.log('event')
                // Cancel the default action, if needed
                event.preventDefault();
                val = parseFloat(document.getElementById("input_grouping").value)

                if (val > 0 && val <= 90 && (val % 1) == 0) {
                    grouping_before = grouping;
                    grouping = parseInt(val)



                    reInitialize(true);

                }
            }
        });

        //on change of SCALE method
        document.getElementById('input_scale').addEventListener("change", function(event) {

            val = parseFloat(document.getElementById("input_scale").value)

            if (scale != val) {
                scale = val;


                reInitialize(false);

            }

        });



        /**
         * Reinitalize some of the arrays. (dataset_inner_chart, union_intersection,total_val,added,removed,yScales)
         * Call function to draw the radial charts to the given data.
         * b indicates whether the bucket size needs to be changed as well.
         *  @param {bool} b 
         */
        function reInitialize(b) {
            //re-initialize the data arrays
            dataset_inner_chart = [
                [],
                [],
                [],
                []
            ];
            union = [

            ];

            intersection = [
                [],
                [],
                [],
                []
            ];
            added = [];
            removed = [];
            //remove everything...
            d3.selectAll('#xaxis').remove();
            d3.selectAll('.path').remove();

            for (var i = 0; i < 4; i++) {
                d3.selectAll('#' + elements[i] + 'bar').remove();
                d3.selectAll('#temp' + i).remove();
            }

            //...and redraw
            draw_radial_charts(grouping, [b, b, b, b]);

        }

        //filter_data() uses the same filter to be applied on later functions
        filter_data();

        //VERY FIRST CALL: draw the radial charts
        draw_radial_charts(grouping, [false, false, false, false]);

        /**
         * This function calculates the data for the inner histograms and draws the four radial histograms for the given bucket size (grouping).
         * 
         * 1.apply filters on data using current FILTER (glb_filter)
         * 2.Initialize DATA_GROUPED_BY_ANGLE, used to draw outer chart and to clculate values of the inner chart
         * 3.initialize DATASET_INNER CHART and DATASET_OUTER_CHART
         * 4. draw the charts one by one using CircularBarChart(...)
         * 
         * @param {int} grouping number of angles to be grouped together to one bar, between 1 and 90
         * @param {[Bool]} g_updated bool array. It tells us if the i-th chart was already updated, to avoid unneccesary redundant computation.
         */
        function draw_radial_charts(grouping, g_updated) {


            /**
             *1.Apply filters on data using current filters 
             * In order to fill data_grouped_per_angle, we must first filter data_snaps so that it applies to all filter set for each group. 
             * This data is contained in DATA_SNAPS_TIME_FILTERED for each group.
             */
            var data_snaps_filtered = data_snaps.slice();

            //Week
            if (weeks_filter.length != 0) {
                wf = weeks_filter.map(x => x.Week_Year)
                data_snaps_filtered = data_snaps_filtered.filter(x => wf.includes(x.Week));
            }

            //Weekday
            if (glb_filter[0].length != 0) {
                data_snaps_filtered = data_snaps_filtered.filter(x => (glb_filter[0]).includes(x.Weekday))
            }
            //All, Single,Double, SvsD
            if (glb_filter[1] != -1) {
                data_snaps_filtered = data_snaps_filtered.filter(x => x.Group == glb_filter[1])
            }
            if (glb_filter[3] != -1 && glb_filter[4] != -1) {
                var from = glb_filter[3];
                var to = glb_filter[4];
                from = (from == -1) ? '00:00' : from;
                to = (to == -1) ? '23:59' : to;
                data_snaps_filtered = time_filter(data_snaps_filtered, from, to);
            }
            /**
             * Apply time filter on data_snaps
             * 
             * Find all instances that are contained in the given time interval. 
             *  
             * Two cases:
             * 1. the to intervals specified in the filters are disjunct:
             * ---------X..............X---------V........V--------
             * --> Do 2 runs
             * 2. the to intervals are not disjunct:
             * ---------X----V----------X----------V-----  (interleaved)
             * ---------X--------V------V---------X--------(contained)
             * 3. partially coincide
             * ---------X/V-----------X----------V---------(coincide)
             * --> do 1 run, but need to adjust values when initializing dataset_outer_chart and updating dataset_inner_chart
             */
            /**
             * filter data_filtered array, such that we are left with all the positions and the durations they were held during the time interval of [from_time; to_time]
             * @param {*} data_to_filter data already passed through the other filters
             * @param {*} from_time  format: %H:%M 
             * @param {*} to_time   format: %H:%M
             */
            function time_filter(data_snap_, from_time, to_time) {

                if (from_time == -1) from_time = '00:00';
                if (to_time == -1) to_time == '23:59'

                var data_days_filtered = [];
                data_to_filter = data_snap_.slice();
                //group data by date
                var nest_per_day = d3.nest()
                    .key(function(d) {
                        return d3.timeFormat('%Y-%m-%d')(new Date(d.Timestamp));
                    }).entries(data_to_filter);


                //concatinate, so we get all the data measured on the given date (data_day)
                for (var i = 0; i < nest_per_day.length; i++) {
                    day = nest_per_day[i].key;
                    var data_day = [];

                    data_day = nest_per_day[i].values

                    //return all data within the time interval for the given date
                    var interval = time_interval_per_day(from_time, to_time, day, data_day)

                    //concatinate with the previous results to get one array of all filtered data
                    data_days_filtered = data_days_filtered.concat(interval);

                }

                return data_days_filtered;
            }


            /**
             * Given a time interval [from_time,to_time] it returns an array containing all the positions that were held by the 4 sensorelements as well as
             * the time they were in that position.
             * Simply find all data_instances measured within that time, and adjust the .time_to_next attribute of the 2 edge cases:
             * -measured right before time_from 
             * -measured right before time_to
             * 
             *      prev_from      from    first                prev_to    to
             * ...--------X------------|--------X-------x...x---------X-------|--------...
             * 
             * @param {String or Int} from_time  format: %H:%M or -1
             * @param {String or Int } to_time   format: %H:%M or -1
             * @param {*} day the date of the instances in data_day 
             * @param {*} data_day an array, containing all data instances that were measured on the given day, as well as the last of the previous day and the first of the next
             */
            function time_interval_per_day(from_time, to_time, day, data_day) {
                var interval = [];

                var date_from = day + ' ' + from_time + ':00.000';
                var date_to = day + ' ' + to_time + ':59.999';

                var index_prev_from, index_prev_to;
                var prev_to = [],
                    prev_from = [];

                //do binary search to find first and last index in data_day that has its .Timestamp within [time_from,time_to]
                if (from_time == '00:00') {
                    index_prev_from = -1;
                } else {
                    index_prev_from = binary_search_time(date_from, data_day);
                    next_time = date_to;
                    d = data_day[index_prev_from];
                    if (index_prev_from < data_day.length - 1) next_time = (data_day[index_prev_from + 1].Timestamp);

                    prev_from = [{
                        Timestamp: date_from,
                        element_ang: d.element_ang,
                        time_to_next: (new Date(next_time) - new Date(date_from)),
                        Week: d.Week,
                        Weekday: d.Weekday,
                        Group: d.Group,
                        Hour: d.Hour,
                        Min: d.Min,
                        Element: d.Element
                    }]
                }
                if (to_time == '23:59') {
                    index_prev_to = data_day.length;
                } else {
                    index_prev_to = binary_search_time(date_to, data_day);

                    d = data_day[index_prev_to];

                    prev_to = [{
                        Timestamp: d.Timestamp,
                        element_ang: d.element_ang,
                        time_to_next: (new Date(date_to) - new Date(d.Timestamp)) - 60000,
                        Week: d.Week,
                        Weekday: d.Weekday,
                        Group: d.Group,
                        Hour: d.Hour,
                        Min: d.Min,
                        Element: d.Element
                    }]

                }

                //the 3 edge cases
                if (index_prev_from == index_prev_to) {
                    l = index_prev_from

                    d = data_day[l];
                    interval = [{
                        Timestamp: date_from,
                        element_ang: d.element_ang,
                        time_to_next: (new Date(date_to) - new Date(date_from)),
                        Week: d.Week,
                        Weekday: d.Weekday,
                        Group: d.Group,
                        Hour: d.Hour,
                        Min: d.Min,
                        Element: d.Element
                    }];
                    return interval;
                }

                //slice(a,b), including a-th element, excluding b-th element
                var temp = data_day.slice(index_prev_from + 1, index_prev_to);
                temp = temp.concat(prev_to);
                interval = prev_from.concat(temp);

                return interval;
            }

            /**
             * binary search to find the index of the instance d such that: d.Timestamp< = date
             * @param {} date 
             * @param {*} search_data 
             */
            function binary_search_time(date, search_data) {

                var l = 0;
                var r = search_data.length - 1;
                var m = Math.floor((r + l) / 2);

                while (Math.abs(l - r) > 1) {

                    if (search_data[m].Timestamp == date) {
                        return m;

                    } else if (search_data[m].Timestamp > date) {
                        r = m;
                    } else if (search_data[m].Timestamp < date) {
                        l = m;
                    }
                    m = Math.floor((r + l) / 2);

                }

                return l; //l < Timestamp < r

            }


            /**
             *2. DATA_GROUPED_PER_ANGLE
             * Have the whole inital data (data_snaps) grouped per angle: data_grouped_per_angle[i][j]
             * The i-th entry == i-th element
             * the j-th entry == all the instances (states) form data_snaps that have the i-th element positioned at the j-th angle (rounded)
             */
            var data_grouped_per_angle = [
                [],
                [],
                [],
                []
            ];
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 360; j++) {
                    data_grouped_per_angle[i].push([])
                }
            }

            //per element, per angle, store all datainstances form data_snaps_filtered in the corresponding entry,
            //where elment i was at angle d
            for (var j = 0; j < data_snaps_filtered.length; j++) {
                for (var i = 0; i < 4; i++) {
                    d = data_snaps_filtered[j].element_ang[i];
                    //Truncate angles outside the elements range
                    if (d > maxrange[i]) d = maxrange[i];
                    if (d < 0) d = 0;
                    data_grouped_per_angle[i][d].push(data_snaps_filtered[j]);

                }
            }



            //Initialize some arrays used later in update_dataset_inner()
            for (var i = 0; i < 4; i++) {
                union.push({
                    datas: [
                        [],
                        [],
                        [],
                        []
                    ]
                })
            }

            var dataset_outer_chart = [
                [],
                [],
                [],
                []
            ];
            var weekday_dataset_outer_chart = [];
            for (var i = 0; i < 4; i++) {
                weekday_dataset_outer_chart.push([
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ]);
            }

            /**
             * 3. initialize DATASET_INNER_CHART and DATASET_OUTER_CHART
             * Both are arrays of with each 4 entries of arrays of length 4 Math.floor(360 / grouping). The 4 entries represent the 4 sensorelements DW,DS,LA,LD (in that order).
             * The j-th entry of the i-th (0 to3) holds in its 'data' attribute all the data instances in data_grouped_by_angle, that has the i-th element on
             * a position between [angle*grouping,angle*grouping+grouping-1]. 
             *
             * The length of 'data' is also saved in (.val[0]), and represents the frequency of position changes.
             * The total duration the element was kept at that position is also saved ((.val[1]) == sum over all 'time to next' of the elmenets in .data),
             * and represents the duration of state. 
             * (Here by state I define the angle at which the 4 elments are positioned)
             * 
             * It also keeps track wheater the respective bar was 'clicked', in order to control the color of the bars.
             * 
             * ! 'val' entries do not keep any of the data instances directly. 
             * Those are only needed when calculating the new 'dataset_inner_chart'after updating the radial chart (ie after toggling a bar).
             *  
             * */

            //Initialize: Create dataset_inner_chart and dataset_outer_chart instances.
            var map_angles = angles.slice();
            //map_anlges is used to make sure selected bars are still selected after update (filter, grouping etc)

            for (var i = 0; i < 4; i++) {
                map_angles = angles[i].map(x => Math.floor(x / grouping));

                for (var k = 0; k < Math.floor(360 / grouping); k++) {
                    var cl = false;
                    if (map_angles.includes(k)) {
                        cl = true;
                    }
                    dataset_inner_chart[i].push({ angle: k, val: [0, 0], all_angles: [], clicked: cl, el: i });
                    dataset_outer_chart[i].push({ angle: k, val: [0, 0], clicked: cl, el: i });

                    for (var wkd = 0; wkd < 7; wkd++) {
                        weekday_dataset_outer_chart[i][wkd].push({ angle: k, val: [0, 0], clicked: cl, el: i });
                    }

                    for (var q = 0; q < grouping; q++) {

                        dataset_inner_chart[i][k].all_angles.push({ angle: k * grouping + q, val: [0, 0] });

                    }
                }
            }
            const reducer = (acc, curr) => acc + curr;
            var total_val = [ //used to calculate the relative value
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ];

            /**
             * Initzialize dataset outer_chart
             * Calculate the .val values per bar and angle (frequency and duration)
             * Calculate the total_val entries: It hold the sum over all freq and durations per element
             */
            for (var i = 0; i < 4; i++) { //element
                for (var j = 0; j < Math.floor(360 / grouping); j++) { //bar
                    for (var q = 0; q < grouping; q++) { //angle
                        c = data_grouped_per_angle[i][j * grouping + q].filter(x => x.Element == i);

                        c1 = c.length;
                        c2 = (data_grouped_per_angle[i][j * grouping + q].map(x => x.time_to_next)).reduce(reducer, 0);

                        dataset_outer_chart[i][j].val[0] += c1;
                        dataset_outer_chart[i][j].val[1] += c2;

                        total_val[i][0] += c1;
                        total_val[i][1] += c2;

                        //sepreatly: when representing 7 charts one below another
                        for (var wkd = 0; wkd < 7; wkd++) { //weekday
                            c1 = c.filter(x => x.Weekday == wd[wkd]).length;
                            c2 = (data_grouped_per_angle[i][j * grouping + q].filter(x => x.Weekday == wd[wkd]).map(x => x.time_to_next)).reduce(reducer, 0);

                            weekday_dataset_outer_chart[i][wkd][j].val[0] += c1;
                            weekday_dataset_outer_chart[i][wkd][j].val[1] += c2;

                        }

                    }
                }
            }


            var maxy = 0; //to keep track of the max val[scale], in case we want all 4 radial charts to be of same scale
            var max_wkd = [0, 0, 0, 0, 0, 0, 0];
            /**
             * Determine y-Scales for each of the 4 radial charts. 
             * Either they have same scale using maxy, or not.
             * The scales are stored in the array yScales. 
             * 
             * Do the same for the 4*7 separate charts, showing each weekday individually
             */
            for (var i = 0; i < 4; i++) {
                maxy = Math.max(maxy, d3.max(dataset_outer_chart[i], d => d.val[scale]))


            }
            var maxwkd = 0;
            for (var wkd = 0; wkd < 7; wkd++) {
                for (var i = 0; i < 4; i++) {
                    max_wkd[wkd] = Math.max(max_wkd[wkd], d3.max(weekday_dataset_outer_chart[i][wkd], d => d.val[scale]));
                }

                maxwkd = Math.max(max_wkd[wkd], maxwkd);
            }

            yScales = d3.scaleRadial()
                .range([innerRadius, outerRadius])
                .domain([0, maxy]);
            //.domain([0, d3.max(dataset_outer_chart[i], x => x.val[scale])]));
            yScales_weekday = d3.scaleRadial()
                .range([innerRadius_wkd, outerRadius_wkd])
                .domain([0, maxwkd]);



            //x scale.
            var x = d3.scaleBand()
                .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
                .align(0) // This does nothing
                .domain(dataset_outer_chart[0].map(function(d) { return d.angle; })); // The domain of the X axis are the angles (360deg).



            //4. draw each of the 4 charts
            circularBarChart(0, dataset_outer_chart[0], weekday_dataset_outer_chart[0], svg0, svg_wkd[0]); //Drehwand
            circularBarChart(1, dataset_outer_chart[1], weekday_dataset_outer_chart[1], svg1, svg_wkd[1]); //Drehschrank
            circularBarChart(2, dataset_outer_chart[2], weekday_dataset_outer_chart[2], svg2, svg_wkd[2]); //LampeAussenwand
            circularBarChart(3, dataset_outer_chart[3], weekday_dataset_outer_chart[3], svg3, svg_wkd[3]); //LampeDrehwand


            /**
             * This function draws the circular bar chart for the given element with the given dataset in the given canvas(svg)
             * @param {*int} index indicates which element we are dealing with [0: DW, 1: DS, 2: LA, 3: LD]
             * @param {*} dataset dataset for the outer histogram, storing angle, freq, clicked 
             * @param {*} dataset_weekday dataset for the outer histogram, storing angle, freq, clicked per weekday
             * @param {*} svg the svg to draw the bar chart
             * @param {*} svg:wkd_ the svg per weekday,to draw the bar chart
             */
            function circularBarChart(index, dataset, dataset_weekday, svg, svg_wkd_) {

                d3.selectAll('#reset' + index).on('click', updateData);
                /**
                 * function that deselects all bars of the given element at once.
                 */
                function updateData() {

                    removed = removed.concat(angles[index]);

                    for (var j = 0; j < angles[index].length; j++) {
                        var k_ = Math.floor(angles[index][j] / grouping)
                        dataset_outer_chart[index][k_].clicked = false;
                        d3.selectAll(".bar" + k_ + '_' + index).attr("fill", color[index]);
                    }

                    update_dataset_inner();
                    removed = [];
                    added = [];
                    angles[index] = [];
                    update_density_plot(dataset_inner_chart);
                    update_inner_chart(dataset_inner_chart);

                }

                //Axis
                var xAxis = g => g
                    .attr("text-anchor", "middle")
                    .call(g => g.selectAll("g")
                        .data(dataset)
                        .join("g")
                        .attr("transform", d => `
                  rotate(${((x(d.angle) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
                  translate(${innerRadius},0)`)
                        .call(g => g.append("line")
                            .attr("x2", -0.5)
                            .attr("stroke", "#000"))
                        .attr('stroke-width', '.5px')
                        .style('font-size', '10px'));

                var xAxis_wkd = g => g
                    .attr("text-anchor", "middle")
                    .call(g => g.selectAll("g")
                        .data(dataset)
                        .join("g")
                        .attr("transform", d => `
                      rotate(${((x(d.angle) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
                      translate(${innerRadius_wkd},0)`)
                        .call(g => g.append("line")
                            .attr("x2", -0.5)
                            .attr("stroke", "#000"))
                        .attr('stroke-width', '.5px')
                        .style('font-size', '10px'));

                //color of the base chart and the 'inner' chart
                var col = color[index];
                var com = complement[index];
                var down = false; //used in case multiple selection are done by keeping mouse down

                //The arc for the OUTER historam
                var mainarc = d3.arc()
                    .innerRadius(innerRadius) //the doughnut hole
                    .outerRadius(function(d) {
                        return yScales(d.val[scale]);
                    })
                    .startAngle(function(d) {
                        //rotate[index] gives value of how much to rotate the whole bar chart, such that the bars and positions of the elements in the image are aligned. 
                        // depends on grouping and may thus be a little off
                        return x((d.angle - Math.floor(rotate[index] / grouping) + Math.floor(360 / grouping)) % Math.floor(360 / grouping));
                    })
                    .endAngle(function(d) {
                        return x((d.angle + Math.floor(360 / grouping)) % Math.floor(360 / grouping)) + x.bandwidth();
                    })
                    .padAngle(0.002) //makes single bars differentiable from each other in the chart
                    .padRadius(innerRadius)

                var mainarc_wkd = d3.arc()
                    .innerRadius(innerRadius_wkd) //the doughnut hole
                    .outerRadius(function(d) {
                        return (yScales_weekday)(d.val[scale]);
                    })
                    .startAngle(function(d) {

                        return x((d.angle + Math.floor(360 / grouping)) % Math.floor(360 / grouping));
                    })
                    .endAngle(function(d) {
                        return x((d.angle + Math.floor(360 / grouping)) % Math.floor(360 / grouping)) + x.bandwidth();
                    })
                    .padAngle(0.001) //makes single bars differentiable from each other in the chart
                    .padRadius(innerRadius_wkd);

                // Add the bars for the weekdayly view
                for (var wkd = 0; wkd < 7; wkd++) {
                    var circletext = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
                    svg_wkd_[wkd].append("text")
                        .style("text-anchor", "middle")
                        .style('font-size', '8px')
                        .text(circletext[wkd]);


                    svg_wkd_[wkd]
                        .append("g")
                        .selectAll("path")
                        .data(dataset_weekday[wkd])
                        .enter()
                        .append("path")
                        .attr('id', elements[index] + 'bar')
                        .attr("fill", function(d) { if (d.clicked) { return com; } else { return col; } })
                        .attr("d", mainarc_wkd)
                        .attr("class", function(d, i) { return "bar" + i + '_' + index; })
                        .on('mouseover', function mouseover(d, i) {
                            divarr[index].style('display', 'inline');

                            r = (dataset[i].clicked) ? 'rgb(187, 103, 0)' : com; //pink
                            r2 = (dataset[i].clicked) ? darkest[index] : 'rgb(187, 103, 0)'

                            d3.selectAll('.bar' + i + '_in' + index).attr('fill', r2);
                            d3.selectAll('.bar' + i + '_' + index).attr('fill', r);

                            if (down) {
                                dataset[i].clicked = (dataset[i].clicked) ? false : true;
                                d3.select(this).attr("fill", function(d) {
                                    if (angles[index].includes(d.angle * grouping)) {
                                        //remove
                                        removed.push(d.angle * grouping)
                                        for (var j = 0; j < angles[index].length; j++) {
                                            if (angles[index][j] == d.angle * grouping) {
                                                angles[index].splice(j, 1);
                                            }
                                        }

                                    } else {
                                        added.push(d.angle * grouping)

                                        angles[index].push(d.angle * grouping);
                                    }

                                    return (dataset[i].clicked) ? com : col;


                                });
                            }
                        })
                        .on('click', function(d, i) {
                            dataset[i].clicked = (dataset[i].clicked) ? false : true; //toggle
                            //console.log('click')


                            /**depending on wheter elmement is clicked, change fill colour of the bar
                            also updated removed and added arrays, storing all removed and added angles since the last update of the chart
                            they either store a single value or multiple (when angles where chosen with mousedown)
                            One of the two must be empty
                            */

                            if (angles[index].includes(d.angle * grouping)) {
                                //remove
                                removed.push(d.angle * grouping);

                                for (var j = 0; j < angles[index].length; j++) {
                                    if (angles[index][j] == d.angle * grouping) {
                                        angles[index].splice(j, 1);
                                    }
                                }

                            } else {
                                angles[index].push(d.angle * grouping);
                                added.push(d.angle * grouping)
                            }


                            update_dataset_inner(); //update data to draw given added and removed  angles
                            update_inner_chart(dataset_inner_chart); //update the inner bar chart
                            update_density_plot(dataset_inner_chart); //draw chosen angle positions in the image

                            d3.select(this).attr("fill", function(d) {
                                return (dataset[i].clicked) ? com : col;
                            });

                        }).on('mousedown', function() {
                            down = true;
                            obj = this;
                        })
                        .on('mouseup', function(d) {
                            down = false;
                            if (this != obj) { //meaning we chose multiple elements with mousedown and it was NOT a click

                                update_dataset_inner(); //update data to draw given added and removed  angles
                                update_inner_chart(dataset_inner_chart); //update the inner bar chart
                                update_density_plot(dataset_inner_chart); //draw chosen angle positions in the image
                            }
                        })
                        .on("mouseout", function(d, i) {
                            r = (dataset[i].clicked) ? com : col //'rgb(187, 103, 0)' : com; //pink
                            r2 = darkcol[index]; //pink

                            d3.selectAll('.bar' + i + '_in' + index).attr('fill', r2);
                            d3.selectAll('.bar' + i + '_' + index).attr('fill', r);


                        })


                }

                //Add bars for the OUTER histogram
                //Remark. Only changes if filters change. But then we would re-run it all anyway
                svg.append("g")
                    .selectAll("path")
                    .data(dataset)
                    .enter()
                    .append("path")
                    .attr('id', elements[index] + 'bar')
                    .attr("fill", function(d) { if (d.clicked) { return com; } else { return col; } })
                    .attr("d", mainarc)
                    .attr("class", function(d, i) { return "bar" + i + '_' + index; })
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('click', function(d) {
                        d.clicked = (d.clicked) ? false : true; //toggle

                        /**depending on wheter elmement is clicked, change fill colour of the bar
                        also updated removed and added arrays, storing all removed and added angles since the last update of the chart
                        they either store a single value or multiple (when angles where chosen with mousedown)
                        One of the two must be empty
                        */
                        d3.select(this).attr("fill", function(d) {
                            // currentangle[index] = d.angle * grouping;
                            if (angles[index].includes(d.angle * grouping)) {
                                //remove
                                removed.push(d.angle * grouping);

                                for (var j = 0; j < angles[index].length; j++) {
                                    if (angles[index][j] == d.angle * grouping) {
                                        angles[index].splice(j, 1);
                                    }
                                }

                            } else {
                                angles[index].push(d.angle * grouping);
                                added.push(d.angle * grouping)
                            }
                            var a = (d.angle * grouping - offset[index])



                            update_dataset_inner(); //update data to include only data at angles of the clicked bars. 
                            update_inner_chart(dataset_inner_chart); //update the inner bar chart
                            update_density_plot(dataset_inner_chart); //draw chosen angle positions in the image


                            // //console.log(angles)
                            return (d.clicked) ? com : col;

                        });
                    }).on('mousedown', function() {
                        down = true; //marks if bars are chosen by keeping mouse down
                        obj = this; //remember with which bar one started. To be able to differentiate with 'click' event
                    })
                    .on('mouseup', function(d) {
                        down = false;
                        if (this != obj) { //meaning we chose multiple elements with mousedown and it was NOT a click

                            update_dataset_inner(); //update data to include only data at angles of the clicked bars. 
                            update_inner_chart(dataset_inner_chart); //update the inner bar chart
                            update_density_plot(dataset_inner_chart); //draw chosen angle positions in the image
                        }
                    })
                    .on("mouseout", function(d, i) {
                        r = (d.clicked) ? com : col //'rgb(187, 103, 0)' : com; //pink
                        r2 = darkcol[index]; //pink

                        d3.selectAll('.bar' + i + '_in' + index).attr('fill', r2);
                        d3.selectAll('.bar' + i + '_' + index).attr('fill', r);
                    })

                if (index < 2) {
                    svg.append("text")
                        .style("text-anchor", "middle")
                        .style('font-size', '11px')
                        .style('width', 20)
                        .text('Rotatable')
                        .append('tspan')
                        .attr('x', 0)
                        .attr('dy', '1.2em')
                        .append('tspan')
                        .text(elements_des[index]);
                } else {
                    svg.append("text")
                        .style("text-anchor", "middle")
                        .style('font-size', '11px')
                        .style('width', 20)
                        .text(elements_des[index])

                }
                //FIRST CALL: draw the inner chart. 
                added = added.concat(angles[index])
                update_dataset_inner(); //update data to include only data at angles of the clicked bars. 
                update_inner_chart(dataset_inner_chart); //update the inner bar chart
                update_density_plot(dataset_inner_chart); //draw chosen angle positions in the image

                //x axis
                svg.append('g').attr('id', 'xaxis').call(xAxis);
                for (var wkd = 0; wkd < 7; wkd++) {
                    svg_wkd_[wkd].append('g').attr('id', 'xaxis').call(xAxis_wkd);
                }


                /**
                 * 5.update DATASET_INNER_CHART  to be used to create inner radial barchart and density plot.
                 * The function is based on set operations 'union' and 'intersection' on the unique Timestamps of the data,
                 * already grouped together in data_grouped_per_angle.
                 * (Assumption:the probability that 2 or more sensor elements had exactly the same Timestamp (precision: millisec) is negligible)
                 */
                function update_dataset_inner() {

                    var j = 0;

                    //If one went over the same bar multiple times, while holing down the left mouse button, we need to remove duplicates
                    while (j < added.length) {
                        if (removed.indexOf(added[j]) != -1) {
                            removed.splice(removed.indexOf(added[j]), 1);
                            added.splice(j, 1);
                            j--;
                        }
                        j++;
                    }

                    //data_inner_updated: temp for dataset_inner_chart
                    var data_inner_updated = [
                        [],
                        [],
                        [],
                        []
                    ];


                    for (var i = 0; i < 4; i++) {
                        for (var k = 0; k < Math.floor(360 / grouping); k++) {

                            var _data = [];
                            for (var q = 0; q < grouping; q++) {
                                _data.push({ angle: k * grouping + q, val: [0, 0] });
                            }
                            data_inner_updated[i].push({ angle: k, val: [0, 0], data: _data, clicked: false, el: i });

                        }
                    }
                    //newunion,newintersection keep track of new sets. Used to speed up the overall intersection and union by getting rid of redundant op's
                    var newunion = [
                        [],
                        [],
                        [],
                        []
                    ];
                    var newintersection = [
                        [],
                        [],
                        [],
                        []
                    ];


                    //angles in added and removed given as normal angles [0,360], not multiple of grouping.
                    if (added.length != 0) { //angles added
                        /**
                         * HERE i == index !!!
                         * union[i].datas[0-3] has changed: The set of datainstances became bigger
                         * the updated union is simply the current + the new union
                         * 
                         * intersection[0-3] has changed: for intersection[j], union[i].datas[j] became bigger. 
                         *     
                         * i.e.  (u union, n intersection, A_i == union[i].datas[0] etc.)
                         * 
                         * Assume the union[i] = A[i]_i ,B_i, C_i, D_i was updated to 
                         * union_new[i] = A_i u A'_i ,B_i u B'_i, C_i u C'_i, D_i u D'_i
                         * 
                         * ie. union[i].datas[j] = union(union[i].datas[j], dataset_inner_chart) (*)[1.]
                         * 
                         * For i == 0 for example. 
                         * 
                         * Then the intersection[A] = A_0 n A_1 n A_2 n A_3 was changed to
                         * intersection_new[A] = (A_0 u A_0') n A_1 n A_2 n A_3
                         *  = (A_0  n A_1 n A_2 n A_3 ) u (A_0' n A_1 n A_2 n A_3)
                         *  = intersection[A] u  (A_0' n A_1 n A_2 n A_3)
                         * 
                         * ie. intersection[A]  = union(intersection[A], newintersection[A]) (*)
                         * 
                         * --> only calc (*)
                         * 
                         * Also since in this case, datanew can only become bigger, update datanew by updating freq manually
                         * 
                         */


                        //1. Initalize NEWUNION
                        for (var j = 0; j < added.length; j++) { //for every angle chosen for this element
                            for (var k = 0; k < 4; k++) { //union of data_per_angle per element[other[k]] of angles in array angles[i].
                                for (var q = 0; q < grouping; q++) {
                                    newunion[k] = arrayUnion(data_grouped_per_angle[index][added[j] + q], newunion[k]);
                                }
                            }
                        }

                        for (var i = 0; i < 4; i++) {
                            var notEmpty = [];
                            //only intersect sets that are not empty, else we get empty array.
                            for (var j = 0; j < 4; j++) {
                                if (j != index && (union[j].datas[i].length != 0)) {
                                    notEmpty.push(j);
                                }
                            }
                            notEmpty.push(index);

                            //calc newintersection
                            var len = notEmpty.length;
                            if (len == 1) {
                                newintersection[i] = (notEmpty[0] == index) ? newunion[i] : union[notEmpty[0]].datas[i];
                            } else if (len == 2) {
                                var a = (notEmpty[0] == index) ? newunion[i] : union[notEmpty[0]].datas[i];
                                var b = (notEmpty[1] == index) ? newunion[i] : union[notEmpty[1]].datas[i];

                                newintersection[i] = arrayInter(a, b);

                            } else if (len == 3) {
                                var a = (notEmpty[0] == index) ? newunion[i] : union[notEmpty[0]].datas[i];
                                var b = (notEmpty[1] == index) ? newunion[i] : union[notEmpty[1]].datas[i];
                                var c = arrayInter(a, b);
                                var d = (notEmpty[2] == index) ? newunion[i] : union[notEmpty[2]].datas[i];

                                newintersection[i] = arrayInter(c, d);
                            } else if (len == 4) {
                                var a = (notEmpty[0] == index) ? newunion[i] : union[notEmpty[0]].datas[i];
                                var b = (notEmpty[1] == index) ? newunion[i] : union[notEmpty[1]].datas[i];
                                var c = arrayInter(a, b);
                                var d = (notEmpty[2] == index) ? newunion[i] : union[notEmpty[2]].datas[i];
                                var e = (notEmpty[3] == index) ? newunion[i] : union[notEmpty[3]].datas[i];
                                var f = arrayInter(d, e);

                                newintersection[i] = arrayInter(c, f);
                            }
                        }
                        //updated union
                        for (var i = 0; i < 4; i++) {
                            union[index].datas[i] = arrayUnion(union[index].datas[i], newunion[i]);
                        }
                        //updated intersection
                        for (var i = 0; i < 4; i++) {
                            var t = angles[index].slice();
                            var min = arrayMinus(t, added);
                            if (min.length == 0) {
                                intersection[i] = newintersection[i];
                            } else {
                                intersection[i] = arrayUnion(intersection[i], newintersection[i]);
                            }
                        }

                    }

                    if (removed.length != 0) { //angles removed
                        /**
                         * HERE i == index !!!
                         * union[i].datas[0-3] has changed: The set of datainstances became smaller
                         * the updated union is simply the current |- the new union
                         * 
                         * intersection[0-3] has changed: for intersection[j], union[i].datas[j] became smaller. 
                         *     
                         * i.e.  (u union, n intersection, A_i == union[i].datas[0] etc.)
                         * 
                         * Assume the union[i] = A[i]_i ,B_i, C_i, D_i was updated to 
                         * union_new[i] = A_i \ A'_i ,B_i \ B'_i, C_i \ C'_i, D_i \ D'_i
                         * 
                         * ie. union[i].datas[j] = minus(union[i].datas[j],dataset_inner_chart) (*)[1.]
                         * 
                         * For i == 0 for example. 
                         * 
                         * Then the intersection[A] = A_0 n A_1 n A_2 n A_3 was changed to
                         * intersection_new[A] = (A_0 \ A_0') n A_1 n A_2 n A_3
                         *  = (A_0  n A_1 n A_2 n A_3 ) \ A_0' 
                         *  = intersection[A] \ A_0' 
                         * 
                         * ie. intersection[A]  = minus(intersection[A], newintersection[A]) (*)
                         * 
                         * --> only calc (*)
                         * 
                         * dataset_inner_chart
                         */

                        //1. Initalize NEWUNION
                        for (var j = 0; j < removed.length; j++) { //for every angle chosen for this element
                            for (var k = 0; k < 4; k++) { //union of data_per_angle per element[other[k]] of angles in array angles[i].
                                for (var q = 0; q < grouping; q++) {
                                    newunion[k] = arrayUnion(data_grouped_per_angle[index][removed[j] + q], newunion[k]);
                                }
                            }

                        }

                        //update union
                        for (var i = 0; i < 4; i++) {
                            union[index].datas[i] = arrayMinus(union[index].datas[i], newunion[i]);
                        }

                        //update intersection
                        for (var i = 0; i < 4; i++) {
                            var notEmpty = [];
                            //only intersect sets that are not empty, else we get empty array.
                            for (var j = 0; j < 4; j++) {
                                if (union[j].datas[i].length != 0) {
                                    notEmpty.push(j);
                                }
                            }

                            //calc intersection
                            var len = notEmpty.length;
                            if (len == 0) intersection[i] = []
                            if (len == 1) {
                                intersection[i] = union[notEmpty[0]].datas[i];
                            } else if (len == 2) {
                                var a = union[notEmpty[0]].datas[i];
                                var b = union[notEmpty[1]].datas[i];

                                intersection[i] = arrayInter(a, b);

                            } else if (len == 3) {
                                var a = union[notEmpty[0]].datas[i];
                                var b = union[notEmpty[1]].datas[i];
                                var c = arrayInter(a, b);
                                var d = union[notEmpty[2]].datas[i];

                                intersection[i] = arrayInter(c, d);
                            } else if (len == 4) {
                                var a = union[notEmpty[0]].datas[i];
                                var b = union[notEmpty[1]].datas[i];
                                var c = arrayInter(a, b);
                                var d = union[notEmpty[2]].datas[i];
                                var e = union[notEmpty[3]].datas[i];
                                var f = arrayInter(d, e);

                                intersection[i] = arrayInter(c, f);
                            }
                        }


                    }

                    //calculate new dataset_inner_chart
                    week_applies.map(function(d) {
                        d.freq = [0, 0]
                    });
                    wkap = week_applies.map(d => d.Week_Year);

                    for (var i = 0; i < 4; i++) {

                        /**take angle-is-at value to be the FROM value. round values */
                        for (var j = 0; j < intersection[i].length; j++) {
                            var k = intersection[i][j].element_ang[i];
                            var k_angle = Math.floor(k / grouping);
                            var ind = wkap.indexOf(intersection[i][j].Week);

                            if (intersection[i][j].Element == i) {

                                data_inner_updated[i][k_angle].val[0]++;

                            }
                            if (ind != -1) week_applies[ind].freq[0]++;
                            if (ind != -1) week_applies[ind].freq[1] += intersection[i][j].time_to_next;

                            data_inner_updated[i][k_angle].val[1] += intersection[i][j].time_to_next;
                            if (intersection[i][j].Element == i) data_inner_updated[i][k_angle].data[k - (k_angle * grouping)].val[0]++;
                            data_inner_updated[i][k_angle].data[k - (k_angle * grouping)].val[1] += intersection[i][j].time_to_next;

                        }
                    }

                    //call funtion to draw the percentage distribution bar chart
                    draw_freq_to_week_histo(scale);
                    //calculate new weekdays_data_inner_updated

                    weekdays_data_inner_updated = [];
                    for (var wkd = 0; wkd < 7; wkd++) {
                        weekdays_data_inner_updated.push([
                            [],
                            [],
                            [],
                            []
                        ])
                        for (var i = 0; i < 4; i++) {
                            for (var k = 0; k < Math.floor(360 / grouping); k++) {

                                weekdays_data_inner_updated[wkd][i].push({ angle: k, val: [0, 0], data: [], clicked: false, el: i });

                                for (var q = 0; q < grouping; q++) {
                                    weekdays_data_inner_updated[wkd][i][k].data.push({ angle: k * grouping + q, val: [0, 0] });
                                }
                            }
                        }
                        for (var i = 0; i < 4; i++) {
                            /**take angle-is-at value to be the FROM value. round values */
                            for (var j = 0; j < intersection[i].length; j++) {
                                if (dw[intersection[i][j].Weekday] == wkd) {
                                    var k = intersection[i][j].element_ang[i];
                                    var k_angle = Math.floor(k / grouping);

                                    if (intersection[i][j].Element == i) weekdays_data_inner_updated[wkd][i][k_angle].val[0]++;
                                    weekdays_data_inner_updated[wkd][i][k_angle].val[1] += intersection[i][j].time_to_next;

                                    if (intersection[i][j].Element == i) weekdays_data_inner_updated[wkd][i][k_angle].data[k - (k_angle * grouping)].val[0]++;
                                    weekdays_data_inner_updated[wkd][i][k_angle].data[k - (k_angle * grouping)].val[1] += intersection[i][j].time_to_next;
                                }

                            }



                        }
                    }

                    dataset_inner_chart = data_inner_updated;


                }
                /**
                 * Set operations are based on the Timestamps
                 */

                /**
                 * arr1 + arr2 resp. A u B, keeping eliminating duplicates
                 * @param {*} arr1 
                 * @param {*} arr2 
                 */
                function arrayUnion(arr1, arr2) { // no duplicates
                    var a = arr1.concat(arr2);
                    a.sort(function(x, y) {
                        return x.Timestamp - y.Timestamp;
                    })

                    return a;
                }
                /**
                 * arr1-arr2 resp A\B with duplicates
                 * @param {} arr1 
                 * @param {*} arr2 
                 */
                function arrayMinus(arr1, arr2) {
                    if (arr1.length == 0) return arr1;
                    if (arr2.length == 0) return arr1;


                    var minus = arr1.filter(x => !arr2.includes(x))
                    return minus;

                }

                /**
                 * arr1 n arr2 resp AnB with duplicates
                 * @param {*} arr1 
                 * @param {*} arr2 
                 */
                function arrayInter(arr1, arr2) {
                    if (arr1.length < arr2.length) {
                        a = arr1;
                        b = arr2;
                    } else {
                        a = arr2;
                        b = arr1;
                    }
                    var array_Timestamps = b.map(x => x.Timestamp);
                    var filtered_array_intersection = a.filter(x => array_Timestamps.includes(x.Timestamp));

                    return filtered_array_intersection
                }



                //tooltip
                function mouseover(d, i) {
                    divarr[index].style('display', 'inline');

                    r = (d.clicked) ? 'rgb(187, 103, 0)' : com; //pink
                    r2 = (d.clicked) ? darkest[index] : 'rgb(187, 103, 0)'

                    d3.selectAll('.bar' + i + '_in' + index).attr('fill', r2);
                    d3.selectAll('.bar' + i + '_' + index).attr('fill', r);


                    if (down) {
                        d.clicked = (d.clicked) ? false : true;
                        d3.select(this).attr("fill", function(d) {
                            currentangle[index] = d.angle * grouping;
                            if (angles[index].includes(d.angle * grouping)) {
                                //remove
                                removed.push(d.angle * grouping)
                                for (var j = 0; j < angles[index].length; j++) {
                                    if (angles[index][j] == d.angle * grouping) {
                                        angles[index].splice(j, 1);
                                    }
                                }

                            } else {
                                added.push(d.angle * grouping)

                                angles[index].push(d.angle * grouping);
                            }
                            var a = (d.angle * grouping - offset[index])
                            if (index == 0) {
                                document.querySelectorAll(['.DW-5', '#circleDW']).forEach(el => el.style.transform = 'rotate(' + a + 'deg)');


                            } else if (index == 1) {
                                document.querySelectorAll(['.DS-7', '.DS-8', '.DS-9', '#circleDS']).forEach(el => el.style.transform = 'rotate(' + a + 'deg)');


                            } else if (index == 2) {
                                document.querySelectorAll(['.LA-6', '#circleLA']).forEach(el => el.style.transform = 'rotate(' + a + 'deg)');

                            } else {
                                document.querySelectorAll(['.LD-6', '#circleLD']).forEach(el => el.style.transform = 'rotate(' + a + 'deg)');

                            }

                            return (d.clicked) ? com : col;


                        });
                    }
                }
                //updae tooltip shown belown the corresponding radial histogram
                function mousemove() {
                    var d = d3.select(this).data()[0];
                    document.getElementById(elements[index] + "div").innerHTML = (((scale == 0) ? 'Frequency ' : 'Duration ') + 'at Angle: ' + (d.angle * grouping) + '-' + (d.angle * (grouping) + grouping) +
                        '<br>' + 'Outer: ' + getTimeString(scale, dataset[d.angle].val[scale]) +
                        '<br>' + 'Inner: ' + getTimeString(scale, dataset_inner_chart[index][d.angle].val[scale]))

                }

                /**
                 * function return text to be displayed in the tooltip for the given bar
                 * @param {*} scale determines wether to return just an int or a string in a time format
                 * @param {*} x the value for a bar
                 */
                function getTimeString(scale, x) {
                    if (scale == 1) {
                        sec = 1000;
                        min = 60000;
                        hour = 60 * min;
                        day = 24 * hour;

                        t = x;
                        // d = Math.floor(t / day);
                        // t = t - d * day;
                        h = Math.floor(t / hour);
                        t = t - h * hour;
                        m = Math.floor(t / min);
                        t = t - m * min;
                        s = Math.floor(t / sec);
                        ms = t - s * sec;
                        return h + 'h ' + m + 'm ' + s + 's '
                    }
                    return x

                }
                /**
                 * update/draw inner bar chart with given dataset
                 * @param {*} dataset_inner_chart 
                 */
                function update_inner_chart(dataset_inner_chart) {


                    for (var k = 0; k < 4; k++) d3.selectAll('#temp' + k).remove();

                    var svgarr = [svg0, svg1, svg2, svg3];

                    for (var jindex = 0; jindex < 4; jindex++) {
                        var k = jindex;
                        var kd = darkcol[k];

                        // arc of the inner histogram
                        var arc = d3.arc() // imagine your doing a part of a donut plot
                            .innerRadius(innerRadius)
                            .outerRadius(function(d) {
                                return yScales(d.val[scale]);
                            })
                            .startAngle(function(d, i) { return x((d.angle + Math.floor(360 / grouping)) % Math.floor(360 / grouping)); })
                            .endAngle(function(d, i) { return x((d.angle + Math.floor(360 / grouping)) % Math.floor(360 / grouping)) + x.bandwidth(); })
                            .padAngle(0.001)
                            .padRadius(innerRadius)

                        svgarr[k]
                            .append("g")
                            .attr('id', 'temp' + k)
                            .selectAll("path")
                            .data(dataset_inner_chart[k])
                            .enter()
                            .append("path")
                            .attr("fill", darkcol[k])
                            .attr("d", arc)
                            .attr("class", function(d, i) { return "bar" + d.angle + '_in' + k; })

                        //for the weekdayly view
                        for (var wkd = 0; wkd < 7; wkd++) {

                            var arc_wkd = d3.arc() // imagine your doing a part of a donut plot
                                .innerRadius(innerRadius_wkd)
                                .outerRadius(function(d) {
                                    return yScales_weekday(d.val[scale]);
                                })
                                .startAngle(function(d, i) { return x((d.angle + Math.floor(360 / grouping)) % Math.floor(360 / grouping)); })
                                .endAngle(function(d, i) { return x((d.angle + Math.floor(360 / grouping)) % Math.floor(360 / grouping)) + x.bandwidth(); })
                                .padAngle(0.001)
                                .padRadius(innerRadius_wkd)

                            svg_wkd[k][wkd]
                                .append("g")
                                .attr('id', 'temp' + k)
                                .selectAll("path")
                                .data(weekdays_data_inner_updated[wkd][k])
                                .enter()
                                .append("path")
                                .attr("fill", darkcol[k])
                                .attr("d", arc_wkd)
                                .attr("class", function(d, i) { return "bar" + d.angle + '_in' + k; })


                        }
                    }
                }


                /**
                 * update/draw spatial mapping of probability distribution for the given inner histogram dataset.
                 * For each data element in dataset_inner_chart, draw one corresponding element and give it the opacity depending on 'freq' value.
                 * @param {} dataset_inner_chart 
                 */
                function update_density_plot(dataset_inner_chart) {
                    var draw_data = [dataset_inner_chart[0].filter(x => x.val[scale] != 0),
                        dataset_inner_chart[1].filter(x => x.val[scale] != 0), dataset_inner_chart[2].filter(x => x.val[scale] != 0), dataset_inner_chart[3].filter(x => x.val[scale] != 0)
                    ];


                    /**
                     * For each element i DW,DS,LA,LD
                     * then order dataset according to value (freq or duration). 
                     * Then draw the elments in the given order(max val first per group)
                     * (but first remove previously drawn elements)
                     */

                    //DW 
                    d3.selectAll('.DW-lines').remove();
                    order = []
                    maxf = 0;
                    for (var j = 0; j < draw_data[0].length; j++) {
                        for (var i = 0; i < grouping; i++) {
                            maxf = Math.max(maxf, draw_data[0][j].data[i].val[scale]);
                            order.push({ val: draw_data[0][j].data[i].val[scale], pos: j, pos2: i })

                        }
                    }
                    maxf += 20
                    var i = 0;
                    for (var k = 0; k < order.length; k++) {

                        j = order[k].pos
                        i = order[k].pos2
                        d3.selectAll('#Ebene_1')
                            .append('svg')
                            .attr('width', 800)
                            .attr('height', 800)
                            .append('rect')
                            .attr('class', 'DW-lines')
                            .attr('id', 'DW' + i + '_' + j)
                            .attr("width", 4.53)
                            .attr("height", 161.57)
                            .style('opacity', alpha(draw_data[0][j].data[i].val[scale], maxf, 0)) // draw_data[0][j].data[i].val[scale] / (data_freq[0][draw_data[0][j].data[i].angle].val[scale] + 10))
                            .attr('transform', 'translate(549.28,333.47) rotate(52.7)')
                            .attr('transform', 'translate(453.737 364.794) rotate(' + (draw_data[0][j].data[i].angle - 209) + ',2.263, 42.486)')

                    }

                    //DS
                    d3.selectAll('.DS-lines').remove();

                    maxf = 0;
                    order = []
                    for (var j = 0; j < draw_data[1].length; j++) {
                        for (var i = 0; i < grouping; i++) {
                            maxf = Math.max(maxf, draw_data[1][j].data[i].val[scale]);
                            order.push({ val: draw_data[1][j].data[i].val[scale], pos: j, pos2: i })
                        }
                    }
                    order.sort(function(a, b) {
                        return a.val - b.val;
                    })
                    for (var k = 0; k < order.length; k++) {

                        j = order[k].pos
                        i = order[k].pos2

                        if (draw_data[1][j].data[i].val[scale] != 0) {
                            d3.selectAll('#Ebene_1')
                                .append('svg')
                                .attr('width', 800)
                                .attr('height', 800)
                                .append('rect')
                                .attr('class', 'DS-lines')
                                .attr('id', 'DS' + i + '_' + j)
                                .attr("width", 34.55)
                                .attr("height", 68.03)
                                .style('opacity', alpha(draw_data[1][j].data[i].val[scale], maxf, 1)) //(data_freq[0][draw_data[0][j].data[i].angle].val[scale]))
                                .attr('transform', 'translate(515 501.1) rotate(' + (draw_data[1][j].data[i].angle + 77) + ' ,30.37, 3.95)')



                        }
                    }

                    //LA
                    d3.selectAll('.LA-lines_bulb').remove();
                    d3.selectAll('.LA-lines_rect1').remove();
                    d3.selectAll('.LA-lines_rect2').remove();
                    d3.selectAll('.LA-lines_rect3').remove();

                    order = []

                    maxf = 0;
                    for (var j = 0; j < draw_data[2].length; j++) {
                        for (var i = 0; i < grouping; i++) {
                            maxf = Math.max(draw_data[2][j].data[i].val[scale], maxf);
                            order.push({ val: draw_data[2][j].data[i].val[scale], pos: j, pos2: i })

                        }
                    }
                    for (var k = 0; k < order.length; k++) {

                        j = order[k].pos
                        i = order[k].pos2

                        if (draw_data[2][j].data[i].val[scale] != 0) {


                            d3.selectAll('#Ebene_1')
                                .append('g')
                                .append('circle')
                                .attr('class', 'LA-lines_bulb')
                                .attr('id', 'LA' + i + '_' + j)
                                .attr("cx", 766.46)
                                .attr("cy", 439.282)
                                .attr("r", 4)
                                .attr('transform', 'translate(-39.25,-8.7) rotate(' + (draw_data[2][j].data[i].angle - 91.7) + ',37.25,8.7)')
                                //.attr('transform', 'translate(-35.5,-8.0589) rotate(' + (0) + ',33.5,8.0589)')
                                .style('stroke', 'none')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf, 2))

                            d3.selectAll('#Ebene_1')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LA-lines_rect1')
                                .attr('id', 'LA' + i + '_rect1' + j)
                                .attr('x', 762.14)
                                .attr('y', 447.36)
                                .attr("width", 0.7)
                                .attr("height", 82.4789) //+1
                                .attr('transform', 'translate(-35.25,-8.0589) rotate(' + (draw_data[2][j].data[i].angle - 91.7) + ',33.25,8.0589)')
                                //.attr('transform', 'translate(-35.5,-8.0589) rotate(' + (0) + ',33.5,8.0589)')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf, 2))




                            d3.selectAll('#Ebene_1')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LA-lines_rect2')
                                .attr('id', 'LA' + i + '_rect2' + j)
                                .attr('x', 763.78)
                                .attr('y', 442.25)
                                .attr("width", 2)
                                .attr("height", 4.314)
                                .attr('transform', 'translate(-37.5,-7.5) rotate(' + (draw_data[2][j].data[i].angle - 91.7) + ',35.5,7.5)')
                                // .attr('transform', 'translate(-37.65,-7.5) rotate(' + (0) + ',35.65,7.5)') //kk
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf, 2))


                            d3.selectAll('#Ebene_1')
                                .append('svg')
                                .attr('width', 800)
                                .attr('height', 800)
                                .append('rect')
                                .attr('class', 'LA-lines_rect3')
                                .attr('id', 'LA' + i + '_' + j)
                                .attr('x', 757.91)
                                .attr('y', 454.53)
                                .attr("width", 1.11558 / 3)
                                .attr("height", 2.61228)
                                // .attr('transform', 'translate(-32.18,-8.5) rotate(' + (0) + ',30.18,8.5)')
                                .attr('transform', 'translate(-31.78,-6.6) rotate(' + ((draw_data[2][j].data[i].angle - 91.7)) + ',29.78,6.6)')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf, 2))









                        }

                    }

                    //LD
                    order = []
                    d3.selectAll('.LD-lines_bulb').remove();
                    d3.selectAll('.LD-lines_rect1').remove();
                    d3.selectAll('.LD-lines_rect2').remove();
                    d3.selectAll('.LD-lines_rect3').remove();
                    maxf = 0;
                    for (var j = 0; j < draw_data[3].length; j++) {
                        for (var i = 0; i < grouping; i++) {
                            maxf = Math.max(draw_data[3][j].data[i].val[scale], maxf);
                            order.push({ val: draw_data[3][j].data[i].val[scale], pos: j, pos2: i })

                        }
                    }

                    for (var k = 0; k < order.length; k++) {

                        j = order[k].pos
                        i = order[k].pos2
                        if (draw_data[3][j].data[i].val[scale] != 0) {

                            d3.selectAll('#Ebene_1')
                                .append('g')
                                .append('circle')
                                .attr('class', 'LD-lines_bulb')
                                .attr('id', 'LD' + i + '_' + j)
                                .attr("cx", 548)
                                .attr("cy", 407.2)
                                .attr("r", 4)
                                // .attr('transform', 'translate(-39.25,-8.7) rotate(' + (draw_data[3][j].data[i].angle ) + ',37.25,8.7)')
                                .attr('transform', 'translate(0.01,-0.1) rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.9) + ',0,0.1)')
                                .style('stroke', 'none')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf, 3))

                            d3.selectAll('#Ebene_1')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LD-lines_rect1')
                                .attr('id', 'LD' + i + '_rect1' + j)
                                .attr('x', 457.8)
                                .attr('y', 407.03)
                                .attr("height", 0.7)
                                .attr("width", 81.4789) //+1
                                .attr('transform', 'translate(0.3,0.25) rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.5) + ',-0.3,-0.25)')
                                // .attr('transform', 'translate(0,-0.35)') // rotate(' + (-170) + ',0,-0.35)')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf, 3))


                            d3.selectAll('#Ebene_1')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LD-lines_rect2')
                                .attr('id', 'LD' + i + '_rect2' + j)
                                .attr('x', 544.5 - 4.8)
                                .attr('y', 415.05 - 8.85)
                                .attr("height", 2)
                                .attr("width", 4.214)
                                .attr('transform', 'translate(0.0,0.6) rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.4) + ',0.0,-0.6)')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf, 3))


                            d3.selectAll('#Ebene_1')
                                .append('svg')
                                .attr('width', 800)
                                .attr('height', 800)
                                .append('rect')
                                .attr('class', 'LD-lines_rect3')
                                .attr('id', 'LD' + i + '_' + j)
                                .attr('x', 525.15)
                                .attr('y', 413.09 - 7)
                                .attr("height", 1.11558 / 3)
                                .attr("width", 2.61228)
                                .attr('transform', 'translate(0.15,' + (1.11558 / 6) + ') rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.75) + ',-0.1,' + (-1.11558 / 6) + ')')
                                //   .attr('transform', 'translate(0,-7) ') //rotate(' + (-170) + ',30.18,8.5)')
                                //  .attr('transform', 'translate(1,-1) rotate(' + ((draw_data[3][j].data[i].angle) - offset[3] + 6.5) + ',0,-1)')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf, 3))

                        }


                    }


                }

                /** 
                 * We wand to keep chosen bars as chosen. after changing grouping. 
                 * Depending on wether new grouping size is bigger or smaller, new bars need to be  clicked / un-clicked
                 * --> Therefore adjust angles chosen to the given 'grouping' size
                 * and update the corresponding dataset_inner
                 * 
                 * But do it in order ie. element 0,1,2,3
                 * and only when all elements done, update charts and density plot (so no redundant computation done)
                 * @param {int} l index of elment
                 */
                function adjust(l) {
                    if (g_updated[l]) {


                        newangles = [];
                        for (var j = 0; j < angles[l].length; j++) {
                            a = angles[l][j];
                            for (var q = 0; q < grouping_before; q++) {
                                c = Math.floor((a + q) / grouping);
                                b = c * grouping;
                                if (newangles.indexOf(b) == -1) {
                                    newangles.push(b);

                                    dataset_inner_chart[l][c].clicked = true;
                                    dataset_outer_chart[l][c].clicked = true;

                                    d3.selectAll('.bar' + c + '_' + l).attr('fill', 'orange'); //!
                                }

                            }

                        }

                        angles[l] = newangles;

                        update_dataset_inner();
                        g_updated[l] = false;
                        return true;
                    }
                    return false;

                }
                var adjustAngles0 = new Promise((resolve, reject) => resolve(adjust(0)));
                var adjustAngles1 = new Promise((resolve, reject) => resolve(adjust(1)));
                var adjustAngles2 = new Promise((resolve, reject) => resolve(adjust(2)));
                var adjustAngles3 = new Promise((resolve, reject) => resolve(adjust(3)));

                Promise.all([adjustAngles0, adjustAngles1, adjustAngles2, adjustAngles3]).then(function(done) {

                    update_inner_chart(dataset_inner_chart);
                    update_density_plot(dataset_inner_chart)

                });

            }


        }

    });

}
/**
 * Calculates ocacity for a rotational element given a value (bar height) and over all maximal value over all bars.
 * The probability distribution is different for each element, and depends on the widht of the element. Lamps have slightly higher
 * opacity than the wall and especially the closet.
 * @param {int} a value (freq or duraiton) at some angle (bar)
 * @param {*} max overall maximal value over all angles(bars)
 * @param {*} index (the element) 
 */
function alpha(a, max, index) {
    var as;
    if (index == 1) {
        as = (1 - Math.pow(0.6, 1 / max));

    } else if (index > 1) {
        as = (1 - Math.pow(0.2, 1 / max));
    } else {
        as = (1 - Math.pow(0.3, 1 / max));
    }
    return 1 - Math.pow((1 - as), a)
}