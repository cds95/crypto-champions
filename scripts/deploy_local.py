from brownie import VRFCoordinatorMock, LinkToken, CryptoChampions, PriceWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    INIT_BTC_PRICE = 50000
    INIT_ETH_PRICE = 1600
    INIT_LINK_PRICE = 27
    INIT_DOT_PRICE = 34
    INIT_BNB_PRICE = 310
    INIT_UNI_PRICE = 29
    INIT_ADA_PRICE = 1

    keyHash = 0

    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    linkToken = LinkToken.deploy({ "from": accounts[0] })
    vrfCoordinatorMock = VRFCoordinatorMock.deploy(linkToken.address, { "from": accounts[0] })
    cc = CryptoChampions.deploy(keyHash, vrfCoordinatorMock.address, linkToken.address, minigameFactoryRegistry.address, { "from": accounts[0] })

    btcV3Aggregator = MockV3Aggregator.deploy(18, INIT_BTC_PRICE, { "from": accounts[0] })
    ethV3Aggregator = MockV3Aggregator.deploy(18, INIT_ETH_PRICE, { "from": accounts[0] })
    linkV3Aggregator = MockV3Aggregator.deploy(18, INIT_LINK_PRICE, { "from": accounts[0] })
    dotV3Aggregator = MockV3Aggregator.deploy(18, INIT_DOT_PRICE, { "from": accounts[0] })
    bnbV3Aggregator = MockV3Aggregator.deploy(18, INIT_BNB_PRICE, { "from": accounts[0] })
    uniV3Aggregator = MockV3Aggregator.deploy(18, INIT_UNI_PRICE, { "from": accounts[0] })
    adaV3Aggregator = MockV3Aggregator.deploy(18, INIT_ADA_PRICE, { "from": accounts[0] })

    PRICE_WARS = "PRICE_WARS"
    minigameFactoryRegistry.registerMinigame(PRICE_WARS, pwf.address)

    cc.createAffinity("BTC", btcV3Aggregator.address)
    cc.createAffinity("ETH", ethV3Aggregator.address)
    cc.createAffinity("LINK", linkV3Aggregator.address)
    cc.createAffinity("DOT", dotV3Aggregator.address)
    cc.createAffinity("BNB", bnbV3Aggregator.address)
    cc.createAffinity("UNI", uniV3Aggregator.address)
    cc.createAffinity("ADA", adaV3Aggregator.address)