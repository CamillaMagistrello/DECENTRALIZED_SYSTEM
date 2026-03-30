// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DailyLuck is ERC721URIStorage, Ownable {

    uint256 public nextNFTId;
    uint256 public nftMintPrice = 0.01 ether;

    // Stores the rarity of each minted NFT
    mapping(uint256 => string) public nftRarity;

    // Maps rarity -> list of metadata URIs (IPFS JSONs)
    mapping(string => string[]) public metadataURIsByRarity;

    constructor() ERC721("DailyLuck", "LUCK") {

        // ===== COMMON (1–11) =====
        for (uint256 i = 1; i <= 11; i++) {
            metadataURIsByRarity["common"].push(
                string(abi.encodePacked("ipfs://CID/", uint2str(i), ".json"))
            );
        }

        // ===== RARE (12–18) =====
        for (uint256 i = 12; i <= 18; i++) {
            metadataURIsByRarity["rare"].push(
                string(abi.encodePacked("ipfs://CID/", uint2str(i), ".json"))
            );
        }

        // ===== ULTRA RARE (19–20) =====
        for (uint256 i = 19; i <= 20; i++) {
            metadataURIsByRarity["ultra_rare"].push(
                string(abi.encodePacked("ipfs://CID/", uint2str(i), ".json"))
            );
        }
    }

    function generateRandomNumber(uint256 max) internal view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, block.prevrandao)
            )
        ) % max;
    }

    function selectRandomRarity() internal view returns (string memory) {
        uint256 randomPercentage = generateRandomNumber(100);

        if (randomPercentage < 60) return "common";       // 60% chance
        else if (randomPercentage < 90) return "rare";    // 30% chance
        else return "ultra_rare";                         // 10% chance
    }

    // Picks a random metadata URI from the given rarity pool
    function selectRandomMetadata(string memory rarity) internal view returns (string memory) {
        string[] memory metadataPool = metadataURIsByRarity[rarity];
        require(metadataPool.length > 0, "No metadata available for this rarity");

        uint256 randomIndex = generateRandomNumber(metadataPool.length);
        return metadataPool[randomIndex];
    }

    // Mint a new NFT with random rarity and metadata
    function mintDailyLuckNFT() public payable {
        require(msg.value >= nftMintPrice, "Not enough ETH to mint NFT");

        uint256 nftId = nextNFTId;
        nextNFTId++;

        string memory rarity = selectRandomRarity();
        string memory metadataURI = selectRandomMetadata(rarity);
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