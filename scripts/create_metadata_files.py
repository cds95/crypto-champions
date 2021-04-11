from brownie import CryptoChampions

def main():
    CRYPTO_CHAMPIONS_ADDRESS = "" # latest rinkeby contract
    cc = CryptoChampions.at(CRYPTO_CHAMPIONS_ADDRESS)

    # Iterate through all