from brownie import CryptoChampions, accounts


def main():
    """ Simple deploy script for our two contracts. """
    pwf = PriceWarsFactory.deploy({ "from": accounts[0] })
    accounts[0].deploy(CryptoChampions, pwf.address)