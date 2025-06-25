# Anvil EVM Debugger

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple Node.js web application designed to connect to a local Anvil EVM instance for quick debugging. This tool is particularly useful for bug bounty hunters and security researchers who need to quickly inspect the state of a forked or local blockchain environment.

## Purpose

When doing bug bounty analysis on smart contracts, it's common to fork a mainnet environment using Anvil. This tool provides a simple, browser-based interface to get at-a-glance information about your local Anvil node, such as the current block number, gas price, and account balances, without needing to constantly interact with the command line.

## Features

*   **Web Interface:** Access debug information from your browser.
*   **Real-time Data:** Fetches the latest data from your Anvil instance on each page refresh.
*   **Key Information:** Displays essential EVM details:
    *   Connection Status & RPC URL
    *   Chain ID & Network Name
    *   Current Block Number
    *   Current Gas Price
    *   Balance of a default Anvil account
    *   Latest Block Details (Hash, Timestamp, Miner, etc.)
*   **Scalable Architecture:** Built with an MVC (Model-View-Controller) pattern to make it easy to extend with new features.

## Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [Foundry](https://getfoundry.sh/) (which includes Anvil)

## Getting Started

Follow these steps to get the debugger up and running.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/anvil-debugger.git
cd anvil-debugger
```
*(Remember to replace `your-username/anvil-debugger.git` with your actual repository URL)*

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Anvil

In a separate terminal window, start your local Anvil node. You can use it for a local chain or fork a network.

```bash
# For a clean local node
anvil

# Or to fork a network (e.g., Ethereum Mainnet)
anvil --fork-url <YOUR_RPC_URL>
```

Anvil will start and listen on `http://localhost:8545`.

### 4. Run the Application

In your project directory, start the debugger server:

```bash
npm start
```

You will see a confirmation message in the console: `Anvil Debugger server running at http://localhost:3000`.

### 5. Open in Browser

Navigate to **http://localhost:3000** in your web browser to see the Anvil EVM information.

## License

This project is licensed under the MIT License. See the LICENSE file for details.