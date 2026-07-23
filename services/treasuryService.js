const prisma = require("../lib/prisma");
const circleService = require("./circleService");

async function createTreasury(data) {
    const treasury = await prisma.treasury.create({
        data: {
            organization: data.organization,
            balance: data.balance,
            currency: data.currency,
        },
    });

    return treasury;
}

async function getTreasury() {
    return await prisma.treasury.findMany();
}

async function getTreasuryBalance(organizationId) {

    const treasury = await prisma.treasury.findUnique({
        where: {
            organizationId
        }
    });

    if (!treasury) {
        throw new Error("Treasury not found");
    }

    // Ask Circle for the REAL wallet balance
    const circleBalance = await circleService.getWalletBalance(
        treasury.walletId
    );
    
    return {
        organizationId: treasury.organizationId,
        walletAddress: treasury.walletAddress,
        walletId: treasury.walletId,
        currency: "USDC",

        // If Circle succeeds, use it.
        // Otherwise fall back to database balance.
        balance: circleBalance.success
            ? circleBalance.balance
            : treasury.balance
    };
}

async function deductFunds(organizationId, amount) {
    const treasury = await prisma.treasury.update({
        where: {
            organizationId: organizationId,
        },
        data: {
            balance: {
                decrement: amount,
            },
        },
    });

    return treasury;
}

module.exports = {
    createTreasury,
    getTreasury,
    deductFunds,
    getTreasuryBalance,
};