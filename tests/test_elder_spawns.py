import brownie


def test_get_elder_spawns_invalid_id(accounts, crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound(), crypto_champions.MAX_NUMBER_OF_ELDERS())


def test_get_elder_spawns_wrong_round(accounts, crypto_champions, mint_first_elder):
    with brownie.reverts("dev: Invalid round."):
        crypto_champions.getElderSpawnsAmount(crypto_champions.currentRound() + 1, 0)
