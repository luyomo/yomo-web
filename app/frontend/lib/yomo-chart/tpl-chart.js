var d3 = require("d3/dist/d3.min.js");
var Donut3D = require("Donut3D.js");
var techan = require("techan/dist/techan.min.js");


var expFunc = {};

expFunc.drawBar = (_id, _reqData) => {
 var svg = d3.select("#" + _id);
 margin = {top: 20, right: 20, bottom: 70, left: 40},
 width = +svg.attr("width") - margin.left - margin.right,
 height = +svg.attr("height") - margin.top - margin.bottom;

 var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
     y = d3.scaleLinear().rangeRound([height, 0]);

 var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 x.domain(_reqData.map(function(d) { return d.xlabel; }));
 y.domain([0, d3.max(_reqData, function(d) { return d.yvalue; })]);

 // Add the X Axis
 g.append("g").attr("class", "axis")
   .attr("transform", "translate(0," + height + ")")
   .call(d3.axisBottom(x).ticks(10))
   .selectAll("text")
   .style("text-anchor", "end")
   .attr("dx", "-.8em")
   .attr("dy", ".15em")
   .attr("transform", "rotate(-30)");

 g.append("g")
   .attr("class", "axis axis--y")
   .call(d3.axisLeft(y).ticks(10))
   .append("text")
   .attr("dx", "-0.8em")
   .attr("y", 40000)
   .attr("dy", "0.71em")
   .attr("text-anchor", "end")
   .text("Frequency");

 g.selectAll(".bar")
   .data(_reqData)
   .enter().append("rect")
   .attr("class", "bar")
   .attr("x", function(d) { return x(d.xlabel); })
   .attr("y", function(d) { return y(d.yvalue); })
   .attr("width", x.bandwidth())
   .attr("height", function(d) { return height - y(d.yvalue); });
};

expFunc.draw3DPie = (_id, _reqData) => {
  var _data = _(_reqData).map(_e => {return {label:_e.xlabel, value:parseInt(_e.yvalue)}; }).value();

  var svg = d3.select("#" + _id);
  svg.append("g").attr("id","salesDonut");

  Donut3D.draw("salesDonut", _data, 500, 150, 400, 150, 60, 0.4);
};

expFunc.drawCandlestick = (_id, _reqData) => {
console.log("The inpu data is <%s>", JSON.stringify(_reqData));
  var margin = {top: 20, right:20, bottom:30, left:50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

//  var parseDate = d3.timeParse("%d-%b-%y");
  var parseDate = d3.timeParse("%Y-%m-%d");

  var x = techan.scale.financetime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var candlestick = techan.plot.candlestick().xScale(x).yScale(y);

  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y);

  var svg = d3.select("#" + _id).attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var accessor = candlestick.accessor();
    
    data = (_(_reqData).map(_d => {return {
        date  : parseDate(_d.valuedate)
      , open  : +_d.open
      , high  : +_d.high
      , low   : +_d.low
      , close : +_d.close
      , volume: +_d.volume
    };}).value()).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); }); 
    console.log("The file is <%s>", JSON.stringify(data));

    svg.append("g").attr("class", "candlestick");

    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")");

    svg.append("g").attr("class", "y axis").append("text").attr("transform", "rotate(-90)")
      .attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Price ($)");

    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());

    svg.selectAll("g.candlestick").datum(data).call(candlestick);
    svg.selectAll("g.x.axis").call(xAxis);
    svg.selectAll("g.y.axis").call(yAxis);
};

module.exports = expFunc;
