//WICHTIG:  
//  Es ist jetzt so das man immer mit dem Lokal Gespeicherten Daten Arbeiten kann --> die sind im LocalStorage Gespeicherten
//  Das automatische Updaten der Daten zu implementieren macht erst Sinn wenn wir die Viz in die App einfügen.. vorher is es denk ich nur unnötiger Aufwand.

//  Also im Moment müssen die Daten noch manuell runtergeladen werden! 

//  Was du tun musst: 
//  -) Setz den pathbool auf true und refresh die Seite. Jetzt hast du die Files gedownloaded(Entwicklertools --> Application --> Storage --> Localstorage --> httP//...balabla)
//     Da siehst du jetzt die JSON Datei als "Data". Mit rechtsklick und Delete könnte man sie auch wieder manuell löschen! 
// -)  jetzt setzt du den pathbool wieder auf false damit du nichtmehr ständig auf den Server zugfreifst.
//     So erparrst du dir Ladezeiten und Probleme mit der Cors abfrage. 

// Also immer wenn du mit neuen Daten arbeiten möchtest: setzt einfach den pathbool kurz auf true :) 

//Enjoy :D 





//  const url = 'https://covid19-dashboard.ages.at/data/CovidFaelle_Timeline.csv';
// //  const corsFix = 'https://cors-anywhere.herokuapp.com/';
//  const corsFix = 'http://127.0.0.1:5500//cors-anywhere';


// let path = corsFix + url;
// let pathbool = true;

//let accessBool = false; //checkt of file online geladen werden soll, wenn true = AN
//let pathbool= false; 
let remoteData;
let getSpeicherDatum;

//Damit kannst du arbeiten --> Alle Werte der Datei
// let getDatum;
// let getBundesland;
// let getBundeslandID;
// let getAnzEinwohner;
// let getAnzahlFaelle;
// let getAnzahlFaelleSum;
// let getAnzahlFaelle7Tage;
// let getSiebenTageInzidenzFaelle;
// let getAnzahlTotTaeglich;
// let getAnzahlTotSum;
// let getAnzahlGeheiltTaeglich;
// let getAnzahlGeheiltSum;


// //Als Arrays gespeichert
// let getDatumArr=[];
// let getBundeslandArr=[];
// let getBundeslandIDArr=[];
// let getAnzEinwohnerArr=[];
// let getAnzahlFaelleArr=[];
// let getAnzahlFaelleSumArr=[];
// let getAnzahlFaelle7TageArr=[];
// let getSiebenTageInzidenzFaelleArr=[];
// let getAnzahlTotTaeglichArr=[];
// let getAnzahlTotSumArr=[];
// let getAnzahlGeheiltTaeglichArr=[];
// let getAnzahlGeheiltSumArr=[];







yourMainCode();
HardfactsBL();


//MainCode
function yourMainCode() {
  

  read_and_prepare_Bundeslanddata()
  


}//Ende yourMainCode

function HardfactsBL() {


  bl = localStorage.getItem("storeBundesland");
  i = dataOffline.length - 1; //richtiges Bundesland, letzter Eintrag??

  let AF_BL = 'tbc';
  let Neuerk_BL = dataOffline[i].AnzahlFaelle;
  let TT_BL = dataOffline[i].AnzahlTotTaeglich;

}








//Offline Daten auslesen = Daten vom Local Storage
function read_and_prepare_Bundeslanddata() {
  //DATEN
  var items_json = localStorage.getItem("Bundeslanddaten");
  if (items_json != null) { //check of es diese Daten im localstorage gibt
    //accessBool = false; 
    items = JSON.parse(items_json); //mit Speicherdatum 
    dataOffline = items.items_json; //Ohne Speicherdatum 
    getSpeicherDatum = items.updateDate; //SpeicherDatum

    //  console.log("Offline Items:" ,items); 
    //  console.log("Offline Daten:" ,dataOffline); 
    //  console.log("Die Daten wurden zuletzt im Local Storage gespeichert am (updateDate):" , getSpeicherDatum);

    for (i = 0; i < dataOffline.length; i++) {
      getDatum = dataOffline[i].datum;
      getBundesland = dataOffline[i].Bundesland;
      getBundeslandID = dataOffline[i].BundeslandID;
      getAnzEinwohner = dataOffline[i].AnzEinwohner;
      getAnzahlFaelle = dataOffline[i].AnzahlFaelle;
      getAnzahlFaelleSum = dataOffline[i].AnzahlFaelleSum;
      getAnzahlFaelle7Tage = dataOffline[i].AnzahlFaelle7Tage;
      getSiebenTageInzidenzFaelle = dataOffline[i].SiebenTageInzidenzFaelle;
      getAnzahlTotTaeglich = dataOffline[i].AnzahlTotTaeglich;
      getAnzahlTotSum = dataOffline[i].AnzahlTotSum;
      getAnzahlGeheiltTaeglich = dataOffline[i].AnzahlGeheiltTaeglich;
      getAnzahlGeheiltSum = dataOffline[i].AnzahlGeheiltSum;



      //Als Arrays gespeichert
      // getDatumArr.push(getDatum);
      // getBundeslandArr.push(getBundesland);
      // getBundeslandIDArr.push(getBundeslandID);
      // getAnzEinwohnerArr.push(getAnzEinwohner);
      // getAnzahlFaelleArr.push(getAnzahlFaelle);
      // getAnzahlFaelleSumArr.push(getAnzahlFaelleSum);
      // getAnzahlFaelle7TageArr.push(getAnzahlFaelle7Tage);
      // getSiebenTageInzidenzFaelleArr.push(getSiebenTageInzidenzFaelle);
      // getAnzahlTotTaeglichArr.push(getAnzahlTotTaeglich);
      // getAnzahlTotSumArr.push(getAnzahlTotSum);
      // getAnzahlGeheiltTaeglichArr.push(getAnzahlGeheiltTaeglich);
      // getAnzahlGeheiltSumArr.push(getAnzahlGeheiltSum);

    }

    // console.log('test');  
  } else {
    checkForUpdate();
  }

}

//"Time" zu "date"
function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

//Umlaute ersetzen
function replaceUmlauts(value) {
  value = value.replace(/\u00e4/g, 'ae');
  value = value.replace(/\u00f6/g, 'oe');
  value = value.replace(/\u00fc/g, 'ue');
  value = value.replace(/\u00c4/g, 'Ae');
  value = value.replace(/\u00d6/g, 'Oe');
  value = value.replace(/\u00dc/g, 'Ue');
  value = value.replace(/\u00df/g, 'ss');
  return value;
}






