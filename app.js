

        //


        var allStatesData = [];
        var nationalUnEmp=[];
        var states;
        var map_states;
        var bNationalRate=true;


        var margin = {top: 20, right: 200, bottom: 110, left: 50},
 margin2 = {top: 430, right: 20, bottom: 30, left: 40},
 width = 960 - margin.left - margin.right,
 height = 500 - margin.top - margin.bottom,
 height2 = 500 - margin2.top - margin2.bottom-10;


        // Set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]),
        x2 = d3.scaleTime().range([0, width]),
        y2 = d3.scaleLinear().range([height2, 0]);


        // 40 Custom DDV colors
        var color= d3.scaleOrdinal().range(["#48A36D", "#56AE7C", "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);
   // var color=d3.scaleOrdinal(d3.schemeCategory10);
   // var color = d3.scaleOrdinal().range(["#0a72ff", "#1eff06", "#ff1902", "#2dfefe", "#827c01", "#fe07a6", "#a8879f", "#fcff04", "#c602fe", "#16be61", "#ff9569", "#05b3ff", "#ecffa7", "#3f8670", "#e992ff", "#ffb209", "#e72955", "#83bf02", "#bba67b", "#fe7eb1", "#7570c1", "#85bfd1", "#f97505", "#9f52e9", "#8ffec2", "#dad045", "#b85f60", "#fe4df2", "#75ff6c", "#78a55a", "#ae6a02", "#bebeff", "#ffb3b3", "#a4fe04", "#ffc876", "#c548a7", "#d6492b", "#547da7", "#358b06", "#95caa9", "#07b990", "#feb6e9", "#c9ff76", "#02b708", "#e7d08f", "#1090fb", "#a46d41", "#09ffa9", "#bb76b7", "#06b5b6", "#df307c", "#9b83fd", "#ff757c", "#0cd9fd"]);
    var idleTimeout,
                idleDelay = 350;
        //var xScale2 = d3.scaleTime()
        //        .range([0, width]); // Duplicate xScale for brushing ref later

        // Define the axes
        var xAxis = d3.axisBottom(x);

        var xAxis2 = d3.axisBottom(x2); // xAxis for brush slider

        var yAxis = d3.axisLeft(y);

        var context=null;
        var brush = null;
        // Define the line
        var brushx = d3.brushX()
                .extent([[0, 0], [width, height2]])
                .on("end", brushed);


        finalClusters=[];
        // Append the time series svg canvas
        var svg = d3.select(".plotframe").append("svg")
                .attr("width", "100%")
                .attr("height", height + margin.top + margin.bottom) //height + margin.top + margin.bottom
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        /* Initialize tooltip */
        var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                  //  console.log(d);
                    return "<strong>" + d.state + "</strong> <span style='color:red'>" + d.currentunemrate + "</span>";
                });
        svg.call(tip);
   // easel=d3.easeLinearIn(1);
        var line = d3.line()
        // .interpolate("basis")
                .x(function (d) {
                    return x(d.date);
                })
                .y(function (d) {
                    return y(d.currentunemrate);
                })
                .curve(d3.curveCatmullRom.alpha(0.25))

        // Create invisible rect for mouse tracking
        /*svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0)
                .attr("id", "mouse-tracker")
                .style("fill", "white");*/

        //append clip path for lines plotted, hiding those part out of bounds
    var parse = d3.timeParse("%m %Y");
    var state;
    var startYear;
    startYear = parse("01 1978");
    var endYear;
        var highLighters;
    endYear = parse("12 2016");
        svg.append("defs")
                .append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

        d3.tsv("statecodes.tsv", function (data) {
            states = data;
        });
    d3.csv("National_UnEmployment.csv", function (data) {
        data.forEach(function (d) {
                console.log(d);
            nationalUnEmp.push({
                "state_code": "National",
                "state": "National",
                    "date": parse(d.Period.substr(1) + " " + d.Year),
                    "currentunemrate": +d.Value,
                    "visible": true
                });
            });
        x.domain([startYear, endYear]);
        x2.domain([startYear, endYear]);
          var ymin  =d3.min(nationalUnEmp, function(d) {  return d.currentunemrate; } );
        var ymax= d3.max(nationalUnEmp, function(d) {  return d.currentunemrate; } )
        // ]);
        y.domain([
            ymin, ymax
        ]);

        nationalG = svg.append("g")
                .attr("class","national-g")

        nationalG.append("path")
                .attr("class", "line")
                .style("pointer-events", "all") // Stop line interferring with cursor
                .attr("clip-path", "url(#clip)") //use clip path to make irrelevant part invisible
                .style("stroke", "#000000")
                .attr("d", function () {
                    return bNationalRate ? line(nationalUnEmp) : null; // If d.visible is true then draw line for this d selection
                });
        });
        //

        var finaldata = {
            seriesrecord: []
        };


        //
        d3.tsv("UE_AllStates.tsv", function (data) {


                data.forEach(function (d) {
                    var series = d.series_id.trim();
                    if (d.period != "M13" && series.substr(18, 2) == "03") {
                        finaldata.seriesrecord.push({

                            "state_code": series.substr(5, 2),
                            "state": getState(series),
                            "date": parse(d.period.substr(1) + " " + d.year),
                            "currentunemrate": +d.value,
                            "visible": false
                        });
                    }


                });

                allStatesData = d3.nest()
                           .key(function (d) {
                               return d.state;
                           }).sortKeys(d3.ascending)
                           .entries(finaldata.seriesrecord);
              //  allStatesData.push({key:"National",values:nationalUnEmp,"visible": true})

              //  console.log("series");
                for (var i = 0; i < allStatesData.length; i++) {
                //    console.log(i + "" + allStatesData[i].key)
                }
                /* for(var index=0;index<tempData.length;index++){
                     if(allStatesData[tempData[index].key]==undefined)
                         allStatesData[tempData[index].key]=[];
                     allStatesData[tempData[index].key]= tempData[index].values;
         
                 }*/
                // debugger;
                // Scale the range of the data
                // x.domain(d3.extent(finaldata.seriesrecord, function(d) {
                // return d.date;
                //}));
                x.domain([startYear, endYear]);
                x2.domain([startYear, endYear]);
                //   y.domain([
                //     d3.min(symbols, function(c) { return d3.min(c.values, function(d) { return d.currentunemrate; }); }),
                // d3.max(symbols, function(c) { return d3.max(c.values, function(d) { return d.currentunemrate; }); })
                // ]);

                 color.domain(allStatesData.map(function(d){return d.key}));

               // console.log(allStatesData);
                brush = d3.brush()
                        .on("end", brushend);
                svg.append("g")
                        .attr("class", "brush")
                        .call(brush)
                        .selectAll('rect')
                        .attr('width', width)
                .attr('height', height);
            highLighters = svg.append("g")
                .attr("class", "highLighters");

            state = svg.selectAll(".state")
                       .data(allStatesData) // Select nested data and append to new svg group elements
                       .enter().append("g")
                       .attr("class", "state");
               // plotNational
                state.append("path")
                        .attr("class", "line")
                        .style("pointer-events", "all") // Stop line interferring with cursor
                        .attr("clip-path", "url(#clip)") //use clip path to make irrelevant part invisible
                        .style("stroke", function (d) {
                            return color(d.key);
                        })
                        .attr("fill","none")
                        .attr("clip-path", "url(#clip)") //use clip path to make irrelevant part invisible;
                        .on("mouseover",function (d,i) {
                            state.select("path")
                                    .transition()
                                    .duration(750)
                                    .ease(d3.easeLinear)
                                    .attr("stroke-opacity",function(d2){
                                        if(d2==d)
                                            return "1.0"
                                        else
                                            return "0.1"
                                    });
                           // d3.select(this).attr("stroke-opacity","1");
                                console.log(i);
                                mapg.selectAll("path")
                                        .transition()
                                        .duration(750)

                                        .attr("fill-opacity",function(d1,i1){
                                            var index = d1.stateid;
                                            console.log(index);
                                            if(i==index){

                                                return "1.0";
                                            }
                                            else
                                                return "0.1";

                                        })
                        })
                        .on("mouseout",function (d,i) {
                            state.select("path")
                                    .transition()
                                    .duration(750)

                                    .attr("stroke-opacity","1");
                            mapg.selectAll("path")
                                    .transition()
                                    .duration(750)

                                    .attr("fill-opacity","1.0")
                        });

                var legendSpace = 450 / allStatesData.length; // 450/number of issues (ex. 40)
            state.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("x", width + (margin.right / 3) - 15)
                    .attr("y", function(d, i) {
                        return (legendSpace) + i *1* (legendSpace) - 8;
                    }) // spacing
                    .attr("fill", function(d) {
                        return d.visible ? color(d.key) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey
                    })
                    .attr("class", "legend-box")
            state.append("text")
                    .attr("x", width + (margin.right / 3))
                    .attr("y", function(d, i) {
                        return (legendSpace) + i*1 * (legendSpace);
                    }) // (return (11.25/2 =) 5.625) + i * (5.625)
                    .text(function(d) {
                        return d.key;
                    })
                    .style("display","none");

                // Add the X Axis
                svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);
                //Time range selecter
                 context = svg.append("g")
                        .attr("class", "context")
                        .attr("transform", "translate(" + 0 + "," + margin2.top + ")");

                     context.append("g")
                  .attr("class", "axis axis--x")
                  .attr("transform", "translate(0," + height2 + ")")
                  .call(xAxis2);
                // Add the Y Axis
                svg.append("g")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("class", "y axis")
                        .call(yAxis);
                context.append("g")
               .attr("class", "brushX")
               .call(brushx)
               .call(brushx.move, x.range());

                tg = state.append("g")
                        .attr("class", "tg");


               /* tg.selectAll("circle")
                //.append("text")
                        .data(function (d) {
                            return d.values;
                        })
                        .enter().append("circle")

                        .attr("clip-path", "url(#clip)");*/ //use clip path to make irrelevant part invisible
                /*    .attr("x", function(d) {
                 //  console.log(d.date);
        
                 return x(d.date) // If d.visible is true then draw line for this d selection
                 })
                 .attr("y", function(d) {
                 // console.log(d.key);
        
                 return y(d.currentunemrate) // If d.visible is true then draw line for this d selection
                 })*/

                // draw legend
                svg.selectAll("circle")

                        .on("mouseover", function (d1, i1) {
                            svg.selectAll("circle")

                            .attr("fill-opacity", function (d) {
                                if (d1 == d) {
                                    return 1;
                                }
                                else
                                    return 0;
                            });

                            tip.show(d1);
                        })

                        .on('mouseout', tip.hide);

            finalClusters=clustering(allStatesData);

        });
        //

    // Add the text label for the x axis
    svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height+margin2.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Date")
            .attr("class","axis-label");

    // Add the text label for the Y axis
    svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Unemployment Rate")
            .attr("class","axis-label");
       
        state = svg.selectAll(".state")
                       .data(allStatesData) // Select nested data and append to new svg group elements
                       .enter().append("g")
                       .attr("class", "state");
        state.append("path")
                .attr("class", "line")
                .style("pointer-events", "none") // Stop line interferring with cursor
                .attr("clip-path", "url(#clip)") //use clip path to make irrelevant part invisible
                .style("stroke", function (d) {
                    return color(d.key);
                })
                .attr("clip-path", "url(#clip)");


        ContextState = svg.selectAll(".context-state")
                       .data(allStatesData) // Select nested data and append to new svg group elements
                       .enter().append("g")
                       .attr("class", "context-state");
        ContextState.append("path")
                .attr("class", "line")
                .style("pointer-events", "none") // Stop line interferring with cursor
                .attr("clip-path", "url(#clip)") //use clip path to make irrelevant part invisible
                .style("stroke", function (d) {
                    return color(d.key);
                })
                .attr("clip-path", "url(#clip)");

        function brushmove() {
            var extent = brush.extent();
            state.classed("selected", function (d) {
                is_brushed = extent[0] <= d.index && d.index <= extent[1];
                return is_brushed;
            });
        }

        function brushend() {
            //
            bAutoDomain = true;
            var s = d3.event.selection;
            if (!s) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
                bAutoDomain = false;
            } else {
                x.domain([s[0][0], s[1][0]].map(x.invert, x));
                y.domain([s[1][1], s[0][1]].map(y.invert, y));
                svg.select(".brush").call(brush.move, null);
            }
            zoom(bAutoDomain);
            
        }
        function plotNational() {

        }
        function idled() {
            idleTimeout = null;
        }

        function zoom(bAutoDomain) {
            var t = svg.transition().duration(750);


            // d3.select(".brush").call(brush.clear());
            if (!bAutoDomain) {
                maxY = findMaxY(allStatesData, startYear, endYear); // Find max Y rating value categories data with "visible"; true
                minY = findMinY(allStatesData, startYear, endYear); // Find max Y rating value categories data with "visible"; true
                y.domain([minY, maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
                x.domain([startYear, endYear]);
            }
            svg.select(".x.axis").transition(t).call(xAxis);
            svg.select(".y.axis").transition(t).call(yAxis);
            plotData();
        }
        //create brush function redraw scatterplot with selection
        function brushed() {
            var selection = d3.event.selection;
            x.domain(selection.map(x2.invert, x2));
            startYear = x.domain()[0];
            endYear = x.domain()[1];
            maxY = findMaxY(allStatesData, startYear, endYear); // Find max Y rating value categories data with "visible"; true
            minY = findMinY(allStatesData, startYear, endYear); // Find max Y rating value categories data with "visible"; true
            y.domain([minY, maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
            svg.select(".y.axis")
                    .transition()
                    .call(yAxis);
            svg.select(".x.axis").call(xAxis);
            plotData();
        }
        //Plot the data
        function plotData() {

            nationalG.select("path")
                    .transition()

                    .duration(750)
                    .ease(d3.easeLinear)
                    .attr("d", function () {
                        return bNationalRate ? line(nationalUnEmp) : null; // If d.visible is true then draw line for this d selection
                    });

            state.select("path")
                    .transition()
                    .duration(750)
                    .ease(d3.easeLinear)
                .attr("d", function (d) {
                    return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
                });
         //   clusterPlot();




                var v = false
            var temp = state.filter(function (d) {
                v = d.visible;
                return d.visible;
            });
            var temp2 = state.filter(function (d) {

                return d.visible == false;
            });
            temp.select(".tg")
         .selectAll("circle")
                  //  .attr("stroke", "#000")
                    .attr("fill", function (d, i) {
                        return color(d.date.getMonth());
                    })
                    .attr("fill-opacity", 0)
                    .attr("cx", function (d) {
                        return x(d.date);
                    })
                    .attr("cy", function (d) {
                        return y(d.currentunemrate);
                    })
                    .attr("r", function (d) {
                        return d.currentunemrate;
                    })
            temp2.select(".tg")
                    .selectAll("circle")
                    .attr("cx", function (d) {
                        //  console.log(d.date);

                        return null // If d.visible is true then draw line for this d selection
                    })
                    .attr("cy", function (d) {
                        // console.log(d.key);

                        return null // If d.visible is true then draw line for this d selection
                    })

            state.select("rect")
                    .transition()
                    .attr("fill", function (d) {
                        //    console.log(d.key+" "+d.visible);
                        return d.visible ? color(d.key) : "#F1F1F2";
                    });
            state.select("text")
                    .transition()
                    .style("display", function (d) {
                        //    console.log(d.key+" "+d.visible);
                        return d.visible ? "block" : "none";
                    });
            // console.log(map_states.select("path"))
            mapg.selectAll("path")
                    .transition()
                    .transition()
                    .duration(750)
                    .ease(d3.easeLinear)
                    .attr("fill", function (d2) {

                        if (d2.active == true) {
                            return color(allStatesData[d2.stateid].key);
                        }
                        else {
                            return "grey";
                        }
                    });

            highlight=[];
            highLighters.selectAll("circle")
                .data([]).exit().remove();
            state.select("path")

                .attr("pump",function(d){
                    var curr=d.values;
                    var bhigh=false;
                    if(d.visible!=true){
                        return false;
                    }
                    for(var i=1;i<curr.length;i++){
                        if((curr[i].currentunemrate-curr[i-1].currentunemrate)>3){
                            highlight.push({"date":curr[i].date,"currentunemrate":curr[i].currentunemrate,"state":d.key,"mode":"dec"});
                            bhigh=true;
                        }

                    }
                    for(var i=0;i<curr.length-1;i++){
                        if((curr[i+1].currentunemrate-curr[i].currentunemrate)>3){
                            highlight.push({"date":curr[i].date,"currentunemrate":curr[i].currentunemrate,"state":d.key,"mode":"inc"});
                            bhigh=true;
                        }

                    }
                    return bhigh
                });
            highLighters.selectAll("circle")
                .data(highlight)
                .enter().append("circle")
                .attr("fill", function (d, i) {
                    if(d.mode=="dec")
                    return "green";
                    else
                        return "red";
                })
                .attr("fill-opacity", 1)
                .attr("cx", function (d) {
                    return x(d.date);
                })
                .attr("cy", function (d) {
                    return y(d.currentunemrate);
                })
                .attr("r", function (d) {
                    return d.currentunemrate;
                })
                .attr("title",function (d) {
                    return d.date + ": "+d.currentunemrate;
                })
            highLighters.selectAll("circle")

                .on("mouseover", function (d1, i1) {

                    tip.show(d1);
                })

                .on('mouseout', tip.hide)

        }
        //Map SVG Logic
        var mapWidth = 400, mapHeight = 500, centered;

        var projection = d3.geoAlbersUsa()
                .scale(500)
                .translate([mapWidth / 2, mapHeight / 2]);

        var mappath = d3.geoPath()
                .projection(projection);

        var mapsvg = d3.select(".mapframe").append("svg")
                .attr("width", mapWidth)
                .attr("height", mapHeight);

        mapsvg.append("rect")
                .attr("class", "background")
                .attr("Width", mapWidth)
                .attr("Height", mapHeight)
                .on("click", clicked);

        var mapg = mapsvg.append("g");

        d3.json("usstates.json", function (error, us) {
            if (error) throw error;
            //  console.log( us);

            s = -1;
            map_states = mapg.append("g")
                    .attr("id", "states")
                    .selectAll("path")
                    .data(topojson.feature(us, us.objects.states).features)
                    .enter().append("path")
                    .attr('test', function (d, i) {

                        d.stateid = ++s;
                        d.active = false;
                        if (d.id == 42)
                            ++s;
                    })
                    .attr("d", mappath)
                    .on("click", clicked);
            for (var i = 0; i < topojson.feature(us, us.objects.states).features[i].length; i++) {
                //   console.log( topojson.feature(us, us.objects.states).features[i].stateid+""+ topojson.feature(us, us.objects.states).features[i].properties.name);
            }
            mapg.append("path")
                    .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
                    .attr("id", "state-borders")
                    .attr("d", mappath);
        });

        function clicked(d) {

            var index = d.stateid;
            if (index == 52) {
                index = 39;
            }
            d.active = !d.active;
            allStatesData[index].visible = !allStatesData[index].visible;
            maxY = findMaxY(allStatesData, startYear, endYear); // Find max Y rating value categories data with "visible"; true
            minY = findMinY(allStatesData, startYear, endYear); // Find max Y rating value categories data with "visible"; true
            y.domain([minY, maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
            svg.select(".y.axis")
                    .transition()
                    .call(yAxis);
            

            plotData();

        }

        function clusterPlot() {


            maxY = findMaxY(allStatesData, startYear, endYear); // Find max Y rating value categories data with "visible"; true
            minY = findMinY(allStatesData, startYear, endYear); // Find max Y rating value categories data with "visible"; true
            y.domain([minY, maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
            svg.select(".y.axis")
                .transition()
                .call(yAxis);


            state.select("path")
                .transition()
                .duration(750)
                .ease(d3.easeLinear)
                .attr("d", function (d) {
                    if( search(d.key))
                    return line(d.values)
                    else return null; // If d.visible is true then draw line for this d selection
                });
            function search(key) {
                for(var i=0;i<finalClusters[0].length;i++){
                    if(key==finalClusters[0][i])
                        return true;
                }
                return false;
            }

        }
        function getState(seriesid) {
            var code = seriesid.substr(5, 2);
            for (var i = 0; i < states.length; i++) {
                if (states[i].srd_code == code) {
                    return states[i].srd_text;
                }
            }
        }

        function findMaxY(data, startYear, endYear) { // Define function "findMaxY"
            var maxYValues = data.map(function (d) {
                if (d.visible) {
                    var val = [];
                    for (var i = 0; i < d.values.length; i++) {
                        if (d.values[i].date >= startYear && d.values[i].date <= endYear)
                            val.push(d.values[i]);
                    }

                    return d3.max(val, function (value) { // Return max rating value
                        return value.currentunemrate;
                    })
                }
            });
            for (var i = 0; i < nationalUnEmp.length; i++) {

                maxYValues.push(nationalUnEmp[i].currentunemrate);
            }
            return d3.max(maxYValues);
        }
        function findMinY(data, startYear, endYear) { // Define function "findMaxY"


            var minYValues = data.map(function (d) {
                if (d.visible) {
                    var val = [];
                    for (var i = 0; i < d.values.length; i++) {
                        if (d.values[i].date >= startYear && d.values[i].date <= endYear)
                            val.push(d.values[i]);
                    }
                    return d3.min(val, function (value) { // Return max rating value
                        return value.currentunemrate;
                    })
                }
            });
            for (var i = 0; i < nationalUnEmp.length; i++) {

                minYValues.push(nationalUnEmp[i].currentunemrate);
            }
            return d3.min(minYValues);

        }


        function clustering(allStatesData){
            var clusterinput=[];
            var finalClusters=[];
            var statesMap=[];
           for(var i=0;i<allStatesData.length;i++)
           {
               statesMap.push(allStatesData[i].key);
               subArray=[];
               var val=allStatesData[i].values;
               for(var j=0;j<val.length;j++){
                   subArray.push(val[j].currentunemrate);
               }
                clusterinput.push(subArray);
           }
           debugger;

            var km = new kMeans({
                K: 8
            });

            km.cluster(clusterinput);
            while (km.step()) {
                km.findClosestCentroids();
                km.moveCentroids();

                console.log(km.centroids);

                if(km.hasConverged()) break;
            }

            console.log('Finished in:', km.currentIteration, ' iterations');
            console.log(km.centroids, km.clusters);

            for(var k=0;k<km.clusters.length;k++){
                var subArray=[];
                var curr=km.clusters[k];
                for(var z=0;z<curr.length;z++){
                    subArray.push(statesMap[curr[z]]);
                }
                finalClusters.push(subArray);
            }
            return finalClusters;
        }
        // A modified d3.geo.albersUsa to include Puerto Rico.
        /*function albersUsaPr() {
            var ε = 1e-6;
        
            var lower48 = d3.geoalbers();
        
            // EPSG:3338
            var alaska = d3.geoconicEqualArea()
                    .rotate([154, 0])
                    .center([-2, 58.5])
                    .parallels([55, 65]);
        
            // ESRI:102007
            var hawaii = d3.geoconicEqualArea()
                    .rotate([157, 0])
                    .center([-3, 19.9])
                    .parallels([8, 18]);
        
            // XXX? You should check that this is a standard PR projection!
            var puertoRico = d3.geoconicEqualArea()
                    .rotate([66, 0])
                    .center([0, 18])
                    .parallels([8, 18]);
        
            var point,
                    pointStream = {point: function(x, y) { point = [x, y]; }},
                    lower48Point,
                    alaskaPoint,
                    hawaiiPoint,
                    puertoRicoPoint;
        
            function albersUsa(coordinates) {
                var x = coordinates[0], y = coordinates[1];
                point = null;
                (lower48Point(x, y), point)
                || (alaskaPoint(x, y), point)
                || (hawaiiPoint(x, y), point)
                || (puertoRicoPoint(x, y), point);
                return point;
            }
        
            albersUsa.invert = function(coordinates) {
                var k = lower48.scale(),
                        t = lower48.translate(),
                        x = (coordinates[0] - t[0]) / k,
                        y = (coordinates[1] - t[1]) / k;
                return (y >= .120 && y < .234 && x >= -.425 && x < -.214 ? alaska
                        : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii
                        : y >= .204 && y < .234 && x >= .320 && x < .380 ? puertoRico
                        : lower48).invert(coordinates);
            };
        
            // A naïve multi-projection stream.
            // The projections must have mutually exclusive clip regions on the sphere,
            // as this will avoid emitting interleaving lines and polygons.
            albersUsa.stream = function(stream) {
                var lower48Stream = lower48.stream(stream),
                        alaskaStream = alaska.stream(stream),
                        hawaiiStream = hawaii.stream(stream),
                        puertoRicoStream = puertoRico.stream(stream);
                return {
                    point: function(x, y) {
                        lower48Stream.point(x, y);
                        alaskaStream.point(x, y);
                        hawaiiStream.point(x, y);
                        puertoRicoStream.point(x, y);
                    },
                    sphere: function() {
                        lower48Stream.sphere();
                        alaskaStream.sphere();
                        hawaiiStream.sphere();
                        puertoRicoStream.sphere();
                    },
                    lineStart: function() {
                        lower48Stream.lineStart();
                        alaskaStream.lineStart();
                        hawaiiStream.lineStart();
                        puertoRicoStream.lineStart();
                    },
                    lineEnd: function() {
                        lower48Stream.lineEnd();
                        alaskaStream.lineEnd();
                        hawaiiStream.lineEnd();
                        puertoRicoStream.lineEnd();
                    },
                    polygonStart: function() {
                        lower48Stream.polygonStart();
                        alaskaStream.polygonStart();
                        hawaiiStream.polygonStart();
                        puertoRicoStream.polygonStart();
                    },
                    polygonEnd: function() {
                        lower48Stream.polygonEnd();
                        alaskaStream.polygonEnd();
                        hawaiiStream.polygonEnd();
                        puertoRicoStream.polygonEnd();
                    }
                };
            };
        
            albersUsa.precision = function(_) {
                if (!arguments.length) return lower48.precision();
                lower48.precision(_);
                alaska.precision(_);
                hawaii.precision(_);
                puertoRico.precision(_);
                return albersUsa;
            };
        
            albersUsa.scale = function(_) {
                if (!arguments.length) return lower48.scale();
                lower48.scale(_);
                alaska.scale(_ * .35);
                hawaii.scale(_);
                puertoRico.scale(_);
                return albersUsa.translate(lower48.translate());
            };
        
            albersUsa.translate = function(_) {
                if (!arguments.length) return lower48.translate();
                var k = lower48.scale(), x = +_[0], y = +_[1];
        
                lower48Point = lower48
                        .translate(_)
                        .clipExtent([[x - .455 * k, y - .238 * k], [x + .455 * k, y + .238 * k]])
                        .stream(pointStream).point;
        
                alaskaPoint = alaska
                        .translate([x - .307 * k, y + .201 * k])
                        .clipExtent([[x - .425 * k + ε, y + .120 * k + ε], [x - .214 * k - ε, y + .234 * k - ε]])
                        .stream(pointStream).point;
        
                hawaiiPoint = hawaii
                        .translate([x - .205 * k, y + .212 * k])
                        .clipExtent([[x - .214 * k + ε, y + .166 * k + ε], [x - .115 * k - ε, y + .234 * k - ε]])
                        .stream(pointStream).point;
        
                puertoRicoPoint = puertoRico
                        .translate([x + .350 * k, y + .224 * k])
                        .clipExtent([[x + .320 * k, y + .204 * k], [x + .380 * k, y + .234 * k]])
                        .stream(pointStream).point;
        
                return albersUsa;
            };
        
            return albersUsa.scale(1070);
        }*/

