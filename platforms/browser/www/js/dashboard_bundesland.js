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
        document.getElementById("dropbtn_bundesland").innerHTML = localStorage.getItem("storeBundesland");
    }
    if (localStorage.getItem("storeBezirk") != null) {
        bezirkTemp = localStorage.getItem("storeBezirk");
        loadJSON("bundesland_dropdown.json", function (data) {
            for (i = 0; i < data[0].Bezirke.length; i++) {
                if (data[0].Bezirke[i].Bezirk == bezirkTemp) {
                    document.getElementById("dropbtn_bundesland").innerHTML = data[0].Bezirke[i].Bundesland;
                }
            }
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