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
 * draws the parallel set for the set of test-subjects that apply to the filters.
 * The packacke d3-parset was written for d3 v4, so we use v4 here, instead of v5
 * @param {*} profile 
 */
function parset(profile) {
    datas = profile.slice();
    // d3.json('../data/Bewohner.json', function(datas) {
    console.log(datas)

    console.log(datas.length)
        // datas = datas.filter(x => x.Week_Year.substring(3, 5) == '19' || (parseInt(x.Week_Year.substring(0, 3)) < 35 && x.Week_Year.substring(3, 5) == '20'));
    console.log(datas.length)
        // OccupationCategory1

    function era(d) {
        if (d == '') {
            return "unknown";
        }
        return d
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
            return "Single";
        } else if (d == 'in twos') {
            return 'Two Person'
        } else if (d == 'more') {
            return 'More'
        }
        return d
    }

    function emp(d) {
        if (d == '') return 'unknown';
        d = d[0]
        if (d == 'A') {
            return "Student"
        } else if (d == 'B') {
            return "Employed"
        } else if (d == 'C') {
            return 'Part Time Employed'
        } else if (d == 'D') {
            return 'Retired/Unemployed'
        } else {
            return 'unknown'
        }
    }

    function wk(d) {
        if (d == '') {
            return "unknown";
        } else {
            return d.substring(0, 2);
        }
    }

    //the categories to be shwon in the parallel set, in the given order
    var keys_ = [
        'Age',
        'Gender',
        'Occupation',
        'Week_Year',
        'Test Subject',
        'Gender of Pairs',
        'Housing Unit',
        'Current Housing Situation',
        'Household',
        'Recent Changes in Home',
    ];
    var data = [];

    for (x in datas) {
        if (datas[x].Person2 == '') {
            data.push({
                'Age': "" + Age(datas[x].Age1),
                'Gender': gender(datas[x].Gender1),
                'Occupation': emp(datas[x].OccupationCategory1),
                'Current Housing Situation': era(datas[x].HousingUnit1),
                'Test Subject': 'Single',
                // 'Changes': era(datas[x].Changes1),
                // 'RoomsCat': era(datas[x].RoomsCat1),
                'Household': househ(datas[x].LivingSize1),
                'Recent Changes in Home': era(datas[x].ChangeCat1),
                'Week_Year': wk(datas[x].Week_Year),
                'Gender of Pairs': 'not a pair'

            });

        } else {

            data.push({
                'Age': "" + Age(datas[x].Age1),
                'Gender': gender(datas[x].Gender1),
                'Occupation': emp(datas[x].OccupationCategory1),
                'Current Housing Situation': era(datas[x].HousingUnit1),
                'Test Subject': 'Two Person',
                // 'Changes': era(datas[x].Changes1),
                // 'RoomsCat': era(datas[x].RoomsCat1),
                'Household': househ(datas[x].LivingSize1),
                'Recent Changes in Home': era(datas[x].ChangeCat1),
                'Gender of Pairs': gender(datas[x].GendersCat),
                'Week_Year': wk(datas[x].Week_Year)


            });
            data.push({
                'Age': "" + Age(datas[x].Age2),
                'Gender': gender(datas[x].Gender2),
                'Occupation': emp(datas[x].OccupationCategory2),
                'Current Housing Situation': era(datas[x].HousingUnit2),
                'Test Subject': 'Two Person',
                // 'Changes': era(datas[x].Changes2),
                // 'RoomsCat': era(datas[x].RoomsCat2),
                'Household': househ(datas[x].LivingSize2),
                'Recent Changes in Home': era(datas[x].ChangeCat2),
                'Gender of Pairs': gender(datas[x].GendersCat),
                'Week_Year': wk(datas[x].Week_Year)



            });
        }
    }
    //Draw the parallel set

    console.log(data)
    var height = 900;
    var width = 1000

    var chart = d3v3411.parsets()
        .height(width)
        .width(height)
        .tension(0.8) //curvyness
        .dimensions(keys_);

    var vis = d3v3411.selectAll("#parset").append("svg")
        .attr("width", chart.width())
        .attr("height", chart.height() + 30)
        .attr('tension', 0.5)
        .attr('id', 'parsetsingle');


    vis.datum(data).call(chart);

}