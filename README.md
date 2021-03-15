# Crypto Champions

This is the repo for the Crypto Champions application. The code is based off brownie's react mix.

https://github.com/brownie-mix/react-mix

## Installation

1. [Install Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html), if you haven't already. You must be using version `1.9.0` or newer.

2. Download the mix.

   ```bash
   brownie bake react-mix
   ```

3. Install the React client dependencies.

   ```bash
   cd client
   yarn install
   ```

4. In [MetaMask](https://metamask.io/) or another web3 browser extension, load the following seed phrase:

   ```bash
   hill law jazz limb penalty escape public dish stand bracket blue jar
   ```

   These accounts will automatically be funded.

## Usage

1. Open the Brownie console. Starting the console launches a fresh [Ganache](https://www.trufflesuite.com/ganache) instance in the background.

   ```bash
   $ brownie console
   Brownie v1.9.0 - Python development framework for Ethereum

   ReactMixProject is the active project.
   Launching 'ganache-cli'...
   Brownie environment is ready.
   ```

2. Run the [deployment script](scripts/deploy.py) to deploy the project's smart contracts.

   ```python
   >>> run("deploy")
   Running 'scripts.deploy.main'...
   Transaction sent: 0xd1000d04fe99a07db864bcd1095ddf5cb279b43be8e159f94dbff9d4e4809c70
   Gas price: 0.0 gwei   Gas limit: 6721975
   SolidityStorage.constructor confirmed - Block: 1   Gas used: 110641 (1.65%)
   SolidityStorage deployed at: 0xF104A50668c3b1026E8f9B0d9D404faF8E42e642

   Transaction sent: 0xee112392522ed24ac6ab8cc8ba09bfe51c5d699d9d1b39294ba87e5d2a56212c
   Gas price: 0.0 gwei   Gas limit: 6721975
   VyperStorage.constructor confirmed - Block: 2   Gas used: 134750 (2.00%)
   VyperStorage deployed at: 0xB8485421abC325D172652123dBd71D58b8117070
   ```

3. While Brownie is still running, start the React app in a different terminal.

   ```bash
   # make sure to use a different terminal, not the brownie console
   cd client
   yarn start
   ```

4. Connect Metamask to the local Ganache network. In the upper right corner, click the network dropdown menu. Select `Localhost 8545`, or:

   ```bash
   New Custom RPC
   http://localhost:8545
   ```

5. Interact with the smart contracts using the web interface or via the Brownie console.

   ```python
   # get the newest vyper storage contract
   >>> vyper_storage = VyperStorage[-1]

   # the default sender of the transaction is the contract creator
   >>> vyper_storage.set(1337)
   ```

   Any changes to the contracts from the console should show on the website after a refresh, and vice versa.

## Ending a Session

When you close the Brownie console, the Ganache instance also terminates and the deployment artifacts are deleted.

To retain your deployment artifacts (and their functionality) you can launch Ganache yourself prior to launching Brownie. Brownie automatically attaches to the ganache instance where you can deploy the contracts. After closing Brownie, the chain and deployment artifacts will persist.

## Further Possibilities

### Testing

To run the test suite:

```bash
brownie test
```

### Deploying to a Live Network

To deploy your contracts to the mainnet or one of the test nets, first modify [`scripts/deploy.py`](`scripts/deploy.py`) to [use a funded account](https://eth-brownie.readthedocs.io/en/stable/account-management.html).

Then:

```bash
brownie run deploy --network kovan
```

Replace `kovan` with the name of the network you wish you use. You may also wish to adjust Brownie's [network settings](https://eth-brownie.readthedocs.io/en/stable/network-management.html).

For contracts deployed on a live network, the deployment information is stored permanently unless you:

- Delete or rename the contract file or
- Manually remove the `client/src/artifacts/` directory
