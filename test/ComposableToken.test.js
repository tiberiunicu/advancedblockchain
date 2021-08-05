const ComposableToken = artifacts.require("ComposableToken");

contract("ComposableToken - initial supply", () => {
    it("initial supply should be 0 ", () =>
    ComposableToken.deployed()
        .then(async instance => {
            const totalSupply = await instance.totalSupply();
            assert.equal(0,totalSupply,"initial supply wasn't 0")
        }));    
  });

  contract("ComposableToken - set merkledistributor and check value", async([owner]) => {
    it("set merkledistributor and check values", () =>
    ComposableToken.deployed()
        .then(async instance => {
            await instance.setMerkleDistributor('0xB4Ba90A4365AA56Dc2902140E8773944D91dE4d4');
            await instance.mint(10000000,{from:owner});
            let totalSupply = await instance.totalSupply();
            let merkleAmount = await instance.balanceOf('0xB4Ba90A4365AA56Dc2902140E8773944D91dE4d4');
            assert.equal(10000000,merkleAmount,"1000 wasn't the merkleAmount");
            assert.equal(10000000,totalSupply,"1000 wasn't the totalSupply");
        }));    
  });