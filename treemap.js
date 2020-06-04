const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
}

const svgHeight = 1000 
const svgWidth = 1200 

const translateX = 50



const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'

let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);

const svg = d3.select('.scatterplot')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

    const height = +svg.attr('height')
    const width = +svg.attr('width')
    

const fetchData = async() => {
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)

    return data
}

fetchData().then(data => {
    const root = d3.hierarchy(data).sum(d => d.value) //obtenemos el tamanio de cada hoja en el campo value
    
    //d3.treemap computs the position of each element of the hierarchy
    d3.treemap()
    .size([width, height])
    .padding(1)
    (root)

    svg.selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('width', d => d.x1 - d.x0 )
            .attr('height', d => d.y1 - d.y0 )
            .style('stroke', 'black')
            //.attr('fill', d => color(d.data.category))
            .attr('fill', 'royalblue')
            .on("mouseover", d => {      
                tooltip.style("opacity", .9); 
                tooltip.html(`
                    <span>Name: ${d.data.name}</span>
                    </br>
                    <span>Category: ${d.data.category}</span>
                    </br>
                    <span>Value: ${d.data.value}</span>

                `)
            .style("left", (d3.event.pageX + 10) + "px") 
            .style("top", (d3.event.pageY - 28) + "px") }) 
            .on("mouseout", d => tooltip.style("opacity", 0))


    const text = svg.selectAll('text')
        .data(root.leaves())
        .enter()
        .append('text')
            .attr('x', d => d.x0 + 1 )
            .attr('y', d => d.y0 + 20 )
        .selectAll('text')
            .data(d => 
                d.data.name.split(/(?=[A-Z][^A-Z])/g)
                .map(v => ({
                    text: v,
                    x0: d.x0,
                    y0: d.y0
                }))
            )
            .enter()
            .append('tspan')
                .attr('x', d => d.x0 + 5)
                .attr('y', (d, i) => d.y0 + 15 + (i * 10))
                .text(d => d.text)
                
                


})