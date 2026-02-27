const VENDOR_SEARCH_STRATEGY = {
  KEYWORD: 'keyword',
  AI_SEMANTIC: 'ai-semantic',
};

const FIELD_WEIGHTS = {
  name: 8,
  specialty: 6,
  specialtyFull: 5,
  category: 5,
  location: 4,
  description: 3,
  tier: 2,
  startFrom: 1,
};

const normalizeText = (value) => String(value || '').toLowerCase().trim();

const tokenizeQuery = (query) => {
  return normalizeText(query)
    .split(/\s+/)
    .filter(Boolean);
};

const indexVendorText = (vendor = {}) => {
  return {
    name: normalizeText(vendor.name),
    specialty: normalizeText(vendor.specialty),
    specialtyFull: normalizeText(vendor.specialtyFull),
    category: normalizeText(vendor.category),
    location: normalizeText(vendor.location),
    description: normalizeText(vendor.description),
    tier: normalizeText(vendor.tier),
    startFrom: normalizeText(vendor.startFrom),
  };
};

const scoreVendorKeywordMatch = (vendorTextIndex, queryTokens) => {
  const aggregateText = Object.values(vendorTextIndex).join(' ');
  let score = 0;
  let matchedTokens = 0;

  queryTokens.forEach((token) => {
    if (!aggregateText.includes(token)) {
      return;
    }

    matchedTokens += 1;

    Object.entries(vendorTextIndex).forEach(([fieldKey, value]) => {
      if (!value.includes(token)) {
        return;
      }

      score += FIELD_WEIGHTS[fieldKey] || 1;

      if (value.startsWith(token)) {
        score += 0.5;
      }
    });
  });

  return {
    score,
    matchedTokens,
  };
};

const keywordSearch = (vendors, query) => {
  const queryTokens = tokenizeQuery(query);

  if (queryTokens.length === 0) {
    return vendors;
  }

  return vendors
    .map((vendor) => {
      const vendorTextIndex = indexVendorText(vendor);
      const { score, matchedTokens } = scoreVendorKeywordMatch(
        vendorTextIndex,
        queryTokens,
      );

      return {
        vendor,
        score,
        matchedTokens,
      };
    })
    .filter(({ matchedTokens }) => matchedTokens > 0)
    .sort((a, b) => {
      if (b.matchedTokens !== a.matchedTokens) {
        return b.matchedTokens - a.matchedTokens;
      }

      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return String(a.vendor.name || '').localeCompare(String(b.vendor.name || ''));
    })
    .map(({ vendor }) => vendor);
};

export const searchVendors = ({
  vendors = [],
  query = '',
  strategy = VENDOR_SEARCH_STRATEGY.KEYWORD,
  aiSearchResolver,
}) => {
  if (strategy === VENDOR_SEARCH_STRATEGY.AI_SEMANTIC && typeof aiSearchResolver === 'function') {
    return aiSearchResolver({
      vendors,
      query: normalizeText(query),
    });
  }

  return keywordSearch(vendors, query);
};

export { VENDOR_SEARCH_STRATEGY };
