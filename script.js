 <!--map is forked from https://github.com/githamm/us-state-squares -->
 
    var width = 700,
        height = 400;

    var colorRamp = ['#e50000', '#ffffb2', '#008000'];

    var rateById = d3.map();

    var color = d3.scale.linear()
      .domain([-3, 2, 13])
      .range(colorRamp);

    var projection = d3.geo.equirectangular()
      .scale(2000)
      .center([-96.03542,41.69553])
      .translate([width / 2, height / 2]);

    var path = d3.geo.path()
      .projection(projection);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>" + d.properties.abbr + ": </strong><span>" + rateById.get(d.properties.abbr) + "% difference in math proficiency</span>";
      })

    var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.call(tip);

    queue()
      .defer(d3.json, "../state_squares.geojson")
      .defer(d3.csv, "/data/map_data.csv", function(d) { rateById.set(d.state, +d.math_diff); })
      .await(ready);

    // Build map and labels
    function ready(error, us) {
      svg.append("g")
          .attr("class", "states")
        .selectAll("path")
          .data(us.features)
        .enter().append("path")
          .attr("class", function(d) { return d.properties.abbr; })
          .style("fill", function(d) { console.log(rateById.get(d.properties.abbr));return color(rateById.get(d.properties.abbr))})
          .attr("d", path)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

      svg.selectAll(".place-label")
          .data(us.features)
        .enter().append("text")
          .attr("class", "place-label")
          .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
          .attr("dy", ".5em")
          .attr("dx", "-.7em")
          .text(function(d) { return d.properties.abbr; });
    }

    // Legend
    var w = 210,
      h = 40;
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
    var y = d3.scale.linear()
      .range([0, 200])
      .domain([-3, 13]);
    var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(4)
      .orient("bottom");
    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(10,15)")
      .call(yAxis);

    d3.select(self.frameElement).style("height", height + "px");

 