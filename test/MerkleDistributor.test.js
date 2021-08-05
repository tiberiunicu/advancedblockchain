const ComposableToken = artifacts.require("ComposableToken");
const MerkleDistributor = artifacts.require("MerkleDistributor");

contract("test bulk adding users and tokens",async([owner,user1,user2,user3])=>{
    it("set merkle distributor and add unclaimedTokens BULK", async () =>{
        const cmpToken = await ComposableToken.deployed();
        const merkleDistributor = await MerkleDistributor.deployed();
        await cmpToken.setMerkleDistributor(merkleDistributor.address);
        await cmpToken.mint(10000000);
        
        const user1UnclaimedTokens = 5000;
        const user2UnclaimedTokens = 1000;
        const user3UnclaimedTokens = 100;
        let users = [user1,user2,user3];
        let tokens = [user1UnclaimedTokens,user2UnclaimedTokens,user3UnclaimedTokens];
        var debug1 = await cmpToken.totalSupply();
        var debug2 = await cmpToken.balanceOf(merkleDistributor.address);
        await merkleDistributor.addBulkUsersUnclaimedToken(users,tokens);

        assert.equal(user1UnclaimedTokens,await merkleDistributor.unclaimedToken(user1),'unclaimed tokens for user1 failed');
        assert.equal(user2UnclaimedTokens,await merkleDistributor.unclaimedToken(user2),'unclaimed tokens for user1 failed');
        assert.equal(user3UnclaimedTokens,await merkleDistributor.unclaimedToken(user3),'unclaimed tokens for user1 failed');
    });
});


  contract("test composable and merkle distributor", async([owner,user1,user2,user3]) => {
    it("set merkledistributor and check value", async() =>{
        const cmpToken = await ComposableToken.deployed();
        await cmpToken.setMerkleDistributor('0xB4Ba90A4365AA56Dc2902140E8773944D91dE4d4');
        await cmpToken.mint(10000000);
        let merkleAmount = await cmpToken.balanceOf('0xB4Ba90A4365AA56Dc2902140E8773944D91dE4d4');
        assert.equal(10000000,merkleAmount,"10000000 wasn't the merkleAmount");
    });  

    it("set merkle distributor and add unclaimedTokens", async () =>{
        const cmpToken = await ComposableToken.deployed();
        const merkleDistributor = await MerkleDistributor.deployed();
        await cmpToken.setMerkleDistributor(merkleDistributor.address);
        await cmpToken.mint(10000000);
        
        const user1UnclaimedTokens = 5000;
        const user2UnclaimedTokens = 1000;
        const user3UnclaimedTokens = 100;
        
        await merkleDistributor.addUnclaimedToken(user1,user1UnclaimedTokens);
        await merkleDistributor.addUnclaimedToken(user2,user2UnclaimedTokens);
        await merkleDistributor.addUnclaimedToken(user3,user3UnclaimedTokens);

        assert.equal(user1UnclaimedTokens,await merkleDistributor.unclaimedToken(user1),'unclaimed tokens for user1 failed');
        assert.equal(user2UnclaimedTokens,await merkleDistributor.unclaimedToken(user2),'unclaimed tokens for user1 failed');
        assert.equal(user3UnclaimedTokens,await merkleDistributor.unclaimedToken(user3),'unclaimed tokens for user1 failed');
    });
    
    it("set merkle distributor, add unclaimedTokens and CLAIM TOKENS", async () =>{
        const cmpToken = await ComposableToken.deployed();
        const merkleDistributor = await MerkleDistributor.deployed();
        await cmpToken.setMerkleDistributor(merkleDistributor.address);
        await cmpToken.mint(10000000);


        const user1UnclaimedTokens = 5000;
        const user2UnclaimedTokens = 1000;
        const user3UnclaimedTokens = 100;

        await merkleDistributor.addUnclaimedToken(user1,user1UnclaimedTokens);
        await merkleDistributor.addUnclaimedToken(user2,user2UnclaimedTokens);
        await merkleDistributor.addUnclaimedToken(user3,user3UnclaimedTokens);

        await merkleDistributor.claimToken(user1UnclaimedTokens, {from:user1});
        await merkleDistributor.claimToken(user2UnclaimedTokens, {from:user2});
        await merkleDistributor.claimToken(user3UnclaimedTokens, {from:user3});

        let claimedUser1 = await merkleDistributor.claimedToken(user1);
        let claimedUser2 = await merkleDistributor.claimedToken(user2);
        let claimedUser3 = await merkleDistributor.claimedToken(user3);

        let claimedUser1InToken = await cmpToken.balanceOf(user1);
        let claimedUser2InToken = await cmpToken.balanceOf(user2);
        let claimedUser3InToken = await cmpToken.balanceOf(user3);

        assert.equal(user1UnclaimedTokens,claimedUser1InToken.toString(),'CLAIMED tokens for user1 failed');
        assert.equal(user2UnclaimedTokens,claimedUser2InToken.toString(),'CLAIMED tokens for user2 failed');
        assert.equal(user3UnclaimedTokens,claimedUser3InToken.toString(),'CLAIMED tokens for user3 failed');


        assert.equal(user1UnclaimedTokens,claimedUser1.toString(),'CLAIMED tokens for user1 failed');
        assert.equal(user2UnclaimedTokens,claimedUser2.toString(),'CLAIMED tokens for user2 failed');
        assert.equal(user3UnclaimedTokens,claimedUser3.toString(),'CLAIMED tokens for user3 failed');

    });

    it("should return error if user tries to claim more tokens than available", async () =>{
        
        const cmpToken = await ComposableToken.deployed();
        const merkleDistributor = await MerkleDistributor.deployed();
        await cmpToken.setMerkleDistributor(merkleDistributor.address);
        await cmpToken.mint(10000000);

        const user1UnclaimedTokens = 5000;

        await merkleDistributor.addUnclaimedToken(user1,user1UnclaimedTokens);
        try{
            await merkleDistributor.claimToken('150000', {from:user1})
        }
        catch(exception){
            assert(exception.message.indexOf('Insuficient founds!') > 0,'users tries to claim more tokens than available');
        }
    
    });
  });