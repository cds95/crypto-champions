from brownie import WeatherWarsFactory, VRFCoordinatorMock, LinkToken, CryptoChampions, PriceWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    LINK_TOKEN_ADDRESS = "0x01be23585060835e02b77ef475b0cc51aa1e0709"
    VRF_ADDRESS = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"
    VRF_KEY_HASH = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
    FEE_IN_LINK = 0.1 * 10**18

    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    linkToken = LinkToken.at(LINK_TOKEN_ADDRESS)
    champzToken = ChampzToken.deploy({ "from": accounts[0] })

    ## Setup CryptoChampions
    cc = CryptoChampions.deploy(VRF_KEY_HASH, VRF_ADDRESS, linkToken.address, minigameFactoryRegistry.address, champzToken, { "from": accounts[0] })
    linkToken.transfer(cc.address, 10 * FEE_IN_LINK, { "from": accounts[0] })
    champzToken.transferOwnership(cc.address, { "from": accounts[0] })

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

    ## Setup price wars
    PRICE_WARS = "PRICE_WARS"
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    minigameFactoryRegistry.registerMinigame(PRICE_WARS, pwf.address)
    linkToken.transfer(pwf.address, 10 * FEE_IN_LINK, { "from": accounts[0] })

    

    
    