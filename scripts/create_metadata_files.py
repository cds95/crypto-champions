from brownie import CryptoChampions, accounts
import http
import json
import os 
from requests import Request, Session

CRYPTO_CHAMPIONS_ADDRESS = "0xC8305aE3d6674306FF68c4620c03496D490AE072" # latest rinkeby contract
cc = CryptoChampions.at(CRYPTO_CHAMPIONS_ADDRESS)

dir_path = os.path.dirname(os.path.realpath(__file__))

pinata_base_url = "https://api.pinata.cloud/"

RACES = {
    0: "Human",
    1: "Cat",
    2: "Elf",
    3: "Frog",
    4: "Bear",
    5: "Bull",
    6: "Robot",
    7: "Demon"
}

RACES_TRAITS = {
    0: {1: "Shrewd Diplomacy", 2: "Beast Taming", 3: "Ardent Explorer", 4: "Opposable Thumbs"},
    1: {1: "Meme Scene", 2: "It's not a phase", 3: "Meow", 4: "Add me on DeviantArt"},
    2: {1: "Arcane Affinity", 2: "One with Nature", 3: "Into the Shadows", 4: "Light Footed"},
    3: {1: "We're all in this Together", 2: "The Future of France", 3: "In it for the Tech", 4: "What's a Whitepaper?"},
    4: {1: "Just Wait and See", 2: "Perpetual Pessimist", 3: "Bubble Popper", 4: "See, I Told you"},
    5: {1: "Up Only", 2: "Throw a Dart", 3: "To the Moon", 4: "Day Trader"},
    6: {1: "Built to Last", 2: "Deep Blue", 3: "Plug in Baby", 4: "Static Shock"},
    7: {1: "Bloodlust", 2: "Dark Vision", 3: "The Floor is Lava", 4: "A Tempting Offer"}
}

CLASSES = {
    0: "Warrior",
    1: "Mage",
    2: "Druid",
    3: "Paladin",
    4: "Bard",
    5: "Necromancer",
    6: "Priest",
    7: "Rogue"
}

CLASS_SKILLS = {
    0: {1: "Whirlwind", 2: "Shield Block", 3: "Fury", 4: "Comradery"},
    1: {1: "Arcane Blast", 2: "Fireball", 3: "Frost Bolt", 4: "Two for One"},
    2: {1: "Maul", 2: "Rejuvenation", 3: "Shapeshift", 4: "Enchant"},
    3: {1: "Smite", 2: "Guiding Light", 3: "Wall of Justice", 4: "Lay on Hands"},
    4: {1: "Song of Rest", 2: "Jack of all Trades", 3: "Free Compliments", 4: "A Twinkling Eye"},
    5: {1: "Skeleton Army", 2: "Brittle Bones", 3: "Suspicious Pet", 4: "Pestilence"},
    6: {1: "Healing Prayer", 2: "Touch of Light", 3: "Soothing Aura", 4: "Shackles from Above"},
    7: {1: "Pickpocket", 2: "Fan of Knives", 3: "Shadow Strike", 4: "Poisoned Blade"}
}

ALIGNMENTS = {
    1: 'Lawful Good',
    2: 'Neutral Good',
    3: 'Chaotic Good',
    4: 'Lawful Neutral',
    5: 'True Neutral',
    6: 'Chaotic Neutral',
    7: 'Lawful Evil',
    8: 'Neutral Evil',
    9: 'Chaotic Evil'
}

BACKGROUNDS = {
    1: "Anon",
    2: "Art Collector",
    3: "Charlatan",
    4: "Connoisseur of Memes",
    5: "Contrarian",
    6: "Criminal",
    7: "D List Internet Celebrity",
    8: "Entertainer",
    9: "E-girl",
    10: "E-boy",
    11: "Farmer",
    12: "Fundamentalist",
    13: "Flipper",
    14: "Gambler",
    15: "Hermit",
    16: "Marine",
    17: "Mercenary",
    18: "Merchant",
    19: "Memecoin Maximalist",
    20: "NEET",
    21: "NFT Artist",
    22: "Noble",
    23: "Pirate",
    24: "Programmer",
    25: "Protocol Politician",
    26: "Soldier",
    27: "Spy",
    28: "TA Savant",
    29: "Whale Watcher",
    30: "Bounty Hunter",
}

CITIES = {
    1: 'Vancouver, Canada',
    2: 'Austin, USA',
    3: 'Chicago, USA',
    4: 'Miami, USA',
    5: 'NYC, USA',
    6: 'San Diego, USA',
    7: 'San Francisco, USA',
    8: 'Seattle, USA',
    9: 'Mexico City, Mexico',
    10: 'Buenos Aires, Argentina',
    11: 'Johannesburg, South Africa',
    12: 'Cairo, Egypt',
    13: 'London, UK',
    14: 'Moscow, Russia',
    15: 'Berlin, Germany',
    16: 'Paris, France',
    17: 'Amsterdam, The Netherlands',
    18: 'Stockholm, Sweden',
    19: 'Tokyo, Japan',
    20: 'Mumbai, India',
    21: 'Shanghai, China',
    22: 'Seoul, South Korea',
    23: 'Singapore, Singapore',
    24: 'Melbourne, Australia'
}

WEATHERS = {
    1: 'Clouds',
    2: 'Clear',
    3: 'Atmosphere',
    4: 'Snow',
    5: 'Rain',
    6: 'Drizzle',
    7: 'Thunderstorm'
}

RACES_IPFS_GIFS = {
    0: "ipfs://QmeHbFVD1bqa3sShpskoqFydJtHBeDHL8VwBmdr2M1gnoS/Human.gif",
    1: "ipfs://QmeHbFVD1bqa3sShpskoqFydJtHBeDHL8VwBmdr2M1gnoS/Kittie.gif",
    2: "ipfs://QmeHbFVD1bqa3sShpskoqFydJtHBeDHL8VwBmdr2M1gnoS/Elf.gif",
    3: "ipfs://QmeHbFVD1bqa3sShpskoqFydJtHBeDHL8VwBmdr2M1gnoS/Froggen.gif",
    4: "ipfs://QmeHbFVD1bqa3sShpskoqFydJtHBeDHL8VwBmdr2M1gnoS/Bera.gif",
    5: "ipfs://QmeHbFVD1bqa3sShpskoqFydJtHBeDHL8VwBmdr2M1gnoS/Bully.gif",
    6: "ipfs://QmeHbFVD1bqa3sShpskoqFydJtHBeDHL8VwBmdr2M1gnoS/Robo.gif",
    7: "ipfs://QmeHbFVD1bqa3sShpskoqFydJtHBeDHL8VwBmdr2M1gnoS/Demon.gif"
}

RACE_IPFS_IMAGES = {
    0: {1:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Human_A.png", 2:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Human_B.png"},
    1: {1:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Cat_A.png", 2:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Cat_B.png"},
    2: {1:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Elf_A.png", 2:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Elf_B.png"},
    3: {1:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Pepe_A.png", 2:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Pepe_B.png"},
    4: {1:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Bear_A.png", 2:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Bear_B.png"},
    5: {1:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Bull_A.png", 2:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Bull_B.png"},
    6: {1:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Robot_A.png", 2:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Robot_B.png"},
    7: {1:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Demon_A.png", 2:"ipfs://QmSRp9STByPHrurTCvpwgBfz8ZX5FbkxamXjEk7HRw7PDr/Demon_B.png"}
}

def createElderMetadata(id):
    with open(os.path.join(dir_path, "../metadata/elder_template.json")) as elderTemplate:
        data = json.load(elderTemplate)
        elderSpirit = cc.getElderSpirit(id)

        data["image"] = RACES_IPFS_GIFS[elderSpirit[1]]

        data["attributes"][0]["value"] = elderSpirit[3]
        data["attributes"][1]["value"] = RACES[elderSpirit[1]]
        data["attributes"][2]["value"] = CLASSES[elderSpirit[2]]

        fileName = str(id) + ".json"
        with open(fileName, "w") as output:
            json.dump(data, output)

        return fileName

def createHeroMetadata(id):
    with open(os.path.join(dir_path, "../metadata/hero_template.json")) as heroTemplate:
        data = json.load(heroTemplate)
        
        gameData = cc.getHeroGameData(id)
        data["attributes"][0]["value"] = gameData[1] # Affinity
        data["attributes"][1]["value"] = gameData[3] # Generation

        visuals = cc.getHeroVisuals(id)
        raceId = visuals[1]
        classId = visuals[2]
        data["name"] = visuals[0]
        data["image"] = RACE_IPFS_IMAGES[raceId][visuals[3]] # appearance
        data["attributes"][2]["value"] = RACES[visuals[1]] # Race
        data["attributes"][3]["value"] = CLASSES[visuals[2]] # Class

        traitsSkills = cc.getHeroTraitsSkills(id)
        data["attributes"][4]["value"] = RACES_TRAITS[raceId][traitsSkills[0]] # Trait 1
        data["attributes"][5]["value"] = RACES_TRAITS[raceId][traitsSkills[1]]# Trait 2
        data["attributes"][6]["value"] = CLASS_SKILLS[classId][traitsSkills[2]]# Skill 1
        data["attributes"][7]["value"] = CLASS_SKILLS[classId][traitsSkills[3]]# Skill2

        lore = cc.getHeroLore(id)
        data["attributes"][8]["value"] = ALIGNMENTS[lore[0]]# Alignment
        data["attributes"][9]["value"] = BACKGROUNDS[lore[1]]# Background
        data["attributes"][10]["value"] = CITIES[lore[2]]# Hometown
        data["attributes"][11]["value"] = WEATHERS[lore[3]]# Weather

        vitals = cc.getHeroVitals(id)
        data["attributes"][12]["value"] = vitals[0]# Level
        data["attributes"][13]["value"] = vitals[1]# HP
        data["attributes"][14]["value"] = vitals[2]# Mana
        data["attributes"][15]["value"] = vitals[3]# Stamina

        stats = cc.getHeroStats(id)
        data["attributes"][16]["value"] = stats[0] # Strength
        data["attributes"][17]["value"] = stats[1] # Dexterity
        data["attributes"][18]["value"] = stats[2] # Constitution
        data["attributes"][19]["value"] = stats[3] # Intelligence
        data["attributes"][20]["value"] = stats[4] # Wisdom
        data["attributes"][21]["value"] = stats[5] # Charisma

        fileName = str(id) + ".json"
        with open(fileName, "w") as output:
            json.dump(data, output)

        return fileName

def main():
    account = accounts.load("dev")
    
    # Iterate through all elders
    for i in range(0, cc.eldersInGame()):
        # create the elder metadata json file
        elderMetadataFile = createElderMetadata(i)

        # use the pinata api to upload and pin file
        with open(os.path.join(dir_path, "../.PinataAdminKey")) as adminKeyFile:
            # get the api keys which are on the top two lines of the file
            pinata_api_key = adminKeyFile.readline().strip()
            pinata_secret_api_key = adminKeyFile.readline().strip()

            # authenticate with pinata
            session = Session()
            h = {
                "pinata_api_key": pinata_api_key,
                "pinata_secret_api_key": pinata_secret_api_key
            }
            session.headers.update(h)

            authenticateUrl = pinata_base_url + "data/testAuthentication"
            r = session.get(authenticateUrl)
            rJson = json.loads(r.text)
            
            # pin file to ipfs with pinata
            pinUrl = pinata_base_url + "pinning/pinFileToIPFS"
            files = {'file': open(elderMetadataFile, 'rb')}
            r = session.post(pinUrl, files=files)
            rJson = json.loads(r.text)

            # set the token uri
            uri = "ipfs://" + rJson["IpfsHash"]
            cc.setTokenURI(i, uri, {"from": account})

    for i in range(cc.MAX_NUMBER_OF_ELDERS(), cc.MAX_NUMBER_OF_ELDERS() + cc.heroesMinted()):
        if cc.uri(i) == "":
            heroMetaData = createHeroMetadata(i)
            # use the pinata api to upload and pin file
            with open(os.path.join(dir_path, "../.PinataAdminKey")) as adminKeyFile:
                # get the api keys which are on the top two lines of the file
                pinata_api_key = adminKeyFile.readline().strip()
                pinata_secret_api_key = adminKeyFile.readline().strip()

                # authenticate with pinata
                session = Session()
                h = {
                    "pinata_api_key": pinata_api_key,
                    "pinata_secret_api_key": pinata_secret_api_key
                }
                session.headers.update(h)

                authenticateUrl = pinata_base_url + "data/testAuthentication"
                r = session.get(authenticateUrl)
                rJson = json.loads(r.text)
                
                # pin file to ipfs with pinata
                pinUrl = pinata_base_url + "pinning/pinFileToIPFS"
                
                files = {'file': open(heroMetaData, 'rb')}
                r = session.post(pinUrl, files=files)
                rJson = json.loads(r.text)

                # set the token uri
                uri = "ipfs://" + rJson["IpfsHash"]
                cc.setTokenURI(i, uri, {"from": account})

