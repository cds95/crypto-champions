import brownie


def test_burn_invalid_hero_id(accounts, crypto_champions):
    with brownie.reverts("dev: Cannot burn with invalid hero id."):
        crypto_champions.burnHero(0, {"from": accounts[0]})


def test_burn_non_existent_hero(accounts, crypto_champions):
    with brownie.reverts("dev: Cannot burn hero that does not exist."):
        crypto_champions.burnHero(crypto_champions.MAX_NUMBER_OF_ELDERS + 1, {"from": accounts[0]})


def test_burn_first_hero(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.heroesMinted() == 1
    crypto_champions.burnHero(crypto_champions.MAX_NUMBER_OF_ELDERS() + crypto_champions.heroesMinted(), {"from": accounts[0]})
    assert crypto_champions.heroesMinted() == 0
    with brownie.reverts("dev: Given hero id has not been minted."):
        crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)