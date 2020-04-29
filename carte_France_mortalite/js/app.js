var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;

// console.log(mainWidth)

var sliderTime = 10000;
var maptype = 'standard';
moment.locale('fr')

d3.select('svg#map_slider')
.style('width', (mainWidth > 1000 ? '1000px' : String(mainWidth) + 'px'));


d3.select('#slider_container')
.style('width', (mainWidth > 1000 ? '1000px' : String(mainWidth) + 'px'));

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
    t0 = parseTime('17/11/2018'),
    tMax,
    ticks_slider,
    svgmap,
    gmap,
    info_city,
    this_zoom_level = 4.6,
    thismaxZoom = 12,
    rectWidth = 10,
    minMaxRectWidth = [12,30],
    scaleWidth,
    thisMinZoom = 2,
    mapstate = 0;


var circleScale = 
d3.scaleSqrt()
.range([5, 40]);


    if($(window).width() >= 1000){

this_zoom_level = 6;
    }

    var mainColor = '#E3234A';


// var svg2 = d3.select("svg#map_slider");

// svg2.style('width', (width_slider + 0));

var articles = d3.select('div#articles')

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;


// set the ranges
var x = d3.scaleTime()
.range([0, width_slider_g])
.clamp(true);


var y = d3.scaleLinear()
    .range([height2, 0]);


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

// Set tooltips
const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(
    d =>{
      let this_code = d.properties.code;
      console.log(_.find(app_data, d => d.CodeDepartement == this_code))
      let this_d = _.find(app_data, d => d.CodeDepartement == this_code);
      let this_ecart = Math.round(this_d.ecart2020);
      let this_diff = this_ecart < 0 ? 'moins' : 'plus';

      return `<span class='details'>${
        d.properties.nom
      }<br><span style="font-weight:bold">${Math.abs(this_ecart)}</span> morts de <span style="font-weight:bold">${this_diff}</span> qu'en 2018- 2019</span>
      <br>Soit une progression de <span style="font-weight:bold">${_.round(this_d.progression_morts,1)}%</span></span>`
  })

const tip2 = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(
    d =>{
      let this_code = d.id;
      console.log(_.find(app_data, d => d.CodeDepartement == this_code))
      let this_d = _.find(app_data, d => d.CodeDepartement == this_code);
      let this_ecart = Math.round(this_d.ecart2020);
      let this_diff = this_ecart < 0 ? 'moins' : 'plus';

      return `<span class='details'>${
        this_d.Departement
      }<br><span style="font-weight:bold">${Math.abs(this_ecart)}</span> morts de <span style="font-weight:bold">${this_diff}</span> qu'en 2018- 2019</span>
      <br>Soit une progression de <span style="font-weight:bold">${_.round(this_d.progression_morts,1)}%</span></span>`
  })



d3.select('body').style('overflow', 'hidden')

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


// features

  // simulation = d3.forceSimulation(features)
  //     .force("y", d3.forceY(function(d) { return d.centroid[1] }).strength(5))
  //     .force("x", d3.forceX(function(d) { return d.centroid[0] }).strength(5))
  //     .force("collide", d3.forceCollide(9))
  //     .stop();

// for (var i = 0; i < 200; ++i) simulation.tick();

  // allpaths.transition().attr('transform', d => 'translate(' +d.vx + ',' +d.vy +')')

function transformToCircle(thisPath){

let thisCenter = getBoundingBoxCenter (thisPath);
let this_path_d = thisPath.attr('d');
let this_transformation = flubber.toCircle(this_path_d, thisCenter[0], thisCenter[1], 10);

thisPath
.transition()
.attrTween("d", function(){ return this_transformation });

}

function force_separate_circles(){

var features = d3.select(".carte svg").selectAll('path').data();

 simulation = d3.forceSimulation(features)
      .force("y", d3.forceY(function(d) { return d.centroid[1] }).strength(5))
      .force("x", d3.forceX(function(d) { return d.centroid[0] }).strength(5))
      .force("collide", d3.forceCollide(7).radius(d=> d.radius))
      .stop();

for (var i = 0; i < 200; ++i) simulation.tick();

d3.select(".carte svg").selectAll('path')
.transition().attr('transform', function(d) { return 'translate(' +Math.round(d.x -d.centroid[0])+ ',' +Math.round(d.y - d.centroid[1]) + ')'});

}

function registered_separate_circles(){

d3.select(".carte svg").selectAll('path')
.transition().attr('transform', function(d) { return 'translate(' +position_departements[d.id][0]+ ',' +position_departements[d.id][1] + ')'});

}


function redraw_paths(){

var allpaths = d3.select(".carte svg").selectAll('path');
let pathsize = allpaths.size();
let pathsCount = 0;
let departements_corrections = ['17', '56', '91', '92', '93', '94', '95', '75', '971'];

allpaths
.transition()
.duration(500)
.attrTween("d", function(d){ return d.from_circle_function})
.on('end', function(){
pathsCount++;
if (pathsCount >= pathsize){
  allpaths.filter(function(d){return departements_corrections.includes(d.id) }).attr("d", function(d){ return d.path})

allpaths
.transition()
.attr('transform', 'translate(0,0)')
}
})
;


}


function transform_all_paths_to_circle(){

let allpaths = d3.select(".carte svg").selectAll('path');

let pathsize = d3.select(".carte svg").selectAll('path').size();
let pathsCount = 0;
// console.log(allpaths)
allpaths.transition().attrTween("d", function(d){ return d.to_circle_function})
.on('end', function(){
pathsCount++;
if (pathsCount >= pathsize){
  registered_separate_circles()
}
})


// force_separate_circles()

}

d3.select('#display_proportional_circles')
.on('click', function(){

transform_all_paths_to_circle()

mapstate = 1;

})

d3.select('#display_geo_paths')
.on('click', function(){
redraw_paths()

mapstate = 0;
  
})



color2.domain([0, 1, 2, 4, 5]);

// const svg = d3
//   .select('#map')
//   .append('svg')
//   .attr('width', width)
//   .attr('height', height)
//   .call(responsivefy)
//   .append('g')
//   .attr('class', 'map');

const projection = d3
  .geoConicConformal()
    .center([2.454071, 46.279229])
    .scale(2600)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection)


const svg2 = d3.select(".carte svg").selectAll('path');






// svg.call(tip)

d3.select(".carte svg")
.call(tip2)

queue()
  .defer(d3.json, 'data/departements.json')
  // .defer(d3.tsv, 'data/world_population.tsv')
  // .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6YOcYH2GBljCvg2rXaPjWC2ibMV0upfMWd93kpQ6R8tO8mYtZt3y0SQNcRFI2K7aXyXNsgK5LGHnx/pub?gid=1360208169&single=true&output=csv')
  .defer(d3.csv, 'data/departements_morts_centres.csv')
  .await(ready)

function ready(error, geography, data) {


//     data.forEach(d => {
//     d.datetime = parseTime(d.date);
//   })

//   // console.log(data);


    data.forEach(d => {
    d.ecart2020 = +d.ecart2020;
    d.moyenne_2018_2019 = +d.moyenne_2018_2019;
    d.progression_morts = +d.progression_morts;
    d.Densite = +d.Densite;
    d.population = +d.population;
  })



circleScale.domain(d3.extent(data, d=>d.population));

let allSvgNodes = d3.select(".carte svg").selectAll('path').nodes();
for (i in allSvgNodes){
let this_id = d3.select(allSvgNodes[i]).attr('data-numerodepartement')
let this_pop = data.filter(d=> d.CodeDepartement == this_id)[0].population;
let this_radius = Math.round(circleScale(this_pop));
let this_path_d = d3.select(allSvgNodes[i]).attr('d');
let this_centroid = getBoundingBoxCenter(d3.select(allSvgNodes[i]));
let this_to_circle_function = flubber.toCircle(this_path_d, this_centroid[0], this_centroid[1], this_radius);
let this_from_circle_function = flubber.fromCircle(this_centroid[0], this_centroid[1], this_radius, this_path_d);

d3.select(allSvgNodes[i]).datum({'id': this_id, 'path': this_path_d, 'centroid': this_centroid, 
  'to_circle_function': this_to_circle_function,
'from_circle_function': this_from_circle_function,
'population':this_pop,
'radius': this_radius});
// console.log(d3.select(allSvgNodes[i]).attr('data-numerodepartement'))
}


    app_data = data;


// data = data.filter(function(d,i){return d.datetime });
// app_data = data;


// tMax = d3.max(data, function(d) { return d.datetime; })
// t0 = d3.min(data, function(d) { return d.datetime; })

// x.domain([t0 , tMax]);

// ticks_slider =  [x.ticks()[0], x.ticks()[x.ticks().length -1]];

console.log(data)

var progressionMax = d3.max(data, function(d) { return d.progression_morts; })


  // set the domain of the color scale based on our data
  color.domain([0, 13068161, 38463689, 70916439, 126804433, 201103330, 310232863, 1173108018, 1330141295]);

var myColor = d3.scaleLinear().domain([0,100])
  .range(["white", "#E3234A"])


  // svg
  //   .append('g')
  //   .attr('class', 'countries')
  //   .selectAll('path')
  //   .data(geography.features)
  //   .enter()
  //   .append('path')
  //   .attr('d', path)
  //   .style('fill', d => {

  //     if (typeof data.filter(function(e){return e.CodeDepartement == d.properties.code})[0] !== 'undefined') {

  //       return myColor(+data.filter(function(e){return e.CodeDepartement == d.properties.code})[0].progression_morts)

  //     }
  //     return '#fff'
  //   })
  //   .style('fill-opacity', 1)
  //   .style('stroke', 'lightgray')
  //   .style('stroke-width', 1)
  //   .style('stroke-opacity', 0.5)
  //   // tooltips
  //   .on('mouseover', function(d) {
  //     tip.show(d)
  //     d3.select(this)
  //       .style('fill-opacity', 1)
  //       .style('stroke-opacity', 1)
  //       .style('stroke-width', 2)
  //   })
  //   .on('mouseout', function(d) {
  //     tip.hide(d)
  //     d3.select(this)
  //       .style('fill-opacity', 1)
  //       .style('stroke-opacity', 0.5)
  //       .style('stroke-width', 1)
  //   })

  // svg
  //   .append('path')
  //   .datum(topojson.mesh(geography.features, (a, b) => a.id !== b.id))
  //   .attr('class', 'names')
  //   .attr('d', path)

// makeSlider()



svg2
.style('fill', d => {

      if (typeof data.filter(function(e){return e.CodeDepartement == d.id})[0] !== 'undefined') {

        return myColor(+data.filter(function(e){return e.CodeDepartement == d.id})[0].progression_morts)

      }
      return '#fff'
    })
    .style('fill-opacity', 1)
    .style('stroke', 'lightgray')
    .style('stroke-width', 1)
    .style('stroke-opacity', 0.5)
    .on('mouseover', function(d) {
      tip2.show(d)
      d3.select(this)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
        .style('stroke-width', 2)
    })
    .on('mouseout', function(d) {
      tip2.hide(d)
      d3.select(this)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 0.5)
        .style('stroke-width', 1)
    })


}



////////////////////////////// Slider  //////
//////////////////////////////////////////////////////////

function makeSlider (){

  var slider = svg2.append("g")
  .attr("class", "slider")
  .attr("transform", "translate(10,40)");

  slider.append("line")
  .attr("class", "track")
  .attr("x1", x.range()[0])
  .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  .attr("class", "track-inset")
  // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  // .attr("class", "track-overlay")
  .call(d3.drag()
    .on("start.interrupt", function() { slider.interrupt(); })
    .on("start drag", function() { moving_slider(x.invert(d3.event.x)); }));




slider.selectAll('rect.rectEvent')
.data(app_data)
.enter()
.append('rect')
.attr('class', 'rectEvent')
.attr('x', function(d){return x(d.datetime)})
.attr('y', -13)
.attr('width', '10px')
.attr('height', '25px')
.attr('fill', mainColor)
.style('pointer-events', 'none');


  var handle = slider.insert("g", ".track-overlay")
  .attr("class", "handle")
;

handle.append("rect")
.attr("width", 12)
.attr("height", 27)
.attr("y", -14)
.attr("x", -1)
;

slider
.append('g')
.attr('transform', 'translate(0, 40)')
.append('text')
.attr('class', 'dateSlider')
.attr('text-anchor', 'start')
.text(moment(t0, 'DD-MM-YYYY').format('LL'))
;


slider
.append('g')
.attr('transform', 'translate(' + width_slider_g + ', 40)')
.append('text')
.attr('class', 'dateSlider')
.attr('text-anchor', 'end')
.text('aujourd\'hui')
;

slider
.append('g')
.attr('transform', 'translate(' + width_slider_g/2 + ', -20)')
.append('text')
.attr('class', 'dateSlider currentDate')
.attr('text-anchor', 'middle')
.text(moment(t0, 'DD-MM-YYYY').format('LL'))
;
// Transitions

slider.transition() // Gratuitous intro!
.duration(sliderTime)
  .ease(d3.easePolyOut.exponent(5))
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

// updatemap()

populate_map(tMax, 0)



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

  d3.select('#play_button')
  .html('<img src="img/pause.svg">')
  .attr('class','pause');

  if (z_val == x(tMax)){
    var this_sliderTime = sliderTime;
    z_val = x(t0);
  }
  else{
    var this_sliderTime = sliderTime*((x(tMax) - z_val) /x(tMax));
  }

  slider.transition('chrono_animation')
  .duration(this_sliderTime)
  .ease(d3.easeLinear)
  .tween("moving_slider", function() {

    z_val = z_val == tMax ? t0 : z_val;
    var i = d3.interpolate(x.invert(z_val), tMax);
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



function moving_slider(h) {
  handle.attr("transform", "translate("+ x(h) +",0)");

  populate_map(h, 0)



}


d3.select('.handle').node().parentNode.appendChild(d3.select('.handle').node());

}



///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////POPULATING MAP


function populate_map(date_value, city, category){


  if (date_value){

d3.select('svg g.slider g text.currentDate')
.text(moment(date_value, 'DD-MM-YYYY').format('LL'))


  var filtered_data = _.cloneDeep(app_data).filter(function(d){ return d.datetime <= date_value});

  filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});

  // console.log(moment(date_value, 'DD-MM-YYYY').format('LL'))


fillMap(filtered_data)


  }
  
else if (category){


    var filtered_data = _.cloneDeep(app_data).filter(function(d){ return d.type_Array[0] == category});


    filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});


}

  else{

    d3.select("#cityTitle")
      .text(city);

      info_city.update(city)

      d3.select('.info.city.box')
      .style('display', 'none')

    var filtered_data = _.cloneDeep(app_data).filter(function(d){ return d.Lieu == city});

    // console.log(filtered_data)

    filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});

  }

}


function fillMap(filtered_data){


var thoseLocations =  _.uniqBy(filtered_data, function(d){return d.pays_iso}).map(function(d){return d.pays_iso});
let those_paths = svg.selectAll('g.countries path').filter(d => thoseLocations.includes(d.id));

those_paths
    .style('fill', d => {

        return color2(+(_.first(filtered_data.filter(function(e){return e.pays_iso == d.id}))).stade)

    })


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
              text = "Comment jour par jour, pays par pays, le confinement a gagné la planète entière https://www.liberation.fr/apps/2020/04/comment-le-confinement-a-gagne-la-planete/ via @libe",
              link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');

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
