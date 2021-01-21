function onload_info(){
    var name = sessionStorage.getItem("pathname");
    var link = document.getElementById("back2");
    link.setAttribute('href', name);
  }