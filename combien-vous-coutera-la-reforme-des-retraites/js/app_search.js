
let all_loaded_dep = {}
let data_sortants
let data_T1_Presidentielle
let data_elu_2017
let data_T1_2017
let this_selection
let data_ppm
let data_retraites
let work_age = 0
let year_month_selection

var xScale,
  yScale;

var g 

moment.locale('fr')

const rattachement_financier = {}


Promise.all([
  d3.csv("data/ppm_since1900_monthly.csv"),
      d3.csv('data/retraites_duree.csv')
]).then(function(files) {
  data_ppm = files[0]
  data_retraites = files[1]

data_retraites.forEach(function(d){

d.naissance = +d.naissance
d.ouverture_droits = +(d.ouverture_droits.replace(',', '.'))
d.duree_cotis_ancien = +(d.duree_cotis_ancien.replace(',', '.'))
d.duree_cotis_nouveau = +(d.duree_cotis_nouveau.replace(',', '.'))
d.surplus_duree = +(d.surplus_duree.replace(',', '.'))
d.Surplus_age_ouverture = +(d.Surplus_age_ouverture.replace(',', '.'))

})


data_ppm.forEach(function(d){

d.year = +d.year

d.month = +d.month

})


}).catch(function(err) {
  console.log('erreur' + ' ' + err)
})




const autoCompleteJS = new autoComplete({
  placeHolder: "Mois et année de naissance. Ex : janvier 1980",
  diacritics: true,
  searchEngine: "loose",
  threshold: 4,
  resultsList: {
    maxResults: 10,
  },
  query: (input) => {
    console.log(input)
    return input.replace("'", " ");
},

data: {
    src: async (query) => { 
    return  data_ppm},
    // Data source 'Object' key to be searched
    keys: ["mois_annee"],
    cache: false
},


  resultItem: {
    highlight: true
  },
  events: {
    input: {
      selection: (event) => {

console.log(event)

        const selection = event.detail.selection.value;
        autoCompleteJS.input.value = selection.mois_annee;
        this_selection = selection

        console.log(selection)

        year_month_selection = selection

        let this_concentration = selection.de_season_avg




        write_PPM(this_concentration)



}

}
}
}
)


d3.select('#autoComplete2')
.on('change', function(d){
  console.log('changing')


  console.log(d3.select(this).property('value'))

  console.log(d)

})
.on('keyup', function() {
     if (this.value.length > 1) {
          // do search for this.value here
          console.log(this.value)
          work_age = this.value

          if (year_month_selection){
            write_PPM(year_month_selection.de_season_avg)
          }

     }
})



     /*   show_circ(all_loaded_dep[this_dep])*/

     function write_PPM(concentration){

      let this_year
      let this_retraite_sel


      if (work_age && year_month_selection){

        console.log('OK')

        console.log(work_age, year_month_selection)


        this_year = year_month_selection.year

        if (this_year == 1961){
          if (year_month_selection.month < 7){
            this_year = 1960
          }
        }


        this_retraite_sel = data_retraites.filter(d=>d.naissance == this_year)
        if (this_retraite_sel.length >=1){
          this_retraite_sel = this_retraite_sel[0]
        }
        else{
          this_retraite_sel = null
        }

        console.log(this_year)

        console.log(this_retraite_sel)






      }
      else{
        return false
      }

      d3.select('#result_naissance').html( "Le mois de votre naissance, la concentration dans l'atmosphère de CO2 était de <b>"+
       String(_.round(concentration,1)).replace('.', ',') + '</b> PPM')



   var margin = {},
   width,
   height;
   var initMargin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 40
  };


  var initTotalWidth = 600;
  var initTotalHeight = 400;

  var initWidth = initTotalWidth - initMargin.left - initMargin.right;
  var initHeight = initTotalHeight - initMargin.top - initMargin.bottom;

  var libeCategoricalColors = ['#e60004', '#7c7c7c', '#000'];

  
  var color = d3.scaleOrdinal(libeCategoricalColors);


  var categorical_color_sheme = ['libeCategoricalColors', 'LibePoliticalColors', 'schemeDark2', 'schemeAccent', 'schemePastel2', 'schemeSet2', 'schemeSet1', 'schemePastel1', 
  'schemeCategory10', 'schemeSet3', 'schemePaired', 'schemeCategory20', 'schemeCategory20b', 'schemeCategory20c'];

  var basicColors = {plain:{initial:"#e60004", personalized:null}, positive:{initial:'#85b4b2', personalized:null}, negative:{initial:"#e60004", personalized:null}};


  var data = _.cloneDeep(data_retraites);


  var manualReusableParameters = {"rotateXRow":{"value":false,"type":"checkbox","label":"pivoter l'étiquette des X","initial_value":false,"activated":1,"category":"general"},"chart_width":{"value":600,"type":"slider","label":"Largeur du graphique","initial_value":600,"min":300,"max":800,"activated":1,"category":"general"},"chart_height":{"value":400,"type":"slider","label":"Hauteur du graphique","initial_value":400,"min":200,"max":800,"activated":1,"category":"general"},"padding_bottom":{"value":0,"type":"slider","label":"marge basse","initial_value":0,"min":-100,"max":100,"activated":1,"category":"general"},"padding_left":{"value":0,"type":"slider","label":"marge gauche","initial_value":0,"min":-100,"max":100,"activated":1,"category":"general"},"padding_right":{"value":0,"type":"slider","label":"marge droite","initial_value":0,"min":-100,"max":100,"activated":1,"category":"general"},"padding_top":{"value":0,"type":"slider","label":"marge haute","initial_value":0,"min":-100,"max":100,"activated":1,"category":"general"},"sort_descending":{"value":true,"type":"checkbox","label":"tri décroissant","initial_value":true,"activated":1,"category":"general"},"invert_order":{"value":false,"type":"checkbox","label":"inverser l'ordre","initial_value":false,"activated":0,"category":"general"},"differentAxisY":{"value":false,"type":"checkbox","label":"Adapter l'axe des Y aux données","initial_value":false,"activated":0,"category":"general"},"rangeX":{"type":"checkInputs","label":"Range X personalisée","initial_left_value":null,"initial_right_value":null,"calculated_left_value":null,"calculated_right_value":null,"manual_left_value":null,"manual_right_value":null,"activated":0,"category":"general"},"rangeY":{"value":true,"type":"checkInputs","label":"Range Y personalisée","initial_left_value":null,"initial_right_value":null,"calculated_left_value":294.22,"calculated_right_value":419.49,"manual_left_value":0,"manual_right_value":null,"activated":1,"category":"general"},"color_field_select":{"value":"libeCategoricalColors","type":"colorFieldSelect","label":"Jeu de couleurs","initial_value":"libeCategoricalColors","activated":0,"fields":["libeCategoricalColors","LibePoliticalColors","schemeDark2","schemeAccent","schemePastel2","schemeSet2","schemeSet1","schemePastel1","schemeCategory10","schemeSet3","schemePaired","schemeCategory20","schemeCategory20b","schemeCategory20c"],"category":"color"},"persColorsCheck":{"value":false,"type":"persColorsCheck","label":"Couleurs personalisées","initial_value":false,"activated":1,"category":"color"},"indice_100":{"value":false,"type":"checkbox","label":"Démarrer à l'indice 100","initial_value":false,"activated":1,"category":"calculs"},"displayLabel":{"value":false,"type":"checkbox","label":"afficher la valeur","initial_value":false,"activated":1,"category":"labels"},"startEndValues":{"type":"checkInputs","label":"Valeurs de début et de fin","initial_left_value":null,"initial_right_value":null,"calculated_left_value":null,"calculated_right_value":null,"manual_left_value":null,"manual_right_value":null,"activated":1,"category":"filter"},"caseLegend":{"type":"checkSelects","label":"Afficher la légende","range":[{"value":"topRight","label":"En haut à droite"},{"value":"topLeft","label":"En haut à gauche"},{"value":"bottomLeft","label":"En bas à gauche"},{"value":"bottomRight","label":"En bas à droite"}],"initial_range_value":"topRight","manual_range_value":null,"activated":1,"category":"legend"},"padding_left_legend":{"value":0,"type":"slider","label":"marge gauche légende","initial_value":0,"min":-100,"max":100,"category":"legend","dependOn":"caseLegend"},"padding_top_legend":{"value":0,"type":"slider","label":"marge haute légende","initial_value":0,"min":-100,"max":100,"category":"legend","dependOn":"caseLegend"},"legendOrientation":{"type":"simpleSelect","label":"Orientation de la légende","range":[{"value":"vertical","label":"Verticale"},{"value":"horizontal","label":"Horizontale"}],"initial_range_value":"vertical","manual_range_value":null,"category":"legend","dependOn":"caseLegend"},"inner_padding_legend":{"value":2,"type":"slider","label":"Marge intérieure de la légende","initial_value":2,"min":-100,"max":100,"category":"legend","dependOn":"caseLegend"},"textLegendOtherCat":{"type":"simpleInputs","label":"Texte de la légende si autre","category":"legend","dependOn":"caseLegend"},"leftAxisTickNumber":{"value":10,"type":"slider","label":"Nombre de graduations à gauche","initial_value":10,"min":0,"max":20,"activated":1,"category":"grid"},"bottomAxisTickNumber":{"value":10,"type":"slider","label":"Nombre de graduations en bas","initial_value":5,"min":0,"max":20,"activated":1,"category":"grid"},"leftAxisStroke":{"type":"simpleSelect","label":"Couleur de l'axe gauche","range":[{"value":"black","label":"noir"},{"value":"#3c3c3b","label":"gris foncé"},{"value":"#7c7c7b","label":"gris moyen"},{"value":"#c6c6c6","label":"gris clair"},{"value":"#e4e4e4","label":"gris très clair"},{"value":"#f4f4f4","label":"gris très très clair"},{"value":"#fff","label":"invisible"}],"initial_range_value":"black","manual_range_value":"#fff","activated":1,"category":"grid"},"bottomAxisStroke":{"type":"simpleSelect","label":"Couleur de l'axe bas","range":[{"value":"black","label":"noir"},{"value":"#3c3c3b","label":"gris foncé"},{"value":"#7c7c7b","label":"gris moyen"},{"value":"#c6c6c6","label":"gris clair"},{"value":"#e4e4e4","label":"gris très clair"},{"value":"#f4f4f4","label":"gris très très clair"},{"value":"#fff","label":"invisible"}],"initial_range_value":"black","manual_range_value":"#fff","activated":1,"category":"grid"},"ticksStroke":{"type":"simpleSelect","label":"Couleur des graduations","range":[{"value":"black","label":"noir"},{"value":"#3c3c3b","label":"gris foncé"},{"value":"#7c7c7b","label":"gris moyen"},{"value":"#c6c6c6","label":"gris clair"},{"value":"#e4e4e4","label":"gris très clair"},{"value":"#f4f4f4","label":"gris très très clair"},{"value":"#fff","label":"invisible"}],"initial_range_value":"black","manual_range_value":"#e4e4e4","activated":1,"category":"grid"},"leftTickSize":{"type":"simpleSelect","label":"Taille des graduations horizontales","range":[{"value":"small","label":"petites"},{"value":"fullWidth","label":"largeur complète"},{"value":"invisible","label":"invisibles"}],"initial_range_value":"small","manual_range_value":"fullWidth","activated":1,"category":"grid"},"bottomTickSize":{"type":"simpleSelect","label":"Taille des graduations verticales","range":[{"value":"small","label":"petites"},{"value":"fullHeight","label":"hauteur complète"},{"value":"invisible","label":"invisibles"}],"initial_range_value":"small","manual_range_value":"invisible","activated":1,"category":"grid"},"yAxisLabel":{"value":false,"type":"checkbox","label":"Etiquette de l'axe gauche","initial_value":false,"activated":1,"category":"labels"},"xAxisLabel":{"value":false,"type":"checkbox","label":"Etiquette de l'axe bas","initial_value":false,"activated":1,"category":"labels"},"yAxisLabelPadding":{"value":0,"type":"slider","label":"Marge de l'étiquette de l'axe gauche","initial_value":0,"min":-100,"max":100,"category":"labels","activated":false,"dependOn":"yAxisLabel"},"xAxisLabelPadding":{"value":0,"type":"slider","label":"Marge de l'étiquette de l'axe bas","initial_value":0,"min":-100,"max":100,"category":"labels","activated":false,"dependOn":"xAxisLabel"},"yAxisLabelText":{"type":"simpleInputs","label":"Texte de l'étiquette de l'axe gauche","category":"labels","activated":false,"dependOn":"yAxisLabel"},"xAxisLabelText":{"type":"simpleInputs","label":"Texte de l'étiquette de l'axe bas","category":"labels","activated":false,"dependOn":"xAxisLabel"},"trimKValue":{"value":true,"type":"checkbox","label":"Supprimer les espaces inutiles","initial_value":true,"activated":0,"category":"textRemplacement"},"hideCircles":{"value":true,"type":"checkbox","label":"Supprimer les cercles","initial_value":true,"activated":1,"category":"general"},"dateField":{"value":true,"type":"checkSelects","label":"Y a-t-il un champ date ?","range":"selectedFields","initial_range_value":"topRight","manual_range_value":"datetime","initial_value":false,"activated":1,"category":"textRemplacement"},"dateFieldFormat":{"value":"YYYY-MM-DD","initial_value":"DD/MM/YYYY","type":"simpleInputs","label":"Format de date","category":"textRemplacement","activated":true,"dependOn":"dateField"},"previousDate":{"type":"simpleInputs","label":"date n-1","category":"textRemplacement","activated":true,"dependOn":"dateField"},"groupingFunction":{"type":"simpleSelect","label":"Fonction de réduction des données","range":[{"value":"sum","label":"Somme"},{"value":"mean","label":"moyenne"},{"value":"median","label":"médianne"}],"initial_range_value":null,"manual_range_value":"sum","activated":0,"category":"calculs"},"logScale":{"value":false,"type":"checkbox","label":"Echelle logarithmique","initial_value":false,"activated":1,"category":"calculs"},"beeswarnRadius":{"value":2,"type":"slider","label":"Taille des points","initial_value":2,"min":1,"max":20,"activated":0,"category":"general"},"beeswarnCollide":{"value":3,"type":"slider","label":"Eloignement des points","initial_value":3,"min":1,"max":20,"activated":0,"category":"general"},"verticalStrength":{"value":8,"type":"slider","label":"Force verticale","initial_value":8,"min":1,"max":10,"activated":0,"category":"general"},"circleRadius":{"value":3,"type":"slider","label":"Taille des cercles","initial_value":3,"min":1,"max":20,"activated":0,"category":"general"},"circleOpacity":{"value":0.9,"type":"slider","label":"Opacité des cercles","initial_value":0.9,"min":0,"max":1,"step":0.1,"activated":0,"category":"general"},"customCode":{"type":"simpleTextArea","label":"Ajouter du code js","activated":1,"category":"textRemplacement","numberOfRows":5,"value":"d3.selectAll('.axis--x .tick text').text(function(d){return moment(d,i ).format('YYYY')});"},"colorizeField":{"value":false,"type":"checkbox","label":"Colorier un champ en fonction de critères","initial_value":false,"activated":0,"category":"color"},"colorizeFieldText":{"type":"simpleInputs","label":"Critères pour colorier le champ","activated":false,"category":"color","dependOn":"colorizeField"},"colorizeFieldSelectField":{"type":"simpleSelect","label":"Nom du champ","range":[{"label":"Dans quel champ ?","value":""},{"label":"datetime","value":"datetime"},{"label":"de_season_avg","value":"de_season_avg"}],"initial_range_value":"black","manual_range_value":false,"activated":false,"category":"color","dependOn":"colorizeField"},"stackedBarWhiteSeparator":{"value":false,"type":"checkbox","label":"Séparer les rectangles","initial_value":false,"activated":0,"category":"general"},"stackedBarInsideOrder":{"type":"simpleSelect","label":"Ordre des valeurs à l'intérieur des barres","range":[{"value":"stackOrderNone","label":"Aucun ordre"},{"value":"stackOrderAscending","label":"Ordre croissant"},{"value":"stackOrderDescending","label":"Ordre décroissant"},{"value":"stackOrderInsideOut","label":"Ordre intérieur extérieur"},{"value":"stackOrderReverse","label":"Ordre inversé"}],"initial_range_value":"stackOrderNone","manual_range_value":"stackOrderNone","activated":0,"category":"general"},"CheckIfNochart":{"value":false,"type":"checkbox","label":"Pas un graph","initial_value":false,"activated":0,"category":"none"},"automaticDate":{"value":false,"type":"checkbox","label":"Reconnaissance automatique des dates","initial_value":false,"activated":1,"category":"general"},"ColorLegendPie":{"type":"simpleColorInputs","label":"Couleur de la légende","activated":0,"category":"general"},"caseCustomTooltip":{"value":true,"type":"checkSelects","label":"Tooltip personalisé","range":"selectedColNames","manual_range_value":null,"initial_value":false,"activated":1,"category":"textRemplacement"},"customTooltips":{"type":"simpleTextArea","label":"Texte du Tooltip, noms des champs entre doubles crochets.\n Ex : [[nom]], [[montant]]","activated":true,"category":"textRemplacement","dependOn":"caseCustomTooltip","numberOfRows":5,"value":"[[datetime|frenchDate]]<br>\n<strong>Concentration de l'athmosphère en co2 : </strong>[[de_season_avg]] <strong>PPM</strong>"},"moveElements":{"value":false,"type":"checkbox","label":"Déplacer les éléments","initial_value":false,"activated":1,"category":"textRemplacement"},"selectedElementType":{"value":false,"type":"simpleInputs","label":"Element sélectionné","initial_value":false,"activated":false,"category":"textRemplacement","dependOn":"moveElements"},"selectedElement":{"type":"none","activated":0,"category":"none"},"selectedParentElementType":{"value":false,"type":"simpleInputs","label":"parent de l Element sélectionné","initial_value":false,"activated":false,"category":"textRemplacement","dependOn":"moveElements"},"elementMoved":{"type":"none","activated":0,"category":"none","thoseElements":{},"thoseElementsOrder":[]},"emptyMovedElements":{"value":false,"type":"checkbox","label":"initialiser les éléments déplacés","initial_value":false,"activated":1,"category":"textRemplacement"},"barPadding":{"value":1,"type":"slider","label":"Espace entre les barres","initial_value":1,"min":1,"max":10,"activated":0,"category":"general"},"numberOfCols":{"value":2,"type":"slider","label":"Nombre de colonnes","initial_value":2,"min":1,"max":10,"activated":0,"category":"general"},"miniMarginLeft":{"value":30,"type":"slider","label":"Marge gauche entre les graphs","initial_value":30,"min":0,"max":100,"activated":0,"category":"general"},"miniMarginTop":{"value":20,"type":"slider","label":"Marge supérieure entre les graphs","initial_value":20,"min":0,"max":100,"activated":0,"category":"general"},"alignPeaks":{"value":false,"type":"checkbox","label":"Aligner les pics","initial_value":false,"activated":0,"category":"general"}};

  var graphParameters = {"selected_xRows":["datetime"],"selected_yRows":["de_season_avg"],"selected_size":[],"selected_color":[],"selected_label":[],"selected_tooltip":[],"personalizedColorsObject":{},"selectedColorScheme":"libeCategoricalColors","additionnalParam":"","selected_graph":"lineChart","chartTitle":"Concentration en CO2 depuis 1900","chartSource":"Our world in data, NOAA","annotations":[]};

  var manualCustomParameters = {"fieldsToReplace":[],"filteredFields":[]};

  color = findColorsScheme(graphParameters.selectedColorScheme);



  var parametersType = [{
    selector:'dropdiv_x', tagsArray:graphParameters['selected_xRows'], dropzoneName:'dropzoneX'},
    {selector:'dropdiv_y', tagsArray:graphParameters['selected_yRows'], dropzoneName:'dropzoneY'},
    {selector:'size_tags', tagsArray:graphParameters['selected_size'], dropzoneName:'dropzoneSize'},
    {selector:'color_tags', tagsArray:graphParameters['selected_color'], dropzoneName:'dropzoneColor'},
    {selector:'label_tags', tagsArray:graphParameters['selected_label'], dropzoneName:'dropzoneLabel'}
    ];

    var div = d3.select("body").append("div")
    .attr("id", "tooltip")
    .attr('class', 'box');


    var parseTime = d3.timeParse('%Y/%m/%d');

    d3.select("#chart")
    .attr("class", graphParameters.selected_graph);

    d3.select("#chartTitle")
    .text(graphParameters['chartTitle']);

    d3.select("#chartSubTitle")
    .text(graphParameters['chartSubTitle']);


        d3.select("#chartSource")
    .text(graphParameters['chartSource']);

    function initChart() {

      var svg = d3.select("svg")
      .call(responsivefy);

      margin = {
        top: 20,
        right: 20,
        bottom: 60,
        left: 50
      };

      width = +svg.attr("width") - margin.left - margin.right;
      height = +svg.attr("height") - margin.top - margin.bottom;

      g = svg.append("g")
      .attr('class', 'graphContainer')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")");

      g.append("g")
      .attr("class", "axis axis--y")
      .attr('transform', 'translate(0,0)');

      g.append("g")
      .attr('class', 'innerGraph');

    }

function makesmall_barchart(data_) {


var kValue = graphParameters['selected_yRows'][0];
    var dValue = graphParameters['selected_xRows'][0];
    var dValues = graphParameters['selected_xRows'];


      var this_padding_left = 40;


        var g_inner = g.select('g.innerGraph');


  xScale = d3.scaleLinear()
  .domain([18,70])
  .range([0, width]);


    yScale = d3.scaleBand().rangeRound([0, height]).padding(manualReusableParameters.barPadding.value/10);


    yScale.domain([1]);


    var axis_bottom = d3.axisBottom(xScale).ticks(manualReusableParameters.bottomAxisTickNumber.value)
    // .tickFormat(thisDateFormat)
    ;
    var axis_left = d3.axisLeft(yScale).ticks(manualReusableParameters.leftAxisTickNumber.value)
    // .tickFormat(numbers_separators)
    ;


 g.select('g.innerGraph')
    .attr("transform", "translate(" + manualReusableParameters.padding_left.value + "," + (manualReusableParameters.padding_top.value) +")");

    g.select("g.axis.axis--x")
    // .attr("transform", "translate(" + manualReusableParameters.padding_left.value + "," + height + ")")
    .attr("transform", "translate(" + (this_padding_left + manualReusableParameters.padding_left.value) + "," + (height + manualReusableParameters.padding_top.value ) + ")")
    .call(axis_bottom);

    // g.select("g.axis.axis--y")
    // .attr('transform', 'translate(' + (manualReusableParameters.padding_left.value + this_padding_left) + ',' + manualReusableParameters.padding_top.value  + ')')
    // .call(axis_left);

    // var all_bars = g_inner.selectAll("rect").data(this_grouped_data);


    g_inner
    .append("rect")
    .attr("x", (this_padding_left))
    .attr("y", function(d) { return yScale(1); })
    .attr("height", yScale.bandwidth())
    .attr("width", function(d) { return xScale(data_.ouverture_droits); });


    // all_bars
    // .transition()
    // .duration(200)
    // .attr("x", (this_padding_left))
    // .attr("y", function(d) { return y(d[kValue]); })
    // .attr("height", y.bandwidth())
    // .attr("width", function(d) { return x(d[dValue]); });

    // all_bars.exit().transition().duration(200).remove();

    // all_bars
    // .enter()
    // .append("rect")
    // .attr("class", "bar")
    // .attr("x", (this_padding_left))
    // .attr("y", function(d) { return y(d[kValue]) })
    // .attr("height", y.bandwidth())
    // .attr("width", function(d) { return x(d[dValue]); })
    // .attr('fill', '#e60004')
    // .on('mouseover', function(d, i){ show_tooltip(d)})
    // .on('mouseout', function(d){ hide_tooltip()});

}


function makeLinechart(data_) {

    var data = _.cloneDeep(data_);
      var initial_data = _.cloneDeep(data);
      var kValue = graphParameters['selected_xRows'][0];
      var dValues = graphParameters['selected_yRows'];
      var dValue = dValues[0];
      var svg = d3.select("svg");
      var g = svg.select('g.graphContainer');
      var g_inner = g.select('g.innerGraph');

      updateParameters();

      data = recalculateAndTransformValues(initial_data, kValue, dValues)

      if (manualReusableParameters.startEndValues.value != 0 && manualReusableParameters.startEndValues.value !== undefined){

        var this_x_values = data.map(function(d){return d[kValue]})
        var minXval =  manualReusableParameters.startEndValues.manual_left_value ?  manualReusableParameters.startEndValues.manual_left_value : +this_x_values[0];
        var maxXval =  manualReusableParameters.startEndValues.manual_right_value ?  manualReusableParameters.startEndValues.manual_right_value : +this_x_values[this_x_values.length -1];

        data = data.filter(function(d){return d[kValue] >= minXval && d[kValue] <= maxXval});
    }


    if (manualReusableParameters.indice_100.value == 1){

        if (checkIfpercentageInArray(data, dValues) == true){


            data = prepareLineChartIndice100Growth(data, kValue, dValues);

        }
        else{

            data = prepareLineChartIndice100Value(data, kValue, dValues);
        }
    }

    else{
      data = prepareLineChartData(data, kValue, dValues);
  }

  manualReusableParameters.rangeY.calculated_left_value =  d3.min(data, function(d) { return d3.min(d, function(e) { return e['y_value'] }) });
  manualReusableParameters.rangeY.calculated_right_value =  d3.max(data, function(d) { return d3.max(d, function(e) { return e['y_value'] }) });

  var thisYMin = manualReusableParameters.rangeY.value === false ?  manualReusableParameters.rangeY.calculated_left_value : manualReusableParameters.rangeY.manual_left_value !== null ? manualReusableParameters.rangeY.manual_left_value : manualReusableParameters.rangeY.calculated_left_value;
  var thisYMax = manualReusableParameters.rangeY.value === false ?  manualReusableParameters.rangeY.calculated_right_value : manualReusableParameters.rangeY.manual_right_value !== null ? manualReusableParameters.rangeY.manual_right_value : manualReusableParameters.rangeY.calculated_right_value;

  xScale = xScaleType()
  .domain([d3.min(data, function(d) { return d3.min(d, function(e) { return e['x_value'] }) }),
    d3.max(data, function(d) { return d3.max(d, function(e) { return e['x_value'] }) }) ])
  .range([0, width]);

  console.log(data)


  var thisScaleType = manualReusableParameters.logScale.value ? d3.scaleLog(2) : d3.scaleLinear();

  yScale = thisScaleType
  .domain([thisYMin,
    thisYMax
    ])
  .range([height, 0]);

  changeAxis(xScale, yScale);

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

var line = d3.line()
.x(function(d) { return xScale(d.x_value) })
.y(function(d) { return yScale(d.y_value)
})


        // .curve(d3.curveCatmullRom.alpha(0.5))


        var allLines = g_inner
        .selectAll('.line')
        .data(data);

        allLines
        .transition()
        .duration(200)
        .attr('d', function(d) { return line(d) })
        .style('stroke', function(d) { return colorUpdated(d[0].name) });

        allLines.exit().transition().duration(200).remove();

        allLines
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('d', function(d) { return line(d) })
        .style('stroke', function(d) { return colorUpdated(d[0].name) })
        .style('stroke-width', 2)
        .style('fill', 'none');

        AllDotPoints = g_inner
        .selectAll('circle.dotPoint')
        .data(_.flatten(data));

        AllDotPoints
        // .transition()
        // .duration(200)
        .attr('cx', function(d) { return xScale(d.x_value) })
        .attr('cy', function(d) { return yScale(d.y_value) })
        .style('fill', function(d) { return colorUpdated(d.name) })
        .style('fill-opacity', function() { return manualReusableParameters.hideCircles.value ? 0 : 1 });

        AllDotPoints.exit().transition().duration(200).remove();

        AllDotPoints
        .enter()
        .append('circle')
        .attr('class', 'dotPoint')
        .attr('cx', function(d, i) { return xScale(d.x_value) })
        .attr('cy', function(d) { return yScale(d.y_value) })
        .style('fill', function(d) { return colorUpdated(d.name) })
        .attr('r', 3)
        .style('stroke-width', 5)
        .style('stroke', 'white')
        .style('stroke-opacity', 0)
        .style('fill-opacity', function() { return manualReusableParameters.hideCircles.value ? 0 : 1 })
        // .style('fill', 'black')
        // .on('mouseover', function(d, i){
        //     var thoseVars = [];
        //     if (moment.isMoment(d.x_value)){ thoseVars.push({'name': 'date', 'value':d.x_value.locale('fr').format('DD MMMM YYYY')})};
        //     if (manualReusableParameters.indice_100.value){ thoseVars.push({'name': 'valeur', 'value':d.y_value})};
        //     show_tooltip(_.find(initial_data, function(e){
        //     return formatNumbersDate(e[graphParameters.selected_xRows[0]], graphParameters.selected_xRows[0]) == d.x_value}), d.name, thoseVars)})
        // .on('mouseout', function(d){ hide_tooltip()});
        ;

        allLabels =  g_inner
        .selectAll('text.label')
        .data(data.map(function(d){return d[d.length -1]}));

        var allLabelsE = allLabels
        .enter()
        .append('text')
        .attr('class', 'label');

        allLabels.exit().remove()

        allLabels
        .merge(allLabelsE)
        .attr('x', function(d){return xScale(d.x_value) + 6})
        .attr('y', function(d){return yScale(d.y_value) - 6})
        .attr('text-anchor', 'start')
        .text(function(d){return manualReusableParameters.displayLabel.value ? _.capitalize(d.name) : ''})
        .attr('fill', function(d){return colorUpdated(d.name)});


    // cells.exit().remove();


/// Axis Label

g_inner
.call(xAxisLabel, graphParameters.selected_xRows[0]);

g_inner
.call(yAxisLabel, graphParameters.selected_yRows[0]);



  customizeAxis()

  drawLegend()
  addCustomCode()

d3.selectAll('#vous_etes_ici_circle, #vous_etes_ici_texte, #text_bar_350').remove()

d3.selectAll('g.axis--y .tick line').filter(d=>d == 350).style('stroke', 'black').style('stroke-dasharray', '2 2').style('stroke-width', '1px')

d3.select('.graphContainer').append('text')
.attr('id', 'text_bar_350').text('taux maximal acceptable de CO2 ')
.attr('text-anchor', 'middle').attr('x', xScale(moment('1920-01-01')))
.attr('y', yScale(357)).attr('fill', 'black').style('font-size', '13px')

d3.select('.graphContainer').append('circle')
.attr('id', 'vous_etes_ici_circle')
.attr('cx', xScale(moment(this_selection.datetime)))
.attr('cy', yScale(this_selection.de_season_avg))
.attr('stroke', 'black')
.attr('r', 9)
.attr('fill-opacity', 0)
.attr('stroke-width', '4px');



d3.select('.graphContainer').append('text')
.attr('id', 'vous_etes_ici_texte').text('Vous êtes né.e ici')
.attr('text-anchor', 'end')
.attr('x', xScale(moment(this_selection.datetime)) > 74 ? xScale(moment(this_selection.datetime)) : 74)
.attr('dx', '-1em')
.attr('dy', '-0.7em')
.attr('y', yScale(this_selection.de_season_avg))
.attr('fill', 'black').style('font-size', '13px')
.style('font-weight', 'bold')


}

initChart();

makesmall_barchart(data);


zeroParameters()

d3.select("svg").call(responsivefy)

// output_from_parsed_html_template = html_template.render(this_title=this_title, chart_html=chart_html, 
//         chart_data=data, chart_parameters=chart_parameters, chart_function=chart_function)

// 

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

// Hack for Iphone

function zeroParameters(){

var svg = d3.select("svg");
svg.attr('width', null);
svg.attr('height', null);

}

/// MISCELLANEOUS FUNCTIONS

function emptyChart(){

  d3.select('#varSwitch').selectAll("*").remove();
  d3.select("#chart .graphContainer .innerGraph").selectAll("*").remove();
  d3.select("#chart .graphContainer .axis--x").selectAll("*").remove();
  d3.select("#chart .graphContainer .axis--y").selectAll("*").remove();
}

function responsivefy(svg, width, height) {

    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
    width = manualReusableParameters.chart_width.value,
    height = manualReusableParameters.chart_height.value,
        // aspect = width / height;
        aspect = width / height;

    // add viewBox and preserve aspectratio properties
    // call resize so that svg resizes on initial page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);

    // to register multiple listeners for the same event type
    d3.select(window).on("resize." + container.attr("id"), resize);

    function resize() {

      var targetWidth = parseInt(container.style("width"));
      var targetHeight = Math.round(targetWidth / aspect);

      svg.attr("width", targetWidth);
      svg.attr("height", targetHeight);

    }
  }

/*End Chart function*/







function number_separator(x) {
  let y = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return y.replace(',', ' ').replace(',', ' ').replace('.', ',')
}




/*Useful (or not) charts*/


var libeCategoricalColors = ['#e60004', '#7c7c7c', '#000'];
var color = d3.scaleOrdinal(libeCategoricalColors);


function makeVarSwitch (rowsToSwitch, this_function, data){

  var allSwitch = d3.select('#varSwitch')
  .selectAll('span.tag')
  .data(rowsToSwitch);

  allSwitch
  .text(function(d){return d});

  allSwitch.exit().remove();

  allSwitch
  .enter()
  .append('span')
  .attr('class', 'tag')
  .text(function(d){return d})
  .on('click', function(d){

    rowsToSwitch.splice(rowsToSwitch.indexOf(d), 1);
    rowsToSwitch.unshift(d);
    manualCustomParameters['rowsToSwitch'] = rowsToSwitch;

    this_function(data);



    if (typeof(responsivefy) !== 'undefined'){

    var svg = d3.select("svg")
      .call(responsivefy);
  }

    d3.selectAll('#varSwitch span.tag')
    .classed('is-primary', false);

        d3.select(this)
    .classed('is-primary', true);
}

);

  d3.select('#varSwitch span.tag')
  .classed('is-primary', true);

}


function thisArrayIfObject(objectData) {

  var arrayData = objectData.map(function(d) { return d3.values(d) });
  arrayData.unshift(d3.keys(objectData[0]));
  return arrayData

}


// d3.select('#chart')
// .style('display' ,'none');

// d3.select('#noChart')
// .style('display' ,'block');


// var thisTitle = d3.select('#chart #chartTitle').node().cloneNode(true)

// d3.select('#noChart').node().insertBefore(thisTitle, d3.select('#my-data-table_wrapper').node())



////////////////////////////////////
//////////////////////CHART UTILITIES FUNCTIONS

function show_tooltip(d, name, vars, thoseParam) {

 var d = d.data ? d.data : d;

 if (d){
    d3.select("#tooltip").style('display', 'block');

    var dx = d3.event.pageX;
    var dy = d3.event.pageY - 28;

    // var this_chart_width = Math.round(svgGraphContainer.node().getBBox().width);
    var this_chart_right = d3.select('#chart svg').node().getBoundingClientRect().right

        var this_inner_html = '';
        this_inner_html = name ? '<strong>' + name + '</strong><br />' : '';
        if (vars){
            for (i in vars){
                this_inner_html += '<strong>'+ vars[i]['name'] + '</strong> : '+ vars[i]['value']+ '</strong><br />'
            }
        }


        if (graphParameters.selected_tooltip && graphParameters.selected_tooltip.length > 0){
            var param_array = [graphParameters.selected_tooltip]
            // var tooltip_values = 1
        }
        else if (thoseParam){
            var param_array = thoseParam
        }
        else{
                        var param_array = [graphParameters.selected_xRows, graphParameters.selected_yRows, 
                graphParameters.selected_size, graphParameters.selected_color, graphParameters.selected_label];
        }

        for (i in param_array){
         var inner_array =param_array[i];
         if (_.isEmpty(inner_array) == false){
          for (j in inner_array){

           this_inner_html += '<strong>'+ inner_array[j] + '</strong> : '+ (d[inner_array[j]] ?  formatIfNumbers(d[inner_array[j]]) : formatIfNumbers(d3.values(d)[i]))+ '</strong><br />'
       }
   } 
}

if (manualReusableParameters.caseCustomTooltip.value && manualReusableParameters.customTooltips.value){

    this_inner_html = manualReusableParameters.customTooltips.value;

    var thoseValuesArray = this_inner_html.match(/\[\[(.*?)\]\]/g);

    var TextTransformationFonctions = {'round':_.round,
'frenchDate': dateToFrench,
'number_separator':numbers_separators}

    for (i in thoseValuesArray){
        var v = thoseValuesArray[i];
        var k = v.replace('[[', '').replace(']]', '');
        k = k.split('|')
        var k0 = k[0]
        var d0 = d[k0]
        // if (k[1] ){

            // console.log(k[1]);
            // console.log(TextTransformationFonctions[k[1]]);
            // console.log(TextTransformationFonctions[k[1]]);
            // console.log(TextTransformationFonctions[k[1]](+d[k0]));
            // console.log(d[k0]);
            // console.log(Math.round(+d[k0]));
        // }
        if (k[1] && k[1] == 'frenchDate'){
            d0 = TextTransformationFonctions[k[1]](d0);
            this_inner_html = this_inner_html.replace(v, d0);
        }
        else{
        d0 = k[1] ? (k[2] ? TextTransformationFonctions[k[1]](+d0, k[2]) : TextTransformationFonctions[k[1]](+d0)) : d0;
        this_inner_html = this_inner_html.replace(v, d0)

        }
    }
}


d3.select("#tooltip")
.classed('is-active', true)
.html(this_inner_html);

var thisTooltip = d3.select('#tooltip').node().getBoundingClientRect();

if (dx > (this_chart_right - thisTooltip.width)){

dx = (this_chart_right - thisTooltip.width - 10)

}


d3.select("#tooltip")
.style("left", (dx) + "px")
.style("top", (dy) + "px");

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

function dateToFrench(date){

return moment(date).format('LL')

}

function numbers_separators(num){
    return num.toLocaleString('fr-FR', {minimumFractionDigits: 0});
}

function indice100growth(array){

// var aus = dataFromFile.map(function(d) { return +d.AUS });

var this_array = [100]
for (i in array){
    var d = array[i];
    this_array.push(this_array[i] * (100 + d));
}

return this_array;

}

function drawLegend(){

    var svgGraphContainer = d3.select('svg g.graphContainer');
    svgGraphContainer.select('g.legendOrdinal').remove();

    if (manualReusableParameters.caseLegend.value){

        var thisLegendorientation =  manualReusableParameters.legendOrientation.manual_range_value ? manualReusableParameters.legendOrientation.manual_range_value : manualReusableParameters.legendOrientation.initial_range_value;
        var this_inner_padding = manualReusableParameters.inner_padding_legend.value ? manualReusableParameters.inner_padding_legend.value : manualReusableParameters.inner_padding_legend.initial_value;

        svgGraphContainer.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate("+ (width - 100 )+  ",20)");

        if (manualReusableParameters.persColorsCheck.value){

            color.domain(d3.keys(graphParameters.personalizedColorsObject))
      }

        var ordinal = d3.scaleOrdinal()
        .domain(color.domain())
        .range(color.range());

        var legendOrdinal = d3.legendColor()
        .orient(thisLegendorientation)
        .shapeWidth(15)
        .shapeHeight(15)
        .shapePadding(this_inner_padding)
        .scale(ordinal);

        if (manualReusableParameters.colorizeField && manualReusableParameters.colorizeFieldText.value){

            var this_new_color_range = ['#e60004', '#7c7c7b']
            var thisOtherLegendText = manualReusableParameters.textLegendOtherCat.value ? manualReusableParameters.textLegendOtherCat.value : 'Autres';
            var this_new_domain = [manualReusableParameters.colorizeFieldText.value, thisOtherLegendText];

            ordinal
            .domain(this_new_domain)
            .range(this_new_color_range)
        }

        svgGraphContainer.select(".legendOrdinal")
        .call(legendOrdinal);

        var thisElementWidth = Math.round(d3.select('.legendOrdinal').node().getBBox().width);
        var thisElementHeight = Math.round(d3.select('.legendOrdinal').node().getBBox().height);
        var this_chart_width = Math.round(svgGraphContainer.node().getBBox().width);
        var this_chart_height = Math.round(svgGraphContainer.node().getBBox().height);

        svgGraphContainer.selectAll(".legendOrdinal text.label")
        .style('font-size', '0.8rem');

        var this_padding_left = manualReusableParameters.padding_left_legend.value ? manualReusableParameters.padding_left_legend.value : 0;
        var this_padding_top = manualReusableParameters.padding_top_legend.value ? manualReusableParameters.padding_top_legend.value : 0;

        if (manualReusableParameters.caseLegend.manual_range_value){
            if (manualReusableParameters.caseLegend.manual_range_value == 'topRight'){
                var thisElementLeftMargin = (this_chart_width - thisElementWidth + this_padding_left);
                var thisElementTopMargin = (20 + this_padding_top);
            }
            else if (manualReusableParameters.caseLegend.manual_range_value == 'topLeft'){
                var thisElementLeftMargin = 20 + this_padding_left;
                var thisElementTopMargin = (20 + this_padding_top);
            }
            else if (manualReusableParameters.caseLegend.manual_range_value == 'bottomLeft'){
                var thisElementLeftMargin = (20 + this_padding_left);
                var thisElementTopMargin = (this_chart_height - thisElementHeight + this_padding_top );
            }
            else if (manualReusableParameters.caseLegend.manual_range_value == 'bottomRight'){
                var thisElementLeftMargin = (this_chart_width - thisElementWidth  + this_padding_left);
                var thisElementTopMargin = (this_chart_height - thisElementHeight + this_padding_top ); 
            }
        }
        else{
            var thisElementLeftMargin = (this_chart_width - thisElementWidth  + this_padding_left);
            var thisElementTopMargin = (20 + this_padding_top);
        }

        svgGraphContainer.select(".legendOrdinal")
        .attr("transform", "translate("+ thisElementLeftMargin +  ","+ thisElementTopMargin + ")");

        if (manualReusableParameters.persColorsCheck.value){
            svgGraphContainer.selectAll(".legendOrdinal g.cell rect").style('fill', function(d){return colorUpdated(d)})
        }
    }
}

function changeAxis(xScale, yScale){

    if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value){

        moment.locale('fr')
        function thisDateFormat (d){ return moment(d).format('L')}

    }
    else{

        function thisDateFormat (d){ return d}
    }

    if (graphParameters.selected_graph != 'barChartHorizontal'){
    axis_bottom = d3.axisBottom(xScale).ticks(manualReusableParameters.bottomAxisTickNumber.value).tickFormat(thisDateFormat);
    axis_left = d3.axisLeft(yScale).ticks(manualReusableParameters.leftAxisTickNumber.value).tickFormat(numbers_separators);
    }

    else{
    axis_bottom = d3.axisBottom(xScale).ticks(manualReusableParameters.bottomAxisTickNumber.value).tickFormat(numbers_separators);
    axis_left = d3.axisLeft(yScale).ticks(manualReusableParameters.leftAxisTickNumber.value).tickFormat(thisDateFormat);
    }
}

function customizeAxis(){

    var svg = d3.select('svg');
    svg.select("g.axis--x path").attr('stroke', manualReusableParameters.bottomAxisStroke.manual_range_value)
    svg.select("g.axis--y path").attr('stroke', manualReusableParameters.leftAxisStroke.manual_range_value)
    svg.selectAll("g.axis--x, g.axis--y").selectAll('g.tick line').attr('stroke', manualReusableParameters.ticksStroke.manual_range_value);

    if (manualReusableParameters.leftTickSize.manual_range_value){
        if (manualReusableParameters.leftTickSize.manual_range_value == 'small'){var thisLeftTickx1Value = 0  }
            else if (manualReusableParameters.leftTickSize.manual_range_value == 'fullWidth'){var thisLeftTickx1Value = width  }
                else if (manualReusableParameters.leftTickSize.manual_range_value == 'invisible'){var thisLeftTickx1Value = -6  }
            }
        else {var thisLeftTickx1Value = 0  }

            if (manualReusableParameters.bottomTickSize.manual_range_value){
                if (manualReusableParameters.bottomTickSize.manual_range_value == 'small'){var thisBottomTickx1Value = 0  }
                    else if (manualReusableParameters.bottomTickSize.manual_range_value == 'fullHeight'){var thisBottomTickx1Value = -height  }
                        else if (manualReusableParameters.bottomTickSize.manual_range_value == 'invisible'){var thisBottomTickx1Value = 6  }
                    }
                else {var thisBottomTickx1Value = 0  }

                    svg.select("g.axis--y").selectAll('g.tick line').attr('x1', thisLeftTickx1Value);
                    svg.select("g.axis--x").selectAll('g.tick line').attr('y1', thisBottomTickx1Value);

            }

            function xAxisLabel(sel, labelText){

                if (manualReusableParameters.xAxisLabel.value && manualReusableParameters.xAxisLabelText.value){
                    var labelText = manualReusableParameters.xAxisLabelText.value;
                }
                else{
                    var labelText = "";
                }

                var thisPadding =  manualReusableParameters.xAxisLabelPadding.value ? +manualReusableParameters.xAxisLabelPadding.value : 0;

                var this_sel = sel
                .selectAll('text.xAxisLabel')
                .data([labelText]);

                this_sel.exit().remove();

                this_selE = this_sel
                .enter()
                .append("text")
                .attr('class', 'xAxisLabel');

                this_sel
                .merge(this_selE)         
                .attr("transform",
                    "translate(" + (width/2) + " ," + 
                    (+thisPadding + height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .html(function(d){return d});

            }

            function yAxisLabel(sel, labelText){

                if (manualReusableParameters.yAxisLabel.value && manualReusableParameters.yAxisLabelText.value){
                    var labelText = manualReusableParameters.yAxisLabelText.value;
                }
                else{
                    var labelText = "";
                }

                var thisPadding =  manualReusableParameters.yAxisLabelPadding.value ? +manualReusableParameters.yAxisLabelPadding.value : 0;
                var this_sel = sel
                .selectAll('text.yAxisLabel')
                .data([labelText]);

                this_sel.exit().remove();

                this_selE = this_sel
                .enter()
                .append("text")
                .attr('class', 'yAxisLabel')
                .attr("transform", "rotate(-90)")
                ;

                this_sel
                .merge(this_selE)         
                .attr("y", (+thisPadding - margin.left))
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .html(function(d){return d});

            }

            function xScaleType(){

                if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value){
                    return d3.scaleTime()
                }
                else{
                    return d3.scaleLinear()
                }

            }

function ifLogScale(){

                if (manualReusableParameters.ifLogScale.value && manualReusableParameters.ifLogScale.manual_range_value){
                    return d3.scaleLog()
                }
                else{
                    return d3.scaleLinear()
                }
            }

            function recalculateAndTransformDate(data) {

                var this_data = _.cloneDeep(data);
                moment.locale('fr')

                    if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value){
                        this_data.forEach(function(d){
                            d[manualReusableParameters.dateField.manual_range_value] = moment(d[manualReusableParameters.dateField.manual_range_value], manualReusableParameters.dateFieldFormat.value);
                        })
                    }
                    else if (manualReusableParameters.automaticDate.value== true){



                        this_data = automaticDateRecognition(this_data)
                    }

                    return this_data
                }

                function recalculateAndTransformValues(data, kValue, dValues, kValues) {

                    var this_data = _.cloneDeep(data);
                    this_data.forEach(function(d){
                        for (i in dValues){
                            e = dValues[i]
                            d[e] = +String(d[e]).replace(',', '.');
                        }
                    })

                    if (manualReusableParameters.trimKValue.value){
                        this_data.forEach(function(d){
                            d[kValue] = _.trim(d[kValue]);
                        })
                    }

                    if (_.isEmpty(manualCustomParameters['fieldsToReplace']) == false){

                        for(i in manualCustomParameters['fieldsToReplace'])
                            if (manualCustomParameters['fieldsToReplace'][i].name && manualCustomParameters['fieldsToReplace'][i].newValue && manualCustomParameters['fieldsToReplace'][i].oldValue){

                                this_data.forEach(function(d){
                                    d[manualCustomParameters['fieldsToReplace'][i].name] = d[manualCustomParameters['fieldsToReplace'][i].name] == manualCustomParameters['fieldsToReplace'][i].oldValue ? manualCustomParameters['fieldsToReplace'][i].newValue : d[manualCustomParameters['fieldsToReplace'][i].name];
                                })


                            }

                        }

                    if (_.isEmpty(manualCustomParameters['filteredFields']) == false){
                        for(i in manualCustomParameters['filteredFields']){
                            
                            var r = manualCustomParameters['filteredFields'][i]
                            this_data = this_data.filter(function(d){return eval('"' + d[r.name] + '"' + r.comparator + '"' + r.varToCompare + '"')})

                        }

                        }

                        if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value){
                            this_data.forEach(function(d){
                                d[manualReusableParameters.dateField.manual_range_value] = moment(d[manualReusableParameters.dateField.manual_range_value], manualReusableParameters.dateFieldFormat.value);
                            })
                        }
                        else{


                          if (manualReusableParameters.automaticDate.value== true){

                            this_data = automaticDateRecognition(this_data)
                          }

                            }


                            if (kValues && kValues[1]){
                                this_data = getPivotArrayOfObj(this_data, kValue, kValues[1], dValues[0])
                            }

                            return this_data
                        }

function automaticDateRecognition(this_data){


                            if (d3.sum(this_data.map(function(d){return isNaN(+d[graphParameters.selected_xRows[0]])})) >= 1){

                                if(d3.sum(dataFromFile.map(function(d){return  moment(d[graphParameters.selected_xRows[0]]).isValid() == false})) < 1){

                                    this_data.forEach(function(d){
                                        d[graphParameters.selected_xRows[0]] = moment(d[graphParameters.selected_xRows[0]]);
                                    })

                                    manualReusableParameters.dateField.manual_range_value = graphParameters.selected_xRows[0]
                                    manualReusableParameters.dateField.value = true
                                    manualReusableParameters.dateFieldFormat.value = 'YYYY-MM-DD'
                                }

                                else  if(d3.sum(dataFromFile.map(function(d){return  moment(d[graphParameters.selected_xRows[0]], 'DD-MM-YYYY').isValid() == false})) < 1){

                                    this_data.forEach(function(d){
                                        d[graphParameters.selected_xRows[0]] = moment(d[graphParameters.selected_xRows[0]], 'DD-MM-YYYY');
                                    }) 
                                    manualReusableParameters.dateField.manual_range_value = graphParameters.selected_xRows[0]
                                    manualReusableParameters.dateField.value = true
                                    manualReusableParameters.dateFieldFormat.value = 'DD-MM-YYYY'

                                }
                                    else  if(d3.sum(dataFromFile.map(function(d){return  moment(d[graphParameters.selected_xRows[0]], 'YYYY-DD-MM').isValid() == false})) < 1){

                                        this_data.forEach(function(d){
                                            d[graphParameters.selected_xRows[0]] = moment(d[graphParameters.selected_xRows[0]], 'YYYY-DD-MM');
                                        })

                                    manualReusableParameters.dateField.manual_range_value = graphParameters.selected_xRows[0]
                                    manualReusableParameters.dateField.value = true
                                    manualReusableParameters.dateFieldFormat.value = 'YYYY-DD-MM'
                                    }
                                }

                                return this_data
}

function add_tooltip_values(this_grouped_data, data, kValue){

        this_grouped_data.forEach(function(d) {
            var o = data.filter(function(e){return e[kValue] ==  d[kValue]})[0];
        for (i in graphParameters.selected_tooltip){
            var this_el = graphParameters.selected_tooltip[i]
            if (d3.keys(d).indexOf(this_el) == -1){
                d[this_el] = o[this_el];
            }
        }
    })
    return this_grouped_data
}

function addCustomCode(){

if (manualReusableParameters.moveElements.value)
{
d3.select('.parameterElement.selectedElementType input').attr('readonly', 'true')
d3.select('.parameterElement.selectedParentElementType input').attr('readonly', 'true')
selectElementToDrag()
ReplaceThoseElements()}
else
{removeElementDrag()}


if (manualReusableParameters.emptyMovedElements.value == true){
emptyMovedElements()
}

if (eval(manualReusableParameters.customCode.value))
    {eval(manualReusableParameters.customCode.value);
    }
}


function emptyMovedElements(){

manualReusableParameters.elementMoved.thoseElements = {};
manualReusableParameters.elementMoved.thoseElementsOrder = [];

manualReusableParameters.emptyMovedElements.value == false;


}


function colorizeOnlyOneCategory(listOfObjectsToColorize){



    if (manualReusableParameters.colorizeField.value && manualReusableParameters.colorizeFieldSelectField.manual_range_value && manualReusableParameters.colorizeFieldText.value){
        var this_field = manualReusableParameters.colorizeFieldSelectField.manual_range_value;
        var this_value = manualReusableParameters.colorizeFieldText.value;

        console.log(this_field, this_value)

// var this_color_range = _.cloneDeep(color.range())
var this_color_range = ['#e60004', '#7c7c7b']

for (i in listOfObjectsToColorize){

    var thisObjectToColorize = listOfObjectsToColorize[i]
    var this_svg_element = thisObjectToColorize['svg_element']
    var this_if_first_value = typeof(thisObjectToColorize.look_in_object) !== 'undefined' ? thisObjectToColorize['look_in_object'] !== false ? true : false : false;
    var this_look_in_object = thisObjectToColorize['look_in_object']
    var this_if_reappend_nodes = thisObjectToColorize['reappend_nodes'] ? true : false ;
    var those_property_types = thisObjectToColorize['property_types']
    // console.log(this_svg_element, this_if_first_value, this_field, this_value, those_property_types)

    if (this_if_first_value){
        var those_svg_elements = d3.selectAll('svg g.innerGraph ' + this_svg_element).filter(function(d){return d[this_look_in_object][this_field] == this_value})
    }

    else{
       var those_svg_elements = d3.selectAll('svg g.innerGraph ' + this_svg_element).filter(function(d){return d[this_field] == this_value})
    }

    var thoseNodes = those_svg_elements.nodes()

    for (j in those_property_types){
        var this_property_type = those_property_types[j]
        d3.selectAll('svg g.innerGraph ' + this_svg_element).style(this_property_type,this_color_range[1])
        those_svg_elements.style(this_property_type, this_color_range[0]);




    }

    if (this_if_reappend_nodes){
    for (j in thoseNodes){
        var this_node = thoseNodes[j]
        this_node.parentNode.appendChild(this_node)
    } 
}
}

}
else{

for (i in listOfObjectsToColorize){

    var thisObjectToColorize = listOfObjectsToColorize[i]
    var this_svg_element = thisObjectToColorize['svg_element']
    var those_property_types = thisObjectToColorize['property_types']
    for (j in those_property_types){
        var this_property_type = those_property_types[j]
        d3.selectAll('svg g.innerGraph ' + this_svg_element).style(this_property_type,null)
    }
}
}
}

function getPivotArrayOfObj(dataArray, rowIndex, colIndex, dataIndex) {

        var result = {}, ret = [];
        var newCols = [];
        for (var i = 0; i < dataArray.length; i++) {
 
            if (!result[dataArray[i][rowIndex]]) {
                result[dataArray[i][rowIndex]] = {};
            }
            result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];
 
            //To get column names
            if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
                newCols.push(dataArray[i][colIndex]);
            }
        }
 
        newCols.sort();
        var item = [];
 
        //Add content 
        for (var key in result) {
            item = {};
            item[rowIndex] = key;
            for (var i = 0; i < newCols.length; i++) {
                //item.push(result[key][newCols[i]] || "-");
                item[newCols[i]] = result[key][newCols[i]]
            }
            ret.push(item);
        }
        return ret;
    }



///////////////////////////////////////////////////////////////
//////////////////// UTILITIES FUNCTIONS

function formatNumbers(n){

  if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value && typeof(n) == "object"){
return n
  }

  var new_n = /^(\d+,\d+)$/.test(n) ? n.replace(',', '.') : n;
  new_n = +new_n;

  return new_n  

}

function formatIfNumbers(n){

  if (manualReusableParameters.dateField.value && manualReusableParameters.dateField.manual_range_value && typeof(n) == "object"){


if (moment(n, manualReusableParameters.dateFieldFormat.value).isValid() == true){
moment.locale('fr')


return moment(n).format('L')

}

return n
  }
  else if (isNaN(n)){
    return n
  }
  else if (n > 100){
    return _.round(n)
  }

  return _.round(n, 2)

}


function formatNumbersDate(n, field){

  if (manualReusableParameters.dateField.value == true && manualReusableParameters.dateField.manual_range_value == field){
    return +moment(n, manualReusableParameters.dateFieldFormat.value)
  }
  return +n  
}

  var parseTime = d3.timeParse('%Y/%m/%d');

  function normalizeChars(text) {
    return _.camelCase(_.deburr(text))
  }

function arrayIfObject(objectData) {

  var arrayData = objectData.map(function(d) { return d3.values(d) });
  arrayData.unshift(d3.keys(objectData[0]));
  return arrayData

}

function objectIfArray(arrayData) {

  var objectData = arrayData.slice(1).map(function(d) {
    var this_object = {}
    for (i in arrayData[0]) {
      this_object[arrayData[0][i]] = d[i];
    }
    return this_object
  })
  return objectData
}

function groupbyKV(data, key, value, this_function) {
  var result = d3.nest()
  .key(function(d) { return d[key] })
  .rollup(function(v) { return this_function(v, function(e) { return e[value] })
})
  .entries(data)
  return result
}

function groupbyKVMultiple(data, key, values, this_function) {
  var result = d3.nest()
  .key(function(d) { return d[key] })
  .rollup(function(v) {
    var those_values = {};
    for (i in values){
      var this_value = values[i];
      those_values[this_value] = this_function(v, function(e) { return e[this_value]} )
    }

    return { those_values}
  })
  .entries(data);

  result = result.map(function(d){ return _.assign({[key]: d['key'] }, d['value']['those_values'])});

  return result
}

function prepareLineChartData(data, kValue, dValues) {
  var new_data = [];

  for (i in dValues) {
    var v = dValues[i];

    new_data.push(data.map(function(d) {
      return {
        x_value: formatNumbers(d[kValue]),
        name: v,
        y_value: formatNumbers(d[v])
      }
    }));
  }

  return new_data
}

function prepareLineChartIndice100Growth(data, kValue, dValues) {
  var new_data = [];

  for (i in dValues) {
    var v = dValues[i];
    if (manualReusableParameters.dateField.value && manualReusableParameters.previousDate.value){
        var nMoins1 = moment(manualReusableParameters.previousDate.value, manualReusableParameters.dateFieldFormat.value);
    }
    else{
      var nMoins1 = (formatNumbers(data[0][kValue]) - 1);
    }
    var new_data_next = [{ x_value: nMoins1, name: v, y_value: 100}];

for (i in data){
var d = data[i];
new_data_next.push({x_value: (formatNumbers(d[kValue])), name: v, y_value:_.round((new_data_next[i].y_value * ((100 + (formatNumbers(d[v])))/100)), 2)});
}

new_data.push(new_data_next)
  }


// Get last period if date

if (moment.isMoment(new_data[0][1].x_value)){

new_data = getLastPeriod(new_data)

}


  return new_data
}

function getLastPeriod(new_data){

  for (i in new_data){

var thisNewData = new_data[i]
var month_delta = thisNewData[2].x_value.month() - thisNewData[1].x_value.month()
var yearT1 = thisNewData[1].x_value.month()
var monthT1 = thisNewData[1].x_value.month()
var daysT1 = thisNewData[1].x_value.date()

var thisPreviousDate = moment(thisNewData[1].x_value).subtract(month_delta, 'month')

if (daysT1 = getDaysInMonth(yearT1, monthT1)){
thisPreviousDate.date(getDaysInMonth(thisPreviousDate.year(), thisPreviousDate.month()))
}

new_data[i][0].x_value = thisPreviousDate 


}

return new_data

function isLeapYear(year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
}

function getDaysInMonth (year, month) {
    return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

}

function prepareLineChartIndice100Value(data, kValue, dValues) {
  var new_data = [];

  for (i in dValues) {
    var v = dValues[i];
    var new_data_next = [];

for (i in data){
var d = data[i];

new_data_next.push({x_value: (formatNumbers(d[kValue])), name: v, y_value:(_.round(formatNumbers(100*d[v])/formatNumbers(data[0][v]), 2))});
}

new_data.push(new_data_next)
  }

  return new_data
}



function prepareLineChartIndice100ValueForTidy(data, kValue, dValues, kValue2) {
  var new_data = [];
  dValue = dValues[0]
  var dataGroups = _.uniq(data.map(function (d){return d[kValue2]}))

  for (i in dataGroups) {
    var g = dataGroups[i];
    // var new_data_next = [];
    var thisFilteredData = data.filter(function(d){return d[kValue2] == g})

for (i in thisFilteredData){
var d = _.cloneDeep(thisFilteredData[i]);

// {x_value: (formatNumbers(d[kValue])), name: g, y_value:(_.round(formatNumbers(100*d[dValue])/formatNumbers(thisFilteredData[0][dValue]), 2))}

d[dValue] = (_.round(formatNumbers(100*d[dValue])/formatNumbers(thisFilteredData[0][dValue]), 2))

d['y_value'] = d[dValue]

new_data.push(d);
}

  }

  return new_data
}


function checkIfpercentageInArray(data, dValues){

var chained_data = _.chain(d3.entries(data))
.map(function(d){return d.value})
.map(function(d){return dValues.map(function(e){return d[e]})})
.value()

var thisMinMAx = [d3.min(chained_data, function(d){return d3.min(d, function(e){return +e})}), d3.max(chained_data, function(d){return d3.max(d, function(e){return +e})})];

if (thisMinMAx[0] > -100 && thisMinMAx[0] < 100 && thisMinMAx[1] > -100 && thisMinMAx[1] < 100){
return true
}

return false

}

    function findColorsScheme(thisSelection){

      var this_domain = color.domain();
      var this_color = thisSelection == 'libeCategoricalColors' ?  d3.scaleOrdinal(libeCategoricalColors) : thisSelection == 'LibePoliticalColors' ?  d3.scaleOrdinal(LibePoliticalColors) : d3.scaleOrdinal(d3[manualReusableParameters.color_field_select.value]);
      this_color.domain(this_domain);

      return this_color;
    }

    function colorUpdated(thisKey){

      if (manualReusableParameters.persColorsCheck.value){
        return graphParameters.personalizedColorsObject[thisKey] ? graphParameters.personalizedColorsObject[thisKey] : color(thisKey) 
      }
      return color(thisKey) 
    }

    function colorBarchart(thisKey){

      if (manualReusableParameters.persColorsCheck.value){
        return graphParameters.personalizedColorsObject[thisKey] ? graphParameters.personalizedColorsObject[thisKey] : color(thisKey) 
      }
      return basicColors[thisKey].initial 
    }


function dragAndDropthisElement(thisEl){

    var thisRectInit = thisEl.node().getBoundingClientRect();

function dragstartedThisEl(d) {
var thisElement = d3.select(this);
  // thisElement.raise();

  if ( thisElement.attr('moveDataId')){}
  else{thisElement.attr('moveDataId', 'd_'+ String(Math.floor(Math.random() * 100000)));}
thisElement.classed('movedEl', true)
// thisElement.node().parentNode.appendChild(thisElement.node());
thisElement.style('cursor', 'move');
// console.log('start draging');
}

function draggedThisEl(d) {
var thisElement = d3.select(this);

var thisRect = thisElement.node().getBoundingClientRect();
  // thisElement.attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);

  if (thisElement.node().nodeName == "text"){
    var thisX = thisElement.attr('x') ? parseFloat(thisElement.attr('x')) : 0;
var thisY = thisElement.attr('y') ? parseFloat(thisElement.attr('y')) : 0;
thisElement.attr('x', (thisX+ d3.event.dx));
thisElement.attr('y', (thisY+ d3.event.dy));


  }
  else if (thisElement.attr('transform')){
var thisTransfX = parseFloat(thisElement.attr('transform').split('(')[1].split(',')[0]);
var thisTransfY = parseFloat(thisElement.attr('transform').split('(')[1].split(',')[1]);

thisElement.attr('transform', 'translate(' + (thisTransfX + d3.event.dx) + ',' + (thisTransfY + d3.event.dy) + ')')
}

else { 
    var thisTransfX = 0;
    var thisTransfY = 0;

thisElement.attr('transform', 'translate(' + (thisTransfX + d3.event.dx) + ',' + (thisTransfY + d3.event.dy) + ')');

}


 d3.select('#specialElementWrapper')
 .style('left', (thisRect.left + d3.event.dx))
 .style('top', (thisRect.top + d3.event.dy));

}

function dragendedThisEl(d) {

d3.select('#editMode input').property('checked', true);
makeAnnotations_.editMode(false);
d3.select(this).classed("active", false);
var thisElement = d3.select(this);
var thisMovedId = thisElement.attr('moveDataId');
var thisElementType = thisElement.node().nodeName;
var thisElementOrder = d3.selectAll('svg ' + thisElementType).nodes().indexOf(thisElement.node());

if (thisElementType == "text"){

manualReusableParameters.elementMoved.thoseElements[thisMovedId] = {'elementType':thisElementType, 'elementOrder':thisElementOrder,'operations':{'x':thisElement.attr('x'), 'y': thisElement.attr('y')}};

}
else{

manualReusableParameters.elementMoved.thoseElements[thisMovedId] = {'elementType':thisElementType, 'elementOrder':thisElementOrder,'operations':{'transform':thisElement.attr('transform')}};

}

thisElement.on("drag",null)

manualReusableParameters.elementMoved['thoseElementsOrder'] = manualReusableParameters.elementMoved['thoseElementsOrder'].filter(function(e){return e != thisMovedId});

manualReusableParameters.elementMoved['thoseElementsOrder'].push(thisMovedId);

d3.select('#specialElementWrapper')
.style('display', 'none');

}

thisEl.call(d3.drag()
        .on("start", dragstartedThisEl)
        .on("drag", draggedThisEl)
        .on("end", dragendedThisEl))

}

function selectElementToDrag () {

    // removeElementDrag ()

d3.select('svg g.graphContainer').selectAll('*').on('click', function(){

var el = d3.select(d3.event.target)

manualReusableParameters.selectedElement.value = el;
var thisElementType = el.node().tagName;
var thisElementParentType = el.node().parentNode.tagName;

wrapThisElement(el)

d3.select('.parameterElement.selectedElementType input').property('value', thisElementType);
d3.select('.parameterElement.selectedParentElementType input').property('value', thisElementParentType);



dragAndDropthisElement(el)

})

}

function selectParentFromElement(el){


var thisParentEl =  d3.select(el.node().parentNode)

dragAndDropthisElement(thisParentEl)
}


function wrapThisElement(el) {

    var thisRect = el.node().getBoundingClientRect();

    d3.select('#specialElementWrapper').remove()

    d3.select('body')
    .append('div')
    .attr('id', 'specialElementWrapper')
    .style('width', (thisRect.width + 2))
    .style('height', (thisRect.height + 2))
    .style('border', '1px dotted grey')
    .style('position', 'absolute')
    .style('left', (thisRect.left - 1))
    .style('top', (thisRect.top - 1))
    .style('pointer-events', 'none');




   // d3.select(el.parentNode )
   // .insert("g", function(){return el;} ) 
   //   .attr("class", "specialwrapper") //set anything you want to on the <g>
   //   .append( function(){return el;} );
   //           //move the content element into the group

}

function removeElementDrag () {
d3.select('svg g.graphContainer').selectAll('*').on('click', null);

}

function ReplaceThoseElements(){

if (_.isEmpty(manualReusableParameters.elementMoved.thoseElements) == false){

d3.select('svg g.graphContainer').selectAll('*').on('click', null)

for (i in manualReusableParameters.elementMoved.thoseElements)
{

var d = manualReusableParameters.elementMoved.thoseElements[i];
var thisSelection = d3.select(d3.selectAll('svg ' + d['elementType']).nodes()[d['elementOrder']]);
thisSelection.attr('id', i);

for (j in d['operations']){

thisSelection.attr(j, d['operations'][j]);

}

}

for (i in manualReusableParameters.elementMoved['thoseElementsOrder']){

d = manualReusableParameters.elementMoved['thoseElementsOrder'][i];

// d3.selectAll('svg #' + d).raise();

}

}
   
}


/*End useful charts*/


     }

