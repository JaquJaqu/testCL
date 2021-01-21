
//ACCORDION SYMPTOME
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

function startOverlay(){ 
  $("#overlay").fadeIn(700);
}

function endOverlay(){
  $("#overlay").fadeOut(700);
}
/*
$("#scrollbar").scroll(function(){
  var fromTop = $('#scrollbar').scrollTop();
  $("#overlay").css('margin', (120 + fromTop) + 'px 0px 0px 0px');
});*/