const missionService = require("../services/missionService");
const aiPlanner = require("../services/aiPlanner");
const escrowService = require("../services/escrowService");
const circleService = require("../services/circleService");
const transactionService = require("../services/transactionService");

async function createMission(req, res) {
    try {
        const mission = await missionService.createMission(req.body);

        const plan = await aiPlanner.planMission(mission);
        await missionService.updateMissionDecision(
    mission.id,
    plan
);

        let escrow = null;

        if (plan.approved) {
    escrow = await escrowService.createEscrow(
    mission.id,
    mission.organizationId,
    plan.selectedVendor,
    plan.price
);
}

        res.status(201).json({
            message: "Mission created successfully!",
            mission,
            plan,
            escrow
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

async function getMissions(req, res) {
    try {
        const missions = await missionService.getMissions(
            req.params.organizationId
        );

        res.json(missions);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

async function getTransactionStatus(req, res) {
    try {
        const result = await circleService.getTransactionStatus(
            req.params.transactionId
        );

        if (result.success) {
            await transactionService.updateTransactionStatus(
                req.params.transactionId,
                result.transaction.transaction.state,
                result.transaction.transaction.txHash
            );
        }

        res.json(result);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

async function completeMission(req, res) {
    try {
        const mission = await missionService.completeMission(
            req.params.id
        );

        res.json({
            success: true,
            mission
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createMission,
    getMissions,
    getTransactionStatus,
    completeMission
};
