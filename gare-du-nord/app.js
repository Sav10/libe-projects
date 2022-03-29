let allZones,
selected_zone  = [],
svg,
g,
position_tooltip;

/////////// Texte des personnages de la gare du Nord

const all_person = {
'MathieuSabrinaVelib':{
'title':"Mat et Sab, une histoire de came et d’amour",
 "text": "Tombés dans l’héroïne dans leur Picardie natale, Sabrina et Mathieu ont dégringolé dans le crack à Paris, où tous les deux ont tutoyé la mort.",
'url': "https://www.liberation.fr/societe/gdn-episode-4-mat-et-sab-une-histoire-de-came-et-damour-20220328_YJFBLCTARFBBZKSYRHCMWWR3RM/",
'img': "img/MATHIEU-SABRINA-ILLUSTRATION.jpg"},
'Disparus':{
'title':"Les disparus",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr",
'img': "img/DISPARUS.jpg"},
'AnitaDoctor':{
'title':"Anita, «L’English doctor»",
 "text": "Anita, «L’English doctor», pouvait passer pour un voyageuse lambda. Sauf qu’elle arrivait tous les jours à 5 heures et repartait à 1 heure, ne faisant rien d’autre qu’attendre.",
'url': "https://www.liberation.fr/societe/gdn-episode-3-anita-ienglish-doctor-20220328_KRQ7JUJCTRF7BCA2SND66H6PRE/",
'img': "img/ANITA.jpg"},
'HorlogeGareDuNord':{
'title':"C’est beau une gare, la nuit",
 "text": "La gare ferme ses portes vers 1 heure du matin. Elle se livre alors dans toute sa démesure et son architecture exceptionnelle.",
'url': "https://www.liberation.fr/societe/gdn-episode-6-cest-beau-une-gare-la-nuit-20220328_WY2DVJTMYVHTBEDU2QKEM7YQUU/",
'img': "img/HORLOGE.jpg"},
'OdileCarnet':{
'title':"Les carnets d’Odile",
 "text": "Extraits de carnets, où elle note, au fil de ses maraudes, des mots pour se souvenir de chacun des sans-abri qu’elle rencontre. Portrait en creux de cette agent SNCF, une femme extraordinaire et un métier de l’ombre, pour reconstruire des fils.",
'url': "https://www.liberation.fr/societe/gdn-episode-1-odile-et-ses-carnets-dhistoire-20220328_TWBZQBWSEJCDJMRRKC445ADITM/",
'img': "img/CARNET-ODILE.jpg"},
'JeanPierre':{
'title':"Jean-Pierre, un mur de la gare",
 "text": "Il est arrivé gare du nord, à 20 ans, après un grave accident. Il a 67 ans aujourd’hui, s’apprête à quitter la gare et ressemble au Père Noel. Tout le monde le connaît et s’occupe de lui. L’un des rares sans abri à tenir aussi longtemps sans mourir, ni perdre la tête. Tous les agents s’occupent de lui, les asso…Avec cette question: faut-il aider les comme-lui, ou les laisser jusqu’à ce qu’il se passe qq chose de grave et que les pompiers interviennent? Ils ont monté un dossier pour qu’il ait une place en Ehpad, il vient de partir.",
'url': "https://www.liberation.fr/societe/gdn-episode-2-jp-papi-noel-est-en-or-dur-20220328_Q32SRC46AFFY3MPLCVF4TETWTI/",
'img': "img/JEAN-PIERRE.jpg"},
'MathieuSabrinaTrain':{
'title':"Sabrina et Mathieu, Somme sweet home",
 "text": "On a retrouvé Mathieu et Sabrina, deux ans et demi après leur opération du cœur.  Ils ont fui la Gare du Nord et la drogue et se remplument dans la Somme.",
'url': "https://www.liberation.fr",
'img': "img/MATHIEU-SABRINA-PICARDIE.jpg"},
'OdileEquipe':{'title':"L'équipe d'Odile",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr/societe/gdn-episode-8-sabrina-et-mathieu-somme-sweet-home-20220328_MYGNGCJ4BND6FPI3VWJPQTVIXA/",
'img': "img/ODILE.jpg"}
}

const width_svg = {
  'small' : 1300,
  'middle' : 1000,
  'big' : 768
}

let window_width = parseFloat(d3.select('body').style('width'));

var div = d3.select("#fortip").append("div")
.attr("id", "tooltip")
.attr('class', 'box');

d3.xml("plan-gdn_1.svg")
.then(data => {
  d3.select("#svg-container").node().append(data.documentElement)

  loaded_data()

});

function loaded_data(){

  svg = d3.select('#svg-container svg');
  g = svg.select("g#all_map");
  allZones = g.selectAll('g#Zone_Cliquable rect');

  if (window_width > 1000){
    svg.attr('viewBox', '0 0 1366 768')
  }
  else if (window_width > 600){
    svg.attr('viewBox', '0 0 1366 1068')
  }
  else {
    svg.attr('viewBox', '0 0 1366 1268')
  }


  allZones
  .style('fill', 'red')
  .style('opacity', 0)
  .on('mouseover', function(){

    if (window_width >= 500){
      draw_circle(this)
    }
  }
  )
  .on('mouseout', function(){

    if (window_width >= 500){

      d3.selectAll('#Zone_Cliquable circle').remove()

    }

  })

  allZones
  .on('click', function() {

    let this_id = d3.select(this).attr('id')
    let this_d = all_person[this_id]

    d3.select('#tooltip').style('pointer-events', 'auto');

    this_position = this.getBoundingClientRect();
    position_tooltip = positioning_tooltip(this_position)
    selected_zone = [this, this_d, position_tooltip]

    show_tooltip(this_d, selected_zone[2])

  })

  svg.call(d3.zoom()
    .extent([[0, 0], [1366, 768]])
    .scaleExtent([1, 9])
    .on("zoom", zoomed));

  function zoomed({transform}) {
    g.attr("transform", transform);
  }

  if (window_width > 500){
    g
    .attr('transform', 'translate(-470, -243) scale(1.8)')
  }
  else{
    g
    .attr('transform', 'translate(-950, -460) scale(2.8)')
  }
}

d3.select('body').on("click",function(){
  var outside = allZones.filter(equalToEventTarget).empty();
  if (outside) {
    hide_tooltip()
    selected_zone = [];

  }
});

function positioning_tooltip(this_position){

  if (window_width < 500){

    position_tooltip = [0, (window.scrollY + 30)]
  }

  else{

    let position_svg = svg.node().getBoundingClientRect();
    position_tooltip = [(this_position.x - position_svg.x -20),
    (this_position.y - position_svg.y)]
    position_tooltip[1] = position_tooltip[1] < (window.scrollY + 20) ? (window.scrollY + 20) : position_tooltip[1];
    position_tooltip[0] = position_tooltip[0] < position_svg.x ? position_svg.x : position_tooltip[0];

  }

  return position_tooltip

}

function show_tooltip(d, position_tooltip) {

 var d = d.data ? d.data : d;

 if (d){
  d3.select("#tooltip").style('display', 'block');

  if (position_tooltip){
    var dx = position_tooltip[0]
    var dy = position_tooltip[1]

  }
  else
  {

  }

  var this_inner_html = `
  <a href="${d.url}" target="_blank"><img src="${d.img}"" width="200px"></a>
  <div id="text_tooltip">
   <a href="${d.url}" target="_blank"><h2> ${d.title}</h2></a>
  ${d.text}<br /><br />
  <a href="${d.url}" target="_blank"> LIRE LA SUITE</a>
  <br /><br />
  </div`;

  d3.select("#tooltip")
  .classed('is-active', true)
  .html(this_inner_html);

  dy = dy > (window.scrollY + 30) ? (window.scrollY + 30) : dy;

  d3.select("#tooltip")
  .style("left", (dx) + "px")
  .style("top", (dy) + "px");

}

}

function hide_tooltip() {

  d3.select("#tooltip")
  .classed('is-active', false);

  d3.select("#tooltip")
  .style('display', 'none');

}

function equalToEventTarget() {
  return this == event.target;
}

function draw_circle(selection_node){

  d3.selectAll('#Zone_Cliquable circle').remove()

  let this_sel = d3.select(selection_node)
  let this_center_x = parseFloat(this_sel.attr('x')) + parseFloat(this_sel.attr('width') /2 )
  let this_center_y = parseFloat(this_sel.attr('y')) + parseFloat(this_sel.attr('height') /2 )

  d3.select('#Zone_Cliquable')
  .append('circle')
  .attr('cx', this_center_x)
  .attr('cy', this_center_y)
  .attr('r', 10)
  .attr('stroke', 'red')
  .attr('stroke-dasharray', 3)
  .attr('fill', 'red')
  .attr('fill-opacity', 0.3)

}