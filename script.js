//map is forked from a combination of https://github.com/githamm/us-state-squares and https://github.com/lvonlanthen/data-map-d3

var data = [];

var currentKey = 'math_diff';

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


   

  queue()
    .defer(d3.json, "../state_squares.geojson")
    .defer(d3.csv, "/data/map_data.csv")
    .awaitAll(function(error, results) {
      if (error) { throw error; }

    
    choropleth = new Choropleth(results[0],results[1]);
    choropleth.update();

    scatterplot = new Scatterplot(results[1]);
    scatterplot.update();


    d3.select('#categories').on('change', function () {
      currentKey = d3.select(this).property('value');
      choropleth.update(results[0],results[1]);
      scatterplot.update(results[1]);
      });
    });


function Choropleth(states, data) {
  var chart = this;


  chart.svg = d3.select("#chart1").append("svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);


  chart.mapFeatures = chart.svg.append('g')
  .attr('class', 'features YlGnBu')

    for (var i = 0; i < data.length; i++) {
      var state = data[i].state;
      var math_diff = data[i].math_diff;
      var read_diff = data[i].read_diff;
      var pp_diff = data[i].pp_diff;
      var poverty = data[i].poverty;

      for (var j = 0; j < states.features.length; j++) {

        if (state == states.features[j].properties.abbr) {
          states.features[j].properties.math_diff = math_diff;
          states.features[j].properties.read_diff = read_diff;
          states.features[j].properties.pp_diff = pp_diff;
          states.features[j].properties.poverty = poverty;
          break;
        }
      }
    }

  chart.svg = d3.select("#chart1")
  chart.map = chart.mapFeatures.selectAll('path')
    .data(states.features)
    .enter().append('path')
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
      .attr("x", 25)
//TOOLTIP

  chart.tooltip = d3.select("body").append("div")   
          .attr("class", "tooltip")               
          .style("opacity", 0);

//chart.tooltip(chart.svg);

  chart.states = states;
} 

  function Scatterplot(data) {
    var chart = this;

    chart.data = data

    chart.svg = d3.select("#chart2").append("svg")
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

 
    // SCALES

    chart.x = d3.scaleLinear()
      .domain([0, d3.max(chart.data, function (d) { return d.poverty/100; })]) 
      .range([0, width])
      .nice();

    var y0 = Math.max(-d3.min(chart.data, function (d) {
      return d.math_diff;
    }), d3.max(chart.data, function(d) { 
      return d.math_diff;
    }));

    chart.y = d3.scaleLinear()
     // .domain(d3.extent(data, function (d) { return d.Math_proficient/100; })) 
      .domain([-y0, y0])
      .range([height, 0])
      .nice();

    // AXES

    var formatPercentage = d3.format(".1%");
    var formatPercentage_x = function(d) { if (d > 0) {
      return formatPercentage(d); }
    };

    var formatPoints = d3.format("");

    var xAxis = d3.axisBottom()
        .scale(chart.x)
        .ticks(10)
        //.orient("top")
        .tickSize(-height) 
        .tickFormat(formatPercentage_x);




    var yAxis = d3.axisLeft()
        .scale(chart.y)
      //  .ticks(16)
  //      .orient("left")
     //   .outerTickSize(0)
        .tickSize(-width, 0, 0) 
        .tickFormat(formatPoints);

   var gx = chart.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis) 
 //   gx.selectAll("g").filter(function(d) { return d;}) //need to use filter since true values do not return 0
 //       .classed("minor", true);
   //   .attr("transform")
    gx.selectAll("text")
       .attr("transform", "translate(0," + (height* -.5) + ")")
    gx.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width /2) + " ," + (margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Poverty");



    var gy= chart.svg.append("g")
        .attr("class", "y axis")
     //   .attr("transform", "translate(" + ",0)")
        .call(yAxis)
 //   gy.selectAll("g").filter(function(d) { return d;})
 //       .classed("minor", true);
    gy.selectAll("text") 
       .attr("x", -1)
       .attr("dy", 0);
    gy.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -42)
       .attr("x", margin.top - (height/2))
       .attr("dy", ".71em")
       .style("text-anchor", "middle")
       .text("Math proficiency");


//    chart.update();
   
  }



Choropleth.prototype.update = function () {

 var chart = this;

 quantize.domain([
    d3.min(chart.states.features, function(d) { return getValueOfData(d); }),
    d3.max(chart.states.features, function(d) { return getValueOfData(d); })
  ]);

 chart.map
  .transition()
 // .duration(1250)
  .attr('class', function(d) { 
    return quantize(getValueOfData(d));
  })
  .style('stroke', function(d) {
    if (d.properties['poverty'] >= 15.6) {
      return "#697fd7"};
  })
  .style('stroke-width', function(d) {
    if (d.properties['poverty'] >= 15.6) {return "3px"};
  })
  .delay(function(d, i) { 
    return i*10;
  });

//UPDATING LEGEND

  chart.legendWidth = d3.select('#chart1').node().getBoundingClientRect().width/2 - margin.right - margin.left;

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
  chart.g.selectAll("rect")
      .data(quantize.range().map(function(d) {
        return quantize.invertExtent(d);
      }))
      .attr("height", 8)
      .attr("x", function(d) { return chart.legendX(d[0]); })
      .attr("width", function(d) { return chart.legendX(d[1]) - chart.legendX(d[0]); })
      .attr('class', function(d, i) {
        return quantize.range()[i];
      });

  var keyDropdown = d3.select('#categories').node();
  var selectedOption = keyDropdown.options[keyDropdown.selectedIndex];
  var legendText = chart.g.selectAll('text.caption')
      .text(selectedOption.text);


  // We set the calculated domain as tickValues for the legend axis.
  chart.legendXAxis
    .tickValues(chart.legendDomain)

  chart.g.call(chart.legendXAxis);


     // .on('mouseover', tip.show)
     // .on('mouseout', tip.hide)
  //TOOLTIP
 

  format = d3.format(",d");
  chart.map
      .on("mouseover", function(d) {   
          chart.tooltip.transition()        
              .duration(200)      
              .style("opacity", 0.8)
              .style("left", (d3.event.pageX) + "px")     
              .style("top", (d3.event.pageY - 28) + "px");

        chart.tooltip.append("p")
            .attr("class", "tooltip_text")
            .html("State" + ": <b>" + d.properties.abbr + "</b><br /> <u>" + selectedOption.text + "</u>:<b> " + 
              format(d.properties[currentKey]) + "</b>")
      })        
      .on("mouseout", function(d) {       
          chart.tooltip.html("")
              .transition()        
              .duration(500)      
              .style("opacity", 0)
      });

}

function getValueOfData(d) {
  return +d.properties[currentKey]
}


Scatterplot.prototype.update = function() {

}



