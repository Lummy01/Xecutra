function validatePurchase(cost, guardrails, treasuryBalance) {

    // Rule 1: Maximum spend per vendor
    if (cost > guardrails.maxVendorSpend) {
        return {
            approved: false,
            reason: "Mission exceeds maximum vendor spend."
        };
    }

    // Rule 2: Maintain treasury reserve
    const remaining = treasuryBalance - cost;

    const minimumRequired =
        treasuryBalance * (guardrails.minimumReserve / 100);

    if (remaining < minimumRequired) {
        return {
            approved: false,
            reason: "Mission would reduce the treasury below the minimum reserve."
        };
    }

    return {
        approved: true,
        reason: "Mission satisfies all guardrails."
    };
}

module.exports = {
    validatePurchase
};