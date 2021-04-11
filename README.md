# Crypto Champions: A Universal Character Generator and Gaming Ecosystem

## Description

Crypto Champz is a Universal Character Generator that takes advantage of NFT composability to create robust characters that are playable in an endless variety of games. NFTs are exploding in popularity but a lot of the current use cases revolve around speculative artwork. Owners of NFTs often purchase them with the hope that the price will increase. Instead of being purely collectible, we hope to create NFTs that have practical use cases and that are just plain **fun!**

Crypto Champz serve as NFT primitives that can be used to traverse the Metaverse of blockchain games. For example, your Champion might be used in a card game, a virtual board game, a farming simulator, or even your next D&D campaign! Of course, it can also be traded as a collectible. Over the next few years, we envision a wide Metaverse of blockchain based games that are an evolution of the early browser based games of the 2000s.

### Prototyping and Templating

Instead of minting Champions directly, players must "train" their Champions through Elder Spirits. Elder Spirits act as prototypes and templates from which Champions will inherit certain properties. Every Round, a new set of Elder Spirits is available to choose from. For example, Round 1 might have a Human Paladin, Elf Mage, and Bull Warrior to choose from. Round 2 might instead have options for a Bear Bard, a Human Mage, and a Robot Rogue. This keeps things fresh and adds a reason to keep coming back to the game.

### Royalty Mechanism

When a Champion trains with a certain Elder, the owner of that Elder gets paid a royalty fee. If you think that people will be very interested in a Robot Warrior, you might want to mint that specific Elder Spirit so you can earn the eventual royalties from it. Because Elders are rotated out (i.e. burned) every round, players always have the opportunity to earn fees without the system consolidating rent-seeking behavior in a few early participants.

### Character Randomization

While Champions inherit a few foundational features (Race, Class, Affinity) from their Elder Spirit, most of their properties are randomly generated using Chainlink VRF. Additional properties might be related to Lore (Hometown, Background, Alignment), Skills (Class Abilities, Racial Traits), or Core Stats (Health, Mana, Strength, Dexterity, etc.). There are trillions of unique combinations of Champions available!

### Mini Games

To jump start our gaming ecosystem, we have created two Mini Games that leverage exciting blockchain technologies.

-   One of our Mini Games uses Chainlink Price Feeds to link the price of an asset to a Champion. Players loyal to a high performing asset may earn rewards!
-   Another Mini Game allows Champions to duel each other. We use Chainlink Oracles to retrieve real time weather data which is used as input for Tournament conditions, and Chainlink VRF to randomize additional conditions. Those conditions plus the Champions' stats are used as input to determine the winner of the duel!

## Hands on:

### Demo Video

https://www.youtube.com/watch?v=KyIWXI5WxxE

### Live Demo (Rinkeby Network)

https://crypto-championz.herokuapp.com/#/
https://testnets.opensea.io/collection/unidentified-contract-fqpwyj1ot8

NOTE: It is normal if the metadata is empty or outdated on opeasea. For the time being the token URIs are updated periodically.

### Project Overview on Figma

https://www.figma.com/file/rvuFWE67GUzT9tX5YCnAXL/Untitled?node-id=0%3A1

### Web App Overview on Figma

https://www.figma.com/file/kl3gSohf3aPAibUwoNlKNG/Crypto-Champz-Web-App?node-id=0%3A1

## How to build and run this repo

This is the repo for the Crypto Champions application. The code is based off brownie's react mix.

https://github.com/brownie-mix/react-mix

### Installation

1. [Install Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html), if you haven't already. You must be using version `1.9.0` or newer.

2. Install the React client dependencies.

    ```bash
    cd client
    yarn install
    ```

3. In [MetaMask](https://metamask.io/) or another web3 browser extension, load the following seed phrase:

    ```bash
    hill law jazz limb penalty escape public dish stand bracket blue jar
    ```

    These accounts will automatically be funded.

## Usage

1. Open the Brownie console. Starting the console launches a fresh [Ganache](https://www.trufflesuite.com/ganache) instance in the background.

    ```bash
    $ brownie console
    Brownie v1.9.0 - Python development framework for Ethereum

    CryptoChampionsProject is the active project.
    Launching 'ganache-cli'...
    Brownie environment is ready.
    ```

2. Run the [deployment script](scripts/deploy.py) to deploy the project's smart contracts.

    ```python
    >>> run("deploy_local")
    Running 'scripts.deploy.main'...
    Transaction sent: 0xbed74d54a7875915321bb85daf6b1b3df8f4b6d271b1a2ae7f34a50be3e04a23
      Gas price: 0.0 gwei   Gas limit: 12000000   Nonce: 4
      CryptoChampions.constructor confirmed - Block: 5   Gas used: 5602990 (46.69%)
      CryptoChampions deployed at: 0xBCFBac3F75778A6DC9E80a1C1138B853d30F6284

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

## Goals for the future

We hope to expand upon this project with additional ideas such as:

-   Dynamically evolving NFTs based on smart contract outcomes (such as leveling up your Experience after adventures)
-   L2 Scaling (Polygon)
-   Community incentives to grow the ecosystem
-   Token marketplace
-   Multiple artists
-   More advanced UI / Web App
-   More character customization
