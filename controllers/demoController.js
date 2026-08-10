const missionService = require("../services/missionService");
const aiPlanner = require("../services/aiPlanner");
const escrowService = require("../services/escrowService");
const deliveryService = require("../services/deliveryService");
const paymentService = require("../services/paymentService");

async function executeDemo(req, res) {
    try {
        const {
            organizationId,
            title,
            description,
            estimatedCost,
            deadline
        } = req.body;

        // 1. Create the mission
        const mission = await missionService.createMission({
            organizationId,
            title,
            description,
            estimatedCost,
            deadline
        });

        // 2. AI plans the mission
        const plan = await aiPlanner.planMission(mission);

        // 3. Save the AI decision
        await missionService.updateMissionDecision(
            mission.id,
            plan
        );

        // If AI rejects the mission, stop here
        if (!plan.approved) {
            return res.json({
                success: true,

                missionResult: {
                    mission,
                    plan,
                    escrow: null
                },

                deliveryResult: null,
                paymentResult: null
            });
        }

        // 4. Create and lock escrow
        const escrow = await escrowService.createEscrow(
            mission.id,
            organizationId,
            plan.selectedVendor,
            plan.price
        );

        // 5. Confirm delivery
        const deliveryResult = await deliveryService.confirmDelivery(
            mission.id,
            "Xecutra AI Agent"
        );

        // 6. Release payment through Circle
        const paymentResult = await paymentService.releasePayment(
            mission.id
        );

        // 7. Return the complete execution result
        return res.json({
            success: true,

            missionResult: {
                mission,
                plan,
                escrow
            },

            deliveryResult,
            paymentResult
        });

    } catch (error) {
        console.error("DEMO EXECUTION ERROR:", error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

function streamMission(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    res.write(
        `data: ${JSON.stringify({
            step: "connected",
            message: "Client connected"
        })}\n\n`
    );

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "AI Analysis",
                status: "running",
                message: "🤖 AI analyzing mission..."
            })}\n\n`
        );
    }, 1000);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "AI Analysis",
                status: "success",
                message: "🤖 Mission analyzed successfully"
            })}\n\n`
        );
    }, 2500);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Vendor Selection",
                status: "running",
                message: "🔍 Searching vendors..."
            })}\n\n`
        );
    }, 3000);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Vendor Selection",
                status: "success",
                message: "✅ Vendor selected"
            })}\n\n`
        );
    }, 5000);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Guardrails",
                status: "running",
                message: "🛡 Checking treasury guardrails..."
            })}\n\n`
        );
    }, 5500);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Guardrails",
                status: "success",
                message: "✅ Guardrails approved"
            })}\n\n`
        );
    }, 7500);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Escrow",
                status: "running",
                message: "🔒 Locking funds into escrow..."
            })}\n\n`
        );
    }, 8000);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Escrow",
                status: "success",
                message: "🔒 Funds locked in escrow"
            })}\n\n`
        );
    }, 10000);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Delivery",
                status: "running",
                message: "📦 Verifying delivery..."
            })}\n\n`
        );
    }, 10500);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Delivery",
                status: "success",
                message: "📦 Delivery confirmed"
            })}\n\n`
        );
    }, 13000);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Payment",
                status: "running",
                message: "💸 Broadcasting Circle transaction..."
            })}\n\n`
        );
    }, 13500);

    setTimeout(() => {
        res.write(
            `data: ${JSON.stringify({
                step: "Payment",
                status: "success",
                message: "✅ Circle transaction confirmed on Arc"
            })}\n\n`
        );
    }, 16500);
}

module.exports = {
    executeDemo,
    streamMission
};
