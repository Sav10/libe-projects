let allzones;


d3.xml("plan-gdn_1.svg")
  .then(data => {
    d3.select("#svg-container").node().append(data.documentElement)


loaded_data()

  });



  function loaded_data(){


 allZones = d3.selectAll('svg g#Zone_Cliquable rect');
 	

allZones
.style('fill', 'blue')
.style('opacity', 0)
.on('mouseover', function(){
let that = this;
console.log(d3.select(that).attr('id'))
}
	)

  }