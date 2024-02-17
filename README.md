# Legatus
Privacy pools based anonymity protocol for DeFi applications

## Running the project in local environment

#### Clone the repository

```bash
git clone https://github.com/thomasacquin1225/Legatus.git
```

#### Install dependencies

```bash
cd Legatus
yarn
```

#### Setup environment variables

Create `.env` files in the workspaces and fill in the required environment variables based on the `.env.example` files.


#### Run Anvil fork

```bash
yarn fork
```

#### Start Semaphore API server

```bash
yarn start:backend
```

#### Start Association Set Provider (ASP) server

```bash
yarn start:asp
```

#### Start Next.js frontend

```bash
yarn start
```


### Contract deployments

**Scroll Sepolia**

| Contract | Deployment  |
| :----- | :- |
| PrivacyPool  | [`0xdCe231Df6213f2aF4e50542dAf26304fF0DD2A7c`](https://sepolia.scrollscan.dev/address/0xdce231df6213f2af4e50542daf26304ff0dd2a7c) |
| ASP | [`0xF7D885543e7cf6c6bCBFF726478ed0C90B0d9df4`](https://sepolia.scrollscan.dev/address/0xf7d885543e7cf6c6bcbff726478ed0c90b0d9df4)|
| UltraVerifier | [`0x763e001f6cc30eba4debfff35910932e523decd7`](https://sepolia.scrollscan.dev/address/0x763e001f6cc30eba4debfff35910932e523decd7)|
