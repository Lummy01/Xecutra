const guardrailService = require("../services/guardrailService");

async function setGuardrails(req, res) {
    try {
        const guardrails = await guardrailService.setGuardrails(req.body);

        res.status(201).json({
            message: "Guardrails configured successfully!",
            guardrails
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

async function getGuardrails(req, res) {
    try {
        const guardrails = await guardrailService.getGuardrails(
            req.params.organizationId
        );

        res.json(guardrails);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    setGuardrails,
    getGuardrails
};