
/*

//- Ampelfarbe ab Start der App ohne refresh angezeigt --> neue Funktion, Online Ampeldaten! 
    -->"getAmpelwarnstufeOnline" (letzte Warnstufe wird jetzt auch lokal gespeichert) damit mans gleich beim start gezeigt bekommt)
//______________________________ERKLÄRUNG_________________________________________________________________________________________________________________
Kurze Erklärung für Aktive Fälle: 
3 Möglichkeiten Aktive Faelle angezeigt zu bekommen: 
- Durch direkten Request wenn es weder Daten im LS noch in DB gibt --> Daten direkt aus dem Internet
- Wenn DB nicht vorhanden oder nicht up-to date ist aber vom letzten mal noch im LS gespeichert --> LS daten werden verwendet
- Wenn DB vorhandenund up-to-date --> Daten werden aus der DB verwendet !!! geht nicht !!

Kurze Erklärung zu Ampelfarbe::
- wenn App zum erstenmal gestartet --> Online Warnstufe wird requested, angezeigt und im LS gespeichert
- wenn es bereits aktuelle Daten gibt --> Dann werden sie offline genommen 


//__________________________ANMERKUNGEN______________________________________________________________________________________________


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 * 
 * ______________WICHTIG FÜRS TESTEN___________________
 * -) Erst seit den letzten 3, 4 Ampelfile Versionen sind die Bezirke von Vorarlberg auch wirklich als Bezirke
 *    angeführt. Wenn mit älteren Versionen getestet wird kann es also sein das Bregenz, Bludenz, Dornbirn
 *    oder Feldkirch nicht funktionieren.
 */



const urlBezirke2 = 'https://covid19-dashboard.ages.at/data/CovidFaelle_Timeline_GKZ.csv';
//const corsFixBezirke2 = 'https://evening-reaches-25236.herokuapp.com/';
const corsFixBezirke2 = 'https://evening-reaches-25236.herokuapp.com/';
let pathBezirke2 = corsFixBezirke2 + urlBezirke2;

const urlBundesland = 'https://covid19-dashboard.ages.at/data/CovidFaelle_Timeline.csv';
const corsFixBundesland = 'https://evening-reaches-25236.herokuapp.com/';
let pathBundesland = corsFixBundesland + urlBundesland;
        
let onlineAmpeldata;          

let alleBezirksDaten = []; 
var allItems; 
var alleMeineDatenOfflineBez; 
var alleMeineDatenBezLS; 
let valueAktiveFaelle;
let ampelDatatrue;
let AktiveFaellestoreBezirkalt;
let Neuerkrankungen;
let Todesfaelle;
let AktiveFaellestoreBezirk;

//Db Offline Data
//let loadbool =true;      
//var db; 
//var request = window.indexedDB.open("alleBezirksDaten",1); 
// var meineDatenAAF = []; //Alle Aktive Fälle jedes Datums des Gewählten Bezirks
// var meineDatenAEW = [];
// var meineDatenAF = [];
// var meineDatenAFSiebenT = [];
// var meineDatenAFS = [];
// var meineDatenAGS = [];
// var meineDatenAGT = [];
// var meineDatenATS = [];
// var meineDatenATT = [];
// var meineDatenSTI = [];
// var meineDatenDatum = [];

let storeBezirk;
let pathboolBezirk;


let bezirk;
let bundesland;
let ampelStufe;
let alteampelStufe;
let lokalstorageBezirk;
let lokalstorageBundesland;

let getETagLocalAmpel;
let getETagLocalBezirke;

let dataOffline;
let dataOfflineBez;
const arrBezirke = [];

var arrLänge = 0;
let path2 = corsFix + url;
let pathforUpdate = corsFix + url; //path2 ist nach dem Speicher ooflineData.. deswegen hab ich das im Moment noch dazu getan
var savedAktiveFaelleMeinBezirk;


//Damit kannst du arbeiten --> Alle Werte der Datei
let getDatum;
let getBundesland;
let getBundeslandID;
let getAnzEinwohner;
let getAnzahlFaelle;
let getAnzahlFaelleSum;
let getAnzahlFaelle7Tage;
let getSiebenTageInzidenzFaelle;
let getAnzahlTotTaeglich;
let getAnzahlTotSum;
let getAnzahlGeheiltTaeglich;
let getAnzahlGeheiltSum;


//Als Arrays gespeichert
let getDatumArr=[];
let getBundeslandArr=[];
let getBundeslandIDArr=[];
let getAnzEinwohnerArr=[];
let getAnzahlFaelleArr=[];
let getAnzahlFaelleSumArr=[];
let getAnzahlFaelle7TageArr=[];
let getSiebenTageInzidenzFaelleArr=[];
let getAnzahlTotTaeglichArr=[];
let getAnzahlTotSumArr=[];
let getAnzahlGeheiltTaeglichArr=[];
let getAnzahlGeheiltSumArr=[];

let databaseCompletebool  = false;


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

checkForUpdate();

//Wenn vom letzten mal noch eine Lokation im LS gespeichert ist dann zeig die Daten von der an
read_from_local_storage();
getAmpel();

//console.log("databasebool", databasebool);
//console.log("CONNBOOL:", connBool);

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
        if (data.localityInfo.administrative[i].adminLevel == "4") {
          if(data.localityInfo.administrative[i].name == "Wien"){
          bezirk = data.localityInfo.administrative[i].name;
          document.getElementById("bezirk").innerHTML = bezirk;
          lokalstorageBezirk = bezirk;
          
          localStorage.setItem("storeBezirk", bezirk);
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
        }
      }
          lokalstorageBezirk = bezirk;
          document.getElementById("bezirk").innerHTML = bezirk;
          localStorage.setItem("storeBezirk", bezirk);
          localStorage.setItem("letzterBezirk", bezirk);

        //WICHTIG
        downloadBezirksFile(pathBezirke2);
        getAmpel();
        //console.log("DER STANDORT WIRD ERMITTELT");
        lokalstorageBundesland = bundesland;
        bundesland = data.principalSubdivision;
        //localStorage.setItem("storeBundesland", bundesland);
      
    },
    function (xhr) {
      //console.log("Der Standort kann leider nicht ermittelt werden. Versuchen Sie die Seite mit https:// aufzurufen.");
    }
  );
}

//***_______AMPEL_FUNKTIONALITÄT_______***

//ILLUSTRATION
function basicIllu(){//stuff der für alle Ampelfarben gelich gilt (zum Schreibarbeti sparen)
  document.getElementById("farbkreisAktiv").style.display = "block";
  document.getElementById("farbkreisAktiv").style.verticalAlign = "middle";
  document.getElementById("farbkreisAktiv").style.textAlign = "center";
  //console.log('valueAktiveFaelle', valueAktiveFaelle);   
  if(valueAktiveFaelle == null || valueAktiveFaelle == undefined || connBool == false){
    document.getElementById("value_pos").innerHTML = "  ";
  }else{
  document.getElementById("value_pos").innerHTML = valueAktiveFaelle;
  }
}
function drawIllustration(ampelStufe){
  $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).show().delay(1500);
  basicIllu();
    if (ampelStufe == 1) {
      document.getElementById("farbkreis").style.backgroundColor = "#60B564";
      document.getElementById("WarnstufeGeschrieben").innerHTML = "GRÜN <br/> geringes Risiko";
      document.getElementById("farbkreisAktiv").style.border = "1px solid #60B564";
        //basicIllu();
      
      document.getElementById("ringerl").style.display = "block";
      document.getElementById("ringerl").style.gridColumn = "4/4";
        document.getElementById("ringerl").style.gridRow = "7/7";
        document.getElementById("ringerl").style.alignSelf = "center";
      } else if (ampelStufe == 2) {
        document.getElementById("farbkreis").style.backgroundColor = "#FED500";
        document.getElementById("WarnstufeGeschrieben").innerHTML = "GELB <br/> mittleres Risiko";
        document.getElementById("farbkreisAktiv").style.border = "1px solid #FED500";
        //basicIllu();
        
        document.getElementById("ringerl").style.display = "block";
        document.getElementById("ringerl").style.gridColumn = "5/5";
        document.getElementById("ringerl").style.gridRow = "8/8";
        document.getElementById("ringerl").style.alignSelf = "center";
      } else if (ampelStufe == 3) {
        document.getElementById("farbkreis").style.backgroundColor = "#F59C00";
        document.getElementById("WarnstufeGeschrieben").innerHTML = "ORANGE <br/> hohes Risiko";
        document.getElementById("farbkreisAktiv").style.border = "1px solid #F59C00";
       // basicIllu();
        
        document.getElementById("ringerl").style.display = "block";
        document.getElementById("ringerl").style.gridColumn = "6/6";
        document.getElementById("ringerl").style.gridRow = "8/8";
        document.getElementById("ringerl").style.alignSelf = "center";
      } else if (ampelStufe == 4) {
        document.getElementById("farbkreis").style.backgroundColor = "#CB0538";
        document.getElementById("WarnstufeGeschrieben").innerHTML = "ROT <br/> sehr hohes Risiko";
        document.getElementById("farbkreisAktiv").style.border = "1px solid #CB0538";
        //basicIllu();
        
        document.getElementById("ringerl").style.display = "block";
        document.getElementById("ringerl").style.gridColumn = "7/7";
        document.getElementById("ringerl").style.gridRow = "7/7";
        document.getElementById("ringerl").style.alignSelf = "center";
      }
      $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).fadeOut(1000);
      localStorage.setItem("letzteAmpelstufe", ampelStufe);
}


//GET DATA
function getAmpel() {
var dataOff;

//console.log("DU BIST HIER");
//console.log("ampelDatatrue: ", ampelDatatrue);
//console.log("dataOffline: ",dataOffline);

//dataOffline: Data aus Json von LS
  if(dataOffline != null ){
    var dataOfflineFormat = new Date(dataOffline.Stand);
    document.getElementById("letzte_ampel").innerHTML = "Ampel Stand: "+dataOfflineFormat.toLocaleString("de-DE");
    dataOff = dataOffline;
     //console.log("AMPELFARBE wird offline genommen", "dataOff:" ,dataOff);
     getWarnstufe(dataOff);
//ampelDatatrue: Daten direkt aus dem Request --> zum anzeigen der Daten wenn die Werte noch nicht im LS geladen sind(jetzt muss man nicht mehr refreshen)
  }else if (ampelDatatrue !=null){
     dataOff = ampelDatatrue.items_json;
     //console.log("AMPELFARBE wird online(offline) genommen", "ampelDatatrue:" ,dataOff);
     getWarnstufe(dataOff);
     }
}
     
function getWarnstufe(dataOff){
  //console.log("Offline Data", dataOff);
  //storeBezirk = localStorage.getItem("storeBezirk");
  storeBezirk = bezirk;
      for (i = 0; i < dataOff.Warnstufen.length; i++) {
        if(storeBezirk == "Wien"){
          if(dataOff.Warnstufen[i].Name == storeBezirk){
            //console.log(storeBezirk);
            //console.log("Ampelstufe: "+dataOff.Warnstufen[i].Warnstufe);
            ampelStufe = dataOff.Warnstufen[i].Warnstufe;
            drawIllustration(ampelStufe);
          }
        }else{
        if (dataOff.Warnstufen[i].Region == "Bezirk") {
          if (dataOff.Warnstufen[i].Name == storeBezirk) {
            //console.log(storeBezirk);
            //console.log("Ampelstufe: "+dataOff.Warnstufen[i].Warnstufe);
            ampelStufe = dataOff.Warnstufen[i].Warnstufe;
            drawIllustration(ampelStufe);
          }
       }
     }
    }
}

//Bekomme Ampelwarnstufe von jsonFile ONLINE --> Damit bei leeren LS/erstem Start der App nach Auswahl des Bezirks die Farbe angezeigt wird 
function getAmpelwarnstufeOnline(onlineAmpeldata){
  //console.log("AMPFELFARBE wird online genommen");
  try{
    for(i=0; i<onlineAmpeldata.Warnstufen.length; i++){ 
    if(onlineAmpeldata.Warnstufen[i].Region == "Bezirk"){
            if(onlineAmpeldata.Warnstufen[i].Name == bezirk){
            //console.log(bezirk);
            //console.log("Ampelstufe: "+onlineAmpeldata.Warnstufen[i].Warnstufe);
            ampelStufe = onlineAmpeldata.Warnstufen[i].Warnstufe;
            drawIllustration(ampelStufe);
            }
          }
        }
    }catch{
}
}


//Speichern der AMPELDaten im LocalStorage + Hinzufügen der Zeit und Datum des Downloads
function downloadAmpelFile(path2) {
  if(connBool ==true){ //wenn ich internet hab 
  //console.log("Ampelfile wird gedownloaded");
  loadJSON(path2, function (data) {
    let items_json = data[12];
    var date = new Date();//var updateDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
        var updateDate = date.toGMTString(); // Tue, 17 Nov 2020 14:16:29 GMT --> Gibt mir die jetzige Uhrzeit im Format das lastModiefied Header Request auch hat
         ampelDatatrue = {updateDate: updateDate, items_json };


         var dataOfflineFormat = new Date(data[12].Stand);
         document.getElementById("letzte_ampel").innerHTML = "Ampel Stand: "+dataOfflineFormat.toLocaleString("de-DE");
         
          //console.log("AMPELDATEN WERDEN GELADEN", ampelDatatrue);

          //console.log("Ampelfile wird gedownloadet");
          localStorage.setItem("Ampeldaten", JSON.stringify(ampelDatatrue));
          onlineAmpeldata = items_json;

    if(!localStorage.getItem("Ampeldaten")){
        valueAktiveFaelle =" "; //damit kein undefinded angezeigt wird..
        getAmpelwarnstufeOnline(onlineAmpeldata);
    }else if (localStorage.getItem("Ampeldaten")){
         getAmpel();
      //console.log('Ampeldaten vorhanden');
    }

    $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).fadeOut(700);
  }, function () {
    document.getElementById("dataLoader").innerHTML = "Die Daten können momentan leider nicht heruntergeladen werden.";
    $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).fadeOut(700);
  });
}else{ 
  document.getElementById("dataLoader").innerHTML = "Die Daten können momentan leider nicht heruntergeladen werden.";
  $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).fadeOut(700);
}
}


//Speichern der LOKATION Daten im LocalStorage + Hinzufügen der Zeit und Datum des Downloads
function downloadLokation() {
   //console.log('DEIN BEZIRK:', lokalstorageBezirk );
    var lokationobjecttrue = {bezirksObject:lokalstorageBezirk, bundeslandObject:lokalstorageBundesland};
    localStorage.setItem("Lokationsdaten", JSON.stringify(lokationobjecttrue));
   
}



function read_from_local_storage() { //gib mir die Datem aus dem localStorage 
 //gib mir daweil noch die alten Daten
//AMPELSTUFE - alt
  if(localStorage.getItem("letzteAmpelstufe") != null){
      alteampelStufe = localStorage.getItem("letzteAmpelstufe");
    }else {
    //console.log("letzteAmpelstufe ist im LS sind noch nicht vorhanden");
  }

  //BEZIRK - alt 
  if(localStorage.getItem("letzterBezirk") != null){
    bezirk = localStorage.getItem("letzterBezirk");
    localStorage.setItem("storeBezirk", bezirk);
    try{
    document.getElementById("bezirk").innerHTML = bezirk;
    }catch{

    }
   }

//AKTIVE FÄLLE - alt
if (localStorage.getItem("AktiveFaelle")!= null){
  AktiveFaellestoreBezirkalt = localStorage.getItem("AktiveFaelle");
  //console.log("ALTE STANDORT Daten! --> Das sind die ALTEN Daten aus dem LS", databasebool, AktiveFaellestoreBezirkalt);
  valueAktiveFaelle = AktiveFaellestoreBezirkalt;
  drawIllustration(ampelStufe);
  //document.getElementById("farbkreisAktiv").innerHTML = valueAktiveFaelle;
  } else {
  //console.log("AktiveFaelle ist im LS sind noch nicht vorhanden");

//von DB
    // if(databasebool == true){
    // getOfflineBezDaten();
    // }else{

    // }

}

//Bundesland - alt 
if(localStorage.getItem("letztesBundesland") != null){
  bundesland = localStorage.getItem("letztesBundesland");
  }else {
//console.log("letzerBezirk im LS sind noch nicht vorhanden");
}

  //LOKATION
  if(localStorage.getItem("Lokationsdaten") != null){
  var savedLokation = localStorage.getItem("Lokationsdaten");
  savedLokationValue = JSON.parse(savedLokation);
  getbezirkLocalS = savedLokationValue.bezirksObject;
  getbundeslandLocalS = savedLokationValue.bundeslandObject;
  // console.log('Lokal gespeicherter Bezirk: ',getbezirkLocalS);
  // console.log('Lokal gespeichertes Bundesland: ',getbundeslandLocalS);
  }

  //AMPELDATEN
  var items_json = localStorage.getItem("Ampeldaten");
  if(items_json !=null){ //check of es diese Daten im localstorage gibt
  items = JSON.parse(items_json);
  items2 = JSON.stringify(items_json);
  dataOffline = items.items_json;
} else{
  document.getElementById("dataLoader").innerHTML = "Die Daten werden geladen ...";
  $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).show().delay(1500);
  
 }  
}


//UPDATE
async function checkForUpdate() {
  await onload_start();
  read_from_local_storage(); //Les mir das Objekte vom Lokalstorage aus (brauche "updateDate", "lokalstorageBezirk" )

//schau ob die lokalen Ampel und Lokationsdaten Speicherdaten geupdated gehören
// if(checkBool == false){ //Standort ist aktiviert wenn checkBool==false
//            downloadLokation();
//           }
if(connBool == true){ //wenn es eine Internetverbindung ist und dder online zugriff auf die Ampeldaten gestattet dann
   checkBezirksdata();
   checkAmpeldata(pathforUpdate);
   checkBundeslanddata();
}
}

function checkAmpeldata(pathforUpdate){
  var client = new XMLHttpRequest(); //mach eine Verbindung zur Resource
  try{
  client.open("GET", pathforUpdate, true);
  client.send();
  client.onreadystatechange = function () {
       if (this.readyState == this.HEADERS_RECEIVED) {//gibt mir alle Headers von allen Requests aus
            var contentTypeResponse = client.getResponseHeader("Content-Type");
            eTagResponse = client.getResponseHeader("ETag");
            //console.log(eTagResponse);

      if (contentTypeResponse != "application/json") {
          client.abort();
      } else {
         //Wenn es sich um eine JSOn Datei handelt dann gib mir den Last-Modified Header der Web Resource
        //console.log("Zuletzt am Server gspeichert am (Last-Modified):",lastModifiedResponse);      
        //console.log("eTagResponse",eTagResponse);
        var eTagAmpelLocal = localStorage.getItem("ETagAmpel");
        //console.log('eTagResponseAmpel',eTagResponse);
        //console.log("Ampel ETag Local", eTagAmpelLocal);
      if(eTagAmpelLocal == null || eTagAmpelLocal != eTagResponse){
      //DOWNLOAD FILE IMPLEMENTIEREN-nur localstorage
      localStorage.setItem("ETagAmpel", eTagResponse);
      //localStorage.setItem("ETagAmpel", eTagResponse+"TEST");
      downloadAmpelFile(pathforUpdate);   
         } 
    }} 
  };
  }catch(error){
    console.error(error);
    }
}

function checkBundeslanddata(){
  var client = new XMLHttpRequest(pathBundesland); //mach eine Verbindung zur Resource
  try{
  client.open("GET", pathBundesland, true);
  client.send();
  client.onreadystatechange = function () {
       if (this.readyState == this.HEADERS_RECEIVED) {//gibt mir alle Headers von allen Requests aus
            //var lastModifiedResponse = client.getResponseHeader("Last-Modified");
            eTagResponseBundesland = client.getResponseHeader("ETag");
            //console.log(eTagResponseBezirke);
    var eTagBundeslandLocal = localStorage.getItem("ETagBundesland");
    //console.log('eTagResponseBundesland',eTagResponseBundesland);
    //console.log("Bundesland ETag Local", eTagBundeslandLocal);
    if(eTagBundeslandLocal == null || eTagBundeslandLocal != eTagResponseBundesland ){
      //DOWNLOAD FILE IMPLEMENTIEREN-nur localstorage
        downloadBundeslandFile(pathBundesland);    
      //localStorage.setItem("ETagBundesland", eTagResponseBundesland+"TEST");
      localStorage.setItem("ETagBundesland", eTagResponseBundesland);
        }else if (eTagBundeslandLocal != null || eTagBundeslandLocal == eTagResponseBundesland ){         
        } 
     } 
  };
  }catch(error){
    console.error(error);
    }
}

function checkBezirksdata(){
  var client = new XMLHttpRequest(pathBezirke2); //mach eine Verbindung zur Resource
  try{
  client.open("GET", pathBezirke2, true);
  client.send();
  client.onreadystatechange = function () {
       if (this.readyState == this.HEADERS_RECEIVED) {//gibt mir alle Headers von allen Requests aus
            //var lastModifiedResponse = client.getResponseHeader("Last-Modified");
            eTagResponseBezirke = client.getResponseHeader("ETag");
            //console.log(eTagResponseBezirke);  
            var eTagBezirkeLocal = localStorage.getItem("ETagBezirke");
            //console.log('eTagResponseBezirke',eTagResponseBezirke);
            //console.log("Bezirke ETag Local", eTagBezirkeLocal);
  
    if(eTagBezirkeLocal == null || eTagBezirkeLocal != eTagResponseBezirke ){
      //DOWNLOAD FILE IMPLEMENTIEREN-nur localstorage
        downloadBezirksFile(pathBezirke2);    
      localStorage.setItem("ETagBezirke", eTagResponseBezirke);
        }else if (eTagBezirkeLocal != null || eTagBezirkeLocal == eTagResponseBezirke ){         
        } 
     } 
  };
  }catch(error){
    console.error(error);
    }
}

function checkOfflineAvailableAmpel(){
  if (eTagResponse == getETaglocalS) {
    //console.log('your Data is up-to-date');
    pathboolAmpel = false;
  
} else {
 // pathboolAmpel= true; 
  //console.log("your Data is not up-to-date, it gets now downloaded from the resource and saved in your local storage");
  $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).show().delay(1500);
  

}}

//STANDORT
function onLocationSuccess(position){ 
  Latitude = position.coords.latitude;
  Longitude = position.coords.longitude;
  getLocation(Latitude, Longitude);
};

// Error callback
function onLocationError(error) {
 alert("Dein Standort konnte nicht gefunden werden");
  checkBool = true;
  document.getElementById("switchValue").checked = true;
}

function getStandort(){
cordova.plugins.locationAccuracy.request(
  function() {
    setTimeout(function() {
      readUserLocation();
    }, 1500);
  },
  function() {
    //console.log("error");
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
    checkBool = false; //false = Standort aktiviert!
  }
}


//______STANDORT verwenden mit Toggle________
function myLocation() {
  let isChecked = document.getElementById("switchValue");
    myToggle(isChecked); //Toggle Mechanismus: true = Standort deaktiviert!
  
  //Manuelle Lokation
  if (checkBool == true) {
    document.getElementById("bezirk").innerHTML = bezirk;
    localStorage.setItem("storeToggleTrue", true);
    localStorage.removeItem("storeToggleFalse");
    localStorage.setItem("storeBezirk", bezirk);

    bezirk = document.getElementById("bezirk").innerHTML;
    document.getElementById("standortText").style.display= "block";
    document.getElementById("standortText").innerHTML = "zuletzt verwendeter Standort";
    

    //Standortbasierte Lokation
  } else if (checkBool == false) {

    if(connBool == true){
     
      // location.reload();
      /*___CORDOVA-CODE___
      if(platform != null){
      if(platform ==="Android" || platform ==="iOS"){
        getStandort();
      }else if(platform ==="browser"){
        readUserLocation();
      }
    }*/

  //ABSOLUT WICHTIG FÜR TOGGLE!!!!
  //Standort abfragen
     readUserLocation();
  ////  
    document.getElementById("standortText").style.display= "block";
    document.getElementById("standortText").innerHTML= "derzeitiger Standort";
   
    }else if (connBool == false){
      read_from_local_storage();
      getOfflineBezDaten();

    //   if (databasebool == false){
    //     checkBezirksdata(); 
    //  // downloadBezirksFile(pathBezirke2);
    //  checkAvailableDatabase();
    //   }


       bezirk = lokalstorageBezirk;
       localStorage.setItem("storeBezirk", bezirk);
       document.getElementById("standortText").style.display= "block";
       document.getElementById("standortText").innerHTML = "zuletzt verwendeter Standort";
      getAmpel();

    }
      
    // if(lokalstorageBezirk != null){
    //   downloadLokation();
    //   }

      document.getElementById("bezirk").innerHTML = bezirk;

    localStorage.setItem("storeToggleFalse", false);
    localStorage.removeItem("storeToggleTrue");
    localStorage.setItem("storeBezirk", bezirk);
    getAmpel();
 
    document.getElementById("infoText").style.display= "none";
    document.getElementById("info_start").style.display= "none";
  }
}

//__DROPDOWN_____
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
  $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).show().delay(1500);
  //AktiveFaelle setzen
  checkBezirksdata();

   
  bezirk = elm.getAttribute("value");
  myFunction();
  document.getElementById("bezirk").innerHTML = bezirk;
  //localStorage.setItem("storeBezirk", bezirk);
  localStorage.setItem("letzterBezirk", bezirk);
  
  //FÄRBT Ampel EIN --> WICHTIG
  if(alteampelStufe != null){
    ampelStufe = alteampelStufe;
  }
  if(localStorage.getItem("Ampeldaten") == null){
    getAmpelwarnstufeOnline(onlineAmpeldata);
    //getAmpel();
    }else{
      //console.log('Ampeldaten vorhanden');
      getAmpel();
    }
  
  
 //prepareBezirksData(pathBezirke2);
 

 

  document.getElementById("infoText").style.display= "none";
  document.getElementById("info_start").style.display= "none"; 
  document.getElementById("standortText").style.display= "none";
  document.getElementById("switchValue").checked = true;
  localStorage.removeItem("storeBundesland");

  //localStorage.setItem("storeBezirk",bezirk);
  localStorage.setItem("storeToggleTrue", true);
  localStorage.removeItem("storeToggleFalse");

//  if (databasebool == true){
//   //Daten aus der DB!!!
//   getOfflineBezDaten(); //WENN OFFLINE (für Aktive Faelle)
//   } else if (connBool == true && databasebool == false){
//   //Daten Direkt! 
//   
  
//   }

 //HIER
 if(databaseCompletebool == true){
  getOfflineBezDaten(); 
  drawIllustration(ampelStufe);  
} else  {
  downloadBezirksFile(pathBezirke2);

}


  $("#loader_class").css({"display": "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column"}).fadeOut(700);
}


//START
function onload_start() {
  
  anzahlFaelleStorage = localStorage.getItem("AktiveFaellestoreBezirk");
  bezirkStorage = localStorage.getItem("storeBezirk");
  toggleStorageTrue = localStorage.getItem("storeToggleTrue");
  toggleStorageFalse = localStorage.getItem("storeToggleFalse");
  standortStorage = localStorage.getItem("storeStandort");
  
  if(navigator.onLine == true){ 
     onOnline();

  } else if (navigator.onLine == false){
    
          onOffline();

  }

  if (anzahlFaelleStorage != null) {
    drawIllustration();
  }


  //HIER
if(databaseCompletebool == true){
  getOfflineBezDaten(); 
  drawIllustration(ampelStufe);  
} else  {
  downloadBezirksFile(pathBezirke2);

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
      document.getElementById("standortText").style.display= "block";
      document.getElementById("standortText").innerHTML = "zuletzt verwendeter Standort";
      document.getElementById("info_start").style.display= "none";
    }
    else if (bezirkStorage != standortStorage){
      document.getElementById("standortText").style.display= "none";
      document.getElementById("info_start").style.display= "none";
    }
  }
  if (toggleStorageFalse != null) {
    document.getElementById("switchValue").checked = false;
    myLocation();
    document.getElementById("standortText").style.display= "block";
    document.getElementById("standortText").innerHTML = "derzeitiger Standort";
    document.getElementById("info_start").style.display= "none";
  }
}


//***_______AKTIVE FAELLE_FUNKTIONALITÄT_______***
// function setHardfacts() {
//   //HARDFACTS
//   document.getElementById("hfBez_aktF").innerHTML = "<div class = 'hardfacts'>" + AktiveFaellestoreBezirk + "</div";
//   document.getElementById("hfBez_Neuerk").innerHTML = "<div class = 'hardfacts'>" + Neuerkrankungen + "</div";
//   document.getElementById("hfBez_TTBez").innerHTML = "<div class = 'hardfacts'>" + Todesfaelle + "</div";


// }
//___NUR EINZELNEN WERT BERECHNEN
//Hier wird nur ein Wert (AktiveFaelle) für den gerade ausgewählten Bezirk berechnet, Berechnung erfolgt direkt nach Request an URL
function prepareBezirksData(pathBezirke2){
        const stringReplace = JSON.stringify(pathBezirke2);
        const jsonReplace = stringReplace;
        const realData = JSON.parse(jsonReplace);
        items_jsonBezirke2 = realData; 
        



        var last = items_jsonBezirke2.length-1;

        let posFaelleDatum = items_jsonBezirke2[last].Time;
       var index = posFaelleDatum.indexOf(" ");
       var id = posFaelleDatum.substr(0, index);
       var text = posFaelleDatum.substr(index + 1);
        var realDatum = id+", "+text;

        document.getElementById("letzte_pos_faelle").innerHTML = "Positive Fälle Stand: "+realDatum;

          //console.log("items_jsonBezirke2",items_jsonBezirke2);

        for (i = 0; i < items_jsonBezirke2.length; i ++){
          const obj = items_jsonBezirke2[i];
          const newKeys = { Time: "datum"}; //wenn geändert wird dann unten auch! 
          const renamedObj = renameKeys(obj, newKeys);
          items_jsonBezirke2[i] = renamedObj;    

    
        if(bezirk == items_jsonBezirke2[i].Bezirk){
            var fulldatesofitems = items_jsonBezirke2[i].datum; 
            var dateofitems = fulldatesofitems.split(" ");
            var dateofitem = dateofitems[0]; 
            items_jsonBezirke2[i].datum = dateofitem; 
            itemsstoreBezirk = items_jsonBezirke2[i];
                      
            //Anzahl Aktive Fälle berechnen
            let AnzahlFaelleSum = itemsstoreBezirk.AnzahlFaelleSum;
            let AnzahlGeheiltSum = itemsstoreBezirk.AnzahlGeheiltSum;
            let AnzahlTotSum = itemsstoreBezirk.AnzahlTotSum;
            AktiveFaellestoreBezirk = AnzahlFaelleSum - AnzahlGeheiltSum - AnzahlTotSum;





           
            // //Anzahl Neuerkrankungen
            Neuerkrankungen = items_jsonBezirke2[i].AnzahlFaelle;
            //console.log("AnzahlFaelleSum", AnzahlFaelleSum);
            //console.log("Neuerkrankungen", Neuerkrankungen);

             // //Anzahl Todesfälle
             Todesfaelle = items_jsonBezirke2[i].AnzahlTotTaeglich;
             //console.log("AnzahlFaelleSum", AnzahlFaelleSum);
            //console.log("Todesfaelle", Todesfaelle);



            // let AnzahlFaelleSum = itemsstoreBezirk.AnzahlFaelleSum;
            // let AnzahlGeheiltSum = itemsstoreBezirk.AnzahlGeheiltSum;
            // let AnzahlTotSum = itemsstoreBezirk.AnzahlTotSum;
            // AktiveFaellestoreBezirk = AnzahlFaelleSum - AnzahlGeheiltSum - AnzahlTotSum;
            
    
            //Speicherdatum
            var date = new Date();
            var updateDatestoreBezirk = date.toGMTString(); 
            DatatruestoreBezirk = {AnzahlAktiveFaelle: AktiveFaellestoreBezirk, Standort: storeBezirk, updateDate: updateDatestoreBezirk};    
            alleBezirksDaten.push(DatatruestoreBezirk);
           

            //console.log("HAAAAALLLOOO");
            //Speicher den Bezirk + den Wert im LS
            
            localStorage.setItem("letzterBezirk", bezirk);        
        } 
        
      }    


      localStorage.setItem("AktiveFaelle", AktiveFaellestoreBezirk);
      //HIER

      //console.log("DATABASEBOOL",databaseCompletebool);
      //DB Bezirksdaten sind vorhanden --> verwende die!
      if(databaseCompletebool == true){
        //console.log("die Daten werden aus der db genoemmen");
      // getOfflineBezDaten(); 
      // drawIllustration(ampelStufe);  
    } //Wenn es keine bezirksdaten gibt --> verwende die eben berechneten Werte  
     else if(databaseCompletebool == false){
       if (connBool == true){
      
       //console.log('AktiveFaellestoreBezirk',AktiveFaellestoreBezirk);

     valueAktiveFaelle = AktiveFaellestoreBezirk;
     //console.log('valueAktiveFaelle',valueAktiveFaelle);

      drawIllustration(ampelStufe);
      //checkAvailableDatabase();
       }
    } else if(databaseCompletebool == false && connBool == false && AktiveFaelleStoreBezirkalt != null){
     valueAktiveFaelle = AktiveFaellestoreBezirkalt;


      drawIllustration(ampelStufe);
      //checkAvailableDatabase();
console.log("STANDORT! Das sind die NEUEN Daten aus dem LS", databasebool, AktiveFaellestoreBezirk);
   
      
      //document.getElementById("farbkreisAktiv").innerHTML = AktiveFaellestoreBezirk;
      //Inzwischen solle die DB erstellt worden sein, ab jetzt immer von der DB! 
      //HIER anders checken ob es db gibt??
      //databasebool = true;
      console.log("AktiveFaelle sind noch nicht im LS gespeichert");
    }
  }
   
//wenn DB funktionieren würde
function getOfflineBezDaten(){
      //console.log("OFFLINE DB DATEN");
      database();       
}


 


//______ALLE WERTE BERECHNEN / NUR MIT DB!! --> DB ZUGRIFF___Um die Daten von der Indexxeddb zu bekommen! FUNKTIONIERT NICHT WEIL DDB NICHT IMPLEMENTIERT 
function database(){
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || 
window.webkitIndexedDB || window.msIndexedDB;
//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || 
window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
window.msIDBKeyRange




if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

//Öffne DB Zugriff
 //request = window.indexedDB.open("alleBezirksDaten",1);

        


// //ON SUCCESS
//      
//         db = event.target.result;
//         //console.log("success: "+ db);
//         //Wenn verbindung aufgebaut werden kann dann gib mit die Daten aus der DB --> "Start"
//         preparemeineDaten();
        

//Gib mir die Daten aus der DB

request.oncomplete = function(event) {
var objectStore = db.objectStore("bezirksdaten");

var itemsRequest = objectStore.getAll();
  itemsRequest.oncomplete= function(alleMeineDatenBezLS) {
  alleMeineDatenOfflineBez = itemsRequest.result;
  console.log("alleMeineDaten offline",alleMeineDatenOfflineBez);
  //console.log("objectStore",objectStore);
  alleMeineDatenBezLS = alleMeineDatenOfflineBez;
}

//console.log("alleMeineDaten offline2",alleMeineDatenOfflineBez); 


     }
 
//ON ERROR
     request.onerror = function(event) {   
        //console.error("Database error: " + event.target.errorCode);
        };
//ON UPRADE
        request.onupgradeneeded = function(event) {
        var db = event.target.result;
          
         
    };

}

//BEZIRKSDATEN
function checkInternet(pathBezirke2){ 
   //wenn es eine Internetverbindung ist und dder online zugriff auf die Ampeldaten gestattet dann
   var client = new XMLHttpRequest(); //mach eine Verbindung zur Resource
   try{
   client.open("GET", pathBezirke2, true);
   client.send();
  client.onreadystatechange = function () {
          if (this.readyState == this.HEADERS_RECEIVED) {//gibt mir alle Headers von allen Requests aus   
               eTagResponseBezirke2 = client.getResponseHeader("ETag");
      }
    } 
   }catch(error){
     console.error(error);
     }
   }
function preparemeineDaten(){
  for (i = 0; i<alleMeineDatenOfflineBez.length; i++){
    makeUmlauts(alleMeineDatenOfflineBez[i].allItems.Bezirk);
       if (alleMeineDatenOfflineBez[i].allItems.Bezirk == bezirk){



//Auslastung: Bundesländer/österreich immer nur aktueller tag

      //ARRAYS ALLER DATEN DES GEWÄHLTEN BEZIRKS (das vor .push sind die Arrays) (siehe globale deklaration)
      var alleMeineAAF = alleMeineDatenOfflineBez[i].AnzahlAktiveFaelle;
      meineDatenAAF.push(alleMeineAAF);

      //console.log('meineDatenAAF', meineDatenAAF);

      // var alleMeineAEW = alleMeineDatenOfflineBez[i].allItems.AnzEinwohner;
      // meineDatenAEW.push(alleMeineAEW);

      // var alleMeineAF = alleMeineDatenOfflineBez[i].allItems.AnzahlFaelle;
      // meineDatenAF.push(alleMeineAF);

      // var alleMeineAFSiebenT = alleMeineDatenOfflineBez[i].allItems.AnzahlFaelle7Tage;
      // meineDatenAFSiebenT.push(alleMeineAFSiebenT);

      // var alleMeineAFS = alleMeineDatenOfflineBez[i].allItems.AnzahlFaelleSum;
      // meineDatenAFS.push(alleMeineAFS);

      // var alleMeineAGS = alleMeineDatenOfflineBez[i].allItems.AnzahlGeheiltSum;
      // meineDatenAGS.push(alleMeineAGS);

      // var alleMeineAGT = alleMeineDatenOfflineBez[i].allItems.AnzahlGeheiltTaeglich;
      // meineDatenAGT.push(alleMeineAGT);

      var alleMeineATS = alleMeineDatenOfflineBez[i].allItems.AnzahlTotSum;
      meineDatenATS.push(alleMeineATS);

      // var alleMeineATT = alleMeineDatenOfflineBez[i].allItems.AnzahlTotTaeglich;
      // meineDatenATT.push(alleMeineATT);

      // var alleMeineSTI = alleMeineDatenOfflineBez[i].allItems.SiebenTageInzidenzFaelle;
      // meineDatenSTI.push(alleMeineSTI);

      // var alleMeineDatum = alleMeineDatenOfflineBez[i].allItems.datum;
      // meineDatenDatum.push(alleMeineDatum);
    
    }
}

    //console.log("meineDatenATS", meineDatenATS);
  //console.log("meineDatenDatum",alleMeineDatum);

  //Letzter Wert des Arrays für die gerade aktiven Faelle
  var IndexlastElementAAF = meineDatenAAF.length-1;
  //console.log("IndexlastElementAAF", IndexlastElementAAF);
  //console.log("letzter Wert:", meineDatenAAF[IndexlastElementAAF]);
  getAktiveFaelle = meineDatenAAF[IndexlastElementAAF];



  
//HIER
  //drawIllustration(ampelStufe);
  //document.getElementById("farbkreisAktiv").innerHTML = getAktiveFaelle;


      //console.log("DATABASEFUNKT! - die Daten werden aus der DB genommen", databasebool, getAktiveFaelle);

      localStorage.setItem("AktiveFaelle", getAktiveFaelle);
      
      // farbkreisValue = localStorage.getItem("AktiveFaelle");
      // document.getElementById("farbkreisAktiv").innerHTML = getAktiveFaelle;
   
  }



  
//Bezirksfile Download
function downloadBezirksFile(pathBezirke2) {
  if(connBool ==true){
  //console.log("Bezirksfile wird gedownloaded");
  Papa.parse(pathBezirke2, {
    download: true,
    header: true,
    complete: function (results, file) {
      //console.log("data", results.data);
        //console.log('Completed loading the file...');
         // Here starts your real code with this function
         //preprareBezirksData(results.data); 
         dataOfflineBez = results.data;   
         prepareBezirksData(dataOfflineBez);   
          },
  }); 
  }
}

//BUNDESLAND
//Bundeslandfile Download
function downloadBundeslandFile(pathBundesland) {
  if(connBool ==true){
    //console.log("Bundesland wird gedownloaded");
  Papa.parse(pathBundesland, {
    download: true,
    header: true,
    complete: function (results, file) {
      //console.log("data", results.data);
        //console.log('Completed loading the file...');
         // Here starts your real code with this function
         //preprareBezirksData(results.data); 
          dataOfflineBundesland = results.data; 
         //console.log("dataOfflineBundesland", dataOfflineBundesland); 
          prepareBundeslandData(dataOfflineBundesland);   
          },
  }); 
  }
}

function prepareBundeslandData(dataOfflineBundesland){
  const stringReplace = JSON.stringify(dataOfflineBundesland);
 const jsonReplace = replaceUmlautsB(stringReplace);
 const realData = JSON.parse(jsonReplace);
 let items_json = realData; 


 //Key umbenennen --> Time zu datum
 for (i = 0; i < realData.length; i ++){
const obj = items_json[i];
 const newKeys = { Time: "datum"}; //wenn geändert wird dann unten auch! 
 const renamedObj = renameKeys(obj, newKeys);
 items_json[i] = renamedObj;

 var fulldatesofitems = items_json[i].datum; //auch hier schon "datum"!!!!!
 var dateofitems = fulldatesofitems.split(" ");
 var dateofitem = dateofitems[0]; //[0] = Datum| [1] = 00:00:00
 items_json[i].datum = dateofitem; //Erstetzen des Datum + Urzeit String durch neuen "date" - String
 //console.log(items_json[i]);
 }
 
//Speichern der Daten im Lokal Storage + Speicherdatum dazu fügen (im GMT Format)
var date = new Date();//var updateDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
var updateDate = date.toGMTString(); // Tue, 17 Nov 2020 14:16:29 GMT --> Gibt mir die jetzige Uhrzeit im Format das lastModiefied Header Request auch hat
var Datatrue = { updateDate: updateDate, items_json };    
localStorage.setItem("Bundeslanddaten", JSON.stringify(Datatrue));

//console.log("dataOfflineBundesland", dataOfflineBundesland); 
}




//____OTHER FUNKTIONS____
//Keys umbenennen
function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
 }


//Umlaute ersetzen
function replaceUmlauts(value){
//value = value.replace(/\u00e4/g, 'ae');
value = value.replace(/\u00f6/g, 'oe');
value = value.replace(/\u00fc/g, 'ue');
value = value.replace(/\u00c4/g, 'Ae');
value = value.replace(/\u00d6/g, 'Oe');
value = value.replace(/\u00dc/g, 'Ue');
value = value.replace(/\u00df/g, 'ss');
return value;
}


//Umlaute einfügen
function makeUmlauts(value){
//value = value.replace(/\u00e4/g, 'ae');
// value = value.replace( /'oe'/g,'\u00f6');
value = value.replace( /'ue'/g,'\u00fc');
value = value.replace( /'Ae'/g,'\u00c4');
value = value.replace( /'Oe'/g,'\u00d6');
value = value.replace( /'Ue'/g,'\u00dc');
value = value.replace( /'ss'/g,'\u00df');
return value;
}

//EVA????
//Umlaute ersetzen
function replaceUmlautsB(value){
  //value = value.replace(/\u00e4/g, 'ae');
  // value = value.replace(/\u00f6/g, 'oe');
  value = value.replace(/\u00fc/g, 'ue');
  value = value.replace(/\u00c4/g, 'Ae');
  value = value.replace(/\u00d6/g, 'Oe');
  value = value.replace(/\u00dc/g, 'Ue');
  value = value.replace(/\u00df/g, 'ss');
  return value;
  }
  
  
//   //Umlaute einfügen
//   function makeUmlauts(value){
//   //value = value.replace(/\u00e4/g, 'ae');
//   // value = value.replace( /'oe'/g,'\u00f6');
//   value = value.replace( /'ue'/g,'\u00fc');
//   value = value.replace( /'Ae'/g,'\u00c4');
//   value = value.replace( /'Oe'/g,'\u00d6');
//   value = value.replace( /'Ue'/g,'\u00dc');
//   value = value.replace( /'ss'/g,'\u00df');
//   return value;
//   }
  
  







