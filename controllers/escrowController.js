const escrowService = require("../services/escrowService");

function createEscrow(req, res) {
    const { vendor, amount } = req.body;

    const escrow = escrowService.createEscrow(vendor, amount);

    res.status(201).json({
        message: "Escrow created successfully!",
        escrow
    });
}

function getEscrow(req, res) {
    const escrow = escrowService.getEscrow();

    res.json(escrow);
}

module.exports = {
    createEscrow,
    getEscrow
};