const treasuryService = require("../services/treasuryService");

async function createTreasury(req, res) {
    const treasury = await treasuryService.createTreasury(req.body);

    res.status(201).json({
        message: "Treasury created successfully!",
        treasury
    });
}

async function getTreasury(req, res) {
    const treasury = await treasuryService.getTreasury();

    res.json(treasury);
}

async function getTreasuryBalance(req, res) {
    try {
        const balance = await treasuryService.getTreasuryBalance(
            req.params.organizationId
        );

        res.json(balance);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    createTreasury,
    getTreasury,
    getTreasuryBalance
};