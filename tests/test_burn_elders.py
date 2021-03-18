import brownie


def test_burn_non_existent_elder(accounts, crypto_champions): 
    with brownie.reverts("dev: Cannot burn elder that does not exist."):
        crypto_champions.burnElder(1, {"from": accounts[0]})


def test_burn_invalid_id(accounts, crypto_champions):
    with brownie.reverts("dev: Cannot burn with invalid elder id."):
        crypto_champions.burnElder(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1, {"from": accounts[0]})


def test_burn_first_elder(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.eldersMinted() == 1 and crypto_champions.getElderOwner(1) == accounts[0]
    crypto_champions.burnElder(crypto_champions.eldersMinted())
    assert crypto_champions.eldersMinted() == 0
    with brownie.reverts("dev: Given elder id has not been minted."):
        crypto_champions.getElderOwner(1)