import pytest


@pytest.fixture(autouse=True)
def setup(fn_isolation):
    """
    Isolation setup fixture.
    This ensures that each test runs against the same base environment.
    """
    pass


# VyperStorage.vy and SolidityStorage.sol test configuration


@pytest.fixture(scope="module")
def vyper_storage(accounts, VyperStorage):
    """
    Yield a `Contract` object for the VyperStorage contract.
    """
    yield accounts[0].deploy(VyperStorage)


@pytest.fixture(scope="module")
def solidity_storage(accounts, SolidityStorage):
    """
    Yield a `Contract` object for the SolidityStorage contract.
    """
    yield accounts[0].deploy(SolidityStorage)


# CryptoChampions.sol test configuration


@pytest.fixture(scope="module")
def crypto_champions(accounts, CryptoChampions):
    """
    Yield a `Contract` object for the CryptoChampions contract.
    """
    yield accounts[0].deploy(CryptoChampions)
