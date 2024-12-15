export const getAccountInfo = async () => {
  try {
    const accountInfo = await client.getAccountInfo();
    console.log("Account info:", accountInfo);
    return accountInfo;
  } catch (error) {
    console.error("Error fetching account info:", error.message);
    throw error;
  }
};
