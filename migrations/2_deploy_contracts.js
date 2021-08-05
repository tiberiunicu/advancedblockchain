const ComposableToken = artifacts.require("ComposableToken");
const MerkleDistributor = artifacts.require("MerkleDistributor");

module.exports = function (deployer,network,accounts) {
  deployer.deploy(ComposableToken);
//   const composableToken = ComposableToken.deplyed();

  deployer.deploy(MerkleDistributor);
//   const merkleDistributor = MerkleDistributor.deplyed();
    
};
