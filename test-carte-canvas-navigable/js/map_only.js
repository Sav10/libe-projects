var margin = { top: 10, right: 90, bottom: 130, left: 70 },
width = 600 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom,
widthHandle = 10,
radiusHandle = 12,
handleHeight = 10,
bandwidth = 6,
transition_duration = 300,
gbar,
data_chart,
data_full = {},
active_year = 'y2024Eur',
colorNames = {},
candidats_panneaux = {},
percentageCalculated = 0,
mymap,
markerGroup,
chart_made = 0,
data_loaded = {y2017:0, y2012:0, y2022:0, y2022T2:0, y2024Eur:1},
automatic_chart_update = 0,
update_source_event = 0,
competitors_pannels = {},
T2_clicked = 0,
xScale_canvas,
yScale_canvas,
all_map_points = [],
maxRScaleCanvas,
canvasChart,
canvaschartWidth,
canvaschartHeight,
canvasNode,
redrawPoints;

let this_globalAlpha


let this_pixelratio = window.devicePixelRatio

let context
// let hiddenContext

var margin_progress = { top: 10, right: 70, bottom: 10, left: 180 },
width_progress = 600 - margin_progress.left - margin_progress.right,
height_progress = 100 - margin_progress.top - margin_progress.bottom;

var marginSlider = { top: -40, right: 18, bottom: 40, left: 20 },
    widthSlider = 300,
    heightSlider = 900,
    bandwidthSlider = 10,
    textPaddingSlider = 25,
    paddingSlider = 1.1;


let colorToPoint = {}
// const { offsetX = null, offsetY = null } = mouseEvent;


colorNames['y2017']  = {
  "Dupont-Aignan":"#75398a",
  "Le Pen":"#2e2b5a",
  "Macron":"#ffb400",
  "Hamon":"#d82c5d",
  "Lassalle":"#e85d21",
  "Fillon":"#0058a2",
  "Mélenchon":"#e10f21",
  "Poutou":"#961e1e",
  "Arthaud": "#781f1c",
  "Cheminade": "#75398a",
  "Asselineau": "#75398a",
  'a': 'a'
};


colorNames['y2012']  = {
  "DUPONT-AIGNAN":"#75398a",
  "LE PEN":"#2e2b5a",
  "JOLY":"#52ae56",
  "HOLLANDE":"#d82c5d",
  "BAYROU":"#e85d21",
  "SARKOZY":"#0058a2",
  "MÉLENCHON":"#e10f21",
  "POUTOU":"#961e1e",
  "ARTHAUD": "#781f1c",
  "CHEMINADE": "#75398a",
  'a': 'a',
  'b': 'b'
};


colorNames['y2021']  = 
{'Extrême droite': '#14152d',
 'Ecologistes': '#42b38e',
 "Union de la gauche": '#eb6184',
 "Union de la droite": '#38529c',
 "Union du centre": '#ec9528',
 "Extrême gauche": '#761519',
 "Union de la gauche et des écologistes": '#BD6277',
 "Union du centre et de la droite": '#7993ca',
 'Régionalistes': '#cfb096',
'a': 'a',
'b': 'b'}


colorNames['y2022'] = {
"MACRON":'#F7BA00',
"DUPONT-AIGNAN":'#19325D',
"LE PEN":'#1D2245',
'POUTOU': "#911D16",
'MÉLENCHON': "#e10f21",
'LASSALLE': "#534384",
'PÉCRESSE': "#2458A5",
'ZEMMOUR': "#654235",
'JADOT': "#00A85C",
'ARTHAUD': '#751F17',
'HIDALGO': '#EC4C6B',
'ROUSSEL': '#D80000'
}


colorNames['y2022T2'] = {
"MACRON":'#F7BA00',
"LE PEN":'#1D2245',
  'a': 'a',
  'b': 'b',
  'c': 'c',
  'd': 'd',
  'e': 'e',
  'f': 'f',
  'g': 'g',
  'h': 'h',
  'i': 'i',
  'j': 'j'
}

colorNames['y2024Eur'] = {
  'Reconquête': '#634231',
 'LFI': '#FF0000',
 'RN': '#422C21',
 'Écologistes': '#48B17C',
 'Animalistes': '#C6C6C6',
 'Renaissance, Modem': '#A8CBEC',
 'UPR': '#005A68',
 'LR': '#5488C7',
 'PS - Place publique': '#EE7679',
 'Résistons': '#6B612D',
 'PCF': '#C90B1B',
 'Écologie au centre': '#9185BE'}


const color_panneaux_2024 = {'1': '#634231',
 '2': '#FF0000',
 '3': '#422C21',
 '4': '#48B17C',
 '5': '#C6C6C6',
 '6': '#A8CBEC',
 '7': '#005A68',
 '8': '#5488C7',
 '9': '#EE7679',
 '10': '#6B612D',
 '11': '#C90B1B',
 '12': '#9185BE'}




candidats_panneaux['y2024Eur'] = {
  '1': {'score': 0, 'name': 'Reconquête', 'parti': 'Reconquête'},
 '2': {'score': 0,
  'name': 'LFI',
  'parti': 'LFI'},
 '3': {'score': 0,
  'name': 'RN',
  'parti': 'RN'},
 '4': {'score': 0, 'name': 'Écologistes', 'parti': 'Écologistes'},
 '5': {'score': 0, 'name': 'Animalistes', 'parti': 'Animalistes'},
 '6': {'score': 0,
  'name': 'Renaissance, Modem',
  'parti': 'Renaissance, Modem'},
 '7': {'score': 0,
  'name': 'UPR',
  'parti': 'UPR'},
 '8': {'score': 0, 'name': 'LR', 'parti': 'LR'},
 '9': {'score': 0,
  'name': 'PS - Place publique',
  'parti': 'PS - Place publique'},
 '10': {'score': 0, 'name': 'Résistons', 'parti': 'Résistons'},
 '11': {'score': 0,
  'name': 'PCF',
  'parti': 'PCF'},
 '12': {'score': 0,
  'name': 'Écologie au centre',
  'parti': 'Écologie au centre'}}



candidats_panneaux['y2022'] = {
    '1': {'score': 0,  'name': 'ARTHAUD',  'parti': 'Lutte ouvrière'},
 '2': {'score': 0, 'name': 'ROUSSEL', 'parti': 'Parti communiste'},
 '3': {'score': 0,  'name': "MACRON",  'parti': "En marche !"},
 '4': {'score': 0,  'name': "LASSALLE",  'parti': "Résistons"},
 '5': {'score': 0,  'name': "LE PEN",  'parti': "Rassemblement National"},
 '6': {'score': 0,  'name': "ZEMMOUR",  'parti': "Reconquête"},
 '7': {'score': 0,  'name': "MÉLENCHON",  'parti': "La France insoumise"},
 '8': {'score': 0,  'name': "HIDALGO",  'parti': "Parti socialiste"},
'9': {'score': 0,  'name': "JADOT",  'parti': "Les Verts"},
 '10': {'score': 0,  'name': "PÉCRESSE",  'parti': "Les Républicains"},
 '11': {'score': 0,  'name': 'POUTOU',  'parti': 'Nouveau Parti anticapitaliste'},
'12': {'score': 0,  'name': 'DUPONT-AIGNAN',  'parti': 'Debout la France'}
}

candidats_panneaux['y2022T2'] = {
 '3': {'score': 0,  'name': "MACRON",  'parti': "En marche !"},
 '5': {'score': 0,  'name': "LE PEN",  'parti': "Rassemblement National"},
'100': {'score': 0,  'name': 'a',  'parti': 'a'},
'101': {'score': 0,  'name': 'b',  'parti': 'b'},
'102': {'score': 0,  'name': 'c',  'parti': 'c'},
'103': {'score': 0,  'name': 'd',  'parti': 'd'},
'104': {'score': 0,  'name': 'e',  'parti': 'e'},
'105': {'score': 0,  'name': 'f',  'parti': 'f'},
'106': {'score': 0,  'name': 'g',  'parti': 'g'},
'107': {'score': 0,  'name': 'h',  'parti': 'h'},
'108': {'score': 0,  'name': 'i',  'parti': 'i'},
'109': {'score': 0,  'name': 'j',  'parti': 'j'}
}


candidats_panneaux['y2017'] = {
  "1":{"score": 0, "name": "Dupont-Aignan", "parti": "Debout la France"},
  "2":{"score": 0, "name": "Le Pen", "parti": "Front National"},
  "3":{"score": 0, "name": "Macron", "parti": "En marche !"},
  "4":{"score": 0, "name": "Hamon", "parti": "Parti socialiste"},
  "5":{"score": 0, "name": "Arthaud", "parti": "Lutte ouvière"},
  "6":{"score": 0, "name": "Poutou", "parti": "Nouveau Parti anticapitaliste"},
  "7":{"score": 0, "name": "Cheminade", "parti": "Solidarité et progrès"},
  "8":{"score": 0, "name": "Lassalle", "parti": "Résistons"},
  "9":{"score": 0, "name": "Mélenchon", "parti": "La France insoumise"},
  "10":{"score": 0, "name": "Asselineau", "parti": "Union Populaire Républicaine"},
  "11":{"score": 0, "name": "Fillon", "parti": "Les Républicains"},
'100': {'score': 0,  'name': 'a',  'parti': 'a'}
}


candidats_panneaux['y2012'] = {
  "9":{"score": 0, "name": "DUPONT-AIGNAN", "parti": "Debout la France"},
  "2":{"score": 0, "name": "LE PEN", "parti": "Front National"},
  "1":{"score": 0, "name": "JOLY", "parti": "Les verts"},
  "10":{"score": 0, "name": "HOLLANDE", "parti": "Parti socialiste"},
  "6":{"score": 0, "name": "ARTHAUD", "parti": "Lutte ouvière"},
  "5":{"score": 0, "name": "POUTOU", "parti": "Nouveau Parti anticapitaliste"},
  "7":{"score": 0, "name": "CHEMINADE", "parti": "Solidarité et progrès"},
  "8":{"score": 0, "name": "BAYROU", "parti": "Modem"},
  "4":{"score": 0, "name": "MÉLENCHON", "parti": "La France insoumise"},
  "3":{"score": 0, "name": "SARKOZY", "parti": "UMP"},
'100': {'score': 0,  'name': 'a',  'parti': 'a'},
'101': {'score': 0,  'name': 'b',  'parti': 'b'}}

competitors_pannels['y2017'] = ['2', '3', '4', '9', '11'];

competitors_pannels['y2017T2'] = ['1', '2'];

competitors_pannels['y2012'] = ['2', '3', '4', '8', '10'];

// competitors_pannels['y2021'] = ['23', '5', '30'];

var candidats_names = {
  'macron':'Macron',
'lePen':'le Pen',
'melenchon':'Mélenchon',
'fillon':'Fillon',
'dupontAignan':'Dupont-Aignan',
'lassalle':'Lassalle',
'poutou':'Poutou',
'asselineau':'Asselineau',
'arthaud':'Arthaud',
'cheminade':'Cheminade'
}

var slider_variables = [
{'name':'popTotale', 'label':'Nombre d\'habitants', 'maxDomain': 100000, 'suffix':'', 'postsuffix':' ou plus'},
{'name':'TauxChomage', 'label':'Taux de chômage', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'taux65Plus', 'label':'Proportion de 65 ans et plus', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'TauxAgricuteurs', 'label':'Proportion d\'agriculteurs', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'TauxCadres', 'label':'Proportion de cadres superieurs', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'TauxOuvriers', 'label':'Proportion d\'ouvriers', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'TauxAbstention', 'label':'Taux Abstention', 'maxDomain': 100, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'ScoreFillonT1', 'label':'Score de Fillon en 2017', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'ScoreMelenchonT1', 'label':'Score de Mélenchon en 2017', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'ScoreMacronT1', 'label':'Score de Macron en 2017', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'ScoreMacronT12022', 'label':'Score de Macron en 2022', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'ScoreLepenT12022', 'label':'Score de Le Pen au en 2022', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'ScoreMelenchonT12022', 'label':'Score de Mélenchon en 2022', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'}
];


var progressionT2_variables = [
{'name':'progressionMacron', 'label':'Progression de Macron', 'percentage':0, 'value':0, 'name_' : 'Macron'},
{'name':'progressionLePen', 'label':'Progression de le Pen', 'percentage':0, 'value':0, 'name_' : 'Le Pen'}
];

var table_variables = [
{'name':'exprimes', 'label':'Exprimés'},
{'name':'inscrits', 'label':'Inscrits'},
{'name':'votants', 'label':'Votants'},
{'name':'blancs', 'label':'Blancs ou nuls'}
];



function* rgbColorGenerator() {
  let nextColor = 1;
  const nextColorStep = 50;

  while (nextColor < 16777216) {
    const rgb = [];

    rgb.push(nextColor & 0xff); // R.
    rgb.push((nextColor & 0xff00) >> 8); // G.
    rgb.push((nextColor & 0xff0000) >> 16); // B.

    nextColor += nextColorStep;
    yield `rgb(${rgb.join(',')})`;
  }
}

// const hiddenCanvasColor = rgbColorGenerator();


/*d3.select('.chart')
.select('svg')
.append('g')
.attr('transform', 'translate(200,30)')
.append('text')
.attr('class', 'graphtitle score')
.text('Score');*/

/*d3.select('.chart')
.select('svg')
.append('g')
.attr('transform', 'translate(200,460)')
.append('text')
.attr('class', 'graphtitle progression')
.text('Progression');*/

var xScale = d3.scaleLinear()
    .range([0, width-100]);

var xScaleT2 = d3.scaleLinear()
    .range([0, width-200]);

var yScale = d3.scaleBand()
    .padding(0.2)
    .paddingInner(0.3);

var yScale_progress = d3.scaleBand()
    .padding(0.2)
    .paddingInner(0.2);

var xScale_progress = d3.scaleLinear()
    .range([0, width_progress])
    .domain([0, 50]);

var yScale_sliders = d3.scaleBand()
    .padding(paddingSlider)
    .domain(slider_variables.map(function(d) {
        return d.name
    }))
    .range([0, heightSlider]);

var xScale_slider = d3.scaleLinear()
    .range([0, widthSlider])
    .domain([0, 100]);

// svg.call(yAxis);


// d3.queue()
//     .defer(d3.csv, 'data/data_2024_europeennes.csv')
//     .await(LoadData);


Promise.all([
    d3.csv("data/data_2024_europeennes.csv")
]).then(function(files) {
  LoadData(files[0])
}).catch(function(err) {
  console.log(err)
})




function makeCanvasMap(this_data){


correct_change_height = this_data.length < 30000 ? 80 : 20;


console.log(this_data)

d3.select('.chart #map').remove()

d3.select('.chart')
.insert("div",":first-child")
.attr('id', 'map')

const container = d3.select('#map')

// console.log(container.node())
/*
container
.append('p')
.text('Localisation des villes sélectionnées')*/

let this_margin_left = 30

const this_margin_top = 50

let this_width =  1000


if (parseInt(d3.select('body').style('width')) < 1000){
this_width =  Math.round(parseInt(d3.select(".chart").style("width"))*.7)

}

if (this_width < 250){
this_width = 250
this_margin_left = 0

}

if (this_width < 250){
this_width = 250
this_margin_left = 0

}


canvasChart = container.append('canvas')
.attr('width', this_width)
.attr('height', this_width)
.style('margin-left', this_margin_left + 'px')
.style('margin-top', this_margin_top + 'px')
.attr('class', 'canvas-plot');


canvasNode =  canvasChart.node()


canvaschartWidth = this_width
canvaschartHeight = this_width


// context = canvasChart.node().getContext('2d');
// hiddenContext = canvasChart.node().getContext('2d');

const pointColor = '#3585ff'

    var xScale_factor = d3.scaleLinear()
    .domain([250,700])
    .range([0.2, 0.6]);

    var yScale_factor = d3.scaleLinear()
    .domain([250,700])
    .range([12, 25]);

    var rScale_canvas = d3.scaleSqrt()
    .domain([7, 1328054])
    .range([xScale_factor(this_width), yScale_factor(this_width)]);

    maxRScaleCanvas = yScale_factor(this_width)

    xScale_canvas = d3.scaleLinear()
    .domain([-5.2,8.5])
    .range([0, this_width]);

    yScale_canvas = d3.scaleLinear()
    .domain([41.4,51.5])
    .range([this_width, 0]);


// map_points_sel.sort((a,b)=>a[2] - b[2])


this_data = this_data.sort((a,b)=>b.inscrits - a.inscrits)


initiate_canvasanddraw()





// function drawHiddenPoint(d) {

//   let hiddenColor = hiddenCanvasColor.next().value;

//    hiddenContext.beginPath();
//    hiddenContext.globalAlpha = 0
//    hiddenContext.fillStyle = hiddenColor

//    const px = xScale_canvas(d.longitude);
//    const py = yScale_canvas(d.latitude) + correct_change_height;
//    let this_radius = rScale_canvas(d.inscrits)

//    hiddenContext.arc(px, py, this_radius, 0, 2 * Math.PI,true);
   
//    hiddenContext.fill();

//    colorToPoint[hiddenColor]  = d

// }


function initiate_canvasanddraw(this_ratio){


let scale = 3


canvasNode.style.width = parseInt(canvaschartWidth) + 'px';
canvasNode.style.height = parseInt(canvaschartHeight) + 'px';

canvasChart.clientWidth = canvaschartWidth

canvasChart.clientHeight = canvaschartHeight


canvasNode.width = canvaschartWidth* scale;
canvasNode.height = canvaschartHeight * scale;


context = canvasNode.getContext('2d');

context.scale(scale, scale);


  this_globalAlpha = 0.7

//   if (this_ratio && this_ratio > 1){

// this_globalAlpha = 0.7 + (this_ratio-1)/4
// this_globalAlpha = this_globalAlpha > 1 ? 1 : this_globalAlpha;

//   }

// See here globalCompositeOperation property
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
// thisGlobalCompositeOperation = this_globalAlpha >=1 ? 'source-over' : "multiply";

  thisGlobalCompositeOperation = "multiply"

   context.globalCompositeOperation = thisGlobalCompositeOperation
   context.globalAlpha = this_globalAlpha


   // context.scale(2,2)


   all_map_points = []  

this_data.forEach(function(d, i) {



   drawPoint(d, i, this_ratio);
});

}

function drawPoint(d, i) {

   // context.beginPath();
 
   const px = xScale_canvas(d.longitude);
   const py = yScale_canvas(d.latitude) + correct_change_height;
   let this_radius = rScale_canvas(d.inscrits)/(this_pixelratio*1.3)

   // context.arc(px, py, this_radius, 0, 2 * Math.PI,true);
   all_map_points.push([px, py, this_radius, i])
   // context.fill();

const circle = new Path2D();
circle.arc(px, py, this_radius, 0, 2 * Math.PI,true);


context.fillStyle = color_panneaux_2024[d['entete']]
context.fill(circle)

}



d3.select(context.canvas).on('mousemove', (event) => {

    const mouseEvent = event;
    // console.log(d3.event)
    const { offsetX, offsetY } = mouseEvent;
    // const { data } = hiddenContext.getImageData(offsetX, offsetY, 1, 1);
    // const colorKey = `rgb(${data[0]},${data[1]},${data[2]})`;
    let map_points_sel = all_map_points.filter(d=>pointInsideCircle(d[0], d[1], offsetX, offsetY, maxRScaleCanvas))
    map_points_sel = map_points_sel.sort((a,b)=>a[2] - b[2])
    let singlePoint = map_points_sel.filter(d=>pointInsideCircle(d[0], d[1], offsetX, offsetY, d[2]))[0]

    // const point = colorToPoint[colorKey];
    // console.log(point)



    // draw(mouseEvent);

    if (singlePoint) {
      // showTooltip(point);
      console.log(this_data[singlePoint[3]].ville)

  showTip(this_data[singlePoint[3]], [offsetX, offsetY], event)


      if (window.devicePixelRatio != this_pixelratio){

        this_pixelratio = window.devicePixelRatio

        redrawPoints(this_pixelratio)

      }

    } else {
      // hideTooltip();

d3.select('#map_info')
.style('visibility', 'hidden')

d3.select('#tooltip')
.style('display', 'none')


    }

  })

redrawPoints = function (this_ratio) {
  

 context.clearRect(0,0, 1000, 1000)

initiate_canvasanddraw(this_ratio)

}


}






function pointInsideCircle(x, y, cx, cy, radius) {
    const distance =
        Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    return distance < radius;
}



function LoadData(data, json_data) {

    // Pas d'arrondissement



    data = data.filter(function(d) {
        return d.code_insee.indexOf('AR') == -1
    });

    if (active_year == 'y2017T2') {


    } 

    else if (active_year == 'y2022') {



    }

    else if (active_year == 'y2022T2') {


    }


    else if (active_year == 'y2024Eur') {

        data.forEach(function(d) {
            d['1'] = +d['1'];
            d['2'] = +d['2'];
            d['3'] = +d['3'];
            d['4'] = +d['4'];
            d['5'] = +d['5'];
            d['6'] = +d['6'];
            d['7'] = +d['7'];
            d['8'] = +d['8'];
            d['9'] = +d['9'];
            d['8'] = +d['8'];
            d['10'] = +d['10'];
            d['11'] = +d['11'];
            d['12'] = +d['12'];
            d.departement = d.code_insee[0] + d.code_insee[1];
            d.popTotale = +d.popTotale;
            d.taux65Plus = +d.taux65Plus;
            d.TauxAgricuteurs = +d.TauxAgricuteurs;
            d.TauxCadres = +d.TauxCadres;
            d.TauxChomage = +d.TauxChomage;
            d.TauxOuvriers = +d.TauxOuvriers;
            d.TauxRetraites = +d.TauxRetraites;
            d.exprimes = +d.exprimes;
            d.inscrits = +d.inscrits;
            d.votants = +d.votants;
            d.blancs = d.votants - d.exprimes;
            d.TauxAbstention = _.round(100 * (d.inscrits - d.exprimes) / d.exprimes, 1);
            d.ScoreFillonT1 = +d.ScoreFillonT1;
            d.ScoreMelenchonT1 = +d.ScoreMelenchonT1;
            d.ScoreMacronT1 = +d.ScoreMacronT1;
            d.ScoreLepenT1 = +d.ScoreLepenT1;
            d.longitude = +d.longitude;
            d.latitude = +d.latitude;
            // d.entete = d['3'] >= d['5'] ? "MACRON" : "LE PEN";
            d.ScoreMacronT12022 = +d.MacronT1;
            d.ScoreLepenT12022 = +d.LepenT1;
            d.ScoreMelenchonT12022 = +d.MelenchonT1;
            // d.ScoreHamonT1 = +d.ScoreHamonT1;
            // d.VoixLepenT1 = +d.VoixLepenT1;
            // d.VoixMacronT1 = +d.VoixMacronT1;
            // d.ExprimesT1 = +d.ExprimesT1;
        });


makeCanvasMap(data)


    }        


    else {

        data.forEach(function(d) {
            d['1'] = +d['1'];
            d['2'] = +d['2'];
            d['3'] = +d['3'];
            d['4'] = +d['4'];
            d['5'] = +d['5'];
            d['6'] = +d['6'];
            d['7'] = +d['7'];
            d['8'] = +d['8'];
            d['9'] = +d['9'];
            d['10'] = +d['10'];
            d['11'] = +d['11'];
            d['12'] = +d['12'];
            d.departement = d.code_insee[0] + d.code_insee[1];
            d.popTotale = +d.popTotale;
            d.taux65Plus = +d.taux65Plus;
            d.TauxAgricuteurs = +d.TauxAgricuteurs;
            d.TauxCadres = +d.TauxCadres;
            d.TauxChomage = +d.TauxChomage;
            d.TauxOuvriers = +d.TauxOuvriers;
            d.TauxRetraites = +d.TauxRetraites;
            d.exprimes = +d.exprimes;
            d.inscrits = +d.inscrits;
            d.votants = +d.votants;
            d.blancs = d.votants - d.exprimes;
            d.TauxAbstention = _.round(100 * (d.inscrits - d.exprimes) / d.exprimes, 1);
        });

    }

    data_full[active_year] = data;

    var by_dep = _.uniq(data.map(function(d) {
        return d.departement
    }));

    var sum_exp = d3.sum(data, function(d) {
        return d.exprimes
    });

    for (i in candidats_panneaux[active_year]) {
        candidats_panneaux[active_year][i].score = d3.sum(data, function(d) {
            return d[i]
        });
    }

    for (i in table_variables) {
        table_variables[i].value = d3.sum(data, function(d) {
            return d[table_variables[i].name]
        });
    }

    // var data_entries = Object.keys(candidats_panneaux[active_year]);

    // data_entries = data_entries.sort(function(a, b) {
    //     return b.value.score - a.value.score
    // })

    // var total_pop = d3.sum(data, function(d) {
    //     return d.popTotale
    // });

    if (chart_made == 0) {

        if (json_data) {

            initMap(json_data);

        }

    }

    data_loaded[active_year] = 1;


        if (active_year == 'y2024Eur'){
            let this_margin_top = 50
            d3.select('#map canvas').style('margin-top', this_margin_top + 'px')
        }
        else{
            d3.select('.chart #map').remove()
        }

}






// function responsivefy(svg) {

//     var container = d3.select(svg.node().parentNode),
//         width = parseInt(svg.style("width")),
//         height = parseInt(svg.style("height")),
//         aspect = width / height;

//     svg.attr("viewBox", "0 0 " + width + " " + height)
//         .attr("preserveAspectRatio", "xMinYMid")
//         .call(resize);

//     d3.select(window).on("resize." + container.attr("id"), resize);

//     function resize() {
//         var targetWidth = parseInt(container.style("width"));
//         svg.attr("width", targetWidth);
//         svg.attr("height", Math.round(targetWidth / aspect));

//         var this_main_menu_height = $("section#content").offset()['top'] == 0 ? 67 : $("section#content").offset()['top'];

//         d3.select('#slide-out').style('top', this_main_menu_height + 'px');

//     }
// }

function numbers_separators(num) {
    return num.toLocaleString('fr-FR', {
        minimumFractionDigits: 0
    });
}

function normalizeChars(text) {
    return _.camelCase(_.deburr(text))
}


// setTimeout(function () {
//       $('.shareTwitter').on('click', function(d) { shareTwitter() })
//       $('.shareFacebook').on('click', function(d) { shareFacebook() })
//     }, 2000)
//     function shareFacebook() {
//       var url = encodeURIComponent(window.location.origin + window.location.pathname)
//       var link = 'http://www.facebook.com/sharer/sharer.php?u=' + url
//       window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no')
//     }
//     function shareTwitter () {
//       var url = encodeURIComponent(window.location.origin + window.location.pathname)
//       var text = "Explorer les votes aux régionales par rapport aux dernières présidentielles. Visualisez les résultats des élections en fonction de critères socio démographiques (CSP, démographie...) https://www.liberation.fr/apps/2019/05/explorer-elections-europeennes/ via @libe"
//       var link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text
//       window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no')
//     }

(function() {
  var oldresize = window.onresize;
  window.onresize = function(e) {



      if (window.devicePixelRatio != this_pixelratio){

        this_pixelratio = window.devicePixelRatio

        redrawPoints(this_pixelratio)

      }

  }
})();



function showTip(d, this_position, this_event){

  // console.log(this_event)


let this_obj = d
let this_color = '#1A1A1A'

let this_html = `<div class="box_element_line entete">
<div class="box_element_col">
<h3>${this_obj.ville}</h3>
<div>${this_obj.votants} votants</div>`

this_html +=`</div>
</div>`


d3.select('#tooltip')
.style('display', 'flex')

d3.select('#map_info')
.style('visibility', 'visible')

d3.select('#tooltip')
.html(this_html)
.style('opacity', '1')
.style('display', 'flex')

position_tooltip(this_position, this_event)

}


function position_tooltip(this_position, this_event){

let tip_height = parseInt(d3.select("#map_info").style('height'));
let tip_width = parseInt(d3.select("#map_info").style('width'));

let map_max_height = parseInt(d3.select('.chart #map').style('height'))

let map_max_width = parseInt(d3.select('.chart #map').style('width'))

// console.log(map_max_width)

// let click_x = parseInt(this_position[0])
// let click_y = parseInt(this_position[1])



let click_x = parseInt(this_event.layerX)
let click_y = parseInt(this_event.layerY)

let base_position_tooltip =  parseInt(d3.select('.chart #map').node().getBoundingClientRect().y - d3.select('#main > .container').node().getBoundingClientRect().y)


let x_position = click_x - tip_width/2
let y_position = click_y + 20

x_position = x_position < 0 ? 0 : x_position

// x_position = (x_position + tip_width) > map_max_width ? (map_max_width - tip_width): x_position

y_position = (y_position + tip_height -base_position_tooltip) > map_max_height ? (map_max_height - tip_height + base_position_tooltip) : y_position;


d3.select("#map_info")
.style('left', x_position + 'px')
.style('top', y_position + 'px')
.style('font-size',  (1/this_pixelratio)+ 'em')
}