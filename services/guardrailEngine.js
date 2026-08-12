function validatePurchase(cost, guardrails, treasuryBalance) {

    // Rule 1: Maximum spend per vendor
    if (cost > guardrails.maxVendorSpend) {
        return {
            approved: false,
            reason: `Requested amount of ${cost.toFixed(2)} USDC exceeds the maximum vendor spend limit of ${guardrails.maxVendorSpend.toFixed(2)} USDC.`
        };
    }

    // Rule 2: Maintain treasury reserve
    const remaining = treasuryBalance - cost;
    const minimumRequired = treasuryBalance * (guardrails.minimumReserve / 100);

    if (remaining < minimumRequired) {
        return {
            approved: false,
            reason: `Payment would leave ${remaining.toFixed(3)} USDC in treasury, below the required minimum reserve of ${minimumRequired.toFixed(2)} USDC (${guardrails.minimumReserve}% of balance).`
        };
    }

    return {
        approved: true,
        reason: `Cost of ${cost.toFixed(3)} USDC is within the ${guardrails.maxVendorSpend.toFixed(2)} USDC spend limit, and treasury reserve of ${guardrails.minimumReserve}% is maintained.`
    };
}

module.exports = {
    validatePurchase
};