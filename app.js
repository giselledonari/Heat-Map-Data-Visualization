fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
.then((response)=>response.json())
.then((data)=>{
   graficar(data.monthlyVariance)
})
.catch((error)=>{
console.log(error)})

let graficar=(data)=>{

    //set dimensions and margins of the graph
    const margin={top:80, right:30, bottom:120, left:60};
    const width=1200-margin.left-margin.right;
    const height=500-margin.top-margin.bottom

    //formatear data en años y min-segundos
    var parseYear = d3.timeParse("%Y");
    var parseMonths = d3.timeParse("%m");

    data.forEach((d) => {
        d.year=parseYear(d.year)
        d.month=parseMonths(d.month)

        });
    
    //minimos y maximos
    let minX= d3.min(data,(d)=>d.year);
    let maxX=d3.max(data,(d)=>d.year);
    let minY=d3.min(data,(d)=>d.month);
    let maxY=d3.max(data,(d)=>d.month);


    //apend the svg object
    let svg=d3.select("#grafico")
    .append("svg")
        .attr("width",width+margin.left+margin.right)
        .attr("height",height+margin.top+margin.bottom)
        .attr("class","grafico")
    .append("g")
        .attr("transform", `translate (${margin.left},${margin.top})`)

    //Add title and subtitle
    svg.append("text")
    .attr("class","title")
    .attr("id","title")
    .attr("transform",`translate(${(width/2 )},-40)`)
    .text(`Monthly Global Land-Surface Temperature`)

    svg.append("text")
    .attr("class","subtitle")
    .attr("id","description")
    .attr("transform",`translate(${(width/2)-130},-15)`)
    .text(`1753 - 2015: base temperature 8.66℃`)

    svg.append("text")
    .attr("class","eje")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Months");

    svg.append("text")
    .attr("class","eje")
    .attr("transform", `translate(${(width/2)}, ${(height + margin.top-40)})`)
    .style("text-anchor", "middle")
    .text("Years");

    //ejes y dominios
    
    let x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(d=>d.year))
    .padding(0.01);
    
    let tickValues = []
    for (let i=minX.getFullYear();i<=maxX.getFullYear();i=i+10){
        tickValues.push(parseYear(i))
    };

    svg.append("g")
    .attr("id","x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y'))
        .tickValues(tickValues));

    let y = d3.scaleBand()
    .range([ 0,height ])
    .domain(data.map(d=>d.month))
    .padding(0.01);

    svg.append("g")
    .attr("id","y-axis")
    .call(d3.axisLeft(y).tickFormat(d3.timeFormat('%B')))

    //colors
    let myColor=(x)=>{
        if(x<=4.5){
            return ("#0055b6")
        }
        else if(x<=7 && x>4.5){
            return ("#80ade0")
        }
        else if (x<=9.5 && x>7){
            return ("#fdcb6e")
        }
        else{
            return ("#e94e4e")
        }
    }


    //functions mouse
    let tooltip = d3.select("#grafico")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    
    // funciones del mouseover
    var mouseover = function(event,d) {
        tooltip
            .html(` Year: ${d.year.getFullYear()}
            ${(8.66+d.variance).toFixed(1)}°C/${(d.variance).toFixed(1)}°C`)
            .style("opacity", 1);
            document.querySelector("#tooltip").setAttribute("data-year",d.year.getFullYear())

    }
    var mousemove = function(event,d) {
        tooltip.style("transform","translateY(10%)")
        .style("left",(event.x)+1+"px")
        .style("top",(event.y)+1+"px")
    }
    var mouseleave = function(event,d) {
        tooltip.style("opacity", 0);
        
    }

    //data
    svg.selectAll()
    .data(data, function(d) {return d.year+':'+d.month;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.year) })
      .attr("y", function(d) { return y(d.month) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .attr("class","cell")
      .attr("data-month", function(d) { return (d.month.getMonth()) })
      .attr("data-year", function(d) { return (d.year.getFullYear()) })
      .attr("data-temp", function(d) { return (8.66+d.variance) })
      .style("fill", function(d) { return myColor((8.66+d.variance))} )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    //legend

    let svg2=svg.append("svg").attr("id","legend")
    
    svg2
        .append("rect")
        .attr("x", 50)
        .attr("y", 350)
        .attr("width", 14)
        .attr("height", 14)
        .style("fill","#0055b6");

    svg2
        .append("rect")
        .attr("x", 64)
        .attr("y", 350)
        .attr("width", 14)
        .attr("height", 14)
        .style("fill","#80ade0");
    
    svg2
        .append("rect")
        .attr("x", 78)
        .attr("y", 350)
        .attr("width", 14)
        .attr("height", 14)
        .style("fill","#fdcb6e");    
    
    svg2
        .append("rect")
        .attr("x", 92)
        .attr("y", 350)
        .attr("width", 14)
        .attr("height", 14)
        .style("fill","#e94e4e");    



    svg2
        .append("text")
        .attr("x", 42)
        .attr("y", 380)
        .text("4.5° 7°  9°  12°")
        .attr("class","textLegend")
        .attr("alignment-baseline", "middle")
        .attr("font-size","11px")


   
}
