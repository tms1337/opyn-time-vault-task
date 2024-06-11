# Sample deployment

- you can take a look at sample deployment at test the app at: https://opyn-time-vault.vercel.app/

---

# Project architecture

## Solidity

- solidity located at [packages/solidity](./packages/solidity/)
  - contains smart contracts in [/contracts](./packages/solidity/contracts)
  - contains comprehensive tests in [/test](./packages/solidity/test)

Smart contract build and test commands
```
yarn build
yarn build:f # in case you want --force build of contracts
npx hardhat test
```

## React web

- React app source located at [packages/web](./packages/web/)
  - contains `screens/` folder with single `MainScreen` in [/screens](./packages/web/screens/)
    - this screen encapsulates main logic needed for the task
    - also separate into sub-components located at [/screens/MainScreen/components](./packages/web/screens/MainScreen/components)

Development command:
```
yarn install
yarn start
```

Build and run command:
```
yarn install
yarn build
yarn start
```

---

# Final result overview

## Video sample

- click to watch the entire mini-demo

[![Watch the video](https://imgur.com/Wlp0f17.png)](https://www.youtube.com/watch?v=DWh0thjnf-o)


## Some in-app screenshots

| Column 1 | Column 2 |
|----------|----------|
| <img src="https://imgur.com/ACtqapA.png" width=600 /> | <img src="https://imgur.com/DOisIiJ.png" width=600 /> |
| <img src="https://imgur.com/MmgSuAi.png" width=600 /> |<img src="https://imgur.com/LHjTHj9.png" width=600 /> | 

---
