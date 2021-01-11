function data_table() {
    d3.json('../data/data_table.json').then(function(data_table) {

        //age, occ, gender, wkd
        var currentClassesShow = 'normal';
        var ageToggle = 0;
        var occToggle = 0;
        var genderToggle = 0;
        var wkdToggle = 0;

        document.getElementById('title').innerHTML = '(Absolute Values)';

        var table = $('#example').DataTable({
            "paging": false,
            "info": false,
            dom: 'Bfrtip',
            "searching": false,
            "data": data_table,
            fixedHeader: false,
            "columns": [{
                    "data": "Sensor",
                    "title": "Sensor"
                }, {
                    "data": "All",
                    "title": "All",
                    className: "normal"

                }, {
                    "data": "Single",
                    "title": "Single",
                    className: "normal"

                }, {
                    "data": "Pairs",
                    "title": "Pairs",
                    className: "normal"

                }, {
                    "data": "eight",
                    "title": "18-30",
                    className: "agenormal"
                }, {
                    "data": "three",
                    "title": "30-45",
                    className: "agenormal"
                }, {
                    "data": "four",
                    "title": "45-60",
                    className: "agenormal"
                }, {
                    "data": "six",
                    "title": "60-75",
                    className: "agenormal"
                }, {
                    "data": "Student",
                    "title": "Student",
                    className: "occnormal"
                }, {
                    "data": "Employed",
                    "title": "Employed",
                    className: "occnormal"
                }, {
                    "data": "UnRet",
                    "title": "Unemp./ Retired",
                    className: "occnormal"
                }, {
                    "data": "Part",
                    "title": "Part-Time Emp.",
                    className: "occnormal"
                }, {
                    "data": "female",
                    "title": "female",
                    className: "gendernormal"
                }, {
                    "data": "male",
                    "title": "male",
                    className: "gendernormal"
                }, {
                    "data": "mixed",
                    "title": "mixed",
                    className: "gendernormal"
                }, {
                    "data": "Mon",
                    "title": "Mon",
                    className: "wkdnormal"
                }, {
                    "data": "Tue",
                    "title": "Tue",
                    className: "wkdnormal"
                }, {
                    "data": "Wed",
                    "title": "Wed",
                    className: "wkdnormal"
                }, {
                    "data": "Thu",
                    "title": "Thu",
                    className: "wkdnormal"
                }, {
                    "data": "Fri",
                    "title": "Fri",
                    className: "wkdnormal"
                }, {
                    "data": "Sat",
                    "title": "Sat",
                    className: "wkdnormal"
                }, {
                    "data": "Sun",
                    "title": "Sun",
                    className: "wkdnormal"
                },
                //averageby weeks
                {
                    "data": "AllA",
                    "title": "All",
                    className: "avg"

                }, {
                    "data": "SingleA",
                    "title": "Single",
                    className: "avg"

                }, {
                    "data": "PairsA",
                    "title": "Pairs",
                    className: "avg"

                }, {
                    "data": "eightA",
                    "title": "18-30",
                    className: "ageavg"
                }, {
                    "data": "threeA",
                    "title": "30-45",
                    className: "ageavg"
                }, {
                    "data": "fourA",
                    "title": "45-60",
                    className: "ageavg"
                }, {
                    "data": "sixA",
                    "title": "60-75",
                    className: "ageavg"
                }, {
                    "data": "StudentA",
                    "title": "Student",
                    className: "occavg"
                }, {
                    "data": "EmployedA",
                    "title": "Employed",
                    className: "occavg"
                }, {
                    "data": "UnRetA",
                    "title": "Unemp./ Retired",
                    className: "occavg"
                }, {
                    "data": "PartA",
                    "title": "Part-Time Emp.",
                    className: "occavg"
                }, {
                    "data": "femaleA",
                    "title": "female",
                    className: "genderavg"
                }, {
                    "data": "maleA",
                    "title": "male",
                    className: "genderavg"
                }, {
                    "data": "mixedA",
                    "title": "mixed",
                    className: "genderavg"
                }, {
                    "data": "MonA",
                    "title": "Mon",
                    className: "wkdavg"
                }, {
                    "data": "TueA",
                    "title": "Tue",
                    className: "wkdavg"
                }, {
                    "data": "WedA",
                    "title": "Wed",
                    className: "wkdavg"
                }, {
                    "data": "ThuA",
                    "title": "Thu",
                    className: "wkdavg"
                }, {
                    "data": "FriA",
                    "title": "Fri",
                    className: "wkdavg"
                }, {
                    "data": "SatA",
                    "title": "Sat",
                    className: "wkdavg"
                }, {
                    "data": "SunA",
                    "title": "Sun",
                    className: "wkdavg"
                },
                //percentageacross all sensors
                {
                    "data": "AllP",
                    "title": "All",
                    className: "perc"

                }, {
                    "data": "SingleP",
                    "title": "Single",
                    className: "perc"

                }, {
                    "data": "PairsP",
                    "title": "Pairs",
                    className: "perc"

                }, {
                    "data": "eightP",
                    "title": "18-30",
                    className: "ageperc"
                }, {
                    "data": "threeP",
                    "title": "30-45",
                    className: "ageperc"
                }, {
                    "data": "fourP",
                    "title": "45-60",
                    className: "ageperc"
                }, {
                    "data": "sixP",
                    "title": "60-75",
                    className: "ageperc"
                }, {
                    "data": "StudentP",
                    "title": "Student",
                    className: "occperc"
                }, {
                    "data": "EmployedP",
                    "title": "Employed",
                    className: "occperc"
                }, {
                    "data": "UnRetP",
                    "title": "Unemp./ Retired",
                    className: "occperc"
                }, {
                    "data": "PartP",
                    "title": "Part-Time Emp.",
                    className: "occperc"
                }, {
                    "data": "femaleP",
                    "title": "female",
                    className: "genderperc"
                }, {
                    "data": "maleP",
                    "title": "male",
                    className: "genderperc"
                }, {
                    "data": "mixedP",
                    "title": "mixed",
                    className: "genderperc"
                }, {
                    "data": "MonP",
                    "title": "Mon",
                    className: "wkdperc"
                }, {
                    "data": "TueP",
                    "title": "Tue",
                    className: "wkdperc"
                }, {
                    "data": "WedP",
                    "title": "Wed",
                    className: "wkdperc"
                }, {
                    "data": "ThuP",
                    "title": "Thu",
                    className: "wkdperc"
                }, {
                    "data": "FriP",
                    "title": "Fri",
                    className: "wkdperc"
                }, {
                    "data": "SatP",
                    "title": "Sat",
                    className: "wkdperc"
                }, {
                    "data": "SunP",
                    "title": "Sun",
                    className: "wkdperc"
                }



            ],
            dom: 'Bfrtip',
            buttons: {
                name: 'primary',
                buttons: [{ extend: 'excel', className: 'excelButton' },
                    //
                    {
                        text: 'Average',
                        className: 'overButton',

                        action: function() {
                            currentClassesShow = 'avg'
                            document.getElementById('title').innerHTML = '(Average Values)';

                            table.columns(".normal").visible(false);
                            table.columns(".perc").visible(false);
                            table.columns(".avg").visible(true);


                            table.columns(".occnormal").visible(false);
                            table.columns(".agenormal").visible(false);
                            table.columns(".gendernormal").visible(false);
                            table.columns(".wkdnormal").visible(false);

                            table.columns(".wkdperc").visible(false);
                            table.columns(".ageperc").visible(false);
                            table.columns(".genderperc").visible(false);
                            table.columns(".occperc").visible(false);

                            if (ageToggle == 1) table.columns(".age" + currentClassesShow).visible(true);
                            if (occToggle == 1) table.columns(".occ" + currentClassesShow).visible(true);
                            if (genderToggle == 1) table.columns(".gender" + currentClassesShow).visible(true);
                            if (wkdToggle == 1) table.columns(".wkd" + currentClassesShow).visible(true);



                        }
                    }, {
                        text: 'Percentage',
                        className: 'overButton',

                        action: function() {
                            currentClassesShow = 'perc'

                            document.getElementById('title').innerHTML = '(Percentage Values)';
                            table.columns(".avg").visible(false);
                            table.columns(".perc").visible(true);
                            table.columns(".normal").visible(false);


                            table.columns(".occavg").visible(false);
                            table.columns(".wkdavg").visible(false);
                            table.columns(".ageavg").visible(false);
                            table.columns(".genderavg").visible(false);


                            table.columns(".occnormal").visible(false);
                            table.columns(".wkdnormal").visible(false);
                            table.columns(".agenormal").visible(false);
                            table.columns(".gendernormal").visible(false);

                            if (ageToggle == 1) table.columns(".age" + currentClassesShow).visible(true);
                            if (occToggle == 1) table.columns(".occ" + currentClassesShow).visible(true);
                            if (genderToggle == 1) table.columns(".gender" + currentClassesShow).visible(true);
                            if (wkdToggle == 1) table.columns(".wkd" + currentClassesShow).visible(true);

                        }
                    }, {
                        text: 'Absolute',
                        className: 'overButton',

                        action: function() {

                            document.getElementById('title').innerHTML = '(Absolute Values)';
                            currentClassesShow = 'normal';
                            table.columns(".avg").visible(false);
                            table.columns(".perc").visible(false);
                            table.columns(".normal").visible(true);

                            table.columns(".occperc").visible(false);
                            table.columns(".wkdperc").visible(false);
                            table.columns(".ageperc").visible(false);
                            table.columns(".genderperc").visible(false);

                            table.columns(".ageavg").visible(false);
                            table.columns(".occavg").visible(false);
                            table.columns(".genderavg").visible(false);
                            table.columns(".wkdavg").visible(false);


                            if (ageToggle == 1) table.columns(".age" + currentClassesShow).visible(true);
                            if (occToggle == 1) table.columns(".occ" + currentClassesShow).visible(true);
                            if (genderToggle == 1) table.columns(".gender" + currentClassesShow).visible(true);
                            if (wkdToggle == 1) table.columns(".wkd" + currentClassesShow).visible(true);

                        }
                    }, {
                        text: 'Age',
                        className: 'catButton',
                        action: function() {
                            if (ageToggle == 1) {
                                table.columns(".age" + currentClassesShow).visible(false);
                                ageToggle = 0
                            } else {
                                table.columns(".age" + currentClassesShow).visible(true);
                                ageToggle = 1

                            }
                        }
                    }, {
                        className: 'catButton',
                        text: 'Gender',
                        action: function() {
                            if (genderToggle == 1) {
                                table.columns(".gender" + currentClassesShow).visible(false);
                                genderToggle = 0
                            } else {
                                table.columns(".gender" + currentClassesShow).visible(true);
                                genderToggle = 1

                            }
                        }
                    }, {
                        className: 'catButton',
                        text: 'Weekday',
                        action: function() {
                            if (wkdToggle == 1) {
                                table.columns(".wkd" + currentClassesShow).visible(false);
                                wkdToggle = 0
                            } else {
                                table.columns(".wkd" + currentClassesShow).visible(true);
                                wkdToggle = 1

                            }
                        }
                    }, {
                        className: 'catButton',
                        text: 'Occupation',
                        action: function() {
                            if (occToggle == 1) {
                                table.columns(".occ" + currentClassesShow).visible(false);
                                occToggle = 0
                            } else {
                                table.columns(".occ" + currentClassesShow).visible(true);
                                occToggle = 1

                            }

                        }
                    }
                ]
            }



        });


        $(document).ready(function() {
            table
        });


        table.columns(".occavg").visible(false);
        table.columns(".occperc").visible(false);
        table.columns(".wkdavg").visible(false);
        table.columns(".wkdperc").visible(false);
        table.columns(".ageperc").visible(false);
        table.columns(".genderperc").visible(false);
        table.columns(".ageavg").visible(false);
        table.columns(".genderavg").visible(false);
        table.columns(".avg").visible(false);
        table.columns(".perc").visible(false);
        table.columns(".occnormal").visible(false);
        table.columns(".wkdnormal").visible(false);
        table.columns(".agenormal").visible(false);
        table.columns(".gendernormal").visible(false);
        table.columns(".normal").visible(true);
    });

    d3.json('../data/data_table_2020.json').then(function(data_table) {


        //age, occ, gender, wkd
        var currentClassesShow = 'normal';
        var ageToggle = 0;
        var occToggle = 0;
        var genderToggle = 0;
        var wkdToggle = 0;

        document.getElementById('title2020').innerHTML = '(Absolute Values)';

        var table = $('#igong').DataTable({
            "paging": false,
            "info": false,
            dom: 'Bfrtip',
            "searching": false,
            "data": data_table,
            fixedHeader: false,
            "columns": [{
                    "data": "Sensor",
                    "title": "Sensor"
                }, {
                    "data": "All",
                    "title": "All",
                    className: "normal"

                }, {
                    "data": "Single",
                    "title": "Single",
                    className: "normal"

                }, {
                    "data": "Pairs",
                    "title": "Pairs",
                    className: "normal"

                }, {
                    "data": "eight",
                    "title": "18-30",
                    className: "agenormal"
                }, {
                    "data": "three",
                    "title": "30-45",
                    className: "agenormal"
                }, {
                    "data": "four",
                    "title": "45-60",
                    className: "agenormal"
                }, {
                    "data": "six",
                    "title": "60-75",
                    className: "agenormal"
                }, {
                    "data": "Student",
                    "title": "Student",
                    className: "occnormal"
                }, {
                    "data": "Employed",
                    "title": "Employed",
                    className: "occnormal"
                }, {
                    "data": "UnRet",
                    "title": "Unemp./ Retired",
                    className: "occnormal"
                }, {
                    "data": "Part",
                    "title": "Part-Time Emp.",
                    className: "occnormal"
                }, {
                    "data": "female",
                    "title": "female",
                    className: "gendernormal"
                }, {
                    "data": "male",
                    "title": "male",
                    className: "gendernormal"
                }, {
                    "data": "mixed",
                    "title": "mixed",
                    className: "gendernormal"
                }, {
                    "data": "Mon",
                    "title": "Mon",
                    className: "wkdnormal"
                }, {
                    "data": "Tue",
                    "title": "Tue",
                    className: "wkdnormal"
                }, {
                    "data": "Wed",
                    "title": "Wed",
                    className: "wkdnormal"
                }, {
                    "data": "Thu",
                    "title": "Thu",
                    className: "wkdnormal"
                }, {
                    "data": "Fri",
                    "title": "Fri",
                    className: "wkdnormal"
                }, {
                    "data": "Sat",
                    "title": "Sat",
                    className: "wkdnormal"
                }, {
                    "data": "Sun",
                    "title": "Sun",
                    className: "wkdnormal"
                },
                //averageby weeks
                {
                    "data": "AllA",
                    "title": "All",
                    className: "avg"

                }, {
                    "data": "SingleA",
                    "title": "Single",
                    className: "avg"

                }, {
                    "data": "PairsA",
                    "title": "Pairs",
                    className: "avg"

                }, {
                    "data": "eightA",
                    "title": "18-30",
                    className: "ageavg"
                }, {
                    "data": "threeA",
                    "title": "30-45",
                    className: "ageavg"
                }, {
                    "data": "fourA",
                    "title": "45-60",
                    className: "ageavg"
                }, {
                    "data": "sixA",
                    "title": "60-75",
                    className: "ageavg"
                }, {
                    "data": "StudentA",
                    "title": "Student",
                    className: "occavg"
                }, {
                    "data": "EmployedA",
                    "title": "Employed",
                    className: "occavg"
                }, {
                    "data": "UnRetA",
                    "title": "Unemp./ Retired",
                    className: "occavg"
                }, {
                    "data": "PartA",
                    "title": "Part-Time Emp.",
                    className: "occavg"
                }, {
                    "data": "femaleA",
                    "title": "female",
                    className: "genderavg"
                }, {
                    "data": "maleA",
                    "title": "male",
                    className: "genderavg"
                }, {
                    "data": "mixedA",
                    "title": "mixed",
                    className: "genderavg"
                }, {
                    "data": "MonA",
                    "title": "Mon",
                    className: "wkdavg"
                }, {
                    "data": "TueA",
                    "title": "Tue",
                    className: "wkdavg"
                }, {
                    "data": "WedA",
                    "title": "Wed",
                    className: "wkdavg"
                }, {
                    "data": "ThuA",
                    "title": "Thu",
                    className: "wkdavg"
                }, {
                    "data": "FriA",
                    "title": "Fri",
                    className: "wkdavg"
                }, {
                    "data": "SatA",
                    "title": "Sat",
                    className: "wkdavg"
                }, {
                    "data": "SunA",
                    "title": "Sun",
                    className: "wkdavg"
                },
                //percentageacross all sensors
                {
                    "data": "AllP",
                    "title": "All",
                    className: "perc"

                }, {
                    "data": "SingleP",
                    "title": "Single",
                    className: "perc"

                }, {
                    "data": "PairsP",
                    "title": "Pairs",
                    className: "perc"

                }, {
                    "data": "eightP",
                    "title": "18-30",
                    className: "ageperc"
                }, {
                    "data": "threeP",
                    "title": "30-45",
                    className: "ageperc"
                }, {
                    "data": "fourP",
                    "title": "45-60",
                    className: "ageperc"
                }, {
                    "data": "sixP",
                    "title": "60-75",
                    className: "ageperc"
                }, {
                    "data": "StudentP",
                    "title": "Student",
                    className: "occperc"
                }, {
                    "data": "EmployedP",
                    "title": "Employed",
                    className: "occperc"
                }, {
                    "data": "UnRetP",
                    "title": "Unemp./ Retired",
                    className: "occperc"
                }, {
                    "data": "PartP",
                    "title": "Part-Time Emp.",
                    className: "occperc"
                }, {
                    "data": "femaleP",
                    "title": "female",
                    className: "genderperc"
                }, {
                    "data": "maleP",
                    "title": "male",
                    className: "genderperc"
                }, {
                    "data": "mixedP",
                    "title": "mixed",
                    className: "genderperc"
                }, {
                    "data": "MonP",
                    "title": "Mon",
                    className: "wkdperc"
                }, {
                    "data": "TueP",
                    "title": "Tue",
                    className: "wkdperc"
                }, {
                    "data": "WedP",
                    "title": "Wed",
                    className: "wkdperc"
                }, {
                    "data": "ThuP",
                    "title": "Thu",
                    className: "wkdperc"
                }, {
                    "data": "FriP",
                    "title": "Fri",
                    className: "wkdperc"
                }, {
                    "data": "SatP",
                    "title": "Sat",
                    className: "wkdperc"
                }, {
                    "data": "SunP",
                    "title": "Sun",
                    className: "wkdperc"
                }



            ],
            dom: 'Bfrtip',
            buttons: {
                name: 'primary',
                buttons: [{ extend: 'excel', className: 'excelButton' },
                    //
                    {
                        text: 'Average',
                        className: 'overButton',

                        action: function() {
                            currentClassesShow = 'avg'
                            document.getElementById('title2020').innerHTML = '(Average Values)';

                            table.columns(".normal").visible(false);
                            table.columns(".perc").visible(false);
                            table.columns(".avg").visible(true);


                            table.columns(".occnormal").visible(false);
                            table.columns(".agenormal").visible(false);
                            table.columns(".gendernormal").visible(false);
                            table.columns(".wkdnormal").visible(false);

                            table.columns(".wkdperc").visible(false);
                            table.columns(".ageperc").visible(false);
                            table.columns(".genderperc").visible(false);
                            table.columns(".occperc").visible(false);

                            if (ageToggle == 1) table.columns(".age" + currentClassesShow).visible(true);
                            if (occToggle == 1) table.columns(".occ" + currentClassesShow).visible(true);
                            if (genderToggle == 1) table.columns(".gender" + currentClassesShow).visible(true);
                            if (wkdToggle == 1) table.columns(".wkd" + currentClassesShow).visible(true);



                        }
                    }, {
                        text: 'Percentage',
                        className: 'overButton',

                        action: function() {
                            currentClassesShow = 'perc'

                            document.getElementById('title2020').innerHTML = '(Percentage Values)';
                            table.columns(".avg").visible(false);
                            table.columns(".perc").visible(true);
                            table.columns(".normal").visible(false);


                            table.columns(".occavg").visible(false);
                            table.columns(".wkdavg").visible(false);
                            table.columns(".ageavg").visible(false);
                            table.columns(".genderavg").visible(false);


                            table.columns(".occnormal").visible(false);
                            table.columns(".wkdnormal").visible(false);
                            table.columns(".agenormal").visible(false);
                            table.columns(".gendernormal").visible(false);

                            if (ageToggle == 1) table.columns(".age" + currentClassesShow).visible(true);
                            if (occToggle == 1) table.columns(".occ" + currentClassesShow).visible(true);
                            if (genderToggle == 1) table.columns(".gender" + currentClassesShow).visible(true);
                            if (wkdToggle == 1) table.columns(".wkd" + currentClassesShow).visible(true);

                        }
                    }, {
                        text: 'Absolute',
                        className: 'overButton',

                        action: function() {

                            document.getElementById('title2020').innerHTML = '(Absolute Values)';
                            currentClassesShow = 'normal';
                            table.columns(".avg").visible(false);
                            table.columns(".perc").visible(false);
                            table.columns(".normal").visible(true);

                            table.columns(".occperc").visible(false);
                            table.columns(".wkdperc").visible(false);
                            table.columns(".ageperc").visible(false);
                            table.columns(".genderperc").visible(false);

                            table.columns(".ageavg").visible(false);
                            table.columns(".occavg").visible(false);
                            table.columns(".genderavg").visible(false);
                            table.columns(".wkdavg").visible(false);


                            if (ageToggle == 1) table.columns(".age" + currentClassesShow).visible(true);
                            if (occToggle == 1) table.columns(".occ" + currentClassesShow).visible(true);
                            if (genderToggle == 1) table.columns(".gender" + currentClassesShow).visible(true);
                            if (wkdToggle == 1) table.columns(".wkd" + currentClassesShow).visible(true);

                        }
                    }, {
                        text: 'Age',
                        className: 'catButton',
                        action: function() {
                            if (ageToggle == 1) {
                                table.columns(".age" + currentClassesShow).visible(false);
                                ageToggle = 0
                            } else {
                                table.columns(".age" + currentClassesShow).visible(true);
                                ageToggle = 1

                            }
                        }
                    }, {
                        className: 'catButton',
                        text: 'Gender',
                        action: function() {
                            if (genderToggle == 1) {
                                table.columns(".gender" + currentClassesShow).visible(false);
                                genderToggle = 0
                            } else {
                                table.columns(".gender" + currentClassesShow).visible(true);
                                genderToggle = 1

                            }
                        }
                    }, {
                        className: 'catButton',
                        text: 'Weekday',
                        action: function() {
                            if (wkdToggle == 1) {
                                table.columns(".wkd" + currentClassesShow).visible(false);
                                wkdToggle = 0
                            } else {
                                table.columns(".wkd" + currentClassesShow).visible(true);
                                wkdToggle = 1

                            }
                        }
                    }, {
                        className: 'catButton',
                        text: 'Occupation',
                        action: function() {
                            if (occToggle == 1) {
                                table.columns(".occ" + currentClassesShow).visible(false);
                                occToggle = 0
                            } else {
                                table.columns(".occ" + currentClassesShow).visible(true);
                                occToggle = 1

                            }

                        }
                    }
                ]
            }



        });


        $(document).ready(function() {
            table
        });


        table.columns(".occavg").visible(false);
        table.columns(".occperc").visible(false);
        table.columns(".wkdavg").visible(false);
        table.columns(".wkdperc").visible(false);
        table.columns(".ageperc").visible(false);
        table.columns(".genderperc").visible(false);
        table.columns(".ageavg").visible(false);
        table.columns(".genderavg").visible(false);
        table.columns(".avg").visible(false);
        table.columns(".perc").visible(false);
        table.columns(".occnormal").visible(false);
        table.columns(".wkdnormal").visible(false);
        table.columns(".agenormal").visible(false);
        table.columns(".gendernormal").visible(false);
        table.columns(".normal").visible(true);
    });

    d3.json('../data/data_profile_table.json').then(function(data_profile_table) {

        // Profile table
        var table_profile = $('#profile').DataTable({
            "paging": false,
            "info": false,
            "searching": false,
            "ordering": false,
            "data": data_profile_table,
            fixedHeader: false,
            "columns": [{
                "data": "name",
                "title": ""
            }, {
                "title": "#Test-Subjects (Weeks)",
                "data": "subjects"
            }, {
                "data": "eight",
                "title": "18-30"
            }, {
                "data": "three",
                "title": "30-45"
            }, {
                "data": "four",
                "title": "45-60"
            }, {
                "data": "six",
                "title": "60-75"
            }, {
                "data": "Student",
                "title": "Student"
            }, {
                "data": "Employed",
                "title": "Employed"
            }, {
                "data": "UnRet",
                "title": "Unemp./ Retired"
            }, {
                "data": "Part",
                "title": "Part-Time Emp."
            }, {
                "data": "female",
                "title": "female"
            }, {
                "data": "male",
                "title": "male"
            }, {
                "data": "mixed",
                "title": "mixed"
            }]
        });

        $(document).ready(function() { table_profile });



    });
}