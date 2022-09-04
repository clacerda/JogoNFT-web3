const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
    const gameContract = await gameContractFactory.deploy(
        ["Vigia", "Clérigo", "Caçador"],
        [
            "https://i.pinimg.com/originals/9a/c3/5c/9ac35c43bfb65d1474946a29b86edc26.png",
            "https://i.pinimg.com/originals/ec/45/80/ec4580d525dfafcd8c22a5a8f4d26033.png",
            "https://i.pinimg.com/736x/a1/73/f2/a173f2c606cdf256d9ce21e35e87ea86.jpg",
        ],
        [300, 400, 200], // HP values
        [100, 50, 150], // Attack damage values 
        "Ctulhu",
        "https://www.seekpng.com/png/full/149-1495615_cthulhu-cthulhu-pixel-art.png",
        10000,
        70
    );
    await gameContract.deployed();
    console.log("Contrato implantado no endereço:", gameContract.address);

    let txn;
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    // Pega o valor da URI da NFT
    let returnedTokenUri = await gameContract.tokenURI(1);
    console.log("Token URI:", returnedTokenUri);



};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();