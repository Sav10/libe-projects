var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;
var isChromium = !!window.chrome;
var datapol;
var circosData;
var representation_territoriale = 'departement';
const arr_representation_territoriale = ['region' ,'departement', 'circonscription']
let selected_element = 'candidat en tête'

let xScale,
    yScale,
    rScale;

/*   var margin = {},
   width,
   height;*/

   var initMargin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 40
  };


const chartTitle = "Vote Macron et revenu médian"

const chartSubTitle = ""

const data_file = "data_elec_macron.csv"
const x_var = 'revenu_median'
const y_var = 'scoreMacron'

const x_axis_title = "Part de vote Macron"
const y_axis_title = "Revenu médian"

const circle_size = 'inscrits'

const min_x_value = 0
const max_x_value = 50000
const min_y_value = 0
const max_y_value = 50

const this_circle_radius = 2


  var initTotalWidth = 600;
  var initTotalHeight = 400;


  var svg_width = 600
   var svg_height = 400

  var initWidth = initTotalWidth - initMargin.left - initMargin.right;
  var initHeight = initTotalHeight - initMargin.top - initMargin.bottom;

  var libeCategoricalColors = ['#e60004', '#7c7c7c', '#000'];

  var political_colors_obj = {
    'EXG': "#751719",
    'FI': "#cd0420",
    "COM":'#af0e1d',
    "ECO":'#52ae56',
    "SOC":'#e6467e',
    "DVG":'#f46099',
    "RDG":'#f781b6',
    'DIV': "#cccccc",
    'REG': "#666",
    "REM":'#ffb400',
    "MDM":'#e85d21',
    "UDI":'#9f64a2',
    "DVD":'#026db5',
    "LR":'#0058a2',
    "DLF":'#003366',
    "EXD":'#03034f',
    "FN":'#000032'
  };

  var LibePoliticalColors =["#751719", "#cd0420", "#af0e1d", "#52ae56", "#e6467e", "#f46099", "#f781b6", "#cccccc", "#666", "#ffb400", "#e85d21", "#9f64a2", "#026db5", "#0058a2", "#003366", "#03034f", "#000032"];

  var color = d3.scaleOrdinal(libeCategoricalColors);


  var categorical_color_sheme = ['libeCategoricalColors', 'LibePoliticalColors', 'schemeDark2', 'schemeAccent', 'schemePastel2', 'schemeSet2', 'schemeSet1', 'schemePastel1', 
  'schemeCategory10', 'schemeSet3', 'schemePaired', 'schemeCategory20', 'schemeCategory20b', 'schemeCategory20c'];

  var basicColors = {plain:{initial:"#e60004", personalized:null}, positive:{initial:'#85b4b2', personalized:null}, negative:{initial:"#e60004", personalized:null}};


  var manualReusableParameters = {"rotateXRow":{"value":false,"type":"checkbox","label":"pivoter l'étiquette des X","initial_value":false,"activated":1,"category":"general"},
  "chart_width":{"value":600,"type":"slider","label":"Largeur du graphique","initial_value":600,"min":300,"max":800,"activated":1,"category":"general"},
  "chart_height":{"value":400,"type":"slider","label":"Hauteur du graphique","initial_value":400,"min":200,"max":800,"activated":1,"category":"general"},
  "padding_bottom":{"value":0,"type":"slider","label":"marge basse","initial_value":0,"min":-100,"max":100,"activated":1,"category":"general"},
  "padding_left":{"value":24,"type":"slider","label":"marge gauche","initial_value":0,"min":-100,"max":100,"activated":1,"category":"general"},
  "padding_right":{"value":5,"type":"slider","label":"marge droite","initial_value":0,"min":-100,"max":100,"activated":1,"category":"general"},
  "padding_top":{"value":0,"type":"slider","label":"marge haute","initial_value":0,"min":-100,"max":100,"activated":1,"category":"general"},
  "sort_descending":{"value":true,"type":"checkbox","label":"tri décroissant","initial_value":true,"activated":1,"category":"general"},
  "invert_order":{"value":false,"type":"checkbox","label":"inverser l'ordre","initial_value":false,"activated":0,"category":"general"},
  "differentAxisY":{"value":false,"type":"checkbox","label":"Adapter l'axe des Y aux données","initial_value":false,"activated":0,"category":"general"},
  "rangeX":{"value":true,"type":"checkInputs","label":"Range X personalisée","initial_left_value":null,"initial_right_value":null,"calculated_left_value":0,"calculated_right_value":92.8,"manual_left_value":min_x_value,"manual_right_value":max_x_value,"activated":1,"category":"general"},
  "rangeY":{"type":"checkInputs","label":"Range Y personalisée","initial_left_value":null,"initial_right_value":null,"calculated_left_value":0,"calculated_right_value":46280,"manual_left_value":min_y_value,"manual_right_value":max_y_value,"activated":1,"category":"general"},
  "color_field_select":{"value":"LibePoliticalColors","type":"colorFieldSelect","label":"Jeu de couleurs","initial_value":"libeCategoricalColors","activated":0,"fields":["libeCategoricalColors","LibePoliticalColors","schemeDark2","schemeAccent","schemePastel2","schemeSet2","schemeSet1","schemePastel1","schemeCategory10","schemeSet3","schemePaired","schemeCategory20","schemeCategory20b","schemeCategory20c"],"category":"color"},
  "persColorsCheck":{"value":true,"type":"persColorsCheck","label":"Couleurs personalisées","initial_value":false,"activated":1,"category":"color"},
  "indice_100":{"value":false,"type":"checkbox","label":"Démarrer à l'indice 100","initial_value":false,"activated":1,"category":"calculs"},
  "displayLabel":{"value":false,"type":"checkbox","label":"afficher la valeur","initial_value":false,"activated":0,"category":"labels"},
  "startEndValues":{"type":"checkInputs","label":"Valeurs de début et de fin","initial_left_value":null,"initial_right_value":null,"calculated_left_value":null,"calculated_right_value":null,"manual_left_value":null,"manual_right_value":null,"activated":1,"category":"filter"},
  "caseLegend":{"value":false,"type":"checkSelects","label":"Afficher la légende","range":[{"value":"topRight","label":"En haut à droite"},{"value":"topLeft","label":"En haut à gauche"},{"value":"bottomLeft","label":"En bas à gauche"},{"value":"bottomRight","label":"En bas à droite"}],"initial_range_value":"topRight","manual_range_value":"topLeft","activated":1,"category":"legend"},
  "padding_left_legend":{"value":25,"type":"slider","label":"marge gauche légende","initial_value":0,"min":-100,"max":100,"category":"legend","activated":true,"dependOn":"caseLegend"},
  "padding_top_legend":{"value":-35,"type":"slider","label":"marge haute légende","initial_value":0,"min":-100,"max":100,"category":"legend","activated":true,"dependOn":"caseLegend"},
  "legendOrientation":{"type":"simpleSelect","label":"Orientation de la légende","range":[{"value":"vertical","label":"Verticale"},{"value":"horizontal","label":"Horizontale"}],"initial_range_value":"vertical","manual_range_value":null,"activated":true,"category":"legend","dependOn":"caseLegend"},
  "inner_padding_legend":{"value":-1,"type":"slider","label":"Marge intérieure de la légende","initial_value":2,"min":-100,"max":100,"activated":true,"category":"legend","dependOn":"caseLegend"},
  "textLegendOtherCat":{"type":"simpleInputs","label":"Texte de la légende si autre","activated":true,"category":"legend","dependOn":"caseLegend"},
  "leftAxisTickNumber":{"value":5,"type":"slider","label":"Nombre de graduations à gauche","initial_value":10,"min":0,"max":20,"activated":1,"category":"grid"},
  "bottomAxisTickNumber":{"value":5,"type":"slider","label":"Nombre de graduations en bas","initial_value":5,"min":0,"max":20,"activated":1,"category":"grid"},
  "leftAxisStroke":{"type":"simpleSelect","label":"Couleur de l'axe gauche","range":[{"value":"black","label":"noir"},{"value":"#3c3c3b","label":"gris foncé"},{"value":"#7c7c7b","label":"gris moyen"},{"value":"#c6c6c6","label":"gris clair"},{"value":"#e4e4e4","label":"gris très clair"},{"value":"#f4f4f4","label":"gris très très clair"},{"value":"#fff","label":"invisible"}],"initial_range_value":"black","manual_range_value":"#fff","activated":1,"category":"grid"},
  "bottomAxisStroke":{"type":"simpleSelect","label":"Couleur de l'axe bas","range":[{"value":"black","label":"noir"},{"value":"#3c3c3b","label":"gris foncé"},{"value":"#7c7c7b","label":"gris moyen"},{"value":"#c6c6c6","label":"gris clair"},{"value":"#e4e4e4","label":"gris très clair"},{"value":"#f4f4f4","label":"gris très très clair"},{"value":"#fff","label":"invisible"}],"initial_range_value":"black","manual_range_value":"#fff","activated":1,"category":"grid"},
  "ticksStroke":{"type":"simpleSelect","label":"Couleur des graduations","range":[{"value":"black","label":"noir"},{"value":"#3c3c3b","label":"gris foncé"},{"value":"#7c7c7b","label":"gris moyen"},{"value":"#c6c6c6","label":"gris clair"},{"value":"#e4e4e4","label":"gris très clair"},{"value":"#f4f4f4","label":"gris très très clair"},{"value":"#fff","label":"invisible"}],"initial_range_value":"black","manual_range_value":"#e4e4e4","activated":1,"category":"grid"},
  "leftTickSize":{"type":"simpleSelect","label":"Taille des graduations horizontales","range":[{"value":"small","label":"petites"},{"value":"fullWidth","label":"largeur complète"},{"value":"invisible","label":"invisibles"}],"initial_range_value":"small","manual_range_value":"fullWidth","activated":1,"category":"grid"},
  "bottomTickSize":{"type":"simpleSelect","label":"Taille des graduations verticales","range":[{"value":"small","label":"petites"},{"value":"fullHeight","label":"hauteur complète"},{"value":"invisible","label":"invisibles"}],"initial_range_value":"small","manual_range_value":"invisible","activated":1,"category":"grid"},
  "yAxisLabel":{"value":true,"type":"checkbox","label":"Etiquette de l'axe gauche","initial_value":false,"activated":1,"category":"labels"},
  "xAxisLabel":{"value":true,"type":"checkbox","label":"Etiquette de l'axe bas","initial_value":false,"activated":1,"category":"labels"},
  "yAxisLabelPadding":{"value":-24,"type":"slider","label":"Marge de l'étiquette de l'axe gauche","initial_value":0,"min":-100,"max":100,"category":"labels","activated":true,"dependOn":"yAxisLabel"},
  "xAxisLabelPadding":{"value":13,"type":"slider","label":"Marge de l'étiquette de l'axe bas","initial_value":0,"min":-100,"max":100,"category":"labels","activated":true,"dependOn":"xAxisLabel"},
  "yAxisLabelText":{"value":y_axis_title,"type":"simpleInputs","label":"Texte de l'étiquette de l'axe gauche","category":"labels","activated":true,"dependOn":"yAxisLabel"},
  "xAxisLabelText":{"value":x_axis_title,"type":"simpleInputs","label":"Texte de l'étiquette de l'axe bas","category":"labels","activated":true,"dependOn":"xAxisLabel"},
  "trimKValue":{"value":true,"type":"checkbox","label":"Supprimer les espaces inutiles","initial_value":true,"activated":0,"category":"textRemplacement"},
  "hideCircles":{"value":true,"type":"checkbox","label":"Supprimer les cercles","initial_value":true,"activated":0,"category":"general"},
  "dateField":{"value":false,"type":"checkSelects","label":"Y a-t-il un champ date ?","range":"selectedFields","initial_range_value":"topRight","manual_range_value":null,"initial_value":false,"activated":1,"category":"textRemplacement"},
  "dateFieldFormat":{"value":"DD/MM/YYYY","initial_value":"DD/MM/YYYY","type":"simpleInputs","label":"Format de date","category":"textRemplacement","activated":false,"dependOn":"dateField"},
  "previousDate":{"type":"simpleInputs","label":"date n-1","category":"textRemplacement","activated":false,"dependOn":"dateField"},
  "groupingFunction":{"type":"simpleSelect","label":"Fonction de réduction des données","range":[{"value":"sum","label":"Somme"},{"value":"mean","label":"moyenne"},{"value":"median","label":"médianne"}],"initial_range_value":null,"manual_range_value":"sum","activated":0,"category":"calculs"},
  "logScale":{"value":false,"type":"checkbox","label":"Echelle logarithmique","initial_value":false,"activated":0,"category":"calculs"},
  "beeswarnRadius":{"value":2,"type":"slider","label":"Taille des points","initial_value":2,"min":1,"max":20,"activated":0,"category":"general"},
  "beeswarnCollide":{"value":3,"type":"slider","label":"Eloignement des points","initial_value":3,"min":1,"max":20,"activated":0,"category":"general"},
  "verticalStrength":{"value":8,"type":"slider","label":"Force verticale","initial_value":8,"min":1,"max":10,"activated":0,"category":"general"},
  "circleRadius":{"value":this_circle_radius,"type":"slider","label":"Taille des cercles","initial_value":3,"min":1,"max":20,"activated":1,"category":"general"},
  "circleOpacity":{"value":0.9,"type":"slider","label":"Opacité des cercles","initial_value":0.9,"min":0,"max":1,"step":0.1,"activated":1,"category":"general"},
  "customCode":{"type":"simpleTextArea","label":"Ajouter du code js","activated":1,"category":"textRemplacement","numberOfRows":5,"value":"d3.selectAll('.axis--y .tick text').text(function(d){return d+'%'});" + 
  "d3.selectAll('.axis--x .tick text').text(function(d){return numbers_separators(d)});" + 
  "d3.selectAll('g.ball circle').style('mix-blend-mode', 'multiply');"},
  "colorizeField":{"value":false,"type":"checkbox","label":"Colorier un champ en fonction de critères","initial_value":false,"activated":0,"category":"color"},
  "colorizeFieldText":{"type":"simpleInputs","label":"Critères pour colorier le champ","activated":false,"category":"color","dependOn":"colorizeField"},
  "colorizeFieldSelectField":{"type":"simpleSelect","label":"Nom du champ","range":[{"label":"Dans quel champ ?","value":""},{"label":"taux_vaccination_adultes","value":"taux_vaccination_adultes"},{"label":"niveau_vie_median","value":"niveau_vie_median"},{"label":"effectif","value":"effectif"},{"label":"aglomeration","value":"aglomeration"}],"initial_range_value":"black","manual_range_value":false,"activated":false,"category":"color","dependOn":"colorizeField"},
  "stackedBarWhiteSeparator":{"value":false,"type":"checkbox","label":"Séparer les rectangles","initial_value":false,"activated":0,"category":"general"},
  "stackedBarInsideOrder":{"type":"simpleSelect","label":"Ordre des valeurs à l'intérieur des barres","range":[{"value":"stackOrderNone","label":"Aucun ordre"},{"value":"stackOrderAscending","label":"Ordre croissant"},{"value":"stackOrderDescending","label":"Ordre décroissant"},{"value":"stackOrderInsideOut","label":"Ordre intérieur extérieur"},{"value":"stackOrderReverse","label":"Ordre inversé"}],"initial_range_value":"stackOrderNone","manual_range_value":"stackOrderNone","activated":0,"category":"general"},
  "CheckIfNochart":{"value":false,"type":"checkbox","label":"Pas un graph","initial_value":false,"activated":0,"category":"none"},
  "automaticDate":{"value":false,"type":"checkbox","label":"Reconnaissance automatique des dates","initial_value":false,"activated":0,"category":"general"},
  "ColorLegendPie":{"type":"simpleColorInputs","label":"Couleur de la légende","activated":0,"category":"general"},
  "caseCustomTooltip":{"value":false,"type":"checkSelects","label":"Tooltip personalisé","range":"selectedColNames","manual_range_value":null,"initial_value":false,"activated":1,"category":"textRemplacement"},
  "customTooltips":{"type":"simpleTextArea","label":"Texte du Tooltip, noms des champs entre doubles crochets.\n Ex : [[nom]], [[montant]]","activated":true,"category":"textRemplacement","dependOn":"caseCustomTooltip","numberOfRows":5,"value":"[[libelle_epci]] ([[dep]])<br>\n[[taux_vaccination_adultes]]% <strong>des adultes sont vaccinés</strong><br>\n<strong>Revenu médian : </strong>[[" + x_var + "|number_separator]] euros<br>\n Interdécile : [[interdecile]] \n<br> [[" + x_var + "]]% <strong>de chômage</strong><br>[[vote_fn]]% <strong>de vote FN</strong><br>[[population_carto]] habitants"},
  "moveElements":{"value":false,"type":"checkbox","label":"Déplacer les éléments","initial_value":false,"activated":1,"category":"textRemplacement"},
  "selectedElementType":{"value":false,"type":"simpleInputs","label":"Element sélectionné","initial_value":false,"activated":false,"category":"textRemplacement","dependOn":"moveElements"},
  "selectedElement":{"type":"none","activated":0,"category":"none"},
  "selectedParentElementType":{"value":false,"type":"simpleInputs","label":"parent de l Element sélectionné","initial_value":false,"activated":false,"category":"textRemplacement","dependOn":"moveElements"},
  "elementMoved":{"type":"none","activated":0,"category":"none","thoseElements":{},"thoseElementsOrder":[]},"emptyMovedElements":{"value":false,"type":"checkbox","label":"initialiser les éléments déplacés","initial_value":false,"activated":1,"category":"textRemplacement"},
  "barPadding":{"value":1,"type":"slider","label":"Espace entre les barres","initial_value":1,"min":1,"max":10,"activated":1,"category":"general"},
  "numberOfCols":{"value":2,"type":"slider","label":"Nombre de colonnes","initial_value":2,"min":1,"max":10,"activated":0,"category":"general"},
  "miniMarginLeft":{"value":30,"type":"slider","label":"Marge gauche entre les graphs","initial_value":30,"min":0,"max":100,"activated":0,"category":"general"},
  "miniMarginTop":{"value":20,"type":"slider","label":"Marge supérieure entre les graphs","initial_value":20,"min":0,"max":100,"activated":0,"category":"general"},
  "alignPeaks":{"value":false,"type":"checkbox","label":"Aligner les pics","initial_value":false,"activated":0,"category":"general"}};

  var graphParameters = {"selected_xRows":[x_var],"selected_yRows":[y_var],"selected_size":[circle_size],"selected_color":[],"selected_label":[],"selected_tooltip":["libelle_commune",x_var, y_var],"personalizedColorsObject":{"Agglomération marseillaise":"#cd0420","Agglomération lyonnaise":"#cccccc","Agglomération parisienne":"#666"},
  "selectedColorScheme":"LibePoliticalColors","additionnalParam":"","selected_graph":"circleChart","chartTitle":chartTitle,"chartSubTitle":chartSubTitle,"chartSource":"Assurance maladie, Insee. La taille des ronds est proportionelle à la population des villes","annotations":[]};


    function initChart() {

      var svg = d3.select("#chart_container svg")
      .call(responsivefy);

console.log(svg.node())


      svg
      .attr("width", svg_width)
      .attr('height', svg_height);

      margin = {
        top: 20,
        right: 20,
        bottom: 60,
        left: 50
      };

      width = +svg.attr("width") - margin.left - margin.right;
      height = +svg.attr("height") - margin.top - margin.bottom;

      var g = svg.append("g")
      .attr('class', 'graphContainer')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*      initAnnotations()*/

      g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")");

      g.append("g")
      .attr("class", "axis axis--y")
      .attr('transform', 'translate(0,0)');

      g.append("g")
      .attr('class', 'innerGraph');

    }



function makeCirclechart(data0) {

    // var kValue = 'graphParameters['selected_xRows][0];
    // var dValues = graphParameters[selected_yRows];

    var data = _.cloneDeep(data0);


    data = recalculateAndTransformDate(data);

    console.log(data)

    var thisXvar = graphParameters['selected_xRows'][0];
    var thisYvar = graphParameters['selected_yRows'][0];
    var thisSizeVar = graphParameters['selected_size'][0];
    var thisColorVar = graphParameters['selected_color'][0];
    var thisLabelVar = graphParameters['selected_label'][0];

    data.forEach(function(d) {
        d[thisXvar] = formatNumbers(d[thisXvar]);
        d[thisYvar] = formatNumbers(d[thisYvar]);
        d[thisSizeVar] = d[thisSizeVar] ? formatNumbers(d[thisSizeVar]) : 1;
    })

    var svg = d3.select("svg");
    var g = svg.select('g.graphContainer');
    var g_inner = g.select('g.innerGraph');

    updateParameters();

   xScale = xScaleType()
    .domain([min_x_value,max_x_value])
    .range([0, width]);

    yScale = d3.scaleLinear()
    .domain([min_y_value,max_y_value])
    .range([height, 0]);

    rScale = d3.scaleSqrt()
    .domain([0, d3.max(data, function(d){ return d[thisSizeVar]})])
    .range([0, (manualReusableParameters.circleRadius.value*13)]);


   manualReusableParameters.rangeX.calculated_left_value =  0;


   if (manualReusableParameters.dateField.value == true && manualReusableParameters.dateFieldFormat.value){

    var this_Min = _.cloneDeep(d3.min(data, function(d) { return d[thisXvar] }))

    var this_Max = _.cloneDeep(d3.max(data, function(d) { return d[thisXvar] }))

    var this_Diff = _.round(this_Max.diff(this_Min, 'days')/50)


    var thisNewMin = this_Min.subtract(this_Diff, 'days')

    manualReusableParameters.rangeX.calculated_left_value = thisNewMin;
   }

    manualReusableParameters.rangeX.calculated_right_value =  d3.max(data, function(d) { return d[thisXvar]});

   manualReusableParameters.rangeY.calculated_left_value =  0;
    manualReusableParameters.rangeY.calculated_right_value =  d3.max(data, function(d) { return d[thisYvar]});

//     var thisXMin = ! manualReusableParameters.rangeX.value ?  manualReusableParameters.rangeX.calculated_left_value : manualReusableParameters.rangeX.manual_left_value !== null ? manualReusableParameters.rangeX.manual_left_value : manualReusableParameters.rangeX.calculated_left_value;
//     var thisXMax = ! manualReusableParameters.rangeX.value ?  manualReusableParameters.rangeX.calculated_right_value : manualReusableParameters.rangeX.manual_right_value !== null ? manualReusableParameters.rangeX.manual_right_value : manualReusableParameters.rangeX.calculated_right_value;
//     var thisYMin = ! manualReusableParameters.rangeY.value ?  manualReusableParameters.rangeY.calculated_left_value : manualReusableParameters.rangeY.manual_left_value !== null ? manualReusableParameters.rangeY.manual_left_value : manualReusableParameters.rangeY.calculated_left_value;
//     var thisYMax = ! manualReusableParameters.rangeY.value ?  manualReusableParameters.rangeY.calculated_right_value : manualReusableParameters.rangeY.manual_right_value !== null ? manualReusableParameters.rangeY.manual_right_value : manualReusableParameters.rangeY.calculated_right_value;


// xScale.domain([thisXMin, thisXMax])
// yScale.domain([thisYMin, thisYMax])


    changeAxis(xScale, yScale)


  g.select('g.innerGraph')
  .attr("transform", "translate(" + manualReusableParameters.padding_left.value + "," + manualReusableParameters.padding_top.value + ")");

  g.select("g.axis.axis--x")
  .attr("transform", "translate(" + manualReusableParameters.padding_left.value + "," + (height + manualReusableParameters.padding_top.value) +")")
  .call(axis_bottom)
  .selectAll("text")
  .style("text-anchor", "middle")
  .attr("dx", "0em")
  .attr("dy", "0.7em")
  .attr("transform", "rotate(0)");

  if (manualReusableParameters.rotateXRow.value == true){

    g.select("g.axis.axis--x")
    .selectAll("g.tick")
    .select("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-40)");

}

g.select("g.axis.axis--y")
.attr('transform', 'translate(' + manualReusableParameters.padding_left.value + ',' + manualReusableParameters.padding_top.value + ')')
.call(axis_left);



//Canvas doc
// Here https://medium.com/@xoor/implementing-charts-that-scale-with-d3-and-canvas-3e14bbe70f37

// And here https://bl.ocks.org/ejb/e2da5a23e9a09d494bd532803d8db61c

// And here https://d3-graph-gallery.com/graph/canvas.html

// And here https://www.freecodecamp.org/news/d3-and-canvas-in-3-steps-8505c8b27444/

    let this_container = d3.select('#chart_container'),
    this_width = manualReusableParameters.chart_width.value,
    this_height = manualReusableParameters.chart_height.value,
    this_aspect = this_width / this_height;

let targetWidth = parseInt(this_container.style("width")) - margin.left - margin.right;
let targetHeight = Math.round(targetWidth / this_aspect) - margin.top -  - margin.bottom;


let targetTotalWidth = parseFloat(this_container.style("width"));

let targetTotalHeight = Math.round(targetTotalWidth / this_aspect);


let x_factor = targetTotalWidth / +svg.attr("width")

let y_factor = targetTotalHeight / this_height


const container = d3.select('#chart_container')

const this_margin_left = parseInt((margin.left + manualReusableParameters.padding_left.value)*x_factor)

const canvasChart = container.append('canvas')
.attr('width', (width)*x_factor)
.attr('height', height*y_factor)
.style('margin-left', this_margin_left + 'px')
.style('margin-top', margin.top*y_factor + 'px')
.attr('class', 'canvas-plot');

const context = canvasChart.node().getContext('2d');

const pointColor = '#3585ff'


    var xScale_canvas = xScaleType()
    .domain([min_x_value,max_x_value])
    .range([0, width*x_factor]);

    var yScale_canvas = d3.scaleLinear()
    .domain([min_y_value,max_y_value])
    .range([height*y_factor, 0]);

data.forEach(function(d, i) {
if (i % 100 == 0){

}

   drawPoint(d, i);
});


function drawPoint(d, i) {
   context.beginPath();
   context.globalCompositeOperation = "multiply";
   context.globalAlpha = 0.7
   // context.fillStyle = d[thisColorVar];
   context.fillStyle = 'red';
   const px = xScale_canvas(d[thisXvar]);
   const py = yScale_canvas(d[thisYvar]);
   let this_radius = graphParameters['selected_size'][0] ? rScale(d[thisSizeVar]) : manualReusableParameters.circleRadius.value

   context.arc(px, py, this_radius, 0, 2 * Math.PI,true);
   context.fill();
}


    var circles = g_inner
    .selectAll('.ball')
    .data(_.slice(data, 0, 1000));

    circles.exit().transition().duration(200).remove();

    circles
    .attr('transform', function(d) {return 'translate(' + xScale(d[thisXvar]) + ',' +  yScale(d[thisYvar]) + ')'})
    .select('circle')
    .transition()
    .duration(200)
    .attr('r', function(d){return graphParameters['selected_size'][0] ? rScale(d[thisSizeVar]) : manualReusableParameters.circleRadius.value})
    .style('fill', function(d){return thisColorVar ? colorUpdated(d[thisColorVar]) : '#e60004'})
    .style('fill-opacity', manualReusableParameters.circleOpacity.value);

    circles
    .select('text')
    .transition()
    .duration(200)
    .text(function(d){return thisLabelVar ? d[thisLabelVar] : ""});

    var new_circles = circles
    .enter()
    .append('g')
    .attr('class', 'ball')
    .attr('transform', function(d) {return 'translate(' + xScale(d[thisXvar]) + ',' +  yScale(d[thisYvar]) + ')'})
    .on('mouseover', function(d, i){ show_tooltip(d)})
    .on('mouseout', function(d){ hide_tooltip()});

    new_circles
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d){return graphParameters['selected_size'][0] ? rScale(d[thisSizeVar]) : manualReusableParameters.circleRadius.value})
    .style('fill-opacity', manualReusableParameters.circleOpacity.value)
    .style('fill', function(d){return thisColorVar ? colorUpdated(d[thisColorVar]) : '#e60004'});

    new_circles
    .append('text')
    .style('text-anchor', 'middle')
    .style('fill', 'black')
    .attr('y', 4)
    .text(function(d){return thisLabelVar ? d[thisLabelVar] : ""});

g_inner
.call(xAxisLabel, graphParameters.selected_xRows[0]);

g_inner
.call(yAxisLabel, graphParameters.selected_yRows[0]);

    customizeAxis()
    drawLegend()
    addCustomCode()

}



var geo_objects = {
departement : 
{'container' : 'svg-container-dep',
'location_variable' : 'code_departement',
location_prefix : 'D_'},
region : 
{'container' : 'svg-container-reg',
'location_variable' : 'code_region',
location_prefix : 'R_'}
,
circonscription : 
{'container' : 'svg-container-circ',
'location_variable' : 'id_circo',
location_prefix : 'M_'}
}

moment.locale('fr')


const colors_candidats = {
"MACRON":'#F7BA00',
"LE PEN":'#1D2245'
}



const candidate_names = [
'MACRON',
 'LE PEN']

const selected_candidates = [
'MACRON',
'LE PEN'];


const vote_variables = ['Inscrits', 
'Abstentions', 
'Votants', 
'Blancs', 'Nuls',
'Exprimes']


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


var data_legend = [0,10,20, 30, 40, 50, 60, 70, 80];

const parentWidth = d3
.select('body')
.node()
.getBoundingClientRect().width

/*const margin = { top: 0, right: 0, bottom: 0, left: 0 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom*/


// For circo map

var margin_map = { top: 0, right: 20, bottom: 10, left: 0 },
    width_map = 600 - margin_map.left - margin_map.right,
    height_map = 600 - margin_map.top - margin_map.bottom,
    width_legend_map = 600 - margin_map.left - margin_map.right,
    margin_top_legend_map = 30,
    margin_right_legend_map = 0,
    padding_legend_map = 10,
    mapData,
    xAxis_map,
    direction;

var svg_map_geo = d3.select('#map_geo svg.map')
    .attr('width', (width_map + margin_map.left + margin_map.right))
    .attr('height', height_map + margin_map.top + margin_map.bottom)
    // .call(responsivefy, (width_map + margin_map.left + margin_map.right), (height_map + margin_map.top + margin_map.bottom))
    // .call(zoom)
    ;

var g_map = svg_map_geo.append('g')
  .attr('transform', 'translate('+ margin_map.left + ', ' + margin_map.top + ')');

var effectLayer = g_map.append('g')
    .classed('effect-layer', true);

var mapLayer = g_map.append('g')
    .classed('map-layer', true);

var projection = d3.geoMercator()
    .scale(1400)
    .center([3, 45.5])
    .translate([width_map / 2, height_map / 2]);

var path = d3.geoPath()
    .projection(projection);


/////////// Legends and tags

const legend_rect_size = 60

var legend = d3.select('#legend .mapLegend .legendCells').selectAll('.cell')
.data(data_legend)

legend.exit().remove()

var legend_cells = legend
.enter()
.append('g')
.attr('class', 'cell')
.attr('transform', function(d, i){ return 'translate(' + i*legend_rect_size + ',0)'})

legend_cells
.append('rect')
.attr('class', 'swatch')
.attr('height', 15)
.attr('width', legend_rect_size + 2)
.style('fill', function(d){ return color_progressive_scale(d)})

legend_cells
.append('text')
.attr('class', 'label')
.attr('height', 15)
.attr('width', legend_rect_size + 2)
.style('text-anchor', 'end')
.text(function(d){return d + '%'})
.attr('transform', 'translate(11,12)')
.style('fill', d=> d >= 25 ? 'white' : 'black')


d3.select('#legend .mapLegend .legendCells text').remove()

function draw_legendots(){

d3.selectAll('div#legendots .legende_dot').remove();


let data_for_legendots = Object.entries(colors_candidats).filter(d=> selected_candidates.includes(d[0]))

data_for_legendots.push(['Résultats non parvenus', '#ddd'])

var legendots = d3.select('div#legendots').selectAll('span.legende_dot')
.data(data_for_legendots)



legendots
.enter()
.append('span')
.attr('class', 'legende_dot');


d3.select('div#legendots').selectAll('span.legende_dot')
.append('span')
.attr('class', 'text_legend')
.text(d=>_.capitalize(d[0]).replace('Le pen', 'Le Pen'))

d3.select('div#legendots').selectAll('span.legende_dot')
.append('span')
.attr('class', 'dot')
.style('background-color', d=>d[1])




}

draw_legendots()

function draw_affichage(){

d3.selectAll('#affichage .display_element')

let all_displayed_elements = _.cloneDeep(candidate_names)
all_displayed_elements.unshift('candidat en tête', 'abstention');

const elements_selection = d3.select('div#affichage').selectAll('div.display_element')
.data(all_displayed_elements)

elements_selection
.enter()
.append('div')
.attr('class', 'display_element')
.text(d=> _.capitalize(d).replace('Le pen', 'Le Pen').replace('Dupont-aignan', 'Dupont-Aignan'))
.on('click', function(event, d){

selected_element = d


d3.selectAll('#affichage .display_element')
.style('background-color', '#eee')
.style('color', '#6E6E6E')

let this_background_color = ''

if(d == 'candidat en tête' || d == 'abstention'){

this_background_color = 'black'
}
else {
  this_background_color = colors_candidats[d]
}


d3.select(this)
.style('background-color', this_background_color)
.style('color', '#fff')

fillOnClick(d)
})

d3.select('#affichage .display_element')
.style('background-color', 'black')
.style('color', '#fff')

}

draw_affichage()

function showTip(data, d, location_variable){


let this_code = d.id;


/*let this_d = _.find(app_data.tx_incidence, d => d.dep == this_code);*/
let this_d = _.find(data, d => d[location_variable] == this_code);

if (!this_d){

let this_html = `Français de l'étranger<br> Résultats non parvenus`

d3.select('#tooltip')
.style('display', 'flex')

d3.select('#map_info2')
.style('visibility', 'visible')

d3.select('#tooltip')
.html(this_html)
.style('font-size', '15px')
.style('opacity', '1')
.style('display', 'block')

return  
}

let this_dep_scores = candidate_names.map(function(e){ return {'name': e, 'score': this_d[e+'_score']} })

this_dep_scores = this_dep_scores.sort(function(a,b) {  return b.score - a.score})
this_dep_scores = _.slice(this_dep_scores, 0, 7)

let this_loc_name

if(location_variable == 'code_departement'){
  this_loc_name = this_d['lib_departement'] + ' (' + this_d['code_departement'] + ')'

  if (this_d['url_libe']){

    this_loc_name = `<a target="_blank" href="${this_d.url_libe}" style="display:inline-block"> ${this_loc_name}<img src="img/Voir-Plus.svg" style="width:1em;display:inline-block;margin-left:1em"></a>`
}


}
else if (location_variable == 'code_region'){
this_loc_name = this_d['lib_region']
  if (this_d['url_libe']){

    this_loc_name = `<a target="_blank" href="${this_d.url_libe}" style="display:inline-block"> ${this_loc_name}<img src="img/Voir-Plus.svg" style="width:1em;display:inline-block;margin-left:1em"></a>`
}


}
else{
this_loc_name = `${this_d['nom_circo']}  ${this_d['num_circo']}<sup>e</sup> circonscription `
}

let this_html = `<span style="font-weight:bold; font-family: 'libesansweb-semicondensed'; letter-spacing: 0.04em; font-size: 16px;">${this_loc_name}</span>`

if (selected_element == 'candidat en tête'){

    this_html +=  `<span class='details'>
    ${drawGraph(this_dep_scores)}</span>`

}

else if (selected_element == 'abstention'){

let this_selected_candidate = [{'name':'Abstention', 'score': _.round(100*this_d['Abstentions'] / this_d['Inscrits'], 1)}]
    this_html +=  `<span class='details'>
    ${drawGraph(this_selected_candidate)}</span>`


}

else{

let this_selected_candidate = [{'name':selected_element, 'score': this_d[selected_element+'_score']}]
    this_html +=  `<span class='details'>
    ${drawGraph(this_selected_candidate)}</span>`



    console.log(selected_element)
    console.log(this_dep_scores[0].name)

    if (selected_element == this_dep_scores[0].name){
      this_html +=  'Arrivé en tête<br>'
    }

}

this_html += `<hr>Nombre de votes exprimés : ${this_d['Exprimes']}<br>
Taux d'abstention : ${String(_.round(100*this_d['Abstentions'] / +this_d['Inscrits'], 1)).replace('.', ',')}%`

d3.select('#tooltip')
.style('display', 'flex')

d3.select('#map_info2')
.style('visibility', 'visible')

d3.select('#tooltip')
.html(this_html)
.style('opacity', '1')
.style('display', 'block')

}

//// Using force flubber and d3 to morph and move paths 

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

function registered_separate_circles(){

  allPaths
  .transition().attr('transform', function(d) { return 'translate(' +position_departements[d.id][0]+ ',' +position_departements[d.id][1] + ')'});

}


function redraw_paths(){

d3.select('#display_geo_paths')
.style('color', '#fff')
.style('background-color', 'red')
.style('border-color', 'red')

d3.select('#display_proportional_circles')
.style('color', 'red')
.style('background-color', '#fff')
.style('border-color', '#ddd')


d3.select('#taille_proportionnelle')
.style('display', 'none')



let all_those_paths = d3.select('#'+ geo_objects[representation_territoriale].container + ' svg').selectAll('path');


redraw_paths_generic(all_those_paths, correction_paths[representation_territoriale])


for (i in arr_representation_territoriale){

  let this_d = arr_representation_territoriale[i]

if (this_d != representation_territoriale){

all_those_paths = d3.select('#'+ geo_objects[this_d].container + ' svg').selectAll('path');

redraw_paths_generic(all_those_paths, correction_paths[this_d])

}

}


}

function transform_all_paths_to_circle(){

d3.select('#display_proportional_circles')
.style('color', '#fff')
.style('background-color', 'red')
.style('border-color', 'red;')


d3.select('#display_geo_paths')
.style('color', 'red')
.style('background-color', '#fff')
.style('border-color', '#ddd;')

d3.select('#taille_proportionnelle')
.style('display', 'block')


let all_those_paths = d3.select('#'+ geo_objects[representation_territoriale].container + ' svg').selectAll('path');

transform_all_paths_to_circle_generic(all_those_paths, position_circles[representation_territoriale], geo_objects[representation_territoriale].location_prefix)

for (i in arr_representation_territoriale){

  let this_d = arr_representation_territoriale[i]

if (this_d != representation_territoriale){


all_those_paths = d3.select('#'+ geo_objects[this_d].container + ' svg').selectAll('path');

transform_all_paths_to_circle_generic(all_those_paths, position_circles[this_d], geo_objects[this_d].location_prefix)

}

}

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


d3.selectAll('#representation_territoriale .actionButton')
.on('click', function(){

let id_map =  d3.select(this).attr('data-value')
let this_id =  d3.select(this).attr('id')


d3.selectAll('#representation_territoriale .actionButton')
.style('color', 'red')
.style('background-color', '#fff')
.style('border-color', '#ddd')

d3.select('#' +this_id)
.style('color', '#fff')
.style('background-color', 'red')
.style('border-color', 'red')

d3.selectAll('.svg_map')
.style('visibility', 'hidden')
.style('display', 'none')
.style('height', 0)

d3.select('#' + id_map)
.style('visibility', 'visible')
.style('height', 'initial')
.style('display', 'block')

if (id_map =='svg-container-dep'){
  representation_territoriale = 'departement'
}
else if (id_map =='svg-container-reg'){
  representation_territoriale = 'region'
}
else{
  representation_territoriale = 'circonscription'
}

}

)

///Loading data

Promise.all([
    // d3.csv('data/election_data_regT2.csv'),
    d3.csv('https://sav10.github.io/libe-projects/explorer-presidentielle-2022-T2/data/data2022_presidentielle_T2.csv')
    // d3.csv('data/election_data_depT2.csv'),
/*    d3.csv('https://sav10.github.io/libe-projects/election-presidentielle-2022-T2/data/election_data_depT2.csv'),
    d3.csv('data/data_circos3.csv')*/
/*    d3.csv('data/circos_data.csv')*/
    // d3.csv('https://sav10.github.io/libe-projects/election-presidentielle-2022/data/data_circos3.csv')
]).then(function(files) {
  ready(files[0]
/*    , files[1], files[2]*/
    )
}).catch(function(err) {
  console.log('erreur' + ' ' + err)
})

//// Ready function (to load data)

  function ready(data_explore) {


data_explore.forEach(d =>{
d.Macron = +d['3']
d.Lepen = +d['5']
d.scoreMacron = _.round(100*d.Macron / (d.Macron + d.Lepen), 1)
d.scoreLepen = _.round(100*d.Lepen / (d.Macron + d.Lepen), 1)

let numeric_val = ['Abstentions', 'Blancs', 'Exprimes', 'Inscrits', 'LepenT1', 'MacronT1', 'MelenchonT1', 'ScoreFillonT1'
, 'ScoreLepenT1', 'ScoreMacronT1', 'ScoreMelenchonT1', 'TauxAgricuteurs', 'TauxCadres', 'TauxChomage'
, 'TauxOuvriers', 'TauxRetraites', 'Votants', 'popTotale', 'revenu_median', 'taux65Plus']

for (i in numeric_val){

let e = numeric_val[i]

d[e] = +d[e]
}


})


  console.log(data_explore)


initChart();

makeCirclechart(data_explore);





}

///// End of (long) ready function


//// load SVG map


/// End map from svgn




function reset_tooltip(){


d3.select('#minigraph_container')
.style('display', 'none')

d3.select('#tooltip')
.style('display', 'none')

d3.select('#map_info2')
.style('visibility', 'hidden')


d3.select('#sparkline').select('*').remove()
}

////// Fill map when clicking on tag

  function fillOnClick(name){


if (name == 'candidat en tête') {

for (i in geo_objects){


  let this_data = geo_objects[i].data
  if (this_data){
  let all_those_paths = d3.select('#'+ geo_objects[i].container + ' svg').selectAll('path');

  all_those_paths
  .style('stroke-width', 0)
  .style('fill', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {

 return colors_candidats[this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0].loc_winner]
    }
    return 'rgb(221, 221, 221)'
  })


  }


}

d3.select('#legendots')
.style('display', 'block')


d3.select('#legend')
.style('display', 'none')

}

else if (name == 'abstention'){


d3.select("#legend .empty_circle")
.style('display', 'none')


let this_color_range = d3.scaleLinear()
  .range(['white', 'black'])
  .domain([0, 50]);

for (i in geo_objects){

  let this_data = geo_objects[i].data
    if (this_data){
  let all_those_paths = d3.select('#'+ geo_objects[i].container + ' svg').selectAll('path');

  all_those_paths
  .style('stroke-width', 0)
  .style('fill', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {
      let this_dep_data = this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0]

 let this_dep_abstention = _.round(100*this_dep_data['Abstentions'] / this_dep_data['Inscrits'], 1)
 return this_color_range(this_dep_abstention)
    }
    return 'rgb(221, 221, 221)'

  })


}



}

color_progressive_scale
.range(['white', 'black'])
.domain([0, 50]);
legend_cells.select('.swatch')
.style('fill', function(d){ return color_progressive_scale(d)})


d3.select('#legendots')
.style('display', 'none')


d3.select('#legend')
.style('display', 'block')


/*d3.select('#legend #intitule_legend')
.text('Répartition de la abstention')*/

}

else{

d3.selectAll ('#morphocarte svg path')
.style('stroke', 'black')
.style('stroke-opacity', 1)

d3.select("#legend .empty_circle")
.style('display', 'block')

let this_color = colors_candidats[name];


let this_color_range = d3.scaleLinear()
  .range(['white', this_color])
  .domain([10, 80]);

for (i in geo_objects){

  let this_data = geo_objects[i].data


    if (this_data){

  let all_those_paths = d3.select('#'+ geo_objects[i].container + ' svg').selectAll('path');

  all_those_paths
  .style('fill', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {
 let this_dep_candidate_score = this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0][name + '_score']
 return this_color_range(this_dep_candidate_score)
    }
    return 'rgb(221, 221, 221)'
  })
  .style('stroke-width', d => {
    if (typeof this_data.filter(function(e){return e[geo_objects[i].location_variable] == d.id})[0] !== 'undefined') {
 let this_dep_winner = this_data.filter(function(e){return e[geo_objects[i].location_variable]  == d.id})[0].loc_winner
 return this_dep_winner == name ? 1 : 0;
    }
    return 0
  })
}


}

color_progressive_scale
.range(['white', this_color])
.domain([-5, 35]);

legend_cells.select('.swatch')
.style('fill', function(d){ return color_progressive_scale(d)})


d3.select('#legendots')
.style('display', 'none')


d3.select('#legend')
.style('display', 'block')


/*d3.select('#legend #intitule_legend')
.text('Répartition du vote ' + _.capitalize(name))*/

}
  }

function drawGraph(range){

var this_html = '<div style="margin-top:10px">';

for (i in range){
  var d = range[i]
  var html_chunk = '<div style="margin-top:5px">'
  // html_chunk += `<div >${d.tete_liste}</div>
  html_chunk += `<div style="float:right;margin-right: 4px;font-weight:bold">  ${d.score != 100 ? d.score + ' %' : '' }</div><div style="margin-top:5px">${_.capitalize(d.name).replace('Le pen', 'Le Pen').replace('Dupont-aignan', 'Dupont-Aignan')}</div>
      <div style="height:9px;background-color: #ddd"><div style="height:8px;width:${d.score}%;background-color:${selected_element == 'abstention' ? 'grey' : colors_candidats[d.name]};"></div>
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

////////////////////////// Move candidate filters

d3.select('#triangle_droite')
.on('click', function () {
  d3.select('#affichage')
  .style('margin-left', function(){

let all_display_nodes = d3.selectAll('.display_element').nodes()
let current_margin = parseInt(d3.select('#affichage').style('margin-left'))
let this_parent_pos = d3.selectAll('#affichage').node().getBoundingClientRect().x
let new_margin

for (i in _.slice(all_display_nodes, 0,11)){

let this_pos = all_display_nodes[i].getBoundingClientRect().x - this_parent_pos

if (this_pos > -current_margin){


let next_element_order = (+i+1) <  all_display_nodes.length ? (+i+1) : (+i);
new_margin = 15.5 -(all_display_nodes[next_element_order].getBoundingClientRect().x - this_parent_pos)
break
}

}
    return new_margin + 'px'
  })
})

d3.select('#triangle_gauche')
.on('click', function () {
  d3.select('#affichage')
  .style('margin-left', function(){

    let current_margin = parseInt(d3.select(this).style('margin-left'))

    let new_margin = current_margin+150
    new_margin = new_margin > 7 ? 7 : new_margin
    return new_margin + 'px'
  })
})

let drag_start;
let margin_affichage;

var drag = d3.drag()
      .on("start", function(event){
        drag_start = event.x

        margin_affichage = parseInt(d3.select('#affichage').style('margin-left'))
      })
      .on("drag", function(event){

        let this_drag = event.x - drag_start
        let this_margin = margin_affichage+this_drag
        this_margin = this_margin >= 0 ?  this_margin = 0 : this_margin
        this_margin = this_margin <= -1200 ?  this_margin = -1200 : this_margin
        d3.select('#affichage').style('margin-left', d=>this_margin+ 'px')

    })
      .on("end", function(){

      });
d3.select("#affichage").call(drag);


d3.select("#information_button")
.on("mouseover", function(){

d3.select("#map_information")
.style('display', 'block')

})
.on("mouseout", function(){

d3.select("#map_information")
.style('display', 'none')

})

////////////////////////// Utilities functions


function updateParameters(){

  var svg = d3.select("svg");

  svg
  .attr('width', manualReusableParameters.chart_width.value);

      // d3.select('div#chart')
      // .style('width', manualReusableParameters.chart_width.value);

      svg.attr("width", manualReusableParameters.chart_width.value);
      svg
      .attr('height', manualReusableParameters.chart_height.value);

      width = manualReusableParameters.chart_width.value - initMargin.left - initMargin.right;
      height = manualReusableParameters.chart_height.value - initMargin.top - initMargin.bottom;
      width = width  - manualReusableParameters.padding_left.value - manualReusableParameters.padding_right.value;
      height = height - manualReusableParameters.padding_bottom.value- manualReusableParameters.padding_top.value;

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


 function roundAndFormatPct(x){
  return Math.abs(_.round(x,1)).toString().replace(".", ",")

     }

     function getBoundingBoxCenter (selection) {
 var element = selection.node();
 var bbox = element.getBBox();
 return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
    }


    function equalToEventTarget() {
 return this == event.target;
    }
