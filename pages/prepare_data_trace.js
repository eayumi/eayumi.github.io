/**
 * function that pre-prepares data_trace.json to be use later for trace.
 * 
 * Given all data, assign each sensor a letter of the alphabet. The sequence of movements for all is then represented by a long word.
 * !! Since we have 37 sensors, use upper and lower case letters per element. 
 * !! Make to variants.
 * -- One where we diff. btw elements
 * -- one where we diff btw rooms.
 *    The first letter stands for the room the sensor is placed in (S_chlaf,W_ohn,B_ad,K_ueche) or Rotation element R
 * This allows us to: 
 * -- find common words == common movement-sequences
 * -- find frequency of words with at most distance d 
 */
function prepare_data_trace() {

    d3.json('data.json').then(function(data) {
        var out = ['37', '40', '43', '49', '50', '51', '52', '01', '03', '04', '05'];
        var week = d3.timeFormat('%V')
        var weekday = d3.timeFormat('%a');
        var day = d3.timeFormat('%Y-%m-%d')
        var time = d3.timeFormat('%H:%M')

        var names = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand', 'K_Fen_Oben_Str', 'K_Fen_Unten_Str', 'S_Fen_Oben_Str', 'S_Fen_Unten_Str', 'S_Boden_Wand_cyr',
            'S_Boden_Kueche_cyr', 'S_Schub_Wand_cyr', 'S_Schub_Kueche_cyr',
            'H_Putz_cyr', 'H_Graderobe_cyr', 'H_Tuer_Str', 'B_Tuer_Str', 'B_Schrank_cyr', 'B_Wasch_cyr', 'W_Schub_Bad_cyr', 'W_Schub_Wand_cyr',
            'W_Boden_Bad_cyr', 'W_Boden_Wand_cyr', 'W_Fen_Bad_Str', 'W_Fen_Wand_Str',
            'K_Schrank_Oben_01_cyr', 'K_Schrank_Oben_02_cyr', 'K_Schrank_Oben_03_cyr', 'K_Schrank_Oben_04_cyr', 'K_Schrank_Oben_05_cyr',
            'K_Kuehl_cyr', 'K_Abfall_cyr', 'K_Wasch_Str', 'K_Ofen_Str', 'K_Ofen_Schub_cyr', 'K_Schub_Oben_cyr', 'K_Schub_Mitte_cyr', 'K_Schub_Unten_cyr'
        ]
        var letters_room = ['R', 'R', 'R', 'R',
            'K', 'K',
            'S', 'S', 'S', 'S', 'S', 'S',
            'H', 'H', 'H',
            'B', 'B', 'B',
            'W', 'W', 'W', 'W', 'W', 'W',
            'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K'
        ]
        var letters = ['A', 'B', 'C', 'D',
            'E', 'F',
            'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O',
            'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'
        ]

        var room2letters = {
            'K': ['E', 'F', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
            'W': ['S', 'T', 'U', 'V', 'W', 'X'],
            'S': ['G', 'H', 'I', 'J', 'K', 'L'],
            'B': ['M', 'N', 'O'],
            'H': ['P', 'Q', 'R'],
            'R': ['A', 'B', 'C', 'D', ]
        }
        var letter2room = {
            'A': 'R',
            'B': 'R',
            'C': 'R',
            'D': 'R',
            'E': 'K',
            'F': 'K',
            'Y': 'K',
            'Z': 'K',
            'a': 'K',
            'b': 'K',
            'c': 'K',
            'd': 'K',
            'e': 'K',
            'f': 'K',
            'g': 'K',
            'h': 'K',
            'i': 'K',
            'j': 'K',
            'k': 'K',
            'G': 'S',
            'H': 'S',
            'I': 'S',
            'J': 'S',
            'K': 'S',
            'L': 'S',
            'M': 'H',
            'N': 'H',
            'O': 'H',
            'P': 'B',
            'Q': 'B',
            'R': 'B',
            'S': 'W',
            'T': 'W',
            'U': 'W',
            'V': 'W',
            'W': 'W',
            'X': 'W'
        }

        /**
         * IDEA
         * 1. Create String of whole data
         * 2. create sub-string thereof. eg by week, weekday, hour 
         * LATER on application: [plot_trace.js]
         * X. apply filter
         * 3. do string_split of those strings with a given length to create 'word_array'
         * 4. do freq_word of a word and a word_array to get 'word_dist_freq', recording levenstein distace 
         * 5. plot
         */

        //1. Create String of whole data

        var data_word = []; // array of letters, where each sensor was mapped to a corresponding letter
        var data_word_room = []; // same as data_word, but each sensorelement mapped to the letter of the room
        var string_word = ''; // same as data_word, but as one long string
        var string_word_room = ''; // same as data_word_room, but as one long string
        var nested_word = []; // nested data_word by room

        var data_filtered = []; // data, but without the measurements of sensors we don't need
        //   console.log(data.length)


        data_filtered = data.filter(x => -1 != names.indexOf(x.Sensorname) && !out.includes(week(new Date(x.Timestamp))));
        console.log(data_filtered.length)
            //VERSION OC --> remove all close 
            // data_filtered = data_filtered.filter(x => x.Value1 != 'CLOSED') //OC
            //VERSION RED --> reduce all sequences of same sensor to one entry (the first)
        var temp = [];
        temp.push(data_filtered[0]);

        for (var i = 1; i < data_filtered.length; i++) {
            if (data_filtered[i - 1].Sensorname != data_filtered[i].Sensorname) {
                temp.push(data_filtered[i]);
            }
        }
        data_filtered = temp;
        // console.log(data_filtered.length)



        data_filtered = data_filtered.map(function(x) { return { Sensorname: x.Sensorname, Timestamp: x.Timestamp } });


        // console.log(data_filtered.length)

        //nested_word
        var last = 'x'
        var k = -1;
        for (var i = 0; i < data_filtered.length; i++) {
            ind = names.indexOf(data_filtered[i].Sensorname);
            if (last != letters_room[ind]) {
                last = letters_room[ind];
                k++;
                nested_word.push({
                    Room: last,
                    Word: letters[ind]
                })
            } else {
                nested_word[k].Word += letters[ind];
            }

        }
        // console.log(data_word)
        // console.log(string_word)
        // console.log(data_word_room)
        // console.log(string_word_room)
        console.log(nested_word);

        // 2. create sub-string thereof. eg by week, weekday, hour 


        //2.1 string_word and string_word_room : consideres whole data
        data_filtered.map(function(x) {
            ind = names.indexOf(x.Sensorname)
                // data_word.push(letters[ind])
            string_word += letters[ind]
                // data_word_room.push(letters_room[ind])
            string_word_room += letters_room[ind]

        });

        //2.2 by week

        var data_per_week = [];
        last = -1;
        var k = -1;

        for (var i = 0; i < data_filtered.length; i++) {
            if (last != week(new Date(data_filtered[i].Timestamp))) {
                last = week(new Date(data_filtered[i].Timestamp))
                k++;
                data_per_week.push({
                    Week: last,
                    data: [data_filtered[i]],
                    string_s: letters[names.indexOf(data_filtered[i].Sensorname)], //string_s = string created by letter per sensor
                    string_r: letters_room[names.indexOf(data_filtered[i].Sensorname)] //string_r = string created by letter per room
                })
            } else {
                data_per_week[k].data.push(data_filtered[i]);
                data_per_week[k].string_s += letters[names.indexOf(data_filtered[i].Sensorname)];
                data_per_week[k].string_r += letters_room[names.indexOf(data_filtered[i].Sensorname)];


            }
        }
        console.log(data_per_week)



        //2.4 by weekday [{Week:, Weekday: [[string,data],...x7}]
        var data_per_weekday_per_week = [];
        const wd = { 'Mon': '0', 'Tue': '1', 'Wed': '2', 'Thu': '3', 'Fri': '4', 'Sat': '5', 'Sun': '6' }

        for (var i = 0; i < data_per_week.length; i++) {
            data_per_weekday_per_week.push({
                Week: data_per_week[i].Week,
                Weekdays: [

                    { data: [], string_s: '', string_r: '' }, //0: Mon , [string, data]
                    { data: [], string_s: '', string_r: '' }, //1: Tue
                    { data: [], string_s: '', string_r: '' }, //2: Wed
                    { data: [], string_s: '', string_r: '' }, //3: Thu
                    { data: [], string_s: '', string_r: '' }, //4: Fri
                    { data: [], string_s: '', string_r: '' }, //5: Sat
                    { data: [], string_s: '', string_r: '' } //6: Sun
                ],
                data: data_per_week[i].data,
                string_s: data_per_week[i].string_s,
                string_r: data_per_week[i].string_r
            })
            for (var j = 0; j < data_per_week[i].data.length; j++) {

                k = wd[weekday(new Date(data_per_week[i].data[j].Timestamp))];
                data_per_weekday_per_week[i].Weekdays[k].string_s += letters[names.indexOf(data_per_week[i].data[j].Sensorname)];
                data_per_weekday_per_week[i].Weekdays[k].string_r += letters_room[names.indexOf(data_per_week[i].data[j].Sensorname)];
                data_per_weekday_per_week[i].Weekdays[k].data.push(data_per_week[i].data[j]);

            }
        }
        // console.log(data_per_weekday_per_week)
        // console.log(JSON.parse(JSON.stringify(data_per_weekday_per_week[0].Weekdays)))
        // console.log(JSON.parse(JSON.stringify(data_per_weekday_per_week)))

        // console.log((data_per_weekday_per_week[0].Weekdays))

        //  toJson(data_per_weekday_per_week, 'data_trace.json')

        //  toJson(data_per_weekday_per_week, 'data_trace_OC.json');
        //  toJson(data_per_weekday_per_week, 'data_trace_RED.json')













    })

}