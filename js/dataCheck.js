function dataCheck() {

    d3.json('../data/data_processed.json').then(function(data) {


        var theta = document.getElementById('theta').value;

        const weeks_single = ["38-19", "39-19", "47-19", "02-20", "06-20", "07-20", "08-20", "10-20", "26-20", "28-20", "30-20", "32-20", "36-20", "38-20", "43-20", "44-20", "49-20", "50-20", "51-20"];
        const weeks_double = ["41-19", "42-19", "44-19", "45-19", "46-19", "48-19", "09-20", "11-20", "19-20", "20-20", "22-20", "24-20", "25-20", "27-20", "29-20", "31-20", "33-20", "34-20", "35-20", "37-20", "39-20", "40-20", "41-20", "42-20", "45-20", "46-20", "47-20", "48-20", "52-20"];

        data_single = data.filter(d => weeks_single.includes(d.Week) && d.Total > theta)
        data_double = data.filter(d => weeks_double.includes(d.Week) && d.Total > theta)

        console.log(data)
        console.log(data_single)
        console.log(data_single.filter(d => d.Sensorname == 'Drehschrank').length)
        console.log(data_double.filter(d => d.Sensorname == 'Drehschrank').length)
        console.log(data_single.filter(d => d.Sensorname == 'Drehwand').length)
        console.log(data_double.filter(d => d.Sensorname == 'Drehwand').length)



        var data_sp = [{
                categorie: "Drehschrank",
                values: [{
                        value: data_single.filter(d => d.Sensorname == 'Drehschrank').length,

                        rate: "Single Test Subject"
                    },
                    {
                        value: data_double.filter(d => d.Sensorname == 'Drehschrank').length,
                        rate: "Pairs of Test Subjects"
                    }
                ]
            },
            {
                categorie: "Drehwand",
                values: [{
                        value: data_single.filter(d => d.Sensorname == 'Drehwand').length,

                        rate: "Single Test Subject"
                    },
                    {
                        value: data_double.filter(d => d.Sensorname == 'Drehwand').length,

                        rate: "Pairs of Test Subjects"
                    }
                ]
            },
            {
                categorie: "Lampe Drehwand",
                values: [{
                        value: data_single.filter(d => d.Sensorname == 'LampeDrehwand').length,
                        rate: "Single Test Subject"
                    },
                    {
                        value: data_double.filter(d => d.Sensorname == 'LampeDrehwand').length,
                        rate: "Pairs of Test Subjects"
                    }
                ]
            }, {
                categorie: "Lampe Aussenwand",
                values: [{
                        value: data_single.filter(d => d.Sensorname == 'LampeAussenwand').length,

                        rate: "Single Test Subject"
                    },
                    {
                        value: data_double.filter(d => d.Sensorname == 'LampeAussenwand').length,

                        rate: "Pairs of Test Subjects"
                    }
                ]
            }

        ]

        var data_all = [{
                categorie: "Drehschrank",
                values: [{
                    value: data_sp[0].values[0].value + data_sp[0].values[1].value,

                    rate: "All Test Subjects"
                }]
            },
            {
                categorie: "Drehwand",
                values: [{
                    value: data_sp[1].values[0].value + data_sp[1].values[1].value,

                    rate: "All Test Subjects"
                }]
            },
            {
                categorie: "Lampe Drehwand",
                values: [{
                    value: data_sp[2].values[0].value + data_sp[2].values[1].value,
                    rate: "All Test Subjects"
                }]
            }, {
                categorie: "Lampe Aussenwand",
                values: [{
                    value: data_sp[3].values[0].value + data_sp[3].values[1].value,

                    rate: "All Test Subjects"
                }]
            }

        ]

        console.log(data_sp)
        histo_trans_time(data_sp, ['rgb(87, 162, 192)', 'rgb(235, 122, 69)'], 'Dataonefour')
        histo_trans_time(data_all, ['rosybrown'], 'AllDataonefour')




    })

}