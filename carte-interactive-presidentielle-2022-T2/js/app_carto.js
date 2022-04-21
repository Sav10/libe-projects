    var searchIndex,
    mapped,
    find_school,
    asbetos_data_,
    margin = {top: 80, right: 30, bottom: 60, left: 40},
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom,
    padding = 0.3,
    max_width = 800,
    width_slider = (width < (mainWidth -70) ? width : (mainWidth -70)),
    width = width < mainWidth ? width : mainWidth,
    map,
    data,
    tMax,
    ticks_slider,
    svgmap,
    gmap,
    info_city,
    this_zoom_level = 4.6,
    thismaxZoom = 16,
    rectWidth = 10,
    minMaxRectWidth = [12,30],
    scaleWidth,
    thisMinZoom = 2,
    myRenderer,
    grouped_points;
;

// var mainWidth = parseInt(d3.select('.mainContent .mainMap').style("width"));


var mainWidth = 800;


    d3.queue()
    // .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcHL3XxOZ9um6FGGsNJMX9xq3Bk0w9yGnT6uffzEYkC44_ILLllx7Eit0QY6pE0yDcEOIUt2iQmYs0/pub?gid=1360208169&single=true&output=csv')
    .defer(d3.csv, 'data/data_amiante_geoloc.csv')
    // .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSpuAtOBAKV4qtLEkCl2mdBfmDkU1GCdCpDfCZ-is3-KIIuwpQyJZXlH1zw-Ai5tyRhvcnL416uAhBU/pub?gid=1430289231&single=true&output=csv')
    // .defer(d3.json, 'static/data/departements.json')
    .await(load_Data);

    function load_Data(error, data){

      // asbetos_data_ = asbetos_datadata = ;

// data = _.slice(data,0,1000);

console.log(data)
// console.log(asbetos_data)

data.forEach(function(d){
d.latLong = [+d.Latitude, +d.Longitude];
})

data = data.filter(d=> d.latLong[0] && d.latLong[1]);

map = L.map('map', {
  dragging: !L.Browser.mobile, center: [50, 2], zoomControl:!L.Browser.mobile, maxZoom: thismaxZoom, minZoom: thisMinZoom, tap:!L.Browser.mobile}).setView([46.2, 2], this_zoom_level)


L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


myRenderer = L.canvas({ padding: 0.5 });

let allpoints = [];

for (i in data) { // 100k points
  d = data[i];
  let this_marker = L.circleMarker([+d.Latitude, +d.Longitude], {
    renderer: myRenderer,
    radius: calculateZoomLevel(this_zoom_level),
    color : setColor(d),
    fillColor : setColor(d),
    fillOpacity : 1,
    stroke:0
  }).bindPopup(d['Nom']);
  allpoints.push(this_marker);

}

grouped_points =  L.layerGroup(allpoints);

grouped_points.addTo(map);

map.on('zoomend', function() {
  var currentZoom = map.getZoom();
  console.log(currentZoom)
var myRadius = calculateZoomLevel(currentZoom);
 grouped_points.eachLayer(function (layer) {
    layer.setRadius(myRadius);
layer.redraw()
});

});


function setColor(d){

if (d.dta == 'OUI'){

if (d.presence_amiante == 'OUI'){

if (d.obligation_surveillance == 'OUI'){

return 'black'

}
else{

  return 'red'
}

}
else{

return 'green'  
}

}
else{

return "#ccc"

}

}

}

function calculateZoomLevel(thisZoom){

return (thisZoom**1.8)*(1/20)

}

function populateResults(data_){



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
  .on('click', function(d){ shareTwitter()});

  d3.selectAll(".shareFacebook")
  .on('click', function(d){ shareFacebook()});

  function shareFacebook () {
    var url = encodeURIComponent(window.location.origin + window.location.pathname),
    link = 'http://www.facebook.com/sharer/sharer.php?u=' + url ;
    window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
  };

  function shareTwitter () {
    var url = encodeURIComponent(window.location.origin + window.location.pathname),
    text = "Chronologie des arrêtés anti pesticides https://www.liberation.fr/apps/2020/01/chronologie-des-arretes-anti-pesticides/ via @libe",
    link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
    window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');

  }