let allzones;

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

let_this_id = d3.select(this).attr('id')

// console.log(d3.event);

console.log(all_person[let_this_id].title)

show_tooltip(all_person[let_this_id])


}
	)
.on('mouseout', function(){hide_tooltip() })



  }




function show_tooltip(d) {

 var d = d.data ? d.data : d;

 if (d){
    d3.select("#tooltip").style('display', 'block');

    var dx = d3.event.pageX;
    var dy = d3.event.pageY - 28;

    // var this_chart_width = Math.round(svgGraphContainer.node().getBBox().width);
    // var this_chart_right = d3.select('#chart svg').node().getBoundingClientRect().right;

        var this_inner_html = `
        <h3> ${d.title}</h3><br />
         ${d.text}<br />
         <a href='${d.link}'> Lire l'article</a>`;


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