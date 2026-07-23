const prisma = require("../lib/prisma");

async function createMission(data) {
    return await prisma.mission.create({
        data: {
            organizationId: data.organizationId,
            title: data.title,
            description: data.description,
            estimatedCost: data.estimatedCost,
            deadline: data.deadline
                ? new Date(data.deadline)
                : null
        }
    });
}


async function updateMissionDecision(id, plan) {
    return await prisma.mission.update({
        where: {
            id
        },
        data: {
            selectedVendor: plan.selectedVendor,
            approvedAmount: plan.price,
            aiReason: plan.reason,

            status: plan.approved
                ? "APPROVED"
                : "REJECTED"
        }
    });
}


async function getMissions(organizationId) {
    return await prisma.mission.findMany({
        where: {
            organizationId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}


module.exports = {
    createMission,
    updateMissionDecision,
    getMissions
};