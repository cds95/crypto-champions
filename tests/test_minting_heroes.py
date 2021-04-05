import brownie


def test_mint_hero_owner_initial_state(accounts, crypto_champions):
    with brownie.reverts("dev: Hero is not valid."):
        crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)


def test_mint_hero_non_existent_elder(accounts, crypto_champions, set_phase_to_mint_hero):
    with brownie.reverts("dev: Elder with id doesn't exists or not valid."):
        crypto_champions.mintHero(1, "test hero", {"from": accounts[0], "value": 1000000000000000000})


def test_mint_first_hero_owner(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + crypto_champions.heroesMinted()) == accounts[0]


def test_mint_hero_initial_state_variable_heroes_minted(accounts, crypto_champions):
    assert crypto_champions.heroesMinted() == 0


def test_mint_first_hero_heroes_minted(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.heroesMinted() == 1


def test_mint_hero_insufficient_payment(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero):
    with brownie.reverts("dev: Insufficient payment."):
        crypto_champions.mintHero(1, "test hero", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1) - 1000})


def test_mint_hero_refund(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero):
    ethSent = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1) + 1000
    tx = crypto_champions.mintHero(1, "test hero", {"from": accounts[1], "value": ethSent})
    assert tx.internal_transfers[1]["to"] == accounts[1]
    assert tx.internal_transfers[1]["value"] == 1000


def test_mint_hero_elder_spawns(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound(), 1) == 1