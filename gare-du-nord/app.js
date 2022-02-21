let allZones,
selected_zone  = [],
svg,
g;

let all_person = {
'MathieuSabrinaVelib':{
'title':"Mathieu et Sabrina 1",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr"},
'Disparus':{
'title':"Les disparus",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr"},
'AnitaDoctor':{
'title':"Anita",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr"},
'HorlogeGareDuNord':{
'title':"L'horloge",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr"},
'OdileCarnet':{
'title':"Les carnets d'Odile",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr"},
'JeanPierre':{
'title':"Jean-Pierre",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr"},
'MathieuSabrinaTrain':{
'title':"Mathieu et Sabrina",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr"},
'OdileEquipe':{'title':"L'équipe d'Odile",
 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
'url': "https://www.liberation.fr"}
}


var div = d3.select("#fortip").append("div")
    .attr("id", "tooltip")
    .attr('class', 'box');

d3.xml("plan-gdn_1.svg")
  .then(data => {
    d3.select("#svg-container").node().append(data.documentElement)


loaded_data()

  });



  function loaded_data(){


 allZones = d3.selectAll('svg g#Zone_Cliquable rect');
 	

allZones
.style('fill', 'red')
.style('opacity', 0)
.on('mouseover', function(){

let this_id = d3.select(this).attr('id')
let this_position = this.getBoundingClientRect();
let this_d = all_person[this_id]

// let position_tooltip= [parseFloat(d3.select(this).style('x')),  parseFloat(d3.select(this).style('y'))]


let position_tooltip = [(this_position.x - d3.select('#svg-container svg').node().getBoundingClientRect().x),
						  (this_position.y - d3.select('#svg-container svg').node().getBoundingClientRect().y)]


show_tooltip(this_d, position_tooltip)


}
	)
.on('mouseout', function(){


    if (selected_zone.length > 0){

     show_tooltip(selected_zone[1], selected_zone[2])}

    else{

	hide_tooltip() 

}

})



  allZones
  .on('click', function() {

let this_id = d3.select(this).attr('id')
let this_d = all_person[this_id]
show_tooltip(this_d)

// let position_tooltip= [parseFloat(d3.select(this).style('x')),  parseFloat(d3.select(this).style('y'))]

let this_position = this.getBoundingClientRect();


let position_tooltip= [(this_position.x - d3.select('#svg-container svg').node().getBoundingClientRect().x),
						  (this_position.y - d3.select('#svg-container svg').node().getBoundingClientRect().y)]

selected_zone = [this, this_d, position_tooltip]


    show_tooltip(this_d, selected_zone[2])

    // allPaths
    // .style('stroke-opacity', .5)
    // .style('fill-opacity', .5)
    // d3.select(this)
    // .style('fill-opacity', 1)
    // .style('stroke-opacity', 1)
    // .style('stroke-width', 2)

  })


svg = d3.select('#svg-container svg');


g = svg.select("g#all_map");

svg.call(d3.zoom()
      .extent([[0, 0], [1366, 768]])
      .scaleExtent([1, 8])
      .on("zoom", zoomed));

  function zoomed({transform}) {
    g.attr("transform", transform);
  }




  }


d3.select('body').on("click",function(){
    var outside = allZones.filter(equalToEventTarget).empty();
    if (outside) {
    hide_tooltip()
selected_zone = [];

    // allPaths
    // .style('stroke-opacity', .8)
    // .style('fill-opacity', 1)

    // d3.select(this)
    // .style('fill-opacity', 1)
    // .style('stroke-opacity', 0.5)
    // .style('stroke-width', 1)


    }
});






function show_tooltip(d, position_tooltip) {

 var d = d.data ? d.data : d;

 if (d){
    d3.select("#tooltip").style('display', 'block');


    if (position_tooltip){
    var dx = position_tooltip[0]
    var dy = position_tooltip[1] - 80

    }
    else
    {

    // var dx = d3.event.pageX;
    // var dy = d3.event.pageY - 28;

    }

    // var this_chart_width = Math.round(svgGraphContainer.node().getBBox().width);
    // var this_chart_right = d3.select('#chart svg').node().getBoundingClientRect().right;

        var this_inner_html = `
        <h2> ${d.title}</h2><br />
         ${d.text}<br />
         <a href="${d.url}" target="_blank"> LIRE LA SUITE</a>`;


d3.select("#tooltip")
.classed('is-active', true)
.html(this_inner_html);

var thisTooltip = d3.select('#tooltip').node().getBoundingClientRect();

// if (dx > (this_chart_right - thisTooltip.width)){

// dx = (this_chart_right - thisTooltip.width - 10)

// }

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
    return this == d3.event.target;
}