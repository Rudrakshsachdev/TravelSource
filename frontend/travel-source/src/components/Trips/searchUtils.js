/* ═══════════════════════════════════════════════════════════════
   Search Utilities — Travel Professor
   Pure functions for search, filter, sort logic
   ═══════════════════════════════════════════════════════════════ */

export const SEARCH_STOP_WORDS = new Set([
  "trip",
  "trips",
  "tour",
  "tours",
  "journey",
  "journeys",
  "package",
  "packages",
]);

export const SEARCH_SYNONYMS = {
  trek: ["trekking", "trekker", "hike", "hiking"],
  trekking: ["trek", "trekker", "hike", "hiking"],
  hike: ["hiking", "trek", "trekking"],
  hiking: ["hike", "trek", "trekking"],
  honeymoon: ["romantic", "romance", "couple", "newlywed"],
  romantic: ["honeymoon", "couple", "romance"],
  couple: ["honeymoon", "romantic", "romance"],
  festival: ["festive", "celebration"],
  festive: ["festival", "celebration"],
  backpacking: ["backpacking", "backpacker", "budget"],
  backpacker: ["backpacking", "budget"],
};

export const MONTH_ALIASES = {
  january: ["january", "jan"],
  february: ["february", "feb"],
  march: ["march", "mar"],
  april: ["april", "apr"],
  may: ["may"],
  june: ["june", "jun"],
  july: ["july", "jul"],
  august: ["august", "aug"],
  september: ["september", "sep", "sept"],
  october: ["october", "oct"],
  november: ["november", "nov"],
  december: ["december", "dec"],
};

export const normalizeSearchText = (value) =>
  (value || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getTokenVariants = (token) => {
  const variants = new Set([token]);

  if (token.endsWith("ing") && token.length > 5) {
    const root = token.slice(0, -3);
    variants.add(root);
    if (root.endsWith("kk")) {
      variants.add(root.slice(0, -1));
    }
    variants.add(`${root}e`);
  }

  if (token.endsWith("ed") && token.length > 4) {
    variants.add(token.slice(0, -2));
  }

  if (token.endsWith("er") && token.length > 4) {
    variants.add(token.slice(0, -2));
  }

  if (token.endsWith("s") && token.length > 3) {
    variants.add(token.slice(0, -1));
  }

  (SEARCH_SYNONYMS[token] || []).forEach((synonym) => variants.add(synonym));

  return Array.from(variants).filter(Boolean);
};

export const buildTripSearchBlob = (trip) => {
  const tags = [];

  if (trip.is_international || trip.show_in_international_section) {
    tags.push("international", "abroad", "global");
  }
  if (trip.is_india_trip || trip.show_in_india_section) {
    tags.push("india", "domestic", "indian");
  }
  if (trip.is_honeymoon || trip.show_in_honeymoon_section) {
    tags.push("honeymoon", "romantic", "couple");
  }
  if (trip.is_himalayan_trek || trip.show_in_himalayan_section) {
    tags.push("himalayan", "trek", "mountain");
  }
  if (trip.is_backpacking_trip || trip.show_in_backpacking_section) {
    tags.push("backpacking", "backpacker", "budget");
  }
  if (trip.is_summer_trek || trip.show_in_summer_section) {
    tags.push("summer", "summer trek");
  }
  if (trip.is_monsoon_trek || trip.show_in_monsoon_section) {
    tags.push("monsoon", "rain", "rainy");
  }
  if (trip.is_community_trip || trip.show_in_community_section) {
    tags.push("community", "group", "social");
  }
  if (trip.is_festival_trip || trip.show_in_festival_section) {
    tags.push("festival", "festive", "celebration");
  }
  if (trip.is_adventure_trip || trip.show_in_adventure_section) {
    tags.push("adventure", "thrilling", "action");
  }

  return normalizeSearchText(
    [
      trip.title,
      trip.location,
      trip.state,
      trip.country,
      trip.description,
      trip.short_description,
      trip.category?.name,
      trip.category?.slug,
      tags.join(" "),
    ]
      .filter(Boolean)
      .join(" "),
  );
};

export const tripMatchesType = (trip, typeFilter, searchBlob) => {
  switch (typeFilter) {
    case "international":
      return trip.is_international || trip.show_in_international_section;
    case "india":
      return trip.is_india_trip || trip.show_in_india_section;
    case "honeymoon":
      return trip.is_honeymoon || trip.show_in_honeymoon_section;
    case "himalayan":
      return trip.is_himalayan_trek || trip.show_in_himalayan_section;
    case "backpacking":
      return trip.is_backpacking_trip || trip.show_in_backpacking_section;
    case "summer":
      return trip.is_summer_trek || trip.show_in_summer_section;
    case "monsoon":
      return trip.is_monsoon_trek || trip.show_in_monsoon_section;
    case "community":
      return trip.is_community_trip || trip.show_in_community_section;
    case "festival":
      return trip.is_festival_trip || trip.show_in_festival_section;
    case "adventure":
      return trip.is_adventure_trip || trip.show_in_adventure_section;
    default:
      return searchBlob.includes(typeFilter);
  }
};
