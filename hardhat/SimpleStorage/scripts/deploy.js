const { ethers, run, network } = require("hardhat")
require("dotenv").config();

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.waitForDeployment();
    console.log(simpleStorage)
    console.log("=====================================================")
    console.log(simpleStorage.target)
    console.log(network.config)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.waitForDeployment()
        await delay(60000);
        await verify(simpleStorage.target, [])
    }
    const currentValue = await simpleStorage.get()
    console.log(`Current Value is: ${currentValue}`)

    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.get()
    console.log(`Updated value is: ${updatedValue}`)
}

async function verify(contractAddress, args){
    console.log("Verifying Contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")){
            console.log("Already Verified")
        } else{
            console.log(e)
        }
    }
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
