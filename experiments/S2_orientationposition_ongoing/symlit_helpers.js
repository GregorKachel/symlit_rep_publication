// helper functions
function showSlide(id) {
    // Hide all slides
    $(".slide").hide();
    // Show just the slide we want to show
    $("#" + id).show();
}


function showAgent(id) {
    $(".agent").hide();
    $("#" + id).show();
}


function sourceSound(c) {
    document.getElementById("sound").src = c;
};

function playSound() {
    document.getElementById("sound").play();
};


function showStim(condition, trial, item, targetShape, targetPosition) {


    if (trial == "fam") {
        document.getElementById("leftObject").src = "images/empty.png";
        document.getElementById("rightObject").src = "images/empty.png";

    } else {


        $(".leftObject").show();
        $(".rightObject").show();

        if (targetPosition == "left") {

            if (targetShape == "A") {
                document.getElementById("leftObject").src = "images/stimuli/" + condition + "_tar_" + item + "_" + "A.png";
                document.getElementById("rightObject").src = "images/stimuli/" + condition + "_tar_" + item + "_" + "B.png";
            } else {
                document.getElementById("leftObject").src = "images/stimuli/" + condition + "_tar_" + item + "_" + "B.png";
                document.getElementById("rightObject").src = "images/stimuli/" + condition + "_tar_" + item + "_" + "A.png";
            }
        } else {

            if (targetShape == "A") {
                document.getElementById("leftObject").src = "images/stimuli/" + condition + "_tar_" + item + "_" + "B.png";
                document.getElementById("rightObject").src = "images/stimuli/" + condition + "_tar_" + item + "_" + "A.png";
            } else {
                document.getElementById("leftObject").src = "images/stimuli/" + condition + "_tar_" + item + "_" + "A.png";
                document.getElementById("rightObject").src = "images/stimuli/" + condition + "_tar_" + item + "_" + "B.png";

            }
        }
    }
}


function downloadData(safe) {
    var toSave = JSON.stringify(safe)

    var date = new Date().toISOString()
    var day = date.substr(0, 10)
    var time = date.substr(11, 8)

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURI(toSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'symlit-' + symlit.subid + '-' + day + '-' + time + '.json';
    hiddenElement.click();
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


// beginning of actual experiment

function checkInput() {
    //subject ID
    if (document.getElementById("id").value.length < 1) {
        $("#checkMessage").html('<font color="red">Bitte ID eingeben</font>');
        return;
    }

    // if (document.getElementById("version").value > 4) {
    //     $("#checkMessage").html('<font color="red">Bitte Version 1, 2, 3 oder 4 auswählen</font>');
    //     return;
    // }

    // if (document.getElementById("postCode").value.length < 1) {
    //     $("#checkMessage").html('<font color="red">Bitte Postleitzahl eintragen</font>');
    //     return;
    // }
    //        if (document.getElementById("subjectAge").value.length < 1) {
    //			$("#checkMessage").html('<font color="red">Bitte Alter des Kindes eingeben</font>');
    //			return;
    //		}

    symlit.subid = document.getElementById("id").value

    //symlit.version = document.getElementById("version").value

    symlit.time = Date.now()

    //  train.subage = document.getElementById("subjectAge").value

    // Start capturing video


    //showSlide('study-consent')

    symlit.next()

};