/**
 * function that pre-prepares data_trace.json to be use later for trace prepare_data_trace_prefiltered.js.
 * It finds all words of the given WORD_LENGTH and mode type and creates json files that contain arrays of objects.
 * Those objects store the word and all occurences of those words. 
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
function prepare_data_trace(type, WORD_LENGTH) {
    console.log('prepare_data_trace')
    console.log(type);


    d3.json('data/data.json').then(function(data) {
        // var weeks_out = ['37', '40', '43', '49', '50', '51', '52', '01', '03', '04', '05'];
        var week = d3.timeFormat('%V-%y')
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
        var letters_room = ['R', 'R', 'R', 'R', //4
            'K', 'K', //2
            'S', 'S', 'S', 'S', 'S', 'S', //6
            'H', 'H', 'H', //3
            'B', 'B', 'B', //3
            'W', 'W', 'W', 'W', 'W', 'W', //6
            'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K' //13
        ]
        var letters = ['A', 'B', 'C', 'D',
            'E', 'F',
            'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O',
            'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'
        ]

        /**
         * IDEA
         * 1. Create String of whole data
         * 2. create sub-string thereof. by week_weekday 
         * LATER on application: [plot_trace.js] X. apply filter
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


        data_filtered = data.filter(x => -1 != names.indexOf(x.Sensorname) && !weeks_out.includes(week(new Date(x.Timestamp))));
        console.log(data_filtered.length);

        //*******  VERSION OC --> remove all close ********************************************************* */
        var data_filtered_OC = data_filtered.filter(x => x.Value1 != 'CLOSED') //OC
            //************************************************************************************************** */

        //******* VERSION RED --> reduce all sequences of same sensor to one entry (the first)************** */
        var temp = [];
        temp.push(data_filtered[0]);

        for (var i = 1; i < data_filtered.length; i++) {
            if (data_filtered[i - 1].Sensorname != data_filtered[i].Sensorname) {
                temp.push(data_filtered[i]);
            }
        }
        var data_filtered_RED = temp;
        //*************************************************************************************************** */
        //Call the functions to download the data for all three versions. !Takes long.
        if (type == 'OC') {
            finalstep(data_filtered_OC, 'OC', WORD_LENGTH);

        } else if (type == 'RED') {
            finalstep(data_filtered_RED, 'RED', WORD_LENGTH);

        } else {
            finalstep(data_filtered, 'All', WORD_LENGTH);

        }

        //*************************************************************************************************** */


        function finalstep(data_filtered, type) {
            //keep datasize at a minimum
            data_filtered = data_filtered.map(function(x) { return { Sensorname: x.Sensorname, Timestamp: x.Timestamp } });

            console.log(data_filtered)

            //nested_word: Group all consecutive char in data_filtered by room
            // essentially if consider only '.Room' == reduced version of string_word_room
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

            console.log(nested_word);

            // 2. create sub-string thereof. eg by week, weekday, hour 
            //2.1 string_word and string_word_room : consideres whole data, create the string
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
            console.log(wno)

            data_per_week = data_per_week.filter(d => wno.includes(d.Week))
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
            part2(data_per_weekday_per_week, WORD_LENGTH, type);
        }


    })

}

function part2(data, WORD_LENGTH, type) { //data_per_weekday_per_week of prepare_data_trace()

    console.log('part2 ')
    var time = d3.timeFormat('%H:%M')
    const wd = { 'Mon': '0', 'Tue': '1', 'Wed': '2', 'Thu': '3', 'Fri': '4', 'Sat': '5', 'Sun': '6' }

    // 1. do string_split of those strings with a given length to create 'word_array'

    // TWO CASES: either filter of weekday/time used (then go over strings of Weekday) or else, go over strings of Week
    var words_per_week = [];

    for (var i = 0; i < data.length; i++) { //iterate over weeks
        var d = data[i];

        words_per_week.push({
            Week: d.Week,
            words_r: [],
            words_s: []
        });

        for (var j = 0; j < d.Weekdays.length; j++) { //iterate over weekdays
            var split_s = string_split(d.Weekdays[j].string_s, WORD_LENGTH);
            var split_r = string_split(d.Weekdays[j].string_r, WORD_LENGTH);


            words_per_week[i].words_s.push(split_s);
            words_per_week[i].words_r.push(split_r);

        }

    }

    console.log(words_per_week)


    var all_words_s = [];
    var all_words_r = [];
    var unique_words_s = []; //contains all unique words of length WORD_LENGTH
    var unique_words_r = [];

    for (var i = 0; i < words_per_week.length; i++) { //week
        var inde = 0;
        for (var j = 0; j < words_per_week[i].words_s.length; j++) { //weekday
            for (var k = 0; k < words_per_week[i].words_s[j].length - WORD_LENGTH; k++) { //word of that weekday of that week
                if (unique_words_s.indexOf(words_per_week[i].words_s[j][k]) < 0) {
                    unique_words_s.push(words_per_week[i].words_s[j][k])
                }
                if (unique_words_r.indexOf(words_per_week[i].words_r[j][k]) < 0) {
                    unique_words_r.push(words_per_week[i].words_r[j][k])
                }
                // console.log(data[i].data)
                var from = time(new Date(data[i].data[inde].Timestamp)); // time that is when starting this action
                var to = time(new Date(data[i].data[inde + WORD_LENGTH].Timestamp)); // time that is when this particular word has finished its actions
                var dur = new Date(data[i].data[inde + WORD_LENGTH].Timestamp) - new Date(data[i].data[inde].Timestamp);

                all_words_s.push({
                    word: words_per_week[i].words_s[j][k],
                    week: words_per_week[i].Week,
                    weekday: j,
                    from: from,
                    to: to,
                    dur: dur
                });

                all_words_r.push({
                    word: words_per_week[i].words_r[j][k],
                    week: words_per_week[i].Week,
                    weekday: j,
                    from: from,
                    to: to,
                    dur: dur
                });
                inde++;
            }
        }
    }
    console.log('unique_words_s')
    console.log(unique_words_s.length)
    console.log(unique_words_s)

    console.log('all_words_s')
    console.log(all_words_s)

    console.log('unique_words_r')
    console.log(unique_words_r.length);
    console.log(unique_words_r)
    console.log('all_words_r')
    console.log(all_words_r)


    for (var i = 0; i < unique_words_s.length; i += 2000) {
        var parts = []
        for (var j = i;
            (j < i + 2000 && j < unique_words_s.length); j++) {
            returnval = freq_word(unique_words_s[j], all_words_s);
            dists = returnval[0]
            if (returnval[1] != 0) {
                parts.push({
                    word: unique_words_s[j],
                    dist: dists,
                    freq: returnval[1]
                });
            }

        }

        toJson(parts, 'distances_part_' + type + '_S_' + (i / 2000) + '_' + WORD_LENGTH + '.json');
        console.log('Type: ' + type + ' Letter: S  Part: ' + ((i / 2000) + 1) + '/' + (Math.ceil(unique_words_s.length / 2000)));
        document.getElementById('statS').innerHTML = 'Type: ' + type + 'WordLength: ' + WORD_LENGTH + ' Letter: S Part: ' + ((i / 2000) + 1) + '/' + (Math.ceil(unique_words_s.length / 2000))
    }
    console.log('DONE Type: ' + type + 'Letter: S')
    document.getElementById('doneS').innerHTML = 'DONE Type: ' + type + 'WordLength: ' + WORD_LENGTH + ' Letter: S'

    for (var i = 0; i < unique_words_r.length; i += 1000) {
        var parts = []
        for (var j = i;
            (j < i + 1000 && j < unique_words_r.length); j++) {
            returnval = freq_word(unique_words_r[j], all_words_r);
            dists = returnval[0]

            if (returnval[1] != 0) {
                parts.push({
                    word: unique_words_r[j],
                    dist: dists,
                    freq: returnval[1]
                })
            };

        }

        toJson(parts, 'distances_part_' + type + '_R_' + (i / 1000) + '_' + WORD_LENGTH + '.json');
        console.log('Type: ' + type + ' Letter: R  Part: ' + ((i / 1000) + 1) + '/' + (Math.ceil(unique_words_r.length / 1000)));
        document.getElementById('statR').innerHTML = 'Type: ' + type + 'WordLength: ' + WORD_LENGTH + ' Letter: R  Part: ' + ((i / 1000) + 1) + '/' + (Math.ceil(unique_words_r.length / 1000))



    }
    console.log('DONE Type: ' + type + 'Letter: R')
    document.getElementById('doneR').innerHTML = 'DONE Type: ' + type + 'WordLength: ' + WORD_LENGTH + ' Letter: R'

    console.log(final)

    return;

}

/**
 * do binary search on data to find index whose Timestamp is <timestamp
 * @param {*} timestamp 
 * @param {*} data 
 */
function binary_search(timestamp, data) {
    var time = d3.timeFormat('%H:%M')

    var l = 0;
    var r = data.length - 1;
    var m = Math.floor((l + r) / 2);
    while (Math.abs(l - r) > 1) {
        if (time(new Date(data[m].Timestamp)) > timestamp) {
            r = m;
        } else if (time(new Date(data[m].Timestamp)) < timestamp) {
            l = m;
        } else {
            return m;
        }
        m = Math.floor((l + r) / 2);
    }
    return m;

}
/**
 * Given a string, split into substring of length sub_length
 * @param {String} str 
 * @param {int} sub_length 
 */
function string_split(str, sub_length) {
    if (sub_length > 1) {
        var i_from = 0;
        var l = str.length;

        var word_array = [];
        while (i_from + sub_length - 1 < l) {
            word_array.push(str.substring(i_from, i_from + sub_length));
            i_from++;
        }
        return word_array
    }

}
const half = 2; //including

/**
 * Given a string word and an array of strings word_array, return frequency of word with distance [0,word.length] in an arra word_dist_freq.
 * If index=-1, then this means that this array also contains word itself at index, be careful not to include all the string that overlap with word.
 * 
 * !word array is the array that contains all substrings of some length of some long string
 * @param {string} word 
 * @param {int} index 
 * @param {[String]} word_array 
 */
function freq_word(word, word_array) {
    var word_dist_freq = [];

    for (var i = 0; i <= half; i++) { //max dist of 2 word of length s is s 

        word_dist_freq.push({
            freq: 0,
            //  words: [],//what word have dist i
            Inf: [] //at what index do these words start ! (same index as in string the word_array was created from)
        })
    }
    f = 0
    for (var i = 0; i < word_array.length; i++) {

        d = levenshtein(word, word_array[i].word);
        if (d <= half) {

            word_dist_freq[d].freq++;
            f++
            inf = {
                w: word_array[i].week,
                wd: word_array[i].weekday,
                from: word_array[i].from,
                to: word_array[i].to //,
                    // dur: word_array[i].dur
            }
            word_dist_freq[d].Inf.push(inf);
        }

    }
    return [word_dist_freq, f];

}



/**
 * Returns levenstein (edit) distance for t strings
 * src: https://gist.github.com/andrei-m/982927
 * @param {string} a 
 * @param {string} b 
 */
var levenshtein = function(a, b) {
    if (a == b) return 0;
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    // swap to save some memory O(min(a,b)) instead of O(a)
    if (a.length > b.length) {
        var tmp = a;
        a = b;
        b = tmp;
    }

    var row = [];
    // init the row
    for (var i = 0; i <= a.length; i++) {
        row[i] = i;
    }

    // fill in the rest
    for (var i = 1; i <= b.length; i++) {
        var prev = i;
        for (var j = 1; j <= a.length; j++) {
            var val;
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                val = row[j - 1]; // match
            } else {
                val = Math.min(
                    row[j - 1] + 1, // substitution
                    prev + 1, // insertion
                    row[j] + 1); // deletion
            }
            row[j - 1] = prev;
            prev = val;
        }
        row[a.length] = prev;
    }

    return row[a.length]; //the distance
}