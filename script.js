//map is forked from a combination of https://github.com/githamm/us-state-squares and https://github.com/lvonlanthen/data-map-d3


var currentKey = 'math_diff';

var margin = { top: 15, right: 15, bottom: 30, left: 45 } ; 
var width = 625 - margin.right - margin.left;
    height = 525 - margin.top - margin.bottom;



var colorRamp = ['#e50000', '#ffffb2', '#008000'];

var dataById = d3.map();


var quantize = d3.scaleQuantize()
  .range(d3.range(9).map(function(i) { return 'q' + i + '-9'; }));

var color = d3.scaleLinear()
  .domain([-3, 2, 13])
  .range(colorRamp);

var projection = d3.geoEquirectangular()
  .scale(2000)
  .center([-96.03542,41.69553])
  .translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);
/*    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>" + d.properties.abbr + ": </strong><span>" + dataById.get(d.properties.abbr) + "% difference in math proficiency</span>";
      }) */

var svg = d3.select("body").append("svg")
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

var mapFeatures = svg.append('g')
  .attr('class', 'features YlGnBu')

 //   svg.call(tip); 

  queue()
    .defer(d3.json, "../state_squares.geojson")
    .defer(d3.csv, "/data/map_data.csv", function(d) { dataById.set(d.state, +d.math_diff); })
    .awaitAll(function(error, results) {
      if (error) { throw error; }
    
    data = results;

    choropleth = new Choropleth(results[0],results[1]);
    });

    d3.select('#categories').on('change', function () {
      currentKey = d3.select(this).property('value');
      choropleth.update();
      });
    


function Choropleth(us) {
  var chart = this;



  chart.svg = d3.select("#chart1")
    mapFeatures.selectAll('path')
    .data(us.features)
    .enter().append('path')
    .attr('d', path)
/*
    chart.tooltip = d3.tip()
      .attr('class', 'tooltip')
      .offset([-6, 0])
      .html(function(d) { return dataById.get(d.properties.abbr) });
    chart.tooltip(chart.svg);
    chart.update(); */

    chart.update();
  
} 

Choropleth.prototype.update = function () {

 var chart = this;


 quantize.domain([
    d3.min(data, function(d) { return getValueOfData(d); }),
    d3.max(data, function(d) { return getValueOfData(d); })
  ]);

 mapFeatures.selectAll('path')
  .attr('class', function(f) { console.log(quantize(getValueOfData(dataById[getIdOfFeature(f)]))); return quantize(getValueOfData(dataById[getIdOfFeature(f)])); 
    });




   // .style("fill", function(d) { console.log(dataById.get(d.properties.abbr));return color(dataById.get(d.properties.abbr))})
    
     // .on('mouseover', tip.show)
     // .on('mouseout', tip.hide)
/*
    chart.svg = d3.selectAll("g")
    .selectAll(".place-label")
    .data(us.features)
    .enter().append("text")
    .attr("class", "place-label")
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; }) 
    .attr("dy", ".5em")
    .attr("dx", "-.7em")
    .text(function(d) { return d.properties.abbr; }); */
}

function getValueOfData(d) {
  return +d[currentKey];
}

function getIdOfFeature(f) {
  return f.properties.abbr;
}
/*
function updateLegend() {

// Legend
    var w = 210,
        h = 40;
    var legendDomain = quantize.range().map(function(d) {
      var r = quantize.invertExtent(d);
      return r[1];
    });

    legendDomain.unshift(quantize.domain()[0]);

    var key = d3.select("#legend")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("y1", "100%")
      .attr("x1", "0%")
      .attr("y2", "100%")
      .attr("x2", "100%")
      .attr("spreadMethod", "pad");
    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colorRamp[0])
      .attr("stop-opacity", 1);
    legend.append("stop")
      .attr("offset", "30%")
      .attr("stop-color", colorRamp[1])
      .attr("stop-opacity", 1);
    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorRamp[2])
      .attr("stop-opacity", 1);
    key.append("rect")
      .attr("width", w - 10)
      .attr("height", h - 20)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0,0)");

    chart.x = d3.scaleLinear()
      .range([0, 200])
      .domain([-3, 13]);

    var xAxis = d3.axisBottom()
      .scale(chart.x)
 //     .orient("bottom")
      .ticks(4);
    key.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, 20)")
      .call(xAxis);

  //  d3.select(self.frameElement).style("height", height + "px");
 } */