const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { listDeployments } = require("@nomicfoundation/ignition-core");

module.exports = buildModule("ERC20MintableModule_2", (m) => {
  const token = m.contract("ERC20Mintable", ["TokenName", "TKN"], {});

  m.call(token, "mint", [m.getAccount(0), "0x1000000000000000"], {
    id: "mint_to_owner",
  });

  m.call(
    token,
    "mint",
    ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "0x100000000000"],
    { id: "mint_to_user" }
  );
  m.call(
    token,
    "mint",
    ["0x90F79bf6EB2c4f870365E785982E1f101E93b906", "0x100000000000000000"],
    { id: "mint_to_test_metamask" }
  );

  const vault = m.contract("Vault", [token], {
    id: "deploy_vault",
    from: m.getAccount(0),
  });

  m.call(vault, "depositRewards", ["0x100000000000"], {
    id: "deposit_init_rewards",
    from: m.getAccount(0),
    after: [
      m.call(token, "approve", [vault, "0x1000000000000"], {
        id: "owner_approve_before_rewards",
        from: m.getAccount(0),
      }),
    ],
  });

  return { token, vault };
});
