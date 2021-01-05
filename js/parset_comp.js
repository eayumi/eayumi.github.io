//https://github.com/jasondavies/d3-parsets
//Copyright (c) 2012, Jason Davies
// All rights reserved.

d3.rebind = function(target, source) {
    var i = 1,
        n = arguments.length,
        method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
};

// Method is assumed to be a standard D3 getter-setter:
// If passed with no arguments, gets the value.
// If passed with arguments, sets the value and returns the target.
function d3_rebind(target, source, method) {
    return function() {
        var value = method.apply(source, arguments);
        return value === source ? target : value;
    };
}

/**
 * draws the parallel set for the set of test-subjects that apply to the filters of the two groups
 * The packacke d3-parset was written for d3 v4, so we use v4 here, instead of v5
 * @param {*} profile 
 */
function parset_comp(profile) {

    //only consider weeks that have passed and that are considered for evaluation in the bachelor thesis
    var data_filt = data_profile //.filter(x => x.Week_Year.substring(3, 5) == '19' || (parseInt(x.Week_Year.substring(0, 3)) < 35 && x.Week_Year.substring(3, 5) == '20'));
        // for (i = 0; i < data_filt.length; i++) {
        //     data_filt[i].Week_Year = data_filt[i].Week_Year.substring(0, 2);
        // }
        //the weeks of each group
    wf1 = profile[0].map(x => x.Week_Year)
    wf2 = profile[1].map(x => x.Week_Year)

    //Helpers to map attributes to names more readable /understandable 
    function era(d) {
        if (d == '') {
            return "unknown";
        }
        return d

    }

    function wk(d) {
        if (d == '') {
            return "unknown";
        } else {
            return d // d.substring(0, 2);
        }
    }

    function Age(d) {
        if (d == '') {
            return "unknown";
        }
        return d
    }

    function gender(d) {
        if (d == 'w') {
            return "female";
        } else if (d == 'm') {
            return 'male'
        }
        return d
    }

    function househ(d) {
        if (d == 'alone') {
            return "single";
        } else if (d == 'in twos') {
            return 'two person'
        } else if (d == 'more') {
            return 'more'
        }
        return d
    }

    function emp(d) {
        if (d == '') return 'unknown';
        d = d[0]
        if (d == 'A') {
            return "student"
        } else if (d == 'B') {
            return "employed"
        } else if (d == 'C') {
            return 'part' //'Part Time Employed'
        } else if (d == 'D') {
            return 'none' //'Retired/Unemployed'
        } else {
            return 'unknown'
        }
    }
    //the categories to be shwon in the parallel set, in the given order
    var keys_ = [
        'Age',
        'Group',
        'Gender',
        'Occupation',
        'Week_Year',
        'Test Subject',
        'Gender of Pairs',
        'Current Housing Situation',
        'Household',
        'Recent Changes in Home',
    ];

    var data_parset = [];
    console.log(data_filt)
    for (x in data_filt) {

        if (wf1.includes(data_filt[x].Week_Year) || wf2.includes(data_filt[x].Week_Year)) {
            console.log(0)
            var g = 'both';
            if (wf1.includes(data_filt[x].Week_Year) && wf2.includes(data_filt[x].Week_Year)) {
                g = 'both'
            } else if (wf1.includes(data_filt[x].Week_Year)) {
                g = 'Group 1'
            } else {
                g = 'Group 2'
            }


            if (data_filt[x].Person2 == '') {
                data_parset.push({
                    'Group': g,
                    'Age': "" + Age(data_filt[x].Age1),
                    'Gender': gender(data_filt[x].Gender1),
                    'Occupation': emp(data_filt[x].OccupationCategory1),
                    'Current Housing Situation': era(data_filt[x].HousingUnit1),
                    'Test Subject': 'single',
                    // 'Changes': era(data_filt[x].Changes1),
                    // 'RoomsCat': era(data_filt[x].RoomsCat1),
                    'Household': househ(data_filt[x].LivingSize1),
                    'Recent Changes in Home': era(data_filt[x].ChangeCat1),
                    'Week_Year': wk(data_filt[x].Week_Year),
                    'Gender of Pairs': 'not a pair'



                });

            } else {

                data_parset.push({
                    'Group': g,
                    'Age': "" + Age(data_filt[x].Age1),
                    'Gender': gender(data_filt[x].Gender1),
                    'Occupation': emp(data_filt[x].OccupationCategory1),
                    'Current Housing Situation': era(data_filt[x].HousingUnit1),
                    'Test Subject': 'two person',
                    // 'Changes': era(data_filt[x].Changes1),
                    // 'RoomsCat': era(data_filt[x].RoomsCat1),
                    'Household': househ(data_filt[x].LivingSize1),
                    'Recent Changes in Home': era(data_filt[x].ChangeCat1),
                    'Gender of Pairs': gender(data_filt[x].GendersCat),
                    'Week_Year': wk(data_filt[x].Week_Year)

                });
                data_parset.push({
                    'Group': g,
                    'Age': "" + Age(data_filt[x].Age2),
                    'Gender': gender(data_filt[x].Gender2),
                    'Occupation': emp(data_filt[x].OccupationCategory2),
                    'Current Housing Situation': era(data_filt[x].HousingUnit2),
                    'Test Subject': 'two person',
                    // 'Changes': era(data_filt[x].Changes2),
                    // 'RoomsCat': era(data_filt[x].RoomsCat2),
                    'Household': househ(data_filt[x].LivingSize2),
                    'Recent Changes in Home': era(data_filt[x].ChangeCat2),
                    'Gender of Pairs': gender(data_filt[x].GendersCat),
                    'Week_Year': wk(data_filt[x].Week_Year)
                });
            }
        }
    }
    //Draw the parallel set

    console.log(data_parset)
    var height = 800;
    var width = 1000

    var chart = d3v3411.parsets()
        .height(width)
        .width(height)
        .tension(0.8) //curvyness
        .dimensions(keys_);


    var vis = d3v3411.selectAll("#parsetcomp").append("svg")
        .attr("width", chart.width())
        .attr("height", chart.height() + 30)
        .attr('tension', 0.5)
        .attr('id', 'parsetcomp_');


    vis.datum(data_parset).call(chart);

}