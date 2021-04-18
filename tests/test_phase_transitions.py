import brownie
from web3 import Web3


def test_initial_state(accounts, crypto_champions):
    assert crypto_champions.rewardsPoolAmount() == 0
    assert crypto_champions.heroRewardsShare() == 0
    assert crypto_champions.currentRound() == 0


def test_transition_setup_to_action(accounts, crypto_champions):
    crypto_champions.transitionNextPhase()
    assert crypto_champions.rewardsPoolAmount() == 0
    assert crypto_champions.heroRewardsShare() == 0
    assert crypto_champions.currentRound() == 1


def test_transition_action_to_setup(accounts, crypto_champions, create_affinities, register_price_wars, get_eth_usd_price_feed, get_btc_usd_price_feed, fund_contract_with_link):
    ## setup
    # create elders for both affinities
    crypto_champions.mintElderSpirit(0, 0, "BTC", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})
    crypto_champions.mintElderSpirit(1, 1, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})

    # set phase to action
    crypto_champions.transitionNextPhase()

    # assert the hero rewards share is 0
    assert crypto_champions.heroRewardsShare() == 0

    crypto_champions.mintHero(0, "BTC Hero", {"from": accounts[1], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)})
    crypto_champions.mintHero(1, "ETH Hero", {"from": accounts[1], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})

    # update price
    get_btc_usd_price_feed.updateAnswer(10000) # btc is winner

    # set phase to setup
    crypto_champions.transitionNextPhase()

    # assert the hero rewards share is not 0
    assert crypto_champions.heroRewardsShare() != 0
    # assert elders were burned
    assert crypto_champions.eldersInGame() == 0


def test_mint_elder_wrong_phase(accounts, crypto_champions):
    # set phase to action
    crypto_champions.transitionNextPhase()

    with brownie.reverts("dev: Current phase prohibits action."):
        crypto_champions.mintElderSpirit(0, 0, "BTC", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})


def test_mint_hero_wrong_phase(accounts, crypto_champions, mint_first_elder):
    with brownie.reverts("dev: Current phase prohibits action."):
        crypto_champions.mintHero(0, "BTC Hero", {"from": accounts[1], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 0)})


def test_claim_reward_wrong_phase(accounts, crypto_champions, mint_first_hero):
    with brownie.reverts("dev: Current phase prohibits action."):
        crypto_champions.claimReward(crypto_champions.MAX_NUMBER_OF_ELDERS())


def test_declare_winner_wrong_phase(accounts, crypto_champions):
    # first give game admin rights
    crypto_champions.grantRole(Web3.keccak(text="ROLE_GAME_ADMIN"), accounts[0].address, {"from": accounts[0]})
    with brownie.reverts("dev: Current phase prohibits action."):
        crypto_champions.declareRoundWinner("Affinity", {"from": accounts[0]})