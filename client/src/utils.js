export const formatBalance = (rawBalance) => {
    const balance = (parseInt(rawBalance) / 100000000000000000).toFixed(2);
    return balance;
};