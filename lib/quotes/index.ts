export interface BookQuote {
  text: string;
  source?: string;
}

async function resolveOpenLibraryWorkId(isbn: string): Promise<string | null> {
  const res = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const book = data[`ISBN:${isbn}`];
  if (!book) return null;

  let workKey: string | undefined;
  if (book.works && book.works.length > 0) {
    workKey = book.works[0].key;
  } else if (book.key) {
    const editionRes = await fetch(`https://openlibrary.org${book.key}.json`, { next: { revalidate: 3600 } });
    if (editionRes.ok) {
      const edition = await editionRes.json();
      if (edition.works && edition.works.length > 0) {
        workKey = edition.works[0].key;
      }
    }
  } else if (book.identifiers?.openlibrary?.[0]) {
    const editionRes = await fetch(`https://openlibrary.org/books/${book.identifiers.openlibrary[0]}.json`, {
      next: { revalidate: 3600 },
    });
    if (editionRes.ok) {
      const edition = await editionRes.json();
      if (edition.works && edition.works.length > 0) {
        workKey = edition.works[0].key;
      }
    }
  }

  const workId = workKey?.split("/").pop();
  return workId || null;
}

function normalizeExcerpt(excerpt: any): BookQuote | null {
  if (!excerpt) return null;
  if (typeof excerpt === "string") {
    return { text: excerpt };
  }
  if (typeof excerpt.excerpt === "string") {
    return { text: excerpt.excerpt, source: excerpt.comment || excerpt.author || undefined };
  }
  if (typeof excerpt.text === "string") {
    return { text: excerpt.text, source: excerpt.comment || excerpt.author || undefined };
  }
  return null;
}

export async function fetchBookCommonQuotes(isbn: string): Promise<BookQuote[]> {
  const cleanIsbn = isbn.replace(/[- ]/g, "");
  const workId = await resolveOpenLibraryWorkId(cleanIsbn);
  if (!workId) return [];

  const res = await fetch(`https://openlibrary.org/works/${workId}.json`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const work = await res.json();

  const excerpts = work.excerpts;
  if (!excerpts) return [];

  const raw = Array.isArray(excerpts) ? excerpts : [excerpts];
  const quotes = raw.map(normalizeExcerpt).filter(Boolean) as BookQuote[];
  return quotes.slice(0, 5);
}
