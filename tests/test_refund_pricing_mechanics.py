import brownie


def test_immediate_refund(accounts, crypto_champions, mint_first_elder):
    balOriginal = accounts[0].balance()
    mintPrice = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), crypto_champions.eldersInGame())
    crypto_champions.mintHero(crypto_champions.eldersInGame(), {"from": accounts[0], "value": mintPrice})
    balAfterMint = accounts[0].balance()
    crypto_champions.burnHero(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1, {"from": accounts[0]})
    balAfterBurn = accounts[0].balance()
    assert balOriginal > balAfterBurn > balAfterMint


def test_delayed_refund(accounts, crypto_champions, mint_first_hero):
    initialRefundAmount = crypto_champions.getHeroRefundAmount(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)
    mintPrice = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), crypto_champions.eldersInGame())
    crypto_champions.mintHero(crypto_champions.eldersInGame(), {"from": accounts[1], "value": mintPrice})
    newRefundAmount = crypto_champions.getHeroRefundAmount(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)
    assert newRefundAmount > initialRefundAmount


def test_refund_hero_previous_round(accounts, crypto_champions, mint_first_hero):
    crypto_champions.burnElders({"from": accounts[0]})
    assert crypto_champions.currentRound() == 1
    assert crypto_champions.eldersInGame() == 0
    refundAmount = crypto_champions.getHeroRefundAmount(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)
    assert refundAmount > 0
    initialBalance = accounts[0].balance()
    crypto_champions.burnHero(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1, {"from": accounts[0]})
    refundedBalance = accounts[0].balance()
    assert refundedBalance > initialBalance


def test_increase_mint_price(accounts, crypto_champions, mint_first_elder):
    initialMintPrice = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), crypto_champions.eldersInGame())
    crypto_champions.mintHero(crypto_champions.eldersInGame(), {"from": accounts[0], "value": initialMintPrice})
    newMintPrice = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), crypto_champions.eldersInGame())
    assert newMintPrice > initialMintPrice


def test_get_hero_mint_price_wrong_round(accounts, crypto_champions, mint_first_elder): 
    with brownie.reverts("dev: Cannot get price round has not started."):
        crypto_champions.getHeroMintPrice(crypto_champions.currentRound() + 1, crypto_champions.eldersInGame())


def test_get_hero_mint_price_invalid_id(accounts, crypto_champions):
    with brownie.reverts("dev: Elder id is not valid."):
        crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)


def test_get_hero_mint_price_non_existent_elder(accounts, crypto_champions):
    with brownie.reverts("dev: The elder has not been minted."):
        crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)


def test_get_hero_refund_non_existent_hero(accounts, crypto_champions):
    with brownie.reverts("dev: Hero is not valid."):
        crypto_champions.getHeroRefundAmount(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)