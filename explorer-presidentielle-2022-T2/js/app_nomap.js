var margin = { top: 50, right: 90, bottom: 130, left: 100 },
width = 600 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom,
widthHandle = 10,
radiusHandle = 12,
handleHeight = 10,
bandwidth = 6,
transition_duration = 300,
gbar,
data_chart,
data_full = {},
active_year = 'y2022T2',
colorNames = {},
candidats_panneaux = {},
percentageCalculated = 0,
mymap,
markerGroup,
chart_made = 0,
data_loaded = {y2017:0, y2012:0, y2022:1},
automatic_chart_update = 0,
update_source_event = 0,
competitors_pannels = {},
T2_clicked = 0;

var margin_progress = { top: 10, right: 70, bottom: 10, left: 180 },
width_progress = 600 - margin_progress.left - margin_progress.right,
height_progress = 100 - margin_progress.top - margin_progress.bottom;

var marginSlider = { top: -40, right: 18, bottom: 40, left: 20 },
    widthSlider = 300,
    heightSlider = 900,
    bandwidthSlider = 10,
    textPaddingSlider = 25,
    paddingSlider = 1.1;


colorNames['y2017']  = {
  "Dupont-Aignan":"#75398a",
  "Le Pen":"#2e2b5a",
  "Macron":"#ffb400",
  "Hamon":"#d82c5d",
  "Lassalle":"#e85d21",
  "Fillon":"#0058a2",
  "Mélenchon":"#e10f21",
  "Poutou":"#961e1e",
  "Arthaud": "#781f1c",
  "Cheminade": "#75398a",
  "Asselineau": "#75398a",
  'a': 'a'
};


colorNames['y2012']  = {
  "DUPONT-AIGNAN":"#75398a",
  "LE PEN":"#2e2b5a",
  "JOLY":"#52ae56",
  "HOLLANDE":"#d82c5d",
  "BAYROU":"#e85d21",
  "SARKOZY":"#0058a2",
  "MÉLENCHON":"#e10f21",
  "POUTOU":"#961e1e",
  "ARTHAUD": "#781f1c",
  "CHEMINADE": "#75398a",
  'a': 'a',
  'b': 'b'
};


colorNames['y2021']  = 
{'Extrême droite': '#14152d',
 'Ecologistes': '#42b38e',
 "Union de la gauche": '#eb6184',
 "Union de la droite": '#38529c',
 "Union du centre": '#ec9528',
 "Extrême gauche": '#761519',
 "Union de la gauche et des écologistes": '#BD6277',
 "Union du centre et de la droite": '#7993ca',
 'Régionalistes': '#cfb096',
'a': 'a',
'b': 'b'}


colorNames['y2022'] = {
"MACRON":'#F7BA00',
"DUPONT-AIGNAN":'#19325D',
"LE PEN":'#1D2245',
'POUTOU': "#911D16",
'MÉLENCHON': "#e10f21",
'LASSALLE': "#534384",
'PÉCRESSE': "#2458A5",
'ZEMMOUR': "#654235",
'JADOT': "#00A85C",
'ARTHAUD': '#751F17',
'HIDALGO': '#EC4C6B',
'ROUSSEL': '#D80000'
}


colorNames['y2022T2'] = {
"MACRON":'#F7BA00',
"LE PEN":'#1D2245',
  'a': 'a',
  'b': 'b',
  'c': 'c',
  'd': 'd',
  'e': 'e',
  'f': 'f',
  'g': 'g',
  'h': 'h',
  'i': 'i',
  'j': 'j'
}

candidats_panneaux['y2022'] = {
    '1': {'score': 0,  'name': 'ARTHAUD',  'parti': 'Lutte ouvrière'},
 '2': {'score': 0, 'name': 'ROUSSEL', 'parti': 'Parti communiste'},
 '3': {'score': 0,  'name': "MACRON",  'parti': "En marche !"},
 '4': {'score': 0,  'name': "LASSALLE",  'parti': "Résistons"},
 '5': {'score': 0,  'name': "LE PEN",  'parti': "Rassemblement National"},
 '6': {'score': 0,  'name': "ZEMMOUR",  'parti': "Reconquête"},
 '7': {'score': 0,  'name': "MÉLENCHON",  'parti': "La France insoumise"},
 '8': {'score': 0,  'name': "HIDALGO",  'parti': "Parti socialiste"},
'9': {'score': 0,  'name': "JADOT",  'parti': "Les Verts"},
 '10': {'score': 0,  'name': "PÉCRESSE",  'parti': "Les Républicains"},
 '11': {'score': 0,  'name': 'POUTOU',  'parti': 'Nouveau Parti anticapitaliste'},
'12': {'score': 0,  'name': 'DUPONT-AIGNAN',  'parti': 'Debout la France'}
}

candidats_panneaux['y2022T2'] = {
 '3': {'score': 0,  'name': "MACRON",  'parti': "En marche !"},
 '5': {'score': 0,  'name': "LE PEN",  'parti': "Rassemblement National"},
'100': {'score': 0,  'name': 'a',  'parti': 'a'},
'101': {'score': 0,  'name': 'b',  'parti': 'b'},
'102': {'score': 0,  'name': 'c',  'parti': 'c'},
'103': {'score': 0,  'name': 'd',  'parti': 'd'},
'104': {'score': 0,  'name': 'e',  'parti': 'e'},
'105': {'score': 0,  'name': 'f',  'parti': 'f'},
'106': {'score': 0,  'name': 'g',  'parti': 'g'},
'107': {'score': 0,  'name': 'h',  'parti': 'h'},
'108': {'score': 0,  'name': 'i',  'parti': 'i'},
'109': {'score': 0,  'name': 'j',  'parti': 'j'}
}


candidats_panneaux['y2017'] = {
  "1":{"score": 0, "name": "Dupont-Aignan", "parti": "Debout la France"},
  "2":{"score": 0, "name": "Le Pen", "parti": "Front National"},
  "3":{"score": 0, "name": "Macron", "parti": "En marche !"},
  "4":{"score": 0, "name": "Hamon", "parti": "Parti socialiste"},
  "5":{"score": 0, "name": "Arthaud", "parti": "Lutte ouvière"},
  "6":{"score": 0, "name": "Poutou", "parti": "Nouveau Parti anticapitaliste"},
  "7":{"score": 0, "name": "Cheminade", "parti": "Solidarité et progrès"},
  "8":{"score": 0, "name": "Lassalle", "parti": "Résistons"},
  "9":{"score": 0, "name": "Mélenchon", "parti": "La France insoumise"},
  "10":{"score": 0, "name": "Asselineau", "parti": "Union Populaire Républicaine"},
  "11":{"score": 0, "name": "Fillon", "parti": "Les Républicains"},
'100': {'score': 0,  'name': 'a',  'parti': 'a'}
}


candidats_panneaux['y2012'] = {
  "9":{"score": 0, "name": "DUPONT-AIGNAN", "parti": "Debout la France"},
  "2":{"score": 0, "name": "LE PEN", "parti": "Front National"},
  "1":{"score": 0, "name": "JOLY", "parti": "Les verts"},
  "10":{"score": 0, "name": "HOLLANDE", "parti": "Parti socialiste"},
  "6":{"score": 0, "name": "ARTHAUD", "parti": "Lutte ouvière"},
  "5":{"score": 0, "name": "POUTOU", "parti": "Nouveau Parti anticapitaliste"},
  "7":{"score": 0, "name": "CHEMINADE", "parti": "Solidarité et progrès"},
  "8":{"score": 0, "name": "BAYROU", "parti": "Modem"},
  "4":{"score": 0, "name": "MÉLENCHON", "parti": "La France insoumise"},
  "3":{"score": 0, "name": "SARKOZY", "parti": "UMP"},
'100': {'score': 0,  'name': 'a',  'parti': 'a'},
'101': {'score': 0,  'name': 'b',  'parti': 'b'}}

competitors_pannels['y2017'] = ['2', '3', '4', '9', '11'];

competitors_pannels['y2017T2'] = ['1', '2'];

competitors_pannels['y2012'] = ['2', '3', '4', '8', '10'];

// competitors_pannels['y2021'] = ['23', '5', '30'];

var candidats_names = {
  'macron':'Macron',
'lePen':'le Pen',
'melenchon':'Mélenchon',
'fillon':'Fillon',
'dupontAignan':'Dupont-Aignan',
'lassalle':'Lassalle',
'poutou':'Poutou',
'asselineau':'Asselineau',
'arthaud':'Arthaud',
'cheminade':'Cheminade'
}

var slider_variables = [
{'name':'popTotale', 'label':'Nombre d\'habitants', 'maxDomain': 100000, 'suffix':'', 'postsuffix':' ou plus'},
{'name':'TauxChomage', 'label':'Taux de chômage', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'taux65Plus', 'label':'Proportion de 65 ans et plus', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'TauxAgricuteurs', 'label':'Proportion d\'agriculteurs', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'TauxCadres', 'label':'Proportion de cadres superieurs', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'TauxOuvriers', 'label':'Proportion d\'ouvriers', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'TauxAbstention', 'label':'Taux Abstention', 'maxDomain': 100, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'ScoreFillonT1', 'label':'Score de Fillon en 2017', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'ScoreMelenchonT1', 'label':'Score de Mélenchon en 2017', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'},
{'name':'ScoreMacronT1', 'label':'Score de Macron en 2017', 'maxDomain': 50, 'suffix':'%', 'postsuffix':' ou plus'}
];


var progressionT2_variables = [
{'name':'progressionMacron', 'label':'Progression de Macron', 'percentage':0, 'value':0, 'name_' : 'Macron'},
{'name':'progressionLePen', 'label':'Progression de le Pen', 'percentage':0, 'value':0, 'name_' : 'Le Pen'}
];

var table_variables = [
{'name':'exprimes', 'label':'Exprimés'},
{'name':'inscrits', 'label':'Inscrits'},
{'name':'votants', 'label':'Votants'},
{'name':'blancs', 'label':'Blancs ou nuls'}
];

slider_variables.forEach(function(d) {
    d.left_range = 0;
    d.right_range = 100;
});

var brush = d3.brushX()
    .extent([
        [0, 0],
        [widthSlider, bandwidthSlider]
    ])
    .handleSize(20)
    .on("brush", brushmoved)
    .on("end", brushEnd);

var hexToRgba = function(hex, opacity) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
}

var chart = d3.select('.chart'),
    result = d3.select('.result'),
    data_sliders = d3.select('#data_sliders');

var title_dashboard = d3.select("#title_dashboard");

var svg = d3.select('.chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .call(responsivefy)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

/*d3.select('.chart')
.select('svg')
.append('g')
.attr('transform', 'translate(200,30)')
.append('text')
.attr('class', 'graphtitle score')
.text('Score');*/

/*d3.select('.chart')
.select('svg')
.append('g')
.attr('transform', 'translate(200,460)')
.append('text')
.attr('class', 'graphtitle progression')
.text('Progression');*/

var xScale = d3.scaleLinear()
    .range([0, width]);

var yScale = d3.scaleBand()
    .padding(0.2)
    .paddingInner(0.2);

var yScale_progress = d3.scaleBand()
    .padding(0.2)
    .paddingInner(0.2);

var xScale_progress = d3.scaleLinear()
    .range([0, width_progress])
    .domain([0, 50]);

var yScale_sliders = d3.scaleBand()
    .padding(paddingSlider)
    .domain(slider_variables.map(function(d) {
        return d.name
    }))
    .range([0, heightSlider]);

var xScale_slider = d3.scaleLinear()
    .range([0, widthSlider])
    .domain([0, 100]);

// svg.call(yAxis);

var data_sliders = d3.select('#data_sliders')
    .append('svg')
    .attr('width', widthSlider + marginSlider.left + marginSlider.right)
    .attr('height', heightSlider + marginSlider.top + marginSlider.bottom)
    .call(responsivefy)
    .append('g')
    .attr('transform', 'translate(' + marginSlider.left + ', ' + marginSlider.top + ')');

data_sliders = data_sliders
    .selectAll('g.gslider')
    .data(slider_variables)
    .enter()
    .append('g')
    .attr('class', function(d) {
        return 'gslider ' + d.name
    })
    .attr('transform', function(d) {
        return 'translate(0,' + yScale_sliders(d.name) + ')'
    });

data_sliders
    .append('text')
    .attr('class', 'textSlider')
    .attr('x', (widthSlider / 2))
    .attr('text-anchor', 'middle')
    .attr('y', function(d) {
        return -textPaddingSlider
    })
    .text(function(d) {
        return d.label
    });

data_sliders
    .append('text')
    .attr('class', 'left_range')
    .attr('x', (widthSlider / 2))
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .text(function(d) {
        return 'de ' + 0 + ' à ' + numbers_separators(d.maxDomain) + d.suffix
    });

data_sliders
    .append('g')
    .attr('class', 'brush')
    .call(brush);

data_sliders
    .append('circle')
    .attr('class', 'left_cursor handle_cursor')
    .attr('cx', 0)
    .attr('cy', (bandwidthSlider / 2))
    .attr('r', radiusHandle);

data_sliders
    .append('circle')
    .attr('class', 'right_cursor handle_cursor')
    .attr('cx', widthSlider)
    .attr('cy', (bandwidthSlider / 2))
    .attr('r', radiusHandle);

//define an icon store it in svg <defs> elements as a reusable component - this geometry can be generated from Inkscape, Illustrator or similar
svg.append("defs")
    .append("g")
    .attr("id", "iconCustom")
    .append("path")
    .attr("d", "M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");

// g_pictochart = svg.append("g")
//     .attr('transform', 'translate(0,80)')
//     .attr('class', 'pictochart');

// //background rectangle
// g_pictochart.append("rect").attr("width", 260).attr("height", 300)
//     .attr('class', 'pictochartrect');

//specify the number of columns and rows for pictogram layout
var numCols = 10;
var numRows = 10;

//padding for the grid
var xPadding = 5;
var yPadding = 5;

//horizontal and vertical spacing between the icons
var hBuffer = 9;
var wBuffer = 8;

//generate a d3 range for the total number of required elements
var myIndex = d3.range(numCols * numRows);

myIndex = myIndex.map(function(d) {
    return [d, '']
});

// g_pictochart.append("g")
//     .attr("id", "pictoLayer")
//     .selectAll("use")
//     .data(myIndex)
//     .enter()
//     .append("use")
//     .attr("xlink:href", "#iconCustom")
//     .attr("id", function(d) {
//         return "icon" + d[0];
//     })
//     .attr("x", function(d) {
//         var remainder = d[0] % numCols; //calculates the x position (column number) using modulus
//         return xPadding + (remainder * wBuffer); //apply the buffer and return value
//     })
//     .attr("y", function(d) {
//         var whole = Math.floor(d[0] / numCols) //calculates the y position (row number)
//         return yPadding + (whole * hBuffer); //apply the buffer and return the value
//     })
//     .attr('transform', 'scale(3)')
//     .attr('class', 'iconPlain tooltipped')
//     .attr('data-position', 'top')
//     .attr('data-tooltip', 'Abstentionistes');

//  g_progression_candidates = svg.append("g")
//     .attr('transform', 'translate(0,420)')
//     .attr('class', 'progressionCandidates');


var data_table = d3.select("#recapitulatif table");

d3.select("#tab2").style('display', 'block');

var this_main_menu_height = $("section#content").offset() ? $("section#content").offset()['top'] : 65;

// d3.select('#slide-out').style('top',this_main_menu_height['top'] + 'px');

function brushmoved() {

    var s = d3.event.selection;
    d = d3.select(this).datum();

    var range = s.map(xScale_slider.invert);

    var minNumber = d.name == 'popTotale' ? numbers_separators(_.round(d.maxDomain * range[0] / 100)) : _.round(d.maxDomain * range[0] / 100, 1);
    var maxNumber = d.name == 'popTotale' ? numbers_separators(_.round(d.maxDomain * range[1] / 100)) : _.round(d.maxDomain * range[1] / 100, 1);

    d3.select('g.gslider.' + d.name)
        .select('text.left_range')
        .html('de <tspan>' + minNumber + d.suffix + '</tspan> à <tspan>' + maxNumber + d.suffix + '</tspan>' + (range[1] == 100 ? d.postsuffix : ''));

    d3.select('g.gslider.' + d.name)
        .select('circle.left_cursor')
        .attr('cx', s[0]);

    d3.select('g.gslider.' + d.name)
        .select('circle.right_cursor')
        .attr('cx', s[1]);

}

function brushEnd() {

    update_source_event = d3.event.sourceEvent ? 1 : 0;

    var s = d3.event.selection;

    d = d3.select(this).datum();

    var range = s.map(xScale_slider.invert);

    updateChart(range[0], range[1], d.name, d.maxDomain, active_year);

}

d3.queue()
    .defer(d3.csv, 'https://sav10.github.io/libe-projects/explorer-presidentielle-2022-T2/data/data2022_presidentielle_T2.csv')
    .await(LoadData);

svg.attr('class', active_year);
d3.select('.chart').select('svg').attr('class', active_year);

d3.select("#y2012")
    .on('click', function() {

        active_year = 'y2012';
        automatic_chart_update = 0;

        if (data_loaded[active_year] == 0) {
            d3.queue()
                .defer(d3.csv, 'https://sav10.github.io/libe-projects/explorer-presidentielle-2022/data/data2012T1.csv')
                .await(LoadData);
        } else {

            d3.select('#data_sliders').select('svg').select('g.gslider').select('.brush').call(brush.move, function(d) {
                return [d.left_range, (d.right_range)].map(xScale_slider)
            });
        }

        d3.select("div.section#tab1")
            .classed('T22017', false);

        d3.selectAll(".gslider.ScoreFillonT1, .gslider.ScoreMelenchonT1, .gslider.ScoreHamonT1, .gslider.ScoreMacronT1")
            .style('display', 'none');

        svg.attr('class', active_year);
        d3.select('.chart').select('svg').attr('class', active_year);

        d3.selectAll('svg g.gbar').style('display', 'block')
        d3.selectAll('svg g.gbar').filter(function(d){return +d.key >= 100}).style('display', 'none')



    })


d3.select("#y2022T2")
    .on('click', function() {

        active_year = 'y2022T2';
        automatic_chart_update = 0;


        if (data_loaded[active_year] == 0) {
            d3.queue()
                .defer(d3.csv, 'https://sav10.github.io/libe-projects/explorer-presidentielle-2022-T2/data/data2022_presidentielle_T2.csv')
                .await(LoadData);
        } else {

            d3.select('#data_sliders').select('svg').select('g.gslider').select('.brush').call(brush.move, function(d) {
                return [d.left_range, (d.right_range)].map(xScale_slider)
            });
        }

        d3.select("div.section#tab1")
            .classed('2019', false);

        d3.selectAll(".gslider.ScoreFillonT1, .gslider.ScoreMelenchonT1, .gslider.ScoreHamonT1, .gslider.ScoreMacronT1")
            .style('display', 'block');

        svg.attr('class', active_year);
        d3.select('.chart').select('svg').attr('class', active_year);

        d3.selectAll('svg g.gbar').filter(function(d){return +d.key >= 100}).style('display', 'none')


    })

d3.select("#y2022")
    .on('click', function() {

        active_year = 'y2022';
        automatic_chart_update = 0;


        if (data_loaded[active_year] == 0) {
            d3.queue()
                .defer(d3.csv, 'https://sav10.github.io/libe-projects/explorer-presidentielle-2022/data/data2022_presidentielle_2.csv')
                .await(LoadData);
        } else {

            d3.select('#data_sliders').select('svg').select('g.gslider').select('.brush').call(brush.move, function(d) {
                return [d.left_range, (d.right_range)].map(xScale_slider)
            });
        }

        d3.select("div.section#tab1")
            .classed('2019', false);

        d3.selectAll(".gslider.ScoreFillonT1, .gslider.ScoreMelenchonT1, .gslider.ScoreHamonT1, .gslider.ScoreMacronT1")
            .style('display', 'block');

        svg.attr('class', active_year);
        d3.select('.chart').select('svg').attr('class', active_year);

        d3.selectAll('svg g.gbar').style('display', 'block')
        d3.selectAll('svg g.gbar').filter(function(d){return +d.key >= 100}).style('display', 'none')

    })


d3.select("#y2017")
    .on('click', function() {

        active_year = 'y2017';
        automatic_chart_update = 0;

        if (data_loaded[active_year] == 0) {
            d3.queue()
                .defer(d3.csv, 'https://sav10.github.io/libe-projects/explorer-presidentielle-2022/data/data_2017T1.csv')
                .await(LoadData);
        } else {

            d3.select('#data_sliders').select('svg').select('g.gslider').select('.brush').call(brush.move, function(d) {
                return [d.left_range, (d.right_range)].map(xScale_slider)
            });
        }

        d3.select("div.section#tab1")
            .classed('T22017', false);

        d3.selectAll(".gslider.ScoreFillonT1, .gslider.ScoreMelenchonT1, .gslider.ScoreHamonT1, .gslider.ScoreMacronT1")
            .style('display', 'none');
        svg.attr('class', active_year);
        d3.select('.chart').select('svg').attr('class', active_year);

        d3.selectAll('svg g.gbar').style('display', 'block')
        d3.selectAll('svg g.gbar').filter(function(d){return +d.key >= 100}).style('display', 'none')

    })


function LoadData(error, data, json_data) {

    // Pas d'arrondissement



    data = data.filter(function(d) {
        return d.code_insee.indexOf('AR') == -1
    });

    if (active_year == 'y2017T2') {
        data.forEach(function(d) {
            d['1'] = +d['1'];
            d['2'] = +d['2'];
            d['3'] = 0;
            d['4'] = 0;
            d['5'] = 0;
            d['6'] = 0;
            d['7'] = 0;
            d['8'] = 0;
            d['9'] = 0;
            d['10'] = 0;
            d['11'] = 0;
            d['12'] = 0;
            d.departement = d.code_insee[0] + d.code_insee[1];
            d.popTotale = +d.popTotale;
            d.taux65Plus = +d.taux65Plus;
            d.TauxAgricuteurs = +d.TauxAgricuteurs;
            d.TauxCadres = +d.TauxCadres;
            d.TauxChomage = +d.TauxChomage;
            d.TauxOuvriers = +d.TauxOuvriers;
            d.TauxRetraites = +d.TauxRetraites;
            d.exprimes = +d.exprimes;
            d.inscrits = +d.inscrits;
            d.votants = +d.votants;
            d.blancs = d.votants - d.exprimes;
            d.TauxAbstention = _.round(100 * (d.inscrits - d.exprimes) / d.inscrits, 1);
            d.ScoreFillonT1 = +d.ScoreFillonT1;
            d.ScoreMelenchonT1 = +d.ScoreMelenchonT1;
            d.ScoreHamonT1 = +d.ScoreHamonT1;
            d.VoixLepenT1 = +d.VoixLepenT1;
            d.VoixMacronT1 = +d.VoixMacronT1;
            d.ScoreMacronT1 = +d.ScoreMacronT1;
            d.ExprimesT1 = +d.ExprimesT1;
        });

    } 

    else if (active_year == 'y2022') {

        data.forEach(function(d) {
            d['1'] = +d['1'];
            d['2'] = +d['2'];
            d['3'] = +d['3'];
            d['4'] = +d['4'];
            d['5'] = +d['5'];
            d['6'] = +d['6'];
            d['7'] = +d['7'];
            d['8'] = +d['8'];
            d['9'] = +d['9'];
            d['8'] = +d['8'];
            d['10'] = +d['10'];
            d['11'] = +d['11'];
            d['12'] = +d['12'];
            d.departement = d.code_insee[0] + d.code_insee[1];
            d.popTotale = +d.popTotale;
            d.taux65Plus = +d.taux65Plus;
            d.TauxAgricuteurs = +d.TauxAgricuteurs;
            d.TauxCadres = +d.TauxCadres;
            d.TauxChomage = +d.TauxChomage;
            d.TauxOuvriers = +d.TauxOuvriers;
            d.TauxRetraites = +d.TauxRetraites;
            d.exprimes = +d.exprimes;
            d.inscrits = +d.inscrits;
            d.votants = +d.votants;
            d.blancs = d.votants - d.exprimes;
            d.TauxAbstention = _.round(100 * (d.inscrits - d.exprimes) / d.exprimes, 1);
            d.ScoreFillonT1 = +d.ScoreFillonT1;
            d.ScoreMelenchonT1 = +d.ScoreMelenchonT1;
            d.ScoreMacronT1 = +d.ScoreMacronT1;
            d.ScoreLepenT1 = +d.ScoreLepenT1;
            // d.ScoreHamonT1 = +d.ScoreHamonT1;
            // d.VoixLepenT1 = +d.VoixLepenT1;
            // d.VoixMacronT1 = +d.VoixMacronT1;
            // d.ExprimesT1 = +d.ExprimesT1;
        });

        // console.log(data)

    }

    else if (active_year == 'y2022T2') {

        data.forEach(function(d) {
            d['3'] = +d['3'];
            d['5'] = +d['5'];
            d.departement = d.code_insee[0] + d.code_insee[1];
            d.popTotale = +d.popTotale;
            d.taux65Plus = +d.taux65Plus;
            d.TauxAgricuteurs = +d.TauxAgricuteurs;
            d.TauxCadres = +d.TauxCadres;
            d.TauxChomage = +d.TauxChomage;
            d.TauxOuvriers = +d.TauxOuvriers;
            d.TauxRetraites = +d.TauxRetraites;
            d.exprimes = +d.exprimes;
            d.inscrits = +d.inscrits;
            d.votants = +d.votants;
            d.blancs = d.votants - d.exprimes;
            d.TauxAbstention = _.round(100 * (d.inscrits - d.exprimes) / d.exprimes, 1);
            d.ScoreFillonT1 = +d.ScoreFillonT1;
            d.ScoreMelenchonT1 = +d.ScoreMelenchonT1;
            d.ScoreMacronT1 = +d.ScoreMacronT1;
            d.ScoreLepenT1 = +d.ScoreLepenT1;
            // d.ScoreHamonT1 = +d.ScoreHamonT1;
            // d.VoixLepenT1 = +d.VoixLepenT1;
            // d.VoixMacronT1 = +d.VoixMacronT1;
            // d.ExprimesT1 = +d.ExprimesT1;
        });

        // console.log(data)

    }

    else {

        data.forEach(function(d) {
            d['1'] = +d['1'];
            d['2'] = +d['2'];
            d['3'] = +d['3'];
            d['4'] = +d['4'];
            d['5'] = +d['5'];
            d['6'] = +d['6'];
            d['7'] = +d['7'];
            d['8'] = +d['8'];
            d['9'] = +d['9'];
            d['10'] = +d['10'];
            d['11'] = +d['11'];
            d['12'] = +d['12'];
            d.departement = d.code_insee[0] + d.code_insee[1];
            d.popTotale = +d.popTotale;
            d.taux65Plus = +d.taux65Plus;
            d.TauxAgricuteurs = +d.TauxAgricuteurs;
            d.TauxCadres = +d.TauxCadres;
            d.TauxChomage = +d.TauxChomage;
            d.TauxOuvriers = +d.TauxOuvriers;
            d.TauxRetraites = +d.TauxRetraites;
            d.exprimes = +d.exprimes;
            d.inscrits = +d.inscrits;
            d.votants = +d.votants;
            d.blancs = d.votants - d.exprimes;
            d.TauxAbstention = _.round(100 * (d.inscrits - d.exprimes) / d.exprimes, 1);
        });

    }

    data_full[active_year] = data;

    var by_dep = _.uniq(data.map(function(d) {
        return d.departement
    }));

    var sum_exp = d3.sum(data, function(d) {
        return d.exprimes
    });

    for (i in candidats_panneaux[active_year]) {
        candidats_panneaux[active_year][i].score = d3.sum(data, function(d) {
            return d[i]
        });
    }

    for (i in table_variables) {
        table_variables[i].value = d3.sum(data, function(d) {
            return d[table_variables[i].name]
        });
    }

    var data_entries = d3.entries(candidats_panneaux[active_year]);

    data_entries = data_entries.sort(function(a, b) {
        return b.value.score - a.value.score
    })

    var total_pop = d3.sum(data, function(d) {
        return d.popTotale
    });

    if (chart_made == 0) {
        makeChart(data_entries, total_pop);

        if (json_data) {

            initMap(json_data);

        }

    }
    data_sliders.select('.brush').call(brush.move, function(d) {
        return [d.left_range, (d.right_range)].map(xScale_slider)
    });

    data_loaded[active_year] = 1;

    d3.select("#tab1").style('display', 'block');


        d3.selectAll('svg g.gbar').style('display', 'block')
        d3.selectAll('svg g.gbar').filter(function(d){return +d.key >= 100}).style('display', 'none')

}

function makeChart(data, total_pop) {
    data_chart = data;

    // console.log(data_chart);

    var max_score = d3.max(data, function(d) {
        return d.value.score
    });

    title_dashboard.select('span.pop_number')
        .text(numbers_separators(total_pop));

    xScale
        .domain([0, max_score]);

    yScale
        .domain(data.map(d => d.value.name))
        .range([0, height]);

    yScale_progress
        .domain(progressionT2_variables.map(d => d.name))
        .range([0, height_progress]);

    var tr_table = data_table.select('tbody').selectAll('tr')
        .data(table_variables)
        .enter()
        .append('tr');

    tr_table
        .append('td')
        .text(function(d) {
            return d.label
        });

    tr_table
        .append('td')
        .text(function(d) {
            return numbers_separators(d.value)
        });

    tr_table
        .append('td')
        .text(function(d, i) {
            return i == 0 ? _.round(100 * d.value / table_variables[1].value, 2) : ''
        });

    tr_table
        .append('td')
        .text(function(d, i) {
            return i == 0 ? _.round(100 * d.value / table_variables[2].value, 2) : ''
        });

    chart_made = 1;

}

function updateChart(r0, r1, subject, maxdomain) {

  // console.log(r0, r1, subject, maxdomain)

    automatic_chart_update = update_source_event == 0 ? automatic_chart_update + 1 : 0;

    if (automatic_chart_update < 2) {

        var this_slider_var = _.find(slider_variables, function(d) {
            return d.name == subject
        });

        this_slider_var.left_range = r0;
        this_slider_var.right_range = r1;

        var data = data_full[active_year];

        if (active_year != 'y2022') {

            slider_variables.forEach(function(d, i) {
                d.left_range = i >= 7 ? 0 : d.left_range;
                d.right_range = i >= 7 ? 100 : d.right_range;
            });
        }

        for (i in slider_variables) {

            if (slider_variables[i].left_range != 0) {
                var r0 = slider_variables[i].left_range;
                var d0 = slider_variables[i].maxDomain * r0 / 100;
                var varname = slider_variables[i].name;

                data = data.filter(function(d) {
                    return d[varname] >= d0
                });
            }

            if (slider_variables[i].right_range != 100) {
                var r1 = slider_variables[i].right_range;
                var d1 = slider_variables[i].maxDomain * r1 / 100;
                var varname = slider_variables[i].name;

                data = data.filter(function(d) {
                    return d[varname] <= d1
                });
            }

        }

        for (i in table_variables) {
            table_variables[i].value = d3.sum(data, function(d) {
                return d[table_variables[i].name]
            });
        }

        // var data = data_full.filter(function(d){return d[subject] >= d0 &&  d[subject] <= d1});
        var cities_count = data.length;
        var total_pop = d3.sum(data, function(d) {
            return d.popTotale
        });
        var total_inscrits = d3.sum(data, function(d) {
            return d.inscrits
        });

        for (i in candidats_panneaux[active_year]) {
            candidats_panneaux[active_year][i].score = d3.sum(data, function(d) {
                return d[i]
            });
        }

        var total_exprimes = d3.sum(data, function(d) {
            return d.exprimes
        });

        var data_entries = d3.entries(candidats_panneaux[active_year]);

        data_entries = data_entries.sort(function(a, b) {
            return b.value.score - a.value.score
        })

        var max_score = d3.sum(data_entries, function(d) {
            return d.value.score
        }) * .40;
        // var max_score = d3.max(data_entries, function(d){ return d.value.score});

        if (active_year == 'y2017T2') {
            var max_score = d3.sum(data_entries, function(d) { return d.value.score }) * .85; }


        // g_pictochart.select("g#pictoLayer")
        //     .data(myIndex);

        // g_pictochart.selectAll('use')
        //     .attr('class', function(d) {
        //         return d[1]
        //     })
        //     .attr('data-tooltip', function(d) {
        //         return d[2]
        //     });

        xScale
            .domain([0, max_score]);


        //Ugly Hook

        yScale
            .domain(data_entries.map(d => d.value.name))
            .range([0, (height+100)]);

        var gbar = svg.selectAll('g.gbar')
            .data(data_entries);

        gbar
            // .attr('abc', function(d){console.log(d); return 'abc'})
            .attr('class', function(d) {
                return 'gbar ' + 'k_' + d.key
            });

        title_dashboard.select('span.cities_count')
            .text(numbers_separators(cities_count));

        title_dashboard.select('span.pop_number')
            .text(numbers_separators(total_inscrits));

        gbar
            .select('rect')
            .transition()
            .attr('width', function(d) {
                return xScale(d.value.score)
            })
            .style('fill', function(d) {
                return colorNames[active_year][d.value.name]
            });

        gbar.select('text.barnumbers')
            .transition()
            .attr('x', function(d) {
                return (xScale(d.value.score) + 7)
            })
            .text(function(d) {
                return String(_.round(100 * d.value.score / total_exprimes, 1)).replace('.', ',') + '%'
            });

        gbar.select('text.bartext')
            .transition()
            .text(function(d) {
                return _.capitalize(d.value.name).replace('Le pen', 'Le Pen').replace('Dupont-aignan', 'Dupont-Aignan')
            });

        gbar_ = gbar
            .enter()
            .append('g')
            .attr('class', function(d) { return 'gbar ' + 'k_' + d.key })
            .attr('transform', function(d) { return 'translate(50,' + yScale(d.value.name) + ')' });

        gbar_
            .append('text')
            .attr('class', 'bartext')
            .attr('y', function(d) { return yScale.bandwidth() / 2 + 4 })
            .attr('x', '-20px')
            .text(function(d) { return _.capitalize(d.value.name).replace('Le pen', 'Le Pen').replace('Dupont-aignan', 'Dupont-Aignan') })
            .attr('text-anchor', 'end');

        gbar_
            .append('text')
            .attr('class', 'barnumbers')
            .attr('y', function(d) { return yScale.bandwidth() / 2 + 4 })
            .attr('x', function(d) { return (xScale(d.value.score) + 7) })
            .text(function(d) { return String(_.round(100 * d.value.score / total_exprimes, 1)).replace('.', ',') + '%' })
            .attr('text-anchor', 'start');

        gbar_
            .append('rect')
            .attr('y', 0)
            .attr('x', 0)
            .attr('height', function(d) { return yScale.bandwidth() })
            .attr('width', function(d) { return xScale(d.value.score) })
            .style('fill', function(d) { return colorNames[active_year][d.value.name] });

        gbar.exit().remove();

        var tr_table = data_table.select('tbody').selectAll('tr')
            .data(table_variables);

        tr_table
            .select('td')
            .text(function(d) {
                return d.label
            });

        tr_table
            .select('td:nth-child(2)')
            .text(function(d) {
                return numbers_separators(d.value)
            });

        tr_table
            .select('td:nth-child(3)')
            .text(function(d, i) {
                return i == 0 ? _.round(100 * d.value / table_variables[1].value, 2) : ''
            });

        tr_table
            .select('td:nth-child(4)')
            .text(function(d, i) {
                return i == 0 ? _.round(100 * d.value / table_variables[2].value, 2) : ''
            });

        // updateMap(data);

    }

    // if (T2_clicked == 0){
    // T2_clicked =1;
    // window.setTimeout(clickT2, 100);

    // }


}

////////////////////////////////////////////////////////////
///////////////////// Map configuration //////////////////////
/////////////////////////////////////////////////////////////

var color_note = d3.scaleSequential(d3.interpolateGreens);
var data_key = 'key';
var dep_names = {"01":"Ain","02":"Aisne","03":"Allier","04":"Alpes-de-Haute-Provence","05":"Hautes-Alpes","06":"Alpes-Maritimes","07":"Ard\u00e8che","08":"Ardennes","09":"Ari\u00e8ge","10":"Aube","11":"Aude","12":"Aveyron","13":"Bouches-du-Rh\u00f4ne","14":"Calvados","15":"Cantal","16":"Charente","17":"Charente-Maritime","18":"Cher","19":"Corr\u00e8ze","2A":"Corse-du-Sud","2B":"Haute-Corse","21":"C\u00f4te-d\u2019Or","22":"C\u00f4tes-d\u2019Armor","23":"Creuse","24":"Dordogne","25":"Doubs","26":"Dr\u00f4me","27":"Eure","28":"Eure-et-Loir","29":"Finist\u00e8re","30":"Gard","31":"Haute-Garonne","32":"Gers","33":"Gironde","34":"H\u00e9rault","35":"Ille-et-Vilaine","36":"Indre","37":"Indre-et-Loire","38":"Is\u00e8re","39":"Jura","40":"Landes","41":"Loir-et-Cher","42":"Loire","43":"Haute-Loire","44":"Loire-Atlantique","45":"Loiret","46":"Lot","47":"Lot-et-Garonne","48":"Loz\u00e8re","49":"Maine-et-Loire","50":"Manche","51":"Marne","52":"Haute-Marne","53":"Mayenne","54":"Meurthe-et-Moselle","55":"Meuse","56":"Morbihan","57":"Moselle","58":"Ni\u00e8vre","59":"Nord","60":"Oise","61":"Orne","62":"Pas-de-Calais","63":"Puy-de-D\u00f4me","64":"Pyr\u00e9n\u00e9es-Atlantiques","65":"Hautes-Pyr\u00e9n\u00e9es","66":"Pyr\u00e9n\u00e9es-Orientales","67":"Bas-Rhin","68":"Haut-Rhin","69":"Rh\u00f4ne","70":"Haute-Sa\u00f4ne","71":"Sa\u00f4ne-et-Loire","72":"Sarthe","73":"Savoie","74":"Haute-Savoie","75":"Paris","76":"Seine-Maritime","77":"Seine-et-Marne","78":"Yvelines","79":"Deux-S\u00e8vres","80":"Somme","81":"Tarn","82":"Tarn-et-Garonne","83":"Var","84":"Vaucluse","85":"Vend\u00e9e","86":"Vienne","87":"Haute-Vienne","88":"Vosges","89":"Yonne","90":"Territoire de Belfort","91":"Essonne","92":"Hauts-de-Seine","93":"Seine-Saint-Denis","94":"Val-de-Marne","95":"Val-d\u2019Oise"};

var map = d3.select("#map");

/// Set up the map

var width_map = 300,
    height_map = 300,
    width_legend_map = 200,
    margin_top_legend_map = 30,
    margin_right_legend_map = 20,
    padding_legend_map = 10,
    mapData,
    xAxis_map;

var city_name = d3.select("#city_name");

var color_cities = 'rgb(183, 217, 217)';

var projection = d3.geoMercator()
    .scale(1000)
    .center([3, 45.5])
    .translate([width_map / 2, height_map / 2]);

var path = d3.geoPath()
    .projection(projection);

x_map = d3.scaleLinear()
    .range([0, width_legend_map]);




function responsivefy(svg) {

    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMid")
        .call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);

    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));

        var this_main_menu_height = $("section#content").offset()['top'] == 0 ? 67 : $("section#content").offset()['top'];

        d3.select('#slide-out').style('top', this_main_menu_height + 'px');

    }
}

function numbers_separators(num) {
    return num.toLocaleString('fr-FR', {
        minimumFractionDigits: 0
    });
}

function normalizeChars(text) {
    return _.camelCase(_.deburr(text))
}


setTimeout(function () {
      $('.shareTwitter').on('click', function(d) { shareTwitter() })
      $('.shareFacebook').on('click', function(d) { shareFacebook() })
    }, 2000)
    function shareFacebook() {
      var url = encodeURIComponent(window.location.origin + window.location.pathname)
      var link = 'http://www.facebook.com/sharer/sharer.php?u=' + url
      window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no')
    }
    function shareTwitter () {
      var url = encodeURIComponent(window.location.origin + window.location.pathname)
      var text = "Explorer les votes aux régionales par rapport aux dernières présidentielles. Visualisez les résultats des élections en fonction de critères socio démographiques (CSP, démographie...) https://www.liberation.fr/apps/2019/05/explorer-elections-europeennes/ via @libe"
      var link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text
      window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no')
    }

// Hook left menu open 

d3.select("#slide-out").on('click', function(){
if (parseInt(d3.select("#slide-out").style('left')) < 0) 
{$( "#burger-menu" ).trigger( "click" )}
 })