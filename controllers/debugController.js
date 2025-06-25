const anvilModel = require('../models/anvil');
const debugView = require('../views/debugView');

/**
 * Handles the request to show the Anvil debug info page.
 * @param {import('http').IncomingMessage} req - The request object.
 * @param {import('http').ServerResponse} res - The response object.
 */
async function showDebugInfo(req, res) {
    try {
        const data = await anvilModel.getDebugInfo();
        const htmlResponse = debugView.render(data, null);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlResponse);
    } catch (error) {
        const htmlResponse = debugView.render(null, error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(htmlResponse);
    }
}

module.exports = { showDebugInfo };