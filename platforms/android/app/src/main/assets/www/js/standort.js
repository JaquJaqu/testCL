
/*
__!!_____Was getan wurde: 
-) Check internet Connection
-) Datum in Lokal FIle Speicher
-) Last Modified Header vom Browser Bekommen 
-) zu LokalStorage Daten Speicherdatum dazu speichern
-) Last Modified und Daten im Local File Speicher vergleichen --> Passt aber komisch BUG FIX
-) Mit lokalen Daten (und online) daten arbeiten 
-) Daten lieber immer vom LokalStorage nehmen!: Spart Bandbreite und code:
-) Speichere LokationLokal
-) Lokaldaten updaten
-) mit lokaldaten offline arbeiten
-) Speichern der Lokationsdaten wenn sie noch nie vorher im local storage gespeichert wurden checken/schaun obs wirklich geht! 
-) Problem3: Datumsvergleich vom lokalstorage unlogisch: überlegen warum --> mit ETags gelöst

 * -) Code wurde gemergt
 * -) Die index heißt jz home.html und die index.html ist der erste Screen vom Walkthrough.
 * -) InternetConnection wird angezeigt wenn sie geändert wird und alle anderen Variablen auch (also setInterval is weg)
 *    funktioniert auch gut für Android
 * -) Alle Parts mit CORDOVA-CODE sind für später angelegt: auf Android und iOS wird Lokation automatisch aktiviert
 *    wenn ToggleButton angeschalten wird (für Android getestet), für Browser anderer Code || Damit das Testen jz leichter
 *    und mit dem GoLive-Plugin funktioniert sind die Teile jz auskommentiert.
 
 

__!!_____TO DO:  
PROBLEME:

--> beim ersten Starten und downloaden der Daten muss zuerst gerefresht werden damit die Farbe iangezeigt wird/ beim einschalten der App wird keine Farbe angezeigt wenn Standort = offline




/*_____________________NEU__________________
-) Zum Aktualität testen wird werden jetzt die ETags im LS gespeichert und verglichen! 


 * 
 * ______________WICHTIG FÜRS TESTEN___________________
 * -) Erst seit den letzten 3, 4 Ampelfile Versionen sind die Bezirke von Vorarlberg auch wirklich als Bezirke
 *    angeführt. Wenn mit älteren Versionen getestet wird kann es also sein das Bregenz, Bludenz, Dornbirn
 *    oder Feldkirch nicht funktionieren.
 */

let bezirk;
let bundesland;
let ampelStufe;
let lokalstorageBezirk;
let lokalstorageBundesland;
let getbezirkLocalS;
let getETaglocalS;
let dataOffline;
const arrBezirke = [];

var arrLänge = 0;
let path2 = corsFix + url;
let pathforUpdate = corsFix + url; //path2 ist nach dem Speicher ooflineData.. deswegen hab ich das im Moment noch dazu getan

//localStorage.clear();

/*__CORDOVA-CODE___
var platform = null;

document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
          platform = device.platform;
          console.log(platform);
        }
*/
createDropdown();
farbkreisPH = document.getElementById("farbkreisPH");
farbkreis = document.createElement("div");
farbkreis.setAttribute("id", "farbkreis");
farbkreisPH.appendChild(farbkreis);

read_from_local_storage();
getAmpel();


//Zugriff auf API
function getLocation(latitude, longitude) {
  var apiString =
    "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
    latitude +
    "&longitude=" +
    longitude +
    "&localityLanguage=de";

  //Bekomme Standort von API
  loadJSON(
    apiString,
    function (data) {
      for (i = 0; i < data.localityInfo.administrative.length; i++) {
        //Wien kein Bezirk daher sondern
        if (data.city == "Wien") {
          if (data.localityInfo.administrative[i].adminLevel == "4") {
            bezirk = data.localityInfo.administrative[i].name;
            document.getElementById("bezirk").innerHTML = bezirk;
            lokalstorageBezirk = bezirk;
            sessionStorage.setItem("storeBezirk", bezirk);
          }

          //Für alle anderen Bezirke
        } else if (data.localityInfo.administrative[i].adminLevel == "6") {
          bezirk = data.localityInfo.administrative[i].name;

          //Syntax anpassen
          bezirk = bezirk.replace("St.", "Sankt");

          if (bezirk.includes("Bezirk")) {
            bezirk = bezirk.slice(7);
          }

          //Spezialfälle
          if (bezirk == "Krems") {
            bezirk = "Krems(Land)";
          }
          if (bezirk == "Krems an der Donau") {
            bezirk = "Krems an der Donau(Stadt)";
          }
          if (bezirk == "Kirchdorf") {
            bezirk = "Kirchdorf an der Krems";
          }
          if (bezirk == "Eisenstadt") {
            bezirk = "Eisenstadt(Stadt)";
          }
          if (bezirk == "Graz") {
            bezirk = "Graz(Stadt)";
          }
          if (bezirk == "Innsbruck") {
            bezirk = "Innsbruck-Stadt";
          }
          if (bezirk == "Klagenfurt am Wörthersee") {
            bezirk = "Klagenfurt Stadt";
          }
          if (bezirk == "Klagenfurt-Land") {
            bezirk = "Klagenfurt Land";
          }
          if (bezirk == "Linz") {
            bezirk = "Linz(Stadt)";
          }
          if (bezirk == "Salzburg") {
            bezirk = "Salzburg(Stadt)";
          }
          if (bezirk == "Sankt Pölten") {
            bezirk = "Sankt Pölten(Stadt)";
          }
          if (bezirk == "Sankt Pölten-Land") {
            bezirk = "Sankt Pölten(Land)";
          }
          if (bezirk == "Steyr") {
            bezirk = "Steyr(Stadt)";
          }
          if (bezirk == "Villach-Land") {
            bezirk = "Villach Land";
          }
          if (bezirk == "Villach") {
            bezirk = "Villach Stadt";
          }
          if (bezirk == "Wiener Neustadt-Land") {
            bezirk = "Wiener Neustadt (Land)";
          }
          if (bezirk == "Wiener Neustadt") {
            bezirk = "Wiener Neustadt(Stadt)";
          }
          if (bezirk == "Rust") {
            bezirk = "Rust(Stadt)";
          }
          if (bezirk == "Waidhofen an der Ybbs") {
            bezirk = "Waidhofen an der Ybbs(Stadt)";
          }
          if (bezirk == "Wels") {
            bezirk = "Wels(Stadt)";
          }

          lokalstorageBezirk = bezirk;
          document.getElementById("bezirk").innerHTML = bezirk;
          sessionStorage.setItem("storeBezirk", bezirk);
          localStorage.setItem("storeStandort", bezirk);
          getAmpel();

        }
        lokalstorageBundesland = bundesland;

        bundesland = data.principalSubdivision;
        sessionStorage.setItem("storeBundesland", bundesland);
      }
    },
    function (xhr) {
      console.log("Tut uns leid. Wir können deinen Standort leider nicht ermitteln :(");
    }
  );
}

function drawIllustration(ampelStufe){

    if (ampelStufe == 1) {
      document.getElementById("farbkreis").style.backgroundColor = "#60B564";
      document.getElementById("WarnstufeGeschrieben").innerHTML = "GRÜN <br/> geringes Risiko";
      document.getElementById("farbkreisAktiv").style.border = "1px solid #60B564";
      document.getElementById("farbkreisAktiv").style.display = "block";
      document.getElementById("ringerl").style.display = "block";
      document.getElementById("ringerl").style.gridColumn = "3/3";
        document.getElementById("ringerl").style.gridRow = "5/6";
        document.getElementById("ringerl").style.alignSelf = "center";
      } else if (ampelStufe == 2) {
        document.getElementById("farbkreis").style.backgroundColor = "#FED500";
        document.getElementById("WarnstufeGeschrieben").innerHTML = "GELB <br/> mittleres Risiko";
        document.getElementById("farbkreisAktiv").style.border = "1px solid #FED500";
        document.getElementById("farbkreisAktiv").style.display = "block";
        document.getElementById("ringerl").style.display = "block";
        document.getElementById("ringerl").style.gridColumn = "4/4";
        document.getElementById("ringerl").style.gridRow = "6/7";
        document.getElementById("ringerl").style.alignSelf = "center";
      } else if (ampelStufe == 3) {
        document.getElementById("farbkreis").style.backgroundColor = "#F59C00";
        document.getElementById("WarnstufeGeschrieben").innerHTML = "ORANGE <br/> hohes Risiko";
        document.getElementById("farbkreisAktiv").style.border = "1px solid #F59C00";
        document.getElementById("farbkreisAktiv").style.display = "block";
        document.getElementById("ringerl").style.display = "block";
        document.getElementById("ringerl").style.gridColumn = "5/5";
        document.getElementById("ringerl").style.gridRow = "6/7";
        document.getElementById("ringerl").style.alignSelf = "center";
      } else if (ampelStufe == 4) {
        document.getElementById("farbkreis").style.backgroundColor = "#CB0538";
        document.getElementById("WarnstufeGeschrieben").innerHTML = "ROT <br/> sehr hohes Risiko";
        document.getElementById("farbkreisAktiv").style.border = "1px solid #CB0538";
        document.getElementById("farbkreisAktiv").style.display = "block";
        document.getElementById("ringerl").style.display = "block";
        document.getElementById("ringerl").style.gridColumn = "6/6";
        document.getElementById("ringerl").style.gridRow = "5/6";
        document.getElementById("ringerl").style.alignSelf = "center";
      }
}

function getAmpel() {
  read_from_local_storage();
  if(dataOffline != null){
    path2 = dataOffline;
    data = dataOffline;
    console.log("Offline Data", dataOffline);
    storeBezirk = sessionStorage.getItem("storeBezirk");
    for (i = 0; i < dataOffline.Warnstufen.length; i++) {
      if(storeBezirk == "Wien"){
        if(dataOffline.Warnstufen[i].Name == storeBezirk){
          console.log(storeBezirk);
          console.log("Ampelstufe: "+dataOffline.Warnstufen[i].Warnstufe);
          ampelStufe = dataOffline.Warnstufen[i].Warnstufe;
          drawIllustration(ampelStufe);
        }
      }else{
      if (dataOffline.Warnstufen[i].Region == "Bezirk") {
        if (dataOffline.Warnstufen[i].Name == storeBezirk) {
          console.log(storeBezirk);
          console.log("Ampelstufe: "+dataOffline.Warnstufen[i].Warnstufe);
          ampelStufe = dataOffline.Warnstufen[i].Warnstufe;
          drawIllustration(ampelStufe);
        }
       }
     }
    }
  }
}

//Speichern der AMPELDaten im LocalStorage + Hinzufügen der Zeit und Datum des Downloads
function downloadAmpelFile(path2,eTagResponse) {
  if(pathbool==true && connBool ==true){ //wenn ich internet hab und auf die Ampedaten zugreifen darf dann..
  loadJSON(path2, function (data) {
    let items_json = data[7];
    var date = new Date();//var updateDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
        var updateDate = date.toGMTString(); // Tue, 17 Nov 2020 14:16:29 GMT --> Gibt mir die jetzige Uhrzeit im Format das lastModiefied Header Request auch hat
    

    //FOR TESTING
    var ampelDatatrue = { updateDate: updateDate, items_json };
    console.log(eTagResponse,'eTAG');
    console.log("File wird gedownloadet");
    localStorage.setItem("Ampeldaten3", JSON.stringify(ampelDatatrue));


////Speichern des ETAGS im LocalStorage
    var eTag = {eTagResponse};
    localStorage.setItem("ETag", JSON.stringify(eTag));
    getAmpel();
    $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).fadeOut(700);
  }, function () {
    document.getElementById("dataLoader").innerHTML = "Die Daten können momentan leider nicht heruntergeladen werden.";
    $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).fadeOut(700);
  pathbool=false;
  });
}else{ 
  document.getElementById("dataLoader").innerHTML = "Die Daten können momentan leider nicht heruntergeladen werden.";
  $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).fadeOut(700);
  pathbool=false; //verweiere zugriff auf ampeldaten online auch wenn ich internet hab
}
}



//Speichern der LOKATION Daten im LocalStorage + Hinzufügen der Zeit und Datum des Downloads
function downloadLokation() {
   console.log('DEIN BEZIRK:', lokalstorageBezirk );
    var lokationobjecttrue = {bezirksObject:lokalstorageBezirk, bundeslandObject:lokalstorageBundesland};
    localStorage.setItem("Lokationsdaten", JSON.stringify(lokationobjecttrue));
   
}



function read_from_local_storage() { //gib mir die Datem aus dem localStorage

  
  //LOKATION
  if(localStorage.getItem("Lokationsdaten") != null){
  var savedLokation = localStorage.getItem("Lokationsdaten");
  savedLokationValue = JSON.parse(savedLokation);
  
  getbezirkLocalS = savedLokationValue.bezirksObject;
  getbundeslandLocalS = savedLokationValue.bundeslandObject;

  console.log('Lokal gespeicherter Bezirk: ',getbezirkLocalS);
  console.log('Lokal gespeichertes Bundesland: ',getbundeslandLocalS);
  }
  //AMPELDATEN

  var items_json = localStorage.getItem("Ampeldaten3");

  if(items_json !=null){ //check of es diese Daten im localstorage gibt
    accessBool = false; 
  items = JSON.parse(items_json);
  items2 = JSON.stringify(items_json);
  dataOffline = items.items_json;

} else{
  accessBool = true; //Wenn es die Daten nicht gibt dann starte den zugriff auf die online-Daten 
  pathbool = true; 
  document.getElementById("dataLoader").innerHTML = "Die Daten werden geladen ...";
  $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).show().delay(1500);
  downloadAmpelFile(path2);
  //checkForUpdate();
}

//ETag

if(localStorage.getItem("ETag") != null){
  var savedETag = localStorage.getItem("ETag");
  getETagLocalS = JSON.parse(savedETag);
  console.log('Lokal gespeicherter ETAG',getETagLocalS);
  }
}


function checkForUpdate() {
  read_from_local_storage(); //Les mir das Objekte vom Lokalstorage aus (brauche "updateDate", "lokalstorageBezirk" )

//schau ob die lokalen Ampel und Lokationsdaten Speicherdaten geupdated gehören
if(checkBool == false){ //Standort ist aktiviert wenn checkBool==false
      //Schau ob die Standortdaten upgedated gehören wenn Internet vorhanden und der Standort aktiviert ist,
      console.log(getbezirkLocalS);
      console.log(lokalstorageBezirk);
      if(getbezirkLocalS != null && lokalstorageBezirk != null){
      if(getbezirkLocalS != lokalstorageBezirk){
         downloadLokation();
        }
      }else{
        console.log('Standort ist seit letztem check unverändert');
      }
    }
accessBool = true;
if(connBool == true && accessBool == true){ //wenn es eine Internetverbindung ist und dder online zugriff auf die Ampeldaten gestattet dann
  var client = new XMLHttpRequest(); //mach eine Verbindung zur Resource
  try{
  client.open("GET", pathforUpdate, true);
  client.send();
   client.onreadystatechange = function () {
    
    if (this.readyState == this.HEADERS_RECEIVED) {//gibt mir alle Headers von allen Requests aus
            var lastModifiedResponse = client.getResponseHeader("Last-Modified");
      var contentTypeResponse = client.getResponseHeader("Content-Type");

      eTagResponse = client.getResponseHeader("ETag");
      console.log(eTagResponse);


      if (contentTypeResponse != "application/json") {
        client.abort();
      } else {
        //Wenn es sich um eine JSOn Datei handelt dann gib mir den Last-Modified Header der Web Resource
        console.log("Zuletzt am Server gspeichert am (Last-Modified):",lastModifiedResponse
        );

       
    //NEU --> ETag anstatt LastModiefied Header!
        if (eTagResponse == getETaglocalS) {
          console.log('your Data is up-to-date');
          pathbool = false;
          
        } else {
          pathbool = true; 
          console.log("your Data is not up-to-date, it gets now downloaded from the resource and saved in your local storage");
          $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).show().delay(1500);
          downloadAmpelFile(pathforUpdate,eTagResponse);
        }
    }} 
  };
  }catch(error){
    console.error(error);
    }
  }
  pathbool = false;
  accessBool = false;
}


function onLocationSuccess(position){ 
  Latitude = position.coords.latitude;
  Longitude = position.coords.longitude;

  getLocation(Latitude, Longitude);
};

// Error callback
function onLocationError(error) {
  console.log("Dein Standort konnte nicht gefunden werden");
 alert("Dein Standort konnte nicht gefunden werden");
  checkBool = true;
  document.getElementById("switchValue").checked = true;
}

function getStandort(){
cordova.plugins.locationAccuracy.request(
  function() {
    console.log("testhigh success");
    setTimeout(function() {
      readUserLocation();
    }, 1500);
  },
  function() {
    console.log("error");
  },
  cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
);
}

function readUserLocation() {
  navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, {
    enableHighAccuracy: true,
  }
  );
}


//__TOGGLE FUNKTION______
function myToggle() {
  let isChecked = document.getElementById("switchValue");
  if (isChecked.checked) {
    checkBool = true; //true = Standort deaktiviert! ==> DEFAULT
  } else {
    checkBool = false; //false = Standort deaktiviert!
  }
}

//______STANDORT verwenden mit Toggle________
function myLocation() {
  let isChecked = document.getElementById("switchValue");
  
  myToggle(isChecked); //Toggle Mechanismus: true = Standort deaktiviert!
  
  //Manuelle Lokation
  if (checkBool == true) {
    document.getElementById("bezirk").innerHTML = bezirk;

    sessionStorage.setItem("storeToggleTrue", true);
    sessionStorage.removeItem("storeToggleFalse");
    sessionStorage.setItem("storeBezirk", bezirk);

    bezirk = document.getElementById("bezirk").innerHTML;
    document.getElementById("standortText").innerHTML = "zuletzt verwendeter Standort";

    //Standortbasierte Lokation
  } else if (checkBool == false) {
    if(connBool == true){
      /*___CORDOVA-CODE___
      if(platform != null){
      if(platform ==="Android" || platform ==="iOS"){
        getStandort();
      }else if(platform ==="browser"){
        readUserLocation();
      }
    }*/
    readUserLocation();
    document.getElementById("standortText").innerHTML = "derzeitiger Standort";
   //Standort abfragen
    }else if (connBool == false){
      read_from_local_storage();
       bezirk = getbezirkLocalS;
       console.log(bezirk);
       sessionStorage.setItem("storeBezirk", bezirk);
       document.getElementById("standortText").innerHTML = "zuletzt verwendeter Standort";
      getAmpel();
    }
      
    if(lokalstorageBezirk != null){
      downloadLokation();
      }
      document.getElementById("bezirk").innerHTML = bezirk;

    sessionStorage.setItem("storeToggleFalse", false);
    sessionStorage.removeItem("storeToggleTrue");
    sessionStorage.setItem("storeBezirk", bezirk);

    document.getElementById("infoText").style.display= "none";
    document.getElementById("info_start").style.display= "none";
  }
}


function createDropdown(){
loadJSON("bundesland_dropdown.json", function(data){
  for(i=0; i<data[0].Bezirke.length; i++){ 
  arrBezirke.push(data[0].Bezirke[i].Bezirk);
  }
  for(i=0; i<arrBezirke.length;i++){

      dropdownContent = document.getElementById('myDropdown');
      htmlToAppend = document.createElement('LI');
      
      htmlToAppend.setAttribute('onclick', 'changeText(this)');
      textnode = document.createTextNode(arrBezirke[i]);
      htmlToAppend.appendChild(textnode);
      htmlToAppend.setAttribute('value', arrBezirke[i]);
      dropdownContent.appendChild(htmlToAppend); 
    
  }
  sortListDir("myDropdown");

}, function(xhr){console.error(xhr);});
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}


//Auswählen des Bezirks im Drop Down - Text
function changeText(elm) {
  bezirk = elm.getAttribute("value");
  myFunction();
  document.getElementById("bezirk").innerHTML = bezirk;
  sessionStorage.setItem("storeBezirk", bezirk);
  getAmpel();

  document.getElementById("infoText").style.display= "none";
  document.getElementById("info_start").style.display= "none"; 
  document.getElementById("standortText").innerHTML = "zuletzt gewählter Standort";
  document.getElementById("switchValue").checked = true;

  sessionStorage.removeItem("storeBundesland");

  sessionStorage.setItem("storeBezirk",bezirk);
  sessionStorage.setItem("storeToggleTrue", true);
  sessionStorage.removeItem("storeToggleFalse");
}

function onload_start() {
  bezirkStorage = sessionStorage.getItem("storeBezirk");
  toggleStorageTrue = sessionStorage.getItem("storeToggleTrue");
  toggleStorageFalse = sessionStorage.getItem("storeToggleFalse");
  standortStorage = localStorage.getItem("storeStandort");

  if(navigator.onLine == true){
    onOnline();
  } else if (navigator.onLine == false){
    onOffline();
  }

  if (bezirkStorage != null) {
    document.getElementById("bezirk").innerHTML = bezirkStorage;
    bezirk = bezirkStorage;
    document.getElementById("infoText").style.display = "none";
    document.getElementById("info_start").style.display= "none";
    getAmpel();
  }
  if (toggleStorageTrue != null) {
    document.getElementById("switchValue").checked = true;
    if(bezirkStorage == standortStorage){
      document.getElementById("standortText").innerHTML = "zuletzt verwendeter Standort";
      document.getElementById("info_start").style.display= "none";
    }
    else if (bezirkStorage != standortStorage){
      document.getElementById("standortText").innerHTML = "zuletzt gewählter Standort";
      document.getElementById("info_start").style.display= "none";
    }
  }
  if (toggleStorageFalse != null) {
    document.getElementById("switchValue").checked = false;
    myLocation();
    document.getElementById("standortText").innerHTML = "derzeitiger Standort";
    document.getElementById("info_start").style.display= "none";
  }
}
