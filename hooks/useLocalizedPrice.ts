import { useState, useEffect } from 'react';

let cachedCurrency: string | null = null;
let cachedRates: Record<string, number> | null = null;

export function useLocalizedPrice(usdPrice: number) {
  const [priceString, setPriceString] = useState(`$${usdPrice}`);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        if (!cachedCurrency) {
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            cachedCurrency = geoData.currency || 'USD';
          } else {
            cachedCurrency = 'USD';
          }
        }

        if (cachedCurrency === 'USD') {
          if (mounted) {
            setPriceString(`$${usdPrice}`);
            setIsLoading(false);
          }
          return;
        }

        if (!cachedRates) {
          const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
          if (rateRes.ok) {
            const rateData = await rateRes.json();
            cachedRates = rateData.rates;
          }
        }

        if (mounted && cachedRates && cachedCurrency) {
          const rate = cachedRates[cachedCurrency] || 1;
          const converted = usdPrice * rate;

          const formatted = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: cachedCurrency,
            maximumFractionDigits: 0,
          }).format(converted);

          setPriceString(formatted);
        }
      } catch (error) {
        console.error('Localization error:', error);
        if (mounted) setPriceString(`$${usdPrice}`);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    init();
    return () => { mounted = false; };
  }, [usdPrice]);

  return { priceString, isLoading };
}
