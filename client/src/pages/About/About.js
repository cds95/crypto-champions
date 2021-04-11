import { Typography } from '@material-ui/core';
import React from 'react';
import './About.css';

const ABOUT_SECTIONS = [
    {
        title: 'Overview',
        subSections: [
            {
                paragraphs: [
                    'Crypto Champz is a Universal Character Generator that takes advantage of NFT composability to create robust characters that are playable in an endless variety of games. NFTs are exploding in popularity but a lot of the current use cases revolve around speculative artwork. Owners of NFTs often purchase them with the hope that the price will increase. Instead of being purely collectible, we hope to create NFTs that have practical use cases.'
                ]
            },
            {
                paragraphs: [
                    'Crypto Champz serve as NFT primitives that can be used to traverse the Metaverse of blockchain games. For example, your Champion might be used in a card game, a virtual board game, a farming simulator, or even your next D&D campaign! Of course, it can also be traded as a collectible.'
                ]
            }
        ]
    },
    {
        title: 'Prototyping and Templating',
        subSections: [
            {
                paragraphs: [
                    'Instead of minting Champions directly, players must "train" their Champions through Elder Spirits. Elder Spirits act as prototypes and templates from which Champions will inherit certain properties. Every week, a new set of Elder Spirits is available to choose from. For example, Round 1 might have a Human Paladin, Elf Mage, and Bull Warrior to choose from. Round 2 might instead have options for a Bear Bard, a Human Mage, and a Robot Rogue. This keeps things fresh and adds a reason to keep coming back to the game.'
                ]
            }
        ]
    },
    {
        title: 'Royalty Mechanism',
        subSections: [
            {
                paragraphs: [
                    'When a Champion trains with a certain Elder, the owner of that Elder gets paid a royalty fee. Because Elders are rotated out every round, players have the opportunity to earn fees without the system consolidating rent-seeking behavior in a few early participants.'
                ]
            }
        ]
    },
    {
        title: 'Character Generation',
        subSections: [
            {
                paragraphs: [
                    'Character generation occurs in the context of ongoing rounds.  Each round is split into 2 phases.  The round begins with a Setup Phase and then transitions into an Action Phase.  Then the cycle begins anew with the next round.'
                ]
            },
            {
                title: 'Setup Phase:',
                paragraphs: [
                    'Only Elder Spirits can be minted in the Setup Phase.  There is a flat cost to mint Elder Spirits.'
                ]
            },
            {
                title: 'Mint Elder Spirit:',
                paragraphs: [
                    'Before Champz can be minted, we first need Elder Spirits.  At the start of the round, 5 Elder Spirits must be created.  When creating an Elder Spirit, you must select a Race, a Class, and an Affinity.  The Affinity is just your favorite Crypto project :)  Players that own Elder Spirits will receive royalties from all Champions that are minted through them.'
                ]
            },
            {
                title: 'Burn Old Elder Spirits:',
                paragraphs: [
                    "Elder Spirits from the previous round are automatically burned.  Don't worry - owners keep the royalties generated!"
                ]
            },
            {
                title: 'Action Phase: ',
                paragraphs: [
                    'Only Champz can be minted in the Action Phase.  The price of minting Champz increases according to a linear function.  This is to incentive an equal distribution across Elders as well as to encourage early participants without punishing late comers too much (like what would happen in a bonding curve).  Each Elder has its own function.  The price of minting Champz is reset at the start of every round.',
                    "Once all 5 Elder Spirits have been created, players can begin minting Champz.  There are different strategies to consider.  You might want to train your Champ based on your favorite Race, Class, Affinity, or maybe a mixture of all 3.  The rest of your Champ's characteristics will be randomly generated.  You'll want to hope for Champz with higher stats since they will be more useful in battle!",
                    'The Action Phase is when you can battle other Champz.'
                ]
            }
        ]
    }
];

export const About = () => {
    return (
        <div className="about">
            <div className="about__content">
                {ABOUT_SECTIONS.map(({ title, subSections }) => {
                    return (
                        <div className="about-content__section">
                            <Typography variant="h3" className="league-spartan--white about-content__section-title">
                                {title}
                            </Typography>
                            {subSections.map(({ title: subSectionTitle, paragraphs }) => {
                                return (
                                    <div className="about-content__sub-section">
                                        <Typography
                                            className="league-spartan--white about-content__sub-section-title"
                                            variant="h5"
                                        >
                                            {subSectionTitle}
                                        </Typography>
                                        {paragraphs.map((p) => (
                                            <p className="about-content__sub-section-paragraph league-spartan--white">
                                                {p}
                                            </p>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
