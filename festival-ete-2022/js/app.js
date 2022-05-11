var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;
var isChromium = !!window.chrome;
var datapol;
var circosData;
var representation_territoriale = 'departement';
const arr_representation_territoriale = ['region' ,'departement', 'circonscription']
let selected_element = 'candidat en tête'
let all_data_festivals

let this_zoom_level = 4.6

const thismaxZoom = 16

let grouped_points


    if (mainWidth < 800){
      baseMapWidth = mainWidth;
      baseMapHeight = mainWidth*1.1;

      d3.select('#map')
      .style('width', baseMapWidth+ 'px');

      d3.select('#map')
      .style('height', baseMapHeight + 'px');

    }

    else{

      baseMapWidth = 800;
      baseMapHeight = 600;
      this_zoom_level = 6;

    }

var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function getIcon(this_genre){

let this_color = color_genres_icons[d.Genre]
let this_class = class_genres[d.Genre]

let this_icon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-' + this_color +'.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className : this_class
})

return this_icon

}



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
"MACRON":'#F7BA00',
"DUPONT-AIGNAN":'#19325D',
"LE PEN":'#1D2245',
'POUTOU': "#911D16",
'MÉLENCHON': "#EB404C",
'LASSALLE': "#534384",
'PÉCRESSE': "#2458A5",
'ZEMMOUR': "#654235",
'JADOT': "#00A85C",
'ARTHAUD': '#751F17',
'HIDALGO': '#EC4C6B',
'ROUSSEL': '#D80000'
}


const color_genres = {
  'Autres':'#F7BA00',
 'Musique':'#19325D',
 'Cinéma':'#1D2245',
 'Théâtre / Arts de la rue / Cirque': "#911D16",
 'Littérature': "#534384",
 'Photo / Art contemporain': "#00A85C",
 'Danse': '#EC4C6B',
  'BD': "#2458A5"
}

const class_genres = {
  'Autres':'autres',
 'Musique':'musique',
 'Cinéma':'cinema',
 'Théâtre / Arts de la rue / Cirque': "theatre_arts",
 'Littérature': "litterature",
 'Photo / Art contemporain': "photo_art",
 'Danse': 'danse',
  'BD': "bd"
}

const color_genres_icons = {
  'Autres':'grey',
 'Musique':'gold',
 'Cinéma':'red',
 'Théâtre / Arts de la rue / Cirque': "green",
 'Littérature': "orange",
 'Photo / Art contemporain': "yellow",
 'Danse': 'violet',
  'BD': "blue"
}


const candidate_names = [
'MACRON',
 'LE PEN',
 'MÉLENCHON',
  'ZEMMOUR',
 'PÉCRESSE',
 'JADOT',
 'LASSALLE',
 'ROUSSEL',
 'DUPONT-AIGNAN',
 'HIDALGO',
 'POUTOU',
 'ARTHAUD']

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

function draw_affichage(){

d3.selectAll('#affichage .display_element')

let all_displayed_elements = Object.keys(color_genres)
all_displayed_elements.unshift('Tous');

const elements_selection = d3.select('div#affichage').selectAll('div.display_element')
.data(all_displayed_elements)

elements_selection
.enter()
.append('div')
.attr('class', 'display_element')
.text(d=> _.capitalize(d))
.on('click', function(event, d){

selected_element = d


d3.selectAll('#affichage .display_element')
.style('background-color', '#eee')
.style('color', '#6E6E6E')

let this_background_color = ''

if(d == 'Tous'){

this_background_color = 'black'
}
else {
  this_background_color = color_genres[d]
}


d3.select(this)
.style('background-color', this_background_color)
.style('color', '#fff')

fillOnClick(d)

if (d == 'Tous'){
d3.selectAll('.leaflet-marker-icon').style('display', 'initial')
}
else
{
d3.selectAll('.leaflet-marker-icon').style('display', 'none')

d3.selectAll('.leaflet-marker-icon.' + class_genres[d]).style('display', 'initial')

}


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

if (!this_d){

let this_html = `Français de l'étranger<br> Résultats non parvenus`

d3.select('#tooltip')
.style('display', 'flex')

d3.select('#map_info2')
.style('visibility', 'visible')

d3.select('#tooltip')
.html(this_html)
.style('font-size', '15px')
.style('opacity', '1')
.style('display', 'block')

return  
}


let this_dep_scores = candidate_names.map(function(e){ return {'name': e, 'score': this_d[e+'_score']} })

this_dep_scores = this_dep_scores.sort(function(a,b) {  return b.score - a.score})
this_dep_scores = _.slice(this_dep_scores, 0, 7)


let this_loc_name

if(location_variable == 'code_departement'){
  this_loc_name = this_d['lib_departement'] + ' (' + this_d['code_departement'] + ')'

  if (this_d['url_libe']){

    this_loc_name = `<a target="_blank" href="${this_d.url_libe}" style="display:inline-block"> ${this_loc_name}<img src="img/Voir-Plus.svg" style="width:1em;display:inline-block;margin-left:1em"></a>`
}


}
else if (location_variable == 'code_region'){
this_loc_name = this_d['lib_region']
  if (this_d['url_libe']){

    this_loc_name = `<a target="_blank" href="${this_d.url_libe}" style="display:inline-block"> ${this_loc_name}<img src="img/Voir-Plus.svg" style="width:1em;display:inline-block;margin-left:1em"></a>`
}


}
else{
this_loc_name = `${this_d['nom_circo']}  ${this_d['num_circo']}<sup>e</sup> circonscription `
}

let this_html = `<span style="font-weight:bold; font-family: 'libesansweb-semicondensed'; letter-spacing: 0.04em; font-size: 16px;">${this_loc_name}</span>`

if (selected_element == 'candidat en tête'){

    this_html +=  `<span class='details'>
    ${drawGraph(this_dep_scores)}</span>`

}

else if (selected_element == 'abstention'){

let this_selected_candidate = [{'name':'Abstention', 'score': _.round(100*this_d['Abstentions'] / this_d['Inscrits'], 1)}]
    this_html +=  `<span class='details'>
    ${drawGraph(this_selected_candidate)}</span>`


}

else{

let this_selected_candidate = [{'name':selected_element, 'score': this_d[selected_element+'_score']}]
    this_html +=  `<span class='details'>
    ${drawGraph(this_selected_candidate)}</span>`


    if (selected_element == this_dep_scores[0].name){
      this_html +=  'Arrivé en tête<br>'
    }

}

this_html += `<hr>Nombre de votes exprimés : ${this_d['Exprimes']}<br>
Taux d'abstention : ${String(_.round(100*this_d['Abstentions'] / +this_d['Inscrits'], 1)).replace('.', ',')}%`

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
.style('display', 'none')
.style('height', 0)

d3.select('#' + id_map)
.style('visibility', 'visible')
.style('height', 'initial')
.style('display', 'block')

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

Promise.all([
    d3.csv('https://sav10.github.io/libe-projects/election-presidentielle-2022/data/election_data_dep2.csv'),
      d3.csv('data/data_festivals.csv')
]).then(function(files) {
  ready(files[0], files[1])
}).catch(function(err) {
  console.log('erreur' + ' ' + err)
})

//// Ready function (to load data)

  function ready(data_dep, data_festivals) {

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


data_festivals = data_festivals.filter(d=>d['Lon,Lat'])


    data_festivals.forEach(d =>{
      d.latitude = d['Lon,Lat'].split(',')[1]
      d.longitude = d['Lon,Lat'].split(',')[0]
      d.latLong = [+d.latitude, +d.longitude];

    })

console.log(data_festivals)


all_data_festivals = data_festivals


// d3.xml("img/carte-departements.svg")
// .then(data => {
//   d3.select("#svg-container-dep").node().append(data.documentElement)

// let svg_container = 'svg-container-dep'
// let circle_range = [3, 20]
// let location_variable = 'code_departement'
// let location_prefix = 'D_'
// let location_type = 'departement'

// geo_objects['departement']['data'] = data_dep;

// loadMapFromSvgGeneric(data_dep, svg_container, circle_range, location_variable, location_prefix, location_type)

//     d3.select("#representations")
//   .style('display', 'flex')


// });

configMap(data_festivals)


}


function configMap(data){

// console.log(data)

  map = L.map('map', {
    dragging: testMobile(), center: [50, 2], zoomControl:!L.Browser.mobile, maxZoom: thismaxZoom, minZoom: thisMinZoom, tap:testMobile()}).setView([46.2, 2], this_zoom_level)

  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com"  target="_blank">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0"  target="_blank">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright"  target="_blank">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  info_city = L.control({position: 'topleft'});

  info_city.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info city box'); // create a div with a class "info"
    return this._div;
  };

  info_city.addTo(map)

  let allpoints = [];


  data.filter


for (i in data) { // 100k points

  d = data[i];
  
  // console.log(d)
  let this_marker = L.marker([+d.latitude, +d.longitude], {
    icon: getIcon(d.Genre)
  });
  this_marker.id = i;
  this_marker.mayor = color_genres[d.Genre];


  this_marker.on('click', function(e){openingPopup(0, e.target.id)})
  allpoints.push(this_marker);
}

grouped_points =  L.layerGroup(allpoints);

grouped_points.addTo(map);


d3.selectAll('.leaflet-control-attribution.leaflet-control a').attr('target', '_blank')


map.on('popupclose', function(e) {

  console.log('closing')
  d3.select('div.info.city.box').style('display', 'none');

  d3.select('.info.city.box.leaflet-control').style('height', 'auto')
// d3.select('.info.city.box.leaflet-control').style('overflow', '')

});


}


    function openingPopup(d, o){


      console.log(o)

      this_obj = all_data_festivals[o]

      console.log(this_obj)

      let html_info


      if (this_obj){

        html_info = 
        `<strong style="font-weight:bold; font-family: 'libesansweb-semicondensed'; letter-spacing: 0.04em; font-size: 15px;">${this_obj['Nom du festival']}</strong>
        <br><span style="color:#000;display:inline-block;font-weight:bold; font-family: 'libesansweb-semicondensed'; letter-spacing: 0.04em; font-size: 15px;">${this_obj['Commune']} -  ${this_obj['Département']}</span>
        `;

       html_info += `<b>${this_obj['Genre']}</b><br>
    Du ${this_obj['Début']} au ${this_obj['Fin']}
    <br><br>${this_obj['Texte']}`

  d3.select('.info.city.box')
  .html(html_info)

  map.closePopup()

}

d3.select('div.info.city.box').style('display', 'block')

adaptInfobox()

}

d3.select('body').on("click",function(event, d){



    var outside = d3.selectAll('.leaflet-marker-icon').filter(equalToEventTarget).empty();
    // var outside = d3.select(event.path[0]).attr('class') != 'cls-1'

    var path = event.path || (event.composedPath && event.composedPath());

    // var outside = d3.select(event.path[0]).attr('class') != 'cls-1'
    if (outside) {

d3.select('.info.city.box')
.style('display', 'none')

    }
else{
}



});


  function adaptInfobox(){


    if (mainWidth < 800){
      d3.select('.info.city.box.leaflet-control')
      .style('width', (mainWidth*.8) + 'px');
    }


    d3.select('.info.city.box.leaflet-control')
    .style('height', 'auto');

    let height_infobox = d3.select('.info.city.box.leaflet-control').node().getBoundingClientRect().height;

    if (height_infobox >= 200){

      d3.select('.info.city.box.leaflet-control').style('height', (height_infobox + 5) + 'px')
      let newHeightMap = (height_infobox*1.1) >= baseMapHeight ? (height_infobox*1.1) : baseMapHeight;

      // d3.select('#map')
      // .style('height', newHeightMap + 'px');
    }

    else{
      // d3.select('#map')
      // .style('height', baseMapHeight + 'px');

    }

    d3.select('.info.city.box.leaflet-control').style('overflow', 'auto')

    height_infobox = d3.select('.info.city.box.leaflet-control').node().getBoundingClientRect().height;

  }


   function testMobile (){
    if (parseInt(d3.select('#mainContent').style("width")) >= 600){
      return true
    }

    return false

  }

  function calculateZoomLevel(thisZoom){

    return (thisZoom**1.8)*(1/20)

  }

//// load SVG map


function loadMapFromSvgGeneric(data, svg_container, circle_range, location_variable, location_prefix, location_type) {

  let this_svg_map = d3.select('#'+ svg_container + ' svg');
  var all_those_paths = this_svg_map.selectAll('path');

let thisCircleScale = 
d3.scaleSqrt()
.range(circle_range);


// thisCircleScale.domain(d3.extent(data, d=>+d.Inscrits));
thisCircleScale.domain(d3.extent(_.values(inscrits_location[location_type])));


  let allSvgNodes = all_those_paths.nodes();

  for (i in allSvgNodes){
 let this_id = d3.select(allSvgNodes[i]).attr('id')
 this_id = this_id.substring(2)
 let this_pop = inscrits_location[location_type][this_id];
  // let this_pop = data.filter(d=> d[location_variable] == this_id)[0] ? +data.filter(d=> d[location_variable] == this_id)[0].Inscrits : inscrits_location[location_type][this_id];
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
    return 'rgb(221, 221, 221)'
  })
  .style('fill-opacity', 1)
  .style('stroke', '#aaa')
  .style('stroke-width', 0)
  .on('mouseover', function(event, d) {
   /* showTip(data, d)*/
    all_those_paths
    .style('fill-opacity', .5)
    d3.select(this)
    .style('fill-opacity', 1)

  })
  .on('mouseout', function(event, d) {


    if (selected_dep.length > 0){

     /*showTip(data, selected_dep[1])*/
    all_those_paths
    .style('fill-opacity', .5)

    d3.select(selected_dep[0])
    .style('fill-opacity', 1)

    }
    else{
    /*reset_tooltip()*/

    all_those_paths
    .style('fill-opacity', 1)

    d3.select(this)
    .style('fill-opacity', 1)
    }

  })


/// Click function for shape

d3.select('body').on("click",function(event, d){


    var outside = d3.selectAll('svg path').filter(equalToEventTarget).empty();
    // var outside = d3.select(event.path[0]).attr('class') != 'cls-1'
    if (outside) {
    reset_tooltip()
selected_dep = [];


    all_those_paths
    .style('fill-opacity', 1)

    d3.selectAll('path')
    .style('fill-opacity', 1)

    }
else{
}



});


  all_those_paths
  .on('click', function(event, d) {
    selected_dep = [this, d];
    showTip(data, d, location_variable)
    all_those_paths
    .style('fill-opacity', .5)
    d3.select(this)
    .style('fill-opacity', 1)
  })



//// Transformation to circle when starting 
setTimeout(() => {

  transform_all_paths_to_circle_generic(all_those_paths, position_circles[location_type], location_prefix)
mapstate = 1;


},
   500);



}



/// End map from svgn

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

  those_paths
  .transition()
  .duration(1000)
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
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {

 return colors_candidats[this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0].loc_winner]
    }
    return 'rgb(221, 221, 221)'
  })


  }


}


}

else if (name == 'abstention'){


let this_color_range = d3.scaleLinear()
  .range(['white', 'black'])
  .domain([0, 50]);

for (i in geo_objects){

  let this_data = geo_objects[i].data
    if (this_data){
  let all_those_paths = d3.select('#'+ geo_objects[i].container + ' svg').selectAll('path');

  all_those_paths
  .style('stroke-width', 0)
  .style('fill', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {
      let this_dep_data = this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0]

 let this_dep_abstention = _.round(100*this_dep_data['Abstentions'] / this_dep_data['Inscrits'], 1)
 return this_color_range(this_dep_abstention)
    }
    return 'rgb(221, 221, 221)'

  })


}



}

color_progressive_scale
.range(['white', 'black'])
.domain([0, 50]);


}

else{

d3.selectAll ('#morphocarte svg path')
.style('stroke', 'black')
.style('stroke-opacity', 1)


let this_color = colors_candidats[name];


let this_color_range = d3.scaleLinear()
  .range(['white', this_color])
  .domain([-5, 35]);

for (i in geo_objects){

  let this_data = geo_objects[i].data


    if (this_data){

  let all_those_paths = d3.select('#'+ geo_objects[i].container + ' svg').selectAll('path');

  all_those_paths
  .style('fill', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {
 let this_dep_candidate_score = this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0][name + '_score']
 return this_color_range(this_dep_candidate_score)
    }
    return 'rgb(221, 221, 221)'
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
.domain([-5, 35]);


}
  }

function drawGraph(range){


var this_html = '<div style="margin-top:10px">';

for (i in range){
  var d = range[i]
  var html_chunk = '<div style="margin-top:5px">'
  // html_chunk += `<div >${d.tete_liste}</div>
  html_chunk += `<div style="float:right;margin-right: 4px;font-weight:bold">  ${d.score != 100 ? d.score + ' %' : '' }</div><div style="margin-top:5px">${_.capitalize(d.name).replace('Le pen', 'Le Pen').replace('Dupont-aignan', 'Dupont-Aignan')}</div>
      <div style="height:9px;background-color: #ddd"><div style="height:8px;width:${d.score}%;background-color:${selected_element == 'abstention' ? 'grey' : colors_candidats[d.name]};"></div>
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
    "D_48": [0,2], "D_65": [0,0], "D_66": [0,2], "D_81": [0,0], "D_82": [0,0], "D_31": [-1,-1], "D_34": [-2,1], "D_22": [0,0], 
    "D_56": [0,0], "D_29": [0,0], "D_35": [0,-1], "D_39": [0,-1], "D_58": [0,0], "D_70": [0,0], "D_71": [-1,-4], "D_89": [15.2,14], 
    "D_90": [-4,5], "D_25": [0,0], "D_21": [14,7], "D_18": [4,6.5], "D_36": [0,0], "D_41": [-3,8], "D_28": [-18.2,10], "D_37": [-4,1], 
    "D_45": [-7.5,26], "D_01": [8,-7], "D_03": [0,-1], "D_07": [-2,-1], "D_15": [0,0], "D_26": [-4,1], "D_43": [-4,7], "D_38": [1,-1], 
    "D_63": [-4,-2], "D_73": [5,2], "D_74": [6,0], "D_42": [-11,11], "D_69": [0,-3], "D_14": [-5,1], "D_50": [-4,0], "D_61": [-6.6,2.95], 
    "D_27": [-16.3,-2.9], "D_76": [-17,-12], "D_04": [1,0], "D_05": [0,0], "D_06": [0,0], "D_13": [-1,4], "D_83": [0,0], "D_84": [8,-5], 
    "D_53": [-2,-1], "D_72": [-6,4], "D_44": [-1,-1], "D_49": [0,1], "D_85": [1,2], "D_16": [0,0], "D_17": [0,0], "D_19": [0,0], 
    "D_23": [0,0], "D_24": [0,0], "D_40": [0,0], "D_47": [0,0], "D_79": [0,0], "D_86": [0,1], "D_33": [0,0], "D_64": [0,0], 
    "D_87": [0,0], "D_08": [0,0], "D_51": [10.2,1.4], "D_52": [0,0], "D_55": [-2,-1], "D_67": [2,2], "D_88": [0,0], "D_54": [-7,4], 
    "D_57": [4,-5], "D_68": [1,-1], "D_10": [16.8,15.5], "D_75": [6.8,8.7], "D_77": [14.5,30.1], "D_78": [-8.2,21.1], "D_91": [5,26.7], 
    "D_92": [-19.9,-5.1], "D_93": [25.1,-13.8], "D_95": [6.8,-11.9], "D_94": [33.7,6.8], "D_02": [10,-17], "D_60": [9,-19], "D_62": [-8,-7], 
    "D_80": [-10,-1], "D_59": [8,-3], "D_ZA": [0,0], "D_ZB": [0,0], "D_ZC": [0,0], "D_ZD": [0,0], "D_ZS": [0,0], "D_ZM": [0,0], "D_ZX": [0,0], 
    "D_ZW": [0,0], "D_ZP": [0,0], "D_ZN": [0,0], "D_ZZ": [0,0]
},

region :

{
    "R_94": [0,0], "R_76": [2,2], "R_53": [0,0], "R_27": [0,-2], "R_24": [-13,27], "R_84": [-4,-3], "R_28": [-1,0], "R_93": [5,7], 
    "R_52": [-3,-1], "R_75": [-2,-2], "R_44": [1,-1], "R_11": [4,7], "R_32": [2,-24], "R_ZA": [0,0], "R_ZB": [0,0], "R_ZC": [0,0], 
    "R_ZD": [0,0], "R_ZS": [0,0], "R_ZM": [0,0], "R_ZX": [0,0], "R_ZW": [0,0], "R_ZP": [0,0], "R_ZN": [0,-1], "R_ZZ": [0,0]
}

}


const inscrits_location = {

  circonscription : 
{'93001': 61803, '13004': 59698, '59002': 86663, '09002': 60696, '33003': 81023, '93007': 76062, '80001': 84296, 
'59001': 61729, '93011': 62665, '93006': 52583, '54006': 87580, '94010': 64439, '75017': 58244, '09001': 56735, 
'93009': 70280, '34002': 60436, 'ZD005': 83173, '59016': 83022, 'ZB002': 81671, '63005': 102064, '92001': 62486, 
'76006': 109582, 'ZD002': 92710, '93004': 60977, '93002': 54142, '03001': 89663, 'ZP003': 64814, '13013': 93817, 
'59020': 81115, 'ZB004': 83734, '76003': 69397, '76008': 67666, '77011': 64893, '64003': 82751, '72002': 82007, 
'14002': 67592, 'ZD001': 80507, '79002': 97396, '02003': 68099, '33004': 93630, '54005': 78749, '75015': 76213, 
'53001': 72721, '40003': 96524, '82001': 89975, '76005': 96322, '31008': 85433, 'ZC001': 53657, '71004': 82338, 
'59013': 89284, '63002': 87890, 'ZA004': 69307, '16003': 90900, '72004': 79638, 'ZB001': 79432, '61001': 69530, 
'07001': 77927, '95008': 54551, '42001': 65647, 'ZB003': 65396, '38004': 89778, '32002': 71495, '94009': 53666, 
'65002': 89337, 'ZZ009': 107796, '82002': 93328, '13010': 106112, '17001': 103197, '56004': 105109, '64004': 80185, 
'2B002': 66015, '2A002': 57892, '62003': 85611, '07002': 93064, '84004': 88780, '2B001': 58776, '44001': 74937, 
'38005': 102308, '38002': 77426, '37005': 83876, '69004': 80169, '81002': 106028, '45002': 85276, '57003': 75319, 
'35001': 89689, '75001': 80780, '67009': 92731, '49002': 90330, '06002': 85504, '27005': 88482, '62005': 90125, 
'24002': 82447, '91006': 81934, '69007': 68017, '92010': 78973, '74001': 100268, '93008': 60135, '14004': 100988, 
'24001': 76026, '46002': 65363, '76001': 64488, '17004': 89894, '44004': 89018, '38001': 83182, '33008': 109065, 
'69014': 74261, '75009': 68363, '37004': 90129, '19001': 92652, '21001': 68501, '42002': 53195, '31003': 78104, 
'49006': 94700, '69011': 92522, '92002': 68008, '22004': 78707, '22002': 96776, '44006': 110233, '27002': 78468, 
'31001': 82088, '71001': 72894, '25003': 65926, '18001': 72545, '25002': 78378, '51003': 80600, '77009': 85876, 
'ZZ001': 200205, '34009': 82137, '02005': 82223, '59017': 73613, '34001': 84645, '22005': 103763, '78005': 73783, 
'01003': 75615, '59006': 89107, '50004': 88714, '06003': 89137, '79001': 90241, '83007': 103509, '85005': 81461, 
'23001': 92991, '94011': 62445, '59015': 95868, '33006': 103728, '56001': 105394, '83002': 90542, '33007': 76934, 
'95004': 76060, '47002': 76992, '75012': 73934, '42006': 107610, '34008': 88541, '31010': 95369, '13016': 90621, 
'74002': 94940, 'ZZ011': 92766, '92009': 64984, '30003': 93533, '16002': 83966, '60003': 73888, '74006': 78938, 
'78006': 75709, 'ZZ004': 122765, '30001': 86943, '42003': 82495, '56005': 80708, '85003': 122019, '93003': 72572, 
'05001': 57754, '11003': 88650, '80004': 84029, '13014': 96529, '38003': 59880, '94002': 63378, '75008': 82171, 
'31006': 111379, '16001': 84996, '92013': 89108, '27003': 84407, '91001': 71177, '62008': 93016, '35003': 86146, 
'69006': 82455, '86003': 74027, '35005': 103309, '75002': 71740, 'ZZ005': 91374, '26003': 106726, '78003': 83224, 
'ZZ003': 120696, '44003': 92169, '51002': 73132, '33001': 94986, '25001': 75269, '80002': 75505, '76010': 108753, 
'29002': 77724, '38007': 91422, '69001': 69502, '58001': 76918, '56006': 90703, '38010': 93778, '78001': 83490, 
'57009': 99489, '92008': 68749, '87001': 84726, '78012': 69005, '67001': 61032, '40002': 112279, '37002': 88630, 
'75013': 75397, '35002': 92292, '69003': 72020, '31007': 99784, '33002': 65995, '58002': 82379, '56003': 90779, 
'67003': 68881, '25004': 66869, '35004': 90383, '44009': 117881, '45001': 75652, '33005': 110519, '30005': 95865, 
'94006': 81288, '42005': 101147, '76004': 88364, '74005': 95598, '59003': 94009, '55002': 60278, '31009': 79397, 
'91004': 96494, '30004': 91106, '17003': 82195, '85004': 97894, '12001': 76419, '91003': 95807, '21005': 84443, 
'26001': 75258, '54001': 79290, '86002': 77515, '83008': 104367, '13003': 73503, '29004': 82156, '59008': 67825, 
'21004': 68731, '10001': 64357, '06004': 85585, '29005': 94494, '57007': 90378, '70002': 90742, '81001': 83771, 
'73001': 87089, '35008': 83469, '57005': 73993, '31004': 69348, '84001': 72991, '89003': 89142, '49004': 74275, 
'ZZ010': 99374, '38006': 83270, 'ZA001': 76241, '72001': 71778, '92003': 81072, '01004': 89410, '34003': 85106, 
'77008': 88870, '49005': 77380, '87002': 97292, '62006': 91152, '13008': 100094, '34007': 102087, '14006': 93349, 
'67004': 94491, '78010': 88769, '50002': 95492, '29001': 88861, '60006': 75253, '94003': 72165, '70001': 88466, 
'52001': 72405, '75010': 67358, 'ZC002': 39418, '91010': 60910, '95002': 76534, '28001': 89145, '59011': 92069, 
'72003': 85255, '78011': 68023, '14001': 70107, '79003': 84790, '59012': 93610, '44002': 85834, '71003': 82728, 
'33010': 80807, '44008': 85601, '86001': 79560, '29006': 89274, '04001': 61143, 'ZZ002': 75029, '04002': 65326, 
'84003': 75598, '83006': 118406, '75016': 70382, '95003': 91580, '77007': 85380, '50003': 107848, '13002': 78732, 
'75005': 75885, '38008': 78587, '27001': 86416, '27004': 89942, '18003': 86181, '13007': 65450, '94001': 84670, 
'21003': 70441, '92011': 69273, 'ZZ006': 127486, '92005': 70371, '93012': 64794, '57002': 76522, '66004': 97100, 
'24004': 87772, '75007': 76058, '95010': 66540, '39001': 65433, '81003': 101427, '14005': 89980, '60002': 88688, 
'26002': 93263, '59004': 99303, '02001': 72345, '95005': 68483, '76002': 94786, 'ZM001': 37948, '69005': 88086, 
'36001': 80541, '66003': 83053, '91009': 79287, '34004': 112011, '69002': 74985, '34005': 94244, '44007': 108229, 
'11001': 95109, '49001': 84090, '33011': 92941, '57006': 70146, '87003': 83059, '94007': 65556, '29003': 89322, 
'69010': 95260, '95009': 69985, '12002': 69773, '66001': 70970, '65001': 88322, '77010': 79367, '91005': 68393, 
'33012': 83360, '69013': 84804, '71005': 89981, '32001': 73510, '44010': 114735, '17002': 104299, '76009': 93667, 
'11002': 88902, '57001': 91439, '83004': 106142, '92007': 86685, '75006': 76665, '05002': 52160, '03003': 79168, 
'75003': 68680, '37001': 68633, '47001': 88198, '95007': 69588, '54003': 82309, '62002': 85132, '13005': 69062, 
'02004': 79116, '31005': 98383, '78004': 78497, '59009': 91615, '47003': 75661, '29007': 80383, '63001': 83500, 
'03002': 84584, '33009': 93604, '63004': 98656, '56002': 104335, '18002': 70124, '62001': 104381, 'ZZ007': 105955, 
'ZD007': 110367, '68006': 92407, '24003': 67443, '83005': 96236, '94004': 72728, '63003': 89003, '62009': 79071, 
'22001': 89817, '69012': 79823, '64005': 90982, 'ZA003': 83688, '95006': 76435, '44005': 116301, '57008': 92439, 
'78009': 90983, '38009': 97184, '92012': 92856, '75011': 70946, '85001': 109670, '30006': 81155, '49007': 77832, 
'92004': 76175, '45006': 71898, '67002': 69535, '40001': 101404, '29008': 87205, '64002': 80073, 'ZA002': 86981, 
'31002': 100456, '53002': 77825, '64006': 99403, '77001': 70906, '54002': 68600, '85002': 103484, '73004': 74639, 
'64001': 68812, '41001': 82759, '78007': 80623, '13011': 89268, '86004': 75713, '78002': 85418, '59021': 82570, 
'51005': 76924, 'ZW001': 8480, 'ZP002': 66705, '67005': 103984, '28003': 70726, '68005': 77489, '93005': 63847, 
'59010': 82008, '77003': 75462, '59014': 98793, '77005': 85297, '28004': 67210, '75018': 67245, '90002': 47505, 
'ZN002': 104636, '80005': 81416, '41003': 82199, '76007': 87631, '35006': 86949, '51004': 78818, '53003': 71931, 
'ZN001': 85148, '59018': 91575, 'ZP001': 72597, '37003': 97520, '88003': 65653, 'ZZ008': 121399, '89002': 75699, 
'59007': 72443, '55001': 77291, '06009': 79934, '88002': 73260, '60005': 72843, '13006': 75665, '2A001': 50880, 
'91007': 73663, '01001': 82694, '14003': 78928, '72005': 86938, '62004': 88528, '78008': 73870, '60001': 82959, 
'73003': 72716, '60004': 92496, '90001': 47873, '69009': 91684, '26004': 94257, '83003': 100807, '43002': 79461, 
'08002': 63898, 'ZD004': 104988, '01005': 75364, '88001': 77056, '43001': 97788, '75004': 69762, '45005': 74550, 
'51001': 72128, '54004': 97993, '68004': 102687, '39002': 55236, '77004': 87963, '67007': 85521, 'ZS001': 4974, 
'92006': 74305, '67006': 96050, '28002': 74309, '19002': 92532, '06001': 80466, '68001': 76086, '52002': 61604, 
'68002': 92263, '62007': 93277, '15001': 62995, '88004': 66595, '02002': 73981, '50001': 86934, '36002': 90052, 
'13009': 96954, '06007': 92905, '91002': 90753, '49003': 70380, '10002': 73873, '13012': 92158, '01002': 93524, 
'89001': 76943, 'ZD006': 75861, '35007': 99140, '46001': 70806, '69008': 102544, '77006': 78125, '41002': 80338, 
'25005': 81970, '17005': 111453, '06005': 87903, 'ZD003': 92761, '68003': 85716, '10003': 65660, 'ZM002': 44852, 
'13015': 104791, '48001': 59443, '60007': 76094, '94005': 89457, '74003': 81904, '21002': 68771, 'ZX001': 25391, 
'13001': 78421, '61002': 67459, '61003': 71647, '73002': 76011, '84002': 83325, '75014': 72363, '77002': 79739, 
'59005': 99871, '93010': 68700, '12003': 71832, '42004': 101099, '94008': 76748, '06008': 81989, '22003': 86779, 
'71002': 78345, '83001': 74842, '07003': 78268, '74004': 85191, '08001': 73343, '39003': 69493, '06006': 78005, 
'84005': 81862, '57004': 81481, '80003': 83772, '08003': 57061, '45004': 74647, '67008': 94590, '15002': 54303, 
'45003': 70834, '95001': 81547, '91008': 76464, '59019': 79101, '66002': 96638, '34006': 91268, '62012': 95109, 
'62010': 90276, '30002': 89020, '62011': 94917},

departement : 
{'ZS': 5087, 'ZW': 8897, 'ZX': 23531, '48': 59437, '23': 90221, 'ZM': 91464, '90': 92895, 'ZC': 102590, '05': 111397, '2A': 112784, 
'15': 114746, '09': 117513, '04': 127034, '2B': 127679, '52': 129917, '55': 134289, '46': 136538, '32': 145149, '58': 154404, '36': 165728, 
'65': 176474, '70': 176811, '43': 179533, '19': 183693, '08': 184637, '82': 185137, '39': 187223, 'ZP': 195531, '61': 202808, '10': 203449, 
'12': 217636, 'ZN': 222447, '18': 223762, '53': 224981, '89': 235825, '47': 238609, '41': 242511, '03': 246688, '07': 250896, '16': 254246, 
'87': 260818, '79': 269047, '11': 272282, '88': 276816, '81': 296195, '28': 301521, '86': 302629, 'ZB': 306508, '24': 311870, '73': 313207, 
'ZA': 316706, '40': 319740, '66': 354186, '21': 358331, '25': 362951, '02': 372492, '26': 374564, '51': 376909, '50': 379988, '71': 392945, 
'80': 406149, '84': 407719, '72': 408317, '01': 424429, '27': 429634, '37': 434120, '45': 450508, '63': 458330, '22': 462227, '54': 490288, 
'14': 501016, '17': 502959, '42': 504706, '64': 506181, '68': 527406, '85': 536891, '30': 543687, '74': 544158, '60': 563158, '49': 586274, 
'56': 594019, 'ZD': 670335, '29': 692779, '95': 730820, '57': 741415, '35': 753800, '06': 757582, '67': 768420, '94': 786434, '93': 788339, 
'91': 798178, '83': 799018, '34': 829692, '38': 866662, '76': 871473, '77': 895326, '31': 915354, '78': 956120, '92': 985997, '44': 1039892, 
'62': 1088443, '33': 1115375, '69': 1127223, '75': 1328571, 'ZZ': 1335453, '13': 1385344, '59': 1800399},

region :

{'ZS': 5087, 'ZW': 8897, 'ZX': 23531, 'ZM': 91464, 'ZC': 102590, 'ZP': 195531, 'ZN': 222447, '94': 240463, 'ZB': 306508,
 'ZA': 316706, 'ZD': 670335, 'ZZ': 1335453, '24': 1818150, '27': 1961385, '28': 2384919, '53': 2502825, '52': 2796355,
  '93': 3588094, '44': 3833546, '32': 4230641, '76': 4249280, '75': 4355388, '84': 5405142, '11': 7269785}

  }