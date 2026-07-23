const circleService = require("../services/circleService");

async function createWallet(req, res) {
    const organizationName = req.body.organization;

    const result = await circleService.createTreasuryWallet(organizationName);

    res.json(result);
}

module.exports = {
    createWallet
};