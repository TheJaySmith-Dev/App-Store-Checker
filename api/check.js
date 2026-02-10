
/**
 * Vercel Serverless Function: Check Apple App Store country availability
 * Uses the official iTunes Lookup API which is more reliable than scraping web pages.
 */

const COUNTRIES = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "za", name: "South Africa" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "nl", name: "Netherlands" },
  { code: "se", name: "Sweden" },
  { code: "no", name: "Norway" },
  { code: "dk", name: "Denmark" },
  { code: "fi", name: "Finland" },
  { code: "ie", name: "Ireland" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "cn", name: "China Mainland" },
  { code: "hk", name: "Hong Kong" },
  { code: "tw", name: "Taiwan" },
  { code: "sg", name: "Singapore" },
  { code: "in", name: "India" },
  { code: "br", name: "Brazil" },
  { code: "mx", name: "Mexico" },
  { code: "ar", name: "Argentina" },
  { code: "ch", name: "Switzerland" },
  { code: "at", name: "Austria" },
  { code: "be", name: "Belgium" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portugal" },
  { code: "cz", name: "Czech Republic" },
  { code: "sk", name: "Slovakia" },
  { code: "hu", name: "Hungary" },
  { code: "ro", name: "Romania" },
  { code: "bg", name: "Bulgaria" },
  { code: "gr", name: "Greece" },
  { code: "tr", name: "Turkey" },
  { code: "ua", name: "Ukraine" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "eg", name: "Egypt" },
  { code: "ng", name: "Nigeria" },
  { code: "ke", name: "Kenya" },
  { code: "gh", name: "Ghana" },
  { code: "id", name: "Indonesia" },
  { code: "my", name: "Malaysia" },
  { code: "ph", name: "Philippines" },
  { code: "th", name: "Thailand" },
  { code: "vn", name: "Vietnam" },
  { code: "pk", name: "Pakistan" },
  { code: "cl", name: "Chile" },
  { code: "co", name: "Colombia" },
  { code: "pe", name: "Peru" },
  { code: "ve", name: "Venezuela" },
  { code: "nz", name: "New Zealand" },
  { code: "il", name: "Israel" },
  { code: "ru", name: "Russia" },
  { code: "lu", name: "Luxembourg" }
];

/**
 * Check a single country using the iTunes Search API
 */
async function checkCountry(appId, country) {
  try {
    // Official iTunes Lookup API is the way to go
    const url = `https://itunes.apple.com/lookup?id=${appId}&country=${country.code}&entity=software`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AppStoreAvailabilityChecker/1.0'
      }
    });

    if (!response.ok) return { country, available: false };

    const data = await response.json();
    // If resultCount > 0, the app is available in this country
    return { country, available: data.resultCount > 0 };
  } catch (error) {
    return { country, available: false };
  }
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'App ID is required' });
  }

  // To avoid hitting the 10s timeout on Vercel Hobby, 
  // we use concurrent requests in smaller batches.
  // We'll process in chunks of 10 to be efficient but safe.
  const available = [];
  const unavailable = [];
  const chunkSize = 15;
  
  for (let i = 0; i < COUNTRIES.length; i += chunkSize) {
    const chunk = COUNTRIES.slice(i, i + chunkSize);
    const results = await Promise.all(chunk.map(c => checkCountry(id, c)));
    
    for (const res of results) {
      if (res.available) {
        available.push(res.country);
      } else {
        unavailable.push(res.country);
      }
    }
    
    // Tiny delay between chunks to avoid rate limiting
    if (i + chunkSize < COUNTRIES.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  // Cache results for 24 hours
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  return res.status(200).json({
    available,
    unavailable
  });
}
