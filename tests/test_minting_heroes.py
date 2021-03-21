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


def test_mint_hero_insufficient_payment(accounts, crypto_champions, mint_first_elder):
    with brownie.reverts("dev: Insufficient payment."):
        crypto_champions.mintHero(1, "affinity", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1) - 1000})


def test_mint_hero_refund(accounts, crypto_champions, mint_first_elder):
    ethSent = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1) + 1000
    tx = crypto_champions.mintHero(1, "affinity",{"from": accounts[0], "value": ethSent})
    assert tx.internal_transfers[0]["to"] == accounts[0]
    assert tx.internal_transfers[0]["value"] == 1000


def test_mint_hero_elder_spawns(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound(), 1) == 1