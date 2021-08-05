const ComposableToken = artifacts.require("ComposableToken");
const MerkleDistributor = artifacts.require("MerkleDistributor");

module.exports = async function (deployer,network,accounts)  {
  await deployer.deploy(ComposableToken);
  const composableToken = await ComposableToken.deployed();

  await deployer.deploy(MerkleDistributor,composableToken.address);
//   const merkleDistributor = MerkleDistributor.deplyed();
    
};
