import brownie
from brownie.test import given, strategy


def test_burn_no_elder_minted(accounts, crypto_champions):
    with brownie.reverts("dev: No elders have been minted."):
        crypto_champions.burnElders({"from": accounts[0]})


def test_burn_first_elder(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.eldersInGame() == 1
    crypto_champions.burnElders({"from": accounts[0]})
    assert crypto_champions.eldersInGame() == 0


def test_burn_max_elders(accounts, crypto_champions, mint_max_elders):
    assert crypto_champions.eldersInGame() == crypto_champions.MAX_NUMBER_OF_ELDERS()
    crypto_champions.burnElders({"from": accounts[0]})
    assert crypto_champions.eldersInGame() == 0


def test_burn_first_elder_owner(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.getElderOwner(1) == accounts[0]
    crypto_champions.burnElders({"from": accounts[0]})
    with brownie.reverts("dev: Given elder id has not been minted."):
        crypto_champions.getElderOwner(1)