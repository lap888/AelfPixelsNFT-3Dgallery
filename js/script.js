// DOM elements
const walletDiv = document.getElementById("walletDiv");
const loginDiv = document.getElementById("loginDiv");
const logoutDiv = document.getElementById("logoutDiv");
const addressDiv = document.getElementById("addressDiv");

const loginBtn = document.getElementById("login-btn");
let logoutBtn = document.getElementById("logout-btn");

let aelf = null;

let walletAddress;

/* global NightElf */
const tokenContractAddress =
  "ELF_2cLA9kJW3gdHuGoYNY16Qir69J3Nkn6MSsuYxRkUHbz4SG2hZr_AELF";

let userLogin = false;

let nightElfInstance = null;

class NightElfCheck {
  constructor() {
    const readyMessage = "NightElf is ready!";
    let resovleTemp = null;

    this.check = new Promise((resolve, reject) => {
      if (window.NightElf) {
        resolve(readyMessage);
      }
      setTimeout(() => {
        reject({
          error: 200001,
          message:
            "timeout / can not find NightElf / please install the extension",
        });
      }, 1000);
      resovleTemp = resolve;
    });

    document.addEventListener("NightElf", (result) => {
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

nightElfCheck.check
  .then((message) => {

    aelf = new window.NightElf.AElf({
      httpProvider: ["https://explorer-test-side01.aelf.io/chain"],
      appName: "NFT dApp",
    });

    aelf
      .login({
        chainId: "AELF",
        payload: {
          method: "LOGIN",
        },
      })
      .then((result) => {
        walletAddress = JSON.parse(result.detail).address;
        loginDiv.classList.add("hidden");
        logoutDiv.classList.remove("hidden");
        addressDiv.innerHTML = `${walletAddress.substr(
          0,
          6
        )}...${walletAddress.substr(-6)}`;
        userLogin = true;
      })
      .catch((error) => {
        console.log("LOGIN promise catch:", error);
      });
  })
  .catch(function (e) {
    console.log(e);

    if (e.error == 200001) {
      console.log("Night Elf not installed, cannot get wallet address");

      loginBtn.onclick = function () {
        Swal.fire({
          title: "Error",
          html: "Night Elf not installed, cannot get wallet address",
          showConfirmButton: false,
          showCloseButton: true,
          footer:
            '<a style="color:blue" href="https://chrome.google.com/webstore/detail/aelf-explorer-extension-d/mlmlhipeonlflbcclinpbmcjdnpnmkpf" target="_blank">Install extension</a>',
        });
      };
    }
  });

loginBtn.onclick = function () {
  aelf
    .login({
      chainId: "AELF",
      payload: {
        method: "LOGIN",
      },
    })
    .then((result) => {
      walletAddress = JSON.parse(result.detail).address;
      loginDiv.classList.add("hidden");
      logoutDiv.classList.remove("hidden");
      addressDiv.innerHTML = `${walletAddress.substr(
        0,
        6
      )}...${walletAddress.substr(-6)}`;
      userLogin = true;
    })
    .catch((error) => {
      console.log("LOGIN promise catch:", error);
    });
};

logoutBtn.onclick = function () {
  aelf
    .logout({
      chainId: "AELF",
      address: walletAddress,
    })
    .then((result) => {
      loginDiv.classList.remove("hidden");
      logoutDiv.classList.add("hidden");
      userLogin = false;
    })
    .catch((error) => {
      console.log("LOGOUT promise catch:", error);
    });
};

