from brownie import VRFCoordinatorMock, LinkToken, CryptoChampions, WeatherWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    INIT_BTC_PRICE = 50000
    INIT_ETH_PRICE = 1600
    INIT_LINK_PRICE = 27

    keyHash = 0
    fee = 0 

    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    linkToken = LinkToken.deploy({ "from": accounts[0] })
    vrfCoordinatorMock = VRFCoordinatorMock.deploy(linkToken.address, { "from": accounts[0] })
    cc = CryptoChampions.deploy(keyHash, vrfCoordinatorMock.address, linkToken.address, minigameFactoryRegistry.address, { "from": accounts[0] })
    wwf = WeatherWarsFactory.deploy(cc.address, vrfCoordinatorMock.address, linkToken.address, fee, keyHash, { "from": accounts[0] })
    
    linkToken.transfer(cc.address, 1 * 10**18, { "from": accounts[0] })
    linkToken.transfer(wwf.address, 1 * 10**18, { "from": accounts[0] })

    btcV3Aggregator = MockV3Aggregator.deploy(18, INIT_BTC_PRICE, { "from": accounts[0] })
    ethV3Aggregator = MockV3Aggregator.deploy(18, INIT_ETH_PRICE, { "from": accounts[0] })
    linkV3Aggregator = MockV3Aggregator.deploy(18, INIT_LINK_PRICE, { "from": accounts[0] })
    
    WEATHER_WARS = "WEATHER_WARS"
    minigameFactoryRegistry.registerMinigame(WEATHER_WARS, wwf.address)

    cc.createAffinity("BTC", btcV3Aggregator.address)
    cc.createAffinity("ETH", ethV3Aggregator.address)
    cc.createAffinity("LINK", linkV3Aggregator.address)

    cc.mintElderSpirit(1, 1, "BTC", { "from": accounts[0], "value": 0.3 * 10 ** 18 })
    cc.mintElderSpirit(2, 2, "ETH", { "from": accounts[1], "value": 0.3 * 10 ** 18 })

    cc.setPhase(1)

    cc.mintHero(1, "heroName", { "from": accounts[3], "value": 0.271 * 10**18 })
    cc.mintHero(1, "heroName", { "from": accounts[4], "value": 0.271 * 10**18 })
    
    wwf.init()
    wwf.createWeatherWars("test", 10**18, cc.address)