/**
 * Renders the debug information into an HTML page.
 * @param {object} [data] - The debug data from the model.
 * @param {object} [search] - The search result data, containing searchedBlock, searchError, and searchQuery.
 * @param {Error} [error] - An error object if the data fetching failed.
 * @returns {string} The full HTML page as a string.
 */
function render(data, { searchedBlock, searchError, searchQuery } = {}, error) {
    let mainContent;

    if (error) {
        mainContent = `
            <div class="error">
                <h2>❌ Error Connecting to Anvil</h2>
                <p>Please ensure Anvil is running.</p>
                <p><strong>Details:</strong> ${error.message}</p>
            </div>
        `;
    } else {
        mainContent = `
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

        `;

        // Find the latest block with at least one transaction from the recent blocks
        const latestBlockWithTx = data.recentBlocks ? data.recentBlocks.find(b => b.transactions.length > 0) : null;

        if (latestBlockWithTx) {
            mainContent += `
                <div class="section-container">
                    <h2>Latest Block With Transaction (#${latestBlockWithTx.number})</h2>
                    <div class="info-grid">
                        <strong>Block Hash:</strong><code>${latestBlockWithTx.hash}</code>
                        <strong>Timestamp:</strong><span>${new Date(Number(latestBlockWithTx.timestamp) * 1000).toLocaleString()}</span>
                        <strong>Miner/Proposer:</strong><code>${latestBlockWithTx.miner}</code>
                        <strong>Transaction Count:</strong><span>${latestBlockWithTx.transactions.length}</span>
                    </div>
                </div>
            `;
        } else {
            mainContent += `
                <div class="section-container">
                    <h2>Latest Block With Transaction</h2>
                    <p>No transactions found in recent blocks.</p>
                </div>
            `;
        }

        if (data.recentBlocks && data.recentBlocks.length > 0) {
            mainContent += `
                <div class="section-container">
                    <h2>Recent Blocks <span id="refresh-indicator" class="refresh-indicator"></span></h2>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="checkbox" id="filterTxsCheckbox">
                            <label for="filterTxsCheckbox">Show only blocks with transactions</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="autoRefreshCheckbox">
                            <label for="autoRefreshCheckbox">Enable Auto-Refresh</label>
                        </div>
                    </div>
                    <div class="recent-blocks-list">
                        ${renderRecentBlocks(data.recentBlocks)}
                    </div>
                </div>
            `;

            // Add this section for blocks with one or more transactions
            const blocksWithTxs = data.recentBlocks.filter(b => b.transactions.length > 0);
            if (blocksWithTxs.length > 0) {
                mainContent += `
                    <div class="section-container">
                        <h2>Blocks With Transactions (≥1)</h2>
                        <div class="recent-blocks-list">
                            ${renderRecentBlocks(blocksWithTxs)}
                        </div>
                    </div>
                `;
            }
        }
    }

    let searchContent = `
        <div class="search-container">
            <h2>Search for a Block</h2>
            <form action="/" method="GET" class="search-form">
                <input type="text" name="block" placeholder="Enter Block Number or Hash" value="${searchQuery || ''}">
                <button type="submit">Search</button>
            </form>
        </div>
    `;

    if (searchError) {
        searchContent += `<div class="error-light">${searchError}</div>`;
    } else if (searchedBlock) {
        searchContent += `
            <div class="search-results">
                <h2>Search Result: Block #${searchedBlock.number}</h2>
                <div class="info-grid">
                    <strong>Hash:</strong><code>${searchedBlock.hash}</code>
                    <strong>Parent Hash:</strong><code>${searchedBlock.parentHash}</code>
                    <strong>Timestamp:</strong><span>${new Date(Number(searchedBlock.timestamp) * 1000).toLocaleString()}</span>
                    <strong>Nonce:</strong><code>${searchedBlock.nonce}</code>
                    <strong>Difficulty:</strong><span>${searchedBlock.difficulty.toString()}</span>
                    <strong>Gas Limit:</strong><span>${searchedBlock.gasLimit.toString()}</span>
                    <strong>Gas Used:</strong><span>${searchedBlock.gasUsed.toString()}</span>
                    <strong>Miner:</strong><code>${searchedBlock.miner}</code>
                    <strong>Extra Data:</strong><code class="extra-data">${searchedBlock.extraData}</code>
                </div>
                <h3>Transactions (${searchedBlock.transactions.length})</h3>
                <div class="tx-list">
                    ${searchedBlock.transactions.map(tx => `<code>${tx}</code>`).join('') || '<span>No transactions in this block.</span>'}
                </div>
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
                .recent-blocks-list { display: flex; flex-direction: column; gap: 10px; }
                .filter-options { display: flex; gap: 20px; flex-wrap: wrap; }
                .filter-option {
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .block-item { background: #f9f9f9; padding: 10px 15px; border-radius: 4px; border: 1px solid #eee; }
                .block-item a { text-decoration: none; color: #007bff; font-weight: bold; font-size: 1.1em; }
                .block-item a:hover { text-decoration: underline; }
                .block-meta { color: #666; font-size: 0.9em; margin-left: 10px; }
                .block-hash { margin-top: 5px; font-size: 0.9em; color: #333; word-break: break-all; }
                .block-hash code { font-size: 0.95em; }
                .refresh-indicator { font-size: 0.7em; font-weight: normal; color: #666; margin-left: 10px; }
                .tx-list { display: flex; flex-direction: column; gap: 5px; max-height: 200px; overflow-y: auto; background: #fafafa; padding: 10px; border-radius: 4px; }
                .error { color: #d32f2f; background-color: #ffcdd2; padding: 15px; border-radius: 4px; border-left: 5px solid #d32f2f; }
                .error-light { color: #b71c1c; background-color: #ffebee; padding: 10px; border-radius: 4px; margin-top: 10px; }
                code { background: #eee; padding: 2px 4px; border-radius: 4px; }
                .extra-data { max-width: 550px; overflow-wrap: break-word; }
                .search-form { display: flex; gap: 10px; }
                .search-form input { flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; }
                .search-form button { padding: 8px 16px; border: none; background-color: #007bff; color: white; border-radius: 4px; cursor: pointer; }
                .search-form button:hover { background-color: #0056b3; }
                .section-container, .search-container, .search-results { margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee; } /* Added section-container here */
            </style>
        </head>
        <body><div class="container"><h1>Anvil EVM Debugger</h1>${mainContent}${searchContent}</div></body>
        <script>
            const FILTER_STORAGE_KEY = 'filterTxsCheckboxState';
            const AUTO_REFRESH_STORAGE_KEY = 'autoRefreshState';
            const REFRESH_INTERVAL_MS = 4000;

            document.addEventListener('DOMContentLoaded', () => {
                const filterCheckbox = document.getElementById('filterTxsCheckbox');
                const autoRefreshCheckbox = document.getElementById('autoRefreshCheckbox');
                const recentBlocksList = document.querySelector('.recent-blocks-list');
                const refreshIndicator = document.getElementById('refresh-indicator');

                let refreshIntervalId = null;

                // This function will be called to apply the filter to the current items in the list.
                const applyFilter = () => {
                    if (!filterCheckbox || !recentBlocksList) return;

                    const showOnlyWithTxs = filterCheckbox.checked;
                    const blockItems = recentBlocksList.querySelectorAll('.block-item');

                    blockItems.forEach(item => {
                        const txCount = parseInt(item.dataset.txCount, 10);
                        item.style.display = (showOnlyWithTxs && txCount === 0) ? 'none' : '';
                    });
                };

                // This function handles the checkbox change and saves the state.
                const onFilterChange = () => {
                    localStorage.setItem(FILTER_STORAGE_KEY, filterCheckbox.checked);
                    applyFilter();
                };

                const updateRecentBlocks = async () => {
                    try {
                        const response = await fetch('/api/recent-blocks');
                        if (!response.ok) {
                            console.error('Failed to fetch recent blocks:', response.statusText);
                            return;
                        }
                        const newBlocksHtml = await response.text();
                        if (recentBlocksList) {
                            recentBlocksList.innerHTML = newBlocksHtml;
                            applyFilter(); // Re-apply the current filter to the new content
                        }
                    } catch (error) {
                        console.error('Error updating recent blocks:', error);
                    }
                };

                const startAutoRefresh = () => {
                    if (refreshIntervalId !== null) return; // Already running
                    refreshIntervalId = setInterval(updateRecentBlocks, REFRESH_INTERVAL_MS);
                    if (refreshIndicator) refreshIndicator.textContent = '(refreshing every ' + (REFRESH_INTERVAL_MS / 1000) + 's)';
                };

                const stopAutoRefresh = () => {
                    if (refreshIntervalId === null) return; // Already stopped
                    clearInterval(refreshIntervalId);
                    refreshIntervalId = null;
                    if (refreshIndicator) refreshIndicator.textContent = '(auto-refresh paused)';
                };

                const onAutoRefreshChange = () => {
                    const isEnabled = autoRefreshCheckbox.checked;
                    localStorage.setItem(AUTO_REFRESH_STORAGE_KEY, isEnabled);
                    if (isEnabled) {
                        startAutoRefresh();
                        updateRecentBlocks(); // Immediate update on re-enable
                    } else {
                        stopAutoRefresh();
                    }
                };

                // Initial setup
                if (filterCheckbox) {
                    const savedFilterState = localStorage.getItem(FILTER_STORAGE_KEY);
                    if (savedFilterState !== null) {
                        filterCheckbox.checked = (savedFilterState === 'true');
                    }
                    filterCheckbox.addEventListener('change', onFilterChange);
                    applyFilter();
                }

                if (autoRefreshCheckbox) {
                    const savedAutoRefreshState = localStorage.getItem(AUTO_REFRESH_STORAGE_KEY);
                    autoRefreshCheckbox.checked = savedAutoRefreshState === null ? true : (savedAutoRefreshState === 'true');
                    autoRefreshCheckbox.addEventListener('change', onAutoRefreshChange);
                    onAutoRefreshChange(); // Trigger initial start/stop and text update
                }
            });
        </script>
        </html>
    `;
}

/**
 * Renders only the list of recent blocks as an HTML string.
 * @param {Array<object>} recentBlocks - The array of recent block objects.
 * @returns {string} The HTML for the recent blocks list.
 */
function renderRecentBlocks(recentBlocks) {
    if (!recentBlocks || recentBlocks.length === 0) {
        return '<span>No recent blocks found.</span>';
    }

    return recentBlocks.map(block => `
        <div class="block-item" data-tx-count="${block.transactions.length}">
            <a href="/?block=${block.number}">Block #${block.number}</a>
            <span class="block-meta">(${block.transactions.length} txs)</span>
            <div class="block-hash">Hash: <code>${block.hash}</code></div>
        </div>
    `).join('');
}

module.exports = { render, renderRecentBlocks };