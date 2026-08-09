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
            confidence: plan.confidence,
            status: plan.approved
                ? "EXECUTING"
                : "Rejected"
        }
    });
}

async function getMissions(organizationId) {
    const missions = await prisma.mission.findMany({
        where: {
            organizationId,
            status: {
                in: ["Completed", "Rejected"]
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    console.log(
        "MISSIONS SENT:",
        missions.map(m => ({
            title: m.title,
            status: m.status
        }))
    );

    return missions;
}

async function completeMission(id) {
    return await prisma.mission.update({
        where: {
            id
        },
        data: {
            status: "Completed"
        }
    });
}

module.exports = {
    createMission,
    updateMissionDecision,
    getMissions,
    completeMission
};