let all_data = {};
let filtered_data;
let data_textes_;
let those_filters = [0,0,0]
let objClassColor = {}
let this_selected_type;
let all_filtered_groups;
let selected_reg = null;
let selected_year = 2024;
let all_states_2024;


let scale_jauge = d3.scaleLinear()
.domain([0,538])


d3.xml("img/LIB-2024-11-05-Elections-US-Carte-2020.svg")
.then(data => {
  d3.select("#svg-container-map").node().append(data.documentElement)


d3.select('#carte_2020')
.style('display', 'none')

})



d3.xml("img/LIB-2024-11-05-Elections-US-Carte-2024.svg")
.then(data => {
  d3.select("#svg-container-map").node().append(data.documentElement)



d3.selectAll('g#GE-2024 > g, g#GE-2020 > g')
.on('click', function(event, d) {

  let this_class = d3.select(this).attr('class');
  let this_id = d3.select(this).attr('id');



  showTip(this_id)
  })

d3.selectAll("#representation_carto .actionButton").on('click', function(event, d) {

  let this_id = d3.select(this).attr('id');


d3.selectAll("#representation_carto .actionButton")
.style('border-color', 'white')
.style('background-color', 'white')
.style('color', '#1F0657')


d3.selectAll("#representation_carto .actionButton#" + this_id)
.style('border-color', '#1F0657')
.style('background-color', '#1F0657')
.style('color', 'white')


selected_year = +this_id.replace('display_', '')

 drawrects()




})





d3.selectAll('#Regions path')
.on('mouseover', function(event, d) {
  let this_id = d3.select(this).attr('id');

d3.select(this)
.style('fill', '#D13A34')


}
  )
.on('mouseout', function(event, d) {
  let this_id = d3.select(this).attr('id');

d3.select(this)
.style('fill', '#1A1A1A')


if(selected_reg){
d3.select('#Regions #' + selected_reg)
.style('fill', '#D13A34')
}


}
  )

d3.selectAll('g#Boutons-Region g')
.on('mouseover', function(event, d) {
  let this_id = d3.select(this).attr('id');

d3.select('#Regions #' + this_id.replace('-2', ''))
.style('fill', '#D13A34')


}
  )
.on('mouseout', function(event, d) {
  let this_id = d3.select(this).attr('id');

d3.select('#Regions #' + this_id.replace('-2', ''))
.style('fill', '#1A1A1A')


if(selected_reg){
d3.select('#Regions #' + selected_reg)
.style('fill', '#D13A34')
}


}
  )



Promise.all([
    d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQJ3qJpwHX0Uy7CrUfy7y7il30V_-u0teMmBU6pRxvXNMjcPj0ZuwG8er3vOMtY0ppHEo8_Nr91zLKY/pub?gid=0&single=true&output=csv"),
    d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQJ3qJpwHX0Uy7CrUfy7y7il30V_-u0teMmBU6pRxvXNMjcPj0ZuwG8er3vOMtY0ppHEo8_Nr91zLKY/pub?gid=400771796&single=true&output=csv")
]).then(function(files) {
  ready(files[0], files[1])
}).catch(function(err) {
  console.log(err)
})
});

function ready(data_2024,data_2020) {

// data_textes_ = data_textes

// all_data = _.cloneDeep(data_textes_).map(function(d){ 
//     return {'ville':d.ville,
//            'famille_ideologique' : d.famille_ideologique,
//            'nom du groupe' : d['nom du groupe'],
//            'nom_pour_carte' : d.nom_pour_carte,
//         'dissous' : d.dissous}})


data_2024 = data_2024.filter(d=>d.Code)

data_2020 = data_2020.filter(d=>d.Code)


all_data[2020] = data_2020

all_data[2024] = data_2024





all_data[2020].forEach((d) => {

d['pct_dem'] = +(d['Démocrates_%'].replace(',', '.').replace('%', ''))
d['pct_rep'] = +(d['Républicains_%'].replace(',', '.').replace('%', ''))
d['dem_GE'] = +d["Démocrates_GE"]
d['rep_GE'] = +d["Républicains_GE"]
d['votes_dem'] = +(d['Démocrates_Votes'].replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''))
d['votes_rep'] = +(d['Républicains_Votes'].replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''))
d['Grand_electeurs_2020'] = +d["Grand_electeurs_2020"]

})

// filtered_data = all_data;



all_data[2024].forEach((d) => {

d['dem_GE'] = +d["Démocrates_GE"]
d['rep_GE'] = +d["Républicains_GE"]
d['Grand_electeurs_2024'] = +d["Grand_electeurs_2024"]
d['non_parvenus'] = +d["Résultats_non_parvenus"]

})



all_states_2024 = d3.selectAll('g#GE-2024 > g')



all_states_2024.nodes().forEach((n) => {

let sel = d3.select(n)


let d = all_data[2024].filter(d=>d.Code == sel.attr('id'))[0]

sel.datum(d)


sel.selectAll('polygon').nodes().forEach((n2) => {

let sel2 = d3.select(n2)

sel2.datum(d)

})




})



// all_filtered_groups = _.uniq(all_data.map(d=>d.nom_pour_carte))

// console.log(data_textes_)

drawrects()
color_state()

  }



function drawrects(){

let sum_demGE = d3.sum(all_data[selected_year].map(d=>d.dem_GE))
let sum_repGE = d3.sum(all_data[selected_year].map(d=>d.rep_GE))

let rect_total_width = +d3.select("#bar_progression #grey_rect").attr('width')

d3.selectAll('#bar_progression svg #dem_bar, #bar_progression svg #rep_bar, #bar_progression svg #middle_bar, #bar_progression svg #electors_dem_num, #bar_progression svg #electors_rep_num').remove()


if(selected_year == 2020){
d3.select('.incubents_names #democrat_name')
.text('JOE BIDEN')

d3.select('svg#carte_2024')
.style('display', 'none')


d3.select('svg#carte_2020')
.style('display', 'block')

}
else{
d3.select('.incubents_names #democrat_name')
.text('KAMALA HARRIS')

d3.select('svg#carte_2024')
.style('display', 'block')


d3.select('svg#carte_2020')
.style('display', 'none')

}




scale_jauge
.range([0,rect_total_width])



d3.select('#bar_progression svg g')
.append('rect')
.attr('id', 'dem_bar')
.attr('fill', '#006994')
.attr('height', 30)
.attr('x', 0)
.attr('y', 0)
.attr('width', scale_jauge(sum_demGE))


d3.select('#bar_progression svg g')
.append('rect')
.attr('id', 'rep_bar')
.attr('fill', '#FF0000')
.attr('height', 30)
.attr('x', rect_total_width - scale_jauge(sum_repGE))
.attr('y', 0)
.attr('width', scale_jauge(sum_repGE))


d3.select('#bar_progression svg g')
.append('rect')
.attr('id', 'middle_bar')
.attr('fill', '#1F0657')
.attr('height', 35)
.attr('x', (rect_total_width/2 -1))
.attr('y', -5)
.attr('width', 2)


d3.select('#bar_progression svg g')
.append('text')
.attr('id', 'electors_dem_num')
.attr('fill', 'white')
.attr('stroke', '#006994')
.attr('x', 0)
.attr('y', 25)
.attr('text-anchor', 'start')
.text(sum_demGE)


d3.select('#bar_progression svg g')
.append('text')
.attr('id', 'electors_rep_num')
.attr('fill', 'white')
.attr('stroke', '#FF0000')
.attr('x', rect_total_width)
.attr('y', 25)
.attr('text-anchor', 'end')
.text(sum_repGE)


}



function color_state(){


if (selected_year == 2020){
  return
}

all_states_2024.filter(d=>d.Systeme_electoral == "Winner takes all")
.selectAll('polygon')
.style('fill', function(d){

  // console.log(d)
  let c = d.dem_GE ? '#006994' : d.rep_GE ? 'red' : 'rgb(221, 221, 221)'

  return c

})


all_states_2024.filter(d=>d.Systeme_electoral != "Winner takes all")
.selectAll('polygon')
.style('fill', function(d, i){


let c
  if (d.dem_GE  >= i+1){
    c = '#006994'
  }
  else if(d.rep_GE  + d.dem_GE  >= i+1){
    c = 'red'
  }
  else{
    c = 'rgb(221, 221, 221)'
  }



  return c

})


}



function showTip(that_class){

// let this_d = all_data.filter(d=>d.this_class == that_class)[0]


// let this_obj_texte = data_textes_.filter(d=>d.nom_pour_carte == that_class)[0]




let this_obj = all_data[selected_year].filter(d=>d.Code == that_class)[0]

selected_reg = that_class


d3.selectAll('#Regions path')
.style('fill', '#1A1A1A')


d3.select('#Regions path#' + that_class)
.style('fill', '#D13A34')




let this_color = '#1A1A1A'


/*let those_links = personal_link.filter(d=>d.includes(that_class)).map(d=>d.filter(e=>e != that_class)).flat()*/

let enlien_blocs = ""

/*'Code', 'Etats_US', 'Etats_FR', 'Swing_states', 'Systeme_electoral', 'Grand_electeurs_2024', 'Résultats_non_parvenus', 'Démocrates_GE', 'Républicains_GE', 'Notes ', 'dem_GE', 'rep_GE', 'non_parvenus'*/
// console.log(this_color)

let this_html = `<div class="box_element_line entete">
<img id="close_popup" src="img/Croix.png">
<div class="box_element_col">
<h3>${this_obj.Etats_FR}</h3>
<div>${this_obj.Grand_electeurs_2024} grands électeurs</div>`

if (this_obj.non_parvenus != this_obj.Grand_electeurs_2024){

if (this_obj.dem_GE){
  this_html += `<div style="color:#006994">Kamala Harris (${this_obj.dem_GE})</div>`
}

if (this_obj.rep_GE){
  this_html += `<div style="color:red">Donald Trump (${this_obj.rep_GE})</div>`
}

}

this_html +=`</div>
</div>`


d3.select('#tooltip')
.style('display', 'flex')

d3.select('#map_info')
.style('visibility', 'visible')

d3.select('#tooltip')
.html(this_html)
.style('opacity', '1')
.style('display', 'flex')

all_states_2024
.selectAll('polygon')
.style('fill-opacity', .3)

d3.select('#GE-2024 g#' +selected_reg )
.selectAll('polygon')
.style('fill-opacity', 1)



}

d3.select('body').on("click",function(event, d){



    var outside = d3.selectAll("#Carte-2024 polygon").filter(equalToEventTarget).empty();

    // var outside = d3.select(event.path[0]).attr('class') != 'cls-1'
    if (outside) {


d3.select('#map_info')
.style('visibility', 'hidden')

d3.select('#tooltip')
.style('display', 'none')


all_states_2024
.selectAll('polygon')
.style('fill-opacity', 1)


    }
else{


if (event.target.nodeName == 'IMG' ){

let this_class = d3.select(event.target).attr('class')

showTip(this_class.replace('-2', ''))

}

}
});

function equalToEventTarget() {
 return this == event.target;
    }

d3.select("#information_button")
.on("mouseover", function(){

d3.select("#map_information")
.style('display', 'block')

})
.on("mouseout", function(){

d3.select("#map_information")
.style('display', 'none')

})
