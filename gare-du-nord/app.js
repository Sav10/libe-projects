let allZones,
selected_zone  = [],
svg,
g,
position_tooltip;

/////////// Texte des personnages de la gare du Nord

const all_person = {
'MathieuSabrinaVelib':{
'title':"Mathieu et Sabrina 1",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr",
'img': "img/MATHIEU-SABRINA-ILLUSTRATION.jpg"},
'Disparus':{
'title':"Les disparus",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr",
'img': "img/DISPARUS.jpg"},
'AnitaDoctor':{
'title':"Anita",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr",
'img': "img/ANITA.jpg"},
'HorlogeGareDuNord':{
'title':"L'horloge",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr",
'img': "img/HORLOGE.jpg"},
'OdileCarnet':{
'title':"Odile et ses carnets",
 "text": "Officiellement Odile est « référente sociale de la gare ». Dans les faits: elle retricote des liens avec les sans-abri. Et note tout dans ses carnets.",
'url': "https://www.liberation.fr/societe/gdn-episode-1-odile-et-ses-carnets-dhistoire-20220328_TWBZQBWSEJCDJMRRKC445ADITM/",
'img': "img/CARNET-ODILE.jpg"},
'JeanPierre':{
'title':"Jean-Pierre, un mur de la gare",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr",
'img': "img/JEAN-PIERRE.jpg"},
'MathieuSabrinaTrain':{
'title':"Mathieu et Sabrina",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr",
'img': "img/MATHIEU-SABRINA-PICARDIE.jpg"},
'OdileEquipe':{'title':"L'équipe d'Odile",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr",
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