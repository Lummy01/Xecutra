const deliveryService = require("../services/deliveryService");

async function confirmDelivery(req, res) {
    try {
        const delivery = await deliveryService.confirmDelivery(
            req.body.missionId,
            req.body.confirmedBy
        );

        res.status(201).json({
            message: "Delivery confirmed successfully!",
            delivery
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

async function getDelivery(req, res) {
    try {
        const delivery = await deliveryService.getDelivery(
            req.params.missionId
        );

        res.json(delivery);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    confirmDelivery,
    getDelivery
};