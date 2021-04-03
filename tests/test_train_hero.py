import brownie


def test_train_invalid_hero_id(accounts, crypto_champions, fund_contract_with_link, get_seed):
    with brownie.reverts("dev: Given id is not valid."):
        crypto_champions.trainHero(0, 7777777777777777777777777777777, {"from": accounts[0]})


def test_train_uninitialized_hero(accounts, crypto_champions, fund_contract_with_link, get_seed):
    with brownie.reverts("dev: Hero is not valid."):
        crypto_champions.trainHero(crypto_champions.MAX_NUMBER_OF_ELDERS() + 1, 7777777777777777777777777777777, {"from": accounts[0]})


def test_train_success(accounts, crypto_champions, mint_first_hero, vrf_coordinator, get_seed):
    # Get all the hero attributes
    heroId = crypto_champions.MAX_NUMBER_OF_ELDERS() + crypto_champions.heroesMinted()
    # Assert all initial values are zero or null
    visuals = crypto_champions.getHeroVisuals(heroId)
    assert is_any_value_zero([visuals[3]]) == True
    skillsTraits = crypto_champions.getHeroTraitsSkills(heroId)
    assert is_any_value_zero(skillsTraits) == True
    lore = crypto_champions.getHeroLore(heroId)
    assert is_any_value_zero(lore) == True
    vitals = crypto_champions.getHeroVitals(heroId)
    assert is_any_value_zero(vitals) == True
    stats = crypto_champions.getHeroStats(heroId)
    assert is_any_value_zero(stats) == True
    # Callback for the random number
    crypto_champions.trainHero(heroId, 4567892193876471250987129359876123409, {"from": accounts[0]})
    # Assert all initial values are not zero or null
    visuals = crypto_champions.getHeroVisuals(heroId)
    assert is_any_value_zero([visuals[3]]) == False
    skillsTraits = crypto_champions.getHeroTraitsSkills(heroId)
    assert is_any_value_zero(skillsTraits) == False
    lore = crypto_champions.getHeroLore(heroId)
    assert is_any_value_zero(lore) == False
    vitals = crypto_champions.getHeroVitals(heroId)
    assert is_any_value_zero(vitals) == False
    stats = crypto_champions.getHeroStats(heroId)
    assert is_any_value_zero(stats) == False


def is_any_value_zero(heroAttributes):
    isZero = False
    for attribute in heroAttributes:
        if attribute == 0:
            isZero = True
    return isZero