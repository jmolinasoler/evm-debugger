const { ethers } = require('ethers');

// Configuration is now co-located with the logic that uses it.
const ANVIL_RPC_URL = 'http://localhost:8545';
const DEFAULT_ANVIL_ACCOUNT = '0xf39fd6e51aad88f6dace687ef88bce6dafdc6707';

/**
 * Fetches debugging information from the Anvil EVM.
 * @returns {Promise<object>} A promise that resolves to an object with debug info.
 */
async function getDebugInfo() {
    const provider = new ethers.JsonRpcProvider(ANVIL_RPC_URL);

    // Fetch primary data in parallel for better performance.
    const [blockNumber, network, feeData, balance] = await Promise.all([
        provider.getBlockNumber(),
        provider.getNetwork(),
        provider.getFeeData(),
        provider.getBalance(DEFAULT_ANVIL_ACCOUNT),
    ]);

    // Fetch the last 5 blocks, or fewer if the chain is shorter.
    const blockPromises = [];
    const blockCount = Math.min(5, blockNumber + 1);
    for (let i = 0; i < blockCount; i++) {
        blockPromises.push(provider.getBlock(blockNumber - i));
    }
    const recentBlocks = await Promise.all(blockPromises);

    // Return a structured data object, not HTML.
    return {
        status: '✅ Connected',
        rpcUrl: ANVIL_RPC_URL,
        chainId: network.chainId.toString(),
        networkName: network.name,
        blockNumber,
        gasPriceGwei: ethers.formatUnits(feeData.gasPrice, 'gwei'),
        account: DEFAULT_ANVIL_ACCOUNT,
        balanceEth: ethers.formatEther(balance),
        latestBlock: recentBlocks.length > 0 ? recentBlocks[0] : null,
        recentBlocks,
    };
}

/**
 * Fetches a specific block by its number or hash.
 * @param {string | number} blockIdentifier - The block number or hash to fetch.
 * @returns {Promise<ethers.Block | null>} A promise that resolves to the block object or null if not found.
 */
async function getBlock(blockIdentifier) {
    const provider = new ethers.JsonRpcProvider(ANVIL_RPC_URL);

    // Ethers' getBlock can take a number or a hash string.
    // We should convert the input to a number if it looks like one.
    const blockTag = /^\d+$/.test(blockIdentifier) ? parseInt(blockIdentifier, 10) : blockIdentifier;

    return provider.getBlock(blockTag);
}

module.exports = { getDebugInfo, getBlock, ANVIL_RPC_URL };