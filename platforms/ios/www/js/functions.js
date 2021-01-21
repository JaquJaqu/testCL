const url = 'https://corona-ampel.gv.at/sites/corona-ampel.gv.at/files/assets/Warnstufen_Corona_Ampel_aktuell.json';
const corsFix = 'https://cors-anywhere.herokuapp.com/';

let pathbool; //Checkt ob Ampfelfile online angefragt werden kann wenn true = MÖGLICH
let connBool; //checkt Internet wenn true= Internet AN
let checkBool; //checkt Standort wenn false = Standort AN
let accessBool = true; //checkt of ampelfile online geladen werden soll, wenn true = AN

function saveHistory(){
  sessionStorage.setItem("pathname",location.pathname);
}


function sortListDir(name) {
  var list, i, switching, b, shouldSwitch, dir, switchcount = 0;
  list = document.getElementById(name);
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  // Make a loop that will continue until no switching has been done:
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    // Loop through all list-items:
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      if (dir == "asc") {
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
         shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
      // Each time a switch is done, increase switchcount by 1:
      switchcount ++;
    } else {
     
     if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}



//____DROP DOWN FILTER_____

function filterFunction(input,dropdown) {
  var input, filter, ul, li, a, i;
  input = document.getElementById(input);
  filter = input.value.toUpperCase();
  div = document.getElementById(dropdown);
  a = div.getElementsByTagName("li");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}


function onOnline(){
  connBool = true;
  if(sessionStorage.getItem("Update") == null){
  checkForUpdate();
  sessionStorage.setItem("Update", true);
  }
  const statusDisplay = document.getElementById("status");
  statusDisplay.textContent = "Du hast Internetzugriff! Alles funktioniert reibungslos.";
  if(sessionStorage.getItem("online") == null){
  $("#status").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
  $("#status").delay(1500).fadeOut(700);
  $("#unterstatus").fadeIn(800);
  $("#unterstatus").delay(1500).fadeOut(700);
  sessionStorage.setItem("online", true);
  sessionStorage.removeItem("offline");  
  }
  
  console.log("Connection Bool:", connBool, "du hast kein Internet");
  console.log("Path Bool:", pathbool, "online zugriff auf Ampeldaten verweigert");
}
function onOffline(){
  const statusDisplay = document.getElementById("status");
  statusDisplay.textContent = "Du hast keinen Internetzugriff kannst aber trotzdem offline arbeiten!";
  if(sessionStorage.getItem("offline") == null){
  $("#status").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
  $("#status").delay(1500).fadeOut(700);
  $("#unterstatus").fadeIn(800);
  $("#unterstatus").delay(1500).fadeOut(700);
  sessionStorage.setItem("offline", true);
  sessionStorage.removeItem("online");  
  }
  connBool = false;
  console.log("Connection Bool:", connBool, "du hast kein Internet");
  console.log("Path Bool:", pathbool, "online zugriff auf Ampeldaten verweigert");
}

$(document).ready(function(){
  $("#mainwrapper_tipps").scroll(function(){
    var x = $("#mainwrapper_tipps").position();
    x.top += 1;
  });
});

//App schließt wenn zweimal auf zurück Button getappt wird
var lastTimeBackPress=0;
var timePeriodToExit=2000;

function onBackKeyDown(e){
    e.preventDefault();
    e.stopPropagation();
    var sPath= location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
  if(sPage == "start.html" || sPage == "index.html"){
    if(new Date().getTime() - lastTimeBackPress < timePeriodToExit){
        navigator.app.exitApp();
    }else{
        window.plugins.toast.showWithOptions(
            {
              message: "Press again to exit.",
              duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            }
          )
        
        lastTimeBackPress=new Date().getTime();
    }
}else {
  navigator.app.backHistory();
}
}

document.addEventListener("backbutton", onBackKeyDown, false);





   