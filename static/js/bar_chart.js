function draw_bar_chart(data, pollutant) {
    pollutant = pollutant + " AQI";
    var margin = {top: 20, right: 20, bottom: 100, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    console.log(pollutant)
    console.log(data.map(function (d) {
        return d[pollutant]
    }))

// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.4);
    var y = d3.scaleLinear()
        .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function (d) {
        return d.Year;
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
            return x(d.Year);
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
        .attr("y", 0 - margin.left)
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