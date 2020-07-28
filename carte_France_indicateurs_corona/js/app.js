var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;

// console.log(mainWidth)

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
mapstate = 0;

var circleScale = 
d3.scaleSqrt()
.range([5, 40]);

var circleScaleEcart = 
d3.scaleSqrt()
.range([0, 29]);


const svg = d3.select(".carte svg");
const allPaths = svg.selectAll('path');

svg.style('max-height', $(window).height()*0.9 + 'px')

window.addEventListener("resize", function(d){

  svg.style('max-height', $(window).height()*0.9 + 'px')

});

if($(window).width() >= 1000){

  this_zoom_level = 6;
}

var mainColor = '#E3234A';

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

var div = d3.select("body").append("div")
.attr("id", "tooltip")
.attr('class', 'box');

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

const tip = d3
.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(
  d =>{
    let this_code = d.id;
    let this_d = _.find(app_data, d => d.dep == this_code);
    let this_ecart = Math.round(this_d.ecart2020);
    let this_diff = this_ecart < 0 ? 'moins' : 'plus';
    let this_progression_type = this_ecart < 0 ? 'baisse' : 'augmentation';

    return `<span class='details'><span style="font-weight:bold">${this_d.Departement} (${this_d.dep})</span>
    <br>Taux de positivité : <span style="font-weight:bold">${this_d.taux_de_positivite}%</span>
    <br>Taux d'incidence : <span style="font-weight:bold">${this_d.taux_incidence}%</span>
    <br>Taux de reproduction effectif : <span style="font-weight:bold">${this_d.tauxReproductionEffectif}%</span>
    <br>Taux d'occupation en réanimation : <span style="font-weight:bold">${this_d.tauxOccupationRea}%</span></span>`
  })

tip.direction(function(d) {
 if (d.id === '57') return 'w'
 if (d.id === '67') return 'w'
 if (d.id === '68') return 'w'
 if (d.id === '90') return 'w'
 if (d.id === '25') return 'w'
 if (d.id === '74') return 'w'
 if (d.id === '73') return 'w'
 if (d.id === '06') return 'w'
 if (d.id === '2B') return 'w'
 if (d.id === '2A') return 'w'
 if (d.id === '59') return 's'
 if (d.id === '62') return 's'
 if (d.id === '80') return 's'
 if (d.id === '76') return 's'
 if (d.id === '08') return 's'
 if (d.id === '02') return 's'
 if (d.id === '971') return 'e'
 if (d.id === '972') return 'e'
  if (d.id === '973') return 'e'
 if (d.id === '974') return 'e'
 if (d.id === '975') return 'e'
 if (d.id === '976') return 'e'
 if (d.id === '29') return 'e'
if (d.id === '22') return 'e'
if (d.id === '56') return 'e'

  // otherwise if not specified
return 'n'
})

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
  return 'green'
}

else if(x <=50){
  return 'orange'
}
else {
  return 'red'
}

}

var colorPositivity = function (x){
  
if(x <=5){
  return 'green'
}

else if(x <=10){
  return 'orange'
}
else {
  return 'red'
}

}

var colorR = function (x){
  
if(x <=1){
  return 'green'
}

else if(x <=1.5){
  return 'orange'
}
else {
  return 'red'
}

}

var colorOccupation = function (x){
  
if(x <=40){
  return 'green'
}

else if(x <=60){
  return 'orange'
}
else {
  return 'red'
}

}

var color_functions = {
'taux_de_positivite':colorPositivity,
'taux_incidence':colorIncidence,
'tauxReproductionEffectif':colorR,
'tauxOccupationRea':colorOccupation
}




d3.select('#positivity')
.on('click', function(){


d3.selectAll('#button_box a')
.style('opacity', 1)
d3.selectAll('#positivity')
.style('opacity', 0.5)

fillColor('taux_de_positivite')

})

d3.select('#incidence_rate')
.on('click', function(){

  fillColor('taux_incidence')

d3.selectAll('#button_box a')
.style('opacity', 1)
d3.selectAll('#incidence_rate')
.style('opacity', 0.5)

})

d3.select('#R_rate')
.on('click', function(){
  fillColor('tauxReproductionEffectif')

d3.selectAll('#button_box a')
.style('opacity', 1)
d3.selectAll('#R_rate')
.style('opacity', 0.5)

})

d3.select('#reanimation_rate')
.on('click', function(){
  fillColor('tauxOccupationRea')

d3.selectAll('#button_box a')
.style('opacity', 1)
d3.selectAll('#reanimation_rate')
.style('opacity', 0.5)

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
.style('display', 'none')

d3.select('#display_proportional_circles')
.style('display', 'initial')

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


  d3.select('#display_geo_paths')
.style('display', 'initial')

d3.select('#display_proportional_circles')
.style('display', 'none')

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

d3.select(".carte svg")
.call(tip)

queue()
  // .defer(d3.json, 'data/departements.json')
  // .defer(d3.tsv, 'data/world_population.tsv')
  // .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6YOcYH2GBljCvg2rXaPjWC2ibMV0upfMWd93kpQ6R8tO8mYtZt3y0SQNcRFI2K7aXyXNsgK5LGHnx/pub?gid=1360208169&single=true&output=csv')
  // .defer(d3.csv, 'data/departements_morts_centres.csv')
  .defer(d3.csv, 'data/taux_indicateurs_couleurs_departements.csv')
  .await(ready)

  function ready(error, data) {

    data.forEach(d => {
      d.P = +d.P;
      d.T = +d.T;
      d.taux_de_positivite = +d.taux_de_positivite;
      d.taux_incidence = +d.taux_incidence;
      d.tauxReproductionEffectif = +d.tauxReproductionEffectif;
      d.tauxOccupationRea = +d.tauxOccupationRea;
      d.progression_morts = +d.progression_morts;
      d.Densite = +d.Densite;
      d.population = +d.population;
    })

    console.log(data)

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

app_data = data;

// console.log(data)

var progressionMax = d3.max(data, function(d) { return d.progression_morts; })

  // set the domain of the color scale based on our data
  color.domain([0, 13068161, 38463689, 70916439, 126804433, 201103330, 310232863, 1173108018, 1330141295]);

  var myColor = d3.scaleLinear().domain([0,100])
  .range(["white", "#E3234A"])

  allPaths
  .style('fill', d => {

    if (typeof data.filter(function(e){return e.dep == d.id})[0] !== 'undefined') {

      return colorIncidence(+data.filter(function(e){return e.dep == d.id})[0].taux_incidence)

    }
    return '#fff'
  })
  .style('fill-opacity', 1)
  .style('stroke', 'lightgray')
  .style('stroke-width', 1)
  .style('stroke-opacity', 0.5)
  .on('mouseover', function(d) {
    tip.show(d)
    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 1)
    .style('stroke-width', 2)
  })
  .on('mouseout', function(d) {
    tip.hide(d)
    d3.select(this)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 0.5)
    .style('stroke-width', 1)
  })


setTimeout(() => {

  transform_all_paths_to_circle()
mapstate = 1;
},
   500);

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

          if (actualContainerWidth < 1000){

              // d3.select('#slider_container').style('width', actualContainerWidth + 'px')
              d3.select('svg#map_slider').attr('width', (actualContainerWidth - 40))
              d3.select('svg#map_slider').style('width', (actualContainerWidth - 40) + 'px')

            }

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
          text = "Y a-t-il eu plus de morts que d’habitude dans votre département à cause du coronavirus ? La réponse avec notre carte interactive https://www.liberation.fr/apps/2020/04/impact-coronavirus-mortalite-france/ via @libe",
          link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');

        }

        function roundAndFormatPct(x){
         return Math.abs(_.round(x,1)).toString().replace(".", ",")

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
