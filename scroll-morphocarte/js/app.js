var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;

const g_x_translation_europe = 1100;
const g_y_translation_europe = 130;

const rangeXEurope = [-400, 500];
const rangeYEurope = [380, 0];


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
allPathsEurope,
tooltip_additional_var;

var circleScalePop = 
d3.scaleSqrt()
.range([1, 100]);

var circleScaleDeaths = 
d3.scaleSqrt()
.range([1, 100]);


const codes_pays_absolte_path = ["AO", "AR", "AU", "AZ", "CA", "CL", "CN", "DK", "FJ", "GB", "GR", "ID", "IT", "JP", "MY", "NO", "NZ", "OM",
   "PH", "PG", "RU", "TR", "US", "VU", "ZA", "FR", "ES", "AG", "BS", "KM", "CV", "KY", "FK", "FO", "HK", "KN", "MV", "MT", "NC", "PR",
    "PF", "SB", "ST", "TC", "TO", "TT", "VC", "VG", "VI", "GP", "IC"]

// const europe_countries = ["Albanie", "Autriche", "Belgique", "Bulgarie", "Bosnie-Herzégovine", "Suisse", "Tchéquie", "Allemagne",
//  "Danemark", "Estonie", "Finlande", "Royaume-Uni", "Grèce", "Croatie", "Hongrie", "Irlande (pays)", "Islande", "Italie", "Lituanie",
//   "Luxembourg (pays)", "Lettonie", "Pays-Bas", "Norvège", "Pologne", "Portugal", "Roumanie", "Serbie",
//    "Slovaquie", "Slovénie", "Suède", "France", "Espagne", "Malte", "Chypre (pays)"]


const europe_countries = ["Autriche", "Belgique", "Suisse", "Tchéquie", "Allemagne",
 "Danemark", "Estonie", "Finlande", "Royaume-Uni", "Grèce", "Hongrie", "Irlande", "Islande", "Italie", "Lituanie",
  "Luxembourg", "Lettonie", "Pays-Bas", "Norvège", "Pologne", "Portugal",
  "Slovaquie", "Slovénie", "Suède", "France", "Espagne"]


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

// var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

var div = d3.select("#morphocarte").append("div")
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
.offset([-10, -10])
.html(
  d =>{
    let this_code = d.id;
    let this_d = _.find(app_data, d => d.geoId == this_code);
    if (d.auto){
      return `<span class='details'><span style="font-weight:bold">${d.nom}</span></span>`
    }
    else if(this_d){
    let this_deaths = this_d.deaths;
    let this_deaths_for_100k = this_d.deaths_for_100k;
    if (tooltip_additional_var){
      var tooltip_addition = `<br>${tooltip_additional_var[0]} : <span style="font-weight:bold">${formatNumber(this_d[tooltip_additional_var[1]])}</span>
      ${tooltip_additional_var[2] ? tooltip_additional_var[2] : ""}`
    }else{ var tooltip_addition = ''}

    return `<span class='details'>${
      d.nom
    }<br><span style="font-weight:bold">${this_deaths}</span> morts du Coronavirus
    <br>Soit une mortalité de <span style="font-weight:bold">${this_deaths_for_100k}</span> pour 100 000 habitants</span>
    ${tooltip_addition}</span>`
  }
  else{
    console.log(this_code + ' not found')
  }
  })

var country_tip_direction = {'CN' :'w',
'ID' :'w',
'PG' :'w',
'AU' :'w',
'NZ' :'w',
'74' :'w',
'73' :'w',
'06' :'w',
'2B' :'w',
'2A' :'w',
'CA' :'e',
'US' :'e',
'GL' :'s',
'NO' :'s',
'SE' :'s',
'FI' :'s',
'RU' :'s',
'IS' :'s',
'MX' :'e',
'972' :'e',
'973' :'e',
'974' :'e',
'975' :'e',
'976' :'e',
'29' :'e',
'22' :'e',
'56' :'e'}

tip.direction(function(d) {

  // otherwise if not specified
return country_tip_direction[d.id] ? country_tip_direction[d.id] : 'n';
})


tip.offset(function(d) {
  // [top, left]
  if (country_tip_direction[d.id]){
    let c = country_tip_direction[d.id]
    if (c == 'w'){ return [-6, -5]}
    if (c == 'e'){ return [-2, 8]}
    if (c == 's'){ return [10, 0]}
  }
  // otherwise if not specified
  return [-14, 0]
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


function transform_all_paths_to_circle(radius_name, callback_value){

  let pathsize = allPaths.size();
  let pathsCount = 0;

allPaths.transition().attrTween("d", function(d){ return flubber.toCircle(d3.select(this).attr('d'), d.centroid[0], d.centroid[1],
 d[radius_name])})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    if (callback_value){console.log('OK')}
    // registered_separate_circles_ecarts()
    force_separate_circles(radius_name)
  }
})
.end(console.log('end transition'))

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
      d.gdp = +d.gdp;
      d.deaths_for_100k = _.round(100000*d.deaths / d.population, 1);
      d.life_expectancy =  +d['Espérance de vie'];
      d.usual_deaths_for_100k =  +d['Décès pour 100 000 habitants'];
      d.deaths_on_lockdown = +d.deaths_on_lockdown;
    })

    // console.log(data0)
    console.log(data)

    circleScalePop.domain(d3.extent(data, d=>d.population));

    circleScaleDeaths.domain([0,d3.max(data, d=>d.deaths)]);

    let allSvgNodes = allPaths.nodes();
    for (i in allSvgNodes){
      let this_id = d3.select(allSvgNodes[i]).attr('data-id')
      let this_nom = d3.select(allSvgNodes[i]).attr('data-nom')
      let this_europe = europe_countries.includes(this_nom) ? 1 : 0;
      let this_d = data.filter(d=> d.geoId == this_id)[0]
      // console.log(this_id, this_d)
      let this_pop = this_d ? this_d.population : 0;
      let this_gdp = this_d ? this_d.gdp : null;
      let this_life_expectancy = this_d ? this_d.life_expectancy : null;
      let this_usual_deaths_for_100k = this_d ? this_d.usual_deaths_for_100k : null;
      let this_deaths_on_lockdown = this_d ? this_d.deaths_on_lockdown : null;
      let this_continent = this_d ? this_d.continentExp : null;
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
        'gdp':this_gdp,
        'life_expectancy':this_life_expectancy,
        'usual_deaths_for_100k':this_usual_deaths_for_100k,
        'deaths_on_lockdown':this_deaths_on_lockdown,
        'deaths':this_deaths,
        'deaths_for_100k':this_deaths_for_100k,
        'radius_pop': this_radius_pop,
        'radius_deaths': this_radius_deaths,
        'radius_fixed': this_radius_fixed,
        'nom': this_nom,
        'europe': this_europe,
        'continent': this_continent,
        // 'radius': this_radius,
        // 'radius_ecart': this_radius_ecart,
        'radius_random': this_radius_random
      });
// console.log(d3.select(allSvgNodes[i]).attr('data-numerodepartement'))
}

allPathsEurope = allPaths.filter(d=> d.europe)

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
    console.log(d.id)
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

function ZoomEurope(){

allPaths.filter(d=>d.europe != 1).style('display', 'none')

g.transition().attr('transform', `translate(${-g_x_translation_europe},${-140}) scale(2)`)


}

function ZoomReset(){

allPaths.filter(d=>d.europe != 1).style('display', 'initial')

g.transition().attr('transform', 'translate(0,0) scale(1)')

  }



function moveToPoint2(d, newCoords){

return `translate(${g_x_translation_europe-d.centroid[0] + newCoords[0]}, ${g_y_translation_europe-d.centroid[1] + newCoords[1]})`

}


function force_separate_circles_europe(column_y){

  // g.transition().attr('transform', `translate(${-g_x_translation_europe},${g_y_translation_europe}) scale(2)`)


  var features = allPathsEurope.data();

  simulation = d3.forceSimulation(features)
  .force("y", d3.forceY(function(d) { return column_y ? scaleYEurope(d[column_y]) : 150}).strength(5))
  .force("x", d3.forceX(function(d) { return scaleXEurope(d.deaths_for_100k) }).strength(8))
  .force("collide", d3.forceCollide(7).radius(d=> d['radius_pop']))
  .stop();

  for (var i = 0; i < 200; ++i) simulation.tick();

    allPathsEurope
  .transition()
  .duration(800)
  // .attr('transform', function(d) { return 'translate(' +Math.round(d.x -d.centroid[0])+ ',' +Math.round(d.y - d.centroid[1]) + ')'})
  .attr('transform', function(d) { return moveToPoint2(d, [d.x, d.y])});

}
// 'transform', d=> moveToPoint2(d, [scaleEurope(d.deaths_for_100k),150])

const scaleXEurope = d3.scaleLinear()
.range(rangeXEurope)
.domain([0, 100]);

var scaleYEurope = d3.scaleLinear()
.range(rangeYEurope)
.domain([0, 90000]);


function drawAxisLeft(){

var axisL = d3.axisLeft(scaleYEurope);


axisL.tickFormat(d=>formatNumber(d));

d3.select('g#axisLeft')
.remove()

g.append("g")
.attr('class', 'axis')
.attr('id', 'axisLeft')
    .attr("transform", `translate(${g_x_translation_europe + rangeXEurope[0] - 20},${g_y_translation_europe})`)
    .call(axisL);

}

function changeYAxisScale(newScale){

  scaleYEurope.domain(newScale)

  g.select('g#axisLeft')
  .transition()
  .call(d3.axisLeft(scaleYEurope).tickFormat(d=>formatNumber(d)))
}


function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

function drawAxisBottom(){

var axisT = d3.axisBottom(scaleXEurope);

d3.select('g#axisBottom')
.remove()

g.append("g")
.attr('class', 'axis')
.attr('id', 'axisBottom')
    .attr("transform", `translate(${g_x_translation_europe},${g_y_translation_europe + rangeYEurope[0]})`)
    .call(axisT);

}


function ShowEuropeData(){

allPaths.attr('visibility', 'visible')
  // transform_all_paths_to_circle('radius_pop')


transform_all_paths_to_circle('radius_pop')

ZoomEurope()

force_separate_circles_europe()


}

function populationViewAndZoomEurope(){

  let pathsize = allPaths.size();
  let pathsCount = 0;

allPaths.transition().attrTween("d", function(d){ return flubber.toCircle(d3.select(this).attr('d'), d.centroid[0], d.centroid[1],
 d['radius_pop'])})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    // registered_separate_circles_ecarts()
    // ZoomEurope()
  }
})

}


function ShowEuropeData(){

  let pathsize = allPaths.size();
  let pathsCount = 0;

allPaths.transition().attrTween("d", function(d){ return flubber.toCircle(d3.select(this).attr('d'), d.centroid[0], d.centroid[1],
 d['radius_pop'])})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    // registered_separate_circles_ecarts()
    ZoomEurope()
    force_separate_circles_europe()
    drawAxisBottom()
  }
})
.end(console.log('end transition'))

}

let thisview = null;

let progressbar = 0;

enterView({
  selector: d3.selectAll('article .step').nodes(),
  offset: 0.5,
  enter: el => {
    const index = +d3.select(el).attr('data-index');
    console.log('Entering ' + index);
    thisview = index;
    objEnterView[index]()
  },
  exit: el => {
    let index = +d3.select(el).attr('data-index');

    

    console.log('Exiting ' + index);

    if (index == 0){
      console.log('real exit')
      thisview = null;
      initializeView()
    }
    else{
    index = enterViewKeys[enterViewKeys.indexOf(index) -1]
    thisview = index;
    objEnterView[index]()
  }
  
  },

});



const objEnterView = {
0:function(){
allPaths.attr('visibility', 'visible')
if (mapstate ==1){

redraw_paths('radius_pop', 500)
}
else if (mapstate == 2){
redraw_paths('radius_deaths', 500)

}

  mapstate = 0;
},
1:function(){

allPaths.attr('visibility', 'visible')
transform_all_paths_to_circle('radius_pop')
mapstate = 1;

},

11: function(){
allPaths.filter(d=> d.deaths==0).attr('visibility', 'hidden')
transform_all_paths_to_circle('radius_deaths')
 mapstate = 2;
},

2: function(){
allPaths.attr('visibility', 'visible')
transform_all_paths_to_circle('radius_pop')
 mapstate = 1;
},
3: function(){

  ZoomEurope()
  mapstate = 1;
d3.selectAll('g#axisLeft')
.remove()
d3.selectAll('g#axisBottom')
.remove()
tooltip_additional_var = null;

d3.select('svg g#graph #bottomLabel').text('')
d3.select('svg g#graph #leftLabel').text('')

},
4: function(){

tip.hide()
d3.selectAll('g#axisLeft')
.remove()
country_tip_direction['LU'] = 'n';
drawAxisBottom()
force_separate_circles_europe()
tooltip_additional_var = null;

drawLabels()
d3.select('svg g#graph #bottomLabel').text('Nombre de morts du coronavirus pour 100 000')
d3.select('svg g#graph #leftLabel').text('')

},
5: function(){

  tip.hide()
country_tip_direction['LU'] = 's';
country_tip_direction['SE'] = 's';
country_tip_direction['IS'] = 's';
country_tip_direction['NO'] = 's';
drawAxisBottom()
drawAxisLeft()
changeYAxisScale([0, 120000])
force_separate_circles_europe('gdp')

tooltip_additional_var = ['PIB par tête', 'gdp']

d3.select('svg g#graph #leftLabel').text('PIB par habitant')
.attr('x', 680)
},
51: function(){

showTipForId('LU')
country_tip_direction['LU'] = 's';
},
52: function(){

showTipForId('CH')
changeYAxisScale([0, 120000])

},
53: function(){

 tip.hide()

changeYAxisScale([0, 90000])
force_separate_circles_europe('gdp')

},
54: function(){

 showTipForId('SK')


},
55: function(){

 showTipForId('EL')


},
56: function(){

 showTipForId('PT')


},
57: function(){

 showTipForId('BE')


},
58: function(){

 showTipForId('NO')

changeYAxisScale([0, 90000])
force_separate_circles_europe('gdp')

},
6: function(){
  tip.hide()

country_tip_direction['IT'] = 'n';
country_tip_direction['SE'] = 'n';
country_tip_direction['LU'] = 'n';
country_tip_direction['IS'] = 'n';
country_tip_direction['NO'] = 'n';

changeYAxisScale([100, 500])


force_separate_circles_europe('usual_deaths_for_100k')

tooltip_additional_var = ['Mortalité générale en 2019', 'usual_deaths_for_100k', ' pour 100 000 habitants']

d3.select('svg g#graph #leftLabel').text('Mortalité annuelle en 2019')
.attr('x', 700)
},
61: function(){
showTipForId('HU')
},
62: function(){
showTipForId('NO')
},
63: function(){
tip.hide()
},
7: function(){

 tip.hide()
changeYAxisScale([70, 90])
force_separate_circles_europe('life_expectancy')
tooltip_additional_var = ['Espérance de vie', 'life_expectancy']

d3.select('svg g#graph #leftLabel').text('Espérance de vie')
.attr('x', 680)
},
8: function(){
tip.hide()
showTipForId('SE')
country_tip_direction['IT'] = 'n';
changeYAxisScale([0, 550])
country_tip_direction['IT'] = 's';
force_separate_circles_europe('deaths_on_lockdown')
tooltip_additional_var = ['Nombre de morts le jour du confinement', 'deaths_on_lockdown']
d3.select('svg g#graph #leftLabel')
.text('Nombre de morts le 1er jour du confinement')
.attr('x', 760)
},

9: function(){
showTipForId('PL')
},
10: function(){
tip.hide()
}
}

const enterViewKeys = d3.keys(objEnterView).map(d=>+d);


function initializeView(){

d3.selectAll('g#axisLeft')
.remove()

d3.selectAll('g#axisBottom')
.remove()
ZoomReset()

allPaths.attr('visibility', 'visible')
if (mapstate ==1){

redraw_paths('radius_pop', 500)
}
else if (mapstate == 2){
redraw_paths('radius_deaths', 500)

}

  mapstate = 0;

}

function showTipForId(id){
let this_el = allPaths.filter(d=>d.id == id)

tip.show({'nom':this_el.attr('data-nom'), 'auto':1}, this_el.node())

}

function drawLabels(){

d3.select('svg g#graph #leftLabel').remove()
d3.select('svg g#graph #bottomLabel').remove()

d3.select('svg g#graph')
.append('text')
.attr('id', 'leftLabel')
.text('PIB par habitant')
.attr('text-anchor', 'middle')
.attr('x', 680)
.attr('y', 100)

d3.select('svg g#graph')
.append('text')
.attr('id', 'bottomLabel')
.text('Nombre de morts du coronavirus pour 100 000')
.attr('x', 1100)
.attr('y', 560)
.attr('text-anchor', 'middle')


}
