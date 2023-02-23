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
mapstate = 0,
continent_names = ['Afrique', 'Amérique du Nord', 'Amérique du Sud', 'Asie', 'Europe', 'Océanie'],
data_ukraine;

const code_pays = 'code2d';

let radius_name = 'radius_pop';
// const radius_name = 'radius_co2';

// const code_pays = 'geoId';

const g_x_translation_europe = 40;

const g_y_translation_europe = 30;


const rangeX = [62, 1980];
const rangeY = [980, 0];

var circleScalePop = 
d3.scaleSqrt()
.range([1, 100]);

var circleScaleCO2 = 
d3.scaleSqrt()
.range([1, 100]);

var circleScaleDeaths = 
d3.scaleSqrt()
.range([1, 100]);

var circleScaleGDP = 
d3.scaleSqrt()
.range([1, 100]);

let axisT;

const continents_position = {
'AF': 9.2,
'NA': 7.5,
'SA': 6.2,
'AS': 4.2,
'EU': 1.7,
'OC': .5}

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
let allPaths = svg.selectAll('path');
const g = d3.select('svg g#graph');

svg.style('max-height', $(window).height()*0.9 + 'px')

window.addEventListener("resize", function(d){

  svg.style('max-height', $(window).height()*0.9 + 'px')

});

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

// var div = d3.select("body").append("div")
// .attr("id", "tooltip")
// .attr('class', 'box');

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
const format = d3.format(',')


const parentWidth = d3
.select('body')
.node()
.getBoundingClientRect().width

const margin = { top: 0, right: 0, bottom: 0, left: 0 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

  var color = d3.scaleLinear()
  .range(["white", "red", "black"])
  .domain([0,20 ,35]);


  var color_ukraine = d3.scaleOrdinal()
  .range(["#6E8AEF", "#E2E2E2" , "#FF0000"])
  .domain(['en faveur', 'abstention', 'contre']);

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

function force_separate_circles(radius_name, to_scatter_x, to_scatter_y){

  let pathsize = allPaths.size();
  let pathsCount = 0;

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
  .attr('transform', function(d) { return 'translate(' +Math.round(d.x -d.centroid[0])+ ',' +Math.round(d.y - d.centroid[1]) + ')'})
  .on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    // registered_separate_circles_ecarts()
        mapstate = 1

    if (to_scatter_x){
      force_separate_circles_for_scatter(to_scatter_x, to_scatter_y)
    }
    

  }
});

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
      else if (pathsCount >= pathsize){
        mapstate = 0
      }

      })
    }
  })
  ;
}


function transform_all_paths_to_circle(radius_name, to_scatter_x, to_scatter_y){

  let pathsize = allPaths.size();
  let pathsCount = 0;

allPaths.transition().attrTween("d", function(d){ return flubber.toCircle(d3.select(this).attr('d'), d.centroid[0], d.centroid[1],
 d[radius_name])})
.on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    // registered_separate_circles_ecarts()
    if (to_scatter_x){
      force_separate_circles(radius_name, to_scatter_x, to_scatter_y)
    }
    else{
      force_separate_circles(radius_name)
    }
    
    mapstate = 1
  }
})

}


function force_separate_circles_for_scatter(column_x, column_y){

  // g.transition().attr('transform', `translate(${-g_x_translation_europe},${g_y_translation_europe}) scale(2)`)

  /*console.log(column_y)*/

  let pathsize = allPaths.size();
  let pathsCount = 0;


  var features = allPaths.data();

  simulation = d3.forceSimulation(features)
  .force("y", d3.forceY(function(d) {
    return column_y ? scaleY(d[column_y]) : 500}).strength(5))
  .force("x", d3.forceX(function(d) { return scaleX(d[column_x]) }).strength(8))
  .force("collide", d3.forceCollide(7).radius(d=> d[radius_name]))
  .stop();

  for (var i = 0; i < 200; ++i) simulation.tick();

    allPaths
  .transition()
  .duration(800)
  // .attr('transform', function(d) { return 'translate(' +Math.round(d.x -d.centroid[0])+ ',' +Math.round(d.y - d.centroid[1]) + ')'})
  .attr('transform', function(d) { return moveToPoint2(d, [d.x, d.y])})
  .on('end', function(){
  pathsCount++;
  if (pathsCount >= pathsize){
    mapstate = 2
  }
})


  ;

}


d3.select('#display_proportional_circles_pop')
.on('click', function(){

d3.selectAll('#representation_carto .actionButton')
.style('color', 'black')
.style('background-color', '#fff')

d3.select('#display_proportional_circles_pop')
.style('color', '#fff')
.style('background-color', 'black')


allPaths.attr('visibility', 'visible')
  // transform_all_paths_to_circle('radius_pop')


d3.selectAll('#title_x, #title_y')
.style('visibility', 'hidden');

d3.select('g#axisLeft')
.remove()
d3.select('g#axisBottom')
.remove()

d3.selectAll('g#continent_labels')
.remove()
d3.selectAll('.labels_pays').remove()

radius_name = 'radius_pop'

transform_all_paths_to_circle(radius_name)


})


d3.select('#display_proportional_circles_gdp')
.on('click', function(){

d3.selectAll('#representation_carto .actionButton')
.style('color', 'black')
.style('background-color', '#fff')

d3.select('#display_proportional_circles_gdp')
.style('color', '#fff')
.style('background-color', 'black')


allPaths.attr('visibility', 'visible')
  // transform_all_paths_to_circle('radius_pop')


d3.selectAll('#title_x, #title_y')
.style('visibility', 'hidden');

d3.select('g#axisLeft')
.remove()
d3.select('g#axisBottom')
.remove()

d3.selectAll('g#continent_labels')
.remove()
d3.selectAll('.labels_pays').remove()


radius_name = 'radius_GDP'

transform_all_paths_to_circle(radius_name)


})


d3.select('#order_by_vax')
.on('click', function(){


d3.selectAll('#representation_carto .actionButton')
.style('color', 'black')
.style('background-color', '#fff')

d3.select('#order_by_vax')
.style('color', '#fff')
.style('background-color', 'black')

// if(radius_name == 'radius_GDP'){

// d3.select('#display_proportional_circles_gdp')
// .style('color', '#fff')
// .style('background-color', 'black')
// }

// else{
// d3.select('#display_proportional_circles_pop')
// .style('color', '#fff')
// .style('background-color', 'black')
// }

// changeYAxisScale([400,120000], 'log')

d3.selectAll('#title_x, #title_y')
.style('visibility', 'visible');


d3.selectAll('#title_x')
.html(`Population en millions <em style="font-size:.8em">(échelle log)</em>`);

d3.selectAll('g#continent_labels')
.remove()
d3.selectAll('.labels_pays').remove()

changeXAxisScale([100000,2500000000], 'log')

// changeYAxisScale([0,120000])

changeYAxisScale([400,120000], 'log')



makeScatterPlot('population', 'gdp_capita')


d3.selectAll('#axisBottom text').text(d=>_.round(d/1000000, 1) + " Million")

setTimeout(() => {  

let continent_labels = g.append('g').attr('id', 'continent_labels')

continent_labels
.append('line')
.attr('y1', 30)
.attr('y2', 980)
.attr('x1', (scaleX(2) + 45))
.attr('x2', (scaleX(2) + 45))
.attr('stroke', '#777')
.attr('stroke-dasharray', '4 4')
.style('stroke-width', '2.5px')

continent_labels
.append('text')
.text('2 tonnes')
.attr('x', (scaleX(2) + 45))
.attr('y', 20)
.attr('text-anchor', 'middle')
.style('font-size', '20px')
.style('fill', '#333')
.style('font-weight', 'bold')
.style('text-transform', 'uppercase');


}, 1000);

})





d3.select('#order_by_continent')
.on('click', function(){


d3.selectAll('#representation_carto .actionButton')
.style('color', 'red')
.style('background-color', '#fff')

d3.select('#order_by_continent')
.style('color', '#fff')
.style('background-color', 'red')


if(radius_name == 'radius_GDP'){

d3.select('#display_proportional_circles_gdp')
.style('color', '#fff')
.style('background-color', 'red')
}

else{
d3.select('#display_proportional_circles_pop')
.style('color', '#fff')
.style('background-color', 'red')
}


d3.select('g#axisLeft')
.remove()

d3.select('#title_x')
.text('PIB par habitant')
.style('visibility', 'visible');

d3.select('#title_y')
.style('visibility', 'hidden');

changeYAxisScale([0,10])


changeXAxisScale([0,100000])



d3.selectAll('g#continent_labels')
.remove()
d3.selectAll('.labels_pays').remove()

makeScatterPlot('gdp_capita', 'continent_num')

d3.select('g#axisLeft')
.remove()

let continent_labels = g.append('g').attr('id', 'continent_labels')


let line_v_padding= [0, -70, -20, -120, -50, -10]

let continent_vpadding_plus = {'Afrique':10, 'Amérique du Nord':0, 'Amérique du Sud':45, 'Asie':-50, 'Europe':20, 'Océanie':45}

continent_names.forEach(function(d,i){

  let padding_continents = d3.keys(continents_position)[i] == 'NA' ? 160 : (d3.keys(continents_position)[i] == 'OC' ? 25 : 0);

d3.selectAll('#axisBottom text').text(d=>d >= 1 ? String(d/1000) + ' 000' : d)

continent_labels
.append('text')
.text(d)
.attr('x', (scaleX(50000)))
.attr('y', scaleY(d3.values(continents_position)[i])-30 + continent_vpadding_plus[d])
.attr('text-anchor', 'middle')
.style('font-size', '32px')
.style('fill', '#333')
.style('font-weight', 'bold')
.style('text-transform', 'uppercase');

if (i != 0){

continent_labels
.append('line')
.attr('x1', 0)
.attr('x2', 1980)
.attr('y1', (scaleY(d3.values(continents_position)[i]) + line_v_padding[i]))
.attr('y2', (scaleY(d3.values(continents_position)[i]) + line_v_padding[i]))
.attr('stroke', '#777')
.attr('stroke-dasharray', '4 4')

}


} )

setTimeout(() => {  

// drawLabel('Qatar')
// drawLabel('Chine', -90)
// drawLabel('France', -10)
// drawLabel('États-Unis', -50)

// continent_labels
// .append('line')
// .attr('y1', 30)
// .attr('y2', 980)
// .attr('x1', (scaleX(2) + 45))
// .attr('x2', (scaleX(2) + 45))
// .attr('stroke', '#777')
// .attr('stroke-dasharray', '4 4')
// .style('stroke-width', '2.5px')

// continent_labels
// .append('text')
// .text('2 tonnes')
// .attr('x', (scaleX(2) + 45))
// .attr('y', 20)
// .attr('text-anchor', 'middle')
// .style('font-size', '20px')
// .style('fill', '#333')
// .style('font-weight', 'bold')
// .style('text-transform', 'uppercase');


}, 1000);



})

d3.select('#display_geo_paths')
.on('click', function(){

d3.selectAll('g#continent_labels')
.remove()
d3.selectAll('.labels_pays').remove()

d3.selectAll('#representation_carto .actionButton')
.style('color', 'black')
.style('background-color', '#fff')

d3.select('#display_geo_paths')
.style('color', '#fff')
.style('background-color', 'black')


allPaths.attr('visibility', 'visible')

d3.select('g#axisLeft')
.remove()
d3.select('g#axisBottom')
.remove()

d3.selectAll('#title_x, #title_y')
.style('visibility', 'hidden');

if (mapstate ==1){

redraw_paths(radius_name, 500)
}
else if (mapstate == 2){

redraw_paths(radius_name, 500)

}
 
})


// Ex : makeScatterPlot('deaths_for_100k', 'deaths_for_100k')

function makeScatterPlot(column_x, column_y){


/*console.log('making scatter mapstate : ' + mapstate)*/


drawAxisBottom()

drawAxisLeft()

if (mapstate == 0){

transform_all_paths_to_circle(radius_name, column_x, column_y)

}

else if (mapstate == 1){

force_separate_circles_for_scatter(column_x, column_y)
}

else if (mapstate == 2){

force_separate_circles_for_scatter(column_x, column_y)
}

}




Promise.all([
    // d3.csv("data/deaths_countries_last.csv")
 //   d3.csv("data/vaccination_monde.csv")
    d3.csv("data/pop_co2.csv"),
    d3.csv("data/soutien_ukraine_russie.csv")
]).then(function(files) {
  ready(files[0], files[1])
}).catch(function(err) {

  console.log(err)
})


  function ready(data, data_soutien) {

    // data.forEach(d => {
    //   d.ecart2020 = +d.ecart2020;
    //   d.moyenne_2018_2019 = +d.moyenne_2018_2019;
    //   d.progression_morts = +d.progression_morts;
    //   d.Densite = +d.Densite;
    //   d.population = +d.population;
    // })
    let obj_countries_gdp = {};

        data_soutien.forEach(d => {
      // d.deaths = +d.deaths;
      d.PIB_total = +d.PIB_total;
      obj_countries_gdp[d.country_code] = +d.PIB_total;
    })


    data.forEach(d => {
      // d.deaths = +d.deaths;
      d.population = +d.population;
      d.CO2 = +d.CO2;
      d.gdp_capita = +d.gdp_capita;
      d.CO2_capita = +d.Co2_capita;
      d.PIB_total = d3.keys(obj_countries_gdp).includes(d.code_country) ?  obj_countries_gdp[d.code_country] : 0;
    })

    data = data.filter(d=>d.code2d)

    // console.log(data0)
    console.log(data_soutien)
    console.log(data)


    data_ukraine = data_soutien

    app_data = data

    circleScalePop.domain(d3.extent(data, d=>d.population));

    circleScaleCO2.domain(d3.extent(data, d=>d.CO2));

    circleScaleGDP.domain([45, d3.max(data, d=>d.PIB_total)])

    let list_code_2d = data.map(d=>d.code2d)


    // allPaths2.filter(d=> d && list_code_2d.includes(d.id ))



    list_code_2d.forEach(d=>{
      d3.select('path#' + d).classed('to_keep', true)
    })

    svg.selectAll('path:not(.to_keep)').remove()

    allPaths = svg.selectAll('path.to_keep')

    let allSvgNodes = allPaths.nodes();


    // allPaths2.filter(d=> d && list_code_2d.includes(d.id ))

    var centroid_padding = {'US': [100,0],
    'CA': [-100,0],
    'RU': [-100,0]}

    for (i in allSvgNodes){
      let this_id = d3.select(allSvgNodes[i]).attr('data-id')
      let this_nom = d3.select(allSvgNodes[i]).attr('data-nom')
      let this_d = data.filter(d=> d[code_pays] == this_id)[0]
      // console.log(this_id, this_d)
      let this_pop = this_d ? this_d.population : 0;
      let this_country_code = this_d.code_country;
      // let this_deaths = this_d ? this_d.deaths : null;
      let CO2 = this_d.CO2;
      let CO2_capita = this_d.CO2_capita;
      let continent = this_d.continents_txt;
      let continent_num = continents_position[this_d.continent];
      let gdp_capita = this_d ? this_d.gdp_capita : 1;
      let PIB_total = this_d ? this_d.PIB_total : 0;
      let this_radius_random = Math.round(Math.random()*50);
      let this_radius_fixed = 10;
      let this_radius_pop = Math.round(circleScalePop(this_pop));
      let this_radius_co2 = Math.round(circleScaleCO2(CO2));
      let this_radius_GDP = Math.round(circleScaleGDP(PIB_total));
      // let this_radius_deaths= Math.round(circleScaleDeaths(this_deaths));
      let this_path_d = d3.select(allSvgNodes[i]).attr('d');
      let this_centroid = getBoundingBoxCenter(d3.select(allSvgNodes[i]));
      // console.log(this_centroid)
      if (d3.keys(centroid_padding).includes(this_id)){
        // console.log('US')
        // console.log(this_centroid)
        this_centroid[0] = this_centroid[0] + centroid_padding[this_id][0]
        this_centroid[1] = this_centroid[1] + centroid_padding[this_id][1]
        // console.log(this_centroid)
      }
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
        // 'deaths':this_deaths,
        'CO2':CO2,
        'CO2_capita':CO2_capita,
        'gdp_capita':gdp_capita,
        'PIB_total':PIB_total,
        'continent':continent,
        'continent_num':continent_num,
        'radius_pop': this_radius_pop,
        'radius_co2': this_radius_co2,
        'radius_GDP': this_radius_GDP,
        'country_code': this_country_code,
        // 'radius_deaths': this_radius_deaths,
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

  allPaths
  .style('fill', d => {


    let this_vote =  data_ukraine.filter(e=>e.country_code == d.country_code)[0]

    if (this_vote){
      
      return color_ukraine(this_vote.vote_ONU)
    }
    else{
      console.log(d)
      return 'white'
    }
    // if (typeof data.filter(function(e){return e.CodeDepartement == d.id})[0] !== 'undefined') {

      return color(d.CO2_capita)

    // }
    // return '#fff'
  })
  .style('fill-opacity', 1)
  .style('stroke', '#bbb')
  .style('stroke-width', 1)
  .style('stroke-opacity', 1)
  .on('mouseover', function(d) {
    show_tooltip(d)
    d3.select(this)
    // .raise()
    .style('fill-opacity', 1)
    // .style('stroke-opacity', 1)
    // .style('stroke-width', 3)
    // .style('stroke', '#aaa')
  })
  .on('mouseout', function(d) {
    hide_tooltip()
    d3.select(this)
    .style('fill-opacity', 1)
    // .style('stroke-opacity', 0.8)
    // .style('stroke-width', 1)
    // .style('stroke', '#bbb')
  })


// setTimeout(() => {

//   transform_all_paths_to_circle()
// mapstate = 1;
// },
//    500);



allPaths
.filter(d=>{
let this_e =  data_ukraine.filter(e=>e.country_code == d.country_code)[0]
return this_e.Visite_Poutine_ou_Lavrov
}).style('stroke', 'black').style('stroke-width', 4)
.raise()


// allPaths
// .filter(d=>{
// let this_e =  data_ukraine.filter(e=>e.country_code == d.country_code)[0]
// return this_e.Visite_representant_Moscou
// }).style('stroke', 'orange').style('stroke-width', 4)

// allPaths
// .filter(d=>{
// let this_e =  data_ukraine.filter(e=>e.country_code == d.country_code)[0]
// return this_e.Visite_Poutine_ou_Lavrov && this_e.Visite_representant_Moscou
// }).style('stroke', 'black').style('stroke-width', 4)


/// Adding labels



// let all_texts =  g.selectAll('text.country_labels').data(allPaths.data())
// all_texts.enter().append('text').attr('class', 'country_labels').text(d=>d.nom).attr('x', d=>d.centroid[0]).attr('y', d=>d.centroid[1])



}




// d3.selectAll('circle').filter(d=>d["Visite de Poutine ou de Lavrov"]).style('stroke', 'blue').style('stroke-width', 2)
// d3.selectAll('circle').filter(d=>d["Visite d'un représentant officiel à Moscou"]).style('stroke', 'orange').style('stroke-width', 2)
// d3.selectAll('circle').filter(d=>d["Visite de Poutine ou de Lavrov"] && d["Visite d'un représentant officiel à Moscou"]).style('stroke', 'black').attr('stroke-width', 2)

// New functions



// 'transform', d=> moveToPoint2(d, [scaleEurope(d.deaths_for_100k),150])

function moveToPoint2(d, newCoords){

return `translate(${g_x_translation_europe-d.centroid[0] + newCoords[0]}, ${g_y_translation_europe-d.centroid[1] + newCoords[1]})`

}

var scaleX = d3.scaleLinear()
.range(rangeX)
.domain([0, 40]);

var scaleY = d3.scaleLog(2)
.range(rangeY)
.domain([400, 130000]);


function changeYAxisScale(newScale, log){

if (log){
scaleY = d3.scaleLog(2)
.range(rangeY)
.domain(newScale)
}

else {
scaleY = d3.scaleLinear()
.range(rangeY)
.domain(newScale)

}

  scaleY.domain(newScale)

  g.select('g#axisLeft')
  .transition()
  .call(d3.axisLeft(scaleY).tickFormat(d=>formatNumber(d)))
}

function changeXAxisScale(newScale, log){

if (log){
scaleX = d3.scaleLog(2)
.range(rangeX)
.domain(newScale)
}

else {
scaleX = d3.scaleLinear()
.range(rangeX)
.domain(newScale)

}

  scaleX.domain(newScale)

  g.select('g#axisBottom')
  .transition()
  .call(d3.axisLeft(scaleX).tickFormat(d=>formatNumber(d)))
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
    .call(axisL.ticks(2));

d3.selectAll('#axisLeft .tick line')
.style('stroke', '#ccc')
.attr('x2', rangeX[1])


d3.select('#axisLeft path.domain')
.style('opacity', 0)

}




function drawAxisBottom(){

axisT = d3.axisTop(scaleX);


axisT.ticks(4)

d3.select('g#axisBottom')
.remove()

g.append("g")
.attr('class', 'axis')
.attr('id', 'axisBottom')
    .attr("transform", `translate(${g_x_translation_europe},${g_y_translation_europe + rangeY[1]})`)
    .call(axisT);

d3.selectAll('#axisBottom .tick line')
.style('stroke', '#ccc')
.attr('y2', rangeY[0])


d3.select('#axisBottom path.domain')
.style('opacity', 0)

}





function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}



var data_legend = [0,5,10,15,20,25,30,35];
var legend = d3.select('#legend .mapLegend .legendCells').selectAll('.cell')
.data(data_legend)

legend.exit().remove()


var legend_cells = legend
.enter()
.append('g')
.attr('class', 'cell')
.attr('transform', function(d, i){ return 'translate(' + i*46 + ',0)'})

legend_cells
.append('rect')
.attr('class', 'swatch')
.attr('height', 15)
.attr('width', 44)
.style('fill', function(d){ return color(d)})


legend_cells
.append('text')
.attr('class', 'label')
.attr('height', 15)
.attr('width', 44)
.style('text-anchor', 'middle')
.text(function(d){return d})
.attr('transform', 'translate(22,30)')


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

////////////////////////////////////
//////////////////////Tooltip

function show_tooltip(d) {




let this_code = d.id;

    let this_d = _.find(app_data, d => d[code_pays] == this_code);

    let this_d_ukraine =  data_ukraine.filter(e=>e.country_code == d.country_code)[0]

    if(this_d){

      // console.log(this_d)
    /*let this_deaths = this_d.deaths;*/
    let CO2_capita = this_d.CO2_capita;
    let CO2 = this_d.CO2;

    d3.select("#tooltip").style('display', 'block');

    var this_inner_html =  `<span class='details'><span class='tooltip_title'>${this_d.Pays}</span><br>
    Vote à l'Onu vis à vis de l'Ukraine : <span style="font-weight:bold">${this_d_ukraine.vote_ONU}</span><br>`

if(this_d_ukraine.Visite_Poutine_ou_Lavrov){
  this_inner_html += 'Poutine ou Lavrov se sont rendu officiellement dans le pays<br>'
}
// else{
// this_inner_html += 'Pas de visite diplomatique de la Russie<br>'
// }


this_inner_html += `Population : <span style="font-weight:bold">${_.round(d.population / 1000000, 1)} millions</span> d'habitants<br>
PIB par tête : <span style="font-weight:bold">${this_d.gdp_capita} $</span><br>
PIB par total : <span style="font-weight:bold">${_.round(this_d.PIB_total / 1000)} millions de $ </span><br>`


  var dx = d3.event.pageX;
  var dy = d3.event.pageY - 28;

    // var this_chart_width = Math.round(svgGraphContainer.node().getBBox().width);
    // var this_chart_right = d3.select('#morphocarte svg').node().getBoundingClientRect().right


d3.select("#tooltip")
.classed('is-active', true)
.html(this_inner_html);

// var thisTooltip = d3.select('#tooltip').node().getBoundingClientRect();

// if (dx > (this_chart_right - thisTooltip.width)){

// dx = (this_chart_right - thisTooltip.width - 10)

// }


// d3.select("#tooltip")
// .style("left", 0)
// .style("top", 0);


}

else
{
    d3.select("#tooltip").style('display', 'none');
}

}


function hide_tooltip() {

    d3.select("#tooltip")
    .classed('is-active', false);

    d3.select("#tooltip")
    .style('display', 'none');

}


function drawLabel(country, v_padding, label_bottom){

let this_d = d3.selectAll('path').filter(d=>d && d.nom == country).data()[0]

v_padding = v_padding ? v_padding : 0;

label_bottom = label_bottom ? -55 : 0;

g.append('text')
.attr('class', 'labels_pays')
.attr('text-anchor', 'middle')
.text(country)
.attr('x', this_d.x + 35)
.attr('y', this_d.y - 20 + v_padding)
.style('font-size', '24px')
.style('fill', '#333')
.style('font-weight', 'bold');

g.append('line')
.attr('class', 'labels_pays')
.attr('x1', this_d.x + 40)
.attr('x2', this_d.x + 40)
.attr('y1', this_d.y - 10 + v_padding + label_bottom)
.attr('y2', this_d.y + 15 + v_padding + label_bottom)
.attr('stroke', '#333')



}