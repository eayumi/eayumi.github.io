/**
 * It does three things:
 * 1. draw the radial histograms (odd bar position == group 1 ,even bar postistion == group 2)
 * 2. draws elements in the spatial mapping
 * 3. calls function to draw the percentage barcharts.
 * 
 * Most importantly, it calculates the data for the inner and outer histogra.
 * Every state of the Mock-up can be defined by the angles of the four rotational elements and the timestamp the 
 * state was achieved. 
 * The calculation of the dataset of the inner histogram depends on union/intersection/difference of the set of states based on the different states of the elements. 
 * 
 * Any variables etc. for the two separate groups have suffix '_g1' and '_g2'. 
 * The class and id names for the two separate groups are appended by _left and _right for group 1 and group 2 respectively.
 * 
 * The 'index' always indicates the current element. This can be checked by looking at the elements array.
 */

//The four rotational elements. 
const elements = ['drehwand', 'drehschrank', 'lampeAussenwand', 'lampeDrehwand']; //for identifying divs.
const elements_des = ['Wall', 'Closet', 'Lamp B', 'Lamp A ']; //for titles.//['Drehwand', 'Drehschrank', 'Aussenwand', 'Drehwand']; //for titles.

const color = ['red', 'green', 'rgb(0, 47, 255)', 'purple'] //the colors associated with the element at the same index.
var angles = [ //this array hold all angles that are selected for the element at the same index.
    [],
    [],
    [],
    []
];
var total_val = [ //used to compute percentage, holds the sum of all values (freq and duration ) for the element at the same index.
    [],
    [],
    [],
    []
];
var currentangle = [0, 0, 0, 0];
const complement = ['orange', 'orange', 'orange', 'orange']; //colour of outer bar, when selected or hovering over not-selected bars
const darkcol = ['rgb(88, 0, 0)', 'rgb(0, 66, 0)', 'rgb(2, 0, 99)', 'rgb(58, 0, 58)']; //colour of inner bar of bars 
const darkest = ['rgb(58, 0, 0)', 'rgb(0, 39, 0)', 'rgb(1, 0, 41)', 'rgb(29, 0, 29)']; //colour of inner bar when it is selected hovering over it

const wd = { '0': 'Mon', '1': 'Tue', '2': 'Wed', '3': 'Thu', '4': 'Fri', '5': 'Sat', '6': 'Sun' };

const plus = [0, 0, 0, 0] //[3, 4, 2, 5];

const offset = [79, 103, 117, 200]; //align 0-degree of the radial histograms with that in the floor plan in the spatial mapping
var rotate = [0, 0, 0, 0];

var obj; //used to differentiate mouseup event caused  by click or after multiple selections through mousedown

var dataset_inner_chart = [ //the data for the inner histogram.  for each element, it holds for each angle, the frequency and duration the element was at that angle
    [],
    [],
    [],
    []
];
var union = [ //used for calcuating dataset_inner. (per group one entry)
    [],
    []
];
var intersection = [ //used for calcuating dataset_inner. (per group and per element )
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
    ]
];

var added = []; //all angles added since last update to the inner histogram
var removed = []; //all angles removed since last update to the inner histogram

const margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = window.innerWidth / 4 - 10 - margin.left - margin.right,
    height = window.innerWidth / 4 - 10 - margin.top - margin.bottom,
    innerRadius = 45,
    outerRadius = Math.min(width, height) / 2; // the outerRadius goes from the middle of the SVG area to the border

const shift_left = 0;
var yScales = []; //hold all y scales
//svgI, I= index of the element, svg containing the radial histogram
const svg0 = d3.selectAll("#" + elements[0])
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + ((width / 2 + margin.left)) + "," + (height / 2 + margin.top) + ")");

const svg1 = d3.selectAll("#" + elements[1])
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + ((width / 2 + margin.left)) + "," + (height / 2 + margin.top) + ")");

const svg2 = d3.selectAll("#" + elements[2])
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + ((width / 2 + margin.left)) + "," + (height / 2 + margin.top) + ")");

const svg3 = d3.selectAll("#" + elements[3])
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

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
        '<br>' + 'Outer: (-, -)' +
        '<br>' + 'Inner: (-, -)')
}

//tectures for the second bars (for group 2)
var texture_inner = textures.paths() //tecture of inner bars
    .d("hexagons")
    .size(0.6)
    .strokeWidth(0.3)
    .background('white')

var texture_g2 = textures.paths() //texture of inner bars
    .d("hexagons")
    .size(0.6)
    .strokeWidth(0.3)
    .stroke("white");

var texture_g2_darkorange = textures.paths() //textue of bars when selected and hovering above it
    .d("hexagons")
    .size(0.6)
    .strokeWidth(0.3)
    .stroke('white')
    .background('rgb(187, 103, 0)');

var texture_g2_inner_darkorange = textures.paths() //texture of inner bars when selected and hovering above it
    .d("hexagons")
    .size(0.6)
    .strokeWidth(0.3)
    .background('white')
    .stroke('rgb(187, 103, 0)');
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
var texture_g2_com = []; //holds textures for selected bars per element (orange)
var texture_g2_col = []; //holds textures for not-selected bars per element
var texture_g2_inner = []; //holds textures for inner bars per element


var grouping = 8; //bucket size
var grouping_before = 8; //previous bucket size
var scale = 0; // It defines which values to use for the bars, spatial mapping and percentage barchart. [0 == frequency, 1 == duration].
var referenceType = 0; //It defines which scale to use for the bars. [0: absloute, 1: relative] 
const NRGROUPS = 2;

var weekdays = []; //weekdays to filter for
var weeks = []; //weeks to filter for
var groups = []; //test-subject (single or pairs) to filer for
var age = []; //age ranges to filter for
var times = []; //time interval to filter for

var timeinput = d3.timeFormat('%H:%M'); //time format for the value set by the time-interval filter

const divarr_comp = [div0, div1, div2, div3];
//the filters set for both groups (global-filter-comparison)
//order: Weekdays, Week, Group,TimeFrom,TimeTo
var glb_filter_comp = [
    [
        [], -1, -1, -1, -1
    ],
    [
        [], -1, -1, -1, -1
    ]
];
//maxrange of the corresponding elements
const maxrange = [237, 186, 157, 320];

/**
 *  
 * Initializes the textures, draws elements at 0 degrees, filters data and calls re-initialize, 
 * ultimately initializing several arrays and calling the function to draw the radial histograms
 */
function radial_comparison() {

    //1. Read in data_snaps, containing all states of the Mockup
    d3.json('../data/data_snaps_densityPlot.json').then(function(data_snaps) {

        //2. draws elements at 0 degrees in the floor plan
        document.querySelectorAll(['.DW-5_left', '.DW-5_right']).forEach(el => el.style.transform = 'rotate(' + (-offset[0]) + 'deg)');
        document.querySelectorAll(['.DS-7_left', '.DS-8_left', '.DS-9_left', '.DS-7_right', '.DS-8_right', '.DS-9_right']).forEach(el => el.style.transform = 'rotate(' + (-offset[1]) + 'deg)');
        document.querySelectorAll(['.LA-6_left', '.LA-6_right']).forEach(el => el.style.transform = 'rotate(' + (-offset[2]) + 'deg)');
        document.querySelectorAll(['.LD-6_left', '.LD-6_right']).forEach(el => el.style.transform = 'rotate(' + (-offset[3]) + 'deg)');

        //3. initialize textures with the appropriate colours
        for (var i = 0; i < 4; i++) {
            texture_g2_inner.push(textures.paths()
                .d("hexagons")
                .size(0.6)
                .strokeWidth(0.3)
                .stroke(darkcol[i])
                .background('white')
            )
            texture_g2_col.push(textures.paths()
                .d("hexagons")
                .size(0.6)
                .strokeWidth(0.3)
                .stroke("white")
                .background(color[i]))

            texture_g2_com.push(textures.paths()
                .d("hexagons")
                .size(0.6)
                .strokeWidth(0.3)
                .stroke("white")
                .background(complement[i]))
        }


        //4. Coupling function, that filters (for the current filters set) the data of the differnt visualizations in the main view and updates them.
        filter_data_comp();

        //5. Initzializes array and draws the 4 radial charts. one each for the sensorelmenets, by callin draw_comparison_radial_charts(grouping, [false, false, false, false]);
        reInitialize(false); //flase indicates, that bucket size was not changed

        /**
         * Update filter values on change
         * 
         */
        //TIME INTERVAL FILTERS: capture times set and save in the given variables, everytime it is changed
        var from_time_g1, to_time_g1 = -1;
        var from_time_g2, to_time_g2 = -1;

        //get current from_time_ val for g1 and g2. set as -1 if none is to chosen or if values are illegal
        document.getElementById('input_time_from_g1').addEventListener("input", function() {
            from_time_g1 = '2019-09-11 ' + document.getElementById("input_time_from_g1").value + ':00';
            from_time_g1 = new Date(from_time_g1)

            if (to_time_g1 != -1 && to_time_g1 < from_time_g1) {
                d3.select('#input_time_to_g1').style('background-color', '#ffdddd')
                glb_filter_comp[0][3] = -1;
            } else {
                d3.select('#input_time_to_g1').style('background-color', 'white');

                inp = document.getElementById("input_time_from_g1").value
                glb_filter_comp[0][3] = (inp == '00:00') ? -1 : inp;

                if (inp.substring(0, 2) == '--') glb_filter_comp[0][3] = -1;
                if (inp.substring(3, 5) == '--') glb_filter_comp[0][3] = -1;

            }
        });
        document.getElementById('input_time_from_g2').addEventListener("input", function(event) {
            from_time_g2 = '2019-09-11 ' + document.getElementById("input_time_from_g2").value + ':00';
            from_time_g2 = new Date(from_time_g2);


            if (to_time_g2 != -1 && to_time_g2 < from_time_g2) {
                d3.select('#input_time_to_g2').style('background-color', '#ffdddd')
                glb_filter_comp[1][3] = -1;
            } else {
                d3.select('#input_time_to_g2').style('background-color', 'white');

                inp = document.getElementById("input_time_from_g2").value
                glb_filter_comp[1][3] = (inp == '00:00') ? -1 : inp;

                if (inp.substring(0, 2) == '--') glb_filter_comp[1][3] = -1;
                if (inp.substring(3, 5) == '--') glb_filter_comp[1][3] = -1;


            }
        });
        //get current to_time_ val for g1 and g2. set as -1 if none is chosen or if values are illegal
        document.getElementById('input_time_to_g1').addEventListener("input", function(event) {
            to_time_g1 = '2019-09-11 ' + document.getElementById("input_time_to_g1").value + ':00';

            to_time_g1 = new Date(to_time_g1);

            if (to_time_g1 < from_time_g1) {
                d3.select(this).style('background-color', '#ffdddd');
                glb_filter_comp[0][4] = (inp == '23:59') ? -1 : inp;
            } else {
                d3.select(this).style('background-color', 'white');
                inp = document.getElementById("input_time_to_g1").value
                glb_filter_comp[0][4] = (inp == '23:59') ? -1 : inp;

            }

        });
        document.getElementById('input_time_to_g2').addEventListener("input", function(event) {
            to_time_g2 = '2019-09-11 ' + document.getElementById("input_time_to_g2").value + ':00';

            to_time_g2 = new Date(to_time_g2);

            if (to_time_g2 < from_time_g2) {
                d3.select(this).style('background-color', '#ffdddd');
                glb_filter_comp[1][4] = -1;
            } else {
                d3.select(this).style('background-color', 'white');
                inp = document.getElementById("input_time_to_g2").value;
                glb_filter_comp[1][4] = (inp == '23:59') ? -1 : inp;
            }

        })

        //on click on the synch symbol at the filters, this is called. It looks up current filters set and updates all views accordingly.
        //note multi-selects return arrays of values
        d3.selectAll('#filterApply').on('click', function() {
            //console.log('weeks_filter_comp')
            //console.log(glb_filter_comp)

            _this = d3.select('#filterApply')
            this.classList.add('icn-spinner-time') //remove class to stop animation

            //GROUP FILTER:[0== single, 1== pairs else none]
            d1 = $selected_groups_g1.multipleSelect('getSelects');
            d2 = $selected_groups_g2.multipleSelect('getSelects');
            //store the set group filter in these variable, to faciliate other filters
            var group1 = 0;
            var group2 = 0;

            if (d1.length == 0 || d1.length == 2) { //selecting both and selecting none both same 
                glb_filter_comp[0][1] = -1;
                group1 = -1;
            } else {
                if (d1[0] == 0) glb_filter_comp[0][1] = 0;
                if (d1[0] == 1) glb_filter_comp[0][1] = 1;
                group1 = glb_filter_comp[0][1];
            }
            if (d2.length == 0 || d2.length == 2) {
                glb_filter_comp[1][1] = -1;
                group2 = -1
            } else {
                if (d2[0] == 0) glb_filter_comp[1][1] = 0;
                if (d2[0] == 1) glb_filter_comp[1][1] = 1;
                group2 = glb_filter_comp[1][1]
            }

            //WEEKDAYS FILTERS
            weekdays_1 = $weekday_select_g1.multipleSelect('getSelects');
            //console.log(weekdays_1)

            if (weekdays_1.length == 7 || weekdays_1.length == 0) {
                weekdays_1 = [];
            }

            glb_filter_comp[0][0] = weekdays_1;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 6; j++) {
                    d3.selectAll('#selectAll_' + i + '_' + j).remove();
                }

            }
            weekdays_2 = $weekday_select_g2.multipleSelect('getSelects');
            //console.log(weekdays_2)

            if (weekdays_2.length == 7 || weekdays_2.length == 0) {
                weekdays_2 = [];
            }

            glb_filter_comp[1][0] = weekdays_2;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 6; j++) {
                    d3.selectAll('#selectAll_' + i + '_' + j).remove();
                }

            }
            //coming filters all determine which weeks are to be considered for all visualizations in the main view. They are the same as week filters, and thus stored in the weeks_filter_comp array.
            var copy = data_profile.slice();
            var copy_ = data_profile.slice();

            weeks_filter_comp = [copy, copy_];

            //WEEK FILTER
            weeks_ = $week_select_g1.multipleSelect('getSelects');
            //console.log(weeks_)
            //console.log(weeks_filter_comp[0])
            if (weeks_.length == week_applies.length || weeks_.length == 0) {
                weeks_ = [];
            } else {
                weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => weeks_.includes(x.Week_Year));
            }

            weeks_ = $week_select_g2.multipleSelect('getSelects');
            //console.log(weeks_)
            if (weeks_.length == week_applies.length || weeks_.length == 0) {
                weeks_ = [];
            } else {
                weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => weeks_.includes(x.Week_Year));
            }
            //console.log(weeks_filter_comp)

            //AGE FILTER
            ages = $age_select_g1.multipleSelect('getSelects');
            //console.log(ages)
            if (ages.length == 4 || ages.length == 0) {
                ages = [];
            } else {

                if (group1 == -1) {
                    weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => ages.includes(x.Age1) || ages.includes(x.Age2));

                } else {
                    if (group1 == 0) {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => ages.includes(x.Age1));
                    } else {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => ages.includes(x.Age1) || ages.includes(x.Age2));

                    }

                }
            }

            ages = $age_select_g2.multipleSelect('getSelects');
            //console.log(ages)
            if (ages.length == 4 || ages.length == 0) {
                ages = [];
            } else {

                if (group2 == -1) {
                    weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => ages.includes(x.Age1) || ages.includes(x.Age2));

                } else {
                    if (group2 == 0) {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => ages.includes(x.Age1));
                    } else {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => ages.includes(x.Age1) || ages.includes(x.Age2));

                    }

                }
            }

            //GENDER FILTER
            genders = $gender_select_g1.multipleSelect('getSelects');
            //console.log(genders)

            if (genders.length == 3 || genders.length == 0) {
                genders = [];
                //console.log('A')
            } else {
                if (group1 == -1) {
                    //console.log('B')

                    if (!genders.includes('2')) {
                        //console.log('C')

                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => (genders.includes(x.Gender1) && genders.includes(x.Gender2) && x.Gender1 == x.Gender2 && x.Group == 1) || (genders.includes(x.Gender1) && x.Group == 0));
                    } else if (genders.length == 1) {
                        //console.log('D')

                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => (x.Gender1 == 'm' && x.Gender2 == 'w' && x.Group == 1) || (x.Gender2 == 'm' && x.Gender1 == 'w' && x.Group == 1));
                    } else {
                        //console.log('E')

                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => (x.Gender1 == 'm' && x.Gender2 == 'w' && x.Group == 1) || (x.Gender2 == 'm' && x.Gender1 == 'w' && x.Group == 1) ||
                            (genders.includes(x.Gender1) && x.Gender1 == x.Gender2 && x.Group == 1) || (genders.includes(x.Gender1) && x.Group == 0));
                    }


                } else {
                    if (group1 == 0 && genders.length < 2 && genders[0] != 2) {
                        //console.log('F')

                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => genders.includes(x.Gender1));
                    } else if (group1 == 1) {
                        //console.log('G')

                        if (!genders.includes('2')) {
                            //console.log('H')

                            weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => (genders.includes(x.Gender1) && genders.includes(x.Gender2) && x.Gender1 == x.Gender2));
                        } else if (genders.length == 1) {
                            //console.log('I')

                            weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => (x.Gender1 == 'm' && x.Gender2 == 'w' && x.Group == 1) || (x.Gender2 == 'm' && x.Gender1 == 'w' && x.Group == 1));
                        } else {
                            //console.log('J')

                            weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => (x.Gender1 == 'm' && x.Gender2 == 'w' && x.Group == 1) || (x.Gender2 == 'm' && x.Gender1 == 'w' && x.Group == 1) || (genders.includes(x.Gender1) && genders.includes(x.Gender2) && x.Gender1 == x.Gender2 && x.Group == 1) ||
                                (genders.includes(x.Gender1) && x.Group == 0));
                        }
                    }

                }
            }
            genders = $gender_select_g2.multipleSelect('getSelects');
            //console.log(genders)

            if (genders.length == 3 || genders.length == 0) {
                genders = [];
            } else {
                if (group2 == -1) {
                    for (var l = 0; l < genders.length; l++) {
                        if (!genders.includes('2')) {
                            weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => (genders.includes(x.Gender1) && genders.includes(x.Gender2) && x.Gender1 == x.Gender2 && x.Group == 1) || (genders.includes(x.Gender1) && x.Group == 0));
                        } else if (genders.length == 1) {
                            weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => (x.Gender1 == 'm' && x.Gender2 == 'w' && x.Group == 1) || (x.Gender2 == 'm' && x.Gender1 == 'w' && x.Group == 1));
                        } else {
                            weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => (x.Gender1 == 'm' && x.Gender2 == 'w' && x.Group == 1) || (x.Gender2 == 'm' && x.Gender1 == 'w' && x.Group == 1) ||
                                (genders.includes(x.Gender1) && x.Gender1 == x.Gender2 && x.Group == 1) || (genders.includes(x.Gender1) && x.Group == 0));
                        }
                    }

                } else {
                    if (group2 == 0 && genders.length < 2 && genders[0] != 2) {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => genders.includes(x.Gender1));
                    } else if (group1 == 1) { //pair
                        if (!genders.includes('2')) {
                            weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => (genders.includes(x.Gender1) && genders.includes(x.Gender2) && x.Gender1 == x.Gender2));
                        } else if (genders.length == 1) {
                            weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => (x.Gender1 == 'm' && x.Gender2 == 'w' && x.Group == 1) || (x.Gender2 == 'm' && x.Gender1 == 'w' && x.Group == 1));
                        } else {
                            weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => (x.Gender1 == 'm' && x.Gender2 == 'w' && x.Group == 1) || (x.Gender2 == 'm' && x.Gender1 == 'w' && x.Group == 1) || (genders.includes(x.Gender1) && genders.includes(x.Gender2) && x.Gender1 == x.Gender2 && x.Group == 1) || (genders.includes(x.Gender1) && x.Group == 0));
                        }
                    }


                }
            }
            //OCCUPATION FILTER
            occ = $occ_select_g1.multipleSelect('getSelects');
            //console.log(occ)

            if (occ.length == 4 || occ.length == 0) {
                occ = [];
            } else {
                if (group1 == -1) {
                    weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => occ.includes(x.OccupationCategory1) || occ.includes(x.OccupationCategory2));

                } else {
                    if (group1 == 0) {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => occ.includes(x.OccupationCategory1));
                    } else {
                        weeks_filter_comp[0] = weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => occ.includes(x.OccupationCategory1) || occ.includes(x.OccupationCategory2));

                    }

                }
            }
            occ = $occ_select_g2.multipleSelect('getSelects');
            //console.log(occ)

            if (occ.length == 4 || occ.length == 0) {
                occ = [];
            } else {
                if (group2 == -1) {
                    weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => occ.includes(x.OccupationCategory1) || occ.includes(x.OccupationCategory2));

                } else {
                    if (group2 == 0) {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => occ.includes(x.OccupationCategory1));
                    } else {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => occ.includes(x.OccupationCategory1) || occ.includes(x.OccupationCategory2));

                    }

                }
            }
            //HOUSING FILTERS
            housing = $housing_select_g1.multipleSelect('getSelects');
            //console.log(housing)

            if (housing.length == 2 || housing.length == 0) {
                housing = [];
            } else {
                if (group1 == -1) {
                    weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => housing.includes(x.HousingUnit1) || housing.includes(x.HousingUnit2));

                } else {
                    if (group1 == 0) {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => housing.includes(x.HousingUnit1));
                    } else {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => housing.includes(x.HousingUnit1) || housing.includes(x.HousingUnit2));

                    }

                }
            }
            housing = $housing_select_g2.multipleSelect('getSelects');
            //console.log(housing)

            if (housing.length == 2 || housing.length == 0) {
                housing = [];
            } else {
                if (group2 == -1) {
                    weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => housing.includes(x.HousingUnit1) || housing.includes(x.HousingUnit2));

                } else {
                    if (group2 == 0) {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => housing.includes(x.HousingUnit1));
                    } else {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => housing.includes(x.HousingUnit1) || housing.includes(x.HousingUnit2));

                    }

                }
            }
            //LIVING SITUATION FILTERS
            living = $living_select_g1.multipleSelect('getSelects');
            //console.log(living)

            if (living.length == 3 || living.length == 0) {
                living = [];
            } else {
                if (group1 == -1) {
                    weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => living.includes(x.LivingSize1) || living.includes(x.LivingSize2));

                } else {
                    if (group1 == 0) {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => living.includes(x.LivingSize1));
                    } else {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => living.includes(x.LivingSize1) || living.includes(x.LivingSize2));

                    }

                }
            }

            living = $living_select_g2.multipleSelect('getSelects');
            //console.log(living)

            if (living.length == 3 || living.length == 0) {
                living = [];
            } else {
                if (group2 == -1) {
                    weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => living.includes(x.LivingSize1) || living.includes(x.LivingSize2));

                } else {
                    if (group2 == 0) {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => living.includes(x.LivingSize1));
                    } else {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => living.includes(x.LivingSize1) || living.includes(x.LivingSize2));

                    }

                }
            }
            //ROOMSIZE FILTER
            room = $room_select_g1.multipleSelect('getSelects');
            //console.log(room)

            if (room.length == 3 || room.length == 0) {
                room = [];

            } else {
                ////console.log(room)
                if (group1 == -1) {
                    weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => room.includes(x.RoomsCat1) || room.includes(x.RoomsCat2));

                } else {
                    if (group1 == 0) {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => room.includes(x.RoomsCat1));
                    } else {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => room.includes(x.RoomsCat1) || room.includes(x.RoomsCat2));

                    }
                }
            }
            room = $room_select_g2.multipleSelect('getSelects');
            //console.log(room)

            if (room.length == 3 || room.length == 0) {
                room = [];

            } else {
                ////console.log(room)
                if (group2 == -1) {
                    weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => room.includes(x.RoomsCat1) || room.includes(x.RoomsCat2));

                } else {
                    if (group2 == 0) {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => room.includes(x.RoomsCat1));
                    } else {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => room.includes(x.RoomsCat1) || room.includes(x.RoomsCat2));

                    }
                }
            }
            //RECENT CHANGES FILTER
            change = $change_select_g1.multipleSelect('getSelects');
            //console.log(change)

            if (change.length == 3 || change.length == 0) {
                change = [];
            } else {
                if (group1 == -1) {
                    weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => change.includes(x.ChangeCat1) || change.includes(x.ChangeCat2));

                } else {
                    if (group1 == 0) {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => change.includes(x.ChangeCat1));
                    } else {
                        weeks_filter_comp[0] = weeks_filter_comp[0].filter(x => change.includes(x.ChangeCat1) || change.includes(x.ChangeCat2));

                    }
                }
            }

            change = $change_select_g2.multipleSelect('getSelects');
            //console.log(change)

            if (change.length == 3 || change.length == 0) {
                change = [];
            } else {
                if (group2 == -1) {
                    weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => change.includes(x.ChangeCat1) || change.includes(x.ChangeCat2));

                } else {
                    if (group2 == 0) {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => change.includes(x.ChangeCat1));
                    } else {
                        weeks_filter_comp[1] = weeks_filter_comp[1].filter(x => change.includes(x.ChangeCat1) || change.includes(x.ChangeCat2));

                    }
                }
            }

            //update data for all visualizations, reinitialize array and update all visualizations
            filter_data_comp();
            reInitialize(false);
        });

        //when checkbock for the timefilters are not checked, they are disabled
        d3.selectAll('#check_time_g1').on('click', function() {
            // Get the checkbox
            var checkBox = document.getElementById("check_time_g1");

            // If the checkbox is checked, display the output text
            if (checkBox.checked == false) {

                document.getElementById("input_time_from_g1").disabled = true;
                document.getElementById("input_time_to_g1").disabled = true;

                document.getElementById("check_time_g1").title = 'Enable Time Filter'
                glb_filter_comp[0][3] = -1;
                glb_filter_comp[0][4] = -1;

            } else {
                document.getElementById("input_time_from_g1").disabled = false;
                document.getElementById("input_time_to_g1").disabled = false;

                document.getElementById("check_time_g1").title = 'Disable Time Filter'

                glb_filter_comp[0][3] = document.getElementById("input_time_from_g1").value
                glb_filter_comp[0][4] = inp = document.getElementById("input_time_to_g1").value

            }

        });
        d3.selectAll('#check_time_g2').on('click', function() {
            // Get the checkbox
            var checkBox = document.getElementById("check_time_g2");

            // If the checkbox is checked, display the output text
            if (checkBox.checked == false) {

                document.getElementById("input_time_from_g2").disabled = true;
                document.getElementById("input_time_to_g2").disabled = true;
                document.getElementById("check_time_g2").title = 'Enable Time Filter'
                glb_filter_comp[1][3] = -1;
                glb_filter_comp[1][4] = -1;
            } else {

                document.getElementById("input_time_from_g2").disabled = false;
                document.getElementById("input_time_to_g2").disabled = false;
                document.getElementById("check_time_g2").title = 'Disable Time Filter'


                glb_filter_comp[1][3] = inp = document.getElementById("input_time_from_g2").value
                glb_filter_comp[1][4] = inp = document.getElementById("input_time_to_g2").value
            }

        });
        //on chnage of GROUPING size
        document.getElementById('input_grouping').addEventListener("keyup", function(event) {

            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                event.preventDefault();

                val = parseFloat(document.getElementById("input_grouping").value)
                    ////console.log('grouping set: ' + val + ' ' + grouping_before)
                if (val > 0 && val <= 90 && (val % 1) == 0) {
                    grouping_before = grouping;
                    grouping = parseInt(val)
                    reInitialize(true);
                }
            }
        });

        //on change of SCALE method (value, frequency or duration)
        document.getElementById('input_scale').addEventListener("change", function(event) {

            val = parseFloat(document.getElementById("input_scale").value)

            if (scale != val) {
                scale = val;
                reInitialize(false);
            }

        });
        //on change of VALUE (scale type, absolute or relative)
        document.getElementById('input_referenceType').addEventListener("change", function(event) {

            val = parseFloat(document.getElementById("input_referenceType").value)

            referenceType = val;
            reInitialize(false);
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
                [],
                []

            ];
            intersection = [
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
                ]
            ];
            total_val = [ //used to compute percentage
                [],
                [],
                [],
                []
            ];

            added = [];
            removed = [];
            yScales = [];

            //remove everything...
            d3.selectAll('#xaxis').remove();
            d3.selectAll('.path').remove()

            for (var i = 0; i < 4; i++) {
                d3.selectAll('#' + elements[i] + 'bar').remove();
                d3.selectAll('#temp' + i).remove();
            }

            //...and redraw
            draw_comparison_radial_charts(grouping, [b, b, b, b]);
        }


        /**
         * This function calculates the data for the inner histograms and draws the four radial histograms for the given bucket size (grouping).
         * @param {int} grouping stepsize for anlges per bar, [1,90]
         * @param {[Bool]} g_updated bool array. It tells us if the i-th chart was already updated, to avoid unneccesary redundant computation.
         */
        function draw_comparison_radial_charts(grouping, g_updated) {
            /**
             * DATA_GROUPED_PER_ANGLE
             * basis for all operations and actions with data.
             * Hase all the data grouped per angle: data_grouped_per_angle[g][i][j]
             * For the data of group g
             * The i-th entry == i-th element
             * the j-th entry == all the instances (states) in data_snaps that have the i-th element positioned at the j-th angle (rounded)
             */
            var data_grouped_per_angle = [
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
                ]
            ];
            //Initialize 
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 360; j++) {
                    for (var g = 0; g < 2; g++) {
                        data_grouped_per_angle[g][i].push([])
                    }
                }
            }
            /**
             * 1. In order to fill data_grouped_per_angle, we must first filter data_snaps so that it applies to all filter set for each group. 
             * This data is contained in DATA_SNAPS_TIME_FILTERED for each group.
             */
            var data_snaps_time_filtered = [
                [],
                []
            ];
            //initially whole data_snaps
            data_snaps_time_filtered[0] = JSON.parse(JSON.stringify(data_snaps));
            data_snaps_time_filtered[1] = JSON.parse(JSON.stringify(data_snaps));

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

            var from1 = glb_filter_comp[0][3];
            var from2 = glb_filter_comp[1][3];
            var to1 = glb_filter_comp[0][4];
            var to2 = glb_filter_comp[1][4];


            if (from1 != -1 || to1 != -1) {
                from1 = (from1 == -1) ? '00:00' : from1;
                to1 = (to1 == -1) ? '23:59' : to1;

                data_snaps_time_filtered[0] = time_filter(data_snaps_time_filtered[0], from1, to1)

            }
            if (from2 != -1 || to2 != -1) {
                from2 = (from2 == -1) ? '00:00' : from2;
                to2 = (to2 == -1) ? '23:59' : to2;

                data_snaps_time_filtered[1] = time_filter(data_snaps_time_filtered[1], from2, to2)
            }

            /**
             * filter data_snap_ array, such that we are left with all the positions and the durations they were held during the time interval of [from_time; to_time]
             * @param {*} data_snap_ data to apply filter on
             * @param {string} from_time  format: %H:%M 
             * @param {string} to_time   format: %H:%M
             */
            function time_filter(data_snap_, from_time, to_time) {

                if (from_time == -1) from_time = '00:00';
                if (to_time == -1) to_time == '23:59'

                var data_days_filtered = [];
                data_to_filter = data_snap_.slice()

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
             * @param {String or Int} to_time   format: %H:%M or -1
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
                    prev_from[0].time_to_next = (prev_from[0].time_to_next < 0) ? 0 : prev_from[0].time_to_next;
                }
                if (to_time == '23:59') {
                    index_prev_to = data_day.length;

                } else {
                    index_prev_to = binary_search_time(date_to, data_day);

                    d = data_day[index_prev_to];

                    prev_to = [{
                        Timestamp: d.Timestamp,
                        element_ang: d.element_ang,
                        time_to_next: (new Date(date_to) - new Date(d.Timestamp)), //- 60000,
                        Week: d.Week,
                        Weekday: d.Weekday,
                        Group: d.Group,
                        Hour: d.Hour,
                        Min: d.Min,
                        Element: d.Element
                    }]

                    prev_to[0].time_to_next = (prev_to[0].time_to_next < 0) ? (prev_to[0].time_to_next + 60000) : prev_to[0].time_to_next;


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

            //2. Initialize data_grouped_per_angle with the data computed in data_snaps_time_filtered
            //per element, per angle, store all datainstances form data_snaps_filtered in the corresponding entry, where elment i was at angle d
            for (var g = 0; g < NRGROUPS; g++) {

                for (var j = 0; j < data_snaps_time_filtered[g].length; j++) {
                    for (var i = 0; i < 4; i++) {
                        d = data_snaps_time_filtered[g][j].element_ang[i];
                        //Truncate angles outside the elements range
                        if (d > maxrange[i]) d = maxrange[i];
                        if (d < 0) d = 0;

                        data_grouped_per_angle[g][i][d].push(data_snaps_time_filtered[g][j]);


                    }

                }
            }


            //console.log('data_grouped_per_angle after FILTER_BOTH:')
            //console.log(data_grouped_per_angle)

            //Initialize union used later in update_comparison_dataset_inner() 
            for (var i = 0; i < 4; i++) {
                for (var g = 0; g < NRGROUPS; g++) {
                    union[g].push({
                        datas: [
                            [],
                            [],
                            [],
                            []
                        ]
                    })
                }
            }


            /*
             * 3. initialize DATASET_INNER CHART and DATASET_OUTER_CHART
             * Create an array of length  Math.floor(360 / grouping) *2.
             * The elements in .data of the i-th entry keep track of all the data instances in data_snap that has the i-th element on
             * a position in [angle*grouping,angle*grouping+grouping-1]. 
             * Both in total and seperatly for each angle - for data_inner_chart, but not for dataset_outer_chart, since we determine that one time only.
             * 
             * We record the number of elements in .data (.val[0])
             * and the total duration the element was kept at that position (.val[1]) == sum over all 'time to next' of the elmenets in .data,
             * It also keeps track wheater the respective bar was 'clicked', in order to set the right colour.
             * 
             * It does not however keep any of he data instances directly. Those are only needed when claculating the new 'dataset_inner_chart'
             * after updating the radial chart (ie after toggling a bar)
             *  
             * if (k%2 == 0) entry for group1
             * else entry for group2
             * */


            // DATASET_OUTER_CHART[i] will contain all the necessary data to draw the outer radial bar chart for the ith element.
            var dataset_outer_chart = [
                [],
                [],
                [],
                []
            ];
            //Initialize: Create dataset_inner_chart and dataset_outer_chart instances.
            for (var i = 0; i < 4; i++) {
                //map_anlges is used to make sure selected bars are still selected after update (filter, grouping etc.)
                map_angles = angles[i].map(x => Math.floor(x / grouping));

                for (var k = 0; k < Math.floor(360 / grouping); k++) {
                    for (var g = 0; g < NRGROUPS; g++) {

                        var clicked_before = false;
                        if (map_angles.includes(k)) {
                            clicked_before = true;
                        }
                        //if i % 2== 0 it is entry of angle k for Single, else for Double
                        dataset_inner_chart[i].push({ angle: k, val: [0, 0], all_angles: [], clicked: clicked_before, el: i });
                        dataset_outer_chart[i].push({ angle: k, val: [0, 0], clicked: clicked_before, el: i });

                        for (var q = 0; q < grouping; q++) {
                            //contains the information per angles in the given angle interval.
                            dataset_inner_chart[i][k * NRGROUPS + g].all_angles.push({ angle: k * grouping + q, val: [0, 0] });

                        }

                    }
                }
            }


            const reducer_sum = (acc, curr) => acc + curr;


            for (var g = 0; g < NRGROUPS; g++) {
                for (var i = 0; i < 4; i++) {
                    total_val[i].push([0, 0])
                }
            }

            /**
             * Filters given array with the choices set in glb_filter_comp[g] for group g. 
             * The input array corresponds to the data in a single entry of data_grouped_per_angle.
             * @param {} g  group number
             * @param {} array data in a single entry of data_grouped_per_angle
             */
            function filter_group(g, array) {
                var filtered_array = JSON.parse(JSON.stringify(array)); //filter: [Weekday, Group,Week,TimeFrom,TimeTo]


                if (glb_filter_comp[g][0].length != 0) filtered_array = filtered_array.filter(x => (glb_filter_comp[g][0]).includes(x.Weekday));
                if (glb_filter_comp[g][1] != -1) filtered_array = filtered_array.filter(function(x) {
                    if (x.Group == glb_filter_comp[g][1]) {
                        return true
                    } else {
                        return false;
                    }
                });

                if (weeks_filter_comp[g].length != 0) {


                    wf = weeks_filter_comp[g].map(x => x.Week_Year);
                    filtered_array = filtered_array.filter(x => wf.includes(x.Week));
                }

                return filtered_array;

            }
            /**
             * filter array according to the choices set for BOTH groups
             * to speed up later filter run inf filter_group. 
             * The input array corresponds to the data in a single entry of data_grouped_per_angle
             * @param {} array 
             */
            function filter_both(array) {
                //  ////console.log('filter both' + filter)
                // ////console.log(array)

                var filtered_array = array.slice() //filter: [Weekday, Group,Week,TimeFrom,TimeTo]

                if (glb_filter_comp[0][0].length != 0 && glb_filter_comp[1][0].length != 0) filtered_array = filtered_array.filter(x => glb_filter_comp[0][0].includes(x.Weekday) || glb_filter_comp[1][0].includes(x.Weekday));

                if ((glb_filter_comp[0][1] != -1 && glb_filter_comp[1][1] != -1) && !((glb_filter_comp[0][1] + glb_filter_comp[1][1]) == 1)) filtered_array = filtered_array.filter(x => x.Group == glb_filter_comp[0][1] || x.Group == glb_filter_comp[1][1]);

                if ((weeks_filter_comp[0].length != 0 && weeks_filter_comp[1].length != 0)) {
                    wf1 = weeks_filter_comp[0].map(x => x.Week_Year)
                    wf2 = weeks_filter_comp[1].map(x => x.Week_Year)
                    filtered_array = filtered_array.filter(x => wf1.includes(x.Week) || wf2.includes(x.Week));
                }

                return filtered_array;

            }


            /**
             * Initzialize dataset outer_chart
             * Calculate the .val values per bar and angle (frequency and duration) for each group
             * Calculate the total_val entries: It hold the sum over all freq and durations per element
             */
            for (var i = 0; i < 4; i++) { //element
                for (var j = 0; j < Math.floor(360 / grouping); j++) { //bar
                    for (var q = 0; q < grouping; q++) { //angle
                        for (var g = 0; g < NRGROUPS; g++) { //group

                            var temp = data_grouped_per_angle[g][i][j * grouping + q].slice();
                            var filtered_array = filter_group(g, temp);

                            var c_freq = (filtered_array.filter(x => x.Element == i)).length;
                            var c_dur = (filtered_array.map(x => x.time_to_next)).reduce(reducer_sum, 0);


                            // ////console.log(g + " " + c1 + " " + c2)
                            dataset_outer_chart[i][NRGROUPS * (j) + g].val[0] += c_freq;
                            dataset_outer_chart[i][NRGROUPS * (j) + g].val[1] += c_dur;


                            total_val[i][g][0] += c_freq;
                            total_val[i][g][1] += c_dur;
                        }
                    }
                }

            }


            //4. Scales of the histograms.
            var maxy = 0; //to keep track of the max val[scale], in case we want all 4 radial charts to be of same scale

            /**
             * y scale.
             * Determine y-Scales for each of the 4 radial charts. 
             * Either they have same scale using maxy, or not.
             * The scales are stored in the array yScales
             */
            for (var i = 0; i < 4; i++) {

                if (referenceType == 1) { //relative scale
                    dataset_even = dataset_outer_chart[i].filter((d, i) => i % 2 == 0);
                    dataset_odd = dataset_outer_chart[i].filter((d, i) => i % 2 == 1);

                    maxy = Math.max(maxy, d3.max(dataset_even, d => (d.val[scale] / total_val[i][0][scale])));
                    maxy = Math.max(maxy, d3.max(dataset_odd, d => (d.val[scale] / total_val[i][1][scale])));
                } else { //absolute scale
                    maxy = Math.max(maxy, d3.max(dataset_outer_chart[i], d => d.val[scale]));
                }

                //console.log('maxy')
                //console.log(maxy)

            }

            for (var i = 0; i < 4; i++) {
                yScales.push(d3.scaleRadial()
                    .range([innerRadius, outerRadius])
                    .domain([0, maxy])); // Domain of Y is from 0 to the max seen in the data
                //.domain([0, d3.max(dataset_outer_chart[i], x => x.val[scale])]));
            }

            //x scale.
            var x = d3.scaleBand()
                .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
                .domain([0, dataset_outer_chart[0].length]); // The domain of the X axis are the angles (360deg).

            //actually draw the histograms
            circularBarChart(0, dataset_outer_chart[0], svg0);
            circularBarChart(1, dataset_outer_chart[1], svg1);
            circularBarChart(2, dataset_outer_chart[2], svg2);
            circularBarChart(3, dataset_outer_chart[3], svg3);


            /**
             * This function draws the radial histograms for the given element with the given dataset in the given canvas(svg).
             * @param {*int} index indicates which element we are dealing with [0: DW, 1: DS, 2: LA, 3: LD]
             * @param {*} dataset is the dataset for the outer histogram storing angle, freq, clicked 
             * @param {*} svg the svg to draw the histogram in
             */
            function circularBarChart(index, dataset, svg) {

                var x = d3.scaleBand()
                    .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
                    .domain(dataset_outer_chart[index].map(function(d, i) { return i })); // The domain of the X axis are the angles (360deg).

                d3.selectAll('#reset' + index).on('click', updateData);
                d3.selectAll('#setAll' + index).on('click', updateSelectAll);



                /**
                 * function that deselects all bars of the given element at once.
                 */
                function updateData() {
                    removed = removed.concat(angles[index]);
                    for (var j = 0; j < angles[index].length; j++) {
                        var k_ = Math.floor(angles[index][j] / grouping)
                        dataset_outer_chart[index][k_ * 2].clicked = false;
                        dataset_outer_chart[index][k_ * 2 + 1].clicked = false;


                        d3.selectAll(".bar" + k_ + '_left' + index).attr("fill", color[index]);
                        d3.selectAll(".bar" + k_ + '_right' + index).attr("fill", texture_g2_col[index].url());
                    }
                    update_comparison_dataset_inner();
                    removed = [];
                    added = [];
                    angles[index] = [];
                    update_density_plots(dataset_inner_chart);
                    update_inner_chart(dataset_inner_chart);
                    //console.log('reset' + index)

                }

                /**
                 * function that selects all bars of the given element at once.
                 */
                function updateSelectAll() {
                    k_ = 0
                    removed = [];
                    added = [];
                    angles[index] = [];
                    for (var j = 0; j < dataset_outer_chart[index].length; j++) {

                        dataset_outer_chart[index][j].clicked = true;
                        dataset_outer_chart[index][j].clicked = true;

                        //  d3.selectAll(".bar" + k_ + '_left' + index).attr("fill", darkcol[index]);
                        // d3.selectAll(".bar" + k_ + '_right' + index).attr("fill", texture_g2_com[index].url());
                        k_ += 1;
                        added.push(k_ * grouping)
                        angles[index].push(k_ * grouping)

                    }
                    console.log('Select All')
                    update_comparison_dataset_inner();

                    update_density_plots(dataset_inner_chart);
                    update_inner_chart(dataset_inner_chart);
                }

                off = Math.floor(rotate[index] / (grouping));

                //Axis
                var xAxis = g => g
                    .attr("text-anchor", "middle")
                    .call(g => g.selectAll("g")
                        .data(dataset)
                        .join("g")
                        .attr("transform", d => `
                  rotate(${((x(d.angle-off) + x.bandwidth()/2) * 180 / Math.PI - 90)})
                  translate(${innerRadius},0)`)
                        .call(g => g.append("line")
                            .attr("x2", -0.5)
                            .attr("stroke", "#000"))
                        .attr('stroke-width', '.5px')
                        .style('font-size', '10px'))
                var xAxispart2 =
                    g => g
                    .attr("text-anchor", "middle")
                    .call(g => g.selectAll("g")
                        .data(dataset)
                        .join("g")
                        .attr("transform", d => `
                  rotate(${((x(d.angle-off) + x.bandwidth()/2) * 180 / Math.PI +90)})
                  translate(${innerRadius},0)`)
                        .call(g => g.append("line")
                            .attr("x2", -0.5)
                            .attr("stroke", "#000"))
                        .attr('stroke-width', '.5px')
                        .style('font-size', '10px'))


                //color of the base chart and the 'inner' chart
                var col = color[index];
                var com = complement[index];
                var down = false; //used in case multiple selection are done by keeping mouse down

                //The arc for the OUTER historam
                var mainarc = d3.arc()
                    .innerRadius(innerRadius) //the doughnut hole
                    .outerRadius(function(d, i) {
                        var data_value = d.val[scale]
                        if (referenceType == 1) {
                            data_value = data_value / total_val[index][i % 2][scale]
                        }
                        return yScales[index](data_value);
                    })
                    .startAngle(function(d, i) {
                        //rotate[index] gives value of how much to rotate the whole bar chart, such that the bars and positions of the elements in the image are aligned. 
                        // depends on grouping and may thus be a little off

                        return x((i + Math.floor(360 * NRGROUPS / (grouping))) % Math.floor(360 * NRGROUPS / (grouping)));
                    })
                    .endAngle(function(d, i) {
                        return x((i + Math.floor(360 * NRGROUPS / (grouping))) % Math.floor(360 * NRGROUPS / (grouping))) + x.bandwidth();
                    })
                    .padAngle(0.001) //makes single bars differentiable from each other in the chart
                    .padRadius(innerRadius)

                // Add the bars
                var barchart = svg.append("g")
                    .selectAll("path")
                    .data(dataset)
                    .enter()
                    .append("path")
                    .attr('id', elements[index] + 'bar')
                    .attr("fill", function(d, i) {

                        if (i % 2 == 0) { //group 1
                            if (dataset[i].clicked) {
                                return com;
                            } else {
                                return col;
                            }
                        } else { //group 2
                            if (dataset[i - 1].clicked) {
                                return texture_g2_com[index].url();
                            } else {
                                return texture_g2_col[index].url() //col;
                            }
                        }
                    })
                    .attr("d", mainarc)
                    .attr("class", function(d, i) {
                        if (i % 2 == 0) {
                            return "bar" + Math.floor(i / 2) + '_left' + index;
                        } else {
                            return "bar" + Math.floor(i / 2) + '_right' + index;
                        }
                    })
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('click', function(d, i) { //selection of bars
                        if (true) {
                            if (i % 2 == 0) {
                                dataset[i].clicked = (dataset[i].clicked) ? false : true;
                            } else {
                                dataset[i - 1].clicked = (dataset[i - 1].clicked) ? false : true;

                            }
                            var i_t = i - (i % 2)
                            d_clicked = (dataset[i_t].clicked);

                            /**
                             * depending on wheter elmement is clicked, change fill colour of the bar.
                             *  Also update removed and added arrays, storing all removed and added angles since the last update of the chart.
                             * They either store a single value or multiple (when angles where chosen with mousedown).
                             *  One of the two must be empty.
                             */

                            if (angles[index].includes((d.angle * grouping))) {
                                //remove
                                removed.push(d.angle * grouping);
                                for (var j = 0; j < angles[index].length; j++) {
                                    if (angles[index][j] == d.angle * grouping) {
                                        angles[index].splice(j, 1);
                                    }
                                }

                            } else {
                                //add
                                angles[index].push(d.angle * grouping);
                                added.push(d.angle * grouping)
                            }

                            //Calculate dataset (update) of inner histogram based on the selected bars
                            update_comparison_dataset_inner();
                            //update (draw) the inner bar chart
                            update_inner_chart(dataset_inner_chart);
                            //draw elements at the selected angles with the appropriate opacity in the floor plan
                            update_density_plots(dataset_inner_chart);


                            var retcol_left = (d_clicked) ? com : col;
                            var retcol_right = (d_clicked) ? texture_g2_com[index].url() : texture_g2_col[index].url();

                            d3.selectAll(".bar" + Math.floor(i / 2) + '_right' + index).attr("fill", retcol_right);
                            d3.selectAll(".bar" + Math.floor(i / 2) + '_left' + index).attr("fill", retcol_left);

                        }
                    }).on('mousedown', function() {
                        down = true;
                        obj = this;
                    })
                    .on('mouseup', function(d, i) {
                        if (down) {
                            down = false;
                            if (this != obj) { //meaning we chose multiple elements with mousedown and it was NOT a click

                                currentangle[index] = d.angle * grouping;

                                var a = (d.angle * grouping - (offset[index]))


                                //Calculate dataset (update) of inner histogram based on the selected bars
                                update_comparison_dataset_inner();
                                //update (draw) the inner bar chart
                                update_inner_chart(dataset_inner_chart);
                                //draw elements at the selected angles with the appropriate opacity in the floor plan
                                update_density_plots(dataset_inner_chart);
                            }
                        }
                    })
                    .on("mouseout", function(d, i) {

                        d_clicked = dataset[i - (i % 2)].clicked

                        var r_left = (d_clicked) ? com : col;
                        var r_right = (d_clicked) ? texture_g2_com[index].url() : texture_g2_col[index].url(); //maybe

                        var r2_left = darkcol[index];
                        var r2_right = texture_g2_inner[index].url();

                        d3.selectAll(".bar" + Math.floor(i / 2) + '_right' + index).attr("fill", r_right);
                        d3.selectAll(".bar" + Math.floor(i / 2) + '_left' + index).attr("fill", r_left);

                        d3.selectAll('.bar' + Math.floor(i / 2) + '_in_right' + index).attr('fill', r2_right);
                        d3.selectAll('.bar' + Math.floor(i / 2) + '_in_left' + index).attr('fill', r2_left);


                    })

                //tooltip
                function mouseover(d, i) {
                    divarr_comp[index].style('display', 'inline');

                    if (i % 2 == 0) { //only if over even bar-position (ie. group1) makes multi-select harder, but solves problem of always selecting and deselecting the same bar

                        if (down) { //in the process of selecting

                            d.clicked = (d.clicked) ? false : true;
                            dataset[i + 1].clicked = d.clicked

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

                            //Calculate dataset (update) of inner histogram based on the selected bars
                            update_comparison_dataset_inner();


                            var retcol_left = (d.clicked) ? com : col;
                            var retcol_right = (d.clicked) ? texture_g2_inner[index].stroke(com).url() : texture_g2_inner[index].stroke(col).url(); //pink


                            d3.selectAll('.bar' + d.angle + '_in_right' + index).attr("fill", retcol_right);
                            d3.selectAll('.bar' + d.angle + '_in_left' + index).attr("fill", retcol_left);

                        }

                        r_left = (d.clicked) ? 'rgb(187, 103, 0)' : com; //pink
                        r_right = (d.clicked) ? texture_g2_darkorange.url() : texture_g2_com[index].url(); //pink

                        r2_left = (d.clicked) ? darkest[index] : 'rgb(187, 103, 0)'
                        r2_right = (d.clicked) ? texture_g2_inner[index].stroke(darkest[index]).url() : texture_g2_inner_darkorange.url(); //pink


                        d3.selectAll('.bar' + Math.floor(i / 2) + '_in_right' + index).attr('fill', r2_right);
                        d3.selectAll('.bar' + Math.floor(i / 2) + '_in_left' + index).attr('fill', r2_left);

                        d3.selectAll('.bar' + Math.floor(i / 2) + '_right' + index).attr('fill', r_right);
                        d3.selectAll('.bar' + Math.floor(i / 2) + '_left' + index).attr('fill', r_left);

                    } else {

                        d_clicked = dataset[i - 1].clicked;
                        r_left = (d_clicked) ? 'rgb(187, 103, 0)' : com; //pink
                        r_right = (d_clicked) ? texture_g2_darkorange.url() : texture_g2_com[index].url(); //pink

                        r2_left = (d_clicked) ? darkest[index] : 'rgb(187, 103, 0)'
                        r2_right = (d_clicked) ? texture_g2_inner[index].stroke(darkest[index]).url() : texture_g2_inner_darkorange.url(); //pink


                        d3.selectAll('.bar' + Math.floor(i / 2) + '_in_right' + index).attr('fill', r2_right);
                        d3.selectAll('.bar' + Math.floor(i / 2) + '_in_left' + index).attr('fill', r2_left);

                        d3.selectAll('.bar' + Math.floor(i / 2) + '_right' + index).attr('fill', r_right);
                        d3.selectAll('.bar' + Math.floor(i / 2) + '_left' + index).attr('fill', r_left);
                    }
                }

                //updae tooltip shown belown the corresponding radial histogram
                function mousemove() {
                    var d = d3.select(this).data()[0];
                    document.getElementById(elements[index] + "div").innerHTML = (((scale == 0) ? 'Frequency ' : 'Duration ') + 'at Angle: ' + (d.angle * grouping) + '-' + (d.angle * (grouping) + grouping) +
                        '<br>' + 'Outer: (' + getTimeString(scale, dataset[d.angle * 2].val[scale], '1') + ', ' + getTimeString(scale, dataset[d.angle * 2 + 1].val[scale], '2') + ')' +
                        '<br>' + 'Inner: (' + getTimeString(scale, dataset_inner_chart[index][d.angle * 2].val[scale], '1') + ', ' + getTimeString(scale, dataset_inner_chart[index][d.angle * 2 + 1].val[scale], '2') + ')')

                }



                added = added.concat(angles[index])
                    //Calculate dataset (update) of inner histogram based on the selected bars
                update_comparison_dataset_inner();
                //update (draw) the inner bar chart
                update_inner_chart(dataset_inner_chart);
                //draw elements at the selected angles with the appropriate opacity in the floor plan
                update_density_plots(dataset_inner_chart);

                //draw axes
                svg.append('g').attr('id', 'xaxis').call(xAxis);
                svg.append('g').attr('id', 'xaxis').call(xAxispart2);


                svg.call(texture_g2_com[index]);
                svg.call(texture_g2_col[index]);
                svg.call(texture_g2_darkorange)


                /**
                 * update DATASET_INNER_CHART  to be used to create inner radial barchart, spatial mapping and the percentage bar chart.
                 * The function is based on set operations union and intersection on the  Timestamps of the data instances of data_snaps,
                 * already grouped together in data_grouped_per_angle.
                 * We make the assumption that no two elements were moved at the same time (ms precision), which makes all Timestamps unique.
                 */
                function update_comparison_dataset_inner() {
                    var j = 0;
                    //remove all angles both added and removed
                    while (j < added.length) {
                        if (removed.indexOf(added[j]) != -1) {
                            removed.splice(removed.indexOf(added[j]), 1);
                            added.splice(j, 1);
                            j--;

                        }
                        j++;
                    }

                    var data_inner_updated = [
                        [],
                        [],
                        [],
                        []
                    ];
                    //initzialize data_inner_updated (it has same structure as dataset_inner_chart)
                    for (var i = 0; i < 4; i++) {
                        for (var k = 0; k < Math.floor(360 / grouping); k++) {
                            for (var g = 0; g < NRGROUPS; g++) {
                                var _data = [];
                                for (var q = 0; q < grouping; q++) {
                                    _data.push({ angle: k * grouping + q, val: [0, 0] });
                                }
                                data_inner_updated[i].push({ angle: k, val: [0, 0], data: _data, clicked: false, el: i });

                            }
                        }
                    }
                    for (var g = 0; g < NRGROUPS; g++) {
                        //newunion, newintersection keep track of new sets. Used to speed up the overall intersection and union by getting rid of redundant op's.
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


                        //angles in added and removed given as normal angles in [0,360], not multiples of grouping.
                        if (added.length != 0) { //angles were added
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
                                        newunion[k] = arrayUnion(data_grouped_per_angle[g][index][added[j] + q], newunion[k]);
                                    }
                                }
                            }


                            for (var i = 0; i < 4; i++) {
                                var notEmpty = [];
                                //only intersect sets that are not empty, else we get empty array.
                                for (var j = 0; j < 4; j++) {
                                    if (j != index && (union[g][j].datas[i].length != 0)) {
                                        notEmpty.push(j);
                                    }
                                }
                                notEmpty.push(index);

                                //calc newintersection
                                var len = notEmpty.length;
                                if (len == 1) {
                                    newintersection[i] = (notEmpty[0] == index) ? newunion[i] : union[g][notEmpty[0]].datas[i];
                                } else if (len == 2) {
                                    var a = (notEmpty[0] == index) ? newunion[i] : union[g][notEmpty[0]].datas[i];
                                    var b = (notEmpty[1] == index) ? newunion[i] : union[g][notEmpty[1]].datas[i];

                                    newintersection[i] = arrayInter(a, b);

                                } else if (len == 3) {
                                    var a = (notEmpty[0] == index) ? newunion[i] : union[g][notEmpty[0]].datas[i];
                                    var b = (notEmpty[1] == index) ? newunion[i] : union[g][notEmpty[1]].datas[i];
                                    var c = arrayInter(a, b);
                                    var d = (notEmpty[2] == index) ? newunion[i] : union[g][notEmpty[2]].datas[i];

                                    newintersection[i] = arrayInter(c, d);
                                } else if (len == 4) {
                                    var a = (notEmpty[0] == index) ? newunion[i] : union[g][notEmpty[0]].datas[i];
                                    var b = (notEmpty[1] == index) ? newunion[i] : union[g][notEmpty[1]].datas[i];
                                    var c = arrayInter(a, b);
                                    var d = (notEmpty[2] == index) ? newunion[i] : union[g][notEmpty[2]].datas[i];
                                    var e = (notEmpty[3] == index) ? newunion[i] : union[g][notEmpty[3]].datas[i];
                                    var f = arrayInter(d, e);

                                    newintersection[i] = arrayInter(c, f);
                                }
                            }


                            //updated union[g]
                            for (var i = 0; i < 4; i++) {
                                union[g][index].datas[i] = arrayUnion(union[g][index].datas[i], newunion[i]);
                            }


                            //updated intersection
                            for (var i = 0; i < 4; i++) {
                                var t = angles[index].slice();
                                var min = arrayMinus(t, added);
                                if (min.length == 0) {
                                    //if first time constraint applied on this elemement
                                    intersection[g][i] = newintersection[i];
                                } else {
                                    intersection[g][i] = arrayUnion(intersection[g][i], newintersection[i]);
                                }
                            }


                        }

                        if (removed.length != 0) { //angles were removed
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
                             * ie. union[i].datas[j] =minus(union[i].datas[j],dataset_inner_chart) (*)[1.]
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
                                        newunion[k] = arrayUnion(data_grouped_per_angle[g][index][removed[j] + q], newunion[k]);
                                    }
                                }

                            }

                            //update union
                            for (var i = 0; i < 4; i++) {
                                union[g][index].datas[i] = arrayMinus(union[g][index].datas[i], newunion[i]);
                            }

                            //update intersection
                            for (var i = 0; i < 4; i++) {
                                var notEmpty = [];
                                //only intersect sets that are not empty, else we get empty array.
                                for (var j = 0; j < 4; j++) {
                                    if (union[g][j].datas[i].length != 0) {
                                        notEmpty.push(j);
                                    }
                                }

                                //calc intersection
                                var len = notEmpty.length;
                                if (len == 0) intersection[g][i] = []
                                if (len == 1) {
                                    intersection[g][i] = union[g][notEmpty[0]].datas[i];
                                } else if (len == 2) {
                                    var a = union[g][notEmpty[0]].datas[i];
                                    var b = union[g][notEmpty[1]].datas[i];

                                    intersection[g][i] = arrayInter(a, b);

                                } else if (len == 3) {
                                    var a = union[g][notEmpty[0]].datas[i];
                                    var b = union[g][notEmpty[1]].datas[i];
                                    var c = arrayInter(a, b);
                                    var d = union[g][notEmpty[2]].datas[i];

                                    intersection[g][i] = arrayInter(c, d);
                                } else if (len == 4) {
                                    var a = union[g][notEmpty[0]].datas[i];
                                    var b = union[g][notEmpty[1]].datas[i];
                                    var c = arrayInter(a, b);
                                    var d = union[g][notEmpty[2]].datas[i];
                                    var e = union[g][notEmpty[3]].datas[i];
                                    var f = arrayInter(d, e);

                                    intersection[g][i] = arrayInter(c, f);
                                }
                            }


                        }
                        //update data_inner_updated
                        /**take angle-is-at value to be the FROM value. round values */

                        week_applies_comp[g].map(function(d) { d.freq = [0, 0] });
                        cccc = [0, 0, 0, 0];

                        for (var i = 0; i < 4; i++) {

                            wkap = week_applies_comp[g].map(d => d.Week_Year);
                            /**take angle-is-at value to be the FROM value. round values */
                            for (var j = 0; j < intersection[g][i].length; j++) {
                                var k = intersection[g][i][j].element_ang[i];
                                var k_angle = Math.floor(k / grouping);
                                var ind = wkap.indexOf(intersection[g][i][j].Week);

                                if (element_applies(g, intersection[g][i][j])) {

                                    if (intersection[g][i][j].Element == i) {

                                        data_inner_updated[i][2 * k_angle + g].val[0]++;
                                        if (ind != -1) week_applies_comp[g][ind].freq[0]++;
                                        if (ind != -1) {
                                            week_applies_comp[g][ind].freq[1] += intersection[g][i][j].time_to_next;
                                        }

                                    }



                                    data_inner_updated[i][2 * k_angle + g].val[1] += intersection[g][i][j].time_to_next;
                                    if (intersection[g][i][j].Element == i) data_inner_updated[i][2 * k_angle + g].data[k - (k_angle * grouping)].val[0]++;
                                    data_inner_updated[i][2 * k_angle + g].data[k - (k_angle * grouping)].val[1] += intersection[g][i][j].time_to_next;
                                }

                            }

                        }

                        //console.log('week_applies_comp  ' + g);
                        //console.log(week_applies_comp[g]);
                        draw_freq_to_week_histo_comp(week_applies_comp[g], scale, g);

                    }

                    //update/draw percentage barchart based on dataset_inner_chart and the same scale as the radial histograms
                    /**
                     * returns wether the given element adheres to the given filters of group g
                     * @param {*} group 
                     * @param {*} element 
                     */
                    function element_applies(group, element) {

                        var satisfied = [];



                        if (glb_filter_comp[group][0].length != 0) {
                            satisfied.push(glb_filter_comp[group][0].includes(element.Weekday));
                        }

                        if (glb_filter_comp[group][1] != -1) {
                            satisfied.push(element.Group == glb_filter_comp[group][1]);
                        }

                        if (weeks_filter_comp[group].length != 0) {
                            wf = weeks_filter_comp[group].map(x => x.Week_Year);
                            satisfied.push(wf.includes(element.Week));

                        }


                        app = satisfied.filter(x => x == false).length == 0;
                        return app

                    }

                    dataset_inner_chart = data_inner_updated

                    added = [];
                    removed = [];
                }

                /**
                 * arr1 + arr2 resp. A u B, keeping eliminating duplicates
                 * @param {*} arr1 
                 * @param {*} arr2 
                 */
                function arrayUnion(arr1, arr2) { // no duplicates
                    var a = arr1.concat(arr2);

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

                /**
                 * function return text to be displayed in the tooltip for the given bar
                 * @param {*} scale determines wether to return just an int or a string in a time format
                 * @param {*} x the value for a bar
                 * @param {*} gr 
                 */
                function getTimeString(scale, x, gr) {
                    if (scale == 1) {
                        sec = 1000;
                        min = 60000;
                        hour = 60 * min;

                        var t = x;
                        // d = Math.floor(t / day);
                        // t = t - d * day;
                        h = Math.floor(t / hour);
                        t = t - h * hour;
                        m = Math.floor(t / min);
                        t = t - m * min;
                        s = Math.floor(t / sec);
                        ms = t - s * sec;
                        return h + 'h ' + m + 'm ' + s + 's'
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

                        // arc of the inner histogram
                        var arc = d3.arc() // imagine your doing a part of a donut plot
                            .innerRadius(innerRadius)
                            .outerRadius(function(d, i) {
                                var data_value = d.val[scale];
                                if (referenceType == 1) {
                                    data_value /= total_val[k][i % 2][scale];
                                }
                                return yScales[k](data_value);

                            })
                            .startAngle(function(d, i) {
                                return x((i + Math.floor(360 * NRGROUPS / (grouping))) % Math.floor(360 * NRGROUPS / (grouping)));
                            })
                            .endAngle(function(d, i) {
                                return x((i + Math.floor(360 * NRGROUPS / (grouping))) % Math.floor(360 * NRGROUPS / (grouping))) + x.bandwidth();
                            })
                            .padAngle(0.001)
                            .padRadius(innerRadius)

                        svgarr[k]
                            .append("g")
                            .attr('id', 'temp' + k)
                            .selectAll("path")
                            .data(dataset_inner_chart[k])
                            .enter()
                            .append("path")
                            .attr("fill", function(d, i) {

                                if (i % 2 == 0) {
                                    return darkcol[k]
                                } else {
                                    return texture_g2_inner[k].url();
                                }
                            })
                            .attr("d", arc)
                            .attr("class", function(d, i) {
                                if (i % 2 == 0) {
                                    return "bar" + Math.floor(i / 2) + '_in_left' + k;
                                } else {
                                    return "bar" + Math.floor(i / 2) + '_in_right' + k;
                                } //
                            })

                        svgarr[k].call(texture_g2_inner[k])
                        svgarr[k].call(texture_g2_inner_darkorange)


                    }
                }

                /**
                 * update/draw spatial mapping of probability distribution for the given inner histogram dataset.
                 * For each data element in dataset_inner_chart, draw one corresponding element and give it the opacity depending on 'freq' value.
                 * @param {*} dataset_inner_chart 
                 */
                function update_density_plots(dataset_inner_chart) {

                    var draw_data = [dataset_inner_chart[0], dataset_inner_chart[1], dataset_inner_chart[2], dataset_inner_chart[3]];


                    /**
                     * For each element i DW,DS,LA,LD
                     * separate dataset (draw_data[i]) into data of g1 and g2, extracting only the valid info (val and index of the datainstance in dataset)
                     * --> do so by choosing even index for g1 and odd for g2.
                     * then order them according to val. 
                     * Then draw the elments in the given order(max val first per group)
                     * (but first remove previously drawn elements)
                     */

                    //DW  
                    d3.selectAll('.DW-lines').remove();

                    order_g1 = [];
                    order_g2 = [];
                    maxf = [0, 0];

                    for (var j = 0; j < draw_data[0].length; j++) {

                        for (var i = 0; i < grouping; i++) {
                            if (draw_data[0][j].data[i].val[scale] != 0) {

                                if (j % 2 == 0) {
                                    maxf[0] = Math.max(maxf[0], draw_data[0][j].data[i].val[scale]);
                                    order_g1.push({ val: draw_data[0][j].data[i].val[scale], pos: j, pos2: i })
                                } else {

                                    maxf[1] = Math.max(maxf[1], draw_data[0][j].data[i].val[scale]);
                                    order_g2.push({ val: draw_data[0][j].data[i].val[scale], pos: j, pos2: i })

                                }
                            }
                        }
                    }
                    order_g1.sort(function(a, b) {
                        return a.val - b.val;
                    })
                    order_g2.sort(function(a, b) {
                        return a.val - b.val;
                    })


                    maxf[0] *= 1.2
                    maxf[1] *= 1.2


                    var i = 0;
                    for (var k = 0; k < order_g1.length; k++) {

                        j = order_g1[k].pos
                        i = order_g1[k].pos2
                        d3.selectAll('#Ebene_1_left')
                            .append('svg')
                            .attr('width', 800)
                            .attr('height', 800)
                            .append('rect')
                            .attr('class', 'DW-lines')
                            .attr('id', 'DW' + i + '_left' + j)
                            .attr("width", 4.53)
                            .attr("height", 161.57)
                            .style('opacity', alpha(draw_data[0][j].data[i].val[scale], maxf[0], 0)) // draw_data[0][j].data[i].val[scale] / (data_freq[0][draw_data[0][j].data[i].angle].val[scale] + 10))
                            .attr('transform', 'translate(549.28,333.47) rotate(52.7)')
                            .attr('transform', 'translate(453.737 364.794) rotate(' + (draw_data[0][j].data[i].angle - 209) + ',2.263, 42.486)')

                    }
                    for (var k = 0; k < order_g2.length; k++) {

                        j = order_g2[k].pos
                        i = order_g2[k].pos2
                        d3.selectAll('#Ebene_1_right')
                            .append('svg')
                            .attr('width', 800)
                            .attr('height', 800)
                            .append('rect')
                            .attr('class', 'DW-lines')
                            .attr('id', 'DW' + i + '_left' + j)
                            .attr("width", 4.53)
                            .attr("height", 161.57)
                            .style('opacity', alpha(draw_data[0][j].data[i].val[scale], maxf[1], 0)) // draw_data[0][j].data[i].val[scale] / (data_freq[0][draw_data[0][j].data[i].angle].val[scale] + 10))
                            .attr('transform', 'translate(549.28,333.47) rotate(52.7)')
                            .attr('transform', 'translate(453.737 364.794) rotate(' + (draw_data[0][j].data[i].angle - 209) + ',2.263, 42.486)')

                    }


                    d3.selectAll('.DS-lines').remove();

                    //DS
                    order_g1 = [];
                    order_g2 = [];

                    maxf = [0, 0];
                    for (var j = 0; j < draw_data[1].length; j++) {
                        for (var i = 0; i < grouping; i++) {
                            if (draw_data[1][j].data[i].val[scale] != 0) {
                                if (j % 2 == 0) {
                                    maxf[0] = Math.max(maxf[0], draw_data[1][j].data[i].val[scale]);

                                    order_g1.push({ val: draw_data[1][j].data[i].val[scale], pos: j, pos2: i })
                                } else {
                                    maxf[1] = Math.max(maxf[1], draw_data[1][j].data[i].val[scale]);
                                    order_g2.push({ val: draw_data[1][j].data[i].val[scale], pos: j, pos2: i })

                                }
                            }
                        }
                    }

                    order_g1.sort(function(a, b) {
                        return a.val - b.val;
                    })
                    order_g2.sort(function(a, b) {
                        return a.val - b.val;
                    })

                    for (var k = 0; k < order_g1.length; k++) {

                        j = order_g1[k].pos
                        i = order_g1[k].pos2
                        d3.selectAll('#Ebene_1_left')
                            .append('svg')
                            .attr('width', 800)
                            .attr('height', 800)
                            .append('rect')
                            .attr('class', 'DS-lines')
                            .attr('id', 'DS' + i + '_left' + j)
                            .attr("width", 34.55)
                            .attr("height", 68.03)
                            .style('opacity', alpha(draw_data[1][j].data[i].val[scale], maxf[0], 1))
                            .attr('transform', 'translate(515 501.1) rotate(' + (draw_data[1][j].data[i].angle + 77) + ' ,30.37, 3.95)')

                    }
                    for (var k = 0; k < order_g2.length; k++) {

                        j = order_g2[k].pos
                        i = order_g2[k].pos2
                        d3.selectAll('#Ebene_1_right')
                            .append('svg')
                            .attr('width', 800)
                            .attr('height', 800)
                            .append('rect')
                            .attr('class', 'DS-lines')
                            .attr('id', 'DS' + i + '_right' + j)
                            .attr("width", 34.55)
                            .attr("height", 68.03)
                            .style('opacity', alpha(draw_data[1][j].data[i].val[scale], maxf[1], 1))
                            .attr('transform', 'translate(515 501.1) rotate(' + (draw_data[1][j].data[i].angle + 77) + ' ,30.37, 3.95)')

                    }


                    d3.selectAll('.LA-lines_bulb').remove();
                    d3.selectAll('.LA-lines_rect1').remove();
                    d3.selectAll('.LA-lines_rect2').remove();
                    d3.selectAll('.LA-lines_rect3').remove();

                    //LA
                    order_g1 = [];
                    order_g2 = [];
                    maxf = [0, 0];

                    for (var j = 0; j < draw_data[2].length; j++) {
                        for (var i = 0; i < grouping; i++) {
                            if (draw_data[2][j].data[i].val[scale] != 0) {
                                if (j % 2 == 0) {
                                    maxf[0] = Math.max(maxf[0], draw_data[2][j].data[i].val[scale]);

                                    order_g1.push({ val: draw_data[2][j].data[i].val[scale], pos: j, pos2: i })
                                } else {
                                    maxf[1] = Math.max(maxf[1], draw_data[2][j].data[i].val[scale]);

                                    order_g2.push({ val: draw_data[2][j].data[i].val[scale], pos: j, pos2: i })

                                }
                            }
                        }
                    }

                    order_g1.sort(function(a, b) {
                        return a.val - b.val;
                    })
                    order_g2.sort(function(a, b) {
                        return a.val - b.val;
                    })

                    for (var k = 0; k < order_g1.length; k++) {
                        j = order_g1[k].pos
                        i = order_g1[k].pos2
                        if (draw_data[2][j].data[i].val[scale] != 0) {

                            d3.selectAll('#Ebene_1_left')
                                .append('g')
                                .append('circle')
                                .attr('class', 'LA-lines_bulb')
                                .attr('id', 'LA' + i + '_left' + j)
                                .attr("cx", 766.46)
                                .attr("cy", 439.282)
                                .attr("r", 4)
                                .attr('transform', 'translate(-39.25,-8.7) rotate(' + (draw_data[2][j].data[i].angle - 91.7) + ',37.25,8.7)')
                                .style('stroke', 'none')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf[0], 2))

                            d3.selectAll('#Ebene_1_left')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LA-lines_rect1')
                                .attr('id', 'LA' + i + '_rect1_left' + j)
                                .attr('x', 762.14)
                                .attr('y', 447.36)
                                .attr("width", 0.7)
                                .attr("height", 82.4789) //+1
                                .attr('transform', 'translate(-35.25,-8.0589) rotate(' + (draw_data[2][j].data[i].angle - 91.7) + ',33.25,8.0589)')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf[0], 2))

                            d3.selectAll('#Ebene_1_left')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LA-lines_rect2')
                                .attr('id', 'LA' + i + '_rect2_left' + j)
                                .attr('x', 763.78)
                                .attr('y', 442.25)
                                .attr("width", 2)
                                .attr("height", 4.314)
                                .attr('transform', 'translate(-37.5,-7.5) rotate(' + (draw_data[2][j].data[i].angle - 91.7) + ',35.5,7.5)')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf[0], 2))


                            d3.selectAll('#Ebene_1_left')
                                .append('svg')
                                .attr('width', 800)
                                .attr('height', 800)
                                .append('rect')
                                .attr('class', 'LA-lines_rect3')
                                .attr('id', 'LA' + i + '_left' + j)
                                .attr('x', 757.91)
                                .attr('y', 454.53)
                                .attr("width", 1.11558 / 3)
                                .attr("height", 2.61228)
                                .attr('transform', 'translate(-31.78,-6.6) rotate(' + ((draw_data[2][j].data[i].angle - 91.7)) + ',29.78,6.6)')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf[0], 2))

                        }

                    }

                    for (var k = 0; k < order_g2.length; k++) {
                        j = order_g2[k].pos
                        i = order_g2[k].pos2
                        if (draw_data[2][j].data[i].val[scale] != 0) {

                            d3.selectAll('#Ebene_1_right')
                                .append('g')
                                .append('circle')
                                .attr('class', 'LA-lines_bulb')
                                .attr('id', 'LA' + i + '_right' + j)
                                .attr("cx", 766.46)
                                .attr("cy", 439.282)
                                .attr("r", 4)
                                .attr('transform', 'translate(-39.25,-8.7) rotate(' + (draw_data[2][j].data[i].angle - 91.7) + ',37.25,8.7)')
                                .style('stroke', 'none')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf[1], 2))

                            d3.selectAll('#Ebene_1_right')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LA-lines_rect1')
                                .attr('id', 'LA' + i + '_rect1_right' + j)
                                .attr('x', 762.14)
                                .attr('y', 447.36)
                                .attr("width", 0.7)
                                .attr("height", 82.4789) //+1
                                .attr('transform', 'translate(-35.25,-8.0589) rotate(' + (draw_data[2][j].data[i].angle - 91.7) + ',33.25,8.0589)')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf[1], 2))

                            d3.selectAll('#Ebene_1_right')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LA-lines_rect2')
                                .attr('id', 'LA' + i + '_rect2_right' + j)
                                .attr('x', 763.78)
                                .attr('y', 442.25)
                                .attr("width", 2)
                                .attr("height", 4.314)
                                .attr('transform', 'translate(-37.5,-7.5) rotate(' + (draw_data[2][j].data[i].angle - 91.7) + ',35.5,7.5)')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf[1], 2))


                            d3.selectAll('#Ebene_1_right')
                                .append('svg')
                                .attr('width', 800)
                                .attr('height', 800)
                                .append('rect')
                                .attr('class', 'LA-lines_rect3')
                                .attr('id', 'LA' + i + '_right' + j)
                                .attr('x', 757.91)
                                .attr('y', 454.53)
                                .attr("width", 1.11558 / 3)
                                .attr("height", 2.61228)
                                .attr('transform', 'translate(-31.78,-6.6) rotate(' + ((draw_data[2][j].data[i].angle - 91.7)) + ',29.78,6.6)')
                                .style('opacity', alpha(draw_data[2][j].data[i].val[scale], maxf[1], 2))


                        }

                    }

                    d3.selectAll('.LD-lines_bulb').remove();
                    d3.selectAll('.LD-lines_rect1').remove();
                    d3.selectAll('.LD-lines_rect2').remove();
                    d3.selectAll('.LD-lines_rect3').remove();

                    //LD
                    order_g1 = []
                    order_g2 = []
                    maxf = [0, 0];

                    for (var j = 0; j < draw_data[3].length; j++) {
                        for (var i = 0; i < grouping; i++) {
                            if (j % 2 == 0) {
                                maxf[0] = Math.max(draw_data[3][j].data[i].val[scale], maxf[0]);

                                order_g1.push({ val: draw_data[3][j].data[i].val[scale], pos: j, pos2: i })
                            } else {
                                maxf[1] = Math.max(draw_data[3][j].data[i].val[scale], maxf[1]);

                                order_g2.push({ val: draw_data[3][j].data[i].val[scale], pos: j, pos2: i })

                            }
                        }
                    }

                    for (var k = 0; k < order_g1.length; k++) {

                        j = order_g1[k].pos
                        i = order_g1[k].pos2

                        if (draw_data[3][j].data[i].val[scale] != 0) {

                            d3.selectAll('#Ebene_1_left')
                                .append('g')
                                .append('circle')
                                .attr('class', 'LD-lines_bulb')
                                .attr('id', 'LD' + i + '_left' + j)
                                .attr("cx", 548)
                                .attr("cy", 407.2)
                                .attr("r", 4)
                                .attr('transform', 'translate(0.01,-0.1) rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.9) + ',0,0.1)')
                                .style('stroke', 'none')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf[0], 3))

                            d3.selectAll('#Ebene_1_left')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LD-lines_rect1')
                                .attr('id', 'LD' + i + '_rect1_left' + j)
                                .attr('x', 457.8)
                                .attr('y', 407.03)
                                .attr("height", 0.7)
                                .attr("width", 81.4789) //+1
                                .attr('transform', 'translate(0.3,0.25) rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.5) + ',-0.3,-0.25)')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf[0], 3))


                            d3.selectAll('#Ebene_1_left')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LD-lines_rect2')
                                .attr('id', 'LD' + i + '_rect2_left' + j)
                                .attr('x', 544.5 - 4.8)
                                .attr('y', 415.05 - 8.85)
                                .attr("height", 2)
                                .attr("width", 4.214)
                                .attr('transform', 'translate(0.0,0.6) rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.4) + ',0.0,-0.6)')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf[0], 3))


                            d3.selectAll('#Ebene_1_left')
                                .append('svg')
                                .attr('width', 800)
                                .attr('height', 800)
                                .append('rect')
                                .attr('class', 'LD-lines_rect3')
                                .attr('id', 'LD' + i + '_left' + j)
                                .attr('x', 525.15)
                                .attr('y', 413.09 - 7)
                                .attr("height", 1.11558 / 3)
                                .attr("width", 2.61228)
                                .attr('transform', 'translate(0.15,' + (1.11558 / 6) + ') rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.75) + ',-0.1,' + (-1.11558 / 6) + ')')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf[0], 3))

                        }

                    }
                    for (var k = 0; k < order_g2.length; k++) {

                        j = order_g2[k].pos
                        i = order_g2[k].pos2

                        if (draw_data[3][j].data[i].val[scale] != 0) {

                            d3.selectAll('#Ebene_1_right')
                                .append('g')
                                .append('circle')
                                .attr('class', 'LD-lines_bulb')
                                .attr('id', 'LD' + i + '_right' + j)
                                .attr("cx", 548)
                                .attr("cy", 407.2)
                                .attr("r", 4)
                                .attr('transform', 'translate(0.01,-0.1) rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.9) + ',0,0.1)')
                                .style('stroke', 'none')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf[1], 3))

                            d3.selectAll('#Ebene_1_right')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LD-lines_rect1')
                                .attr('id', 'LD' + i + '_rect1_right' + j)
                                .attr('x', 457.8)
                                .attr('y', 407.03)
                                .attr("height", 0.7)
                                .attr("width", 81.4789) //+1
                                .attr('transform', 'translate(0.3,0.25) rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.5) + ',-0.3,-0.25)')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf[1], 3))


                            d3.selectAll('#Ebene_1_right')
                                .append('svg')
                                .attr('width', 1000)
                                .attr('height', 1000)
                                .append('rect')
                                .attr('class', 'LD-lines_rect2')
                                .attr('id', 'LD' + i + '_rect2_right' + j)
                                .attr('x', 544.5 - 4.8)
                                .attr('y', 415.05 - 8.85)
                                .attr("height", 2)
                                .attr("width", 4.214)
                                .attr('transform', 'translate(0.0,0.6) rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.4) + ',0.0,-0.6)')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf[1], 3))


                            d3.selectAll('#Ebene_1_right')
                                .append('svg')
                                .attr('width', 800)
                                .attr('height', 800)
                                .append('rect')
                                .attr('class', 'LD-lines_rect3')
                                .attr('id', 'LD' + i + '_right' + j)
                                .attr('x', 525.15)
                                .attr('y', 413.09 - 7)
                                .attr("height", 1.11558 / 3)
                                .attr("width", 2.61228)
                                .attr('transform', 'translate(0.15,' + (1.11558 / 6) + ') rotate(' + (draw_data[3][j].data[i].angle - offset[3] + 5.75) + ',-0.1,' + (-1.11558 / 6) + ')')
                                .style('opacity', alpha(draw_data[3][j].data[i].val[scale], maxf[1], 3))

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
                 * 
                 * 
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
                                    ////console.log(newangles)
                                    for (var g = 0; g < NRGROUPS; g++) {
                                        dataset_inner_chart[l][c * NRGROUPS + g].clicked = true;
                                        dataset_outer_chart[l][c * NRGROUPS + g].clicked = true;

                                        r_left = 'orange';
                                        r_right = texture_g2_com[l].background('orange').url()

                                        d3.selectAll('.bar' + c + '_right' + l).attr('fill', r_right); //!
                                        d3.selectAll('.bar' + c + '_left' + l).attr('fill', r_left);
                                    }

                                }
                            }
                        }

                        angles[l] = newangles;

                        update_comparison_dataset_inner();
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
                    update_density_plots(dataset_inner_chart)

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
        as = (Math.pow(0.6, 1 / max));

    } else if (index > 1) {
        as = (Math.pow(0.2, 1 / max));
    } else {
        as = (Math.pow(0.3, 1 / max));
    }
    return 1 - Math.pow((as), a)
}