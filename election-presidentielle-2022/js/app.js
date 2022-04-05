var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;
var isChromium = !!window.chrome;
var datapol;
var circosData;
var representation_territoriale = 'departement';
const arr_representation_territoriale = ['region' ,'departement', 'circonscription']
let selected_element = 'candidat en tête'


var geo_objects = {
departement : 
{'container' : 'svg-container-dep',
'location_variable' : 'code_departement',
location_prefix : 'D_'},
region : 
{'container' : 'svg-container-reg',
'location_variable' : 'code_region',
location_prefix : 'R_'}
,
circonscription : 
{'container' : 'svg-container-circ',
'location_variable' : 'id_circo',
location_prefix : 'M_'}
}

moment.locale('fr')


const colors_candidats = {
"HAMON":'#e6476b',
"FILLON":'#35559e',
"MACRON":'#F7BA00',
"DUPONT-AIGNAN":'#19325D',
"LE PEN":'#1D2245',
'POUTOU': "#911D16",
'MÉLENCHON': "#EB404C",
'LASSALLE': "#534384",
'ASSELINEAU': "#cfb096",
'CHEMINADE': "#cfb096",
'PÉCRESSE': "#2458A5",
'ZEMMOUR': "#654235",
'JADOT': "#00A85C",
'ARTHAUD': '#751F17',
'HIDALGO': '#EC4C6B',
'ROUSSEL': '#D80000'
}



const candidate_names = [
'MACRON',
 'MÉLENCHON',
 'LE PEN',
 'PÉCRESSE',
  'ZEMMOUR',
 'JADOT',
 'ROUSSEL',
 'HIDALGO',
 'POUTOU',
 'ARTHAUD',
 'DUPONT-AIGNAN',
 'LASSALLE']

const selected_candidates = [
'MACRON',
'MÉLENCHON',
'LE PEN',
'PÉCRESSE',
'ZEMMOUR'];


const vote_variables = ['Inscrits', 
'Abstentions', 
'Votants', 
'Blancs', 'Nuls',
'Exprimes']


var margin2 = {top: 80, right: 30, bottom: 60, left: 40},
width2 = 1000 - margin2.left - margin2.right,
height2 = 450 - margin2.top - margin2.bottom,
padding = 0.3,
max_width = 1000,
width_slider = (width2 < (mainWidth -70) ? width2 : (mainWidth -70)),
width_slider_g = 960,
width2 = width2 < mainWidth ? width2 : mainWidth,
map,
app_data = {},
minMaxRectWidth = [12,30],
scaleWidth,
thisMinZoom = 2,
mapstate = 0,
fulldata,
daterange = {},
timer_duration = 5000,
this_date_pretty,
currentDate,
maxvalues = {},
tMax,
t0,
selected_dep = [],
last_week_day;

var circleScale = 
d3.scaleSqrt()
.range([5, 40]);


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

reset_tooltip()

/////////////////////////
//////////////////////////////////////// configuration

const geoIDVariable = 'id'
const format = d3.format(',')



var color_progressive_scale = d3.scaleLinear()
  .range(['white', 'red'])
  .domain([0, 70]);


var data_legend = [0,5,10, 15 ,20, 25 ,30, 35];

const parentWidth = d3
.select('body')
.node()
.getBoundingClientRect().width

const margin = { top: 0, right: 0, bottom: 0, left: 0 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom


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
.style('text-anchor', 'middle')
.text(function(d){return d + '%'})
.attr('transform', 'translate(22,12)')

function draw_legendots(){

d3.selectAll('div#legendots .legende_dot').remove();


let data_for_legendots = Object.entries(colors_candidats).filter(d=> selected_candidates.includes(d[0]))

data_for_legendots.push(['Résultats non parvenus', '#eee'])

var legendots = d3.select('div#legendots').selectAll('span.legende_dot')
.data(data_for_legendots)



legendots
.enter()
.append('span')
.attr('class', 'legende_dot');


d3.select('div#legendots').selectAll('span.legende_dot')
.append('span')
.attr('class', 'text_legend')
.text(d=>_.capitalize(d[0]))

d3.select('div#legendots').selectAll('span.legende_dot')
.append('span')
.attr('class', 'dot')
.style('background-color', d=>d[1])




}

draw_legendots()

function draw_affichage(){

d3.selectAll('#affichage .display_element')

let all_displayed_elements = _.cloneDeep(candidate_names)
all_displayed_elements.unshift('candidat en tête', 'participation');

const elements_selection = d3.select('div#affichage').selectAll('div.display_element')
.data(all_displayed_elements)

elements_selection
.enter()
.append('div')
.attr('class', 'display_element')
.text(d=> _.capitalize(d).replace('Le pen', 'Le Pen'))
.on('click', function(event, d){

selected_element = d


d3.selectAll('#affichage .display_element')
.style('background-color', '#eee')
.style('color', '#000')

let this_background_color = ''

if(d == 'candidat en tête' || d == 'participation'){

this_background_color = 'black'
}
else {
  this_background_color = colors_candidats[d]
}


d3.select(this)
.style('background-color', this_background_color)
.style('color', '#fff')

fillOnClick(d)
})

d3.select('#affichage .display_element')
.style('background-color', 'black')
.style('color', '#fff')

}

draw_affichage()

function showTip(data, d, location_variable){


let this_code = d.id;
/*let this_d = _.find(app_data.tx_incidence, d => d.dep == this_code);*/
let this_d = _.find(data, d => d[location_variable] == this_code);
console.log(this_d)
let this_dep_scores = candidate_names.map(function(e){ return {'name': e, 'score': this_d[e+'_score']} })

this_dep_scores = this_dep_scores.sort(function(a,b) {  return b.score - a.score})
this_dep_scores = _.slice(this_dep_scores, 0, 7)

let this_loc_name

if(location_variable == 'code_departement'){
  this_loc_name = this_d['lib_departement'] + ' (' + this_d['code_departement'] + ')'
}
else if (location_variable == 'code_region'){
this_loc_name = this_d['lib_region']
}
else{
this_loc_name = `${this_d['nom_circo']}  ${this_d['num_circo']}<sup>e</sup> circonscription `
}

let this_html = `<span style="font-weight:bold; font-family: 'libesansweb-semicondensed';     letter-spacing: 0.04em;">${this_loc_name}</span>`

console.log(this_dep_scores)

if (selected_element == 'candidat en tête'){

    this_html +=  `<span class='details'>
    ${drawGraph(this_dep_scores)}</span>`

}

else if (selected_element == 'participation'){

let this_selected_candidate = [{'name':'Participation', 'score': _.round(100*this_d['Votants'] / this_d['Inscrits'], 1)}]
    this_html +=  `<span class='details'>
    ${drawGraph(this_selected_candidate)}</span>`


}

else{

let this_selected_candidate = [{'name':selected_element, 'score': this_d[selected_element+'_score']}]
    this_html +=  `<span class='details'>
    ${drawGraph(this_selected_candidate)}</span>`



    console.log(selected_element)
    console.log(this_dep_scores[0].name)

    if (selected_element == this_dep_scores[0].name){
      this_html +=  'Arrivé en tête<br>'
    }

}

this_html += `Nombre de votes exprimés : ${this_d['Exprimes']}<br>
Taux de participation : ${String(_.round(100*this_d['Exprimes'] / +this_d['Inscrits'], 1)).replace('.', ',')}%`

d3.select('#tooltip')
.style('display', 'flex')

d3.select('#map_info2')
.style('visibility', 'visible')

d3.select('#tooltip')
.html(this_html)
.style('opacity', '1')
.style('display', 'block')
}

//// Using force flubber and d3 to morph and move paths 

function transformToCircle(thisPath){

  let thisCenter = getBoundingBoxCenter (thisPath);
  let this_path_d = thisPath.attr('d');
  let this_transformation = flubber.toCircle(this_path_d, thisCenter[0], thisCenter[1], 10);

  thisPath
  .transition()
  .attrTween("d", function(){ return this_transformation });

}

function force_separate_circles(){

  var features = allPaths.data();

  simulation = d3.forceSimulation(features)
  .force("y", d3.forceY(function(d) { return d.centroid[1] }).strength(5))
  .force("x", d3.forceX(function(d) { return d.centroid[0] }).strength(5))
  .force("collide", d3.forceCollide(7).radius(d=> d.radius))
  .stop();

  for (var i = 0; i < 200; ++i) simulation.tick();

    allPaths
  .transition().attr('transform', function(d) { return 'translate(' +Math.round(d.x -d.centroid[0])+ ',' +Math.round(d.y - d.centroid[1]) + ')'});

}

function registered_separate_circles(){

  allPaths
  .transition().attr('transform', function(d) { return 'translate(' +position_departements[d.id][0]+ ',' +position_departements[d.id][1] + ')'});

}


function redraw_paths(){

d3.select('#display_geo_paths')
.style('color', '#fff')
.style('background-color', 'red')
.style('border-color', 'red')

d3.select('#display_proportional_circles')
.style('color', 'red')
.style('background-color', '#fff')
.style('border-color', '#ddd')


d3.select('#taille_proportionnelle')
.style('display', 'none')



let all_those_paths = d3.select('#'+ geo_objects[representation_territoriale].container + ' svg').selectAll('path');


redraw_paths_generic(all_those_paths, correction_paths[representation_territoriale])


for (i in arr_representation_territoriale){

  let this_d = arr_representation_territoriale[i]

if (this_d != representation_territoriale){

all_those_paths = d3.select('#'+ geo_objects[this_d].container + ' svg').selectAll('path');

redraw_paths_generic(all_those_paths, correction_paths[this_d])

}

}


}

function transform_all_paths_to_circle(){

d3.select('#display_proportional_circles')
.style('color', '#fff')
.style('background-color', 'red')
.style('border-color', 'red;')


d3.select('#display_geo_paths')
.style('color', 'red')
.style('background-color', '#fff')
.style('border-color', '#ddd;')

d3.select('#taille_proportionnelle')
.style('display', 'block')


let all_those_paths = d3.select('#'+ geo_objects[representation_territoriale].container + ' svg').selectAll('path');

transform_all_paths_to_circle_generic(all_those_paths, position_circles[representation_territoriale], geo_objects[representation_territoriale].location_prefix)

for (i in arr_representation_territoriale){

  let this_d = arr_representation_territoriale[i]

if (this_d != representation_territoriale){


all_those_paths = d3.select('#'+ geo_objects[this_d].container + ' svg').selectAll('path');

transform_all_paths_to_circle_generic(all_those_paths, position_circles[this_d], geo_objects[this_d].location_prefix)

}

}

}


d3.select('#display_proportional_circles')
.on('click', function(){

  transform_all_paths_to_circle()

  mapstate = 1;

})


d3.select('#display_geo_paths')
.on('click', function(){
  redraw_paths()

  mapstate = 0;
  
})


d3.selectAll('#representation_territoriale .actionButton')
.on('click', function(){

let id_map =  d3.select(this).attr('data-value')
let this_id =  d3.select(this).attr('id')


d3.selectAll('#representation_territoriale .actionButton')
.style('color', 'red')
.style('background-color', '#fff')
.style('border-color', '#ddd')

d3.select('#' +this_id)
.style('color', '#fff')
.style('background-color', 'red')
.style('border-color', 'red')

d3.selectAll('.svg_map')
.style('visibility', 'hidden')
.style('height', 0)

d3.select('#' + id_map)
.style('visibility', 'visible')
.style('height', 'initial')

if (id_map =='svg-container-dep'){
  representation_territoriale = 'departement'
}
else if (id_map =='svg-container-reg'){
  representation_territoriale = 'region'
}
else{
  representation_territoriale = 'circonscription'
}

}

)

///Loading data

// queue()
//   .defer(d3.csv, 'data/taux_indicateurs_couleurs_departements3.csv')
//   .defer(d3.csv, 'data/presidentielle_2017_departement_T1.csv')
//   .defer(d3.json, 'data/circonscriptions.geojson')
//   .defer(d3.csv, 'data/data_circos.csv')
//   .await(ready)



Promise.all([
    d3.csv('data/taux_indicateurs_couleurs_departements3.csv'),
    d3.csv('data/presidentielle_2017_departement_T1.csv'),
    d3.csv('data/election_data_reg.csv'),
    d3.csv('data/election_data_dep.csv'),
    d3.csv('data/data_circos2.csv')
]).then(function(files) {
  ready(files[0], files[1], files[2], files[3], files[4])
}).catch(function(err) {
  console.log('erreur' + ' ' + err)
})


//// Ready function (to load data)

  function ready(data, data_pol, data_reg, data_dep, circos_data) {



    data.forEach(d => {
 d.taux_de_positivite = +d.taux_de_positivite;
 d.taux_incidence = +d.taux_incidence;
 d.population = +d.population;
    })



    data_dep.forEach(d =>{

 candidate_names.forEach(e =>{
   d[e] = +d[e]
 })

 vote_variables.forEach(e =>{
   d[e] = +d[e]
 })

 candidate_names.forEach(e =>{
   d[e + '_score'] = _.round(+ 100*d[e] / d['Exprimes'], 1)
 })

 let this_dep_score = candidate_names.map(function(e){ return {'name': e, 'score': d[e]} })
 let this_winner = this_dep_score.sort(function(a,b) {  return b.score - a.score})[0]

 d['loc_winner'] = this_winner['name']
 d['loc_winner_score'] = this_winner['score']

    })

console.log(data_dep)


    data_reg.forEach(d =>{

 candidate_names.forEach(e =>{
   d[e] = +d[e]
 })

 vote_variables.forEach(e =>{
   d[e] = +d[e]
 })

 candidate_names.forEach(e =>{
   d[e + '_score'] = _.round(+ 100*d[e] / d['Exprimes'], 1)
 })

 let this_dep_score = candidate_names.map(function(e){ return {'name': e, 'score': d[e]} })
 let this_winner = this_dep_score.sort(function(a,b) {  return b.score - a.score})[0]

 d['loc_winner'] = this_winner['name']
 d['loc_winner_score'] = this_winner['score']

    })


    circos_data.forEach(d =>{

 candidate_names.forEach(e =>{
   d[e] = +d[e]
 })

 vote_variables.forEach(e =>{
   d[e] = +d[e]
 })

 candidate_names.forEach(e =>{
   d[e + '_score'] = _.round(+ 100*d[e] / d['Exprimes'], 1)
 })

 let this_dep_score = candidate_names.map(function(e){ return {'name': e, 'score': d[e]} })
 let this_winner = this_dep_score.sort(function(a,b) {  return b.score - a.score})[0]

 d['loc_winner'] = this_winner['name']
 d['loc_winner_score'] = this_winner['score']

    })


    datapol = data_pol;
    console.log(datapol)
    circleScale.domain(d3.extent(data, d=>d.population));

    circosData = circos_data;

    console.log(circos_data)



d3.xml("img/carte-circonscriptions.svg")
.then(data => {
  d3.select("#svg-container-circ").node().append(data.documentElement)


let svg_container = 'svg-container-circ'
let circle_range = [3, 4]
let location_variable = 'id_circo'
let location_prefix = 'M_'
let location_type = 'circonscription'

geo_objects['circonscription']['data'] = circosData;

console.log(circos_data)

loadMapFromSvgGeneric(circos_data, svg_container, circle_range, location_variable, location_prefix, location_type)

  d3.select("#svg-container-circ")
  .style('height', 0)

});


d3.xml("img/carte-departements.svg")
.then(data => {
  d3.select("#svg-container-dep").node().append(data.documentElement)

  // loadMapFromSvgDep(data_dep)

let svg_container = 'svg-container-dep'
let circle_range = [3, 20]
let location_variable = 'code_departement'
let location_prefix = 'D_'
let location_type = 'departement'

geo_objects['departement']['data'] = data_dep;

loadMapFromSvgGeneric(data_dep, svg_container, circle_range, location_variable, location_prefix, location_type)



});

d3.xml("img/carte-regions.svg")
.then(data => {
  d3.select("#svg-container-reg").node().append(data.documentElement)

let svg_container = 'svg-container-reg'
let circle_range = [4, 45]
let location_variable = 'code_region'
let location_prefix = 'R_'
let location_type = 'region'

  geo_objects['region']['data'] = data_reg;

 /* loadMapFromSvgReg(data_reg)*/

  loadMapFromSvgGeneric(data_reg, svg_container, circle_range, location_variable, location_prefix, location_type)

  d3.select("#svg-container-reg").style('height', 0)

});


}

///// End of (long) ready function

//// Map of circos


function loadMapFromSvgCirc() {

  var svg_map_circos = d3.select('#svg-container-circ svg');


  let all_paths_circo = svg_map_circos.selectAll('path');


  console.log(all_paths_circo)


var circleScaleCirco = 
d3.scaleSqrt()
.range([3, 4]);

circleScaleCirco.domain(d3.extent(circosData, d=>+d.votants));


    let allSvgNodes_circo = all_paths_circo.nodes();
    for (i in allSvgNodes_circo){
 let this_id = d3.select(allSvgNodes_circo[i]).attr('id')
 this_id = this_id.substring(2)
 let this_pop = +circosData.filter(d=> d.id_circo == this_id)[0].votants;
 let this_radius = Math.round(circleScaleCirco(this_pop));
 let this_path_d = d3.select(allSvgNodes_circo[i]).attr('d');
 let this_centroid = getBoundingBoxCenter(d3.select(allSvgNodes_circo[i]));
 let this_to_circle_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius);
 let this_from_circle_function = flubber.fromCircle(this_centroid[0], this_centroid[1], this_radius, this_path_d);

 d3.select(allSvgNodes_circo[i]).datum({'id': this_id, 'path': this_path_d, 'centroid': this_centroid, 
   'to_circle_function': this_to_circle_function,
   'from_circle_function': this_from_circle_function,
   'population':this_pop,
   'radius': this_radius
 });
  }


all_paths_circo.style('fill', 'black')




//// Transformation to circle when starting 
setTimeout(() => {

  transform_all_paths_to_circle_generic(all_paths_circo, position_circles.circonscription, 'M_')
mapstate = 1;


},
   500);


// setTimeout(() => {

//   redraw_paths_generic(all_paths_circo, correction_paths.circonscription)
// mapstate = 1;


// },
//    5000)

}


/// End map from svg circos function


//// SVG map of dep


function loadMapFromSvgGeneric(data, svg_container, circle_range, location_variable, location_prefix, location_type) {

  let this_svg_map = d3.select('#'+ svg_container + ' svg');
  var all_those_paths = this_svg_map.selectAll('path');

console.log(all_those_paths)

let thisCircleScale = 
d3.scaleSqrt()
.range(circle_range);


thisCircleScale.domain(d3.extent(data, d=>+d.Inscrits));


console.log(data)

  let allSvgNodes = all_those_paths.nodes();

  for (i in allSvgNodes){
 let this_id = d3.select(allSvgNodes[i]).attr('id')
 this_id = this_id.substring(2)
 let this_pop = +data.filter(d=> d[location_variable] == this_id)[0].Inscrits;
/* let this_pop = +circosData.filter(d=> d.id_circo == this_id)[0].votants;*/
 let this_radius = Math.round(thisCircleScale(this_pop));
 let this_path_d = d3.select(allSvgNodes[i]).attr('d');
 let this_centroid = getBoundingBoxCenter(d3.select(allSvgNodes[i]));
 let this_to_circle_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius);
 let this_from_circle_function = flubber.fromCircle(this_centroid[0], this_centroid[1], this_radius, this_path_d);

 d3.select(allSvgNodes[i]).datum({'id': this_id, 'path': this_path_d, 'centroid': this_centroid, 
   'to_circle_function': this_to_circle_function,
   'from_circle_function': this_from_circle_function,
   'population':this_pop,
   'radius': this_radius
 });
  }


/*all_those_paths.style('fill', 'black')*/



  all_those_paths
  .style('fill', d => {

    if (typeof data.filter(function(e){return e[location_variable] == d.id})[0] !== 'undefined') {
 return colors_candidats[data.filter(function(e){return e[location_variable]  == d.id})[0].loc_winner]
    }
    return '#fff'
  })
  .style('fill-opacity', 1)
  .style('stroke', '#aaa')
  .style('stroke-width', 0)
  .on('mouseover', function(event, d) {
   /* showTip(data, d)*/
    all_those_paths
    .style('stroke-opacity', 0)
    .style('fill-opacity', .5)
    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 1)

  })
  .on('mouseout', function(event, d) {


    if (selected_dep.length > 0){

     /*showTip(data, selected_dep[1])*/
    all_those_paths
    .style('stroke-opacity', 1)
    .style('fill-opacity', .5)

    d3.select(selected_dep[0])
    .style('fill-opacity', 1)

    }
    else{
    /*reset_tooltip()*/

    all_those_paths
    .style('stroke-opacity', 1)
    .style('fill-opacity', 1)

    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 1)
    }

  })


/// Click function for shape

d3.select('body').on("click",function(event, d){

  console.log(event)



    var outside = d3.selectAll('svg path').filter(equalToEventTarget).empty();
    // var outside = d3.select(event.path[0]).attr('class') != 'cls-1'
    if (outside) {
    reset_tooltip()
selected_dep = [];


    all_those_paths
    .style('stroke-opacity', 1)
    .style('fill-opacity', 1)

    d3.selectAll('path')
    .style('fill-opacity', 1)

    }
else{
}



});


  all_those_paths
  .on('click', function(event, d) {
    console.log('clicking')
    selected_dep = [this, d];
    showTip(data, d, location_variable)
    all_those_paths
    .style('stroke-opacity', 0)
    .style('fill-opacity', .5)
    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 1)
  })



//// Transformation to circle when starting 
setTimeout(() => {

  transform_all_paths_to_circle_generic(all_those_paths, position_circles[location_type], location_prefix)
mapstate = 1;


},
   500);







// setTimeout(() => {

//   redraw_paths_generic(all_those_paths, correction_paths.departement)
// mapstate = 1;


// },
//    5000)



}



/// End map from svg dep function

function loadMapFromSvgReg(data) {

  var svg_map_circos = d3.select('#svg-container-reg svg');
  let all_paths_circo = svg_map_circos.selectAll('path');



var circleScaleCirco = 
d3.scaleSqrt()
.range([4, 45]);


console.log(data)


circleScaleCirco.domain(d3.extent(data, d=>+d.Inscrits));

/*circleScaleCirco.domain(d3.extent(circosData, d=>+d.votants));*/


  let allSvgNodes_circo = all_paths_circo.nodes();

  for (i in allSvgNodes_circo){
 let this_id = d3.select(allSvgNodes_circo[i]).attr('id')
 this_id = this_id.substring(2)
 let this_pop = +data.filter(d=> d['code_region'] == this_id)[0].Inscrits;
/* let this_pop = +circosData.filter(d=> d.id_circo == this_id)[0].votants;*/
 let this_radius = Math.round(circleScaleCirco(this_pop));
 let this_path_d = d3.select(allSvgNodes_circo[i]).attr('d');
 let this_centroid = getBoundingBoxCenter(d3.select(allSvgNodes_circo[i]));
 let this_to_circle_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius);
 let this_from_circle_function = flubber.fromCircle(this_centroid[0], this_centroid[1], this_radius, this_path_d);

 d3.select(allSvgNodes_circo[i]).datum({'id': this_id, 'path': this_path_d, 'centroid': this_centroid, 
   'to_circle_function': this_to_circle_function,
   'from_circle_function': this_from_circle_function,
   'population':this_pop,
   'radius': this_radius
 });
  }


all_paths_circo.style('fill', 'black')


  all_paths_circo
  .style('fill', d => {

    if (typeof data.filter(function(e){return e['code_region'] == d.id})[0] !== 'undefined') {
 return colors_candidats[data.filter(function(e){return e['code_region']  == d.id})[0].loc_winner]
    }
    return '#fff'
  })


/// Transformation to circle when starting 
// setTimeout(() => {

  /*transform_all_paths_to_circle_generic(all_paths_circo, position_circles.region, 'R_')*/
//   force_separate_circles_generic(all_paths_circo)
// mapstate = 1;


// },
//    500);



/*console.log(all_paths_circo)

var circleScaleCirco = 
d3.scaleSqrt()
.range([3, 20]);


circleScaleCirco.domain(d3.extent(datapol, d=>+d.Votants));*/

/*circleScaleCirco.domain(d3.extent(circosData, d=>+d.votants));*/


/*  let allSvgNodes_circo = all_paths_circo.nodes();
  for (i in allSvgNodes_circo){
 let this_id = d3.select(allSvgNodes_circo[i]).attr('id')
 this_id = this_id.substring(2)
 let this_pop = +datapol.filter(d=> d['CodeDépartement'] == this_id)[0].Votants;*/
/* let this_pop = +circosData.filter(d=> d.id_circo == this_id)[0].votants;*/
/* let this_radius = Math.round(circleScaleCirco(this_pop));
 let this_path_d = d3.select(allSvgNodes_circo[i]).attr('d');
 let this_centroid = getBoundingBoxCenter(d3.select(allSvgNodes_circo[i]));
 let this_to_circle_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius);
 let this_from_circle_function = flubber.fromCircle(this_centroid[0], this_centroid[1], this_radius, this_path_d);

 d3.select(allSvgNodes_circo[i]).datum({'id': this_id, 'path': this_path_d, 'centroid': this_centroid, 
   'to_circle_function': this_to_circle_function,
   'from_circle_function': this_from_circle_function,
   'population':this_pop,
   'radius': this_radius
 });
  }*/


/*all_paths_circo.style('fill', 'black')

  let pathsize = all_paths_circo.size();
  let pathsCount = 0;



all_paths_circo
.transition()
.duration(2000)
.attrTween("d", function(d){ return d.to_circle_function})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    //force_separate_circles_generic(all_paths_circo)
    registered_separate_circles_generic(all_paths_circo, position_circles.departement, 'D_')
  }
})*/

//// Transformation to circle when starting 
setTimeout(() => {

  transform_all_paths_to_circle_generic(all_paths_circo, position_circles.region, 'R_')
mapstate = 1;


},
   500);


/*setTimeout(() => {

  redraw_paths_generic(all_paths_circo, correction_paths.region)
mapstate = 1;


},
   5000)*/



}




/// Transform functions for map

function force_separate_circles_generic(those_paths){




  var features = those_paths.data();

  simulation = d3.forceSimulation(features)
  .force("y", d3.forceY(function(d) { return d.centroid[1] }).strength(5))
  .force("x", d3.forceX(function(d) { return d.centroid[0] }).strength(5))
  .force("collide", d3.forceCollide(7).radius(d=> d.radius))
  .stop();

  for (var i = 0; i < 300; ++i) simulation.tick();

    those_paths
  .transition().duration(3000).attr('transform', function(d) { return 'translate(' +Math.round(d.x -d.centroid[0])+ ',' +Math.round(d.y - d.centroid[1]) + ')'});

}


function registered_separate_circles_generic(those_paths, those_positions, this_prefix){

  console.log(this_prefix)
  console.log(those_positions)
  console.log(those_paths)

  those_paths
  .transition()
  .duration(2000)
  .attr('transform', function(d) { 
    return 'translate(' +those_positions[this_prefix +  d.id][0]+ ',' +those_positions[this_prefix +  d.id][1] + ')'});
}


function redraw_paths_generic(those_paths, circos_corrections){

  let pathsize = those_paths.size();
  let pathsCount = 0;

 
  those_paths
  .transition()
  .duration(700)
  .attrTween("d", function(d){ return d.from_circle_function})
  .on('end', function(){
    pathsCount++;
    if (pathsCount >= pathsize){
 those_paths.filter(function(d){return circos_corrections.includes(d.id) }).attr("d", function(d){ return d.path})

 those_paths
 .transition()
 .attr('transform', 'translate(0,0)')
    }
  })
  ;

}




function transform_all_paths_to_circle_generic(those_paths, those_positions, this_prefix){


d3.select('#display_proportional_circles')
.style('color', '#fff')
.style('background-color', 'red')
.style('border-color', 'red')

d3.select('#display_geo_paths')
.style('color', 'red')
.style('background-color', '#fff')
.style('border-color', '#ddd')


  let pathsize = those_paths.size();
  let pathsCount = 0;

those_paths.transition()
.duration(1000)
.attrTween("d", function(d){ return d.to_circle_function})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    registered_separate_circles_generic(those_paths, those_positions, this_prefix)
  }
})

}


function reset_tooltip(){


d3.select('#minigraph_container')
.style('display', 'none')

d3.select('#tooltip')
.style('display', 'none')

d3.select('#map_info2')
.style('visibility', 'hidden')


d3.select('#sparkline').select('*').remove()
}

////// Fill map when clicking on tag

  function fillOnClick(name){


if (name == 'candidat en tête') {

for (i in geo_objects){


  let this_data = geo_objects[i].data
  if (this_data){
  let all_those_paths = d3.select('#'+ geo_objects[i].container + ' svg').selectAll('path');

  all_those_paths
  .style('stroke-width', 0)
  .style('fill', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id}) !== 'undefined') {

 return colors_candidats[this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0].loc_winner]
    }
    return '#fff'
  })


  }


}

d3.select('#legendots')
.style('display', 'block')


d3.select('#legend')
.style('display', 'none')

}

else if (name == 'participation'){


let this_color_range = d3.scaleLinear()
  .range(['white', 'black'])
  .domain([0, 100]);

for (i in geo_objects){

  let this_data = geo_objects[i].data
    if (this_data){
  let all_those_paths = d3.select('#'+ geo_objects[i].container + ' svg').selectAll('path');

  all_those_paths
  .style('stroke-width', 0)
  .style('fill', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {
 let this_dep_participation = +this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0]['Exprimés_ins']
 return this_color_range(this_dep_participation)
    }
    return '#fff'

  })


}



}

color_progressive_scale
.range(['white', 'black'])
.domain([0, 100]);
legend_cells.select('.swatch')
.style('fill', function(d){ return color_progressive_scale(d)})


d3.select('#legendots')
.style('display', 'none')


d3.select('#legend')
.style('display', 'block')


/*d3.select('#legend #intitule_legend')
.text('Répartition de la participation')*/

}

else{

d3.selectAll ('#morphocarte svg path')
.style('stroke', 'black')
.style('stroke-opacity', 1)

let this_color = colors_candidats[name];


let this_color_range = d3.scaleLinear()
  .range(['white', this_color])
  .domain([0, 50]);

for (i in geo_objects){

  let this_data = geo_objects[i].data


    if (this_data){
  console.log(this_data)

  let all_those_paths = d3.select('#'+ geo_objects[i].container + ' svg').selectAll('path');

  all_those_paths
  .style('fill', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {
 let this_dep_candidate_score = this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0][name + '_score']
 return this_color_range(this_dep_candidate_score)
    }
    return '#fff'
  })
  .style('stroke-width', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {
 let this_dep_winner = this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0].loc_winner
 return this_dep_winner == name ? 1 : 0;
    }
    return 0
  })
}


}

color_progressive_scale
.range(['white', this_color])
.domain([0, 50]);

legend_cells.select('.swatch')
.style('fill', function(d){ return color_progressive_scale(d)})


d3.select('#legendots')
.style('display', 'none')


d3.select('#legend')
.style('display', 'block')


/*d3.select('#legend #intitule_legend')
.text('Répartition du vote ' + _.capitalize(name))*/

}
  }

function drawGraph(range){

var this_html = '<div style="margin-top:10px">';

for (i in range){
  var d = range[i]
  var html_chunk = '<div style="margin-top:5px">'
  // html_chunk += `<div >${d.tete_liste}</div>
  html_chunk += `<div style="float:right;margin-right: 4px;">  ${d.score != 100 ? d.score + ' %' : '' }</div><div >${d.name}</div>
      <div style="height:12px;background-color: #eee"><div style="height:12px;width:${d.score}%;background-color:${selected_element == 'participation' ? 'grey' : colors_candidats[d.name]};"></div>
      </div>`

      if (d.score == 100){
   html_chunk += '<p style="font-size: 18px;margin-top:-20px">Élu au 1<sup>er</sup> tour<p>'
      }


html_chunk += '</div>'

this_html += html_chunk
}

this_html += '</div>'

return this_html
}

////////////////////////// Move candidate filters

d3.select('#triangle_droite')
.on('click', function () {
  d3.select('#affichage')
  .style('margin-left', function(){

let all_display_nodes = d3.selectAll('.display_element').nodes()
let current_margin = parseInt(d3.select('#affichage').style('margin-left'))
let this_parent_pos = d3.selectAll('#affichage').node().getBoundingClientRect().x
let new_margin

for (i in all_display_nodes){

let this_pos = all_display_nodes[i].getBoundingClientRect().x - this_parent_pos

if (this_pos > -current_margin){


let next_element_order = (+i+1) <  all_display_nodes.length ? (+i+1) : (+i);

new_margin = 22.5 -(all_display_nodes[next_element_order].getBoundingClientRect().x - this_parent_pos)
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
    new_margin = new_margin > 0 ? 0 : new_margin
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

 d3.selectAll(".shareTwitter")
 .on('click', function(event, d){ shareTwitter()});

 d3.selectAll(".shareFacebook")
 .on('click', function(event, d){ shareFacebook()});

 function shareFacebook () {
   var url = encodeURIComponent(window.location.origin + window.location.pathname),
   link = 'http://www.facebook.com/sharer/sharer.php?u=' + url ;
   window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
 };

 function shareTwitter () {
   var url = encodeURIComponent(window.location.origin + window.location.pathname),
   text = "La carte de quatre indicateurs pour suivre l'évolution de la circulation du Coronavirus, mise à jour quotidiennement https://www.liberation.fr/apps/2020/09/covid-19-la-carte-de-vigilance/ via @libe",
   link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
   window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');

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


////// Positioning bubble deparetements

const position_departements  = {
  "971" : [0, 0], "972" : [0, 0], "973" : [0, 0], "974" : [0, 0], "976" : [0, 0], "75" : [-1, 9], "77" : [17, 42],
  "78" : [-37, 35], "91" : [-7, 50], "92" : [-60, -15], "93" : [32, -43], "94" : [60, 0], "95" : [-14, -35], "18" : [-4, 3],
  "28" : [-12, 57], "36" : [0, 1], "37" : [-6, 5], "41" : [3, 31], "45" : [27, 42], "21" : [0, 0], "25" : [0, 0],
  "39" : [0, 0], "58" : [3, 1], "70" : [0, 0], "71" : [-1, -7], "89" : [19, 26], "90" : [-7, 9], "14" : [-4, -3],
  "27" : [-45, 29], "50" : [-2, 0], "61" : [-16, 24], "76" : [-17, -23], "02" : [31, -1], "59" : [24, -10],
  "60" : [0, -50], "62" : [-12, -32], "80" : [-34, -26], "08" : [5, -6], "10" : [9, 10], "51" : [30, -8],
  "52" : [0, 0], "54" : [-10, 11], "55" : [0, 17], "57" : [5, -12], "67" : [4, 2], "68" : [0, 2], "88" : [0, 0],
  "44" : [-2, 0], "49" : [-1, 4], "53" : [-8, 6], "72" : [-6, 14], "85" : [1, 3], "22" : [0, 0], "29" : [0, 0],
  "35" : [-1, -2], "56" : [0, 0], "16" : [0, 0], "17" : [0, 0], "19" : [0, 0], "23" : [0, 0],  "24" : [0, 0],
  "33" : [0, 0], "40" : [0, 0], "47" : [0, 0], "64" : [0, 0], "79" : [0, 0],  "86" : [0, 1], "87" : [0, 0], "09" : [4, 8],
  "11" : [0, -3], "12" : [0, 0], "30" : [1, -6],  "31" : [0, -1], "32" : [0, 0], "34" : [-2, 2], "46" : [0, 0], "48" : [0, 0],
  "65" : [0, 0],  "66" : [0, 2], "81" : [0, 0], "82" : [0, 0], "01" : [14, -13], "03" : [0, 0], "07" : [0, 0],
  "15" : [0, 0], "26" : [-7, 3], "38" : [3, 1], "42" : [-20, 23], "43" : [0, 10], "63" : [-4, -4], "69" : [-1, -6],
  "73" : [7, 2], "74" : [9, 0], "04" : [0, 0], "05" : [0, 0], "06" : [1, 0], "13" : [-2, 6], "83" : [1, 1], "84" : [10, -16],
  "2A" : [0, 0], "2B" : [0, 0]
  };


const correction_paths = {
   circonscription : 
   ['56002', '56005', '56006', '29006', '85003', '17001', '35007', '17005', 'ZZ001', 'ZZ002', 'ZZ003', 'ZZ004', 'ZZ005',
  , 'ZZ006', 'ZZ007', 'ZZ008', 'ZZ009', 'ZZ010', 'ZZ011', '64002', '64003', '65002', '26003', '26003', '84004', '62009', '62010', '62012',
  '59005', '59011', '59015', '59016', '59017', '59018', '59019', '59020', '59021','78001','78003','78011','78012',
  '71003', '58002', '21005' ,'16003',
   'ZS001', 'ZW001', 'ZP001', 'ZP002', 'ZP003',
  'ZN001', 'ZN002', 'ZX001', 'ZM001', 'ZM002', 'ZA001', 'ZA002', 'ZA004'],
  departement : 
  [ '26' ,'29','56',  '85', '17', '35', 'ZZ', '64', '64', '65','84', '62',
  '59','78','71', '58', '21' ,'16', 'ZS', 'ZW', 'ZP','ZN', 'ZX', 'ZM', 'ZA'],
  region : 
  ['84', '93', '52', '53', '75','76' ,'ZS', 'ZW', 'ZP','ZN', 'ZX', 'ZM', 'ZA', 'ZZ']
}

const position_circles = {
  circonscription : 
{
"M_33004": [3,-1], "M_38001": [4,2], "M_59010": [0,-8], "M_33007": [-1,4], "M_01001": [2,0], "M_01002": [6,-2],
"M_01003": [0,-2], "M_01004": [-2,-1], "M_01005": [-1,-4], "M_02001": [1,1], "M_02002": [3,-1], "M_02003": [2,-1],
"M_02004": [10,-8], "M_02005": [10,-6], "M_03001": [0,0], "M_03002": [0,0], "M_03003": [0,0], "M_04001": [0,0],
"M_04002": [0,0], "M_05001": [0,0], "M_05002": [0,0], "M_06002": [-2,-2], "M_06004": [1,-3], "M_06005": [2,0],
"M_06006": [0,-4],
"M_06007": [-5,-4], "M_07001": [0,0], "M_07002": [0,1], "M_07003": [-1,0], "M_08001": [0,0], "M_08002": [0,0],
"M_08003": [0,0], "M_09001": [0,0], "M_09002": [0,0], "M_10001": [0,0], "M_10002": [0,1], "M_11001": [0,0],
"M_11002": [0,0],
"M_11003": [0,0], "M_12001": [0,0], "M_12002": [0,0], "M_12003": [0,0], "M_13008": [-2,-2], "M_13009": [4,-2],
"M_13010": [6,-4], "M_13011": [2,-5], "M_13012": [-5,0], "M_13013": [-6,2], "M_13014": [3,-6], "M_13015": [-2,-3],
"M_13016": [1,0], "M_14001": [-1,1], "M_14002": [0,1], "M_14003": [1,1], "M_14004": [0,-1], "M_14005": [-3,-1],
"M_14006": [0,0],
"M_15001": [0,0], "M_15002": [0,0], "M_16001": [0,0], "M_16002": [-1,1], "M_16003": [0,-1], "M_17001": [0,0],
"M_17002": [0,0], "M_17003": [0,0], "M_17004": [0,0], "M_17005": [0,0], "M_18001": [0,0], "M_18002": [0,0],
"M_18003": [0,0],
"M_19001": [0,0], "M_19002": [0,0], "M_21002": [0,-1], "M_21004": [0,0], "M_21005": [0,0], "M_22001": [0,0],
"M_22002": [0,0], "M_22003": [0,0], "M_22004": [0,0], "M_22005": [0,0], "M_23001": [0,0], "M_24001": [0,0],
"M_24002": [0,0],
"M_24003": [0,0], "M_24004": [0,0], "M_25003": [-2,2], "M_25004": [0,-1], "M_25005": [0,0], "M_26001": [-1,2],
"M_26002": [1,0], "M_26003": [0,0], "M_26004": [1,-1], "M_27003": [-7,-1], "M_27004": [-11,1], "M_27005": [-9,-13],
"M_34006": [-2,0], "M_38002": [-2,3], "M_56005": [0,0], "M_57006": [1,1], "M_59005": [-3,-1], "M_59006": [0,-3],
"M_59016": [3,-2],
"M_59017": [3,4], "M_59020": [6,-1], "M_78004": [-5,9], "M_78005": [-18,-2], "M_83003": [6,3],
"M_91001": [-10,21], "M_91006": [-14,14], "M_92007": [1,18], "M_92012": [-20,5], "M_93003": [31,-4], "M_06001": [0,5],
"M_31002": [1,-4], "M_31003": [3,1], "M_33002": [-2,0], "M_59008": [5,-10], "M_59009": [12,-5], "M_67003": [1,-1],
"M_69006": [3,-7], "M_95005": [2,-21], "M_13001": [2,5], "M_30001": [0,2], "M_30006": [-2,-1], "M_31004": [-5,3],
"M_59002": [9,0], "M_67002": [5,3], "M_69002": [-8,-3], "M_69004": [6,0], "M_92009": [-13,-6], "M_28002": [-16,4],
"M_28003": [-8,6], "M_28004": [-9,10], "M_29001": [0,0], "M_29003": [-1,-4], "M_29004": [0,0], "M_29005": [0,0],
"M_29006": [2,1], "M_29007": [0,0], "M_29008": [0,0], "M_30002": [4,5], "M_30003": [0,-4], "M_30004": [-1,-3],
"M_30005": [0,0], "M_31005": [-1,-4], "M_31006": [-3,-2], "M_31007": [-2,3], "M_31008": [0,0], "M_31010": [3,1],
"M_32001": [0,0], "M_32002": [0,0], "M_33005": [0,0], "M_33008": [-1,0], "M_33009": [0,1], "M_33010": [1,0],
"M_33011": [1,-1], "M_33012": [2,0],
"M_34004": [-3,-2], "M_34005": [0,0], "M_34007": [0,4], "M_35002": [0,0], "M_35003": [-1,-1], "M_35004": [0,0],
"M_35005": [1,0], "M_35006": [0,0], "M_35007": [0,0], "M_36001": [0,0], "M_36002": [0,0], "M_37002": [1,0],
"M_37003": [0,0],
"M_37004": [0,0], "M_37005": [-1,0], "M_38004": [2,1], "M_38005": [1,-3], "M_38006": [8,-5], "M_38007": [4,2],
"M_38008": [2,5], "M_38009": [-1,5], "M_38010": [4,3], "M_39001": [0,0], "M_39002": [0,0], "M_39003": [-1,1],
"M_40001": [0,0], "M_40002": [0,0], "M_40003": [0,0], "M_41001": [0,0], "M_41002": [0,0], "M_41003": [0,1],
"M_42003": [-2,1], "M_42004": [-4,6], "M_42005": [-1,-1], "M_42006": [-3,1], "M_43001": [0,2], "M_43002": [0,0],
"M_44006": [-1,-1], "M_44007": [-3,0], "M_44008": [1,-1], "M_44009": [-1,2], "M_44010": [1,2], "M_45003": [2,6],
"M_45004": [-2,10], "M_45005": [-3,19], "M_46001": [0,0], "M_46002": [0,0], "M_47001": [0,0], "M_47002": [0,0],
"M_47003": [0,0], "M_48001": [0,0], "M_49005": [0,0], "M_49007": [0,0], "M_50001": [0,0], "M_50002": [0,0],
"M_50003": [0,0],
"M_50004": [0,0], "M_51001": [6,-5], "M_51002": [6,-3], "M_51003": [8,-7], "M_51004": [1,0], "M_51005": [1,1],
"M_52001": [0,0], "M_52002": [0,0], "M_53001": [2,0], "M_53002": [0,0], "M_53003": [-2,0], "M_54003": [-1,0],
"M_54004": [0,0], "M_54005": [-1,-2], "M_54006": [-4,0], "M_55001": [0,0], "M_55002": [0,0], "M_56001": [0,0],
"M_56002": [0,0],
"M_56003": [0,0], "M_56004": [0,0], "M_56006": [0,0], "M_57003": [1,-1], "M_57004": [0,0], "M_57005": [0,0],
"M_57007": [1,-2], "M_57008": [0,-1], "M_57009": [1,0], "M_58001": [0,0], "M_58002": [0,0], "M_59015": [-3,-6],
"M_59021": [9,4],
"M_60001": [0,-14], "M_60002": [-7,-15], "M_60003": [-6,-21], "M_60004": [10,-18], "M_60005": [15,-7],
"M_60006": [5,-12], "M_60007": [4,-24], "M_61001": [0,0], "M_61002": [-7,1], "M_61003": [0,0], "M_62001": [1,2],
"M_62002": [2,3], "M_62004": [0,0], "M_62005": [-1,0], "M_62006": [-1,-1], "M_62007": [-3,0], "M_62008": [0,-3],
"M_62009": [-3,0], "M_62010": [-10,-2], "M_62012": [-10,6], "M_63002": [-1,-1], "M_63003": [0,0],
"M_63004": [0,1], "M_63005": [0,0], "M_64002": [-1,1], "M_64003": [-2,1], "M_64004": [0,0],
"M_64005": [0,0], "M_64006": [0,0], "M_65001": [0,0], "M_65002": [2,1], "M_66002": [-1,0],
"M_66003": [0,0], "M_66004": [0,0], "M_67004": [-3,-3], "M_67005": [0,0], "M_67006": [-1,1], 
"M_67007": [0,0], "M_67008": [3,-1], "M_67009": [-3,-3], "M_68002": [-1,-1], "M_68003": [1,2],
"M_68004": [0,-3], "M_69008": [-4,-3], "M_69009": [0,-5], "M_69010": [-10,-6], "M_69011": [-2,6],
"M_69012": [-12,1], "M_69013": [10,1], "M_70001": [0,0], "M_70002": [0,0], "M_71001": [0,-2],
"M_38003": [0,-1], "M_57001": [-1,0], "M_59004": [-5,-9], "M_59013": [1,-4], "M_59014": [-5,-1],
"M_63001": [1,0], "M_66001": [1,0], "M_67001": [-2,4], "M_68005": [-4,0], "M_69014": [-2,-4],
"M_75003": [14,4], "M_06003": [4,-1], "M_31001": [1,-1], "M_33001": [0,-7], "M_54001": [1,-1],
"M_59001": [-1,-6], "M_59019": [4,2], "M_62003": [-3,1], "M_62011": [2,1], "M_69001": [2,5],
"M_69003": [-6,4], "M_71002": [0,0], "M_71003": [0,-1], "M_71004": [0,0], "M_71005": [0,1],
"M_72001": [0,0], "M_72002": [0,0], "M_72003": [0,0], "M_72004": [0,0], "M_72005": [-1,0],
"M_73001": [-1,0], "M_73002": [0,0], "M_73003": [0,0], "M_73004": [1,0], "M_74001": [0,0],
"M_74002": [2,2], "M_74003": [3,1], "M_74004": [1,-3], "M_74005": [0,0], "M_74006": [0,0],
"M_76002": [-2,-11], "M_76004": [-11,0], "M_76005": [-6,-3], "M_76006": [-2,-5], "M_76009": [-4,-4],
"M_76010": [0,-3], "M_77001": [15,19], "M_77002": [6,17], "M_77003": [13,12], "M_77004": [17,6],
"M_77005": [26,-1], "M_77006": [23,-5], "M_77007": [21,-7], "M_77008": [12,-24], "M_77009": [23,14],
"M_78002": [-16,18], "M_78006": [8,9], "M_78007": [-26,7], "M_78008": [-18,-7], "M_78009": [-23,-4],
"M_78010": [-25,10], "M_78012": [-17,10], "M_79001": [-2,-1], "M_79002": [2,1], "M_79003": [0,0],
"M_80001": [-1,-6], "M_80003": [-2,-1], "M_80004": [-6,-3], "M_80005": [4,-6], "M_81001": [0,0],
"M_81002": [0,0], "M_81003": [0,0], "M_82001": [0,0], "M_82002": [0,0], "M_83004": [0,0],
"M_83005": [-1,0], "M_83006": [3,-2], "M_83008": [0,0], "M_84002": [2,0], "M_84004": [0,-2],
"M_84005": [2,-4], "M_85001": [0,1], "M_85003": [0,0], "M_85004": [0,0], "M_85005": [0,0],
"M_86003": [0,0], "M_86004": [0,0], "M_87002": [0,0], "M_88001": [0,0], "M_88002": [0,0],
"M_88003": [0,0], "M_88004": [0,0], "M_89001": [0,0], "M_89002": [0,0], "M_89003": [5,7],
"M_90001": [1,1], "M_90002": [0,0], "M_91002": [2,18], "M_91003": [-9,22], "M_91004": [-18,23],
"M_91005": [-3,32], "M_91009": [5,28], "M_92013": [-28,14], "M_93004": [26,-15],
"M_93008": [18,13], "M_94003": [37,1], "M_94004": [14,23], "M_95001": [-13,-17],
"M_95006": [0,-26], "M_95007": [5,-30], "M_95009": [9,-26], "M_2A001": [0,0],
"M_2A002": [0,0], "M_2B001": [0,0], "M_2B002": [0,0], "M_29002": [0,3], "M_35008": [-2,-1],
"M_59011": [-7,-3], "M_59018": [1,2], "M_06009": [0,1], "M_13002": [4,11], "M_25001": [0,0],
"M_25002": [2,0], "M_28001": [-12,13], "M_31009": [3,3], "M_34001": [1,3], "M_34002": [-2,-3],
"M_34003": [0,-5], "M_34008": [-4,1], "M_34009": [2,-1], "M_35001": [2,2], "M_44005": [3,-3],
"M_49001": [0,0], "M_49002": [0,0], "M_49003": [0,0], "M_49006": [0,0], "M_59012": [2,3],
"M_68006": [3,-1], "M_75004": [2,-16], "M_75006": [-13,2], "M_75009": [5,27], "M_75012": [-4,2],
"M_75017": [6,-19], "M_76007": [-4,-2], "M_76008": [2,1], "M_83002": [4,0], "M_86001": [1,-2],
"M_86002": [-1,2], "M_92001": [-29,-3], "M_92003": [-19,-17], "M_92011": [-14,-32], "M_93001": [8,5],
"M_93006": [-16,-15], "M_93010": [19,-13], "M_94001": [25,-5], "M_94006": [22,19], "M_94008": [28,10],
"M_94009": [7,-9], "M_94010": [-17,10], "M_94011": [10,13], "M_45006": [2,5], "M_06008": [1,7],
"M_10003": [6,5], "M_13003": [2,-2], "M_13004": [-10,5], "M_13005": [-4,9], "M_13006": [-5,-1],
"M_13007": [-2,-4], "M_21001": [0,-1], "M_21003": [0,2], "M_27001": [-13,2], "M_27002": [-11,0],
"M_33003": [3,4], "M_33006": [-5,-1], "M_37001": [0,1], "M_42001": [-7,-2], "M_42002": [1,5], "M_44001": [-4,2],
"M_44002": [1,-1], "M_44003": [2,-5], "M_44004": [0,5], "M_45001": [0,3], "M_45002": [-7,6], "M_49004": [0,0],
"M_54002": [1,3], "M_57002": [1,3], "M_59003": [2,2], "M_64001": [2,-3], "M_69005": [-3,-6], "M_69007": [8,8],
"M_75001": [12,23], "M_75002": [15,-19], "M_75005": [-15,-22], "M_75007": [-4,-12], "M_75008": [-4,25],
"M_75010": [-18,-12], "M_75011": [-8,-5], "M_75013": [6,20], "M_75014": [19,17], "M_75015": [14,11], "M_75016": [19,0], "M_75018": [14,-24],
"M_76001": [-6,-6], "M_76003": [-6,-1], "M_77010": [19,5], "M_77011": [7,20], "M_78001": [-9,24],
"M_78003": [-19,-12], "M_78011": [-28,7], "M_80002": [0,-9], "M_83001": [4,6], "M_83007": [0,2], "M_84001": [-4,1],
"M_84003": [1,-2], "M_85002": [0,0], "M_87001": [0,0], "M_87003": [0,0], "M_91007": [13,-10], "M_91008": [-13,9],
"M_91010": [-9,15], "M_92002": [-18,3], "M_92004": [6,-8], "M_92005": [24,-6], "M_92006": [-21,16], "M_92008": [-24,0],
"M_92010": [-2,9], "M_93002": [-3,-1], "M_93005": [-9,-16], "M_93007": [30,4], "M_93009": [-13,-11], "M_93011": [4,3],
"M_93012": [11,-10], "M_94002": [0,-4], "M_94007": [3,10], "M_95002": [-5,-18],
"M_95003": [12,-8], "M_95004": [8,-23], "M_95008": [17,11], "M_95010": [-21,-13], "M_68001": [1,0], "M_94005": [4,7],
"M_59007": [3,-5], "M_ZA001": [0,0], "M_ZA002": [0,0], "M_ZA003": [0,0], "M_ZA004": [0,0],
"M_ZB001": [1,0], "M_ZB002": [0,-1], "M_ZB003": [0,1], "M_ZB004": [0,0], "M_ZC001": [0,0], "M_ZC002": [0,0],
"M_ZD001": [1,-2], "M_ZD002": [-2,0], "M_ZD003": [-2,-2], "M_ZD004": [1,2], "M_ZD005": [2,0], "M_ZD006": [1,1],
"M_ZD007": [-1,1], "M_ZS001": [0,0], "M_ZM001": [0,0], "M_ZM002": [0,0], "M_ZX001": [0,0], "M_ZW001": [0,0],
"M_ZP001": [0,0], "M_ZP002": [0,0], "M_ZP003": [0,0], "M_ZN001": [0,0], "M_ZN002": [0,0], "M_ZZ001": [0,0],
"M_ZZ002": [0,0], "M_ZZ003": [0,0], "M_ZZ004": [0,0],
"M_ZZ005": [0,0], "M_ZZ006": [0,0], "M_ZZ007": [0,0], "M_ZZ008": [0,0], "M_ZZ009": [0,0], "M_ZZ010": [0,0], "M_ZZ011": [0,0]
},

departement : 

{
"D_2B": [0,0], "D_2A": [0,0], "D_09": [3,6], "D_11": [0,-3], "D_12": [0,0], "D_30": [1,-3], "D_32": [0,0], "D_46": [0,0],
"D_48": [0,2], "D_65": [0,0], "D_66": [0,2], "D_81": [0,0], "D_82": [0,0], "D_31": [-1,-1], "D_34": [-2,1],
"D_22": [0,0], "D_56": [0,0], "D_29": [0,0], "D_35": [0,-1], "D_39": [0,-1], "D_58": [0,0], "D_70": [0,0],
"D_71": [-1,-4], "D_89": [5,5], "D_90": [-4,5], "D_25": [0,0], "D_21": [0,0], "D_18": [2,4], "D_36": [0,0],
"D_41": [-3,8], "D_28": [-15,10], "D_37": [-4,1], "D_45": [-5,19], "D_01": [8,-7], "D_03": [0,-1], "D_07": [-2,-1],
"D_15": [0,0], "D_26": [-4,1], "D_43": [-4,7], "D_38": [1,-1], "D_63": [-4,-2], "D_73": [5,2], "D_74": [6,0], "D_42": [-11,11],
"D_69": [0,-3], "D_14": [-5,1], "D_50": [-4,0], "D_61": [0,0], "D_27": [-17,-1], "D_76": [-17,-12], "D_04": [1,0], "D_05": [0,0],
"D_06": [0,0], "D_13": [-1,4], "D_83": [0,0], "D_84": [8,-5], "D_53": [-2,-1], "D_72": [-6,4], "D_44": [-1,-1], "D_49": [0,1], 
"D_85": [1,2], "D_16": [0,0], "D_17": [0,0], "D_19": [0,0], "D_23": [0,0], "D_24": [0,0], "D_40": [0,0], "D_47": [0,0], "D_79": [0,0], 
"D_86": [0,1], "D_33": [0,0], "D_64": [0,0], "D_87": [0,0], "D_08": [0,0], "D_51": [7,4], "D_52": [0,0], "D_55": [-2,-1], 
"D_67": [2,2], "D_88": [0,0], "D_54": [-7,4], "D_57": [4,-5], "D_68": [1,-1], "D_10": [13,4], "D_75": [28,-15], "D_77": [19,9], 
"D_78": [-14,0], "D_91": [-13,19], "D_92": [7,9], "D_93": [-5,-17], "D_95": [-22,-17], "D_94": [10,35], "D_02": [10,-17], "D_60": [9,-19], 
"D_62": [-8,-7], "D_80": [-10,-1], "D_59": [8,-3], "D_ZA": [0,0], "D_ZB": [0,0], "D_ZC": [0,0], "D_ZD": [0,0], "D_ZS": [0,0], "D_ZM": [0,0], 
"D_ZX": [0,0], "D_ZW": [0,0], "D_ZP": [0,0], "D_ZN": [0,0], "D_ZZ": [0,0]
},

region :

{
    "R_94": [0,0], "R_76": [2,2], "R_53": [0,0], "R_27": [0,-2], "R_24": [-13,27], "R_84": [-4,-3], "R_28": [-1,0], "R_93": [5,7], 
    "R_52": [-3,-1], "R_75": [-2,-2], "R_44": [1,-1], "R_11": [4,7], "R_32": [2,-24], "R_ZA": [0,0], "R_ZB": [0,0], "R_ZC": [0,0], 
    "R_ZD": [0,0], "R_ZS": [0,0], "R_ZM": [0,0], "R_ZX": [0,0], "R_ZW": [0,0], "R_ZP": [0,0], "R_ZN": [0,-1], "R_ZZ": [0,0]
}

}