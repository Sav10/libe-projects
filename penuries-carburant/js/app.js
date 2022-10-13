var parseTime = d3.timeParse("%Y-%m-%d");

var formatTime = d3.timeFormat("%d/%m/%Y")

var formatTime2 = d3.timeFormat("%Y-%m-%d")

var mainWidth = parseInt(d3.select('.mainContent .mainMap').style("width"));

var sliderTime = 4000;

var maptype = 'standard';


moment.locale('fr')


d3.select('#map')
.style('width', (mainWidth > 800 ? '800px' : String(mainWidth-11) + 'px'))
.style('height', (mainWidth > 800 ? '800px' : String(mainWidth-11) + 'px'));

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
    data_ids,
    data_evo,
    t0 = parseTime('2022-09-01'),
    t0_txt = '2022-09-27',
    tMax,
    tMax_txt = '2022-10-11',
    ticks_slider,
    svgmap,
    gmap,
    info_city,
    this_zoom_level = 4.6,
    thismaxZoom = 12,
    rectWidth = 10,
    minMaxRectWidth = [12,18],
    scaleWidth,
    thisMinZoom = 2;



    if($(window).width() >= 1000){

this_zoom_level = 6;

thisMinZoom = 5;

    }

    // var mainColor = '#f9be00';

    var mainColor = 'rgb(227, 35, 74)';
    var alternativeColor = 'rgb(255, 152, 0)';



    

    var colors_cat = {
      'Blocus':{'fill':'#f18fa3', 'stroke':'#e3234a'}, 
    'AG':{'fill':'#e3234a', 'stroke':'#f18fa3'}, 
  'Manifestation':{'fill':'#f18fa3', 'stroke':'#f18fa3'},
  'Violences':{'fill':'#fff', 'stroke':'#e3234a'},
  'Autre':{'fill': mainColor, 'stroke': mainColor}
}

function color_intentionnel(x){
if (x == 1){
  return mainColor
}

return alternativeColor

}

    var images_cat = {
      'Blocus':'blocus.png', 
    'AG':'ag.png', 
  'Manifestation':'manif.png',
  'Violences':'violence.png',
   'Autre':'greve.png'
}

var image_names = Object.keys(colors_cat).map(function(d){return {name:d, image:images_cat[d]}});


var svg = d3.select("svg#map_slider");

svg.style('width', (width_slider + 30));

var articles = d3.select('div#articles')

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  // var x = d3.scaleLinear()
  // .domain([2017, 2018])
  // .range([0, width])
  // .clamp(true)
  // ;

// parse the date / time


// set the ranges
var x = d3.scaleTime()
.range([0, width_slider])
.clamp(true);


var y = d3.scaleLinear()
    .range([height, 0]);


  var div = d3.select("body").append("div")
  .attr("id", "tooltip")
  .attr('class', 'box');



    // d3.queue()
    // .defer(d3.csv, 'data/data_equides.csv')
    // .await(load_Data);

Promise.all([
    // d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vTUaq1OlhHfw8UTbLyDPDa-zPwW1bD3N2AVkuKPg9jLKOTG5vwtuYO4f5InwnNNdVWRfd3iDOFZW72C/pub?gid=1483611590&single=true&output=csv")
    d3.csv("data/rupture_ids.csv"),
    d3.csv("data/ruptures_evol.csv")
    // d3.csv("data/data_equides2.csv")
]).then(function(files) {
  load_Data(files[0], files[1])
}).catch(function(err) {
  console.log('erreur' + ' ' + err)
})


d3.select('#iconMoreContent')
.on('click', function(){

d3.select('.morecontent').style('display')  ==  'none' ? d3.select('.morecontent').style('display', 'block') : d3.select('.morecontent').style('display', 'none');



 })


function load_Data(ruptures_ids, ruptures_evo){



// data = incommingData.filter(function(d){return d['coordinates'] }).filter(function(d){return +d['Confirmé'] == 1 });

data_ids = ruptures_ids

data_evo= ruptures_evo

data_ids.forEach(function(d, i){

d.datetime = parseTime(d.rupture_debut);

// d.gpsArray = d.coordinates.split(',').map(function(e){return _.trim(e)});


    d.LatLng = new L.LatLng((+d.latitude)/100000,
      (+d.longitude)/100000);

    // d.type_Array = d['Type'].split(',').map(function(d){return _.trim(d)});

     // d.data_value = d.Lieu + '|' + normalizeString( d['Nom de la victime'] + ' ' + d['Cause revendiquée']);
     // d.Number_of_events_in_city = data.filter(function(e){return e.Lieu == d.Lieu}).length;
     // d.Lieu = d.Ville;

     // d.intentionnel = +d['Piste intentionnelle privilégiée'];

})

data_evo.forEach(function(d, i){

})

console.log(data_ids)

console.log(data_evo)


// data = data.filter(function(d){return d.datetime}).filter(function(d){return d.LatLng})


// data = d0

tMax = d3.max(data_ids, function(d) { return d.datetime; })
tMax = parseTime(tMax_txt)
t0 = parseTime(t0_txt)

x.domain([t0 , tMax]);

ticks_slider =  [x.ticks()[0], x.ticks()[x.ticks().length -1]];

// dragging: !L.Browser.mobile
// tap:false



map = L.map('map', {
  // dragging: !L.Browser.mobile, 
  center: [50, 2], zoomControl:!L.Browser.mobile, maxZoom: thismaxZoom, minZoom: thisMinZoom, tap:!L.Browser.mobile}).setView([46.2, 2], this_zoom_level)


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

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
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
  // console.log(d);
    this._div.innerHTML = '' +  
    (d ? '<span class="cityName">' + d   + '<button class="delete"></button></span>' : 'Cliquer sur une ville');

deleteCityTag()


};

info_city.addTo(map);



fillMapOnce(data_ids)

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




// slider.selectAll('rect.rectEvent')
// .data(data)
// .enter()
// .append('rect')
// .attr('class', 'rectEvent')
// .attr('x', function(d){return x(d.datetime)})
// .attr('y', -8)
// .attr('width', '10px')
// .attr('height', '15px')
// .attr('fill', function(d){ return color_intentionnel(d.intentionnel)})
// .style('pointer-events', 'none');


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
.text(moment(t0, 'YYYY-MM-DD').format('LL'))
;


slider
.append('g')
.attr('transform', 'translate(' + width_slider + ', 30)')
.append('text')
.attr('class', 'dateSlider')
.attr('text-anchor', 'end')
.text(moment(tMax, 'YYYY-MM-DD').format('LL'))
;
// Transitions

console.log(t0, tMax)

slider.transition()
.delay(500)
.duration(sliderTime)
.tween("moving_slider", function() {
  var i = d3.interpolate(t0, tMax);
  return function(t) { moving_slider(i(t)); };
})
.on('end', function(){
// updatemap()
populate_map(tMax, 0)

})



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

    // console.log(transition_state)


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

  console.log('filling once')


  // var dataAll =  _.uniqBy(dataAll, function(d){return d.Lieu});

  // console.log(dataAll)

    feature_map = gmap.selectAll("g.eventPict")
  .data(dataAll);


  var allMapEvents =  feature_map     
  .enter()
  .append('g')
  .attr('class', 'eventPict')
  // .attr('data-value', function(d){ return d.data_value})
  .attr('transform', 'translate(-1000,0)')
  .attr('opacity', 0)

allMapEvents
  .append("rect")
  // .attr('x', function(d){return (-scaleWidth(d.Number_of_events_in_city)/2 - 2)})
  // .attr('y', function(d){return (-scaleWidth(d.Number_of_events_in_city)/2 - 2)})
  .attr('width', function(d){return 4})
  .attr('height', function(d){return 4})
  .attr('x', function(d){return (5 - 2)})
  .attr('y', function(d){return (5 - 2)})
  .style("stroke-width", 0.5)
  .style("pointer-events", 'all')
  .style('cursor', 'pointer')
  .style("opacity", 1) 
  .style("fill", function(d){ return color_intentionnel(d.intentionnel)})
  .style('stroke', '#ccc')
  .style('stroke-width', '1px')
      // Other colors
      // .style("fill", "#22A7F0")
      // .style("fill", "#F89406")
      // .style("fill", "#BF55EC")
      // .attr("r", function(d){return radius_scale(d.value)})
      // .attr("r", 5)
      // .attr('width', function(d){return scaleWidth(d.Number_of_events_in_city)})
      // .attr('height', function(d){return scaleWidth(d.Number_of_events_in_city)})
      .attr('class', 'city_point')
      // .on("mouseover", function(d){console.log(d); populate_panel(0, d.ville)})
      ;


// allMapEvents
// .append('rect')
// .attr('class', 'hoverPict')
//   .style("stroke", "#555")
//   .style("stroke-width", 3)
//   .style('stroke-opacity', 0)
//   .style('fill-opacity', 0)
//   .attr('width', function(d){return 4})
//   .attr('height', function(d){return 4})
//   .attr('x', function(d){return (5 - 2)})
//   .attr('y', function(d){return (5 - 2)})
  // .attr('width', function(d){return (scaleWidth(d.Number_of_events_in_city) + 2)})
  // .attr('height', function(d){return (scaleWidth(d.Number_of_events_in_city) + 2)})
  // .attr('x', function(d){return (-scaleWidth(d.Number_of_events_in_city)/2 - 2)})
  // .attr('y', function(d){return (-scaleWidth(d.Number_of_events_in_city)/2 - 2)})


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

        // populate_map(0, d.Lieu);
        // appendCityTagContainer(d.ville)
      });


      function update() {


        feature_map = gmap.selectAll("g.eventPict");

        feature_map
        // .attr('data-value', function(d){return d.data_value})
        .attr("transform", 
          function(d) { 
            return "translate("+ 
            map.latLngToLayerPoint(d.LatLng).x +","+ 
            map.latLngToLayerPoint(d.LatLng).y +") rotate(45)";
          })

        feature_map
        .select('rect')
        // .style("fill", function(d){ return color_intentionnel(d.intentionnel)})
        .style("fill", 'red')
        .style('stroke', function(d){return '#ccc'})
          }


    }


function populate_map(date_value, city, category){

  // select only cities of selected year or before

  // console.log(date_value)

  // console.log(data)

  if (date_value){
    console.log(date_value)

    formatTime2(date_value)


// d3.select('text.dateSlider')
// .text(moment(date_value).format('LL'))


  var filtered_data = _.cloneDeep(data_evo).filter(function(d){ return d[formatTime2(date_value)]});

  // console.log(_.uniq(filtered_data.filter(function(d){return d.Lieu == "Quimper"}).map(function(d){return d.Lieu})))


// console.log(filtered_data)


// updatemap()

// updateAllArticle(filtered_data)

fillMap(filtered_data)



  }
  
else if (category){

// console.log(data)

// console.log(category)


    var filtered_data = _.cloneDeep(data).filter(function(d){ return d.type_Array[0] == category});

    // console.log(filtered_data)

    filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});


    // fillMap(filtered_data)

    // console.log(filtered_data)

}

  else{

    d3.select("#cityTitle")
      .text(city);

      info_city.update(city)

      // d3.select('.info.city.box')
      // .style('display', 'none')


    var filtered_data = _.cloneDeep(data).filter(function(d){ return d.Lieu == city});

    // console.log(filtered_data)

    filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});

  }

  


function fillMap(filtered_data){



var thoseLocations =  _.uniqBy(filtered_data, function(d){return d.id}).map(function(d){return d.id});


// var thoseLenghts = _.countBy(filtered_data, 'Lieu');

feature_map = gmap.selectAll("g.eventPict");


feature_map
.attr('opacity', 1);


feature_map.filter(function(d){return thoseLocations.indexOf(d.id) == -1})
.attr('opacity', 0);



var selectedLoc = feature_map.filter(function(d){return thoseLocations.indexOf(d.id) != -1});

// selectedLoc
// .attr('opacity', 1)
// .select("rect.city_point")
//   .attr('width', function(d){return 4})
//   .attr('height', function(d){return 4})
//   .attr('x', function(d){return (5 - 2)})
//   .attr('y', function(d){return (5 - 2)});


// selectedLoc
// .select("rect.hoverPict")
//   .attr('width', function(d){return 4})
//   .attr('height', function(d){return 4})
//   .attr('x', function(d){return (5 - 2)})
//   .attr('y', function(d){return (5 - 2)});


    }


      map.on("zoom", update);
      update();



      function update() {
        feature_map
        // .attr('data-value', function(d){return d.data_value})
        .attr("transform", 
          function(d) { 
            return "translate("+ 
            map.latLngToLayerPoint(d.LatLng).x +","+ 
            map.latLngToLayerPoint(d.LatLng).y +") rotate(45)";
          })

        feature_map
        .select('rect')
        .style("fill", function(d){ return color_intentionnel(d.intentionnel)})
        .style('stroke', function(d){return '#ccc'})
          }





      }


      function updatemap() {
        gmap.selectAll("g.eventPict")
        // .attr('data-value', function(d){return d.data_value})
        .attr("transform", 
          function(d) { 
            return "translate("+ 
            map.latLngToLayerPoint(d.LatLng).x +","+ 
            map.latLngToLayerPoint(d.LatLng).y +") rotate(45)";
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


d3.selectAll(".shareTwitter")
.on('click', function(){ shareTwitter()});

d3.selectAll(".shareFacebook")
.on('click', function(){ shareFacebook()});



function shareFacebook () {
          var url = encodeURIComponent(window.location.origin + window.location.pathname),
              link = 'http://www.facebook.com/sharer/sharer.php?u=' + url ;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
        };

function shareTwitter () {
          var url = encodeURIComponent(window.location.origin + window.location.pathname),
              text = "Chevaux mutilés https://www.liberation.fr/apps/2020/09/la-carte-des-chevaux-mutiles/ via @libe",
              link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');

      }

