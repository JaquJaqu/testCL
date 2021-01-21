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


//let remoteData3;
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


//checkETagBezirksDatabase(pathBezirke3);
//___START INITIALISATION______
yourMainCode3(items_jsonBezirke3);


//___________MAIN CODE___________________________________________________
function yourMainCode3(items_jsonBezirke3) {
 
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
  
 var upgradebool = false;
   
//ON SUCCESS
  request.onsuccess = function(event) { 
    var db = event.target.result;
       //Wenn es das OS "bezirksdaten" gibt dann schau mir ob es Daten hat
       var transaction = db.transaction(['bezirksdaten'], 'readwrite');
       var objectStore = transaction.objectStore('bezirksdaten');
       var countRequest = objectStore.count();
       
//kennt der wenn upgrade ned needet is die daten überhaupt???
//console.log('ETagBezirksdataDatabaseLS')
       //checkETagBezirksDatabase(pathBezirke3);


    //  console.log("upgradebool", upgradebool);
    //  if(upgradebool == false){
    //   checkETagBezirksDatabase(pathBezirke3);
    //  }
    //  else if(upgradebool == true){
      
    //  }
      //  countRequest.onsuccess = function() {
      //    console.log(countRequest.result); 
      //    if(countRequest.result == 0 ){
      //      databaseCompletebool = false;  
      //    }  
     
      //  };

      //  if(databaseCompletebool ==false){
      //   checkETagBezirksDatabase(pathBezirke3);
      //  }

    //Funkt doch noch nicht.. checken ob daten da sind! 
    //checkETagBezirksDatabase(pathBezirke3); //wenn localEtag anders is dann funkt das ! Funkt nur wenn beim ersten start auskommentier?????
    //FUNKTIONIERT TROTZDEM! warum? --> sobald die Daten anders sind werden sie ersetzt. wie check ich das? --> ich lösche mit der Hand
    //Einen wert aus der DB und den Etag aus dem LS! 
    //KAnn auch so checken ob ObjectStore leer ist! Wenn keine Daten und Etag nicht im speicher --> neu la
    // Dann refresh --> Key steigt, gelöschter Wert ist wieder da! 
        db = event.target.result;
        //console.log("success: "+ db);
        console.log("eTagResponseBezirke3ggggggggggg",eTagResponseBezirke3);
    
    
  
  //Add --> Daten zu objectStore"bezirksdaten" hinzugügen
  if (!db.objectStoreNames.contains('bezirksdaten') || db.objectStoreNames.contains('bezirksdaten') == null || db.objectStoreNames.contains('bezirksdaten') == undefined) {
          //console.log("storage wird erzeugt");  
          //console.log("hier1");
          add();
          
  //Update
  }else if(db.objectStoreNames.contains('bezirksdaten') && ETagBezirksdataDatabaseLS != eTagResponseBezirke3 || ETagBezirksdataDatabaseLS != eTagResponseBezirke3 || upgradebool == true){
      clearOS();    
      updateDB();
      //console.log("storage wird geupdated");
    } 
  }
  
  
//ON ERROR
     request.onerror = function(event) {   
        //console.error("Database error: " + event.target.errorCode);
        };


     
     request.onupgradeneeded = function(event) {
        var db = event.target.result;
        //console.log("eTagResponseBezirke3ffff",eTagResponseBezirke3);
        var objectStore = db.createObjectStore("bezirksdaten", {autoIncrement : true });
        //check Aktualität der Daten
        //console.log("UPgradeneeded!");
        checkETagBezirksDatabase(pathBezirke3);
         upgradebool = true;
        //ETAg nur da checken,danach kennt ers im onsucces, onsuccess kommt später!
        //objectStore.createIndex("id", "id", { unique: true, multiEntry: true });
  };






      
    
    


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
    //console.log('Error :(');
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



//---PREPARE DATA--------------propably useless?
        // const stringReplace = JSON.stringify(remoteData3);
        
        // const jsonReplace = stringReplace;
        // const realData = JSON.parse(jsonReplace);
        // items_jsonBezirke3 = realData; 
        // console.log("realData",realData); 
        // console.log("hello2");  

//         

//______END MAIN CODE_____________________



//***________DATABASE FUNCTIONS_______***
//__GENERAL FUNCTIONS_______________


//Aktualität checken1
function checkETagBezirksDatabase(pathBezirke3){  
  //console.log("hello3");
  //wenn es eine Internetverbindung ist und dder online zugriff auf die Ampeldaten gestattet dann
   var client = new XMLHttpRequest(); //mach eine Verbindung zur Resource
   try{
   client.open("GET", pathBezirke3, true);
   client.send();
    client.onreadystatechange = function () {
     if (this.readyState == this.HEADERS_RECEIVED) {//gibt mir alle Headers von allen Requests aus
       eTagResponseBezirke3 = client.getResponseHeader("ETag");
         
  ETagBezirksdataDatabaseLS = localStorage.getItem("ETagBezirksdatenDatabase");

 

  //console.log("ETagBezirksdataDatabaseLS", ETagBezirksdataDatabaseLS);
  //console.log("eTagResponseBezirke3", eTagResponseBezirke3);


  //Wenn Etag im LS oder verändert dann download und verwende LS Daten für AktiveFaelle
if(ETagBezirksdataDatabaseLS == null || ETagBezirksdataDatabaseLS != eTagResponseBezirke3){
  databasebool = false;
  downloadFile2(pathBezirke3);
  // localStorage.setItem("ETagBezirksdatenDatabase",eTagResponseBezirke3 + "TEST");
  //localStorage.setItem("ETagBezirksdatenDatabase",eTagResponseBezirke3);
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
    } 
    //console.log("Du bist hier");
   }catch(error){
     //console.error(error);
     }
   }

   



function downloadFile2(pathBezirke3) {
  //console.log("hello4");
  Papa.parse(pathBezirke3, {
    download: true,
    header: true,
    complete: function (results, ) {
      //Key umbenennen --> Time zu datum
     // console.log("hello2",results.data.length);
      items_jsonBezirke3 = results.data;
      for (i = 0; i < results.data.length; i ++){

      const obj = items_jsonBezirke3[i];
      let newKeys = { Time: "datum"}; //wenn geändert wird dann unten auch! 
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
        //console.log('Completed loading the file...');
         // Here starts your real code with this function
        yourMainCode3(results.data);  
        
        items_jsonBezirke3 = results.data;
       // console.log("items_jsonBezirke3",items_jsonBezirke3);
        return dataBez; 
  },
  }); 
}



function renameKeys(obj, newKeys) {
 // console.log("hello5");
  let keyValues = Object.keys(obj).map(key => {
    let newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
 }



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