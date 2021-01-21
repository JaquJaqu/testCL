const arrBundesland = [];

getAkkordeon_dash();

function onload_bundesland(){
    if(sessionStorage.getItem("storeBundesland") != null){
    document.getElementById("dropbtn_bundesland").innerHTML = sessionStorage.getItem("storeBundesland");
    }
    if(sessionStorage.getItem("storeBezirk") != null){
        bezirkTemp = sessionStorage.getItem("storeBezirk");
        loadJSON("bundesland_dropdown.json", function(data){
            for(i=0; i<data[0].Bezirke.length; i++){
                if(data[0].Bezirke[i].Bezirk == bezirkTemp){
                document.getElementById("dropbtn_bundesland").innerHTML = data[0].Bezirke[i].Bundesland;
            }
        }
        }, function(xhr){console.error(xhr);});
}
}

function myFunction_bundesland() {
    document.getElementById("myDropdown_bundesland").classList.toggle("show");
   }

   loadJSON("bundesland_dropdown.json", function(data){
    for(i=0; i<data[0].Bezirke.length; i++){ 
        if(!arrBundesland.includes(data[0].Bezirke[i].Bundesland)){
            arrBundesland.push(data[0].Bezirke[i].Bundesland);
        }
    }
    for(i=0; i<arrBundesland.length;i++){

        dropdownContent = document.getElementById('myDropdown_bundesland');
        htmlToAppend = document.createElement('LI');
        
        htmlToAppend.setAttribute('onclick', 'changeText_bundesland(this)');
        textnode = document.createTextNode(arrBundesland[i]);
        htmlToAppend.appendChild(textnode);
        htmlToAppend.setAttribute('value', arrBundesland[i]);
        dropdownContent.appendChild(htmlToAppend); 
      
    }
}, function(xhr){console.error(xhr);});

    function changeText_bundesland(elm){
        bundesland = elm.getAttribute('value');
        myFunction_bundesland();
        document.getElementById("dropbtn_bundesland").innerHTML = bundesland;
      }