var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;
var isChromium = !!window.chrome;
var datapol;
var circosData;
var representation_territoriale = 'departement';
const arr_representation_territoriale = ['region' ,'departement', 'circonscription']
let selected_element
let chart_data
let selected_Yelement = ['MACRON', '#F7BA00']

let xScale,
    yScale,
    rScale;

/*   var margin = {},
   width,
   height;*/

   var initMargin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 40
  };


const y_variables = [
{'name' : 'scoreMacron', 'label': 'Score de Macron'},
{'name' : 'scoreLepen', 'label': 'Score de Le Pen'}
]


// popTotale,

// ScoreLepenT1,ScoreFillonT1,ScoreMelenchonT1,ScoreMacronT1,Departement,MacronT1,LepenT1,MelenchonT1,revenu_median

const x_variables = [
{'name' : 'revenu_median', 'label': 'Revenu médian', 'min_val' : 15000,  'max_val' : 50000},
{'name' : 'taux65Plus', 'label': 'Nombre d\'habitants de plus de 65 ans', 'min_val' : 0, 'max_val' : 50},
{'name' : 'ScoreMelenchonT1', 'label': 'Score de Mélenchon au 1er tour', 'min_val' : 0, 'max_val' : 50},
{'name' : 'TauxCadres', 'label': 'Proportion de cadres', 'min_val' : 0, 'max_val' : 50},
{'name' : 'TauxOuvriers', 'label': 'Proportion d\'ouvriers', 'min_val' : 0, 'max_val' : 50},
{'name' : 'TauxAgricuteurs', 'label': 'Proportion d\'agriculteurs', 'min_val' : 0, 'max_val' : 50},
{'name' : 'TauxChomage', 'label': 'Proportion de chômeurs', 'min_val' : 0, 'max_val' : 50}
]

selected_element = x_variables[0]

  const padding_left = 20

  const padding_top = 0


const chartTitle = "Vote Macron et revenu médian"

const chartSubTitle = ""

const data_file = "data_elec_macron.csv"
const x_var = selected_element.name
const y_var = 'scoreMacron'

const x_axis_title = "Taux de chômage"
const y_axis_title = "Part de vote Macron"

const circle_size = 'Inscrits'

const min_x_value = 0
const max_x_value = 50
const min_y_value = 0
const max_y_value = 100

const this_circle_radius = 15


  var initTotalWidth = 600;
  var initTotalHeight = 400;


  var svg_width = 600
   var svg_height = 400

  var initWidth = initTotalWidth - initMargin.left - initMargin.right;
  var initHeight = initTotalHeight - initMargin.top - initMargin.bottom;

  var libeCategoricalColors = ['#e60004', '#7c7c7c', '#000'];

  var political_colors_obj = {
    'EXG': "#751719",
    'FI': "#cd0420",
    "COM":'#af0e1d',
    "ECO":'#52ae56',
    "SOC":'#e6467e',
    "DVG":'#f46099',
    "RDG":'#f781b6',
    'DIV': "#cccccc",
    'REG': "#666",
    "REM":'#ffb400',
    "MDM":'#e85d21',
    "UDI":'#9f64a2',
    "DVD":'#026db5',
    "LR":'#0058a2',
    "DLF":'#003366',
    "EXD":'#03034f',
    "FN":'#000032'
  };

  var LibePoliticalColors =["#751719", "#cd0420", "#af0e1d", "#52ae56", "#e6467e", "#f46099", "#f781b6", "#cccccc", "#666", "#ffb400", "#e85d21", "#9f64a2", "#026db5", "#0058a2", "#003366", "#03034f", "#000032"];

  var color = d3.scaleOrdinal(libeCategoricalColors);


  var categorical_color_sheme = ['libeCategoricalColors', 'LibePoliticalColors', 'schemeDark2', 'schemeAccent', 'schemePastel2', 'schemeSet2', 'schemeSet1', 'schemePastel1', 
  'schemeCategory10', 'schemeSet3', 'schemePaired', 'schemeCategory20', 'schemeCategory20b', 'schemeCategory20c'];

  var basicColors = {plain:{initial:"#e60004", personalized:null}, positive:{initial:'#85b4b2', personalized:null}, negative:{initial:"#e60004", personalized:null}};


  var manualReusableParameters = {}

  var graphParameters = {"selected_xRows":[x_var],"selected_yRows":[y_var],"selected_size":[circle_size],"selected_color":[],"selected_label":[],"selected_tooltip":["libelle_commune",x_var, y_var],"personalizedColorsObject":{"Agglomération marseillaise":"#cd0420","Agglomération lyonnaise":"#cccccc","Agglomération parisienne":"#666"},
  "selectedColorScheme":"LibePoliticalColors","additionnalParam":"","selected_graph":"circleChart","chartTitle":chartTitle,"chartSubTitle":chartSubTitle,"chartSource":"Assurance maladie, Insee. La taille des ronds est proportionelle à la population des villes","annotations":[]};


    function initChart() {

      var svg = d3.select("#chart_container svg")
/*      .call(responsivefy);*/

console.log(svg.node())


      svg
      .attr("width", svg_width)
      .attr('height', svg_height);

      margin = {
        top: 20,
        right: 20,
        bottom: 60,
        left: 50
      };

      width = +svg.attr("width") - margin.left - margin.right;
      height = +svg.attr("height") - margin.top - margin.bottom;

      var g = svg.append("g")
      .attr('class', 'graphContainer')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*      initAnnotations()*/

      g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")");

      g.append("g")
      .attr("class", "axis axis--y")
      .attr('transform', 'translate(0,0)');

      g.append("g")
      .attr('class', 'innerGraph');

    }



function makeCirclechart() {

    // var kValue = 'graphParameters['selected_xRows][0];
    // var dValues = graphParameters[selected_yRows];

    var data = _.cloneDeep(chart_data);



 


    var thisXvar = selected_element.name;
    var thisYvar = 'score' + _.capitalize(selected_Yelement[0]).replace(' ', '');
    var thisSizeVar = graphParameters['selected_size'][0];
    var thisColorVar = graphParameters['selected_color'][0];
    var thisLabelVar = graphParameters['selected_label'][0];



    data.forEach(function(d) {
        d[thisXvar] = formatNumbers(d[thisXvar]);
        d[thisYvar] = formatNumbers(d[thisYvar]);
        d[thisSizeVar] = d[thisSizeVar] ? formatNumbers(d[thisSizeVar]) : 1;
    })

        data = data.filter(d=> d[thisXvar] != 0)
console.log(data)



    var svg = d3.select("#chart_container svg");
    var g = svg.select('g.graphContainer');
    var g_inner = g.select('g.innerGraph');


   xScale = d3.scaleLinear()
    .domain([selected_element.min_val,selected_element.max_val])
    .range([0, width]);

    yScale = d3.scaleLinear()
    .domain([min_y_value,max_y_value])
    .range([height, 0]);

    rScale = d3.scaleSqrt()
    .domain([0, d3.max(data, function(d){ return d[thisSizeVar]})])
    .range([0, (this_circle_radius)]);

let axis_bottom = d3.axisBottom(xScale).ticks(10).tickFormat(numbers_separators);
let axis_left = d3.axisLeft(yScale).ticks(10);


  g.select('g.innerGraph')
  .attr("transform", "translate(" + padding_left + "," + padding_top + ")");

  g.select("g.axis.axis--x")
  .attr("transform", "translate(" + padding_left + "," + (height + padding_top) +")")
  .call(axis_bottom)
  .selectAll("text")
  .style("text-anchor", "middle")
  .attr("dx", "0em")
  .attr("dy", "0.7em")
  .attr("transform", "rotate(0)");

g.select("g.axis.axis--y")
.attr('transform', 'translate(' + padding_left + ',' + padding_top + ')')
.call(axis_left);



//Canvas doc
// Here https://medium.com/@xoor/implementing-charts-that-scale-with-d3-and-canvas-3e14bbe70f37

// And here https://bl.ocks.org/ejb/e2da5a23e9a09d494bd532803d8db61c

// And here https://d3-graph-gallery.com/graph/canvas.html

// And here https://www.freecodecamp.org/news/d3-and-canvas-in-3-steps-8505c8b27444/

//Objectif : rendre interactif avec Delaunay (successeur de Vorinoi) https://github.com/d3/d3-delaunay

    let this_container = d3.select('#chart_container'),
    this_width = svg_width,
    this_height = svg_height
    this_aspect = this_width / this_height;

let targetWidth = parseInt(this_container.style("width")) - margin.left - margin.right;
let targetHeight = Math.round(targetWidth / this_aspect) - margin.top -  - margin.bottom;


let targetTotalWidth = parseFloat(this_container.style("width"));

let targetTotalHeight = Math.round(targetTotalWidth / this_aspect);


let x_factor = targetTotalWidth / +svg.attr("width")

let y_factor = targetTotalHeight / this_height


const container = d3.select('#chart_container')

const this_margin_left = parseInt((margin.left + padding_left)*x_factor)

container.select('canvas').remove()

const canvasChart = container.append('canvas')
.attr('width', (width)*x_factor)
.attr('height', height*y_factor)
.style('margin-left', this_margin_left + 'px')
.style('margin-top', margin.top*y_factor + 'px')
.attr('class', 'canvas-plot');

const context = canvasChart.node().getContext('2d');

const pointColor = '#3585ff'


    var xScale_canvas = d3.scaleLinear()
    .domain([selected_element.min_val,selected_element.max_val])
    .range([0, width*x_factor]);

    var yScale_canvas = d3.scaleLinear()
    .domain([min_y_value,max_y_value])
    .range([height*y_factor, 0]);

data.forEach(function(d, i) {
if (i % 100 == 0){
/*  console.log(d)*/

}

   drawPoint(d, i);
});


function drawPoint(d, i) {
   context.beginPath();
   context.globalCompositeOperation = "multiply";
   context.globalAlpha = 0.7
   // context.fillStyle = d[thisColorVar];
   context.fillStyle = selected_Yelement[1];
   const px = xScale_canvas(d[thisXvar]);
   const py = yScale_canvas(d[thisYvar]);
   let this_radius = graphParameters['selected_size'][0] ? rScale(d[thisSizeVar]) : this_circle_radius

   context.arc(px, py, this_radius, 0, 2 * Math.PI,true);
   context.fill();
}


/*g_inner
.call(xAxisLabel, graphParameters.selected_xRows[0]);*/

  g_inner
  .select('text.xAxisLabel').remove()

g_inner
  .append('text')
  .attr('class', 'xAxisLabel')
  .text(selected_element.label)
  .attr("transform", "translate(" + (width/2) + " ," + (+ height + margin.top + 20) + ")")
  .style("text-anchor", "middle")


/*g_inner
.call(yAxisLabel, graphParameters.selected_yRows[0]);*/


  g_inner
  .select('text.yAxisLabel').remove()

g_inner
  .append('text')
  .attr('class', 'yAxisLabel')
  .text('Part de vote ' + _.capitalize(selected_Yelement[0]).replace('Le pen', 'Le Pen'))
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .attr("y", (-margin.left))
  .attr("x",0 - (height / 2))

/*    customizeAxis()
    drawLegend()
    addCustomCode()*/

/// Custom code

d3.selectAll('.axis--y .tick text').text(function(d){return d+'%'});
d3.selectAll('.axis--x .tick text').text(function(d){return numbers_separators(d)}); 
d3.selectAll('g.ball circle').style('mix-blend-mode', 'multiply');


}


moment.locale('fr')


const colors_candidats = {
"MACRON":'#F7BA00',
"LE PEN":'#1D2245'
}



const candidate_names = [
'MACRON',
 'LE PEN']

const selected_candidates = [
'MACRON',
'LE PEN'];


d3.select('#information')
.style('min-height', 50 + 'px')

var tooltip_initial_content = '';

const svg = d3.select(".carte svg#geo_map");

const allPaths = svg.selectAll('path');
svg.style('max-height', $(window).height()*0.9 + 'px')


if($(window).width() >= 1000){

  this_zoom_level = 6;
}

var mainColor = '#E3234A';
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;


/////////////////////////
//////////////////////////////////////// configuration

const geoIDVariable = 'id'
const format = d3.format(',')



var color_progressive_scale = d3.scaleLinear()
  .range(['white', 'red'])
  .domain([0, 70]);


var data_legend = [0,10,20, 30, 40, 50, 60, 70, 80];

const parentWidth = d3
.select('body')
.node()
.getBoundingClientRect().width

/*const margin = { top: 0, right: 0, bottom: 0, left: 0 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom*/


// For circo map

var margin_map = { top: 0, right: 20, bottom: 10, left: 0 },
    width_map = 600 - margin_map.left - margin_map.right,
    height_map = 600 - margin_map.top - margin_map.bottom,
    width_legend_map = 600 - margin_map.left - margin_map.right,
    margin_top_legend_map = 30,
    margin_right_legend_map = 0,
    padding_legend_map = 10,
    mapData,
    xAxis_map,
    direction;

var svg_map_geo = d3.select('#map_geo svg.map')
    .attr('width', (width_map + margin_map.left + margin_map.right))
    .attr('height', height_map + margin_map.top + margin_map.bottom)
    // .call(responsivefy, (width_map + margin_map.left + margin_map.right), (height_map + margin_map.top + margin_map.bottom))
    // .call(zoom)
    ;

var g_map = svg_map_geo.append('g')
  .attr('transform', 'translate('+ margin_map.left + ', ' + margin_map.top + ')');

var effectLayer = g_map.append('g')
    .classed('effect-layer', true);

var mapLayer = g_map.append('g')
    .classed('map-layer', true);

var projection = d3.geoMercator()
    .scale(1400)
    .center([3, 45.5])
    .translate([width_map / 2, height_map / 2]);

var path = d3.geoPath()
    .projection(projection);


/////////// Legends and tags

const legend_rect_size = 60

var legend = d3.select('#legend .mapLegend .legendCells').selectAll('.cell')
.data(data_legend)

legend.exit().remove()

var legend_cells = legend
.enter()
.append('g')
.attr('class', 'cell')
.attr('transform', function(d, i){ return 'translate(' + i*legend_rect_size + ',0)'})

legend_cells
.append('rect')
.attr('class', 'swatch')
.attr('height', 15)
.attr('width', legend_rect_size + 2)
.style('fill', function(d){ return color_progressive_scale(d)})

legend_cells
.append('text')
.attr('class', 'label')
.attr('height', 15)
.attr('width', legend_rect_size + 2)
.style('text-anchor', 'end')
.text(function(d){return d + '%'})
.attr('transform', 'translate(11,12)')
.style('fill', d=> d >= 25 ? 'white' : 'black')


d3.select('#legend .mapLegend .legendCells text').remove()

function draw_legendots(){

d3.selectAll('div#legendots .legende_dot').remove();


let data_for_legendots = Object.entries(colors_candidats).filter(d=> selected_candidates.includes(d[0]))


var legendots = d3.select('div#legendots').selectAll('span.legende_dot')
.data(data_for_legendots)



legendots
.enter()
.append('span')
.attr('class', 'legende_dot');


d3.select('div#legendots').selectAll('span.legende_dot')
.append('span')
.attr('class', 'text_legend')
.text(d=>_.capitalize(d[0]).replace('Le pen', 'Le Pen'))

d3.select('div#legendots').selectAll('span.legende_dot')
.append('span')
.attr('class', 'dot')
.style('background-color', d=>d[1])

d3.selectAll('span.legende_dot')
.on('click', function(event, d){

selected_Yelement = d

    makeCirclechart()})

}

draw_legendots()

function draw_affichage(){

d3.selectAll('#affichage .display_element')

let all_displayed_elements = _.cloneDeep(x_variables)

const elements_selection = d3.select('div#affichage').selectAll('div.display_element')
.data(all_displayed_elements)

elements_selection
.enter()
.append('div')
.attr('class', 'display_element')
.text(d=> d.label)
.on('click', function(event, d){

selected_element = d


d3.selectAll('#affichage .display_element')
.style('background-color', '#eee')
.style('color', '#6E6E6E')

let this_background_color = 'black'

/*if(d == 'candidat en tête' || d == 'abstention'){

this_background_color = 'black'
}
else {
  this_background_color = colors_candidats[d]
}*/


d3.select(this)
.style('background-color', this_background_color)
.style('color', '#fff')

/*fillOnClick(d)*/

graphParameters['selected_xRows'][0] = d.name;

makeCirclechart();

// graphParameters['selected_yRows'][0];

})

d3.select('#affichage .display_element')
.style('background-color', 'black')
.style('color', '#fff')

}

draw_affichage()

///Loading data

Promise.all([
    // d3.csv('data/election_data_regT2.csv'),
    d3.csv('data/data2022_presidentielle_T2.csv')
    // d3.csv('data/election_data_depT2.csv'),
/*    d3.csv('https://sav10.github.io/libe-projects/election-presidentielle-2022-T2/data/election_data_depT2.csv'),
    d3.csv('data/data_circos3.csv')*/
/*    d3.csv('data/circos_data.csv')*/
    // d3.csv('https://sav10.github.io/libe-projects/election-presidentielle-2022/data/data_circos3.csv')
]).then(function(files) {
  ready(files[0]
/*    , files[1], files[2]*/
    )
})
/*.catch(function(err) {
  console.log('erreur' + ' ' + err)
})
*/
//// Ready function (to load data)

  function ready(data_explore) {


data_explore.forEach(d =>{
d.Macron = +d['3']
d.Lepen = +d['5']
d.scoreMacron = _.round(100*d.Macron / (d.Macron + d.Lepen), 1)
d.scoreLepen = _.round(100*d.Lepen / (d.Macron + d.Lepen), 1)

let numeric_val = ['Abstentions', 'Blancs', 'Exprimes', 'Inscrits', 'LepenT1', 'MacronT1', 'MelenchonT1', 'ScoreFillonT1'
, 'ScoreLepenT1', 'ScoreMacronT1', 'ScoreMelenchonT1', 'TauxAgricuteurs', 'TauxCadres', 'TauxChomage'
, 'TauxOuvriers', 'TauxRetraites', 'Votants', 'popTotale', 'revenu_median', 'taux65Plus']

for (i in numeric_val){

let e = numeric_val[i]

d[e] = +d[e]
}


})

chart_data = data_explore

initChart();

makeCirclechart();





}

///// End of (long) ready function


//// load SVG map


/// End map from svgn


////////////////////////// Move candidate filters

d3.select('#triangle_droite')
.on('click', function () {
  d3.select('#affichage')
  .style('margin-left', function(){

let all_display_nodes = d3.selectAll('.display_element').nodes()
let current_margin = parseInt(d3.select('#affichage').style('margin-left'))
let this_parent_pos = d3.selectAll('#affichage').node().getBoundingClientRect().x
let new_margin

for (i in _.slice(all_display_nodes, 0,11)){

let this_pos = all_display_nodes[i].getBoundingClientRect().x - this_parent_pos

if (this_pos > -current_margin){


let next_element_order = (+i+1) <  all_display_nodes.length ? (+i+1) : (+i);
new_margin = 15.5 -(all_display_nodes[next_element_order].getBoundingClientRect().x - this_parent_pos)
break
}

}
    return new_margin + 'px'
  })
})

d3.select('#triangle_gauche')
.on('click', function () {
  d3.select('#affichage')
  .style('margin-left', function(){

    let current_margin = parseInt(d3.select(this).style('margin-left'))

    let new_margin = current_margin+150
    new_margin = new_margin > 7 ? 7 : new_margin
    return new_margin + 'px'
  })
})

let drag_start;
let margin_affichage;

var drag = d3.drag()
      .on("start", function(event){
        drag_start = event.x

        margin_affichage = parseInt(d3.select('#affichage').style('margin-left'))
      })
      .on("drag", function(event){

        let this_drag = event.x - drag_start
        let this_margin = margin_affichage+this_drag
        this_margin = this_margin >= 0 ?  this_margin = 0 : this_margin
        this_margin = this_margin <= -1200 ?  this_margin = -1200 : this_margin
        d3.select('#affichage').style('margin-left', d=>this_margin+ 'px')

    })
      .on("end", function(){

      });
d3.select("#affichage").call(drag);


d3.select("#information_button")
.on("mouseover", function(){

d3.select("#map_information")
.style('display', 'block')

})
.on("mouseout", function(){

d3.select("#map_information")
.style('display', 'none')

})

////////////////////////// Utilities functions


function responsivefy(svg) {

   // get container + svg aspect ratio
   var container = d3.select(svg.node().parentNode),
   width = parseInt(svg.style('width')),
   height = parseInt(svg.style("height")),
   aspect = width / height;

   // add viewBox and preserve aspectratio properties
   // call resize so that svg resizes on initial page load
   svg.attr("viewBox", "0 0 " + width + " " + height)
   .attr("preserveAspectRatio", "xMinYMid")
   .call(resize);

   d3.select('svg#map_slider')
   .attr("viewBox", "0 0 " + 1000 + " " + 80)
   .attr("preserveAspectRatio", "xMinYMid")

   // .call(resize);

   // to register multiple listeners for the same event type
   d3.select(window).on("resize." + container.attr("id"), resize);

   function resize() {

     var actualContainerWidth = parseInt(container.style("width"));
     var targetWidth = actualContainerWidth <= max_width  ? actualContainerWidth : 1000;
     var targetHeight = Math.round(targetWidth / aspect);

     svg.attr("width", targetWidth);
     svg.attr("height", targetHeight);
   }
 }


 function roundAndFormatPct(x){
  return Math.abs(_.round(x,1)).toString().replace(".", ",")

     }

     function getBoundingBoxCenter (selection) {
 var element = selection.node();
 var bbox = element.getBBox();
 return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
    }


    function equalToEventTarget() {
 return this == event.target;
    }
