const prisma = require("../lib/prisma");


async function createEscrow(missionId, organizationId, vendor, amount) {

    const escrow = await prisma.escrow.create({
        data: {
            missionId,
            organizationId,
            vendor,
            amount,
            status: "LOCKED"
        }
    });

    return escrow;
}


async function releaseEscrow(missionId) {

    const escrow = await prisma.escrow.update({
        where: {
            missionId
        },
        data: {
            status: "RELEASED",
            releasedAt: new Date()
        }
    });

    return escrow;
}


async function getEscrow(missionId) {

    return await prisma.escrow.findUnique({
        where: {
            missionId
        }
    });

}


module.exports = {
    createEscrow,
    releaseEscrow,
    getEscrow
};
