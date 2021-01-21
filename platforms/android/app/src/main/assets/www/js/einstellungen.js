function onload_einstellungen(){
    toggleStorageTrue = sessionStorage.getItem("storeToggleTrue");
    toggleStorageFalse = sessionStorage.getItem("storeToggleFalse");

    var name = sessionStorage.getItem("pathname");
    var link = document.getElementById("back1");
    link.setAttribute('href', name);

    if(toggleStorageTrue != null){
          document.getElementById("switchValue_setting").checked = true;
        }
  
        if(toggleStorageFalse != null){
          document.getElementById("switchValue_setting").checked = false;
        }
}

function checkToggle(){
    let isChecked=document.getElementById("switchValue_setting");
     if(isChecked.checked){
       checkBool = true;
     }
     else{
       checkBool = false;
     }
          //Manuelle Lokation
          if(checkBool == true){
              sessionStorage.setItem("storeToggleTrue", true);
              sessionStorage.removeItem("storeToggleFalse");
  
          //Standortbasierte Lokation
          }else if(checkBool == false){
  
              sessionStorage.setItem("storeToggleFalse", false);
              sessionStorage.removeItem("storeToggleTrue");
          }
  }