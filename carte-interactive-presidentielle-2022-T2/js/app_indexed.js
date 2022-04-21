    var searchIndex,
    mapped,
    find_school,
    asbetos_data_,
    data_;

    d3.queue()
    // .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcHL3XxOZ9um6FGGsNJMX9xq3Bk0w9yGnT6uffzEYkC44_ILLllx7Eit0QY6pE0yDcEOIUt2iQmYs0/pub?gid=1360208169&single=true&output=csv')
    .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSpuAtOBAKV4qtLEkCl2mdBfmDkU1GCdCpDfCZ-is3-KIIuwpQyJZXlH1zw-Ai5tyRhvcnL416uAhBU/pub?gid=192028368&single=true&output=csv')
    .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSpuAtOBAKV4qtLEkCl2mdBfmDkU1GCdCpDfCZ-is3-KIIuwpQyJZXlH1zw-Ai5tyRhvcnL416uAhBU/pub?gid=1430289231&single=true&output=csv')
    // .defer(d3.json, 'static/data/departements.json')
    .await(load_Data);

    function load_Data(error, data, asbetos_data){

      asbetos_data_ = asbetos_data;

      // data_ = data;

// console.log(data)
// console.log(asbetos_data)


data.forEach(function(d){

  d.nom = d.Nom ? d.Nom : d.nom;

})

searchIndex = new FlexSearch({

    encode: "icase",
    tokenize: "strict",
    threshold: 1
    // async: true,
    // worker: 4
});

mapped = _.mapValues(_.keyBy(data, 'code'), 'nom')

// for (i in data){
//   var d = data[i];
//   searchIndex.add(d['code'], d['nom'])
// }

searchIndex.import(new_index2, {serialize: false});

d3.select('#find_school')
.style('display', 'block');

d3.select('#img_spinner')
.style('display', 'none');

find_school =  function (query){

  var list_index =  searchIndex.search(removespecials(query));

  return list_index.map(d=> [mapped[d], d])

}

d3.select('#find_school')
.on('input', function(){
	var this_val = d3.select(this).property('value');
	if (this_val.length > 3){
		var this_result = find_school(this_val)
		d3.select('#resultat_diagnostic')
		.html('')
		populateResults(this_result)
	}
	else{
		populateResults([])
	}
	// console.log(d3.select(this).property('value'))
})

}

function populateResults(data_){

  var this_selection = d3.select('#all_results').selectAll('li.entry')
  .data(data_);

  this_selection.exit().remove();

  this_selection
  .select('li a')
  .html(function(d){return d[0]})

  this_selection
  .enter()
  .append('li')
  .attr('class', 'entry')
  .append('a')
  .html(function(d){return d[0]})

  d3.selectAll('#all_results li.entry a')
  .on('click', function(d){
    populateResults([])
    console.log(d);
    var this_obj = _.find(asbetos_data_, e => e.uairne == d[1])
    console.log(this_obj);
    if (this_obj){

      let this_html = 
      `${d[0]}`

      this_html += 
      `<br />Date du dernier permis de construire : <strong>${this_obj.permis_construire}</strong>
      <br />Diagnostic effectué : <strong>${this_obj.dta}</strong>`;

      if (this_obj.dta == 'OUI'){
       this_html += 
       `<br />Tous les locaux ont été visités : <strong>${this_obj.tous_locaux_visites}</strong>
       <br />Date de dernière actualisation du diagnostic : <strong>${this_obj.date_actualisation_dta}</strong>
       <br />Présence d'amiante : <strong>${this_obj.presence_amiante}</strong>
       `
     }

     if (this_obj.presence_amiante == 'OUI'){
       this_html += 
       `<br />Obligation de surveillance ? : <strong>${this_obj.obligation_surveillance}</strong>
       `
     }

     if (this_obj.obligation_surveillance == 'OUI'){
       this_html += 
       `<br />Date de la dernière visite de surveillance : <strong>${this_obj.date_derniere_visite}</strong>
       `
     }

     if (this_obj.presence_amiante == 'OUI'){
       this_html += 
       `<br />Obligation de mesure du taux d\'empousièrement : <strong>${this_obj.obligation_mesure_taux_empoussierement}</strong>
       <br />Obligation de travaux : <strong>${this_obj.obligation_travaux}</strong>
       <br />Diagnostic consultable : <strong>${this_obj.dta_consultable}</strong>
       `
     }

     if (this_obj.dta_consultable == 'OUI' && this_obj.lieu_dta_consultable){
       this_html += 
       `<br />Lieu de consultation du diagnostic : <strong>${this_obj.lieu_dta_consultable}</strong>
       `
     }

     if (this_obj.precision){
       this_html += 
       `<br />Precision : <strong>${this_obj.precision}</strong>
       `
     }

     d3.select('#resultat_diagnostic')
     .html(this_html)	

   }
   else{

    let this_html = 
    `${d[0]}
    <br />Pas de résultat pour cet établissement`

    d3.select('#resultat_diagnostic')
    .html(this_html)
  }

})

}

var removespecials = function (str){
  return str.replace(/[èéêëœ]/g,"e").replace(/[àáâãäåæ]/g,"a").replace(/[ç]/g,"c").replace(/[ìíîï]/g,"i").replace(/[ðñòóôõö]/g,"o").replace(/[ùúûü]/g,"u").replace(/[ýÿ]/g,"y")
};

var prettyfy_string = function(string){return string.replace(" ","_").replace("'","_").replace("(","_").replace(")","_")};

function addSpacesFr(nStr)
{
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ' ' + '$2');
  }
  return x1;
}

function normalizeString(s){
 return _.snakeCase(_.deburr(s))
}

serialize_for_url = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
  }

  d3.selectAll(".shareTwitter")
  .on('click', function(d){ shareTwitter()});

  d3.selectAll(".shareFacebook")
  .on('click', function(d){ shareFacebook()});

  function shareFacebook () {
    var url = encodeURIComponent(window.location.origin + window.location.pathname),
    link = 'http://www.facebook.com/sharer/sharer.php?u=' + url ;
    window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
  };

  function shareTwitter () {
    var url = encodeURIComponent(window.location.origin + window.location.pathname),
    text = "Chronologie des arrêtés anti pesticides https://www.liberation.fr/apps/2020/01/chronologie-des-arretes-anti-pesticides/ via @libe",
    link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
    window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');

  }