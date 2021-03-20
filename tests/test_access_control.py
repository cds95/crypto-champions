import brownie
from web3 import Web3



def test_burn_other_owner_hero(accounts, crypto_champions, mint_first_hero):
    heroId = crypto_champions.MAX_NUMBER_OF_ELDERS() + 1
    assert crypto_champions.getHeroOwner(heroId) == accounts[0]
    with brownie.reverts("dev: Cannot burn hero that is not yours."):
        crypto_champions.burnHero(heroId, {"from": accounts[1]})


def test_burn_elders_from_non_admin(accounts, crypto_champions, mint_first_elder):
    with brownie.reverts("dev: Access denied."):
        crypto_champions.burnElders({"from": accounts[1]})


def test_grant_admin_then_burn(accounts, crypto_champions, mint_first_elder):
    crypto_champions.grantRole(Web3.keccak(text="ROLE_ADMIN"), accounts[1], {"from": accounts[0]})
    assert crypto_champions.eldersInGame() == 1
    crypto_champions.burnElders({"from": accounts[1]})
    assert crypto_champions.eldersInGame() == 0
