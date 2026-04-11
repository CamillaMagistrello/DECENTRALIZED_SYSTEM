// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DailyLuck is ERC721, Ownable {

    uint256 public nextNFTId;
    uint256 public nftMintPrice = 0.01 ether;

    mapping(uint256 => string) public nftRarity;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256[]) private _ownedTokens;

    mapping(string => string[]) private metadataURIsByRarity;
    mapping(string => string[]) private shuffledURIs;
    mapping(string => uint256) private pointerByRarity;

    constructor() ERC721("DailyLuck", "LUCK") Ownable() {

        string memory baseURI = "ipfs://bafybeidghxrekbru4bbtn7zzyxbiors44jrxjqt7fmlesip6mqd23h4imm/";

        // COMMON
        for (uint256 i = 1; i <= 11; i++) {
            metadataURIsByRarity["common"].push(
                string(abi.encodePacked(baseURI, uint2str(i), ".json"))
            );
        }

        // RARE
        for (uint256 i = 12; i <= 18; i++) {
            metadataURIsByRarity["rare"].push(
                string(abi.encodePacked(baseURI, uint2str(i), ".json"))
            );
        }

        // ULTRA RARE
        for (uint256 i = 19; i <= 20; i++) {
            metadataURIsByRarity["ultra_rare"].push(
                string(abi.encodePacked(baseURI, uint2str(i), ".json"))
            );
        }

        _initShuffle("common");
        _initShuffle("rare");
        _initShuffle("ultra_rare");
    }

    function mintDailyLuckNFT() public payable {
        require(msg.value >= nftMintPrice, "Not enough ETH");

        uint256 id = nextNFTId;
        nextNFTId++;

        string memory rarity = selectRandomRarity();
        string memory uri = selectMetadata(rarity);

        nftRarity[id] = rarity;
        _tokenURIs[id] = uri;
        _ownedTokens[msg.sender].push(id);

        _safeMint(msg.sender, id);
    }

    function selectMetadata(string memory rarity) internal returns (string memory) {
        string[] storage arr = shuffledURIs[rarity];

        require(arr.length > 0, "Empty rarity pool");

        uint256 pointer = pointerByRarity[rarity];
        string memory uri = arr[pointer];

        pointerByRarity[rarity] = (pointer + 1) % arr.length;

        return uri;
    }

    function _initShuffle(string memory rarity) internal {
        string[] storage pool = metadataURIsByRarity[rarity];

        require(pool.length > 0, "No metadata for rarity");

        string[] memory temp = new string[](pool.length);

        for (uint256 i = 0; i < pool.length; i++) {
            temp[i] = pool[i];
        }

        // Fisher-Yates deterministic-ish shuffle (safe for testnet use)
        for (uint256 i = 0; i < temp.length; i++) {
            uint256 j = uint256(
                keccak256(abi.encodePacked(block.prevrandao, i, rarity))
            ) % temp.length;

            (temp[i], temp[j]) = (temp[j], temp[i]);
        }

        delete shuffledURIs[rarity];

        for (uint256 i = 0; i < temp.length; i++) {
            shuffledURIs[rarity].push(temp[i]);
        }

        pointerByRarity[rarity] = 0;
    }

    function selectRandomRarity() internal view returns (string memory) {
        uint256 r = uint256(
            keccak256(
                abi.encodePacked(block.prevrandao, msg.sender, nextNFTId)
            )
        ) % 100;

        if (r < 85) return "common";
        else if (r < 95) return "rare";
        else return "ultra_rare";
    }

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