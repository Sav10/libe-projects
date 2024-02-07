
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
    votes_data,
    data_stations_ok;

var circleScalePop = 
d3.scaleSqrt()
.range([1, 8])
.domain([0, 250000]);




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
      baseMapHeight = 500;
      this_zoom_level = 6;

    }

    d3.queue()
    .defer(d3.csv, 'data/data_stations2.csv')
    .await(load_Data);

    function load_Data(error, data_stations){



      data_stations.forEach(function(d, i){
        d.latLong = d.latLong ? d.latLong : d.latLong_auto;
        d.latitude = +(d.latLong.split(',')[0]);
        d.longitude = +(d.latLong.split(',')[1]);
        d.latLong = [+d.latitude, +d.longitude];
        d.clean_name = removespecials(d.Station);
        d.id = i;
      })

      console.log(data_stations)



    geoloc_data = data_stations

    data_stations_ok = data_stations;


      geoloc_data = geoloc_data.filter(d=> d.latLong[0] && d.latLong[1]);

      cities_data = geoloc_data;

      searchIndex = new FlexSearch({

        encode: "icase",
        tokenize: "full",
        threshold: 3,
        async: true,
        worker: 4
      });


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


      d3.select('#all_results').style('display', 'block')

      var this_selection = d3.select('#all_results').selectAll('li.entry')
      .data(data_);

      this_selection.exit().remove();

      this_selection
      .select('li a')
      .html(function(d){return d['clean_name'] + ' (' + d.Departement + ')'})

      this_selection
      .enter()
      .append('li')
      .attr('class', 'entry')
      .append('a')
      .html(function(d){return d['clean_name'] + ' (' + d.Departement + ')'})

      d3.selectAll('#all_results li.entry a')
      .on('click', function(d){

        openingPopup(d, 0)

        d3.select('#all_results').style('display', 'none')

      })

    }

    function openingPopup(o, i){


      if (o != 0){
        var d = o;
      }
      else{

      var d = data_stations_ok[i];

      }


/*      populateResults([])*/


      let html_popup;
      let html_info;


      function color_element(x){
        if (x){
        let c
        if (+x.replace(',', '.') < 4){c = 'green'}
        else if (+(x.replace(',', '.')) > 6){c = 'red'}
        else {c = 'orange'}
        return c
      }}


        function color_element_finance(x){
          if (x){
        let c
        if (+x.replace(',', '.') < 4){c = 'red'}
        else if (+x.replace(',', '.') > 6){c = 'green'}
        else {c = 'orange'}
        return c
      }
      }




        html_info = 
        `<strong style="font-weight:bold; font-family: 'libesansweb-semicondensed'; letter-spacing: 0.04em; font-size: 15px;">${d.clean_name} (${d.Departement})</strong><br>
        Region : ${d.Region}<br>
        Massif : ${d.Massif}<br>
        Indice climatique : <span style="color:${color_element(d.indice_climatique)}">${d.indice_climatique}</span><br>
        Indice socioéconomique : <span style="color:${color_element(d.indice_socioeconomique)}">${d.indice_socioeconomique}</span><br>
        Indice de Finances publiques : <span style="color:${color_element_finance(d.indice_finances_publiques)}">${d.indice_finances_publiques}</span><br>
        Score de vulnérabilité : ${d.score_vulnerabilite}<br>`
        


        if (d.vulnerable ){
        html_info += `Fait partie des ${d.vulnerable == 'non' ? '<span style="color:blue">moins vulnérables</span>' : '<span style="color:red">plus vulnérables</span>'}`;

        }


  d3.select('.info.city.box')
  .html(html_info)

map.closePopup()

d3.select('div.info.city.box').style('display', 'block')

adaptInfobox()

}


// dragging: !L.Browser.mobile, center: [50, 2], zoomControl:!L.Browser.mobile, maxZoom: thismaxZoom, minZoom: thisMinZoom, tap:!L.Browser.mobile}).setView([46.2, 2], this_zoom_level)

function configMap(data){

// console.log(data)

  map = L.map('map', {
    dragging: testMobile(), center: [50, 2], zoomControl:!L.Browser.mobile, maxZoom: thismaxZoom, minZoom: thisMinZoom, tap:testMobile()}).setView([43.2, 6], this_zoom_level)

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);


/*L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ext: 'png'
}).addTo(map);
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ext: 'png'
}).addTo(map);*/

  info_city = L.control({position: 'topleft'});

  info_city.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info city box'); // create a div with a class "info"
    return this._div;
  };

  info_city.addTo(map)

  myRenderer = L.canvas({ padding: 0.5 });

  let allpoints = [];


let filtered_data = data.filter(d=>d.vulnerable)

console.log(filtered_data)


for (i in filtered_data) { // 100k points

  d = filtered_data[i];
  
  // console.log(d)
  let this_marker = L.circleMarker([+d.latitude, +d.longitude], {
/*    renderer: myRenderer,*/
    radius: calculateZoomLevel(this_zoom_level)*4,
    color : 'black',
    weight:1,
    fillColor : d.vulnerable == 'non' ? '#95DED7' : d.vulnerable == 'oui' ? 'red' : '#ccc',
    // color : setColor(d),
    // fillColor : setColor(d),
    fillOpacity : 1
  });
  this_marker.id = d.id;
  this_marker.scalepop = 4;
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


d3.select('body').on("click",function(event, d){



    var outside = d3.selectAll('path.leaflet-interactive, #all_results a').filter(equalToEventTarget).empty();

    if (outside){


    d3.select('div.info.city.box').style('display', 'none');

    }

else{
}



});


    function equalToEventTarget() {
 return this == event.target;
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

      console.log(newHeightMap);

      d3.select('#map')
      .style('height', newHeightMap + 'px');
    }

    else{
console.log(" inférieur")

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


