

const BookCard = ({author_name, title, first_publish_year, cover_i}) => {
    return (
        <a className="book-card" href="book.html">
            <div className="book-image">
                <img
                    src={`https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`}
                    alt={title}
                />
                <button className="favorite">♡</button>
            </div>
            <div className="book-info">
                {title &&<h3>{title}</h3>}
                {author_name && <p>{author_name.join(", ")}</p>}
                {first_publish_year && <span className="year">{first_publish_year}</span>}
            </div>
        </a>
    )
}

export default BookCard
