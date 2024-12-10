require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

const deploy = async () => {

  //To create Provider
  const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);

  //To Access wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  //Get ABI and bytecode
  const contractJson = JSON.parse(fs.readFileSync("simple.json"));
  const abi = contractJson.abi;
  const bytecode = contractJson.bytecode;

  //Start Deployment
  console.log("Deploying contract...");
  const factory = new ethers.ContractFactory(abi, bytecode, wallet); 
  const deployTx = factory.getDeployTransaction();

  //Calculate GAS
  const gasEstimate = await provider.estimateGas(deployTx);
  console.log("Gas estimate:", gasEstimate.toString());

  //Get wallet Balance
  const balance = await provider.getBalance(wallet.address);
  console.log("Wallet Balance: ", balance, "ETH");

  // Convert balance from wei to ether
  const balanceInEth = ethers.formatEther(balance);
  console.log("Wallet Balance: ", balanceInEth, "ETH");

  //Contract deployment
  const contract = await factory.deploy(); // Deploy the contract
  // Wait for the deployment to be mined 
  const receipt = contract.deploymentTransaction(); // Wait for the contract deployment transaction 
  console.log("Contract deployed at address:", receipt);
};


deploy().catch((err) => {
  console.error("Deployment failed:", err);
});
