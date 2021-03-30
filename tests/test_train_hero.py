import brownie


def test_train_invalid_hero_id(accounts, crypto_champions):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.trainHero(0, {"from": accounts[0]})


def test_train_random_number_has_not_yet_arrived(accounts, crypto_champions, mint_first_hero):
    with brownie.reverts("dev: Random number has not arrived yet."):
        crypto_champions.trainHero(crypto_champions.MAX_NUMBER_OF_ELDERS() + crypto_champions.heroesMinted(), {"from": accounts[0]})


def test_train_success(accounts, crypto_champions, mint_first_hero, vrf_coordinator):
    # Get all the hero attributes
    heroId = crypto_champions.MAX_NUMBER_OF_ELDERS() + crypto_champions.heroesMinted()
    # Assert all initial values are zero or null
    visuals = crypto_champions.getHeroVisuals(heroId)
    assert is_any_value_not_zero_or_null([visuals[3]]) == True
    skillsTraits = crypto_champions.getHeroTraitsSkills(heroId)
    assert is_any_value_not_zero_or_null(skillsTraits) == True
    lore = crypto_champions.getHeroLore(heroId)
    assert is_any_value_not_zero_or_null(lore) == True
    vitals = crypto_champions.getHeroVitals(heroId)
    assert is_any_value_not_zero_or_null(vitals) == True
    stats = crypto_champions.getHeroStats(heroId)
    assert is_any_value_not_zero_or_null(stats) == True
    # Callback for the random number
    vrf_coordinator.callBackWithRandomness(crypto_champions.getHeroRequestId(crypto_champions.MAX_NUMBER_OF_ELDERS() + crypto_champions.heroesMinted()), 4567892193876471250987129359876123409, crypto_champions.address, {"from": accounts[0]})
    # Train hero
    crypto_champions.trainHero(heroId)
    # Assert all initial values are not zero or null
    visuals = crypto_champions.getHeroVisuals(heroId)
    assert is_any_value_zero_or_null([visuals[3]]) == False
    skillsTraits = crypto_champions.getHeroTraitsSkills(heroId)
    assert is_any_value_zero_or_null(skillsTraits) == False
    lore = crypto_champions.getHeroLore(heroId)
    assert is_any_value_zero_or_null(lore) == False
    vitals = crypto_champions.getHeroVitals(heroId)
    assert is_any_value_zero_or_null(vitals) == False
    stats = crypto_champions.getHeroStats(heroId)
    assert is_any_value_zero_or_null(stats) == False


def is_any_value_not_zero_or_null(heroAttributes):
    isZero = True
    for attribute in heroAttributes:
        if type(attribute) == "str" and attribute != "":
            isZero = False
        if type(attribute) == "int" and attribute != 0:
            isZero = False
    return isZero


def is_any_value_zero_or_null(heroAttributes):
    isZero = False
    for attribute in heroAttributes:
        if type(attribute) == "str" and attribute == "":
            isZero = True
        if type(attribute) == "int" and attribute == 0:
            isZero = True
    return isZero


