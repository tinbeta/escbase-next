const CMC_API_KEY = process.env.CMC_API_KEY || '997a7d0976d842fcb2c3fd84f847f7ba';
const CMC_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5&convert=USD';

function formatPrice(price) {
  if (price == null) return 'N/A';
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
}

function formatPercent(value) {
  if (value == null) return '0.00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=59');

  try {
    const response = await fetch(CMC_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CMC request failed: ${response.status}`);
    }

    const payload = await response.json();
    const items = Array.isArray(payload?.data) ? payload.data : [];

    const coins = items.slice(0, 5).map((coin) => {
      const quote = coin?.quote?.USD || {};
      return {
        rank: coin.cmc_rank,
        name: coin.name,
        symbol: coin.symbol,
        price: quote.price,
        priceFormatted: formatPrice(quote.price),
        change24h: quote.percent_change_24h,
        change24hFormatted: formatPercent(quote.percent_change_24h),
        marketCap: quote.market_cap,
      };
    });

    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      coins,
    });
  } catch (error) {
    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      coins: [],
      error: 'Không thể tải giá coin lúc này.',
      detail: error instanceof Error ? error.message : 'unknown_error',
    });
  }
}
