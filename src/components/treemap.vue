<template>
    <div>
        <div id="graph"></div>
        <div id="gallery"></div>
        <!-- <script src="//cdnjs.cloudflare.com/ajax/libs/d3/4.1.1/d3.min.js"></script> -->
    </div>
</template>

<script>
// import { indexString } from '../data/index.images.js'

export default {
  // computed: mapState([]),
};
    // const data = [
    //     {id:"root",value:null},
    //     ...indexString.split("\n").map((imgPath, idx) => ({
    //         id:`root.${idx}`,
    //         value: null,
    //         img:`../data/img/${imgPath.trim()}`,
    //     }))
    // ];
    // const galleryEl = document.querySelector('#gallery');
    // const images = indexString.split("\n");
    // const html = images.map(imgPath => `<img src="../data/img/${imgPath.trim()}">`)
    // galleryEl.innerHTML = html.join('');

    // var width = document.querySelector("#graph").clientWidth
    // var height = document.querySelector("#graph").clientHeight
    // var div = d3.select("#graph").append("div").attr("width", width).attr("height", height)


    // setInterval(draw, 20000)
    // setTimeout(() => {
    //     draw()
    // },6000)


    function draw() {

        randomize()

        var stratify = d3.stratify()
            .parentId(function(d) {return d.id.substring(0, d.id.lastIndexOf(".")); });

        var root = stratify(data).sum(function(d) {
            console.log("d.img", d.value, d.img);
            const img = document.querySelector(`img[src="${d.img}"]`);
            // console.log("img.clientWidth*img.clientHeight", (img.clientWidth*img.clientHeight)/100000);
            if (img) return (img.clientWidth*img.clientHeight)/100000;
            return 0;
            // return d.value
        })

        var treemap = d3.treemap()
            .tile(d3.treemapBinary)
            .size([width, height])
            .padding(1)
            .round(true);

        treemap(root)
        drawTreemap(root)

    }

    function randomize() {
        data.filter(function(d){ return d.id !== "root"})
            .forEach(function(d){
                d.value = ~~(d3.randomUniform(1, 10)())
            })
    }


    function drawTreemap(root) {

        var node = div.selectAll(".node").data(root.children)

        var newNode = node.enter()
           .append("div").attr("class", "node")

        node.merge(newNode)
            .transition()
            .duration(1000)
            .style("left", function(d) { return d.x0 + "px" })
            .style("top", function(d) { return d.y0 + "px" })
            .style("width", function(d) { return (d.x1 - d.x0) + "px" })
            .style("height", function(d) { return (d.y1 - d.y0) + "px"})
            .style("background-image", function(d){ return "url("+d.data.img+")"})
    }

</script>

<style>
html, body{
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
}
#graph {
    width: 100%;
    height: 100%;

}
.node {
    position: absolute;
    background-size:cover;
}

</style>