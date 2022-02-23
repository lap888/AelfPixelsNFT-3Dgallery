const pixelDemoImage = document.getElementById("pixel-demo");

let imageId = 0;

setInterval( ()=>{
    imageId ++;
    pixelDemoImage.setAttribute("src", `./images/pixels/${imageId % 6 + 1}.png`)
}, 1000)