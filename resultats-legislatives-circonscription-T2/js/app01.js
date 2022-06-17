var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;
var isChromium = !!window.chrome;
var datapol;

moment.locale('fr')


const colors_candidats = {
"HAMON":'#e6476b',
"FILLON":'#35559e',
"MACRON":'#f3af28',
"DUPONT-AIGNAN":'#25335c',
"LE PEN":'#14152d',
'POUTOU': "#761519",
'ARTHAUD': "#761519",
'MÉLENCHON': "#cc1422",
'LASSALLE': "#cfb096",
'ASSELINEAU': "#cfb096",
'CHEMINADE': "#cfb096"}


const candidate_names = [
'MACRON',
'LE PEN',
'FILLON',
'MÉLENCHON',
'HAMON',
'DUPONT-AIGNAN',
'POUTOU',
'LASSALLE',
'ARTHAUD',
'ASSELINEAU',
'CHEMINADE'];

const selected_candidates = [
'FILLON',
'HAMON',
'LE PEN',
'MACRON',
'MÉLENCHON'];


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


var data_legend = [0,10,20,30, 40,50, 60, 70];


// <g class="cell" transform="translate(46,0)"><rect class="swatch" height="15" width="44" style="fill: rgb(246, 185, 197);"></rect><text class="label" transform="translate(22,
//           30)" style="text-anchor: middle;">10</text></g>

var legend = d3.select('#legend .mapLegend .legendCells').selectAll('.cell')
.data(data_legend)

legend.exit().remove()


var legend_cells = legend
.enter()
.append('g')
.attr('class', 'cell')
.attr('transform', function(d, i){ return 'translate(' + i*42 + ',0)'})

legend_cells
.append('rect')
.attr('class', 'swatch')
.attr('height', 15)
.attr('width', 44)
.style('fill', function(d){ return color_progressive_scale(d)})


legend_cells
.append('text')
.attr('class', 'label')
.attr('height', 15)
.attr('width', 44)
.style('text-anchor', 'middle')
.text(function(d){return d})
.attr('transform', 'translate(22,30)')



function draw_legendots(){


d3.selectAll('div#legendots .legende_dot').remove();


const legendots = d3.select('div#legendots').selectAll('span.legende_dot')
.data(d3.entries(colors_candidats).filter(d=> selected_candidates.includes(d.key)))


legendots
.enter()
.append('span')
.attr('class', 'legende_dot')
.text(d=>_.capitalize(d.key))
.append('span')
.attr('class', 'dot')
.style('background-color', d=>d.value)


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
.text(d=> d)
.on('click', function(d){
  console.log(d)
fillOnClick(d)
})

}

draw_affichage()


function showTip(d){

let this_code = d.id;

/*let this_d = _.find(app_data.tx_incidence, d => d.dep == this_code);*/

let this_d = _.find(datapol, d => d['CodeDépartement'] == this_code);


let this_dep_scores = candidate_names.map(function(e){ return {'name': e, 'score': this_d[e+'.exp']} })

this_dep_scores = this_dep_scores.sort(function(a,b) {  return b.score - a.score})

this_dep_scores = _.slice(this_dep_scores, 0, 4)

console.log(this_d)


    this_html =  `<span style="font-weight:bold; font-family: 'libesansweb-semicondensed';     letter-spacing: 0.04em;">${this_d['Département']} (${this_d['CodeDépartement']})</span>
    <span class='details'>
    ${drawGraph(this_dep_scores)}</span>`



this_html += `Nombre de votes exprimés : ${this_d['Exprimés']}<br>
Taux de participation : ${String(_.round(100*this_d['Exprimés'] / +this_d['Inscrits'], 1)).replace('.', ',')}%`
// d3.select('#map_info')
// .style('display', 'flex')
        // 

d3.select('#tooltip')
.style('display', 'flex')

d3.select('#map_info2')
.style('visibility', 'visible')

d3.select('#tooltip')
.html(this_html)
.style('opacity', '1')
.style('display', 'block')




/*d3.select('#minigraph_container')
.style('display', 'flex')

d3.select('#sparkline').select('*').remove()*/

/*makeSparkline(fulldata.filter(d => d.dep == this_code).map(d => d.tx_incidence))
*/
// makeAreachart(fulldata.filter(d=>d.dep == this_code), 'datetime', selected_variable, 'rgb(227, 35, 74)', maxvalues,
//  variables_names[selected_variable], _.last(daterange[selected_variable]), 2)

}

const parentWidth = d3
.select('body')
.node()
.getBoundingClientRect().width

const margin = { top: 0, right: 0, bottom: 0, left: 0 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

var color_hospi = d3.scaleLinear()
  .range(["white", '#E3234A', "#6d142d", '#000']);
color_hospi.domain([0, 30, 75, 150]);




var color_rea = d3.scaleLinear()
  .range(["white", '#E3234A', "#6d142d", '#000']);
color_rea.domain([0, 5, 10, 15]);

const hosp_label_scale = [0, 10, 30, 80, 150];

for (i in hosp_label_scale){
let temp_d = hosp_label_scale[i]
d3.select("#" + "dot_hosp_" +String(temp_d))
.style('background-color', color_hospi(temp_d))
}

const rea_label_scale = [0, 5, 8, 12, 15];

for (i in rea_label_scale){
let temp_d = rea_label_scale[i]
d3.select("#" + "dot_rea_" +String(temp_d))
.style('background-color', color_rea(temp_d))
}


function fillColor(column){

  allPaths
  .style('fill', d => {


    if (typeof datapol.filter(function(e){return e['CodeDépartement'] == d.id})[0] !== 'undefined') {

      return colors_candidats[datapol.filter(function(e){return e['CodeDépartement']  == d.id})[0].dep_winner]




    }

    return '#fff'


  })

}

 // fillColorDate('positivity', date)
  // fillColorDate('tx_incidence', date)

// fillColorDate('tx_incidence', '2020-08-01')


function FillWithTimer(total_time, column) {

  d3.select('#tooltip')
  .style('display', 'block')
  .html('<span class="details"><span class="date_tooltip">' + this_date_pretty + '</span></span>')

reset_tooltip()

// d3.select('#tooltip .details')
//   .html('')

var count = 0
var number = daterange[column].length
t = d3.interval(function(elapsed) {

fillColorDate(column, daterange[column][count])
  count +=1
  if (elapsed > total_time){

    t.stop();

setTimeout(function(){
d3.select('#tooltip')
.html(tooltip_initial_content)
reset_tooltip()
}, 500);

  }
}, total_time/number); 

}

function reset_tooltip(){

d3.select('#evolution_indicateur')
.on('click', function(){

var selected_id = d3.select('#button_box a.selected').attr('id')

if (selected_id == 'incidence_rate'){

FillWithTimer(timer_duration, 'tx_incidence')
}
else{
  FillWithTimer(timer_duration, 'tx_positivite')
}

});

// d3.select('#slider_container')
// .style('display', 'flex')

// d3.select('#map_info')
// .style('display', 'none')

d3.select('#minigraph_container')
.style('display', 'none')

d3.select('#tooltip')
.style('display', 'none')

d3.select('#map_info2')
.style('visibility', 'hidden')


d3.select('#sparkline').select('*').remove()

}

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

function force_separate_circles_ecart(){

  var features = allPaths.data();

  simulation = d3.forceSimulation(features)
  .force("y", d3.forceY(function(d) { return d.centroid[1] }).strength(5))
  .force("x", d3.forceX(function(d) { return d.centroid[0] }).strength(5))
  .force("collide", d3.forceCollide(7).radius(d=> d.radius_ecart))
  .stop();

  for (var i = 0; i < 200; ++i) simulation.tick();

    allPaths
  .transition().attr('transform', function(d) { return 'translate(' +Math.round(d.x -d.centroid[0])+ ',' +Math.round(d.y - d.centroid[1]) + ')'});

}

function registered_separate_circles(){

  allPaths
  .transition().attr('transform', function(d) { return 'translate(' +position_departements[d.id][0]+ ',' +position_departements[d.id][1] + ')'});

}

function registered_separate_circles_ecarts(){

  allPaths
  .transition().attr('transform', function(d) { return 'translate(' +position_departements_ecart[d.id][0]+ ',' +position_departements_ecart[d.id][1] + ')'});

}

function redraw_paths(){

d3.select('#display_geo_paths')
.style('color', '#fff')
.style('background-color', 'red')

d3.select('#display_proportional_circles')
.style('color', 'red')
.style('background-color', '#fff')

  let pathsize = allPaths.size();
  let pathsCount = 0;
  let departements_corrections = ['17', '56', '91', '92', '93', '94', '95', '75', '971', '51', '10', '03', '23', '34', '81'];

  allPaths
  .transition()
  .duration(500)
  .attrTween("d", function(d){ return d.from_circle_function})
  .on('end', function(){
    pathsCount++;
    if (pathsCount >= pathsize){
      allPaths.filter(function(d){return departements_corrections.includes(d.id) }).attr("d", function(d){ return d.path})

      allPaths
      .transition()
      .attr('transform', 'translate(0,0)')
    }
  })
  ;

}

function transform_all_paths_to_circle(){

d3.select('#display_proportional_circles')
.style('color', '#fff')
.style('background-color', 'red')

d3.select('#display_geo_paths')
.style('color', 'red')
.style('background-color', '#fff')

  let pathsize = allPaths.size();
  let pathsCount = 0;

allPaths.transition().attrTween("d", function(d){ return d.to_circle_function})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    registered_separate_circles()
  }
})

}

function transform_all_paths_to_circle_ecarts(){

  let pathsize = allPaths.size();
  let pathsCount = 0;

if (mapstate == 0){
allPaths.transition().attrTween("d", function(d){ return d.to_circle_ecart_function})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    registered_separate_circles_ecarts()
  }
})
}
else{

allPaths.transition().attrTween("d", function(d){ return flubber.toCircle(d3.select(this).attr('d'), d.centroid[0], d.centroid[1],
 d.radius_ecart)})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    registered_separate_circles_ecarts()
  }
})

}

// force_separate_circles()

}

d3.select('#display_proportional_circles')
.on('click', function(){

  transform_all_paths_to_circle()

  mapstate = 1;

})

d3.select('#display_proportional_circles_ecart')
.on('click', function(){

  if (mapstate !== 2){

  transform_all_paths_to_circle_ecarts()

}

  mapstate = 2;

})

d3.select('#display_geo_paths')
.on('click', function(){

  redraw_paths()

  mapstate = 0;
  
})

queue()
  .defer(d3.csv, 'data/taux_indicateurs_couleurs_departements3.csv')
  .defer(d3.csv, 'data/presidentielle_2017_departement_T1.csv')
  .await(ready)

  function ready(error, data, data_pol) {

    data.forEach(d => {
      d.taux_de_positivite = +d.taux_de_positivite;
      d.taux_incidence = +d.taux_incidence;
      d.population = +d.population;
    })


    data_pol.forEach(d =>{

      d['ARTHAUD'] = +d['ARTHAUD'] ;
      d['ASSELINEAU'] = +d['ASSELINEAU'];
      d['CHEMINADE'] = +d['CHEMINADE'];
      d['DUPONT-AIGNAN'] = +d['DUPONT-AIGNAN']
      d['FILLON'] = +d['FILLON']
      d['HAMON'] = +d['HAMON']
      d['LASSALLE'] = +d['LASSALLE'];
      d['LE PEN'] = +d['LE PEN'];
      d['MACRON'] = +d['MACRON'];
      d['MÉLENCHON'] = +d['MÉLENCHON'];
      d['POUTOU'] = +d['POUTOU'];

      candidate_names.forEach(e =>{
        d[e + '.exp'] = _.round(+d[e + '.exp'], 1)
      })

      let this_dep_score = candidate_names.map(function(e){ return {'name': e, 'score': d[e]} })
      let this_winner = this_dep_score.sort(function(a,b) {  return b.score - a.score})[0]

      d['dep_winner'] = this_winner['name']
      d['dep_winner_score'] = this_winner['score']


    })

    datapol = data_pol;

    console.log(datapol)

    circleScale.domain(d3.extent(data, d=>d.population));

    let allSvgNodes = allPaths.nodes();
    for (i in allSvgNodes){
      let this_id = d3.select(allSvgNodes[i]).attr('data-numerodepartement')
      let this_pop = data.filter(d=> d.dep == this_id)[0].population;
      let this_radius = Math.round(circleScale(this_pop));
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



  allPaths
  .style('fill', d => {

    if (typeof datapol.filter(function(e){return e['CodeDépartement'] == d.id})[0] !== 'undefined') {

      return colors_candidats[datapol.filter(function(e){return e['CodeDépartement']  == d.id})[0].dep_winner]

    }
    return '#fff'


  })
  .style('fill-opacity', 1)
  .style('stroke', '#aaa')
  .style('stroke-width', 1)
  .style('stroke-opacity', 0.5)
  .on('mouseover', function(d) {
    showTip(d)
    allPaths
    .style('stroke-opacity', .5)
    .style('fill-opacity', .5)
    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 1)
    .style('stroke-width', 2)

  })
  .on('mouseout', function(d) {


    if (selected_dep.length > 0){

     showTip(selected_dep[1])
    allPaths
    .style('stroke-opacity', .5)
    .style('fill-opacity', .5)

    d3.select(selected_dep[0])
    .style('fill-opacity', 1)
    .style('stroke-opacity', 1)
    .style('stroke-width', 2)

    }
    else{
    reset_tooltip()

    allPaths
    .style('stroke-opacity', .8)
    .style('fill-opacity', 1)

    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 0.5)
    .style('stroke-width', 1)


    }


  })





d3.select('body').on("click",function(){
    var outside = allPaths.filter(equalToEventTarget).empty();
    if (outside) {
    reset_tooltip()
selected_dep = [];
    allPaths
    .style('stroke-opacity', .8)
    .style('fill-opacity', 1)

    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 0.5)
    .style('stroke-width', 1)
    }
else{
}
});

  allPaths
  .on('click', function(d) {

    selected_dep = [this, d];

    showTip(d)
    allPaths
    .style('stroke-opacity', .5)
    .style('fill-opacity', .5)
    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 1)
    .style('stroke-width', 2)

  })


// fillColorDate('tx_incidence', _.last(daterange['tx_incidence']))

 fillColor('evolution_incidence');

setTimeout(() => {

  transform_all_paths_to_circle()
mapstate = 1;


},
   500);

}


  function fillOnClick(name){


    console.log(name)





if (name == 'candidat en tête') {


  allPaths
  .style('fill', d => {
    if (typeof datapol.filter(function(e){return e['CodeDépartement'] == d.id})[0] !== 'undefined') {

      return colors_candidats[datapol.filter(function(e){return e['CodeDépartement']  == d.id})[0].dep_winner]
    }
    return '#fff'
  })

d3.select('#legendots')
.style('display', 'block')


d3.select('#legend')
.style('display', 'none')

}

else if (name == 'participation'){


let this_color_range = d3.scaleLinear()
  .range(['white', 'black'])
  .domain([0, 100]);

  allPaths
  .style('fill', d => {
    if (typeof datapol.filter(function(e){return e['CodeDépartement'] == d.id})[0] !== 'undefined') {
      let this_dep_participation = +datapol.filter(function(e){return e['CodeDépartement']  == d.id})[0]['Exprimés_ins']
      return this_color_range(this_dep_participation)
    }
    return '#fff'

  })

color_progressive_scale
.range(['white', 'black'])
.domain([0, 100]);
legend_cells.select('.swatch')
.style('fill', function(d){ return color_progressive_scale(d)})


d3.select('#legendots')
.style('display', 'none')


d3.select('#legend')
.style('display', 'block')


d3.select('#legend #intitule_legend')
.text('Répartition de la participation')

}

else{


let this_color = colors_candidats[name];

console.log(this_color)

let this_color_range = d3.scaleLinear()
  .range(['white', this_color])
  .domain([0, 50]);



  allPaths
  .style('fill', d => {
    if (typeof datapol.filter(function(e){return e['CodeDépartement'] == d.id})[0] !== 'undefined') {
      let this_dep_candidate_score = datapol.filter(function(e){return e['CodeDépartement']  == d.id})[0][name + '.exp']
      return this_color_range(this_dep_candidate_score)
    }
    return '#fff'


  })

color_progressive_scale
.range(['white', this_color])
.domain([0, 50]);

legend_cells.select('.swatch')
.style('fill', function(d){ return color_progressive_scale(d)})


d3.select('#legendots')
.style('display', 'none')


d3.select('#legend')
.style('display', 'block')


d3.select('#legend #intitule_legend')
.text('Répartition du vote ' + _.capitalize(name))

}


  }


function drawGraph(range){

var this_html = '<div style="margin-top:10px">';

for (i in range){
  var d = range[i]
  var html_chunk = '<div style="margin-top:5px">'
  // html_chunk += `<div >${d.tete_liste}</div>
  html_chunk += `<div style="float:right;margin-right: 4px;">  ${d.score != 100 ? d.score + ' %' : '' }</div><div >${d.name}</div>
                <div style="height:12px;background-color: #eee"><div style="height:12px;width:${d.score}%;background-color:${colors_candidats[d.name]};"></div>
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
          text = "La carte de quatre indicateurs pour suivre l'évolution de la circulation du Coronavirus, mise à jour quotidiennement https://www.liberation.fr/apps/2020/09/covid-19-la-carte-de-vigilance/ via @libe",
          link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');

        }

        function roundAndFormatPct(x){
         return Math.abs(_.round(x,1)).toString().replace(".", ",")

       }

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

 const position_departements_ecart = 
 { "971": [0, 0], "972": [0, 0], "973": [0, 0], "974": [0, 0], "976": [0, 0], "75": [5, 27], "77": [24, 28],
 "78": [-24, 28], "91": [-19, 46], "92": [-35, -13], "93": [10, -26], "94": [49, -5], "95": [-10, -48], 
 "18": [0, 0], "28": [-11, 34], "36": [0, 0], "37": [0, 0], "41": [-7, 4], "45": [1, 1], "21": [0, 0], 
 "25": [0, 0], "39": [0, 0], "58": [0, 0], "70": [0, 0], "71": [0, 0], "89": [0, 0], "90": [-8, 12], "14": [0, 0], 
 "27": [-22, 0], "50": [0, 0], "61": [0, 0], "76": [0, 0], "02": [1, 0], "59": [0, 0], "60": [12, -35], "62": [0, 0], 
 "80": [1, -18], "08": [0, 0], "10": [0, 0], "51": [12, -4], "52": [0, 0], "54": [-10, 3], "55": [0, 0], 
 "57": [2, -1], "67": [1, -1], "68": [1, -1], "88": [0, 0], "44": [0, 0], "49": [0, 0], "53": [0, 0], "72": [0, 0], 
 "85": [0, 0], "22": [0, 0], "29": [0, 0], "35": [0, 0], "56": [0, 0], "16": [0, 0], "17": [0, 0], "19": [0, 0], 
 "23": [0, 0], "24": [0, 0], "33": [0, 0], "40": [0, 0], "47": [0, 0], "64": [0, 0], "79": [0, 0], "86": [0, 0], 
 "87": [0, 0], "09": [0, 0], "11": [0, 0], "12": [0, 0], "30": [0, 0], "31": [0, 0], "32": [0, 0], "34": [0, 0], 
 "46": [0, 0], "48": [0, 0], "65": [0, 0], "66": [0, 0], "81": [0, 0], "82": [0, 0], "01": [0, 0], "03": [0, 0], 
 "07": [0, 0], "15": [0, 0], "26": [0, 0], "38": [0, 0], "42": [-5, 2], "43": [0, 0], "63": [0, 0], "69": [1, -1], 
 "73": [0, 0], "74": [0, 0], "04": [0, 0], "05": [0, 0], "06": [0, 0], "13": [0, 0], "83": [0, 0], "84": [0, 0], 
 "2A": [0, 0], "2B": [0, 0]
}

////////////////////////////// Slider  //////
//////////////////////////////////////////////////////////

var handle_factor = 2;


function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function resize_slider(){
var svg_slider = d3.select('svg#map_slider')
var total_width = getWidth()
var slider_width = total_width <= 800 ? total_width*.8 : 700;
svg_slider
.attr('width', (slider_width + 10))
handle_factor = slider_width/100;

d3.select('#information')
.style('min-height', 50 + 'px')

}

function getBoundingBoxCenter (selection) {
  var element = selection.node();
  var bbox = element.getBBox();
  return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}


function equalToEventTarget() {
    return this == d3.event.target;
}
