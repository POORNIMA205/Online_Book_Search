function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search for books..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button onClick={onSearch}>
                Search
            </button>
        </div>
    );
}

export default SearchBar;