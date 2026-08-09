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
    const transaction = await prisma.transaction.update({
        where: {
            circleTxId
        },
        data: {
            status,
            txHash
        }
    });

    if (
        status === "CONFIRMED" ||
        status === "COMPLETE"
    ) {
        await prisma.mission.update({
            where: {
                id: transaction.missionId
            },
            data: {
                status: "Completed"
            }
        });
    }

    return transaction;
}

module.exports = {
    createTransaction,
    getTransactions,
    updateTransactionStatus
};
