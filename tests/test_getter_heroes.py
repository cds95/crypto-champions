import brownie


def test_get_owner_of_invalid_id_hero(crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.getHeroOwner(1)


def test_get_owner_of_non_existent_hero(crypto_champions):
    with brownie.reverts():
        crypto_champions.getHeroOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)