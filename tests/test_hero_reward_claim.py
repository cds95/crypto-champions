import brownie


def setup_reward_claim(accounts, crypto_champions, get_eth_usd_price_feed, get_btc_usd_price_feed):
    # create elders for both affinities
    crypto_champions.mintElderSpirit(0, 0, "BTC", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})
    crypto_champions.mintElderSpirit(1, 1, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})

    # set phase to mint heroes
    crypto_champions.transitionNextPhase()

    # assert the hero rewards share is 0
    assert crypto_champions.heroRewardsShare() == 0

    crypto_champions.mintHero(0, "BTC Hero", {"from": accounts[1], "value": crypto_champions.getHeroMintPrice(0)})
    crypto_champions.mintHero(1, "ETH Hero", {"from": accounts[1], "value": crypto_champions.getHeroMintPrice(1)})

    # update price
    get_btc_usd_price_feed.updateAnswer(10000) # btc is winner

    # end the round
    crypto_champions.transitionNextPhase()

    # assert the rewards share was set
    assert crypto_champions.heroRewardsShare() != 0


def test_successful_reward_claim(accounts, crypto_champions, create_affinities, register_price_wars, get_eth_usd_price_feed, get_btc_usd_price_feed, fund_contract_with_link):
    # setup
    setup_reward_claim(accounts, crypto_champions, get_eth_usd_price_feed, get_btc_usd_price_feed)

    # assert claim was successful
    balanceBefore = accounts[1].balance()
    crypto_champions.claimReward(crypto_champions.MAX_NUMBER_OF_ELDERS(), {"from": accounts[1]})
    balanceAfter = accounts[1].balance()
    assert balanceAfter == balanceBefore + crypto_champions.heroRewardsShare()


def test_loser_reward_claim(accounts, crypto_champions, create_affinities, register_price_wars, get_eth_usd_price_feed, get_btc_usd_price_feed, fund_contract_with_link):
    # setup
    setup_reward_claim(accounts, crypto_champions, get_eth_usd_price_feed, get_btc_usd_price_feed)

    with brownie.reverts("dev: Hero does not have the winning affinity."):
        crypto_champions.claimReward(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1, {"from": accounts[1]})


def test_loser_reward_wrong_round(accounts, crypto_champions, create_affinities, register_price_wars, get_eth_usd_price_feed, get_btc_usd_price_feed, fund_contract_with_link):
    # setup
    setup_reward_claim(accounts, crypto_champions, get_eth_usd_price_feed, get_btc_usd_price_feed)

    # fast forward to next round
    crypto_champions.transitionNextPhase()
    crypto_champions.transitionNextPhase()

    with brownie.reverts("dev: Hero was not minted this round."):
        crypto_champions.claimReward(crypto_champions.MAX_NUMBER_OF_ELDERS(), {"from": accounts[1]})


def test_claim_reward_twice(accounts, crypto_champions, create_affinities, register_price_wars, get_eth_usd_price_feed, get_btc_usd_price_feed, fund_contract_with_link):
    # setup
    setup_reward_claim(accounts, crypto_champions, get_eth_usd_price_feed, get_btc_usd_price_feed)

    crypto_champions.claimReward(crypto_champions.MAX_NUMBER_OF_ELDERS(), {"from": accounts[1]})
    with brownie.reverts("dev: Reward has already been claimed."):
        crypto_champions.claimReward(crypto_champions.MAX_NUMBER_OF_ELDERS(), {"from": accounts[1]})