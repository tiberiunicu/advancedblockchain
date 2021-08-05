const ComposableToken = artifacts.require("ComposableToken");
const MerkleDistributor = artifacts.require("MerkleDistributor");





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
        
        
        // merkleDistributor.token = cmpToken.address;
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
        const merkleDistributor = await MerkleDistributor.deployed();
        const cmpToken = await ComposableToken.deployed();
        await cmpToken.setMerkleDistributor(merkleDistributor.address);
        await cmpToken.mint(10000000);
        // merkleDistributor.token = cmpToken.address;

        const user1UnclaimedTokens = 5000;
        const user2UnclaimedTokens = 1000;
        const user3UnclaimedTokens = 100;

        await merkleDistributor.addUnclaimedToken(user1,user1UnclaimedTokens);
        await merkleDistributor.addUnclaimedToken(user2,user2UnclaimedTokens);
        await merkleDistributor.addUnclaimedToken(user3,user3UnclaimedTokens);

        await merkleDistributor.claimToken('15000000', {from:user1});
        
        await merkleDistributor.claimToken(user2UnclaimedTokens, {from:user2});
        await merkleDistributor.claimToken(user3UnclaimedTokens, {from:user3});

        let unclaimedUser1 = await merkleDistributor.unclaimedToken(user1);
        let unclaimedUser2 = await merkleDistributor.unclaimedToken(user2);
        let unclaimedUser3 = await merkleDistributor.unclaimedToken(user3);

        // assert.equal(unclaimedUser1.toString(),0,'unclaimed tokens for user1 failed');
        // assert.equal(unclaimedUser2.toString(),0,'unclaimed tokens for user2 failed');
        // assert.equal(unclaimedUser3.toString(),0,'unclaimed tokens for user3 failed');

        let claimedUser1 = await merkleDistributor.claimedToken(user1);
        let claimedUser2 = await merkleDistributor.claimedToken(user2);
        let claimedUser3 = await merkleDistributor.claimedToken(user3);


        assert.equal(user1UnclaimedTokens,claimedUser1.toString(),'CLAIMED tokens for user1 failed');
        assert.equal(user2UnclaimedTokens,claimedUser2.toString(),'CLAIMED tokens for user2 failed');
        assert.equal(user3UnclaimedTokens,claimedUser3.toString(),'CLAIMED tokens for user3 failed');

    });


    contract("test bulk adding users and tokens",async([owner,user1,user2,user3])=>{
        it("set merkle distributor and add unclaimedTokens BULK", async () =>{
            const cmpToken = await ComposableToken.deployed();
            const merkleDistributor = await MerkleDistributor.deployed();
            await cmpToken.setMerkleDistributor(merkleDistributor.address);
            await cmpToken.mint(10000000);
            
            
            // merkleDistributor.token = cmpToken.address;
            const user1UnclaimedTokens = 5000;
            const user2UnclaimedTokens = 1000;
            const user3UnclaimedTokens = 100;
            let users = [user1,user2,user3];
            let tokens = [user1UnclaimedTokens,user2UnclaimedTokens,user3UnclaimedTokens];

            await merkleDistributor.addBulkUsersUnclaimedToken(users,tokens);
    
            assert.equal(user1UnclaimedTokens,await merkleDistributor.unclaimedToken(user1),'unclaimed tokens for user1 failed');
            assert.equal(user2UnclaimedTokens,await merkleDistributor.unclaimedToken(user2),'unclaimed tokens for user1 failed');
            assert.equal(user3UnclaimedTokens,await merkleDistributor.unclaimedToken(user3),'unclaimed tokens for user1 failed');
        });
    })

  });