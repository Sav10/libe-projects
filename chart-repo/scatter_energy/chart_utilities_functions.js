
moment.locale('fr')

function makeVarSwitch (rowsToSwitch, this_function, data){

  var allSwitch = d3.select('#varSwitch')
  .selectAll('span.tag')
  .data(rowsToSwitch);

  allSwitch
  .text(function(d){return d});

  allSwitch.exit().remove();

  allSwitch
  .enter()
  .append('span')
  .attr('class', 'tag')
  .text(function(d){return d})
  .on('click', function(d){

    rowsToSwitch.splice(rowsToSwitch.indexOf(d), 1);
    rowsToSwitch.unshift(d);
    manualCustomParameters['rowsToSwitch'] = rowsToSwitch;

    this_function(data);



    if (typeof(responsivefy) !== 'undefined'){

    var svg = d3.select("svg")
      .call(responsivefy);
  }

    d3.selectAll('#varSwitch span.tag')
    .classed('is-primary', false);

        d3.select(this)
    .classed('is-primary', true);
}

);

  d3.select('#varSwitch span.tag')
  .classed('is-primary', true);

}


function thisArrayIfObject(objectData) {

  var arrayData = objectData.map(function(d) { return d3.values(d) });
  arrayData.unshift(d3.keys(objectData[0]));
  return arrayData

}


// d3.select('#chart')
// .style('display' ,'none');

// d3.select('#noChart')
// .style('display' ,'block');


// var thisTitle = d3.select('#chart #chartTitle').node().cloneNode(true)

// d3.select('#noChart').node().insertBefore(thisTitle, d3.select('#my-data-table_wrapper').node())



////////////////////////////////////
//////////////////////CHART UTILITIES FUNCTIONS

function show_tooltip(d, name, vars, thoseParam) {

 var d = d.data ? d.data : d;

 if (d){
    d3.select("#tooltip").style('display', 'block');

    var dx = d3.event.pageX;
    var dy = d3.event.pageY - 28;

    // var this_chart_width = Math.round(svgGraphContainer.node().getBBox().width);
    var this_chart_right = d3.select('#chart svg').node().getBoundingClientRect().right

        var this_inner_html = '';
        this_inner_html = name ? '<strong>' + name + '</strong><br />' : '';
        if (vars){
            for (i in vars){
                this_inner_html += '<strong>'+ vars[i]['name'] + '</strong> : '+ vars[i]['value']+ '</strong><br />'
            }
        }


        if (graphParameters.selected_tooltip && graphParameters.selected_tooltip.length > 0){
            var param_array = [graphParameters.selected_tooltip]
            // var tooltip_values = 1
        }
        else if (thoseParam){
            var param_array = thoseParam
        }
        else{
                        var param_array = [graphParameters.selected_xRows, graphParameters.selected_yRows, 
                graphParameters.selected_size, graphParameters.selected_color, graphParameters.selected_label];
        }

        for (i in param_array){
         var inner_array =param_array[i];
         if (_.isEmpty(inner_array) == false){
          for (j in inner_array){

           this_inner_html += '<strong>'+ inner_array[j] + '</strong> : '+ (d[inner_array[j]] ?  formatIfNumbers(d[inner_array[j]]) : formatIfNumbers(d3.values(d)[i]))+ '</strong><br />'
       }
   } 
}

if (manualReusableParameters.caseCustomTooltip.value && manualReusableParameters.customTooltips.value){

    this_inner_html = manualReusableParameters.customTooltips.value;

    var thoseValuesArray = this_inner_html.match(/\[\[(.*?)\]\]/g);

    var TextTransformationFonctions = {'round':_.round,
'frenchDate': dateToFrench,
'number_separator':numbers_separators,
'frenchDatetime': datetimeToFrench}

    for (i in thoseValuesArray){
        var v = thoseValuesArray[i];
        var k = v.replace('[[', '').replace(']]', '');
        k = k.split('|')
        var k0 = k[0]
        var d0 = d[k0]
        // if (k[1] ){

            // console.log(k[1]);
            // console.log(TextTransformationFonctions[k[1]]);
            // console.log(TextTransformationFonctions[k[1]]);
            // console.log(TextTransformationFonctions[k[1]](+d[k0]));
            // console.log(d[k0]);
            // console.log(Math.round(+d[k0]));
        // }
        if (k[1] && k[1] == 'frenchDate'){
            d0 = TextTransformationFonctions[k[1]](d0);
            this_inner_html = this_inner_html.replace(v, d0);
        }
        else if (k[1] && k[1] == 'frenchDatetime'){
            d0 = TextTransformationFonctions[k[1]](d0);
            this_inner_html = this_inner_html.replace(v, d0);
        }
        else{
        d0 = k[1] ? (k[2] ? TextTransformationFonctions[k[1]](+d0, k[2]) : TextTransformationFonctions[k[1]](+d0)) : d0;
        this_inner_html = this_inner_html.replace(v, d0)

        }
    }
}


d3.select("#tooltip")
.classed('is-active', true)
.html(this_inner_html);

var thisTooltip = d3.select('#tooltip').node().getBoundingClientRect();

if (dx > (this_chart_right - thisTooltip.width)){

dx = (this_chart_right - thisTooltip.width - 10)

}


d3.select("#tooltip")
.style("left", (dx) + "px")
.style("top", (dy) + "px");

}
else
{
    d3.select("#tooltip").style('display', 'none');
}

}

function hide_tooltip() {

    d3.select("#tooltip")
    .classed('is-active', false);

    d3.select("#tooltip")
    .style('display', 'none');

}

function dateToFrench(date){

return moment(date).format('LL')

}

function datetimeToFrench(datetime){

return moment(datetime).format('LL à HH:00')

}


function numbers_separators(num){
    return num.toLocaleString('fr-FR', {minimumFractionDigits: 0});
}

function indice100growth(array){

// var aus = dataFromFile.map(function(d) { return +d.AUS });

var this_array = [100]
for (i in array){
    var d = array[i];
    this_array.push(this_array[i] * (100 + d));
}

return this_array;

}

function drawLegend(){

    var svgGraphContainer = d3.select('svg g.graphContainer');
    svgGraphContainer.select('g.legendOrdinal').remove();

    if (manualReusableParameters.caseLegend.value){

        var thisLegendorientation =  manualReusableParameters.legendOrientation.manual_range_value ? manualReusableParameters.legendOrientation.manual_range_value : manualReusableParameters.legendOrientation.initial_range_value;
        var this_inner_padding = manualReusableParameters.inner_padding_legend.value ? manualReusableParameters.inner_padding_legend.value : manualReusableParameters.inner_padding_legend.initial_value;

        svgGraphContainer.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate("+ (width - 100 )+  ",20)");

        if (manualReusableParameters.persColorsCheck.value){

            color.domain(d3.keys(graphParameters.personalizedColorsObject))
      }

        var ordinal = d3.scaleOrdinal()
        .domain(color.domain())
        .range(color.range());

        var legendOrdinal = d3.legendColor()
        .orient(thisLegendorientation)
        .shapeWidth(15)
        .shapeHeight(15)
        .shapePadding(this_inner_padding)
        .scale(ordinal);

        if (manualReusableParameters.colorizeField && manualReusableParameters.colorizeFieldText.value){

            var this_new_color_range = ['#e60004', '#7c7c7b']
            var thisOtherLegendText = manualReusableParameters.textLegendOtherCat.value ? manualReusableParameters.textLegendOtherCat.value : 'Autres';
            var this_new_domain = [manualReusableParameters.colorizeFieldText.value, thisOtherLegendText];

            ordinal
            .domain(this_new_domain)
            .range(this_new_color_range)
        }

        svgGraphContainer.select(".legendOrdinal")
        .call(legendOrdinal);

        var thisElementWidth = Math.round(d3.select('.legendOrdinal').node().getBBox().width);
        var thisElementHeight = Math.round(d3.select('.legendOrdinal').node().getBBox().height);
        var this_chart_width = Math.round(svgGraphContainer.node().getBBox().width);
        var this_chart_height = Math.round(svgGraphContainer.node().getBBox().height);

        svgGraphContainer.selectAll(".legendOrdinal text.label")
        .style('font-size', '0.8rem');

        var this_padding_left = manualReusableParameters.padding_left_legend.value ? manualReusableParameters.padding_left_legend.value : 0;
        var this_padding_top = manualReusableParameters.padding_top_legend.value ? manualReusableParameters.padding_top_legend.value : 0;

        if (manualReusableParameters.caseLegend.manual_range_value){
            if (manualReusableParameters.caseLegend.manual_range_value == 'topRight'){
                var thisElementLeftMargin = (this_chart_width - thisElementWidth + this_padding_left);
                var thisElementTopMargin = (20 + this_padding_top);
            }
            else if (manualReusableParameters.caseLegend.manual_range_value == 'topLeft'){
                var thisElementLeftMargin = 20 + this_padding_left;
                var thisElementTopMargin = (20 + this_padding_top);
            }
            else if (manualReusableParameters.caseLegend.manual_range_value == 'bottomLeft'){
                var thisElementLeftMargin = (20 + this_padding_left);
                var thisElementTopMargin = (this_chart_height - thisElementHeight + this_padding_top );
            }
            else if (manualReusableParameters.caseLegend.manual_range_value == 'bottomRight'){
                var thisElementLeftMargin = (this_chart_width - thisElementWidth  + this_padding_left);
                var thisElementTopMargin = (this_chart_height - thisElementHeight + this_padding_top ); 
            }
        }
        else{
            var thisElementLeftMargin = (this_chart_width - thisElementWidth  + this_padding_left);
            var thisElementTopMargin = (20 + this_padding_top);
        }

        svgGraphContainer.select(".legendOrdinal")
        .attr("transform", "translate("+ thisElementLeftMargin +  ","+ thisElementTopMargin + ")");

        if (manualReusableParameters.persColorsCheck.value){
            svgGraphContainer.selectAll(".legendOrdinal g.cell rect").style('fill', function(d){return colorUpdated(d)})
        }
    }
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

            function xAxisLabel(sel, labelText){

                if (manualReusableParameters.xAxisLabel.value && manualReusableParameters.xAxisLabelText.value){
                    var labelText = manualReusableParameters.xAxisLabelText.value;
                }
                else{
                    var labelText = "";
                }

                var thisPadding =  manualReusableParameters.xAxisLabelPadding.value ? +manualReusableParameters.xAxisLabelPadding.value : 0;

                var this_sel = sel
                .selectAll('text.xAxisLabel')
                .data([labelText]);

                this_sel.exit().remove();

                this_selE = this_sel
                .enter()
                .append("text")
                .attr('class', 'xAxisLabel');

                this_sel
                .merge(this_selE)         
                .attr("transform",
                    "translate(" + (width/2) + " ," + 
                    (+thisPadding + height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .html(function(d){return d});

            }

            function yAxisLabel(sel, labelText){

                if (manualReusableParameters.yAxisLabel.value && manualReusableParameters.yAxisLabelText.value){
                    var labelText = manualReusableParameters.yAxisLabelText.value;
                }
                else{
                    var labelText = "";
                }

                var thisPadding =  manualReusableParameters.yAxisLabelPadding.value ? +manualReusableParameters.yAxisLabelPadding.value : 0;
                var this_sel = sel
                .selectAll('text.yAxisLabel')
                .data([labelText]);

                this_sel.exit().remove();

                this_selE = this_sel
                .enter()
                .append("text")
                .attr('class', 'yAxisLabel')
                .attr("transform", "rotate(-90)")
                ;

                this_sel
                .merge(this_selE)         
                .attr("y", (+thisPadding - margin.left))
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .html(function(d){return d});

            }

            function xScaleType(){

                if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value){
                    return d3.scaleTime()
                }
                else{
                    return d3.scaleLinear()
                }

            }

function ifLogScale(){

                if (manualReusableParameters.ifLogScale.value && manualReusableParameters.ifLogScale.manual_range_value){
                    return d3.scaleLog()
                }
                else{
                    return d3.scaleLinear()
                }
            }

            function recalculateAndTransformDate(data) {

                var this_data = _.cloneDeep(data);
                moment.locale('fr')

                    if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value){
                        this_data.forEach(function(d){
                            d[manualReusableParameters.dateField.manual_range_value] = moment(d[manualReusableParameters.dateField.manual_range_value], manualReusableParameters.dateFieldFormat.value);
                        })
                    }
                    else if (manualReusableParameters.automaticDate.value== true){



                        this_data = automaticDateRecognition(this_data)
                    }

                    return this_data
                }

                function recalculateAndTransformValues(data, kValue, dValues, kValues) {

                    var this_data = _.cloneDeep(data);
                    this_data.forEach(function(d){
                        for (i in dValues){
                            e = dValues[i]
                            d[e] = +String(d[e]).replace(',', '.');
                        }
                    })

                    if (manualReusableParameters.trimKValue.value){
                        this_data.forEach(function(d){
                            d[kValue] = _.trim(d[kValue]);
                        })
                    }

                    if (_.isEmpty(manualCustomParameters['fieldsToReplace']) == false){

                        for(i in manualCustomParameters['fieldsToReplace'])
                            if (manualCustomParameters['fieldsToReplace'][i].name && manualCustomParameters['fieldsToReplace'][i].newValue && manualCustomParameters['fieldsToReplace'][i].oldValue){

                                this_data.forEach(function(d){
                                    d[manualCustomParameters['fieldsToReplace'][i].name] = d[manualCustomParameters['fieldsToReplace'][i].name] == manualCustomParameters['fieldsToReplace'][i].oldValue ? manualCustomParameters['fieldsToReplace'][i].newValue : d[manualCustomParameters['fieldsToReplace'][i].name];
                                })


                            }

                        }

                    if (_.isEmpty(manualCustomParameters['filteredFields']) == false){
                        for(i in manualCustomParameters['filteredFields']){
                            
                            var r = manualCustomParameters['filteredFields'][i]
                            this_data = this_data.filter(function(d){return eval('"' + d[r.name] + '"' + r.comparator + '"' + r.varToCompare + '"')})

                        }

                        }

                        if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value){
                            this_data.forEach(function(d){
                                d[manualReusableParameters.dateField.manual_range_value] = moment(d[manualReusableParameters.dateField.manual_range_value], manualReusableParameters.dateFieldFormat.value);
                            })
                        }
                        else{


                          if (manualReusableParameters.automaticDate.value== true){

                            this_data = automaticDateRecognition(this_data)
                          }

                            }


                            if (kValues && kValues[1]){
                                this_data = getPivotArrayOfObj(this_data, kValue, kValues[1], dValues[0])
                            }

                            return this_data
                        }

function automaticDateRecognition(this_data){


                            if (d3.sum(this_data.map(function(d){return isNaN(+d[graphParameters.selected_xRows[0]])})) >= 1){

                                if(d3.sum(dataFromFile.map(function(d){return  moment(d[graphParameters.selected_xRows[0]]).isValid() == false})) < 1){

                                    this_data.forEach(function(d){
                                        d[graphParameters.selected_xRows[0]] = moment(d[graphParameters.selected_xRows[0]]);
                                    })

                                    manualReusableParameters.dateField.manual_range_value = graphParameters.selected_xRows[0]
                                    manualReusableParameters.dateField.value = true
                                    manualReusableParameters.dateFieldFormat.value = 'YYYY-MM-DD'
                                }

                                else  if(d3.sum(dataFromFile.map(function(d){return  moment(d[graphParameters.selected_xRows[0]], 'DD-MM-YYYY').isValid() == false})) < 1){

                                    this_data.forEach(function(d){
                                        d[graphParameters.selected_xRows[0]] = moment(d[graphParameters.selected_xRows[0]], 'DD-MM-YYYY');
                                    }) 
                                    manualReusableParameters.dateField.manual_range_value = graphParameters.selected_xRows[0]
                                    manualReusableParameters.dateField.value = true
                                    manualReusableParameters.dateFieldFormat.value = 'DD-MM-YYYY'

                                }
                                    else  if(d3.sum(dataFromFile.map(function(d){return  moment(d[graphParameters.selected_xRows[0]], 'YYYY-DD-MM').isValid() == false})) < 1){

                                        this_data.forEach(function(d){
                                            d[graphParameters.selected_xRows[0]] = moment(d[graphParameters.selected_xRows[0]], 'YYYY-DD-MM');
                                        })

                                    manualReusableParameters.dateField.manual_range_value = graphParameters.selected_xRows[0]
                                    manualReusableParameters.dateField.value = true
                                    manualReusableParameters.dateFieldFormat.value = 'YYYY-DD-MM'
                                    }
                                }

                                return this_data
}

function add_tooltip_values(this_grouped_data, data, kValue){

        this_grouped_data.forEach(function(d) {
            var o = data.filter(function(e){return e[kValue] ==  d[kValue]})[0];
        for (i in graphParameters.selected_tooltip){
            var this_el = graphParameters.selected_tooltip[i]
            if (d3.keys(d).indexOf(this_el) == -1){
                d[this_el] = o[this_el];
            }
        }
    })
    return this_grouped_data
}

function addCustomCode(){

if (manualReusableParameters.moveElements.value)
{
d3.select('.parameterElement.selectedElementType input').attr('readonly', 'true')
d3.select('.parameterElement.selectedParentElementType input').attr('readonly', 'true')
selectElementToDrag()
ReplaceThoseElements()}
else
{removeElementDrag()}


if (manualReusableParameters.emptyMovedElements.value == true){
emptyMovedElements()
}

if (eval(manualReusableParameters.customCode.value))
    {eval(manualReusableParameters.customCode.value);
    }
}


function emptyMovedElements(){

manualReusableParameters.elementMoved.thoseElements = {};
manualReusableParameters.elementMoved.thoseElementsOrder = [];

manualReusableParameters.emptyMovedElements.value == false;


}


function colorizeOnlyOneCategory(listOfObjectsToColorize){



    if (manualReusableParameters.colorizeField.value && manualReusableParameters.colorizeFieldSelectField.manual_range_value && manualReusableParameters.colorizeFieldText.value){
        var this_field = manualReusableParameters.colorizeFieldSelectField.manual_range_value;
        var this_value = manualReusableParameters.colorizeFieldText.value;

        console.log(this_field, this_value)

// var this_color_range = _.cloneDeep(color.range())
var this_color_range = ['#e60004', '#7c7c7b']

for (i in listOfObjectsToColorize){

    var thisObjectToColorize = listOfObjectsToColorize[i]
    var this_svg_element = thisObjectToColorize['svg_element']
    var this_if_first_value = typeof(thisObjectToColorize.look_in_object) !== 'undefined' ? thisObjectToColorize['look_in_object'] !== false ? true : false : false;
    var this_look_in_object = thisObjectToColorize['look_in_object']
    var this_if_reappend_nodes = thisObjectToColorize['reappend_nodes'] ? true : false ;
    var those_property_types = thisObjectToColorize['property_types']
    // console.log(this_svg_element, this_if_first_value, this_field, this_value, those_property_types)

    if (this_if_first_value){
        var those_svg_elements = d3.selectAll('svg g.innerGraph ' + this_svg_element).filter(function(d){return d[this_look_in_object][this_field] == this_value})
    }

    else{
       var those_svg_elements = d3.selectAll('svg g.innerGraph ' + this_svg_element).filter(function(d){return d[this_field] == this_value})
    }

    var thoseNodes = those_svg_elements.nodes()

    for (j in those_property_types){
        var this_property_type = those_property_types[j]
        d3.selectAll('svg g.innerGraph ' + this_svg_element).style(this_property_type,this_color_range[1])
        those_svg_elements.style(this_property_type, this_color_range[0]);




    }

    if (this_if_reappend_nodes){
    for (j in thoseNodes){
        var this_node = thoseNodes[j]
        this_node.parentNode.appendChild(this_node)
    } 
}
}

}
else{

for (i in listOfObjectsToColorize){

    var thisObjectToColorize = listOfObjectsToColorize[i]
    var this_svg_element = thisObjectToColorize['svg_element']
    var those_property_types = thisObjectToColorize['property_types']
    for (j in those_property_types){
        var this_property_type = those_property_types[j]
        d3.selectAll('svg g.innerGraph ' + this_svg_element).style(this_property_type,null)
    }
}
}
}

function getPivotArrayOfObj(dataArray, rowIndex, colIndex, dataIndex) {

        var result = {}, ret = [];
        var newCols = [];
        for (var i = 0; i < dataArray.length; i++) {
 
            if (!result[dataArray[i][rowIndex]]) {
                result[dataArray[i][rowIndex]] = {};
            }
            result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];
 
            //To get column names
            if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
                newCols.push(dataArray[i][colIndex]);
            }
        }
 
        newCols.sort();
        var item = [];
 
        //Add content 
        for (var key in result) {
            item = {};
            item[rowIndex] = key;
            for (var i = 0; i < newCols.length; i++) {
                //item.push(result[key][newCols[i]] || "-");
                item[newCols[i]] = result[key][newCols[i]]
            }
            ret.push(item);
        }
        return ret;
    }



///////////////////////////////////////////////////////////////
//////////////////// UTILITIES FUNCTIONS

function formatNumbers(n){

  if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value && typeof(n) == "object"){
return n
  }

  var new_n = /^(\d+,\d+)$/.test(n) ? n.replace(',', '.') : n;
  new_n = +new_n;

  return new_n  

}

function formatIfNumbers(n){

  if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value && typeof(n) == "object"){


if (moment(n, manualReusableParameters.dateFieldFormat.value).isValid() == true){
moment.locale('fr')


return moment(n).format('L')

}

return n
  }
  else if (isNaN(n)){
    return n
  }
  else if (n > 100){
    return _.round(n)
  }

  return _.round(n, 2)

}


function formatNumbersDate(n, field){

  if (manualReusableParameters.dateField.value == true && manualReusableParameters.dateField.manual_range_value == field){
    return +moment(n, manualReusableParameters.dateFieldFormat.value)
  }
  return +n  
}

  var parseTime = d3.timeParse('%Y/%m/%d');

  function normalizeChars(text) {
    return _.camelCase(_.deburr(text))
  }

function arrayIfObject(objectData) {

  var arrayData = objectData.map(function(d) { return d3.values(d) });
  arrayData.unshift(d3.keys(objectData[0]));
  return arrayData

}

function objectIfArray(arrayData) {

  var objectData = arrayData.slice(1).map(function(d) {
    var this_object = {}
    for (i in arrayData[0]) {
      this_object[arrayData[0][i]] = d[i];
    }
    return this_object
  })
  return objectData
}

function groupbyKV(data, key, value, this_function) {
  var result = d3.nest()
  .key(function(d) { return d[key] })
  .rollup(function(v) { return this_function(v, function(e) { return e[value] })
})
  .entries(data)
  return result
}

function groupbyKVMultiple(data, key, values, this_function) {
  var result = d3.nest()
  .key(function(d) { return d[key] })
  .rollup(function(v) {
    var those_values = {};
    for (i in values){
      var this_value = values[i];
      those_values[this_value] = this_function(v, function(e) { return e[this_value]} )
    }

    return { those_values}
  })
  .entries(data);

  result = result.map(function(d){ return _.assign({[key]: d['key'] }, d['value']['those_values'])});

  return result
}

function prepareLineChartData(data, kValue, dValues) {
  var new_data = [];

  for (i in dValues) {
    var v = dValues[i];

    new_data.push(data.map(function(d) {
      return {
        x_value: formatNumbers(d[kValue]),
        name: v,
        y_value: formatNumbers(d[v])
      }
    }));
  }

  return new_data
}

function prepareLineChartIndice100Growth(data, kValue, dValues) {
  var new_data = [];

  for (i in dValues) {
    var v = dValues[i];
    if (manualReusableParameters.dateField.value && manualReusableParameters.previousDate.value){
        var nMoins1 = moment(manualReusableParameters.previousDate.value, manualReusableParameters.dateFieldFormat.value);
    }
    else{
      var nMoins1 = (formatNumbers(data[0][kValue]) - 1);
    }
    var new_data_next = [{ x_value: nMoins1, name: v, y_value: 100}];

for (i in data){
var d = data[i];
new_data_next.push({x_value: (formatNumbers(d[kValue])), name: v, y_value:_.round((new_data_next[i].y_value * ((100 + (formatNumbers(d[v])))/100)), 2)});
}

new_data.push(new_data_next)
  }


// Get last period if date

if (moment.isMoment(new_data[0][1].x_value)){

new_data = getLastPeriod(new_data)

}


  return new_data
}

function getLastPeriod(new_data){

  for (i in new_data){

var thisNewData = new_data[i]
var month_delta = thisNewData[2].x_value.month() - thisNewData[1].x_value.month()
var yearT1 = thisNewData[1].x_value.month()
var monthT1 = thisNewData[1].x_value.month()
var daysT1 = thisNewData[1].x_value.date()

var thisPreviousDate = moment(thisNewData[1].x_value).subtract(month_delta, 'month')

if (daysT1 = getDaysInMonth(yearT1, monthT1)){
thisPreviousDate.date(getDaysInMonth(thisPreviousDate.year(), thisPreviousDate.month()))
}

new_data[i][0].x_value = thisPreviousDate 


}

return new_data

function isLeapYear(year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
}

function getDaysInMonth (year, month) {
    return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

}

function prepareLineChartIndice100Value(data, kValue, dValues) {
  var new_data = [];

  for (i in dValues) {
    var v = dValues[i];
    var new_data_next = [];

for (i in data){
var d = data[i];

new_data_next.push({x_value: (formatNumbers(d[kValue])), name: v, y_value:(_.round(formatNumbers(100*d[v])/formatNumbers(data[0][v]), 2))});
}

new_data.push(new_data_next)
  }

  return new_data
}



function prepareLineChartIndice100ValueForTidy(data, kValue, dValues, kValue2) {
  var new_data = [];
  dValue = dValues[0]
  var dataGroups = _.uniq(data.map(function (d){return d[kValue2]}))

  for (i in dataGroups) {
    var g = dataGroups[i];
    // var new_data_next = [];
    var thisFilteredData = data.filter(function(d){return d[kValue2] == g})

for (i in thisFilteredData){
var d = _.cloneDeep(thisFilteredData[i]);

// {x_value: (formatNumbers(d[kValue])), name: g, y_value:(_.round(formatNumbers(100*d[dValue])/formatNumbers(thisFilteredData[0][dValue]), 2))}

d[dValue] = (_.round(formatNumbers(100*d[dValue])/formatNumbers(thisFilteredData[0][dValue]), 2))

d['y_value'] = d[dValue]

new_data.push(d);
}

  }

  return new_data
}


function checkIfpercentageInArray(data, dValues){

var chained_data = _.chain(d3.entries(data))
.map(function(d){return d.value})
.map(function(d){return dValues.map(function(e){return d[e]})})
.value()

var thisMinMAx = [d3.min(chained_data, function(d){return d3.min(d, function(e){return +e})}), d3.max(chained_data, function(d){return d3.max(d, function(e){return +e})})];

if (thisMinMAx[0] > -100 && thisMinMAx[0] < 100 && thisMinMAx[1] > -100 && thisMinMAx[1] < 100){
return true
}

return false

}

    function findColorsScheme(thisSelection){

      var this_domain = color.domain();
      var this_color = thisSelection == 'libeCategoricalColors' ?  d3.scaleOrdinal(libeCategoricalColors) : thisSelection == 'LibePoliticalColors' ?  d3.scaleOrdinal(LibePoliticalColors) : d3.scaleOrdinal(d3[manualReusableParameters.color_field_select.value]);
      this_color.domain(this_domain);

      return this_color;
    }

    function colorUpdated(thisKey){

      if (manualReusableParameters.persColorsCheck.value){
        return graphParameters.personalizedColorsObject[thisKey] ? graphParameters.personalizedColorsObject[thisKey] : color(thisKey) 
      }
      return color(thisKey) 
    }

    function colorBarchart(thisKey){

      if (manualReusableParameters.persColorsCheck.value){
        return graphParameters.personalizedColorsObject[thisKey] ? graphParameters.personalizedColorsObject[thisKey] : color(thisKey) 
      }
      return basicColors[thisKey].initial 
    }


function dragAndDropthisElement(thisEl){

    var thisRectInit = thisEl.node().getBoundingClientRect();

function dragstartedThisEl(d) {
var thisElement = d3.select(this);
  // thisElement.raise();

  if ( thisElement.attr('moveDataId')){}
  else{thisElement.attr('moveDataId', 'd_'+ String(Math.floor(Math.random() * 100000)));}
thisElement.classed('movedEl', true)
// thisElement.node().parentNode.appendChild(thisElement.node());
thisElement.style('cursor', 'move');
// console.log('start draging');
}

function draggedThisEl(d) {
var thisElement = d3.select(this);

var thisRect = thisElement.node().getBoundingClientRect();
  // thisElement.attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);

  if (thisElement.node().nodeName == "text"){
    var thisX = thisElement.attr('x') ? parseFloat(thisElement.attr('x')) : 0;
var thisY = thisElement.attr('y') ? parseFloat(thisElement.attr('y')) : 0;
thisElement.attr('x', (thisX+ d3.event.dx));
thisElement.attr('y', (thisY+ d3.event.dy));


  }
  else if (thisElement.attr('transform')){
var thisTransfX = parseFloat(thisElement.attr('transform').split('(')[1].split(',')[0]);
var thisTransfY = parseFloat(thisElement.attr('transform').split('(')[1].split(',')[1]);

thisElement.attr('transform', 'translate(' + (thisTransfX + d3.event.dx) + ',' + (thisTransfY + d3.event.dy) + ')')
}

else { 
    var thisTransfX = 0;
    var thisTransfY = 0;

thisElement.attr('transform', 'translate(' + (thisTransfX + d3.event.dx) + ',' + (thisTransfY + d3.event.dy) + ')');

}


 d3.select('#specialElementWrapper')
 .style('left', (thisRect.left + d3.event.dx))
 .style('top', (thisRect.top + d3.event.dy));

}

function dragendedThisEl(d) {

d3.select('#editMode input').property('checked', true);
makeAnnotations_.editMode(false);
d3.select(this).classed("active", false);
var thisElement = d3.select(this);
var thisMovedId = thisElement.attr('moveDataId');
var thisElementType = thisElement.node().nodeName;
var thisElementOrder = d3.selectAll('svg ' + thisElementType).nodes().indexOf(thisElement.node());

if (thisElementType == "text"){

manualReusableParameters.elementMoved.thoseElements[thisMovedId] = {'elementType':thisElementType, 'elementOrder':thisElementOrder,'operations':{'x':thisElement.attr('x'), 'y': thisElement.attr('y')}};

}
else{

manualReusableParameters.elementMoved.thoseElements[thisMovedId] = {'elementType':thisElementType, 'elementOrder':thisElementOrder,'operations':{'transform':thisElement.attr('transform')}};

}

thisElement.on("drag",null)

manualReusableParameters.elementMoved['thoseElementsOrder'] = manualReusableParameters.elementMoved['thoseElementsOrder'].filter(function(e){return e != thisMovedId});

manualReusableParameters.elementMoved['thoseElementsOrder'].push(thisMovedId);

d3.select('#specialElementWrapper')
.style('display', 'none');

}

thisEl.call(d3.drag()
        .on("start", dragstartedThisEl)
        .on("drag", draggedThisEl)
        .on("end", dragendedThisEl))

}

function selectElementToDrag () {

    // removeElementDrag ()

d3.select('svg g.graphContainer').selectAll('*').on('click', function(){

var el = d3.select(d3.event.target)

manualReusableParameters.selectedElement.value = el;
var thisElementType = el.node().tagName;
var thisElementParentType = el.node().parentNode.tagName;

wrapThisElement(el)

d3.select('.parameterElement.selectedElementType input').property('value', thisElementType);
d3.select('.parameterElement.selectedParentElementType input').property('value', thisElementParentType);



dragAndDropthisElement(el)

})

}

function selectParentFromElement(el){


var thisParentEl =  d3.select(el.node().parentNode)

dragAndDropthisElement(thisParentEl)
}


function wrapThisElement(el) {

    var thisRect = el.node().getBoundingClientRect();

    d3.select('#specialElementWrapper').remove()

    d3.select('body')
    .append('div')
    .attr('id', 'specialElementWrapper')
    .style('width', (thisRect.width + 2))
    .style('height', (thisRect.height + 2))
    .style('border', '1px dotted grey')
    .style('position', 'absolute')
    .style('left', (thisRect.left - 1))
    .style('top', (thisRect.top - 1))
    .style('pointer-events', 'none');




   // d3.select(el.parentNode )
   // .insert("g", function(){return el;} ) 
   //   .attr("class", "specialwrapper") //set anything you want to on the <g>
   //   .append( function(){return el;} );
   //           //move the content element into the group

}

function removeElementDrag () {
d3.select('svg g.graphContainer').selectAll('*').on('click', null);

}

function ReplaceThoseElements(){

if (_.isEmpty(manualReusableParameters.elementMoved.thoseElements) == false){

d3.select('svg g.graphContainer').selectAll('*').on('click', null)

for (i in manualReusableParameters.elementMoved.thoseElements)
{

var d = manualReusableParameters.elementMoved.thoseElements[i];
var thisSelection = d3.select(d3.selectAll('svg ' + d['elementType']).nodes()[d['elementOrder']]);
thisSelection.attr('id', i);

for (j in d['operations']){

thisSelection.attr(j, d['operations'][j]);

}

}

for (i in manualReusableParameters.elementMoved['thoseElementsOrder']){

d = manualReusableParameters.elementMoved['thoseElementsOrder'][i];

// d3.selectAll('svg #' + d).raise();

}

}
   
}