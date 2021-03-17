import brownie


def test_mint_first_elder_owner(accounts, crypto_champions, mint_first_elder):
    mint_first_elder
    assert crypto_champions.eldersMinted() == 1


def test_mint_first_elder_variable_elders_minted(accounts, crypto_champions, mint_first_elder):
    mint_first_elder
    assert crypto_champions.getElderOwner(crypto_champions.eldersMinted()) == accounts[0]


def test_mint_max_number_elders(accounts, crypto_champions, mint_max_elders):
    mint_max_elders
    with brownie.reverts("dev: Max number of elders already minted."):
        crypto_champions.mintElderSpirit(0, 0, "affinity", {"from": accounts[0]})