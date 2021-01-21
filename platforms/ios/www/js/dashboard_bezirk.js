const arrBezirk = [];

getAkkordeon_dash();

function onload_bezirk(){
    if(sessionStorage.getItem("storeBezirk")!= null){
        document.getElementById("dropbtn_bezirk").innerHTML = sessionStorage.getItem("storeBezirk");
    }
}

function myFunction_bezirk() {
    document.getElementById("myDropdown_bezirk").classList.toggle("show");
   }

   loadJSON("bundesland_dropdown.json", function(data){
    for(i=0; i<data[0].Bezirke.length; i++){ 
    arrBezirk.push(data[0].Bezirke[i].Bezirk);
    }
    for(i=0; i<arrBezirk.length;i++){
        dropdownContent = document.getElementById('myDropdown_bezirk');
        htmlToAppend = document.createElement('LI');
        
        htmlToAppend.setAttribute('onclick', 'changeText_bezirk(this)');
        textnode = document.createTextNode(arrBezirk[i]);
        htmlToAppend.appendChild(textnode);
        htmlToAppend.setAttribute('value', arrBezirk[i]);
        dropdownContent.appendChild(htmlToAppend); 
    }
    sortListDir("myDropdown_bezirk");
  
}, function(xhr){console.error(xhr);});
  
    function changeText_bezirk(elm){
        bezirk = elm.getAttribute('value');
        myFunction_bezirk();
        document.getElementById("dropbtn_bezirk").innerHTML = bezirk;
        sessionStorage.setItem("storeBezirk",bezirk);
      }

      /*
      function scrollTo(){
          window.scrollTo(0,500);
      }*/