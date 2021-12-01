var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;

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

const g_x_translation_europe = 0;

const g_y_translation_europe = 0;


const rangeX = [30, 1980];
const rangeY = [980, 0];

var circleScalePop = 
d3.scaleSqrt()
.range([1, 100]);

var circleScaleDeaths = 
d3.scaleSqrt()
.range([1, 100]);


const codes_pays_absolte_path = ["AO", "AR", "AU", "AZ", "CA", "CL", "CN", "DK", "FJ", "GB", "GR", "ID", "IT", "JP", "MY", "NO", "NZ", "OM",
   "PH", "PG", "RU", "TR", "US", "VU", "ZA", "FR", "ES", "AG", "BS", "KM", "CV", "KY", "FK", "FO", "HK", "KN", "MV", "MT", "NC", "PR",
    "PF", "SB", "ST", "TC", "TO", "TT", "VC", "VG", "VI", "GP", "IC"]

function clean_those_numbers(this_array){


this_array.forEach(d => {

if (d.length > 1){
d[1] = _.round(d[1], 1)
d[2] = _.round(d[2], 1)
}
})

return this_array

}

var p2s = /,?([achlmqrstvxz]),?/gi;

  var convertToString = function (arr)
  {
    return arr.join(',').replace(p2s, '$1');
  };

function getAbsolutePath(thisPath){

let this_arr = Raphael._pathToAbsolute(thisPath);
this_arr = clean_those_numbers(this_arr)
return convertToString(this_arr)

}

const svg = d3.select(".carte svg");
const allPaths = svg.selectAll('path');
const g = d3.select('svg g#graph');

svg.style('max-height', $(window).height()*0.9 + 'px')

window.addEventListener("resize", function(d){

  svg.style('max-height', $(window).height()*0.9 + 'px')

});

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
    let this_d = _.find(app_data, d => d.geoId == this_code);
    if(this_d){
    let this_deaths = this_d.deaths;
    let this_deaths_for_100k = this_d.deaths_for_100k;

    return `<span class='details'>${
      d.nom
    }<br><span style="font-weight:bold">${this_deaths}</span> morts du Coronavirus
    <br>Soit une mortalité de <span style="font-weight:bold">${this_deaths_for_100k}</span> pour 100 000 habitants</span></span>`
  }
  else{
    console.log(this_code + ' not found')
  }
  })

tip.direction(function(d) {
 if (d.id === 'CN') return 'w'
 if (d.id === 'ID') return 'w'
 if (d.id === 'PG') return 'w'
 if (d.id === 'AU') return 'w'
 if (d.id === 'NZ') return 'w'
 if (d.id === '74') return 'w'
 if (d.id === '73') return 'w'
 if (d.id === '06') return 'w'
 if (d.id === '2B') return 'w'
 if (d.id === '2A') return 'w'
 if (d.id === 'CA') return 'e'
 if (d.id === 'US') return 'e'
 if (d.id === 'GL') return 's'
 if (d.id === 'NO') return 's'
 if (d.id === 'SE') return 's'
 if (d.id === 'FI') return 's'
 if (d.id === 'RU') return 's'
 if (d.id === 'IS') return 's'
 if (d.id === 'MX') return 'e'
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

// tip.offset(function(d) {
//   return [-10, 0]
// })

// d3.select('body').style('overflow', 'hidden')

const parentWidth = d3
.select('body')
.node()
.getBoundingClientRect().width

const margin = { top: 0, right: 0, bottom: 0, left: 0 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

  var color = d3.scaleLinear()
  .range(["white", '#F9D3DB', "#E3234A"]);

  // .range(["white", "#D4000C"]);
  // A70021

// const color = d3
// .scaleQuantile()
// .range([
//   'rgb(247,251,255)',
//   'rgb(222,235,247)',
//   'rgb(198,219,239)',
//   'rgb(158,202,225)',
//   'rgb(107,174,214)',
//   'rgb(66,146,198)',
//   'rgb(33,113,181)',
//   'rgb(8,81,156)',
//   'rgb(8,48,107)',
//   'rgb(3,19,43)'
//   ])

// const color2 = d3
// .scaleQuantile()
// .range([
//   '#FFFFFF',
//   '#F9D3DB',
//   '#F4A7B7',
//   '#E3234A',
//   '#A70021'
//   ])




function transformToCircle(thisPath){

  let thisCenter = getBoundingBoxCenter (thisPath);
  let this_path_d = thisPath.attr('d');
  let this_transformation = flubber.toCircle(this_path_d, thisCenter[0], thisCenter[1], 10);

  thisPath
  .transition()
  .attrTween("d", function(){ return this_transformation });

}

function force_separate_circles(radius_name){

  var features = allPaths.data();

  simulation = d3.forceSimulation(features)
  .force("y", d3.forceY(function(d) { return d.centroid[1] }).strength(5))
  .force("x", d3.forceX(function(d) { return d.centroid[0] }).strength(5))
  .force("collide", d3.forceCollide(7).radius(d=> d[radius_name]))
  .stop();

  for (var i = 0; i < 200; ++i) simulation.tick();

    allPaths
  .transition()
  .duration(800)
  .attr('transform', function(d) { return 'translate(' +Math.round(d.x -d.centroid[0])+ ',' +Math.round(d.y - d.centroid[1]) + ')'});

}


function registered_separate_circles(){

  allPaths
  .transition().attr('transform', function(d) { return 'translate(' +position_departements[d.id][0]+ ',' +position_departements[d.id][1] + ')'});

}

function registered_separate_circles_ecarts(){

  allPaths
  .transition().attr('transform', function(d) { return 'translate(' +position_departements_ecart[d.id][0]+ ',' +position_departements_ecart[d.id][1] + ')'});

}


function redraw_paths(radius_name, duration, callback_value){

  let pathsize = allPaths.size();
  let pathsCount = 0;
  let departements_corrections = codes_pays_absolte_path;

  allPaths
  .transition()
  .duration(duration)
  .attrTween("d", function(d){ return flubber.fromCircle(d.centroid[0], d.centroid[1], d[radius_name], d.path)})
  .on('end', function(){
    pathsCount++;
    if (pathsCount >= pathsize){
      allPaths.filter(function(d){return departements_corrections.includes(d.id) }).attr("d", function(d){ return d.path})
      pathsCount = 0

      allPaths
      .transition()
      .attr('transform', 'translate(0,0)')
      .on('end', function(){
      pathsCount++;
      if (pathsCount >= pathsize && callback_value){
        transform_all_paths_to_circle(callback_value)
        // setTimeout(() => {  callback_function(); }, 2000);
      }

      })
    }
  })
  ;
}


function transform_all_paths_to_circle(radius_name){

  let pathsize = allPaths.size();
  let pathsCount = 0;

allPaths.transition().attrTween("d", function(d){ return flubber.toCircle(d3.select(this).attr('d'), d.centroid[0], d.centroid[1],
 d[radius_name])})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    // registered_separate_circles_ecarts()
    force_separate_circles(radius_name)
  }
})

}



d3.select('#display_proportional_circles_pop')
.on('click', function(){

allPaths.attr('visibility', 'visible')
  // transform_all_paths_to_circle('radius_pop')


transform_all_paths_to_circle('radius_pop')

  mapstate = 1;

})

d3.select('#display_proportional_circles_deaths')
.on('click', function(){


  transform_all_paths_to_circle('radius_deaths')
  allPaths.filter(d=> d.deaths==0).attr('visibility', 'hidden')


  mapstate = 2;

})

d3.select('#display_geo_paths')
.on('click', function(){

allPaths.attr('visibility', 'visible')

if (mapstate ==1){

redraw_paths('radius_pop', 500)
}
else if (mapstate == 2){
redraw_paths('radius_deaths', 500)

}


  



  mapstate = 0;
  
})

// color2.domain([0, 1, 2, 4, 5]);

// svg.call(tip)

d3.select(".carte svg")
.call(tip)


Promise.all([
    d3.csv("data/deaths_countries_last.csv")
]).then(function(files) {
  ready(files[0])
}).catch(function(err) {
})


  function ready(data) {

    // data.forEach(d => {
    //   d.ecart2020 = +d.ecart2020;
    //   d.moyenne_2018_2019 = +d.moyenne_2018_2019;
    //   d.progression_morts = +d.progression_morts;
    //   d.Densite = +d.Densite;
    //   d.population = +d.population;
    // })

    data.forEach(d => {
      d.deaths = +d.deaths;
      d.population = +d.popData2018;
      d.deaths_for_100k = _.round(100000*d.deaths / d.population, 1)
    })

    // console.log(data0)
    console.log(data)

    circleScalePop.domain(d3.extent(data, d=>d.population));

    circleScaleDeaths.domain([0,d3.max(data, d=>d.deaths)]);

    let allSvgNodes = allPaths.nodes();
    for (i in allSvgNodes){
      let this_id = d3.select(allSvgNodes[i]).attr('data-id')
      let this_nom = d3.select(allSvgNodes[i]).attr('data-nom')
      let this_d = data.filter(d=> d.geoId == this_id)[0]
      // console.log(this_id, this_d)
      let this_pop = this_d ? this_d.population : 0;
      let this_deaths = this_d ? this_d.deaths : null;
      let this_deaths_for_100k = this_d ? this_d.deaths_for_100k : 0;
      // let this_ecart = data.filter(d=> d.CodeDepartement == this_id)[0].ecart2020;
      // let this_radius = Math.round(circleScale(this_pop));
      // let this_radius_ecart = Math.round(circleScaleEcart(this_ecart >=0 ? this_ecart : 0));
      let this_radius_random = Math.round(Math.random()*50);
      let this_radius_fixed = 10;
      let this_radius_pop = Math.round(circleScalePop(this_pop));
      let this_radius_deaths= Math.round(circleScaleDeaths(this_deaths));
      let this_path_d = d3.select(allSvgNodes[i]).attr('d');
      let this_centroid = getBoundingBoxCenter(d3.select(allSvgNodes[i]));
      // let this_to_circle_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius);
      // let this_to_circle_ecart_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius_ecart);
      // let this_from_circle_function = flubber.fromCircle(this_centroid[0], this_centroid[1], this_radius, this_path_d);

      d3.select(allSvgNodes[i]).datum({
        'id': this_id, 'path': this_path_d,
         'centroid': this_centroid, 
        // 'to_circle_function': this_to_circle_function,
        // 'to_circle_ecart_function': this_to_circle_ecart_function,
        // 'from_circle_function': this_from_circle_function,
        'population':this_pop,
        'deaths':this_deaths,
        'deaths_for_100k':this_deaths_for_100k,
        'radius_pop': this_radius_pop,
        'radius_deaths': this_radius_deaths,
        'radius_fixed': this_radius_fixed,
        'nom': this_nom,
        // 'radius': this_radius,
        // 'radius_ecart': this_radius_ecart,
        'radius_random': this_radius_random
      });
// console.log(d3.select(allSvgNodes[i]).attr('data-numerodepartement'))
}

app_data = data;

// color
// .domain(d3.extent(data.map( d => d.deaths_for_100k)));

color
.domain([0, 3 ,70]);

  allPaths
  .style('fill', d => {

    // if (typeof data.filter(function(e){return e.CodeDepartement == d.id})[0] !== 'undefined') {

      return color(d.deaths_for_100k)

    // }
    // return '#fff'
  })
  .style('fill-opacity', 1)
  .style('stroke', '#bbb')
  .style('stroke-width', 1)
  .style('stroke-opacity', 1)
  .on('mouseover', function(d) {
    tip.show(d)
    d3.select(this)
    .raise()
    .style('fill-opacity', 1)
    // .style('stroke-opacity', 1)
    .style('stroke-width', 3)
    .style('stroke', '#aaa')
  })
  .on('mouseout', function(d) {
    tip.hide(d)
    d3.select(this)
    .style('fill-opacity', 1)
    // .style('stroke-opacity', 0.8)
    .style('stroke-width', 1)
    .style('stroke', '#bbb')
  })


// setTimeout(() => {

//   transform_all_paths_to_circle()
// mapstate = 1;
// },
//    500);

}


// New functions


function force_separate_circles_for_scatter(column_y){

  // g.transition().attr('transform', `translate(${-g_x_translation_europe},${g_y_translation_europe}) scale(2)`)


  var features = allPaths.data();

  simulation = d3.forceSimulation(features)
  .force("y", d3.forceY(function(d) { 
    return column_y ? scaleY(d[column_y]) : 150}).strength(5))
  .force("x", d3.forceX(function(d) { return scaleX(d.deaths_for_100k) }).strength(8))
  .force("collide", d3.forceCollide(7).radius(d=> d['radius_pop']))
  .stop();

  for (var i = 0; i < 200; ++i) simulation.tick();

    allPaths
  .transition()
  .duration(800)
  // .attr('transform', function(d) { return 'translate(' +Math.round(d.x -d.centroid[0])+ ',' +Math.round(d.y - d.centroid[1]) + ')'})
  .attr('transform', function(d) { return moveToPoint2(d, [d.x, d.y])});

}
// 'transform', d=> moveToPoint2(d, [scaleEurope(d.deaths_for_100k),150])

function moveToPoint2(d, newCoords){

return `translate(${g_x_translation_europe-d.centroid[0] + newCoords[0]}, ${g_y_translation_europe-d.centroid[1] + newCoords[1]})`

}

const scaleX = d3.scaleLinear()
.range(rangeX)
.domain([0, 100]);

var scaleY = d3.scaleLinear()
.range(rangeY)
.domain([0, 100]);


function changeYAxisScale(newScale){

  scaleY.domain(newScale)

  g.select('g#axisLeft')
  .transition()
  .call(d3.axisLeft(scaleY).tickFormat(d=>formatNumber(d)))
}

function drawAxisLeft(){

var axisL = d3.axisLeft(scaleY);


axisL.tickFormat(d=>formatNumber(d));

d3.select('g#axisLeft')
.remove()

g.append("g")
.attr('class', 'axis')
.attr('id', 'axisLeft')
    .attr("transform", `translate(${g_x_translation_europe + rangeX[0] - 20},${g_y_translation_europe})`)
    .call(axisL);

}




function drawAxisBottom(){

var axisT = d3.axisBottom(scaleX);

d3.select('g#axisBottom')
.remove()

g.append("g")
.attr('class', 'axis')
.attr('id', 'axisBottom')
    .attr("transform", `translate(${g_x_translation_europe},${g_y_translation_europe + rangeY[0]})`)
    .call(axisT);

}


function makeScatterPlot(){

drawAxisBottom()

drawAxisLeft()

force_separate_circles_for_scatter('deaths_for_100k')

}


function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
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

