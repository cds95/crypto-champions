import brownie


def test_burn_first_elder(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.eldersInGame() == 1
    crypto_champions.burnElders({"from": accounts[0]})
    assert crypto_champions.eldersInGame() == 0


def test_burn_max_elders(accounts, crypto_champions, mint_max_elders):
    assert crypto_champions.eldersInGame() == crypto_champions.MAX_NUMBER_OF_ELDERS()
    crypto_champions.burnElders({"from": accounts[0]})
    assert crypto_champions.eldersInGame() == 0


def test_burn_first_elder_owner(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.getElderOwner(0) == accounts[0]
    crypto_champions.burnElders({"from": accounts[0]})
    with brownie.reverts(""):
        crypto_champions.getElderOwner(0)


def test_burn_internal_first_elder(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.eldersInGame() == 1 and crypto_champions.getElderOwner(0) == accounts[0]
    crypto_champions.burnElder(0)
    assert crypto_champions.eldersInGame() == 0
    with brownie.reverts(""):
        crypto_champions.getElderOwner(0)