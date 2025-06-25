/**
 * Renders the debug information into an HTML page.
 * @param {object} [data] - The debug data from the model.
 * @param {Error} [error] - An error object if the data fetching failed.
 * @returns {string} The full HTML page as a string.
 */
function render(data, error) {
    let content;

    if (error) {
        content = `
            <div class="error">
                <h2>❌ Error Connecting to Anvil</h2>
                <p>Please ensure Anvil is running.</p>
                <p><strong>Details:</strong> ${error.message}</p>
            </div>
        `;
    } else {
        content = `
            <h2>EVM Information</h2>
            <div class="info-grid">
                <strong>Status:</strong><span>${data.status}</span>
                <strong>RPC URL:</strong><code>${data.rpcUrl}</code>
                <strong>Chain ID:</strong><span>${data.chainId}</span>
                <strong>Network Name:</strong><span>${data.networkName}</span>
                <strong>Current Block:</strong><span>${data.blockNumber}</span>
                <strong>Gas Price (gwei):</strong><span>${data.gasPriceGwei}</span>
                <strong>Balance of Default Acct:</strong><span>${data.balanceEth} ETH</span>
                <strong>Default Account:</strong><code>${data.account}</code>
            </div>

            <h2>Latest Block Details (#${data.blockNumber})</h2>
            <div class="info-grid">
                <strong>Block Hash:</strong><code>${data.latestBlock.hash}</code>
                <strong>Timestamp:</strong><span>${new Date(Number(data.latestBlock.timestamp) * 1000).toLocaleString()}</span>
                <strong>Miner/Proposer:</strong><code>${data.latestBlock.miner}</code>
                <strong>Transaction Count:</strong><span>${data.latestBlock.transactions.length}</span>
            </div>
        `;
    }

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Anvil EVM Debugger</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f4f9; color: #333; }
                .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                h1, h2 { color: #1a1a1a; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                .info-grid { display: grid; grid-template-columns: 200px 1fr; gap: 10px; align-items: center; word-break: break-all; }
                .info-grid strong { color: #555; }
                .error { color: #d32f2f; background-color: #ffcdd2; padding: 15px; border-radius: 4px; border-left: 5px solid #d32f2f; }
                code { background: #eee; padding: 2px 4px; border-radius: 4px; }
            </style>
        </head>
        <body><div class="container"><h1>Anvil EVM Debugger</h1>${content}</div></body>
        </html>
    `;
}

module.exports = { render };