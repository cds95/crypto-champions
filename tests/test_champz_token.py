import brownie 

def test_crypto_champz_contract_can_mint(accounts, crypto_champions, champz_token):
    cc_address = crypto_champions.address 
    numToMint = 500 * 10**18
    champz_token.mintTokens(accounts[0], numToMint, { "from": cc_address })
    accountBalance = champz_token.balanceOf(accounts[0])
    assert accountBalance == numToMint

def test_no_other_address_can_mint(accounts, champz_token):
     with brownie.reverts("Ownable: caller is not the owner"):
        champz_token.mintTokens(accounts[0], 10000)