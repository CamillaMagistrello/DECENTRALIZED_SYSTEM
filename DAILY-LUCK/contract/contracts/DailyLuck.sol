// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DailyLuck is ERC721, Ownable {

    enum Rarity { COMMON, RARE, ULTRA_RARE }

    uint256 public nextNFTId;
    uint256 public nftMintPrice = 0.01 ether;

    mapping(uint256 => Rarity) public nftRarity;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256[]) private _ownedTokens;

    mapping(Rarity => string[]) private urisByRarity;

    constructor() ERC721("DailyLuck", "LUCK") Ownable() {

        string memory baseURI = "ipfs://bafybeifcqenldpzvlvdjtaqqxaatjfwmqgnkr6ihrun33rlkhyza5gabwa/";

        // COMMON (1–11)
        for (uint256 i = 1; i <= 11; i++) {
            urisByRarity[Rarity.COMMON].push(
                string(abi.encodePacked(baseURI, uint2str(i), ".json"))
            );
        }

        // RARE (12–18)
        for (uint256 i = 12; i <= 18; i++) {
            urisByRarity[Rarity.RARE].push(
                string(abi.encodePacked(baseURI, uint2str(i), ".json"))
            );
        }

        // ULTRA RARE (19–20)
        for (uint256 i = 19; i <= 20; i++) {
            urisByRarity[Rarity.ULTRA_RARE].push(
                string(abi.encodePacked(baseURI, uint2str(i), ".json"))
            );
        }
    }

    function _random(uint256 max) internal view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.timestamp,
                    msg.sender,
                    address(this),
                    nextNFTId
                )
            )
        ) % max;
    }

    function _selectRandomRarity() internal view returns (Rarity) {
        uint256 r = _random(100);

        if (r < 85) return Rarity.COMMON;
        else if (r < 95) return Rarity.RARE;
        else return Rarity.ULTRA_RARE;
    }

    function _getMetadata(Rarity rarity) internal view returns (string memory) {
        string[] storage arr = urisByRarity[rarity];
        uint256 index = _random(arr.length);
        return arr[index];
    }

    // MINT FUNCTION
    function mintDailyLuckNFT() public payable {
        require(msg.value >= nftMintPrice, "Not enough ETH");

        uint256 id = nextNFTId;
        nextNFTId++;

        Rarity rarity = _selectRandomRarity();
        string memory uri = _getMetadata(rarity);

        nftRarity[id] = rarity;
        _tokenURIs[id] = uri;
        _ownedTokens[msg.sender].push(id);

        _safeMint(msg.sender, id);
    }

    // VIEW FUNCTIONS
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function getUserNFTs(address user) public view returns (uint256[] memory) {
        return _ownedTokens[user];
    }

    function withdrawFunds() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    // UTILS
    function uint2str(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";

        uint256 temp = value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + value % 10));
            value /= 10;
        }

        return string(buffer);
    }
}