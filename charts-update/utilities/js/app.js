var dataFromFile,
    columns_names,
    arrayDataFromFile,
    x,
    y,
    margin = {},
    width,
    height,
    dictSheets = {},
    selected_xRows = [],
    selected_yRows = [],
    selected_size = [],
    selected_color = [],
    selected_label = [],
    selected_graph;

///////////////////////////////////////////////////////////////
//////////////////// MISCALENOUS VARS AND FUNCTIONS

var categorical_color_scale = [
{ "name" : "schemeAccent", "n": 8},
{ "name" : "schemeDark2", "n": 8},
{ "name" : "schemePastel2", "n": 8},
{ "name" : "schemeSet2", "n": 8},
{ "name" : "schemeSet1", "n": 9},
{ "name" : "schemePastel1", "n": 9},
{ "name" : "schemeCategory10", "n" : 10},
{ "name" : "schemeSet3", "n" : 12 },
{ "name" : "schemePaired", "n": 12},
{ "name" : "schemeCategory20", "n" : 20 },
{ "name" : "schemeCategory20b", "n" : 20},
{ "name" : "schemeCategory20c", "n" : 20 }
];

var parametersType = [{
  selector:'dropdiv_x', tagsArray:selected_xRows, dropzoneName:'dropzoneX'},
{selector:'dropdiv_y', tagsArray:selected_yRows, dropzoneName:'dropzoneY'},
{selector:'size_tags', tagsArray:selected_size, dropzoneName:'dropzoneSize'},
{selector:'color_tags', tagsArray:selected_color, dropzoneName:'dropzoneColor'},
{selector:'label_tags', tagsArray:selected_label, dropzoneName:'dropzoneLabel'}
];


var chart_parameters = {
  barChart:'makeBarchart',
  lineChart:'makeLinechart',
  areaChart:'makeAreachart',
  circleChart: 'makeCirclechart',
  barChartHorizontal: 'makeHorizontalBarchart',
  steamGraph : 'makeSteamGraph'
}


var color = d3.scaleOrdinal(d3.schemeDark2);

var parseTime = d3.timeParse('%Y/%m/%d');

///////////////////////////////////////////////////////////////
//////////////////// DATA UPLOAD

$(function() {
    // Déclenchement de la requete au clic sur le bouton submit du formulaire
    $('#file_submit').click(function() {
        var keywords = $('#data_file').val();

        entree = document.getElementById('data_file');

        if (entree.files[0]) {

            d3.select('span.file-name').text(entree.files[0].name);



            var this_file = entree.files[0];

            if (_.slice(this_file.name.split('.'), -1) == 'csv') {
                fr = new FileReader();

                fr.readAsText(this_file);

                fr.onload = function() {


                    dataFromFile = d3.csvParse(fr.result);

                    // dataFromFile = _.slice(dataFromFile, 0, 10);

                    // populateFile()

                    arrayDataFromFile = arrayIfObject(dataFromFile);

                    populateJexcel()
                }
            } else if (_.slice(this_file.name.split('.'), -1) == 'xlsx') {

                ExcelToJSON(this_file);

            }
        }



    });
});

///////////////////////////////////////////////////////////////
//////////////////// GRID FUNCTIONS

d3.select('#newEmpty')
    .on('click', function() {
        initializeGrid()
    })

d3.select('#populate')
    .on('click', function() {
        populateFile()
    })

function initializeGrid() {
    arrayDataFromFile = [
        ['', ''],
        ['', ''],
        ['', '']
    ];
    populateJexcel()
}

function addGridButtons() {

    d3.select('#jsGrid')
        .append('div')
        .attr('class', 'addColButton is-large icon')
        .html('<i class="fa fa-plus" aria-hidden="true"></i>');

    d3.select('#jsGrid')
        .append('div')
        .attr('class', 'addRowButton is-large icon')
        .html('<i class="fa fa-plus" aria-hidden="true"></i>');

    d3.select('.addColButton')
        .on('click', function(d) {
            $('#jsGrid').jexcel('insertColumn')
        });

    d3.select('.addRowButton')
        .on('click', function(d) {
            $('#jsGrid').jexcel('insertRow')
        });

}

function populateJexcel() {

    $('#jsGrid').jexcel({
        data: arrayDataFromFile,
        onchange: updateGrid,
        colWidths: [200]
    });

    addGridButtons()
    // var row_names = _.cloneDeep(columns_names);

    reGenerateTags()


    d3.select('#selecting_chart_type select')
        .on('change', function() {

            var chosenChartType = d3.select('#selecting_chart_type select').property('value');

        })

    d3.selectAll('a.button.makeChart')
        .on('click', function() {

            dataFromFile = objectIfArray(arrayDataFromFile);

            if (d3.select('#selecting_chart_type select').property('value') == "barChart") {

                if (selected_graph != 'barChart') {
                    emptyChart()

                    selected_graph = 'barChart';
                    d3.select("#chart").attr('class', 'barChart');
                }

                makeBarchart(dataFromFile.filter(function(d){return _.uniq(d3.values(d))!= ""}));


                if (selected_yRows.length > 1){

                makeVarSwitch(selected_yRows, makeBarchart, dataFromFile.filter(function(d){return _.uniq(d3.values(d))!= ""}));
              }

            } else if (d3.select('#selecting_chart_type select').property('value') == "lineChart") {

                if (selected_graph != 'lineChart') {

                    emptyChart()
                    selected_graph = 'lineChart';
                    d3.select("#chart").attr('class', 'lineChart');

                    // selected_xRows = [];
                    // selected_yRows = [];
                    // reGenerateSelectedtags();

                }

                console.log(dataFromFile);

                makeLinechart(dataFromFile.filter(function(d){return _.uniq(d3.values(d))!= ""}));
            } else if (d3.select('#selecting_chart_type select').property('value') == "areaChart") {

                if (selected_graph != 'areaChart') {

                    emptyChart()
                    selected_graph = 'areaChart';
                    d3.select("#chart").attr('class', 'areaChart');

                }

                makeAreachart(dataFromFile.filter(function(d){return _.uniq(d3.values(d))!= ""}));
            } else if (d3.select('#selecting_chart_type select').property('value') == "circleChart") {

                if (selected_graph != 'circleChart') {

                    emptyChart()
                    selected_graph = 'circleChart';
                    d3.select("#chart").attr('class', 'circleChart');

                }

                makeCirclechart(dataFromFile.filter(function(d){return _.uniq(d3.values(d))!= ""}));
            } else if (d3.select('#selecting_chart_type select').property('value') == "barChartHorizontal") {

                if (selected_graph != 'barChartHorizontal') {
                    emptyChart()

                    selected_graph = 'barChartHorizontal';
                    d3.select("#chart").attr('class', 'barChartHorizontal');
                }

                makeHorizontalBarchart(dataFromFile.filter(function(d){return _.uniq(d3.values(d))!= ""}));

                if (selected_xRows.length > 1){

                makeVarSwitch(selected_xRows, makeHorizontalBarchart, dataFromFile.filter(function(d){return _.uniq(d3.values(d))!= ""}));
              }

            } else if (d3.select('#selecting_chart_type select').property('value') == "steamGraph") {

                if (selected_graph != 'steamGraph') {
                    emptyChart()

                    selected_graph = 'steamGraph';
                    d3.select("#chart").attr('class', 'steamGraph');
                }

                makeSteamGraph(dataFromFile.filter(function(d){return _.uniq(d3.values(d))!= ""}));

                if (selected_xRows.length > 1){

              }

            }


        });

}

function emptyChart(){

    d3.select('#varSwitch').selectAll("*").remove();
    d3.select("#chart .graphContainer .innerGraph").selectAll("*").remove();
    d3.select("#chart .graphContainer .axis--x").selectAll("*").remove();
    d3.select("#chart .graphContainer .axis--y").selectAll("*").remove();
}

var updateGrid = function(obj, cel, val) {

    dataFromFile = objectIfArray(arrayDataFromFile);


    if (d3.select(cel[0]).attr('id').split('-')[1] == "0") {

        reGenerateTags()
    }

}

///////////////////////////////////////////////////////////////
//////////////////// TAGS FUNCTIONS

function reGenerateTags() {

    d3.select("#selecting_columns").selectAll("*").remove();

    d3.select('#selecting_columns')
        .append('div')
        .attr('class', 'selected_tags tags')
        .selectAll('span.tag.is-info')
        .data(arrayDataFromFile[0].filter(function(d) { return d != '' }).map(function(d) { return { value: d }}))
        .enter()
        .append('span')
        .attr('draggable', 'true')
        .attr('class', 'tag is-info is-medium')
        .text(function(d) { return d.value })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
}


function reGenerateSelectedtags() {



parametersType.forEach(function(el){

    var all_these_tags = d3.select('#'+ el.selector+ ' div.selected_tags')
        .selectAll('span.tag.is-info')
        .data(el.tagsArray);

    all_these_tags
        .text(function(d) { return d })
        .append('button')
        .attr('class', 'delete');

    all_these_tags.exit().remove();

    all_these_tags
        .enter()
        .append('span')
        .attr('draggable', 'true')
        .attr('class', 'tag is-info is-medium')
        .text(function(d) { return d })
        .append('button')
        .attr('class', 'delete');


    d3.selectAll("#"+ el.selector+ " span.tag")
        .on('click', function(d) {
            _.pull(el.tagsArray, d);
            reGenerateSelectedtags();
        })


});


}

///////////////////////////////////////////////////////////////
////////////////////  TAGS UTILITIES

function dragstarted(d) {
    d.x_origin = d3.event.x;
    d.y_origin = d3.event.y;
}


function dragged(d) {

    d3.select(this)
        .style('position', 'relative')
        .style("left", (d3.event.x - d.x_origin))
        .style("top", (d3.event.y - d.y_origin));

    var testedPosition = testingPosition(d3.select(this));

    d3.selectAll('#dropselectZones .column div')
    .classed('focus', false);

    if (testedPosition){

      var this_selector = _.find(parametersType, function(d){return d.dropzoneName == testedPosition}).selector;

      d3.select('#'+ this_selector)
      .classed('focus', true);
    }

}

function dragended(d) {

    var testedPosition = testingPosition(d3.select(this));

    d3.select(this)
        .style("left", 0)
        .style("top", 0);

    if (testedPosition) {

      var this_tag_array = _.find(parametersType, function(d){return d.dropzoneName == testedPosition}).tagsArray;

        this_tag_array.push(d.value);
        reGenerateSelectedtags();
    }

}


function testingPosition(that) {

  var nodePosition = that.node().getBoundingClientRect();

  for (i in parametersType){
    var d = parametersType[i];
    var thisDropdiv = d3.select('#'+ d.selector+'').node().getBoundingClientRect();

    if (nodePosition.bottom > thisDropdiv.top && nodePosition.top < thisDropdiv.bottom && nodePosition.right > thisDropdiv.left && nodePosition.left < thisDropdiv.right) {
      return d.dropzoneName
    }

  }

}

///////////////////////////////////////////////////////////////
//////////////////// CHART FUNCTIONS

function initChart() {

    var svg = d3.select("svg");

    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    };

    width = +svg.attr("width") - margin.left - margin.right;
    height = +svg.attr("height") - margin.top - margin.bottom;


    var g = svg.append("g")
        .attr('class', 'graphContainer')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");

    g.append("g")
        .attr("class", "axis axis--y")
        .attr('transform', 'translate(0,0)');

    g.append("g")
        .attr('class', 'innerGraph');

}


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

d3.selectAll('#varSwitch span.tag')
.classed('is-primary', false);

d3.select(this)
.classed('is-primary', true);

rowsToSwitch.splice(rowsToSwitch.indexOf(d), 1);
rowsToSwitch.unshift(d);

this_function(data);
}

  );


d3.select('#varSwitch span.tag')
.classed('is-primary', true);




}

function makeBarchart(data) {

    var kValue = selected_xRows[0];
    var dValue = selected_yRows[0];


    data.forEach(function(d) {
        d[dValue] = +d[dValue];
        d.this_key = d[kValue];
        d.this_value = +d[dValue];
    })

    var svg = d3.select("svg");
    var g = svg.select('g.graphContainer');
    var g_inner = g.select('g.innerGraph');

    width = +svg.attr("width") - margin.left - margin.right;

    // var this_grouped_data = data.map(function(d) { return d.this_key; })
    // .map(function(d){return {key:d, value: d3.sum(data.filter(function(e){return e.this_key == d}), function(e){return e.this_value})}});

    this_grouped_data = groupbyKV(data, 'this_key', 'this_value', d3.sum);
    this_grouped_data = this_grouped_data.filter(function(d) { return d.key != ''});
    this_grouped_data = this_grouped_data.sort(function(a, b) { return b.value - a.value});

    x = d3.scaleBand().rangeRound([0, width]).padding(0.1);

    y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain(this_grouped_data.map(function(d) { return d.key;}));
    y.domain([0, d3.max(this_grouped_data, function(d) { return d.value;})]);


    g.select("g.axis.axis--x")
        .call(d3.axisBottom(x));

    g.select("g.axis.axis--y")
    .attr('transform', 'translate(0,0)')
        .call(d3.axisLeft(y)
        );

    var all_bars = g_inner.selectAll("rect").data(this_grouped_data);

    all_bars
        .transition()
        .duration(200)
        .attr("x", function(d) { return x(d.key);})
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); });

    all_bars.exit().transition().duration(200).remove();

    all_bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); });
}

function makeHorizontalBarchart(data) {

    var kValue = selected_yRows[0];
    var dValue = selected_xRows[0];
    var this_padding_left = 80;
 

    data.forEach(function(d) {
        d[dValue] = +d[dValue];
        d.this_key = d[kValue];
        d.this_value = +d[dValue];
    })

    var svg = d3.select("svg");
    var g = svg.select('g.graphContainer');
    var g_inner = g.select('g.innerGraph');

    width = +svg.attr("width") - margin.left - margin.right - this_padding_left;

    this_grouped_data = groupbyKV(data, 'this_key', 'this_value', d3.sum);
    this_grouped_data = this_grouped_data.filter(function(d) { return d.key != ''});
    this_grouped_data = this_grouped_data.sort(function(a, b) { return b.value - a.value});

    y = d3.scaleBand().rangeRound([0, height]).padding(0.1);
    x = d3.scaleLinear().rangeRound([this_padding_left, width]);

    y.domain(this_grouped_data.map(function(d) { return d.key;}));
    x.domain([0, d3.max(this_grouped_data, function(d) { return d.value;})]);


    g.select("g.axis.axis--x")
        .call(d3.axisBottom(x));

    g.select("g.axis.axis--y")
    .attr('transform', 'translate(' + this_padding_left + ',0)')
        .call(d3.axisLeft(y)
        );

    var all_bars = g_inner.selectAll("rect").data(this_grouped_data);

    all_bars
        .transition()
        .duration(200)
        .attr("y", function(d) { return y(d.key); })
        .attr("height", y.bandwidth())
        .attr("width", function(d) { return x(d.value); });

    all_bars.exit().transition().duration(200).remove();

    all_bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", this_padding_left)
        .attr("y", function(d) { return y(d.key); })
        .attr("height", y.bandwidth())
        .attr("width", function(d) { return x(d.value); });
}

function makeLinechart(data) {

  console.log(data);

    var kValue = selected_xRows[0];
    var dValues = selected_yRows;

    var svg = d3.select("svg");
    var g = svg.select('g.graphContainer');
    var g_inner = g.select('g.innerGraph');
    width = +svg.attr("width") - margin.left - margin.right;

    data = prepareLineChartData(data, kValue, dValues);

    console.log(data);

    var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d3.min(d, function(e) { return e['x_value'] }) }),
            d3.max(data, function(d) { return d3.max(d, function(e) { return e['x_value'] }) }) ])
        .range([0, width]);


    var yScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d3.min(d, function(e) { return e['y_value'] }) }),
            d3.max(data, function(d) { return d3.max(d, function(e) { return e['y_value'] }) })
        ])
        .range([height, 0]);

    g.select("g.axis.axis--x")
        .call(d3.axisBottom(xScale).ticks(5));


    g.select("g.axis.axis--y")
    .attr('transform', 'translate(0,0)')
        .call(d3.axisLeft(yScale));

    var line = d3.line()
        .x(function(d) { return xScale(d.x_value) })
        .y(function(d) { return yScale(d.y_value)
        })
        // .curve(d3.curveCatmullRom.alpha(0.5))
        ;

    var allLines = g_inner
        .selectAll('.line')
        .data(data);

    allLines
        .transition()
        .duration(200)
        .attr('d', function(d) { return line(d) })
        .style('stroke', function(d) { return color(d[0].name) });

    allLines.exit().transition().duration(200).remove();

    allLines
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('d', function(d) { return line(d) })
        .style('stroke', function(d) { return color(d[0].name) })
        .style('stroke-width', 2)
        .style('fill', 'none');

}


function makeAreachart(data) {

    var kValue = selected_xRows[0];
    var dValues = selected_yRows;

    var svg = d3.select("svg");
    var g = svg.select('g.graphContainer');
    var g_inner = g.select('g.innerGraph');
    width = +svg.attr("width") - margin.left - margin.right;

    data = prepareLineChartData(data, kValue, dValues);

    console.log(data);

    var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d3.min(d, function(e) { return e['x_value'] }) }),
            d3.max(data, function(d) { return d3.max(d, function(e) { return e['x_value'] }) }) ])
        .range([0, width]);


    var yScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d3.min(d, function(e) { return e['y_value'] }) }),
            d3.max(data, function(d) { return d3.max(d, function(e) { return e['y_value'] }) })
        ])
        .range([height, 0]);

    g.select("g.axis.axis--x")
        .call(d3.axisBottom(xScale).ticks(5));


    g.select("g.axis.axis--y")
    .attr('transform', 'translate(0,0)')
        .call(d3.axisLeft(yScale));

var area = d3.area()
    .x(function(d) { return xScale(d.x_value) })
    .y0(yScale(yScale.domain()[0]))
    .y1(function(d) { return yScale(d.y_value)})
    .curve(d3.curveCatmullRom.alpha(0.5));

    var allArea = g_inner
        .selectAll('.area')
        .data(data);

    allArea
        .transition()
        .duration(200)
        .attr('d', function(d) { return area(d) })
        .style('stroke', function(d) { return color(d[0].name) });

    allArea.exit().transition().duration(200).remove();

    allArea
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('d', function(d) { return area(d) })
        .style('stroke', function(d) { return color(d[0].name) })
        .style('fill', function(d) { return color(d[0].name) })
        .style('stroke-width', 2)
        .style('fill-opacity', 0.5);

}

function makeSteamGraph(data) {


    emptyChart()


    var stack = d3.stack()
        .offset(d3.stackOffsetWiggle)
        .order(d3.stackOrderInsideOut);


    var xScale = d3.scaleTime();
    var yScale = d3.scaleLinear();
    var colorScale = d3.scaleOrdinal()
        .range(d3.schemeCategory10);


    var xAxisMajor = d3.axisBottom().scale(xScale);
    var xAxisMinor = d3.axisBottom().scale(xScale).ticks(50);

    var area = d3.area()
        .x(d => xScale(xValue(d.data)))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);


    var svg = d3.select("svg");
    var g = svg.select('g.graphContainer');
    var g_inner = g.select('g.innerGraph');
    width = +svg.attr("width") - margin.left - margin.right;

    var kValue = selected_xRows[0];
    var dValues = selected_yRows;

    var xValue = function(d) {
        return d.date;
    };

    var new_data = [];


    for (i in data) {

        e = {}
        d = data[i];
        for (j in dValues) {
            e[dValues[j]] = +d[dValues[j]];
        }


        e.date = new Date(d[kValue]);

        new_data.push(e);
    }


    var keys = dValues;
    var data = new_data;
    console.log(new_data);
    console.log(keys);

    stack.keys(keys);
    var stacked = stack(data);

    var innerWidth = width - margin.right - margin.left;
    var innerHeight = height - margin.top - margin.bottom;

    xScale
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth]);

    yScale
        .domain([
            d3.min(stacked, function(series) {
                return d3.min(series, function(d) {
                    return d[0];
                });
            }),
            d3.max(stacked, function(series) {
                return d3.max(series, function(d) {
                    return d[1];
                });
            })
        ])
        .range([innerHeight, 0]);

    colorScale.domain(d3.range(keys.length));

    var paths = g_inner.selectAll('path').data(stacked);
    var pathsEnter = paths
        .enter().append('path');


    pathsEnter.merge(paths)
        .attr('fill', function(d) {
            return colorScale(d.index);
        })
        .attr('stroke', function(d) {
            return colorScale(d.index);
        })
        .attr('d', area);

    paths.select('title')
        .merge(pathsEnter.append('title'))
        .text(function(d) {
            return d.key;
        })

    var labels = g_inner.selectAll('text').data(stacked)

    labels
        .enter().append('text')
        .attr('class', 'area-label')
        .merge(labels)
        .text(function(d) {
            return d.key;
        })
        .attr('transform', d3.areaLabel(area).interpolateResolution(1000));

    // xAxisMajor.tickSize(-innerHeight);
    // xAxisMinor.tickSize(-innerHeight);

    // xAxisG.attr('transform', `translate(0,${innerHeight})`);
    // xAxisMajorG.call(xAxisMajor);
    // xAxisMinorG.call(xAxisMinor);

    g.select("g.axis.axis--x")
        .call(xAxisMajor);


    // g.select("g.axis.axis--x")
    //     .call(xAxisMinor);



}

function makeCirclechart(data) {

    // var kValue = selected_xRows[0];
    // var dValues = selected_yRows;

    var thisXvar = selected_xRows[0];
    var thisYvar = selected_yRows[0];
    var thisSizeVar = selected_size[0];
    var thisColorVar = selected_color[0];
    var thisLabelVar = selected_label[0];

    data.forEach(function(d) {
        d[thisXvar] = +d[thisXvar];
        d[thisYvar] = + d[thisYvar];
        d[thisSizeVar] = d[thisSizeVar] ? +d[thisSizeVar] : 1;
    })

    console.log(data);
    console.log(thisXvar, thisYvar, thisSizeVar);

    var svg = d3.select("svg");
    var g = svg.select('g.graphContainer');
    var g_inner = g.select('g.innerGraph');
    width = +svg.attr("width") - margin.left - margin.right;


    var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d[thisXvar] }),
            d3.max(data, function(d) { return d[thisXvar] }) ])
        .range([0, width]);


    var yScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d[thisYvar] }),
            d3.max(data, function(d) { return d[thisYvar] }) ])
        .range([height, 0]);

    var rScale = d3.scaleSqrt()
    .domain([0, d3.max(data, function(d){ return d[thisSizeVar]})])
    .range([0, 40]);

    g.select("g.axis.axis--x")
        .call(d3.axisBottom(xScale).ticks(5));


    g.select("g.axis.axis--y")
    .attr('transform', 'translate(0,0)')
        .call(d3.axisLeft(yScale));

  var circles = g_inner
    .selectAll('.ball')
    .data(data);

    circles.exit().transition().duration(200).remove();

    circles
    .select('circle')
    .transition()
    .duration(200)
    .attr('r', function(d){return selected_size[0] ? rScale(d[thisSizeVar]) : 3})
    .style('fill', function(d){return thisColorVar ? color(d[thisColorVar]) : 'steelblue'});

    circles
    .select('text')
    .transition()
    .duration(200)
    .text(function(d){return thisLabelVar ? d[thisLabelVar] : ""});


    var new_circles = circles
    .enter()
    .append('g')
    .attr('class', 'ball')
    .attr('transform', function(d) {return 'translate(' + xScale(d[thisXvar]) + ',' +  yScale(d[thisYvar]) + ')'});

  new_circles
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d){return selected_size[0] ? rScale(d[thisSizeVar]) : 3})
    .style('fill-opacity', 0.5)
    .style('fill', function(d){return thisColorVar ? color(d[thisColorVar]) : 'steelblue'});

  new_circles
    .append('text')
    .style('text-anchor', 'middle')
    .style('fill', 'black')
    .attr('y', 4)
    .text(function(d){return thisLabelVar ? d[thisLabelVar] : ""});


}

///////////////////////////////////////////////////////////////
//////////////////// UTILITIES FUNCTIONS

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

function prepareLineChartData(data, kValue, dValues) {
    var new_data = [];

    for (i in dValues) {
        var v = dValues[i];

        new_data.push(data.map(function(d) {
            return {
                x_value: +d[kValue],
                name: v,
                y_value: +d[v]
            }
        }));
    }

    return new_data
}

function ExcelToJSON(file) {

    var reader = new FileReader();

    reader.onload = function(e) {

        var data = e.target.result;
        var workbook = XLSX.read(data, {
            type: 'binary'
        });
        dictSheets = {};

        for (i in workbook.SheetNames) {
            var sheetName = workbook.SheetNames[i];

            dictSheets[sheetName] = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        }

        dataFromFile = d3.entries(dictSheets)[0].value;
        // dataFromFile = _.slice(dataFromFile, 0, 10);
        arrayDataFromFile = arrayIfObject(dataFromFile);

        populateJexcel()

    };

    reader.onerror = function(ex) {
    };
    reader.readAsBinaryString(file);

};


initializeGrid();
initChart();



/////////////// Push inline



  // Déclenchement de la requete au clic sur le bouton submit du formulaire
    $('#pushInline').click(function() {
        var this_data = dataFromFile;

        $.ajax({
          // Le requete est  envoyée en post sur l'url request pour être retraitée en python
            url: '/request',
            data: {"data" : JSON.stringify(this_data),
            chart_html : d3.select("#chart").html()},
            type: 'POST',
            // En cas de succès : 
            success: function(response) {
                console.log(JSON.parse(response));

                  data = JSON.parse(response);

            },
            // En cas d'erreur :
            error: function(error) {
                console.log(error);
            }
        });
    });


//     function populateFile(){

//     	console.log(dataFromFile);


//     columns_names = d3.keys(dataFromFile[0]);


//     var table_fields = columns_names.map(function(d){return {name:d, type: "text", width: 100}});


//     table_fields.push({type:"control"});

//     $("#jsGrid").jsGrid({
//         width: "100%",
//         height: "400px",
//         editButton: true, 

//         inserting: true,
//         editing: true,
//         sorting: false,
//         paging: true,

//         data: dataFromFile,

//         fields : table_fields
//     });


//     var row_names = _.cloneDeep(columns_names);



// 	row_names.unshift('sélectionner une valeur x');

// 	d3.select("#selecting_columns").selectAll("*").remove();


//       d3.select('#selecting_columns')
//       .append('div')
//       .attr('class', 'select_x select')
//       .append('select')
//       .attr('class', 'form-control')
//       .selectAll('option')
//       .data(row_names)
//       .enter()
//       .append('option')
//       .text(function(d){return d})
//       .attr('value', function(d){return d})
//       ;

//       row_names[0] = 'Sélectionner une valeur y';

//        d3.select('#selecting_columns')
//       .append('div')
//       .attr('class', 'select_y select')
//       .append('select')
//       .attr('class', 'form-control')
//       .selectAll('option')
//       .data(row_names)
//       .enter()
//       .append('option')
//       .text(function(d){return d})
//       .attr('value', function(d){return d})
//       ;


//       d3.select('#addCol')
//       .on('click', function(){

//       	var this_new_val = d3.select("#colToAdd").property('value');

//       	if (this_new_val){

//       	if (dataFromFile[0]){
//       	dataFromFile[0][this_new_val] = '';
//       }
//       else{
//       	dataFromFile[0] = {};
//       	dataFromFile[0][this_new_val] = '';
//       }

//   }
//       	populateFile()


//       	})



//     d3.select('#makeBarchart')
//     .on('click', function(){

//     	var x_col = d3.select('#selecting_columns .select_x select').property('value');

//     	var y_col = d3.select('#selecting_columns .select_y select').property('value');


//     	makeBarchart(dataFromFile, x_col, y_col);
//     });



// }



        // $.ajax({
        // 	// Le requete est  envoyée en post sur l'url request pour être retraitée en python
        //     url: '/request',
        //     data: {"keywords" : JSON.stringify(keywords)},
        //     type: 'POST',
        //     // En cas de succès : 
        //     success: function(response) {
        //         console.log(JSON.parse(response));

        //         	data = JSON.parse(response);


        //         	// Data Join de d3 pour les echos
        //         	d3.select("#echos .article")
        //         	.selectAll('h4')
        //         	.attr('class','articles')
        //         	.data(data.answer)
        //         	.enter()
        //         	.append('h4')
        //         	.html(function(d){return d.headline});

        //         	d3.select(".list-keywords ul")
        //         	.append('li')
        //         	.html(keywords);


        //         	// Data Join de d3 pour les twitter
        //         	d3.select("#twitter")
        //         	.selectAll('h4')
        //         	.attr('class','articles')
        //         	.data(data.twitter)
        //         	.enter()
        //         	.append('h4')
        //         	.html(function(d){return d.text});


        //     },
        //     // En cas d'erreur :
        //     error: function(error) {
        //         console.log(error);
        //     }
        // });



    // var table_fields = d3.keys(dataFromFile[0]).map(function(d){return {name:d, type: "text", width: 150}});
    // table_fields.push({type:"control"});

    // var data = {{data}};

    // $("#jsGrid").jsGrid({
    //     width: "100%",
    //     height: "400px",

    //     inserting: true,
    //     editing: true,
    //     sorting: true,
    //     paging: true,

    //     data: clients,

    //     fields : table_fields

        // fields: [
        //     { name: "Name", type: "text", width: 150, validate: "required" },
        //     { name: "Age", type: "number", width: 50 },
        //     { name: "Address", type: "text", width: 200 },
        //     { name: "Country", type: "select", items: countries, valueField: "Id", textField: "Name" },
        //     { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
        //     { type: "control" }
        // ]
    // });

    // $("#jsGrid").jsGrid({
    //     width: "100%",
    //     height: "400px",

    //     inserting: true,
    //     editing: true,
    //     sorting: true,
    //     paging: true,

    //     data: clients,

    //     fields : table_fields
    // });




// $(function() {
//   // Déclenchement de la requete au clic sur le bouton submit du formulaire
//     $('#keywords_submit').click(function() {
//         var keywords = $('#mykeywords').val();

//         $.ajax({
//           // Le requete est  envoyée en post sur l'url request pour être retraitée en python
//             url: '/request',
//             data: {"keywords" : JSON.stringify(keywords)},
//             type: 'POST',
//             // En cas de succès : 
//             success: function(response) {
//                 console.log(JSON.parse(response));

//                   data = JSON.parse(response);


//                   // Data Join de d3 pour les echos
//                   d3.select("#echos .article")
//                   .selectAll('h4')
//                   .attr('class','articles')
//                   .data(data.answer)
//                   .enter()
//                   .append('h4')
//                   .html(function(d){return d.headline});

//                   d3.select(".list-keywords ul")
//                   .append('li')
//                   .html(keywords);


//                   // Data Join de d3 pour les twitter
//                   d3.select("#twitter")
//                   .selectAll('h4')
//                   .attr('class','articles')
//                   .data(data.twitter)
//                   .enter()
//                   .append('h4')
//                   .html(function(d){return d.text});


//             },
//             // En cas d'erreur :
//             error: function(error) {
//                 console.log(error);
//             }
//         });
//     });
// });