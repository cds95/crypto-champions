from brownie import CryptoChampions, PriceWarsFactory, MockV3Aggregator, VRFCoordinatorMock, LinkToken, MinigameFactoryRegistry, accounts

def main():
    INIT_BTC_PRICE = 50000
    CURRENT_BTC_PRICE = 60000

    INIT_ETH_PRICE = 1600
    CURRENT_ETH_PRICE = 1700

    INIT_LINK_PRICE = 27
    CURRENT_LINK_PRICE = 30

    PRICE_WARS = "PRICE_WARS"

    linkToken = LinkToken.deploy({ "from": accounts[0] })
    vrfCoord = VRFCoordinatorMock.deploy(linkToken.address, { "from": accounts[0] })
    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    cc = CryptoChampions.deploy(0, vrfCoord.address, linkToken.address, minigameFactoryRegistry.address, { "from": accounts[0] })
    linkToken.transfer(cc.address, 10**18, { 'from': accounts[0] })

    btcV3Aggregator = MockV3Aggregator.deploy(18, INIT_BTC_PRICE, { "from": accounts[0] })
    ethV3Aggregator = MockV3Aggregator.deploy(18, INIT_ETH_PRICE, { "from": accounts[0] })
    linkV3Aggregator = MockV3Aggregator.deploy(18, INIT_LINK_PRICE, { "from": accounts[0] })

    minigameFactoryRegistry.registerMinigame(PRICE_WARS, pwf.address)

    cc.createAffinity("BTC", btcV3Aggregator.address)
    cc.createAffinity("ETH", ethV3Aggregator.address)
    cc.createAffinity("LINK", linkV3Aggregator.address)

    cc.mintElderSpirit(1, 1, "BTC", { "from": accounts[0], "value": 0.3 * 10 ** 18 })
    cc.mintElderSpirit(2, 2, "ETH", { "from": accounts[0], "value": 0.3 * 10 ** 18 })
    cc.mintElderSpirit(3, 3, "LINK",{ "from": accounts[0], "value": 0.3 * 10 ** 18 })

    cc.refreshPhase()

    cc.mintHero(0, "hero 2", { "from": accounts[2], "value": 0.271 * 10**18 })
    cc.mintHero(1, "hero 1", { "from": accounts[1], "value": 0.271 * 10**18 })
    cc.mintHero(2, "hero 0", { "from": accounts[0], "value": 0.271 * 10**18 })
    
    btcV3Aggregator.updateAnswer(CURRENT_BTC_PRICE)
    ethV3Aggregator.updateAnswer(CURRENT_ETH_PRICE)
    linkV3Aggregator.updateAnswer(CURRENT_LINK_PRICE)
    cc.refreshPhase()