// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./SafeMath.sol";

// debug
import "hardhat/console.sol";

contract OpynVault is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // uint256 public constant TOTAL_TIME_IN_A_YEAR = 365*24*60*60;
    uint256 public constant TOTAL_TIME_IN_A_YEAR = 31536000;

    IERC20 public immutable token;

    uint256 public yearlyYield;

    uint256 public rewardPool;

    struct UserDeposit {
        // use same uint width
        // for stacking
        uint256 amount;
        uint256 timestamp;
    }
    mapping(address => UserDeposit[]) public depositsByUser;
    mapping(address => uint256) public totalDepositsByUser;

    // events
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    // helpers

    modifier whenRewardsAvailable() {
        // double check just in case
        require(rewardPool > 0 && rewardPool != 0 , "No rewards available.");
        _;
    }

    function isContract(address _addr) public view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_addr)
        }
        return size > 0;
    }

    // main

    constructor(address _token, uint256 _yearlyYield) Ownable(msg.sender) {
        require(_token != address(0), "Token must be non-0 address");
        require(isContract(_token), "Token must be contract");
        token = IERC20(_token);
        
        // yearly yield in proms
        // meaning 5% we would send as 5 * 1000 = 5000
        // or 0.5% we would send as 0.5 * 1000 = 500
        // this is due to more precise calc later on
        require(_yearlyYield > 0, "Yield must be greater than 0");
        yearlyYield = _yearlyYield;

        rewardPool = 0;
    }

    // getters
    function getReward() external view returns (uint256) {
        return rewardPool;
    }

    function getToken() external view returns (address) {
        return address(token);
    }

    // state based getters
    function getDeposit(address _user) external view returns (uint256) {
        return totalDepositsByUser[_user];
    }

    // owner only

    function depositRewards(uint256 _amount) external onlyOwner returns (bool, uint256) {
        require(_amount > 0, "Need to deposit non-zero amount");

        // think about user == owner ???
        address owner = msg.sender;
        require(
            token.balanceOf(owner) >= _amount,
            "Owner must have sufficient tokens"
        );
        
        uint256 balanceBefore = token.balanceOf(address(this));
        token.safeTransferFrom(owner, address(this), _amount);
        uint256 balanceAfter = token.balanceOf(address(this));
        assert(balanceAfter - balanceBefore == _amount);
        
        rewardPool += _amount;

        return (true, _amount);
    }

    function setRewardPercentage(uint256 _yearlyYield) external onlyOwner returns (bool, uint256) {
        // yearly yield in proms
        // meaning 5% we would send as 5 * 1000 = 5000
        // or 0.5% we would send as 0.5 * 1000 = 500
        // this is due to more precise calc later on
        require(_yearlyYield > 0, "Yield must be greater than 0");
        yearlyYield = _yearlyYield;

        return (true, yearlyYield);
    }

    // user funcs

    function deposit(uint256 _amount) external nonReentrant whenRewardsAvailable returns (bool, uint256) {
        require(_amount > 0, "Need to deposit non-zero amount");

        // think about user == owner ???
        address user = msg.sender;
        require(
            token.balanceOf(user) >= _amount,
            "User must have sufficient tokens"
        );

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
    
    function calculateReward(address _user) public view returns (uint256) {
        require(_user != address(0), "Must be non-zero user address");
    
        UserDeposit[] memory userDeposits = depositsByUser[_user];
        uint256 reward = 0;

        for (uint i = 0; i < userDeposits.length; i++) {
            console.log(
                "[calculateReward]", 
                " #1",
                " userDeposits[i].timestamp = ",
                userDeposits[i].timestamp
            );
            console.log(
                "[calculateReward]", 
                " #1",
                " block.timestamp = ",
                block.timestamp
            );
            console.log(
                "[calculateReward]", 
                " #1",
                " userDeposits[i].amount = ",
                userDeposits[i].amount
            );
            console.log(
                "[calculateReward]", 
                " #1",
                " yearlyYield = ",
                yearlyYield
            );
            console.log(" ");

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

    function calculateYield(
        uint256 _amount,
        uint256 _yearlyYield,
        uint256 _start_time,
        uint256 _end_time
    ) public pure returns (uint256) {

        uint256 deltaT = _end_time.sub(_start_time);
        console.log(
            "[yield]", 
            " #1",
            " deltaT = ",
            deltaT
        );
        console.log(" ");
        
        uint256 yearlyAmount = _amount.mul(_yearlyYield);
        uint256 yieldAmount = (deltaT.mul(yearlyAmount))
            .div(TOTAL_TIME_IN_A_YEAR)
            .div(1000) // due to proms format
            .div(100); // due to being perc
        console.log(
            "[yield]", 
            " #2",
            " yearlyAmount = ",
            yearlyAmount
        );
        console.log(
            "[yield]", 
            " #2",
            " yieldAmount = ",
            yieldAmount
        );
        console.log(" ");

        return yieldAmount;
    }

    function withdraw() whenRewardsAvailable public returns (bool, uint256) {
        address user = msg.sender;
        uint256 totalUserDepositAmount = totalDepositsByUser[user];

        console.log(
            "[withdraw]", 
            " #1",
            " totalUserDepositAmount = ",
            totalUserDepositAmount
        );

        // save on gas
        if(totalUserDepositAmount == 0) {
            return (false, 0);
        }

        console.log(
            "[withdraw]", 
            " #1",
            " totalUserDepositAmount = ",
            totalUserDepositAmount
        );
        console.log(
            "[withdraw]", 
            " #1",
            " rewardPool = ",
            rewardPool
        );
        console.log(" ");

        uint256 totalReward = calculateReward(user);
        uint256 totalWithdrawal = totalUserDepositAmount + totalReward;

        console.log(
            "[withdraw]", 
            " #2",
            " totalWithdrawal = ",
            totalWithdrawal
        );
        console.log(
            "[withdraw]", 
            " #2",
            " totalReward = ",
            totalReward
        );
        console.log(
            "[withdraw]", 
            " #2",
            " totalUserDepositAmount = ",
            totalUserDepositAmount
        );
        console.log(
            "[withdraw]", 
            " #2",
            "balance(user) before =",
            token.balanceOf(user)
        );
        console.log(" ");

        // calculation sanity check
        // cant lose money
        assert(totalWithdrawal >= totalUserDepositAmount);

        // transferable state changes
        uint256 totalBefore = token.balanceOf(address(this));
        token.safeTransfer(user, totalWithdrawal);
        uint256 totalAfter = token.balanceOf(address(this));

        console.log(
            "[withdraw]", 
            " #3",
            " totalBefore = ",
            totalBefore
        );
        console.log(
            "[withdraw]", 
            " #3",
            " totalAfter = ",
            totalAfter
        );
        console.log(
            "[withdraw]", 
            " #3",
            "balance(user) after =",
            token.balanceOf(user)
        );
        console.log(" ");

        // assert(totalAfter - totalBefore == totalWithdrawal);
        
        // state changes

        console.log(
            "[withdraw]", 
            " #4",
            " rewardPool = ",
            rewardPool
        );
        console.log(
            "[withdraw]",
            " #4",
            " totalWithdrawal = ",
            totalWithdrawal
        );
        console.log(" ");

        rewardPool -= totalReward;
        assert(rewardPool >= 0);

        delete depositsByUser[user];
        delete totalDepositsByUser[user]; 

        emit Withdrawal(user, totalWithdrawal);
        
        return (true, totalWithdrawal);
    }

}
