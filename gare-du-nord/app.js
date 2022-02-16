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

console.log(all_person[let_this_id].title)
}
	)

  }