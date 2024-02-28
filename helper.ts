export function formatTokenBalance(token: any) {
  if (!token?.balance || !token?.decimals) {
    return '';
  }

  const divisor = 10n ** BigInt(token.decimals);
  const balance = token.balance / divisor;

  return balance.toString();
}