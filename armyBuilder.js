// This Script is distrbuted under the Open Source license GPL2.0

///////////////
// VARIABLES //
///////////////

// All Mechs are stored in an array of objects:
const MechArray = [];
// Helpervar for fixing end of round
var endOfRound = false;
// the form for adding a new mech.
var createArmyDisplay = '<div id="botmaindisplay" class="mainbox">\
  <u>TDZ Table Top Bot v2.0</u><p></p>\
    Add a Mech to your Army:<br>\
    <div id="MechCounter" class="smalltext">Mechs in Army: 0</div>\
    <table class="center"><tr><td>\
    Name: </td><td colspan=3><input type="text" id="MechName" type="number"></td>\
    </tr><tr>\
    <td>MV: </td><td><input type="text" id="MechMV" type="number" class="miniinput2"></td>\
    <td>Skill: </td><td><input type="text" id="MechSkill" type="number" class="miniinput2"></td>\
    </tr></table>\
    <div title="Enter the values for how much damage the mech can do in short, medium and long range." class="smalltext" style="margin-top:10px;">Damage:</div>\
    <table class="center"><tr><td>\
    S</td><td>M</td><td>L</td>\
    </tr><tr>\
    <td><input type="text" id="MechS" type="number" class="miniinput2"></td><td><input type="text" id="MechM" type="number"  class="miniinput2"></td><td><input type="text" id="MechL" type="number" class="miniinput2"></td>\
    </tr></table>\
    <div title="Enter the values for armor and inner structure." class="smalltext" style="margin-top:10px;">Protection:</div>\
    <table class="center"><tr><td>\
    A</td><td>S</td>\
    </tr><tr>\
    <td><input type="text" id="MechA" type="number" class="miniinput2"></td><td><input type="text" id="MechI" type="number" class="miniinput2"></td>\
    </tr></table>\
    <div title="Choose how aggressive your bot should act." class="smalltext" style="margin-top:10px;">Aggression:</div>\
    <table class="center"><tr><td style="width:100px;text-align:left;">\
      <div title="Low aggression means that there is a higher change of lowering the dice roll towards the more pacifistic options" style="font-size:8pt;">Low</div>\
    </td><td style="width:40px;text-align:center;">\
    </td><td style="width:100px;text-align:right;">\
      <div title="High aggression means that there is a higher change of increasing the dice roll towards the more aggressive options" style="font-size:8pt;">High</div>\
    </td></tr>\
  </table>\
    <div class="slidecontainer">\
      <input type="range" min="1" max="3" value="2" class="slider" id="aggressionLevel">\
    </div>\
    <p></p>\
    <button onclick="createMech(\'add\')" class="button">Add</button>\
    \
    <button onclick="loadArmyList()" class="button">Finish</button>\
    <button onclick="exportArmy()" class="button">Export/Import</button>\
</div>';
// Shortcut button:    <button onclick="createMech(\'fin\')" class="button">Add and Finish</button>\

// basic templte for displaying the army and using the bot itself
var displayArmy = '<div id="botmaindisplay" class="mainbox">\
  <u>TDZ Table Top Bot v2.0</u><p></p>\
  <div id="ArmyDisplay">\
  \
  </div>\
  <div id="displayArmyButtons">\
  <button onclick="playRound()" class="button" id="playButton">Next Action</button><br>\
  <button onclick="editArmy()" class="minibutton">Save Changes</button>\
  <button onclick="startScreenArmy()" class="minibutton">Add Mech</button>\
  <button onclick="exportArmy()" class="minibutton">Export/Import</button>\
  </div>\
</div>';

///////////////
// FUNCTIONS //
///////////////

//start army creator This is where the start screen comes in, but it can aso be called to get back to adding mechs via app
function startScreenArmy() {
  document.getElementById("outbox").innerHTML = createArmyDisplay;
  document.getElementById("MechCounter").innerHTML = 'Mechs in Army: '+ MechArray.length;
}

// This function is called whenever an action is locked in. It also determines when attack dice are rolled and if the round is over
unction reloadArmy () {
  loadArmyList();
  var turnOver = true;
  for (let i = 0; i < MechArray.length; i++) {
    document.getElementById("situations" + MechArray[i].situation + i).selected = true;
    if (MechArray[i].moved != "checked disabled") {
      turnOver = false;
    }
  }
  if (endOfRound) {
    resetAll();
    document.getElementById("playButton").innerHTML = "Next Action";
  } else if (turnOver && MechArray.length != 0) {
    showDice();
    document.getElementById("playButton").innerHTML = "Next Round";
    endOfRound = true;
  }
}

// This function simply reloads the army list.
function loadArmyList() {
  document.getElementById("outbox").innerHTML = displayArmy;
  var aList = initArmyList();
  document.getElementById("ArmyDisplay").innerHTML = aList;

  if (MechArray.length == 0) {
    document.getElementById("editButton").disabled = true;
    document.getElementById("playButton").disabled = true;
  }
}

//This function checks:
// if a mech has moved and then adds the movement value to the object and disables the field by object var.
// if a situation has been chosen other than 0 for the first time, it will then allow the mech to move
// if a situation has been chosen other than 0 is generally chosen it will log in the new ituation value
// if the new situation value is 0, it will disable the moved function
function playRound() {
  for (let i = 0; i < MechArray.length; i++) {
    if (document.getElementById("moved"+i).checked) {
      MechArray[i].moved = document.getElementById("moved"+i).value;
      MechArray[i].situationEnabled = "disabled";
    }
    if (MechArray[i].moved == "disabled" && document.getElementById("situations"+i).value != "0") {
      MechArray[i].moved = "";
    }
    if(MechArray[i].moved == ""){
      MechArray[i].situation = document.getElementById("situations"+i).value;
    }
    if(MechArray[i].situation == "0"){
      MechArray[i].moved = "disabled";
    }
  }
  reloadArmy();
}

// This function generates the army list and sets all the vars of each object.
// it will also check if the situation is not 0 and mech has has not yet moved and then create a new bot action.
function initArmyList() {
  var armyList = "";
  if (MechArray.length == 0) {
    return "No Mechs found in list, please add some:<p></p><button onclick=\"startScreenArmy()\" class=\"button\">Add Mechs</button>";
  }
  for (var i = 0; i < MechArray.length; i++) {
    armyList += '<table class="center"><tr>\
    <td>Name: </td><td colspan="4"><b><input class="inputinactive" id="name'+i+'" value="'+ MechArray[i].name +'"></b></td>\
    <td><button onclick="delMech('+i+')" class="delbutton">Del</button></td>\
    </tr><tr>\
    <td>Skill: </td><td><input class="miniinput" id="skill'+i+'" value="' + MechArray[i].skill + '"></td><td>| AGR: </td><td><input class="miniinput" id="aggression'+i+'" value="' + MechArray[i].aggression + '"></td><td>| MV: </td><td><input class="miniinput" id="mv'+i+'" value="' + MechArray[i].mv + '"></td>\
    </tr><tr><td style="writing-mode: vertical-lr; background:tomato;">Damage</td>\
    <td colspan="5">\
    <table><tr><td width=40>S</td><td width=45>M</td><td>L</td>\
      </tr><tr>\
        <td><input class="miniinput" id="short'+i+'" value="' + MechArray[i].short + '"></td><td><input class="miniinput" id="medium'+i+'" value="' + MechArray[i].medium + '"></td><td><input class="miniinput" id="long'+i+'" value="' + MechArray[i].long + '"></td>\
    </tr></table>\
    </tr><tr><td style="writing-mode: vertical-lr; background:lightblue;">Protect</td>\
    <td colspan="5">\
      <table><tr>\
      <td width=40>A</td><td><input class="miniinput" id="armor'+i+'" value="' + MechArray[i].armor + '"></td></tr><tr><td width=40>S</td><td><input class="miniinput" id="innerS'+i+'" value="' + MechArray[i].innerS + '"></td><td></td>\
      </tr></table>\
    </tr></table>\
    <input type="checkbox" id="moved'+i+'" value="checked disabled" '+MechArray[i].moved+' onclick="checkMovement()">\
    <label for="moved'+i+'"> Mech has moved</label><br>\
    <select name="situations" id="situations'+i+'" '+MechArray[i].situationEnabled+'>\
      <option value="0" id="situations0'+i+'">No choice made</option>\
      <option value="1" id="situations1'+i+'">No line of sight to any opponent</option>\
      <option value="2" id="situations2'+i+'">Long distance to nearest enemy</option>\
      <option value="3" id="situations3'+i+'">Medium to short distance</option>\
      <option value="4" id="situations4'+i+'">Behind enemy</option>\
      <option value="5" id="situations5'+i+'">Highly damaged</option>\
    </select>';
    if (MechArray[i].situation != "0") {
      if (MechArray[i].moved == "") {
        MechArray[i].situationText = botAction(MechArray[i].situation, MechArray[i].aggression, MechArray[i].mv);
      }
      armyList += '<div id="actionbox'+i+'" class="actionbox">'+MechArray[i].situationText+'</div>';
    }
    armyList += '<hr>';
  }
  return armyList;
}

// This function will check if all bots have moved and then trigger change the text of the Button
// it has not functional benefit but improves the user experience
function checkMovement(){
  var reveal = true;
  for (let i = 0; i < MechArray.length; i++) {
    if (!document.getElementById("moved"+i).checked) {
      reveal = false;
    }
  }
  if (reveal) {
    document.getElementById("playButton").innerHTML = "Reveal Shots";
  }else {
    document.getElementById("playButton").innerHTML = "Next Action";
  }
}

// This function delete a specific mech from the army list
function delMech(position){
  var pos = Number(position);
  MechArray.splice(pos, 1);
  reloadArmy();
}

// this function resets all bot to starts a new round.
function resetAll(){
  for (let i = 0; i < MechArray.length; i++) {
    MechArray[i].situation = "0";
    MechArray[i].situationText = "";
    MechArray[i].moved = "disabled";
    MechArray[i].situationEnabled = "";
    endOfRound = false;
  }
  loadArmyList();
}

// this function displays the dice rolls
function showDice() {
  var displayRolls = "";
  for (let i = 0; i < MechArray.length; i++) {
    displayRolls = '<table class="center" style="text-align:left;"><tr>\
            <td>Short</td>\
            <td>'+ combatRoll(MechArray[i].short) +'</td></tr><tr>\
            <td>Medium</td>\
            <td>'+ combatRoll(MechArray[i].medium) +'</td></tr><tr>\
            <td>Long</td>\
            <td>'+ combatRoll(MechArray[i].long) +'</td>\
            </tr></table>';
    document.getElementById("actionbox"+i).innerHTML = displayRolls;
  }
}

// This function rolls the dice for combat
function combatRoll(amount) {
  var amount2 = parseInt(amount);
  var rolls = "";
  var rand;
  for (let i = 0; i < amount2; i++) {
    rand = Math.floor(Math.random() * 12) + 1;
    rolls += rand;
    if ((i+1) != (amount2)) {
       rolls += ", ";
    }
  }
  return rolls;
}

// This function creates the bot actions
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
        if (mv == "0") {
          botAction = '<b>Fast mech (MV 12" or higher):</b> Move to new cover<br><br><b>Slow Mech (MV up to 12"):</b> stay (shift to improve cover and avoid to have opponent in back).';
        } else if (mv < "12") {
          botAction = 'stay (shift to improve cover and avoid to have opponent in back).';
        } else {
          botAction = 'Move to new cover.';
        }
      } else {
        if (mv == "0") {
          botAction = '<b>Fast mech (MV 12" or higher):</b> Attempt to get behind target.<br><br><b>Slow Mech (MV up to 12"):</b> Attempt to move closer but stay in partial cover.';
        } else if (mv < "12") {
          botAction = 'Attempt to move closer but stay in partial cover.';
        } else {
          botAction = 'Attempt to get behind target.';
        }
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

//This function creates a new object of the class Mech and apend it to the MechArray
function createMech(nextOption) {
  //pull data from fields
  var name = document.getElementById("MechName").value;
  var mv = document.getElementById("MechMV").value;
  var short = document.getElementById("MechS").value;
  var medium = document.getElementById("MechM").value;
  var long = document.getElementById("MechL").value;
  var armor = document.getElementById("MechA").value;
  var innerS = document.getElementById("MechI").value;
  var skill = document.getElementById("MechSkill").value;
  var aggression = document.getElementById("aggressionLevel").value;

  //create obkect and append
  var MechObject = new Mech(name, mv, short, medium, long, armor, innerS, skill, aggression);
  if (name != "") {
    MechArray.push(MechObject);
  }
  //either reload add dialog or move on to army list
  if (nextOption == "add") {
    startScreenArmy();
  } else {
    loadArmyList();
  }
}

// this function gabs all fields again and updates every bots attributes
function editArmy() {
  for (var i = 0; i < MechArray.length; i++) {
    MechArray[i].name = document.getElementById("name"+i).value;
    MechArray[i].mv = document.getElementById("mv"+i).value;
    MechArray[i].short = document.getElementById("short"+i).value;
    MechArray[i].medium = document.getElementById("medium"+i).value;
    MechArray[i].long = document.getElementById("long"+i).value;
    MechArray[i].armor = document.getElementById("armor"+i).value;
    MechArray[i].innerS = document.getElementById("innerS"+i).value;
    MechArray[i].skill = document.getElementById("skill"+i).value;
    MechArray[i].aggression = document.getElementById("aggression"+i).value;

  }
  reloadArmy();
}

// This function generates a text version of the bot attributes
function exportArmy() {
  var exportStr = "";
  for (let i = 0; i < MechArray.length; i++) {
    exportStr += MechArray[i].exportAll() + "\n";
  }
  var exportBox = '<div class="mainbox"><p></p><div id="impStatus"></div><p></p>\
  To export, simply copy the text into a local file.<br>To import, simply paste the text back into the textfield\
  <p></p><textarea rows="6" cols="40" id="importexportfield" style="margin:auto; border:1px solid black;">'+exportStr+'</textarea><p></p>\
  <button onclick="importArmy()" class="dbutton">Import Textarea</button>\
  <button onclick="reloadArmy()" class="dbutton">Army Screen</button></div>';
  document.getElementById("outbox").innerHTML = exportBox;
}

// this function deletes all mechs and generates new mechs baed on the input text
function importArmy(){
  MechArray.length = 0;
  var lines = document.getElementById('importexportfield').value.split('\n');
  for(var i = 0;i < lines.length;i++){
    if (lines[i] != "") {
      var parts = lines[i].split(',');
      var MechObject = new Mech(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8]);
      MechArray.push(MechObject);
    }
  }
  if (MechArray.length > 0) {
    document.getElementById("impStatus").innerHTML = "Success";
    document.getElementById("impStatus").style.background = "green";
  }else {
    document.getElementById("impStatus").innerHTML = "Failed";
    document.getElementById("impStatus").style.background = "red";
  }
}

/////////////
// CLASSES //
/////////////

//mech class
class Mech {
  //constructor
  constructor(name, mv, short, medium, long, armor, innerS, skill, aggression) {
    this.name = name;
    this.mv = mv;
    this.short = short;
    this.medium = medium;
    this.long = long;
    this.armor = armor;
    this.innerS = innerS;
    this.skill = skill;
    this.aggression = aggression;
    this.situation = "0";
    this.situationText = "";
    this.situationEnabled = "";
    this.moved = "disabled";
  }
  //methods
  shoot(distance) {
    const shots = [];
    var shotamount = 0;
    var roll = 0;
    if (distance == short) {
      shotamount = this.short;
    } else if (distance == medium) {
      shotamount = this.medium;
    } else {
      shotamount = this.long;
    }
    for (let i = 0; i < shotamount; i++) {
      roll = Math.floor(Math.random() * 12) + 1;
      shots[i] = roll;
    }
  }
  //Export all relevant attributes as a string
  exportAll(){
    var exportString = this.name+","+this.mv+","+this.short+","+this.medium+","+this.long+","+this.armor+","+this.innerS+","+this.skill+","+this.aggression;
    return exportString;
  }
  // in later versions more features can be added like a damage system.
  //hit(amount) {
  // TBD
  //}
}
