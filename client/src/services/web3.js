import Web3 from 'web3';

let web3 = null;

export const getWeb3 = () =>
    new Promise((resolve, reject) => {
        if (web3) {
            resolve(web3);
        }
        window.addEventListener('load', async () => {
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            } else if (window.web3) {
                web3 = window.web3;
                console.log('Injected web3 detected.');
                resolve(web3);
            } else {
                const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
                web3 = new Web3(provider);
                console.log('No web3 instance injected, using Local web3.');
                resolve(web3);
            }
        });
    });

export const getUserAccount = async () => {
    const web3 = await getWeb3();
    const accounts = await await web3.eth.getAccounts();
    return accounts[0];
};

export default getWeb3;
