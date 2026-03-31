// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DailyLuckShuffle is ERC721URIStorage, Ownable {

    uint256 public nextNFTId;
    uint256 public nftMintPrice = 0.01 ether;

    // Stores the rarity of each minted NFT
    mapping(uint256 => string) public nftRarity;

    // Maps rarity -> list of metadata URIs (IPFS JSONs)
    mapping(string => string[]) public metadataURIsByRarity;

    // Shuffled arrays for each rarity
    mapping(string => string[]) private shuffledURIs;
    mapping(string => uint256) private shufflePointer;

    constructor() ERC721("DailyLuckShuffle", "LUCK") {

        string memory baseURI = string(abi.encodePacked("ipfs://bafybeidghxrekbru4bbtn7zzyxbiors44jrxjqt7fmlesip6mqd23h4imm/"));
        // ===== COMMON (1–11) =====
        for (uint256 i = 1; i <= 11; i++) {
            metadataURIsByRarity["common"].push(
                string(abi.encodePacked(baseURI, uint2str(i), ".json"))
            );
        }
        // ===== RARE (12–18) =====
        for (uint256 i = 12; i <= 18; i++) {
            metadataURIsByRarity["rare"].push(
                string(abi.encodePacked(baseURI, uint2str(i), ".json"))
            );
        }
        // ===== ULTRA RARE (19–20) =====
        for (uint256 i = 19; i <= 20; i++) {
            metadataURIsByRarity["ultra_rare"].push(
                string(abi.encodePacked(baseURI, uint2str(i), ".json"))
            );
        }

        // Initialize shuffle arrays
        _initShuffle("common");
        _initShuffle("rare");
        _initShuffle("ultra_rare");
    }

    // Initialize shuffled array for a rarity
    function _initShuffle(string memory rarity) internal {
        string[] storage pool = metadataURIsByRarity[rarity];
        string[] storage shuffleArray = shuffledURIs[rarity];

        for (uint256 i = 0; i < pool.length; i++) {
            shuffleArray.push(pool[i]);
        }
        _shuffleArray(shuffleArray);
        shufflePointer[rarity] = 0;
    }

    // Fisher–Yates shuffle
    function _shuffleArray(string[] storage array) internal {
        for (uint i = 0; i < array.length; i++) {
            uint j = i + uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i))) % (array.length - i);
            string memory temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    // Picks a “shuffled” metadata URI from the pool
    function selectShuffledMetadata(string memory rarity) internal returns (string memory) {
        string[] storage shuffleArray = shuffledURIs[rarity];
        uint256 index = shufflePointer[rarity];

        string memory selectedURI = shuffleArray[index];

        // Move pointer forward; loop back if at end
        shufflePointer[rarity] = (index + 1) % shuffleArray.length;

        return selectedURI;
    }

    function generateRandomNumber(uint256 max) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao))) % max;
    }

    function selectRandomRarity() internal view returns (string memory) {
        uint256 randomPercentage = generateRandomNumber(100);

        if (randomPercentage < 85) return "common";       // 85% chance
        else if (randomPercentage < 95) return "rare";    // 10% chance
        else return "ultra_rare";                         // 5% chance
    }

    // Mint a new NFT
    function mintDailyLuckNFT() public payable {
        require(msg.value >= nftMintPrice, "Not enough ETH to mint NFT");

        uint256 nftId = nextNFTId;
        nextNFTId++;

        string memory rarity = selectRandomRarity();
        string memory metadataURI = selectShuffledMetadata(rarity);

        nftRarity[nftId] = rarity;
        _safeMint(msg.sender, nftId);
        _setTokenURI(nftId, metadataURI);
    }

    function withdrawFunds() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function uint2str(uint256 _value) internal pure returns (string memory) {
        if (_value == 0) return "0";

        uint256 temp = _value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);
        uint256 index = digits;

        while (_value != 0) {
            index = index - 1;
            buffer[index] = bytes1(uint8(48 + _value % 10));
            _value /= 10;
        }

        return string(buffer);
    }
}