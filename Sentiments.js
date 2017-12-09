var margin ={top:20, right:30, bottom:90, left:40},
    width=860-margin.left - margin.right,
    height=330-margin.top-margin.bottom;

                var datasetASSAULT1=[];
                var datasetBURGLARY1=[];
                var dataset1;

                d3.json("Sentiments.json", function(data) {
                    for (var i = 0, l=data.length, j=0, k=0; i <l; i++) {
                        if (data[i]['TYPE']=="ASSAULT") {
                            datasetASSAULT1.push([]);
                            datasetASSAULT1[j].push(data[i]["YEAR"]);
                            datasetASSAULT1[j].push(data[i]["NUMBER"]);
                            j++;
                        }
                        else {
                            datasetBURGLARY1.push([]);
                            datasetBURGLARY1[k].push(data[i]["YEAR"]);
                            datasetBURGLARY1[k].push(data[i]["NUMBER"]);
                            k++;
                        }
                    };

                    dataset1=datasetASSAULT1;

                    function getMaxOfArray(numArray) {
                        return Math.max.apply(null, numArray);
                    }

                    var maxCollision=getMaxOfArray(dataset1);

                    var x = d3.scale.ordinal()
                                    .domain(dataset1.map(function(d){ return d[0]; }))
                                    .rangeRoundBands([0, width], .1);

                    var y = d3.scale.linear()
                                    .domain([0, d3.max(dataset1, function(d) { return d[1]; })])
                                    .range([height, 0]);

                    var barHeight = d3.scale.linear()
                                         .domain([0, d3.max(dataset1, function(d) { return d[1]; })])
                                         .range([1, height]);

                    //Define X axis
                    var xAxis = d3.svg.axis()
                                      .scale(x)
                                      .orient("bottom");

                    //Define Y axis
                    var yAxis = d3.svg.axis()
                                      .scale(y)
                                      .orient("left");

                    //Create SVG element
                    var chart = d3.select("#chart4")
                                  .append("svg")  //append svg element inside #chart
                                  .attr("width", width+(2*margin.left)+margin.right)    //set width
                                  .attr("height", height+margin.top+margin.bottom);

                    var bar = chart.selectAll("g")
                                    .data(dataset1)
                                    .enter()
                                    .append("g")
                                    .attr("transform", function(d, i){
                                      return "translate("+x(d[0])+", 0)";});

                    //Create BARS
                    bar.append("rect")
                        .attr("y", function(d) {
                          return y(d[1]);
                        })
                        .attr("x", function(d,i){
                          return 45;
                        })
                        .attr("height", function(d) {
                          return barHeight(d[1]);
                        })
                        .attr("width", x.rangeBand())
                        .style('fill', '#000080');;

                    bar.append("text")
                        .attr("x", x.rangeBand()/2+35)
                        .attr("y", function(d) { return y(d[1]) + 2; })
                        .attr("dy", ".75em")
                        .text(function(d) { return d[1]; })
                        .style('fill', 'red');

                    chart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate("+margin.left+","+ height+")")
                        .call(xAxis)
                        .selectAll("text")
                            .style("text-anchor", "end")
                            .attr("dx", "-.8em")
                            .attr("dy", ".15em")
                            .attr("transform", "rotate(-65)" );

                    chart.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate("+margin.left+",0)")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Score");

                    d3.select("#buttonBurglary")
                        .on("click", function() {

                            var dataset1=datasetBURGLARY1;

                            y.domain([0, d3.max(dataset1, function(d) { return d[1]; })]);

                            chart.select(".y.axis")
                                .transition()
                                .duration(1000)
                                .call(yAxis);

                            //Update all bars
                            bar.select("rect")
                               .data(dataset1)
                               .transition()
                               .duration(1000)
                               .attr("y", function(d) {
                                  return y(d[1]);
                                })
                                .attr("height", function(d) {
                                  return height*d[1]/7071;
                                });

                            bar.select("text")
                                   .data(dataset1)
                                   .transition()
                                   .duration(1000)
                                    .attr("y", function(d) { return y(d[1]) + 2; })
                                    .attr("dy", ".75em")
                                    .text(function(d) { return d[1]; });

                            document.getElementById("2C").innerHTML="Historical data for Burglary";

                        });

                      d3.select("#buttonAssault")
                        .on("click", function() {

                            var dataset1=datasetASSAULT1;

                            y.domain([0, d3.max(dataset1, function(d) { return d[1]; })]);

                            chart.select(".y.axis")
                                .transition()
                                .duration(1000)
                                .call(yAxis);

                            //Update all bars
                            bar.select("rect")
                               .data(dataset1)
                               .transition()
                               .duration(1000)
                               .attr("y", function(d) {
                                  return y(d[1]);
                                })
                                .attr("height", function(d) {
                                  return barHeight(d[1]);
                                });

                            bar.select("text")
                                   .data(dataset1)
                                   .transition()
                                   .duration(1000)
                                    .attr("y", function(d) { return y(d[1]) + 2; })
                                    .attr("dy", ".75em")
                                    .text(function(d) { return d[1]; });


                            document.getElementById("2C").innerHTML="Historical data for Assult";

                        });


                });
