
const arrBezirk = [];
let alleMeineDatenBezLS2;
let alleMeineDatenOfflineBez2;
let getAktiveFaelleBez;
let getNeuerkrankungenBez;
let getTodesfaelleBez;
let meineDatenATSBez = [];
let meineDatenAAFBez = [];


getAkkordeon_dash();
databaseBez();

//_________DB STUFF_____________________________________
//______ALLE WERTE BERECHNEN
//DB ZUGRIFF___Um die Daten von der Indexxeddb zu bekommen!
function databaseBez() {
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
  request = window.indexedDB.open("alleBezirksDaten", 1);

  //ON SUCCESS
  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("success: " + db);
    //Wenn verbindung aufgebaut werden kann dann gib mit die Daten aus der DB --> "Start"
    getOfflineBezDatenBez();
  }

  //ON ERROR
  request.onerror = function (event) {
    console.error("Database error: " + event.target.errorCode);
  };
  //ON UPRADE
  request.onupgradeneeded = function (event) {
    var db = event.target.result;

  };
}




function getOfflineBezDatenBez() {
  databaseBez();
  getmeineDatenFunktionBez();
}

//Gib mir die Daten aus der DB
function getmeineDatenFunktionBez() {
  db = event.target.result;
  try {
    var transaction = db.transaction(["bezirksdaten"], "readwrite");
    var objectStore = transaction.objectStore("bezirksdaten");
    //console.log(transaction);
    //console.log(objectStore);
    transaction.oncomplete = function (event) {
      //console.log("All done!");
    }
  } catch {

  };

  transaction.onerror = function (event) {
    console.log("ERROR!");
  };

  request.onsuccess = function (event) {
  };


  var itemsRequest = objectStore.getAll();
  itemsRequest.onsuccess = function (alleMeineDatenBezLS2) {
    alleMeineDatenOfflineBez2 = itemsRequest.result;

    //console.log("Alle BEzirksdaten auf Bezirksseite offline", alleMeineDatenOfflineBez2);
    //console.log("objectStore", objectStore);
    alleMeineDatenBezLS2 = alleMeineDatenOfflineBez2;
    //console.log("alleMeineDaten offline2", alleMeineDatenOfflineBez2);
    preparemeineDatenBez(alleMeineDatenOfflineBez2);
  }
  itemsRequest.oncomplete = function () {
    alleMeineDatenOfflineBez2 = itemsRequest.result;
    //console.log("alleMeineDaten offline2", alleMeineDatenOfflineBez2);
    preparemeineDatenBez(alleMeineDatenOfflineBez2);
  }
}






//Nimm die gespeicherten Daten und gib mit Pro Parameter und Gewählten Bezirk das jeweilige Array mit allen Daten der bisherigen Zeitspanne! 
//Such dir aus was du brauchst.. :) 
function preparemeineDatenBez(alleMeineDatenOfflineBez2) {
  //console.log("HALLO1");
  //console.log(alleMeineDatenOfflineBez2[3].allItems.Bezirk);

  for (i = 0; i < alleMeineDatenOfflineBez2.length; i++) {
    makeUmlauts(alleMeineDatenOfflineBez2[i].allItems.Bezirk);
    //console.log("HALLO2");
    bezirk = localStorage.getItem("letzterBezirk");
    if (alleMeineDatenOfflineBez2[i].allItems.Bezirk == bezirk) {
      //console.log("HALLO3");

      //Auslastung: Bundesländer/österreich immer nur aktueller tag

      //ARRAYS ALLER DATEN DES GEWÄHLTEN BEZIRKS (das vor .push sind die Arrays) (siehe globale deklaration)
      var alleMeineAAFBez = alleMeineDatenOfflineBez2[i].AnzahlAktiveFaelle;
      //console.log("alleMeineAAFBez", alleMeineAAFBez);

      meineDatenAAFBez.push(alleMeineAAFBez);

      //console.log('meineDatenAAF', meineDatenAAF);

      // var alleMeineAEW = alleMeineDatenOfflineBez[i].allItems.AnzEinwohner;
      // meineDatenAEW.push(alleMeineAEW);

      var alleMeineAF = alleMeineDatenOfflineBez2[i].allItems.AnzahlFaelle;
      meineDatenAF.push(alleMeineAF);

      // var alleMeineAFSiebenT = alleMeineDatenOfflineBez[i].allItems.AnzahlFaelle7Tage;
      // meineDatenAFSiebenT.push(alleMeineAFSiebenT);

      // var alleMeineAFS = alleMeineDatenOfflineBez[i].allItems.AnzahlFaelleSum;
      // meineDatenAFS.push(alleMeineAFS);

      // var alleMeineAGS = alleMeineDatenOfflineBez[i].allItems.AnzahlGeheiltSum;
      // meineDatenAGS.push(alleMeineAGS);

      // var alleMeineAGT = alleMeineDatenOfflineBez[i].allItems.AnzahlGeheiltTaeglich;
      // meineDatenAGT.push(alleMeineAGT);

      var alleMeineATSBez = alleMeineDatenOfflineBez2[i].allItems.AnzahlTotSum;
      meineDatenATSBez.push(alleMeineATSBez);

      var alleMeineATT = alleMeineDatenOfflineBez2[i].allItems.AnzahlTotTaeglich;
      meineDatenATT.push(alleMeineATT);

      // var alleMeineSTI = alleMeineDatenOfflineBez[i].allItems.SiebenTageInzidenzFaelle;
      // meineDatenSTI.push(alleMeineSTI);

      // var alleMeineDatum = alleMeineDatenOfflineBez[i].allItems.datum;
      // meineDatenDatum.push(alleMeineDatum);

    }
  }

  //console.log("meineDatenATS", meineDatenATSBez);
  //console.log("meineDatenDatum",alleMeineDatum);

  //Letzter Wert des Arrays für die gerade aktiven Faelle
  var IndexlastElementAAFBez = meineDatenAAFBez.length - 1;
  // console.log("IndexlastElementAAF", IndexlastElementAAFBez);
  // console.log("letzter Wert Aktive Fälle:", meineDatenAAFBez[IndexlastElementAAFBez]);
  getAktiveFaelleBez = meineDatenAAFBez[IndexlastElementAAFBez];

  var IndexlastElementNeuerkBez = meineDatenAF.length - 1;
  // console.log("IndexlastElementNeu", IndexlastElementNeuerkBez);
  // console.log("letzter Wert Neuerk:", meineDatenAF[IndexlastElementNeuerkBez]);
  getNeuerkrankungenBez = meineDatenAF[IndexlastElementNeuerkBez]

  var IndexlastElementTTBez = meineDatenATT.length - 1;
  // console.log("IndexlastElementNeu", IndexlastElementTTBez);
  // console.log("letzter Wert Tot:", meineDatenATT[IndexlastElementTTBez]);
  getTodesfaelleBez = meineDatenATT[IndexlastElementTTBez]

  //document.getElementById("farbkreisAktiv").innerHTML = getAktiveFaelle;
  //console.log("DATABASEFUNKT! - die Daten werden aus der DB genommen", databasebool, getAktiveFaelleBez);
  localStorage.setItem("AktiveFaelle", getAktiveFaelleBez);
  setHardfacts();

}

function setHardfacts() {
  //HARDFACTS
  document.getElementById("hfBez_aktF").innerHTML = "<div class = 'hardfacts'>" + getAktiveFaelleBez + "</div";
  document.getElementById("hfBez_Neuerk").innerHTML = "<div class = 'hardfacts'>" + getNeuerkrankungenBez + "</div";
  document.getElementById("hfBez_TTBez").innerHTML = "<div class = 'hardfacts'>" + getTodesfaelleBez + "</div";


}

//_________DB STUFF ENDE______________________

function onload_bezirk() {
  if (localStorage.getItem("letzterBezirk") == null) {
    document.getElementById("dash_bezirk_name").innerHTML = bezirk;
  }
  else if (localStorage.getItem("storeBezirk") != null) {
    document.getElementById("dash_bezirk_name").innerHTML = localStorage.getItem("letzterBezirk");
  }
}

function myFunction_bezirk() {
  document.getElementById("myDropdown_bezirk").classList.toggle("show");
}

loadJSON("bundesland_dropdown.json", function (data) {
  for (i = 0; i < data[0].Bezirke.length; i++) {
    arrBezirk.push(data[0].Bezirke[i].Bezirk);
  }
  for (i = 0; i < arrBezirk.length; i++) {
    dropdownContent = document.getElementById('myDropdown_bezirk');
    htmlToAppend = document.createElement('LI');

    htmlToAppend.setAttribute('onclick', 'changeText_bezirk(this)');
    textnode = document.createTextNode(arrBezirk[i]);
    htmlToAppend.appendChild(textnode);
    htmlToAppend.setAttribute('value', arrBezirk[i]);
    dropdownContent.appendChild(htmlToAppend);

  }
  sortListDir("myDropdown_bezirk");

}, function (xhr) { console.error(xhr); });

function changeText_bezirk(elm) {
  bezirk = elm.getAttribute('value');
  myFunction_bezirk();
  document.getElementById("dropbtn_bezirk").innerHTML = bezirk;
  //localStorage.setItem("letzterBezirkBezDash",bezirk);
  localStorage.setItem("letzterBezirk", bezirk);

  setHardfacts()
}



