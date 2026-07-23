const prisma = require("../lib/prisma");

async function setGuardrails(data) {
    return await prisma.guardrail.upsert({
        where: {
            organizationId: data.organizationId
        },
        update: {
            maxVendorSpend: data.maxVendorSpend,
            minimumReserve: data.minimumReserve,
            escrowRequired: data.escrowRequired,
            approvedVendorsOnly: data.approvedVendorsOnly
        },
        create: {
            organizationId: data.organizationId,
            maxVendorSpend: data.maxVendorSpend,
            minimumReserve: data.minimumReserve,
            escrowRequired: data.escrowRequired,
            approvedVendorsOnly: data.approvedVendorsOnly
        }
    });
}

async function getGuardrails(organizationId) {
    return await prisma.guardrail.findUnique({
        where: {
            organizationId
        }
    });
}

module.exports = {
    setGuardrails,
    getGuardrails
};