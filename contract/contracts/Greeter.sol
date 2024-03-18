pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string private greeting;

    constructor(string memory _greeting ) {
        console.log("deploying a greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        console.log(greeting);
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("change greeting from '%s' to '%s'", greeting, _greeting);
        greeting =_greeting;
    }

    function deposit() payable public {}
}