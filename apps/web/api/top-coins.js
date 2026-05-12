const CMC_API_KEY = process.env.CMC_API_KEY || '';
const DEBUG_API_ERRORS = process.env.DEBUG_API_ERRORS === '1';
const DEFAULT_SYMBOLS = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'];
const COIN_META = {
  BTC: { icon: '₿', color: '#f7931a' },
  ETH: { icon: '◆', color: '#627eea' },
  SOL: { icon: '◉', color: '#14f195' },
  BNB: { icon: '⬢', color: '#f3ba2f' },
  XRP: { icon: '✕', color: '#23292f' },
};

function buildCmcUrl() {
  const params = new URLSearchParams({
    symbol: DEFAULT_SYMBOLS.join(','),
    convert: 'USD',
  });
  return `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?${params.toString()}`;
}

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

function publicError(message, error) {
  const payload = {
    updatedAt: new Date().toISOString(),
    coins: [],
    error: message,
  };

  if (DEBUG_API_ERRORS) {
    payload.detail = error instanceof Error ? error.message : 'unknown_error';
  }

  return payload;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=59');

  try {
    if (!CMC_API_KEY) {
      throw new Error('CMC_API_KEY is not configured');
    }

    const response = await fetch(buildCmcUrl(), {
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
      const quote = coin?.quote?.USD || {};
      const meta = COIN_META[symbol] || { icon: '•', color: '#fafafa' };
      return {
        rank: coin?.cmc_rank,
        name: coin?.name || symbol,
        symbol,
        icon: meta.icon,
        color: meta.color,
        price: quote.price,
        priceFormatted: formatPrice(quote.price),
        change24h: quote.percent_change_24h,
        change24hFormatted: formatPercent(quote.percent_change_24h),
        marketCap: quote.market_cap,
      };
    }).filter((coin) => coin.price != null);

    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      coins,
    });
  } catch (error) {
    return res.status(200).json(publicError('Không thể tải giá coin lúc này.', error));
  }
}
