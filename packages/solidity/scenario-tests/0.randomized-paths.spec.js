const { expect } = require("chai");
const { ethers } = require("hardhat");

const randomParamsGenerator = (paramGenerators) => async () => {
  const params = await Promise.all(paramGenerators.map(async (gen) => gen()));
  return params;
};

const runEvent = (event) => async (params) => async () => {
  const startTime = performance.now();
  const result = await event(...params);
  const endTime = performance.now();
  return { result, duration: endTime - startTime };
};

const checkInvariants = (invariants) => async (beforeState, afterState) => {
  for (const invariant of invariants) {
    await invariant(beforeState, afterState);
  }
};

const performRandomizedTesting =
  (events) =>
  async (initialState, iterations = 100) => {
    let state = { ...initialState };
    for (let i = 0; i < iterations; i++) {
      const eventIndex = Math.floor(Math.random() * events.length);
      const { event, paramGenerator, invariants } = events[eventIndex];

      const params = await paramGenerator();
      const eventRunner = await runEvent(event)(params);

      const beforeState = { ...state };
      const { result, duration } = await eventRunner();
      const afterState = { ...state, ...result };

      await checkInvariants(invariants)(beforeState, afterState);

      state = afterState;
    }
    return state;
  };

describe("Randomized Testing for OpynVault", function () {
  let vault, token, owner, users;

  beforeAll(async () => {
    [owner, ...users] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ERC20Mintable");
    token = await Token.deploy();
    await token.deployed();

    const Vault = await ethers.getContractFactory("OpynVault");
    vault = await Vault.deploy(token.address, 5000); // Example yearly yield of 5%
    await vault.deployed();

    // Distribute tokens to owner and users
    await token.transfer(owner.address, ethers.utils.parseEther("1000"));
    for (let user of users) {
      await token.transfer(user.address, ethers.utils.parseEther("100"));
    }
  });

  const ownerActions = [
    {
      event: async (amount) => vault.connect(owner).depositRewards(amount),
      paramGenerator: randomParamsGenerator([
        async () => ethers.utils.parseEther(Math.random() * 10 + ""),
      ]),
      invariants: [
        async (before, after) => {
          const balanceBefore = await token.balanceOf(owner.address);
          const balanceAfter = await token.balanceOf(owner.address);
          expect(balanceAfter).to.be.lt(balanceBefore);
        },
      ],
    },
  ];

  const userActions = [
    {
      event: async (amount) =>
        vault
          .connect(users[Math.floor(Math.random() * users.length)])
          .deposit(amount),
      paramGenerator: randomParamsGenerator([
        async () => ethers.utils.parseEther(Math.random() * 10 + ""),
      ]),
      invariants: [
        async (before, after) => {
          const user = users[Math.floor(Math.random() * users.length)];
          const balanceBefore = await token.balanceOf(user.address);
          const balanceAfter = await token.balanceOf(user.address);
          expect(balanceAfter).to.be.lt(balanceBefore);
        },
      ],
    },
    {
      event: async () =>
        vault
          .connect(users[Math.floor(Math.random() * users.length)])
          .withdraw(),
      paramGenerator: randomParamsGenerator([]),
      invariants: [
        async (before, after) => {
          const user = users[Math.floor(Math.random() * users.length)];
          const balanceBefore = await token.balanceOf(user.address);
          const balanceAfter = await token.balanceOf(user.address);
          expect(balanceAfter).to.be.gte(balanceBefore);
        },
      ],
    },
  ];

  it("performs randomized testing", async function () {
    const events = [...ownerActions, ...userActions];
    const initialState = {
      ownerBalance: await token.balanceOf(owner.address),
      userBalances: await Promise.all(
        users.map((user) => token.balanceOf(user.address))
      ),
      vaultBalance: await token.balanceOf(vault.address),
    };

    await performRandomizedTesting(events)(initialState, 100);
  });
});
