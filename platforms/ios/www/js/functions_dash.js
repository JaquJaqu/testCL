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
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          window.scrollTo(0,(panel.offsetTop-panel.scrollHeight));
            console.log(panel.offsetTop-panel.scrollHeight);
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
    document.getElementById("info_dash").innerHTML = "Hier kommt noch eine Info zu den aktiven Fällen ...";
    $("#info_dash").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
    $("#unterinfo").fadeIn(800);
  }

  function info_Neuerkrankungen(){
    document.getElementById("info_dash").innerHTML = "Jetzt will ich aba noch was zu Neuerkrankungen erfahren ...";
    $("#info_dash").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
    $("#unterinfo").fadeIn(800);
  }

  function info_Todesfälle(){
    document.getElementById("info_dash").innerHTML = "Was genau sind eigentlich Todesfälle?";
    $("#info_dash").css({"display": "flex", "justify-content": "center", "align-items": "center"}).hide().fadeIn(800);
    $("#unterinfo").fadeIn(800);
  }

  function info_close(){
    $("#info_dash").fadeOut(700);
    $("#unterinfo").fadeOut(700);
  }