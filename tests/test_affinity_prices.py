import brownie

def test_elder_mint_affinity_price(accounts, crypto_champions, mint_first_elder):
    elderAttributes = crypto_champions.getElderSpirit(crypto_champions.eldersInGame() - 1)
    assert elderAttributes[4] == 2000 # hard coded in conftest


def test_elder_mint_affinity_price_change(accounts, crypto_champions, mint_first_elder, get_eth_usd_price_feed):
    get_eth_usd_price_feed.updateAnswer(9001, {"from": accounts[0]})
    crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})
    firstElder = crypto_champions.getElderSpirit(0)
    secondElder = crypto_champions.getElderSpirit(1)
    assert firstElder[4] == 2000
    assert secondElder[4] == 9001
