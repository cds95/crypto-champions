import pytest


@pytest.fixture(autouse=True)
def setup(fn_isolation):
    """
    Isolation setup fixture.
    This ensures that each test runs against the same base environment.
    """
    pass


@pytest.fixture(scope="module")
def crypto_champions(accounts, ExposedCryptoChampions):
    """
    Yield a `Contract` object for the CryptoChampions contract.
    """
    yield accounts[0].deploy(ExposedCryptoChampions)


@pytest.fixture(scope="module")
def get_eth_usd_price_feed_address(accounts, MockV3Aggregator):
    """
    Deploys the mock v3 aggregator and returns the deployed address
    """
    yield accounts[0].deploy(MockV3Aggregator, 18, 2000)
    #mock_price_feed = MockV3Aggregator.deploy(18, 2000, {'from': accounts[0]})
    #return mock_price_feed.address


@pytest.fixture
def create_eth_affinity(accounts, crypto_champions, get_eth_usd_price_feed_address):
    """
    Creates the ETH affinity
    """
    crypto_champions.createAffinity("ETH", get_eth_usd_price_feed_address.address, {"from": accounts[0]})


@pytest.fixture
def mint_first_elder(accounts, crypto_champions, create_eth_affinity):
    """
    Mint the first elder for the CryptoChampions contract.
    """
    crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})


@pytest.fixture
def mint_first_hero(accounts, crypto_champions, mint_first_elder):
    """
    Mint the first hero for the CryptoChampions contract. Hero is based on the first elder minted.
    """
    lastMintedElderId = crypto_champions.eldersInGame()
    heroName = "Test Hero"
    crypto_champions.mintHero(lastMintedElderId, heroName, {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), lastMintedElderId)})


@pytest.fixture
def mint_max_elders(accounts, crypto_champions, create_eth_affinity):
    """
    Mint the max amount of elders for the CryptoChampions contract. Hero is based on the first elder minted.
    """
    maxElders = crypto_champions.MAX_NUMBER_OF_ELDERS()
    for _ in range(maxElders):
        crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})