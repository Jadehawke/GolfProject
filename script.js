
var numberOfHoles = 18;
var myPlace = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};
var closeCourses;
var selectedCourse;
var players;

var addPar = 0;
var addYard = 0;
var addHDC = 0;

$(document).ready(function(){
    $.post("https://golf-courses-api.herokuapp.com/courses", myPlace, function(data, status){
        closeCourses = JSON.parse(data);
        for(var p in closeCourses.courses){
            var selectInput = "<option value='"+ closeCourses.courses[p].id +"'>"+ closeCourses.courses[p].name + "</option>";
            $("#courseSelect").append(selectInput);
        }

    });

});


function loadCourse(theid){
    $("#teetypes").html("");
    $.get("https://golf-courses-api.herokuapp.com/courses/" + theid, function(data, status){
        selectedCourse = JSON.parse(data);
        numberofHoles = selectedCourse.course;
        $("#courseTitle").html(selectedCourse.course.name);
        for(var i = 0; i < (selectedCourse.course.holes[0].tee_boxes.length - 1); i++){
            $("#teetypes").append("<option value='" + i + "'>" + selectedCourse.course.holes[0].tee_boxes[i].tee_type + "</option>");

        }



    });
}

function beginCard() {
    var totalboxes = "";
    players = $("#playerCount").val();
    $("#leftCard").html('');
    for (var i = 0; i < players; i++) {
        $("#leftCard").append(" <div id='playerLabel" + (i + 1) + "'> Player " + (i + 1) + " <span class='removebtn glyphicon glyphicon-minus-sign' onclick='removePlayer("+ i +")'></span></div>");
        totalboxes += "<div id='playertotal" + (i + 1) +"'></div>";

    }

    for(var c = 1; c <= numberOfHoles; c++){
        $("#rightCard").append("<div id='column" + c + "' class='holcol'><div class='colheader'>" + c +"</div></div>");
        if (c % 9 === 0) {
            $("#rightCard").append("<div id='9column" + c + "' class='holcol'><div class='colheader'> Nine </div></div>");
        }

    }
    $("#rightCard").append("<div class='holcol'><div id='scoreTotal' class='colheader'>Total</div>"+ totalboxes + "</div>");
    $("#farRight").append("<div class='holcol'><div id='parTotal' class='colheader'>x</div>"+ totalboxes + "</div>");
    $("#farRight").append("<div class='holcol'><div id='yardTotal' class='colheader'>y</div>"+ totalboxes + "</div>");
    $("#farRight").append("<div class='holcol'><div id='hdcTotal' class='colheader'>z</div>"+ totalboxes + "</div>");

    buildHoles();




}

function buildHoles () {

    for (var p = 1; p <= players; p++) {
        for (var h = 1; h <= selectedCourse.course.holes.length; h++) {
            $("#column" + h).append("<input onkeyup='calculatescore(" + p + ")' class='inputStyle' type='text' id='player" + p + "hole" + h + "' />");

            if (h % 9 === 0) {
                $("#9column" + h).append("<div class='inputStyle' type='text' id='player" + p + "holeTotal" + h + "' ></div>");
            }
        }
    }
    for (var h = 0; h < selectedCourse.course.holes.length; h++) {
        $("#parRow").append("<span id='parColumn'" + h + " class='parYardHdcStyle'><span>" + selectedCourse.course.holes[h].tee_boxes[0].par + "</span></span>");
        $("#yardRow").append("<span id='yardsColumn'" + h + " class='parYardHdcStyle'><span>" + selectedCourse.course.holes[h].tee_boxes[0].yards + "</span></span>");
        $("#hdcRow").append("<span id='handiColumn'" + h + " class='parYardHdcStyle'><span>" + selectedCourse.course.holes[h].tee_boxes[0].hcp + "</span></span>");

    }

    totalPYH();


}


function totalPYH(){

    for(var p = 0; p < selectedCourse.course.holes.length; p++){
        addPar += selectedCourse.course.holes[p].tee_boxes[0].par;
        $("#parTotal").html(addPar);
    }
    for(var y = 0; y < selectedCourse.course.holes.length; y++){
        addYard += selectedCourse.course.holes[y].tee_boxes[0].yards;
        $("#yardTotal").html(addYard);
    }
    for(var d = 0; d < selectedCourse.course.holes.length; d++){
        addHDC += selectedCourse.course.holes[d].tee_boxes[0].hcp;
        $("#hdcTotal").html(addHDC);
    }

}

function removePlayer(theId) {
    $("#playerLabel" + theId).remove();
    for (var i = 1; i <= numberOfHoles; i++){
        $("#player" + theid + "hole" + i).remove();
    }
}


function calculatescore(playerid){
    var thetotal = 0;
    var nineTotal = 0;

    for (var t = 1; t <= numberOfHoles; t++) {
        thetotal += Number($("#player" + playerid + "hole" + t).val());
    }

    for (var p = 0; p <= players; p++) {
        for (var f = 1; f <= 18; f++) {
            nineTotal += Number($("#player" + playerid + "hole" + f).val());

            if(f % 9 === 0){
                $("#player"+ playerid + "holeTotal" + f).html(nineTotal);
                nineTotal = 0;

            }
        }
    }
    $("#playertotal" + playerid).html(thetotal);
}






function calculateTotal(){

    for (var p = 1; p <= players; p++){

        var finalScore = Number($("#playertotal" + p).text()) - Number($("#parTotal").text());

        console.log($("#playertotal" + p).text());

        console.log($("#parTotal").text());

        console.log(finalScore);


        $("#finalScoreBox").append("<div class='finalScoreBox' id='playerFinalScore" + p + "' > Player " + p + " : " + finalScore + " </div>");

        if( finalScore < 30) {
            $("#finalScoreBox").append("Great Job!")
        }
        else if( finalScore < 100) {
            $("#finalScoreBox").append("Not Bad!")
        }
        else if( finalScore > 150) {
            $("#finalScoreBox").append("More Practice!!")
        }
    }

}