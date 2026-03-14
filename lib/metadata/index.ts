export interface BookMetadata {
  title: string;
  author: string;
  isbn: string;
  coverUrl?: string;
  description?: string;
  pageCount?: number;
  source: string;
}

async function fetchGoogleBooks(isbn: string): Promise<BookMetadata | null> {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;

    const volumeInfo = data.items[0].volumeInfo;

    return {
      title: volumeInfo.title,
      author: volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author",
      isbn: isbn,
      coverUrl: volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:"),
      description: volumeInfo.description,
      pageCount: volumeInfo.pageCount,
      source: "google",
    };
  } catch (e) {
    console.error("Google Books API error:", e);
    return null;
  }
}

async function fetchOpenLibrary(isbn: string): Promise<BookMetadata | null> {
  try {
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    if (!res.ok) return null;

    const data = await res.json();
    const bookKey = `ISBN:${isbn}`;

    if (!data[bookKey]) return null;

    const book = data[bookKey];

    // Extract description from notes, or build it from subjects/excerpts
    let description = book.notes || "";
    if (!description && book.subjects) {
      description = `Subjects: ${book.subjects.map((s: any) => s.name).slice(0, 5).join(", ")}.`;
    }

    return {
      title: book.title,
      author: book.authors ? book.authors.map((a: any) => a.name).join(", ") : "Unknown Author",
      isbn: isbn,
      coverUrl: book.cover?.large || book.cover?.medium || book.cover?.small,
      description: description || book.subtitle || undefined,
      pageCount: typeof book.number_of_pages === "number"
        ? book.number_of_pages
        : book.pagination
          ? parseInt(book.pagination, 10)
          : undefined,
      source: "openlibrary",
    };
  } catch (e) {
    console.error("Open Library API error:", e);
    return null;
  }
}

async function fetchITBookstore(isbn: string): Promise<BookMetadata | null> {
  try {
    const res = await fetch(`https://api.itbook.store/1.0/books/${isbn}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.error !== "0") return null;

    return {
      title: data.title,
      author: data.authors || "Unknown Author",
      isbn: isbn,
      coverUrl: data.image,
      description: data.desc,
      pageCount: parseInt(data.pages, 10) || undefined,
      source: "itbookstore",
    };
  } catch (e) {
    console.error("IT Bookstore API error:", e);
    return null;
  }
}

export async function fetchBookMetadata(isbn: string): Promise<BookMetadata | null> {
  // Clean ISBN (remove hyphens)
  const cleanIsbn = isbn.replace(/[- ]/g, "");

  // Smart Fallback Logic
  console.log(`Fetching metadata for ISBN: ${cleanIsbn} via Google Books...`);
  let book = await fetchGoogleBooks(cleanIsbn);
  if (book) return book;

  console.log(`Google Books failed. Trying Open Library...`);
  book = await fetchOpenLibrary(cleanIsbn);
  if (book) return book;

  console.log(`Open Library failed. Trying IT Bookstore...`);
  book = await fetchITBookstore(cleanIsbn);
  if (book) return book;

  // Wikidata SPARQL could be added here as Fallback 3

  return null;
}
