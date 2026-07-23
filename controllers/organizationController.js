const prisma = require("../lib/prisma");
const circleService = require("../services/circleService");

const createOrganization = async (req, res) => {
  try {
    const { name, email } = req.body;

    // 1. Create Circle treasury wallet
    const walletResult = await circleService.createTreasuryWallet(name);

    if (!walletResult.success) {
      return res.status(500).json({
        error: walletResult.message
      });
    }

    // 2. Extract wallet address
    const wallet = walletResult.wallet.wallets[0];

const walletId = wallet.id;
const walletAddress = wallet.address;


    // 3. Create organization + treasury
    const organization = await prisma.organization.create({
      data: {
        name,
        email,

        treasury: {
  create: {
    walletId,
    walletAddress,
    balance: 0,
    currency: "USDC"
  }
}
      },

      include: {
        treasury: true
      }
    });


    res.status(201).json({
      message: "Organization created successfully",
      organization
    });


  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create organization"
    });
  }
};


module.exports = {
  createOrganization
};