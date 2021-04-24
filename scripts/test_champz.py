from brownie import Champz, ChampzCaller, LinkToken, accounts

def main():
    account = accounts.load("dev")

    LINK_TOKEN_ADDRESS = "0x01be23585060835e02b77ef475b0cc51aa1e0709"
    VRF_ADDRESS = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"
    VRF_KEY_HASH = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
    FEE_IN_LINK = 0.1 * 10**18

    champz = Champz.deploy(VRF_ADDRESS, LINK_TOKEN_ADDRESS, VRF_KEY_HASH, FEE_IN_LINK, { "from": account })
    linkToken = LinkToken.at(LINK_TOKEN_ADDRESS)
    linkToken.transfer(champz.address, 1 * FEE_IN_LINK, { "from": account })

    champzCaller = ChampzCaller.deploy(champz.address, { "from": account })
    champzCaller.mintChampz(1, 1, { "from": account})
