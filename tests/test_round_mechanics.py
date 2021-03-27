import brownie


def test_round_increment(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.currentRound() == 0
    crypto_champions.burnElders({"from": accounts[0]})
    assert crypto_champions.currentRound() == 1


def test_round_elder_spawn(accounts, crypto_champions, mint_first_hero):
    assert crypto_champions.currentRound() == 0
    assert crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound(), 1) == 1
    crypto_champions.burnElders({"from": accounts[0]})
    assert crypto_champions.currentRound() == 1
    crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})
    assert crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound(), 1) == 0


def test_get_elder_spawns_invalid_id(accounts, crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound(), 0)


def test_get_elder_spawns_wrong_round(accounts, crypto_champions, mint_first_elder):
    with brownie.reverts("dev: Invalid round."):
        crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound() + 1, 1)
