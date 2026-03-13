export const ADMIN_PROJECT_CATEGORY_VALUES = [
  'legal-apps',
  'cloud-migration',
  'enterprise-it',
  'app-bug-fixes',
];

export const VENDOR_RATING_SOURCE_LIMIT = 2;

export const filterAdminProjectCategories = (categories = []) =>
  ADMIN_PROJECT_CATEGORY_VALUES.flatMap((allowedValue) =>
    categories.filter((category) => category?.value === allowedValue),
  );

export const normalizeSearchValue = (value) => String(value || '').toLowerCase().trim();

export const getInitials = (value) => {
  const words = String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return 'NA';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
};

export const buildEmptyVendorRatingSource = () => ({
  sourceName: '',
  rating: '',
  reviewCount: '',
  sourceUrl: '',
});

const buildVendorRatingSources = (ratingSources = []) => {
  const normalizedSources = Array.isArray(ratingSources)
    ? ratingSources.slice(0, VENDOR_RATING_SOURCE_LIMIT).map((ratingSource) => ({
        sourceName: ratingSource?.sourceName || '',
        rating:
          ratingSource?.rating === null || ratingSource?.rating === undefined
            ? ''
            : String(ratingSource.rating),
        reviewCount:
          ratingSource?.reviewCount === null || ratingSource?.reviewCount === undefined
            ? ''
            : String(ratingSource.reviewCount),
        sourceUrl: ratingSource?.sourceUrl || '',
      }))
    : [];

  while (normalizedSources.length < VENDOR_RATING_SOURCE_LIMIT) {
    normalizedSources.push(buildEmptyVendorRatingSource());
  }

  return normalizedSources;
};

export const buildEmptyVendorForm = () => ({
  brandName: '',
  websiteUrl: '',
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  status: 'Prospect',
  projectCategoryIds: [],
  vendorType: '',
  hqCountry: 'USA',
  hqState: '',
  listingTier: '',
  listingDescription: '',
  listingSpecialty: '',
  serviceDomains: '',
  platformsExperience: '',
  legalTechStack: '',
  legalFocusLevel: 'Some',
  referenceAvailable: 'Unk',
  legalReferencesAvailable: 'Unk',
  hasSoc2: 'Unk',
  hasIso27001: 'Unk',
  leadTimeWeeks: '',
  minProjectSizeUsd: '',
  maxProjectSizeUsd: '',
  isMicrosoftPartner: false,
  isServicenowPartner: false,
  isWorkdayPartner: false,
  ratingSources: buildVendorRatingSources(),
});

export const buildEmptyClientForm = () => ({
  clientName: '',
  projectCategoryId: '',
  clientWebsiteUrl: '',
  sourceName: '',
  sourceUrl: '',
});

export const hydrateClientForm = (client) => ({
  clientName: client?.clientName || '',
  projectCategoryId:
    client?.projectCategoryId === null || client?.projectCategoryId === undefined
      ? ''
      : String(client.projectCategoryId),
  clientWebsiteUrl: client?.clientWebsiteUrl || '',
  sourceName: client?.sourceName || '',
  sourceUrl: client?.sourceUrl || '',
});

export const validateClientForm = (form) => {
  const errors = {};

  if (!String(form.clientName || '').trim()) {
    errors.clientName = 'Client name is required.';
  }

  return errors;
};

export const serializeClientPayload = (form) => ({
  clientName: String(form.clientName || '').trim(),
  projectCategoryId: form.projectCategoryId ? Number(form.projectCategoryId) : null,
  clientWebsiteUrl: toNullableString(form.clientWebsiteUrl),
  sourceName: toNullableString(form.sourceName),
  sourceUrl: toNullableString(form.sourceUrl),
});

export const buildEmptyCaseStudyForm = () => ({
  title: '',
  summary: '',
  projectCategoryId: '',
  studyUrl: '',
  sourceName: '',
  sourceUrl: '',
});

export const hydrateCaseStudyForm = (caseStudy) => ({
  title: caseStudy?.title || '',
  summary: caseStudy?.summary || '',
  projectCategoryId:
    caseStudy?.projectCategoryId === null || caseStudy?.projectCategoryId === undefined
      ? ''
      : String(caseStudy.projectCategoryId),
  studyUrl: caseStudy?.studyUrl || '',
  sourceName: caseStudy?.sourceName || '',
  sourceUrl: caseStudy?.sourceUrl || '',
});

export const validateCaseStudyForm = (form) => {
  const errors = {};

  if (!String(form.title || '').trim()) {
    errors.title = 'Title is required.';
  }

  if (!String(form.summary || '').trim()) {
    errors.summary = 'Summary is required.';
  }

  return errors;
};

export const serializeCaseStudyPayload = (form) => ({
  title: String(form.title || '').trim(),
  summary: String(form.summary || '').trim(),
  projectCategoryId: form.projectCategoryId ? Number(form.projectCategoryId) : null,
  studyUrl: toNullableString(form.studyUrl),
  sourceName: toNullableString(form.sourceName),
  sourceUrl: toNullableString(form.sourceUrl),
});

export const hydrateVendorForm = (vendor) => ({
  brandName: vendor?.brandName || '',
  websiteUrl: vendor?.websiteUrl || '',
  lastVerifiedDate: vendor?.lastVerifiedDate || new Date().toISOString().slice(0, 10),
  status: vendor?.status || 'Prospect',
  projectCategoryIds: Array.isArray(vendor?.projectCategoryIds) ? vendor.projectCategoryIds : [],
  vendorType: vendor?.vendorType || '',
  hqCountry: vendor?.hqCountry || 'USA',
  hqState: vendor?.hqState || '',
  listingTier: vendor?.listingTier || '',
  listingDescription: vendor?.listingDescription || '',
  listingSpecialty: vendor?.listingSpecialty || '',
  serviceDomains: vendor?.serviceDomains || '',
  platformsExperience: vendor?.platformsExperience || '',
  legalTechStack: vendor?.legalTechStack || '',
  legalFocusLevel: vendor?.legalFocusLevel || 'Some',
  referenceAvailable: vendor?.referenceAvailable || 'Unk',
  legalReferencesAvailable: vendor?.legalReferencesAvailable || 'Unk',
  hasSoc2: vendor?.hasSoc2 || 'Unk',
  hasIso27001: vendor?.hasIso27001 || 'Unk',
  leadTimeWeeks: vendor?.leadTimeWeeks ?? '',
  minProjectSizeUsd: vendor?.minProjectSizeUsd ?? '',
  maxProjectSizeUsd: vendor?.maxProjectSizeUsd ?? '',
  isMicrosoftPartner: Boolean(vendor?.isMicrosoftPartner),
  isServicenowPartner: Boolean(vendor?.isServicenowPartner),
  isWorkdayPartner: Boolean(vendor?.isWorkdayPartner),
  ratingSources: buildVendorRatingSources(vendor?.ratingSources),
});

export const validateVendorForm = (form) => {
  const errors = {};

  if (!String(form.brandName || '').trim()) {
    errors.brandName = 'Brand name is required.';
  }

  if (!String(form.websiteUrl || '').trim()) {
    errors.websiteUrl = 'Website URL is required.';
  }

  if (!String(form.lastVerifiedDate || '').trim()) {
    errors.lastVerifiedDate = 'Last verified date is required.';
  }

  if (!Array.isArray(form.projectCategoryIds) || form.projectCategoryIds.length === 0) {
    errors.projectCategoryIds = 'Select at least one project category.';
  }

  const ratingSourceErrors = [];
  const normalizedRatingSources = Array.isArray(form.ratingSources) ? form.ratingSources : [];

  normalizedRatingSources.forEach((ratingSource, index) => {
    const sourceName = String(ratingSource?.sourceName || '').trim();
    const rating = String(ratingSource?.rating || '').trim();
    const reviewCount = String(ratingSource?.reviewCount || '').trim();
    const sourceUrl = String(ratingSource?.sourceUrl || '').trim();
    const hasAnyValue = Boolean(sourceName || rating || reviewCount || sourceUrl);

    if (!hasAnyValue) {
      return;
    }

    const nextRowErrors = {};
    const numericRating = Number(rating);
    const numericReviewCount = Number(reviewCount);

    if (!sourceName) {
      nextRowErrors.sourceName = 'Source name is required.';
    }

    if (!rating) {
      nextRowErrors.rating = 'Rating is required.';
    } else if (!Number.isFinite(numericRating) || numericRating <= 0 || numericRating > 5) {
      nextRowErrors.rating = 'Rating must be between 0.1 and 5.';
    }

    if (reviewCount && (!Number.isInteger(numericReviewCount) || numericReviewCount < 0)) {
      nextRowErrors.reviewCount = 'Review count must be a whole number.';
    }

    if (!sourceUrl) {
      nextRowErrors.sourceUrl = 'Source URL is required.';
    }

    if (Object.keys(nextRowErrors).length > 0) {
      ratingSourceErrors[index] = nextRowErrors;
    }
  });

  if (ratingSourceErrors.length > 0) {
    errors.ratingSources = ratingSourceErrors;
  }

  return errors;
};

export const toNullableString = (value) => {
  const normalizedValue = String(value || '').trim();
  return normalizedValue ? normalizedValue : null;
};

export const toNullableInteger = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? Math.trunc(parsedValue) : null;
};

export const serializeVendorPayload = (form) => ({
  brandName: String(form.brandName || '').trim(),
  websiteUrl: String(form.websiteUrl || '').trim(),
  lastVerifiedDate: String(form.lastVerifiedDate || '').trim(),
  status: form.status,
  projectCategoryIds: Array.from(
    new Set((Array.isArray(form.projectCategoryIds) ? form.projectCategoryIds : []).map(Number)),
  ).filter((value) => Number.isInteger(value) && value > 0),
  vendorType: toNullableString(form.vendorType),
  hqCountry: toNullableString(form.hqCountry),
  hqState: toNullableString(form.hqState),
  listingTier: toNullableString(form.listingTier),
  listingDescription: toNullableString(form.listingDescription),
  listingSpecialty: toNullableString(form.listingSpecialty),
  serviceDomains: toNullableString(form.serviceDomains),
  platformsExperience: toNullableString(form.platformsExperience),
  legalTechStack: toNullableString(form.legalTechStack),
  legalFocusLevel: form.legalFocusLevel,
  referenceAvailable: form.referenceAvailable,
  legalReferencesAvailable: form.legalReferencesAvailable,
  hasSoc2: form.hasSoc2,
  hasIso27001: form.hasIso27001,
  leadTimeWeeks: toNullableInteger(form.leadTimeWeeks),
  minProjectSizeUsd: toNullableInteger(form.minProjectSizeUsd),
  maxProjectSizeUsd: toNullableInteger(form.maxProjectSizeUsd),
  isMicrosoftPartner: Boolean(form.isMicrosoftPartner),
  isServicenowPartner: Boolean(form.isServicenowPartner),
  isWorkdayPartner: Boolean(form.isWorkdayPartner),
  ratingSources: (Array.isArray(form.ratingSources) ? form.ratingSources : [])
    .map((ratingSource) => ({
      sourceName: String(ratingSource?.sourceName || '').trim(),
      rating:
        ratingSource?.rating === null || ratingSource?.rating === undefined || ratingSource?.rating === ''
          ? null
          : Number(ratingSource.rating),
      reviewCount: toNullableInteger(ratingSource?.reviewCount),
      sourceUrl: toNullableString(ratingSource?.sourceUrl),
    }))
    .filter((ratingSource) => ratingSource.sourceName || ratingSource.rating || ratingSource.sourceUrl),
});

export const formatCategorySummary = (options, selectedValues) => {
  const selectedOptions = options.filter((option) => selectedValues.includes(option.id));

  if (!selectedOptions.length) {
    return 'Select project categories';
  }

  if (selectedOptions.length <= 2) {
    return selectedOptions.map((option) => option.label).join(', ');
  }

  return `${selectedOptions[0].label}, ${selectedOptions[1].label} +${selectedOptions.length - 2}`;
};
