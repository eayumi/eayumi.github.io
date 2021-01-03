/** 
 * Ayumi Ehgartner April 2020
 * 
 *  
 * 
 * */

var timej = d3.timeFormat('%H:%M:%S.%L');

/**
 * A custom timeline. It animattes an element, according to attribute values given in the input data, in the floor plan (using the given selectors) in real time. 
 * The animation is mainly based on requestAnimationFrame function. 
 * This custom timeline is used to animate the four main rotatable elements, and two function called within it: X_roation and X_delay
 * X_rotation rotates the element, while X_delay waits until the next rotation.
 * Input: 
 * data: array of objects {Timestamp, To, From, Duration, Delay_end_start, Type: {1= OPEN/CLOSED, 0= sensorelement}, Move:{1 = move, 0 = wait}} PER SENSORELEMENT
 * selector: classes that define the sensor object inside the svg.
 * 
 * @param {*} data 
 * @param {*} selector 
 */
var custom_timeline = function(data, selector) {

    var startindex = 0; //index from where to start the animation
    const element = document.querySelectorAll(selector);
    var i = 0; //index that determines current move instance
    const raf = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    var rafid;
    const LENGTH = data.length;
    /**
     * terminate animation if gone through whole dataset
     */
    this.terminate = function terminate() {
        console.log('terminaterotation')
        reset();
        cancelAnimationFrame(rafid);

    };

    /**
     * 
     * start: start time of a move instance
     * runtime: how long the move instance is already running
     * progress: runtime fraction [0,1]
     * paused_ms: amount of time the animtion was puased. this is importnat to calculate the progress of a rotation or delay, as we need to exclude the time the animation was halted
     * paused_time: time the animation was last paused
     */

    var isPaused = false; //indicates whether the animation is currently paused
    var stopRec = false; //indicates whether to stop the recursion
    var start, paused_ms, paused_time;
    var speed = 1; //current speed factor
    var seekd = false; //indicates wether the aniamtion was recently seeked to a time
    /**
     * rotates the element.
     * @param {date} timestamp 
     * @param {int} rotation amout to rotate the element by
     * @param {int} duration of the rotation in ms
     * @param {int} inital_angle offset (angle the elemet is at before this rotation was observed)
     */
    function X_rotation(timestamp, rotation, duration, inital_angle) {
        if (!stopRec) {
            if (isPaused) {
                const myPromise = new Promise(function(resolve, reject) {

                    function waitforplay() {
                        if (isPaused) {
                            window.setTimeout(waitforplay, 500);
                        } else {
                            resolve('fine_promise')
                            return;
                        }
                    }

                    waitforplay();
                })

                myPromise.then(function(response) {


                    rafid = raf(function(timestamp) {
                        //update start time
                        X_rotation(timestamp, rotation, duration, inital_angle);
                    })
                })

            } else {
                //calculate how much time has passed since last animation frame, and compute the next angle to rotate the element to
                timestamp = timestamp || new Date().getTime()
                runtime = (timestamp - start - paused_ms) * speed;
                progress = runtime / duration;
                progress = Math.min(progress, 1); //1== finished

                element.forEach(el => el.style.transform = 'rotate(' + (rotation * progress + inital_angle) + 'deg)')

                //this instance is not finished yet, call function with same parameters again
                if (runtime < duration) {
                    rafid = raf(function(timestamp) {

                        X_rotation(timestamp, rotation, duration, inital_angle);
                    });

                } else {
                    //this instance is finished yet, call function with parameters of next(i++) move, as long as there is a next
                    i++;

                    if (i < data.length) {
                        console.log(i + ' ' + selector[0] + " " + timej(data[i].Timestamp) + "  " + data[i].move)

                        rafid = raf(function(timestamp) {
                            //update start time
                            paused_ms = 0;
                            start = timestamp || new Date().getTime();

                            if (data[i].move) {
                                X_rotation(timestamp, data[i].val, data[i].Duration, data[i].From);
                            } else {
                                X_delay(timestamp, data[i].Delay_end_start, data[i].From);

                            }
                        });
                    } else {
                        //stop the animation
                        reset();
                        this.cancelAnimationFrame(rafid)


                    }
                }

            }
        }
    }

    /**
     * It keeps track of the time to wait until next rotation is to be executed
     * @param {*} timestamp 
     * @param {*} delay time to wait
     * @param {*} inital_angle offset (angle the elemet is at before this rotation was observed)
     */
    function X_delay(timestamp, delay, inital_angle) {

        if (!stopRec) {
            if (isPaused) {
                const myPromise = new Promise(function(resolve, reject) {

                    function waitforplay() {
                        if (isPaused) {
                            window.setTimeout(waitforplay, 500);
                        } else {
                            resolve('fine_promise')
                            return;
                        }

                    }
                    waitforplay();

                })

                myPromise.then(function whenok(response) {
                    timestamp = (new Date).getTime();

                    rafid = raf(function(timestamp) {
                        X_delay(timestamp, delay, inital_angle);
                    });
                })

            } else {
                timestamp = timestamp || new Date().getTime()
                runtime = (timestamp - start - paused_ms) * speed;

                //this instance is not finished yet, call function with same parameters again
                if (runtime < delay) {
                    rafid = raf(function(timestamp) {

                        X_delay(timestamp, delay, inital_angle);
                    });

                } else {

                    i++;

                    if (i < data.length) {
                        console.log(i + ' ' + selector[0] + " " + timej(data[i].Timestamp));

                        rafid = raf(function(timestamp) {
                            //update start time
                            start = timestamp || new Date().getTime();
                            paused_ms = 0;

                            if (data[i].move == 1) {
                                X_rotation(timestamp, data[i].val, data[i].Duration, data[i].From);
                            } else {
                                X_delay(timestamp, data[i].Delay_end_start, data[i].From);

                            }
                        });
                    } else {
                        this.terminate();
                        this.cancelAnimationFrame(rafid)


                    }
                }



            }
        }
    }

    /**
     * Used in skip and restart. 
     * 
     * set isPaused and stopRec to false.
     * sample current start(time)
     * and rotate the element to the inital posistion before the next (i-th) move instance
     * either call rotation or delay.
     */
    this.play = function play() {
        isPaused = false;
        stopRec = false;
        //i = index where to start the animation
        if (i < LENGTH) {
            rafid = raf(function(timestamp) {

                start = timestamp || new Date.getTime();
                element.forEach(el => el.style.transform = 'rotate(' + (data[i].From) + 'deg)')
                if (data[i].move) {
                    X_rotation(timestamp, data[i].val, data[i].Duration, data[i].From);
                } else {
                    X_delay(timestamp, data[i].Delay_end_start, data[i].From)

                }

            });
        } else {
            this.terminate();

        }

    };
    /**
     * function that continues the animation after it was paused. 
     */
    this.continue = function continue_afterPause() {
        if (isPaused) {
            if (!seekd) { //if changed time the animation is running at 
                timestamp = (new Date).getTime()
                console.log(selector[0] + " " + timestamp + " " + paused_time)
                paused_ms += timestamp - paused_time;

            } else {
                pused_ms = 0;
                seekd = false;

            }

            isPaused = false;
            if (i < LENGTH) {
                rafid = raf(function(timestamp) {
                    if (data[i].move) {
                        X_rotation(timestamp, data[i].val, data[i].Duration, data[i].From);
                    } else {
                        X_delay(timestamp, data[i].Delay_end_start, data[i].From)

                    }

                });
            } else {
                this.terminate();

            }
        }
    };
    /**
     * pause animation
     * by setting isPaused = true and cancel the current animation frame (rafid)
     * also remember paused_time to track how long it was paused.
     */
    this.pause = function pause() {
        if (!isPaused) {
            isPaused = true;
            cancelAnimationFrame(rafid)

            paused_time = (new Date).getTime();

        }
    };

    /**
     * reset whole animation (but does not restart it)
     * stopRec == true--> stops recursive calls of X_roation /X_delay
     */
    function reset() {
        stopRec = true;
        cancelAnimationFrame(rafid)
            // console.log(document.getElementById('timeslider').value)
        document.getElementById('timeslider').value = 0;
        startindex = 0;
        i = 0;
        paused_ms = 0;


    };

    /**
     * restart whole animation
     */
    this.restart = function restart() {
        reset();
        this.play();
    }

    /**
     * skip to the time, an element is moved 
     * !! Does not work, since the time skipped to would be different for all elements. 
     */
    this.skip_simple = function skip_simple() {
        stopRec = true;
        cancelAnimationFrame(rafid);
        if (i < LENGTH) {
            if (data[i].move) {
                i += 2;

            } else {
                i++;
            }
            paused_ms = 0;

            this.play();
        }
    }

    /**
     * return current index ie. index of current movement
     */
    this.currInd = function currInd() {
        return i;
    }


    /**
     * make animation play faster.
     * @param {*} sp speedup factor
     */
    this.speedup = function speedup(sp) {
        speed = sp;
    };

    /**
     * Move the elmemnt to the positon (state) it would be if we as much time had passed as given by the progress_slider since start of animation. 
     * And continue playing the animation.
     * @param {String} progress_slider --> progress value of of the slider, miliseconds since start of animation
     * @param {*} notslider indicates if the slider was moved or ir we called this function for other purposes like skip.
     */
    this.seek = function seek(progress_slider, notslider) {

        stopRec = true;
        //paused_ms = 0;
        if (notslider == 1) {
            seekd = false;
        } else {
            seekd = true;
        }
        cancelAnimationFrame(rafid);

        var progress_slider = parseInt(progress_slider)
        var date_first = data[0].Timestamp;
        var temp = new Date(data[0].Timestamp);
        var progress_date = new Date(temp.setMilliseconds(temp.getMilliseconds() + progress_slider));
        data[0].Timestamp = date_first;

        //Get the current event to be animated (a rotation or delay)
        startindex = get(progress_date);
        i = startindex;

        if (i >= LENGTH) {
            i--;
            startindex--;
        }
        console.log('seek ' + i + " " + data[i].move + " " + selector[0] + " " + timej(progress_date))


        var runtime_move = (new Date(progress_date) - new Date(data[startindex].Timestamp)); //how many ms have passed since move for instance of i= startindex started

        var progress_move = (startindex == 0) ? 1 : ((data[startindex].move == 0) ? (runtime_move / data[startindex].Delay_end_start) : (runtime_move / data[startindex].Duration)); //percentage [0,1] of how many ms...
        progress_move = Math.min(progress_move, 1); // if move already done, we have progressmove > 1. ie take min.

        var rotation_done = (data[startindex].move) ? (data[startindex].val * progress_move) : 0;

        //rotate element to the position at time of progress
        element.forEach(el => el.style.transform = 'rotate(' + (rotation_done + data[startindex].From) + 'deg)')

        //continue playing animation
        if (data[startindex].move) {

            var rotation_val = data[startindex].val * (1 - progress_move);
            var duration_val = data[startindex].Duration - runtime_move;
            var inital_angle_val = rotation_done + data[startindex].From;

            rafid = raf(function(timestamp) {
                stopRec = false;
                isPaused = false;
                start = timestamp || new Date().getTime();

                //start rotation
                X_rotation(timestamp, rotation_val, duration_val, inital_angle_val);

            });


        } else {
            var duration_val = data[startindex].Delay_end_start - runtime_move;

            rafid = raf(function(timestamp) {
                stopRec = false;
                isPaused = false;
                start = timestamp || new Date().getTime();

                X_delay(timestamp, duration_val, data[i].From);

            });

        }

    }

    /**
     * binary search to find index of the data instance that would be playing at this time. 
     * @param {} timestamp 
     */
    function get(timestamp) {
        var left = 0;
        var right = data.length - 1;
        var m = Math.floor((left + right) / 2);
        var found = false;

        while (!found) {
            if (Math.abs(left - right) <= 1 || data[m].Timestamp == timestamp) {
                found = true;
                // console.log('found ' + data[m].Timestamp + " " + right + " " + m + " " + left)

                return m;
            } else if (data[m].Timestamp < timestamp) {
                left = m;
                m = Math.floor((left + right) / 2);

            } else {
                right = m;
                m = Math.floor((left + right) / 2);

            }
        }


    }
}


/**
 * A custom timeline. It animattes an element, according to attribute values given in the input data, in the floor plan (using the given selectors) in real time. 
 * The animation is mainly based on requestAnimationFrame function. 
 * This custom timeline is used to animate the elements whose open/close event can be animated as a transition
 * It is based on two functionscalled within it: X_roation and X_delay
 * X_rotation rotates the element, while X_delay waits until the next rotation.
 * Input: 
 * data: array of objects {Timestamp, To, From, Duration, Delay_end_start, Type: {1= OPEN/CLOSED, 0= sensorelement}, Move:{1 = move, 0 = wait}} PER SENSORELEMENT
 * selector: classes that define the sensor object inside the svg.
 * 
 * @param {*} data 
 * @param {*} selector 
 */
var custom_timeline_translate = function(data, selector) {


    var startindex = 0; //index from where to start the animation
    const element = document.querySelectorAll(selector);
    var i = 0; //index that determines current move instance
    const raf = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    var rafid;
    const LENGTH = data.length;
    /**
     * terminate animation if gone through whole dataset
     */
    this.terminate = function terminate() {
        console.log('terminatetranslae')
        reset();
        cancelAnimationFrame(rafid);

    };
    /**
     * 
     * start: start time of a move instance
     * runtime: how long the move instance is already running
     * progress: runtime fraction [0,1]
     * paused_ms: amount of time the animtion was puased. this is importnat to calculate the progress of a rotation or delay, as we need to exclude the time the animation was halted
     * paused_time: time the animation was last paused
     * isPaused:indicates whether the animation is currently paused
     * stopRec: indicates whether to stop the recursion
     * speed: current speed factor
     * seekd: indicates wether the aniamtion was recently seeked to a time
     * 
     */

    var isPaused = false;
    var stopRec = false;
    var start, paused_ms, paused_time;
    var speed = 1;
    var seekd = false;
    /**
     * transitions the element.
     * @param {date} timestamp 
     * @param {[int,int]} val_trans amout to translate the x and y coordinates by
     * @param {int} duration in ms. 
     * @param {[int,int]} to_translate 
     */
    function X_transition(timestamp, val_trans, duration, to_translate) {
        if (!stopRec) {
            if (isPaused) {
                const myPromise = new Promise(function(resolve, reject) {

                    function waitforplay() {
                        if (isPaused) {
                            window.setTimeout(waitforplay, 500);
                        } else {
                            resolve('fine_promise')
                            return;
                        }
                    }

                    waitforplay();
                })

                myPromise.then(function(response) {

                    rafid = raf(function(timestamp) {
                        //update start time
                        X_transition(timestamp, val_trans, duration, to_translate);
                    })
                })

            } else {
                //calculate how much time has passed since last animation frame, and compute the next coordinates to translate to
                timestamp = timestamp || new Date().getTime();
                runtime = (timestamp - start - paused_ms) * speed;
                progress = runtime / duration;
                progress = Math.min(progress, 1);
                // console.log([(to_translate[0] + (val_trans[0] * progress)), (to_translate[1] + (val_trans[1] * progress))])


                if (selector[0] == '.S_Fen_Unten_Str-6') {
                    trans_line = getPositionAlongTheLine(progress);
                    element.forEach(el => el.style.transform = 'translate(' + (trans_line.x) + 'px,' + (trans_line.y) + 'px)');

                } else {
                    element.forEach(el => el.style.transform = 'translate(' + (to_translate[0] + (val_trans[0] * progress)) + 'px,' + (to_translate[1] + (val_trans[1] * progress)) + 'px)')

                }
                //this instance is not finished yet, call function with same parameters again
                if (runtime < duration) {
                    rafid = raf(function(timestamp) {

                        X_transition(timestamp, val_trans, duration, to_translate);
                    });

                } else {
                    //this instance is finished yet, call function with parameters of next(i++) move, as long as there is a next
                    i++;

                    if (i < LENGTH) {
                        console.log(i + ' ' + selector[0] + " " + timej(data[i].Timestamp))

                        rafid = raf(function(timestamp) {
                            //update start time
                            paused_ms = 0;
                            start = timestamp || new Date().getTime();

                            if (data[i].move) {
                                X_transition(timestamp, data[i].val, data[i].Duration, data[i].From);
                            } else {
                                X_delay(timestamp, data[i].Delay_end_start);

                            }
                        });
                    } else {
                        this.terminate();

                    }
                }

            }
        }
    }
    /**
     * It keeps track of the time to wait until next transition is to be executed
     * @param {*} timestamp 
     * @param {Int} delay time to wait
     */
    function X_delay(timestamp, delay) {

        if (!stopRec) {
            if (isPaused) {
                const myPromise = new Promise(function(resolve, reject) {

                    function waitforplay() {
                        if (isPaused) {
                            window.setTimeout(waitforplay, 500);
                        } else {
                            resolve('fine_promise')
                            return;
                        }

                    }
                    waitforplay();

                })

                myPromise.then(function whenok(response) {
                    timestamp = (new Date).getTime();

                    rafid = raf(function(timestamp) {
                        X_delay(timestamp, delay);
                    });
                })

            } else {
                timestamp = timestamp || new Date().getTime()
                runtime = (timestamp - start - paused_ms) * speed;

                //this instance is not finished yet, call function with same parameters again
                if (runtime < delay) {
                    rafid = raf(function(timestamp) {

                        X_delay(timestamp, delay);
                    });

                } else {

                    i++;

                    if (i < LENGTH) {

                        console.log(i + ' ' + selector[0] + " " + timej(data[i].Timestamp))

                        rafid = raf(function(timestamp) {
                            //update start time
                            start = timestamp || new Date().getTime();
                            paused_ms = 0;

                            if (data[i].move == 1) {
                                X_transition(timestamp, data[i].val, data[i].Duration, data[i].From);
                            } else {
                                X_delay(timestamp, data[i].Delay_end_start);

                            }
                        });
                    } else {
                        this.terminate();
                    }
                }



            }
        }
    }

    /**
     * Used in skip and restart. 
     * 
     * set isPaused and stopRec to false.
     * sample current start(time)
     * and transition the element to the inital posistion before the next (i-th) move instance
     * either call rotation or delay.
     */
    this.play = function play() {
        isPaused = false;
        stopRec = false;
        //i = index where to start the animation
        if (i < LENGTH) {

            rafid = raf(function(timestamp) {
                start = timestamp || new Date.getTime();
                console.log(data[i].val)
                if (selector[0] != '.S_Fen_Unten_Str-6') element.forEach(el => el.style.transform = 'translate(' + (data[i].val[0]) + 'px,' + (data[i].val[1]) + 'px)')
                if (data[i].move) {
                    X_transition(timestamp, data[i].val, data[i].Duration, data[i].From);
                } else {
                    X_delay(timestamp, data[i].Delay_end_start)

                }


            });
        }


    };
    /**
     * function that continues the animation after it was paused. 
     */
    this.continue = function continue_afterPause() {
        if (isPaused) {
            if (!seekd) { //if changed time the animation is running at 
                timestamp = (new Date).getTime()
                console.log(selector[0] + " " + timestamp + " " + paused_time)
                paused_ms += timestamp - paused_time;

            } else {
                pused_ms = 0;
                seekd = false;

            }

            isPaused = false;

            if (i < LENGTH) {
                rafid = raf(function(timestamp) {
                    if (data[i].move) {
                        X_transition(timestamp, data[i].val, data[i].Duration, data[i].From);
                    } else {
                        X_delay(timestamp, data[i].Delay_end_start)

                    }

                });
            } else {
                this.terminate();

            }
        }

    };
    /**
     * pause animation
     * by setting isPaused = true and cancel the current animation frame (rafid)
     * also remember paused_time to track how long it was paused.
     */
    this.pause = function pause() {
        if (!isPaused) {
            isPaused = true;
            cancelAnimationFrame(rafid)

            paused_time = (new Date).getTime();

        }
    };
    /**
     * reset whole animation (but does not restart it)
     * stopRec == true--> stops recursive calls of X_transition /X_delay
     */
    function reset() {
        stopRec = true;
        cancelAnimationFrame(rafid);

        startindex = 0;
        i = 0;
        paused_ms = 0;


    };

    /**
     * restart whole animation
     */
    this.restart = function restart() {
        reset();
        this.play();
    };

    /**
     * skip to the time, an element is moved 
     * !! Does not work, since the time skipped to would be different for all elements. 
     */
    this.skip_simple = function skip_simple() {
        stopRec = true;
        cancelAnimationFrame(rafid);

        if (data[i].move) {
            i += 2;

        } else {
            i++;
        }
        paused_ms = 0;

        this.play();
    };

    /**
     * return current index ie. index of current movement
     */
    this.currInd = function currInd() {
        return i;
    }

    /**
     * make animation play faster.
     * @param {*} sp speedup factor
     */
    this.speedup = function speedup(sp) {
        speed = sp;
        console.log(speed)
    };

    /**
     * 
     * Move the elmemnt to the positon (state) it would be if we as much time had passed as given by the progress_slider since start of animation. 
     * And continue playing the animation.
     * @param {String} progress_slider --> progress value of SLIDER, miliseconds since start of animation
     * @param {*} notslider indicates if the slider was moved or we called this function for other purposes like skip.
     */
    this.seek = function seek(progress_slider, notslider) {

        stopRec = true;
        //paused_ms = 0;
        if (notslider == 1) {
            seekd = false;
        } else {
            seekd = true;
        }

        cancelAnimationFrame(rafid);

        var progress_slider = parseInt(progress_slider)
        var date_first = data[0].Timestamp;
        var temp = new Date(data[0].Timestamp);
        var progress_date = new Date(temp.setMilliseconds(temp.getMilliseconds() + progress_slider));
        data[0].Timestamp = date_first;

        //Get the current event to be animated (a transition or delay)
        startindex = get(progress_date);
        i = startindex;
        if (i >= LENGTH) {
            i--;
            startindex--;
        }
        console.log('seek ' + i + " " + data[i].move + " " + selector[0] + " " + timej(progress_date))

        var runtime_move = (new Date(progress_date) - new Date(data[startindex].Timestamp)); //* speed; //how many ms have passed since move for instance of i= startindex started

        var progress_move = (startindex == 0) ? 1 : ((data[startindex].move == 0) ? (runtime_move / data[startindex].Delay_end_start) : (runtime_move / data[startindex].Duration)); //percentage [0,1] of how many ms...
        progress_move = Math.min(progress_move, 1); // if move already done, we have progressmove > 1. ie take min.

        var transition_done = (data[startindex].move) ? (data[startindex].val.map(x => x * progress_move)) : [0, 0];

        //rotate element to the position at time of progress
        console.log('trans_doone ' + transition_done);
        console.log(data[startindex]);



        if (selector[0] == '.S_Fen_Unten_Str-6') {
            trans_line = getPositionAlongTheLine(progress_move);
            element.forEach(el => el.style.transform = 'translate(' + (trans_line.x) + 'px,' + (trans_line.y) + 'px)');

        } else {
            element.forEach(el => el.style.transform = 'translate(' + (data[i].From[0] + transition_done[0]) + 'px,' + (data[i].From[1] + transition_done[1]) + 'px)');

        }



        //continue playing animation
        if (data[startindex].move) {

            var trans_prog_val = data[startindex].val.map(x => x * (1 - progress_move));
            trans_prog_val = [trans_prog_val[0] + data[startindex].From[0], trans_prog_val[1] + data[startindex].From[1]]
            var duration_val = data[startindex].Duration - runtime_move;

            rafid = raf(function(timestamp) {
                stopRec = false;
                isPaused = false;
                start = timestamp || new Date().getTime();

                X_transition(timestamp, trans_prog_val, duration_val, data[startindex].From);

            });


        } else {
            var duration_val = data[startindex].Delay_end_start - runtime_move;

            rafid = raf(function(timestamp) {
                stopRec = false;
                isPaused = false;
                start = timestamp || new Date().getTime();

                X_delay(timestamp, duration_val);

            });

        }

    }

    function getPositionAlongTheLine(percentage) {
        return { x: -30.65 * (1.0 - percentage) + -26.65 * percentage, y: -146.82 * (1.0 - percentage) + -147.82 * percentage };
    }


    /**
     * binary search to find index of the data instance that would be playing at this time. 
     * @param {} timestamp 
     */
    function get(timestamp) {
        var left = 0;
        var right = data.length - 1;
        var m = Math.floor((left + right) / 2);
        var found = false;

        while (!found) {
            if (Math.abs(left - right) <= 1 || data[m].Timestamp == timestamp) {
                found = true;
                // console.log('found ' + data[m].Timestamp + " " + right + " " + m + " " + left)

                return m;
            } else if (data[m].Timestamp < timestamp) {
                left = m;
                m = Math.floor((left + right) / 2);

            } else {
                right = m;
                m = Math.floor((left + right) / 2);

            }
        }

    }

}



/**
 * A custom timeline. It animates an element, according to attribute values given in the input data, in the floor plan (using the given selectors) in real time. 
 * The animation is mainly based on requestAnimationFrame function. 
 * This custom timeline is used to animate the doors of the drehwand whose open/close event is animated by rotations, but whose center of rotation depend on the current angle position of the drewhand.
 * It is based on two functionscalled within it: X_roation and X_delay
 * X_rotation rotates the element, while X_delay waits until the next rotation.
 * Input: 
 * data: array of objects {Timestamp, To, From, Duration, Delay_end_start, Type: {1= OPEN/CLOSED, 0= sensorelement}, Move:{1 = move, 0 = wait}} PER SENSORELEMENT
 * selector: classes that define the sensor object inside the svg.
 * 
 * @param {*} data 
 * @param {*} selector 
 * @param {*} x offset of the x coordinate from the elemtent center of rotation to the center of the rotation of drehwand
 * @param {*} y offset of the y coordinate from the elemtent center of rotation to the center of the rotation of drehwand
 * 
 */
var custom_timeline_door_rotation = function(data, selector, x, y) {


    var startindex = 0; //index from where to start the animation
    const element = document.querySelectorAll(selector);
    var i = 0; //index that determines current move instance
    const raf = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    var rafid;
    const LENGTH = data.length;
    /**
     * terminate animation if gone through whole dataset here
     */
    this.terminate = function terminate() {
            reset();

            cancelAnimationFrame(rafid);

        }
        /**
         * 
         * start: start time of a move instance
         * runtime: how long the move instance is already running
         * progress: runtime fraction [0,1]
         * paused_ms: amount of time the animtion was puased. this is importnat to calculate the progress of a rotation or delay, as we need to exclude the time the animation was halted
         * paused_time: time the animation was last paused
         * isPaused:indicates whether the animation is currently paused
         * stopRec: indicates whether to stop the recursion
         * speed: current speed factor
         * seekd: indicates wether the aniamtion was recently seeked to a time
         * 
         */

    var isPaused = false;
    var stopRec = false;
    var start, paused_ms, paused_time;
    var speed = 1;
    var seekd = false;
    /**
     * rotates the element.
     * @param {date} timestamp 
     * @param {float} rotation amount of rotation
     * @param {int} duration duration of the rotation in ms
     * @param {int} inital_angle the inital anlge the element was at
     * @param {float} DS_angle the current anlge of DS 
     * 
     */
    function X_rotation(timestamp, rotation, duration, inital_angle, DS_angle) {
        if (!stopRec) {
            if (isPaused) {
                const myPromise = new Promise(function(resolve, reject) {

                    function waitforplay() {
                        if (isPaused) {
                            window.setTimeout(waitforplay, 500);
                        } else {
                            resolve('fine_promise')
                            return;
                        }
                    }

                    waitforplay();
                })

                myPromise.then(function(response) {

                    rafid = raf(function(timestamp) {
                        //update start time
                        X_rotation(timestamp, rotation, duration, inital_angle, DS_angle);
                    })
                })

            } else {

                timestamp = timestamp || new Date().getTime()
                runtime = (timestamp - start - paused_ms) * speed;
                progress = runtime / duration;
                progress = Math.min(progress, 1);

                element.forEach(el => el.style.transform = "rotate(" + DS_angle + "deg) translate(" + (-x) + "px," + (-y) + 'px) rotate(' + (rotation * progress + inital_angle) + 'deg) translate(' + x + "px," + y + "px) ")


                //this instance is not finished yet, call function with same parameters again
                if (runtime < duration) {
                    rafid = raf(function(timestamp) {

                        X_rotation(timestamp, rotation, duration, inital_angle, DS_angle);
                    });

                } else {
                    //this instance is finished yet, call function with parameters of next(i++) move, as long as there is a next
                    i++;

                    if (i < data.length) {
                        console.log(i + ' ' + selector[0] + " " + timej(data[i].Timestamp))

                        rafid = raf(function(timestamp) {
                            //update start time
                            paused_ms = 0;
                            start = timestamp || new Date().getTime();

                            if (data[i].move) {
                                X_rotation(timestamp, data[i].val, data[i].Duration, data[i].From, data[i].DS);
                            } else {
                                X_delay(timestamp, data[i].Delay_end_start, data[i].From);

                            }
                        });
                    } else {
                        this.terminate();

                    }
                }

            }
        }
    }
    /**
     * It keeps track of the time to wait until next transition is to be executed
     * @param {*} timestamp 
     * @param {*} delay time to wait
     */
    function X_delay(timestamp, delay, inital_angle) {

        if (!stopRec) {
            if (isPaused) {
                //paused_ms = timestamp - paused_time;
                const myPromise = new Promise(function(resolve, reject) {

                    function waitforplay() {
                        if (isPaused) {
                            window.setTimeout(waitforplay, 500);
                        } else {
                            resolve('fine_promise')
                            return;
                        }

                    }
                    waitforplay();

                })

                myPromise.then(function whenok(response) {
                    timestamp = (new Date).getTime();

                    rafid = raf(function(timestamp) {
                        X_delay(timestamp, delay, inital_angle);
                    });
                })

            } else {
                timestamp = timestamp || new Date().getTime()
                runtime = (timestamp - start - paused_ms) * speed;

                //this instance is not finished yet, call function with same parameters again
                if (runtime < delay) {
                    rafid = raf(function(timestamp) {

                        X_delay(timestamp, delay, inital_angle);
                    });

                } else {

                    i++;

                    if (i < data.length) {
                        console.log(i + ' ' + selector[0] + " " + timej(data[i].Timestamp));

                        rafid = raf(function(timestamp) {
                            //update start time
                            start = timestamp || new Date().getTime();
                            paused_ms = 0;

                            if (data[i].move == 1) {
                                X_rotation(timestamp, data[i].val, data[i].Duration, data[i].From, data[i].DS);
                            } else {
                                X_delay(timestamp, data[i].Delay_end_start, data[i].From);

                            }
                        });
                    } else {
                        this.terminate();

                    }
                }



            }
        }
    }

    /**
     * Used in skip and restart. 
     * 
     * set isPaused and stopRec to false.
     * sample current start(time)
     * and rotate the element to the inital posistion before the next (i-th) move instance
     * either call rotation or delay.
     */
    this.play = function play() {
        isPaused = false;
        stopRec = false;
        //i = index where to start the animation
        if (i < LENGTH) {
            rafid = raf(function(timestamp) {

                start = timestamp || new Date.getTime();
                console.log("rotate(" + (data[i].DS) + ") translate(-3.95px,-30.07px)  rotate(" + (data[i].From) + ") translate(3.95px,30.07px) ")
                element.forEach(el => el.style.transform = "rotate(" + (data[i].DS) + ") translate( " + (-x) + "px," + (-y) + "px)  rotate(" + (data[i].From) + ") translate(" + x + "px," + y + "px) ") // translate(-3.95px,-30.07px) rotate(50) ");

                if (data[i].move) {
                    X_rotation(timestamp, data[i].val, data[i].Duration, data[i].From, data[i].DS);
                } else {
                    X_delay(timestamp, data[i].Delay_end_start, data[i].From)

                }

            });
        }

    };
    /**
     * function that continues the animation after it was paused. 
     */
    this.continue = function continue_afterPause() {
        if (isPaused) {
            if (!seekd) { //if changed time the animation is running at 
                timestamp = (new Date).getTime()
                console.log(selector[0] + " " + timestamp + " " + paused_time)
                paused_ms += timestamp - paused_time;

            } else {
                pused_ms = 0;
                seekd = false; //umstellen

            }

            isPaused = false;
            if (i < LENGTH) {
                rafid = raf(function(timestamp) {
                    if (data[i].move) {
                        X_rotation(timestamp, data[i].val, data[i].Duration, data[i].From, data[i].DS);
                    } else {
                        X_delay(timestamp, data[i].Delay_end_start, data[i].From)

                    }

                });
            } else {
                this.terminate();

            }
        }


    };
    /**
     * pause animation
     * by setting isPaused = true and cancel the current animation frame (rafid)
     * also remember paused_time to track how long it was paused.
     */
    this.pause = function pause() {
        if (!isPaused) {
            isPaused = true;
            cancelAnimationFrame(rafid)

            paused_time = (new Date).getTime();

        }
    };
    /**
     * reset whole animation (but does not restart it)
     * stopRec == true--> stops recursive calls of X_roation /X_delay
     */
    function reset() {
        stopRec = true;
        cancelAnimationFrame(rafid)
        document.getElementById('timeslider').value = 0;
        startindex = 0;
        i = 0;
        paused_ms = 0;


    };

    /**
     * restart whole animation
     */
    this.restart = function restart() {
        reset();
        this.play();
    };

    /**
     * skip to the time, an element is moved 
     * !! Does not work, since the time skipped to would be different for all elements. 
     */
    this.skip_simple = function skip_simple() {
        stopRec = true;
        cancelAnimationFrame(rafid);
        if (i < LENGTH) {
            if (data[i].move) {
                i += 2;

            } else {
                i++;
            }
            paused_ms = 0;

            this.play();
        } else {
            this.terminate();
        }
    };

    /**
     * return current index ie. index of current movement
     */
    this.currInd = function currInd() {
        return i;
    };

    //make animation run faster.
    this.speedup = function speedup(sp) {
        speed = sp;
        console.log(speed)
    };


    /**
     * 
     * move the elmemnt to the positon it would be if we were at progress_slider ms since start of animation.  And continue playing the animation.
     * @param {String} progress_slider --> progress value of SLIDER, miliseconds since start of animation
     * @param {*} notslider indicates if the slider was moved or we called this function for other purposes like skip.
     */
    this.seek = function seek(progress_slider, notslider) {

        stopRec = true;
        //paused_ms = 0;
        if (notslider == 1) {
            seekd = false;
        } else {
            seekd = true; //not if ... !!! cocococococococ
        }
        console.log(progress_slider)
        cancelAnimationFrame(rafid);

        var progress_slider = parseInt(progress_slider)
        var date_first = data[0].Timestamp;
        var temp = new Date(data[0].Timestamp);
        var progress_date = new Date(temp.setMilliseconds(temp.getMilliseconds() + progress_slider));
        data[0].Timestamp = date_first;

        startindex = get(progress_date);
        i = startindex;

        if (i >= LENGTH) {
            i--;
            startindex--;
        }
        console.log('seek ' + i + " " + data[i].move + " " + selector[0] + " " + timej(progress_date))

        var runtime_move = (new Date(progress_date) - new Date(data[startindex].Timestamp)); //* speed; //how many ms have passed since move for instance of i= startindex started

        var progress_move = (startindex == 0) ? 1 : ((data[startindex].move == 0) ? (runtime_move / data[startindex].Delay_end_start) : (runtime_move / data[startindex].Duration)); //percentage [0,1] of how many ms...
        progress_move = Math.min(progress_move, 1); // if move already done, we have progressmove > 1. ie take min.
        var rotation_done = (data[startindex].move) ? (data[startindex].val * progress_move) : 0;

        //rotate element to the position at time of progress
        // element.forEach(el => el.style.transform = 'rotate(' + (rotation_done + data[startindex].From) + 'deg)')

        element.forEach(el => el.style.transform = "rotate(" + data[startindex].DS + ") translate(" + (-x) + "px," + (-y) + "px)  rotate(" + (rotation_done + data[startindex].From) + ") translate(" + x + "px," + y + "px) ");


        //continue playing animation
        if (data[startindex].move) {

            var rotation_val = data[startindex].val * (1 - progress_move);
            var duration_val = data[startindex].Duration - runtime_move;
            var inital_angle_val = rotation_done + data[startindex].From;

            rafid = raf(function(timestamp) {
                stopRec = false;
                isPaused = false;
                start = timestamp || new Date().getTime();

                X_rotation(timestamp, rotation_val, duration_val, inital_angle_val, data[startindex].DS);

            });


        } else {
            var duration_val = data[startindex].Delay_end_start - runtime_move;

            rafid = raf(function(timestamp) {
                stopRec = false;
                isPaused = false;
                start = timestamp || new Date().getTime();

                X_delay(timestamp, duration_val, data[i].From);

            });

        }

    }

    /**
     * binary search to find index of the data instance that would be playing at this time. 
     * @param {} timestamp 
     */
    function get(timestamp) {
        var left = 0;
        var right = data.length - 1;
        var m = Math.floor((left + right) / 2);
        var found = false;

        while (!found) {
            if (Math.abs(left - right) <= 1 || data[m].Timestamp == timestamp) {
                found = true;
                // console.log('found ' + data[m].Timestamp + " " + right + " " + m + " " + left)

                return m;
            } else if (data[m].Timestamp < timestamp) {
                left = m;
                m = Math.floor((left + right) / 2);

            } else {
                right = m;
                m = Math.floor((left + right) / 2);

            }
        }


    }
}


/**
 * A custom timeline. It animattes an element, according to attribute values given in the input data, in the floor plan (using the given selectors) in real time. 
 * The animation is mainly based on requestAnimationFrame function. 
 * This custom timeline is used to animate elements open/closed events by changing their fill.
 * It uses two function: X_fill and X_delay
 * X_fill rotates the element, while X_delay waits until the next rotation.
 * Input: 
 * data: array of objects {Timestamp, To, From, Duration, Delay_end_start, Type: {1= OPEN/CLOSED, 0= sensorelement}, Move:{1 = move, 0 = wait}} PER SENSORELEMENT
 * selector: classes that define the sensor object inside the svg.
 * 
 * @param {*} data 
 * @param {*} selector 
 */
var custom_timeline_fill = function(data, selector) {

    var startindex = 0; //index from where to start the animation
    const element = document.querySelectorAll(selector);
    var i = 0; //index that determines current move instance
    const raf = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    var rafid;
    const LENGTH = data.length;
    /**
     * terminate animation if gone through whole dataset
     */
    this.terminate = function terminate() {
        reset();

        cancelAnimationFrame(rafid);

    };

    /**
     * 
     * start: start time of a move instance
     * runtime: how long the move instance is already running
     * progress: runtime fraction [0,1]
     * paused_ms: amount of time the animtion was puased. this is importnat to calculate the progress of a rotation or delay, as we need to exclude the time the animation was halted
     * paused_time: time the animation was last paused
     * isPaused:indicates whether the animation is currently paused
     * stopRec: indicates whether to stop the recursion
     * speed: current speed factor
     * seekd: indicates wether the aniamtion was recently seeked to a time
     * 
     */

    var isPaused = false;
    var stopRec = false;
    var start, paused_ms, paused_time;
    var speed = 1;
    var seekd = false;
    /**
     * fill the element.
     * @param {date} timestamp 
     * @param {string} color 
     * @param {int} duration 
     */
    function X_fill(timestamp, color, duration) {
        if (!stopRec) {
            if (isPaused) {
                const myPromise = new Promise(function(resolve, reject) {

                    function waitforplay() {
                        if (isPaused) {
                            window.setTimeout(waitforplay, 500);
                        } else {
                            resolve('fine_promise')
                            return;
                        }
                    }

                    waitforplay();
                })

                myPromise.then(function(response) {


                    rafid = raf(function(timestamp) {
                        //update start time
                        X_fill(timestamp, color, duration);
                    })
                })

            } else {

                timestamp = timestamp || new Date().getTime()
                runtime = (timestamp - start - paused_ms) * speed;
                progress = runtime / duration;
                progress = Math.min(progress, 1);

                element.forEach(el => el.style.fill = color)

                //this instance is not finished yet, call function with same parameters again
                if (runtime < duration) {
                    rafid = raf(function(timestamp) {

                        X_fill(timestamp, color, duration);
                    });

                } else {
                    //this instance is finished yet, call function with parameters of next(i++) move, as long as there is a next
                    i++;

                    if (i < data.length) {
                        console.log(i + ' ' + selector[0] + " " + timej(data[i].Timestamp))

                        rafid = raf(function(timestamp) {
                            //update start time
                            paused_ms = 0;
                            start = timestamp || new Date().getTime();

                            if (data[i].move) {
                                X_fill(timestamp, data[i].val, data[i].Duration);
                            } else {
                                X_delay(timestamp, data[i].Delay_end_start, data[i].From);

                            }
                        });
                    } else {
                        this.terminate();
                        this.cancelAnimationFrame(rafid);


                    }
                }

            }
        }
    }
    /**
     * It keeps track of the time to wait until next transition is to be executed
     * @param {*} timestamp 
     * @param {Int} delay time to wait
     */
    function X_delay(timestamp, delay, inital_angle) {

        if (!stopRec) {
            if (isPaused) {
                const myPromise = new Promise(function(resolve, reject) {

                    function waitforplay() {
                        if (isPaused) {
                            window.setTimeout(waitforplay, 500);
                        } else {
                            resolve('fine_promise')
                            return;
                        }

                    }
                    waitforplay();

                })

                myPromise.then(function whenok(response) {
                    timestamp = (new Date).getTime();

                    rafid = raf(function(timestamp) {
                        X_delay(timestamp, delay, inital_angle);
                    });
                })

            } else {
                timestamp = timestamp || new Date().getTime()
                runtime = (timestamp - start - paused_ms) * speed;

                //this instance is not finished yet, call function with same parameters again
                if (runtime < delay) {
                    rafid = raf(function(timestamp) {

                        X_delay(timestamp, delay, inital_angle);
                    });

                } else {

                    i++;

                    if (i < data.length) {
                        console.log(i + ' ' + selector[0] + " " + timej(data[i].Timestamp));

                        rafid = raf(function(timestamp) {
                            //update start time
                            start = timestamp || new Date().getTime();
                            paused_ms = 0;

                            if (data[i].move == 1) {
                                X_fill(timestamp, data[i].val, data[i].Duration);
                            } else {
                                X_delay(timestamp, data[i].Delay_end_start, data[i].From);

                            }
                        });
                    } else {
                        this.terminate();
                        this.cancelAnimationFrame(rafid)

                    }
                }



            }
        }
    }

    /**
     * Used in skip and restart. 
     * 
     * set isPaused and stopRec to false.
     * sample current start(time)
     * and colour the element to the inital colour before the next (i-th) move instance
     * either call rotation or delay.
     */
    this.play = function play() {
        isPaused = false;
        stopRec = false;
        //i = index where to start the animation
        if (i < LENGTH) {
            rafid = raf(function(timestamp) {

                start = timestamp || new Date.getTime();
                element.forEach(el => el.style.fill = data[i].val)
                if (data[i].move) {
                    X_fill(timestamp, data[i].val, data[i].Duration);
                } else {
                    X_delay(timestamp, data[i].Delay_end_start, data[i].From)

                }

            });
        } else {
            this.terminate();
        }

    };
    /**
     * function that continues the animation after it was paused. 
     */
    this.continue = function continue_afterPause() {
        if (isPaused) {
            if (!seekd) { //if changed time the animation is running at 
                timestamp = (new Date).getTime()
                console.log(selector[0] + " " + timestamp + " " + paused_time)
                paused_ms += timestamp - paused_time;

            } else {
                pused_ms = 0;
                seekd = false;

            }

            isPaused = false;
            if (i < LENGTH)
                rafid = raf(function(timestamp) {
                    if (data[i].move) {
                        X_fill(timestamp, data[i].val, data[i].Duration);
                    } else {
                        X_delay(timestamp, data[i].Delay_end_start, data[i].From)

                    }

                });
        } else {
            this.terminate();
        }


    };
    /**
     * pause animation
     * by setting isPaused = true and cancel the current animation frame (rafid)
     * also remember paused_time to track how long it was paused.
     */
    this.pause = function pause() {
        if (!isPaused) {
            isPaused = true;
            cancelAnimationFrame(rafid)

            paused_time = (new Date).getTime();

        }
    };
    /**
     * reset whole animation (but does not restart it)
     * stopRec == true--> stops recursive calls of X_fill /X_delay
     */
    function reset() {
        stopRec = true;
        cancelAnimationFrame(rafid)
            // console.log(document.getElementById('timeslider').value)
        document.getElementById('timeslider').value = 0;
        startindex = 0;
        i = 0;
        paused_ms = 0;


    }

    /**
     * restart whole animation
     */
    this.restart = function restart() {
        reset();
        this.play();
    }

    /**
     * skip to the time, an element is moved 
     * !! Does not work, since the time skipped to would be different for all elements. 
     */
    this.skip_simple = function skip_simple() {
        stopRec = true;
        cancelAnimationFrame(rafid);
        if (i < LENGTH) {
            if (data[i].move) {
                i += 2;

            } else {
                i++;
            }
            paused_ms = 0;

            this.play();
        }
    }

    /**
     * return current index ie. index of current movement
     */
    this.currInd = function currInd() {
        return i;
    }

    //make animation run faster.
    this.speedup = function speedup(sp) {
        speed = sp;
    };

    /**
     * 
     * move the elmemnt to the positon it would be if we were at progress_slider ms since start of animation.  And continue playing the animation.
     * @param {String} progress_slider --> progress value of SLIDER, miliseconds since start of animation
     * @param {*} notslider indicates if the slider was moved or we called this function for other purposes like skip.
     */
    this.seek = function seek(progress_slider, notslider) {

        stopRec = true;
        //paused_ms = 0;
        if (notslider == 1) {
            seekd = false;
        } else {
            seekd = true;
        }
        console.log(progress_slider)
        cancelAnimationFrame(rafid);

        var progress_slider = parseInt(progress_slider)
        var date_first = data[0].Timestamp;
        var temp = new Date(data[0].Timestamp);
        var progress_date = new Date(temp.setMilliseconds(temp.getMilliseconds() + progress_slider));
        data[0].Timestamp = date_first;

        startindex = get(progress_date);
        i = startindex;

        if (i >= LENGTH) {
            i--;
            startindex--;
        }
        console.log('seek ' + i + " " + data[i].move + " " + selector[0] + " " + timej(progress_date))

        var runtime_move = (new Date(progress_date) - new Date(data[startindex].Timestamp)); //* speed; //how many ms have passed since move for instance of i= startindex started

        var progress_move = (startindex == 0) ? 1 : ((data[startindex].move == 0) ? (runtime_move / data[startindex].Delay_end_start) : (runtime_move / data[startindex].Duration)); //percentage [0,1] of how many ms...
        progress_move = Math.min(progress_move, 1); // if move already done, we have progressmove > 1. ie take min.

        //rotate element to the position at time of progress
        element.forEach(el => el.style.fill = data[startindex].val)

        //continue playing animation
        if (data[startindex].move) {

            var col = data[startindex].val;
            var duration_val = data[startindex].Duration - runtime_move;

            rafid = raf(function(timestamp) {
                stopRec = false;
                isPaused = false;
                start = timestamp || new Date().getTime();

                X_fill(timestamp, col, duration_val);

            });


        } else {
            var duration_val = data[startindex].Delay_end_start - runtime_move;

            rafid = raf(function(timestamp) {
                stopRec = false;
                isPaused = false;
                start = timestamp || new Date().getTime();

                X_delay(timestamp, duration_val, data[i].From);

            });

        }

    }

    /**
     * binary search to find index of the data instance that would be playing at this time. 
     * @param {} timestamp 
     */
    function get(timestamp) {
        var left = 0;
        var right = data.length - 1;
        var m = Math.floor((left + right) / 2);
        var found = false;

        while (!found) {
            if (Math.abs(left - right) <= 1 || data[m].Timestamp == timestamp) {
                found = true;
                // console.log('found ' + data[m].Timestamp + " " + right + " " + m + " " + left)

                return m;
            } else if (data[m].Timestamp < timestamp) {
                left = m;
                m = Math.floor((left + right) / 2);

            } else {
                right = m;
                m = Math.floor((left + right) / 2);

            }
        }


    }
}