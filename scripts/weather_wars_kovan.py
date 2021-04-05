from brownie import VRFCoordinatorMock, LinkToken, CryptoChampions, WeatherWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    LINK_TOKEN_ADDRESS = "0xa36085F69e2889c224210F603D836748e7dC0088"
    VRF_ADDRESS = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    VRF_KEY_HASH = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    CC_ADDRESS = "0x352f827A07Cb4Ca42bE6dF41D2CE22ead3F8669f"
    FEE = 0.1 * 10**18
    wwf = WeatherWarsFactory.deploy(CC_ADDRESS, VRF_ADDRESS, LINK_TOKEN_ADDRESS, FEE, VRF_KEY_HASH, { "from": accounts[0] })