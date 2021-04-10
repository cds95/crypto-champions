import { CircularProgress, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Banner } from '../../components/Banner/Banner';
import { HeroCard } from '../../components/HeroCard';
import { TokenBalance } from '../../components/TokenBalance/TokenBalance';
import { PHASES } from '../../constants';
import { setSelectedCollectionHero, updateHeroAction } from '../../redux/actions';
import { getSelectedHero, getUserOwnedElders, getUserOwnedHeroes, getWinningHeroes } from '../../redux/selectors';
import { claimRoundReward } from '../../services/cryptoChampions';
import './MyCollection.css';
import { CryptoChampionButton } from '../../components/CryptoChampionButton';
import { ElderCard } from '../../components/ElderCard/ElderCard';

const text = {
    ok: 'Ok',
    claimimg: 'Claiming reward...',
    claimRewardSuccess: 'Successfully claimed reward',
    claimRewardError: 'Failed to claim reward',
    claimReward: 'Claim Reward',
    heroes: 'Your Heroes',
    hasRewards: 'Congratulations! One of your Champions is eligible to claim rewards from the Affinity Loyalty Program!'
};

export const MyCollectionComp = ({
    userHeroes,
    winningHeroes,
    phase,
    updateHero,
    isLoadingHeroes,
    userElderSpirits
}) => {
    const [isClaimRewardModalOpen, setIsClaimRewardModalOpen] = useState(false);
    const [isClaimingReward, setIsClaimingReward] = useState(false);
    const [hasSuccessfullyClaimedReward, setHasSuccessfullyClaimedReward] = useState(false);
    const claimReward = async (heroId) => {
        setIsClaimingReward(true);
        setIsClaimRewardModalOpen(true);
        try {
            await claimRoundReward(heroId);
            updateHero(heroId, {
                hasRoundReward: false
            });
            setHasSuccessfullyClaimedReward(true);
        } catch (e) {
            setHasSuccessfullyClaimedReward(false);
        }
        setIsClaimingReward(false);
    };
    const closeModal = () => setIsClaimRewardModalOpen(false);
    const getModalContent = () => {
        if (isClaimingReward) {
            return (
                <React.Fragment>
                    {text.claimimg}
                    <CircularProgress />
                </React.Fragment>
            );
        } else if (hasSuccessfullyClaimedReward) {
            return text.claimRewardSuccess;
        } else {
            return text.claimRewardError;
        }
    };
    return (
        <div className="my-collection">
            <Dialog open={isClaimRewardModalOpen} onClose={closeModal} className="my-collection__reward-modal">
                <DialogContent>{getModalContent()}</DialogContent>
                <DialogActions>{<CryptoChampionButton onClick={closeModal} label={text.ok} />}</DialogActions>
            </Dialog>
            {phase == PHASES.SETUP && winningHeroes.length > 0 && <Banner text={text.hasRewards} />}
            <TokenBalance className="my-collection__token-balance" />
            {isLoadingHeroes ? (
                <CircularProgress />
            ) : (
                <div className="my-collection__heroes">
                    {userElderSpirits.map((elder) => (
                        <div key={`elder-${elder.id}`} className="my-collection__heroes-item">
                            <ElderCard elder={elder} />
                        </div>
                    ))}
                    {userHeroes.map((hero) => (
                        <div key={`hero-${hero.id}`} className="my-collection__heroes-item">
                            <HeroCard
                                hero={hero}
                                action={
                                    hero.hasRoundReward && (
                                        <CryptoChampionButton
                                            onClick={() => claimReward(hero.id)}
                                            label={text.claimReward}
                                        />
                                    )
                                }
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    const {
        collection: { selectedHeroId },
        cryptoChampions: { currentRound, phase, winningAffinity },
        heroes: { isLoadingHeroes }
    } = state;

    return {
        userHeroes: getUserOwnedHeroes(state),
        selectedHeroId,
        winningHeroes: getWinningHeroes(state),
        currentRound,
        phase,
        winningAffinity,
        selectedHero: getSelectedHero(state),
        isLoadingHeroes,
        userElderSpirits: getUserOwnedElders(state)
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedHero: (heroId) => {
            dispatch(setSelectedCollectionHero(heroId));
        },
        updateHero: (heroId, params = {}) => {
            dispatch(updateHeroAction(heroId, params));
        }
    };
};

export const MyCollection = connect(mapStateToProps, mapDispatchToProps)(MyCollectionComp);
