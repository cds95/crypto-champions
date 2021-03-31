import brownie


def test_check_can_mint_four_fail_five(accounts, crypto_champions, mint_first_elder, fund_contract_with_link):
    # mint 2nd elder
    crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})
    assert crypto_champions.canMintHero(1) == True
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    assert crypto_champions.canMintHero(1) == True
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    assert crypto_champions.canMintHero(1) == True
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    assert crypto_champions.canMintHero(1) == True
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    assert crypto_champions.canMintHero(1) == False


def test_check_can_mint_twice_least(accounts, crypto_champions, mint_first_elder, fund_contract_with_link):
    # mint 2nd elder
    crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})
    # mint 4 heroes for first elder
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    assert crypto_champions.canMintHero(1) == False
    # mint 2 heroes for second elder
    crypto_champions.mintHero(2, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    assert crypto_champions.canMintHero(1) == False
    crypto_champions.mintHero(2, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    assert crypto_champions.canMintHero(1) == True
    # mint another hero based on first elder
    crypto_champions.mintHero(1, "name", {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), 1)})
    assert crypto_champions.canMintHero(1) == False