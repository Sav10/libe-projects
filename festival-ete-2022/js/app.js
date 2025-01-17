var mainWidth = parseInt(d3.select('#mainContent').style("width"));
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y")
var isChromium = !!window.chrome;
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
  iconUrl: 'pictos/' + this_color +'.png',
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
  'Autres':'#8C8C8C',
 'Musique':'#FF6666',
 'Cinéma':'#67B57F',
 'Théâtre / Arts de la rue / Cirque': "#6AB9B5",
 'Littérature': "#6E8AEF",
 'Photo / Art contemporain': "#927AD9",
 'Danse': '#FFA578',
  'BD': "#F5BD78"
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
  'Autres':'Autre-Gris2',
 'Musique':'Musique-Rouge2',
 'Cinéma':'Cinema-Vert2',
 'Théâtre / Arts de la rue / Cirque': "Theatre2",
 'Littérature': "Litterature-Bleu2",
 'Photo / Art contemporain': "Photo-Violet2",
 'Danse': 'Danse-Orange2',
  'BD': "BD-Jaune2"
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



///Loading data

Promise.all([
      d3.csv('data/data_festivals.csv')
]).then(function(files) {
  ready(files[0])
}).catch(function(err) {
  console.log('erreur' + ' ' + err)
})

//// Ready function (to load data)

  function ready(data_festivals) {


data_festivals = data_festivals.filter(d=>d['Lon,Lat'])


    data_festivals.forEach(d =>{
      d.latitude = d['Lon,Lat'].split(',')[1]
      d.longitude = d['Lon,Lat'].split(',')[0]
      d.latLong = [+d.latitude, +d.longitude];

    })

console.log(data_festivals)


all_data_festivals = data_festivals

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
        `<div id="genre_tooltip" style="color:${color_genres[this_obj['Genre']]}">${this_obj['Genre']}</div>
        <div id="nom_tooltip">${this_obj['Nom du festival']}</div>
        <div id="localite_tooltip">${this_obj['Commune']} -  ${this_obj['Département']}</div>
        <div id="date_tooltip">Du ${this_obj['Début']} au ${this_obj['Fin']}</div>
        <div id="texte_tooltip">${this_obj['Texte']}</div>
        `;
        if (this_obj['Site web'])
          
          {
            let this_site = this_obj['Site web'].substring(0,4) == 'http' ? this_obj['Site web'] : 'http://' + this_obj['Site web']

            html_info += `<br><div id="site_tooltip"><a href="${this_site}" target="_blank">Site web du festival</a></div>`
          }

                if (this_obj['Téléphone'])
          {html_info += `<div id="tel_tooltip">tel : ${this_obj['Téléphone']}</div>`}

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


