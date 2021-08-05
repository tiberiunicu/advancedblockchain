const ComposableToken = artifacts.require("ComposableToken");

contract("ComposableToken - initial supply", () => {
    it("initial supply should be 0 ", () =>
    ComposableToken.deployed()
        .then(async instance => {
            const totalSupply = await instance.totalSupply();
            assert.equal(0,totalSupply,"initial supply wasn't 0")
        }));    
  });

  contract("ComposableToken - set merkledistributor and check value", async([owner,user1]) => {
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


        it("should return error if token is minted from anyone other than the owner", async () => {

            const cmpToken = await ComposableToken.deployed();
            await cmpToken.setMerkleDistributor('0xB4Ba90A4365AA56Dc2902140E8773944D91dE4d4');
            try {
                await cmpToken.mint(10,{from: user1});
            }
            catch (exception) {
                assert(exception.message.indexOf('Only owner') > -1, 'FAILED - Only owner on MINT method');
            }
        });
  });