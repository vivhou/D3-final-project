//map is forked from a combination of https://github.com/githamm/us-state-squares and https://github.com/lvonlanthen/data-map-d3



var scatterData = [];

var options= {
    filtered: 'select_math',
    step: 1
};



  //STEP 3 EVENT HANDLERS
d3.select('#sort_math').on('click', function () {
    options.filtered = 'select_math';
    scatterplot.update();
    choropleth.update();
    d3.select('#sort_math').classed('active', true);
    d3.select('#sort_read').classed('active', false);
  }); 

d3.select('#sort_read').on('click', function () {
    options.filtered = 'select_reading';
    scatterplot.update();
    choropleth.update();
    d3.select('#sort_math').classed('active', false);
    d3.select('#sort_read').classed('active', true);
  }); 


//MOUSEOVER: MOVE POINTS TO FRONT

d3.selection.prototype.moveToFront = function() {  ///thanks to https://gist.github.com/trtg/3922684
  return this.each(function(){
    this.parentNode.appendChild(this);
    }); 
  };

d3.selection.prototype.moveToBack = function() { 
  return this.each(function() { 
  var firstChild = this.parentNode.firstChild; 
    if (firstChild) { 
      this.parentNode.insertBefore(this, firstChild); 
    } 
  }); 
}; 


var margin = { top: 5, right: 15, bottom: 20, left: 15 } ; 
var width = 600 - margin.right - margin.left;
    height = 480 - margin.top - margin.bottom;

// We prepare a quantize scale to categorize the values in 9 groups.
// The scale returns text values which can be used for the color CSS
// classes (q0-9, q1-9 ... q8-9). The domain will be defined once the
// values are known.

var quantize = d3.scaleQuantize()
  .range(d3.range(9).map(function(i) { return 'q' + i + '-9'; }));

var projection = d3.geoEquirectangular()
  .scale(2000)
  .center([-96.03542,41.69553])
  .translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);
   

console.log("before");   

  queue()
    .defer(d3.json, "../state_squares.geojson")
    .defer(d3.csv, "/data/map_data.csv")
    .awaitAll(function(error, results) {
      if (error) { throw error; }

      for (var i = 0; i < results[1].length; i++) {
          var state = results[1][i].state;
          var math_diff = results[1][i].math_diff;
          var read_diff = results[1][i].read_diff;
          var pp_diff = results[1][i].pp_diff;
          var poverty = results[1][i].poverty;
          var m_diff_white = results[1][i].m_diff_white;
          var m_diff_black = results[1][i].m_diff_black;
          var m_diff_his = results[1][i].m_diff_his;
          var r_diff_white = results[1][i].r_diff_white;
          var r_diff_black = results[1][i].r_diff_black;
          var r_diff_his = results[1][i].r_diff_his;
          var state_name = results[1][i].state_name;
          var pp_expense_11 = results[1][i].pp_expense_11;
          var m_all_11 = results[1][i].m_all_11;



      for (var j = 0; j < results[0].features.length; j++) {

        if (state == results[0].features[j].properties.abbr) {
          results[0].features[j].properties.math_diff = math_diff;
          results[0].features[j].properties.read_diff = read_diff;
          results[0].features[j].properties.pp_diff = pp_diff;
          results[0].features[j].properties.poverty = poverty;
          results[0].features[j].properties.m_diff_white = m_diff_white;
          results[0].features[j].properties.m_diff_black = m_diff_black;
          results[0].features[j].properties.m_diff_his = m_diff_his;
          results[0].features[j].properties.r_diff_white = r_diff_white;
          results[0].features[j].properties.r_diff_black = r_diff_black;
          results[0].features[j].properties.r_diff_his = r_diff_his;
          results[0].features[j].properties.state_name = state_name;

          break;
        }
      }
    }

    
    choropleth = new Choropleth(results[0]);
    choropleth.update();

    scatterplot = new Scatterplot(results[1]);
    scatterplot.update();

console.log("hi")
    firstScatterplot = new FirstScatterplot(results[1]);
    firstScatterplot.update();
    
   
    });

console.log("after");

//STEPPER FUNCTIONS

function switchStep(newStep)
{
  d3.selectAll(".step-link").classed("active", false);
  d3.select("#" + newStep).classed("active", true);
}

function switchHeader(newHeader, newParagraph) {
  d3.select("#heading-text")
      .style("opacity", 1)
      .transition()
      .duration(900)
      .delay(500)
      .style("opacity", 0)
      .remove()
    d3.select("#heading-text")
      .style("opacity", 0)
      .transition()
      .duration(900)
      .delay(500)
      .style("opacity", 1)
      .text(newHeader)
  d3.select("#paragraph-text")
      .style("opacity", 1)
      .transition()
      .duration(900)
      .delay(500)
      .style("opacity", 0)
      .remove()
    d3.select("#paragraph-text")
      .style("opacity", 0)
      .transition()
      .duration(900)
      .delay(500)
      .style("opacity", 1)
      .text(newParagraph)
}

//INITIAL STEP 1 BEFORE CLICK
d3.select("#vis-container").attr('class', 'step-1')
var newHeader = "Top State Spenders";
var newParagraph = "D.C. has the smallest student population nationwide, yet, in 2011, it spent $5,978 more per student than New York, and still scored lower on fourth-grade math proficiency scores.";
 // firstScatterplot.update();
 console.log("2u");
  switchHeader(newHeader, newParagraph);

//BUTTON SELECTION
d3.selectAll("a.btn").on("click", function(d) {
  var clickedStep = d3.select(this).attr("id");
  switchStep(clickedStep);

//SWITCHING BETWEEN STEPS:

 function switchAnnotation(clickedStep) {
//  options.step = 1;
//  d3.select('#vis-container').attr('class', 'step-1')
//  firstScatterplot.update()
  
    if (clickedStep === 'step1') {
      d3.select("#vis-container").attr('class', 'step-1')
      var newHeader = "2011: Top State Spenders"
      var newParagraph = "D.C. has the smallest student population nationwide, yet, it spent $5,978 more per student than New York, and still scored lower on fourth-grade math proficiency scores."
        switchHeader(newHeader, newParagraph);
        firstScatterplot.update();   
    }
    else if (clickedStep === 'step2') {
      d3.select("#vis-container").attr('class', 'step-2')
      var newHeader = "2011: State Spending vs. Test Scores";
      var newParagraph = "While there is a modest correlation between per-pupil state funding and National Test Scores among fourth-graders, some states are an exception.";
        switchHeader(newHeader, newParagraph);
        firstScatterplot.update();
    }

    else if (clickedStep === 'step3') {
   //   d3.select("#vis-container").attr('class', 'step-container')
      d3.select("#vis-container").attr('class', 'step-3')
      var newHeader = "2011: State Spending vs. Poverty";
      var newParagraph = "Among the top ten states with the highest poverty rate, states spent an average of $16,357 less than D.C. but performed higher on math proficiency scores by roughly 14 points. ";
        switchHeader(newHeader, newParagraph);
        firstScatterplot.update();   

    }
     else if (clickedStep === 'step4') {
      d3.select("#vis-container").attr('class', 'step-4') 

        
    }
  }
  switchAnnotation(clickedStep);
  
});

//STEP 1

FirstScatterplot = function (data) {
    var chart = this;

    chart.data = data

    chart.svg = d3.select("#chart1")
  //    .attr('class', 'step-1')
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 -10 600 500")
      .classed("svg-content-responsive", true)
     // .attr('width', width + margin.left + margin.right)
     // .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

 
    // SCALES
    chart.x = d3.scaleLinear()
      .domain([20000, d3.max(chart.data, function (d) { return parseInt(d.pp_expense_11); })]) 
      .range([0, width])
      .nice();

    var y0 = d3.min(chart.data, function (d) {
      return d.m_all_11; })
    var y1 = d3.max(chart.data, function (d) {
      return d.m_all_11; })

    chart.y = d3.scaleLinear()
     // .domain(d3.extent(data, function (d) { return d.Math_proficient/100; })) 
      .domain([y0, y1])
      .range([height, 0])
      .nice();

    // AXES

    var formatThousand = d3.format(".2s");
    var formatThousand_x = function(d) { if (d > 0) {
      return "$" + formatThousand(d/1000) + "k"; }
    };

    var formatPoints = d3.format("");

    chart.xAxis = d3.axisBottom()
        .scale(chart.x)
        .ticks(10)
        //.orient("top")
        .tickSize(-height) 
        .tickFormat(formatThousand_x);




    chart.yAxis = d3.axisLeft()
        .scale(chart.y)
      //  .ticks(16)
  //      .orient("left")
     //   .outerTickSize(0)
        .tickSize(-width, 0, 0) 
        .tickFormat(formatPoints);


  //AXES

    var gx = chart.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(chart.xAxis) 
    gx.selectAll("g").filter(function(d) { return d;}) //need to use filter since true values do not return 0
        .classed("no-minor", true);
    gx.selectAll("text")
       .attr("transform", "translate(0," + (height*.005) + ")")  
    gx.append("text")
        .attr('class', 'labels')
        .attr("transform", "translate(" + (width /2) + " ," + (height/18) + ")")
        .style("fill", "black")
        .attr("text-anchor", "middle")
        .text("Per-Pupil Expenses");



    var gy= chart.svg.append("g")
        .attr("class", "y axis")
     //   .attr("transform", "translate(" + ",0)")
        .call(chart.yAxis)
    gy.selectAll("g").filter(function(d) { return d;})
        .classed("no-minor", true);
    gy.selectAll("text") 
        .attr("x", 18)
        .attr("dy", -3)
    gy.append("text")
        .attr('class', 'labels')
        .attr("transform", "rotate(-90)")
        .style("fill", "black") 
        .attr("y", - (height*.03))
        .attr("x", - (width/3))
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text("Math Scores");
//TOOLTIP

  chart.tooltip = d3.select("body").append("div")   
          .attr("class", "tooltip step-2 step-3")               
          .style("opacity", 0);



}

  

FirstScatterplot.prototype.update =function (data) {
    var chart = this;

    firstScatterData = chart.data.slice();
 

//IF STATEMENT FOR STEPS ONE AND TWO
    if (d3.select("#vis-container").attr("class") === "step-1") {

//STEP ONE SCALE
        chart.x = d3.scaleLinear()
          .domain([20000, d3.max(chart.data, function (d) { return parseInt(d.pp_expense_11); })]) 
          .range([0, width])
          .nice();
  //NEED TO CALL THE X-AXIS SO THAT IT RESCALES BACK TO ORIGINAL
        chart.xAxis = d3.axisBottom()
          .scale(chart.x)
          .tickSize(-height) 
          .tickFormat(formatThousand_x);
        chart.svg.selectAll(".axis").filter(".x")
          .transition().duration(1000)
          .call(chart.xAxis);
          chart.svg.selectAll("g").filter(function(d) { return d;})
            .classed("no-minor", true);
        
  //STEP ONE: APPEND TWO CIRCLES
    
//
        firstScatterData_1 = firstScatterData.filter(function(d) {
            return d.pp_expense_11 > 20000;
        })


        var points = chart.svg.selectAll('.point') //point is used instead of circles, in case different shapes are used
          .data(firstScatterData_1, function(d) {return d.state; })

        //KEEP BOTH CIRCLES THE SAME COLOR AFTER RETURNING FROM OTHER STEPS
        points
          .attr('class', 'point path')
          .attr('r', function(d) { return d.poverty * 120})
          .style("fill", "#ffa500")
          .style("stroke", "#697fd7")
          .style("stroke-width", "3");

          //IF PREVIOUSLY ON STEP TWO: 
      //REMOVE REMAINING 49 POINTS
        points.exit()
          .transition()
          .duration(300)
          .delay(function(d, i) {
            return i / firstScatterData.length * 1000;  
          }).remove(); 

          console.log(points)
   
          
        points.enter().append('circle')
        .merge(points)
        .on("mouseover", function(d) { 
            d3.select(this)
              .style("fill", function(d) { return "#45cab2"; }) 
            chart.tooltip.transition()        
              .duration(200)      
              .style("opacity", 0.8)
            chart.tooltip.html(d["state_name"])
              .style("left", (d3.event.pageX) + "px")     
              .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            d3.select(this)  
              .style("fill", "#ffa500")      
            chart.tooltip.html("")
              .transition()        
              .duration(500)      
              .style("opacity", 0)
          })    
          .transition()
          .duration(1000)
          .delay(function(d, i) {
          return i / firstScatterData_1.length * 500;  
          })
          .attr('class', 'point path step-1 step-2 step-3')
          .attr('r', function(d) { return d.poverty * 120})
          .attr('cx', function (d) { return chart.x(d.pp_expense_11); })
          .attr('cy', function (d) { return chart.y(d.m_all_11); })
          .style("fill", "#ffa500")
          .style("stroke", "#697fd7")
          .style("stroke-width", "3") 
          .style("opacity", 0.9);


          
          
  
      //TRANSITION POINTS BACK TO ORIGINAL X-SCALE
        chart.svg.selectAll('.point')
          .transition().duration(1000)
          .attr('cx', function (d) { return chart.x(d.pp_expense_11); })
          .attr('cy', function (d) { return chart.y(d.m_all_11); }); 

        points.exit().remove();
    
    //ELSE: STEP 2
  } else if (d3.select("#vis-container").attr("class") === "step-2") {


        x1 = d3.max(chart.data, function (d) { 
          return parseInt(d.pp_expense_11*1.05); //need to multiply by 1.05 to extend x-axis and keep circle on graph
        })
        chart.x.domain([0, x1])  
        var formatThousand = d3.format(".2s");
        var formatThousand_x = function(d) { if (d > 0) {
          return "$" + formatThousand(d/1000) + "k"; }
        };

      //CHANGING X-AXIS

        var formatPoints = d3.format("");
        chart.xAxis = d3.axisBottom()
            .scale(chart.x)
            .ticks(10)
            //.orient("top")
            .tickSize(-height) 
            .tickFormat(formatThousand_x);
        chart.svg.selectAll(".axis").filter(".x")
            .transition().duration(1000)
            .call(chart.xAxis);
        chart.svg.selectAll("g").filter(function(d) { return d;})
            .classed("no-minor", true);


        var points = chart.svg.selectAll('.point') //point is used instead of circles, in case different shapes are used
            .data(firstScatterData, function(d) { return d.state; });


      //APPEND REMAINING POINTS

        points.enter().append('circle')
          .attr('class', 'point path')
          .attr('r', function(d) { return d.poverty * 120})
          .merge(points)
      //TOOLTIP
          .on("mouseover", function(d) { 
            var sel = d3.select(this);
              sel.moveToFront()
              .style("fill", function(d) { return "#45cab2"; }) 
            chart.tooltip.transition()        
              .duration(200)      
              .style("opacity", 0.8)
            chart.tooltip.html(d["state_name"])
              .style("left", (d3.event.pageX) + "px")     
              .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            var sel = d3.select(this);
              sel.moveToBack()  
              .style("fill", function(d) { if (d.state === "DC" || d.state == "NY") { return "#ffa500"; } 
                else {return "#a5a5a5"; }
              })  
              .style("opacity", function(d) { if (d.state === "DC" || d.state == "NY") { return 0.9; } 
                else {return 0.7; }
              })     
            chart.tooltip.html("")
              .transition()        
              .duration(500)      
              .style("opacity", 0)
           
          })    
          .transition()
          .duration(1000)
          .delay(function(d, i) {
          return i / firstScatterData.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
          })
          .attr('cx', function (d) { console.log(d); return chart.x(d.pp_expense_11); })
          .attr('cy', function (d) { return chart.y(d.m_all_11); });

      
        points.exit().transition().remove(); 
    

  //ELSE: STEP 3
    } else if (d3.select("#vis-container").attr("class") === "step-3") {


      //FILTER POINTS TO TOP TEN STATES WITH HIGHEST POVERTY RATE
      firstScatterData_3 = firstScatterData.sort(function(a, b) {
            return a.poverty < b.poverty ? 1: -1;
      }) .slice(0,10);

      console.log(firstScatterData_3)



      var points = chart.svg.selectAll('.point') 
        .data(firstScatterData_3, function(d) {return d.state; })


        points.enter().append('circle')
          .attr('class', 'point path step-3')
          .style("fill", "#a5a5a5")
          .style("stroke", "#697fd7")
          .style("stroke-width", "3") 
          .style("opacity", "0.8")
          .merge(points)
          .transition()
          .duration(1000)
          .delay(function(d, i) {
          return i / firstScatterData_3.length * 500;  
          })
          .attr('r', function(d) { return d.poverty * 120})
          .attr('cx', function (d) { return chart.x(d.pp_expense_11); })
          .attr('cy', function (d) { return chart.y(d.m_all_11); });
       
       points.exit()
          .transition()
          .duration(300)
          .delay(function(d, i) {
            return i / firstScatterData.length * 1000;  
          }).remove(); 

          console.log(points)
    }
    

}



function Choropleth(states) {
  var chart = this;

  chart.svg = d3.select("#chart3")
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 600 500")
      .classed("svg-content-responsive", true);
   // .attr('width', width + margin.left + margin.right)
   // .attr('height', height + margin.top + margin.bottom);


  chart.mapFeatures = chart.svg.append('g')
  .attr('class', 'features YlGnBu')

  
  chart.map = chart.mapFeatures.selectAll('path')
    .data(states.features)
    .enter().append('path')
    .attr('class', 'path')
    .attr('d', path)




//LEGEND
  chart.legendSvg = d3.select('#legend').append('svg')
    .attr('width', '100%')
    .attr('height', '50');

  chart.g = chart.legendSvg.append('g')
    .attr("class", "legend-key YlGnBu")
    .attr("transform", "translate(" + 20 + "," + 20 + ")");

  chart.g.selectAll("rect")
    .data(quantize.range().map(function(d) {
      return quantize.invertExtent(d);
    }))
  .enter().append("rect");

// For the legend, we prepare a very simple linear scale. Domain and
// range will be set later as they depend on the data currently shown.

  chart.legendX = d3.scaleLinear();

// We use the scale to define an axis. The tickvalues will be set later
// as they also depend on the data.
  chart.legendXAxis = d3.axisBottom()
  .scale(chart.legendX)
 // .orient("bottom")
  .tickSize(13);


  chart.g.append("text")
      .attr("class", "caption")
      .attr("y", -6)
      .attr("x", 100)

  chart.legendWidth = d3.select('#chart3').node().getBoundingClientRect().width/2 - margin.right - margin.left;

//TOOLTIP

  chart.tooltip = d3.select("body").append("div")   
          .attr("class", "tooltip")               
          .style("opacity", 0);

//chart.tooltip(chart.svg);

  chart.states = states;
} 




Choropleth.prototype.update = function () {

 var chart = this;

 quantize.domain([
    d3.min(chart.states.features, function(d) { return getValueOfData(d); }),
    d3.max(chart.states.features, function(d) { return getValueOfData(d); })
  ]);

 chart.map
  .transition()
  .attr('class', function(d) { 
    return quantize(getValueOfData(d));
  })
  .style('stroke', function(d) {
    if (d.properties['poverty'] >= .156) {
      return "#545454"};
  })

  .style('stroke-width', function(d) {
    if (d.properties['poverty'] >= .156) {return "3px"};
  })
  .delay(function(d, i) { 
    return i*14;
  });

//UPDATING LEGEND


// We determine the domain of the quantize scale which will be used as
  // tick values. We cannot directly use the scale via quantize.scale()
  // as this returns only the minimum and maximum values but we need all
  // the steps of the scale. The range() function returns all categories
  // and we need to map the category values (q0-9, ..., q8-9) to the
  // number values. To do this, we can use invertExtent().

  chart.legendDomain = quantize.range().map(function(d) {
      var r = quantize.invertExtent(d);
      return r[1];
  });

  // Since we always only took the upper limit of the category, we also
  // need to add the lower limit of the very first category to the top
  // of the domain.

  chart.legendDomain.unshift(quantize.domain()[0]);

  // We set the domain and range for the x scale of the legend. The
  // domain is the same as for the quantize scale and the range takes up
  // all the space available to draw the legend.
  chart.legendX
    .domain(quantize.domain())
    .range([0, chart.legendWidth]);

  // On smaller screens, there is not enough room to show all 10
  // category values. In this case, we add a filter leaving only every
  // third value of the domain.
  if (chart.legendWidth < 400) {
      chart.legendDomain = chart.legendDomain.filter(function(d, i) {
        return i % 3 == 0;
      });
    }    

  // We update the rectangles by (re)defining their position and width
  // (both based on the legend scale) and setting the correct class.
/*  chart.g.selectAll("rect")
      .data(quantize.range().map(function(d) {
        return quantize.invertExtent(d);
      }))
      .attr("height", 8)
      .attr("x", function(d) 
{               console.log(chart.legendX(d[0])-chart.legendX(d[1]));
 
        return chart.legendX(d[0]); })
      .attr("width", function(d) { return chart.legendX(d[1]) - chart.legendX(d[0]); })
      .attr('class', function(d, i) {
        return quantize.range()[i];
      });
*/
  /*var keyButton = d3.select('#categories').node();
  var selectedOption = keyButton.options[keyButton.selectedIndex];
  var legendText = chart.g.selectAll('text.caption')
      .text(selectedOption.text); */

  //RETRIEVING TEXT OF BUTTON FOR TOOLTIP AND LEGEND

  function selectedButton() {
    if (options.filtered === 'select_math') {
      return document.getElementById("sort_math").textContent;
    } else {
      return document.getElementById("sort_read").textContent;
      }
  }

//ADDING LEGEND LABEL

  var legendText = chart.g.selectAll('text.caption')
      .text("Percent Change in " + selectedButton() + "Profiency" );


  // We set the calculated domain as tickValues for the legend axis.
  chart.legendXAxis
    .tickValues(chart.legendDomain)

  chart.g
  .transition()
  .duration(1000)
  .call(chart.legendXAxis);


  //TOOLTIP


  format = d3.format(",d");
  chart.map
      .on("mouseover", function(d, i) {   
          chart.tooltip.transition()        
              .duration(200)      
              .style("opacity", 0.8)
              .style("left", (d3.event.pageX) + "px")     
              .style("top", (d3.event.pageY - 28) + "px");

        chart.tooltip.append("p")
            .attr("class", "tooltip_text")
            .html("State" + ": <b>" + d.properties.state_name + "</b><br /> <u>" + 
              "% Change in " + selectedButton() + " Proficiency" + "</u>:<b> " + 
              format(getValueOfData(d)) + "%" + "</b>");
        chart.map
              var id = d.properties.state_name
              var matchingPts = d3.selectAll('.path')
              .filter(function(d) { return d.state_name == id; });
              matchingPts
                .transition()
                .duration(300)
                .attr('r', 9) //make corresponding circles stand out 
              d3.selectAll('.path')
                  .style("opacity", function(d) {
                    console.log(d.state_name == id)
                   return d.state_name == id ? 1 : 0.2;
                  })
                  .style("stroke", function(d) {
                   return d.state_name == id ? 1 : 0.2;
                  });


      })        
      .on("mouseout", function(d) {       
          chart.tooltip.html("")
              .transition()        
              .duration(500)      
              .style("opacity", 0)

          d3.selectAll(".path")
            .style("opacity", 0.6)
            .attr('r', 7); //restore radius size
      });

}

function getValueOfData(d) {
  if (options.filtered === 'select_math') {
          return +d.properties.math_diff; 
        } else {
          return +d.properties.read_diff;
        }
} 

function getValueOfScatterData(d) {
  if (options.filtered === 'select_math') {
          return +d.m_diff; 
        } else {
          return +d.r_diff;
        }
} 


function circleFill (d) {
        if (d.race == "white") { return "#fff"; } 
        else if (d.race == "his") { return "#323299";}
        else if (d.race== "black") { return "#ffa500";}
      }



 function Scatterplot(data) {
    var chart = this;

    chart.data = data

    chart.svg = d3.select("#chart4")
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 -10 600 500")
      .classed("svg-content-responsive", true)
     // .attr('width', width + margin.left + margin.right)
     // .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

 
    // SCALES

    chart.x = d3.scaleLinear()
      .domain([0, d3.max(chart.data, function (d) { return d.pp_diff * (-1); })]) 
      .range([0, width])
      .nice();

    var y0 = Math.max(-d3.min(chart.data, function (d) {
      return Math.max(d.m_diff_white, d.m_diff_his,d.m_diff_black);
    }), d3.max(chart.data, function(d) { 
      return Math.max(d.m_diff_white, d.m_diff_his,d.m_diff_black);
    }));

    chart.y = d3.scaleLinear()
     // .domain(d3.extent(data, function (d) { return d.Math_proficient/100; })) 
      .domain([-y0, y0])
      .range([height, 0])
      .nice();

    // AXES

    var formatThousand = d3.format(".2s");
    var formatThousand_x = function(d) { if (d > 0) {
      return "+$" + formatThousand(d/1000) + "k"; }
    };

    var formatPoints = d3.format("");

    chart.xAxis = d3.axisBottom()
        .scale(chart.x)
        .ticks(10)
        //.orient("top")
        .tickSize(-height) 
        .tickFormat(formatThousand_x);


    chart.yAxis = d3.axisLeft()
        .scale(chart.y)
      //  .ticks(16)
  //      .orient("left")
     //   .outerTickSize(0)
        .tickSize(-width, 0, 0) 
        .tickFormat(formatPoints);


  //AXES

    var gx = chart.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(chart.xAxis) 
    gx.selectAll("g").filter(function(d) { return d;}) //need to use filter since true values do not return 0
        .classed("minor", true);
    gx.selectAll("text")
       .attr("transform", "translate(0," + (height*.005) + ")")  
    gx.append("text")
        .attr('class', 'labels')
        .attr("transform", "translate(" + (width /2) + " ," + (height/18) + ")")
        .style("fill", "black")
        .attr("text-anchor", "middle")
        .text("Per-Pupil Expense Difference");



    var gy= chart.svg.append("g")
        .attr("class", "y axis")
     //   .attr("transform", "translate(" + ",0)")
        .call(chart.yAxis)
    gy.selectAll("g").filter(function(d) { return d;})
        .classed("minor", true);
    gy.selectAll("text") 
        .attr("x", 14)
        .attr("dy", -2)
        .style("fill", function(d) { if (d <0) {
          return "red"; }
          else { return "black"; }
        });
    gy.append("text")
        .attr('class', 'labels')
        .attr("transform", "rotate(-90)")
        .style("fill", "black") 
        .attr("y", - (height*.03))
        .attr("x", - (width/3))
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text("-     Point Score Difference     +");

  //Creating new Dataset

  for (var i = 0; i < chart.data.length; i++) {
    scatterData.push({state: chart.data[i].state,
       state_name: chart.data[i].state_name,
       pp_diff: chart.data[i].pp_diff,
       race: "white",
       m_diff: chart.data[i].m_diff_white,
       r_diff: chart.data[i].r_diff_white})
    scatterData.push({state: chart.data[i].state,
       state_name: chart.data[i].state_name,
       pp_diff: chart.data[i].pp_diff,
       race: "black",
       m_diff: chart.data[i].m_diff_black,
       r_diff: chart.data[i].r_diff_black})
    scatterData.push({state: chart.data[i].state,
       state_name: chart.data[i].state_name,
       pp_diff: chart.data[i].pp_diff,
       race: "his",
       m_diff: chart.data[i].m_diff_his,
       r_diff: chart.data[i].r_diff_his})
  }


    chart.points = chart.svg.selectAll('.point') //point is used instead of circles, in case different shapes are used
      .data(scatterData);

    chart.points.enter().append('circle')
      .transition()
      .duration(1000)
      .delay(function(d, i) {
      return i / scatterData.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
      })
      .attr('class', 'point path')
      .attr('r', 7)
      .attr('cx', function (d) { return chart.x(d.pp_diff * (-1)); })
      .attr('cy', function (d) { 
        if (options.filtered === 'select_math') {
          return chart.y(d.m_diff)
        } else {
          return chart.y(d.r_diff)
        }
        //return chart.y(filterData(d)); 
      })
      .style('opacity', function(d) {
        if (d.r_diff == 0) {return "0";}
       // if (isNaN(d.r_diff)) {return "0";}
        else { if (d.m_diff == 0) {return "0";}
      }
        return "0.6";
      })
      .style("fill", circleFill)
      .style("stroke", function (d) {
      if ((options.filtered != 'select_math' && d.r_diff < 0) || (options.filtered === 'select_math' && d.m_diff < 0)) { 
        return "#cc0000";
      } else {
          return "#697fd7";
      } 
    })
      .style("stroke-width", "2.5")

  //LEGEND

           
    var colors = [ 
        { race: "White", color: "#fff" },
        { race: "Hispanic", color: "#323299" },
        { race: "Black", color: "#ffa500" }
      ]

    chart.legendScatter = d3.select('#scatter_legend').append('svg')
      .attr('width', '100%')
      .attr('height', '100');


    chart.g = chart.legendScatter.append("g")
      .attr("class", "legend")
      .attr('transform', 'translate(' + -50 + ',' + 30 + ')');    
      
    
    chart.g.selectAll('rect')
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", width - 65)
      .attr("y", function(d, i){ return i *  20;})
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", function(d) { 
        return d.color;
      })
      .style("opacity", 0.7)
      
    chart.g.selectAll('text')
      .data(colors)
      .enter()
      .append("text")
    .attr("x", width - 42)
      .attr("y", function(d, i){ return i *  20 + 12 ;})
    .text(function(d) {
         return d.race;
      })
    .style("fill", "#000");

    //TOOLTIP

    chart.tooltip = d3.select("body").append("div")   
          .attr("class", "tooltip")               
          .style("opacity", 0);



    chart.update();
  


  }


Scatterplot.prototype.update = function() {

//idea inspired by http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
  var chart = this;

  chart.svg.selectAll('.point') //point is used instead of circles, in case different shapes are used
    .data(scatterData)

//Create Circles
    .transition()
    .duration(1000)
    .delay(function(d, i) {
      return i / scatterData.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
      })
    .attr('cx', function (d) { return chart.x(d.pp_diff * (-1)); })
    .attr('cy', function (d) { if (options.filtered === 'select_math') {
      return chart.y(d.m_diff);
      } else { return chart.y(d.r_diff); } 
    })
    .style("stroke", function (d) {
      if ((options.filtered != 'select_math' && d.r_diff < 0) || (options.filtered === 'select_math' && d.m_diff < 0)) { 
        return "#cc0000";
      } else {
          return "#697fd7";
      } 
    })
    
    


      //return chart.y(filterData(d)); 
  
//  points.exit().remove();

  }








