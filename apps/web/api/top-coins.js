const CMC_API_KEY = process.env.CMC_API_KEY || '997a7d0976d842fcb2c3fd84f847f7ba';
const DEFAULT_SYMBOLS = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'];
const SUPPORTED_CONVERTS = new Set(['USD', 'VND']);

function buildCmcUrl(convert) {
  const params = new URLSearchParams({
    symbol: DEFAULT_SYMBOLS.join(','),
    convert,
  });
  return `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?${params.toString()}`;
}

function formatPrice(price, convert = 'USD') {
  if (price == null) return 'N/A';

  if (convert === 'VND') {
    const digits = price >= 1000 ? 0 : 2;
    return `${price.toLocaleString('vi-VN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}₫`;
  }

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
  const requestedConvert = String(req.query.convert || 'USD').toUpperCase();
  const convert = SUPPORTED_CONVERTS.has(requestedConvert) ? requestedConvert : 'USD';

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=59');

  try {
    const response = await fetch(buildCmcUrl(convert), {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CMC request failed: ${response.status}`);
    }

    const payload = await response.json();
    const items = payload?.data || {};

    const coins = DEFAULT_SYMBOLS.map((symbol) => {
      const coin = Array.isArray(items?.[symbol]) ? items[symbol][0] : undefined;
      const quote = coin?.quote?.[convert] || {};
      return {
        rank: coin?.cmc_rank,
        name: coin?.name || symbol,
        symbol,
        price: quote.price,
        priceFormatted: formatPrice(quote.price, convert),
        change24h: quote.percent_change_24h,
        change24hFormatted: formatPercent(quote.percent_change_24h),
        marketCap: quote.market_cap,
      };
    }).filter((coin) => coin.price != null);

    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      convert,
      coins,
    });
  } catch (error) {
    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      convert,
      coins: [],
      error: 'Không thể tải giá coin lúc này.',
      detail: error instanceof Error ? error.message : 'unknown_error',
    });
  }
}
