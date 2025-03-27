var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = parseInt(d3.select('.mainContent .mainMap').style("width"));
var sliderTime = 3000;
var maptype = 'standard';
const point_radius=10
const circle_radius=6
let city_html;

// const color_points =["#47258A" , "#46BD83"]

const color_points =["#4A1031" , "#6AB9B5"]




const dep_num = {
'01': 'Ain',
 '02': 'Aisne',
 '03': 'Allier',
 '04': 'Alpes de Haute-Provence',
 '05': 'Hautes-Alpes',
 '06': 'Alpes-Maritimes',
 '07': 'Ardêche',
 '08': 'Ardennes',
 '09': 'Ariège',
 '1': 'Ain',
 '2': 'Aisne',
 '3': 'Allier',
 '4': 'Alpes de Haute-Provence',
 '5': 'Hautes-Alpes',
 '6': 'Alpes-Maritimes',
 '7': 'Ardêche',
 '8': 'Ardennes',
 '9': 'Ariège',
 '10': 'Aube',
 '11': 'Aude',
 '12': 'Aveyron',
 '13': 'Bouches-du-Rhône',
 '14': 'Calvados',
 '15': 'Cantal',
 '16': 'Charente',
 '17': 'Charente-Maritime',
 '18': 'Cher',
 '19': 'Corrèze',
 '2A': 'Corse-du-Sud',
 '2B': 'Haute-Corse',
 '21': "Côte-d'Or",
 '22': "Côtes d'Armor",
 '23': 'Creuse',
 '24': 'Dordogne',
 '25': 'Doubs',
 '26': 'Drôme',
 '27': 'Eure',
 '28': 'Eure-et-Loir',
 '29': 'Finistère',
 '30': 'Gard',
 '31': 'Haute-Garonne',
 '32': 'Gers',
 '33': 'Gironde',
 '34': 'Hérault',
 '35': 'Îlle-et-Vilaine',
 '36': 'Indre',
 '37': 'Indre-et-Loire',
 '38': 'Isère',
 '39': 'Jura',
 '40': 'Landes',
 '41': 'Loir-et-Cher',
 '42': 'Loire',
 '43': 'Haute-Loire',
 '44': 'Loire-Atlantique',
 '45': 'Loiret',
 '46': 'Lot',
 '47': 'Lot-et-Garonne',
 '48': 'Lozère',
 '49': 'Maine-et-Loire',
 '50': 'Manche',
 '51': 'Marne',
 '52': 'Haute-Marne',
 '53': 'Mayenne',
 '54': 'Meurthe-et-Moselle',
 '55': 'Meuse',
 '56': 'Morbihan',
 '57': 'Moselle',
 '58': 'Nièvre',
 '59': 'Nord',
 '60': 'Oise',
 '61': 'Orne',
 '62': 'Pas-de-Calais',
 '63': 'Puy-de-Dôme',
 '64': 'Pyrénées-Atlantiques',
 '65': 'Hautes-Pyrénées',
 '66': 'Pyrénées-Orientales',
 '67': 'Bas-Rhin',
 '68': 'Haut-Rhin',
 '69': 'Rhône',
 '70': 'Haute-Saône',
 '71': 'Saône-et-Loire',
 '72': 'Sarthe',
 '73': 'Savoie',
 '74': 'Haute-Savoie',
 '75': 'Paris',
 '76': 'Seine-Maritime',
 '77': 'Seine-et-Marne',
 '78': 'Yvelines',
 '79': 'Deux-Sèvres',
 '80': 'Somme',
 '81': 'Tarn',
 '82': 'Tarn-et-Garonne',
 '83': 'Var',
 '84': 'Vaucluse',
 '85': 'Vendée',
 '86': 'Vienne',
 '87': 'Haute-Vienne',
 '88': 'Vosges',
 '89': 'Yonne',
 '90': 'Territoire-de-Belfort',
 '91': 'Essonne',
 '92': 'Hauts-de-Seine',
 '93': 'Seine-Saint-Denis',
 '94': 'Val-de-Marne',
 '95': "Val-d'Oise"}

const pas_geo = 10;

moment.locale('fr')


let mainHeight = (mainWidth*0.7 > 600 ? 600 : (mainWidth*0.7)-11)


mainHeight = mainHeight < 330 ? 330 : mainHeight;

// console.log(mainHeight)



d3.select('#map')
.style('width', (mainWidth > 800 ? '800px' : String(mainWidth-11) + 'px'))
.style('height', mainHeight + 'px');

d3.select('svg#map_slider')
.style('width', (mainWidth > 800 ? '800px' : String(mainWidth) + 'px'));


d3.select('#slider_container')
.style('width', (mainWidth > 800 ? '800px' : String(mainWidth) + 'px'));

var margin = {top: 80, right: 30, bottom: 60, left: 40},
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom,
    padding = 0.3,
    max_width = 800,
    width_slider = (width < (mainWidth -70) ? width : (mainWidth -70)),
    width = width < mainWidth ? width : mainWidth,
    map,
    data,
    t0 = parseTime('17/11/2018'),
    tMax,
    ticks_slider,
    svgmap,
    gmap,
    info_city,
    this_zoom_level = 2,
    thismaxZoom = 12,
    rectWidth = 10,
    minMaxRectWidth = [12,18],
    scaleWidth,
    thisMinZoom = 2;

    if($(window).width() >= 1000){

this_zoom_level = 2;

thisMinZoom = 2;

    }

    var mainColor = color_points[0];
    var alternativeColor = color_points[1];

    var colors_cat = {
      'Blocus':{'fill':'#f18fa3', 'stroke':'#e3234a'}, 
    'AG':{'fill':'#e3234a', 'stroke':'#f18fa3'}, 
  'Manifestation':{'fill':'#f18fa3', 'stroke':'#f18fa3'},
  'Violences':{'fill':'#fff', 'stroke':'#e3234a'},
  'Autre':{'fill': mainColor, 'stroke': mainColor}
}


function color_degradations(x){
if (x == "Tesla et bornes endommagées" || x == 'Tesla endommagées'){
  return mainColor
}
return alternativeColor
}

var svg = d3.select("svg#map_slider");
svg.style('width', (width_slider + 30));
var articles = d3.select('div#articles')
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

var x = d3.scaleTime()
.range([0, width_slider])
.clamp(true);

var y = d3.scaleLinear()
    .range([height, 0]);


  var div = d3.select("body").append("div")
  .attr("id", "tooltip")
  .attr('class', 'box');


Promise.all([
        d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vSbjhCKa0ivHSEj0EgL4DiPeyS1yDodAg4DoE9k31UKYAXtwRnFUSEvnePW8ybPAElxPddaBMii1xzo/pub?gid=821270545&single=true&output=csv")
    // d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vTUaq1OlhHfw8UTbLyDPDa-zPwW1bD3N2AVkuKPg9jLKOTG5vwtuYO4f5InwnNNdVWRfd3iDOFZW72C/pub?gid=1483611590&single=true&output=csv")
    // d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vS7L7OMi5sHwicSyklOG8HUljxbm9KzEnfz-4mbmlxesiyON9HyRWX7Xr9hPThxMHfOJgG4dTiyaYuZ/pub?gid=806743075&single=true&output=csv")
    // d3.csv("data/data_equides2.csv")
]).then(function(files) {
  load_Data(files[0])
}).catch(function(err) {
  console.log('erreur' + ' ' + err)
})

function load_Data(incommingData){


// console.log(incommingData)


// data = incommingData.filter(function(d){return d['coordinates'] }).filter(function(d){return d['On garde'] == 'Oui' });

data = incommingData

console.log(data)


data.forEach(function(d, i){
d.datetime = parseTime(d.Date);
// d.gpsArray = d.coordinates.split(',').map(function(e){return _.trim(e)});

    d.LatLng = new L.LatLng(+ d.Latitude,
      + d.Longitude);

    // d.type_Array = d['Type'].split(',').map(function(d){return _.trim(d)});

     d.type_Array = 'Blocus';

     // d.data_value = d.Lieu + '|' + normalizeString( d['Nom de la victime'] + ' ' + d['Cause revendiquée']);
     d.Number_of_events_in_city = data.filter(function(e){return e.Ville == d.Ville}).length;
     d.Lieu = d.Ville;
     d.EventId = i;
     d.number_of_degradations = +d["Nombre de Teslas endommagées"] +(+d["Nombre de bornes endommagées"])

})

data = data.filter(function(d){return d.datetime}).filter(function(d){return d.LatLng})


let doublons_geo = data.filter(function(d){return d.datetime}).filter(function(d){return d.LatLng})


var thoseLocations =  _.uniqBy(data, function(d){return d.Lieu}).map(function(d){return d.Lieu});
var thoseLenghts = _.countBy(data, 'Lieu');

// console.log(thoseLenghts)

let city_count = {}

for (i in data){
let d = data[i]
d['similar_locations'] = thoseLenghts[d.Lieu]

city_count[d.Lieu] = city_count[d.Lieu] ? city_count[d.Lieu] +1 : 1;

d['similar_locations_index'] = city_count[d.Lieu]

d['padding_geo_x'] = 0

d['padding_geo_y'] = 0


if(d['similar_locations'] > 1){

if (d['similar_locations'] == 2){
switch (d['similar_locations_index']){
  case 1: 
    d.padding_geo_x -= pas_geo*0.5
    break;
  case 2 : 
    d.padding_geo_x += pas_geo*0.5
    break;
}

}

else if (d['similar_locations'] == 3){
switch (d['similar_locations_index']){
  case 1: 
    d.padding_geo_y-= pas_geo
    break;
  case 2 : 
    d.padding_geo_x-= pas_geo*.5
    break;
  case 3 : 
    d.padding_geo_x += pas_geo*.5
    break;
}

}

else if (d['similar_locations'] == 4){
switch (d['similar_locations_index']){
  case 1: 
    d.padding_geo_y -= pas_geo*.75
    break;
  case 2 : 
    d.padding_geo_x -= pas_geo*.75
    break;
  case 3 : 
    d.padding_geo_x += pas_geo*.75
    break;
  case 4 : 
    d.padding_geo_y += pas_geo*.75
    break;
}

}

else if (d['similar_locations'] >= 5){


if(d['similar_locations_index'] > 1){

let this_degree_step = 360/(d['similar_locations']-1)
let this_x_y = degAndRToCartesian(1,this_degree_step*(d['similar_locations_index']-2))

d.padding_geo_x = pas_geo*this_x_y.x
d.padding_geo_y = pas_geo*this_x_y.y

}
}

}

}


  // console.log(data)

  // console.log(city_count)


tMax = d3.max(data, function(d) { return d.datetime; })
t0 = d3.min(data, function(d) { return d.datetime; })

x.domain([t0 , tMax]);
ticks_slider =  [x.ticks()[0], x.ticks()[x.ticks().length -1]];

// dragging: !L.Browser.mobile
// tap:false
var min_max_city_events =  d3.extent(data, function(d){ return d.Number_of_events_in_city});

scaleWidth = d3.scalePow(0.5)
.domain(min_max_city_events)
.range(minMaxRectWidth);

map = L.map('map', {
  dragging: !L.Browser.mobile, center: [50, -50], zoomControl:!L.Browser.mobile, maxZoom: thismaxZoom, minZoom: thisMinZoom, tap:!L.Browser.mobile}).setView([46.2, -50], this_zoom_level)

if (maptype == 'LibeCustom'){

var gl = L.mapboxGL({
        attribution: '<a href="https://www.etalab.gouv.fr" target="_blank">© Etalab</a> <a href="http://www.openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap contributors</a>',
        accessToken: 'not-needed',
        // style: 'http://195.154.106.109:2000/styles/osm-liberty/style.json'
        style: 'static/generated/styles/styles.json'
        // style: 'http://10.14.41.59:8080/styles/osm-liberty/style.json'
      }).addTo(map);
}
else
{

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20
}).addTo(map);
}

L.svg().addTo(map);

svgmap = d3.select("#map").select("svg"),
gmap = svgmap.append("g");
info_city = L.control({position: 'topleft'});

info_city.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info city box'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info_city.update = function (d) {
  // console.log('updating');
  // console.log(d);

if(d){

  // var thisHtml = '<br />Quels faits ?<br />';


let this_text_date = moment(d['Date'], 'DD-MM-YYYY').format('LL') ? moment(d['Date'], 'DD-MM-YYYY').format('LL') : '';
let nbre_tesla_endomag = +d['Nombre de Teslas endommagées']
let telsa_endom_vb =  nbre_tesla_endomag  > 1 ? 'ont' : 'a'
let nbre_tesla_brul = +d['Nombre de Tesla brûlées']
let nbre_bornes_endomag = +d['Nombre de bornes endommagées']


console.log(nbre_tesla_endomag)

var thisHtml = `<p class="dateEvent">${this_text_date}</p>
`;
thisHtml += (nbre_tesla_endomag > 0 ? `<strong >${nbre_tesla_endomag}</strong> Teslas ${telsa_endom_vb} été endommagées<br />` : '') ;
thisHtml += (nbre_tesla_brul > 0 ? `dont <strong >${nbre_tesla_brul}</strong> brûlées<br />` : '') ;
thisHtml += (nbre_bornes_endomag > 0 ? `<strong >${nbre_bornes_endomag}</strong> bornes ont été endommagées<br />` : '') ;

thisHtml += `<p class="description">${d['Description']}</p>`;
thisHtml += (d['Lien'] ? `<strong style="color:#47258A"><a href="${d['Lien']}" target="__none">Lien</a></strong> ` : '') ;

    this._div.innerHTML = '' +  
    (d ? `<span class="cityName"><h3 class='city'>${d.Lieu}</h3><button class="delete"></button></span>
      <div id="text_content">${thisHtml}</div>` : `Cliquer sur une ville`);

}
else{

    this._div.innerHTML = `Cliquer sur une ville`;

}

deleteCityTag()

};

info_city.addTo(map);


// console.log(data)

fillMapOnce(data)
makeSlider()

}

////////////////////////////// Slider  //////
//////////////////////////////////////////////////////////

function makeSlider (){

  var slider = svg.append("g")
  .attr("class", "slider")
  .attr("transform", "translate(10,20)");

  slider.append("line")
  .attr("class", "track")
  .attr("x1", x.range()[0])
  .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  .attr("class", "track-inset")
  // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  // .attr("class", "track-overlay")
  .call(d3.drag()
    .on("start.interrupt", function() { slider.interrupt(); })
    .on("start drag", function(evt) {
     moving_slider(x.invert(evt.x)); }));

slider.selectAll('rect.rectEvent')
.data(data)
.enter()
.append('rect')
.attr('class', 'rectEvent')
.attr('x', function(d){return x(d.datetime)})
.attr('y', -8)
.attr('width', '10px')
.attr('height', '15px')
.attr('fill', function(d){ return color_degradations(d["Type dommages"])})
.style('pointer-events', 'none');

  var handle = slider.insert("g", ".track-overlay")
  .attr("class", "handle")
;

handle.append("rect")
.attr("width", 12)
.attr("height", 17)
.attr("y", -9)
.attr("x", -1)
// .attr("rx", 20)
// .attr("ry", 20)
;

slider
.append('g')
.attr('transform', 'translate(0, 30)')
.append('text')
.attr('class', 'dateSlider')
.attr('text-anchor', 'start')
.text(moment(t0, 'DD-MM-YYYY').format('LL'))
;

slider
.append('g')
.attr('transform', 'translate(' + width_slider + ', 30)')
.append('text')
.attr('class', 'dateSlider')
.attr('text-anchor', 'end')
.text(moment(tMax, 'DD-MM-YYYY').format('LL'))
;
// Transitions

slider.transition() // Gratuitous intro!
.duration(sliderTime)
.tween("moving_slider", function() {
  var i = d3.interpolate(t0, tMax);
  d3.select("#articles").style('display', 'none')
  return function(t) { moving_slider(i(t)); };
})
.on('end', function(){
d3.select("#articles").style('display', 'block');
// updatemap()
populate_map(tMax, 0)

})
.on('interrupt', function(d){d3.select("#articles").style('display', 'block')});


// Auto animation with transitions

d3.select('#reload_svg')
.on('click', function(){

  slider.transition('chrono_animation')
  .duration(0);

  d3.select('#play_button')
  .text('PLAY')
  .attr('class','play');

slider.transition() // Intro
.duration(0)
.tween("moving_slider", function() {
  var i = d3.interpolate(t0, t0);
  d3.select("#articles").style('display', 'none')
  return function(t) { moving_slider(i(t)); };

})
.on('end', function(){d3.select("#articles").style('display', 'block')})
.on('interrupt', function(d){d3.select("#articles").style('display', 'block')});

})

d3.select('#play_button')
.on('click', function(){
check_transition();
});


slider
.on('click', function(){
  slider.transition('chrono_animation')
  .duration(sliderTime);
  d3.select('#play_button')
  .html('<img src="static/generated/img/play.svg"">')
  .attr('class','play');

})

function check_transition(){

  var transition_state = d3.select('#play_button').attr('class');


  if (transition_state == 'pause')
  {

    slider.transition('chrono_animation')
    .duration(0);

d3.select('#play_button')
.html('<img src="static/generated/img/play.svg">')
.attr('class','play');

}

else{
  restart_transition();
}
}

// Starting auto animation

function restart_transition(){

  d3.select('#play_button')
  .html('<img src="static/generated/img/pause.svg">')
  .attr('class','pause');

  slider.transition('chrono_animation')
  .duration(sliderTime)
  .ease(d3.easeLinear)
  .tween("moving_slider", function() {
    var i = d3.interpolate(t0, tMax);
    d3.select("#articles").style('display', 'none')
    return function(t) { moving_slider(i(t)); };
  })
  .on('end', function(){d3.select("#articles").style('display', 'block');
    // updateAllArticle()

d3.select('#play_button')
.html('<img src="static/generated/img/play.svg">')
.attr('class','play');

})
  .on('interrupt', function(d){d3.select("#articles").style('display', 'block');
// updateAllArticle()
})
}

function moving_slider(h) {
  handle.attr("transform", "translate("+ x(h) +",0)");

  populate_map(h, 0)

}

d3.select('.handle').node().parentNode.appendChild(d3.select('.handle').node())

}

function fillMapOnce(dataAll){


    // console.log(dataAll)

  // var dataAll =  _.uniqBy(dataAll, function(d){return d.Lieu});

  var dataAll =  dataAll;

  // console.log(dataAll)

    feature_map = gmap.selectAll("g.eventPict")
  .data(dataAll);

  var allMapEvents =  feature_map     
  .enter()
  .append('g')
  .attr('class', 'eventPict')
  // .attr('data-value', function(d){ return d.data_value})
  .attr('transform', 'translate(-1000,0)')

allMapEvents
  .append("circle")
  .attr('cx', 0)
  .attr('cy', 0)
  .style("pointer-events", 'all')
  .style('cursor', 'pointer')
  .style("opacity", 1) 
  .style("fill", 'white')
  .style('stroke', '#fff')
  .style('stroke-width', '2px')
  .attr("r", circle_radius)
  .attr('class', 'city_point')
  .style('visibility', 'visible')
      ;

allMapEvents
  .append("g")
  .attr('class', 'city_point')
  .attr('transform', 'translate(' + (0 - 6.2) +',' + (0 - 6.2) + ') scale(1.7)')





let allMapEventsGs = allMapEvents.select('g.city_point')




allMapEventsGs
.append('path')
.attr('class', 'D01')
.attr('d', "M6.29,1.08c1.44,1.44,1.44,3.77,0,5.21s-3.77,1.44-5.21,0L6.29,1.08Z")
.style('fill', d=> ['Tesla endommagées', 'Tesla et bornes endommagées'].includes(d["Type dommages"]) ? color_points[0] : color_points[1])

allMapEventsGs
.append('path')
.attr('class', 'D02')
.attr('d', "M1.08,6.29c-1.44-1.44-1.44-3.77,0-5.21s3.77-1.44,5.21,0L1.08,6.29Z")
.style('fill', d=>d["Type dommages"] == 'Tesla endommagées' ? color_points[0] : color_points[1])



      feature_map
      .exit()
      .remove();

      map.on("zoom", update);
      update();

      feature_map
      .on("click", function(evt, d){
        d3.selectAll('rect.hoverPict')
        .style('stroke-opacity', 0)

        d3.select(this).select('rect.hoverPict')
        .style('stroke-opacity', 1)

        populate_map(0, d);
        // appendCityTagContainer(d.ville)
      });

      function update() {

        feature_map = gmap.selectAll("g.eventPict");
        feature_map
        // .attr('data-value', function(d){return d.data_value})
        .attr("transform", 
          function(d) { 
            return "translate("+ 
            (map.latLngToLayerPoint(d.LatLng).x + d.padding_geo_x) +","+ 
            (map.latLngToLayerPoint(d.LatLng).y + d.padding_geo_y) +")";
          })

        feature_map
        .select('rect')
        .style("fill", function(d){ return color_degradations(d["Type"])})
        .style('stroke', function(d){return '#ccc'})
          }
    }

function populate_map(date_value, city, category){

  if (date_value){

    // console.log(date_value)


  var filtered_data = _.cloneDeep(data).filter(function(d){ return d.datetime <= date_value});
  filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});
fillMap(filtered_data)
  }
  
else if (category){
    var filtered_data = _.cloneDeep(data).filter(function(d){ return d.type_Array[0] == category});
    filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});

}

  else{

      info_city.update(city)

    var filtered_data = _.cloneDeep(data).filter(function(d){ return d.Lieu == city['Lieu']});
    filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});

  }

function fillMap(filtered_data){

var thoseLocations =  _.uniqBy(filtered_data, function(d){return d.Lieu}).map(function(d){return d.Lieu});
var thoseIds =  filtered_data.map(function(d){return d.EventId});
var thoseLenghts = _.countBy(filtered_data, 'Lieu');
feature_map = gmap.selectAll("g.eventPict");

feature_map.filter(function(d){return thoseIds.indexOf(d.EventId) == -1})
.attr('opacity', 0)
.style('pointer-events', 'none');


feature_map.filter(function(d){return thoseIds.indexOf(d.EventId) == -1})
.select('circle')
.style('pointer-events', 'none');

var selectedLoc = feature_map.filter(function(d){return thoseIds.indexOf(d.EventId) != -1});

selectedLoc
.select('circle')
.style('pointer-events', 'all');


selectedLoc
.attr('opacity', 1)
.style('pointer-events', 'all')
.select("circle.city_point")
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', circle_radius)
  ;

selectedLoc
.select("circle.hoverPict")
.attr('r', circle_radius)
  .attr('cx', 0)
  .attr('cy', 0);
    }

      map.on("zoom", update);
      update();

      function update() {
        feature_map
        .attr("transform", 
          function(d) { 
            return "translate("+ 
            (map.latLngToLayerPoint(d.LatLng).x + d.padding_geo_x) +","+ 
            (map.latLngToLayerPoint(d.LatLng).y + d.padding_geo_y) +")";
          })

        feature_map
        .select('rect')
        .style("fill", function(d){ return color_degradations(d["Type"])})
        .style('stroke', function(d){return '#ccc'})
          }

      }

      function updatemap() {
        gmap.selectAll("g.eventPict")
        .attr("transform", 
          function(d) { 
            return "translate("+ 
            (map.latLngToLayerPoint(d.LatLng).x + d.padding_geo_x) +","+ 
            (map.latLngToLayerPoint(d.LatLng).y + d.padding_geo_y) +") rotate(45)";
          })

        gmap.selectAll("g.eventPict")
        .select('rect')
        .style("fill", function(d){ return colors_cat[d['type_Array'][0]] ? colors_cat[d['type_Array'][0]].fill : colors_cat['Autre'].fill})
        .style('stroke', function(d){return colors_cat[d['type_Array'][0]] ? colors_cat[d['type_Array'][0]].stroke : colors_cat['Autre'].stroke})
          }

function type(d) {
  d.value = +d.value;
  return d;
}

function dollarFormatter(n) {
  n = Math.round(n);
  var result = n;
  if (Math.abs(n) > 1000) {
    result = String(_.round(n/1000, 2)).replace('.', ',') + 'K';
  }
  return result + '€';
}

function deleteCityTag(){

d3.select('div.info.city.box .cityName')
.on('click', function(){

d3.select('#map div.info.city.box')
.html('Cliquer sur une ville')

d3.select('#appenedPictoContainer').selectAll('*')
.remove()

 d3.selectAll('rect.hoverPict')
 .style('stroke-opacity', 0)

    populate_map(tMax, 0, 0)
    populate_map(tMax, 0, 0)

})

}

    function responsivefy(svg) {
        // get container + svg aspect ratio
        var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style('width')),
        height = parseInt(svg.style("height")),
        aspect = width / height;

        console.log(height)


        // add viewBox and preserve aspectratio properties
        // call resize so that svg resizes on initial page load
        svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMid")
        .call(resize);

        // to register multiple listeners for the same event type
        d3.select(window).on("resize." + container.attr("id"), resize);

        function resize() {

            var actualContainerWidth = parseInt(container.style("width"));

            var targetWidth = actualContainerWidth <= max_width  ? actualContainerWidth : 800;
            var targetHeight = Math.round(targetWidth / aspect);

            svg.attr("width", targetWidth);
            svg.attr("height", targetHeight);

        }
    }

function appendImages(array_types){
var this_html = ''

for (i in array_types){
var thisD = array_types[i]

if (! images_cat[thisD]){
}
else{

var thisImg = '<img src="static/generated/img/' + images_cat[thisD]+'" class="pictosArticles"/>'

  this_html = this_html + thisImg

}

}

return this_html
}

var removespecials = function (str){
  return str.replace(/[èéêëœ]/g,"e").replace(/[àáâãäåæ]/g,"a").replace(/[ç]/g,"c").replace(/[ìíîï]/g,"i").replace(/[ðñòóôõö]/g,"o").replace(/[ùúûü]/g,"u").replace(/[ýÿ]/g,"y")
};

var prettyfy_string = function(string){return string.replace(" ","_").replace("'","_").replace("(","_").replace(")","_")};

function addSpacesFr(nStr)
{
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ' ' + '$2');
  }
  return x1;
}

function normalizeString(s){
 return _.snakeCase(_.deburr(s))
}

serialize_for_url = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

d3.select('#volet svg#close_button')
.on('click', function(){ d3.select('#volet').style('display', 'none')})

d3.select('#savoir_plus')
.on('click', function(){ d3.select('#volet').style('display', 'block')})




function degAndRToCartesian(r, deg) {
    t = deg * (Math.PI/180);
  return {x:r * Math.cos(t), y:r * Math.sin(t)} 
}
