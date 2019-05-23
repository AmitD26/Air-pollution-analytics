function draw_bar_chart(data, pollutant) {
    pollutant = pollutant + " AQI";
    var margin = {top: 10, right: 20, bottom: 100, left: 70},
        width = 860 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    console.log(data)


// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.4);
    var y = d3.scaleLinear()
        .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg").attr("id","page1_2_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    $("#page1_2_svg").css({top:500,left:10, position:"absolute"});

    x.domain(data.map(function (d) {
        return d.year;
    }));
    y.domain([0, d3.max(data, function (d) {
        return +d[pollutant];
    })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.year);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(+d[pollutant]);
        })
        .attr("height", function (d) {
            return height - y(+d[pollutant]);
        })


    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(pollutant);

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Years");

}