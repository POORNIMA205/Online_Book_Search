function BookCard({ book }) {
    const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null;

    return (
        <div className="book-card">

            {coverUrl ? (
                <img
                    src={coverUrl}
                    alt={book.title}
                />
            ) : (
                <div className="no-image">
                    No Image
                </div>
            )}

            <h3>{book.title}</h3>

            <p>
                <strong>Author:</strong>{" "}
                {book.author_name
                    ? book.author_name.join(", ")
                    : "Unknown"}
            </p>

            <p>
                <strong>Published:</strong>{" "}
                {book.first_publish_year || "Unknown"}
            </p>

        </div>
    );
}

export default BookCard;