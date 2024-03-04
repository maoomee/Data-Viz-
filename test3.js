// Define the table
var table = d3.select("body").append("table")
    .style("border-collapse", "collapse") // Add borders
    .style("width", "100%"); // Make the table full width

var thead = table.append("thead");
var tbody = table.append("tbody");

// Load the CSV file
d3.csv("data_sample.csv").then(function(data) {
    // Create the new columns
    data.forEach(function(d) {
        d.ActualCost = (+d.RawMaterial + +d.Workmanship + +d.StorageCost).toFixed(1); // Limit decimal places
        d.SoldPrice = (+d.EstimatedCost * 1.1).toFixed(1); // Limit decimal places
        d.MarginOfProfit = (d.SoldPrice - d.ActualCost).toFixed(1); // Limit decimal places
    });

    // Create the table header
    thead.append("tr")
        .selectAll("th")
        .data(d3.keys(data[0]))
        .enter()
        .append("th")
        .style("border", "1px solid black") // Add borders
        .style("padding", "10px") // Add padding
        .text(function(d) { return d; });

    // Create the table body
    tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .selectAll("td")
        .data(function(row) {
            return d3.keys(data[0]).map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .style("border", "1px solid black") // Add borders
        .style("padding", "10px") // Add padding
        .text(function(d) { return d.value; });
});
