// DOM elements
const walletDiv = document.getElementById("walletDiv");
const loginDiv = document.getElementById("loginDiv");
const logoutDiv = document.getElementById("logoutDiv");
const addressDiv = document.getElementById("addressDiv");
const mynftsDivError = document.getElementById("mynftsDivError");
const nftList = document.getElementById("nft-list");


const loginBtn = document.getElementById("login-btn");
let logoutBtn = document.getElementById("logout-btn");


let aelf = null;
let walletAddress;
let userLogin = false;
let nightElfInstance = null;

const tokenContractAddress =
  "ELF_2cLA9kJW3gdHuGoYNY16Qir69J3Nkn6MSsuYxRkUHbz4SG2hZr_AELF";

class NightElfCheck {

    constructor() {
        const readyMessage = 'NightElf is ready!';
        let resovleTemp = null;

        this.check = new Promise((resolve, reject) => {
            if (window.NightElf) {
                resolve(readyMessage);
            }
            setTimeout(() => {
                reject({
                    error: 200001,
                    message: 'timeout / can not find NightElf / please install the extension'
                });
            }, 1000);
            resovleTemp = resolve;
        });

        document.addEventListener('NightElf', result => {
            resovleTemp(readyMessage);
        });
    }

    static getInstance() {
        if (!nightElfInstance) {
            nightElfInstance = new NightElfCheck();
            return nightElfInstance;
        }
        return nightElfInstance;
    }
}


const nightElfCheck = NightElfCheck.getInstance();

nightElfCheck.check.then(message => {
    aelf = new window.NightElf.AElf({
	    httpProvider: [
	        'https://explorer-test-side01.aelf.io/chain',
	    ],
	    appName: 'NFT dApp'
	});
    loginFunction();

}).catch(function(e) {
  	console.log(e);
  	if(e.error == 200001){
  		console.log("Night Elf not installed, cannot get wallet address");
        mynftsDivError.classList.remove("hidden");
  		loginBtn.onclick = function () {
		    Swal.fire({
			  	title: 'Error',
			  	html:'Night Elf not installed, cannot get wallet address',
			  	showConfirmButton: false,
			  	showCloseButton: true,
			  	footer: '<a style="color:blue" href="https://chrome.google.com/webstore/detail/aelf-explorer-extension-d/mlmlhipeonlflbcclinpbmcjdnpnmkpf" target="_blank">Install extension</a>'
			})
		};
  	}
})




loginBtn.onclick = function () {
    loginFunction();
};


logoutBtn.onclick = function () {
    aelf.logout({
        chainId: "AELF",
        address: walletAddress
  	})
  	.then((result) => {
		loginDiv.classList.remove("hidden");
    	logoutDiv.classList.add("hidden");

        mynftsDivError.classList.remove("hidden");
        nftList.innerHTML = "";

		userLogin = false;
	})
	.catch((error) => {
        console.log("LOGOUT promise catch:", error);
    });
};



function loginFunction(){
    aelf.login({
        chainId: "AELF",
        payload: {
            method: "LOGIN"
        }
    })
    .then((result) => {
        walletAddress = JSON.parse(result.detail).address;
        loginDiv.classList.add("hidden");
        logoutDiv.classList.remove("hidden");
        addressDiv.innerHTML = `${walletAddress.substr(0, 6)}...${walletAddress.substr(-6)}`;

        mynftsDivError.classList.add("hidden");
        nftList.innerHTML = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;

        userLogin = true;

        if(userLogin){
            ;(async () => {
                aelf.chain.getChainStatus()
                .then((result) => {
                    if(!result.result.BestChainHeight){
                        showNotification('bottom-end', 'error', 'Error', 'An error has occurred [<b>aelf.chain.getChainStatus</b>]')
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

                            window.tokenC.GetAllTokensOfOwner.call({
                                owner: walletAddress
                            })
                            .then((result) => {
                                if(!result.result){
                                    nftList.innerHTML = "You don't have NFTs"
                                }
                                else {
                                    let promisesTokensCid = [];
                                    let tokenIds = result.result.tokensIds;
                                    let tokensTotalInfo = [];

                                    tokenIds.map((tokenId) => promisesTokensCid.push(window.tokenC.GetTokenURI.call({
                                        value: tokenId
                                    })))

                                    let resultTokensCid = Promise.all(promisesTokensCid)
                                    .then((result) => {
                                        let promisesTokensMetadata = [];
                                        result.map((item) => promisesTokensMetadata.push("https://cloudflare-ipfs.com/ipfs/" + item.result.uri));

                                        let resultTokensMetadata = Promise.all(promisesTokensMetadata.map((cid) => {
                                            return fetch(cid).then((response) => response.json());
                                        }))
                                        .then((result) => {
                                            result.map((token, index) => tokensTotalInfo.push({
                                                "token_id" : tokenIds[index],
                                                "token_image" : token.image
                                            }));

                                            nftList.innerHTML = "";

                                            if (tokensTotalInfo.length && userLogin){
                                                tokensTotalInfo.map((token) => nftList.innerHTML += `
                                                    <div class="token">
                                                        <div class="image" style="background-image: url(https://cloudflare-ipfs.com/ipfs/${token.token_image});"></div>
                                                        <div class="info">
                                                            <p>Aelf pixel #${token.token_id}</p>
                                                            <a class="btn transfer-nft" data-id="${token.token_id}">Transfer</a>
                                                        </div>
                                                    </div>
                                                `);

                                                document.querySelectorAll(".transfer-nft").forEach((transferBtn) => {
                                                    transferBtn.addEventListener('click', ()=>{
                                                        let currentTokenId = transferBtn.getAttribute('data-id');

                                                        Swal.fire({
                                                            position: 'center',
                                                            title: 'Transfer Pixel #' + currentTokenId,
                                                            html:'Error <b>Promise.all Tokens Metadata</b> ',
                                                            showConfirmButton: false,
                                                            showCloseButton: true
                                                        })

                                                        Swal.fire({
                                                            title: 'Transfer Pixel #' + transferBtn.getAttribute('data-id'),
                                                            html:'Enter address of receiver:',
                                                            input: 'text',
                                                            inputAttributes: {
                                                                autocapitalize: 'off'
                                                            },
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Transfer',
                                                            showLoaderOnConfirm: true,
                                                            preConfirm: (toWallet) => {
                                                                try{
                                                                    AElf.utils.base58.decode(toWallet.trim());
                                                                    return toWallet;
                                                                }
                                                                catch(error){
                                                                    return Swal.showValidationMessage(error)
                                                                }
                                                            },
                                                            allowOutsideClick: () => !Swal.isLoading()
                                                        })
                                                        .then((result) => {
                                                            if (result.isConfirmed && result.value) {
                                                                window.tokenC.Transfer({
                                                                    to: result.value,
                                                                    tokenId: currentTokenId
                                                                })
                                                                .then((result) => {
                                                                    if(result.error){
                                                                        if(result.error == 400001){
                                                                            showNotification('center', 'warning', 'Info', `Operation canceled`);
                                                                            return;
                                                                        }
                                                                    }
                                                                    else {
                                                                        let txHash = result.result.TransactionId;
                                                                        showNotification('center', 'info', 'Checking tx status...', `Tx hash: <u><b><a href="https://explorer-test-side01.aelf.io/tx/${txHash}" target="_blank">${txHash}</a></b></u>`);

                                                                        fetch(`https://explorer-test-side01.aelf.io/chain/api/blockChain/transactionResult?transactionId=`+txHash)
                                                                        .then((response) => {
                                                                            return response.json();
                                                                        })
                                                                        .then((result) => {                                                                            
                                                                            if(result.Error){
                                                                                if(result.Error.Message){
                                                                                    showNotification('center', 'error', 'Transfer error', `${result.Error.Message}`);
                                                                                }
                                                                                else{
                                                                                    showNotification('center', 'error', 'Transfer error', `${result.Error}`);
                                                                                }
                                                                                return;
                                                                            }
                                                                            else {
                                                                                showNotification('center', 'success', 'Succes !', `Token <b>#${currentTokenId}</b> was successfully sent !<br> Tx hash: <u><b><a href="https://explorer-test-side01.aelf.io/tx/${txHash}" target="_blank">${txHash}</a></b></u>`);
                                                                            }
                                                                        })
                                                                        .catch((error) => {
                                                                            showNotification('center', 'error', 'Tx fetch error', `An error occurred while fetching the transaction result`);
                                                                            return;
                                                                        })
                                                                        return;
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    showNotification('center', 'error', 'Transfer error', `An error occurred [<b>tokenC.Transfer</b>]<br>${error.message}`);
                                                                    return;
                                                                });
                                                            }
                                                        })
                                                    })
                                                });
                                            }
                                        })
                                        .catch((error) => {
                                            showNotification('bottom-end', 'error', 'Error', `An error has occurred. [<b>Promise.all Tokens Metadata</b>]<br>Error mesage: <b>${error.message}</b>`)
                                            return;
                                        })
                                    })
                                    .catch((error) => {
                                        showNotification('bottom-end', 'error', 'Error', `An error has occurred. [<b>GetTokenURI Promise.all </b>]<br>Error mesage: <b>${error.message}</b>`)
                                        return;
                                    })
                                }
                            })
                            .catch((error) => {
                                showNotification('bottom-end', 'error', 'Error', `An error has occurred. [<b>tokenC.GetAllTokensOfOwner</b>]<br>Error mesage: <b>${error.message}</b>`)
                                return;
                            })
                        })
                        .catch((error) => {
                            showNotification('bottom-end', 'error', 'Error', `An error occurred while initializing the smart contract [<b>aelf.chain.contractAt</b>]<br>Error mesage: <b>${error.message}</b>`)
                            return;
                        })
                    }
                })
                .catch((error) => {
                    showNotification('bottom-end', 'error', 'Error', `An error has occurred. [<b>aelf.chain.getChainStatus</b>]<br>Error mesage: <b>${error.message}</b>`)
                    return;
                });
            })()
        }
    })
    .catch((error) => {
        console.log("LOGIN promise catch:", error);
    });
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
