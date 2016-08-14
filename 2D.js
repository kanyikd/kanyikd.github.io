var w = 580;
var h = 580;

var projection = d3.geo.mercator()
    .scale(200000)
    .center([-122.4310, 37.7742]) 
    .translate([w / 2, h / 2]); 

var path = d3.geo.path().projection(projection);

var chart4 = d3.select("#chart4")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

d3.json("https://raw.githubusercontent.com/suneman/socialdataanalysis2016/master/files/sfpddistricts.geojson", function(json) {
    
    chart4.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "rgb(50,100,120)");

    chart4.selectAll("text")
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
        .style("fill","white")
        .attr('font-size', '8pt');

    updatePoints("kmeans2");
});

var borderPath = chart4.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", h)
    .attr("width", w)
    .style("stroke", 'black')
    .style("stroke-width", '1px')
    .style("fill", "rgb(135,206,250)");


function updater(x) {
    updatePoints("kmeans" + x);
}

function updatePoints(x) {
    var label = chart4.append("text")
        .attr("x", 40)
        .attr("y", 40)
        .attr("dy", ".5em");

    chart4.selectAll("circle")
        .remove();

    var points = "geolocations/" + x + "point.csv";
    var centres = "geolocations/" + x + "centre.csv";

    var color = d3.scale.linear()
        .domain([0, 1, 2, 3, 4, 5])
        .range([
            "rgb(200,200,0)",
            "rgb(0,200,0)",
            "rgb(200,0,0)",
            "rgb(75,0,130)",
            "rgb(200,0,150)",
            "rgb(0,0,200)"
            
        ]);
    
    d3.csv(points, function(data) {
        dataset = data.map(function(d) { return [+d["x"], +d["y"], +d["label"]]; });

        //Create circles
        chart4.selectAll("points")
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
                return 2;
            })
            .style("fill", function(d) {
                return color(d[2]);
            });
        
        d3.csv(centres, function(data) {
            data.forEach(function(d) {
                d.x = +d.x;
                d.y = +d.y;
                d.label = +d.label;
            });

            
            chart4.selectAll("centres")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return projection([d.x, d.y])[0];
                })
                .attr("cy", function(d) {
                    return projection([d.x, d.y])[1];
                })
                .attr("r", function(d) {
                    return 16;
                })
                .style("stroke-width", '3px')
                .style("stroke", 'black')
                .style("fill", "rgba(0,0,0,0.3)");
        });

    });


}