const {
    initiateDeveloperControlledWalletsClient
} = require("@circle-fin/developer-controlled-wallets");

const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET
});

async function createTreasuryWallet(organizationName) {
    try {
        // Create Wallet Set
        const walletSetResponse = await client.createWalletSet({
            name: `${organizationName} Treasury`
        });

        const walletSetId = walletSetResponse.data.walletSet.id;

        // Create Wallet
        const walletResponse = await client.createWallets({
            walletSetId,
            blockchains: ["ARC-TESTNET"],
            count: 1,
            accountType: "EOA"
        });

        return {
            success: true,
            walletSet: walletSetResponse.data,
            wallet: walletResponse.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}


async function getWalletBalance(walletId) {
    try {
        const response = await client.getWalletTokenBalance({
            id: walletId
        });

        const usdcBalance =
            response.data.tokenBalances
            .filter(
    item =>
        item.token.tokenAddress ===
        "0x3600000000000000000000000000000000000000"
)
            .reduce(
                (total, item) => total + Number(item.amount),
                0
            );

        return {
            success: true,
            asset: "USDC",
            balance: usdcBalance
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

const { v4: uuidv4 } = require("uuid");

async function transferUSDC(
    walletId,
    destinationAddress,
    amount,
    tokenId
) {
    try {

      const payload = {

    walletId,

    tokenAddress: "0x3600000000000000000000000000000000000000",

    blockchain: "ARC-TESTNET",

    destinationAddress,

    amounts: [Number(amount).toFixed(2)],

   fee: {
    config: {
        feeLevel: "MEDIUM"
    }
},

    idempotencyKey: uuidv4()

};

console.log("Circle Payload:", payload);

const response = await client.createTransaction(payload);

        return {
            success: true,
            transaction: response.data
        };

    } catch (error) {

        return {
            success: false,
            message: error.message,
            error
        };

    }
}

async function getTransactionStatus(transactionId) {
    const response = await client.getTransaction({
        id: transactionId
    });

    return {
        success: true,
        transaction: response.data
    };
}

module.exports = {
    createTreasuryWallet,
    getWalletBalance,
    transferUSDC,
    getTransactionStatus
};

