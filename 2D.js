/********************
 ******** 2D ********
 ********************/
var w = 800;
var h = 800;
//Define default path generator
var projection = d3.geo.mercator()
    .scale(270000)
    .center([-122.4310, 37.7742]) // centers map at given coordinates
    .translate([w / 2, h / 2]); // translate map to svg
//path generator
var path = d3.geo.path().projection(projection);
//Create SVG element
var dVis = d3.select("#vis")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
//Load in GeoJSON data
d3.json("https://raw.githubusercontent.com/suneman/socialdataanalysis2016/master/files/sfpddistricts.geojson", function(json) {
    console.log(json);
    //Bind data and create one path per GeoJSON feature
    dVis.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "rgb(90,140,180)");

    dVis.selectAll("text")
        .data(json.features)
        .enter()
        .append("svg:text")
        .text(function(d) {
            return d.properties.DISTRICT;
        })
        .attr("x", function(d) {
            return path.centroid(d)[0];
        })
        .attr("y", function(d) {
            return path.centroid(d)[1];
        })
        .attr("text-anchor", "middle")
        .attr('font-size', '9pt');

    plotProstitution("kmeans6");
});
var border = 1;
var bordercolor = 'black';
var borderPath = dVis.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", h)
    .attr("width", w)
    .style("stroke", bordercolor)
    .style("fill", "none")
    .style("stroke-width", border);


function updateKmeans(set) {
    plotProstitution("kmeans" + set);
}

function plotProstitution(input) {
    var label = dVis.append("text")
        .attr("x", 40)
        .attr("y", 40)
        .attr("dy", ".45em")
        .text("Loading data...");
    // Clear all data points
    dVis.selectAll("circle")
        .remove();

    var points = "data/" + input + "_points.csv";
    var centroids = "data/" + input + "_centroids.csv";

    var color = d3.scale.linear()
        .domain([0, 1, 2, 3, 4, 5])
        .range([
            "rgba(255,0,0,0.2)",
            "rgba(255,255,0,0.2)",
            "rgba(0,255,0,0.2)",
            "rgba(255,0,255,0.2)",
            "rgba(0,255,255,0.2)",
            "rgba(255,128,0,0.2)"
        ]);
    // Add the data
    d3.csv(points, function(data) {
        dataset = data.map(function(d) { return [+d["x"], +d["y"], +d["label"]]; });

        //Create circles
        dVis.selectAll("points")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return projection([d[0], d[1]])[0];
            })
            .attr("cy", function(d) {
                return projection([d[0], d[1]])[1];
            })
            .attr("r", function(d) {
                return 3;
            })
            .style("fill", function(d) {
                return color(d[2]);
            });
        // Add the center points
        d3.csv(centroids, function(data) {
            data.forEach(function(d) {
                d.x = +d.x;
                d.y = +d.y;
                d.label = +d.label;
            });

            //Create circles
            dVis.selectAll("centroids")
                .data(data)
                .enter()
                .append("circle")
                .transition()  // Transition from old to new
                .duration(1000)  // Length of animation
                .each("start", function() {  // Start animation
                    d3.select(this)  // 'this' means the current element
                        .attr("stroke", "white")  // Change color
                        .attr("r", 0);  // Change size
                })
                .delay(function(d, i) {
                    return i / data.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
                })
                .attr("cx", function(d) {
                    return projection([d.x, d.y])[0];
                })
                .attr("cy", function(d) {
                    return projection([d.x, d.y])[1];
                })
                .attr("r", function(d) {
                    return 16;
                })
                .style("stroke-width", '2px')
                .style("stroke", 'black')
                .style("fill", 'none');

            label.remove();
        });

    });


}