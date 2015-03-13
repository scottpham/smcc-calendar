var mobileThreshold = 300, //set to 500 for testing
    aspect_width = 4,
    aspect_height = 1;

//standard margins
var margin = {
    top: 30,
    right: 30,
    bottom: 20,
    left: 30
};
//jquery shorthand
var $graphic = $('#graphic');
//base colors
var colors = {
    'red1': '#6C2315', 'red2': '#A23520', 'red3': '#D8472B', 'red4': '#E27560', 'red5': '#ECA395', 'red6': '#F5D1CA',
    'orange1': '#714616', 'orange2': '#AA6A21', 'orange3': '#E38D2C', 'orange4': '#EAAA61', 'orange5': '#F1C696', 'orange6': '#F8E2CA',
    'yellow1': '#77631B', 'yellow2': '#B39429', 'yellow3': '#EFC637', 'yellow4': '#F3D469', 'yellow5': '#F7E39B', 'yellow6': '#FBF1CD',
    'teal1': '#0B403F', 'teal2': '#11605E', 'teal3': '#17807E', 'teal4': '#51A09E', 'teal5': '#8BC0BF', 'teal6': '#C5DFDF',
    'blue1': '#28556F', 'blue2': '#3D7FA6', 'blue3': '#51AADE', 'blue4': '#7DBFE6', 'blue5': '#A8D5EF', 'blue6': '#D3EAF7'
};

/*
 * Render the graphic
 */
//check for svg
$(window).load(function() {
    draw_graphic();
});

function draw_graphic(){
    if (Modernizr.svg){
        $graphic.empty();
        var width = $graphic.width();
        render(width);
        window.onresize = draw_graphic; //very important! the key to responsiveness
    }
}

function render(width) {

    //empty object for storing mobile dependent variables
    var mobile = {};
    //check for mobile
    function ifMobile (w) {
        if(w < mobileThreshold){
        }
        else{
        }
    } 
    //call mobile check
    ifMobile(width);
    //calculate height against container width

    var width = 0.9 * width;

    var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom;

    var cellSize = width/55;

    //time
    var day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var color = d3.scale.quantize()
        .domain([0, 900])
        .range(d3.range(9).map(function(d){ return "q" + d + "-9"; }));

    //build an svg for each year
    var svg = d3.select("#graphic").selectAll("svg")
            .data(d3.range(2012, 2015))
            .enter().append("svg")
                .attr("width",width)
                .attr("height", height)
                .attr("class", "OrRd")
                .append("g")
                  .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 -1) + ")");
    //year labels
    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 4 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d){ return d;});

    //build days
    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
            .attr("class", "day")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d){ return week(d) * cellSize; })
            .attr("y", function(d){ return day(d) * cellSize; })
            .datum(format);

    //year title
    rect.append("title")
        .text(function(d){ return d; });

    //build month blocks
    svg.selectAll(".month")
          .data(function(d){ return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
            .attr("class", "month")
            .attr("d", monthPath);

    var month_name = d3.time.format("%B");

    svg.selectAll("text.label")
        .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
      .enter().append("text")
        .attr("class", "label")
        .attr("text-anchor", "start")
        .attr("x", function(d) { return week(d) * cellSize + cellSize; })
        .attr("y", -8)
        .text(month_name);


    d3.csv("ron.csv", function(error, csv){
        var data = d3.nest()
            .key(function(d) { return d.check_date;  })
            .rollup(function(d){ return (d[0].amount); })
            .map(csv);

        console.log(data);

        rect.filter(function(d){ return d in data; })
            .attr("class", function(d) { return "day " + color(data[d]); })
            .select("title")
            .text(function(d){ return d + ": " + (data[d]); });
    
    }); //end of d3.csv

    //outline of months
    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = +day(t0), w0 = +week(t0),
          d1 = +day(t1), w1 = +week(t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
          + "H" + w0 * cellSize + "V" + 7 * cellSize
          + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
          + "H" + (w1 + 1) * cellSize + "V" + 0
          + "H" + (w0 + 1) * cellSize + "Z";
    }

    //i dunno what this is
    //d3.select(self.frameElement).style("height", "2910px");



}//end function render    





