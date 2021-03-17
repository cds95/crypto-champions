import brownie


def test_mint_first_hero_owner(accounts, crypto_champions, mint_first_hero):
    mint_first_hero
    assert crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + crypto_champions.heroesMinted()) == accounts[0]
