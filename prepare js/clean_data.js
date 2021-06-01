function clean_data() {

    Promise.all([d3.json('../data/data_raw.json'), d3.json('../data/Sondernutzungen.json')]).then(function(datas) {
        var data_processed = [];
        data = datas[0];
        events = datas[1];

        var wd = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 }
        var weekday = d3.timeFormat('%a');
        var time = d3.timeFormat('%H:%M');
        var dates = d3.timeFormat('%d.%m.%Y');


        var cleanstart = '12:00'
        var cleanend = '14:00'

        function clean_time(date) {
            t = time(new Date(date));
            return t < cleanend && t < cleanstart;

        }

        console.log(data)
            //filter out any movenents caused by cleaninglady
            // data = data.filter(d => dates(new Date(d.Timestamp)) < '24.08.2020');
        console.log(data)

        data = data.filter(d => !(weekday(new Date(d.Timestamp)) == 'Mon' && clean_time(d.Timestamp)));
        console.log(events)
        console.log(data)

        var newdata = [];
        var events_dates = events.map(d => d.Date)
        for (var i = 0; i < data.length; i++) {
            d = data[i];
            date = dates(new Date(d.Timestamp))
            if (events_dates.indexOf((date)) != -1) {
                ind = events_dates.indexOf((date));
                times = time(new Date(d.Timestamp))
                if (times >= events[ind].To || times <= events[ind].From) {
                    newdata.push(d);


                }

            } else {
                newdata.push(d);
            }

        }

        console.log(newdata);

        toJson(newdata, 'data.json')
    });
}

function clean_data_besucher() {

    Promise.all([d3.json('../data/data.json'), d3.json('../data/Besucherzeiten.json')]).then(function(datas) {
        var data_processed = [];
        data = datas[0];
        events = datas[1];

        var wd = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 }
        var weekday = d3.timeFormat('%a');
        var time = d3.timeFormat('%H:%M');
        var dates = d3.timeFormat('%d.%m.%Y');


        var cleanstart = '12:00'
        var cleanend = '14:00'

        function clean_time(date) {
            t = time(new Date(date));
            return t < cleanend && t < cleanstart;

        }

        console.log(data)
            //filter out any movenents caused by cleaninglady
            // data = data.filter(d => dates(new Date(d.Timestamp)) < '24.08.2020');
        console.log(data)

        data = data.filter(d => !(weekday(new Date(d.Timestamp)) == 'Mon' && clean_time(d.Timestamp)));
        console.log(events)
        console.log(data)

        var newdata = [];
        var events_dates = events.map(d => d.Date)
        for (var i = 0; i < data.length; i++) {
            d = data[i];
            date = dates(new Date(d.Timestamp))
            if (events_dates.indexOf((date)) != -1) {
                ind = events_dates.indexOf((date));
                times = time(new Date(d.Timestamp))
                if (times >= events[ind].To || times <= events[ind].From) {
                    newdata.push(d);


                }

            } else {
                newdata.push(d);
            }

        }

        console.log(newdata);

        toJson(newdata, 'data_Besucher.json')
    });
}