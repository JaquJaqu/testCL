getAkkordeon_dash();


const dateParser = d3.timeParse('%d.%m.%Y');
const data = dataOffline.filter(d => d.Bundesland == "Oesterreich");



function setPreviewO() {
    
    let hfAF = data[data.length - 1].AnzahlFaelle;
    let hfT = data[data.length - 1].AnzahlTotTaeglich;
   

    drawPreview('#hfO_Neuerk', data, d => dateParser(d.datum), d => d.AnzahlFaelle, 9500, hfAF);
    drawPreview('#hfO_TT', data, d => dateParser(d.datum), d => d.AnzahlTotTaeglich, 150, hfT);
}

function getAreacharts(){
  
    
    drawAreaChart('#AC_Neuerk', data, d => dateParser(d.datum), d => d.AnzahlFaelle, 9500); 
    drawAreaChart('#AC_TT', data, d => dateParser(d.datum), d => d.AnzahlTotTaeglich, 150); 

}



setPreviewO();

getAreacharts(); 


