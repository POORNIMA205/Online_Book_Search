import { useMemo, useState } from "react";
import "./App.css";

const API = "https://openlibrary.org/search.json";
const GUTENDEX = "https://gutendex.com/books/";

function cover(book, size = "M") {
  return book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`
    : "https://placehold.co/420x620/efe7d8/342d2a?text=No+Cover";
}

function normalize(book) {
  return {
    ...book,
    title: book.title || "Untitled Book",
    author_name: book.author_name || ["Unknown author"],
    first_publish_year: book.first_publish_year || "Unknown",
    subjects: book.subject || book.subject_facet || [],
    people: book.person || book.subject_people || [],
    description: typeof book.description === "string" ? book.description : (book.description?.value || ""),
    key: book.key || `${book.title}-${book.first_publish_year}`,
  };
}

async function findFullText(book) {
  const params = new URLSearchParams({
    search: book.title,
  });
  const response = await fetch(`${GUTENDEX}?${params}`);
  if (!response.ok) throw new Error("The reading service is unavailable right now.");
  const data = await response.json();

  const author = (book.author_name?.[0] || "").toLowerCase();
  const match = data.results?.find((item) => {
    const itemTitle = (item.title || "").toLowerCase();
    const itemAuthor = (item.authors?.[0]?.name || "").toLowerCase();
    return (
      (itemTitle.includes(book.title.toLowerCase()) || book.title.toLowerCase().includes(itemTitle)) &&
      (!author || itemAuthor.includes(author.split(",")[0]))
    );
  });

  if (!match) return null;

  const formats = match.formats || {};
  const textUrl =
    formats["text/plain; charset=utf-8"] ||
    formats["text/plain"] ||
    Object.entries(formats).find(([key]) => key.startsWith("text/plain"))?.[1];

  if (!textUrl) return null;

  const textResponse = await fetch(textUrl);
  if (!textResponse.ok) return null;
  const text = await textResponse.text();
  return { ...match, text };
}

async function enrichBook(book) {
  if (!book.key?.startsWith("/works/")) return book;
  try {
    const response = await fetch(`https://openlibrary.org${book.key}.json`);
    if (!response.ok) return book;
    const data = await response.json();
    return {
      ...book,
      description: typeof data.description === "string" ? data.description : (data.description?.value || book.description || ""),
      subjects: data.subjects || book.subjects || [],
    };
  } catch { return book; }
}

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Discover a book and make it yours.");
  const [selected, setSelected] = useState(null);
  const [reader, setReader] = useState(null);
  const [readerLoading, setReaderLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);

  const categories = ["Fiction", "Technology", "Romance", "Mystery", "Business", "Science", "History", "Self Help"];

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);

  async function searchBooks(term = query) {
    const value = term.trim();
    if (!value) {
      setMessage("Type a title, author, or topic to start exploring.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API}?q=${encodeURIComponent(value)}&limit=18&fields=*`);
      if (!response.ok) throw new Error("Book search is temporarily unavailable.");
      const data = await response.json();
      const results = (data.docs || []).filter((b) => b.title).map(normalize);
      setBooks(results);
      if (!results.length) setMessage("No books found. Try another title or author.");
    } catch (error) {
      setBooks([]);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function addToCart(book) {
    setCart((current) => {
      if (current.some((item) => item.key === book.key)) return current;
      return [...current, { ...book, price: 399 + ((book.title.length * 17) % 700) }];
    });
    setCartOpen(true);
  }

  function toggleWishlist(book) {
    setWishlist((current) =>
      current.some((item) => item.key === book.key)
        ? current.filter((item) => item.key !== book.key)
        : [...current, book]
    );
  }

  async function openReader(book) {
    setSelected(null);
    setReaderLoading(true);
    const detailedBook = await enrichBook(book);
    setReader({ book: detailedBook, text: null, unavailable: false });
    try {
      const fullText = await findFullText(detailedBook);
      if (fullText?.text) setReader({ book: detailedBook, text: cleanGutenberg(fullText.text), unavailable: false });
      else setReader({ book: detailedBook, text: null, unavailable: true });
    } catch {
      setReader({ book: detailedBook, text: null, unavailable: true });
    } finally { setReaderLoading(false); }
  }

  function cleanGutenberg(text) {
    const start = Math.max(text.search(/\*\*\* START OF|\*\*\*START OF/i), 0);
    const end = text.search(/\*\*\* END OF|\*\*\*END OF/i);
    return text.slice(start > 0 ? text.indexOf("\n", start) : 0, end > 0 ? end : text.length).trim();
  }

  return (
    <div className="app">
      <header className="nav">
        <button className="brand" onClick={() => { setReader(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <span className="brandMark">B</span>
          <span><b>BOOKORA</b><small>THE READING ROOM</small></span>
        </button>
        <div className="navLinks"><button onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}>Discover</button><button onClick={() => setWishlist(wishlist)}>Wishlist <em>{wishlist.length}</em></button></div>
        <button className="bag" onClick={() => setCartOpen(true)}>Bag <span>{cart.length}</span></button>
      </header>

      <main>
        <section className="hero">
          <div className="heroCopy">
            <p className="eyebrow">READ • DISCOVER • KEEP</p>
            <h1>A good book<br /><i>changes the room.</i></h1>
            <p className="heroText">Find stories, explore their worlds, read what is legally available right here in Bookora, and buy the ones you want to keep.</p>
            <div className="searchBox">
              <span>⌕</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchBooks()} placeholder="Search by title, author or topic..." />
              <button onClick={() => searchBooks()}>Search</button>
            </div>
            <div className="chips">{categories.map((c) => <button key={c} onClick={() => { setQuery(c); searchBooks(c); }}>{c}</button>)}</div>
          </div>
          <div className="heroArt"><div className="sun"></div><div className="bookStack"><span></span><span></span><span></span><strong>READ<br />MORE.</strong></div><div className="heroNote">YOUR NEXT<br /><b>FAVOURITE</b><br />IS WAITING.</div></div>
        </section>

        <section className="featureStrip"><div><b>01</b><span>DISCOVER</span><p>Millions of titles</p></div><div><b>02</b><span>READ</span><p>Inside your Bookora room</p></div><div><b>03</b><span>KEEP</span><p>Buy books you love</p></div></section>

        <section id="discover" className="catalog">
          <div className="sectionHead"><div><p className="eyebrow">THE SHELVES</p><h2>{books.length ? "Your discoveries" : "Start your discovery"}</h2></div><span>{books.length ? `${books.length} books` : "Search above"}</span></div>
          {loading ? <div className="loadingGrid">{Array.from({ length: 8 }).map((_, i) => <div className="skeleton" key={i}></div>)}</div> : books.length ? <div className="grid">{books.map((book) => <BookCard key={book.key} book={book} wished={wishlist.some((w) => w.key === book.key)} onDetails={() => setSelected(book)} onRead={() => openReader(book)} onBuy={() => addToCart(book)} onWish={() => toggleWishlist(book)} />)}</div> : <div className="empty"><div>⌕</div><h3>What will you read next?</h3><p>{message}</p></div>}
        </section>
      </main>

      {selected && <BookModal book={selected} wished={wishlist.some((w) => w.key === selected.key)} onClose={() => setSelected(null)} onRead={() => openReader(selected)} onBuy={() => addToCart(selected)} onWish={() => toggleWishlist(selected)} />}

      {reader && <div className="readerLayer"><div className="readerTop"><button onClick={() => setReader(null)}>← Back to Bookora</button><div><b>{reader.book.title}</b><span>{reader.book.author_name?.join(", ")}</span></div><button className="readerBuy" onClick={() => addToCart(reader.book)}>🛒 Buy ₹{399 + ((reader.book.title.length * 17) % 700)}</button></div><div className="readerBody"><aside><img src={cover(reader.book, "L")} alt="" /><p>Published</p><b>{reader.book.first_publish_year}</b><p>Author</p><b>{reader.book.author_name?.join(", ")}</b><p>Characters</p><b>{(reader.book.people || []).slice(0, 6).join(", ") || "Information unavailable"}</b><button onClick={() => addToCart(reader.book)}>Buy this book</button></aside><article className="readingPaper"><p className="eyebrow">BOOKORA READING ROOM</p><h1>{reader.book.title}</h1><h3>{reader.book.author_name?.join(" • ")}</h3>{readerLoading ? <div className="readerLoading"><div></div><div></div><div></div><p>Preparing your reading room…</p></div> : reader.unavailable ? <div className="unavailablePro">
  <div className="availabilityBadge">READING PREVIEW</div>
  <div className="unavailableGrid">
    <div className="unavailableCover"><img src={cover(reader.book, "L")} alt={reader.book.title} /></div>
    <div className="unavailableInfo">
      <p className="eyebrow">A CLOSER LOOK</p>
      <h2>Explore the book before you buy it.</h2>
      <p className="lead">The complete text of this title isn't licensed for in-app reading, but Bookora can still give you a proper reading-room experience with the book's catalogue information, story overview and available preview details.</p>
      <div className="quickFacts"><div><span>AUTHOR</span><b>{reader.book.author_name?.join(", ") || "Unknown"}</b></div><div><span>PUBLISHED</span><b>{reader.book.first_publish_year || "Unknown"}</b></div><div><span>EDITIONS</span><b>{reader.book.edition_count || "—"}</b></div></div>
      <div className="storyBox"><p className="eyebrow">ABOUT THIS BOOK</p><p>{reader.book.description || reader.book.first_sentence?.[0] || `Explore ${reader.book.title} by ${reader.book.author_name?.join(", ") || "its author"}. The catalogue does not provide a full synopsis for this edition.`}</p></div>
      <div className="tagRow">{(reader.book.subjects || []).slice(0, 6).map((subject) => <span key={subject}>{subject}</span>)}</div>
    </div>
  </div>
  <div className="readerNotice"><span>📖</span><div><b>Full reading is not available for this title</b><p>Bookora keeps copyrighted books protected. When a lawful full-text edition is available, it will appear here as an in-app reader.</p></div></div>
  <div className="unavailableActions"><button className="buyLarge" onClick={() => addToCart(reader.book)}>🛒 Buy this book • ₹{399 + ((reader.book.title.length * 17) % 700)}</button><button className="saveLarge" onClick={() => toggleWishlist(reader.book)}>{wishlist.some((w) => w.key === reader.book.key) ? "♥ Saved to Wishlist" : "♡ Save for later"}</button></div>
</div> : <div className="bookText">{reader.text.split(/\n\s*\n/).map((para, i) => <p key={i}>{para.replace(/\s+/g, " ").trim()}</p>)}</div>}</article></div></div>}

      {cartOpen && <div className="drawerShade" onClick={() => setCartOpen(false)}><aside className="cartDrawer" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setCartOpen(false)}>×</button><p className="eyebrow">YOUR BAG</p><h2>{cart.length ? `${cart.length} book${cart.length > 1 ? "s" : ""}` : "Your bag is quiet."}</h2>{cart.length ? <>{cart.map((item) => <div className="cartItem" key={item.key}><img src={cover(item)} alt="" /><div><b>{item.title}</b><small>{item.author_name?.[0]}</small><strong>₹{item.price}</strong></div></div>)}<div className="total"><span>Total</span><b>₹{cartTotal}</b></div><button className="checkout" onClick={() => setCheckout(true)}>Continue to checkout</button></> : <p>Add a book you love from the reading room or shelves.</p>}</aside></div>}

      {checkout && <div className="checkoutShade"><div className="checkoutCard"><button className="close" onClick={() => setCheckout(false)}>×</button><p className="eyebrow">BOOKORA CHECKOUT</p><h2>Your books are ready to come home.</h2><p>This is an in-app demo checkout. No external shopping website is opened.</p><input placeholder="Full name" /><input placeholder="Delivery address" /><button className="checkout" onClick={() => { setCheckout(false); setCart([]); setCartOpen(false); alert("Order placed in the Bookora demo. Thank you for reading!"); }}>Place demo order • ₹{cartTotal}</button></div></div>}
    </div>
  );
}

function BookCard({ book, wished, onDetails, onRead, onBuy, onWish }) {
  const price = 399 + ((book.title.length * 17) % 700);
  return <article className="bookCard"><button className="wish" onClick={onWish}>{wished ? "♥" : "♡"}</button><button className="coverButton" onClick={onDetails}><img src={cover(book)} alt={book.title} /></button><div className="bookInfo"><span>{book.first_publish_year}</span><h3>{book.title}</h3><p>{book.author_name?.slice(0, 2).join(", ")}</p><div className="actions"><button onClick={onRead}>📖 Read</button><button onClick={onBuy}>Buy ₹{price}</button></div></div></article>;
}

function BookModal({ book, wished, onClose, onRead, onBuy, onWish }) {
  const price = 399 + ((book.title.length * 17) % 700);
  return <div className="modalShade" onClick={onClose}><div className="bookModal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={onClose}>×</button><div className="modalCover"><img src={cover(book, "L")} alt={book.title} /></div><div className="modalContent"><p className="eyebrow">BOOK DETAILS</p><h2>{book.title}</h2><h4>{book.author_name?.join(", ")}</h4><div className="meta"><span>Published <b>{book.first_publish_year}</b></span><span>Edition count <b>{book.edition_count || "—"}</b></span></div><p>{book.first_sentence?.[0] || `Explore ${book.title}, its author, subjects, publication history and available reading information.`}</p><h5>Characters / people</h5><p>{book.people?.slice(0, 10).join(", ") || "Not listed by the catalogue."}</p><div className="modalActions"><button className="readMain" onClick={onRead}>📖 Read inside Bookora</button><button className="buyMain" onClick={onBuy}>🛒 Buy ₹{price}</button><button className="heart" onClick={onWish}>{wished ? "♥ Saved" : "♡ Save"}</button></div></div></div></div>;
}

export default App;
