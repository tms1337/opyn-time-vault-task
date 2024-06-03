# Solidity smart contracts

- here we build smart contracts to support our little Vault project
- we slightly change requirements, we inject any `ERC20` contract for ease of development
  - then easy to hardcode `WETH` address when deploying
- we also support faucet for our token for easier testing (hence `Faucet.sol` contract), BUT only for testing purposes, we remove this by feature flag in the `web/` in prod env
  - note: we haven't deployed and tested on mainnet...
- contracts in `contracts/` folder, more details below

## Tech stack

- built using `hardhat` framework
  - enables running tests
  - enables running local node
  - enables `console.log` in contracts that is no-op in prod deployments
  - has a ton of helpers like `ignite` for deployment
  - all in all good ecosystem
- we use TDD unless backward incompatible etc. but goal of having each FEATURE covered by test scenarios is 99% done either way (more details in Testing Strategy below)

## Testing strategy

- since we are highly focused on tested code, even mostly doing TDD, we think few explainer lines about our testing strategy is in order
- for each FEATURE (loosely defined) we have try types of tests:
  - happy paths
  - edge cases
  - mutliple interactions with multiple addresses (solidity specific)
- we also like th conceopt of `scenario-tests` but didnt have time to finish that here
  - main idea: simulate random paths with multiple addresses, that simulate realistic contract usage
    - since randomized, can emulate various scenarios happening
    - we have a set of INVARIANTS we check after each random step
    - this way the longer it runs, the more sure we are contract won't come into illegal state
    - this is low-hanging fruit method, without going into formal proofs let's say, to have a safety net
  - we left work in progress, so we might discuss or finish in the potential next step

## Folder structure

- at the bottom of sub-chapter we have partial/shortened output of `tree -L 2 .` command
  - this can help us visualize the structure
  - we will explain some of the most important folders and files below
  - most of the structure self-explanatory, so we will focus only on things not obvious from the structure or naming, as well as some additional notes if such
- as noted, `contracts/` folder contains our main solidity logic
  - the only contract that is truely deliverable of this project is `OpynVault.sol`
  - other contracts for testing purposes, except `SafeMath` which we manually imported rather than via `@openzepelin/...` as other ones
- folder `tests/`
  - notice that we have the numbered so we know the order of added features when using TDD
  - also notice that accompanying each `.sol.js` is `.txt` file which briefly outlines the test cases contained within test suite
    - this can be say good communication tool without need to dwelve into code or tests, sort of auto-documenting haha

### Output of tree command

```
├── ...
├── artifacts
├── contracts
│   ├── OpynVault.sol
│   ├── SafeMath.sol
├── hardhat.config.js
└── test
    ├── 1.0.OpynVaultInitialitization.spec.txt
    ├── 1.1.OpynVaultInitialization.spec.js
    ├── ...
└── ...
```

---

## Running the code

- in the context of this part of project, running means running tests and they all should pass
- we do two variants
  - pure testing from compiled `.sol` artefacts and usual `hardhat` testing approach
  - but also with `localhost:8545` node running and our contracts deployed
    - this way we also check `ignition` modules are in ok

### Bulild and run script

```
yarn build:f
yarn test
```

---

## Example results

- below is sample <span style="color: #00ff00">GREEN</span> run run on our local setup

<img src="https://imgur.com/bzWpwtm.png" width=750 />

---