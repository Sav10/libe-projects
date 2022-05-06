    var map,
    data_deputes,
    data_input_scrutins,
    svg_map,
    render_count = 0,
    color,
    groupesViz,
    all_scrutins_numbers,
    data_deputes_,
    data_invest,
    infobox,
    colorGroupe,
    new_colors_parti,
    data_circo;


partiNuances_2007  = {
  "ALLI": "Alliance Ecologiste",
 "AUT": "Autonomes",
 "CEN": "divers centre",
 "DVD": "divers Droite",
 "DVG": "divers gauche",
 "ECO": "Ecologistes",
 "EXD": "extrème droite",
  "EXG": "extrème gauche",
  "FG": "Front de gauche",
  "FN": "Front national", 
  "NCE": "nouveau centre",
  "PRV": "Radicaux de droite",
  "RDG": "Radicaux de gauche",
  "REG": "Régionalistes",
   "SOC": "Socialistes",
   "UMP": "Union pour un mouvement Populaire",
   "VEC": "Verts européens"};

colorPartis  = {
  "DLF":"#75398a",
  "MPF":"#75398a",
  "FN":"#2e2b5a",
  "LS":"#2e2b5a",
  "EM":"#ffb400",
  "PS":"#d82c5d",
  "App. PS":"#d82c5d",
  "MoDem":"#e85d21",
  "LR":"#0058a2",
  "App. LR":"#0058a2",
  "Mélenchon":"#e10f21",
  "FG":"#e10f21",
  "PLR":"#e10f21",
  "Poutou":"#961e1e",
  "Arthaud": "#781f1c",
  "PRG": "#f1a0c4",
  "GUSR": "#f1a0c4",
  "MDP": "#f1a0c4",
  "PPM": "#f1a0c4",
  "ÀGEG": "#f1a0c4",
  "UDI": "#00b2e8",
  "CE": "#00b2e8",
  "DVG" : "#e6467e",
  "PSG" : "#e6467e",
  "EÉLV" : '#52ae56',
  "EELV" : '#52ae56',
  "PE" : '#52ae56',
  "FD" : '#52ae56',
  "PCF" : "#b82125",
  "MRC" : "#eb70a6",
  "DVD" : "#008ccf",
  "PCD" : "#008ccf"
};


colorGroupe  = {
  "SER": "#e6467e",
  "LR": "#0058a2",
  // "NI": "#999",
  "UDI": "#9f64a2",
  "RRDP": "#f781b6",
  "GDR" :"#cd0420"};


new_colors_parti = {
'Debout la France (Debout la République)':"#003366",
       'Europe Écologie Les Verts':"#52ae56",
       'Association PSLE - Nouveau Centre':"#9f64a2",
       'Le Centre pour la France':"#e85d21", 
       'Parti socialiste':"#e6467e",
       'Front National':"#000032",
       'Parti radical de gauche':"#f781b6"};

new_colors_nuances = {
"SOC":'#e6467e',
"LR":'#0058a2',
 "EXD":'#03034f',
 "DVG":'#f46099',
 "UDI":'#9f64a2',
 "REM":'#ffb400',
 "DLF":'#003366',
 "COM":'#af0e1d',
 "DVD":'#026db5',
 "RDG":'#f781b6',
  "ECO":'#52ae56',
  "FN":'#000032',
  "MDM":'#ff8800',
    'DIV': "#cccccc",
    'EXG': "#751719",
'FI': "#cd0420",
'REG': "#666"}


nuances_parti = {'EXG' : 'Divers extrême gauche',
 'COM' : 'Parti communiste',
 'FI' : 'La France insoumise',
 'SOC' : 'Parti socialiste',
 'RDG' : 'Parti radical de gauche',
 'DVG' : 'Divers gauche',
 'ECO' : 'Ecologiste',
 'DIV' : 'Divers',
 'REG' : 'Régionaliste',
 'REM' : 'En marche',
 'MDM' : 'Modem',
 'UDI' : 'UDI',
 'LR' : 'Les Républicains',
 'DVD' : 'Divers droite',
 'DLF' : 'Debout la France',
 'FN' : 'Front national',
 'EXD' : 'Divers extrême droite'}




    var titre_scrutin = d3.select('#titre_scrutin');
    var date_scrutin = d3.select('#date_scrutin');
    var texte_scrutin = d3.select('#texte_scrutin');

    var tooltip = d3.select("#tooltip");




d3.queue()
.defer(d3.csv, 'data/results_circo_leg2017T2b.csv')
.await(load_data);

    var map = d3.select("#map");



    var legend_container = d3.select("#legend");


    legend = legend_container.selectAll('.legend')
    .data(d3.entries(nuances_parti))
    .enter()
    .append('div')
    .attr('class', 'legend');

    legend.append('div')
    .attr('class', 'color_legend')
    .style('background-color', function(d){return new_colors_nuances[d.key]});

    legend.append('div')
    .attr('class', 'text_legend')
    .text(function(d){ return d.key + ' : ' + d.value});


function load_data(error, data_circ){

console.log(data_circ);




data_circ.forEach(function(d){

d.json_res_ = JSON.parse(d.reordered_json);
// d.json_res_ = d.json_res_.sort(function(a, b){return b.voix - a.voix});
d.abstentions = +d.abstentions;
d.exprimes = +d.exprimes;
d.inscrits = +d.inscrits;
d.id_circo = d.id_circ;
})


data_circo = data_circ;

console.log(data_circo);
// console.log(data);





}


        d3.xml("data/circonscriptions.svg").mimeType("image/svg+xml").get(function (error, xml) {

            if (error) throw error;

            var imported_svg = xml.documentElement;
            map.node().appendChild(imported_svg);


            svg_map = d3.select('#map').select('svg')
            .attr('id', 'map_circonscriptions')
            .call(responsivefy)
            ;

            var svg_height = parseInt(svg_map.style("height"));
            var svg_width = parseInt(svg_map.style("width"));


             infobox = svg_map.append('g')
            .attr('id', 'infobox')
            .attr('transform', 'translate(500,0)');

            infobox
            .append('rect')
            .attr('id', 'border_rect')
            .attr('width', '146px')
            .attr('height', '100px')
                .attr('fill', 'white')
                .attr('stroke', '#ccc')
                .attr('stroke-width', '1px')
                .style('display', 'none');

                infobox.append('text')
                .attr('id', 'resultats_generaux')
                .attr('x', 30)
                .attr('y', 25);

            // Colorize seat
            for (i in data_circo) {




                var d = data_circo[i];


                if (d.id_circo){
                var this_path = svg_map.select('path[id="' + d.id_circo + '"]');

                this_path.datum(d);

                this_path
                .on('click', function (d) {
                    show_tooltip(d, d3.event.x, d3.event.y)
                })
                ;

                this_path
                .style('fill', function(d){ return new_colors_nuances[d.json_res_[0].nua]})
                .style('fill-opacity', 1);


                // if (d.groupe_sortant){

                // this_path
                // .style('fill', function(d){ return fillColor(d)})
                // .style('fill-opacity', 1);
                // }


                }



            }







            svg_map.selectAll('path').select('title').remove();



d3.select("#tooltip")
.on('click', function(){d3.select("#tooltip").style('display', 'none')});



    })

xScale = d3.scaleLinear()
.range([0, 50])
.domain([0, 60]);


 function fillColor(d){

    var color = d.groupe_sortant ? new_colors_nuances[d.groupe_sortant] : '#999';

return color

 }       

    function show_tooltip(d, x, y) {

      // console.log(d);

        d3.select("#tooltip").style('display', 'block');

        var this_x = (parseInt(d3.select('body').style('width')) > 1149) ? 0 : (((parseInt(svg_map.style('width')) - parseInt(d3.select("#tooltip").style('width')))/2));

        var list_candidates = '';

        for (i in d.json_res_){

          e = d.json_res_[i];

          // console.log(e.voix);
          // console.log(d.exprimes);

          if (['075-01', '986-01', '056-04', '080-05'].indexOf(d.id_circo) == -1){
          
          var if2ndtour = (e.voix / d.inscrits >= 0.125 || i <= 1 ? 'secondTour' : 'pasSecondTour' );

                  }
          else{

            var if2ndtour = i == 0 ? 'secondTour' : 'pasSecondTour' ;
          }

          var this_bar = '<div class="bar_score"><svg width="95px" height="20px"><g><rect fill='+ new_colors_nuances[d.json_res_[i].nua]+
          ' height="10px" width="' +xScale(_.round((e.voix / d.exprimes)*100), 1) + 'px" x="0" y="1"></rect><text x="' + (+xScale(_.round((e.voix / d.exprimes)*100), 1) + 5) + '" y ="11">' +_.round(((e.voix / d.exprimes)*100), 1) +'%</text></g></svg></div>';

            list_candidates += '<div class="candidate_infos">' + this_bar + '<div class="candidate_name ' + if2ndtour + '">' + d.json_res_[i].prenom + ' ' + d.json_res_[i].nom  + 
            ' ('+ (['02a-02', '02b-01', '02a-02', '02b-02'].indexOf(d.id_circo) != -1 && d.json_res_[i].nua == 'REG' ? 'REG / NAT' : d.json_res_[i].nua) +')</div></div>';



        }

        tooltip
        .style("left", this_x + "px")
        .classed('is-active', true)
        .html('<i class="closebox"></i><strong>' + (d.nom_departement ? d.nom_departement : 'NC') + ' ('+  parseInt(d.id_circo.substring(4,6)) + 'e circonscription)'+ "</strong><br />" + 
             '<br /> Résultats :<br /><br />' +
            list_candidates

        );


    }

    function hide_tooltip() {
        tooltip
        .classed('is-active', false);

    }


    function responsivefy(svg) {

        // get container + svg aspect ratio
        var container = d3.select(svg.node().parentNode.parentNode),
        width = parseInt(svg.style('width')),
        height = parseInt(svg.style("height")),
        aspect = width / height;

        var searchboxleft = (parseInt(d3.select('body').style('width')) > 1149) ? $("#map")[0].getBoundingClientRect().right : 0;

         d3.select("#search-wrap")
         .style('left', searchboxleft + 'px');


        // add viewBox and preserve aspectratio properties
        // call resize so that svg resizes on initial page load
        svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMid")
        .call(resize);

        // to register multiple listeners for the same event type
        d3.select(window).on("resize." + container.attr("id"), resize);

        function resize() {

            var targetWidth = parseInt(container.style("width")) < 800 ? parseInt(container.style("width")) : 800;
            var targetHeight = Math.round(targetWidth / aspect);

            // console.log(targetWidth);

            svg.attr("width", targetWidth);
            svg.attr("height", targetHeight);

            // d3.select("#arrow_back").style('bottom', Math.round(targetWidth / aspect)/4 + "px");
            d3.select("#arrow_back").style('top', targetHeight / 4 + "px");

            d3.select("#arrow_forward")
            .style('top', targetHeight / 4 + "px")
            .style('left', targetWidth * .9 + "px");

            var searchboxleft = (parseInt(d3.select('body').style('width')) > 1149) ? $("#map")[0].getBoundingClientRect().right : 0;

                    d3.select("#search-wrap")
                    .style('left', searchboxleft + 'px');

        }
    }


d3.select("#shareTwitter")
.on('click', function(d){ shareTwitter()});

d3.select("#shareFacebook")
.on('click', function(d){ shareFacebook()});

function shareFacebook () {
          var url = encodeURIComponent(window.location.origin + window.location.pathname),
              link = 'http://www.facebook.com/sharer/sharer.php?u=' + url ;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
        };

function shareTwitter () {
          var url = encodeURIComponent(window.location.origin + window.location.pathname),
              text = "Élections %23Legislatives2017 : quels sont les résultats chez vous ? Découvrez-le grâce à notre carte " + url + " via @libe",
              link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
        };