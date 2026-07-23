const paymentService = require("../services/paymentService");

async function releasePayment(req, res) {
    const result = await paymentService.releasePayment(
    req.body.missionId
);

    if (!result.success) {
        return res.status(400).json(result);
    }

    res.json(result);
}

module.exports = {
    releasePayment
};