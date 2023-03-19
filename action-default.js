//global vars
var classicDisplay = '<div id="botmaindisplay" class="mainbox">\
  <u>TDZ Table Top Bot v2.0</u><p></p>\
  <select name="situations" id="situations">\
    <option value="1">No line of sight to any opponent</option>\
    <option value="2">Long distance to nearest enemy</option>\
    <option value="3">Medium to short distance</option>\
    <option value="4">Behind enemy</option>\
    <option value="5">Highly damaged</option>\
  </select>\
  <p></p>\
  <div title="Choose how aggressive your bot should act.">Aggression:</div>\
  <table style="margin: auto;"><tr><td style="width:100px;text-align:left;">\
    <div title="Low aggression means that there is a higher change of lowering the dice roll towards the more pacifistic options" style="font-size:12pt;">Low</div>\
  </td><td style="width:40px;text-align:center;">\
  </td><td style="width:100px;text-align:right;">\
    <div title="High aggression means that there is a higher change of increasing the dice roll towards the more aggressive options" style="font-size:12pt;">High</div>\
  </td></tr>\
</table>\
  <div class="slidecontainer">\
    <input type="range" min="1" max="3" value="2" class="slider" id="aggressionLevel">\
  </div>\
  <p></p>\
<button onclick="submitSituation()" class="button">Show Action</button>\
<p></p>\
<div title="Execute this action. Ensure that the bot does not put itself into unnecessary danger and always moves the most direct path to its target.">Bot Action:</div>\
</div>\
<div id="botaction" class="actionbox">\
  No situation selected.\
</div>';

//functions
function startScreenClassic() {
  document.getElementById('outbox').innerHTML = classicDisplay;
}

function submitSituation() {
  var situation = document.getElementById("situations").value;
  //document.getElementById("debug").innerHTML = situation;
  var aggressionLevel = document.getElementById("aggressionLevel").value;
  var displayString = botAction(situation, aggressionLevel, "0");
  document.getElementById("botaction").innerHTML = displayString;
}

function botAction(situation, aggressionLevel, mv) {
  var roll = Math.floor(Math.random() * 6) + 1;
  var rollAgression = Math.floor(Math.random() * 6) + 1;
  var botAction;
  if (aggressionLevel == 1 && rollAgression <= 4){
      roll--;
  } else if (aggressionLevel == 3 && rollAgression <= 4) {
    roll++;
  }
  switch(situation) {
    case "1":
      if (roll <= 2) {
         botAction = "Proceed with caution. Move closer and try to get cover, prefer moving intp cover over using all movement points.";
      } else if (roll <= 4) {
         botAction = "Proceed fast. Run closer, go for cover if possible.";
      } else {
        botAction = "Proceed Aggressively. Move closer without running and get a line of fire at all costs. Prefer shooting position over cover.";
      }
    break;
    case "2":
      if (roll <= 2) {
        botAction = "Close in with cover in mind and without running.";
      } else if (roll <= 4) {
        botAction = "Run as close as possible.";
      } else {
        botAction = "Close in without cover in mind and without running.";
      }
    break;
    case "3":
      if (roll <= 3) {
        botAction = "<b>Fast mech (MV 12” or higher):</b> Move to new cover<br><br><b>Slow Mech (MV up to 12”):</b> stay.";
      } else {
        botAction = "<b>Fast mech (MV 12” or higher):</b> Attempt to get behind target<br><br><b>Slow Mech (MV up to 12”):</b> Attempt to move closer but stay in partial cover.";
      }
    break;
    case "4":
      if (roll <= 3) {
        botAction = "Mech in partial cover but in line of fire if possible, prefer cover.";
      } else {
        botAction = "Mech in partial cover but in line of fire if possible, prefer line of fire.";
      }
      break;
      case "5":
        if (roll <= 3) {
          botAction = "<b>Last mech in lance:</b> Go for partial cover even if that means giving up a shooting position<br><br><b>Other mechs are left in the lance:</b> Go for partial cover but maintain shooting position. Attempt to only have a single mech in sight.";
        } else {
          botAction = "<b>Last mech in lance:</b> Search for full cover<br><br><b>Other mechs are left in the lance:</b> Attempt to have only a single foe in sight.";
        }
      break;
    default:
      botAction = "No situation selected.";
  }
  return botAction;
}
