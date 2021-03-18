import pytest


@pytest.fixture(autouse=True)
def setup(fn_isolation):
    """
    Isolation setup fixture.
    This ensures that each test runs against the same base environment.
    """
    pass


@pytest.fixture(scope="module")
def crypto_champions(accounts, CryptoChampions):
    """
    Yield a `Contract` object for the CryptoChampions contract.
    """
    yield accounts[0].deploy(CryptoChampions)


@pytest.fixture
def mint_first_elder(accounts, crypto_champions):
    """
    Mint the first elder for the CryptoChampions contract.
    """
    crypto_champions.mintElderSpirit(0, 0, "affinity", {"from": accounts[0]})


@pytest.fixture
def mint_first_hero(accounts, crypto_champions, mint_first_elder):
    """
    Mint the first hero for the CryptoChampions contract. Hero is based on the first elder minted.
    """
    mint_first_elder
    lastMintedElderId = crypto_champions.eldersInGame()
    crypto_champions.mintHero(lastMintedElderId, {"from": accounts[0]})


@pytest.fixture
def mint_max_elders(accounts, crypto_champions):
    """
    Mint the max amount of elders for the CryptoChampions contract. Hero is based on the first elder minted.
    """
    maxElders = crypto_champions.MAX_NUMBER_OF_ELDERS()
    for i in range(maxElders):
        crypto_champions.mintElderSpirit(0, 0, "affinity", {"from": accounts[0]})