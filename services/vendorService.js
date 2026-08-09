async function getVendorByName(name) {
  return {
    name,
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
  };
}

module.exports = {
  getVendorByName
};
