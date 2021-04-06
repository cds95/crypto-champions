import getWeb3 from './web3';
import map from '../artifacts/deployments/map.json';
import { getChain } from '../AppUtils';

export const loadContract = async (contractName) => {
    const chain = await getChain();
    const address = getContractAddress(chain, contractName);
    if (!address) {
        console.log(`Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`);
        return null;
    }
    const contractArtifact = await getContractArtifact(chain, address);
    if (!contractArtifact) {
        console.log(`Failed to load contract artifact for contract ${contractName} in chain ${chain}"`);
        return null;
    }
    const web3 = await getWeb3();
    return new web3.eth.Contract(contractArtifact.abi, address);
};

const getContractAddress = (chain, contractName) => {
    if (map[chain] && map[chain][contractName]) {
        return map[chain][contractName][0];
    }
    return null;
};

const getContractArtifact = async (chain, contractAddress) => {
    try {
        return await import(`../artifacts/deployments/${chain}/${contractAddress}.json`);
    } catch (e) {
        return undefined;
    }
};

export const getContractInstanceAtAddress = async (contractJson, contractAddress) => {
    const { abi } = contractJson;
    const web3 = await getWeb3();
    return new web3.eth.Contract(abi, contractAddress);
};
