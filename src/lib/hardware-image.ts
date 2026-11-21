// Product image resolver for every hardware record: the one function the index
// cards, the detail-page hero and scripts/audit-hardware-images.mjs all call.
// No imports, so Node can load this file directly (type stripping) for the audit.

/** Toolhead rows name the brand "Brand / Designer"; give every record a plain Brand so cards, filters and search agree. */
export const withBrand = (records: any[]): any[] =>
  records.map((r) => (r?.Brand || !r?.['Brand / Designer'] ? r : { ...r, Brand: r['Brand / Designer'] }));

/** Airtable "Image URL": an on-site /media/hardware/... path or an external URL; '' when empty. */
export const imageOf = (r: any): string => {
  const v = r?.['Image URL'];
  return typeof v === 'string' ? v.trim() : '';
};
