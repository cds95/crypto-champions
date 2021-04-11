from brownie import VRFCoordinatorMock, LinkToken, CryptoChampions, WeatherWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    LINK_TOKEN_ADDRESS = "0x01be23585060835e02b77ef475b0cc51aa1e0709"
    VRF_ADDRESS = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"
    VRF_KEY_HASH = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
    CC_ADDRESS = ""
    MGF_ADDRESS = ""
    VRF_FEE_IN_LINK = 0.1 * 10**18
    ORACLE_FEE_IN_LINK = 0.01 * 10**18

    # NEED TO UPDATE THESE.  THESE ARE FROM KOVAN
    ORACLE = "0x3A56aE4a2831C3d3514b5D7Af5578E45eBDb7a40"
    JOB_ID = "187bb80e5ee74a139734cac7475f3c6e" #"b7285d4859da4b289c7861db971baf0a";

    WEATHER_API_KEY = "2c9761ee41522554e88632268c609e13" # Can get from openweather website 
    VRF_SEED = 123

    wwf = WeatherWarsFactory.deploy(CC_ADDRESS, LINK_TOKEN_ADDRESS, ORACLE, VRF_ADDRESS, JOB_ID, VRF_KEY_HASH, VRF_FEE_IN_LINK, VRF_SEED, ORACLE_FEE_IN_LINK, WEATHER_API_KEY, { "from": accounts[0] })
    link = LinkToken.at(LINK_TOKEN_ADDRESS)
    link.transfer(wwf, 10*VRF_FEE_IN_LINK, {"from": accounts[0]})
    mgf = MinigameFactoryRegistry.at(MGF_ADDRESS)
    mgf.registerMinigame("WEATHER_WARS", wwf.address, {"from":accounts[0]})
    
