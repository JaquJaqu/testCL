//  const { start } = require("../../platforms/android/cordova/lib/Adb");

// var widthRes = document.getElementsByClassName('verlauf').clientWidth; 
// console.log(widthRes); 

 

const dateParser = d3.timeParse('%d.%m.%Y');
// if (widthRes == null) {
//     console.log("test")
//     widthRes = document.getElementById('').clientWidth; 
// }
// console.log(widthRes); 


//Areachart
async function drawPreview(place, url, xA, yA, range, hardfact, weite) {
    const yAccessor = yA;
    const xAccessor = xA;
    let dataset = await url;
    
    let test = 15;

    let startDate = dateParser(dataset[dataset.length - test].datum);
    let endDate = dateParser(dataset[dataset.length - 1].datum);

    let hf = hardfact;

    // console.log('start' + startDate);
    // console.log(endDate); 
    // var screenSize = window.innerWidth;
    let width = weite; 

    // if (screenSize > 600) {
    //     width = 500; 
    // } else {
    //     width = window.innerWidth; 
    // }

    // // let width = widthRes
    // console.log(width); 


    //2 - set dimension and properties
    let dimensions = {
        width: width,
        height: width * 0.2,
    };

    //3 - draw canvas
    const wrapper = d3.select(place);

    let svg = wrapper.append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    let bounds = svg.append('g');

    //create scales
    let yScale = d3.scaleLinear()
        .nice()
        .domain([0, range])
        .range([dimensions.height, 0]);

    let xScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, dimensions.width]);

    // draw data (area)
    let areaGenerator = d3.area()
        .curve(d3.curveBasis)
        .x(d => xScale(xAccessor(d)))
        .y0(dimensions.height)
        .y1(d => yScale(yAccessor(d)));

    let area = bounds
        .append('path')
        .attr('d', areaGenerator(dataset))
        .attr('fill', '#e6e5eb')
        .attr('stroke', '#e6e5eb');

    // let areaClip = bounds.append("rect")        // attach a rectangle
    //     .attr("x", 0)        // position the left of the rectangle
    //     .attr("y", 0)         // position the top of the rectangle
    //     .attr("clip-path", "url(#area-clip)") // clip the rectangle
    //     .style("fill", "#e6e5eb")   // fill the clipped path with grey
    //     .attr("height", dimensions.height)    // set the height
    //     .attr("width", dimensions.width);    // set the width

    let hardf = bounds.append("text")
        .attr("x", dimensions.width - 150)
        .attr("y", dimensions.height - 14)
        .text(hf)
        .style("fill", "#000")
        .style("font-size", "3.1rem")
        .style("text-align", "right")
        .style("letter-spacing", "0.3rem"); 
    // console.log(hf); 

}


async function drawAreaChart(placeA, urlA, xAA, yAA, rangeA) {
    // var ua = d3.locale();

    //1 - access data
    const yAccessor = yAA;
    const xAccessor = xAA;
    let dataset = await urlA

    let width = window.innerWidth * 0.9; 
    // console.log(width); 

    if (width > 650) {
        width = 500; 
    } else {
        width = width
    }
 
    

    let anzahl = dataset.length - 1;
    let val = anzahl;

    let startDate = dateParser(dataset[dataset.length - val].datum);
    let endDate = dateParser(dataset[dataset.length - 1].datum);


    //2 - set dimension and properties
    let dimensions = {
        
            width: width, 
            height: width * 0.5,
            margin: {
                top: 20,
                right: 10,
                bottom: 35,
                left: 40
            },
        
       
    };
    //calculate bounded width and height
    dimensions.boundW = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundH = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    //3 - draw canvas
    const wrapper = d3.select(placeA);

    let svg = wrapper.append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)
        // .style('transform', `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    let bounds = svg.append('g')
        .style('transform', `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);


    //create scales
    let yScale = d3.scaleLinear()
        .nice()
        .domain([0, rangeA])
        .range([dimensions.boundH, 0]);

    let xScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, dimensions.boundW]);

    // draw data (area)
    let areaGenerator = d3.area()
        .curve(d3.curveBasis)
        .x(d => xScale(xAccessor(d)))
        .y0(dimensions.boundH)
        .y1(d => yScale(yAccessor(d)));


        let area = bounds
        .append('path')
        .attr('d', areaGenerator(dataset))
        .attr('fill', '#968AB6')
        .attr('stroke', '#968AB6');

    // console.log(dataset.Bundesland[1]); 


    // bounds.append("rect")        // attach a rectangle
    //     .attr("x", 0)        // position the left of the rectangle
    //     .attr("y", 0)         // position the top of the rectangle
    //     .attr("clip-path", "url(#area-clip)") // clip the rectangle
    //     .style("fill", "#968AB6")   // fill the clipped path with lila
    //     .attr("height", dimensions.boundH)    // set the height
    //     .attr("width", dimensions.boundW);    // set the width


    //draw peripherals
    let yAxisGenerator = d3.axisLeft()
        .scale(yScale);

    yAxisGenerator.ticks(4);
    yAxisGenerator.tickSize(-dimensions.boundW); //weißes 'grid'
    yAxisGenerator.tickFormat(d3.format("d"));
    //yAxisGenerator.tickValues([startValue, endValue]);

    let yAxis = bounds.append('g')
        .attr("class", "grid")
        .call(yAxisGenerator);
    // .style('transform', `translateX(-7px)`);//führt generator methode aus

    let xAxisGenerator = d3.axisBottom()
        .scale(xScale);

    xAxisGenerator.ticks(3);
    // xAxisGenerator.tickValues([startDate, endDate]);
    xAxisGenerator.tickFormat(d3.timeFormat("%d.%m."));


    // yAxisGenerator.ticks(3);
   
    // yAxisGenerator.tickValues([0,endValue+100]);

    let xAxis = bounds.append('g')
        .attr("class", "grid")
        .call(xAxisGenerator)//führt generator methode aus
        .style('transform', `translateY(${dimensions.boundH}px)`);




    /*-------------------------------------------------------------*/

}





















