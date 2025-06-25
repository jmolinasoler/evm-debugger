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

    // Fetch all data in parallel for better performance.
    const [blockNumber, network, feeData, balance, latestBlock] = await Promise.all([
        provider.getBlockNumber(),
        provider.getNetwork(),
        provider.getFeeData(),
        provider.getBalance(DEFAULT_ANVIL_ACCOUNT),
        provider.getBlock('latest')
    ]);

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
        latestBlock,
    };
}

module.exports = { getDebugInfo, ANVIL_RPC_URL };