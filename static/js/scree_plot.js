function scree_plot(dataset) {
    d3.selectAll("svg").remove();



    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 860,
        height = 400;

    var xScale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.3)
        .domain(dataset.map(function (d) {
            return "PC " + d[0];
        }));
    yScale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(dataset, (function (d) {
            return d[1];
        }))]);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // axis-x
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // axis-y
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScale));

    var bar = g.selectAll("rect")
        .data(dataset)
        .enter().append("g");

    // bar chart
    bar.append("rect")
        .attr("x", function (d) {
            return xScale("PC " + d[0]);
        })
        .attr("y", function (d) {
            return yScale(d[2]);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return height - yScale(d[2]);
        })
        .attr("class", function (d) {
            var s = "bar ";
            if (d[1] < 400) {
                return s + "bar1";
            } else if (d[1] < 800) {
                return s + "bar2";
            } else {
                return s + "bar3";
            }
        });

    // labels on the bar chart
    bar.append("text")
        .attr("dy", "1.3em")
        .attr("x", function (d) {
            return xScale("PC " + d[0]) + xScale.bandwidth() / 2;
        })
        .attr("y", function (d) {
            return yScale(d[2])-25;
        })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .text(function (d) {
            return d[2].toPrecision(4);
        });

    // line chart
    var line = d3.line()
        .x(function (d, i) {
            return xScale("PC " + d[0]) + xScale.bandwidth() / 2;
        })
        .y(function (d) {
            return yScale(d[1]);
        })
        .curve(d3.curveMonotoneX);

    bar.append("path")
        .attr("class", "line_pca") // Assign a class for styling
        .attr("d", line(dataset)); // 11. Calls the line generator

    bar.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function (d, i) {
            return xScale("PC " + d[0]) + xScale.bandwidth() / 2;
        })
        .attr("cy", function (d) {
            return yScale(d[1]);
        })
        .attr("r", 5);
}