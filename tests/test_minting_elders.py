import brownie


def test_mint_elder_initial_state_variable_elders_minted(accounts, crypto_champions):
    assert crypto_champions.eldersInGame() == 0


def test_mint_first_elder_variable_elders_minted(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.eldersInGame() == 1


def test_mint_elder_owner_initial_state(accounts, crypto_champions):
    with brownie.reverts("dev: Given elder id has not been minted."):
        crypto_champions.getElderOwner(1)


def test_mint_first_elder_owner(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.getElderOwner(crypto_champions.eldersInGame()) == accounts[0]


def test_mint_max_number_elders(accounts, crypto_champions, mint_max_elders):
    assert crypto_champions.eldersInGame() == crypto_champions.MAX_NUMBER_OF_ELDERS()
    with brownie.reverts("dev: Max number of elders already minted."):
        crypto_champions.mintElderSpirit(0, 0, "affinity", {"from": accounts[0]})
    assert crypto_champions.eldersInGame() == crypto_champions.MAX_NUMBER_OF_ELDERS()