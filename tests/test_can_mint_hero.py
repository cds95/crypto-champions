import brownie


def test_check_can_mint_four_fail_five(accounts, crypto_champions, mint_first_elder, fund_contract_with_link):
    # mint 2nd elder
    crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})
    assert crypto_champions.canMintHero(0) == True
    crypto_champions.setPhase(1)
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(0)})
    assert crypto_champions.canMintHero(0) == True
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(0)})
    assert crypto_champions.canMintHero(0) == True
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(0)})
    assert crypto_champions.canMintHero(0) == True
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(0)})
    assert crypto_champions.canMintHero(0) == False


def test_check_can_mint_twice_least(accounts, crypto_champions, mint_first_elder, fund_contract_with_link):
    # mint 2nd elder
    crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})
    crypto_champions.setPhase(1)
    # mint 4 heroes for first elder
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(0)})
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(0)})
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(0)})
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(0)})
    assert crypto_champions.canMintHero(0) == False
    # mint 2 heroes for second elder
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(1)})
    assert crypto_champions.canMintHero(0) == False
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(1)})
    assert crypto_champions.canMintHero(0) == True
    # mint another hero based on first elder
    crypto_champions.mintHero(0, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(0)})
    assert crypto_champions.canMintHero(0) == False