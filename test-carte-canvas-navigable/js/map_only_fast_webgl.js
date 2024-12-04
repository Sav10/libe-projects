var margin = { top: 10, right: 90, bottom: 130, left: 70 },
width = 600 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom,
widthHandle = 10,
radiusHandle = 12,
handleHeight = 10,
bandwidth = 6,
transition_duration = 300,
gbar,
data_chart,
data_full = {},
active_year = 'y2024Eur',
colorNames = {},
candidats_panneaux = {},
percentageCalculated = 0,
mymap,
markerGroup,
chart_made = 0,
data_loaded = {y2017:0, y2012:0, y2022:0, y2022T2:0, y2024Eur:1},
automatic_chart_update = 0,
update_source_event = 0,
competitors_pannels = {},
T2_clicked = 0,
xScale_canvas,
yScale_canvas,
all_map_points = [],
maxRScaleCanvas,
canvasChart,
canvaschartWidth,
canvaschartHeight,
canvasNode,
redrawPoints;

let quadtree;


// Check doc here https://github.com/ColinEberhardt/d3fc-webgl-hathi-explorer/blob/master/index.js#L133


function waitForObject() {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            if (window.this_sheet_data) {
                clearInterval(intervalId);
                resolve(window.this_sheet_data);
            }
        }, 100); // Check every 100 milliseconds for availability of thatObject
    });
}


waitForObject().then((data) => {
    console.log(data[100])
    LoadData(data)
});



let this_globalAlpha


let this_pixelratio = window.devicePixelRatio

let context
// let hiddenContext

var margin_progress = { top: 10, right: 70, bottom: 10, left: 180 },
width_progress = 600 - margin_progress.left - margin_progress.right,
height_progress = 100 - margin_progress.top - margin_progress.bottom;

var marginSlider = { top: -40, right: 18, bottom: 40, left: 20 },
    widthSlider = 300,
    heightSlider = 900,
    bandwidthSlider = 10,
    textPaddingSlider = 25,
    paddingSlider = 1.1;


let colorToPoint = {}
// const { offsetX = null, offsetY = null } = mouseEvent;



var xScale = d3.scaleLinear()
    .range([0, width-100]);

var xScaleT2 = d3.scaleLinear()
    .range([0, width-200]);

var yScale = d3.scaleBand()
    .padding(0.2)
    .paddingInner(0.3);


// svg.call(yAxis);


// d3.queue()
//     .defer(d3.csv, 'data/data_2024_europeennes.csv')
//     .await(LoadData);


// Promise.all([
//     d3.csv("data/data_2024_europeennes.csv")
// ]).then(function(files) {
//   LoadData(files[0])
// }).catch(function(err) {
//   console.log(err)
// })





function pointInsideCircle(x, y, cx, cy, radius) {
    const distance =
        Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    return distance < radius;
}



function LoadData(data, json_data) {


    let this_data = data.filter(d=> d[0] >= -5.2 && d[0] <= 8.5 && d[1] >= 41.4 && d[1] <= 51.5)


    console.log(this_data[0])


makeWebglMap(this_data)




}



function makeWebglMap(data){


let this_width =  1000

canvaschartWidth = this_width
canvaschartHeight = this_width


// context = canvasChart.node().getContext('2d');
// hiddenContext = canvasChart.node().getContext('2d');


    var xScale_factor = d3.scaleLinear()
    .domain([250,700])
    .range([0.2, 0.6]);

    var yScale_factor = d3.scaleLinear()
    .domain([250,700])
    .range([12, 25]);

    // var rScale_canvas = d3.scaleSqrt()
    // .domain([7, 1328054])
    // .range([xScale_factor(this_width), yScale_factor(this_width)]);


    var rScale_canvas = d3.scaleSqrt()
    .domain([0, 547])
    .range([xScale_factor(this_width), yScale_factor(this_width)]);

    maxRScaleCanvas = yScale_factor(this_width)

    xScale_canvas = d3.scaleLinear()
    .domain([-5.2,8.5])
    .range([0, this_width]);


    yScale_canvas = d3.scaleLinear()
    .domain([41.4,51.5])
    .range([this_width, 0]);


const xScaleOriginal = xScale_canvas.copy();
const yScaleOriginal = yScale_canvas.copy();


console.log(data[500])


   quadtree = d3
      .quadtree()
      .x(d => d[0])
      .y(d => d[1])
      .addAll(data);



const zoom = d3
  .zoom()
  .on("zoom", (event) => {

    console.log("zooming")
    xScale_canvas.domain(event.transform.rescaleX(xScaleOriginal).domain());
    yScale_canvas.domain(event.transform.rescaleY(yScaleOriginal).domain());
    redraw();

  });

console.log(data[300])

const pointSeries = fc
  .seriesWebglPoint()
  .crossValue(d => d[0])
  .mainValue(d => d[1])
  .size(1);



const annotations = [];

const pointer = fc.pointer().on("point", ([coord]) => {
  // annotations.pop();

  // console.log(coord)

  if (!coord || !quadtree) {
    console.log('none')
    return;
  }

  // find the closes datapoint to the pointer
  xScale_canvas.range([0, this_width])
  yScale_canvas.range([this_width, 0])
  const x = xScale_canvas.invert(coord.x);
  const y = yScale_canvas.invert(coord.y);
  const radius = Math.abs(xScale.invert(coord.x) - xScale.invert(coord.x - 20));
  // console.log(x)
  // console.log(y)
  // console.log(radius)
  const closestDatum = quadtree.find(x, y, radius);

  // if the closest point is within 20 pixels, show the annotation
  if (closestDatum) {
    // annotations[0] = createAnnotationData(closestDatum);
    console.log(closestDatum)
    // console.log(xScaleOriginal.range())
    //   console.log(yScale_canvas.range())

    showTip(coord, closestDatum)
  }

  redraw();
});

// const annotationSeries = seriesSvgAnnotation()
//   .notePadding(15)
//   .type(d3.annotationCallout);


    // .type(d3.symbolDiamond);

const chart = fc
  .chartCartesian(xScale_canvas, yScale_canvas)
  .webglPlotArea(pointSeries)
  .svgPlotArea(
    // only render the annotations series on the SVG layer
    fc
      .seriesSvgMulti()
  )
  .decorate(sel =>
    sel
      .enter()
      .select("d3fc-svg.plot-area")
      .on("measure.range", (event) => {
        // console.log(event)
        xScaleOriginal.range([0, event.detail.width]);
        yScaleOriginal.range([event.detail.height, 0]);
      })
      .call(zoom)
      .call(pointer)
  );


// d3.select("#chart")
//     .datum(data)
//     .call(chart);



const redraw = () => {

console.log('redrawing')


  d3.select("#chart")
    .datum(data)
    .call(chart);
};

redraw()


}



// function responsivefy(svg) {

//     var container = d3.select(svg.node().parentNode),
//         width = parseInt(svg.style("width")),
//         height = parseInt(svg.style("height")),
//         aspect = width / height;

//     svg.attr("viewBox", "0 0 " + width + " " + height)
//         .attr("preserveAspectRatio", "xMinYMid")
//         .call(resize);

//     d3.select(window).on("resize." + container.attr("id"), resize);

//     function resize() {
//         var targetWidth = parseInt(container.style("width"));
//         svg.attr("width", targetWidth);
//         svg.attr("height", Math.round(targetWidth / aspect));

//         var this_main_menu_height = $("section#content").offset()['top'] == 0 ? 67 : $("section#content").offset()['top'];

//         d3.select('#slide-out').style('top', this_main_menu_height + 'px');

//     }
// }

function numbers_separators(num) {
    return num.toLocaleString('fr-FR', {
        minimumFractionDigits: 0
    });
}

function normalizeChars(text) {
    return _.camelCase(_.deburr(text))
}





function showTip(coord, d){

  // console.log(this_event)


let this_obj = d
let this_color = '#1A1A1A'

let this_html = `<div class="box_element_line entete">
<div class="box_element_col">
<h3>${this_obj[2]}</h3>
<div>${this_obj[3]}</div>
<div>${this_obj[4]}</div>`

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

position_tooltip(coord)

}


function position_tooltip(coord){

let tip_height = parseInt(d3.select("#map_info").style('height'));
let tip_width = parseInt(d3.select("#map_info").style('width'));

let map_max_height = parseInt(d3.select('#chart').style('height'))

let map_max_width = parseInt(d3.select('#chart').style('width'))

// console.log(map_max_width)

// let click_x = parseInt(this_position[0])
// let click_y = parseInt(this_position[1])



// let click_x = parseInt(this_event.layerX)
// let click_y = parseInt(this_event.layerY)

// let base_position_tooltip =  parseInt(d3.select('.chart #map').node().getBoundingClientRect().y - d3.select('#main > .container').node().getBoundingClientRect().y)


let x_position = coord.x - tip_width
let y_position = coord.y - tip_height
// x_position = x_position < 0 ? 0 : x_position

// x_position = (x_position + tip_width) > map_max_width ? (map_max_width - tip_width): x_position

// base_position_tooltip = 10;

// y_position = (y_position + tip_height -base_position_tooltip) > map_max_height ? (map_max_height - tip_height + base_position_tooltip) : y_position;


d3.select("#map_info")
.style('left', x_position + 'px')
.style('top', y_position + 'px')
.style('font-size',  (1/this_pixelratio)+ 'em')
}