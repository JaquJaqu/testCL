const urlBezirke3 = 'https://covid19-dashboard.ages.at/data/CovidFaelle_Timeline_GKZ.csv';
const corsFixBezirke3 = 'https://evening-reaches-25236.herokuapp.com/'; //eigener Proxy
//const corsFixBezirke3 = 'https://cors-anywhere.herokuapp.com/';
          
          
let pathBezirke3 = corsFixBezirke3 + urlBezirke3;
let alleBezirksDaten2 = []; 
var allItems;  
let eTagResponseBezirke3;
let eTagLocalBezirkdaten;
let items_jsonBezirke3;
var ETagBezirksdataDatabaseLS;


let remoteData3;
var db;
let testbool = true; // "Internet connection"


const BezirksDaten = alleBezirksDaten2;
let AktiveFaelleMeinBez;

var meineDatenAAF = []; //Alle Aktive Fälle jedes Datums des Gewählten Bezirks
var meineDatenAEW = [];
var meineDatenAF = [];
var meineDatenAFSiebenT = [];
var meineDatenAFS = [];
var meineDatenAGS = [];
var meineDatenAGT = [];
var meineDatenATS = [];
var meineDatenATT = [];
var meineDatenSTI = [];
var meineDatenDatum = [];
let eTagBezirke;



let AnzahlAktiveFaelle;
let getAktiveFaelle; //Anzahl der derzeit Aktiven Fälle des gewählten Bezirks
//let getAktiveFaelle;

let dataBez;
let updatebool = false;
let databasebool;
 
let farbkreisValue;



//___START INITIALISATION______
yourMainCode3(remoteData3);


//___________MAIN CODE___________________________________________________
function yourMainCode3(remoteData3) {
 
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


   var db; 
   var request = window.indexedDB.open("alleBezirksDaten",1);          

  
//ON SUCCESS
  request.onsuccess = function(event) {
        db = event.target.result;
        //console.log("success: "+ db);

        // console.log("ETagBezirksdataDatabaseLS", ETagBezirksdataDatabaseLS);
        // console.log("eTagResponseBezirke3", eTagResponseBezirke3);

    if(ETagBezirksdataDatabaseLS != null || ETagBezirksdataDatabaseLS == eTagResponseBezirke3){
    // CHANGE
    databasebool = true;
    //console.log("DB VORHANDEN");
      }else{
    databasebool = false; 
    //console.log("DB muss erst erstellt werden, nimm Daten einstweil vom LS");
  }
    
  
  //Add --> Daten zu objectStore"bezirksdaten" hinzugügen
  if (!db.objectStoreNames.contains('bezirksdaten') || db.objectStoreNames.contains('bezirksdaten') == null || db.objectStoreNames.contains('bezirksdaten') == undefined) {
          //console.log("storage wird erzeugt");  
          add();
          setAktiveFaelleMeinBezirk();
  //Update
  }else if(db.objectStoreNames.contains('bezirksdaten') && ETagBezirksdataDatabaseLS != eTagResponseBezirke3){
      clearOS();    
      updateDB();
      //console.log("storage wird geupdated");
    } 
  }
  
  
//ON ERROR
     request.onerror = function(event) {   
        console.error("Database error: " + event.target.errorCode);
        };


     
     request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("bezirksdaten", {autoIncrement : true });
        //check Aktualität der Daten
        checkETagBezirksDatabase(pathBezirke3);
        //objectStore.createIndex("id", "id", { unique: true, multiEntry: true });
  };




//---PREPARE DATA--------------propably useless?
        const stringReplace = JSON.stringify(remoteData3);
        const jsonReplace = stringReplace;
        let realData;
        if(jsonReplace != null){
        realData = JSON.parse(jsonReplace);
        items_jsonBezirke3 = realData;  
        }           
//         

//______END MAIN CODE_____________________



//***________DATABASE FUNCTIONS_______***
//__GENERAL FUNCTIONS_______________


//Aktualität checken1
function checkETagBezirksDatabase(pathBezirke3){  
  //wenn es eine Internetverbindung ist und dder online zugriff auf die Ampeldaten gestattet dann
   var client = new XMLHttpRequest(); //mach eine Verbindung zur Resource
   try{
   client.open("GET", pathBezirke3, true);
   client.send();
    client.onreadystatechange = function () {
     if (this.readyState == this.HEADERS_RECEIVED) {//gibt mir alle Headers von allen Requests aus
       eTagResponseBezirke3 = client.getResponseHeader("ETag");
       checkBezirksdataDatabase();
       //console.log("HAAAAALLLOOOO");
      //  console.log("eTagResponseBezirke3", eTagResponseBezirke3);
       }      
    } 
    //console.log("Du bist hier");
   }catch(error){
     console.error(error);
     }
   }


   function setAktiveFaelleMeinBezirk(){

    for (i = 0; i < items_jsonBezirke3.length; i ++){
      const obj = items_jsonBezirke3[i];
    const newKeys = { Time: "datum"}; //wenn geändert wird dann unten auch! 
      const renamedObj = renameKeys(obj, newKeys);
      items_jsonBezirke3[i] = renamedObj;

let storeBezirk = sessionStorage.getItem("storeBezirk");


		if(storeBezirk == items_jsonBezirke3[i].Bezirk){

        var fulldatesofitems = items_jsonBezirke3[i].datum; 
        var dateofitems = fulldatesofitems.split(" ");
        var dateofitem = dateofitems[0]; 
        items_jsonBezirke3[i].datum = dateofitem; 
        itemsstoreBezirk = items_jsonBezirke3[i];
                  
        //Anzahl Aktive Fälle berechnen
        let AnzahlFaelleSum = itemsstoreBezirk.AnzahlFaelleSum;
        let AnzahlGeheiltSum = itemsstoreBezirk.AnzahlGeheiltSum;
        let AnzahlTotSum = itemsstoreBezirk.AnzahlTotSum;
        AktiveFaellestoreBezirk = AnzahlFaelleSum - AnzahlGeheiltSum - AnzahlTotSum;

        //Speicherdatum
        var date = new Date();
        var updateDatestoreBezirk = date.toGMTString(); 
        var DatatruestoreBezirk = {AnzahlAktiveFaelle: AktiveFaellestoreBezirk, Standort: storeBezirk, updateDate: updateDatestoreBezirk};    
        localStorage.setItem("AktiveFaellestoreBezirk", JSON.stringify(DatatruestoreBezirk));

		} 
	}
}

// function getAktiveFaelleMeinBezirk(){

// 	if(localStorage.getItem("AktiveFaellestoreBezirk") != null){
// 		var savedAktiveFaelleMeinBezirk = localStorage.getItem("AktiveFaellestoreBezirk");
// 		document.getElementById("farbkreisAktiv").innerHTML = JSON.parse(savedAktiveFaelleMeinBezirk).AnzahlAktiveFaelle;
		
// 	}
// }












  //Aktualität checken2
function checkBezirksdataDatabase(){
  //localStorage.setItem("ETagBezirksdatenDatabase",eTagResponseBezirke3 + "TEST");
  ETagBezirksdataDatabaseLS = localStorage.getItem("ETagBezirksdatenDatabase");

 

  //console.log("ETagBezirksdataDatabaseLS", ETagBezirksdataDatabaseLS);
  //console.log("eTagResponseBezirke3", eTagResponseBezirke3);


  //Wenn Etag im LS oder verändert dann download und verwende LS Daten für AktiveFaelle
if(ETagBezirksdataDatabaseLS == null || ETagBezirksdataDatabaseLS != eTagResponseBezirke3){
  databasebool = false;
  downloadFile2(pathBezirke3);
  // localStorage.setItem("ETagBezirksdatenDatabase",eTagResponseBezirke3 + "TEST");
  localStorage.setItem("ETagBezirksdatenDatabase",eTagResponseBezirke3);

  // console.log("Kein ETag der Bezirksdaten im LS, ETag wird hinzugefügt, Daten werden gedownloaded");
  // console.log("ETagBezirksdataDatabaseLS", ETagBezirksdataDatabaseLS);
  // console.log("eTagResponseBezirke3", eTagResponseBezirke3);
  databasebool = true; //Danach verwende wieder die DB Daten

}else if (ETagBezirksdataDatabaseLS == eTagResponseBezirke3){
  databasebool = true;
  //console.log("ETag der Bezirksdaten im LS ist up-to-date")
}
}


function downloadFile2(pathBezirke3) {
  Papa.parse(pathBezirke3, {
    download: true,
    header: true,
    complete: function (results, file) {
        //console.log('Completed loading the file...');
         // Here starts your real code with this function
        yourMainCode3(results.data);  
        
         dataBez = results.data;
          //console.log("results.data",results.data);
   return dataBez; 
  },
  }); 
}



function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
 }


 if(realData != null){
//Key umbenennen --> Time zu datum
        for (i = 0; i < realData.length; i ++){
        const obj = items_jsonBezirke3[i];
        const newKeys = { Time: "datum"}; //wenn geändert wird dann unten auch! 
        const renamedObj = renameKeys(obj, newKeys);
        items_jsonBezirke3[i] = renamedObj;

        var fulldatesofitems = items_jsonBezirke3[i].datum; //auch hier schon "datum"!!!!!
        var dateofitems = fulldatesofitems.split(" ");
        var dateofitem = dateofitems[0]; //[0] = Datum| [1] = 00:00:00
        items_jsonBezirke3[i].datum = dateofitem; //Erstetzen des Datum + Urzeit String durch neuen "date" - String
        allItems = items_jsonBezirke3[i];
                  
        //Anzahl Aktive Fälle berechnen
        let AnzahlFaelleSum = allItems.AnzahlFaelleSum;
        let AnzahlGeheiltSum = allItems.AnzahlGeheiltSum;
        let AnzahlTotSum = allItems.AnzahlTotSum;
        

        AnzahlAktiveFaelle = AnzahlFaelleSum - AnzahlGeheiltSum - AnzahlTotSum;

        //Speicherdatum
        var date = new Date();//var updateDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
        var updateDate = date.toGMTString(); // Tue, 17 Nov 2020 14:16:29 GMT --> Gibt mir die jetzige Uhrzeit im Format das lastModiefied Header Request auch hat
        var Datatrue = {AnzahlAktiveFaelle: AnzahlAktiveFaelle, updateDate: updateDate,  allItems};    
         alleBezirksDaten2.push(Datatrue);
    }
  }
      
    
    


//______INDEXEDDB_SPECIFIC_FUNCTIONS___________
function add(){
  var db = event.target.result;
  var transaction = db.transaction(["bezirksdaten"], "readwrite");
  var objectStore = db.objectStore("bezirksdaten");
  //var objectStore2 = objectStore.createIndex("id", "id", { unique: true, multiEntry: true });

  transaction.oncomplete = function(event) {
    // console.log("All done!");
    //console.log("IT HAPPENED");

  };
  
  transaction.onerror = function(event) {
    console.log('Error :(');
  };
  
  //Daten hinzufügen  
 var request = BezirksDaten.forEach(function(bezirksdaten) {
     transaction.db.objectStore("bezirksdaten").put(bezirksdaten);
      request.onsuccess = function(event) {
    };
  });
}

//Daten ersetzen/erneuern
function updateDB(){
	var db = event.target.result;
	var transaction = db.transaction(["bezirksdaten"], "readwrite");
  transaction.oncomplete = function(event) {
	//console.log("All done!");
	};

	transaction.onerror = function(event) {
	  // Don't forget to handle errors!
	};
	
	var objectStore = transaction.objectStore("bezirksdaten");
	BezirksDaten.forEach(function(bezirksdaten) {
    //objectStore.clear();
	  var request = objectStore.put(bezirksdaten);
	  request.onsuccess = function(event) {
		// event.target.result === customer.ssn;
	  };
	});
  }



function clearOS(){
  var db = event.target.result;
  var transaction = db.transaction(["bezirksdaten"], "readwrite");

  transaction.oncomplete = function(event) {
  //console.log("All done!");
  };
  
  transaction.onerror = function(event) {
    // Don't forget to handle errors!
  };
  
  var objectStore = transaction.objectStore("bezirksdaten");
  objectStore.clear();
}


}//___________________________________________END MAIN CODE_____________________________________________




// function getETagBezirkdatenLocal(){
  //   if(localStorage.getItem("ETagBezirkdaten") != null){
  //     var savedETag = localStorage.getItem("ETagBezirkdaten");
  //     eTagLocalBezirkdaten = savedETag;
  //     var eTagsplit2 = savedETag.split('"');
  //     var eTagsplit = eTagsplit2[3].split('zip');
  //     var firstHalf = eTagsplit[0]; //[0] = Datum| [1] = 00:00:00
  //     var secondHalf = eTagsplit[0]; //[0] = Datum| [1] = 00:00:00
  //     eTagBezirke = '"'+secondHalf+'zip"';
  //     }
  //   }