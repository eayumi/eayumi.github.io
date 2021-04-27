function prepare_data_weeks_questionaire() {

    d3.json('../data/Bewohner_Questionnaire.json').then(function(data) {
        const weeks_single = ["34-19", "35-19", "51-19", "04-20", "09-21", "10-21", "12-21", "13-21", /**/ "38-19", "39-19", "47-19", "02-20", "06-20", "07-20", "08-20", "10-20", "26-20", "28-20", "30-20", "32-20", "36-20", "38-20", "43-20", "44-20", "49-20", "50-20", "51-20", "03-21"];
        const weeks_double = ["37-19", "49-19", "50-19", "03-20", "05-20", "04-21", /**/ "41-19", "42-19", "44-19", "45-19", "46-19", "48-19", "09-20", "11-20", "19-20", "20-20", "22-20", "24-20", "25-20", "27-20", "29-20", "31-20", "33-20", "34-20", "35-20", "37-20", "39-20", "40-20", "41-20", "42-20", "45-20", "46-20", "47-20", "48-20", "52-20", "05-21"];

        /*Every object in data contains the meta-information of one or two test-subjects, depending whether one or two person lived in the Mock-up in the corresponding week.
         * The attributes of the test-subjects can be differentiated by the number (person 1 and person 2)
         */

        //remove empty objects.
        var data_all = data.filter(x => x.Week_Year != '' && x.Person1 != 'entfallt' && x.Person1 != 'folgt');
        var data_single = data_all.filter(x => x.Person2 == '');
        var data_double = data_all.filter(x => x.Person2 != '');


        //32-20, 49-20

        var weeks_per_category = {
                Group: [],
                Age: [
                    [],
                    []
                ],
                Gender: [
                    [],
                    []
                ],
                Occupation: [
                    [],
                    []
                ]
            } //single-double


        console.log(data_all)
        console.log(data_single)
        console.log(data_double)
            //   console.log(weeks_single)
            // console.log(weeks_double)


        //Ts
        weeks_per_category.Group.push(weeks_single) //data_single.map(d => d.Week_Year))
        weeks_per_category.Group.push(weeks_double) //data_double.map(d => d.Week_Year))

        //age
        weeks_per_category.Age[0].push(data_all.filter(d => d.Age1 == '18-30').map(d => d.Week_Year));
        weeks_per_category.Age[0].push(data_all.filter(d => d.Age1 == '30-45').map(d => d.Week_Year));
        weeks_per_category.Age[0].push(data_all.filter(d => d.Age1 == '45-60').map(d => d.Week_Year));
        weeks_per_category.Age[0].push(data_all.filter(d => d.Age1 == '60-75').map(d => d.Week_Year));

        weeks_per_category.Age[1].push(data_all.filter(d => d.Age2 == '18-30').map(d => d.Week_Year));
        weeks_per_category.Age[1].push(data_all.filter(d => d.Age2 == '30-45').map(d => d.Week_Year));
        weeks_per_category.Age[1].push(data_all.filter(d => d.Age2 == '45-60').map(d => d.Week_Year));
        weeks_per_category.Age[1].push(data_all.filter(d => d.Age2 == '60-75').map(d => d.Week_Year));

        //gender

        weeks_per_category.Gender[0].push(data_all.filter(d => d.Gender1 == 'w').map(d => d.Week_Year));
        weeks_per_category.Gender[0].push(data_all.filter(d => d.Gender1 == 'm').map(d => d.Week_Year));

        weeks_per_category.Gender[1].push(data_all.filter(d => d.Gender2 == 'w').map(d => d.Week_Year));
        weeks_per_category.Gender[1].push(data_all.filter(d => d.Gender2 == 'm').map(d => d.Week_Year));

        //occupation

        weeks_per_category.Occupation[0].push(data_all.filter(d => d.OccupationCategory1[0] == 'A').map(d => d.Week_Year));
        weeks_per_category.Occupation[0].push(data_all.filter(d => d.OccupationCategory1[0] == 'B').map(d => d.Week_Year));
        weeks_per_category.Occupation[0].push(data_all.filter(d => d.OccupationCategory1[0] == 'C').map(d => d.Week_Year));
        weeks_per_category.Occupation[0].push(data_all.filter(d => d.OccupationCategory1[0] == 'D').map(d => d.Week_Year));

        weeks_per_category.Occupation[1].push(data_all.filter(d => d.OccupationCategory2[0] == 'A').map(d => d.Week_Year));
        weeks_per_category.Occupation[1].push(data_all.filter(d => d.OccupationCategory2[0] == 'B').map(d => d.Week_Year));
        weeks_per_category.Occupation[1].push(data_all.filter(d => d.OccupationCategory2[0] == 'C').map(d => d.Week_Year));
        weeks_per_category.Occupation[1].push(data_all.filter(d => d.OccupationCategory2[0] == 'D').map(d => d.Week_Year));

        //------------------------------------------------------------------------------
        var weeks_per_category_array = []; //single-double


        console.log(data_all)
        console.log(data_single)
        console.log(data_double)
            //   console.log(weeks_single)
            // console.log(weeks_double)


        //Ts
        weeks_per_category_array.push(weeks_single) //data_single.map(d => d.Week_Year))
        weeks_per_category_array.push(weeks_double) //data_double.map(d => d.Week_Year))

        //person1
        weeks_per_category_array.push(data_all.filter(d => d.Age1 == '18-30').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.Age1 == '30-45').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.Age1 == '45-60').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.Age1 == '60-75').map(d => d.Week_Year));

        weeks_per_category_array.push(data_all.filter(d => d.Gender1 == 'w').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.Gender1 == 'm').map(d => d.Week_Year));

        weeks_per_category_array.push(data_all.filter(d => d.OccupationCategory1[0] == 'A').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.OccupationCategory1[0] == 'B').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.OccupationCategory1[0] == 'C').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.OccupationCategory1[0] == 'D').map(d => d.Week_Year))

        //person2
        weeks_per_category_array.push(data_all.filter(d => d.Age2 == '18-30').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.Age2 == '30-45').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.Age2 == '45-60').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.Age2 == '60-75').map(d => d.Week_Year));

        weeks_per_category_array.push(data_all.filter(d => d.Gender2 == 'w').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.Gender2 == 'm').map(d => d.Week_Year));


        weeks_per_category_array.push(data_all.filter(d => d.OccupationCategory2[0] == 'A').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.OccupationCategory2[0] == 'B').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.OccupationCategory2[0] == 'C').map(d => d.Week_Year));
        weeks_per_category_array.push(data_all.filter(d => d.OccupationCategory2[0] == 'D').map(d => d.Week_Year));


        console.log(weeks_per_category)

        // toJson(weeks_per_category, 'data_weeks_questionaire.json')
        toJson(weeks_per_category_array, 'data_weeks_questionaire.json')



    });

}