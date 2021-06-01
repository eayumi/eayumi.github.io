function dataCheck() {
    //'Single', 'Double', ('18-30', '30-45', '45-60', '60-75', 'Frau', 'Mann', 'Berufstätig', 'Student', 'Teilzeit', 'Rentner/Arbeitslos')X2 (person 1 and person 2)

    const weeks_data =

        [
            ["34-19", "35-19", "51-19", "04-20", "09-21", "10-21", "12-21", "13-21", "38-19", "39-19", "47-19", "02-20", "06-20", "07-20", "08-20", "10-20", "26-20", "28-20", "30-20", "32-20", "36-20", "38-20", "43-20", "44-20", "49-20", "50-20", "51-20", "03-21"],
            ["41-19.2", "44-19.2", "46-19.2", "20-20.2", "37-19", "49-19", "50-19", "03-20", "05-20", "04-21", "41-19", "42-19", "44-19", "45-19", "46-19", "48-19", "09-20", "11-20", "19-20", "20-20", "22-20", "24-20", "25-20", "27-20", "29-20", "31-20", "33-20", "34-20", "35-20", "37-20", "39-20", "40-20", "41-20", "42-20", "45-20", "46-20", "47-20", "48-20", "52-20", "05-21"],
            ["41-19", "44-19", "45-19", "46-19", "47-19", "48-19", "09-20", "11-s20", "36-20", "04-21", "05-21", "10-21"],
            ["38-19", "39-19", "42-19", "02-20", "07-20", "08-20", "10-20", "19-20", "20-20", "22-20", "24-20", "25-20", "26-20", "31-20", "32-20", "03-21", "08-21", "12-21", "13-21"],
            ["27-20", "28-20", "33-20", "34-20", "35-20", "37-20", "38-20", "39-20", "41-20", "47-20", "48-20", "51-20", "52-20", "11-21"],
            ["06-20", "29-20", "30-20", "40-20", "42-20", "43-20", "44-20", "45-20", "46-20", "09-21"],
            ["41-19", "45-19", "47-19", "02-20", "09-20", "11-s20", "22-20", "25-20", "26-20", "27-20", "28-20", "30-20", "31-20", "32-20", "34-20", "35-20", "36-20", "39-20", "40-20", "41-20", "42-20", "43-20", "44-20", "45-20", "46-20", "10-21"],
            ["38-19", "39-19", "42-19", "44-19", "46-19", "48-19", "06-20", "07-20", "08-20", "10-20", "19-20", "20-20", "24-20", "29-20", "33-20", "37-20", "38-20", "47-20", "48-20", "51-20", "52-20", "03-21", "04-21", "05-21", "08-21", "09-21", "11-21", "12-21", "13-21"],
            ["41-19", "44-19", "45-19", "46-19", "47-19", "48-19", "09-20", "11-s20", "25-20", "03-21", "05-21", "08-21", "09-21"],
            ["38-19", "39-19", "42-19", "02-20", "07-20", "08-20", "10-20", "19-20", "20-20", "22-20", "24-20", "26-20", "27-20", "28-20", "31-20", "32-20", "33-20", "34-20", "35-20", "36-20", "37-20", "38-20", "39-20", "41-20", "46-20", "47-20", "10-21", "12-21", "13-21"],
            ["30-20", "43-20", "45-20", "04-21", "11-21"],
            ["06-20", "29-20", "40-20", "42-20", "44-20", "52-20"],
            ["41-19", "42-19", "44-19", "45-19", "46-19", "48-19", "09-20", "11-s20", "41-20", "04-21", "05-21"],
            ["19-20", "20-20", "24-20", "25-20", "31-20", "52-20"],
            ["22-20", "27-20", "33-20", "34-20", "35-20", "37-20", "39-20", "46-20", "47-20"],
            ["29-20", "40-20", "42-20", "45-20"],
            ["41-19", "44-19", "45-19", "46-19", "09-20", "19-20", "20-20", "22-20", "24-20", "29-20", "35-20", "37-20", "47-20", "48-20", "52-20", "05-21"],
            ["42-19", "48-19", "11-s20", "25-20", "27-20", "31-20", "33-20", "34-20", "39-20", "40-20", "41-20", "45-20", "46-20", "04-21"],
            ["41-19", "44-19", "45-19", "46-19", "48-19", "09-20", "11-s20", "25-20", "41-20", "05-21"],
            ["19-20", "20-20", "22-20", "24-20", "27-20", "31-20", "33-20", "34-20", "35-20", "37-20", "39-20", "45-20", "46-20"],
            ["29-20", "04-21"],
            ["42-19", "40-20", "42-20", "47-20", "52-20"]
        ]
    d3.json('../data/data_processed.json').then(function(data) {


        var theta = document.getElementById('theta').value;

        const weeks_single = ["34-19", "35-19", "51-19", "04-20", "09-21", "10-21", "12-21", "13-21", "38-19", "39-19", "47-19", "02-20", "06-20", "07-20", "08-20", "10-20", "26-20", "28-20", "30-20", "32-20", "36-20", "38-20", "43-20", "44-20", "49-20", "50-20", "51-20", "03-21"];
        const weeks_double = ["41-19.2", "44-19.2", "46-19.2", "20-20.2", "37-19", "49-19", "50-19", "03-20", "05-20", "04-21", "41-19", "42-19", "44-19", "45-19", "46-19", "48-19", "09-20", "11-20", "19-20", "20-20", "22-20", "24-20", "25-20", "27-20", "29-20", "31-20", "33-20", "34-20", "35-20", "37-20", "39-20", "40-20", "41-20", "42-20", "45-20", "46-20", "47-20", "48-20", "52-20", "05-21"];


        data_single = data.filter(d => weeks_single.includes(d.Week) && d.Total > theta)
        data_double = data.filter(d => weeks_double.includes(d.Week) && d.Total > theta)


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

        histo_trans_time(data_sp, ['rgb(87, 162, 192)', 'rgb(235, 122, 69)'], 'Dataonefour')
        histo_trans_time(data_all, ['rosybrown'], 'AllDataonefour')
        histo_trans_time(data_all, ['darkseagreen', 'darksalmon'], 'GroupDataonefour')

        d3.selectAll('#togd14g').on('click', function() {
            console.log('button')

            var datas_group = [];

            datas_group = filter_data($Qonespec_1, $Qonespec_2, '', 'spec', [], '');
            weeks_1 = datas_group[0]
            weeks_2 = datas_group[1]
            console.log(weeks_1)

            //data
            //filter

            var data_group = [{
                    categorie: "Drehschrank",
                    values: [{
                            value: data.filter(d => d.Sensorname == 'Drehschrank' && weeks_1.includes(d.Week) && d.Total > theta).length,

                            rate: "Group 1"
                        },
                        {
                            value: data.filter(d => d.Sensorname == 'Drehschrank' && weeks_2.includes(d.Week) && d.Total > theta).length,
                            rate: "Group 2"
                        }
                    ]
                },
                {
                    categorie: "Drehwand",
                    values: [{
                            value: data.filter(d => d.Sensorname == 'Drehwand' && weeks_1.includes(d.Week) && d.Total > theta).length,
                            rate: "Group 1"
                        },
                        {
                            value: data.filter(d => d.Sensorname == 'Drehwand' && weeks_2.includes(d.Week) && d.Total > theta).length,

                            rate: "Group 2"
                        }
                    ]
                },
                {
                    categorie: "Lampe Drehwand",
                    values: [{
                            value: data.filter(d => d.Sensorname == 'LampeDrehwand' && weeks_1.includes(d.Week) && d.Total > theta).length,
                            rate: "Group 1"
                        },
                        {
                            value: data.filter(d => d.Sensorname == 'LampeDrehwand' && weeks_2.includes(d.Week) && d.Total > theta).length,
                            rate: "Group 2"
                        }
                    ]
                },
                {
                    categorie: "Lampe Aussenwand",
                    values: [{
                            value: data.filter(d => d.Sensorname == 'LampeAussenwand' && weeks_1.includes(d.Week) && d.Total > theta).length,

                            rate: "Group 1"
                        },
                        {
                            value: data.filter(d => d.Sensorname == 'LampeAussenwand' && weeks_2.includes(d.Week) && d.Total > theta).length,

                            rate: "Group 2"
                        }
                    ]
                }

            ]
            console.log(data_group)
            console.log(data)
            histo_trans_time(data_group, ['darkseagreen', 'darksalmon'], 'GroupDataonefour')


        });



    })

}