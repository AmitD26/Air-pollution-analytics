
function choropleth(data){

var data = JSON.parse(data);
var state = data["State"];
var value = data[Object.keys(data)[1]];

//Width and height of map
    var width = 860;
    var height = 350;

    var lowColor = '#f9f9f9'
    var highColor = '#bc2a66'



// D3 Projection
    var projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2]) // translate to center of screen
        .scale([700]); // scale things down so see entire US

// Define path generator
    var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
        .projection(projection); // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
    var svg = d3.select("body")
        .append("svg").attr("id","page1_svg")
        .attr("width", width)
        .attr("height", height)
.append("g")
        .attr("transform",
            "translate(" + 10 + "," + 0 + ")");


$("#page1_svg").css({top:100,left:100, position:"absolute"});
// Load in my states data!

     var values = Object.keys(value).map(function(key) {
        return value[key];
    });

        var minVal = d3.min(values)
        var maxVal = d3.max(values)

        var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])
        // Load GeoJSON data and merge with states data
        d3.json("static/us-states.json", function(json) {
            for (var j = 0; j < json.features.length; j++) {
                json.features[j].properties.value = 0;

            }

            // Loop through each state data value in the .csv file
            for (var i = 0; i < 42; i++) {

                // Grab State Name
                var dataState = state[i];

                // Grab data value
                var dataValue = value[i];

                // Find the corresponding state inside the GeoJSON

                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.name;

                    if (dataState == jsonState) {

                        // Copy the data value into the JSON
                        json.features[j].properties.value = dataValue;

                        // Stop looking through the JSON
                        break;
                    }


                }

            }
var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // Bind the data to the SVG and create one path per GeoJSON feature
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke", "#fff")
                .style("stroke-width", "1")
                .style("fill", function(d) { return ramp(d.properties.value) })
                .on("mouseover", function(d) {
                            div.transition()
                                .duration(200)
                                .style("opacity", .9);
                            div.html(d.properties.name)
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px")
                        })
                .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

            // add a legend
            var w = 140, h = 300;

            var key = d3.select("body")
                .append("svg").attr("id","page1_svg")
                .attr("width", w)
                .attr("height", h)
                .attr("class", "legend")
                .attr("transform",
                    "translate(" + 50 + "," + 70 + ")");

            var legend = key.append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "100%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            legend.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", highColor)
                .attr("stop-opacity", 1);

            legend.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", lowColor)
                .attr("stop-opacity", 1);

            key.append("rect")
                .attr("width", w - 100)
                .attr("height", h)
                .style("fill", "url(#gradient)")
                .attr("transform", "translate(0,10)");

            var y = d3.scaleLinear()
                .range([h, 0])
                .domain([minVal, maxVal]);

            var yAxis = d3.axisRight(y);

            key.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(41,10)")
                .call(yAxis)
        });


}