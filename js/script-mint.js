window.addEventListener('load', async () => {
    var wasGenerated = false;
    loadEvents();
    generateCanvas();
});


let ipfs;

var colorRange = 5; 
var pixelSize = 15;
var colors = [];


const mintButton = document.getElementById('mintButton');
const generateButton = document.getElementById('generateButton');
const resultMint = document.getElementById('resultMint');

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function checkColorsRange(element){
    if(!(element.value >= 2 && element.value <= 15)){
        document.getElementById("nrColors").min = 2;
        document.getElementById("nrColors").max = 15;
        this.value = 5;
    }
    element.nextElementSibling.value = element.value;
}

function checkPixelSize(element){
    if(!(element.value >= 15 && element.value <= 30)){
        document.getElementById("sizeOfPixel").min = 15;
        document.getElementById("sizeOfPixel").max = 30;
        this.value = 20;
    }
    element.nextElementSibling.value = element.value;
}


function loadEvents(){
    generateButton.addEventListener("click", ()=>{
        generateCanvas();
    })

    mintButton.addEventListener('click', () => {
        if(userLogin){
            mintButton.classList.add("hidden");
            resultMint.innerHTML = `<div class="waiting"></div>`;
                
            if(wasGenerated){
                Swal.fire({
                    position: 'bottom-end',
                    icon: 'info',
                    title: 'Waiting...',
                    html:'A confirmation window will appear shortly',
                    showConfirmButton: false,
                    showCloseButton: true
                })

                ;(async () => {
                    let linkIpfs = await uploadToIpfs();

                    if(linkIpfs == "error"){
                        return console.log("Error");
                    }

                    aelf.chain.getChainStatus()
                    .then((result) => {
                        if(!result.result.BestChainHeight){
                            console.log("Error !");
                            mintButton.classList.remove("hidden");
                            return; 
                        }
                        else{
                            window.tokenC = {};
                            
                            const wallet = {
                                address: walletAddress
                            };

                            aelf.chain.contractAt(tokenContractAddress, wallet)
                            .then((result) => {
                                window.tokenC = result;

                                window.tokenC.MintNft({
                                    to: walletAddress,
                                    uri: linkIpfs
                                })
                                .then((result) => {
                                    if(result.error){
                                        if(result.error == 400001){
                                            showNotification('bottom-end', 'warning', 'Info', `Operation canceled`);
                                            mintButton.classList.remove("hidden");
                                            return;
                                        }
                                    }
                                    else {
                                        let txHash = result.result.TransactionId;
                                        showNotification('bottom-end', 'info', 'Checking tx status...', `Tx hash: <u><b><a href="https://explorer-test-side01.aelf.io/tx/${txHash}" target="_blank">${txHash}</a></b></u>`);

                                        fetch(`https://explorer-test-side01.aelf.io/chain/api/blockChain/transactionResult?transactionId=`+txHash)
                                        .then((response) => {
                                            return response.json();
                                        })
                                        .then((result) => {
                                            
                                            if(result.Error){
                                                if(result.Error.Message){
                                                    showNotification('bottom-end', 'error', 'Mint error', `${result.Error.Message}`);
                                                }
                                                else{
                                                    showNotification('bottom-end', 'error', 'Mint error', `${result.Error}`);
                                                }
                                                mintButton.classList.remove("hidden");
                                                return;
                                            }
                                            else {
                                                showNotification('bottom-end', 'success', 'Succes mint!', `You have successfully minted a Pixel NFT !<br> Tx hash: <u><b><a href="https://explorer-test-side01.aelf.io/tx/${txHash}" target="_blank">${txHash}</a></b></u>`);
                                                generateCanvas();
                                            }

                                        })
                                        .catch((error) => {
                                            showNotification('bottom-end', 'error', 'Tx fetch error', `An error occurred while fetching the transaction result`);
                                            mintButton.classList.remove("hidden");
                                            return;
                                        })

                                        mintButton.classList.remove("hidden");
                                        return;
                                    }



                                })
                                .catch((error) => {
                                    showNotification('bottom-end', 'error', 'Mint error', `An error occurred [<b>tokenC.MintNft</b>]<br>Error mesage: <b>${error.message}</b>`)
                                    mintButton.classList.remove("hidden");
                                    return;
                                });
                            })
                            .catch((error) => {
                                showNotification('bottom-end', 'error', 'Error', `An error occurred while initializing the smart contract [<b>aelf.chain.contractAt</b>]<br>Error mesage: <b>${error.message}</b>`)
                                mintButton.classList.remove("hidden");
                                return;
                            })
                        }
                    })
                    .catch((error) => {
                        showNotification('bottom-end', 'error', 'Error', `An error has occurred. [<b>aelf.chain.getChainStatus</b>]<br>Error mesage: <b>${error.message}</b>`)
                        mintButton.classList.remove("hidden");
                        return;
                    });
              })()
            }
        }
        else {
            Swal.fire({
                position: 'bottom-end',
                icon: 'warning',
                title: 'Warning',
                html:'Please connect your wallet first',
                showConfirmButton: false,
                showCloseButton: true
            })
        }

    });
}

function generateCanvas(){
    canvas.classList.remove("hidden");
    resultMint.innerHTML = "";

    var y, x;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let elPixelSize = document.getElementById("nrColors");
    let elColorsRange = document.getElementById("sizeOfPixel");

    checkColorsRange(elPixelSize);
    checkPixelSize(elColorsRange);

    colorRange = parseInt(elPixelSize.value);
    pixelSize = parseInt(elColorsRange.value);

    generateColors(colorRange);

    for(y = 0; y <= canvas.height; y+=pixelSize){
        for(x = 0; x <= canvas.width; x+=pixelSize){
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }

    var image = document.getElementById('source');

    ctx.fillStyle = "white";
    ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.drawImage(image, canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);

    wasGenerated = true;
    document.getElementById("mintButton").classList.remove("hidden");
}

function generateColors(colorRange){
    colors = [];
    for(var i = 0; i < colorRange; i++){
        colors[i] = getRandomColor();
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

}

async function uploadToIpfs(){
    const imageToData = canvas.toDataURL("image/png");
    var file = dataURLtoFile(imageToData,'image.png');
    const cidImage  = await ipfsInfura.add(file)

    const metadataObj = {
        "name": "AElf Pixel",
        "description": "NFT collection on AElf blockchain",
        "image": cidImage.path
    }

    const cidJson  = await ipfsInfura.add(JSON.stringify(metadataObj))
    return cidJson.path;
}


function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}


function showNotification(position, type, title, text){
    Swal.fire({
        position: position,
        icon: type,
        title: title,
        html: text,
        showConfirmButton: false,
        showCloseButton: true
    })
}