import brownie


def test_mint_elder_initial_state_variable_elders_minted(accounts, crypto_champions):
    assert crypto_champions.eldersInGame() == 0


def test_mint_first_elder_variable_elders_minted(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.eldersInGame() == 1


def test_mint_elder_owner_initial_state(accounts, crypto_champions):
    with brownie.reverts("dev: Given elder id has not been minted."):
        crypto_champions.getElderOwner(1)

def test_mint_elder_no_affinity(accounts, crypto_champions):
    with brownie.reverts("dev: Affinity does not exist."):
        crypto_champions.mintElderSpirit(0, 0, "affinity", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})

def test_mint_first_elder_owner(accounts, crypto_champions, mint_first_elder):
    assert crypto_champions.getElderOwner(crypto_champions.eldersInGame()) == accounts[0]


def test_mint_max_number_elders(accounts, crypto_champions, mint_max_elders):
    assert crypto_champions.eldersInGame() == crypto_champions.MAX_NUMBER_OF_ELDERS()
    with brownie.reverts("dev: Max number of elders already minted."):
        crypto_champions.mintElderSpirit(0, 0, "affinity", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})
    assert crypto_champions.eldersInGame() == crypto_champions.MAX_NUMBER_OF_ELDERS()


def test_mint_elder_insufficient_funds(accounts, crypto_champions):
    with brownie.reverts("dev: Insufficient payment."):
        crypto_champions.mintElderSpirit(0, 0, "affinity", {"from": accounts[0], "value": crypto_champions.elderMintPrice() - 1})


def test_mint_elder_refund(accounts, crypto_champions, create_eth_affinity):
    ethSent = crypto_champions.elderMintPrice() + 1000
    tx = crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": ethSent})
    assert tx.internal_transfers[0]["to"] == accounts[0]
    assert tx.internal_transfers[0]["value"] == 1000
