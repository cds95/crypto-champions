import brownie 

def test_crypto_champz_is_owner(accounts, crypto_champions, champz_token):
    ## This also tests that only the crypto champz contract can mint tokens as only the owner of
    ## the champz_token can mint more tokens
    cc_address = crypto_champions.address 
    assert champz_token.owner() == cc_address

def test_no_other_address_can_mint(accounts, champz_token):
     with brownie.reverts("Ownable: caller is not the owner"):
        champz_token.mintTokens(accounts[0], 10000)