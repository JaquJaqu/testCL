function onload_walk(){
    /*sessionStorage.setItem("walkthrough", true);*/
    sessionStorage.removeItem("walkthrough");

    if(sessionStorage.getItem("splash") == null){
        setTimeout(function(){
                document.getElementById("logo_covidlux").style.visibility = "visible";
                document.getElementById("wellen_oben_viren").style.display = "block";
                document.getElementById("wellen_unten_viren").style.display = "block";
        },2000);
        $("#splash").delay(5000).fadeOut();
    }else{
        document.getElementById("splash").style.display = "none";
    }

    setTimeout(function(){
        if(sessionStorage.getItem("walkthrough") != null){
            window.location.replace("start.html");
        }
    },4000);

}

function storeSplash(){
    /*sessionStorage.setItem("splash", true);*/
    sessionStorage.removeItem("splash");
}
 
function storeWalk(){
    /*sessionStorage.setItem("walkthrough", true);*/
}

