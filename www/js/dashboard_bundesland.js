/**
 * TO-DO für "Alpha-Release"
 * - Bundeslandseite komplett auskommentieren 
 * - Akkordon bei Hardfacts deaktivieren 
 * - console.logs auskommentieren 
 * - Letzte Aktualisierung am Dashboard auskommentieren oder einfügen 
 * - aktuellen Ampeldaten einfügen??? 
 * 
 * 
 * - auf flock hochladen 
 * 
 */


const arrBundesland = [];

let bundesland;
getAkkordeon_dash();
// HardfactsBL(); 

function onload_bundesland() {
    if (localStorage.getItem("storeBundesland") != null) {
        document.getElementById("dash_bundesland_name").innerHTML = localStorage.getItem("storeBundesland");
    }
    if (localStorage.getItem("letzterBezirk") != null) {
        bezirkTemp = localStorage.getItem("letzterBezirk");
        loadJSON("bundesland_dropdown.json", function (data) {
            for (i = 0; i < data[0].Bezirke.length; i++) {
                if (data[0].Bezirke[i].Bezirk == bezirkTemp) {
                    document.getElementById("dash_bundesland_name").innerHTML = data[0].Bezirke[i].Bundesland;
                    // console.log(document.getElementById("dash_bundesland_name").innerHTML); 
                }
                
            }
            const dateParser = d3.timeParse('%d.%m.%Y');
            blN = document.getElementById("dash_bundesland_name").innerHTML;
            // console.log(dataOffline)
            const dataBL = dataOffline.filter(d => d.Bundesland == blN); 
            // console.log(dataBL); 

            function setPreviewBL(){
                let widthRes = document.getElementById('hfBL_Neuerk').clientWidth;
                let hfAFBL = dataBL[dataBL.length - 1].AnzahlFaelle;
                let hfTBL = dataBL[dataBL.length - 1].AnzahlTotTaeglich;
                // console.log('test-set')

                drawPreview('#hfBL_Neuerk', dataBL, d => dateParser(d.datum), d => d.AnzahlFaelle, 1700, hfAFBL, widthRes);
                drawPreview('#hfBL_TT', dataBL, d => dateParser(d.datum), d => d.AnzahlTotTaeglich, 50, hfTBL, widthRes);
            }
            function getAreachartsBL(){
  
    
                drawAreaChart('#ACBL_Neuerk', dataBL, d => dateParser(d.datum), d => d.AnzahlFaelle, 1700); 
                drawAreaChart('#ACBL_TT', dataBL, d => dateParser(d.datum), d => d.AnzahlTotTaeglich, 50); 
            
            }
            setPreviewBL();
            getAreachartsBL(); 

        }, function (xhr) { console.error(xhr); });
       
    }
}

function myFunction_bundesland() {
    document.getElementById("myDropdown_bundesland").classList.toggle("show");
}

loadJSON("bundesland_dropdown.json", function (data) {
    for (i = 0; i < data[0].Bezirke.length; i++) {
        if (!arrBundesland.includes(data[0].Bezirke[i].Bundesland)) {
            arrBundesland.push(data[0].Bezirke[i].Bundesland);
        }
    }
    for (i = 0; i < arrBundesland.length; i++) {

        dropdownContent = document.getElementById('myDropdown_bundesland');
        htmlToAppend = document.createElement('LI');

        htmlToAppend.setAttribute('onclick', 'changeText_bundesland(this)');
        textnode = document.createTextNode(arrBundesland[i]);
        htmlToAppend.appendChild(textnode);
        htmlToAppend.setAttribute('value', arrBundesland[i]);
        dropdownContent.appendChild(htmlToAppend);

    }
}, function (xhr) { console.error(xhr); });

function changeText_bundesland(elm) {
    bundesland = elm.getAttribute('value');
    myFunction_bundesland();
    document.getElementById("dropbtn_bundesland").innerHTML = bundesland;
    localStorage.setItem("letztesBundesland", bundesland);

}

// 