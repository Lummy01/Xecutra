const guardrailEngine = require("./guardrailEngine");
const guardrailService = require("./guardrailService");
const treasuryService = require("./treasuryService");

async function planMission(mission) {

    const vendors = [
        {
            name: "Vendor A",
            price: mission.estimatedCost + 2,
            deliveryDays: 7
        },
        {
            name: "Vendor B",
            price: mission.estimatedCost,
            deliveryDays: 5
        }
    ];

    let selectedVendor = vendors[0];

    if (
        vendors[1].price <= vendors[0].price &&
        vendors[1].deliveryDays <= vendors[0].deliveryDays
    ) {
        selectedVendor = vendors[1];
    }

    const guardrails = await guardrailService.getGuardrails(
        mission.organizationId
    );

    const treasury = await treasuryService.getTreasuryBalance(
        mission.organizationId
    );

    const decision = guardrailEngine.validatePurchase(
        selectedVendor.price,
        guardrails,
        treasury.balance
    );

    return {
        approved: decision.approved,
        reason: decision.reason,

        selectedVendor: selectedVendor.name,
        price: selectedVendor.price,
        deliveryDays: selectedVendor.deliveryDays,

        treasuryBalance: treasury.balance,
        guardrails
    };
}

module.exports = {
    planMission
};
