let transactions = [];

export async function saveTransaction(tx) {
  const transaction = {
    id: transactions.length + 1,
    merchantId: tx.merchantId,
    amount: tx.amount,
    status: tx.status,
    bankTransactionId: tx.bankTransactionId,
    date: new Date()
  };
  transactions.push(transaction);
  return transaction;
}

export async function getTransactionsByMerchant(merchantId) {
  return transactions.filter(tx => tx.merchantId === merchantId);
}
