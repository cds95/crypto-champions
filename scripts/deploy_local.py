from brownie import WeatherWarsFactory, VRFCoordinatorMock, LinkToken, CryptoChampions, PriceWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    INIT_BTC_PRICE = 50000
    INIT_ETH_PRICE = 1600
    INIT_LINK_PRICE = 27
    INIT_DOT_PRICE = 34
    INIT_BNB_PRICE = 310
    INIT_UNI_PRICE = 29
    INIT_ADA_PRICE = 1

    CURRENT_BTC_PRICE = 60000
    CURRENT_ETH_PRICE = 2000
    CURRENT_LINK_PRICE = 30
    CURRENT_DOT_PRICE = 39
    CURRENT_BNB_PRICE = 340
    CURRENT_UNI_PRICE = 33
    CURRENT_ADA_PRICE = 2

    keyHash = 0
    fee = 0

    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    linkToken = LinkToken.deploy({ "from": accounts[0] })
    
    ## Setup Mock VRF
    vrfCoordinatorMock = VRFCoordinatorMock.deploy(linkToken.address, { "from": accounts[0] })
    btcV3Aggregator = MockV3Aggregator.deploy(18, INIT_BTC_PRICE, { "from": accounts[0] })
    ethV3Aggregator = MockV3Aggregator.deploy(18, INIT_ETH_PRICE, { "from": accounts[0] })
    linkV3Aggregator = MockV3Aggregator.deploy(18, INIT_LINK_PRICE, { "from": accounts[0] })
    dotV3Aggregator = MockV3Aggregator.deploy(18, INIT_DOT_PRICE, { "from": accounts[0] })
    bnbV3Aggregator = MockV3Aggregator.deploy(18, INIT_BNB_PRICE, { "from": accounts[0] })
    uniV3Aggregator = MockV3Aggregator.deploy(18, INIT_UNI_PRICE, { "from": accounts[0] })
    adaV3Aggregator = MockV3Aggregator.deploy(18, INIT_ADA_PRICE, { "from": accounts[0] })

    ## Setup CryptoChampions
    cc = CryptoChampions.deploy(keyHash, vrfCoordinatorMock.address, linkToken.address, minigameFactoryRegistry.address, { "from": accounts[0] })
    cc.createAffinity("BTC", btcV3Aggregator.address)
    cc.createAffinity("ETH", ethV3Aggregator.address)
    cc.createAffinity("LINK", linkV3Aggregator.address)
    cc.createAffinity("DOT", dotV3Aggregator.address)
    cc.createAffinity("BNB", bnbV3Aggregator.address)
    cc.createAffinity("UNI", uniV3Aggregator.address)
    cc.createAffinity("ADA", adaV3Aggregator.address)
    linkToken.transfer(cc.address, 1 * 10**18, { "from": accounts[0] })

    ## Mint Elder Spirits
    cc.mintElderSpirit(1, 1, "BTC", { "from": accounts[0], "value": 0.3 * 10 ** 18 })
    cc.mintElderSpirit(2, 2, "ETH", { "from": accounts[1], "value": 0.3 * 10 ** 18 })
    cc.mintElderSpirit(3, 3, "LINK", { "from": accounts[2], "value": 0.3 * 10 ** 18 })
    cc.mintElderSpirit(4, 4, "DOT", { "from": accounts[0], "value": 0.3 * 10 ** 18 })
    cc.mintElderSpirit(5, 5, "BNB", { "from": accounts[1], "value": 0.3 * 10 ** 18 })
    cc.mintElderSpirit(6, 6, "UNI", { "from": accounts[2], "value": 0.3 * 10 ** 18 })
    cc.mintElderSpirit(7, 7, "ADA", { "from": accounts[0], "value": 0.3 * 10 ** 18 })

    btcV3Aggregator.updateAnswer(CURRENT_BTC_PRICE)
    ethV3Aggregator.updateAnswer(CURRENT_ETH_PRICE)
    linkV3Aggregator.updateAnswer(CURRENT_LINK_PRICE)
    dotV3Aggregator.updateAnswer(CURRENT_DOT_PRICE)
    bnbV3Aggregator.updateAnswer(CURRENT_BNB_PRICE)
    uniV3Aggregator.updateAnswer(CURRENT_UNI_PRICE)
    adaV3Aggregator.updateAnswer(CURRENT_ADA_PRICE)

    # Transition to ACTION phase
    cc.refreshPhase()

    cc.mintHero(1, "hero 2", { "from": accounts[2], "value": 0.271 * 10**18 })
    cc.mintHero(2, "hero 1", { "from": accounts[1], "value": 0.271 * 10**18 })
    cc.mintHero(3, "hero 0", { "from": accounts[0], "value": 0.271 * 10**18 })
    
    PRICE_WARS = "PRICE_WARS"
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    minigameFactoryRegistry.registerMinigame(PRICE_WARS, pwf.address)
    linkToken.transfer(pwf.address, 1 * 10**18, { "from": accounts[0] })

    ## Setup WeatherWars
    WEATHER_WARS = "WEATHER_WARS"
    MOCK_ORACLE_ADD = "0xA5A407B4c0f32c621521d8556212fC22B5410E6A" 
    WEATHER_API_KEY = ""
    JOB_ID = "0x6237323835643438353964613462323839633738363164623937316261663061"
    SEED = 13563

    wwf = WeatherWarsFactory.deploy(cc.address, linkToken.address, MOCK_ORACLE_ADD, vrfCoordinatorMock.address, JOB_ID, keyHash, fee, SEED, fee, WEATHER_API_KEY, { "from": accounts[0] })
    linkToken.transfer(wwf.address, 1 * 10**18, { "from": accounts[0] })
    minigameFactoryRegistry.registerMinigame(WEATHER_WARS, wwf.address)
    