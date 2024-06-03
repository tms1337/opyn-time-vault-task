# React application to access the vault

## Deployment URL

- example deployed at: https://opyn-time-vault.vercel.app/

## Folder structure

- `config/` centralizes config
  - split into `DEV, TEST, PROD` versions
  - defines chains used per env
  - also one example of how feature flags can also be integrated here
    - probably better to inject them using env vars, here we just hardcoded as proof-of-concept given limited time we could not cover everything
    - we either show `Drip` button for faucet, depending if testing or "fo-real"
- `pages/` contains pages (1 in our case)
  - inside we have `effects/` that extracts effects for readability and separability of code
    - this stems from the fact we use `@walletconnect` via React hooks, so natural to split into these
  - inside we have `components/` with subcomponents showing data
  - most state management at page level, then passed lower down the tree
      - scalable for `depth = 1` so no need for fancy stuff
- `lib/` contains
  - wrappers/connectors to contracts we use
  - useful util functions like `async sleepms(...)`

## Starting the site

Run:
```
yarn install
yarn start
```

---
