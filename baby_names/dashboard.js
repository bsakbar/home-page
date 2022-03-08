// Author: Batool Akbar
// Date: 11/23/2019
// This code creates a visualziation for popular baby names in nyc 2015-2016
// D3.js library



// defining a dimension object that will contain the size of the visualization

const width = d3.min([
  window.innerWidth * 0.7,
  window.innerHeight * 0.7,
])

var height = 500;
var dimensions = {
  width: width,
  height: width,
  margin: { top: 10, right: 10, bottom: 50, left: 50},
}


// main function that draws the big visualization
function drawViz(ethnicity, year, gender){

  // refreshes the visualization
  d3.select('#visualization').select("svg").remove();

  // Reading the data
  d3.csv("data/baby_names.csv").then(function(data) {

    const results = {}

    // Looping through data and adding all information about names that meet the conditions under unqiue key name
    data.forEach(function(d) {
      if (ethnicity == d['ethnicity'] && year.includes(d['Year']) && gender.includes(d['gender']) ){

        if (d.name in results){
          results[d.name].year.push(d.Year)
          results[d.name].gender.push(d.gender)
          results[d.name].rank.push(d.rank)
          results[d.name].count += parseInt(d.count)
        } else {
          results[d.name] = {
            year: [d.Year],
            count: parseInt(d.count),
            gender: [d.gender],
            rank: [d.rank]
          }
        }
      }
    });

  // Changing the structure of results to an array for d3 visualization compatibility
  results_arr = []
  for (var name in results){
    results_arr.push({
        radius: results[name].count/12,
        count: results[name].count,
        gender: results[name].gender,
        rank: results[name].rank,
        year: results[name].Year,
        name: name
    })
  }

  // function that shuffles the dataset so the genders mix up and don't appear in two groups
  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  shuffle(results_arr);

  // adding an svg element inside the visualization before drawing

 
  const visualization = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // specify bubbles behavior
  const simulation = d3.forceSimulation(results_arr)
    .force('charge', d3.forceManyBody().strength(0.8))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(function(d) {
      return 1.1 * d.radius
    }))
    .on('tick', drawCirclz);


    // function that draws the bubbles
    function drawCirclz() {

    //linking dataset to all bubbles (not yet created)
      var u = d3.select('svg')
        .selectAll('circle')
        .data(results_arr)

    // adding circles (bubbles) after linking them to the dataset
    // specifying genders' colors and circles' radius
      u.enter()
      .append('circle')
      .style("fill", function(d){
        if (d.gender.includes('MALE') && d.gender.includes('FEMALE')){
            return '#ff4a2e'
        }
        else if (d.gender.includes('MALE')){
          return '#6b75ff'
        }
        else {
          return '#0affe7'
        }
      })
      .attr('r', function(d) {
        // return d.count/10
        return d.radius
      })

      .merge(u)
      .attr('cx', function(d) {
        return d.x -20
      })
      .attr('cy', function(d) {
        return d.y +70
      })

    // adding interactivity to the visualization to show more information
    // on hover reduce bubble's opacity
    .on("mouseover", function(d) {
      d3.select(this)
      .style("opacity", .7)

    // on hover show names
      d3.select("svg")
      .append("text")
      .style('font-family', '"Roboto", sans-serif')
      .style('font-size', '32px')
      .style('font-weight', '400')
	    .attr("dx", 30)
      .attr("dy", 545)
      .text(d.name)

    // and count
      d3.select("svg")
      .append("text")
      .style('font-family', '"Roboto", sans-serif')
      .style('font-size', '14px')
      .style('font-weight', '100')
      .attr("dx", 30)
      .attr("dy", 570)
      .text('Used'+ '  ' + d.count + ' ' + 'times')

      d3.select("svg")
      .append("text")
      .style('font-family', '"Roboto", sans-serif')
      .style('font-size', '14px')
      .style('font-weight', '100')
      .attr("dx", 30)
      .attr("dy", 590)
      .text(getDesc(d,0))

      d3.select("svg")
      .append("text")
      .style('font-family', '"Roboto", sans-serif')
      .style('font-size', '14px')
      .style('font-weight', '100')
      .attr("dx", 30)
      .attr("dy", 610)
      .text(getDesc(d,1))
    })

    // if mouse is out set it back to default
    .on("mouseout", function(d) {
      d3.select(this).style("opacity",1);

      d3.select("svg")
      .selectAll("text")
      .remove("text")
    })

  }

  });

}

function getDesc(d,multiline){

  // printing the first line
  if (!multiline){
    // Case 1: one year and one gender
    if (d.rank.length == 1){
      return 'Ranked '+d.rank[0]+' in '+year[0]
    }

    // Case 2: one year for gender-neutral names
    if (d.gender.includes('MALE') && d.gender.includes('FEMALE') && d.rank.length == 2){
      return  'Female: ranked '+d.rank[0]+' in '+year[0]
    }

    // Case 3: two years and one gender
    if (d.rank.length == 2){
      return  'Ranked '+d.rank[0]+' in '+year[0]+' & '+d.rank[1]+' in '+year[1]
    }

    // Case 4: two years for gender-neutral names
    if (d.gender.includes('MALE') && d.gender.includes('FEMALE') && d.rank.length == 4){
      return  'Female: ranked '+d.rank[0]+' in '+year[0]+' & '+d.rank[2]+' in '+year[1]
    }

    // printing the second line
  } else {
    // Case 2: one year for gender-neutral names
    if (d.gender.includes('MALE') && d.gender.includes('FEMALE') && d.rank.length == 2){
      return  'Male: ranked '+d.rank[1]+' in '+year[0]
    }

    // Case 4: two years for gender-neutral names
    if (d.gender.includes('MALE') && d.gender.includes('FEMALE') && d.rank.length == 4){
      return  'Male: ranked '+d.rank[1]+' in '+year[0]+' & '+d.rank[3]+' in '+year[1]
    }
  }
  // returning an empty string if none of the cases apply
  return ''
}


// function that links filtering button to the visualization
function vizSpecs(){
  let hispanic = document.getElementById("hispanic_b");
  let white = document.getElementById("white_b");
  let black = document.getElementById("black_b");
  let asian = document.getElementById("asian_b");

  let male = document.getElementById("male_b");
  let female = document.getElementById("female_b");

  let year1 = document.getElementById("year1_b");
  let year2 = document.getElementById("year2_b");

  Ethnicity = ''
  if (hispanic.checked){
    Ethnicity = 'HISPANIC'
    console.log('hispanic button checked')
  }
  if (white.checked){
    Ethnicity = 'WHITE NON HISPANIC'
    console.log('white button checked')
  }
  if (black.checked){
    Ethnicity = 'BLACK NON HISPANIC'
    console.log('black button checked')
  }
  if (asian.checked){
    Ethnicity = 'ASIAN AND PACIFIC ISLANDER'
    console.log('asian button checked')
  }

  Gender = []
  if (male.checked){
    Gender.push('MALE')
    console.log('male button checked')
  }
  if (female.checked){
    Gender.push('FEMALE')
    console.log('female button checked')
  }

  Year = []
  if (year1.checked){
    Year.push('2015')
    console.log('2015 button checked')
  }
  if (year2.checked){
    Year.push('2016')
    console.log('2016 button checked')
  }

  // console.log(Ethnicity, Gender, Year)
  drawViz(ethnicity = Ethnicity, year = Year, gender = Gender)
}

// Set a default example when page is loaded
window.onload=function(){
  drawViz(ethnicity='HISPANIC', year=['2015'], gender=['MALE','FEMALE'])
}
