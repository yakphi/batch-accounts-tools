var fs = require('fs');
const { ethers, providers } = require('ethers');
const abi = require('../data/abi-erc1155.json');
// const { ThirdwebSDK } = require("@thirdweb-dev/sdk");


const contractAddress = "";

// Main account
const privateKey = "";

// Transfers destination
const addressTarget = "";

const rpc = "";

const provider = new ethers.providers.JsonRpcProvider(rpc);
// const signer = new ethers.Wallet( privateKey, provider );
// const contract = new ethers.Contract(contractAddress, abi, signer);


// const main = async () => {
//     const address = await signer.getAddress(); 
//     console.log("Pub: " + address);

//     const data = fs.readFileSync("addresses-14.txt");

//     const addresses = JSON.parse(data);

//     for (let i = 0; i < addresses.length; i++) {
//         const keypair = addresses[i];

//         console.log("Pub: " + keypair.pub);

//         const sdk = ThirdwebSDK.fromPrivateKey(keypair.priv, "polygon");
//         const contract = sdk.getNFTDrop(contractAddress);
//         await contract.claimTo(keypair.pub, 1);
//     }
// }


const transferNft = async () => {
    const walletsFilename = "../data/wallets.json";

    const data = fs.readFileSync(walletsFilename);
    const addresses = JSON.parse(data);

    for (let i = 0; i < addresses.length; i++) {
        const keypair = addresses[i];
        console.log("Pub: " + keypair.pub);

        const signer = new ethers.Wallet(keypair.priv, provider);
        const contract = new ethers.Contract(contractAddress, abi, signer);

        let maxFeePerGas = ethers.BigNumber.from(50000000000) // fallback to 40 gwei
        let maxPriorityFeePerGas = ethers.BigNumber.from(50000000000) // fallback to 40 gwei

        await contract.safeTransferFrom(keypair.pub, addressTarget, 0, 1, [], {
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
    }
}



const createWallets = async (walletsAmount) => {
    let allWallets = [];

    for (let i = 0; i < walletsAmount; i++) {
        let randomWallet = ethers.Wallet.createRandom();

        console.log("Pub: " + randomWallet.address);
        console.log("Priv: " + randomWallet.privateKey);

        allWallets.push({ pub: randomWallet.address, priv: randomWallet.privateKey });
    }

    const jsonData = JSON.stringify(allWallets);

    fs.writeFileSync("./data/wallets.json", jsonData);
}

const fundAll = async () => {
    const mainAddress = await signer.getAddress();
    console.log("Main wallet: " + mainAddress);
    const balance = await signer.getBalance();
    console.log("MATIC balance: " + ethers.utils.formatEther(balance));

    const feeData = await provider.getFeeData();

    const data = fs.readFileSync("./data/wallets.json");
    // console.log(data);

    const addresses = JSON.parse(data);


    for (let i = 0; i < addresses.length; i++) {
        const keypair = addresses[i];

        console.log("Pub: " + keypair.pub);
        // console.log("Priv: " + keypair.priv);

        const tx = {
            to: keypair.pub,
            value: ethers.utils.parseEther('0.1'),
            gasPrice: feeData.gasPrice,
        }

        //   console.log(tx);

        const txResp = await signer.sendTransaction(tx);

        console.log(txResp.hash);

        //   await provider.waitForTransaction(txResp.hash);

    }
}

const jsonsToCsv = async () => {
    const outputFileName = './data/wallets.csv';
    const fileNames = ['./data/wallets.json'];

    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        console.log('Processing ' + fileName);
        const file = fs.readFileSync(fileName);
        const addresses = JSON.parse(file);

        for (let j = 0; j < addresses.length; j++) {
            const keyPair = addresses[j];
            fs.appendFileSync(outputFileName, keyPair.pub + ',' + keyPair.priv + '\n');
        }
    }
}

// jsonsToCsv();
// fundAll();
createWallets(2);
// main();
// transferNft();
