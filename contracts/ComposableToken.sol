//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ComposableToken is IERC20{ 
    address owner;
    address merkleDistributor;
    string  public name = "Composable Token";
    string  public symbol = "CMP";
    uint256 public override totalSupply;
    
    event TokenMinted(
        address indexed owner, 
        uint256 indexed amount
    );
    
    mapping(address => uint256) public override  balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    constructor()  {
        owner = msg.sender;
    }
    
    function setMerkleDistributor (address merkleAddress) external OnlyOwner {
        require(merkleAddress != address(0),'Invalid address');
        merkleDistributor = merkleAddress;
    }

    function transfer(address _to, uint256 _value) public override returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public override returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function mint(uint256 amount) external  OnlyOwner{
        balanceOf[merkleDistributor] = amount;
        totalSupply += amount;
        emit TokenMinted(msg.sender,amount);
    }
    
    modifier OnlyOwner(){
        require(msg.sender == owner,'Only owner');
        _;
    }
}
