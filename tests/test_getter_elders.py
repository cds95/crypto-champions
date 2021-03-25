import brownie


def test_get_owner_of_invalid_id_elder(crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.getElderOwner(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1)


def test_get_owner_of_non_existent_elder(crypto_champions):
    with brownie.reverts("dev: Given elder id has not been minted."):
        crypto_champions.getElderOwner(1)

# TODO: Test getElderSpirit(uint256 elderId) function