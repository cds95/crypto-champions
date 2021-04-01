from brownie import VRFCoordinatorMock, LinkToken, CryptoChampions, PriceWarsFactory, MockV3Aggregator, MinigameFactoryRegistry, LinkToken, accounts

def main():
    """ Simple deploy script for our two contracts. """
    keyHash = 0
    
    minigameFactoryRegistry = MinigameFactoryRegistry.deploy({ "from": accounts[0] })
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    linkToken = LinkToken.deploy({ "from": accounts[0] })
    vrfCoordinatorMock = VRFCoordinatorMock.deploy(linkToken.address, { "from": accounts[0] })
    cc = CryptoChampions.deploy(keyHash, vrfCoordinatorMock.address, linkToken.address, minigameFactoryRegistry.address, { "from": accounts[0] })
