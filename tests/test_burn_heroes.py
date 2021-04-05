import brownie


def test_burn_invalid_hero_id(accounts, crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.burnHero(0, {"from": accounts[0]})


def test_burn_non_existent_hero(accounts, crypto_champions):
    with brownie.reverts("dev: Hero is not valid."):
        crypto_champions.burnHero(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1, {"from": accounts[0]})


def test_burn_first_hero(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.heroesMinted() == 1
    assert crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1) == accounts[0]
    crypto_champions.burnHero(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1, {"from": accounts[0]})
    with brownie.reverts("dev: Hero is not valid."):
        crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)


def test_burn_hero_no_effect_on_elder(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.heroesMinted() == 1
    assert crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1) == accounts[0]
    crypto_champions.burnHero(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1, {"from": accounts[0]})
    assert crypto_champions.getElderOwner(1) == accounts[0]


def test_burn_hero_elder_spawns(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound(), 1) == 1
    crypto_champions.burnHero(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1, {"from": accounts[0]})
    assert crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound(), 1) == 0