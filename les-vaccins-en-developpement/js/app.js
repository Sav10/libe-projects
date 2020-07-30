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
mapstate = 0,
preclinic;

var circleScale = 
d3.scaleSqrt()
.range([5, 40]);

var circleScaleEcart = 
d3.scaleSqrt()
.range([0, 29]);


// const svg = d3.select(".carte svg");
// const allPaths = svg.selectAll('path');

// svg.style('max-height', $(window).height()*0.9 + 'px')

// window.addEventListener("resize", function(d){

//   svg.style('max-height', $(window).height()*0.9 + 'px')

// });


window.addEventListener("scroll", function(d){

  if (window.innerWidth < 800){

  var bandeau_postion = d3.select('#phases_img').node().getBoundingClientRect().bottom;

  var height_window = window.innerHeight;

  console.log(window.scrollY)

  if(window.innerHeight >= (bandeau_postion + 250) ){

if(d3.select('#conclusion').node().getBoundingClientRect().top <= (height_window + 100))
{
hide_bandeau ()

}
else{
// d3.select('#bandeau').style('display', 'block')
position_bandeau (window.scrollY)

}

  }

else{
// d3.select('#bandeau').style('display', 'none')
hide_bandeau ()

}

}

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

 
var svg_semi_circle =  `<svg x="0px" y="0px" viewBox="0 0 156 81" style="enable-background:new 0 0 156 81;" xml:space="preserve">
<style type="text/css">
  .st0{fill:none;stroke:#231F20;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity: 1;}
  .st1{fill:none;stroke:#231F20;stroke-width:3;stroke-miterlimit:10;stroke-opacity: 1;}
</style>
<g id="parts">
  <path id="approuve" class="st0" d="M78.34,69.86l51.09-37.12c8.2,11.29,12.06,23.17,12.06,37.12L78.34,69.86z"/>
  <path id="phase3" class="st0" d="M78.34,69.86L97.85,9.8c13.27,4.31,23.38,11.65,31.58,22.94L78.34,69.86z"/>
  <path id="phase2" class="st0" d="M78.34,69.86L58.82,9.8c13.27-4.31,25.76-4.31,39.03,0L78.34,69.86z"/>
  <path id="phase1" class="st0" d="M78.34,69.86L27.25,32.75c8.2-11.29,18.31-18.63,31.57-22.94L78.34,69.86z"/>
  <path id="preclinique" class="st0" d="M78.34,69.86l-63.15,0c0-13.95,3.86-25.83,12.06-37.12L78.34,69.86z"/>
</g>
<path id="contour" class="st1" d="M129.43,32.74c-8.2-11.29-18.31-18.63-31.58-22.94c-13.27-4.31-25.76-4.31-39.03,0
  S35.45,21.46,27.25,32.75c-8.2,11.29-12.06,23.17-12.06,37.12l63.15,0l63.15,0C141.49,55.91,137.63,44.03,129.43,32.74z"/>
</svg>`


function position_bandeau (){

d3.select('#bandeau')
.style('visibility', 'visible')

var height_bandeau = d3.select('#bandeau img').node().getBoundingClientRect().height;
var height_window = window.innerHeight;

d3.select('#bandeau')
.style('top', Math.round((height_window - height_bandeau - 47)) + 'px')

}


function hide_bandeau (){

// var height_window = window.innerHeight;

// d3.select('#bandeau')
// .style('top', Math.round((height_window +800)) + 'px')

d3.select('#bandeau')
.style('visibility', 'hidden')


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
    <br>Taux d'incidence : <span style="font-weight:bold">${this_d.taux_incidence}</span>
    <br>Taux de reproduction effectif : <span style="font-weight:bold">${this_d.tauxReproductionEffectif}</span>
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


const colorbar = {
'-1':"#fff",
'0':"#fff",
'1':"#FDE3D8",
'2':"#F9C4AF",
'3':"#F08262",
'4':"#E30613"
}


const colorParts = {
'Inactivated': "#e10e20",
'Non- Replicating Viral Vector': "#ffb400",
"RNA": "#75398a",
'DNA': "#eb70a5",
"Protein Subunit": "#01b2e8",
"VLP": "#0058a2"

}


function part_opacity(phase, d){

if (phase == 'preclinique'){
  return 1
}

var encours = d['Stade en cours'].split(' et ')

if (phase == 'phase1'){

if (+d['Dernier stade complété'] >= 1){return 1}

if (encours.includes("1")){ return 0.5}
else{return 0}
  
}

else if (phase == 'phase2'){
if (+d['Dernier stade complété'] >= 2){return 1}

if (encours.includes("2")){ return 0.5}
else{return 0}

}

else if (phase == 'phase3'){
if (+d['Dernier stade complété'] >= 3){return 1}

if (encours.includes("3")){ return 0.5}
else{return 0}

}

else if (phase == 'approuve'){
if (+d['Dernier stade complété'] >= 4){return 1}

if (encours.includes("approuve")){ return 0.5}
else{return 0}

}


}


function last_encours(stade_en_court){

var encours = stade_en_court.split(' et ')

if (encours.includes("4")){ return 4}
else if (encours.includes("3")){ return 3}
else if (encours.includes("2")){ return 2}
else if (encours.includes("1")){ return 1}

}


var barscale = d3.scaleLinear()
.range([0, 100])


function fillColor(column){

  allPaths
  .style('fill', d => {

    if (typeof app_data.filter(function(e){return e.dep == d.id})[0] !== 'undefined') {

      return color_functions[column](+app_data.filter(function(e){return e.dep == d.id})[0][column])

    }
    return '#fff'
  })

}


queue()
  // .defer(d3.json, 'data/departements.json')
  // .defer(d3.tsv, 'data/world_population.tsv')
  // .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6YOcYH2GBljCvg2rXaPjWC2ibMV0upfMWd93kpQ6R8tO8mYtZt3y0SQNcRFI2K7aXyXNsgK5LGHnx/pub?gid=1360208169&single=true&output=csv')
  // .defer(d3.csv, 'data/departements_morts_centres.csv')
  .defer(d3.csv, 'data/data.csv')
  .await(ready)

  function ready(error, data) {

    // data.forEach(d => {
    //   d.P = +d.P;
    //   d.T = +d.T;
    //   d.taux_de_positivite = +d.taux_de_positivite;
    //   d.taux_incidence = +d.taux_incidence;
    //   d.tauxReproductionEffectif = +d.tauxReproductionEffectif;
    //   d.tauxOccupationRea = +d.tauxOccupationRea;
    //   d.progression_morts = +d.progression_morts;
    //   d.Densite = +d.Densite;
    //   d.population = +d.population;
    // })

    data.forEach(d => {
      d['last_encours'] = last_encours(d['Stade en cours']);
      d['encours_for_bar'] = d['last_encours'] == 4 ? 3 : d['last_encours'];
      d['Dernier stade complété'] = +d['Dernier stade complété']
    })


preclinic =  data.filter(function(d) { return d['Nombre de vaccins en phase pre-clinique']})[0]['Nombre de vaccins en phase pre-clinique']

   var data_bar = d3.entries(_.countBy(data, 'encours_for_bar'))

   data_bar.push({key:'-1', value:+preclinic})

   data_bar.push({key:'4', value:data.filter(function(d){return d['Dernier stade complété'] == 4}).length})



   drawBar(data_bar)


drawCircles(data)

}


function drawBar(databar){

databar.sort(function(a,b){return a.key - b.key})


d3.select('#preclinictext').text(databar.filter(function(d){return d.key == -1})[0].value)
d3.select('#phase1text').text(databar.filter(function(d){return d.key == 1})[0].value)
d3.select('#phase2text').text(databar.filter(function(d){return d.key == 2})[0].value)
d3.select('#phase3text').text(databar.filter(function(d){return d.key == 3})[0] ? databar.filter(function(d){return d.key == 3})[0].value : 0)
d3.select('#approuvedtext').text(databar.filter(function(d){return d.key == 4})[0] ? databar.filter(function(d){return d.key == 4})[0].value : 0)

databar = databar.filter(function(d){return d.value})

console.log(databar)


barscale
.domain([0, d3.sum(databar, function(d){return d.value})])


var uniqbar = d3.select('#bar_phases').selectAll('div.bar_part').data(databar)

uniqbar
.enter()
.append('div')
.attr('class', 'bar_part')
// .style('height', '40px')
.style('width', function(d){console.log(barscale(d.value));  return barscale(d.value) + '%'})
.style('background-color', function(d){return colorbar[d.key]})
// .style('display', 'inline-block')




}


function drawCircles(datacircles){

console.log(datacircles)


datacircles.sort(function(a,b){return b['Dernier stade complété'] - a['Dernier stade complété']})

datacircles.sort(
   function(a, b) {          
      if (a['Dernier stade complété'] === b['Dernier stade complété']) {
         return b.last_encours - a.last_encours;
      }
      return b['Dernier stade complété'] - a['Dernier stade complété'] ;
   });


var circleBoard =  d3.select('#dashboard_vaccins').selectAll('div.semicircle').data(datacircles);



circleBoard
.enter()
.append('div')
.attr('class', 'semicircle')


circleBoard =  d3.select('#dashboard_vaccins').selectAll('div.semicircle')

circleBoard
.html(svg_semi_circle)
.datum(function(d){return d})

circleBoard
.append('p')
.text(function(d){return d.Developer})



circleBoard
.select('svg #parts').selectAll('path')
.style('fill', function(){
var d = d3.select(this.parentNode).datum();
 return colorParts[d.Platform]})
.style('fill-opacity', function(){
var phase = d3.select(this).attr('id');
var d = d3.select(this.parentNode).datum();
 return part_opacity(phase, d)})
.style('stroke-opacity', function(){
var phase = d3.select(this).attr('id');
var d = d3.select(this.parentNode).datum();
 return part_opacity(phase, d) <= 0.5 ? 0.3 : 1})





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
