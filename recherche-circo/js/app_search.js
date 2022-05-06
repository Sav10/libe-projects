
const d1 = ['azer', 'kjkjk', 'nbfehb'];

const autoCompleteJS = new autoComplete({
            placeHolder: "Chercher une circonscription..",
            diacritics: true,
            resultsList: {
            maxResults: 18,
          },
            data: {
                src: async (query) => {
      try {
        // Fetch Data from external Source
        const source = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`);
        // Data is array of `Objects` | `Strings`
        const data = await source.json();

        console.log(data.features)

        return data.features.map(function(d) { return {'label':d.properties.label, 'properties':d.properties, 'geometry' : d.geometry } });
      } catch (error) {
        return error;
      }
    },
    keys:['label'],
                cache: false
            },
            resultItem: {
                highlight: true
            },
            events: {
                input: {
                    selection: (event) => {
                        const selection = event.detail.selection.value;
                        console.log(selection)
                        autoCompleteJS.input.value = selection.label;
                        console.log(selection.geometry.coordinates)
                        let this_dep = selection.properties.postcode.substring(0,2)
                        console.log(this_dep)


                        d3.json("assets/circo_dep/dep" + this_dep + ".json")
                      .then(function(data) {
                        console.log(data)
    // Code from your callback goes here...
                        })
                        .catch(function(error) {
    // Do some error handling.
                        });



//  fetch(`API_ADRESS?latitude=${selection.geometry.coordinates[0]}&longitude=${selection.geometry.coordinates[1]}`)
// .then(function(response) {
//   return response.json();
// })
// .then(function(resp) {
//   console.log(resp.circonscription)
//   d3.select('#result_circo').text(resp.circonscription)
// });


                    }
                }
            }
        });


// 'use strict';
// var departement_search,
// circo_search;

// document.addEventListener('DOMContentLoaded', function() {

//   function init() {

//     var app = new Vue({
//       el: '#search-wrap',
//       data: {
//         availableH: 0,
//         currentDpt: '',
//         isCirco: false,
//         currentCirco: [],
//         selectedCirco: '',
//         allCirco: {}
//       },
//       mounted: function () {
//         this.$nextTick(function() {

//             var that = this;
//             $('.search').typeahead({
//               source: _.throttle(function(query, process) {
//                 that.isCirco = false;
//                 that.isCand = false;
//                 var apiUrl = 'https://geo.api.gouv.fr/communes?nom=';
//                 var isNbr = isNaN(parseInt(query));
//                 if (!isNbr) {
//                   apiUrl = 'https://geo.api.gouv.fr/communes?codePostal=';
//                 } else {
//                   if (query[2] == ' ') {
//                     var newQuery = query.substring(3);
//                     query = newQuery;
//                   }
//                   else if (query[3] == ' ') {
//                     var newQuery = query.substring(3);
//                     query = newQuery;
//                   }
//                 }
//                 that.$http.get(apiUrl+query.replace(' ', '%20')+'&boost=population&fields=nom,code,codeDepartement,codesPostaux,codeRegion&format=json').then(function(res) {
//                   var city = res.body.slice(0,6);
//                   city.forEach(function(d) {
//                     d.codesPostaux.length > 1 ? d.name = d.nom + ' (' + d.codeDepartement + ')' : d.name = d.nom + ' (' + d.codesPostaux[0] + ')';
//                     //d.label = _.deburr(d.name);
//                   });
//                   return process(city);
//                 }, function() {
//                   console.log('error');
//                 });
//               }, 300),
//               items: 6,
//               minLength: 3,
//               matcher: function(item) {
//                 return item.name;
//               },
//               afterSelect: function(d) {
//                 that.getCirco(d);
//               }
//             });

//             window.addEventListener('resize', this.handleResize)
//             this.handleResize();

//         });
//       },
//       methods: {
//         getCirco: function (com) {
//           var that = this;
//           var insee = com.code;

//           this.currentDpt = this.get3Car(com);

//           if (this.allCirco[this.currentDpt]) {
//             this.showCirco(this.allCirco[this.currentDpt], insee);
//           } else {
//             this.$http.get('assets/json/dptcom/'+this.currentDpt+'.json').then(function(res) {
//               this.allCirco[this.currentDpt] = res.body;
//               this.showCirco(res.body, insee);
//             }, function() {
//               console.log('error');
//             });
//           }
//         },
//         showCirco: function(data, insee) {
//           var circos = [],
//               coms = data.Election.Departement.Communes.Commune;
//           coms.forEach(function(c) {
//             if (c.insee == insee) circos.push(c);
//           });
//           if (circos.length > 1) {
//             this.currentCirco = circos;
//             this.isCirco = true;
//           } else {
//             this.currentCirco = circos[0];
//             this.isCirco = false;
//             this.getCand(this.currentCirco.cir, this.currentCirco.lib);
//           }
//         },
//         getCand: function(cir, lib) {
//           this.isCirco = false;
//           // console.log('département', this.currentDpt)
//           departement_search = this.currentDpt;
//           circo_search = cir;
//           // console.log('code circonscription', cir)
//           // console.log('libelé circonscription', lib);

//           // show_tooltip(d, x, y);
//           var this_id_circ = departement_search + '-' + cir;
//           var this_d = _.find(data_circo, function(d){return d.id_circo == departement_search + '-' + cir });
//           // console.log(this_id_circ);
//           // console.log(this_d);
//           show_tooltip(this_d, 0, 0);

//         },
//         get3Car: function (com) {
//           if (com.codeDepartement == '97') return com.codeDepartement+com.codeRegion[1];
//           else return com.codeDepartement.length == 2 ? '0'+com.codeDepartement : com.codeDepartement;
//         },
//         handleResize: function() {
//           this.availableH = $('#search-wrap').height() - $('#search-header').height();
//         }
//       }
//     });

//   }

//   init();

// });


// $("#map")[0].getBoundingClientRect().right;

// d3.select("#search-wrap")
// .style('left', $("#map")[0].getBoundingClientRect().right + 'px');