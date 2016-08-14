var w = 750;
var h = 500;
var padding = 80;

var dataset2003=[];
var dataset2015=[];
var x;

d3.json("2003.json", function(data) {
    for (var i = 0, l=data.length, k=0, j=0; i <l; i++) {
        if (data[i]['YEAR']==2003) {
            dataset2003.push([]);
            dataset2003[k].push(data[i]['DISTRICT']);
            dataset2003[k].push(data[i]["VEHICLETHEFT"]); 
            dataset2003[k].push(data[i]["PROSTITUTION"]);
            dataset2003[k].push(data[i]["FULL"]);
            k++;
        }
        else {
            dataset2015.push([]);
            dataset2015[j].push(data[i]['DISTRICT']);
            dataset2015[j].push(data[i]["VEHICLETHEFT"]); 
            dataset2015[j].push(data[i]["PROSTITUTION"]); 
            dataset2015[j].push(data[i]["FULL"]); 
            j++; 
        };
    };

    x=dataset2003;

    var arrayVehicletheft2003=[];

    for (var i =0, l=dataset2003.length ; i < l; i++) {
        arrayVehicletheft2003.push(dataset2003[i][1]);
    };

    var arrayProstitution2003=[];

    for (var i =0, l=dataset2003.length ; i < l; i++) {
        arrayProstitution2003.push(dataset2003[i][2]);
    };

    var arrayMax2015=[];

    for (var i =0, l=dataset2015.length ; i < l; i++) {
        arrayMax2015.push(dataset2015[i][3]);
    };

    //var maxProstitution2003=Math.max(arrayProstitution2003);

    function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
    }

    var maxProstitution2003=getMaxOfArray(arrayProstitution2003);
    var maxVehicletheft2003=getMaxOfArray(arrayVehicletheft2003);
    var max2015=getMaxOfArray(arrayMax2015);

    var xScale = d3.scale.linear()
                         .domain([0, d3.max(dataset2003, function(d) { return d[2]; })])
                         .range([padding, w - padding * 2]);

    var yScale = d3.scale.linear()
                         .domain([0, d3.max(dataset2003, function(d) { return d[1]; })])
                         .range([h - padding, padding]);

    var rScale = d3.scale.linear()
                         .domain([0, d3.max(dataset2015, function(d) { return d[3]; })])
                         .range([1, 20]);

    //Define X axis
    var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")
                      .ticks(7);

    //Define Y axis
    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(7);

    //Create SVG element
    var svg = d3.select("#chart2")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    //Create circles
    
    svg.selectAll("circle")
         .data(dataset2003)
         .enter()
         .append("circle")
         .attr("cx", function(d) {
              return xScale(d[2]);
         })
         .attr("cy", function(d) {
              return yScale(d[1]);
         })
         .attr("r", function(d) {
              return rScale(d[3]);
          })
         .attr("clip-path", "url(#chart-area)")
         .attr('fill',function(d){
              var a=d[3];
              var b=max2015;
              var c=Math.floor(a/b*256);
              return 'rgb('+ c +','+ (255-c) +',0)';
         });

    svg.append("clipPath")    
        .attr("id", "chart-area")   
        .append("rect") 
        .attr("x", padding)
        .attr("y", padding-20)
        .attr("width", w - padding * 3+20)
        .attr("height", h-padding*2+20);

    //Add labels   
    svg.selectAll("text")
               .data(dataset2003)
               .enter()
               .append("text")
               .text(function(d) {
                    return d[0];
               })
               .attr("x", function(d) {
                    return xScale(d[2])+rScale(d[3])/Math.sqrt(2);
               })
               .attr("y", function(d) {
                    return yScale(d[1])-rScale(d[3])/Math.sqrt(2);
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "black");
    
    //Create X axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);
    
    //Create Y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    svg.append("rect")                             
       .attr("id", "circles")                   
       .attr("clip-path", "url(#chart-area)")   
       .selectAll("circle")                     
       .data(dataset2003)
       .enter()
       .append("circle");

    svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (padding/2) +","+(h/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Number of vehicle theft cases");

    svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (w/2-30) +","+(h-(padding/2))+")")  // centre below axis
            .text("Number of prostitution cases");

    d3.select("#button2003")
        .on("click", function() {
            dataset = dataset2003;
            x=dataset2003;
            //Update all circles
            circleUpdater();
            document.getElementById("2B").innerHTML="Crime data from 2003";

        });

        d3.select("#button2015")
        .on("click", function() {
            dataset = dataset2015;
            x=dataset2015;
            //Update all circles
            circleUpdater();
            document.getElementById("2B").innerHTML="Crime data from 2015";

        });

        function circleUpdater() {
          svg.selectAll("circle")
               .data(dataset)
               .transition()
               .duration(1000)
               .attr("cx", function(d) {
                    return xScale(d[2]);
               })
               .attr("cy", function(d) {
                    return yScale(d[1]);
               })
               .attr("r", function(d) {
                return rScale(d[3]);
                })
               .attr('fill',function(d){
                    var a=d[3];
                    var b=max2015;
                    var c=Math.floor(a/b*256);
                    return 'rgb('+ c +','+ (255-c) +',0)';
               });

            svg.selectAll("text")
                   .data(dataset)
                   .transition()   
                   .duration(1000)
                   .text(function(d) {
                        return d[0];
                   })
                   .attr("x", function(d) {
                    return xScale(d[2])+rScale(d[3])/Math.sqrt(2);
                   })
                   .attr("y", function(d) {
                        return yScale(d[1])-rScale(d[3])/Math.sqrt(2);
                   });
        }
});