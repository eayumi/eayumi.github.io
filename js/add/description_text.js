function description_text() {

    d3.json('../js/add/sensor_description.json').then(function(data) {
        var text = data[0]
        document.getElementById('ptext').innerHTML = text.Line1 + text.Line2 + text.Line3;

        d3.select('#button').on('change', function(d) {
            text = data[selectedSensor];
            document.getElementById('ptext').innerHTML = text.Line1 + text.Line2 + text.Line3;
        });

    });
}