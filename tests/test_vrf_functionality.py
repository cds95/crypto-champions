import brownie
from brownie import convert


def test_can_request_random_number(accounts, crypto_champions, link_token, chainlink_fee, get_seed):
    link_token.transfer(crypto_champions.address, chainlink_fee * 3, {'from': accounts[0]})
    crypto_champions.getRandomNumber(get_seed, {'from': accounts[0]})
    assert isinstance(crypto_champions.requestId(), convert.datatypes.HexString)