import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import BookCard from "../components/BookCard"
import Loader from "../components/Loader"

const Search = () => {

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q");
    const [textField, setTextField] = useState(query)

    const [books, setBooks] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        if (textField.trim().length <= 3) return
        navigate('/search?q=' + encodeURIComponent(textField.trim()))
    }

    // Обновление счетчика найденных книг
    useEffect(() => {
        const countElement = document.getElementById('resultCount');
        if (countElement) {
            if (isLoading) {
                countElement.textContent = '...';
            } else if (error) {
                countElement.textContent = '—';
            } else {
                countElement.textContent = books.length + ' найдено';
            }
        }
    }, [books, isLoading, error]);

    useEffect(() => {
        const loadBooks = async () => {
            if (!query) {
                setBooks([]);
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true)
                setError(false)
                const res = await fetch("https://openlibrary.org/search.json" + "?q=" + encodeURIComponent(query) + "&limit=10")
                if (!res.ok) {
                    const data = res.json();
                    throw new Error(data.detail[0].msg || `HTTP error! status: ${res.status}`);
                }
                const data = await res.json()
                
              
                const docsArray = Array.isArray(data.docs) ? data.docs : [];
                setBooks(docsArray);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setBooks([]);
            } finally {
                setIsLoading(false)
            }
        }
        loadBooks()
    }, [query])

    const renderNoResultsMessage = () => {
        if (error) {
            return <div className="no-results-message">Ошибка при загрузке данных</div>;
        }
        if (!isLoading && books && books.length === 0 && query) {
            return <div className="no-results-message">книги не найдены</div>;
        }
        return null;
    };

    return (
        <section className="content">
            <div className="search-page-header">
                <div className="section-label">ПОИСК</div>
                <h1>Найдите свою следующую книгу</h1>
                <form onSubmit={handleSubmit} className="search" id="searchForm">
                    <span className="search-icon">⌕</span>
                    <input
                        id="searchInput"
                        type="text"
                        value={textField}
                        onChange={(e) => setTextField(e.target.value)}
                        placeholder="Название, автор или ISBN..."
                    />
                    <button type="submit">Найти</button>
                </form>
            </div>
            <div className="section-header">
                <div>
                    <div className="section-label">РЕЗУЛЬТАТЫ</div>
                    <h2 id="searchTitle">Результаты поиска</h2>
                </div>
                <span className="result-count" id="resultCount">
                    —
                </span>
            </div>
            {isLoading && <Loader />}
            {!isLoading && !error && books && books.length > 0 ? (
                <div className="book-grid" id="results">
                    {books.map((el, i) => (<BookCard {...el} book_key= {el.key} />))}
                </div>
            ) : (
                renderNoResultsMessage()
            )}
        </section>
    )
}

export default Search