// Escape '<' so a value containing "</script>" can't close the ld+json block.
export const jsonLd = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c');
