import brownie


def test_mint_hero_owner_initial_state(accounts, crypto_champions):
    with brownie.reverts("dev: Given hero id has not been minted."):
        crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)


def test_mint_first_hero_owner(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + crypto_champions.heroesMinted()) == accounts[0]


def test_mint_hero_initial_state_variable_heroes_minted(accounts, crypto_champions):
    assert crypto_champions.heroesMinted() == 0


def test_mint_first_hero_heroes_minted(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.heroesMinted() == 1