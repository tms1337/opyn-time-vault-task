// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./SafeMath.sol";

// Debug import for hardhat console logging
import "hardhat/console.sol";

contract OpynVault is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 public constant TOTAL_TIME_IN_A_YEAR = 31536000;

    // ERC20 token used in the vault
    IERC20 public immutable token;

    // Annual yield percentage (in basis points, e.g., 5000 = 5%)
    uint256 public yearlyYield;

    // Pool of rewards available for distribution
    uint256 public rewardPool;

    // Structure to store user deposits
    struct UserDeposit {
        uint256 amount;    // Amount of tokens deposited
        uint256 timestamp; // Timestamp of the deposit
    }

    // Mapping of user addresses to their deposits
    mapping(address => UserDeposit[]) public depositsByUser;
    // Mapping of user addresses to their total deposit amounts
    mapping(address => uint256) public totalDepositsByUser;

    // Events for deposit and withdrawal actions
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    // Modifier to check if rewards are available
    modifier whenRewardsAvailable() {
        require(rewardPool > 0, "No rewards available.");
        _;
    }

    /**
     * @dev Checks if an address is a contract.
     * @param _addr The address to check.
     * @return bool True if the address is a contract, false otherwise.
     */
    function isContract(address _addr) public view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_addr)
        }
        return size > 0;
    }

    /**
     * @dev Constructor for the OpynVault contract.
     * @param _token The address of the ERC20 token.
     * @param _yearlyYield The annual yield percentage in basis points.
     */
    constructor(address _token, uint256 _yearlyYield) Ownable(msg.sender) {
        require(_token != address(0), "Token must be non-zero address");
        require(isContract(_token), "Token must be a contract");
        token = IERC20(_token);

        require(_yearlyYield > 0, "Yield must be greater than 0");
        yearlyYield = _yearlyYield;

        rewardPool = 0;
    }

    /**
     * @dev Returns the current reward pool amount.
     * @return uint256 The reward pool amount.
     */
    function getReward() external view returns (uint256) {
        return rewardPool;
    }

    /**
     * @dev Returns the total assets in the contract (reward pool).
     * @return uint256 The total assets.
     */
    function totalAssets() external view returns (uint256) {
        return rewardPool;
    }

    /**
     * @dev Returns the address of the ERC20 token used in the contract.
     * @return address The token address.
     */
    function getToken() external view returns (address) {
        return address(token);
    }

    /**
     * @dev Returns the total deposits by a user.
     * @param _user The address of the user.
     * @return uint256 The total deposit amount.
     */
    function getDeposit(address _user) external view returns (uint256) {
        return totalDepositsByUser[_user];
    }

    /**
     * @dev Allows the owner to deposit rewards into the reward pool.
     * @param _amount The amount of tokens to deposit.
     * @return bool, uint256 True if successful, and the deposited amount.
     */
    function depositRewards(uint256 _amount) external onlyOwner returns (bool, uint256) {
        require(_amount > 0, "Need to deposit non-zero amount");

        address owner = msg.sender;
        require(token.balanceOf(owner) >= _amount, "Owner must have sufficient tokens");

        uint256 balanceBefore = token.balanceOf(address(this));
        token.safeTransferFrom(owner, address(this), _amount);
        uint256 balanceAfter = token.balanceOf(address(this));
        assert(balanceAfter - balanceBefore == _amount);

        rewardPool += _amount;
        return (true, _amount);
    }

    /**
     * @dev Allows the owner to set the annual yield percentage.
     * @param _yearlyYield The new annual yield percentage in basis points.
     * @return bool, uint256 True if successful, and the new yield percentage.
     */
    function setRewardPercentage(uint256 _yearlyYield) external onlyOwner returns (bool, uint256) {
        require(_yearlyYield > 0, "Yield must be greater than 0");
        yearlyYield = _yearlyYield;

        return (true, yearlyYield);
    }

    /**
     * @dev Allows a user to deposit tokens into the vault.
     * @param _amount The amount of tokens to deposit.
     * @return bool, uint256 True if successful, and the deposited amount.
     */
    function deposit(uint256 _amount) external nonReentrant whenRewardsAvailable returns (bool, uint256) {
        require(_amount > 0, "Need to deposit non-zero amount");

        address user = msg.sender;
        require(token.balanceOf(user) >= _amount, "User must have sufficient tokens");

        uint256 balanceBefore = token.balanceOf(address(this));
        token.safeTransferFrom(user, address(this), _amount);
        uint256 balanceAfter = token.balanceOf(address(this));
        assert(balanceAfter > balanceBefore);

        UserDeposit memory newDeposit = UserDeposit({
            amount: _amount,
            timestamp: block.timestamp
        });
        depositsByUser[user].push(newDeposit);

        uint256 totalBefore = totalDepositsByUser[user];
        totalDepositsByUser[user] += _amount;
        uint256 totalAfter = totalDepositsByUser[user];
        assert(totalAfter > totalBefore);

        emit Deposit(user, _amount);
        return (true, _amount);
    }

    /**
     * @dev Calculates the reward for a given user.
     * @param _user The address of the user.
     * @return uint256 The calculated reward.
     */
    function calculateReward(address _user) public view returns (uint256) {
        require(_user != address(0), "Must be non-zero user address");

        UserDeposit[] memory userDeposits = depositsByUser[_user];
        uint256 reward = 0;

        for (uint i = 0; i < userDeposits.length; i++) {
            uint256 yield = calculateYield(
                userDeposits[i].amount,
                yearlyYield,
                userDeposits[i].timestamp,
                block.timestamp
            );

            reward += yield;
        }

        return reward;
    }

    /**
     * @dev Calculates the yield for a given deposit amount over a period of time.
     * @param _amount The deposit amount.
     * @param _yearlyYield The annual yield percentage in basis points.
     * @param _start_time The start time of the deposit.
     * @param _end_time The end time for the yield calculation.
     * @return uint256 The calculated yield.
     */
    function calculateYield(
        uint256 _amount,
        uint256 _yearlyYield,
        uint256 _start_time,
        uint256 _end_time
    ) public pure returns (uint256) {
        uint256 deltaT = _end_time.sub(_start_time);

        uint256 yearlyAmount = _amount.mul(_yearlyYield);
        uint256 yieldAmount = (deltaT.mul(yearlyAmount))
            .div(TOTAL_TIME_IN_A_YEAR)
            .div(1000) // due to proms format
            .div(100); // due to being percentage

        return yieldAmount;
    }

    /**
     * @dev Allows a user to withdraw their deposit and rewards.
     * @return bool, uint256 True if successful, and the total withdrawn amount.
     */
    function withdraw() whenRewardsAvailable public returns (bool, uint256) {
        address user = msg.sender;
        uint256 totalUserDepositAmount = totalDepositsByUser[user];

        if (totalUserDepositAmount == 0) {
            return (false, 0);
        }

        uint256 totalReward = calculateReward(user);
        uint256 totalWithdrawal = totalUserDepositAmount + totalReward;

        assert(totalWithdrawal >= totalUserDepositAmount);

        token.safeTransfer(user, totalWithdrawal);

        rewardPool -= totalReward;
        assert(rewardPool >= 0);

        delete depositsByUser[user];
        delete totalDepositsByUser[user];

        emit Withdrawal(user, totalWithdrawal);
        return (true, totalWithdrawal);
    }
}
