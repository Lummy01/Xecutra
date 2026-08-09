const deliveryService = require("./deliveryService");
const escrowService = require("./escrowService");
const treasuryService = require("./treasuryService");
const vendorService = require("./vendorService");
const circleService = require("./circleService");
const transactionService = require("./transactionService");

async function releasePayment(missionId) {

    const delivery = await deliveryService.getDelivery(missionId);
    const escrow = await escrowService.getEscrow(missionId);

    if (!delivery) {
        return {
            success: false,
            message: "Delivery has not been confirmed."
        };
    }

    if (!escrow) {
        return {
            success: false,
            message: "No escrow found."
        };
    }

    const vendor = await vendorService.getVendorByName(
        escrow.vendor
    );

    const treasury = await treasuryService.getTreasuryBalance(
        escrow.organizationId
    );

    if (treasury.balance < escrow.amount) {
    return {
        success: false,
        message: "Insufficient treasury balance."
    };
}

    const transfer = await circleService.transferUSDC(
        treasury.walletId,
        vendor.walletAddress,
        escrow.amount,
        "b6c3e8c9-7d41-586b-82a3-7293682d7cb6"
    );

    console.log("TRANSFER RESULT:", transfer);

    if (!transfer.success) {
        return transfer;
    }

    const releasedEscrow = await escrowService.releaseEscrow(missionId);

    await treasuryService.deductFunds(
        releasedEscrow.organizationId,
        releasedEscrow.amount
    );

    await transactionService.createTransaction({
    organizationId: releasedEscrow.organizationId,
    missionId: missionId,
    vendor: releasedEscrow.vendor,
    amount: releasedEscrow.amount,
    circleTxId: transfer.transaction.id,
    status: transfer.transaction.state
});

const latestTransaction =
  await circleService.getTransactionStatus(
    transfer.transaction.id
  );

console.log(
  "Latest Transaction:",
  JSON.stringify(latestTransaction, null, 2)
);

console.log(
  "Circle State:",
  latestTransaction.transaction.transaction.state
);

if (latestTransaction.success) {
  await transactionService.updateTransactionStatus(
    transfer.transaction.id,
    latestTransaction.transaction.transaction.state,
    latestTransaction.transaction.transaction.txHash
  );
}

    return {
        success: true,
        message: "Payment released successfully!",
        circleTransaction: transfer.transaction,
        escrow: releasedEscrow
    };
}
module.exports = {
    releasePayment
};
