from brownie import SolidityStorage, VyperStorage, CryptoChampions, accounts


def main():
    """ Simple deploy script for our two contracts. """
    accounts[0].deploy(SolidityStorage)
    accounts[0].deploy(VyperStorage)
    accounts[0].deploy(CryptoChampions)