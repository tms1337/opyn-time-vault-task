// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./SafeMath.sol";

contract Faucet {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public token;

    uint256 public immutable dripAmount;

    constructor(address _token, uint256 _dripAmount) {
      token = IERC20(_token);
      dripAmount = _dripAmount;
    }

    function dripToken() external returns (bool, uint256) {
      address user = msg.sender;

      uint256 faucetBalance = token.balanceOf(address(this));

      if(faucetBalance > dripAmount) {
        token.safeTransfer(user, dripAmount);
        return (true, dripAmount);
      } else {
        return (false, 0x0);
      }
    }

}
