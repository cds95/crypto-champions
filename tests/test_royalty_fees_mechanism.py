import brownie


def test_royalty_paid_out(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero, fund_contract_with_link):
    balBeforeHeroMint = accounts[0].balance()
    mintPrice = crypto_champions.getHeroMintPrice(0)
    crypto_champions.mintHero(0, "test-hero", {"from": accounts[1], "value": mintPrice})
    royaltyFee = mintPrice * 0.25 # Hardcoded here should be equal to the constant in the contract
    assert accounts[0].balance() == balBeforeHeroMint + royaltyFee


def test_elder_ownership_transfer_royalty(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero, fund_contract_with_link, champz):
    champz.safeTransferFrom(accounts[0], accounts[1], 0, {"from": accounts[0]})
    balBeforeHeroMint = accounts[1].balance()
    mintPrice = crypto_champions.getHeroMintPrice(0)
    crypto_champions.mintHero(0, "test-hero", {"from": accounts[2], "value": mintPrice})
    royaltyFee = mintPrice * 0.25 # Hardcoded here should be equal to the constant in the contract
    assert accounts[1].balance() == balBeforeHeroMint + royaltyFee
