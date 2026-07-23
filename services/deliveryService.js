const prisma = require("../lib/prisma");

async function confirmDelivery(
    missionId,
    confirmedBy
) {
    return await prisma.delivery.create({
        data: {
            missionId,
            confirmedBy,
            status: "CONFIRMED"
        }
    });
}

async function getDelivery(missionId) {
    return await prisma.delivery.findUnique({
        where: {
            missionId
        }
    });
}

module.exports = {
    confirmDelivery,
    getDelivery
};