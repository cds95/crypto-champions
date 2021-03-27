from brownie import CryptoChampions, accounts


def main():
    """ Simple deploy script for our two contracts. """
    accounts[0].deploy(CryptoChampions)