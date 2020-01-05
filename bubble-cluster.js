//https://www.d3indepth.com/force-layout/



var width = 368

var dimensions = {
  width: width,
  height: width,
  margin: { top: 0, right: 0, bottom: 0, left: 0},
}

// dimensions.boundedWidth = dimensions.width
//   - dimensions.margin.right
//   - dimensions.margin.left
// dimensions.boundedHeight = dimensions.height
//   - dimensions.margin.top
//   - dimensions.margin.bottom


const bubble_chart = d3.select("#bubble-cluster")
  .append("svg")
  .attr("width", dimensions.width)
  .attr("height", dimensions.height)

var width = 368, height = 341

var numNodes = 70
var nodes = d3.range(numNodes).map(function(d) {
  return {radius: Math.random() * 15}
})

var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(6))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(function(d) {
    return d.radius
  }))
  .on('tick', ticked);

// '#40464e','#ef4623'
function ticked() {
  var colorz = ['#ef4623','#40464e']
  var random_color = colorz[Math.floor(Math.random()*colorz.length)];

  var u = d3.select('svg')
    .selectAll('circle')
    .data(nodes)

  u.enter()
    .append('circle')
    .attr("stroke-width", 1)

    .attr('r', function(d) {
      return d.radius
    })
    .merge(u)
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })
    .attr("fill", function(d){
      if (d.radius > 7){
        return '#40464e'
      }
      else {
        return '#ef4623'
      }
    })
    .attr("opacity", 0.7)
    .attr("stroke", "black")

  u.exit().remove()
}
