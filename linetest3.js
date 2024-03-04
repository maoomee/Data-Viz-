// Set up the dimensions for the chart
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Append an SVG container to the specified div
var svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read the CSV file and create the line chart
d3.csv("data_sample.csv").then(function(data) {
    // Parse the date
    var parseDate = d3.timeParse("%m-%d-%Y");

    // Format the date
    var formatDate = d3.timeFormat("%Y-%m-%d");

    // Format the data
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.RawMaterial = +d.RawMaterial;
        d.Workmanship = +d.Workmanship;
        d.StorageCost = +d.StorageCost;
        d.EstimatedCost = +d.EstimatedCost;
    });

    // Use d3.nest() to group data by date
    var nestedData = d3.nest()
        .key(function(d) { return formatDate(d.date); })
        .entries(data);

    // Calculate new variables for each group
    nestedData.forEach(function(group) {
        group.values.forEach(function(d) {
            d.ActualCost = d.RawMaterial + d.Workmanship + d.StorageCost;
            d.SoldPrice = d.EstimatedCost * 1.1;
            d.MarginOfProfit = d.SoldPrice - d.ActualCost;
        });
    });

    // Set up the X and Y scales
    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(d3.extent(data, function(d) { return d.date; }));
    yScale.domain([0, d3.max(data, function(d) {
        return Math.max(d.StorageCost, d.EstimatedCost, d.ActualCost, d.SoldPrice, d.MarginOfProfit);
    })]);

    // Set up the X and Y axes
    var xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y-%m"));
    var yAxis = d3.axisLeft(yScale);

    // Append the X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Append the Y axis
    svg.append("g")
        .call(yAxis);

    // Append line for StorageCost
    svg.append("path")
        .datum(data)
        .attr("class", "line storage")
        .attr("d", d3.line().x(function(d) { return xScale(d.date); }).y(function(d) { return yScale(d.StorageCost); }));

    // Append line for EstimatedCost
    svg.append("path")
        .datum(data)
        .attr("class", "line estimated")
        .attr("d", d3.line().x(function(d) { return xScale(d.date); }).y(function(d) { return yScale(d.EstimatedCost); }));

    // Append line for ActualCost
    svg.append("path")
        .datum(data)
        .attr("class", "line actual")
        .attr("d", d3.line().x(function(d) { return xScale(d.date); }).y(function(d) { return yScale(d.ActualCost); }));

    // Append line for SoldPrice
    svg.append("path")
        .datum(data)
        .attr("class", "line sold-price")
        .attr("d", d3.line().x(function(d) { return xScale(d.date); }).y(function(d) { return yScale(d.SoldPrice); }));

    // Append line for MarginOfProfit
    svg.append("path")
        .datum(data)
        .attr("class", "line margin-of-profit")
        .attr("d", d3.line().x(function(d) { return xScale(d.date); }).y(function(d) { return yScale(d.MarginOfProfit); }));
});
