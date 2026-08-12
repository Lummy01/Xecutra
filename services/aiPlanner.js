const guardrailEngine = require("./guardrailEngine");
const guardrailService = require("./guardrailService");
const treasuryService = require("./treasuryService");

async function planMission(mission) {

    const vendors = [
      {
        name: "Vendor Alpha",
        price: mission.estimatedCost * 0.95,
        deliveryDays: 6,
        confidence: 91
      },
      {
        name: "Vendor Nexus",
        price: mission.estimatedCost,
        deliveryDays: 4,
        confidence: 96
      },
      {
        name: "Vendor Orion",
        price: mission.estimatedCost * 1.05,
        deliveryDays: 2,
        confidence: 98
      },
      {
        name: "Vendor Quantum",
        price: mission.estimatedCost * 0.90,
        deliveryDays: 7,
        confidence: 88
      }
    ];

    // Minimum 90% confidence required for autonomous vendor selection
    const eligibleVendors = vendors.filter(
      (vendor) => vendor.confidence >= 90
    );

    const selectedVendor =
      eligibleVendors.length > 0
        ? eligibleVendors.reduce((best, vendor) =>
            vendor.confidence > best.confidence
              ? vendor
              : best
          )
        : null;

    if (!selectedVendor) {
      const vendorSummary = vendors
        .map((v) => `${v.name} (${v.confidence}%)`)
        .join(", ");

      return {
        approved: false,
        reason: `No vendor met the minimum autonomous confidence threshold of 90%. Vendors considered: ${vendorSummary}.`,

        selectedVendor: null,
        price: null,
        deliveryDays: null,
        confidence: 0,

        treasuryBalance: null,
        guardrails: null
      };
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

    const detailedReason = `${selectedVendor.name} selected with ${selectedVendor.confidence}% confidence, delivering in ${selectedVendor.deliveryDays} day(s). ${decision.reason}`;

    return {
        approved: decision.approved,
        reason: detailedReason,

        selectedVendor: selectedVendor.name,
        price: selectedVendor.price,
        deliveryDays: selectedVendor.deliveryDays,
        confidence: selectedVendor.confidence,

        treasuryBalance: treasury.balance,
        guardrails
    };
}

module.exports = {
    planMission
};