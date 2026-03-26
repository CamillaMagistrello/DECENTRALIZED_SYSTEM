pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DailyLuck is ERC721URIStorage, Ownable {

    uint256 public nextTokenId; // Counter for NFT IDs
    uint256 public mintPrice = 0.01 ether; // Price to buy one fortune (in ETH)

    mapping(uint256 => string) public fortuneURIs; // Mapping: fortune ID -> metadata URI (IPFS JSON)

    constructor() ERC721("DailyLuck", "LUCK") {}

    // Set the metadata URI for a specific fortune
    // Only the contract owner can call this
    function setFortune(uint256 id, string memory uri) public onlyOwner {
        fortuneURIs[id] = uri;
    }

    // Generate a pseudo-random number between 0 and (max - 1)
    // Uses block data (not secure for production randomness)
    function getRandom(uint256 max) internal view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, block.prevrandao)
            )
        ) % max;
    }

    function getRandomFortune() internal view returns (uint256) {
        uint256 rand = getRandom(100);

        if (rand < 60) return 0;
        else if (rand < 90) return 1;
        else return 2;
    }

    function buyFortune() public payable {
        require(msg.value >= mintPrice, "Not enough ETH");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        uint256 fortuneId = getRandomFortune();

        // Mint NFT to buyer
        _safeMint(msg.sender, tokenId);

        // Assign metadata URI to NFT
        _setTokenURI(tokenId, fortuneURIs[fortuneId]);
    }

    // Withdraw all ETH from the contract (only owner)
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}