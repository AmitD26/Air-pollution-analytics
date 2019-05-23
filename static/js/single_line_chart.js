function draw_single_line_chart(data, pollutant) {
    console.log(data)
    pollutant = pollutant + " AQI";
    console.log(pollutant)
    var margin = {top: 90, right: 20, bottom: 90, left: 45},
        width = 550 - margin.left - margin.right,
        height = 380 - margin.top - margin.bottom;

    var x = d3.scalePoint().range([0, width]);
    var y0 = d3.scaleLinear().range([height, 0]);

    data.map(function (d) {
        d[pollutant] = +d[pollutant];
    });

    // define the 1st line
    var valueline = d3.line()
        .x(function (d) {
            return x(d["year"]);
        })
        .y(function (d) {
            return y0(+d[pollutant]);
            console.log(d[pollutant])
        });

    // var valueline = d3.line()
    //     .x([x("Washington"), x("Alabama")])
    //     .y([y0(1000), y0(2000)]);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg").attr('id','singleline')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Get the data

    // format the data
    $("#singleline").css({top:100,left:870, position:"absolute"});

    // Scale the range of the data
    // console.log([d3.min(data[popn_or_deaths]), d3.max(data[popn_or_deaths])])
    x.domain(data.map(function (d) {
        return d["year"]
    }))
    y0.domain([d3.min(data, function (d) {
        return d[pollutant]
    }), d3.max(data, function (d) {
        return d[pollutant]
    })]);

    // y0.domain([0, d3.max(data, function (d) {
    //     return d[pollutant]
    // })]);
    // y1.domain([0, d3.max(data, function (d) {
    //     return d[popn_or_deaths]
    // })]);

    // Add the valueline path.
    svg.append("path")
        .data(data)
        .attr("class", "line")
        .attr("d", valueline(data));
    // console.log(x("New York"))
    // console.log(y1(15000))
    // Add the valueline2 path.

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-90)");

    // Add the Y0 Axis
    svg.append("g")
        .attr("class", "axisRed")
        .call(d3.axisLeft(y0));

    // Add the Y1 Axis

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top - 40 ) + ")")
        .style("text-anchor", "middle")
        .text("Years");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left )
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(pollutant);

}