
// const arrBezirk = [];
// let alleMeineDatenBezLS2;
// let alleMeineDatenOfflineBez2;
// let getAktiveFaelleBez;
// let getNeuerkrankungenBez;
// let getTodesfaelleBez;
// let meineDatenATSBez = [];
// let meineDatenAAFBez = [];


getAkkordeon_dash();




const urlBezirke4 = 'https://covid19-dashboard.ages.at/data/CovidFaelle_Timeline_GKZ.csv';
//const corsFixBezirke2 = 'https://evening-reaches-25236.herokuapp.com/';
const corsFixBezirke4 = 'https://evening-reaches-25236.herokuapp.com/';
let pathBezirke4 = corsFixBezirke2 + urlBezirke2;

downloadBezirksFile4(pathBezirke4);



//Bezirksfile Download
function downloadBezirksFile4(pathBezirke4) {
 // if(connBool ==true){
  //console.log("Bezirksfile wird gedownloaded");
  Papa.parse(pathBezirke4, {
    download: true,
    header: true,
    complete: function (results, file) {
      //console.log("data", results.data);
        console.log('Completed loading the file...');
         // Here starts your real code with this function
         //preprareBezirksData(results.data); 
         dataOfflineBez4 = results.data;   
         prepareBezirksData4(dataOfflineBez4);   
          },
  }); 
 //}
}


function prepareBezirksData4(pathBezirke4){
  const stringReplace = JSON.stringify(pathBezirke4);
  const jsonReplace = stringReplace;
  const realData = JSON.parse(jsonReplace);
  items_jsonBezirke4 = realData; 
  


  for (i = 0; i < items_jsonBezirke4.length; i ++){
    const obj = items_jsonBezirke4[i];
    const newKeys = { Time: "datum"}; //wenn geändert wird dann unten auch! 
    const renamedObj = renameKeys(obj, newKeys);
    items_jsonBezirke4[i] = renamedObj;    

bezirk = localStorage.getItem("letzterBezirk"); 

    // console.log("bezirk", bezirk);
    // console.log("items_jsonBezirke4[i].Bezirk", items_jsonBezirke4[i].Bezirk);

  if(bezirk == items_jsonBezirke4[i].Bezirk){

      var fulldatesofitems4 = items_jsonBezirke4[i].datum; 
      var dateofitems4 = fulldatesofitems4.split(" ");
      var dateofitem4 = dateofitems4[0]; 
      items_jsonBezirke4[i].datum = dateofitem4; 
      itemsstoreBezirk4 = items_jsonBezirke4[i];
                
      //Anzahl Aktive Fälle berechnen
      let AnzahlFaelleSum = itemsstoreBezirk4.AnzahlFaelleSum;
      let AnzahlGeheiltSum = itemsstoreBezirk4.AnzahlGeheiltSum;
      let AnzahlTotSum = itemsstoreBezirk4.AnzahlTotSum;
      AktiveFaellestoreBezirk = AnzahlFaelleSum - AnzahlGeheiltSum - AnzahlTotSum;





     
      // //Anzahl Neuerkrankungen
      Neuerkrankungen = items_jsonBezirke4[i].AnzahlFaelle;
      //console.log("AnzahlFaelleSum", AnzahlFaelleSum);
      //console.log("Neuerkrankungen", Neuerkrankungen);

       // //Anzahl Todesfälle
       Todesfaelle = items_jsonBezirke4[i].AnzahlTotTaeglich;
       //console.log("AnzahlFaelleSum", AnzahlFaelleSum);
      //console.log("Todesfaelle", Todesfaelle);


      document.getElementById("hfBez_aktF").innerHTML = "<div class = 'hardfacts'>" + AktiveFaellestoreBezirk + "</div";
      document.getElementById("hfBez_Neuerk").innerHTML = "<div class = 'hardfacts'>" + Neuerkrankungen + "</div";
      document.getElementById("hfBez_TTBez").innerHTML = "<div class = 'hardfacts'>" + Todesfaelle + "</div";
    


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


//localStorage.setItem("AktiveFaelle", AktiveFaellestoreBezirk);
//HIER

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


}



