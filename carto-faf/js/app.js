
let all_data;

let filtered_data;

let those_filters = [0,0,0]

let all_filtered_classes

obj_group_class =  {
    "Les Natifs": "TIF",
    "Némésis": "NEM",
    "La Cocarde": "COC",
    "GUD Paris (et luminis)": "GUD",
    "Action française Paris": "AF-P",
    "Equipe Communautaire Paris": "EQU",
    "Auctorum": "AUC",
    "Remes patriam": "REM",
    "Aurora Lorraine": "AUR",
    "Parti de la France Beauvais": "PDF-B",
    "Parti de la France Nancy" : "PDF-N",
    "Hélix Dijon": "HEL",
    "Ratons nationalistes": "RAT",
    "Vandals Bezak": "VDL",
    "Bourg en Bresse nationaliste": "BOUR",
    "Active Club Grenoble": "ACT",
    "Edelweiss": "EDE",
    "Syndicat des fleuristes": "FLE",
    "15.43": "QUIN",
    "Aquila Popularis": "AQU",
    "Zoulous Nice": "ZOU",
    "Defend Marseille": "DEF",
    "Tenesoun": "TEN",
    "Action française Lille": "AF-L",
    "Action française Nantes": "AF-N",
    "Action française Aix-Marseille": "AF-M", 
    "Les remparts": "REMP",
    "Audace Lyon": "AUD",
    "Lyon Populaire": "LYO",
    "Unité Sud Perpignan": "UNI",
    "La Ligue du Midi": "LIG-M",
    "Les Nationalistes": "NAT",
    "Patria Albiges": "PAT",
    "Furie française": "FUR",
    "Clermont non conforme": "CLER",
    "Bastide bordelaise": "BAS",
    "Civitas": "CIV",
    "Sophia Polis": "SOP",
    "Animus Fortis": "ANI",
    "Des Tours et des Lys": "TOUR",
    "Jeunesse Angevine": "JAN",
    "RED Angers": "RED",
    "La Caraque": "CAR",
    "La Ligue ligérienne": "LIG-L",
    "An Tour-Tan": "ANT",
    "L'Oriflamme": "ORI",
    "Meduana Noctua": "MED",
    "Academia Christiana": "ACA",
    "Aurelianorum Corda": "COR",
    "les Normaux": "NOR",
    "La Citadelle": "CIT"
}




d3.xml("img/LIB-2023-08-29-SVG-Carte.svg")
.then(data => {
  d3.select("#svg-container-map").node().append(data.documentElement)

  // loadMapFromSvgDep(data_dep)

let svg_container = 'svg-container-map'


// geo_objects['departement']['data'] = data_dep;

// loadMapFromSvgGeneric(data_dep, svg_container, circle_range, location_variable, location_prefix, location_type)

console.log('loading')


d3.selectAll('path').style('fill', 'none')

d3.select('g#Carte path').style('fill', '#182856').style('stroke', '#182856')




// d3.select(d3.selectAll("#CONTOUR circle").nodes()[0]).attr('fill')


d3.selectAll("#CONTOUR circle").nodes().forEach((n) => {
  let d = d3.select(n)

  let this_color = d.attr('fill')

  let this_class = d.attr('class')
  d3.select('#Fils .' + this_class).style('stroke', this_color)


});

d3.selectAll("#CONTOUR circle")
.on('click', function(event, d) {

  let this_class = d3.select(this).attr('class');
  console.log(this_class)

  showTip(this_class)
    // selected_dep = [this, d];
    // showTip(data, d, location_variable)
    // all_those_paths
    // .style('fill-opacity', .5)
    // d3.select(this)
    // .style('fill-opacity', 1)
  })


Promise.all([
    d3.csv("data/data.csv"),
]).then(function(files) {
  ready(files[0])
}).catch(function(err) {

  console.log(err)
})


});



  function ready(data) {


data.forEach((d) => {

  d['this_class'] = obj_group_class[d.nom_groupe]
});

console.log(data)


all_data = data;

filtered_data = all_data;


all_filtered_classes = _.uniq(filtered_data.map(d=>d.this_class))


filter_options('')


  }


function filter_groups(selected_type) {

filtered_data = _.cloneDeep(all_data)

if (those_filters[0] != 0){
  filtered_data = filtered_data.filter(d=>d.ville == those_filters[0])
}

if (those_filters[1] != 0){
  filtered_data = filtered_data.filter(d=>d.famille_ideologique == those_filters[1])
}

if (those_filters[2] != 0){
  filtered_data = filtered_data.filter(d=>d.nom_groupe == those_filters[2])
}

all_filtered_classes = _.uniq(filtered_data.map(d=>d.this_class))

console.log(all_filtered_classes)

console.log(filtered_data)


filter_options(selected_type)

  }



function filter_options(selected_type){




console.log(selected_type)


let all_villes = _.uniq(filtered_data.map(d=>d.ville))
let all_groups = _.uniq(filtered_data.map(d=>d.nom_groupe)).sort()
let all_ideologies = _.uniq(filtered_data.map(d=>d.famille_ideologique)).sort()

let all_selected_classes = _.uniq(filtered_data.map(d=>d.famille_ideologique))

d3.selectAll('#Groupes text,#LOGO-OK image,#Fils path')
.style('visibility', 'hidden');

d3.selectAll('#CONTOUR circle')
.style('fill', 'grey')

d3.selectAll('.'+all_filtered_classes.filter(d=>d != null).join(',.'))
.style('visibility', 'visible')

d3.selectAll('circle.'+all_filtered_classes.filter(d=>d != null).join(',circle.'))
.style('fill', null)

d3.selectAll('#'+all_filtered_classes.filter(d=>d != null).join(',#'))
.style('visibility', 'visible')




all_villes.unshift('Toutes');
all_groups.unshift('Tous');
all_ideologies.unshift('Toutes');

console.log(all_villes)

if(those_filters == [0,0,0] && selected_type != ''){

  console.log('is selected 0')
}
else if(selected_type == 'cities'){

}
else {


  console.log("changing filters 1")

let cities_selection = d3.select('#cities-select').selectAll('option')
.data(all_villes)
.join('option')
.attr('class', 'display_element')
.text(d=> d)


d3.select('#cities-select')
.on('change', function(d){
    let this_prop = d3.select(this).property('value');
    console.log(this_prop)
    if (this_prop == 'Toutes'){
      those_filters[0] = 0;
        }
    else{
      those_filters[0] = this_prop;
    }

    filter_groups('cities')


  })


}

if(those_filters == [0,0,0] && selected_type != ''){

  console.log('is selected 0')
}
else if(selected_type == 'ideologies'){
  console.log('is ideology')
}
else{

  console.log("changing filters 2")

let ideologies_selection = d3.select('#ideology-select').selectAll('option')
.data(all_ideologies)
.join('option')
.attr('class', 'display_element')
.text(d=> d)

d3.select('#ideology-select')
.on('change', function(d){
    let this_prop = d3.select(this).property('value');
    console.log(this_prop)
        if (this_prop == 'Toutes'){
      those_filters[1] = 0;
        }
    else{
      those_filters[1] = this_prop;
    }

    filter_groups('ideologies')
  })

}


if(those_filters == [0,0,0] && selected_type != ''){

  console.log('is selected 0')
}
else if(selected_type == 'groups'){
}
else{

  console.log("changing filters 3")


let group_selection = d3.select('#group-select').selectAll('option')
.data(all_groups)
.join('option')
.attr('class', 'display_element')
.text(d=> d)






d3.select('#group-select')
.on('change', function(d){
    let this_prop = d3.select(this).property('value');
    console.log(this_prop)
        if (this_prop == 'Tous'){
      those_filters[2] = 0;
        }
    else{
      those_filters[2] = this_prop;
    }

    filter_groups('groups')
  })


}

}


function showTip(that_class){


let this_d = all_data.filter(d=>d.this_class == that_class)[0]

console.log(this_d)

// <image width="100" height="100" id="QUIN" xlink:href=""




let this_html



this_html = `<div class="box_element_line">
<div class="box_element_col"><img width="100" height="100" src="img/logos/${that_class}.jpg"></div>
<div class="box_element_col" style="margin-left:1em"><span>${this_d.ville}</span><h3>${this_d.nom_groupe}</h3>  <span>${this_d.famille_ideologique}</span></div>
</div>
<div class="box_element_line">
Lorem ipsum dolor sit amet. Eos iure nihil et molestiae saepe est voluptatem natus. 
Et porro laborum eos ratione quod sit itaque nihil. 
Et debitis assumenda et unde vitae ab dolorem libero. 
Vel placeat veniam aut beatae maiores et deleniti sunt ad sint quod
</div>`



d3.select('#tooltip')
.style('display', 'flex')

d3.select('#map_info2')
.style('visibility', 'visible')

d3.select('#tooltip')
.html(this_html)
.style('opacity', '1')
.style('display', 'flex')

}



/// Click function for shape

d3.select('body').on("click",function(event, d){


    var outside = d3.selectAll("#CONTOUR circle").filter(equalToEventTarget).empty();
    // var outside = d3.select(event.path[0]).attr('class') != 'cls-1'
    if (outside) {

      
    // reset_tooltip()



/*    all_those_paths
    .style('fill-opacity', 1)

    d3.selectAll('path')
    .style('fill-opacity', 1)*/
d3.select('#map_info2')
.style('visibility', 'hidden')

d3.select('#tooltip')
.style('display', 'none')


    }
else{
}



});


function equalToEventTarget() {
 return this == event.target;
    }
