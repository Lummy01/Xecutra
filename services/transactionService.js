const prisma = require("../lib/prisma");

async function createTransaction(data) {
    return await prisma.transaction.create({
        data
    });
}

async function getTransactions() {
    return await prisma.transaction.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
}

async function updateTransactionStatus(
    circleTxId,
    status,
    txHash
) {
    return await prisma.transaction.update({
        where: {
            circleTxId
        },
        data: {
            status,
            txHash
        }
    });
}

module.exports = {
    createTransaction,
    getTransactions,
    updateTransactionStatus
};