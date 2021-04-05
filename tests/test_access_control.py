import brownie
from web3 import Web3


def test_non_authorized_mint_price(accounts, crypto_champions):
    with brownie.reverts("dev: Access denied."):
        crypto_champions.setElderMintPrice(0, {"from": accounts[1]})


def test_authorized_mint_price(accounts, crypto_champions):
    currentMintPrice = crypto_champions.elderMintPrice()
    crypto_champions.setElderMintPrice(currentMintPrice - 1, {"from": accounts[0]})
    assert crypto_champions.elderMintPrice() == currentMintPrice - 1


def test_non_authorized_phase_set(accounts, crypto_champions):
    with brownie.reverts("dev: Access denied."):
        crypto_champions.setPhase(1, {"from": accounts[1]})


def test_authorized_phase_set(accounts, crypto_champions):
    assert crypto_champions.currentPhase() == 0
    crypto_champions.setPhase(1, {"from": accounts[0]})
    assert crypto_champions.currentPhase() == 1


def test_non_authorized_affinity_creation(accounts, crypto_champions, MockV3Aggregator):
    btcV3Aggregator = MockV3Aggregator.deploy(18, 10000000000, { "from": accounts[0] })
    with brownie.reverts("dev: Access denied."):
        crypto_champions.createAffinity("BTC", btcV3Aggregator.address, {"from": accounts[1]})


def test_authorized_affinity_creation(accounts, crypto_champions, MockV3Aggregator):
    btcV3Aggregator = MockV3Aggregator.deploy(18, 10000000000, { "from": accounts[0] })
    crypto_champions.createAffinity("BTC", btcV3Aggregator.address, {"from": accounts[0]})
