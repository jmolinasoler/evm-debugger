const url = require('url');
const anvilModel = require('../models/anvil');
const debugView = require('../views/debugView');

/**
 * Handles the request to show the Anvil debug info page.
 * @param {import('http').IncomingMessage} req - The request object.
 * @param {import('http').ServerResponse} res - The response object.
 */
async function showDebugInfo(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const blockQuery = parsedUrl.query.block;

    let searchResult = {};

    try {
        // Always fetch the main debug info
        const data = await anvilModel.getDebugInfo();

        // If there's a block search query, fetch that block
        if (blockQuery) {
            searchResult.searchQuery = blockQuery;
            const block = await anvilModel.getBlock(blockQuery);
            if (block) {
                searchResult.searchedBlock = block;
            } else {
                searchResult.searchError = `Block "${blockQuery}" not found.`;
            }
        }

        const htmlResponse = debugView.render(data, searchResult, null);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlResponse);
    } catch (error) {
        // This catches errors from getDebugInfo() or getBlock()
        const htmlResponse = debugView.render(null, {}, error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(htmlResponse);
    }
}

/**
 * Handles the request to get just the HTML for the recent blocks list.
 * @param {import('http').IncomingMessage} req - The request object.
 * @param {import('http').ServerResponse} res - The response object.
 */
async function getRecentBlocksHtml(req, res) {
    try {
        const data = await anvilModel.getDebugInfo();
        const htmlResponse = debugView.renderRecentBlocks(data.recentBlocks);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlResponse);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching recent blocks.');
    }
}

module.exports = { showDebugInfo, getRecentBlocksHtml };