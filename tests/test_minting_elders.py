import brownie

def test_mint_first_elder_owner(accounts, crypto_champions):
    crypto_champions.mintElderSpirit(0, 0, "affinity", {"from": accounts[0]})
    assert crypto_champions.eldersMinted() == 1

def test_mint_first_elder_variable_elders_minted(accounts, crypto_champions):
    crypto_champions.mintElderSpirit(0, 0, "affinity", {"from": accounts[0]})
    assert crypto_champions.getElderOwner(crypto_champions.eldersMinted()) == accounts[0]

def test_get_owner_of_invalid_id_elder(crypto_champions):
    with brownie.reverts():
        crypto_champions.getElderOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)

def test_get_owner_of_invalid_id_hero(crypto_champions):
    with brownie.reverts():
        crypto_champions.getHeroOwner(1)

def test_get_owner_of_non_existent_elder(crypto_champions):
    with brownie.reverts():
        crypto_champions.getElderOwner(1)

def test_get_owner_of_non_existent_hero(crypto_champions):
    with brownie.reverts():
        crypto_champions.getHeroOwner(1)