import brownie


def test_increase_mint_price(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero, fund_contract_with_link):
    initialMintPrice = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), crypto_champions.eldersInGame())
    crypto_champions.mintHero(crypto_champions.eldersInGame(), "name", {"from": accounts[0], "value": initialMintPrice})
    newMintPrice = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), crypto_champions.eldersInGame())
    assert newMintPrice > initialMintPrice


def test_get_hero_mint_price_wrong_round(accounts, crypto_champions, mint_first_elder): 
    with brownie.reverts("dev: Cannot get price round has not started."):
        crypto_champions.getHeroMintPrice(crypto_champions.currentRound() + 1, crypto_champions.eldersInGame())


def test_get_hero_mint_price_invalid_id(accounts, crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)