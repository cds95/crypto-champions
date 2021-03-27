import brownie


def test_get_owner_of_invalid_id_elder(crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.getElderOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)


def test_get_owner_of_non_existent_elder(crypto_champions):
    with brownie.reverts("dev: Given elder id has not been minted."):
        crypto_champions.getElderOwner(1)


def test_get_elder_spirit_invalid_id(crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.getElderSpirit(0)


def test_get_non_minted_elder_spirit(crypto_champions):
    elder = crypto_champions.getElderSpirit(1)
    assert elder[0] == False


def test_get_minted_elder_spirit_valid(crypto_champions, mint_first_elder):
    elder = crypto_champions.getElderSpirit(crypto_champions.eldersInGame())
    assert elder[0]== True


def test_get_minted_elder_spirit_race(crypto_champions, mint_first_elder):
    elder = crypto_champions.getElderSpirit(crypto_champions.eldersInGame())
    assert elder[1] == 7


def test_get_minted_elder_spirit_class(crypto_champions, mint_first_elder):
    elder = crypto_champions.getElderSpirit(crypto_champions.eldersInGame())
    assert elder[2] == 3


def test_get_minted_elder_spirit_affinity(crypto_champions, mint_first_elder):
    elder = crypto_champions.getElderSpirit(crypto_champions.eldersInGame())
    assert elder[3] == "ETH"


def test_get_minted_elder_spirit_affinity_price(crypto_champions, mint_first_elder):
    elder = crypto_champions.getElderSpirit(crypto_champions.eldersInGame())
    assert elder[4] == 2000    