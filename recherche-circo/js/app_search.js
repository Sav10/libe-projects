
let all_loaded_dep = {}
let data_sortants
let data_T1_Presidentielle
let data_elu_2017
let data_T1_2017
let this_selection


const colors_candidats = {
"MACRON":'#F7BA00',
"DUPONT-AIGNAN":'#19325D',
"LE PEN":'#1D2245',
'POUTOU': "#911D16",
'MÉLENCHON': "#EB404C",
'LASSALLE': "#534384",
'PÉCRESSE': "#2458A5",
'ZEMMOUR': "#654235",
'JADOT': "#00A85C",
'ARTHAUD': '#751F17',
'HIDALGO': '#EC4C6B',
'ROUSSEL': '#D80000'
}


const nuances_pol = {
  'MDM': '#e85d21',
  'MODEM': '#e85d21',
 'SOC': '#EC4C6B',
 'EXG': '#911D16',
 'FI': '#EB404C', 
 'LR': '#2458A5',
 'DIV': '#cccccc',
 'ECO': '#00A85C',
 'COM': '#D80000',
 'FN': '#1D2245',
 'DLF': '#19325D',
'REM': '#F7BA00',
'DVG': '#f46099',
'RDG': '#f781b6',
'UDI': '#9f64a2',
'EXD': '#03034f',
'DVD': '#026db5',
'REG': '#666',
'LT': '#666',
'GDR': '#D80000',
'NI': '#bbb',
'AE': '#9f64a2'}


const rattachement_financier = {}

const autoCompleteJS = new autoComplete({
  placeHolder: "Tapez une adresse postale",
  diacritics: true,
  searchEngine: "loose",
  threshold: 4,
  resultsList: {
    maxResults: 10,
  },
  query: (input) => {
    return input.replace("'", " ");
},
  data: {
    src: async (query) => {
      try {


        let encoded_query = encodeURI(query)

        const source = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encoded_query}&limit=10&autocomplete=0`);
        // Data is array of `Objects` | `Strings`
        const data = await source.json();


        const data_entries  = data.features.map(function(d) { 

          return {'label':d.properties.label, 'properties':d.properties, 'geometry' : d.geometry } 
        });



        return data_entries
      } catch (error) {

        return error;
      }
    },
    keys:['label'],
    cache: false,
    maxResults: 10
  },
  resultItem: {
    highlight: true
  },
  events: {
    input: {
      selection: (event) => {
        const selection = event.detail.selection.value;
        autoCompleteJS.input.value = selection.label;
        this_selection = selection.properties

        let this_dep = selection.properties.context.split(',')[0]
        this_dep = Object.keys(correspondance_departements_OTM).includes(this_dep) ? correspondance_departements_OTM[this_dep] : this_dep;

        if (!all_loaded_dep.hasOwnProperty(this_dep)) {

          d3.json("assets/circo_dep/dep" + this_dep + ".json")
          .then(function(data) {
            all_loaded_dep[this_dep] = data
            show_circ(data)
          })
          .catch(function(error) {
          });
        }
        else{
          show_circ(all_loaded_dep[this_dep])
        }

        function show_circ(data){

          let point_geojson = selection.geometry.coordinates;
          let this_data =  _.cloneDeep(data)
          let this_filtered_data = this_data.filter(function(d) {return d3.geoContains(d, point_geojson)});

          let this_circo = this_filtered_data[0].properties['id_circo']


          d3.select('#adresse_circo').text(this_selection.label)

          d3.select('#result_circo').text(circo_names[this_circo])
          let depute_sortant = 'NC'
          let actuelle_couleur = 'NC'

          let this_data_sortants = _.cloneDeep(data_sortants).filter(d=>d.id_circo == this_circo)
          if (this_data_sortants.length > 0){

          depute_sortant = this_data_sortants[0].nom
          actuelle_couleur = this_data_sortants[0].groupe_sigle
          }





          let couleur_2017 = data_elu_2017.filter(d=>d.id_circo == this_circo)[0]['Nuance vainqueur']
          let nombre_inscrits = number_separator(data_elu_2017.filter(d=>d.id_circo == this_circo)[0].inscrits_2022)


          d3.select('#info').style('display', 'flex')
          d3.select('#resultats').style('display', 'block')
        


          d3.select('#nombre_inscrits').text(nombre_inscrits)
          d3.select('#depute_sortant').text(depute_sortant)
          d3.select('#couleur_2017')
          .text(couleur_2017)
          .style('background-color', nuances_pol[couleur_2017])
          d3.select('#actuelle_couleur')
          .text(actuelle_couleur.replace('LREM', 'REM').replace('LFI', 'FI'))
           .style('background-color', nuances_pol[actuelle_couleur.replace('LREM', 'REM').replace('LFI', 'FI')])


          let selected_2017 = data_T1_2017.filter(d=>d.id_circo == this_circo)
          selected_2017.forEach(function(d){
            d.score = _.round(100*d.voix / d.exprimes, 1)
          })

           selected_2017.sort(function(a,b) {  return b.score - a.score})

           selected_2017 = _.slice(selected_2017, 0, 12)



          let selected_2022 = data_T1_Presi.filter(d=>d.id_circo == this_circo)



          selected_2022.forEach(function(d){
            d.score = _.round(100*d.voix / d.exprimes, 1)
          })

          selected_2022.sort(function(a,b) {  return b.score - a.score})



          let g_2017 = drawGraph(selected_2017, 'legislatives')

          let g_2022 = drawGraph(selected_2022, 'presidentielle')


          d3.select('#left_graph').html(g_2017)
          d3.select('#right_graph').html(g_2022)

      

        }

      }
    }
  }
});


const circo_names = {'01001': '1ère circonscription, Ain',
'01002': '2ème circonscription, Ain',
'01003': '3ème circonscription, Ain',
'01004': '4ème circonscription, Ain',
'01005': '5ème circonscription, Ain',
'02001': '1ère circonscription, Aisne',
'02002': '2ème circonscription, Aisne',
'02003': '3ème circonscription, Aisne',
'02004': '4ème circonscription, Aisne',
'02005': '5ème circonscription, Aisne',
'03001': '1ère circonscription, Allier',
'03002': '2ème circonscription, Allier',
'03003': '3ème circonscription, Allier',
'04001': '1ère circonscription, Alpes-de-Haute-Provence',
'04002': '2ème circonscription, Alpes-de-Haute-Provence',
'05001': '1ère circonscription, Hautes-Alpes',
'05002': '2ème circonscription, Hautes-Alpes',
'06001': '1ère circonscription, Alpes-Maritimes',
'06002': '2ème circonscription, Alpes-Maritimes',
'06003': '3ème circonscription, Alpes-Maritimes',
'06004': '4ème circonscription, Alpes-Maritimes',
'06005': '5ème circonscription, Alpes-Maritimes',
'06006': '6ème circonscription, Alpes-Maritimes',
'06007': '7ème circonscription, Alpes-Maritimes',
'06008': '8ème circonscription, Alpes-Maritimes',
'06009': '9ème circonscription, Alpes-Maritimes',
'07001': '1ère circonscription, Ardèche',
'07002': '2ème circonscription, Ardèche',
'07003': '3ème circonscription, Ardèche',
'08001': '1ère circonscription, Ardennes',
'08002': '2ème circonscription, Ardennes',
'08003': '3ème circonscription, Ardennes',
'09001': '1ère circonscription, Ariège',
'09002': '2ème circonscription, Ariège',
'10001': '1ère circonscription, Aube',
'10002': '2ème circonscription, Aube',
'10003': '3ème circonscription, Aube',
'11001': '1ère circonscription, Aude',
'11002': '2ème circonscription, Aude',
'11003': '3ème circonscription, Aude',
'12001': '1ère circonscription, Aveyron',
'12002': '2ème circonscription, Aveyron',
'12003': '3ème circonscription, Aveyron',
'13001': '1ère circonscription, Bouches-du-Rhône',
'13002': '2ème circonscription, Bouches-du-Rhône',
'13003': '3ème circonscription, Bouches-du-Rhône',
'13004': '4ème circonscription, Bouches-du-Rhône',
'13005': '5ème circonscription, Bouches-du-Rhône',
'13006': '6ème circonscription, Bouches-du-Rhône',
'13007': '7ème circonscription, Bouches-du-Rhône',
'13008': '8ème circonscription, Bouches-du-Rhône',
'13009': '9ème circonscription, Bouches-du-Rhône',
'13010': '10ème circonscription, Bouches-du-Rhône',
'13011': '11ème circonscription, Bouches-du-Rhône',
'13012': '12ème circonscription, Bouches-du-Rhône',
'13013': '13ème circonscription, Bouches-du-Rhône',
'13014': '14ème circonscription, Bouches-du-Rhône',
'13015': '15ème circonscription, Bouches-du-Rhône',
'13016': '16ème circonscription, Bouches-du-Rhône',
'14001': '1ère circonscription, Calvados',
'14002': '2ème circonscription, Calvados',
'14003': '3ème circonscription, Calvados',
'14004': '4ème circonscription, Calvados',
'14005': '5ème circonscription, Calvados',
'14006': '6ème circonscription, Calvados',
'15001': '1ère circonscription, Cantal',
'15002': '2ème circonscription, Cantal',
'16001': '1ère circonscription, Charente',
'16002': '2ème circonscription, Charente',
'16003': '3ème circonscription, Charente',
'17001': '1ère circonscription, Charente-Maritime',
'17002': '2ème circonscription, Charente-Maritime',
'17003': '3ème circonscription, Charente-Maritime',
'17004': '4ème circonscription, Charente-Maritime',
'17005': '5ème circonscription, Charente-Maritime',
'18001': '1ère circonscription, Cher',
'18002': '2ème circonscription, Cher',
'18003': '3ème circonscription, Cher',
'19001': '1ère circonscription, Corrèze',
'19002': '2ème circonscription, Corrèze',
'2A001': '1ère circonscription, Corse-du-Sud',
'2A002': '2ème circonscription, Corse-du-Sud',
'2B001': '1ère circonscription, Haute-Corse',
'2B002': '2ème circonscription, Haute-Corse',
'21001': "1ère circonscription, Côte-d'Or",
'21002': "2ème circonscription, Côte-d'Or",
'21003': "3ème circonscription, Côte-d'Or",
'21004': "4ème circonscription, Côte-d'Or",
'21005': "5ème circonscription, Côte-d'Or",
'22001': "1ère circonscription, Côtes-d'Armor",
'22002': "2ème circonscription, Côtes-d'Armor",
'22003': "3ème circonscription, Côtes-d'Armor",
'22004': "4ème circonscription, Côtes-d'Armor",
'22005': "5ème circonscription, Côtes-d'Armor",
'23001': '1ère circonscription, Creuse',
'24001': '1ère circonscription, Dordogne',
'24002': '2ème circonscription, Dordogne',
'24003': '3ème circonscription, Dordogne',
'24004': '4ème circonscription, Dordogne',
'25001': '1ère circonscription, Doubs',
'25002': '2ème circonscription, Doubs',
'25003': '3ème circonscription, Doubs',
'25004': '4ème circonscription, Doubs',
'25005': '5ème circonscription, Doubs',
'26001': '1ère circonscription, Drôme',
'26002': '2ème circonscription, Drôme',
'26003': '3ème circonscription, Drôme',
'26004': '4ème circonscription, Drôme',
'27001': '1ère circonscription, Eure',
'27002': '2ème circonscription, Eure',
'27003': '3ème circonscription, Eure',
'27004': '4ème circonscription, Eure',
'27005': '5ème circonscription, Eure',
'28001': '1ère circonscription, Eure-et-Loir',
'28002': '2ème circonscription, Eure-et-Loir',
'28003': '3ème circonscription, Eure-et-Loir',
'28004': '4ème circonscription, Eure-et-Loir',
'29001': '1ère circonscription, Finistère',
'29002': '2ème circonscription, Finistère',
'29003': '3ème circonscription, Finistère',
'29004': '4ème circonscription, Finistère',
'29005': '5ème circonscription, Finistère',
'29006': '6ème circonscription, Finistère',
'29007': '7ème circonscription, Finistère',
'29008': '8ème circonscription, Finistère',
'30001': '1ère circonscription, Gard',
'30002': '2ème circonscription, Gard',
'30003': '3ème circonscription, Gard',
'30004': '4ème circonscription, Gard',
'30005': '5ème circonscription, Gard',
'30006': '6ème circonscription, Gard',
'31001': '1ère circonscription, Haute-Garonne',
'31002': '2ème circonscription, Haute-Garonne',
'31003': '3ème circonscription, Haute-Garonne',
'31004': '4ème circonscription, Haute-Garonne',
'31005': '5ème circonscription, Haute-Garonne',
'31006': '6ème circonscription, Haute-Garonne',
'31007': '7ème circonscription, Haute-Garonne',
'31008': '8ème circonscription, Haute-Garonne',
'31009': '9ème circonscription, Haute-Garonne',
'31010': '10ème circonscription, Haute-Garonne',
'32001': '1ère circonscription, Gers',
'32002': '2ème circonscription, Gers',
'33001': '1ère circonscription, Gironde',
'33002': '2ème circonscription, Gironde',
'33003': '3ème circonscription, Gironde',
'33004': '4ème circonscription, Gironde',
'33005': '5ème circonscription, Gironde',
'33006': '6ème circonscription, Gironde',
'33007': '7ème circonscription, Gironde',
'33008': '8ème circonscription, Gironde',
'33009': '9ème circonscription, Gironde',
'33010': '10ème circonscription, Gironde',
'33011': '11ème circonscription, Gironde',
'33012': '12ème circonscription, Gironde',
'34001': '1ère circonscription, Hérault',
'34002': '2ème circonscription, Hérault',
'34003': '3ème circonscription, Hérault',
'34004': '4ème circonscription, Hérault',
'34005': '5ème circonscription, Hérault',
'34006': '6ème circonscription, Hérault',
'34007': '7ème circonscription, Hérault',
'34008': '8ème circonscription, Hérault',
'34009': '9ème circonscription, Hérault',
'35001': '1ère circonscription, Ille-et-Vilaine',
'35002': '2ème circonscription, Ille-et-Vilaine',
'35003': '3ème circonscription, Ille-et-Vilaine',
'35004': '4ème circonscription, Ille-et-Vilaine',
'35005': '5ème circonscription, Ille-et-Vilaine',
'35006': '6ème circonscription, Ille-et-Vilaine',
'35007': '7ème circonscription, Ille-et-Vilaine',
'35008': '8ème circonscription, Ille-et-Vilaine',
'36001': '1ère circonscription, Indre',
'36002': '2ème circonscription, Indre',
'37001': '1ère circonscription, Indre-et-Loire',
'37002': '2ème circonscription, Indre-et-Loire',
'37003': '3ème circonscription, Indre-et-Loire',
'37004': '4ème circonscription, Indre-et-Loire',
'37005': '5ème circonscription, Indre-et-Loire',
'38001': '1ère circonscription, Isère',
'38002': '2ème circonscription, Isère',
'38003': '3ème circonscription, Isère',
'38004': '4ème circonscription, Isère',
'38005': '5ème circonscription, Isère',
'38006': '6ème circonscription, Isère',
'38007': '7ème circonscription, Isère',
'38008': '8ème circonscription, Isère',
'38009': '9ème circonscription, Isère',
'38010': '10ème circonscription, Isère',
'39001': '1ère circonscription, Jura',
'39002': '2ème circonscription, Jura',
'39003': '3ème circonscription, Jura',
'40001': '1ère circonscription, Landes',
'40002': '2ème circonscription, Landes',
'40003': '3ème circonscription, Landes',
'41001': '1ère circonscription, Loir-et-Cher',
'41002': '2ème circonscription, Loir-et-Cher',
'41003': '3ème circonscription, Loir-et-Cher',
'42001': '1ère circonscription, Loire',
'42002': '2ème circonscription, Loire',
'42003': '3ème circonscription, Loire',
'42004': '4ème circonscription, Loire',
'42005': '5ème circonscription, Loire',
'42006': '6ème circonscription, Loire',
'43001': '1ère circonscription, Haute-Loire',
'43002': '2ème circonscription, Haute-Loire',
'44001': '1ère circonscription, Loire-Atlantique',
'44002': '2ème circonscription, Loire-Atlantique',
'44003': '3ème circonscription, Loire-Atlantique',
'44004': '4ème circonscription, Loire-Atlantique',
'44005': '5ème circonscription, Loire-Atlantique',
'44006': '6ème circonscription, Loire-Atlantique',
'44007': '7ème circonscription, Loire-Atlantique',
'44008': '8ème circonscription, Loire-Atlantique',
'44009': '9ème circonscription, Loire-Atlantique',
'44010': '10ème circonscription, Loire-Atlantique',
'45001': '1ère circonscription, Loiret',
'45002': '2ème circonscription, Loiret',
'45003': '3ème circonscription, Loiret',
'45004': '4ème circonscription, Loiret',
'45005': '5ème circonscription, Loiret',
'45006': '6ème circonscription, Loiret',
'46001': '1ère circonscription, Lot',
'46002': '2ème circonscription, Lot',
'47001': '1ère circonscription, Lot-et-Garonne',
'47002': '2ème circonscription, Lot-et-Garonne',
'47003': '3ème circonscription, Lot-et-Garonne',
'48001': '1ère circonscription, Lozère',
'49001': '1ère circonscription, Maine-et-Loire',
'49002': '2ème circonscription, Maine-et-Loire',
'49003': '3ème circonscription, Maine-et-Loire',
'49004': '4ème circonscription, Maine-et-Loire',
'49005': '5ème circonscription, Maine-et-Loire',
'49006': '6ème circonscription, Maine-et-Loire',
'49007': '7ème circonscription, Maine-et-Loire',
'50001': '1ère circonscription, Manche',
'50002': '2ème circonscription, Manche',
'50003': '3ème circonscription, Manche',
'50004': '4ème circonscription, Manche',
'51001': '1ère circonscription, Marne',
'51002': '2ème circonscription, Marne',
'51003': '3ème circonscription, Marne',
'51004': '4ème circonscription, Marne',
'51005': '5ème circonscription, Marne',
'52001': '1ère circonscription, Haute-Marne',
'52002': '2ème circonscription, Haute-Marne',
'53001': '1ère circonscription, Mayenne',
'53002': '2ème circonscription, Mayenne',
'53003': '3ème circonscription, Mayenne',
'54001': '1ère circonscription, Meurthe-et-Moselle',
'54002': '2ème circonscription, Meurthe-et-Moselle',
'54003': '3ème circonscription, Meurthe-et-Moselle',
'54004': '4ème circonscription, Meurthe-et-Moselle',
'54005': '5ème circonscription, Meurthe-et-Moselle',
'54006': '6ème circonscription, Meurthe-et-Moselle',
'55001': '1ère circonscription, Meuse',
'55002': '2ème circonscription, Meuse',
'56001': '1ère circonscription, Morbihan',
'56002': '2ème circonscription, Morbihan',
'56003': '3ème circonscription, Morbihan',
'56004': '4ème circonscription, Morbihan',
'56005': '5ème circonscription, Morbihan',
'56006': '6ème circonscription, Morbihan',
'57001': '1ère circonscription, Moselle',
'57002': '2ème circonscription, Moselle',
'57003': '3ème circonscription, Moselle',
'57004': '4ème circonscription, Moselle',
'57005': '5ème circonscription, Moselle',
'57006': '6ème circonscription, Moselle',
'57007': '7ème circonscription, Moselle',
'57008': '8ème circonscription, Moselle',
'57009': '9ème circonscription, Moselle',
'58001': '1ère circonscription, Nièvre',
'58002': '2ème circonscription, Nièvre',
'59001': '1ère circonscription, Nord',
'59002': '2ème circonscription, Nord',
'59003': '3ème circonscription, Nord',
'59004': '4ème circonscription, Nord',
'59005': '5ème circonscription, Nord',
'59006': '6ème circonscription, Nord',
'59007': '7ème circonscription, Nord',
'59008': '8ème circonscription, Nord',
'59009': '9ème circonscription, Nord',
'59010': '10ème circonscription, Nord',
'59011': '11ème circonscription, Nord',
'59012': '12ème circonscription, Nord',
'59013': '13ème circonscription, Nord',
'59014': '14ème circonscription, Nord',
'59015': '15ème circonscription, Nord',
'59016': '16ème circonscription, Nord',
'59017': '17ème circonscription, Nord',
'59018': '18ème circonscription, Nord',
'59019': '19ème circonscription, Nord',
'59020': '20ème circonscription, Nord',
'59021': '21ème circonscription, Nord',
'60001': '1ère circonscription, Oise',
'60002': '2ème circonscription, Oise',
'60003': '3ème circonscription, Oise',
'60004': '4ème circonscription, Oise',
'60005': '5ème circonscription, Oise',
'60006': '6ème circonscription, Oise',
'60007': '7ème circonscription, Oise',
'61001': '1ère circonscription, Orne',
'61002': '2ème circonscription, Orne',
'61003': '3ème circonscription, Orne',
'62001': '1ère circonscription, Pas-de-Calais',
'62002': '2ème circonscription, Pas-de-Calais',
'62003': '3ème circonscription, Pas-de-Calais',
'62004': '4ème circonscription, Pas-de-Calais',
'62005': '5ème circonscription, Pas-de-Calais',
'62006': '6ème circonscription, Pas-de-Calais',
'62007': '7ème circonscription, Pas-de-Calais',
'62008': '8ème circonscription, Pas-de-Calais',
'62009': '9ème circonscription, Pas-de-Calais',
'62010': '10ème circonscription, Pas-de-Calais',
'62011': '11ème circonscription, Pas-de-Calais',
'62012': '12ème circonscription, Pas-de-Calais',
'63001': '1ère circonscription, Puy-de-Dôme',
'63002': '2ème circonscription, Puy-de-Dôme',
'63003': '3ème circonscription, Puy-de-Dôme',
'63004': '4ème circonscription, Puy-de-Dôme',
'63005': '5ème circonscription, Puy-de-Dôme',
'64001': '1ère circonscription, Pyrénées-Atlantiques',
'64002': '2ème circonscription, Pyrénées-Atlantiques',
'64003': '3ème circonscription, Pyrénées-Atlantiques',
'64004': '4ème circonscription, Pyrénées-Atlantiques',
'64005': '5ème circonscription, Pyrénées-Atlantiques',
'64006': '6ème circonscription, Pyrénées-Atlantiques',
'65001': '1ère circonscription, Hautes-Pyrénées',
'65002': '2ème circonscription, Hautes-Pyrénées',
'66001': '1ère circonscription, Pyrénées-Orientales',
'66002': '2ème circonscription, Pyrénées-Orientales',
'66003': '3ème circonscription, Pyrénées-Orientales',
'66004': '4ème circonscription, Pyrénées-Orientales',
'67001': '1ère circonscription, Bas-Rhin',
'67002': '2ème circonscription, Bas-Rhin',
'67003': '3ème circonscription, Bas-Rhin',
'67004': '4ème circonscription, Bas-Rhin',
'67005': '5ème circonscription, Bas-Rhin',
'67006': '6ème circonscription, Bas-Rhin',
'67007': '7ème circonscription, Bas-Rhin',
'67008': '8ème circonscription, Bas-Rhin',
'67009': '9ème circonscription, Bas-Rhin',
'68001': '1ère circonscription, Haut-Rhin',
'68002': '2ème circonscription, Haut-Rhin',
'68003': '3ème circonscription, Haut-Rhin',
'68004': '4ème circonscription, Haut-Rhin',
'68005': '5ème circonscription, Haut-Rhin',
'68006': '6ème circonscription, Haut-Rhin',
'69001': '1ère circonscription, Rhône',
'69002': '2ème circonscription, Rhône',
'69003': '3ème circonscription, Rhône',
'69004': '4ème circonscription, Rhône',
'69005': '5ème circonscription, Rhône',
'69006': '6ème circonscription, Rhône',
'69007': '7ème circonscription, Rhône',
'69008': '8ème circonscription, Rhône',
'69009': '9ème circonscription, Rhône',
'69010': '10ème circonscription, Rhône',
'69011': '11ème circonscription, Rhône',
'69012': '12ème circonscription, Rhône',
'69013': '13ème circonscription, Rhône',
'69014': '14ème circonscription, Rhône',
'70001': '1ère circonscription, Haute-Saône',
'70002': '2ème circonscription, Haute-Saône',
'71001': '1ère circonscription, Saône-et-Loire',
'71002': '2ème circonscription, Saône-et-Loire',
'71003': '3ème circonscription, Saône-et-Loire',
'71004': '4ème circonscription, Saône-et-Loire',
'71005': '5ème circonscription, Saône-et-Loire',
'72001': '1ère circonscription, Sarthe',
'72002': '2ème circonscription, Sarthe',
'72003': '3ème circonscription, Sarthe',
'72004': '4ème circonscription, Sarthe',
'72005': '5ème circonscription, Sarthe',
'73001': '1ère circonscription, Savoie',
'73002': '2ème circonscription, Savoie',
'73003': '3ème circonscription, Savoie',
'73004': '4ème circonscription, Savoie',
'74001': '1ère circonscription, Haute-Savoie',
'74002': '2ème circonscription, Haute-Savoie',
'74003': '3ème circonscription, Haute-Savoie',
'74004': '4ème circonscription, Haute-Savoie',
'74005': '5ème circonscription, Haute-Savoie',
'74006': '6ème circonscription, Haute-Savoie',
'75001': '1ère circonscription, Paris',
'75002': '2ème circonscription, Paris',
'75003': '3ème circonscription, Paris',
'75004': '4ème circonscription, Paris',
'75005': '5ème circonscription, Paris',
'75006': '6ème circonscription, Paris',
'75007': '7ème circonscription, Paris',
'75008': '8ème circonscription, Paris',
'75009': '9ème circonscription, Paris',
'75010': '10ème circonscription, Paris',
'75011': '11ème circonscription, Paris',
'75012': '12ème circonscription, Paris',
'75013': '13ème circonscription, Paris',
'75014': '14ème circonscription, Paris',
'75015': '15ème circonscription, Paris',
'75016': '16ème circonscription, Paris',
'75017': '17ème circonscription, Paris',
'75018': '18ème circonscription, Paris',
'76001': '1ère circonscription, Seine-Maritime',
'76002': '2ème circonscription, Seine-Maritime',
'76003': '3ème circonscription, Seine-Maritime',
'76004': '4ème circonscription, Seine-Maritime',
'76005': '5ème circonscription, Seine-Maritime',
'76006': '6ème circonscription, Seine-Maritime',
'76007': '7ème circonscription, Seine-Maritime',
'76008': '8ème circonscription, Seine-Maritime',
'76009': '9ème circonscription, Seine-Maritime',
'76010': '10ème circonscription, Seine-Maritime',
'77001': '1ère circonscription, Seine-et-Marne',
'77002': '2ème circonscription, Seine-et-Marne',
'77003': '3ème circonscription, Seine-et-Marne',
'77004': '4ème circonscription, Seine-et-Marne',
'77005': '5ème circonscription, Seine-et-Marne',
'77006': '6ème circonscription, Seine-et-Marne',
'77007': '7ème circonscription, Seine-et-Marne',
'77008': '8ème circonscription, Seine-et-Marne',
'77009': '9ème circonscription, Seine-et-Marne',
'77010': '10ème circonscription, Seine-et-Marne',
'77011': '11ème circonscription, Seine-et-Marne',
'78001': '1ère circonscription, Yvelines',
'78002': '2ème circonscription, Yvelines',
'78003': '3ème circonscription, Yvelines',
'78004': '4ème circonscription, Yvelines',
'78005': '5ème circonscription, Yvelines',
'78006': '6ème circonscription, Yvelines',
'78007': '7ème circonscription, Yvelines',
'78008': '8ème circonscription, Yvelines',
'78009': '9ème circonscription, Yvelines',
'78010': '10ème circonscription, Yvelines',
'78011': '11ème circonscription, Yvelines',
'78012': '12ème circonscription, Yvelines',
'79001': '1ère circonscription, Deux-Sèvres',
'79002': '2ème circonscription, Deux-Sèvres',
'79003': '3ème circonscription, Deux-Sèvres',
'80001': '1ère circonscription, Somme',
'80002': '2ème circonscription, Somme',
'80003': '3ème circonscription, Somme',
'80004': '4ème circonscription, Somme',
'80005': '5ème circonscription, Somme',
'81001': '1ère circonscription, Tarn',
'81002': '2ème circonscription, Tarn',
'81003': '3ème circonscription, Tarn',
'82001': '1ère circonscription, Tarn-et-Garonne',
'82002': '2ème circonscription, Tarn-et-Garonne',
'83001': '1ère circonscription, Var',
'83002': '2ème circonscription, Var',
'83003': '3ème circonscription, Var',
'83004': '4ème circonscription, Var',
'83005': '5ème circonscription, Var',
'83006': '6ème circonscription, Var',
'83007': '7ème circonscription, Var',
'83008': '8ème circonscription, Var',
'84001': '1ère circonscription, Vaucluse',
'84002': '2ème circonscription, Vaucluse',
'84003': '3ème circonscription, Vaucluse',
'84004': '4ème circonscription, Vaucluse',
'84005': '5ème circonscription, Vaucluse',
'85001': '1ère circonscription, Vendée',
'85002': '2ème circonscription, Vendée',
'85003': '3ème circonscription, Vendée',
'85004': '4ème circonscription, Vendée',
'85005': '5ème circonscription, Vendée',
'86001': '1ère circonscription, Vienne',
'86002': '2ème circonscription, Vienne',
'86003': '3ème circonscription, Vienne',
'86004': '4ème circonscription, Vienne',
'87001': '1ère circonscription, Haute-Vienne',
'87002': '2ème circonscription, Haute-Vienne',
'87003': '3ème circonscription, Haute-Vienne',
'88001': '1ère circonscription, Vosges',
'88002': '2ème circonscription, Vosges',
'88003': '3ème circonscription, Vosges',
'88004': '4ème circonscription, Vosges',
'89001': '1ère circonscription, Yonne',
'89002': '2ème circonscription, Yonne',
'89003': '3ème circonscription, Yonne',
'90001': '1ère circonscription, Territoire de Belfort',
'90002': '2ème circonscription, Territoire de Belfort',
'91001': '1ère circonscription, Essonne',
'91002': '2ème circonscription, Essonne',
'91003': '3ème circonscription, Essonne',
'91004': '4ème circonscription, Essonne',
'91005': '5ème circonscription, Essonne',
'91006': '6ème circonscription, Essonne',
'91007': '7ème circonscription, Essonne',
'91008': '8ème circonscription, Essonne',
'91009': '9ème circonscription, Essonne',
'91010': '10ème circonscription, Essonne',
'92001': '1ère circonscription, Hauts-de-Seine',
'92002': '2ème circonscription, Hauts-de-Seine',
'92003': '3ème circonscription, Hauts-de-Seine',
'92004': '4ème circonscription, Hauts-de-Seine',
'92005': '5ème circonscription, Hauts-de-Seine',
'92006': '6ème circonscription, Hauts-de-Seine',
'92007': '7ème circonscription, Hauts-de-Seine',
'92008': '8ème circonscription, Hauts-de-Seine',
'92009': '9ème circonscription, Hauts-de-Seine',
'92010': '10ème circonscription, Hauts-de-Seine',
'92011': '11ème circonscription, Hauts-de-Seine',
'92012': '12ème circonscription, Hauts-de-Seine',
'92013': '13ème circonscription, Hauts-de-Seine',
'93001': '1ère circonscription, Seine-Saint-Denis',
'93002': '2ème circonscription, Seine-Saint-Denis',
'93003': '3ème circonscription, Seine-Saint-Denis',
'93004': '4ème circonscription, Seine-Saint-Denis',
'93005': '5ème circonscription, Seine-Saint-Denis',
'93006': '6ème circonscription, Seine-Saint-Denis',
'93007': '7ème circonscription, Seine-Saint-Denis',
'93008': '8ème circonscription, Seine-Saint-Denis',
'93009': '9ème circonscription, Seine-Saint-Denis',
'93010': '10ème circonscription, Seine-Saint-Denis',
'93011': '11ème circonscription, Seine-Saint-Denis',
'93012': '12ème circonscription, Seine-Saint-Denis',
'94001': '1ère circonscription, Val-de-Marne',
'94002': '2ème circonscription, Val-de-Marne',
'94003': '3ème circonscription, Val-de-Marne',
'94004': '4ème circonscription, Val-de-Marne',
'94005': '5ème circonscription, Val-de-Marne',
'94006': '6ème circonscription, Val-de-Marne',
'94007': '7ème circonscription, Val-de-Marne',
'94008': '8ème circonscription, Val-de-Marne',
'94009': '9ème circonscription, Val-de-Marne',
'94010': '10ème circonscription, Val-de-Marne',
'94011': '11ème circonscription, Val-de-Marne',
'95001': "1ère circonscription, Val-d'Oise",
'95002': "2ème circonscription, Val-d'Oise",
'95003': "3ème circonscription, Val-d'Oise",
'95004': "4ème circonscription, Val-d'Oise",
'95005': "5ème circonscription, Val-d'Oise",
'95006': "6ème circonscription, Val-d'Oise",
'95007': "7ème circonscription, Val-d'Oise",
'95008': "8ème circonscription, Val-d'Oise",
'95009': "9ème circonscription, Val-d'Oise",
'95010': "10ème circonscription, Val-d'Oise",
'ZA001': '1ère circonscription, Guadeloupe',
'ZA002': '2ème circonscription, Guadeloupe',
'ZA003': '3ème circonscription, Guadeloupe',
'ZA004': '4ème circonscription, Guadeloupe',
'ZB001': '1ère circonscription, Martinique',
'ZB002': '2ème circonscription, Martinique',
'ZB003': '3ème circonscription, Martinique',
'ZB004': '4ème circonscription, Martinique',
'ZC001': '1ère circonscription, Guyane',
'ZC002': '2ème circonscription, Guyane',
'ZD001': '1ère circonscription, La Réunion',
'ZD002': '2ème circonscription, La Réunion',
'ZD003': '3ème circonscription, La Réunion',
'ZD004': '4ème circonscription, La Réunion',
'ZD005': '5ème circonscription, La Réunion',
'ZD006': '6ème circonscription, La Réunion',
'ZD007': '7ème circonscription, La Réunion',
'ZM001': '1ère circonscription, Mayotte',
'ZM002': '2ème circonscription, Mayotte',
'ZN001': '1ère circonscription, Nouvelle-Calédonie',
'ZN002': '2ème circonscription, Nouvelle-Calédonie',
'ZP001': '1ère circonscription, Polynésie française',
'ZP002': '2ème circonscription, Polynésie française',
'ZP003': '3ème circonscription, Polynésie française',
'ZS001': 'Saint-Pierre-et-Miquelon, Saint-Pierre-et-Miquelon',
'ZW001': '1ère circonscription, Wallis et Futuna',
'ZX001': '1ère circonscription, Saint-Martin/Saint-Barthélemy',
'ZZ001': '1ère circonscription, Français établis hors de France',
'ZZ002': '2ème circonscription, Français établis hors de France',
'ZZ003': '3ème circonscription, Français établis hors de France',
'ZZ004': '4ème circonscription, Français établis hors de France',
'ZZ005': '5ème circonscription, Français établis hors de France',
'ZZ006': '6ème circonscription, Français établis hors de France',
'ZZ007': '7ème circonscription, Français établis hors de France',
'ZZ008': '8ème circonscription, Français établis hors de France',
'ZZ009': '9ème circonscription, Français établis hors de France',
'ZZ010': '10ème circonscription, Français établis hors de France',
'ZZ011': '11ème circonscription, Français établis hors de France'}

const correspondance_departements_OTM = {'971': 'ZA',
 '972': 'ZB',
 '973': 'ZC',
 '974': 'ZD',
 '976': 'ZM',
 '988': 'ZN',
 '987': 'ZP',
 '975': 'ZS',
 '977': 'ZX',
 '978': 'ZX',
 '986': 'ZW'}

 ///Loading data

Promise.all([
    d3.csv('data/deputes_sortants.csv'),
    d3.csv('data/election_pres_T1.csv'),
    d3.csv('data/elu_2017.csv'),
    d3.csv('data/T1_2017.csv')
]).then(function(files) {
  ready(files[0], files[1], files[2], files[3])
}).catch(function(err) {
  console.log('erreur' + ' ' + err)
})

function ready(sortants, T1_Presidentielle, elu_2017, T1_2017) {

data_sortants = sortants
data_elu_2017 = elu_2017

T1_Presidentielle.forEach(d =>{
d.exprimes = +d.Exprimes
d.voix = +d.voix
})

data_T1_Presi = T1_Presidentielle


T1_2017.forEach(d =>{
d.exprimes = +d.exprimes
d.voix = +d.voix
})

data_T1_2017 = T1_2017


  }


function drawGraph(range, type_scrutin){

var this_html = '<div style="margin-top:10px">';

let color_range, type_var

if (type_scrutin == 'presidentielle'){
  color_range = colors_candidats
  type_var = 'nom'
}
else{
 color_range = nuances_pol
 type_var = 'nuance'
}


for (i in range){
  var d = range[i]
  var html_chunk = '<div class="cell" style="margin-top:5px">'

    d['score_text'] = d.score != 100 ? number_separator(d.score) + ' %' : ''
    d['score_bar'] = d.score*1.5
    d['color_item'] = color_range[d[type_var]]

  html_chunk += `<div class="score" style="float:right;margin-right: 4px;font-weight:bold">  ${d.score_text}</div><div class="name" style="margin-top:5px">${d['nom']}</div>
      <div style="height:9px;background-color: #ddd"><div style="height:8px;width:${d.score_bar}%;background-color:${d.color_item};"></div>
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



function number_separator(x) {
  let y = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return y.replace(',', ' ').replace(',', ' ').replace('.', ',')
}