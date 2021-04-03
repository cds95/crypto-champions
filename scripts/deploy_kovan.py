from brownie import CryptoChampions, PriceWarsFactory, MockV3Aggregator, MinigameFactoryRegistry,  accounts

def main():
    LINK_TOKEN_ADDRESS = "0xa36085F69e2889c224210F603D836748e7dC0088"
    VRF_ADDRESS = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    VRF_KEY_HASH = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"

    ADA_PRICE_FEED = "0xAE48c91dF1fE419994FFDa27da09D5aC69c30f55"
    BTC_PRICE_FEED = "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c"
    ETH_PRICE_FEED = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
    LINK_PRICE_FEED = "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c"
    DOT_PRICE_FEED = "0x1C07AFb8E2B827c5A4739C6d59Ae3A5035f28734"
    BNB_PRICE_FEED = "0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16"
    UNI_PRICE_FEED = "0xDA5904BdBfB4EF12a3955aEcA103F51dc87c7C39"

    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    cc = CryptoChampions.deploy(VRF_KEY_HASH, VRF_ADDRESS, LINK_TOKEN_ADDRESS, minigameFactoryRegistry.address, { "from": accounts[0] })

    PRICE_WARS = "PRICE_WARS"
    minigameFactoryRegistry.registerMinigame(PRICE_WARS, pwf.address)

    cc.createAffinity("BTC", BTC_PRICE_FEED)
    cc.createAffinity("ETH", ETH_PRICE_FEED)
    cc.createAffinity("LINK", LINK_PRICE_FEED)
    cc.createAffinity("DOT", DOT_PRICE_FEED)
    cc.createAffinity("BNB", BNB_PRICE_FEED)
    cc.createAffinity("UNI", UNI_PRICE_FEED)
    cc.createAffinity("ADA", ADA_PRICE_FEED)