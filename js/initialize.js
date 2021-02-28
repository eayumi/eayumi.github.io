var weeks_single = []; //contains all weeks where single test-subjects lived in the Mock-up
var weeks_double = []; //contain all weeks where two test-subjects lived in the Mock-up
var weeks_out = []; //contains all weeks removed from evaluation
var weeks_all = []; //conatins all weeks 
var data_profile = []; // contains all profiles of test-subjects (single or pairs) not in weeks_out
var weeks_not_out = []; //data_profile
var wno = []; //weeks_single + weeks_double

var weeks_filter = [] //test-subject profiles to be filtered out in single group view 
var weeks_filter_comp = [ //test-subject profiles  to be filtered out in two group COMParison view
    [],
    []
]

const group_color = ['rgb(87, 162, 192)', 'rgb(235, 122, 69)']; //colour of the group

var weekday_filter = []; //

var week_applies = []; // weeks for which filters apply in single group view
var week_applies_comp = [ //weeks for which filters apply in two groups view [index i: weeks for group i+1]
    [],
    []
];



/**
 * Based on the test-subject data file 'Bewohner.json', this function initzializes several arrays that conatin the data/weeks
 * that apply to certain conditions, that are used across all visualizations. 
 * It furhter computes additional attributes out of the existing meta-information in the test-subujects-object read out from the file.
 * At the end it calls the radial_comp and radial function to compute the radial histograms.
 * 
 */
function initialize() {

    d3.json('../data/Bewohner.json').then(function(data) {
        /*Every object in data contains the meta-information of one or two test-subjects, depending whether one or two person lived in the Mock-up in the corresponding week.
         * The attributes of the test-subjects can be differentiated by the number (person 1 and person 2)
         */

        // console.log(data);

        //remove empty objects.
        data = data.filter(x => x.Week_Year != '');
        console.log(data)
            //all weeks
        weeks_all = data.map(x => x.Week_Year);



        //filter data for weeks that are not considered for evaluation and get all those weeks
        weeks_out = data.filter(x => x.Person1 == 'entfällt' || x.Person1 == 'entfallt').map(x => x.Week_Year);

        //filter data for weeks that are NOT considered deleted...
        data_profile = data.filter(x => x.Person1 != 'entfällt' && x.Person1 != 'entfallt');


        //for each test-subjects (single or pair)
        for (var i = 0; i < data_profile.length; i++) {
            d = data_profile[i];

            d.Changes1 = d.Changes1.split(',');
            d.Changes2 = d.Changes2.split(',');

            d.Consistencies1 = (d.Consistencies1 == '') ? [] : d.Consistencies1.split(',');
            d.Consistencies2 = (d.Consistencies12 == '') ? [] : d.Consistencies2.split(',');

            d.OccupationCategory1 = d.OccupationCategory1.charAt(0);
            d.OccupationCategory2 = d.OccupationCategory2.charAt(0);

            d.Group = (d.Person2 == '') ? 0 : 1;

            d.Genders = [d.Gender1, d.Gender2];

            //neutral, tight, spacious
            d.RoomsCat1 = (d.Rooms1 < d.Roomates1) ? 'tight' : ((Math.abs(d.Rooms1 - d.Roomates1) < 1) ? 'neutral' : 'spacious')
            d.RoomsCat2 = (d.Rooms2 < d.Roomates2) ? 'tight' : ((Math.abs(d.Rooms2 - d.Roomates2) < 1) ? 'neutral' : 'spacious')
                //alone, in twos, more
            d.LivingSize1 = (d.Roommates1 == 1) ? 'alone' : ((d.Roommates1 == 2) ? 'in twos' : 'more');
            d.LivingSize2 = (d.Roommates2 == 1) ? 'alone' : ((d.Roommates2 == 2) ? 'in twos' : 'more');
            //nothing, parts, everything
            d.ChangeCat1 = (d.Consistencies1.length != 0) ? ((d.Consistencies1.includes('Alles')) ? 'everything' : ((d.Consistencies1.includes('Keine')) ? 'none' : 'parts')) : 'nothing';
            d.ChangeCat2 = (d.Consistencies2.length != 0) ? ((d.Consistencies2.includes('Alles')) ? 'everything' : ((d.Consistencies2.includes('Keine')) ? 'none' : 'parts')) : 'nothing';

        }

        //filter for only 'single' test-subject profiles and get all the weeks
        weeks_single = data_profile.filter(x => x.Person2 == '').map(x => x.Week_Year);

        //filter for only 'double' trial profiles and get all the weeks
        weeks_double = data_profile.filter(x => x.Person2 != '').map(x => x.Week_Year);
        console.log(weeks_single)
        console.log(weeks_double)


        //gender of pairs of test-subjects (both) w, (both) m or mixed
        for (var i = 0; i < data_profile.length; i++) {
            d = data_profile[i];
            if (weeks_double.includes(d.Week_Year)) {
                d.GendersCat = (d.Gender1 == d.Gender2) ? d.Gender1 : 'mixed';
            }
        }

        //only the weeks in data_profile
        weeks_not_out = data_profile;
        wno = weeks_not_out.map(d => d.Week_Year)

        //Initialize week_applies, week_applies_comp, weeks_filter and weeks_filter_comp: Initially the contain all weeks.

        week_applies = data_profile.map(function(d) { return { 'Week_Year': d.Week_Year, 'freq': 0 } });
        //the Bewohner.josn file also contains info on test-subjects not yet taken part in the study, or weeks we do not consider for evaluatio in the bachelor thesis. These are filtered out
        console.log(data_profile)
            // week_applies = week_applies.filter(x => x.Week_Year.substring(3, 5) == '19' || (parseInt(x.Week_Year.substring(0, 3)) < 35 && x.Week_Year.substring(3, 5) == '20'));

        week_applies_comp[0] = week_applies.slice();
        week_applies_comp[1] = week_applies.slice();

        weeks_filter_comp[0] = data_profile.slice();
        weeks_filter_comp[1] = data_profile.slice();
        weeks_filter = data_profile.slice();

        if (view == 2) {
            //Initializes the week filter in the groups, with only weeks we consider for the evaluation
            for (var i = 0; i < week_applies.length; i++) {
                $week_select_g2.append($('<option>', {
                    value: week_applies[i].Week_Year,
                    text: week_applies[i].Week_Year
                }));
                $week_select_g1.append($('<option>', {
                    value: week_applies[i].Week_Year,
                    text: week_applies[i].Week_Year
                }));

            }

            $week_select_g2.multipleSelect({
                width: 240
            });
            $week_select_g1.multipleSelect({
                width: 240
            });
            document.getElementById('title_word').innerHTML = 'Timeline for ' + '_._._._._';

        } else if (view == 1) {
            for (var i = 0; i < week_applies.length; i++) {
                $week_select.append($('<option>', {
                    value: week_applies[i].Week_Year,
                    text: week_applies[i].Week_Year
                }));
            }
            $week_select.multipleSelect({
                width: 240
            });
            document.getElementById('title_word').innerHTML = 'Timeline for ' + '_._._._._';

        }

        //call funtion for raidal histograms
        if (view == 2) radial_comparison();

    });

}