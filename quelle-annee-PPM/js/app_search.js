
let all_loaded_dep = {}
let data_sortants
let data_T1_Presidentielle
let data_elu_2017
let data_T1_2017
let this_selection
let data_ppm

var xScale,
  yScale;


moment.locale('fr')

const rattachement_financier = {}


          d3.csv("data/ppm_since1900_monthly.csv")
          .then(function(data) {
            data_ppm = data
data_ppm.forEach(function(d){
d.de_season_avg = +d.de_season_avg;

  })


          })
          .catch(function(error) {
          });




const autoCompleteJS = new autoComplete({
  placeHolder: "Mois et année de naissance",
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
    return  data_ppm},
    // Data source 'Object' key to be searched
    keys: ["mois_annee"],
    cache: false
},

/*  data: {

        src: data_ppm.map(d=>d.mois_annee)*/

/*    src: async (query) => {
      try {


        let encoded_query = encodeURI(query)

        const source = data_ppm;
        // Data is array of `Objects` | `Strings`
        const data = source;


        const data_entries  = data.features.map(function(d) { 

          return {'label':d.mois_annee, 'valeur':d.de_season_avg} 
        });



        return data_entries
      } catch (error) {

        return error;
      }
    },
    keys:['mois_annee'],
    cache: false,
    maxResults: 10*/
/*  },*/
  resultItem: {
    highlight: true
  },
  events: {
    input: {
      selection: (event) => {
        const selection = event.detail.selection.value;
        autoCompleteJS.input.value = selection.mois_annee;
        this_selection = selection.properties

        console.log(selection)

        let this_concentration = selection.de_season_avg


        write_PPM(this_concentration)


     /*   show_circ(all_loaded_dep[this_dep])*/

     function write_PPM(concentration){

      d3.select('#result_circo').text(String(_.round(concentration,1)).replace('.', ','))



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


  var data = [{"year":"1900","month":"1","de_season_avg":"294.22","datetime":"1900-01-31"},{"year":"1900","month":"2","de_season_avg":"294.22","datetime":"1900-02-28"},{"year":"1900","month":"3","de_season_avg":"294.22","datetime":"1900-03-31"},{"year":"1900","month":"4","de_season_avg":"294.22","datetime":"1900-04-30"},{"year":"1900","month":"5","de_season_avg":"294.22","datetime":"1900-05-31"},{"year":"1900","month":"6","de_season_avg":"294.22","datetime":"1900-06-30"},{"year":"1900","month":"7","de_season_avg":"294.22","datetime":"1900-07-31"},{"year":"1900","month":"8","de_season_avg":"294.22","datetime":"1900-08-31"},{"year":"1900","month":"9","de_season_avg":"294.22","datetime":"1900-09-30"},{"year":"1900","month":"10","de_season_avg":"294.22","datetime":"1900-10-31"},{"year":"1900","month":"11","de_season_avg":"294.22","datetime":"1900-11-30"},{"year":"1900","month":"12","de_season_avg":"294.22","datetime":"1900-12-31"},{"year":"1901","month":"1","de_season_avg":"294.28","datetime":"1901-01-31"},{"year":"1901","month":"2","de_season_avg":"294.34","datetime":"1901-02-28"},{"year":"1901","month":"3","de_season_avg":"294.39","datetime":"1901-03-31"},{"year":"1901","month":"4","de_season_avg":"294.45","datetime":"1901-04-30"},{"year":"1901","month":"5","de_season_avg":"294.51","datetime":"1901-05-31"},{"year":"1901","month":"6","de_season_avg":"294.57","datetime":"1901-06-30"},{"year":"1901","month":"7","de_season_avg":"294.63","datetime":"1901-07-31"},{"year":"1901","month":"8","de_season_avg":"294.68","datetime":"1901-08-31"},{"year":"1901","month":"9","de_season_avg":"294.74","datetime":"1901-09-30"},{"year":"1901","month":"10","de_season_avg":"294.8","datetime":"1901-10-31"},{"year":"1901","month":"11","de_season_avg":"294.86","datetime":"1901-11-30"},{"year":"1901","month":"12","de_season_avg":"294.92","datetime":"1901-12-31"},{"year":"1902","month":"1","de_season_avg":"294.97","datetime":"1902-01-31"},{"year":"1902","month":"2","de_season_avg":"295.03","datetime":"1902-02-28"},{"year":"1902","month":"3","de_season_avg":"295.09","datetime":"1902-03-31"},{"year":"1902","month":"4","de_season_avg":"295.15","datetime":"1902-04-30"},{"year":"1902","month":"5","de_season_avg":"295.21","datetime":"1902-05-31"},{"year":"1902","month":"6","de_season_avg":"295.26","datetime":"1902-06-30"},{"year":"1902","month":"7","de_season_avg":"295.32","datetime":"1902-07-31"},{"year":"1902","month":"8","de_season_avg":"295.38","datetime":"1902-08-31"},{"year":"1902","month":"9","de_season_avg":"295.44","datetime":"1902-09-30"},{"year":"1902","month":"10","de_season_avg":"295.49","datetime":"1902-10-31"},{"year":"1902","month":"11","de_season_avg":"295.55","datetime":"1902-11-30"},{"year":"1902","month":"12","de_season_avg":"295.61","datetime":"1902-12-31"},{"year":"1903","month":"1","de_season_avg":"295.63","datetime":"1903-01-31"},{"year":"1903","month":"2","de_season_avg":"295.64","datetime":"1903-02-28"},{"year":"1903","month":"3","de_season_avg":"295.66","datetime":"1903-03-31"},{"year":"1903","month":"4","de_season_avg":"295.67","datetime":"1903-04-30"},{"year":"1903","month":"5","de_season_avg":"295.69","datetime":"1903-05-31"},{"year":"1903","month":"6","de_season_avg":"295.71","datetime":"1903-06-30"},{"year":"1903","month":"7","de_season_avg":"295.72","datetime":"1903-07-31"},{"year":"1903","month":"8","de_season_avg":"295.74","datetime":"1903-08-31"},{"year":"1903","month":"9","de_season_avg":"295.75","datetime":"1903-09-30"},{"year":"1903","month":"10","de_season_avg":"295.77","datetime":"1903-10-31"},{"year":"1903","month":"11","de_season_avg":"295.79","datetime":"1903-11-30"},{"year":"1903","month":"12","de_season_avg":"295.8","datetime":"1903-12-31"},{"year":"1904","month":"1","de_season_avg":"295.82","datetime":"1904-01-31"},{"year":"1904","month":"2","de_season_avg":"295.83","datetime":"1904-02-29"},{"year":"1904","month":"3","de_season_avg":"295.85","datetime":"1904-03-31"},{"year":"1904","month":"4","de_season_avg":"295.86","datetime":"1904-04-30"},{"year":"1904","month":"5","de_season_avg":"295.88","datetime":"1904-05-31"},{"year":"1904","month":"6","de_season_avg":"295.9","datetime":"1904-06-30"},{"year":"1904","month":"7","de_season_avg":"295.91","datetime":"1904-07-31"},{"year":"1904","month":"8","de_season_avg":"295.93","datetime":"1904-08-31"},{"year":"1904","month":"9","de_season_avg":"295.94","datetime":"1904-09-30"},{"year":"1904","month":"10","de_season_avg":"295.96","datetime":"1904-10-31"},{"year":"1904","month":"11","de_season_avg":"295.98","datetime":"1904-11-30"},{"year":"1904","month":"12","de_season_avg":"295.99","datetime":"1904-12-31"},{"year":"1905","month":"1","de_season_avg":"296.24","datetime":"1905-01-31"},{"year":"1905","month":"2","de_season_avg":"296.5","datetime":"1905-02-28"},{"year":"1905","month":"3","de_season_avg":"296.75","datetime":"1905-03-31"},{"year":"1905","month":"4","de_season_avg":"297.0","datetime":"1905-04-30"},{"year":"1905","month":"5","de_season_avg":"297.25","datetime":"1905-05-31"},{"year":"1905","month":"6","de_season_avg":"297.51","datetime":"1905-06-30"},{"year":"1905","month":"7","de_season_avg":"297.76","datetime":"1905-07-31"},{"year":"1905","month":"8","de_season_avg":"298.01","datetime":"1905-08-31"},{"year":"1905","month":"9","de_season_avg":"298.27","datetime":"1905-09-30"},{"year":"1905","month":"10","de_season_avg":"298.52","datetime":"1905-10-31"},{"year":"1905","month":"11","de_season_avg":"298.77","datetime":"1905-11-30"},{"year":"1905","month":"12","de_season_avg":"299.02","datetime":"1905-12-31"},{"year":"1906","month":"1","de_season_avg":"298.98","datetime":"1906-01-31"},{"year":"1906","month":"2","de_season_avg":"298.93","datetime":"1906-02-28"},{"year":"1906","month":"3","de_season_avg":"298.89","datetime":"1906-03-31"},{"year":"1906","month":"4","de_season_avg":"298.84","datetime":"1906-04-30"},{"year":"1906","month":"5","de_season_avg":"298.8","datetime":"1906-05-31"},{"year":"1906","month":"6","de_season_avg":"298.75","datetime":"1906-06-30"},{"year":"1906","month":"7","de_season_avg":"298.71","datetime":"1906-07-31"},{"year":"1906","month":"8","de_season_avg":"298.66","datetime":"1906-08-31"},{"year":"1906","month":"9","de_season_avg":"298.61","datetime":"1906-09-30"},{"year":"1906","month":"10","de_season_avg":"298.57","datetime":"1906-10-31"},{"year":"1906","month":"11","de_season_avg":"298.52","datetime":"1906-11-30"},{"year":"1906","month":"12","de_season_avg":"298.48","datetime":"1906-12-31"},{"year":"1907","month":"1","de_season_avg":"298.56","datetime":"1907-01-31"},{"year":"1907","month":"2","de_season_avg":"298.65","datetime":"1907-02-28"},{"year":"1907","month":"3","de_season_avg":"298.73","datetime":"1907-03-31"},{"year":"1907","month":"4","de_season_avg":"298.81","datetime":"1907-04-30"},{"year":"1907","month":"5","de_season_avg":"298.9","datetime":"1907-05-31"},{"year":"1907","month":"6","de_season_avg":"298.98","datetime":"1907-06-30"},{"year":"1907","month":"7","de_season_avg":"299.07","datetime":"1907-07-31"},{"year":"1907","month":"8","de_season_avg":"299.15","datetime":"1907-08-31"},{"year":"1907","month":"9","de_season_avg":"299.23","datetime":"1907-09-30"},{"year":"1907","month":"10","de_season_avg":"299.32","datetime":"1907-10-31"},{"year":"1907","month":"11","de_season_avg":"299.4","datetime":"1907-11-30"},{"year":"1907","month":"12","de_season_avg":"299.49","datetime":"1907-12-31"},{"year":"1908","month":"1","de_season_avg":"299.57","datetime":"1908-01-31"},{"year":"1908","month":"2","de_season_avg":"299.65","datetime":"1908-02-29"},{"year":"1908","month":"3","de_season_avg":"299.74","datetime":"1908-03-31"},{"year":"1908","month":"4","de_season_avg":"299.82","datetime":"1908-04-30"},{"year":"1908","month":"5","de_season_avg":"299.91","datetime":"1908-05-31"},{"year":"1908","month":"6","de_season_avg":"299.99","datetime":"1908-06-30"},{"year":"1908","month":"7","de_season_avg":"300.07","datetime":"1908-07-31"},{"year":"1908","month":"8","de_season_avg":"300.16","datetime":"1908-08-31"},{"year":"1908","month":"9","de_season_avg":"300.24","datetime":"1908-09-30"},{"year":"1908","month":"10","de_season_avg":"300.33","datetime":"1908-10-31"},{"year":"1908","month":"11","de_season_avg":"300.41","datetime":"1908-11-30"},{"year":"1908","month":"12","de_season_avg":"300.5","datetime":"1908-12-31"},{"year":"1909","month":"1","de_season_avg":"300.58","datetime":"1909-01-31"},{"year":"1909","month":"2","de_season_avg":"300.66","datetime":"1909-02-28"},{"year":"1909","month":"3","de_season_avg":"300.75","datetime":"1909-03-31"},{"year":"1909","month":"4","de_season_avg":"300.83","datetime":"1909-04-30"},{"year":"1909","month":"5","de_season_avg":"300.92","datetime":"1909-05-31"},{"year":"1909","month":"6","de_season_avg":"301.0","datetime":"1909-06-30"},{"year":"1909","month":"7","de_season_avg":"301.08","datetime":"1909-07-31"},{"year":"1909","month":"8","de_season_avg":"301.17","datetime":"1909-08-31"},{"year":"1909","month":"9","de_season_avg":"301.25","datetime":"1909-09-30"},{"year":"1909","month":"10","de_season_avg":"301.34","datetime":"1909-10-31"},{"year":"1909","month":"11","de_season_avg":"301.42","datetime":"1909-11-30"},{"year":"1909","month":"12","de_season_avg":"301.5","datetime":"1909-12-31"},{"year":"1910","month":"1","de_season_avg":"301.2","datetime":"1910-01-31"},{"year":"1910","month":"2","de_season_avg":"300.9","datetime":"1910-02-28"},{"year":"1910","month":"3","de_season_avg":"300.6","datetime":"1910-03-31"},{"year":"1910","month":"4","de_season_avg":"300.29","datetime":"1910-04-30"},{"year":"1910","month":"5","de_season_avg":"299.99","datetime":"1910-05-31"},{"year":"1910","month":"6","de_season_avg":"299.69","datetime":"1910-06-30"},{"year":"1910","month":"7","de_season_avg":"299.38","datetime":"1910-07-31"},{"year":"1910","month":"8","de_season_avg":"299.08","datetime":"1910-08-31"},{"year":"1910","month":"9","de_season_avg":"298.78","datetime":"1910-09-30"},{"year":"1910","month":"10","de_season_avg":"298.47","datetime":"1910-10-31"},{"year":"1910","month":"11","de_season_avg":"298.17","datetime":"1910-11-30"},{"year":"1910","month":"12","de_season_avg":"297.87","datetime":"1910-12-31"},{"year":"1911","month":"1","de_season_avg":"297.91","datetime":"1911-01-31"},{"year":"1911","month":"2","de_season_avg":"297.95","datetime":"1911-02-28"},{"year":"1911","month":"3","de_season_avg":"297.99","datetime":"1911-03-31"},{"year":"1911","month":"4","de_season_avg":"298.03","datetime":"1911-04-30"},{"year":"1911","month":"5","de_season_avg":"298.08","datetime":"1911-05-31"},{"year":"1911","month":"6","de_season_avg":"298.12","datetime":"1911-06-30"},{"year":"1911","month":"7","de_season_avg":"298.16","datetime":"1911-07-31"},{"year":"1911","month":"8","de_season_avg":"298.2","datetime":"1911-08-31"},{"year":"1911","month":"9","de_season_avg":"298.24","datetime":"1911-09-30"},{"year":"1911","month":"10","de_season_avg":"298.28","datetime":"1911-10-31"},{"year":"1911","month":"11","de_season_avg":"298.32","datetime":"1911-11-30"},{"year":"1911","month":"12","de_season_avg":"298.36","datetime":"1911-12-31"},{"year":"1912","month":"1","de_season_avg":"298.49","datetime":"1912-01-31"},{"year":"1912","month":"2","de_season_avg":"298.61","datetime":"1912-02-29"},{"year":"1912","month":"3","de_season_avg":"298.73","datetime":"1912-03-31"},{"year":"1912","month":"4","de_season_avg":"298.85","datetime":"1912-04-30"},{"year":"1912","month":"5","de_season_avg":"298.97","datetime":"1912-05-31"},{"year":"1912","month":"6","de_season_avg":"299.1","datetime":"1912-06-30"},{"year":"1912","month":"7","de_season_avg":"299.22","datetime":"1912-07-31"},{"year":"1912","month":"8","de_season_avg":"299.34","datetime":"1912-08-31"},{"year":"1912","month":"9","de_season_avg":"299.46","datetime":"1912-09-30"},{"year":"1912","month":"10","de_season_avg":"299.59","datetime":"1912-10-31"},{"year":"1912","month":"11","de_season_avg":"299.71","datetime":"1912-11-30"},{"year":"1912","month":"12","de_season_avg":"299.83","datetime":"1912-12-31"},{"year":"1913","month":"1","de_season_avg":"299.95","datetime":"1913-01-31"},{"year":"1913","month":"2","de_season_avg":"300.08","datetime":"1913-02-28"},{"year":"1913","month":"3","de_season_avg":"300.2","datetime":"1913-03-31"},{"year":"1913","month":"4","de_season_avg":"300.32","datetime":"1913-04-30"},{"year":"1913","month":"5","de_season_avg":"300.44","datetime":"1913-05-31"},{"year":"1913","month":"6","de_season_avg":"300.56","datetime":"1913-06-30"},{"year":"1913","month":"7","de_season_avg":"300.69","datetime":"1913-07-31"},{"year":"1913","month":"8","de_season_avg":"300.81","datetime":"1913-08-31"},{"year":"1913","month":"9","de_season_avg":"300.93","datetime":"1913-09-30"},{"year":"1913","month":"10","de_season_avg":"301.05","datetime":"1913-10-31"},{"year":"1913","month":"11","de_season_avg":"301.18","datetime":"1913-11-30"},{"year":"1913","month":"12","de_season_avg":"301.3","datetime":"1913-12-31"},{"year":"1914","month":"1","de_season_avg":"301.25","datetime":"1914-01-31"},{"year":"1914","month":"2","de_season_avg":"301.2","datetime":"1914-02-28"},{"year":"1914","month":"3","de_season_avg":"301.15","datetime":"1914-03-31"},{"year":"1914","month":"4","de_season_avg":"301.1","datetime":"1914-04-30"},{"year":"1914","month":"5","de_season_avg":"301.05","datetime":"1914-05-31"},{"year":"1914","month":"6","de_season_avg":"301.0","datetime":"1914-06-30"},{"year":"1914","month":"7","de_season_avg":"300.95","datetime":"1914-07-31"},{"year":"1914","month":"8","de_season_avg":"300.9","datetime":"1914-08-31"},{"year":"1914","month":"9","de_season_avg":"300.85","datetime":"1914-09-30"},{"year":"1914","month":"10","de_season_avg":"300.8","datetime":"1914-10-31"},{"year":"1914","month":"11","de_season_avg":"300.75","datetime":"1914-11-30"},{"year":"1914","month":"12","de_season_avg":"300.7","datetime":"1914-12-31"},{"year":"1915","month":"1","de_season_avg":"300.75","datetime":"1915-01-31"},{"year":"1915","month":"2","de_season_avg":"300.8","datetime":"1915-02-28"},{"year":"1915","month":"3","de_season_avg":"300.85","datetime":"1915-03-31"},{"year":"1915","month":"4","de_season_avg":"300.9","datetime":"1915-04-30"},{"year":"1915","month":"5","de_season_avg":"300.95","datetime":"1915-05-31"},{"year":"1915","month":"6","de_season_avg":"301.0","datetime":"1915-06-30"},{"year":"1915","month":"7","de_season_avg":"301.05","datetime":"1915-07-31"},{"year":"1915","month":"8","de_season_avg":"301.11","datetime":"1915-08-31"},{"year":"1915","month":"9","de_season_avg":"301.16","datetime":"1915-09-30"},{"year":"1915","month":"10","de_season_avg":"301.21","datetime":"1915-10-31"},{"year":"1915","month":"11","de_season_avg":"301.26","datetime":"1915-11-30"},{"year":"1915","month":"12","de_season_avg":"301.31","datetime":"1915-12-31"},{"year":"1916","month":"1","de_season_avg":"301.36","datetime":"1916-01-31"},{"year":"1916","month":"2","de_season_avg":"301.41","datetime":"1916-02-29"},{"year":"1916","month":"3","de_season_avg":"301.46","datetime":"1916-03-31"},{"year":"1916","month":"4","de_season_avg":"301.51","datetime":"1916-04-30"},{"year":"1916","month":"5","de_season_avg":"301.56","datetime":"1916-05-31"},{"year":"1916","month":"6","de_season_avg":"301.61","datetime":"1916-06-30"},{"year":"1916","month":"7","de_season_avg":"301.66","datetime":"1916-07-31"},{"year":"1916","month":"8","de_season_avg":"301.71","datetime":"1916-08-31"},{"year":"1916","month":"9","de_season_avg":"301.76","datetime":"1916-09-30"},{"year":"1916","month":"10","de_season_avg":"301.81","datetime":"1916-10-31"},{"year":"1916","month":"11","de_season_avg":"301.86","datetime":"1916-11-30"},{"year":"1916","month":"12","de_season_avg":"301.92","datetime":"1916-12-31"},{"year":"1917","month":"1","de_season_avg":"302.0","datetime":"1917-01-31"},{"year":"1917","month":"2","de_season_avg":"302.08","datetime":"1917-02-28"},{"year":"1917","month":"3","de_season_avg":"302.16","datetime":"1917-03-31"},{"year":"1917","month":"4","de_season_avg":"302.24","datetime":"1917-04-30"},{"year":"1917","month":"5","de_season_avg":"302.32","datetime":"1917-05-31"},{"year":"1917","month":"6","de_season_avg":"302.4","datetime":"1917-06-30"},{"year":"1917","month":"7","de_season_avg":"302.48","datetime":"1917-07-31"},{"year":"1917","month":"8","de_season_avg":"302.56","datetime":"1917-08-31"},{"year":"1917","month":"9","de_season_avg":"302.64","datetime":"1917-09-30"},{"year":"1917","month":"10","de_season_avg":"302.72","datetime":"1917-10-31"},{"year":"1917","month":"11","de_season_avg":"302.8","datetime":"1917-11-30"},{"year":"1917","month":"12","de_season_avg":"302.88","datetime":"1917-12-31"},{"year":"1918","month":"1","de_season_avg":"302.96","datetime":"1918-01-31"},{"year":"1918","month":"2","de_season_avg":"303.05","datetime":"1918-02-28"},{"year":"1918","month":"3","de_season_avg":"303.13","datetime":"1918-03-31"},{"year":"1918","month":"4","de_season_avg":"303.21","datetime":"1918-04-30"},{"year":"1918","month":"5","de_season_avg":"303.29","datetime":"1918-05-31"},{"year":"1918","month":"6","de_season_avg":"303.37","datetime":"1918-06-30"},{"year":"1918","month":"7","de_season_avg":"303.45","datetime":"1918-07-31"},{"year":"1918","month":"8","de_season_avg":"303.53","datetime":"1918-08-31"},{"year":"1918","month":"9","de_season_avg":"303.61","datetime":"1918-09-30"},{"year":"1918","month":"10","de_season_avg":"303.69","datetime":"1918-10-31"},{"year":"1918","month":"11","de_season_avg":"303.77","datetime":"1918-11-30"},{"year":"1918","month":"12","de_season_avg":"303.85","datetime":"1918-12-31"},{"year":"1919","month":"1","de_season_avg":"303.92","datetime":"1919-01-31"},{"year":"1919","month":"2","de_season_avg":"303.98","datetime":"1919-02-28"},{"year":"1919","month":"3","de_season_avg":"304.04","datetime":"1919-03-31"},{"year":"1919","month":"4","de_season_avg":"304.11","datetime":"1919-04-30"},{"year":"1919","month":"5","de_season_avg":"304.17","datetime":"1919-05-31"},{"year":"1919","month":"6","de_season_avg":"304.23","datetime":"1919-06-30"},{"year":"1919","month":"7","de_season_avg":"304.3","datetime":"1919-07-31"},{"year":"1919","month":"8","de_season_avg":"304.36","datetime":"1919-08-31"},{"year":"1919","month":"9","de_season_avg":"304.42","datetime":"1919-09-30"},{"year":"1919","month":"10","de_season_avg":"304.49","datetime":"1919-10-31"},{"year":"1919","month":"11","de_season_avg":"304.55","datetime":"1919-11-30"},{"year":"1919","month":"12","de_season_avg":"304.61","datetime":"1919-12-31"},{"year":"1920","month":"1","de_season_avg":"304.39","datetime":"1920-01-31"},{"year":"1920","month":"2","de_season_avg":"304.16","datetime":"1920-02-29"},{"year":"1920","month":"3","de_season_avg":"303.93","datetime":"1920-03-31"},{"year":"1920","month":"4","de_season_avg":"303.7","datetime":"1920-04-30"},{"year":"1920","month":"5","de_season_avg":"303.47","datetime":"1920-05-31"},{"year":"1920","month":"6","de_season_avg":"303.24","datetime":"1920-06-30"},{"year":"1920","month":"7","de_season_avg":"303.02","datetime":"1920-07-31"},{"year":"1920","month":"8","de_season_avg":"302.79","datetime":"1920-08-31"},{"year":"1920","month":"9","de_season_avg":"302.56","datetime":"1920-09-30"},{"year":"1920","month":"10","de_season_avg":"302.33","datetime":"1920-10-31"},{"year":"1920","month":"11","de_season_avg":"302.1","datetime":"1920-11-30"},{"year":"1920","month":"12","de_season_avg":"301.88","datetime":"1920-12-31"},{"year":"1921","month":"1","de_season_avg":"301.95","datetime":"1921-01-31"},{"year":"1921","month":"2","de_season_avg":"302.03","datetime":"1921-02-28"},{"year":"1921","month":"3","de_season_avg":"302.11","datetime":"1921-03-31"},{"year":"1921","month":"4","de_season_avg":"302.19","datetime":"1921-04-30"},{"year":"1921","month":"5","de_season_avg":"302.27","datetime":"1921-05-31"},{"year":"1921","month":"6","de_season_avg":"302.34","datetime":"1921-06-30"},{"year":"1921","month":"7","de_season_avg":"302.42","datetime":"1921-07-31"},{"year":"1921","month":"8","de_season_avg":"302.5","datetime":"1921-08-31"},{"year":"1921","month":"9","de_season_avg":"302.58","datetime":"1921-09-30"},{"year":"1921","month":"10","de_season_avg":"302.66","datetime":"1921-10-31"},{"year":"1921","month":"11","de_season_avg":"302.74","datetime":"1921-11-30"},{"year":"1921","month":"12","de_season_avg":"302.81","datetime":"1921-12-31"},{"year":"1922","month":"1","de_season_avg":"302.89","datetime":"1922-01-31"},{"year":"1922","month":"2","de_season_avg":"302.97","datetime":"1922-02-28"},{"year":"1922","month":"3","de_season_avg":"303.05","datetime":"1922-03-31"},{"year":"1922","month":"4","de_season_avg":"303.13","datetime":"1922-04-30"},{"year":"1922","month":"5","de_season_avg":"303.2","datetime":"1922-05-31"},{"year":"1922","month":"6","de_season_avg":"303.28","datetime":"1922-06-30"},{"year":"1922","month":"7","de_season_avg":"303.36","datetime":"1922-07-31"},{"year":"1922","month":"8","de_season_avg":"303.44","datetime":"1922-08-31"},{"year":"1922","month":"9","de_season_avg":"303.52","datetime":"1922-09-30"},{"year":"1922","month":"10","de_season_avg":"303.6","datetime":"1922-10-31"},{"year":"1922","month":"11","de_season_avg":"303.67","datetime":"1922-11-30"},{"year":"1922","month":"12","de_season_avg":"303.75","datetime":"1922-12-31"},{"year":"1923","month":"1","de_season_avg":"303.83","datetime":"1923-01-31"},{"year":"1923","month":"2","de_season_avg":"303.91","datetime":"1923-02-28"},{"year":"1923","month":"3","de_season_avg":"303.99","datetime":"1923-03-31"},{"year":"1923","month":"4","de_season_avg":"304.06","datetime":"1923-04-30"},{"year":"1923","month":"5","de_season_avg":"304.14","datetime":"1923-05-31"},{"year":"1923","month":"6","de_season_avg":"304.22","datetime":"1923-06-30"},{"year":"1923","month":"7","de_season_avg":"304.3","datetime":"1923-07-31"},{"year":"1923","month":"8","de_season_avg":"304.38","datetime":"1923-08-31"},{"year":"1923","month":"9","de_season_avg":"304.46","datetime":"1923-09-30"},{"year":"1923","month":"10","de_season_avg":"304.53","datetime":"1923-10-31"},{"year":"1923","month":"11","de_season_avg":"304.61","datetime":"1923-11-30"},{"year":"1923","month":"12","de_season_avg":"304.69","datetime":"1923-12-31"},{"year":"1924","month":"1","de_season_avg":"304.7","datetime":"1924-01-31"},{"year":"1924","month":"2","de_season_avg":"304.7","datetime":"1924-02-29"},{"year":"1924","month":"3","de_season_avg":"304.71","datetime":"1924-03-31"},{"year":"1924","month":"4","de_season_avg":"304.72","datetime":"1924-04-30"},{"year":"1924","month":"5","de_season_avg":"304.72","datetime":"1924-05-31"},{"year":"1924","month":"6","de_season_avg":"304.73","datetime":"1924-06-30"},{"year":"1924","month":"7","de_season_avg":"304.73","datetime":"1924-07-31"},{"year":"1924","month":"8","de_season_avg":"304.74","datetime":"1924-08-31"},{"year":"1924","month":"9","de_season_avg":"304.75","datetime":"1924-09-30"},{"year":"1924","month":"10","de_season_avg":"304.75","datetime":"1924-10-31"},{"year":"1924","month":"11","de_season_avg":"304.76","datetime":"1924-11-30"},{"year":"1924","month":"12","de_season_avg":"304.77","datetime":"1924-12-31"},{"year":"1925","month":"1","de_season_avg":"304.77","datetime":"1925-01-31"},{"year":"1925","month":"2","de_season_avg":"304.78","datetime":"1925-02-28"},{"year":"1925","month":"3","de_season_avg":"304.79","datetime":"1925-03-31"},{"year":"1925","month":"4","de_season_avg":"304.79","datetime":"1925-04-30"},{"year":"1925","month":"5","de_season_avg":"304.8","datetime":"1925-05-31"},{"year":"1925","month":"6","de_season_avg":"304.8","datetime":"1925-06-30"},{"year":"1925","month":"7","de_season_avg":"304.81","datetime":"1925-07-31"},{"year":"1925","month":"8","de_season_avg":"304.82","datetime":"1925-08-31"},{"year":"1925","month":"9","de_season_avg":"304.82","datetime":"1925-09-30"},{"year":"1925","month":"10","de_season_avg":"304.83","datetime":"1925-10-31"},{"year":"1925","month":"11","de_season_avg":"304.84","datetime":"1925-11-30"},{"year":"1925","month":"12","de_season_avg":"304.84","datetime":"1925-12-31"},{"year":"1926","month":"1","de_season_avg":"304.9","datetime":"1926-01-31"},{"year":"1926","month":"2","de_season_avg":"304.95","datetime":"1926-02-28"},{"year":"1926","month":"3","de_season_avg":"305.01","datetime":"1926-03-31"},{"year":"1926","month":"4","de_season_avg":"305.06","datetime":"1926-04-30"},{"year":"1926","month":"5","de_season_avg":"305.12","datetime":"1926-05-31"},{"year":"1926","month":"6","de_season_avg":"305.18","datetime":"1926-06-30"},{"year":"1926","month":"7","de_season_avg":"305.23","datetime":"1926-07-31"},{"year":"1926","month":"8","de_season_avg":"305.29","datetime":"1926-08-31"},{"year":"1926","month":"9","de_season_avg":"305.34","datetime":"1926-09-30"},{"year":"1926","month":"10","de_season_avg":"305.4","datetime":"1926-10-31"},{"year":"1926","month":"11","de_season_avg":"305.45","datetime":"1926-11-30"},{"year":"1926","month":"12","de_season_avg":"305.51","datetime":"1926-12-31"},{"year":"1927","month":"1","de_season_avg":"305.57","datetime":"1927-01-31"},{"year":"1927","month":"2","de_season_avg":"305.62","datetime":"1927-02-28"},{"year":"1927","month":"3","de_season_avg":"305.68","datetime":"1927-03-31"},{"year":"1927","month":"4","de_season_avg":"305.73","datetime":"1927-04-30"},{"year":"1927","month":"5","de_season_avg":"305.79","datetime":"1927-05-31"},{"year":"1927","month":"6","de_season_avg":"305.84","datetime":"1927-06-30"},{"year":"1927","month":"7","de_season_avg":"305.9","datetime":"1927-07-31"},{"year":"1927","month":"8","de_season_avg":"305.95","datetime":"1927-08-31"},{"year":"1927","month":"9","de_season_avg":"306.01","datetime":"1927-09-30"},{"year":"1927","month":"10","de_season_avg":"306.07","datetime":"1927-10-31"},{"year":"1927","month":"11","de_season_avg":"306.12","datetime":"1927-11-30"},{"year":"1927","month":"12","de_season_avg":"306.18","datetime":"1927-12-31"},{"year":"1928","month":"1","de_season_avg":"306.23","datetime":"1928-01-31"},{"year":"1928","month":"2","de_season_avg":"306.29","datetime":"1928-02-29"},{"year":"1928","month":"3","de_season_avg":"306.34","datetime":"1928-03-31"},{"year":"1928","month":"4","de_season_avg":"306.4","datetime":"1928-04-30"},{"year":"1928","month":"5","de_season_avg":"306.45","datetime":"1928-05-31"},{"year":"1928","month":"6","de_season_avg":"306.51","datetime":"1928-06-30"},{"year":"1928","month":"7","de_season_avg":"306.57","datetime":"1928-07-31"},{"year":"1928","month":"8","de_season_avg":"306.62","datetime":"1928-08-31"},{"year":"1928","month":"9","de_season_avg":"306.68","datetime":"1928-09-30"},{"year":"1928","month":"10","de_season_avg":"306.73","datetime":"1928-10-31"},{"year":"1928","month":"11","de_season_avg":"306.79","datetime":"1928-11-30"},{"year":"1928","month":"12","de_season_avg":"306.84","datetime":"1928-12-31"},{"year":"1929","month":"1","de_season_avg":"306.74","datetime":"1929-01-31"},{"year":"1929","month":"2","de_season_avg":"306.64","datetime":"1929-02-28"},{"year":"1929","month":"3","de_season_avg":"306.54","datetime":"1929-03-31"},{"year":"1929","month":"4","de_season_avg":"306.44","datetime":"1929-04-30"},{"year":"1929","month":"5","de_season_avg":"306.33","datetime":"1929-05-31"},{"year":"1929","month":"6","de_season_avg":"306.23","datetime":"1929-06-30"},{"year":"1929","month":"7","de_season_avg":"306.13","datetime":"1929-07-31"},{"year":"1929","month":"8","de_season_avg":"306.03","datetime":"1929-08-31"},{"year":"1929","month":"9","de_season_avg":"305.93","datetime":"1929-09-30"},{"year":"1929","month":"10","de_season_avg":"305.83","datetime":"1929-10-31"},{"year":"1929","month":"11","de_season_avg":"305.72","datetime":"1929-11-30"},{"year":"1929","month":"12","de_season_avg":"305.62","datetime":"1929-12-31"},{"year":"1930","month":"1","de_season_avg":"305.63","datetime":"1930-01-31"},{"year":"1930","month":"2","de_season_avg":"305.63","datetime":"1930-02-28"},{"year":"1930","month":"3","de_season_avg":"305.64","datetime":"1930-03-31"},{"year":"1930","month":"4","de_season_avg":"305.64","datetime":"1930-04-30"},{"year":"1930","month":"5","de_season_avg":"305.65","datetime":"1930-05-31"},{"year":"1930","month":"6","de_season_avg":"305.65","datetime":"1930-06-30"},{"year":"1930","month":"7","de_season_avg":"305.66","datetime":"1930-07-31"},{"year":"1930","month":"8","de_season_avg":"305.66","datetime":"1930-08-31"},{"year":"1930","month":"9","de_season_avg":"305.67","datetime":"1930-09-30"},{"year":"1930","month":"10","de_season_avg":"305.67","datetime":"1930-10-31"},{"year":"1930","month":"11","de_season_avg":"305.68","datetime":"1930-11-30"},{"year":"1930","month":"12","de_season_avg":"305.68","datetime":"1930-12-31"},{"year":"1931","month":"1","de_season_avg":"305.69","datetime":"1931-01-31"},{"year":"1931","month":"2","de_season_avg":"305.69","datetime":"1931-02-28"},{"year":"1931","month":"3","de_season_avg":"305.7","datetime":"1931-03-31"},{"year":"1931","month":"4","de_season_avg":"305.7","datetime":"1931-04-30"},{"year":"1931","month":"5","de_season_avg":"305.71","datetime":"1931-05-31"},{"year":"1931","month":"6","de_season_avg":"305.71","datetime":"1931-06-30"},{"year":"1931","month":"7","de_season_avg":"305.72","datetime":"1931-07-31"},{"year":"1931","month":"8","de_season_avg":"305.72","datetime":"1931-08-31"},{"year":"1931","month":"9","de_season_avg":"305.73","datetime":"1931-09-30"},{"year":"1931","month":"10","de_season_avg":"305.73","datetime":"1931-10-31"},{"year":"1931","month":"11","de_season_avg":"305.74","datetime":"1931-11-30"},{"year":"1931","month":"12","de_season_avg":"305.74","datetime":"1931-12-31"},{"year":"1932","month":"1","de_season_avg":"305.95","datetime":"1932-01-31"},{"year":"1932","month":"2","de_season_avg":"306.16","datetime":"1932-02-29"},{"year":"1932","month":"3","de_season_avg":"306.37","datetime":"1932-03-31"},{"year":"1932","month":"4","de_season_avg":"306.58","datetime":"1932-04-30"},{"year":"1932","month":"5","de_season_avg":"306.79","datetime":"1932-05-31"},{"year":"1932","month":"6","de_season_avg":"307.0","datetime":"1932-06-30"},{"year":"1932","month":"7","de_season_avg":"307.21","datetime":"1932-07-31"},{"year":"1932","month":"8","de_season_avg":"307.42","datetime":"1932-08-31"},{"year":"1932","month":"9","de_season_avg":"307.63","datetime":"1932-09-30"},{"year":"1932","month":"10","de_season_avg":"307.84","datetime":"1932-10-31"},{"year":"1932","month":"11","de_season_avg":"308.05","datetime":"1932-11-30"},{"year":"1932","month":"12","de_season_avg":"308.26","datetime":"1932-12-31"},{"year":"1933","month":"1","de_season_avg":"308.16","datetime":"1933-01-31"},{"year":"1933","month":"2","de_season_avg":"308.06","datetime":"1933-02-28"},{"year":"1933","month":"3","de_season_avg":"307.97","datetime":"1933-03-31"},{"year":"1933","month":"4","de_season_avg":"307.87","datetime":"1933-04-30"},{"year":"1933","month":"5","de_season_avg":"307.78","datetime":"1933-05-31"},{"year":"1933","month":"6","de_season_avg":"307.68","datetime":"1933-06-30"},{"year":"1933","month":"7","de_season_avg":"307.59","datetime":"1933-07-31"},{"year":"1933","month":"8","de_season_avg":"307.49","datetime":"1933-08-31"},{"year":"1933","month":"9","de_season_avg":"307.4","datetime":"1933-09-30"},{"year":"1933","month":"10","de_season_avg":"307.3","datetime":"1933-10-31"},{"year":"1933","month":"11","de_season_avg":"307.21","datetime":"1933-11-30"},{"year":"1933","month":"12","de_season_avg":"307.11","datetime":"1933-12-31"},{"year":"1934","month":"1","de_season_avg":"307.22","datetime":"1934-01-31"},{"year":"1934","month":"2","de_season_avg":"307.32","datetime":"1934-02-28"},{"year":"1934","month":"3","de_season_avg":"307.42","datetime":"1934-03-31"},{"year":"1934","month":"4","de_season_avg":"307.53","datetime":"1934-04-30"},{"year":"1934","month":"5","de_season_avg":"307.63","datetime":"1934-05-31"},{"year":"1934","month":"6","de_season_avg":"307.73","datetime":"1934-06-30"},{"year":"1934","month":"7","de_season_avg":"307.84","datetime":"1934-07-31"},{"year":"1934","month":"8","de_season_avg":"307.94","datetime":"1934-08-31"},{"year":"1934","month":"9","de_season_avg":"308.04","datetime":"1934-09-30"},{"year":"1934","month":"10","de_season_avg":"308.15","datetime":"1934-10-31"},{"year":"1934","month":"11","de_season_avg":"308.25","datetime":"1934-11-30"},{"year":"1934","month":"12","de_season_avg":"308.35","datetime":"1934-12-31"},{"year":"1935","month":"1","de_season_avg":"308.18","datetime":"1935-01-31"},{"year":"1935","month":"2","de_season_avg":"308.01","datetime":"1935-02-28"},{"year":"1935","month":"3","de_season_avg":"307.84","datetime":"1935-03-31"},{"year":"1935","month":"4","de_season_avg":"307.68","datetime":"1935-04-30"},{"year":"1935","month":"5","de_season_avg":"307.51","datetime":"1935-05-31"},{"year":"1935","month":"6","de_season_avg":"307.34","datetime":"1935-06-30"},{"year":"1935","month":"7","de_season_avg":"307.17","datetime":"1935-07-31"},{"year":"1935","month":"8","de_season_avg":"307.0","datetime":"1935-08-31"},{"year":"1935","month":"9","de_season_avg":"306.83","datetime":"1935-09-30"},{"year":"1935","month":"10","de_season_avg":"306.66","datetime":"1935-10-31"},{"year":"1935","month":"11","de_season_avg":"306.49","datetime":"1935-11-30"},{"year":"1935","month":"12","de_season_avg":"306.32","datetime":"1935-12-31"},{"year":"1936","month":"1","de_season_avg":"306.48","datetime":"1936-01-31"},{"year":"1936","month":"2","de_season_avg":"306.65","datetime":"1936-02-29"},{"year":"1936","month":"3","de_season_avg":"306.82","datetime":"1936-03-31"},{"year":"1936","month":"4","de_season_avg":"306.98","datetime":"1936-04-30"},{"year":"1936","month":"5","de_season_avg":"307.15","datetime":"1936-05-31"},{"year":"1936","month":"6","de_season_avg":"307.31","datetime":"1936-06-30"},{"year":"1936","month":"7","de_season_avg":"307.48","datetime":"1936-07-31"},{"year":"1936","month":"8","de_season_avg":"307.64","datetime":"1936-08-31"},{"year":"1936","month":"9","de_season_avg":"307.81","datetime":"1936-09-30"},{"year":"1936","month":"10","de_season_avg":"307.97","datetime":"1936-10-31"},{"year":"1936","month":"11","de_season_avg":"308.14","datetime":"1936-11-30"},{"year":"1936","month":"12","de_season_avg":"308.3","datetime":"1936-12-31"},{"year":"1937","month":"1","de_season_avg":"308.23","datetime":"1937-01-31"},{"year":"1937","month":"2","de_season_avg":"308.15","datetime":"1937-02-28"},{"year":"1937","month":"3","de_season_avg":"308.08","datetime":"1937-03-31"},{"year":"1937","month":"4","de_season_avg":"308.0","datetime":"1937-04-30"},{"year":"1937","month":"5","de_season_avg":"307.93","datetime":"1937-05-31"},{"year":"1937","month":"6","de_season_avg":"307.85","datetime":"1937-06-30"},{"year":"1937","month":"7","de_season_avg":"307.78","datetime":"1937-07-31"},{"year":"1937","month":"8","de_season_avg":"307.71","datetime":"1937-08-31"},{"year":"1937","month":"9","de_season_avg":"307.63","datetime":"1937-09-30"},{"year":"1937","month":"10","de_season_avg":"307.56","datetime":"1937-10-31"},{"year":"1937","month":"11","de_season_avg":"307.48","datetime":"1937-11-30"},{"year":"1937","month":"12","de_season_avg":"307.41","datetime":"1937-12-31"},{"year":"1938","month":"1","de_season_avg":"307.71","datetime":"1938-01-31"},{"year":"1938","month":"2","de_season_avg":"308.02","datetime":"1938-02-28"},{"year":"1938","month":"3","de_season_avg":"308.32","datetime":"1938-03-31"},{"year":"1938","month":"4","de_season_avg":"308.63","datetime":"1938-04-30"},{"year":"1938","month":"5","de_season_avg":"308.93","datetime":"1938-05-31"},{"year":"1938","month":"6","de_season_avg":"309.24","datetime":"1938-06-30"},{"year":"1938","month":"7","de_season_avg":"309.54","datetime":"1938-07-31"},{"year":"1938","month":"8","de_season_avg":"309.85","datetime":"1938-08-31"},{"year":"1938","month":"9","de_season_avg":"310.15","datetime":"1938-09-30"},{"year":"1938","month":"10","de_season_avg":"310.46","datetime":"1938-10-31"},{"year":"1938","month":"11","de_season_avg":"310.76","datetime":"1938-11-30"},{"year":"1938","month":"12","de_season_avg":"311.07","datetime":"1938-12-31"},{"year":"1939","month":"1","de_season_avg":"311.05","datetime":"1939-01-31"},{"year":"1939","month":"2","de_season_avg":"311.03","datetime":"1939-02-28"},{"year":"1939","month":"3","de_season_avg":"311.01","datetime":"1939-03-31"},{"year":"1939","month":"4","de_season_avg":"310.99","datetime":"1939-04-30"},{"year":"1939","month":"5","de_season_avg":"310.97","datetime":"1939-05-31"},{"year":"1939","month":"6","de_season_avg":"310.95","datetime":"1939-06-30"},{"year":"1939","month":"7","de_season_avg":"310.93","datetime":"1939-07-31"},{"year":"1939","month":"8","de_season_avg":"310.91","datetime":"1939-08-31"},{"year":"1939","month":"9","de_season_avg":"310.89","datetime":"1939-09-30"},{"year":"1939","month":"10","de_season_avg":"310.87","datetime":"1939-10-31"},{"year":"1939","month":"11","de_season_avg":"310.85","datetime":"1939-11-30"},{"year":"1939","month":"12","de_season_avg":"310.83","datetime":"1939-12-31"},{"year":"1940","month":"1","de_season_avg":"310.8","datetime":"1940-01-31"},{"year":"1940","month":"2","de_season_avg":"310.76","datetime":"1940-02-29"},{"year":"1940","month":"3","de_season_avg":"310.72","datetime":"1940-03-31"},{"year":"1940","month":"4","de_season_avg":"310.68","datetime":"1940-04-30"},{"year":"1940","month":"5","de_season_avg":"310.64","datetime":"1940-05-31"},{"year":"1940","month":"6","de_season_avg":"310.61","datetime":"1940-06-30"},{"year":"1940","month":"7","de_season_avg":"310.57","datetime":"1940-07-31"},{"year":"1940","month":"8","de_season_avg":"310.53","datetime":"1940-08-31"},{"year":"1940","month":"9","de_season_avg":"310.49","datetime":"1940-09-30"},{"year":"1940","month":"10","de_season_avg":"310.45","datetime":"1940-10-31"},{"year":"1940","month":"11","de_season_avg":"310.41","datetime":"1940-11-30"},{"year":"1940","month":"12","de_season_avg":"310.38","datetime":"1940-12-31"},{"year":"1941","month":"1","de_season_avg":"310.33","datetime":"1941-01-31"},{"year":"1941","month":"2","de_season_avg":"310.28","datetime":"1941-02-28"},{"year":"1941","month":"3","de_season_avg":"310.22","datetime":"1941-03-31"},{"year":"1941","month":"4","de_season_avg":"310.17","datetime":"1941-04-30"},{"year":"1941","month":"5","de_season_avg":"310.12","datetime":"1941-05-31"},{"year":"1941","month":"6","de_season_avg":"310.07","datetime":"1941-06-30"},{"year":"1941","month":"7","de_season_avg":"310.02","datetime":"1941-07-31"},{"year":"1941","month":"8","de_season_avg":"309.97","datetime":"1941-08-31"},{"year":"1941","month":"9","de_season_avg":"309.92","datetime":"1941-09-30"},{"year":"1941","month":"10","de_season_avg":"309.87","datetime":"1941-10-31"},{"year":"1941","month":"11","de_season_avg":"309.82","datetime":"1941-11-30"},{"year":"1941","month":"12","de_season_avg":"309.77","datetime":"1941-12-31"},{"year":"1942","month":"1","de_season_avg":"309.99","datetime":"1942-01-31"},{"year":"1942","month":"2","de_season_avg":"310.2","datetime":"1942-02-28"},{"year":"1942","month":"3","de_season_avg":"310.42","datetime":"1942-03-31"},{"year":"1942","month":"4","de_season_avg":"310.64","datetime":"1942-04-30"},{"year":"1942","month":"5","de_season_avg":"310.85","datetime":"1942-05-31"},{"year":"1942","month":"6","de_season_avg":"311.07","datetime":"1942-06-30"},{"year":"1942","month":"7","de_season_avg":"311.29","datetime":"1942-07-31"},{"year":"1942","month":"8","de_season_avg":"311.5","datetime":"1942-08-31"},{"year":"1942","month":"9","de_season_avg":"311.72","datetime":"1942-09-30"},{"year":"1942","month":"10","de_season_avg":"311.94","datetime":"1942-10-31"},{"year":"1942","month":"11","de_season_avg":"312.16","datetime":"1942-11-30"},{"year":"1942","month":"12","de_season_avg":"312.37","datetime":"1942-12-31"},{"year":"1943","month":"1","de_season_avg":"312.37","datetime":"1943-01-31"},{"year":"1943","month":"2","de_season_avg":"312.37","datetime":"1943-02-28"},{"year":"1943","month":"3","de_season_avg":"312.37","datetime":"1943-03-31"},{"year":"1943","month":"4","de_season_avg":"312.37","datetime":"1943-04-30"},{"year":"1943","month":"5","de_season_avg":"312.37","datetime":"1943-05-31"},{"year":"1943","month":"6","de_season_avg":"312.37","datetime":"1943-06-30"},{"year":"1943","month":"7","de_season_avg":"312.37","datetime":"1943-07-31"},{"year":"1943","month":"8","de_season_avg":"312.37","datetime":"1943-08-31"},{"year":"1943","month":"9","de_season_avg":"312.37","datetime":"1943-09-30"},{"year":"1943","month":"10","de_season_avg":"312.37","datetime":"1943-10-31"},{"year":"1943","month":"11","de_season_avg":"312.37","datetime":"1943-11-30"},{"year":"1943","month":"12","de_season_avg":"312.37","datetime":"1943-12-31"},{"year":"1944","month":"1","de_season_avg":"312.37","datetime":"1944-01-31"},{"year":"1944","month":"2","de_season_avg":"312.37","datetime":"1944-02-29"},{"year":"1944","month":"3","de_season_avg":"312.37","datetime":"1944-03-31"},{"year":"1944","month":"4","de_season_avg":"312.37","datetime":"1944-04-30"},{"year":"1944","month":"5","de_season_avg":"312.36","datetime":"1944-05-31"},{"year":"1944","month":"6","de_season_avg":"312.36","datetime":"1944-06-30"},{"year":"1944","month":"7","de_season_avg":"312.36","datetime":"1944-07-31"},{"year":"1944","month":"8","de_season_avg":"312.36","datetime":"1944-08-31"},{"year":"1944","month":"9","de_season_avg":"312.36","datetime":"1944-09-30"},{"year":"1944","month":"10","de_season_avg":"312.36","datetime":"1944-10-31"},{"year":"1944","month":"11","de_season_avg":"312.36","datetime":"1944-11-30"},{"year":"1944","month":"12","de_season_avg":"312.36","datetime":"1944-12-31"},{"year":"1945","month":"1","de_season_avg":"312.24","datetime":"1945-01-31"},{"year":"1945","month":"2","de_season_avg":"312.12","datetime":"1945-02-28"},{"year":"1945","month":"3","de_season_avg":"312.01","datetime":"1945-03-31"},{"year":"1945","month":"4","de_season_avg":"311.89","datetime":"1945-04-30"},{"year":"1945","month":"5","de_season_avg":"311.77","datetime":"1945-05-31"},{"year":"1945","month":"6","de_season_avg":"311.65","datetime":"1945-06-30"},{"year":"1945","month":"7","de_season_avg":"311.53","datetime":"1945-07-31"},{"year":"1945","month":"8","de_season_avg":"311.41","datetime":"1945-08-31"},{"year":"1945","month":"9","de_season_avg":"311.29","datetime":"1945-09-30"},{"year":"1945","month":"10","de_season_avg":"311.18","datetime":"1945-10-31"},{"year":"1945","month":"11","de_season_avg":"311.06","datetime":"1945-11-30"},{"year":"1945","month":"12","de_season_avg":"310.94","datetime":"1945-12-31"},{"year":"1946","month":"1","de_season_avg":"311.05","datetime":"1946-01-31"},{"year":"1946","month":"2","de_season_avg":"311.16","datetime":"1946-02-28"},{"year":"1946","month":"3","de_season_avg":"311.27","datetime":"1946-03-31"},{"year":"1946","month":"4","de_season_avg":"311.38","datetime":"1946-04-30"},{"year":"1946","month":"5","de_season_avg":"311.49","datetime":"1946-05-31"},{"year":"1946","month":"6","de_season_avg":"311.6","datetime":"1946-06-30"},{"year":"1946","month":"7","de_season_avg":"311.71","datetime":"1946-07-31"},{"year":"1946","month":"8","de_season_avg":"311.82","datetime":"1946-08-31"},{"year":"1946","month":"9","de_season_avg":"311.93","datetime":"1946-09-30"},{"year":"1946","month":"10","de_season_avg":"312.04","datetime":"1946-10-31"},{"year":"1946","month":"11","de_season_avg":"312.15","datetime":"1946-11-30"},{"year":"1946","month":"12","de_season_avg":"312.26","datetime":"1946-12-31"},{"year":"1947","month":"1","de_season_avg":"312.21","datetime":"1947-01-31"},{"year":"1947","month":"2","de_season_avg":"312.16","datetime":"1947-02-28"},{"year":"1947","month":"3","de_season_avg":"312.1","datetime":"1947-03-31"},{"year":"1947","month":"4","de_season_avg":"312.05","datetime":"1947-04-30"},{"year":"1947","month":"5","de_season_avg":"311.99","datetime":"1947-05-31"},{"year":"1947","month":"6","de_season_avg":"311.94","datetime":"1947-06-30"},{"year":"1947","month":"7","de_season_avg":"311.88","datetime":"1947-07-31"},{"year":"1947","month":"8","de_season_avg":"311.83","datetime":"1947-08-31"},{"year":"1947","month":"9","de_season_avg":"311.78","datetime":"1947-09-30"},{"year":"1947","month":"10","de_season_avg":"311.72","datetime":"1947-10-31"},{"year":"1947","month":"11","de_season_avg":"311.67","datetime":"1947-11-30"},{"year":"1947","month":"12","de_season_avg":"311.61","datetime":"1947-12-31"},{"year":"1948","month":"1","de_season_avg":"311.61","datetime":"1948-01-31"},{"year":"1948","month":"2","de_season_avg":"311.61","datetime":"1948-02-29"},{"year":"1948","month":"3","de_season_avg":"311.6","datetime":"1948-03-31"},{"year":"1948","month":"4","de_season_avg":"311.6","datetime":"1948-04-30"},{"year":"1948","month":"5","de_season_avg":"311.6","datetime":"1948-05-31"},{"year":"1948","month":"6","de_season_avg":"311.59","datetime":"1948-06-30"},{"year":"1948","month":"7","de_season_avg":"311.59","datetime":"1948-07-31"},{"year":"1948","month":"8","de_season_avg":"311.59","datetime":"1948-08-31"},{"year":"1948","month":"9","de_season_avg":"311.58","datetime":"1948-09-30"},{"year":"1948","month":"10","de_season_avg":"311.58","datetime":"1948-10-31"},{"year":"1948","month":"11","de_season_avg":"311.57","datetime":"1948-11-30"},{"year":"1948","month":"12","de_season_avg":"311.57","datetime":"1948-12-31"},{"year":"1949","month":"1","de_season_avg":"311.41","datetime":"1949-01-31"},{"year":"1949","month":"2","de_season_avg":"311.26","datetime":"1949-02-28"},{"year":"1949","month":"3","de_season_avg":"311.1","datetime":"1949-03-31"},{"year":"1949","month":"4","de_season_avg":"310.95","datetime":"1949-04-30"},{"year":"1949","month":"5","de_season_avg":"310.79","datetime":"1949-05-31"},{"year":"1949","month":"6","de_season_avg":"310.63","datetime":"1949-06-30"},{"year":"1949","month":"7","de_season_avg":"310.48","datetime":"1949-07-31"},{"year":"1949","month":"8","de_season_avg":"310.32","datetime":"1949-08-31"},{"year":"1949","month":"9","de_season_avg":"310.16","datetime":"1949-09-30"},{"year":"1949","month":"10","de_season_avg":"310.01","datetime":"1949-10-31"},{"year":"1949","month":"11","de_season_avg":"309.85","datetime":"1949-11-30"},{"year":"1949","month":"12","de_season_avg":"309.69","datetime":"1949-12-31"},{"year":"1950","month":"1","de_season_avg":"309.96","datetime":"1950-01-31"},{"year":"1950","month":"2","de_season_avg":"310.22","datetime":"1950-02-28"},{"year":"1950","month":"3","de_season_avg":"310.48","datetime":"1950-03-31"},{"year":"1950","month":"4","de_season_avg":"310.74","datetime":"1950-04-30"},{"year":"1950","month":"5","de_season_avg":"311.0","datetime":"1950-05-31"},{"year":"1950","month":"6","de_season_avg":"311.26","datetime":"1950-06-30"},{"year":"1950","month":"7","de_season_avg":"311.52","datetime":"1950-07-31"},{"year":"1950","month":"8","de_season_avg":"311.79","datetime":"1950-08-31"},{"year":"1950","month":"9","de_season_avg":"312.05","datetime":"1950-09-30"},{"year":"1950","month":"10","de_season_avg":"312.31","datetime":"1950-10-31"},{"year":"1950","month":"11","de_season_avg":"312.57","datetime":"1950-11-30"},{"year":"1950","month":"12","de_season_avg":"312.83","datetime":"1950-12-31"},{"year":"1951","month":"1","de_season_avg":"312.8","datetime":"1951-01-31"},{"year":"1951","month":"2","de_season_avg":"312.78","datetime":"1951-02-28"},{"year":"1951","month":"3","de_season_avg":"312.75","datetime":"1951-03-31"},{"year":"1951","month":"4","de_season_avg":"312.72","datetime":"1951-04-30"},{"year":"1951","month":"5","de_season_avg":"312.7","datetime":"1951-05-31"},{"year":"1951","month":"6","de_season_avg":"312.67","datetime":"1951-06-30"},{"year":"1951","month":"7","de_season_avg":"312.64","datetime":"1951-07-31"},{"year":"1951","month":"8","de_season_avg":"312.62","datetime":"1951-08-31"},{"year":"1951","month":"9","de_season_avg":"312.59","datetime":"1951-09-30"},{"year":"1951","month":"10","de_season_avg":"312.56","datetime":"1951-10-31"},{"year":"1951","month":"11","de_season_avg":"312.53","datetime":"1951-11-30"},{"year":"1951","month":"12","de_season_avg":"312.51","datetime":"1951-12-31"},{"year":"1952","month":"1","de_season_avg":"312.48","datetime":"1952-01-31"},{"year":"1952","month":"2","de_season_avg":"312.45","datetime":"1952-02-29"},{"year":"1952","month":"3","de_season_avg":"312.43","datetime":"1952-03-31"},{"year":"1952","month":"4","de_season_avg":"312.4","datetime":"1952-04-30"},{"year":"1952","month":"5","de_season_avg":"312.37","datetime":"1952-05-31"},{"year":"1952","month":"6","de_season_avg":"312.35","datetime":"1952-06-30"},{"year":"1952","month":"7","de_season_avg":"312.32","datetime":"1952-07-31"},{"year":"1952","month":"8","de_season_avg":"312.29","datetime":"1952-08-31"},{"year":"1952","month":"9","de_season_avg":"312.27","datetime":"1952-09-30"},{"year":"1952","month":"10","de_season_avg":"312.24","datetime":"1952-10-31"},{"year":"1952","month":"11","de_season_avg":"312.21","datetime":"1952-11-30"},{"year":"1952","month":"12","de_season_avg":"312.18","datetime":"1952-12-31"},{"year":"1953","month":"1","de_season_avg":"312.21","datetime":"1953-01-31"},{"year":"1953","month":"2","de_season_avg":"312.23","datetime":"1953-02-28"},{"year":"1953","month":"3","de_season_avg":"312.25","datetime":"1953-03-31"},{"year":"1953","month":"4","de_season_avg":"312.28","datetime":"1953-04-30"},{"year":"1953","month":"5","de_season_avg":"312.3","datetime":"1953-05-31"},{"year":"1953","month":"6","de_season_avg":"312.32","datetime":"1953-06-30"},{"year":"1953","month":"7","de_season_avg":"312.34","datetime":"1953-07-31"},{"year":"1953","month":"8","de_season_avg":"312.37","datetime":"1953-08-31"},{"year":"1953","month":"9","de_season_avg":"312.39","datetime":"1953-09-30"},{"year":"1953","month":"10","de_season_avg":"312.41","datetime":"1953-10-31"},{"year":"1953","month":"11","de_season_avg":"312.44","datetime":"1953-11-30"},{"year":"1953","month":"12","de_season_avg":"312.46","datetime":"1953-12-31"},{"year":"1954","month":"1","de_season_avg":"312.48","datetime":"1954-01-31"},{"year":"1954","month":"2","de_season_avg":"312.5","datetime":"1954-02-28"},{"year":"1954","month":"3","de_season_avg":"312.53","datetime":"1954-03-31"},{"year":"1954","month":"4","de_season_avg":"312.55","datetime":"1954-04-30"},{"year":"1954","month":"5","de_season_avg":"312.57","datetime":"1954-05-31"},{"year":"1954","month":"6","de_season_avg":"312.59","datetime":"1954-06-30"},{"year":"1954","month":"7","de_season_avg":"312.62","datetime":"1954-07-31"},{"year":"1954","month":"8","de_season_avg":"312.64","datetime":"1954-08-31"},{"year":"1954","month":"9","de_season_avg":"312.66","datetime":"1954-09-30"},{"year":"1954","month":"10","de_season_avg":"312.69","datetime":"1954-10-31"},{"year":"1954","month":"11","de_season_avg":"312.71","datetime":"1954-11-30"},{"year":"1954","month":"12","de_season_avg":"312.73","datetime":"1954-12-31"},{"year":"1955","month":"1","de_season_avg":"312.9","datetime":"1955-01-31"},{"year":"1955","month":"2","de_season_avg":"313.06","datetime":"1955-02-28"},{"year":"1955","month":"3","de_season_avg":"313.23","datetime":"1955-03-31"},{"year":"1955","month":"4","de_season_avg":"313.39","datetime":"1955-04-30"},{"year":"1955","month":"5","de_season_avg":"313.56","datetime":"1955-05-31"},{"year":"1955","month":"6","de_season_avg":"313.72","datetime":"1955-06-30"},{"year":"1955","month":"7","de_season_avg":"313.89","datetime":"1955-07-31"},{"year":"1955","month":"8","de_season_avg":"314.05","datetime":"1955-08-31"},{"year":"1955","month":"9","de_season_avg":"314.22","datetime":"1955-09-30"},{"year":"1955","month":"10","de_season_avg":"314.38","datetime":"1955-10-31"},{"year":"1955","month":"11","de_season_avg":"314.55","datetime":"1955-11-30"},{"year":"1955","month":"12","de_season_avg":"314.71","datetime":"1955-12-31"},{"year":"1956","month":"1","de_season_avg":"314.77","datetime":"1956-01-31"},{"year":"1956","month":"2","de_season_avg":"314.82","datetime":"1956-02-29"},{"year":"1956","month":"3","de_season_avg":"314.87","datetime":"1956-03-31"},{"year":"1956","month":"4","de_season_avg":"314.92","datetime":"1956-04-30"},{"year":"1956","month":"5","de_season_avg":"314.98","datetime":"1956-05-31"},{"year":"1956","month":"6","de_season_avg":"315.03","datetime":"1956-06-30"},{"year":"1956","month":"7","de_season_avg":"315.08","datetime":"1956-07-31"},{"year":"1956","month":"8","de_season_avg":"315.13","datetime":"1956-08-31"},{"year":"1956","month":"9","de_season_avg":"315.19","datetime":"1956-09-30"},{"year":"1956","month":"10","de_season_avg":"315.24","datetime":"1956-10-31"},{"year":"1956","month":"11","de_season_avg":"315.29","datetime":"1956-11-30"},{"year":"1956","month":"12","de_season_avg":"315.34","datetime":"1956-12-31"},{"year":"1957","month":"1","de_season_avg":"315.34","datetime":"1957-01-31"},{"year":"1957","month":"2","de_season_avg":"315.34","datetime":"1957-02-28"},{"year":"1957","month":"3","de_season_avg":"315.34","datetime":"1957-03-31"},{"year":"1957","month":"4","de_season_avg":"315.34","datetime":"1957-04-30"},{"year":"1957","month":"5","de_season_avg":"315.34","datetime":"1957-05-31"},{"year":"1957","month":"6","de_season_avg":"315.34","datetime":"1957-06-30"},{"year":"1957","month":"7","de_season_avg":"315.34","datetime":"1957-07-31"},{"year":"1957","month":"8","de_season_avg":"315.34","datetime":"1957-08-31"},{"year":"1957","month":"9","de_season_avg":"315.34","datetime":"1957-09-30"},{"year":"1957","month":"10","de_season_avg":"315.34","datetime":"1957-10-31"},{"year":"1957","month":"11","de_season_avg":"315.34","datetime":"1957-11-30"},{"year":"1957","month":"12","de_season_avg":"315.34","datetime":"1957-12-31"},{"year":"1958","month":"1","de_season_avg":"314.43","datetime":"1958-01-31"},{"year":"1958","month":"2","de_season_avg":"314.43","datetime":"1958-02-28"},{"year":"1958","month":"3","de_season_avg":"314.43","datetime":"1958-03-31"},{"year":"1958","month":"4","de_season_avg":"315.16","datetime":"1958-04-30"},{"year":"1958","month":"5","de_season_avg":"314.71","datetime":"1958-05-31"},{"year":"1958","month":"6","de_season_avg":"315.14","datetime":"1958-06-30"},{"year":"1958","month":"7","de_season_avg":"315.18","datetime":"1958-07-31"},{"year":"1958","month":"8","de_season_avg":"316.18","datetime":"1958-08-31"},{"year":"1958","month":"9","de_season_avg":"316.08","datetime":"1958-09-30"},{"year":"1958","month":"10","de_season_avg":"315.41","datetime":"1958-10-31"},{"year":"1958","month":"11","de_season_avg":"315.2","datetime":"1958-11-30"},{"year":"1958","month":"12","de_season_avg":"315.43","datetime":"1958-12-31"},{"year":"1959","month":"1","de_season_avg":"315.55","datetime":"1959-01-31"},{"year":"1959","month":"2","de_season_avg":"315.86","datetime":"1959-02-28"},{"year":"1959","month":"3","de_season_avg":"315.38","datetime":"1959-03-31"},{"year":"1959","month":"4","de_season_avg":"315.41","datetime":"1959-04-30"},{"year":"1959","month":"5","de_season_avg":"315.49","datetime":"1959-05-31"},{"year":"1959","month":"6","de_season_avg":"316.03","datetime":"1959-06-30"},{"year":"1959","month":"7","de_season_avg":"315.86","datetime":"1959-07-31"},{"year":"1959","month":"8","de_season_avg":"316.06","datetime":"1959-08-31"},{"year":"1959","month":"9","de_season_avg":"316.73","datetime":"1959-09-30"},{"year":"1959","month":"10","de_season_avg":"316.33","datetime":"1959-10-31"},{"year":"1959","month":"11","de_season_avg":"316.68","datetime":"1959-11-30"},{"year":"1959","month":"12","de_season_avg":"316.35","datetime":"1959-12-31"},{"year":"1960","month":"1","de_season_avg":"316.4","datetime":"1960-01-31"},{"year":"1960","month":"2","de_season_avg":"316.36","datetime":"1960-02-29"},{"year":"1960","month":"3","de_season_avg":"316.28","datetime":"1960-03-31"},{"year":"1960","month":"4","de_season_avg":"316.7","datetime":"1960-04-30"},{"year":"1960","month":"5","de_season_avg":"317.22","datetime":"1960-05-31"},{"year":"1960","month":"6","de_season_avg":"317.47","datetime":"1960-06-30"},{"year":"1960","month":"7","de_season_avg":"317.52","datetime":"1960-07-31"},{"year":"1960","month":"8","de_season_avg":"317.19","datetime":"1960-08-31"},{"year":"1960","month":"9","de_season_avg":"317.08","datetime":"1960-09-30"},{"year":"1960","month":"10","de_season_avg":"316.83","datetime":"1960-10-31"},{"year":"1960","month":"11","de_season_avg":"316.88","datetime":"1960-11-30"},{"year":"1960","month":"12","de_season_avg":"316.96","datetime":"1960-12-31"},{"year":"1961","month":"1","de_season_avg":"316.86","datetime":"1961-01-31"},{"year":"1961","month":"2","de_season_avg":"317.08","datetime":"1961-02-28"},{"year":"1961","month":"3","de_season_avg":"317.26","datetime":"1961-03-31"},{"year":"1961","month":"4","de_season_avg":"317.16","datetime":"1961-04-30"},{"year":"1961","month":"5","de_season_avg":"317.76","datetime":"1961-05-31"},{"year":"1961","month":"6","de_season_avg":"317.63","datetime":"1961-06-30"},{"year":"1961","month":"7","de_season_avg":"317.88","datetime":"1961-07-31"},{"year":"1961","month":"8","de_season_avg":"318.06","datetime":"1961-08-31"},{"year":"1961","month":"9","de_season_avg":"317.9","datetime":"1961-09-30"},{"year":"1961","month":"10","de_season_avg":"318.32","datetime":"1961-10-31"},{"year":"1961","month":"11","de_season_avg":"317.99","datetime":"1961-11-30"},{"year":"1961","month":"12","de_season_avg":"317.79","datetime":"1961-12-31"},{"year":"1962","month":"1","de_season_avg":"317.91","datetime":"1962-01-31"},{"year":"1962","month":"2","de_season_avg":"317.92","datetime":"1962-02-28"},{"year":"1962","month":"3","de_season_avg":"318.39","datetime":"1962-03-31"},{"year":"1962","month":"4","de_season_avg":"318.24","datetime":"1962-04-30"},{"year":"1962","month":"5","de_season_avg":"318.18","datetime":"1962-05-31"},{"year":"1962","month":"6","de_season_avg":"318.47","datetime":"1962-06-30"},{"year":"1962","month":"7","de_season_avg":"318.92","datetime":"1962-07-31"},{"year":"1962","month":"8","de_season_avg":"318.68","datetime":"1962-08-31"},{"year":"1962","month":"9","de_season_avg":"319.17","datetime":"1962-09-30"},{"year":"1962","month":"10","de_season_avg":"318.45","datetime":"1962-10-31"},{"year":"1962","month":"11","de_season_avg":"318.58","datetime":"1962-11-30"},{"year":"1962","month":"12","de_season_avg":"318.47","datetime":"1962-12-31"},{"year":"1963","month":"1","de_season_avg":"318.7","datetime":"1963-01-31"},{"year":"1963","month":"2","de_season_avg":"318.44","datetime":"1963-02-28"},{"year":"1963","month":"3","de_season_avg":"318.57","datetime":"1963-03-31"},{"year":"1963","month":"4","de_season_avg":"319.05","datetime":"1963-04-30"},{"year":"1963","month":"5","de_season_avg":"319.4","datetime":"1963-05-31"},{"year":"1963","month":"6","de_season_avg":"319.32","datetime":"1963-06-30"},{"year":"1963","month":"7","de_season_avg":"319.05","datetime":"1963-07-31"},{"year":"1963","month":"8","de_season_avg":"319.05","datetime":"1963-08-31"},{"year":"1963","month":"9","de_season_avg":"319.14","datetime":"1963-09-30"},{"year":"1963","month":"10","de_season_avg":"319.02","datetime":"1963-10-31"},{"year":"1963","month":"11","de_season_avg":"318.97","datetime":"1963-11-30"},{"year":"1963","month":"12","de_season_avg":"319.13","datetime":"1963-12-31"},{"year":"1964","month":"1","de_season_avg":"319.54","datetime":"1964-01-31"},{"year":"1964","month":"2","de_season_avg":"319.37","datetime":"1964-02-29"},{"year":"1964","month":"3","de_season_avg":"319.41","datetime":"1964-03-31"},{"year":"1964","month":"4","de_season_avg":"319.45","datetime":"1964-04-30"},{"year":"1964","month":"5","de_season_avg":"319.4","datetime":"1964-05-31"},{"year":"1964","month":"6","de_season_avg":"319.75","datetime":"1964-06-30"},{"year":"1964","month":"7","de_season_avg":"319.77","datetime":"1964-07-31"},{"year":"1964","month":"8","de_season_avg":"320.0","datetime":"1964-08-31"},{"year":"1964","month":"9","de_season_avg":"319.66","datetime":"1964-09-30"},{"year":"1964","month":"10","de_season_avg":"319.91","datetime":"1964-10-31"},{"year":"1964","month":"11","de_season_avg":"319.58","datetime":"1964-11-30"},{"year":"1964","month":"12","de_season_avg":"319.49","datetime":"1964-12-31"},{"year":"1965","month":"1","de_season_avg":"319.4","datetime":"1965-01-31"},{"year":"1965","month":"2","de_season_avg":"319.81","datetime":"1965-02-28"},{"year":"1965","month":"3","de_season_avg":"319.59","datetime":"1965-03-31"},{"year":"1965","month":"4","de_season_avg":"319.78","datetime":"1965-04-30"},{"year":"1965","month":"5","de_season_avg":"319.3","datetime":"1965-05-31"},{"year":"1965","month":"6","de_season_avg":"319.7","datetime":"1965-06-30"},{"year":"1965","month":"7","de_season_avg":"320.51","datetime":"1965-07-31"},{"year":"1965","month":"8","de_season_avg":"320.15","datetime":"1965-08-31"},{"year":"1965","month":"9","de_season_avg":"320.77","datetime":"1965-09-30"},{"year":"1965","month":"10","de_season_avg":"320.36","datetime":"1965-10-31"},{"year":"1965","month":"11","de_season_avg":"320.78","datetime":"1965-11-30"},{"year":"1965","month":"12","de_season_avg":"320.2","datetime":"1965-12-31"},{"year":"1966","month":"1","de_season_avg":"320.59","datetime":"1966-01-31"},{"year":"1966","month":"2","de_season_avg":"320.96","datetime":"1966-02-28"},{"year":"1966","month":"3","de_season_avg":"321.08","datetime":"1966-03-31"},{"year":"1966","month":"4","de_season_avg":"321.34","datetime":"1966-04-30"},{"year":"1966","month":"5","de_season_avg":"321.2","datetime":"1966-05-31"},{"year":"1966","month":"6","de_season_avg":"321.57","datetime":"1966-06-30"},{"year":"1966","month":"7","de_season_avg":"321.68","datetime":"1966-07-31"},{"year":"1966","month":"8","de_season_avg":"321.65","datetime":"1966-08-31"},{"year":"1966","month":"9","de_season_avg":"321.6","datetime":"1966-09-30"},{"year":"1966","month":"10","de_season_avg":"321.17","datetime":"1966-10-31"},{"year":"1966","month":"11","de_season_avg":"321.7","datetime":"1966-11-30"},{"year":"1966","month":"12","de_season_avg":"321.81","datetime":"1966-12-31"},{"year":"1967","month":"1","de_season_avg":"322.29","datetime":"1967-01-31"},{"year":"1967","month":"2","de_season_avg":"321.86","datetime":"1967-02-28"},{"year":"1967","month":"3","de_season_avg":"321.73","datetime":"1967-03-31"},{"year":"1967","month":"4","de_season_avg":"322.04","datetime":"1967-04-30"},{"year":"1967","month":"5","de_season_avg":"322.12","datetime":"1967-05-31"},{"year":"1967","month":"6","de_season_avg":"321.91","datetime":"1967-06-30"},{"year":"1967","month":"7","de_season_avg":"321.84","datetime":"1967-07-31"},{"year":"1967","month":"8","de_season_avg":"322.21","datetime":"1967-08-31"},{"year":"1967","month":"9","de_season_avg":"322.23","datetime":"1967-09-30"},{"year":"1967","month":"10","de_season_avg":"322.47","datetime":"1967-10-31"},{"year":"1967","month":"11","de_season_avg":"322.65","datetime":"1967-11-30"},{"year":"1967","month":"12","de_season_avg":"322.75","datetime":"1967-12-31"},{"year":"1968","month":"1","de_season_avg":"322.54","datetime":"1968-01-31"},{"year":"1968","month":"2","de_season_avg":"322.51","datetime":"1968-02-29"},{"year":"1968","month":"3","de_season_avg":"322.55","datetime":"1968-03-31"},{"year":"1968","month":"4","de_season_avg":"322.62","datetime":"1968-04-30"},{"year":"1968","month":"5","de_season_avg":"322.68","datetime":"1968-05-31"},{"year":"1968","month":"6","de_season_avg":"323.19","datetime":"1968-06-30"},{"year":"1968","month":"7","de_season_avg":"323.46","datetime":"1968-07-31"},{"year":"1968","month":"8","de_season_avg":"323.43","datetime":"1968-08-31"},{"year":"1968","month":"9","de_season_avg":"323.32","datetime":"1968-09-30"},{"year":"1968","month":"10","de_season_avg":"323.33","datetime":"1968-10-31"},{"year":"1968","month":"11","de_season_avg":"323.25","datetime":"1968-11-30"},{"year":"1968","month":"12","de_season_avg":"323.69","datetime":"1968-12-31"},{"year":"1969","month":"1","de_season_avg":"323.97","datetime":"1969-01-31"},{"year":"1969","month":"2","de_season_avg":"323.77","datetime":"1969-02-28"},{"year":"1969","month":"3","de_season_avg":"324.31","datetime":"1969-03-31"},{"year":"1969","month":"4","de_season_avg":"324.27","datetime":"1969-04-30"},{"year":"1969","month":"5","de_season_avg":"324.48","datetime":"1969-05-31"},{"year":"1969","month":"6","de_season_avg":"324.51","datetime":"1969-06-30"},{"year":"1969","month":"7","de_season_avg":"325.17","datetime":"1969-07-31"},{"year":"1969","month":"8","de_season_avg":"324.97","datetime":"1969-08-31"},{"year":"1969","month":"9","de_season_avg":"325.37","datetime":"1969-09-30"},{"year":"1969","month":"10","de_season_avg":"324.88","datetime":"1969-10-31"},{"year":"1969","month":"11","de_season_avg":"324.79","datetime":"1969-11-30"},{"year":"1969","month":"12","de_season_avg":"324.91","datetime":"1969-12-31"},{"year":"1970","month":"1","de_season_avg":"325.03","datetime":"1970-01-31"},{"year":"1970","month":"2","de_season_avg":"325.34","datetime":"1970-02-28"},{"year":"1970","month":"3","de_season_avg":"325.61","datetime":"1970-03-31"},{"year":"1970","month":"4","de_season_avg":"325.74","datetime":"1970-04-30"},{"year":"1970","month":"5","de_season_avg":"325.16","datetime":"1970-05-31"},{"year":"1970","month":"6","de_season_avg":"325.46","datetime":"1970-06-30"},{"year":"1970","month":"7","de_season_avg":"325.63","datetime":"1970-07-31"},{"year":"1970","month":"8","de_season_avg":"325.99","datetime":"1970-08-31"},{"year":"1970","month":"9","de_season_avg":"326.1","datetime":"1970-09-30"},{"year":"1970","month":"10","de_season_avg":"326.18","datetime":"1970-10-31"},{"year":"1970","month":"11","de_season_avg":"325.95","datetime":"1970-11-30"},{"year":"1970","month":"12","de_season_avg":"325.93","datetime":"1970-12-31"},{"year":"1971","month":"1","de_season_avg":"326.14","datetime":"1971-01-31"},{"year":"1971","month":"2","de_season_avg":"326.03","datetime":"1971-02-28"},{"year":"1971","month":"3","de_season_avg":"325.85","datetime":"1971-03-31"},{"year":"1971","month":"4","de_season_avg":"325.38","datetime":"1971-04-30"},{"year":"1971","month":"5","de_season_avg":"326.0","datetime":"1971-05-31"},{"year":"1971","month":"6","de_season_avg":"326.36","datetime":"1971-06-30"},{"year":"1971","month":"7","de_season_avg":"326.65","datetime":"1971-07-31"},{"year":"1971","month":"8","de_season_avg":"326.74","datetime":"1971-08-31"},{"year":"1971","month":"9","de_season_avg":"326.37","datetime":"1971-09-30"},{"year":"1971","month":"10","de_season_avg":"326.69","datetime":"1971-10-31"},{"year":"1971","month":"11","de_season_avg":"326.75","datetime":"1971-11-30"},{"year":"1971","month":"12","de_season_avg":"326.82","datetime":"1971-12-31"},{"year":"1972","month":"1","de_season_avg":"326.73","datetime":"1972-01-31"},{"year":"1972","month":"2","de_season_avg":"326.98","datetime":"1972-02-29"},{"year":"1972","month":"3","de_season_avg":"326.39","datetime":"1972-03-31"},{"year":"1972","month":"4","de_season_avg":"327.29","datetime":"1972-04-30"},{"year":"1972","month":"5","de_season_avg":"327.14","datetime":"1972-05-31"},{"year":"1972","month":"6","de_season_avg":"326.88","datetime":"1972-06-30"},{"year":"1972","month":"7","de_season_avg":"327.36","datetime":"1972-07-31"},{"year":"1972","month":"8","de_season_avg":"327.67","datetime":"1972-08-31"},{"year":"1972","month":"9","de_season_avg":"327.87","datetime":"1972-09-30"},{"year":"1972","month":"10","de_season_avg":"328.33","datetime":"1972-10-31"},{"year":"1972","month":"11","de_season_avg":"328.45","datetime":"1972-11-30"},{"year":"1972","month":"12","de_season_avg":"328.36","datetime":"1972-12-31"},{"year":"1973","month":"1","de_season_avg":"328.51","datetime":"1973-01-31"},{"year":"1973","month":"2","de_season_avg":"328.91","datetime":"1973-02-28"},{"year":"1973","month":"3","de_season_avg":"328.96","datetime":"1973-03-31"},{"year":"1973","month":"4","de_season_avg":"329.08","datetime":"1973-04-30"},{"year":"1973","month":"5","de_season_avg":"329.54","datetime":"1973-05-31"},{"year":"1973","month":"6","de_season_avg":"329.84","datetime":"1973-06-30"},{"year":"1973","month":"7","de_season_avg":"330.15","datetime":"1973-07-31"},{"year":"1973","month":"8","de_season_avg":"330.63","datetime":"1973-08-31"},{"year":"1973","month":"9","de_season_avg":"330.55","datetime":"1973-09-30"},{"year":"1973","month":"10","de_season_avg":"330.32","datetime":"1973-10-31"},{"year":"1973","month":"11","de_season_avg":"330.13","datetime":"1973-11-30"},{"year":"1973","month":"12","de_season_avg":"329.45","datetime":"1973-12-31"},{"year":"1974","month":"1","de_season_avg":"329.32","datetime":"1974-01-31"},{"year":"1974","month":"2","de_season_avg":"330.05","datetime":"1974-02-28"},{"year":"1974","month":"3","de_season_avg":"330.14","datetime":"1974-03-31"},{"year":"1974","month":"4","de_season_avg":"330.22","datetime":"1974-04-30"},{"year":"1974","month":"5","de_season_avg":"330.22","datetime":"1974-05-31"},{"year":"1974","month":"6","de_season_avg":"329.79","datetime":"1974-06-30"},{"year":"1974","month":"7","de_season_avg":"330.21","datetime":"1974-07-31"},{"year":"1974","month":"8","de_season_avg":"330.54","datetime":"1974-08-31"},{"year":"1974","month":"9","de_season_avg":"330.44","datetime":"1974-09-30"},{"year":"1974","month":"10","de_season_avg":"330.53","datetime":"1974-10-31"},{"year":"1974","month":"11","de_season_avg":"330.5","datetime":"1974-11-30"},{"year":"1974","month":"12","de_season_avg":"330.54","datetime":"1974-12-31"},{"year":"1975","month":"1","de_season_avg":"330.84","datetime":"1975-01-31"},{"year":"1975","month":"2","de_season_avg":"330.85","datetime":"1975-02-28"},{"year":"1975","month":"3","de_season_avg":"330.37","datetime":"1975-03-31"},{"year":"1975","month":"4","de_season_avg":"330.53","datetime":"1975-04-30"},{"year":"1975","month":"5","de_season_avg":"330.98","datetime":"1975-05-31"},{"year":"1975","month":"6","de_season_avg":"331.01","datetime":"1975-06-30"},{"year":"1975","month":"7","de_season_avg":"331.12","datetime":"1975-07-31"},{"year":"1975","month":"8","de_season_avg":"331.34","datetime":"1975-08-31"},{"year":"1975","month":"9","de_season_avg":"331.6","datetime":"1975-09-30"},{"year":"1975","month":"10","de_season_avg":"331.62","datetime":"1975-10-31"},{"year":"1975","month":"11","de_season_avg":"331.57","datetime":"1975-11-30"},{"year":"1975","month":"12","de_season_avg":"331.75","datetime":"1975-12-31"},{"year":"1976","month":"1","de_season_avg":"331.67","datetime":"1976-01-31"},{"year":"1976","month":"2","de_season_avg":"332.14","datetime":"1976-02-29"},{"year":"1976","month":"3","de_season_avg":"331.78","datetime":"1976-03-31"},{"year":"1976","month":"4","de_season_avg":"332.16","datetime":"1976-04-30"},{"year":"1976","month":"5","de_season_avg":"331.75","datetime":"1976-05-31"},{"year":"1976","month":"6","de_season_avg":"331.56","datetime":"1976-06-30"},{"year":"1976","month":"7","de_season_avg":"332.23","datetime":"1976-07-31"},{"year":"1976","month":"8","de_season_avg":"332.07","datetime":"1976-08-31"},{"year":"1976","month":"9","de_season_avg":"332.07","datetime":"1976-09-30"},{"year":"1976","month":"10","de_season_avg":"331.98","datetime":"1976-10-31"},{"year":"1976","month":"11","de_season_avg":"332.35","datetime":"1976-11-30"},{"year":"1976","month":"12","de_season_avg":"332.59","datetime":"1976-12-31"},{"year":"1977","month":"1","de_season_avg":"332.77","datetime":"1977-01-31"},{"year":"1977","month":"2","de_season_avg":"332.58","datetime":"1977-02-28"},{"year":"1977","month":"3","de_season_avg":"333.4","datetime":"1977-03-31"},{"year":"1977","month":"4","de_season_avg":"333.54","datetime":"1977-04-30"},{"year":"1977","month":"5","de_season_avg":"333.99","datetime":"1977-05-31"},{"year":"1977","month":"6","de_season_avg":"333.79","datetime":"1977-06-30"},{"year":"1977","month":"7","de_season_avg":"334.01","datetime":"1977-07-31"},{"year":"1977","month":"8","de_season_avg":"333.91","datetime":"1977-08-31"},{"year":"1977","month":"9","de_season_avg":"334.36","datetime":"1977-09-30"},{"year":"1977","month":"10","de_season_avg":"334.51","datetime":"1977-10-31"},{"year":"1977","month":"11","de_season_avg":"334.68","datetime":"1977-11-30"},{"year":"1977","month":"12","de_season_avg":"334.58","datetime":"1977-12-31"},{"year":"1978","month":"1","de_season_avg":"335.01","datetime":"1978-01-31"},{"year":"1978","month":"2","de_season_avg":"334.6","datetime":"1978-02-28"},{"year":"1978","month":"3","de_season_avg":"335.0","datetime":"1978-03-31"},{"year":"1978","month":"4","de_season_avg":"335.07","datetime":"1978-04-30"},{"year":"1978","month":"5","de_season_avg":"335.08","datetime":"1978-05-31"},{"year":"1978","month":"6","de_season_avg":"335.59","datetime":"1978-06-30"},{"year":"1978","month":"7","de_season_avg":"335.65","datetime":"1978-07-31"},{"year":"1978","month":"8","de_season_avg":"335.87","datetime":"1978-08-31"},{"year":"1978","month":"9","de_season_avg":"335.51","datetime":"1978-09-30"},{"year":"1978","month":"10","de_season_avg":"335.72","datetime":"1978-10-31"},{"year":"1978","month":"11","de_season_avg":"335.99","datetime":"1978-11-30"},{"year":"1978","month":"12","de_season_avg":"335.87","datetime":"1978-12-31"},{"year":"1979","month":"1","de_season_avg":"336.22","datetime":"1979-01-31"},{"year":"1979","month":"2","de_season_avg":"336.0","datetime":"1979-02-28"},{"year":"1979","month":"3","de_season_avg":"336.56","datetime":"1979-03-31"},{"year":"1979","month":"4","de_season_avg":"336.11","datetime":"1979-04-30"},{"year":"1979","month":"5","de_season_avg":"336.24","datetime":"1979-05-31"},{"year":"1979","month":"6","de_season_avg":"336.83","datetime":"1979-06-30"},{"year":"1979","month":"7","de_season_avg":"336.69","datetime":"1979-07-31"},{"year":"1979","month":"8","de_season_avg":"337.2","datetime":"1979-08-31"},{"year":"1979","month":"9","de_season_avg":"337.19","datetime":"1979-09-30"},{"year":"1979","month":"10","de_season_avg":"337.57","datetime":"1979-10-31"},{"year":"1979","month":"11","de_season_avg":"337.59","datetime":"1979-11-30"},{"year":"1979","month":"12","de_season_avg":"337.83","datetime":"1979-12-31"},{"year":"1980","month":"1","de_season_avg":"338.13","datetime":"1980-01-31"},{"year":"1980","month":"2","de_season_avg":"337.85","datetime":"1980-02-29"},{"year":"1980","month":"3","de_season_avg":"338.51","datetime":"1980-03-31"},{"year":"1980","month":"4","de_season_avg":"338.31","datetime":"1980-04-30"},{"year":"1980","month":"5","de_season_avg":"338.4","datetime":"1980-05-31"},{"year":"1980","month":"6","de_season_avg":"338.85","datetime":"1980-06-30"},{"year":"1980","month":"7","de_season_avg":"338.56","datetime":"1980-07-31"},{"year":"1980","month":"8","de_season_avg":"339.07","datetime":"1980-08-31"},{"year":"1980","month":"9","de_season_avg":"339.38","datetime":"1980-09-30"},{"year":"1980","month":"10","de_season_avg":"339.4","datetime":"1980-10-31"},{"year":"1980","month":"11","de_season_avg":"339.46","datetime":"1980-11-30"},{"year":"1980","month":"12","de_season_avg":"339.26","datetime":"1980-12-31"},{"year":"1981","month":"1","de_season_avg":"339.42","datetime":"1981-01-31"},{"year":"1981","month":"2","de_season_avg":"339.98","datetime":"1981-02-28"},{"year":"1981","month":"3","de_season_avg":"340.08","datetime":"1981-03-31"},{"year":"1981","month":"4","de_season_avg":"339.98","datetime":"1981-04-30"},{"year":"1981","month":"5","de_season_avg":"339.97","datetime":"1981-05-31"},{"year":"1981","month":"6","de_season_avg":"340.06","datetime":"1981-06-30"},{"year":"1981","month":"7","de_season_avg":"339.92","datetime":"1981-07-31"},{"year":"1981","month":"8","de_season_avg":"339.87","datetime":"1981-08-31"},{"year":"1981","month":"9","de_season_avg":"340.17","datetime":"1981-09-30"},{"year":"1981","month":"10","de_season_avg":"340.39","datetime":"1981-10-31"},{"year":"1981","month":"11","de_season_avg":"340.75","datetime":"1981-11-30"},{"year":"1981","month":"12","de_season_avg":"340.85","datetime":"1981-12-31"},{"year":"1982","month":"1","de_season_avg":"341.09","datetime":"1982-01-31"},{"year":"1982","month":"2","de_season_avg":"341.16","datetime":"1982-02-28"},{"year":"1982","month":"3","de_season_avg":"341.17","datetime":"1982-03-31"},{"year":"1982","month":"4","de_season_avg":"341.32","datetime":"1982-04-30"},{"year":"1982","month":"5","de_season_avg":"341.67","datetime":"1982-05-31"},{"year":"1982","month":"6","de_season_avg":"341.43","datetime":"1982-06-30"},{"year":"1982","month":"7","de_season_avg":"341.61","datetime":"1982-07-31"},{"year":"1982","month":"8","de_season_avg":"341.64","datetime":"1982-08-31"},{"year":"1982","month":"9","de_season_avg":"341.56","datetime":"1982-09-30"},{"year":"1982","month":"10","de_season_avg":"341.77","datetime":"1982-10-31"},{"year":"1982","month":"11","de_season_avg":"341.59","datetime":"1982-11-30"},{"year":"1982","month":"12","de_season_avg":"341.71","datetime":"1982-12-31"},{"year":"1983","month":"1","de_season_avg":"341.75","datetime":"1983-01-31"},{"year":"1983","month":"2","de_season_avg":"342.25","datetime":"1983-02-28"},{"year":"1983","month":"3","de_season_avg":"341.85","datetime":"1983-03-31"},{"year":"1983","month":"4","de_season_avg":"342.76","datetime":"1983-04-30"},{"year":"1983","month":"5","de_season_avg":"342.97","datetime":"1983-05-31"},{"year":"1983","month":"6","de_season_avg":"343.3","datetime":"1983-06-30"},{"year":"1983","month":"7","de_season_avg":"343.56","datetime":"1983-07-31"},{"year":"1983","month":"8","de_season_avg":"343.89","datetime":"1983-08-31"},{"year":"1983","month":"9","de_season_avg":"343.59","datetime":"1983-09-30"},{"year":"1983","month":"10","de_season_avg":"343.86","datetime":"1983-10-31"},{"year":"1983","month":"11","de_season_avg":"343.92","datetime":"1983-11-30"},{"year":"1983","month":"12","de_season_avg":"344.12","datetime":"1983-12-31"},{"year":"1984","month":"1","de_season_avg":"344.32","datetime":"1984-01-31"},{"year":"1984","month":"2","de_season_avg":"344.39","datetime":"1984-02-29"},{"year":"1984","month":"3","de_season_avg":"344.26","datetime":"1984-03-31"},{"year":"1984","month":"4","de_season_avg":"344.75","datetime":"1984-04-30"},{"year":"1984","month":"5","de_season_avg":"344.59","datetime":"1984-05-31"},{"year":"1984","month":"6","de_season_avg":"344.73","datetime":"1984-06-30"},{"year":"1984","month":"7","de_season_avg":"345.02","datetime":"1984-07-31"},{"year":"1984","month":"8","de_season_avg":"345.12","datetime":"1984-08-31"},{"year":"1984","month":"9","de_season_avg":"344.76","datetime":"1984-09-30"},{"year":"1984","month":"10","de_season_avg":"345.19","datetime":"1984-10-31"},{"year":"1984","month":"11","de_season_avg":"345.41","datetime":"1984-11-30"},{"year":"1984","month":"12","de_season_avg":"345.88","datetime":"1984-12-31"},{"year":"1985","month":"1","de_season_avg":"345.59","datetime":"1985-01-31"},{"year":"1985","month":"2","de_season_avg":"345.92","datetime":"1985-02-28"},{"year":"1985","month":"3","de_season_avg":"346.56","datetime":"1985-03-31"},{"year":"1985","month":"4","de_season_avg":"346.08","datetime":"1985-04-30"},{"year":"1985","month":"5","de_season_avg":"346.12","datetime":"1985-05-31"},{"year":"1985","month":"6","de_season_avg":"346.23","datetime":"1985-06-30"},{"year":"1985","month":"7","de_season_avg":"346.08","datetime":"1985-07-31"},{"year":"1985","month":"8","de_season_avg":"346.57","datetime":"1985-08-31"},{"year":"1985","month":"9","de_season_avg":"346.59","datetime":"1985-09-30"},{"year":"1985","month":"10","de_season_avg":"346.6","datetime":"1985-10-31"},{"year":"1985","month":"11","de_season_avg":"346.82","datetime":"1985-11-30"},{"year":"1985","month":"12","de_season_avg":"347.04","datetime":"1985-12-31"},{"year":"1986","month":"1","de_season_avg":"346.82","datetime":"1986-01-31"},{"year":"1986","month":"2","de_season_avg":"346.98","datetime":"1986-02-28"},{"year":"1986","month":"3","de_season_avg":"346.93","datetime":"1986-03-31"},{"year":"1986","month":"4","de_season_avg":"347.29","datetime":"1986-04-30"},{"year":"1986","month":"5","de_season_avg":"347.41","datetime":"1986-05-31"},{"year":"1986","month":"6","de_season_avg":"347.61","datetime":"1986-06-30"},{"year":"1986","month":"7","de_season_avg":"347.43","datetime":"1986-07-31"},{"year":"1986","month":"8","de_season_avg":"347.51","datetime":"1986-08-31"},{"year":"1986","month":"9","de_season_avg":"348.62","datetime":"1986-09-30"},{"year":"1986","month":"10","de_season_avg":"348.04","datetime":"1986-10-31"},{"year":"1986","month":"11","de_season_avg":"348.28","datetime":"1986-11-30"},{"year":"1986","month":"12","de_season_avg":"348.36","datetime":"1986-12-31"},{"year":"1987","month":"1","de_season_avg":"348.66","datetime":"1987-01-31"},{"year":"1987","month":"2","de_season_avg":"348.24","datetime":"1987-02-28"},{"year":"1987","month":"3","de_season_avg":"348.39","datetime":"1987-03-31"},{"year":"1987","month":"4","de_season_avg":"348.84","datetime":"1987-04-30"},{"year":"1987","month":"5","de_season_avg":"349.09","datetime":"1987-05-31"},{"year":"1987","month":"6","de_season_avg":"349.29","datetime":"1987-06-30"},{"year":"1987","month":"7","de_season_avg":"349.51","datetime":"1987-07-31"},{"year":"1987","month":"8","de_season_avg":"349.65","datetime":"1987-08-31"},{"year":"1987","month":"9","de_season_avg":"349.85","datetime":"1987-09-30"},{"year":"1987","month":"10","de_season_avg":"349.96","datetime":"1987-10-31"},{"year":"1987","month":"11","de_season_avg":"350.15","datetime":"1987-11-30"},{"year":"1987","month":"12","de_season_avg":"350.14","datetime":"1987-12-31"},{"year":"1988","month":"1","de_season_avg":"350.49","datetime":"1988-01-31"},{"year":"1988","month":"2","de_season_avg":"350.99","datetime":"1988-02-29"},{"year":"1988","month":"3","de_season_avg":"350.99","datetime":"1988-03-31"},{"year":"1988","month":"4","de_season_avg":"351.03","datetime":"1988-04-30"},{"year":"1988","month":"5","de_season_avg":"351.22","datetime":"1988-05-31"},{"year":"1988","month":"6","de_season_avg":"351.55","datetime":"1988-06-30"},{"year":"1988","month":"7","de_season_avg":"352.15","datetime":"1988-07-31"},{"year":"1988","month":"8","de_season_avg":"352.01","datetime":"1988-08-31"},{"year":"1988","month":"9","de_season_avg":"352.18","datetime":"1988-09-30"},{"year":"1988","month":"10","de_season_avg":"352.62","datetime":"1988-10-31"},{"year":"1988","month":"11","de_season_avg":"352.53","datetime":"1988-11-30"},{"year":"1988","month":"12","de_season_avg":"352.52","datetime":"1988-12-31"},{"year":"1989","month":"1","de_season_avg":"352.99","datetime":"1989-01-31"},{"year":"1989","month":"2","de_season_avg":"352.69","datetime":"1989-02-28"},{"year":"1989","month":"3","de_season_avg":"352.6","datetime":"1989-03-31"},{"year":"1989","month":"4","de_season_avg":"353.07","datetime":"1989-04-30"},{"year":"1989","month":"5","de_season_avg":"352.78","datetime":"1989-05-31"},{"year":"1989","month":"6","de_season_avg":"353.06","datetime":"1989-06-30"},{"year":"1989","month":"7","de_season_avg":"353.38","datetime":"1989-07-31"},{"year":"1989","month":"8","de_season_avg":"353.43","datetime":"1989-08-31"},{"year":"1989","month":"9","de_season_avg":"353.37","datetime":"1989-09-30"},{"year":"1989","month":"10","de_season_avg":"353.57","datetime":"1989-10-31"},{"year":"1989","month":"11","de_season_avg":"353.68","datetime":"1989-11-30"},{"year":"1989","month":"12","de_season_avg":"353.84","datetime":"1989-12-31"},{"year":"1990","month":"1","de_season_avg":"353.78","datetime":"1990-01-31"},{"year":"1990","month":"2","de_season_avg":"354.37","datetime":"1990-02-28"},{"year":"1990","month":"3","de_season_avg":"354.27","datetime":"1990-03-31"},{"year":"1990","month":"4","de_season_avg":"353.76","datetime":"1990-04-30"},{"year":"1990","month":"5","de_season_avg":"354.23","datetime":"1990-05-31"},{"year":"1990","month":"6","de_season_avg":"354.02","datetime":"1990-06-30"},{"year":"1990","month":"7","de_season_avg":"354.24","datetime":"1990-07-31"},{"year":"1990","month":"8","de_season_avg":"354.68","datetime":"1990-08-31"},{"year":"1990","month":"9","de_season_avg":"354.69","datetime":"1990-09-30"},{"year":"1990","month":"10","de_season_avg":"354.94","datetime":"1990-10-31"},{"year":"1990","month":"11","de_season_avg":"355.18","datetime":"1990-11-30"},{"year":"1990","month":"12","de_season_avg":"355.26","datetime":"1990-12-31"},{"year":"1991","month":"1","de_season_avg":"354.9","datetime":"1991-01-31"},{"year":"1991","month":"2","de_season_avg":"355.11","datetime":"1991-02-28"},{"year":"1991","month":"3","de_season_avg":"355.79","datetime":"1991-03-31"},{"year":"1991","month":"4","de_season_avg":"356.13","datetime":"1991-04-30"},{"year":"1991","month":"5","de_season_avg":"356.1","datetime":"1991-05-31"},{"year":"1991","month":"6","de_season_avg":"355.88","datetime":"1991-06-30"},{"year":"1991","month":"7","de_season_avg":"355.69","datetime":"1991-07-31"},{"year":"1991","month":"8","de_season_avg":"355.59","datetime":"1991-08-31"},{"year":"1991","month":"9","de_season_avg":"355.66","datetime":"1991-09-30"},{"year":"1991","month":"10","de_season_avg":"355.69","datetime":"1991-10-31"},{"year":"1991","month":"11","de_season_avg":"355.87","datetime":"1991-11-30"},{"year":"1991","month":"12","de_season_avg":"356.02","datetime":"1991-12-31"},{"year":"1992","month":"1","de_season_avg":"356.29","datetime":"1992-01-31"},{"year":"1992","month":"2","de_season_avg":"356.47","datetime":"1992-02-29"},{"year":"1992","month":"3","de_season_avg":"356.38","datetime":"1992-03-31"},{"year":"1992","month":"4","de_season_avg":"356.51","datetime":"1992-04-30"},{"year":"1992","month":"5","de_season_avg":"356.52","datetime":"1992-05-31"},{"year":"1992","month":"6","de_season_avg":"357.07","datetime":"1992-06-30"},{"year":"1992","month":"7","de_season_avg":"356.58","datetime":"1992-07-31"},{"year":"1992","month":"8","de_season_avg":"356.67","datetime":"1992-08-31"},{"year":"1992","month":"9","de_season_avg":"356.36","datetime":"1992-09-30"},{"year":"1992","month":"10","de_season_avg":"356.72","datetime":"1992-10-31"},{"year":"1992","month":"11","de_season_avg":"356.48","datetime":"1992-11-30"},{"year":"1992","month":"12","de_season_avg":"356.5","datetime":"1992-12-31"},{"year":"1993","month":"1","de_season_avg":"357.06","datetime":"1993-01-31"},{"year":"1993","month":"2","de_season_avg":"356.54","datetime":"1993-02-28"},{"year":"1993","month":"3","de_season_avg":"356.88","datetime":"1993-03-31"},{"year":"1993","month":"4","de_season_avg":"356.71","datetime":"1993-04-30"},{"year":"1993","month":"5","de_season_avg":"357.14","datetime":"1993-05-31"},{"year":"1993","month":"6","de_season_avg":"357.24","datetime":"1993-06-30"},{"year":"1993","month":"7","de_season_avg":"356.87","datetime":"1993-07-31"},{"year":"1993","month":"8","de_season_avg":"357.44","datetime":"1993-08-31"},{"year":"1993","month":"9","de_season_avg":"357.51","datetime":"1993-09-30"},{"year":"1993","month":"10","de_season_avg":"357.61","datetime":"1993-10-31"},{"year":"1993","month":"11","de_season_avg":"357.65","datetime":"1993-11-30"},{"year":"1993","month":"12","de_season_avg":"357.92","datetime":"1993-12-31"},{"year":"1994","month":"1","de_season_avg":"358.25","datetime":"1994-01-31"},{"year":"1994","month":"2","de_season_avg":"358.21","datetime":"1994-02-28"},{"year":"1994","month":"3","de_season_avg":"358.41","datetime":"1994-03-31"},{"year":"1994","month":"4","de_season_avg":"358.59","datetime":"1994-04-30"},{"year":"1994","month":"5","de_season_avg":"358.59","datetime":"1994-05-31"},{"year":"1994","month":"6","de_season_avg":"358.57","datetime":"1994-06-30"},{"year":"1994","month":"7","de_season_avg":"358.91","datetime":"1994-07-31"},{"year":"1994","month":"8","de_season_avg":"359.29","datetime":"1994-08-31"},{"year":"1994","month":"9","de_season_avg":"359.31","datetime":"1994-09-30"},{"year":"1994","month":"10","de_season_avg":"359.63","datetime":"1994-10-31"},{"year":"1994","month":"11","de_season_avg":"359.8","datetime":"1994-11-30"},{"year":"1994","month":"12","de_season_avg":"359.96","datetime":"1994-12-31"},{"year":"1995","month":"1","de_season_avg":"359.91","datetime":"1995-01-31"},{"year":"1995","month":"2","de_season_avg":"360.18","datetime":"1995-02-28"},{"year":"1995","month":"3","de_season_avg":"360.37","datetime":"1995-03-31"},{"year":"1995","month":"4","de_season_avg":"360.76","datetime":"1995-04-30"},{"year":"1995","month":"5","de_season_avg":"360.72","datetime":"1995-05-31"},{"year":"1995","month":"6","de_season_avg":"360.98","datetime":"1995-06-30"},{"year":"1995","month":"7","de_season_avg":"361.1","datetime":"1995-07-31"},{"year":"1995","month":"8","de_season_avg":"360.93","datetime":"1995-08-31"},{"year":"1995","month":"9","de_season_avg":"361.7","datetime":"1995-09-30"},{"year":"1995","month":"10","de_season_avg":"361.52","datetime":"1995-10-31"},{"year":"1995","month":"11","de_season_avg":"361.75","datetime":"1995-11-30"},{"year":"1995","month":"12","de_season_avg":"361.67","datetime":"1995-12-31"},{"year":"1996","month":"1","de_season_avg":"361.98","datetime":"1996-01-31"},{"year":"1996","month":"2","de_season_avg":"362.47","datetime":"1996-02-29"},{"year":"1996","month":"3","de_season_avg":"362.64","datetime":"1996-03-31"},{"year":"1996","month":"4","de_season_avg":"361.99","datetime":"1996-04-30"},{"year":"1996","month":"5","de_season_avg":"362.23","datetime":"1996-05-31"},{"year":"1996","month":"6","de_season_avg":"362.82","datetime":"1996-06-30"},{"year":"1996","month":"7","de_season_avg":"362.98","datetime":"1996-07-31"},{"year":"1996","month":"8","de_season_avg":"363.13","datetime":"1996-08-31"},{"year":"1996","month":"9","de_season_avg":"363.14","datetime":"1996-09-30"},{"year":"1996","month":"10","de_season_avg":"363.12","datetime":"1996-10-31"},{"year":"1996","month":"11","de_season_avg":"363.18","datetime":"1996-11-30"},{"year":"1996","month":"12","de_season_avg":"363.23","datetime":"1996-12-31"},{"year":"1997","month":"1","de_season_avg":"363.03","datetime":"1997-01-31"},{"year":"1997","month":"2","de_season_avg":"363.4","datetime":"1997-02-28"},{"year":"1997","month":"3","de_season_avg":"363.02","datetime":"1997-03-31"},{"year":"1997","month":"4","de_season_avg":"363.82","datetime":"1997-04-30"},{"year":"1997","month":"5","de_season_avg":"363.87","datetime":"1997-05-31"},{"year":"1997","month":"6","de_season_avg":"363.56","datetime":"1997-06-30"},{"year":"1997","month":"7","de_season_avg":"363.74","datetime":"1997-07-31"},{"year":"1997","month":"8","de_season_avg":"363.98","datetime":"1997-08-31"},{"year":"1997","month":"9","de_season_avg":"363.83","datetime":"1997-09-30"},{"year":"1997","month":"10","de_season_avg":"364.28","datetime":"1997-10-31"},{"year":"1997","month":"11","de_season_avg":"364.71","datetime":"1997-11-30"},{"year":"1997","month":"12","de_season_avg":"365.28","datetime":"1997-12-31"},{"year":"1998","month":"1","de_season_avg":"365.19","datetime":"1998-01-31"},{"year":"1998","month":"2","de_season_avg":"365.29","datetime":"1998-02-28"},{"year":"1998","month":"3","de_season_avg":"365.73","datetime":"1998-03-31"},{"year":"1998","month":"4","de_season_avg":"366.17","datetime":"1998-04-30"},{"year":"1998","month":"5","de_season_avg":"366.68","datetime":"1998-05-31"},{"year":"1998","month":"6","de_season_avg":"366.95","datetime":"1998-06-30"},{"year":"1998","month":"7","de_season_avg":"367.29","datetime":"1998-07-31"},{"year":"1998","month":"8","de_season_avg":"367.69","datetime":"1998-08-31"},{"year":"1998","month":"9","de_season_avg":"367.51","datetime":"1998-09-30"},{"year":"1998","month":"10","de_season_avg":"367.82","datetime":"1998-10-31"},{"year":"1998","month":"11","de_season_avg":"367.7","datetime":"1998-11-30"},{"year":"1998","month":"12","de_season_avg":"368.05","datetime":"1998-12-31"},{"year":"1999","month":"1","de_season_avg":"368.13","datetime":"1999-01-31"},{"year":"1999","month":"2","de_season_avg":"368.46","datetime":"1999-02-28"},{"year":"1999","month":"3","de_season_avg":"368.24","datetime":"1999-03-31"},{"year":"1999","month":"4","de_season_avg":"368.62","datetime":"1999-04-30"},{"year":"1999","month":"5","de_season_avg":"368.31","datetime":"1999-05-31"},{"year":"1999","month":"6","de_season_avg":"368.3","datetime":"1999-06-30"},{"year":"1999","month":"7","de_season_avg":"368.93","datetime":"1999-07-31"},{"year":"1999","month":"8","de_season_avg":"368.63","datetime":"1999-08-31"},{"year":"1999","month":"9","de_season_avg":"368.28","datetime":"1999-09-30"},{"year":"1999","month":"10","de_season_avg":"368.8","datetime":"1999-10-31"},{"year":"1999","month":"11","de_season_avg":"368.86","datetime":"1999-11-30"},{"year":"1999","month":"12","de_season_avg":"368.93","datetime":"1999-12-31"},{"year":"2000","month":"1","de_season_avg":"369.24","datetime":"2000-01-31"},{"year":"2000","month":"2","de_season_avg":"368.99","datetime":"2000-02-29"},{"year":"2000","month":"3","de_season_avg":"369.24","datetime":"2000-03-31"},{"year":"2000","month":"4","de_season_avg":"369.44","datetime":"2000-04-30"},{"year":"2000","month":"5","de_season_avg":"368.87","datetime":"2000-05-31"},{"year":"2000","month":"6","de_season_avg":"369.66","datetime":"2000-06-30"},{"year":"2000","month":"7","de_season_avg":"369.36","datetime":"2000-07-31"},{"year":"2000","month":"8","de_season_avg":"369.87","datetime":"2000-08-31"},{"year":"2000","month":"9","de_season_avg":"370.46","datetime":"2000-09-30"},{"year":"2000","month":"10","de_season_avg":"370.42","datetime":"2000-10-31"},{"year":"2000","month":"11","de_season_avg":"370.48","datetime":"2000-11-30"},{"year":"2000","month":"12","de_season_avg":"370.46","datetime":"2000-12-31"},{"year":"2001","month":"1","de_season_avg":"370.6","datetime":"2001-01-31"},{"year":"2001","month":"2","de_season_avg":"370.95","datetime":"2001-02-28"},{"year":"2001","month":"3","de_season_avg":"371.06","datetime":"2001-03-31"},{"year":"2001","month":"4","de_season_avg":"370.99","datetime":"2001-04-30"},{"year":"2001","month":"5","de_season_avg":"371.11","datetime":"2001-05-31"},{"year":"2001","month":"6","de_season_avg":"371.17","datetime":"2001-06-30"},{"year":"2001","month":"7","de_season_avg":"371.08","datetime":"2001-07-31"},{"year":"2001","month":"8","de_season_avg":"371.39","datetime":"2001-08-31"},{"year":"2001","month":"9","de_season_avg":"371.61","datetime":"2001-09-30"},{"year":"2001","month":"10","de_season_avg":"371.85","datetime":"2001-10-31"},{"year":"2001","month":"11","de_season_avg":"371.92","datetime":"2001-11-30"},{"year":"2001","month":"12","de_season_avg":"372.09","datetime":"2001-12-31"},{"year":"2002","month":"1","de_season_avg":"372.48","datetime":"2002-01-31"},{"year":"2002","month":"2","de_season_avg":"372.49","datetime":"2002-02-28"},{"year":"2002","month":"3","de_season_avg":"372.61","datetime":"2002-03-31"},{"year":"2002","month":"4","de_season_avg":"372.54","datetime":"2002-04-30"},{"year":"2002","month":"5","de_season_avg":"372.98","datetime":"2002-05-31"},{"year":"2002","month":"6","de_season_avg":"373.46","datetime":"2002-06-30"},{"year":"2002","month":"7","de_season_avg":"373.58","datetime":"2002-07-31"},{"year":"2002","month":"8","de_season_avg":"373.7","datetime":"2002-08-31"},{"year":"2002","month":"9","de_season_avg":"374.29","datetime":"2002-09-30"},{"year":"2002","month":"10","de_season_avg":"374.06","datetime":"2002-10-31"},{"year":"2002","month":"11","de_season_avg":"374.52","datetime":"2002-11-30"},{"year":"2002","month":"12","de_season_avg":"374.72","datetime":"2002-12-31"},{"year":"2003","month":"1","de_season_avg":"374.82","datetime":"2003-01-31"},{"year":"2003","month":"2","de_season_avg":"374.95","datetime":"2003-02-28"},{"year":"2003","month":"3","de_season_avg":"374.99","datetime":"2003-03-31"},{"year":"2003","month":"4","de_season_avg":"375.24","datetime":"2003-04-30"},{"year":"2003","month":"5","de_season_avg":"375.73","datetime":"2003-05-31"},{"year":"2003","month":"6","de_season_avg":"376.21","datetime":"2003-06-30"},{"year":"2003","month":"7","de_season_avg":"376.37","datetime":"2003-07-31"},{"year":"2003","month":"8","de_season_avg":"376.27","datetime":"2003-08-31"},{"year":"2003","month":"9","de_season_avg":"376.65","datetime":"2003-09-30"},{"year":"2003","month":"10","de_season_avg":"376.65","datetime":"2003-10-31"},{"year":"2003","month":"11","de_season_avg":"376.99","datetime":"2003-11-30"},{"year":"2003","month":"12","de_season_avg":"376.93","datetime":"2003-12-31"},{"year":"2004","month":"1","de_season_avg":"376.96","datetime":"2004-01-31"},{"year":"2004","month":"2","de_season_avg":"377.19","datetime":"2004-02-29"},{"year":"2004","month":"3","de_season_avg":"377.4","datetime":"2004-03-31"},{"year":"2004","month":"4","de_season_avg":"377.8","datetime":"2004-04-30"},{"year":"2004","month":"5","de_season_avg":"377.66","datetime":"2004-05-31"},{"year":"2004","month":"6","de_season_avg":"377.57","datetime":"2004-06-30"},{"year":"2004","month":"7","de_season_avg":"377.12","datetime":"2004-07-31"},{"year":"2004","month":"8","de_season_avg":"377.9","datetime":"2004-08-31"},{"year":"2004","month":"9","de_season_avg":"377.8","datetime":"2004-09-30"},{"year":"2004","month":"10","de_season_avg":"378.0","datetime":"2004-10-31"},{"year":"2004","month":"11","de_season_avg":"378.49","datetime":"2004-11-30"},{"year":"2004","month":"12","de_season_avg":"378.48","datetime":"2004-12-31"},{"year":"2005","month":"1","de_season_avg":"378.37","datetime":"2005-01-31"},{"year":"2005","month":"2","de_season_avg":"379.1","datetime":"2005-02-28"},{"year":"2005","month":"3","de_season_avg":"379.45","datetime":"2005-03-31"},{"year":"2005","month":"4","de_season_avg":"379.84","datetime":"2005-04-30"},{"year":"2005","month":"5","de_season_avg":"379.49","datetime":"2005-05-31"},{"year":"2005","month":"6","de_season_avg":"380.07","datetime":"2005-06-30"},{"year":"2005","month":"7","de_season_avg":"380.38","datetime":"2005-07-31"},{"year":"2005","month":"8","de_season_avg":"380.61","datetime":"2005-08-31"},{"year":"2005","month":"9","de_season_avg":"380.2","datetime":"2005-09-30"},{"year":"2005","month":"10","de_season_avg":"380.49","datetime":"2005-10-31"},{"year":"2005","month":"11","de_season_avg":"380.69","datetime":"2005-11-30"},{"year":"2005","month":"12","de_season_avg":"381.09","datetime":"2005-12-31"},{"year":"2006","month":"1","de_season_avg":"381.33","datetime":"2006-01-31"},{"year":"2006","month":"2","de_season_avg":"381.58","datetime":"2006-02-28"},{"year":"2006","month":"3","de_season_avg":"381.32","datetime":"2006-03-31"},{"year":"2006","month":"4","de_season_avg":"382.11","datetime":"2006-04-30"},{"year":"2006","month":"5","de_season_avg":"382.06","datetime":"2006-05-31"},{"year":"2006","month":"6","de_season_avg":"381.93","datetime":"2006-06-30"},{"year":"2006","month":"7","de_season_avg":"382.1","datetime":"2006-07-31"},{"year":"2006","month":"8","de_season_avg":"382.27","datetime":"2006-08-31"},{"year":"2006","month":"9","de_season_avg":"382.35","datetime":"2006-09-30"},{"year":"2006","month":"10","de_season_avg":"382.66","datetime":"2006-10-31"},{"year":"2006","month":"11","de_season_avg":"382.52","datetime":"2006-11-30"},{"year":"2006","month":"12","de_season_avg":"382.84","datetime":"2006-12-31"},{"year":"2007","month":"1","de_season_avg":"382.88","datetime":"2007-01-31"},{"year":"2007","month":"2","de_season_avg":"383.22","datetime":"2007-02-28"},{"year":"2007","month":"3","de_season_avg":"383.17","datetime":"2007-03-31"},{"year":"2007","month":"4","de_season_avg":"383.95","datetime":"2007-04-30"},{"year":"2007","month":"5","de_season_avg":"383.56","datetime":"2007-05-31"},{"year":"2007","month":"6","de_season_avg":"384.06","datetime":"2007-06-30"},{"year":"2007","month":"7","de_season_avg":"384.25","datetime":"2007-07-31"},{"year":"2007","month":"8","de_season_avg":"383.95","datetime":"2007-08-31"},{"year":"2007","month":"9","de_season_avg":"384.56","datetime":"2007-09-30"},{"year":"2007","month":"10","de_season_avg":"384.72","datetime":"2007-10-31"},{"year":"2007","month":"11","de_season_avg":"384.9","datetime":"2007-11-30"},{"year":"2007","month":"12","de_season_avg":"385.07","datetime":"2007-12-31"},{"year":"2008","month":"1","de_season_avg":"385.54","datetime":"2008-01-31"},{"year":"2008","month":"2","de_season_avg":"385.2","datetime":"2008-02-29"},{"year":"2008","month":"3","de_season_avg":"384.72","datetime":"2008-03-31"},{"year":"2008","month":"4","de_season_avg":"384.71","datetime":"2008-04-30"},{"year":"2008","month":"5","de_season_avg":"385.69","datetime":"2008-05-31"},{"year":"2008","month":"6","de_season_avg":"385.68","datetime":"2008-06-30"},{"year":"2008","month":"7","de_season_avg":"386.04","datetime":"2008-07-31"},{"year":"2008","month":"8","de_season_avg":"385.98","datetime":"2008-08-31"},{"year":"2008","month":"9","de_season_avg":"386.68","datetime":"2008-09-30"},{"year":"2008","month":"10","de_season_avg":"386.49","datetime":"2008-10-31"},{"year":"2008","month":"11","de_season_avg":"386.59","datetime":"2008-11-30"},{"year":"2008","month":"12","de_season_avg":"386.64","datetime":"2008-12-31"},{"year":"2009","month":"1","de_season_avg":"386.86","datetime":"2009-01-31"},{"year":"2009","month":"2","de_season_avg":"386.81","datetime":"2009-02-28"},{"year":"2009","month":"3","de_season_avg":"387.54","datetime":"2009-03-31"},{"year":"2009","month":"4","de_season_avg":"387.15","datetime":"2009-04-30"},{"year":"2009","month":"5","de_season_avg":"387.24","datetime":"2009-05-31"},{"year":"2009","month":"6","de_season_avg":"387.46","datetime":"2009-06-30"},{"year":"2009","month":"7","de_season_avg":"387.77","datetime":"2009-07-31"},{"year":"2009","month":"8","de_season_avg":"387.99","datetime":"2009-08-31"},{"year":"2009","month":"9","de_season_avg":"388.22","datetime":"2009-09-30"},{"year":"2009","month":"10","de_season_avg":"387.88","datetime":"2009-10-31"},{"year":"2009","month":"11","de_season_avg":"388.36","datetime":"2009-11-30"},{"year":"2009","month":"12","de_season_avg":"388.44","datetime":"2009-12-31"},{"year":"2010","month":"1","de_season_avg":"388.62","datetime":"2010-01-31"},{"year":"2010","month":"2","de_season_avg":"389.47","datetime":"2010-02-28"},{"year":"2010","month":"3","de_season_avg":"389.85","datetime":"2010-03-31"},{"year":"2010","month":"4","de_season_avg":"390.12","datetime":"2010-04-30"},{"year":"2010","month":"5","de_season_avg":"390.09","datetime":"2010-05-31"},{"year":"2010","month":"6","de_season_avg":"390.1","datetime":"2010-06-30"},{"year":"2010","month":"7","de_season_avg":"389.93","datetime":"2010-07-31"},{"year":"2010","month":"8","de_season_avg":"390.21","datetime":"2010-08-31"},{"year":"2010","month":"9","de_season_avg":"390.32","datetime":"2010-09-30"},{"year":"2010","month":"10","de_season_avg":"390.72","datetime":"2010-10-31"},{"year":"2010","month":"11","de_season_avg":"390.99","datetime":"2010-11-30"},{"year":"2010","month":"12","de_season_avg":"390.8","datetime":"2010-12-31"},{"year":"2011","month":"1","de_season_avg":"391.19","datetime":"2011-01-31"},{"year":"2011","month":"2","de_season_avg":"391.12","datetime":"2011-02-28"},{"year":"2011","month":"3","de_season_avg":"391.27","datetime":"2011-03-31"},{"year":"2011","month":"4","de_season_avg":"390.83","datetime":"2011-04-30"},{"year":"2011","month":"5","de_season_avg":"391.24","datetime":"2011-05-31"},{"year":"2011","month":"6","de_season_avg":"391.64","datetime":"2011-06-30"},{"year":"2011","month":"7","de_season_avg":"392.25","datetime":"2011-07-31"},{"year":"2011","month":"8","de_season_avg":"392.04","datetime":"2011-08-31"},{"year":"2011","month":"9","de_season_avg":"392.6","datetime":"2011-09-30"},{"year":"2011","month":"10","de_season_avg":"392.53","datetime":"2011-10-31"},{"year":"2011","month":"11","de_season_avg":"392.64","datetime":"2011-11-30"},{"year":"2011","month":"12","de_season_avg":"392.86","datetime":"2011-12-31"},{"year":"2012","month":"1","de_season_avg":"393.07","datetime":"2012-01-31"},{"year":"2012","month":"2","de_season_avg":"393.2","datetime":"2012-02-29"},{"year":"2012","month":"3","de_season_avg":"392.99","datetime":"2012-03-31"},{"year":"2012","month":"4","de_season_avg":"393.65","datetime":"2012-04-30"},{"year":"2012","month":"5","de_season_avg":"393.73","datetime":"2012-05-31"},{"year":"2012","month":"6","de_season_avg":"393.63","datetime":"2012-06-30"},{"year":"2012","month":"7","de_season_avg":"394.12","datetime":"2012-07-31"},{"year":"2012","month":"8","de_season_avg":"394.37","datetime":"2012-08-31"},{"year":"2012","month":"9","de_season_avg":"394.74","datetime":"2012-09-30"},{"year":"2012","month":"10","de_season_avg":"394.64","datetime":"2012-10-31"},{"year":"2012","month":"11","de_season_avg":"395.25","datetime":"2012-11-30"},{"year":"2012","month":"12","de_season_avg":"395.27","datetime":"2012-12-31"},{"year":"2013","month":"1","de_season_avg":"395.62","datetime":"2013-01-31"},{"year":"2013","month":"2","de_season_avg":"396.23","datetime":"2013-02-28"},{"year":"2013","month":"3","de_season_avg":"396.07","datetime":"2013-03-31"},{"year":"2013","month":"4","de_season_avg":"395.79","datetime":"2013-04-30"},{"year":"2013","month":"5","de_season_avg":"396.64","datetime":"2013-05-31"},{"year":"2013","month":"6","de_season_avg":"396.48","datetime":"2013-06-30"},{"year":"2013","month":"7","de_season_avg":"397.12","datetime":"2013-07-31"},{"year":"2013","month":"8","de_season_avg":"397.27","datetime":"2013-08-31"},{"year":"2013","month":"9","de_season_avg":"397.24","datetime":"2013-09-30"},{"year":"2013","month":"10","de_season_avg":"397.25","datetime":"2013-10-31"},{"year":"2013","month":"11","de_season_avg":"397.35","datetime":"2013-11-30"},{"year":"2013","month":"12","de_season_avg":"397.78","datetime":"2013-12-31"},{"year":"2014","month":"1","de_season_avg":"397.74","datetime":"2014-01-31"},{"year":"2014","month":"2","de_season_avg":"397.45","datetime":"2014-02-28"},{"year":"2014","month":"3","de_season_avg":"398.37","datetime":"2014-03-31"},{"year":"2014","month":"4","de_season_avg":"398.63","datetime":"2014-04-30"},{"year":"2014","month":"5","de_season_avg":"398.56","datetime":"2014-05-31"},{"year":"2014","month":"6","de_season_avg":"399.1","datetime":"2014-06-30"},{"year":"2014","month":"7","de_season_avg":"398.85","datetime":"2014-07-31"},{"year":"2014","month":"8","de_season_avg":"399.07","datetime":"2014-08-31"},{"year":"2014","month":"9","de_season_avg":"399.11","datetime":"2014-09-30"},{"year":"2014","month":"10","de_season_avg":"399.57","datetime":"2014-10-31"},{"year":"2014","month":"11","de_season_avg":"399.49","datetime":"2014-11-30"},{"year":"2014","month":"12","de_season_avg":"399.81","datetime":"2014-12-31"},{"year":"2015","month":"1","de_season_avg":"399.92","datetime":"2015-01-31"},{"year":"2015","month":"2","de_season_avg":"399.77","datetime":"2015-02-28"},{"year":"2015","month":"3","de_season_avg":"400.22","datetime":"2015-03-31"},{"year":"2015","month":"4","de_season_avg":"400.46","datetime":"2015-04-30"},{"year":"2015","month":"5","de_season_avg":"400.7","datetime":"2015-05-31"},{"year":"2015","month":"6","de_season_avg":"400.65","datetime":"2015-06-30"},{"year":"2015","month":"7","de_season_avg":"401.11","datetime":"2015-07-31"},{"year":"2015","month":"8","de_season_avg":"401.04","datetime":"2015-08-31"},{"year":"2015","month":"9","de_season_avg":"401.43","datetime":"2015-09-30"},{"year":"2015","month":"10","de_season_avg":"401.89","datetime":"2015-10-31"},{"year":"2015","month":"11","de_season_avg":"402.24","datetime":"2015-11-30"},{"year":"2015","month":"12","de_season_avg":"402.72","datetime":"2015-12-31"},{"year":"2016","month":"1","de_season_avg":"402.45","datetime":"2016-01-31"},{"year":"2016","month":"2","de_season_avg":"403.4","datetime":"2016-02-29"},{"year":"2016","month":"3","de_season_avg":"403.54","datetime":"2016-03-31"},{"year":"2016","month":"4","de_season_avg":"404.77","datetime":"2016-04-30"},{"year":"2016","month":"5","de_season_avg":"404.41","datetime":"2016-05-31"},{"year":"2016","month":"6","de_season_avg":"404.59","datetime":"2016-06-30"},{"year":"2016","month":"7","de_season_avg":"404.24","datetime":"2016-07-31"},{"year":"2016","month":"8","de_season_avg":"404.41","datetime":"2016-08-31"},{"year":"2016","month":"9","de_season_avg":"404.85","datetime":"2016-09-30"},{"year":"2016","month":"10","de_season_avg":"405.23","datetime":"2016-10-31"},{"year":"2016","month":"11","de_season_avg":"405.74","datetime":"2016-11-30"},{"year":"2016","month":"12","de_season_avg":"405.33","datetime":"2016-12-31"},{"year":"2017","month":"1","de_season_avg":"406.04","datetime":"2017-01-31"},{"year":"2017","month":"2","de_season_avg":"405.81","datetime":"2017-02-28"},{"year":"2017","month":"3","de_season_avg":"406.05","datetime":"2017-03-31"},{"year":"2017","month":"4","de_season_avg":"406.37","datetime":"2017-04-30"},{"year":"2017","month":"5","de_season_avg":"406.37","datetime":"2017-05-31"},{"year":"2017","month":"6","de_season_avg":"406.68","datetime":"2017-06-30"},{"year":"2017","month":"7","de_season_avg":"407.01","datetime":"2017-07-31"},{"year":"2017","month":"8","de_season_avg":"407.31","datetime":"2017-08-31"},{"year":"2017","month":"9","de_season_avg":"407.17","datetime":"2017-09-30"},{"year":"2017","month":"10","de_season_avg":"407.23","datetime":"2017-10-31"},{"year":"2017","month":"11","de_season_avg":"407.36","datetime":"2017-11-30"},{"year":"2017","month":"12","de_season_avg":"407.71","datetime":"2017-12-31"},{"year":"2018","month":"1","de_season_avg":"407.82","datetime":"2018-01-31"},{"year":"2018","month":"2","de_season_avg":"407.61","datetime":"2018-02-28"},{"year":"2018","month":"3","de_season_avg":"408.06","datetime":"2018-03-31"},{"year":"2018","month":"4","de_season_avg":"407.65","datetime":"2018-04-30"},{"year":"2018","month":"5","de_season_avg":"407.98","datetime":"2018-05-31"},{"year":"2018","month":"6","de_season_avg":"408.6","datetime":"2018-06-30"},{"year":"2018","month":"7","de_season_avg":"408.59","datetime":"2018-07-31"},{"year":"2018","month":"8","de_season_avg":"409.17","datetime":"2018-08-31"},{"year":"2018","month":"9","de_season_avg":"409.31","datetime":"2018-09-30"},{"year":"2018","month":"10","de_season_avg":"409.56","datetime":"2018-10-31"},{"year":"2018","month":"11","de_season_avg":"410.24","datetime":"2018-11-30"},{"year":"2018","month":"12","de_season_avg":"409.99","datetime":"2018-12-31"},{"year":"2019","month":"1","de_season_avg":"410.66","datetime":"2019-01-31"},{"year":"2019","month":"2","de_season_avg":"411.0","datetime":"2019-02-28"},{"year":"2019","month":"3","de_season_avg":"410.7","datetime":"2019-03-31"},{"year":"2019","month":"4","de_season_avg":"410.86","datetime":"2019-04-30"},{"year":"2019","month":"5","de_season_avg":"411.47","datetime":"2019-05-31"},{"year":"2019","month":"6","de_season_avg":"411.78","datetime":"2019-06-30"},{"year":"2019","month":"7","de_season_avg":"411.66","datetime":"2019-07-31"},{"year":"2019","month":"8","de_season_avg":"412.15","datetime":"2019-08-31"},{"year":"2019","month":"9","de_season_avg":"412.29","datetime":"2019-09-30"},{"year":"2019","month":"10","de_season_avg":"412.09","datetime":"2019-10-31"},{"year":"2019","month":"11","de_season_avg":"412.5","datetime":"2019-11-30"},{"year":"2019","month":"12","de_season_avg":"412.69","datetime":"2019-12-31"},{"year":"2020","month":"1","de_season_avg":"413.23","datetime":"2020-01-31"},{"year":"2020","month":"2","de_season_avg":"413.38","datetime":"2020-02-29"},{"year":"2020","month":"3","de_season_avg":"413.26","datetime":"2020-03-31"},{"year":"2020","month":"4","de_season_avg":"413.77","datetime":"2020-04-30"},{"year":"2020","month":"5","de_season_avg":"413.92","datetime":"2020-05-31"},{"year":"2020","month":"6","de_season_avg":"414.22","datetime":"2020-06-30"},{"year":"2020","month":"7","de_season_avg":"414.3","datetime":"2020-07-31"},{"year":"2020","month":"8","de_season_avg":"414.75","datetime":"2020-08-31"},{"year":"2020","month":"9","de_season_avg":"415.05","datetime":"2020-09-30"},{"year":"2020","month":"10","de_season_avg":"414.85","datetime":"2020-10-31"},{"year":"2020","month":"11","de_season_avg":"415.15","datetime":"2020-11-30"},{"year":"2020","month":"12","de_season_avg":"414.97","datetime":"2020-12-31"},{"year":"2021","month":"1","de_season_avg":"415.14","datetime":"2021-01-31"},{"year":"2021","month":"2","de_season_avg":"415.79","datetime":"2021-02-28"},{"year":"2021","month":"3","de_season_avg":"416.16","datetime":"2021-03-31"},{"year":"2021","month":"4","de_season_avg":"416.37","datetime":"2021-04-30"},{"year":"2021","month":"5","de_season_avg":"415.73","datetime":"2021-05-31"},{"year":"2021","month":"6","de_season_avg":"416.56","datetime":"2021-06-30"},{"year":"2021","month":"7","de_season_avg":"416.65","datetime":"2021-07-31"},{"year":"2021","month":"8","de_season_avg":"416.44","datetime":"2021-08-31"},{"year":"2021","month":"9","de_season_avg":"416.83","datetime":"2021-09-30"},{"year":"2021","month":"10","de_season_avg":"417.27","datetime":"2021-10-31"},{"year":"2021","month":"11","de_season_avg":"417.04","datetime":"2021-11-30"},{"year":"2021","month":"12","de_season_avg":"417.42","datetime":"2021-12-31"},{"year":"2022","month":"1","de_season_avg":"417.81","datetime":"2022-01-31"},{"year":"2022","month":"2","de_season_avg":"418.31","datetime":"2022-02-28"},{"year":"2022","month":"3","de_season_avg":"417.33","datetime":"2022-03-31"},{"year":"2022","month":"4","de_season_avg":"417.55","datetime":"2022-04-30"},{"year":"2022","month":"5","de_season_avg":"417.6","datetime":"2022-05-31"},{"year":"2022","month":"6","de_season_avg":"418.61","datetime":"2022-06-30"},{"year":"2022","month":"7","de_season_avg":"418.58","datetime":"2022-07-31"},{"year":"2022","month":"8","de_season_avg":"419.16","datetime":"2022-08-31"},{"year":"2022","month":"9","de_season_avg":"419.49","datetime":"2022-09-30"},{"year":"2022","month":"10","de_season_avg":"419.12","datetime":"2022-10-31"}];
  var dataFromFile = _.cloneDeep(data);

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

      var g = svg.append("g")
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

}

initChart();

makeLinechart(data);


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


 

      }
    }
  }
});