    
var mainWidth = parseInt(d3.select('#mainContent').style("width"));

    // var mainWidth = 800;

    var searchIndex,
    mapped,
    find_school,
    asbetos_data_,
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
    votes_data;

var circleScalePop = 
d3.scaleSqrt()
.range([1, 8])
.domain([0, 250000]);


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


var colors_nuances = {
"LSOC":'#e6476b',
"LLR":'#35559e',
 "LEXD":'#1e2045',
 "LDVG":'#eb6184',
 "LUG":'#e6476f',
 "LUDI":'#a064a1',
 "LREM":'#f3af28',
 "LDLF":'#25335c',
 "LCOM":'#af1920',
 "LDVD":'#3d6ab0',
 "LUD":'#026db5',
 "LRDG":'#f781b6',
  "LECO":'#42b38e',
  "LRN":'#14152d',
  "LMDM":'#ec9528',
  "LDVC":'#e77928',
  "LUC":'#ec9528',
    'LDIV': "#bdbcbc",
    'LEXG': "#761519",
'LFI': "#cc1422",
'LREG': "#cfb096",
'LGJ': "#666",
'LVEC': '#52ae56',
'LUGE': '#BD6277',
'LUCD': '#7993ca'}

var nuance_intitule = {
  'LEXG': 'Extrême gauche',
  'LCOM': 'PCF',
  'LFI': 'France insoumise',
  'LSOC': 'PS',
  'LRDG': 'PRG',
  'LDVG': 'Divers gauche',
  'LUG': 'Union de la gauche',
  'LVEC': 'EELV',
  'LECO': 'Ecologiste',
  'LDIV': 'Divers',
  'LREG': 'Régionaliste',
  'LGJ': 'Gilets jaunes',
  'LREM': 'LREM',
  'LMDM': 'Modem',
  'LUDI': 'UDI',
  'LUC': 'Union du centre',
  'LDVC': 'Divers centre',
  'LLR': 'Les Républicains',
  'LUD': 'Union de la droite',
  'LDVD': 'Divers droite',
  'LDLF': 'Debout la France',
  'LRN': 'Rassemblement National',
  'LEXD': 'Extrême droite'}


var positionnement_parti = {
  'LEXG': 'Gauche radicale',
  'LCOM': 'Gauche radicale',
  'LFI': 'Gauche radicale',
  'LSOC': 'Gauche',
  'LRDG': 'Gauche',
  'LDVG': 'Gauche',
  'LUG': 'Gauche',
  'LVEC': 'Ecologiste',
  'LECO': 'Ecologiste',
  'LDIV': 'Divers',
  'LREG': 'Divers',
  'LGJ': 'Divers',
  'LREM': 'Centre droit',
  'LMDM': 'Centre droit',
  'LUDI': 'Centre droit',
  'LUC': 'Centre droit',
  'LDVC': 'Centre droit',
  'LLR': 'Droite',
  'LUD': 'Droite',
  'LDVD': 'Droite',
  'LDLF': 'Droite',
  'LRN': 'Extrême droite',
  'LEXD': 'Extrême droite'
}

var position_politique =
['Gauche radicale', 'Gauche', 'Ecologiste', 'Divers', 'Centre droit', 'Droite', 'Extrême droite'];


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

    d3.queue()
    // .defer(d3.csv, 'data/communes_presidentielle_2022.csv')
    .defer(d3.csv, 'https://sav10.github.io/libe-projects/carte-interactive-presidentielle-2022/data/communes_presidentielle_2022.csv')
    // .defer(d3.csv, 'data/communes_presidentielle_votes.csv')
    .defer(d3.csv, 'https://sav10.github.io/libe-projects/carte-interactive-presidentielle-2022/data/communes_presidentielle_votes.csv')
    .await(load_Data);

    function load_Data(error, geoloc_data, data2){



      geoloc_data.forEach(function(d){
        d.latLong = [+d.latitude, +d.longitude];
        d.Inscrits = +d.Inscrits;
        d.clean_name = removespecials(d.LibSubCom)
      })


    data2.forEach(d =>{

 candidate_names.forEach(e =>{
   d[e] = +d[e]
 })

    })


    votes_data = data2

      geoloc_data = geoloc_data.filter(d=> d.latLong[0] && d.latLong[1]);

      cities_data = geoloc_data;

      searchIndex = new FlexSearch({

        encode: "icase",
        tokenize: "strict",
        threshold: 1,
        async: true,
        worker: 4
      });

      mapped = _.mapValues(_.keyBy(geoloc_data, 'code_commune'))

      for (i in geoloc_data){
        var d = geoloc_data[i];
        searchIndex.add(i, d['clean_name'])
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

      var this_selection = d3.select('#all_results').selectAll('li.entry')
      .data(data_);

      this_selection.exit().remove();

      this_selection
      .select('li a')
      .html(function(d){return d['LibSubCom']})

      this_selection
      .enter()
      .append('li')
      .attr('class', 'entry')
      .append('a')
      .html(function(d){return d['LibSubCom']})

      d3.selectAll('#all_results li.entry a')
      .on('click', function(d){

        openingPopup(d, 0)

      })

    }

    function openingPopup(d, o){

      populateResults([])

      let this_obj_city = o? _.find(cities_data, e => e.code_commune == o) : d;

      let this_obj2 = o? _.find(votes_data, e => e.code_commune == o) : _.find(votes_data, e => e.code_commune == d.code_commune);

      let this_code = this_obj_city.code_commune;
      let this_name = this_obj_city.LibSubCom;

      let html_popup;
      let html_info;
      // console.log(this_obj);
      if (this_obj2){

        let this_inscrits = +this_obj_city.Inscrits
        let this_votants = +this_obj_city.Votants
        let this_exprimes = +this_obj_city.Exprimes
        let this_abstentions = +this_obj_city.Abstentions

         candidate_names.forEach(e =>{

        this_obj2[e + '_score'] = _.round(100*this_obj2[e] / this_exprimes, 1)

        })

        let this_dep_scores = candidate_names.map(function(e){ return {
          'NomPsn': e, 'score': this_obj2[e+'_score'], 'NbVoix': this_obj2[e],
          'LibSubCom': this_obj_city['LibSubCom'],  'code_commune' : this_obj2['code_commune'] } })

        this_dep_scores = this_dep_scores.sort(function(a,b) {  return b.score - a.score})
        // this_dep_scores = _.slice(this_dep_scores, 0, 11)

        html_popup = 
        `${this_name}`

        html_info = 
        `<strong style="font-weight:bold; font-family: 'libesansweb-semicondensed'; letter-spacing: 0.04em; font-size: 15px;">${this_obj_city.LibSubCom}</strong>`;

  if (this_obj_city.url_libe){

    html_info = `<a target="_blank" href="${this_obj_city.url_libe}" style="color:#000;display:inline-block;font-weight:bold; font-family: 'libesansweb-semicondensed'; letter-spacing: 0.04em; font-size: 15px;"> ${this_obj_city.LibSubCom}<img src="img/Voir-Plus.svg" style="width:1em;display:inline-block;margin-left:1em"></a>`
}


    var tooltip_graph =  drawGraph(this_dep_scores)

    html_info += tooltip_graph

    html_info += `<hr>Nombre de votes exprimés : ${this_exprimes}<br>
Taux d'abstention : ${String(_.round(100*this_abstentions / +this_inscrits, 1)).replace('.', ',')}%`

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

  let allpoints = [];


  data.filter


for (i in data) { // 100k points

  d = data[i];
  
  // console.log(d)
  let this_marker = L.circleMarker([+d.latitude, +d.longitude], {
    renderer: myRenderer,
    radius: calculateZoomLevel(this_zoom_level)*circleScalePop(d.Inscrits),
    color : colors_candidats[d.entete],
    fillColor : colors_candidats[d.entete],
    // color : setColor(d),
    // fillColor : setColor(d),
    fillOpacity : 1,
    stroke:0
  });
  this_marker.id = d.code_commune;
  this_marker.mayor = colors_candidats[d.entete];
  this_marker.scalepop = circleScalePop(d.Inscrits);
  // console.log(this_marker.id)

  this_marker.on('click', function(e){openingPopup(0, e.target.id)})
  allpoints.push(this_marker);
}

grouped_points =  L.layerGroup(allpoints);

grouped_points.addTo(map);


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
    if (parseInt(d3.select('#mainContent').style("width")) >= 768){
      return true
    }

    return false

  }


  function filterPositionPolitique(position){

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

  }