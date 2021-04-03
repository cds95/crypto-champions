from brownie import CryptoChampions, PriceWarsFactory, MockV3Aggregator, MinigameFactoryRegistry,  accounts

def main():
    LINK_TOKEN_ADDRESS = "0xa36085F69e2889c224210F603D836748e7dC0088"
    VRF_ADDRESS = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    VRF_KEY_HASH = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"

    BNB_PRICE_FEED = "0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16"
    BTC_PRICE_FEED = "0x6135b13325bfC4B00278B4abC5e20bbce2D6580e"
    COMP_PRICE_FEED = "0xECF93D14d25E02bA2C13698eeDca9aA98348EFb6"
    ETH_PRICE_FEED = "0x9326BFA02ADD2366b30bacB125260Af641031331"
    LINK_PRICE_FEED = "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0"
    LTC_PRICE_FEED = "0xCeE03CF92C7fFC1Bad8EAA572d69a4b61b6D4640"
    UNI_PRICE_FEED = "0xDA5904BdBfB4EF12a3955aEcA103F51dc87c7C39"

    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    cc = CryptoChampions.deploy(VRF_KEY_HASH, VRF_ADDRESS, LINK_TOKEN_ADDRESS, minigameFactoryRegistry.address, { "from": accounts[0] })

    PRICE_WARS = "PRICE_WARS"
    minigameFactoryRegistry.registerMinigame(PRICE_WARS, pwf.address)

    cc.createAffinity("BTC", BTC_PRICE_FEED)
    cc.createAffinity("ETH", ETH_PRICE_FEED)
    cc.createAffinity("LINK", LINK_PRICE_FEED)
    cc.createAffinity("LTC", LTC_PRICE_FEED)
    cc.createAffinity("BNB", BNB_PRICE_FEED)
    cc.createAffinity("UNI", UNI_PRICE_FEED)
    cc.createAffinity("COMP", COMP_PRICE_FEED)