var item = shuffle(["item1", "item2", "item3", "item4"])

var targetPositionTest = ([
    shuffle(["left", "right"]),
    shuffle(["left", "right"]),
    shuffle(["left", "right"]),
    shuffle(["left", "right"]),
    shuffle(["left", "right"]),
    shuffle(["left", "right"]),
    shuffle(["left", "right"]),
    shuffle(["left", "right"])
]).flat()

var targetPositionFam = shuffle(["left", "right"]) // same length as there are fam trials

var targetPosition = targetPositionFam.concat(targetPositionTest)

var targetShape = ([
    shuffle(["round", "edge"]),
    shuffle(["round", "edge"]),
    shuffle(["round", "edge"]),
    shuffle(["round", "edge"]),
    shuffle(["round", "edge"]),
    shuffle(["round", "edge"]),
    shuffle(["round", "edge"]),
    shuffle(["round", "edge"])
]).flat()


var condition = shuffle(["rep", "pars", "fsim"])

var actions = ["look", "eyesclosed", "open", "play", "hidebanana", "holdbanana", "occluderup", "blocksup", "holdemptyhands", "blocksdown", "occluderdown", "holdpaper", "help", "draw", "helpwhere", "showcue"]

showSlide("instructions")

var symlit = {
    // Parameters for this sequence.
    trial: ["fam", 1, 2, 3, 4, 5, 6],
    action: Object.assign([], actions),
    condition: condition,
    targetShape: Object.assign([], targetShape),
    item: item,
    targetPosition: Object.assign([], targetPosition),
    data: [],



    // end of the experiment
    end: function() {
        // Show the finish slide.
        showSlide("finished");

        setTimeout(function() { downloadData(symlit.data) }, 0);

        // handle webcam file
        //stopRecorder();

        // show upload spinner
        //modalContent(`<img src='images/spinner-upload.svg' width='800px';>`, `#E1B4B4`)

        // setTimeout(() => {
        //   uploadVideo(
        //     {
        //       fname: train.subid,
        //       uploadContent: `<img src='images/spinner-upload.svg' width='800px';>`,
        //       uploadColor: `#E1B4B4`,
        //       successContent: `<img src='images/spinner-done.svg' width='800px';>`,
        //       successColor: `#D3F9D3`
        //     }
        //   );
        // }, 1000);


        //setTimeout(function() { turk.submit(symlit) }, 500);
    },

    // moving on within a trial
    next: function() {

        // when no more trials are left, end experiment
        if (symlit.trial.length == 0) {
            setTimeout(function() { symlit.end() }, 0);
            return;
        };


        // if (symlit.trial.length < 5){
        //   symlit.action = ["placeblocks","hidebanana","holdbanana","occluderup","blocksup","holdemptyhands","blocksdown","occluderdown", "holdpaper","help","draw","helpwhere","showcue"]
        //   return;
        // };

        // if (symlit.trial[0] > 5){
        //
        // };

        showSlide("stage");

        $(".button").unbind("click");
        $(".button").hide();

        $(".leftChoiceBlock").show()
        $(".rightChoiceBlock").show()

        $(".occluder").hide();

        document.getElementById("cue").src = "images/stimuli/empty.png";
        document.getElementById("cuepaper").src = "images/stimuli/empty.png";
        $(".cue").show();
        $(".cuepaper").show();

        showAgent(symlit.action[0]);


        if (symlit.action[0] == "play" && symlit.trial[0] == "fam") {
            symlit.action[1] = "hidebanana_fam"
        }

        showStim(symlit.trial[0], symlit.item[0], symlit.targetShape[0], symlit.targetPosition[0])

        if (symlit.action[0] == "holdbanana") {

            if (symlit.trial[0] == "fam") {
                symlit.action.shift()
            }
        }


        if (symlit.action[0] == "occluderup") {

            if (symlit.trial[0] == "fam") {
                $(".occluder").hide();
            } else {
                $(".occluder").show();
            }

        }

        if (symlit.action[0] == "blocksup") {

            if (symlit.trial[0] == "fam") {
                $(".occluder").hide();
            } else {
                $(".occluder").show();
            }


            $(".leftChoiceBlock").css({ bottom: "30%" })
            $(".rightChoiceBlock").css({ bottom: "30%" })

        }

        if (symlit.action[0] == "holdemptyhands") {

            if (symlit.trial[0] == "fam") {
                $(".occluder").hide();
            } else {
                $(".occluder").show();
            }

            document.getElementById(symlit.targetPosition[0] + "Object").src = "images/banana.png";
            $("." + symlit.targetPosition[0] + "Object").show();
        }

        if (symlit.action[0] == "blocksdown") {

            if (symlit.trial[0] == "fam") {
                $(".occluder").hide();
            } else {
                $(".occluder").show();
            }

            $(".leftChoiceBlock").css({ bottom: "5%" })
            $(".rightChoiceBlock").css({ bottom: "5%" })
                //$(".leftObject").css({bottom: "5%"})
                //$(".rightObject").css({bottom: "5%"})
            document.getElementById(symlit.targetPosition[0] + "Object").src = "images/stimuli/empty.png";

            if (symlit.trial[0] == "fam") {
                symlit.action = ["choice"]
            }

        }


        if (symlit.action[0] == "occluderdown") {

            $(".occluder").hide();
        }



        if (symlit.action[0] == "showcue") {

            document.getElementById("cue").src = "images/stimuli/" + symlit.item[0] + "_" + symlit.condition[0] + "_" + symlit.targetShape[0] + ".png";
            document.getElementById("cuepaper").src = "images/cuepaper.png";
        }

        if (symlit.action.length == 0) {

            symlit.startTime = Date.now()

            if (symlit.trial[0] != "fam") {

                document.getElementById("cue").src = "images/stimuli/" + symlit.item[0] + "_" + symlit.condition[0] + "_" + symlit.targetShape[0] + ".png";
                document.getElementById("cuepaper").src = "images/cuepaper.png";
            }

            showAgent("base");

            $(".leftChoiceBlock").click(symlit.transition)

            $(".rightChoiceBlock").click(symlit.transition)

        } else {

            sourceSound("sound/" + symlit.action[0] + ".mp3");
            playSound();

            sound = document.getElementById("sound");

            sound.onended = function() {
                symlit.next();
            }

            symlit.action.shift()

        }


    },

    // recording the choice
    transition: function() {

        sourceSound("sound/button.mp3");
        playSound();

        event.target.style.border = '5px solid blue';

        symlit.endTime = Date.now()

        var rt = symlit.endTime - symlit.startTime

        var pick = event.target.id;

        console.log(pick)

        if (pick.includes(symlit.targetPosition[0])) {
            var correct = 1
        } else {
            var correct = 0
        };

        sound = document.getElementById("sound");

        sound.onended = function() {

            $(".leftObject").unbind("click");
            $(".rightObject").unbind("click");

            sourceSound("sound/thanks.mp3");
            playSound();

            sound = document.getElementById("sound");

            sound.onended = function() {

                symlit.newtrial()
                sound.stop



            }

            // data collected
            data = {
                //time: symlit.time,
                subid: symlit.subid,
                // task: "represenation",
                version: symlit.version,
                trial: symlit.trial[0],
                target_position: symlit.targetPosition[0],
                item: symlit.item[0],
                target_shape: symlit.targetShape[0],
                condition: symlit.condition[0],
                pick: pick,
                correct: correct,
                rt: rt
            };
            symlit.data.push(data);

        }

    },

    newtrial: function() {

        showAgent("base");

        $(".occluder").hide();
        $(".cue").hide();
        $(".cuepaper").hide();
        $(".leftChoiceBlock").css("border", "none")
        $(".rightChoiceBlock").css("border", "none")
        $(".leftChoiceBlock").hide()
        $(".rightChoiceBlock").hide()
        $(".leftObject").hide();
        $(".rightObject").hide();



        if (symlit.trial[0] != "fam") {
            symlit.item.shift();
            symlit.targetShape.shift();
        }

        if (symlit.trial[0] % 2 === 0) {
            symlit.condition.shift();
            symlit.item = shuffle(["item1", "item2", "item3", "item4"])
        }



        symlit.action = Object.assign([], actions)

        symlit.targetPosition.shift();
        symlit.trial.shift();

        if (symlit.trial[0] > 1) {
            symlit.action.splice(0, 5)
        };

        $(".button").show();
        $(".button").click(symlit.next);

        $(".leftChoiceBlock").css({ bottom: "5%" })
        $(".rightChoiceBlock").css({ bottom: "5%" })

    }

}