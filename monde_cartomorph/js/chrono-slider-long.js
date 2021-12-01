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
daterange,
timer_duration = 24000,
selected_variable = 'tx_incidence',
this_date_pretty,
currentDate,
maxvalues = {};

var circleScale = 
d3.scaleSqrt()
.range([5, 40]);

var circleScaleEcart = 
d3.scaleSqrt()
.range([0, 29]);


var period_text = [
['2020-07-01', 'Vacances d\'été'],
['2020-09-01', 'Rentrée'],
['2020-10-17', 'Vacances de la Toussaint'],
['2020-10-30', 'Deuxième confinement'],
['2020-12-15', 'Fin du confinement'],
['2020-12-19', 'Vacances de Noël'],
['2021-01-04', 'Rentrée de janvier'],
['2021-01-17', 'Couvre feu à 18 heures']
]



// moment("2020-07-03") > moment("2020-07-02")


function find_textDate(thisdate){

// var reversed_period = period_text.reverse()

// console.log(reversed_period)

var closest_date = period_text[0][0];

for (i in period_text){

if (moment(thisdate) >= moment(period_text[i][0]) & moment(period_text[i][0]) > moment(closest_date)){
  closest_date = period_text[i][0];
}

}

return period_text.filter(function(d){return d[0] == closest_date})[0][1]


}

// var tooltip_initial_content = '<div id="evolution_indicateur">Voir l\'évolution<br> depuis le 1er juillet</div>';

var tooltip_initial_content = '';

const svg = d3.select(".carte svg#geo_map");
const allPaths = svg.selectAll('path');

svg.style('max-height', $(window).height()*0.9 + 'px')

window.addEventListener("resize", function(d){

  svg.style('max-height', $(window).height()*0.9 + 'px')

  // console.log('resizing')

resize_slider()


});

if($(window).width() >= 1000){

  this_zoom_level = 6;
}

var mainColor = '#E3234A';

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

// var div = d3.select("#morphocarte").insert("div",":first-child")
// .attr("id", "tooltip")
// .html(tooltip_initial_content)
// .attr('class', 'box')
// ;


// var div = d3.select("#morphocarte #tooltip");

reset_tooltip()

function getBoundingBoxCenter (selection) {
  // get the DOM element from a D3 selection
  // you could also use "this" inside .each()
  var element = selection.node();
  // use the native SVG interface to get the bounding box
  var bbox = element.getBBox();
  // return the center of the bounding box
  return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}

/////////////////////////
//////////////////////////////////////// configuration
const geoIDVariable = 'id'
const format = d3.format(',')


function showTip(d){


    let this_code = d.id;
    let this_d = _.find(app_data, d => d.dep == this_code);
    let this_ecart = Math.round(this_d.ecart2020);
    let this_diff = this_ecart < 0 ? 'moins' : 'plus';
    let this_progression_type = this_ecart < 0 ? 'baisse' : 'augmentation';
    let this_indicator = selected_variable == 'tx_positivite' ?
     `<p><span class='list_element'>dernier taux de positivité : <span style="font-weight:bold">${String(this_d.tx_positivite).replace('.',',')}%</span></span></p>` :
     `<p><span class='list_element'> dernier taux d'incidence : <span style="font-weight:bold">${String(this_d.tx_incidence).replace('.',',')}</span></span></p>`

    this_html =  `<span class='details'><span style="font-weight:bold">${this_d.departement} (${this_d.dep})</span>
    <ul id='tooltip_content'>
    ${this_indicator}
    </ul></span>`

    // <li style="color:${colorPositivity(this_d.tx_positivite)}"><span class='list_element'>Taux de positivité : <span style="font-weight:bold">${String(this_d.tx_positivite).replace('.',',')}%</span></span></li>
    // <li style="color:${colorIncidence(this_d.tx_incidence)}"><span class='list_element'> Taux d'incidence : <span style="font-weight:bold">${String(this_d.tx_incidence).replace('.',',')}</span></span></li>

d3.select('#tooltip')
.html(this_html)
.style('opacity', '1')
.style('display', 'block')


if (($(window).width() <= 768) && (isChromium == true ) ){


d3.selectAll('#tooltip_content li span.list_element')
.style('margin-left', '-33px')


}


d3.select('#slider_container')
.style('display', 'none')

d3.select('#minigraph_container')
.style('display', 'flex')

makeAreachart(fulldata.filter(d=>d.dep == this_code), 'datetime', selected_variable, 'rgb(227, 35, 74)', maxvalues)


}

// d3.select('body').style('overflow', 'hidden')

const parentWidth = d3
.select('body')
.node()
.getBoundingClientRect().width

const margin = { top: 0, right: 0, bottom: 0, left: 0 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const color = d3
.scaleQuantile()
.range([
  'rgb(247,251,255)',
  'rgb(222,235,247)',
  'rgb(198,219,239)',
  'rgb(158,202,225)',
  'rgb(107,174,214)',
  'rgb(66,146,198)',
  'rgb(33,113,181)',
  'rgb(8,81,156)',
  'rgb(8,48,107)',
  'rgb(3,19,43)'
  ])

const color2 = d3
.scaleQuantile()
.range([
  '#FFFFFF',
  '#F9D3DB',
  '#F4A7B7',
  '#E3234A',
  '#A70021'
  ])

var colorIncidence = function (x){

if(x <=10){
  return ' #42B38E'
}

else if(x <=50){
  return '#FF9800'
}
else if(x <150){

return '#E3234A'

}

else if(x <300){

return '#6d142d'

}

// else if(x <200){

// return '#a3173f'

// }

else {
  return '#000'
}

}

var colorPositivity = function (x){
  
if(x <=5){
  return '#42B38E'
}

else if(x <=10){
  return '#FF9800'
}


else if(x <=15){
  return '#E3234A'
}

else if(x <=20){
  return '#6d142d'
}

else {
  return '#000'
}

}

var colorR = function (x){
  
if(x <=1){
  return '#42B38E'
}

else if(x <=1.5){
  return '#FF9800'
}
else if(x > 1.5){
  return '#E3234A'
}
else {
  return '#ccc'
}

}

var colorOccupation = function (x){
  
if(x <=40){
  return ' #42B38E'
}

else if(x <=60){
  return '#FF9800'
}
else {
  return '#E3234A'
}

}

var colorSynthese = function (x){
  
if(x == 'v'){
  return 'green'
}

else if(x == 'o'){
  return 'orange'
}
else if(x == 'r'){
  return 'red'
}

}


var color_functions = {
'taux_de_positivite':colorPositivity,
'taux_incidence':colorIncidence,
'tauxReproductionEffectif':colorR,
'tauxOccupationRea':colorOccupation,
'synthese':colorSynthese,
'tx_incidence': colorIncidence,
 'tx_positivite': colorPositivity
}




d3.select('#positivity')
.on('click', function(){


d3.selectAll('#button_box a')
.style('color', '#e91845')
.style('background-color', '#fff')
.classed('selected', false)


d3.selectAll('#positivity')
.style('color', '#fff')
.style('background-color', '#e91845')
.classed('selected', true)

// d3.selectAll('.explanation_text')
// .style('display', 'none')

d3.select('#positivity_text')
.style('display', 'inline-block')

// fillColor('tx_positivite')

fillColorDate('tx_positivite', currentDate)

selected_variable = 'tx_positivite';

})


d3.select('#incidence_rate')
.on('click', function(){

  fillColor('tx_incidence')

d3.selectAll('#button_box a')
.style('color', '#e91845')
.style('background-color', '#fff')
.classed('selected', false)

d3.selectAll('#incidence_rate')
.style('color', '#fff')
.style('background-color', '#e91845')
.classed('selected', true)

// d3.selectAll('.explanation_text')
// .style('display', 'none')

d3.select('#incidence_text')
.style('display', 'inline-block')

selected_variable = 'tx_incidence';


fillColorDate('tx_incidence', currentDate)

})

d3.select('#R_rate')
.on('click', function(){
  fillColor('tauxReproductionEffectif')

d3.selectAll('#button_box a')
.style('color', '#e91845')
.style('background-color', '#fff')

d3.selectAll('#R_rate')
.style('color', '#fff')
.style('background-color', '#e91845')

// d3.selectAll('.explanation_text')
// .style('display', 'none')

d3.select('#R_text')
.style('display', 'inline-block')

})

d3.select('#reanimation_rate')
.on('click', function(){
  fillColor('tauxOccupationRea')

d3.selectAll('#button_box a')
.style('color', '#e91845')
.style('background-color', '#fff')

d3.selectAll('#reanimation_rate')
.style('color', '#fff')
.style('background-color', '#e91845')

// d3.selectAll('.explanation_text')
// .style('display', 'none')

d3.select('#reanimation_text')
.style('display', 'inline-block')

})






function fillColor(column){

  allPaths
  .style('fill', d => {

    if (typeof app_data.filter(function(e){return e.dep == d.id})[0] !== 'undefined') {

      return color_functions[column](+app_data.filter(function(e){return e.dep == d.id})[0][column])

    }
    return '#fff'
  })

}


 // fillColorDate('positivity', date)
  // fillColorDate('tx_incidence', date)


// fillColorDate('tx_incidence', '2020-08-01')

function fillColorDate(column, date){

//  console.log(date)

d3.select('#period_text').text(find_textDate(date))

  var this_date_data = fulldata.filter(function(e){return e.datetime == date})

  this_date_pretty = moment(date).format('Do MMMM')

  d3.select('#tooltip')
  .style('display', 'block')
  .html('<span class="details"><span class="date_tooltip">' + this_date_pretty + '</span></span>')

  allPaths
  .transition()
  .duration(0)
  .style('fill', d => {

    if (typeof this_date_data.filter(function(e){return e.dep == d.id})[0] !== 'undefined') {

      // console.log(d.id)


      // console.log(fulldata.filter(function(e){return e.dep == d.id && e.datetime == date}))



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
var number = daterange.length
t = d3.interval(function(elapsed) {
  // console.log(daterange[count]);
  // console.log(count);
fillColorDate(column, daterange[count])
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

d3.select('#slider_container')
.style('display', 'flex')

d3.select('#minigraph_container')
.style('display', 'none')

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
.style('background-color', '#e91845')

d3.select('#display_proportional_circles')
.style('color', '#e91845')
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
.style('background-color', '#e91845')

d3.select('#display_geo_paths')
.style('color', '#e91845')
.style('background-color', '#fff')

  let pathsize = allPaths.size();
  let pathsCount = 0;
// console.log(allpaths)
// if (mapstate == 0){
allPaths.transition().attrTween("d", function(d){ return d.to_circle_function})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    registered_separate_circles()
  }
})

// }
// else{
//   registered_separate_circles()
// }

// force_separate_circles()

}

function transform_all_paths_to_circle_ecarts(){

  let pathsize = allPaths.size();
  let pathsCount = 0;
// console.log(allpaths)

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

color2.domain([0, 1, 2, 4, 5]);

// svg.call(tip)

// d3.select(".carte svg")
// .call(tip)

queue()
  .defer(d3.csv, 'data/taux_indicateurs_couleurs_departements3.csv')
  .defer(d3.csv, 'data/indic7d_from_august.csv')
  .await(ready)

  function ready(error, data, data7j) {

    data.forEach(d => {
      // d.P = +d.P;
      // d.T = +d.T;
      d.taux_de_positivite = +d.taux_de_positivite;
      d.taux_incidence = +d.taux_incidence;
      // d.tauxReproductionEffectif = +d.tauxReproductionEffectif == 0 ? NaN : +d.tauxReproductionEffectif;
      // d.tauxOccupationRea = +d.tauxOccupationRea;
      // d.progression_morts = +d.progression_morts;
      // d.Densite = +d.Densite;
      d.population = +d.population;
    })

    data7j.forEach(d =>{

      d.date = parseTime(d.datetime);
      d.tx_positivite = +d.tx_positivite
      d.tx_incidence = +d.tx_incidence

    })

    fulldata = data7j;

    // console.log(fulldata)
    maxvalues['tx_positivite'] = d3.max(fulldata.map(d=>d.tx_positivite));
    maxvalues['tx_incidence'] = d3.max(fulldata.map(d=>d.tx_incidence));

    daterange = _.uniq(fulldata.map(d=>d.datetime));

    circleScale.domain(d3.extent(data, d=>d.population));

    circleScaleEcart.domain([0,d3.max(data, d=>d.ecart2020)]);

    let allSvgNodes = allPaths.nodes();
    for (i in allSvgNodes){
      let this_id = d3.select(allSvgNodes[i]).attr('data-numerodepartement')
      let this_pop = data.filter(d=> d.dep == this_id)[0].population;
      let this_ecart = data.filter(d=> d.dep == this_id)[0].ecart2020;
      let this_radius = Math.round(circleScale(this_pop));
      let this_radius_ecart = Math.round(circleScaleEcart(this_ecart >=0 ? this_ecart : 0));
      let this_path_d = d3.select(allSvgNodes[i]).attr('d');
      let this_centroid = getBoundingBoxCenter(d3.select(allSvgNodes[i]));
      let this_to_circle_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius);
      let this_to_circle_ecart_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius_ecart);
      let this_from_circle_function = flubber.fromCircle(this_centroid[0], this_centroid[1], this_radius, this_path_d);

      d3.select(allSvgNodes[i]).datum({'id': this_id, 'path': this_path_d, 'centroid': this_centroid, 
        'to_circle_function': this_to_circle_function,
        'to_circle_ecart_function': this_to_circle_ecart_function,
        'from_circle_function': this_from_circle_function,
        'population':this_pop,
        'radius': this_radius,
        'radius_ecart': this_radius_ecart});
// console.log(d3.select(allSvgNodes[i]).attr('data-numerodepartement'))
}


app_data = fulldata.filter(d=>d.datetime == daterange[daterange.length-1])

// app_data = fulldata.filter(d=>d.datetime == daterange[0])


app_data.forEach(function(d){

d.departement = data.filter(e=>e.dep == d.dep)[0].departement

})



// console.log(data)

// var progressionMax = d3.max(data, function(d) { return d.progression_morts; })

  // set the domain of the color scale based on our data
  // color.domain([0, 13068161, 38463689, 70916439, 126804433, 201103330, 310232863, 1173108018, 1330141295]);

  // var myColor = d3.scaleLinear().domain([0,100])
  // .range(["white", "#E3234A"])

  allPaths
  .style('fill', d => {

    if (typeof app_data.filter(function(e){return e.dep == d.id})[0] !== 'undefined') {

      return colorIncidence(+app_data.filter(function(e){return e.dep == d.id})[0].tx_incidence)

    }
    return '#fff'
  })
  .style('fill-opacity', 1)
  .style('stroke', 'lightgray')
  .style('stroke-width', 1)
  .style('stroke-opacity', 0.5)
  .on('mouseover', function(d) {
    showTip(d)
    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 1)
    .style('stroke-width', 2)

    init_tooltip_position()

  })
  .on('mouseout', function(d) {
    
  d3.select('#tooltip')
  .style('display', 'block')
  .html('<span class="details"><span class="date_tooltip">' + this_date_pretty + '</span></span>')

    reset_tooltip()

    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 0.5)
    .style('stroke-width', 1)
  })


setTimeout(() => {

  transform_all_paths_to_circle()
mapstate = 1;

startSlider(daterange)



},
   500);





}


function startSlider(daterange){


setTimeout(() => {


d3.select('a#play_button')
.style('display', 'block')

makeSlider()


}

 , 1000

)



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

          // if (actualContainerWidth < 1000){

              // d3.select('#slider_container').style('width', actualContainerWidth + 'px')
            //   d3.select('svg#map_slider').attr('width', (actualContainerWidth - 40))
            //   d3.select('svg#map_slider').style('width', (actualContainerWidth - 40) + 'px')

            // }

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


function init_tooltip_position(){


//   var map_left_position = parseInt(d3.select('#morphocarte').node().getBoundingClientRect().left)+1
//   var map_top_position = parseInt(d3.select('#representation_carto').node().getBoundingClientRect().bottom)+1

// d3.select('.d3-tip')
// .style('left', map_left_position + 'px')
// .style('top', map_top_position + 'px')
// .style('opacity', 1)

}




       const position_departements  = {
        "971" : [0, 0],
        "972" : [0, 0],
        "973" : [0, 0],
        "974" : [0, 0],
        "976" : [0, 0],
        "75" : [-1, 9],
        "77" : [17, 42],
        "78" : [-37, 35],
        "91" : [-7, 50],
        "92" : [-60, -15],
        "93" : [32, -43],
        "94" : [60, 0],
        "95" : [-14, -35],
        "18" : [-4, 3],
        "28" : [-12, 57],
        "36" : [0, 1],
        "37" : [-6, 5],
        "41" : [3, 31],
        "45" : [27, 42],
        "21" : [0, 0],
        "25" : [0, 0],
        "39" : [0, 0],
        "58" : [3, 1],
        "70" : [0, 0],
        "71" : [-1, -7],
        "89" : [19, 26],
        "90" : [-7, 9],
        "14" : [-4, -3],
        "27" : [-45, 29],
        "50" : [-2, 0],
        "61" : [-16, 24],
        "76" : [-17, -23],
        "02" : [31, -1],
        "59" : [24, -10],
        "60" : [0, -50],
        "62" : [-12, -32],
        "80" : [-34, -26],
        "08" : [5, -6],
        "10" : [9, 10],
        "51" : [30, -8],
        "52" : [0, 0],
        "54" : [-10, 11],
        "55" : [0, 17],
        "57" : [5, -12],
        "67" : [4, 2],
        "68" : [0, 2],
        "88" : [0, 0],
        "44" : [-2, 0],
        "49" : [-1, 4],
        "53" : [-8, 6],
        "72" : [-6, 14],
        "85" : [1, 3],
        "22" : [0, 0],
        "29" : [0, 0],
        "35" : [-1, -2],
        "56" : [0, 0],
        "16" : [0, 0],
        "17" : [0, 0],
        "19" : [0, 0],
        "23" : [0, 0],
        "24" : [0, 0],
        "33" : [0, 0],
        "40" : [0, 0],
        "47" : [0, 0],
        "64" : [0, 0],
        "79" : [0, 0],
        "86" : [0, 1],
        "87" : [0, 0],
        "09" : [4, 8],
        "11" : [0, -3],
        "12" : [0, 0],
        "30" : [1, -6],
        "31" : [0, -1],
        "32" : [0, 0],
        "34" : [-2, 2],
        "46" : [0, 0],
        "48" : [0, 0],
        "65" : [0, 0],
        "66" : [0, 2],
        "81" : [0, 0],
        "82" : [0, 0],
        "01" : [14, -13],
        "03" : [0, 0],
        "07" : [0, 0],
        "15" : [0, 0],
        "26" : [-7, 3],
        "38" : [3, 1],
        "42" : [-20, 23],
        "43" : [0, 10],
        "63" : [-4, -4],
        "69" : [-1, -6],
        "73" : [7, 2],
        "74" : [9, 0],
        "04" : [0, 0],
        "05" : [0, 0],
        "06" : [1, 0],
        "13" : [-2, 6],
        "83" : [1, 1],
        "84" : [10, -16],
        "2A" : [0, 0],
        "2B" : [0, 0]
      };



 const position_departements_ecart = {
  "971": [0, 0],
  "972": [0, 0],
  "973": [0, 0],
  "974": [0, 0],
  "976": [0, 0],
  "75": [5, 27],
  "77": [24, 28],
  "78": [-24, 28],
  "91": [-19, 46],
  "92": [-35, -13],
  "93": [10, -26],
  "94": [49, -5],
  "95": [-10, -48],
  "18": [0, 0],
  "28": [-11, 34],
  "36": [0, 0],
  "37": [0, 0],
  "41": [-7, 4],
  "45": [1, 1],
  "21": [0, 0],
  "25": [0, 0],
  "39": [0, 0],
  "58": [0, 0],
  "70": [0, 0],
  "71": [0, 0],
  "89": [0, 0],
  "90": [-8, 12],
  "14": [0, 0],
  "27": [-22, 0],
  "50": [0, 0],
  "61": [0, 0],
  "76": [0, 0],
  "02": [1, 0],
  "59": [0, 0],
  "60": [12, -35],
  "62": [0, 0],
  "80": [1, -18],
  "08": [0, 0],
  "10": [0, 0],
  "51": [12, -4],
  "52": [0, 0],
  "54": [-10, 3],
  "55": [0, 0],
  "57": [2, -1],
  "67": [1, -1],
  "68": [1, -1],
  "88": [0, 0],
  "44": [0, 0],
  "49": [0, 0],
  "53": [0, 0],
  "72": [0, 0],
  "85": [0, 0],
  "22": [0, 0],
  "29": [0, 0],
  "35": [0, 0],
  "56": [0, 0],
  "16": [0, 0],
  "17": [0, 0],
  "19": [0, 0],
  "23": [0, 0],
  "24": [0, 0],
  "33": [0, 0],
  "40": [0, 0],
  "47": [0, 0],
  "64": [0, 0],
  "79": [0, 0],
  "86": [0, 0],
  "87": [0, 0],
  "09": [0, 0],
  "11": [0, 0],
  "12": [0, 0],
  "30": [0, 0],
  "31": [0, 0],
  "32": [0, 0],
  "34": [0, 0],
  "46": [0, 0],
  "48": [0, 0],
  "65": [0, 0],
  "66": [0, 0],
  "81": [0, 0],
  "82": [0, 0],
  "01": [0, 0],
  "03": [0, 0],
  "07": [0, 0],
  "15": [0, 0],
  "26": [0, 0],
  "38": [0, 0],
  "42": [-5, 2],
  "43": [0, 0],
  "63": [0, 0],
  "69": [1, -1],
  "73": [0, 0],
  "74": [0, 0],
  "04": [0, 0],
  "05": [0, 0],
  "06": [0, 0],
  "13": [0, 0],
  "83": [0, 0],
  "84": [0, 0],
  "2A": [0, 0],
  "2B": [0, 0]
}




////////////////////////////// Slider  //////
//////////////////////////////////////////////////////////


var handle_factor = 2;



function makeSlider (){

  // console.log(daterange)


var formatTime2 = d3.timeFormat("%Y-%m-%d");

// var slider_width = 200;

var slider_height = 10;

sliderTime = timer_duration

var svg_slider = d3.select('svg#map_slider')

var total_width = getWidth()

var slider_width = total_width <= 600 ? (total_width / 3.5) : 220;

svg_slider
.attr('width', (slider_width + 10))


handle_factor = slider_width/100;

// slider_width = 90;

// svg_slider
// .attr('viewBox', '0 0 210 30')
// .attr('preserveAspectRatio', 'none')

var parseTime2 = d3.timeParse("%Y-%m-%d");

var daterange_parsed = daterange.map(function(d){return parseTime2(d)} )

var tMax = d3.max(daterange_parsed, function(d) { return d; })
var t0 = d3.min(daterange_parsed, function(d) { return d; })


var x = d3.scaleTime()
.range([0, 100])
.domain([t0, tMax])
.clamp(true);


svg_slider.selectAll('*').remove()

  var slider = svg_slider.append("g")
  .attr("class", "slider")
  .attr("transform", "translate(0,13)");

  slider.append("line")
  .attr("class", "track")
  .attr("x1", x.range()[0] + '%')
  .attr("x2", (.95*x.range()[1]) + '%')
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  .attr("class", "track-inset")
  .call(d3.drag()
    .on("start.interrupt", function() { 

      // console.log('interrupt')
      slider.interrupt(); })
    .on("start drag", function() {
     moving_slider(x.invert(d3.event.x/handle_factor)); }));


  var handle = slider.insert("g", ".track-overlay")
  .attr("class", "handle")
;

handle.append("rect")
.attr("width", 4)
.attr("height", 20)
.attr("y", -10)
.attr("x", 3)
;

slider.transition() // Gratuitous intro!
.duration(sliderTime)
  .ease(d3.easeLinear)
.tween("moving_slider", function() {
  var i = d3.interpolate(t0, tMax);
  // d3.select("#articles").style('display', 'none');
    d3.select('#play_button')
  .html('<img src="img/pause.svg"">')
  .attr('class','pause');

d3.select('#play_button')
.on('click', function(){
check_transition();
});

  return function(t) { moving_slider(i(t)); };
})
.on('end', function(){





})
.on('interrupt', function(d){
});


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
  // d3.select("#articles").style('display', 'none')
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
  .html('<img src="img/play.svg"">')
  .attr('class','play');


resize_slider()

})

function check_transition(){

  var transition_state = d3.select('#play_button').attr('class');

    // console.log(transition_state)


  if (transition_state == 'pause')
  {

    slider.interrupt()
    slider.transition('chrono_animation')
    .duration(0);

d3.select('#play_button')
.html('<img src="img/play.svg">')
.attr('class','play');

}

else{
  restart_transition();
}
}

// Starting auto animation

function restart_transition(){


  var z_val  = Math.round(+handle.attr("transform").split('(')[1].split(',')[0]);

  // moving_slider(x.invert(d3.event.x))

  var y_val = z_val/handle_factor;

  d3.select('#play_button')
  .html('<img src="img/pause.svg">')
  .attr('class','pause');

  if (y_val >= x(tMax)*.99){
    var this_sliderTime = sliderTime;
    y_val = x(t0);
  }
  else{
    var this_sliderTime = sliderTime*((x(tMax) - y_val) /x(tMax));
  }

  slider.transition('chrono_animation')
  .duration(this_sliderTime)
  .ease(d3.easeLinear)
  .tween("moving_slider", function() {

    y_val = y_val == tMax ? t0 : y_val;
    var i = d3.interpolate(x.invert(y_val), tMax);
    // d3.select("#articles").style('display', 'none')
    return function(t) { moving_slider(i(t)); };
  })
  .on('end', function(){

    // updateAllArticle()

d3.select('#play_button')
.html('<img src="img/play.svg">')
.attr('class','play');

})
  .on('interrupt', function(d){


})
}

var previousDate = '';

function moving_slider(h) {

  // console.log(handle_factor)
  handle.attr("transform", "translate("+ x(h)*handle_factor +",0)");

  // populate_map(h, 0)
  var thisDate =  String(formatTime2(h))

  if (thisDate != previousDate){

    currentDate = thisDate;

    // console.log(currentDate)

    fillColorDate(selected_variable, thisDate)

    previousDate = thisDate
  }
  



}


d3.select('.handle').node().parentNode.appendChild(d3.select('.handle').node());

}


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
var slider_width = total_width <= 600 ? total_width / 4 : 200;
svg_slider
.attr('width', (slider_width + 10))
handle_factor = slider_width/100;


}