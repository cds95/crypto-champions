from brownie import CryptoChampions, PriceWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, accounts

def main():
    INIT_BTC_PRICE = 50000
    CURRENT_BTC_PRICE = 60000

    INIT_ETH_PRICE = 1600
    CURRENT_ETH_PRICE = 1700

    INIT_LINK_PRICE = 27
    CURRENT_LINK_PRICE = 30

    PRICE_WARS = "PRICE_WARS"

    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    cc = CryptoChampions.deploy(minigameFactoryRegistry.address, { "from": accounts[0] })
    btcV3Aggregator = MockV3Aggregator.deploy(18, INIT_BTC_PRICE, { "from": accounts[0] })
    ethV3Aggregator = MockV3Aggregator.deploy(18, INIT_ETH_PRICE, { "from": accounts[0] })
    linkV3Aggregator = MockV3Aggregator.deploy(18, INIT_LINK_PRICE, { "from": accounts[0] })

    minigameFactoryRegistry.registerMinigame(PRICE_WARS, pwf.address)

    cc.createAffinity("BTC", btcV3Aggregator.address)
    cc.createAffinity("ETH", ethV3Aggregator.address)
    cc.createAffinity("LINK", linkV3Aggregator.address)