// TO DO: 
// letztes Datum auswählen CHECK
// richtiges Bundesland auswählen CHECK
// richtige Quelle einbinden CHECK


const urlAusl = 'https://covid19-dashboard.ages.at/data/CovidFallzahlen.csv';
//const corsFix = 'https://cors-anywhere.herokuapp.com/';

//deiner
// const corsFixAusl = 'https://sheltered-scrubland-89578.herokuapp.com/';

//const corsFix = 'https://evening-reaches-25236.herokuapp.com/';



let path = corsFix + urlAusl;
let pathbool = true;

let remoteDataAusl;
let getSpeicherDatumAusl;
let dataOfflineAusl;

let getMeldedat;
let getTestGesamt;
let getMeldedatum;
let getFZHosp;
let getFZICU;
let getFZHospFree;
let getFZICUFree;
let getBundeslandID;
let getBundesland;


var dataset;


downloadFileAusl(path);

//dataset = results.data;
//yourMainCode(remoteData);
//dataset = results.data;


//MainCode
function yourMainCodeAusl(remoteDataAusl) {

    read_from_local_storage();
    //console.log("Array Example:", getMeldedat);

    // console.log("Offline Daten2:" , dataOffline);   GEHT A NED 



    const stringReplace = JSON.stringify(remoteDataAusl);
    // const realData = JSON.parse(stringReplace);
    let items_json = stringReplace;


    //Speichern der Daten im Lokal Storage + Speicherdatum dazu fügen (im GMT Format)
    var date = new Date();//var updateDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
    var updateDate = date.toGMTString(); // Tue, 17 Nov 2020 14:16:29 GMT --> Gibt mir die jetzige Uhrzeit im Format das lastModiefied Header Request auch hat
    var Datatrue = { updateDate: updateDate, items_json };
    localStorage.setItem("Data", JSON.stringify(Datatrue));


    // console.log("TEST 2 (außen):  ", dataset); // ist außerhalb der downloadFile Funktion "undefined"
    //console.log("TEST 2 (außen):  ", items_json); // Kann ich auch mit dem arbeiten?????
    // console.log("remoteData: ", remoteData);
    // console.log("items_json: ", items_json);

    //dataset = items_json;

    async function drawAuslastung(region) {

        // const dataset = await d3.json('./CovidFallzahlen.json');   //https://covid19-dashboard.ages.at/data/CovidFallzahlen.csv

        const reversed = dataset.reverse();  // Reihenfolge der Datensätze werden umgekehrt  (https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
        var removed = dataset.splice(10); // alle Elemente nach dem 10. Index werden gelöscht  (https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
        // Datensatz besteht nun nur noch aus 10 Einträgen == letztes Datum
        // jedes Bundesland hat einen Datensatz + ein Datenzsatz für Österreich

        // dataset[0] //Österreich ID 10
        // dataset[1] //Wien ID 9
        // dataset[2] //Vorarlberg ID 8
        // dataset[3] //Tirol ID 7
        // dataset[4] //Steiermark ID 6
        // dataset[5] //Salzburg ID 5
        // dataset[6] //Oberösterreich ID 
        // dataset[7] //Niederösterreich ID 3
        // dataset[8] //Kärnten ID 2
        // dataset[9] //Burgenland ID 1

        var auswahl = region;


        if (auswahl == 1) {
            ////ÖSTERREICH
            dataset.splice(1);

        } else if (auswahl == 2) {
            ////WIEN
            dataset.splice(2);
            dataset.splice(0, 1);

        } else if (auswahl == 3) {
            ////VORARLBERG
            dataset.splice(3);
            dataset.splice(0, 2);

        } else if (auswahl == 4) {
            ////TIROL
            dataset.splice(4);
            dataset.splice(0, 3);

        } else if (auswahl == 5) {
            ////STEIERMARK
            dataset.splice(5);
            dataset.splice(0, 4);

        } else if (auswahl == 6) {
            ////SALZBURG
            dataset.splice(6);
            dataset.splice(0, 5);

        } else if (auswahl == 7) {
            ////OBERÖSTERREICH
            dataset.splice(7);
            dataset.splice(0, 6);

        } else if (auswahl == 8) {
            ////NIEDERÖSTERREICH
            dataset.splice(8);
            dataset.splice(0, 7);

        } else if (auswahl == 9) {
            ////KÄRNTEN
            dataset.splice(9);
            dataset.splice(0, 8);

        } else if (auswahl == 10) {
            ////BURGENLAND
            dataset.splice(10);
            dataset.splice(0, 9);
        }



        // console.log("richtige Daten: ", dataset);



        const width = 400;
        const height = 400;
        const barPadding = 200;
        const abstandErsterText = 35;
        const abstandProzentLabels = 20;
        const lineHeight = 30;
        const abstandProzentLabelsBig = 50;
        const barHeight = height / 8;


        let dimensions = {
            width: width,
            height: height,
            margin: {
                top: 0,
                right: 10,
                bottom: 50,
                left: 50
            }
        };

        dimensions.boundedW = dimensions.width - dimensions.margin.left - dimensions.margin.right;
        dimensions.boundedH = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

        const wrapper = d3.select('#wrapper')
            .append('svg')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height);



        /// BERECHNUNG der Länge der Rechtecke: BoundedW * %-Anteil //////////////////////////////////////

        const FZHospPercent = d => dimensions.boundedW * ((d.FZHosp / d3.sum([d.FZHosp, d.FZHospFree])));
        const FZHospFreePercent = d => dimensions.boundedW * ((d.FZHospFree / d3.sum([d.FZHosp, d.FZHospFree])));

        // console.log("FZHospFreePercent :", FZHospFreePercent);

        const FZICUPercent = d => dimensions.boundedW * ((d.FZICU / d3.sum([d.FZICU, d.FZICUFree])));
        const FZICUFreePercent = d => dimensions.boundedW * ((d.FZICUFree / d3.sum([d.FZICU, d.FZICUFree])));

        // const sumHosp = d => d3.sum([d.FZHosp + d.FZHospFree]);
        // const sumICU = d => d3.sum([d.FZICU + d.FZICUFree]);


        /// BALKEN ///////////////////////////////////////////////
        var barFZHosp = wrapper.selectAll("FZHosp")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "rectLinks")
            .attr("x", 0)
            .attr("y", dimensions.margin.top + abstandErsterText)
            .attr("width", FZHospPercent)
            .attr("height", barHeight);

        var barFZHospFree = wrapper.selectAll("FZHospFree")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "rectRechts")
            .attr("x", FZHospPercent)
            .attr("y", dimensions.margin.top + abstandErsterText)
            .attr("width", FZHospFreePercent)
            .attr("height", barHeight);

        var barFZICU = wrapper.selectAll("FZICU")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "rectLinks")
            .attr("x", 0)
            .attr("y", dimensions.margin.top + barHeight + barPadding)
            .attr("width", FZICUPercent)
            .attr("height", barHeight);

        var barFZICUFree = wrapper.selectAll("FZICUFree")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "rectRechts")
            .attr("x", FZICUPercent)
            .attr("y", dimensions.margin.top + barHeight + barPadding)
            .attr("width", FZICUFreePercent)
            .attr("height", barHeight);


        /// LABELS //////////////////////////////////////////
        var nullProzent1 = wrapper.selectAll("texti")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "smallLabel")
            .attr('x', 0)
            .attr('y', dimensions.margin.top + abstandErsterText + barHeight + abstandProzentLabels)
            .text('0%');

        var hundertProzent1 = wrapper.selectAll("textii")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "smallLabel")
            .attr('x', dimensions.boundedW - 40)
            .attr('y', dimensions.margin.top + abstandErsterText + barHeight + abstandProzentLabels)
            .text('100%');

        var nullProzent2 = wrapper.selectAll("textiii")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "smallLabel")
            .attr('x', 0)
            .attr('y', dimensions.margin.top + barHeight + barPadding + barHeight + abstandProzentLabels)
            .text('0%');

        var hundertProzent2 = wrapper.selectAll("textiiii")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "smallLabel")
            .attr('x', dimensions.boundedW - 40)
            .attr('y', dimensions.margin.top + barHeight + barPadding + barHeight + abstandProzentLabels)
            .text('100%');


        var labelProzentHosp = wrapper.selectAll("textiiii")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "bigLabel")
            .attr('x', d => dimensions.boundedW * ((d.FZHosp / d3.sum([d.FZHosp, d.FZHospFree]))) - 25)
            .attr('y', dimensions.margin.top + abstandErsterText + barHeight + abstandProzentLabelsBig)
            .text(d => Math.round(((d.FZHosp / d3.sum([d.FZHosp, d.FZHospFree])) * 100) * 10) / 10 + "%");

        var labelProzentICU = wrapper.selectAll("textiiii")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "bigLabel")
            .attr('x', d => dimensions.boundedW * ((d.FZICU / d3.sum([d.FZICU, d.FZICUFree]))) - 25)
            .attr('y', dimensions.margin.top + barHeight + barPadding + barHeight + abstandProzentLabelsBig)
            .text(d => Math.round(((d.FZICU / d3.sum([d.FZICU, d.FZICUFree])) * 100) * 10) / 10 + "%");




        var textHosp = wrapper.selectAll("texti")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "anfangstext")
            .attr('x', 0)
            .attr('y', dimensions.margin.top + 15)
            .text(d => d.FZHosp + " von " + d3.sum([d.FZHosp, d.FZHospFree]) + " Krankenbetten sind belegt");

        var textICU = wrapper.selectAll("texti")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "anfangstext")
            .attr('y', dimensions.margin.top + barHeight + barPadding - 20)
            .text(d => d.FZICU + " von " + d3.sum([d.FZICU, d.FZICUFree]) + " Intensivbetten sind belegt");




        /// LINIE ///////////////////////////////////////////
        var linieHosp = wrapper.selectAll("linie")
            .data(dataset)
            .enter()
            .append("line")
            .attr("x1", FZHospPercent)
            .attr("y1", dimensions.margin.top + abstandErsterText)
            .attr("x2", FZHospPercent)
            .attr("y2", dimensions.margin.top + abstandErsterText + barHeight + lineHeight)
            .style("stroke", "#000000")
            .style("stroke-width", 1)
            .style("stroke-dasharray", "3,3");

        var linieICU = wrapper.selectAll("linie")
            .data(dataset)
            .enter()
            .append("line")
            .attr("x1", FZICUPercent)
            .attr("y1", dimensions.margin.top + barHeight + barPadding)
            .attr("x2", FZICUPercent)
            .attr("y2", dimensions.margin.top + barHeight + barPadding + barHeight + lineHeight)
            .style("stroke", "#000000")
            .style("stroke-width", 1)
            .style("stroke-dasharray", "3,3");



    }

    async function drawAuslastungHF(region) {
        let widthRes = document.getElementById('hfO_Neuerk').clientWidth; 

        // const dataset = await d3.json('./CovidFallzahlen.json');   //https://covid19-dashboard.ages.at/data/CovidFallzahlen.csv

        const reversed = dataset.reverse();  // Reihenfolge der Datensätze werden umgekehrt  (https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
        var removed = dataset.splice(10); // alle Elemente nach dem 10. Index werden gelöscht  (https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
        // Datensatz besteht nun nur noch aus 10 Einträgen == letztes Datum
        // jedes Bundesland hat einen Datensatz + ein Datenzsatz für Österreich

        // dataset[0] //Österreich ID 10
        // dataset[1] //Wien ID 9
        // dataset[2] //Vorarlberg ID 8
        // dataset[3] //Tirol ID 7
        // dataset[4] //Steiermark ID 6
        // dataset[5] //Salzburg ID 5
        // dataset[6] //Oberösterreich ID 
        // dataset[7] //Niederösterreich ID 3
        // dataset[8] //Kärnten ID 2
        // dataset[9] //Burgenland ID 1

        var auswahl = region;


        if (auswahl == 1) {
            ////ÖSTERREICH
            dataset.splice(1);

        } else if (auswahl == 2) {
            ////WIEN
            dataset.splice(2);
            dataset.splice(0, 1);

        } else if (auswahl == 3) {
            ////VORARLBERG
            dataset.splice(3);
            dataset.splice(0, 2);

        } else if (auswahl == 4) {
            ////TIROL
            dataset.splice(4);
            dataset.splice(0, 3);

        } else if (auswahl == 5) {
            ////STEIERMARK
            dataset.splice(5);
            dataset.splice(0, 4);

        } else if (auswahl == 6) {
            ////SALZBURG
            dataset.splice(6);
            dataset.splice(0, 5);

        } else if (auswahl == 7) {
            ////OBERÖSTERREICH
            dataset.splice(7);
            dataset.splice(0, 6);

        } else if (auswahl == 8) {
            ////NIEDERÖSTERREICH
            dataset.splice(8);
            dataset.splice(0, 7);

        } else if (auswahl == 9) {
            ////KÄRNTEN
            dataset.splice(9);
            dataset.splice(0, 8);

        } else if (auswahl == 10) {
            ////BURGENLAND
            dataset.splice(10);
            dataset.splice(0, 9);
        }

        // console.log(dataset[0])
        let AuslHF1 = dataset[0].FZHosp
        let AuslHF2 = dataset[0].FZHospFree
        // console.log(AuslHF2/AuslHF1)


        // console.log("richtige Daten: ", dataset);



        const width = widthRes;
        const height = 400;
        const barPadding = 200;
        const abstandErsterText = 35;
        const abstandProzentLabels = 20;
        const lineHeight = 30;
        const abstandProzentLabelsBig = 50;
        const barHeight = height / 4.5;


        let dimensions = {
            width: width,
            height: height,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        };

        dimensions.boundedW = dimensions.width - dimensions.margin.left - dimensions.margin.right;
        dimensions.boundedH = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

        const wrapper = d3.select('#wrapper2')
            .append('svg')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height);



        /// BERECHNUNG der Länge der Rechtecke: BoundedW * %-Anteil //////////////////////////////////////

        const FZHospPercent = d => dimensions.boundedW * ((d.FZHosp / d3.sum([d.FZHosp, d.FZHospFree])));
        const FZHospFreePercent = d => dimensions.boundedW * ((d.FZHospFree / d3.sum([d.FZHosp, d.FZHospFree])));
        

        // console.log("FZHospFreePercent :", FZHospFreePercent);

        // const FZICUPercent = d => dimensions.boundedW * ((d.FZICU / d3.sum([d.FZICU, d.FZICUFree])));
        // const FZICUFreePercent = d => dimensions.boundedW * ((d.FZICUFree / d3.sum([d.FZICU, d.FZICUFree])));

        // const sumHosp = d => d3.sum([d.FZHosp + d.FZHospFree]);
        // const sumICU = d => d3.sum([d.FZICU + d.FZICUFree]);


        /// BALKEN ///////////////////////////////////////////////
        var barFZHosp = wrapper.selectAll("FZHosp")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("fill", "#e6e5eb")
            .attr("x", 0)
            .attr("y", dimensions.margin.top)
            .attr("width", FZHospPercent)
            .attr("height", barHeight);

        var barFZHospFree = wrapper.selectAll("FZHospFree")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("fill", "#f1f1f1")
            .attr("x", FZHospPercent)
            .attr("y", dimensions.margin.top)
            .attr("width", FZHospFreePercent)
            .attr("height", barHeight);

        wrapper.append('text')
            .attr("x", width - 150)
            .attr("y", height - 323)
            .text(AuslHF1)
            .style("fill", "#000")
            .style("font-size", "3.1rem")
            .style("text-align", "right")
            .style("letter-spacing", "0.3rem")

        // var barFZICU = wrapper.selectAll("FZICU")
        //     .data(dataset)
        //     .enter()
        //     .append("rect")
        //     .attr("class", "rectLinks")
        //     .attr("x", 0)
        //     .attr("y", dimensions.margin.top + barHeight + barPadding)
        //     .attr("width", FZICUPercent)
        //     .attr("height", barHeight);

        // var barFZICUFree = wrapper.selectAll("FZICUFree")
        //     .data(dataset)
        //     .enter()
        //     .append("rect")
        //     .attr("class", "rectRechts")
        //     .attr("x", FZICUPercent)
        //     .attr("y", dimensions.margin.top + barHeight + barPadding)
        //     .attr("width", FZICUFreePercent)
        //     .attr("height", barHeight);


    }




    drawAuslastung(1);
    drawAuslastungHF(1);

    // console.log("1 anzeigen")


}


//_______Funktionen________________________________________
function downloadFileAusl(path) {
    if (pathbool == true) {
        Papa.parse(path, {
            download: true,
            header: true,
            complete: function (results, file) {
                // console.log('Completed loading the file...');
                // Here starts your real code with this function

                //console.log("Results ", results.data); 
                dataset = results.data;
                yourMainCodeAusl(results.data);
                // console.log("2 anzeigen")
                // console.log("TEST 1 :", dataset);
                return dataset;
            },
        });//wenn ich internet hab und auf die Ampedaten zugreifen darf dann..
    } else {
        pathbool = false; //verweiere zugriff auf ampeldaten online auch wenn ich internet hab
    }
}

function read_from_local_storage() {
    //DATEN
    var items_json = localStorage.getItem("Data");
    if (items_json != null) { //check of es diese Daten im localstorage gibt
        //accessBool = false; 
        items = JSON.parse(items_json); //mit Speicherdatum 
        //dataOffline = JSON.parse(items.items_json);
        dataOfflineAusl = items.items_json; //Ohne Speicherdatum 
        getSpeicherDatumAusl = items.updateDate; //SpeicherDatum

        //   console.log("Offline Items:" , items); 
        //   console.log("Offline Daten:" , dataOfflineAusl); 
        //   console.log("Die Daten wurden zuletzt im Local Storage gespeichert am (updateDate):" , getSpeicherDatumAusl);


    } else {
        //accessBool = true; //Wenn es die Daten nicht gibt dann starte den zugriff auf die online-Daten 
        pathbool = true;
        // downloadFileAusl(path);
        //checkForUpdate();
        console.log("test1")

    }
}








