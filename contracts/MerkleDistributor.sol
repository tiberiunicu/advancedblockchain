//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ComposableToken.sol";

contract MerkleDistributor {
    ComposableToken public token;
    address public owner;
    mapping(address=>uint) public unclaimedToken;
    mapping(address=>uint) public claimedToken;
    
    event UnclaimedTokenAdded (
        address indexed user, 
        uint indexed amount
    );
    
    event tokenClaimed (
        address indexed user, 
        uint indexed amount
    );
    
    modifier OnlyOwner(){
        require(msg.sender == owner,'Only owner');
        _;
    }

    constructor (ComposableToken _token)  {
        owner = msg.sender;
        token = _token;
    }

    function addUnclaimedToken(address user, uint amount) public OnlyOwner{
        require(amount <= IERC20(token).totalSupply(), 'amount greater than total supply');
        unclaimedToken[user] = unclaimedToken[user] + amount;
        emit UnclaimedTokenAdded(user, amount);
    }
    
    function claimToken(uint amount) external {
        require(unclaimedToken[msg.sender] > 0, 'Your balance is too low!');
        require(unclaimedToken[msg.sender] >= amount, 'Insuficient founds!');
        unclaimedToken[msg.sender] -= amount;
        claimedToken[msg.sender] += amount;
        IERC20(token).transfer(msg.sender,amount);
        emit tokenClaimed(msg.sender, amount);
    }
    
    function addBulkUsersUnclaimedToken(address[] calldata users, uint[] calldata amounts) external{
        require(users.length > 0 , 'Array is empty');
        require(users.length == amounts.length, 'Arrays have differents lenghts');
        for (uint8 i=0;i< users.length; i++){
            addUnclaimedToken(users[i], amounts[i]);
        }
    }
}