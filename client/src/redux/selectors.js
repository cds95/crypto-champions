export const getAllowedAffinities = (state) => {
    const {
        cryptoChampions: { affinities, mintedAffinities }
    } = state;
    return affinities.filter((a) => !mintedAffinities.includes(a));
};
