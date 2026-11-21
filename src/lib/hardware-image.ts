// Product image resolver for every hardware record: the one function the index
// cards, the detail-page hero and scripts/audit-hardware-images.mjs all call.
// No imports, so Node can load this file directly (type stripping) for the audit.

/** Toolhead rows name the brand "Brand / Designer"; give every record a plain Brand so cards, filters and search agree. */
export const withBrand = (records: any[]): any[] =>
  records.map((r) => (r?.Brand || !r?.['Brand / Designer'] ? r : { ...r, Brand: r['Brand / Designer'] }));

/**
 * External Airtable "Image URL" values that now live on this site (webp under public/media/hardware/).
 * Keyed by the old URL so a nightly sync that still carries it can't undo the move. '' = the source is
 * gone (404), so the record shows its placeholder cover instead of a broken request. Once Airtable
 * holds the local path, the entry here is dead weight and can go.
 */
const LOCAL_IMAGE: Record<string, string> = {
  'https://github.com/JaredC01/Galileo2/raw/main/images/g2extruder.png': '/media/hardware/extruders/g2-ww-anthead.webp',
  'https://ae01.alicdn.com/kf/S079994f7be2a4d299778bf155f6f0919s.jpg': '/media/hardware/extruders/vz-hextrudort-low.webp',
  'https://www.3dlabtech.ca/wp-content/uploads/2021/10/LDO-Galileo-2-Extruder-e1704850852804.jpg': '/media/hardware/extruders/galileo-2-standalone.webp',
  'https://advanced3dprinting.com/cdn/shop/files/fxd1.1.jpg': '/media/hardware/extruders/fxd-v1-1.webp',
  'https://ueeshop.ly200-cdn.com/u_file/UPBE/UPBE311/2605/15/products/800-2.jpg': '/media/hardware/mainboards/fly-c8-pro-v1-0.webp',
  'https://ueeshop.ly200-cdn.com/u_file/UPBE/UPBE311/2604/30/products/e6636bbec2.jpg': '/media/hardware/toolboards/sht36-v3.webp',
  'https://west3d.com/cdn/shop/files/jabberwocky-complete-toolhead-with-filament-cutter-and-extruder-for-3d-printers-and-multi-filament-setups-west3d-3d-printing-supplies-ldo-systems-850376.jpg': '/media/hardware/toolheads/jabberwocky.webp',
  'https://excit3d.shop/uploads/1778518705382-62828.png': '/media/hardware/toolheads/peregrine.webp',
  'https://raw.githubusercontent.com/Armchair-Heavy-Industries/Xol-Toolhead/main/docs/assets/images/Xol-Toolhead.both.png': '/media/hardware/toolheads/xol.webp',
  'https://raw.githubusercontent.com/VoronDesign/Voron-Stealthburner/main/Images/stealthburner_front.png': '',
};

/** Airtable "Image URL": an on-site /media/hardware/... path or an external URL; '' when empty. */
export const imageOf = (r: any): string => {
  const v = r?.['Image URL'];
  const url = typeof v === 'string' ? v.trim() : '';
  return url in LOCAL_IMAGE ? LOCAL_IMAGE[url] : url;
};
