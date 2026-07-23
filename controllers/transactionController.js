const transactionService = require("../services/transactionService");

async function getTransactions(req, res) {
    try {
        const transactions = await transactionService.getTransactions();

        res.json(transactions);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getTransactions
};