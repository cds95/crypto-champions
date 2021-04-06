from brownie import WeatherWars, VRFCoordinatorMock, LinkToken, CryptoChampions, WeatherWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    INIT_BTC_PRICE = 50000
    INIT_ETH_PRICE = 1600
    INIT_LINK_PRICE = 27

    keyHash = 0
    fee = 0 

    # Does not point to anything
    MOCK_ORACLE_ADD = "0xA5A407B4c0f32c621521d8556212fC22B5410E6A" 
    WEATHER_API_KEY = ""
    JOB_ID = "0x6237323835643438353964613462323839633738363164623937316261663061"

    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    linkToken = LinkToken.deploy({ "from": accounts[0] })
    vrfCoordinatorMock = VRFCoordinatorMock.deploy(linkToken.address, { "from": accounts[0] })
    cc = CryptoChampions.deploy(keyHash, vrfCoordinatorMock.address, linkToken.address, minigameFactoryRegistry.address, { "from": accounts[0] })
    wwf = WeatherWarsFactory.deploy(MOCK_ORACLE_ADD, vrfCoordinatorMock.address, linkToken.address, fee, keyHash, WEATHER_API_KEY, JOB_ID, cc.address, { "from": accounts[0] })
    
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
    cc.mintElderSpirit(3, 3, "ETH", { "from": accounts[1], "value": 0.3 * 10 ** 18 })

    cc.setPhase(1)

    cc.mintHero(1, "heroName", { "from": accounts[3], "value": 0.271 * 10**18 })
    cc.mintHero(2, "heroName", { "from": accounts[4], "value": 0.271 * 10**18 })
    cc.mintHero(3, "testName", { "from": accounts[0], "value": 0.271 * 10**18 })
    
    wwf.init()

    cities = [
        "6173331",
        "4671654",
        "4887398",
        "4164138",
        "5128581",
        "5391811",
        "5391959",
        "5809844",
        "3530597",
        "3435907",
        "993800",
        "360630",
        "2643743",
        "524894",
        "2950158",
        "2968815",
        "2759794",
        "2673722",
        "1850147",
        "1275339",
        "1796236",
        "1835847",
        "1880252",
        "2158177"
    ]
    for i in range(0, len(cities)):
        wwf.addCityMapping(cities[i], i)
    
    weathers = [
        "Clouds",
        "Clear",
        "Atmosphere",
        "Snow",
        "Rain",
        "Drizzle",
        "Thunderstorm"
    ]
    for i in range(0, len(weathers)):
        wwf.addWeatherMapping(weathers[i], i)



    
    