var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;
var isChromium = !!window.chrome;

moment.locale('fr')

var margin2 = {top: 80, right: 30, bottom: 60, left: 40},
width2 = 1000 - margin2.left - margin2.right,
height2 = 450 - margin2.top - margin2.bottom,
padding = 0.3,
max_width = 1000,
width_slider = (width2 < (mainWidth -70) ? width2 : (mainWidth -70)),
width_slider_g = 960,
width2 = width2 < mainWidth ? width2 : mainWidth,
map,
app_data,
minMaxRectWidth = [12,30],
scaleWidth,
thisMinZoom = 2,
mapstate = 0,
fulldata,
daterange = {},
timer_duration = 5000,
selected_variable = 'tx_incidence',
this_date_pretty,
currentDate,
maxvalues = {},
tMax,
t0,
selected_dep = [];

var circleScale = 
d3.scaleSqrt()
.range([5, 40]);

var circleScaleEcart = 
d3.scaleSqrt()
.range([0, 29]);

var x_scale = d3.scaleTime()
.range([0, 100]);

const variables_names= {
  tx_incidence : `taux d'incidence`,
  tx_positivite : `taux de positivité`,
  hosp_pour_100k : `taux d'hospitalisation`,
  rea_pour_100k : `taux de réanimation`
}

let article_height = $(window).width()/2 > 220 ? ($(window).width()/2 + 50) : 240;
d3.select('#information')
.style('min-height', article_height + 'px')

var parseTime2 = d3.timeParse("%Y-%m-%d");
var tooltip_initial_content = '';
const svg = d3.select(".carte svg#geo_map");
const allPaths = svg.selectAll('path');
svg.style('max-height', $(window).height()*0.9 + 'px')

window.addEventListener("resize", function(d){
svg.style('max-height', $(window).height()*0.9 + 'px')

resize_slider()
});

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

function showTip(d){

let this_code = d.id;

console.log(this_code)

let this_d = _.find(app_data, d => d.iso_code == this_code);


    this_html =  `<ul id='tooltip_content'><span style="font-weight:bold; font-family: 'libesansweb-semicondensed';     letter-spacing: 0.04em;">${this_d.Pays} </span></ul></span>
    <span class='details'>
    <li>Taux d'incidence : <span style="font-weight:bold">${String(_.round(this_d.tx_incidence, 1)).replace('.',',')}</li>
        <li><em>Evolution depuis septembre</em></li>
        <li id="sparkline"></li>
        <li>Taux de positivité : <span style="font-weight:bold">${String(_.round(this_d.tx_positivite, 1)).replace('.',',')}%</li>`

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


d3.select('#minigraph_container')
.style('display', 'flex')

d3.select('#sparkline').select('*').remove()

makeSparkline(fulldata.filter(d => d.dep == this_code).map(d => d.tx_incidence))

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

var colorIncidence = function (x){

if(x <=50){return '#ddd'}
else { return '#ff0000' }

}

var colorPositivity = function (x){
  
if(x <=5){ return '#42B38E'}
else if(x <=10){ return '#FF9800'}
else if(x <=15){ return '#E3234A'}
else if(x <=20){ return '#6d142d'}
else { return '#000'}

}

var color_functions = {
'tx_incidence': colorIncidence,
 'tx_positivite': colorPositivity,
 'hosp_pour_100k': color_hospi,
 'rea_pour_100k': color_rea
}

d3.select('#positivity')
.on('click', function(){

d3.selectAll('#button_box a')
.style('color', 'red')
.style('background-color', '#fff')
.classed('selected', false)

d3.selectAll('#positivity')
.style('color', '#fff')
.style('background-color', 'red')
.classed('selected', true)

d3.selectAll('.explanation_text')
.style('display', 'none')

d3.select('#positivity_text')
.style('display', 'inline-block')


selected_variable = 'tx_positivite';
tMax = parseTime2(_.last(daterange[selected_variable]))
x_scale
.domain([t0, tMax])
if (daterange[selected_variable].indexOf(currentDate) == -1){
 currentDate = _.last(daterange[selected_variable])
}

fillColorDate(selected_variable, currentDate)
d3.select('svg#map_slider g.date-container text.endDate')
.text(moment(tMax).format('Do MMMM'))

})

d3.select('#incidence_rate')
.on('click', function(){

  fillColor('tx_incidence')

d3.selectAll('#button_box a')
.style('color', 'red')
.style('background-color', '#fff')
.classed('selected', false)

d3.selectAll('#incidence_rate')
.style('color', '#fff')
.style('background-color', 'red')
.classed('selected', true)

d3.selectAll('.explanation_text')
.style('display', 'none')

d3.select('#incidence_text')
.style('display', 'inline-block')

selected_variable = 'tx_incidence';
tMax = parseTime2(_.last(daterange[selected_variable]))
x_scale
.domain([t0, tMax])
if (daterange[selected_variable].indexOf(currentDate) == -1){
 currentDate = _.last(daterange[selected_variable])
}

fillColorDate(selected_variable, currentDate)

d3.select('svg#map_slider g.date-container text.endDate')
.text(moment(tMax).format('Do MMMM'))

})

d3.select('#hospitalisation')
.on('click', function(){
  fillColor('hosp_pour_100k')

d3.selectAll('#button_box a')
.style('color', 'red')
.style('background-color', '#fff')

d3.selectAll('#hospitalisation')
.style('color', '#fff')
.style('background-color', 'red')

d3.selectAll('.explanation_text')
.style('display', 'none')

d3.select('#hospitalisation_text')
.style('display', 'inline-block')

if (currentDate == _.last(daterange[selected_variable])){
selected_variable = 'hosp_pour_100k';
currentDate = _.last(daterange[selected_variable])
}
selected_variable = 'hosp_pour_100k';

fillColorDate(selected_variable, currentDate)


tMax = parseTime2(_.last(daterange[selected_variable]))
x_scale
.domain([t0, tMax])
d3.select('svg#map_slider g.date-container text.endDate')
.text(moment(tMax).format('Do MMMM'))

})

d3.select('#reanimation')
.on('click', function(){
  fillColor('rea_pour_100k')

d3.selectAll('#button_box a')
.style('color', 'red')
.style('background-color', '#fff')

d3.selectAll('#reanimation')
.style('color', '#fff')
.style('background-color', 'red')

d3.selectAll('.explanation_text')
.style('display', 'none')

d3.select('#reanimation_text')
.style('display', 'inline-block')


if (currentDate == _.last(daterange[selected_variable])){
selected_variable = 'rea_pour_100k';
currentDate = _.last(daterange[selected_variable])
}
selected_variable = 'rea_pour_100k';

fillColorDate(selected_variable, currentDate)

tMax = parseTime2(_.last(daterange[selected_variable]))
x_scale
.domain([t0, tMax])
d3.select('svg#map_slider g.date-container text.endDate')
.text(moment(tMax).format('Do MMMM'))

})

function fillColor(column){

  allPaths
  .style('fill', d => {

    if (typeof app_data[column].filter(function(e){return e.dep == d.id})[0] !== 'undefined') {

      return color_functions[column](+app_data[column].filter(function(e){return e.dep == d.id})[0][column])

    }
    return '#fff'
  })

}

 // fillColorDate('positivity', date)
  // fillColorDate('tx_incidence', date)

// fillColorDate('tx_incidence', '2020-08-01')

function fillColorDate(column, date){

  var this_date_data = fulldata.filter(function(e){return e.datetime == date})

  this_date_pretty = moment(date).format('Do MMMM')

  // d3.select('#tooltip')
  // .style('display', 'block')
  // .html('<span class="details"><span class="date_tooltip">' + this_date_pretty + '</span></span>')

  d3.select('.date-container .currentDate')
  .text(this_date_pretty)

  allPaths
  .transition()
  .duration(0)
  .style('fill', d => {

    if (typeof this_date_data.filter(function(e){return e.dep == d.id})[0] !== 'undefined') {

      return color_functions[column](+this_date_data.filter(function(e){return e.dep == d.id})[0][column])

    }
    return '#fff'
  })

}

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
  .defer(d3.csv, 'data/europe_covid.csv')
  // .defer(d3.csv, 'https://libedata.github.io/data/updated_data/incid_pos_from_sept_2021.csv')
  .await(ready)

  function ready(error, data) {

    data.forEach(d => {
      d.population = +d.population;
      d.morts_depuis_septembre = +d.morts_depuis_septembre;
      d.morts_par_million_depuis_septembre = +d.morts_par_million_depuis_septembre;
      d.population = +d.population;
      d.vaccination_septembre = +d.vaccination_septembre;
      d.total_deaths_per_million = +d.total_deaths_per_million;
      d.morts_vague_3 = +d.morts_vague_3;
    })

    console.log(data);

    app_data = data;

    // maxvalues['population'] = d3.max(fulldata.map(d=>d.population));
    // maxvalues['tx_incidence'] = d3.max(fulldata.map(d=>d.tx_incidence));
    // maxvalues['hosp_pour_100k'] = d3.max(fulldata.map(d=>d.hosp_pour_100k));
    // maxvalues['rea_pour_100k'] = d3.max(fulldata.map(d=>d.rea_pour_100k));

    // daterange['tx_incidence'] = _.uniq(fulldata.filter(d=>d.tx_incidence).map(d=>d.datetime));
    // daterange['tx_positivite'] = _.uniq(fulldata.filter(d=>d.tx_positivite).map(d=>d.datetime));
    // daterange['hosp_pour_100k'] = _.uniq(fulldata.filter(d=>d.hosp_pour_100k).map(d=>d.datetime));
    // daterange['rea_pour_100k'] = _.uniq(fulldata.filter(d=>d.rea_pour_100k).map(d=>d.datetime));
    // daterange = _.uniq(fulldata.map(d=>d.datetime));

    circleScale.domain(d3.extent(data, d=>d.population));

    // circleScaleEcart.domain([0,d3.max(data, d=>d.ecart2020)]);

    let allSvgNodes = allPaths.nodes();
    for (i in allSvgNodes){
      let this_id = d3.select(allSvgNodes[i]).attr('data-id')
      console.log(this_id)
      let this_pop = data.filter(d=> d.iso_code == this_id)[0].population;
      // let this_ecart = data.filter(d=> d.dep == this_id)[0].ecart2020;
      let this_radius = Math.round(circleScale(this_pop));
      // let this_radius_ecart = Math.round(circleScaleEcart(this_ecart >=0 ? this_ecart : 0));
      let this_path_d = d3.select(allSvgNodes[i]).attr('d');
      let this_centroid = getBoundingBoxCenter(d3.select(allSvgNodes[i]));
      let this_to_circle_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius);
      // let this_to_circle_ecart_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius_ecart);
      let this_from_circle_function = flubber.fromCircle(this_centroid[0], this_centroid[1], this_radius, this_path_d);

      d3.select(allSvgNodes[i]).datum({'id': this_id, 'path': this_path_d, 'centroid': this_centroid, 
        'to_circle_function': this_to_circle_function,
        // 'to_circle_ecart_function': this_to_circle_ecart_function,
        'from_circle_function': this_from_circle_function,
        'population':this_pop,
        'radius': this_radius
        // 'radius_ecart': this_radius_ecart
      });
}



////// New method for Europe with new svg

// var this_sel = d3.select(d3.selectAll('svg g#graph g').nodes()[8])

// var path_generic = this_sel.select('path').attr('d')

// let this_centroid_generic = getBoundingBoxCenter(this_sel.select('path'))

// let this_to_circle_function_generic = flubber.toCircle(path_generic,this_centroid_generic[0], this_centroid_generic[1], 50);

// let this_from_circle_function_generic = flubber.fromCircle(this_centroid_generic[0], this_centroid_generic[1], 50, path_generic);


// this_sel.select('path').transition().attrTween("d", function(d){ return this_to_circle_function_generic})

// this_sel.select('path').transition().attrTween("d", function(d){ return this_from_circle_function_generic})


// app_data['tx_incidence'] = fulldata.filter(d=>d.datetime == daterange['tx_incidence'][daterange['tx_incidence'].length-1])
// app_data['tx_positivite'] = fulldata.filter(d=>d.datetime == daterange['tx_positivite'][daterange['tx_positivite'].length-1])
// app_data['hosp_pour_100k'] = fulldata.filter(d=>d.datetime == daterange['hosp_pour_100k'][daterange['hosp_pour_100k'].length-1])
// app_data['rea_pour_100k'] = fulldata.filter(d=>d.datetime == daterange['rea_pour_100k'][daterange['rea_pour_100k'].length-1])


  allPaths
  .style('fill', d => {

    if (typeof data.filter(function(e){return e.dep == d.id})[0] !== 'undefined') {

      return colorIncidence(+app_data['tx_incidence'].filter(function(e){return e.dep == d.id})[0].tx_incidence)

    }
    return '#fff'
  })
  .style('fill-opacity', 1)
  .style('stroke', '#333')
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

    //   showTip(d)
    // allPaths
    // .style('stroke-opacity', .5)
    // .style('fill-opacity', .5)
    // d3.select(this)
    // .style('fill-opacity', 1)
    // .style('stroke-opacity', 1)
    // .style('stroke-width', 2)

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


// setTimeout(() => {

//   transform_all_paths_to_circle()
// mapstate = 1;


// },
//    500);

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

let article_height = $(window).width()/2 > 220 ? ($(window).width()/2 + 50) : 240;;
d3.select('#information')
.style('min-height', article_height + 'px')

}

function getBoundingBoxCenter (selection) {
  var element = selection.node();
  var bbox = element.getBBox();
  return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}


function equalToEventTarget() {
    return this == d3.event.target;
}


function makeSparkline(this_data){

const el_width = parseInt(d3.select('#map_info2').style('width'));

const WIDTH        = el_width;
const HEIGHT       = 30;
const MARGIN       = { top: 5, right: 5, bottom: 5, left: 5 };
const INNER_WIDTH  = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
const DATA_COUNT   = this_data.length;
const DATA_Max = d3.max(this_data)
const data_spark = this_data;
const x_spark    = d3.scaleLinear().domain([0, DATA_COUNT]).range([0, INNER_WIDTH]);
const y_spark    = d3.scaleLinear().domain([0, DATA_Max]).range([INNER_HEIGHT, 0]);

const svg_spark = d3.select('#sparkline').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g')
    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

const line_spark = d3.line()
  .x((d, i) => x_spark(i))
  .y(d => y_spark(d));

svg_spark.append('path').datum(data_spark)
  .attr('fill', 'none')
  .attr('stroke', '#bbb')
  .attr('stroke-width', 1)
  .attr('d', line_spark);


  }