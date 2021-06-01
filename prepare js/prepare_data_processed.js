function prepare_data_processed() {

    d3.json('../data/data.json').then(function(data) {
        var data_processed = [];

        var wd = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 }
        var week = d3.timeFormat('%V-%y');
        var weekday = d3.timeFormat('%a');

        console.log(data)
        for (var i = 0; i < data.length; i++) {
            d = data[i];
            date = new Date(d.Timestamp);
            data_processed.push({
                Sensorname: d.Sensorname,
                To: d.Value2,
                From: d.Value1,
                Timestamp: d.Timestamp,
                Duration: d.Duration, // do I need this?
                Total: d.ValueDiff,
                Week: week(date),
                Weekday: wd[weekday(date)],
                Group: (weeks_single.includes(week(date))) ? 0 : ((!weeks_out.includes(week(date))) ? 1 : -1)
            });
        }

        console.log(data_processed);
        toJson(data_processed, 'data_processed.json')
        names = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand']
        toJson(data_processed.filter(d => names.includes(d.Sensorname)), 'data_processed_elements.json')
    });
}

function prepare_data_processed_Besucher() {

    d3.json('../data/data_Besucher.json').then(function(data) {
        var data_processed = [];

        var wd = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 }
        var week = d3.timeFormat('%V-%y');
        var weekday = d3.timeFormat('%a');

        console.log(data)
        for (var i = 0; i < data.length; i++) {
            d = data[i];
            date = new Date(d.Timestamp);
            data_processed.push({
                Sensorname: d.Sensorname,
                To: d.Value2,
                From: d.Value1,
                Timestamp: d.Timestamp,
                Duration: d.Duration, // do I need this?
                Total: d.ValueDiff,
                Week: week(date),
                Weekday: wd[weekday(date)],
                Group: (weeks_single.includes(week(date))) ? 0 : ((!weeks_out.includes(week(date))) ? 1 : -1)
            });
        }

        console.log(data_processed);
        toJson(data_processed, 'data_processed_Besucher.json')
        names = ['Drehwand', 'Drehschrank', 'LampeAussenwand', 'LampeDrehwand']
        toJson(data_processed.filter(d => names.includes(d.Sensorname)), 'data_processed_elements.json')
    });
}