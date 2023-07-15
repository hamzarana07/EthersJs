const ethers = require("ethers")
require("dotenv").config()
const fs = require("fs-extra")

async function main() {
    //http://0.0.0.0:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD,
    // )
    // wallet = await wallet.connect(provider)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8",
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying... Please wait....")
    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)
    console.log(`Contract deployed to ${contract.address}`)

    // get() is the function in SimpleStorage solidity file
    const currentFavoriteNumber = await contract.get()
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`)

    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavNumber = await contract.get()
    console.log(`Updated favorite number is: ${updatedFavNumber}`)
}
//0x9E8141D2e64EE5758466B8911b74462b509c74E3
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
