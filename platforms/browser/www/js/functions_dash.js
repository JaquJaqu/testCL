function getAkkordeon_dash(){
  var acc = document.getElementsByClassName("accordion");
    var i;
      
    // Add onclick listener to every accordion element
    for (i = 0; i < acc.length; i++) {
      acc[i].onclick = function() {
        // For toggling purposes detect if the clicked section is already "active"
        var isActive = this.classList.contains("active");
  
        // Close all accordions
        var allAccordions = document.getElementsByClassName("accordion");
        for (j = 0; j < allAccordions.length; j++) {
          // Remove active class from section header
          allAccordions[j].classList.remove("active");
          allAccordions[j].nextElementSibling.style.display = "block";
  
          // Remove the max-height class from the panel to close it
          var panel = allAccordions[j].nextElementSibling.nextElementSibling;
          var maxHeightValue = getStyle(panel, "maxHeight");
          
        
        if (maxHeightValue !== "0px") {
            panel.style.maxHeight = null;
          }
        }
  
        // Toggle the clicked section using a ternary operator
        isActive ? this.classList.remove("active") : this.classList.add("active");
  
        // Toggle the panel element
        var panel = this.nextElementSibling.nextElementSibling;
        var maxHeightValue = getStyle(panel, "maxHeight");
        
        if (maxHeightValue !== "0px") {
          panel.style.maxHeight = null;
          this.nextElementSibling.style.display = "block";
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
          this.nextElementSibling.style.display = "none";
        window.scrollTo(0,(panel.offsetTop-panel.scrollHeight));
        }
        
      };
    }
  
    function getStyle(el, styleProp) {
      var value, defaultView = (el.ownerDocument || document).defaultView;
      // W3C standard way:
      if (defaultView && defaultView.getComputedStyle) {
        // sanitize property name to css notation
        // (hypen separated words eg. font-Size)
        styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
        return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
      } else if (el.currentStyle) { // IE
        // sanitize property name to camelCase
        styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
          return letter.toUpperCase();
        });
        value = el.currentStyle[styleProp];
        // convert other units to pixels on IE
        if (/^\d+(em|pt|%|ex)?$/i.test(value)) { 
          return (function(value) {
            var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
            el.runtimeStyle.left = el.currentStyle.left;
            el.style.left = value || 0;
            value = el.style.pixelLeft + "px";
            el.style.left = oldLeft;
            el.runtimeStyle.left = oldRsLeft;
            return value;
          })(value);
        }
        return value;
      }
    }
  }


function info_aktiveFälle(){
  document.getElementById("info_dash").innerHTML = "Diese Zahl gibt an wie viele Menschen in dieser Region akut an Covid-19 erkrankt sind. Von allen nachgewiesenen Infektionen werden die Todesfälle und die Genesenen abgezogen. Die Kurve zeigt einen Trend der letzten 14 Tage.";
  $("#info_dash").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
  $("#unterinfo").fadeIn(800);
}

function info_Neuerkrankungen(){
  document.getElementById("info_dash").innerHTML = "Diese Zahl zeigt alle Neuinfektionen, die am Vortag gemeldet wurden. Diese Zahl kann jedoch starken Schwankungen unterliegen, weil es an Wochenenden in der Regel einen Meldeverzug gibt. Die Kurve zeigt einen Trend der letzten 14 Tage.";
  $("#info_dash").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
  $("#unterinfo").fadeIn(800);
}

function info_Todesfälle(){
  document.getElementById("info_dash").innerHTML = "Diese Zahl gibt an wie viele Menschen am Vortag an einer Covid-19 Infektion in der gewählten Region gestorben sind. Die Kurve zeigt einen Trend der letzten 14 Tage.";
  $("#info_dash").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
  $("#unterinfo").fadeIn(800);
}

function info_Betten(){
  document.getElementById("info_dash").innerHTML = "Diese Zahl gibt die Auslastung der Normal- und Intensivbetten, die in deiner gewählten Region für Covid-19-Patientinnen und Patienten bereitstehe, in Prozent an. Die Kurve zeigt einen Trend der letzten 14 Tage.";
  $("#info_dash").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
  $("#unterinfo").fadeIn(800);
}

function info_area(){
  document.getElementById("info_dash").innerHTML = "Die horizontale Achse stellt die ausgewählte Zeitperiode dar, während die vertikale Achse die Fallzahlen zeigt. Es kann zwischen verschiedenen Zeitperioden gewählt werden. Tippst du auf die Grafik, siehst du den entsprechenden Tag und die dazugehörige Fallzahl.";
  $("#info_dash").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
  $("#unterinfo").fadeIn(800);
}

function info_close(){
  $("#info_dash").fadeOut(700);
  $("#unterinfo").fadeOut(700);
}

/*
$(function() {
  $('.accordion').hover(function() {
    $(this).find('.info_dash_button').attr("src", "./img/fragezeichen_white.png");
  }, function() {
    // on mouseout, reset the background colour
    $(this).find('.info_dash_button').attr("src", "./img/fragezeichen_gray.png");
  });
});*/


$(function() {
  $('button').click(function(){
    if($('button').hasClass('accordion active')){
      $(this).find('.info_dash_button').attr("src", "./img/fragezeichen_white.png");

  } else {
    // on mouseout, reset the background colour
    $(this).find('.info_dash_button').attr("src", "./img/fragezeichen_gray.png");
  }
});
});