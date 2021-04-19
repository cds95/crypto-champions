import pytest


@pytest.fixture(autouse=True)
def setup(fn_isolation):
    """
    Isolation setup fixture.
    This ensures that each test runs against the same base environment.
    """
    pass


@pytest.fixture(scope="module")
def price_wars_factory(accounts, PriceWarsFactory):
    yield accounts[0].deploy(PriceWarsFactory)


@pytest.fixture(scope="module")
def minigame_factory_registry(accounts, MinigameFactoryRegistry):
    yield accounts[0].deploy(MinigameFactoryRegistry)


@pytest.fixture(scope="module")
def register_price_wars(accounts, price_wars_factory, minigame_factory_registry):
    minigame_factory_registry.registerMinigame("PRICE_WARS", price_wars_factory.address)


@pytest.fixture(scope="module")
def link_token(accounts, LinkToken):
    """
    Yield a `Contract` object for the LinkToken contract.
    """
    yield accounts[0].deploy(LinkToken)


@pytest.fixture(scope="module")
def vrf_coordinator(accounts, VRFCoordinatorMock, link_token):
    """
    Yield a `Contract` object for the VRFCoordinatorMock contract.
    """
    yield accounts[0].deploy(VRFCoordinatorMock, link_token)


@pytest.fixture(scope="module")
def key_hash(accounts, link_token):
    """
    Returns a key hash.
    """
    return 0

@pytest.fixture(scope="module")
def champz_token(accounts, ChampzToken):
    """
    Yield a `Contract` object for the ChampzToken contract.
    """
    yield accounts[0].deploy(ChampzToken);

@pytest.fixture(scope="module")
def crypto_champions(accounts, ExposedCryptoChampions, minigame_factory_registry, link_token, vrf_coordinator, key_hash, champz_token):
    """
    Yield a `Contract` object for the CryptoChampions contract.
    """
    crypto_champions = accounts[0].deploy(ExposedCryptoChampions, key_hash, vrf_coordinator.address, link_token.address, minigame_factory_registry, champz_token)
    champz_token.transferOwnership(crypto_champions.address, { "from": accounts[0] })
    print(champz_token.owner())
    yield crypto_champions

@pytest.fixture(scope="module")
def chainlink_fee():
    return 1000000000000000000


@pytest.fixture(scope="module")
def get_seed():
    return 777


@pytest.fixture(scope="module")
def fund_contract_with_link(accounts, crypto_champions, link_token, chainlink_fee):
    link_token.transfer(crypto_champions.address, chainlink_fee * 100, {"from": accounts[0]})


@pytest.fixture(scope="module")
def get_eth_usd_price_feed(accounts, MockV3Aggregator):
    """
    Deploys the mock v3 aggregator and returns the deployed address
    """
    yield accounts[0].deploy(MockV3Aggregator, 18, 2000)


@pytest.fixture(scope="module")
def get_btc_usd_price_feed(accounts, MockV3Aggregator):
    """
    Deploys the mock v3 aggregator and returns the deployed address
    """
    yield accounts[0].deploy(MockV3Aggregator, 18, 9000)


@pytest.fixture
def create_affinities(accounts, crypto_champions, get_eth_usd_price_feed, get_btc_usd_price_feed):
    """
    Creates the ETH affinity
    """
    crypto_champions.createAffinity("ETH", get_eth_usd_price_feed.address, {"from": accounts[0]})
    crypto_champions.createAffinity("BTC", get_btc_usd_price_feed.address, {"from": accounts[0]})


@pytest.fixture
def set_phase_to_mint_hero(accounts, crypto_champions):
    crypto_champions.setPhase(1, {"from": accounts[0]})


@pytest.fixture
def mint_first_elder(accounts, crypto_champions, create_affinities):
    """
    Mint the first elder for the CryptoChampions contract.
    """
    crypto_champions.mintElderSpirit(7, 3, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})


@pytest.fixture
def mint_first_hero(accounts, crypto_champions, mint_first_elder, set_phase_to_mint_hero, fund_contract_with_link):
    """
    Mint the first hero for the CryptoChampions contract. Hero is based on the first elder minted.
    """
    lastMintedElderId = crypto_champions.eldersInGame() - 1
    heroName = "Test Hero"
    crypto_champions.mintHero(lastMintedElderId, heroName, {"from": accounts[0], "value": crypto_champions.getHeroMintPrice(crypto_champions.currentRound(), lastMintedElderId)})


@pytest.fixture
def mint_max_elders(accounts, crypto_champions, create_affinities):
    """
    Mint the max amount of elders for the CryptoChampions contract. Hero is based on the first elder minted.
    """
    maxElders = crypto_champions.MAX_NUMBER_OF_ELDERS()
    for _ in range(maxElders):
        crypto_champions.mintElderSpirit(0, 0, "ETH", {"from": accounts[0], "value": crypto_champions.elderMintPrice()})




