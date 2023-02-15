
var mainWidth = parseInt(d3.select('#mainContent').style("width"));

    // var mainWidth = 800;

    var searchIndex,
    mapped,
    find_school,
    margin = {top: 80, right: 30, bottom: 60, left: 40},
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom,
    padding = 0.3,
    max_width = 900,
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
    thisMinZoom = 4,
    myRenderer,
    grouped_points,
    info_city,
    baseMapHeight,
    baseMapWidth,
    cities_data,
    votes_data,
    circle_size = 1;


 const type_etablissement = window.location.search.replace('?type=', '')

let data_url

 if (type_etablissement == 'ecole'){
data_url = 'ecoles_ips.csv'
 }
else if (type_etablissement == 'college'){
data_url = 'colleges_ips.csv'

circle_size = 1.3
}
else {
	
data_url = 'ecoles_ips.csv'

}


    let school_data;

var circleScalePop = 
d3.scaleSqrt()
.range([1, 8])
.domain([0, 250000]);

var colorScaleIPS = 
d3.scaleSequential()
  .domain([30, 200])
  .interpolator(d3.interpolatePuOr);


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


d3.selectAll('#school_sector a')
.on('click', function(){

d3.selectAll('#school_sector a')
.classed('selected', false)

d3.select(this)
.classed('selected', true)

  if (this.id == 'public'){

 grouped_points.remove()
let this_data = school_data.filter(d=>d.Secteur == 'public')
drawAllPoints(this_data)
  }
  else if (this.id == 'prive'){
  grouped_points.remove()
let this_data = school_data.filter(d=>d.Secteur != 'public')
drawAllPoints(this_data) 
  }
  else{
  	grouped_points.remove()
drawAllPoints(school_data) 

  }


})


    d3.queue()
    // .defer(d3.csv, 'data/communes_presidentielle_2022.csv')
    .defer(d3.csv, 'data/' + data_url)
    .await(load_Data);

    function load_Data(error, geoloc_data){



      geoloc_data.forEach(function(d){
        d.latLong = [+d.latitude, +d.longitude];
        d.IPS_2022 = +d.IPS_2022;
      })


      school_data = geoloc_data;


      searchIndex = new FlexSearch({

        encode: "icase",
        tokenize: "strict",
        threshold: 1,
        async: true,
        worker: 4
      });

      mapped = _.mapValues(_.keyBy(geoloc_data, 'UAI'))


      for (i in geoloc_data){
        var d = geoloc_data[i];
        searchIndex.add(i, d["Nom de l'établissment"] + ' ' + d["Nom de la commune"])
      }

      d3.select('#find_school')
      .style('display', 'block');

      d3.select('#img_spinner')
      .style('display', 'none');

      find_school =  function (query){

        var list_index =  searchIndex.search(removespecials(query));

        // return list_index.map(d=> mapped[d])
        return list_index.map(d=> geoloc_data[d])

      }

      d3.select('#find_school')
      .on('input', function(){
       var this_val = d3.select(this).property('value');
       if (this_val.length > 3){
        // console.log(this_val)
        var this_result = find_school(this_val)
        // console.log(this_result)
        d3.select('#resultat_diagnostic')
        .html('')
        populateResults(this_result)
      }
      else{
        populateResults([])
      }

    })

      configMap(geoloc_data)

    }

    function populateResults(data_){

      console.log(data_)

      d3.select('#all_results').style('display', 'block')



      var this_selection = d3.select('#all_results').selectAll('li.entry')
      .data(data_);

      this_selection.exit().remove();

      this_selection
      .select('li a')
      .html(function(d){return d["Nom de l'établissment"] + ' ' + d["Nom de la commune"]})

      this_selection
      .enter()
      .append('li')
      .attr('class', 'entry')
      .append('a')
      .html(function(d){return d["Nom de l'établissment"] + ' ' + d["Nom de la commune"]})

      d3.selectAll('#all_results li.entry a')
      .on('click', function(d){

        openingPopup(d, 0)


        d3.select('#all_results').style('display', 'none')

      })

    }

    function openingPopup(d, o){

      console.log('opening')

      console.log(d)
      console.log(o)
/*
      UAI
      school_data*/

/*      populateResults([])*/

      let this_obj = o? _.find(school_data, e => e.UAI == o) : d;

      console.log(this_obj)

      let this_code = this_obj.UAI;
      let this_name = this_obj['Nom de la commune'];

      let html_popup;
      let html_info;
      // console.log(this_obj);
      if (this_obj){






        html_popup = 
        `${this_name}`

        html_info = 
        `<strong style="font-weight:bold; font-family: 'libesansweb-semicondensed'; letter-spacing: 0.04em; font-size: 15px;">
        ${this_obj['Nom de la commune']} - ${this_obj['Code du département']}</strong><br>
        ${this_obj["Nom de l'établissment"]}<br>
        IPS en 2022 : ${this_obj['IPS_2022']}<br>
        IPS en 2017 : ${this_obj['IPS_2017']}<br>
        Secteur : ${this_obj['Secteur']}`;



  d3.select('.info.city.box')
  .html(html_info)

  map.closePopup()

  grouped_points.eachLayer(function (layer) {

    if (layer.id ===  this_code){

      map.setView(layer.getLatLng())

      if (map.getZoom() < 10 && d ){
        map.setView(layer.getLatLng(), 10)
      }
      else{
        map.setView(layer.getLatLng())
      }

      
      layer.bindPopup(html_popup)
      layer.openPopup()}
    })

}
else{

  map.closePopup()

  if(d.latitude && d.longitude){

    let thisLatLong = L.latLng(d.latitude, d.longitude)
    
    if (map.getZoom() < 10 && d ){
      map.setView(thisLatLong, 10)
    }
    else{
      map.setView(thisLatLong)
    }
    
    var this_popup = L.popup()
    .setLatLng(thisLatLong)
    .setContent(d['nom'])
    .openOn(map);

     }

  d3.select('.info.city.box')
  .html(html_info)

}

d3.select('div.info.city.box').style('display', 'block')

adaptInfobox()

}


function drawGraph(range){

var this_html = '<div style="margin-top:10px">';

for (i in range){
  var d = range[i]
  var html_chunk = '<div style="margin-top:5px">'
  // html_chunk += `<div >${d.tete_liste}</div>
  html_chunk += `<div style="float:right;margin-right: 4px;font-weight:bold">  ${d.score != 100 ? d.score + ' %' : '' }</div><div style="margin-top:5px">${_.capitalize(d.NomPsn).replace('Le pen', 'Le Pen').replace('Dupont-aignan', 'Dupont-Aignan')}</div>
      <div style="height:9px;background-color: #ddd"><div style="height:8px;width:${d.score}%;background-color:${colors_candidats[d.NomPsn]};"></div>
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

// dragging: !L.Browser.mobile, center: [50, 2], zoomControl:!L.Browser.mobile, maxZoom: thismaxZoom, minZoom: thisMinZoom, tap:!L.Browser.mobile}).setView([46.2, 2], this_zoom_level)

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

  myRenderer = L.canvas({ padding: 0.5 });


  console.log(data)

drawAllPoints(data)




d3.selectAll('.leaflet-control-attribution.leaflet-control a').attr('target', '_blank')

map.on('zoomend', function() {
  var currentZoom = map.getZoom();

  var myRadius = calculateZoomLevel(currentZoom);
  grouped_points.eachLayer(function (layer) {
    layer.setRadius(myRadius*layer.scalepop);
  });

});

map.on('popupclose', function(e) {
  d3.select('div.info.city.box').style('display', 'none');

  d3.select('.info.city.box.leaflet-control').style('height', 'auto')
// d3.select('.info.city.box.leaflet-control').style('overflow', '')

});


}




function drawAllPoints(data){




   let currentZoom = map.getZoom();

  let allpoints = [];


  data.forEach(function (d) {


    let this_marker = L.circleMarker(d.latLong, {
    renderer: myRenderer,
    radius : calculateZoomLevel(currentZoom)*circle_size,
    color : colorScaleIPS(d.IPS_2022),
    fillColor : colorScaleIPS(d.IPS_2022),

    fillOpacity : 1,
    stroke:0
  });
  this_marker.id = d.UAI;
  this_marker.mayor = colorScaleIPS(d.IPS_2022);
  this_marker.scalepop = circle_size;

  this_marker.on('click', function(e){openingPopup(0, e.target.id)})

  allpoints.push(this_marker);
  })


grouped_points =  L.layerGroup(allpoints);

grouped_points.addTo(map);




}



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

      d3.select('#map')
      .style('height', newHeightMap + 'px');
    }

    else{
      d3.select('#map')
      .style('height', baseMapHeight + 'px');

    }

    d3.select('.info.city.box.leaflet-control').style('overflow', 'auto')

    height_infobox = d3.select('.info.city.box.leaflet-control').node().getBoundingClientRect().height;

  }

  function calculateZoomLevel(thisZoom){

    return (thisZoom**1.8)*(1/20)

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

   function testMobile (){
    if (parseInt(d3.select('#mainContent').style("width")) >= 600){
      return true
    }

    return false

  }


/*  function filterPositionPolitique(position){

if(position){
grouped_points.eachLayer(function(layer){
if (layer.mayor == position){layer.setStyle({'fillOpacity': 1})}
else {layer.setStyle({'fillOpacity': 0})}
})

}
else{
grouped_points.eachLayer(function(layer){
layer.setStyle({'fillOpacity': 1})
})

}

  }*/