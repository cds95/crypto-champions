from brownie import WeatherWarsFactory, VRFCoordinatorMock, LinkToken, CryptoChampions, PriceWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    LINK_TOKEN_ADDRESS = "0x01be23585060835e02b77ef475b0cc51aa1e0709"
    VRF_ADDRESS = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"
    VRF_KEY_HASH = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
    FEE_IN_LINK = 0.1 * 10**18

    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    linkToken = LinkToken.at(LINK_TOKEN_ADDRESS)

    ## Setup CryptoChampions
    cc = CryptoChampions.deploy(VRF_KEY_HASH, VRF_ADDRESS, linkToken.address, minigameFactoryRegistry.address, { "from": accounts[0] })
    linkToken.transfer(cc.address, 10 * FEE_IN_LINK, { "from": accounts[0] })

    ## Setup price feeds
    V3_BTC = "0xECe365B379E1dD183B20fc5f022230C044d51404"
    V3_ETH = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
    V3_LINK = "0xd8bD0a1cB028a31AA859A21A3758685a95dE4623"
    V3_LTC = "0x4d38a35C2D87976F334c2d2379b535F1D461D9B4"
    V3_BNB = "0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED"
    V3_XRP = "0xc3E76f41CAbA4aB38F00c7255d4df663DA02A024"
    V3_ZRX = "0xF7Bbe4D7d13d600127B6Aa132f1dCea301e9c8Fc"

    cc.createAffinity("BTC", V3_BTC)
    cc.createAffinity("ETH", V3_ETH)
    cc.createAffinity("LINK", V3_LINK)
    cc.createAffinity("LTC", V3_LTC)
    cc.createAffinity("BNB", V3_BNB)
    cc.createAffinity("XRP", V3_XRP)
    cc.createAffinity("ZRX", V3_ZRX)
    
    ## Set phase durations to 0 for dev purposes
    cc.setSetupPhaseDuration(0, { "from": accounts[0] });
    cc.setActionPhaseDuration(0, { "from": accounts[0] });

    ## Setup price wars
    PRICE_WARS = "PRICE_WARS"
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    minigameFactoryRegistry.registerMinigame(PRICE_WARS, pwf.address)
    linkToken.transfer(pwf.address, 10 * FEE_IN_LINK, { "from": accounts[0] })

    ## Setup WeatherWars
    # NEED TO UPDATE THESE.  THESE ARE FROM KOVAN.  RINKEBY ORACLES ARE UNDER MAINTENANCE SO THIS FEATURE DOES NOT WORK ON RINKEBY.
    ORACLE = "0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b";
    JOB_ID = "0x6237323835643438353964613462323839633738363164623937316261663061" #"b7285d4859da4b289c7861db971baf0a";

    WEATHER_WARS = "WEATHER_WARS"
    WEATHER_API_KEY = ""; # Can get from openweather website 
    if len(WEATHER_API_KEY) == 0:
        raise "Don't forget to set your Weather API Key"
    
    wwf = WeatherWarsFactory.deploy(ORACLE, VRF_ADDRESS, linkToken.address, fee, VRF_KEY_HASH, WEATHER_API_KEY, JOB_ID, cc.address, { "from": accounts[0] })
    linkToken.transfer(wwf.address, 10 * FEE_IN_LINK, { "from": accounts[0] })
    minigameFactoryRegistry.registerMinigame(WEATHER_WARS, wwf.address)
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

    wwf.init()

    

    