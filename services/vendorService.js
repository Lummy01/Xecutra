const prisma = require("../lib/prisma");

async function getVendorByName(name) {
    return await prisma.vendor.findUnique({
        where: {
            name
        }
    });
}

module.exports = {
    getVendorByName
};