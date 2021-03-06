from brownie import VRFCoordinatorMock, LinkToken, CryptoChampions, WeatherWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    LINK_TOKEN_ADDRESS = "0xa36085F69e2889c224210F603D836748e7dC0088"
    VRF_ADDRESS = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    VRF_KEY_HASH = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    CC_ADDRESS = "0xe6409CA12ca313AA9daAaC5741eC25f8C92Fbb71"
    FEE_IN_LINK = 0.1 * 10**18
    ORACLE = "0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e";
    JOB_ID = "0x3530666334323135663839343433643138356230363165356437616639343930" #"b7285d4859da4b289c7861db971baf0a";
    VRF_SEED = 123
    WEATHER_API_KEY = "2c9761ee41522554e88632268c609e13"; # Can get from openweather website 
 
    wwf = WeatherWarsFactory.deploy(CC_ADDRESS, LINK_TOKEN_ADDRESS, ORACLE, VRF_ADDRESS, JOB_ID, VRF_KEY_HASH, FEE_IN_LINK, VRF_SEED, FEE_IN_LINK, WEATHER_API_KEY, { "from": accounts[0] })
