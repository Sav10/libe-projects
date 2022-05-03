var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;
var isChromium = !!window.chrome;
var datapol;
var circosData;
var representation_territoriale = 'departement';
const arr_representation_territoriale = ['region' ,'departement', 'circonscription']
let selected_element
let chart_data
let selected_Yelement = ['MACRON', '#F7BA00']

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


const y_variables = [
{'name' : 'scoreMacron', 'label': 'Score de Macron'},
{'name' : 'scoreLepen', 'label': 'Score de Le Pen'}
]


// popTotale,

// ScoreLepenT1,ScoreFillonT1,ScoreMelenchonT1,ScoreMacronT1,Departement,MacronT1,LepenT1,MelenchonT1,revenu_median

const x_variables = [{'name': 'Inscrit_22', 'label': 'nombre d’inscrits sur les listes électorales', 'min_val': 4000, 'max_val': 140000},
 {'name': 'pop_légal_19', 'label': 'Population municipale légale', 'min_val': 50000, 'max_val': 180000},
 {'name': 'tvar_pop', 'label': 'Taux de variation annuelle de la population entre 2013 et 2019', 'min_val': -4, 'max_val': 5},
 {'name': 'pop_pole_aav', 'label': 'Part de la population habitant une commune pôle des aires d’attraction des villes (en %)', 'min_val': 0, 'max_val': 105},
 {'name': 'pop_cour_aav', 'label': 'Part de la population habitant une commune dans une couronne des aires d’attraction des villes (en %)', 'min_val': 0, 'max_val': 105},
 {'name': 'pop_horsaav', 'label': 'Part de la population habitant une commune hors aire d’attraction des villes (en %)', 'min_val': -3, 'max_val': 100},
 {'name': 'pop_urb', 'label': 'Part de la population habitant une commune non rurale (en %)', 'min_val': 0, 'max_val': 105},
 {'name': 'pop_rur_periu', 'label': 'Part de la population habitant une commune rurale périurbaine (en %)', 'min_val': 0, 'max_val': 105},
 {'name': 'pop_rur_non_periu', 'label': 'Part de la population habitant une commune rurale non périurbaine (en %)', 'min_val': -3, 'max_val': 100},
 {'name': 'age_moyen', 'label': 'âge moyen de la population', 'min_val': 20, 'max_val': 80},
 {'name': 'dec90', 'label': '90e centile de la distribution par âge (10\xa0% de la population a plus de) ', 'min_val': 0, 'max_val': 100},
 {'name': 'dec75', 'label': '75e centile de la distribution par âge (25\xa0% de la population a plus de) ', 'min_val': 0, 'max_val': 100},
 {'name': 'dec50', 'label': 'Médiane de la distribution par âge (50\xa0% de la population a plus de)', 'min_val': 0, 'max_val': 100},
 {'name': 'dec25', 'label': '25e centile de la distribution par âge (25\xa0% de la population a mins de) ', 'min_val': 0, 'max_val': 100},
 {'name': 'dec10', 'label': '10e centile de la distribution par âge (10\xa0% de la population a moins de)', 'min_val': 0, 'max_val': 100},
 {'name': 'actemp', 'label': 'Part de la population active en emploi (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'actcho', 'label': 'Part de la population active au chômage (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'inactret', 'label': 'Part de la population inactive retraité (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'inactetu', 'label': 'Part de la population inactive  élève, étudiant (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'inactm14', 'label': 'Part de la population inactive moins de 14 ans (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'inactaut', 'label': 'Part de la population autre inactive (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'actemp_hom', 'label': 'Part des hommes actifs en emploi (en % du nombre d’hommes)', 'min_val': 0, 'max_val': 100},
 {'name': 'actcho_hom', 'label': 'Part des hommes actifs au chômage (en % du nombre d’hommes)', 'min_val': 0, 'max_val': 100},
 {'name': 'inactret_hom', 'label': 'Part des hommes inactifs retraités (en % du nombre d’hommes)', 'min_val': 0, 'max_val': 100},
 {'name': 'inactetu_hom', 'label': 'Part des hommes inactifs  élèves, étudiants (en % du nombre d’hommes)', 'min_val': 0, 'max_val': 100},
 {'name': 'inactaut_hom', 'label': 'Part des hommes autre inactif (en % du nombre d’hommes)', 'min_val': 0, 'max_val': 100},
 {'name': 'actemp_fem', 'label': 'Part des femmes actives en emploi (en % du nombre de femmes)', 'min_val': 0, 'max_val': 100},
 {'name': 'actcho_fem', 'label': 'Part des femmes actives au chômage (en % du nombre de femmes))', 'min_val': 0, 'max_val': 100},
 {'name': 'inactret_fem', 'label': 'Part des femmes inactives retraités (en % de la population femme)', 'min_val': 0, 'max_val': 100},
 {'name': 'inactetu_fem', 'label': 'Part des femmes inactives  élèves, étudiants (en % du nombre de femmes)', 'min_val': 0, 'max_val': 100},
 {'name': 'inactaut_fem', 'label': 'Part des femmes autre inactive (en % du nombre de femmes)', 'min_val': 0, 'max_val': 100},
 {'name': 'actdip_PEU', 'label': 'Part de la population active pas ou peu diplômé (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'actdip_CAP', 'label': 'Part de la population active détentrice au mieux d’un CAP, BEP ou équivalent (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'actdip_BAC', 'label': 'Part de la population active détentrice au mieux d’un BAC (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'actdip_BAC2', 'label': 'Part de la population active détentrice au mieux d’un diplôme de niveau BAC+2 (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'actdip_BAC3', 'label': 'Part de la population active détentrice au mieux d’un diplôme de niveau BAC+3 +4 (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'actdip_BAC5', 'label': 'Part de la population active détentrice au mieux d’un diplôme de niveau BAC+5 ou plus (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'actdip_BAC3P', 'label': 'Part de la population active détentrice au mieux d’un diplôme de niveau BAC+3 ou plus  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'act_agr', 'label': 'Part de la population active agriculteur exploitant (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'act_art', 'label': 'Part de la population active artisan, commerçant, chef d’entreprise (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'act_cad', 'label': 'Part de la population active cadre, profession intellectuelle sup (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'act_int', 'label': 'Part de la population active profession intermédiaire  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'act_emp', 'label': 'Part de la population active employé (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'act_ouv', 'label': 'Part de la population active ouvrier (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'act_cho', 'label': 'Part de la population active n’ayant jamais travaillé (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'log_res', 'label': 'Part des résidences principales (en % des logements)', 'min_val': 0, 'max_val': 100},
 {'name': 'log_sec', 'label': 'Part des résidences secondaires ou occasionnelles (en % des logements)', 'min_val': 0, 'max_val': 100},
 {'name': 'log_vac', 'label': 'Part des logements vacants (en % des logements)', 'min_val': 0, 'max_val': 100},
 {'name': 'proprio', 'label': 'Part des logements occupés par leur propriétaire (en % des résidences principales)', 'min_val': 0, 'max_val': 100},
 {'name': 'locatai', 'label': 'Part des logements occupés par des locataires (en % des résidences principales) ', 'min_val': 0, 'max_val': 100},
 {'name': 'gratuit', 'label': 'Part des logements occupés gratuitement (en % des résidences principales)', 'min_val': 0, 'max_val': 100},
 {'name': 'maison', 'label': 'Part des maisons (en % des résidences principales)', 'min_val': 0, 'max_val': 100},
 {'name': 'ach90', 'label': 'Part des logements construits avant 1990 (en % des résidences principales)', 'min_val': 0, 'max_val': 100},
 {'name': 'mfuel', 'label': 'Part des maisons chauffés au fioul (en % des résidences principales)', 'min_val': 0, 'max_val': 100},
 {'name': 'men_seul', 'label': "Part des ménages d'une personne seule sans famille (en %)", 'min_val': 0, 'max_val': 100},
 {'name': 'men_coupae', 'label': 'Part des ménages avec famille principale couple avec enfant(s) (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'men_coupse', 'label': 'Part des ménages avec famille principale couple sans enfant (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'men_monop', 'label': 'Part des ménages avec famille principale monoparentale (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'men_sfam', 'label': 'Part des ménages de plusieurs personnes sans famille (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'men_seul_com', 'label': 'Part des ménages composés d’une personne seule (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'men_coupse_com', 'label': 'Part des ménages composés d’un couple sans enfant dans le logement (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'men_coupae_com', 'label': 'Part des ménages composés d’un couple avec enfant(s) dans le logement (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'men_monop_com', 'label': 'Part des ménages composés d’une famille monoparentale (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'men_complexe_com', 'label': 'Part des ménages complexe (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'iranr_log', 'label': 'Part des personnes résidant dans le même logement un an auparavant (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'iranr_com', 'label': 'Part des personnes résidant dans un autre logement de la même commune un an auparavant (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'iranr_dep', 'label': 'Part des personnes résidant dans une autre commune du département un an auparavant (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'iranr_fra', 'label': 'Part des personnes résidant hors département en France un an auparavant (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'iranr_etr', 'label': 'Part des personnes résidant à l’étranger un an auparavant (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'mobresid', 'label': 'Part de la population n’habitant pas une commune de la circonscription un an auparavant (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'ilt_com', 'label': 'Part des actifs en emploi travaillant dans la commune de résidence actuelle (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'ilt_dep', 'label': 'Part des actifs en emploi travaillant dans une autre commune du département  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'ilt_fra', 'label': 'Part des actifs en emploi travaillant hors département en France (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'ilt_etr', 'label': 'Part des actifs en emploi travaillant  l’étranger (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'mobtrav', 'label': 'Part des actifs en emploi ne travaillant pas dans une commune de la circonscription (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'modtrans_aucun', 'label': 'Part des actifs en emploi effectuant aucun déplacement pour aller travailler  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'modtrans_pied', 'label': 'Part des actifs en emploi se déplaçant principalement à pied ou patinette pour aller travailler  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'modtrans_velo', 'label': 'Part des actifs en emploi se déplaçant principalement en vélo (y compris électrique) pour aller travailler  (en %)', 'min_val': 0, 'max_val': 20},
 {'name': 'modtrans_moto', 'label': 'Part des actifs en emploi se déplaçant principalement en deux-roues motorisé pour aller travailler  (en %)', 'min_val': 0, 'max_val': 20},
 {'name': 'modtrans_voit', 'label': 'Part des actifs en emploi se déplaçant principalement en voiture, camion ou fourgonnette pour aller travailler  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'modtrans_commun', 'label': 'Part des actifs en emploi se déplaçant principalement en transport en commun pour aller travailler  (en %) ', 'min_val': 0, 'max_val': 100},
 {'name': 'tx_pauvrete60_diff', 'label': 'Taux de pauvreté au seuil de 60\xa0% du niveau de vie médian (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'nivvie_median_diff', 'label': 'Niveau de vie médian (en %)', 'min_val': 5000, 'max_val': 45000},
 {'name': 'part_pauvres_diff', 'label': 'Part de la population vivant dans un ménage pauvre (ménage dont le niveau de vie est en dessous de 60\xa0% du niveau médian)  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'part_modestes_diff', 'label': 'Part de la population vivant dans un ménage modeste (ménage dont le niveau de vie est entre 60\xa0% et 90\xa0% du niveau médian)  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'part_medians_diff', 'label': 'Part de la population vivant dans un ménage médian (ménage dont le niveau de vie est entre 90 % et 120 % du niveau médian)  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'part_plutot_aises_diff', 'label': 'Part de la population vivant dans un ménage plutôt aisé (ménage dont le niveau de vie est entre 120 % et 180 % du niveau médian)  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'part_aises_diff', 'label': 'Part de la population vivant dans un ménage aisé (ménage dont le niveau de vie est au dessus de 180\xa0% du niveau médian)  (en %)', 'min_val': 0, 'max_val': 100},
 {'name': 'D1_diff', 'label': '1er décile de niveau de vie (D1)', 'min_val': 0, 'max_val': 100},
 {'name': 'D9_diff', 'label': '9éme décile de niveau de vie (D9)', 'min_val': 0, 'max_val': 100},
 {'name': 'rpt_D9_D1_diff', 'label': 'Rapport interdécile D9/D1', 'min_val': 0, 'max_val': 100},
 {'name': 'PACT', 'label': 'Part dans le revenu disponible des revenus d’activité (y compris allocations chômages)', 'min_val': 0, 'max_val': 100},
 {'name': 'PPEN', 'label': 'Part dans le revenu disponible des pensions, retraites et rentes', 'min_val': 0, 'max_val': 100},
 {'name': 'PPAT', 'label': 'Part dans le revenu disponible du patrimoine et autres revenus', 'min_val': 0, 'max_val': 100},
 {'name': 'PPSOC', 'label': 'Part dans le revenu disponible de l’ensemble des prestations sociales', 'min_val': 0, 'max_val': 100},
 {'name': 'PIMPOT', 'label': 'Part dans le revenu disponible des impots', 'min_val': 0, 'max_val': 100},
 {'name': 'acc_ecole', 'label': 'Part de la population ayant accès à une école sur sa commune de résidenceP', 'min_val': 0, 'max_val': 104},
 {'name': 'acc_college', 'label': 'Part de la population ayant accès à un collège sur sa commune de résidence', 'min_val': 0, 'max_val': 104},
 {'name': 'acc_lycee', 'label': 'Part de la population ayant accès à un lycée sur sa commune de résidence', 'min_val': 0, 'max_val': 100},
 {'name': 'acc_medecin', 'label': 'Part de la population ayant accès à un médecin sur sa commune de résidence P', 'min_val': 0, 'max_val': 104},
 {'name': 'acc_dentiste', 'label': 'Part de la population ayant accès à un dentiste sur sa commune de résidence ', 'min_val': 0, 'max_val': 104},
 {'name': 'acc_pharmacie', 'label': 'Part de la population ayant accès à une pharmacie sur sa commune de résidence', 'min_val': 0, 'max_val': 104},
 {'name': 'part_eloig', 'label': 'Part de la population éloignée du panier courant', 'min_val': -3, 'max_val': 100}]

selected_element = x_variables[0]

  const padding_left = 20

  const padding_top = 0


const chartTitle = "Vote Macron et revenu médian"

const chartSubTitle = ""

const data_file = "circo_insee.csv"
const x_var = selected_element.name
const y_var = 'scoreMacron'

const x_axis_title = "Taux de chômage"
const y_axis_title = "Part de vote Macron"

const circle_size = 'Inscrit_22'

const min_x_value = 0
const max_x_value = 50
const min_y_value = 0
const max_y_value = 100

const this_circle_radius = 15


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


  var manualReusableParameters = {}

  var graphParameters = {"selected_xRows":[x_var],"selected_yRows":[y_var],"selected_size":[circle_size],"selected_color":[],"selected_label":[],"selected_tooltip":["libelle_commune",x_var, y_var],"personalizedColorsObject":{"Agglomération marseillaise":"#cd0420","Agglomération lyonnaise":"#cccccc","Agglomération parisienne":"#666"},
  "selectedColorScheme":"LibePoliticalColors","additionnalParam":"","selected_graph":"circleChart","chartTitle":chartTitle,"chartSubTitle":chartSubTitle,"chartSource":"Assurance maladie, Insee. La taille des ronds est proportionelle à la population des villes","annotations":[]};


    function initChart() {

      var svg = d3.select("#chart_container svg")
/*      .call(responsivefy);*/

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



function makeCirclechart() {

    // var kValue = 'graphParameters['selected_xRows][0];
    // var dValues = graphParameters[selected_yRows];

    var data = _.cloneDeep(chart_data);



 


    var thisXvar = selected_element.name;
    var thisYvar = 'score' + _.capitalize(selected_Yelement[0]).replace(' ', '');
    var thisSizeVar = circle_size;
    var thisColorVar = graphParameters['selected_color'][0];
    var thisLabelVar = graphParameters['selected_label'][0];



    data.forEach(function(d) {
        d[thisXvar] = formatNumbers(d[thisXvar]);
        d[thisYvar] = formatNumbers(d[thisYvar]);
        d[thisSizeVar] = d[thisSizeVar] ? formatNumbers(d[thisSizeVar]) : 1;
    })

        data = data.filter(d=> d[thisXvar] != 0)
console.log(data)



    var svg = d3.select("#chart_container svg");
    var g = svg.select('g.graphContainer');
    var g_inner = g.select('g.innerGraph');


   xScale = d3.scaleLinear()
    .domain([selected_element.min_val,selected_element.max_val])
    .range([0, width]);

    yScale = d3.scaleLinear()
    .domain([min_y_value,max_y_value])
    .range([height, 0]);

    rScale = d3.scaleSqrt()
    .domain([0, d3.max(data, function(d){ return d[thisSizeVar]})])
    .range([0, this_circle_radius]);

let axis_bottom = d3.axisBottom(xScale).ticks(10).tickFormat(numbers_separators);
let axis_left = d3.axisLeft(yScale).ticks(10);


  g.select('g.innerGraph')
  .attr("transform", "translate(" + padding_left + "," + padding_top + ")");

  g.select("g.axis.axis--x")
  .attr("transform", "translate(" + padding_left + "," + (height + padding_top) +")")
  .call(axis_bottom)
  .selectAll("text")
  .style("text-anchor", "middle")
  .attr("dx", "0em")
  .attr("dy", "0.7em")
  .attr("transform", "rotate(0)");

g.select("g.axis.axis--y")
.attr('transform', 'translate(' + padding_left + ',' + padding_top + ')')
.call(axis_left);



const pointColor = '#3585ff'

    var circles = g_inner
    .selectAll('.ball')
    .data(data);

    circles.exit().transition().duration(200).remove();

    circles
    .attr('transform', function(d) {return 'translate(' + xScale(d[thisXvar]) + ',' +  yScale(d[thisYvar]) + ')'})
    .select('circle')
    .transition()
    .duration(200)
    .attr('r', function(d){return rScale(d[thisSizeVar])})
    .style('fill', selected_Yelement[1])
    .style('fill-opacity', .8);

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
    .on('mouseover', function(event, d, i){ 
        console.log(d)
        console.log(event)
        console.log(i)

        show_tooltip(event, d)})
    .on('mouseout', function(){ hide_tooltip()});

    new_circles
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d){return rScale(d[thisSizeVar])})
    .style('fill-opacity', .8)
    .style('fill', selected_Yelement[1]);

    new_circles
    .append('text')
    .style('text-anchor', 'middle')
    .style('fill', 'black')
    .attr('y', 4)
    .text(function(d){return thisLabelVar ? d[thisLabelVar] : ""});

/*g_inner
.call(xAxisLabel, graphParameters.selected_xRows[0]);*/

  g_inner
  .select('text.xAxisLabel').remove()

g_inner
  .append('text')
  .attr('class', 'xAxisLabel')
  .text(selected_element.label)
  .attr("transform", "translate(" + (width/2) + " ," + (+ height + margin.top + 20) + ")")
  .style("text-anchor", "middle")


/*g_inner
.call(yAxisLabel, graphParameters.selected_yRows[0]);*/


  g_inner
  .select('text.yAxisLabel').remove()

g_inner
  .append('text')
  .attr('class', 'yAxisLabel')
  .text('Part de vote ' + _.capitalize(selected_Yelement[0]).replace('Le pen', 'Le Pen'))
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .attr("y", (-margin.left))
  .attr("x",0 - (height / 2))

/*    customizeAxis()
    drawLegend()
    addCustomCode()*/

/// Custom code

d3.selectAll('.axis--y .tick text').text(function(d){return d+'%'});
d3.selectAll('.axis--x .tick text').text(function(d){return numbers_separators(d)}); 
d3.selectAll('g.ball circle').style('mix-blend-mode', 'multiply');


}


function show_tooltip(event, d) {

 var d = d.data ? d.data : d;
 if (d){
    d3.select("#tooltip").style('display', 'block');

    var dx = event.pageX;
    var dy = event.pageY - 28;

    // var this_chart_width = Math.round(svgGraphContainer.node().getBBox().width);
    var this_chart_right = d3.select('#chart_container svg').node().getBoundingClientRect().right

        var this_inner_html = '<strong>' + d['Nom de la circonscription'] + '</strong><br />';
        this_inner_html += '<strong>'+ selected_element.label + '</strong> : '+ d[selected_element.name]+ '</strong><br />'


d3.select("#tooltip")
.classed('is-active', true)
.html(this_inner_html);

var thisTooltip = d3.select('#tooltip').node().getBoundingClientRect();

if (dx > (this_chart_right - thisTooltip.width)){

dx = (this_chart_right - thisTooltip.width - 10)

}


d3.select("#tooltip")
.style("left", 0 + "px")
.style("top", 0 + "px");

}
else
{
    d3.select("#tooltip").style('display', 'none');
}

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

d3.selectAll('span.legende_dot')
.on('click', function(event, d){

selected_Yelement = d

    makeCirclechart()})

}

draw_legendots()

function draw_affichage(){

d3.selectAll('#affichage .display_element')

let all_displayed_elements = _.cloneDeep(x_variables)

const elements_selection = d3.select('div#affichage').selectAll('div.display_element')
.data(all_displayed_elements)

elements_selection
.enter()
.append('div')
.attr('class', 'display_element')
.text(d=> d.label)
.on('click', function(event, d){

selected_element = d


d3.selectAll('#affichage .display_element')
.style('background-color', '#eee')
.style('color', '#6E6E6E')

let this_background_color = 'black'

/*if(d == 'candidat en tête' || d == 'abstention'){

this_background_color = 'black'
}
else {
  this_background_color = colors_candidats[d]
}*/


d3.select(this)
.style('background-color', this_background_color)
.style('color', '#fff')

/*fillOnClick(d)*/

graphParameters['selected_xRows'][0] = d.name;

makeCirclechart();

// graphParameters['selected_yRows'][0];

})

d3.select('#affichage .display_element')
.style('background-color', 'black')
.style('color', '#fff')

}

draw_affichage()

///Loading data

Promise.all([
    // d3.csv('data/election_data_regT2.csv'),
    d3.csv('data/' + data_file)
    // d3.csv('data/election_data_depT2.csv'),
/*    d3.csv('https://sav10.github.io/libe-projects/election-presidentielle-2022-T2/data/election_data_depT2.csv'),
    d3.csv('data/data_circos3.csv')*/
/*    d3.csv('data/circos_data.csv')*/
    // d3.csv('https://sav10.github.io/libe-projects/election-presidentielle-2022/data/data_circos3.csv')
]).then(function(files) {
  ready(files[0]
/*    , files[1], files[2]*/
    )
})
/*.catch(function(err) {
  console.log('erreur' + ' ' + err)
})
*/
//// Ready function (to load data)

  function ready(data_explore) {



data_explore.forEach(d =>{
d.Macron = +d['MACRON']
d.Lepen = +d['LE PEN']
d.scoreMacron = _.round(100*d.Macron / (d.Macron + d.Lepen), 1)
d.scoreLepen = _.round(100*d.Lepen / (d.Macron + d.Lepen), 1)

let numeric_val = ['Inscrit_22', 'pop_légal_19', 'pop_légal_13', 'tvar_pop', 'pop_pole_aav', 'pop_cour_aav', 'pop_horsaav', 'pop_urb', 
'pop_rur_periu', 'pop_rur_non_periu', 'age_moyen', 'dec90', 'dec75', 'dec50', 'dec25', 'dec10', 'actemp', 'actcho', 'inactret', 'inactetu', 
'inactm14', 'inactaut', 'actemp_hom', 'actcho_hom', 'inactret_hom', 'inactetu_hom', 'inactaut_hom', 'actemp_fem', 'actcho_fem', 'inactret_fem', 
'inactetu_fem', 'inactaut_fem', 'actdip_PEU', 'actdip_CAP', 'actdip_BAC', 'actdip_BAC2', 'actdip_BAC3', 'actdip_BAC5', 'actdip_BAC3P', 'act_agr', 
'act_art', 'act_cad', 'act_int', 'act_emp', 'act_ouv', 'act_cho', 'log_res', 'log_sec', 'log_vac', 'proprio', 'locatai', 'gratuit', 'maison', 
'ach90', 'mfuel', 'men_seul', 'men_coupae', 'men_coupse', 'men_monop', 'men_sfam', 'men_seul_com', 'men_coupse_com', 'men_coupae_com', 
'men_monop_com', 'men_complexe_com', 'iranr_log', 'iranr_com', 'iranr_dep', 'iranr_fra', 'iranr_etr', 'mobresid', 'ilt_com', 'ilt_dep', 
'ilt_fra', 'ilt_etr', 'mobtrav', 'modtrans_aucun', 'modtrans_pied', 'modtrans_velo', 'modtrans_moto', 'modtrans_voit', 'modtrans_commun', 
'tx_pauvrete60_diff', 'nivvie_median_diff', 'part_pauvres_diff', 'part_modestes_diff', 'part_medians_diff', 'part_plutot_aises_diff', 
'part_aises_diff', 'D1_diff', 'D9_diff', 'rpt_D9_D1_diff', 'PACT', 'PPEN', 'PPAT', 'PPSOC', 'PIMPOT', 'acc_ecole', 'acc_college', 'acc_lycee', 
'acc_medecin', 'acc_dentiste', 'acc_pharmacie', 'part_eloig']

for (i in numeric_val){

let e = numeric_val[i]

d[e] = +d[e]
}


})

chart_data = data_explore

initChart();

makeCirclechart();





}

///// End of (long) ready function


//// load SVG map


/// End map from svgn


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
