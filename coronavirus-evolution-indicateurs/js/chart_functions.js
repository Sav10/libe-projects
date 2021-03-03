
////////////////////////////// Area Chart  //////
//////////////////////////////////////////////////////////





function makeAreachart(data_, kValue, dValue, color_chart, maxvalues, number_of_ticks_x=3) {

    // var kValue = graphParameters['selected_xRows'][0];
    // var dValues = graphParameters['selected_yRows'];
    var svg = d3.select("svg#minigraph");
    var g = svg.select('g.graphContainer');
    g.selectAll("*").remove();

    var g_inner = g.append('g').attr('class', 'innerGraph');

    g.append("g")
    .attr("class", "axis axis--x");

    g.append("g")
    .attr("class", "axis axis--y");

    var chart_vars = {
      'padding_left':10,
      'padding_top' : 10,
      'color_chart' : color_chart,
      'number_of_ticks_x' : number_of_ticks_x,
      'number_of_ticks_y' : 3,
      'width' : 203,
      'height' : 110
    }

      data = recalculateAndTransformValues(data_, kValue, [dValue])



      data = prepareLineChartData(data, kValue, [dValue]);

  var thisYMin = 0;
  // var thisYMax =  d3.max(data, function(d) { return d3.max(d, function(e) { return e['y_value'] }) });
  var thisYMax =  maxvalues[dValue];

  

  var xScale = d3.scaleLinear()
  .domain([d3.min(data, function(d) { return d3.min(d, function(e) { return e['x_value'] }) }),
    d3.max(data, function(d) { return d3.max(d, function(e) { return e['x_value'] }) }) ])
  .range([0, chart_vars.width]);


  var yScale = d3.scaleLinear()
  .domain([thisYMin,
    thisYMax
    ])
  .range([chart_vars.height, 0]);

  // changeAxis(xScale, yScale)

    


      axis_bottom = d3.axisBottom(xScale).ticks(chart_vars.number_of_ticks_x).tickFormat(function(d){return moment(d).format('MMMM')});
    


    if (dValue == 'hosp_pour_100k' || dValue == 'rea_pour_100k'){
    axis_bottom = d3.axisBottom(xScale).ticks(chart_vars.number_of_ticks_x).tickFormat(function(d, i){return i % 2 != 0 ? moment(d).format('MMMM') : ''});
        }

    axis_left = d3.axisLeft(yScale).ticks(chart_vars.number_of_ticks_y);


  g_inner
  .attr("transform", "translate(" + chart_vars.padding_left + "," + chart_vars.padding_top + ")");

  g.select("g.axis.axis--x")
  .attr("transform", "translate(" + chart_vars.padding_left + "," + (chart_vars.height + chart_vars.padding_top) +")")
  .call(axis_bottom)
  .selectAll("text")
  .style("text-anchor", "middle")
  .attr("dx", "0em")
  .attr("dy", "0.7em")
  .attr("transform", "rotate(0)");


g.select("g.axis.axis--y")
.attr('transform', 'translate(' + chart_vars.padding_left + ',' + chart_vars.padding_top + ')')
.call(axis_left);

    var area = d3.area()
    .x(function(d) { return xScale(d['x_value']) })
    .y0(yScale(yScale.domain()[0]))
    .y1(function(d) { return yScale(d['y_value'])})
    .curve(d3.curveCatmullRom.alpha(0.5));



// console.log(data)

    var allArea = g_inner
    .selectAll('.area')
    .data(data);

    allArea
    .transition()
    .duration(200)
    .attr('d', function(d) { return area(d) })
    .style('stroke', chart_vars.color_chart);

    allArea.exit().transition().duration(200).remove();

    allArea
    .enter()
    .append('path')
    .attr('class', 'area')
    .attr('d', function(d) { return area(d) })
    .style('stroke', chart_vars.color_chart )
    .style('fill', chart_vars.color_chart)
    .style('stroke-width', 2)
    .style('fill-opacity', 0.9);




    svg.select("g.axis--x path").style('stroke', 'white')
    svg.select("g.axis--y path").style('stroke', 'white')
    svg.selectAll("g.axis--x").selectAll('g.tick line').style('stroke', 'white')
    svg.selectAll("g.axis--x, g.axis--y").selectAll('g.tick line')
    svg.selectAll("g.axis--x").selectAll('g.tick line').style('stroke', 'white')
    svg.selectAll("g.axis--y").selectAll('g.tick line').style('stroke', 'e7e7e7')
    svg.select("g.axis--y").selectAll('g.tick line').attr('x1', chart_vars.width)


svg.select('g.innerGraph').select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })

    // svg.select("g.axis--x path").attr('stroke', manualReusableParameters.bottomAxisStroke.manual_range_value)
    // svg.select("g.axis--y path").attr('stroke', manualReusableParameters.leftAxisStroke.manual_range_value)
    // svg.selectAll("g.axis--x, g.axis--y").selectAll('g.tick line').attr('stroke', manualReusableParameters.ticksStroke.manual_range_value);
    // svg.select("g.axis--y").selectAll('g.tick line').attr('x1', thisLeftTickx1Value);
    // svg.select("g.axis--x").selectAll('g.tick line').attr('y1', thisBottomTickx1Value);

}



function prepareLineChartData(data, kValue, dValues) {
  var new_data = [];

  for (i in dValues) {
    var v = dValues[i];

    new_data.push(data.map(function(d) {
      return {
        x_value: d[kValue],
        name: v,
        y_value: +d[v]
      }
    }));
  }

  return new_data
}



                function recalculateAndTransformValues(data, kValue, dValues, kValues) {

                    var this_data = _.cloneDeep(data);
                    this_data.forEach(function(d){
                        for (i in dValues){
                            e = dValues[i]
                            d[e] = +String(d[e]).replace(',', '.');
                        }
                    })


                            this_data.forEach(function(d){
                                d[kValue] = moment(d[kValue], 'YYYY-MM-DD');
                            })
   

                            return this_data
                        }

function changeAxis(xScale, yScale){

    if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value){

        moment.locale('fr')
        function thisDateFormat (d){ return moment(d).format('L')}

    }
    else{

        function thisDateFormat (d){ return d}
    }

    if (graphParameters.selected_graph != 'barChartHorizontal'){
    axis_bottom = d3.axisBottom(xScale).ticks(manualReusableParameters.bottomAxisTickNumber.value).tickFormat(thisDateFormat);
    axis_left = d3.axisLeft(yScale).ticks(manualReusableParameters.leftAxisTickNumber.value).tickFormat(numbers_separators);
    }

    else{
    axis_bottom = d3.axisBottom(xScale).ticks(manualReusableParameters.bottomAxisTickNumber.value).tickFormat(numbers_separators);
    axis_left = d3.axisLeft(yScale).ticks(manualReusableParameters.leftAxisTickNumber.value).tickFormat(thisDateFormat);
    }
}



function formatNumbers(n){

  if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value && typeof(n) == "object"){
return n
  }

  var new_n = /^(\d+,\d+)$/.test(n) ? n.replace(',', '.') : n;
  new_n = +new_n;

  return new_n  

}


function changeAxis(xScale, yScale){

    if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value){

        moment.locale('fr')
        function thisDateFormat (d){ return moment(d).format('L')}

    }
    else{

        function thisDateFormat (d){ return d}
    }

    if (graphParameters.selected_graph != 'barChartHorizontal'){
    axis_bottom = d3.axisBottom(xScale).ticks(manualReusableParameters.bottomAxisTickNumber.value).tickFormat(thisDateFormat);
    axis_left = d3.axisLeft(yScale).ticks(manualReusableParameters.leftAxisTickNumber.value).tickFormat(numbers_separators);
    }

    else{
    axis_bottom = d3.axisBottom(xScale).ticks(manualReusableParameters.bottomAxisTickNumber.value).tickFormat(numbers_separators);
    axis_left = d3.axisLeft(yScale).ticks(manualReusableParameters.leftAxisTickNumber.value).tickFormat(thisDateFormat);
    }
}



function customizeAxis(){

    var svg = d3.select('svg');
    svg.select("g.axis--x path").attr('stroke', manualReusableParameters.bottomAxisStroke.manual_range_value)
    svg.select("g.axis--y path").attr('stroke', manualReusableParameters.leftAxisStroke.manual_range_value)
    svg.selectAll("g.axis--x, g.axis--y").selectAll('g.tick line').attr('stroke', manualReusableParameters.ticksStroke.manual_range_value);

    if (manualReusableParameters.leftTickSize.manual_range_value){
        if (manualReusableParameters.leftTickSize.manual_range_value == 'small'){var thisLeftTickx1Value = 0  }
            else if (manualReusableParameters.leftTickSize.manual_range_value == 'fullWidth'){var thisLeftTickx1Value = width  }
                else if (manualReusableParameters.leftTickSize.manual_range_value == 'invisible'){var thisLeftTickx1Value = -6  }
            }
        else {var thisLeftTickx1Value = 0  }

            if (manualReusableParameters.bottomTickSize.manual_range_value){
                if (manualReusableParameters.bottomTickSize.manual_range_value == 'small'){var thisBottomTickx1Value = 0  }
                    else if (manualReusableParameters.bottomTickSize.manual_range_value == 'fullHeight'){var thisBottomTickx1Value = -height  }
                        else if (manualReusableParameters.bottomTickSize.manual_range_value == 'invisible'){var thisBottomTickx1Value = 6  }
                    }
                else {var thisBottomTickx1Value = 0  }

                    svg.select("g.axis--y").selectAll('g.tick line').attr('x1', thisLeftTickx1Value);
                    svg.select("g.axis--x").selectAll('g.tick line').attr('y1', thisBottomTickx1Value);

}