function onload_einstellungen(){
  toggleStorageTrue = localStorage.getItem("storeToggleTrue");
  toggleStorageFalse = localStorage.getItem("storeToggleFalse");

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
            localStorage.setItem("storeToggleTrue", true);
            localStorage.removeItem("storeToggleFalse");

        //Standortbasierte Lokation
        }else if(checkBool == false){

            localStorage.setItem("storeToggleFalse", false);
            localStorage.removeItem("storeToggleTrue");
        }
}