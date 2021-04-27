function check_filter_number() {
    var filtered_group1 = [];
    var filtered_group = [];
    var text_group = 0;

    var filtered_gender1 = [];
    var filtered_gender = [];
    var text_gender = 0;

    var filtered_age1 = [];
    var filtered_age = [];
    var text_age = 0;

    var datas = [data_profile.filter(d => d.Group == 1), data_profile.filter(d => d.Group == 0)]

    All_choice(datas[1], datas[0]);
    var number_S = datas[1].length;
    var number_D = datas[0].length;
    var totalRes = number_S + number_D;
    document.getElementById('pRes').innerHTML = "(" + totalRes + ")";


    d3.select('#buttonGroup').on('change', function(d) {



        if (selectedGroup == 'Single') {
            document.getElementById('pRes').innerHTML = "(" + number_S + ")";

            Single_choice(datas[1]);
        } else if (selectedGroup == 'Double') {
            document.getElementById('pRes').innerHTML = "(" + number_D + ")";

            Double_choice(datas[0]);
        } else {
            document.getElementById('pRes').innerHTML = "(" + totalRes + ")";

            All_choice(datas[1], datas[0]);
        }

    });


    function Single_choice(data) {
        filtered_group = data.filter(x => x.JobCategory == 'A');
        text_group = filtered_group.length;
        document.getElementById('pA').innerHTML = "Architect (" + text_group + ")";

        filtered_group = data.filter(x => x.JobCategory == 'E');
        text_group = filtered_group.length;

        document.getElementById('pE').innerHTML = "Not Architect (" + text_group + ")";

        filtered_group = data.filter(x => x.JobCategory == 'S');
        text_group = filtered_group.length;

        document.getElementById('pS').innerHTML = "Student (" + text_group + ")";

        filtered_group = data.filter(x => x.JobCategory == 'R');
        text_group = filtered_group.length;

        document.getElementById('pR').innerHTML = "Retired (" + text_group + ")";

        filtered_group = data.filter(x => x.JobCategory == 'U');
        text_group = filtered_group.length;

        document.getElementById('pU').innerHTML = "Unemployed (" + text_group + ")";

        filtered_group = data.filter(x => x.JobCategory == '');
        text_group = filtered_group.length;

        document.getElementById('pND').innerHTML = "Not Defined (" + text_group + ")";


        //--------------------------------GENDER-----------------------------------
        filtered_gender = data.filter(x => x.Gender == 'w');
        text_gender = filtered_gender.length;
        document.getElementById('pWoman').innerHTML = "Woman (" + text_gender + ")";

        filtered_gender = data.filter(x => x.Gender == 'm');
        text_gender = filtered_gender.length;
        document.getElementById('pMan').innerHTML = "Man (" + text_gender + ")";

        document.getElementById('pWW').innerHTML = "(Woman, Woman) (0)";
        document.getElementById('pWM').innerHTML = "(Woman, Man) (0)";
        document.getElementById('pMM').innerHTML = "(Man, Man) (0)";

        //--------------------------------AGE-----------------------------------

        filtered_age = data.filter(x => x.Age == 0);
        text_age = filtered_age.length;
        document.getElementById('p18').innerHTML = "18-30 (" + text_age + ")";

        filtered_age = data.filter(x => x.Age === 1);
        text_age = filtered_age.length;
        document.getElementById('p30').innerHTML = "30-45 (" + text_age + ")";

        filtered_age = data.filter(x => x.Age == 2);
        text_age = filtered_age.length;
        document.getElementById('p45').innerHTML = "45-60 (" + text_age + ")";

        filtered_age = data.filter(x => x.Age == 3);
        text_age = filtered_age.length;
        document.getElementById('p60').innerHTML = "60-75 (" + text_age + ")";




    }

    function Double_choice(data) {
        // DOUBLE: AGE & OCCUPATION:: EITHER of the two

        filtered_group = data.filter(x => x.JobCategoryI == 'A' || x.JobCategoryII == 'A');
        text_group = filtered_group.length;

        document.getElementById('pA').innerHTML = "Architect (" + text_group + ")";

        filtered_group = data.filter(x => x.JobCategoryI == 'E' || x.JobCategoryII == 'E');
        text_group = filtered_group.length;

        document.getElementById('pE').innerHTML = "Not Architect (" + text_group + ")";

        filtered_group = data.filter(x => x.JobCategoryI == 'S' || x.JobCategoryII == 'S');
        text_group = filtered_group.length;

        document.getElementById('pS').innerHTML = "Student (" + text_group + ")";

        filtered_group = data.filter(x => x.JobCategoryI == 'R' || x.JobCategoryII == 'R');
        text_group = filtered_group.length;

        document.getElementById('pR').innerHTML = "Retired (" + text_group + ")";

        filtered_group = data.filter(x => x.JobCategoryI == 'U' || x.JobCategoryII == 'U');
        text_group = filtered_group.length;

        document.getElementById('pU').innerHTML = "Unemployed (" + text_group + ")";
        filtered_group = data.filter(x => x.JobCategoryI == '' || x.JobCategoryII == '');
        text_group = filtered_group.length;

        document.getElementById('pND').innerHTML = "Not Defined (" + text_group + ")";

        //--------------------------------GENDER-----------------------------------

        document.getElementById('pWoman').innerHTML = "Woman (0)";

        document.getElementById('pMan').innerHTML = "Man (0)";


        filtered_gender1 = data.filter(x => x.GenderI == 'w' && x.GenderII == 'w');
        text_gender = filtered_gender1.length;
        document.getElementById('pWW').innerHTML = "(Woman, Woman) (" + text_gender + ")";

        filtered_gender1 = data.filter(x => x.GenderI == 'm' && x.GenderII == 'm');
        text_gender = filtered_gender1.length;
        document.getElementById('pMM').innerHTML = "(Man, Man) (" + text_gender + ")";

        filtered_gender1 = data.filter(x => x.GenderI == 'w' && x.GenderII == 'm');
        filtered_gender = data.filter(x => x.GenderI == 'm' && x.GenderII == 'w');
        text_gender = filtered_gender1.length + filtered_gender.length;
        document.getElementById('pWM').innerHTML = "(Woman, Man) (" + text_gender + ")";

        //--------------------------------AGE-----------------------------------
        //HOW TO DEAL WITH PAIRS?
        filtered_age = data.filter(x => x.AgeI == 0 || x.AgeII == 0);
        text_age = filtered_age.length;
        document.getElementById('p18').innerHTML = "18-30 (" + text_age + ")";

        filtered_age = data.filter(x => x.AgeI == 1 || x.AgeII == 1);
        text_age = filtered_age.length;
        document.getElementById('p30').innerHTML = "30-45 (" + text_age + ")";

        filtered_age = data.filter(x => x.AgeI == 2 || x.AgeII == 2);
        text_age = filtered_age.length;
        document.getElementById('p45').innerHTML = "45-60 (" + text_age + ")";

        filtered_age = data.filter(x => x.AgeI == 3 || x.AgeII == 3);
        text_age = filtered_age.length;
        document.getElementById('p60').innerHTML = "60-75 (" + text_age + ")";

    }

    function All_choice(data_S, data_D) {

        filtered_group1 = data_D.filter(x => x.JobCategoryI == 'A' || x.JobCategoryII == 'A');
        filtered_group = data_S.filter(x => x.JobCategory == 'A');
        text_group = filtered_group.length + filtered_group1.length;
        console.log(text_group)
        document.getElementById('pA').innerHTML = "Architect (" + text_group + ")";

        filtered_group1 = data_D.filter(x => x.JobCategoryI == 'E' || x.JobCategoryII == 'E');
        filtered_group = data_S.filter(x => x.JobCategory == 'E');
        text_group = filtered_group.length + filtered_group1.length;

        document.getElementById('pE').innerHTML = "Not Architect (" + text_group + ")";

        filtered_group1 = data_D.filter(x => x.JobCategoryI == 'S' || x.JobCategoryII == 'S');
        filtered_group = data_S.filter(x => x.JobCategory == 'S');
        text_group = filtered_group.length + filtered_group1.length;

        document.getElementById('pS').innerHTML = "Student (" + text_group + ")";

        filtered_group1 = data_D.filter(x => x.JobCategoryI == 'R' || x.JobCategoryII == 'R');
        filtered_group = data_S.filter(x => x.JobCategory == 'R');
        text_group = filtered_group.length + filtered_group1.length;

        document.getElementById('pR').innerHTML = "Retired (" + text_group + ")";

        filtered_group1 = data_D.filter(x => x.JobCategoryI == 'U' || x.JobCategoryII == 'U');
        filtered_group = data_S.filter(x => x.JobCategory == 'U');
        text_group = filtered_group.length + filtered_group1.length;

        document.getElementById('pU').innerHTML = "Unemployed (" + text_group + ")";

        filtered_group = data_S.filter(x => x.JobCategory == '');
        filtered_group1 = data_D.filter(x => x.JobCategoryII == '' || x.JobCategoryI == '');
        text_group = filtered_group.length + filtered_group1;

        document.getElementById('pND').innerHTML = "Not Defined (" + text_group + ")";


        //--------------------------------GENDER-----------------------------------
        filtered_gender = data_S.filter(x => x.Gender == 'w');
        text_gender = filtered_gender.length;
        document.getElementById('pWoman').innerHTML = "Woman (" + text_gender + ")";

        filtered_gender = data_S.filter(x => x.Gender == 'm');
        text_gender = filtered_gender.length;
        document.getElementById('pMan').innerHTML = "Man (" + text_gender + ")";

        filtered_gender1 = data_D.filter(x => x.GenderI == 'w' && x.GenderII == 'w');
        text_gender = filtered_gender1.length;
        document.getElementById('pWW').innerHTML = "(Woman, Woman) (" + text_gender + ")";

        filtered_gender1 = data_D.filter(x => x.GenderI == 'm' && x.GenderII == 'm');
        text_gender = filtered_gender1.length;
        document.getElementById('pMM').innerHTML = "(Man, Man) (" + text_gender + ")";

        filtered_gender1 = data_D.filter(x => x.GenderI == 'w' && x.GenderII == 'm');
        filtered_gender = data_D.filter(x => x.GenderI == 'm' && x.GenderII == 'w');
        text_gender = filtered_gender1.length + filtered_gender.length;
        document.getElementById('pWM').innerHTML = "(Woman, Man) (" + text_gender + ")";

        //--------------------------------AGE-----------------------------------

        filtered_age = data_S.filter(x => x.Age == 0);
        filtered_age1 = data_D.filter(x => x.AgeI == 0 || x.AgeII == 0);

        text_age = filtered_age.length + filtered_age1.length;
        document.getElementById('p18').innerHTML = "18-30 (" + text_age + ")";

        filtered_age = data_S.filter(x => x.Age === 1);
        filtered_age1 = data_D.filter(x => x.AgeI == 1 || x.AgeII == 1);

        text_age = filtered_age.length + filtered_age1.length;
        document.getElementById('p30').innerHTML = "30-45 (" + text_age + ")";

        filtered_age = data_S.filter(x => x.Age == 2);
        filtered_age1 = data_D.filter(x => x.AgeI == 2 || x.AgeII == 2);

        text_age = filtered_age.length + filtered_age1.length;
        document.getElementById('p45').innerHTML = "45-60 (" + text_age + ")";

        filtered_age = data_S.filter(x => x.Age == 3);
        filtered_age1 = data_D.filter(x => x.AgeI == 3 || x.AgeII == 3);

        text_age = filtered_age.length + filtered_age1.length;
        document.getElementById('p60').innerHTML = "60-75 (" + text_age + ")";





    }

}