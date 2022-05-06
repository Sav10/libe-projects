'use strict';
var departement_search,
circo_search;

document.addEventListener('DOMContentLoaded', function() {

  function init() {

    var app = new Vue({
      el: '#search-wrap',
      data: {
        availableH: 0,
        currentDpt: '',
        isCirco: false,
        currentCirco: [],
        selectedCirco: '',
        allCirco: {}
      },
      mounted: function () {
        this.$nextTick(function() {

            var that = this;
            $('.search').typeahead({
              source: _.throttle(function(query, process) {
                that.isCirco = false;
                that.isCand = false;
                var apiUrl = 'https://geo.api.gouv.fr/communes?nom=';
                var isNbr = isNaN(parseInt(query));
                if (!isNbr) {
                  apiUrl = 'https://geo.api.gouv.fr/communes?codePostal=';
                } else {
                  if (query[2] == ' ') {
                    var newQuery = query.substring(3);
                    query = newQuery;
                  }
                  else if (query[3] == ' ') {
                    var newQuery = query.substring(3);
                    query = newQuery;
                  }
                }
                that.$http.get(apiUrl+query.replace(' ', '%20')+'&boost=population&fields=nom,code,codeDepartement,codesPostaux,codeRegion&format=json').then(function(res) {
                  var city = res.body.slice(0,6);
                  city.forEach(function(d) {
                    d.codesPostaux.length > 1 ? d.name = d.nom + ' (' + d.codeDepartement + ')' : d.name = d.nom + ' (' + d.codesPostaux[0] + ')';
                    //d.label = _.deburr(d.name);
                  });
                  return process(city);
                }, function() {
                  console.log('error');
                });
              }, 300),
              items: 6,
              minLength: 3,
              matcher: function(item) {
                return item.name;
              },
              afterSelect: function(d) {
                that.getCirco(d);
              }
            });

            window.addEventListener('resize', this.handleResize)
            this.handleResize();

        });
      },
      methods: {
        getCirco: function (com) {
          var that = this;
          var insee = com.code;

          this.currentDpt = this.get3Car(com);

          if (this.allCirco[this.currentDpt]) {
            this.showCirco(this.allCirco[this.currentDpt], insee);
          } else {
            this.$http.get('assets/json/dptcom/'+this.currentDpt+'.json').then(function(res) {
              this.allCirco[this.currentDpt] = res.body;
              this.showCirco(res.body, insee);
            }, function() {
              console.log('error');
            });
          }
        },
        showCirco: function(data, insee) {
          var circos = [],
              coms = data.Election.Departement.Communes.Commune;
          coms.forEach(function(c) {
            if (c.insee == insee) circos.push(c);
          });
          if (circos.length > 1) {
            this.currentCirco = circos;
            this.isCirco = true;
          } else {
            this.currentCirco = circos[0];
            this.isCirco = false;
            this.getCand(this.currentCirco.cir, this.currentCirco.lib);
          }
        },
        getCand: function(cir, lib) {
          this.isCirco = false;
          // console.log('département', this.currentDpt)
          departement_search = this.currentDpt;
          circo_search = cir;
          // console.log('code circonscription', cir)
          // console.log('libelé circonscription', lib);

          // show_tooltip(d, x, y);
          var this_id_circ = departement_search + '-' + cir;
          var this_d = _.find(data_circo, function(d){return d.id_circo == departement_search + '-' + cir });
          // console.log(this_id_circ);
          // console.log(this_d);
          show_tooltip(this_d, 0, 0);

        },
        get3Car: function (com) {
          if (com.codeDepartement == '97') return com.codeDepartement+com.codeRegion[1];
          else return com.codeDepartement.length == 2 ? '0'+com.codeDepartement : com.codeDepartement;
        },
        handleResize: function() {
          this.availableH = $('#search-wrap').height() - $('#search-header').height();
        }
      }
    });

  }

  init();

});


$("#map")[0].getBoundingClientRect().right;

d3.select("#search-wrap")
.style('left', $("#map")[0].getBoundingClientRect().right + 'px');