import brownie


def test_increase_mint_price(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero, fund_contract_with_link):
    initialMintPrice = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": initialMintPrice})
    newMintPrice = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)
    assert newMintPrice > initialMintPrice


def test_get_hero_mint_price_wrong_round(accounts, crypto_champions, mint_first_elder): 
    with brownie.reverts("dev: Cannot get price round has not started."):
        crypto_champions.getHeroMintPrice(crypto_champions.currentRound() + 1, 0)


def test_get_hero_mint_price_invalid_id(accounts, crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), crypto_champions.MAX_NUMBER_OF_ELDERS())


def test_mint_elder_rewards_pool(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.devFund() == crypto_champions.elderMintPrice()


def test_mint_elder_rewards_pool_refund(accounts, crypto_champions, create_affinities):
    crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice() + 1000})
    assert crypto_champions.devFund() == crypto_champions.elderMintPrice()
    

def test_mint_hero_rewards_pool(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero):
    mintAmount = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)
    rewardsPoolAmount = mintAmount * 0.5 # hardcoded for now
    crypto_champions.mintHero(0, "Name", {"from": accounts[0], "value": mintAmount})
    assert crypto_champions.rewardsPoolAmount() == rewardsPoolAmount


def test_mint_hero_rewards_pool_refund(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero):
    mintAmount = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)
    rewardsPoolAmount = mintAmount * 0.5 # hardcoded for now
    crypto_champions.mintHero(0, "Name", {"from": accounts[0], "value": mintAmount + 1000})
    assert crypto_champions.rewardsPoolAmount() == rewardsPoolAmount


def test_mint_hero_dev_pool(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero):
    mintAmount = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)
    devFundAmount = crypto_champions.elderMintPrice() + mintAmount * 0.25 # hardcoded for now
    crypto_champions.mintHero(0, "Name", {"from": accounts[0], "value": mintAmount})
    assert crypto_champions.devFund() == devFundAmount


def test_mint_hero_dev_pool_refund(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero):
    mintAmount = crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)
    devFundAmount = crypto_champions.elderMintPrice() + mintAmount * 0.25 # hardcoded for now
    crypto_champions.mintHero(0, "Name", {"from": accounts[0], "value": mintAmount + 1000})
    assert crypto_champions.devFund() == devFundAmount