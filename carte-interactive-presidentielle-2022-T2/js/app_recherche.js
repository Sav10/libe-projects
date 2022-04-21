    
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
    thisMinZoom = 4,
    myRenderer,
    grouped_points,
    info_city,
    baseMapHeight,
    baseMapWidth;

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
    .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSpuAtOBAKV4qtLEkCl2mdBfmDkU1GCdCpDfCZ-is3-KIIuwpQyJZXlH1zw-Ai5tyRhvcnL416uAhBU/pub?gid=621806634&single=true&output=csv')
    .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSpuAtOBAKV4qtLEkCl2mdBfmDkU1GCdCpDfCZ-is3-KIIuwpQyJZXlH1zw-Ai5tyRhvcnL416uAhBU/pub?gid=706150873&single=true&output=csv')
    .await(load_Data);

    function load_Data(error, data, geoloc_data){

      asbetos_data_ = geoloc_data;

      // console.log(asbetos_data_);

      geoloc_data.forEach(function(d){
        d.latLong = [+d.Latitude, +d.Longitude];
        d.collectivite = +d.collectivite;
        d.permis_date = +d.permis_date;
      })

      data.forEach(function(d){
        d.collectivite = +d.collectivite;
      })

      geoloc_data = geoloc_data.filter(d=> d.latLong[0] && d.latLong[1]);

      searchIndex = new FlexSearch({

        encode: "icase",
        tokenize: "strict",
        threshold: 1,
        async: true,
        worker: 4
      });

      mapped = _.mapValues(_.keyBy(data, 'code'))

      for (i in data){
        var d = data[i];
        searchIndex.add(d['code'], d['nom'])
      }

      d3.select('#find_school')
      .style('display', 'block');

      d3.select('#img_spinner')
      .style('display', 'none');

      find_school =  function (query){

        var list_index =  searchIndex.search(removespecials(query));

        return list_index.map(d=> mapped[d])

      }

      d3.select('#find_school')
      .on('input', function(){
       var this_val = d3.select(this).property('value');
       if (this_val.length > 3){
        var this_result = find_school(this_val)
        d3.select('#resultat_diagnostic')
        .html('')
        populateResults(this_result)
      }
      else{
        populateResults([])
      }

    })


    }

    function populateResults(data_){

      var this_selection = d3.select('#all_results').selectAll('li.entry')
      .data(data_);

      this_selection.exit().remove();

      this_selection
      .select('li a')
      .html(function(d){return d['nom']})

      this_selection
      .enter()
      .append('li')
      .attr('class', 'entry')
      .append('a')
      .html(function(d){return d['nom']})

      d3.selectAll('#all_results li.entry a')
      .on('click', function(d){

        openingPopup(d, 0)

      })

    }

    function openingPopup(d, o){

      populateResults([])

      let this_d = d;




      let this_obj = o? _.find(asbetos_data_, e => e.code == o) : _.find(asbetos_data_, e => e.code == d['code']);


      let this_code = d ? d.code : this_obj.code;
      let this_name = d ? d.nom : mapped[this_code].nom;

      let html_popup;
      let html_info;
      console.log(this_obj);

      d3.select('#nom_ville')
      .html(this_name)

      // d3.select('#Lat_Long')
      // .text('Latitude : ' + this_d.Latitude + '  Longitude : ' + this_d.Longitude);

      if (this_obj){
      d3.select('#code_ville')
      .html('L\'école <strong>est</strong> dans la base. <br><br>Code : ' + this_code)

}
else{

  let this_code = `L'école <strong>n'est pas</strong> dans la base.  Nouvelle ligne à copier : 
  <br><br><br><table id="table_tocopy">
  <thead><td>code</td><td>Latitude</td><td>Longitude</td><td>collectivite</td><td>paris</td><td>Mis_a_jour</td></thead>
  <tbody><tr>
  <td>${this_d.code}</td><td>${this_d.Latitude}</td><td>${this_d.Longitude}</td>
  <td></td><td></td>
  <td>1</td>
  </tr></tbody></table>`;

      d3.select('#code_ville')
      .html(this_code);

      //       d3.select('#code_ville')
      // .text('Pas dans la base')

  // <br><div class="table_wrapper"><div>${this_d.code}</div><div>${this_d.Latitude}</div><div>${this_d.Longitude}</div></div>
  // <pre>${this_d.code}\t${this_d.Latitude}\t${this_d.Longitude}</pre>

}


}


function find_type_collectivite(n){
  if (n == 1){return 'mairie'}
    else if (n == 2){return 'département'}
      else {return 'région'}
    }

  function adaptInfobox(){


    if (mainWidth < 800){
      d3.select('.info.city.box.leaflet-control')
      .style('width', (mainWidth) + 'px');
    }


    d3.select('.info.city.box.leaflet-control')
    .style('height', 'auto');

    let height_infobox = d3.select('.info.city.box.leaflet-control').node().getBoundingClientRect().height;

    if (height_infobox >= 200){

      d3.select('.info.city.box.leaflet-control').style('height', (height_infobox + 5) + 'px')
      let newHeightMap = (height_infobox + baseMapHeight*0.8) >= baseMapHeight ? (height_infobox + baseMapHeight*0.8) : baseMapHeight;

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
    text = "Y a-t-il de l’amiante dans votre école ? Vérifiez avec notre application interactive https://www.liberation.fr/apps/2020/02/amiante-ecoles/ via @libe ",
    link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
    window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');

  }

  function testMobile (){
    if (parseInt(d3.select('#mainContent').style("width")) >= 768){
      return true
    }

    return false

  }