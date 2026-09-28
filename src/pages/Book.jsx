import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from "../components/Loader"

const Book = () => {
    const { id } = useParams()
    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadBook = async () => {
            try {
                setIsLoading(true)
                setError("")

                const res = await fetch(
                    `https://openlibrary.org/works/${id}.json`
                )

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }

                const data = await res.json()

                // Загружаем имена авторов
                const authorKeys =
                    data.authors
                        ?.map(item => item.author?.key)
                        .filter(Boolean) ?? []

                const authorNames = await Promise.all(
                    authorKeys.map(async key => {
                        const authorRes = await fetch(
                            `https://openlibrary.org${key}.json`
                        )

                        if (!authorRes.ok) return null

                        const authorData = await authorRes.json()
                        return authorData.name
                    })
                )

                // Получаем названия жанров из subjects.
                // Если в API пришли пути вида /tags/OL169T,
                // пробуем получить название по этому пути.
                const subjects = data.subjects ?? data.genres ?? []

                const genreNames = await Promise.all(
                    subjects.map(async subject => {
                        const value =
                            typeof subject === "string"
                                ? subject
                                : subject?.name

                        if (!value) return null

                        if (value.startsWith("/")) {
                            const tagRes = await fetch(
                                `https://openlibrary.org${value}.json`
                            )

                            if (!tagRes.ok) return null

                            const tagData = await tagRes.json()
                            return tagData.name ?? tagData.title ?? null
                        }

                        return value
                    })
                )

                setBook({
                    ...data,
                    authorNames: authorNames.filter(Boolean),
                    genreNames: [...new Set(genreNames.filter(Boolean))],
                })
            } catch (err) {
                console.error(err)
                setError(err.message || "Не удалось загрузить книгу.")
                setBook(null)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) loadBook()
    }, [id])

    if (isLoading) return <Loader />
    if (error) return <p>{error}</p>
    if (!book) return <p>Книга не найдена.</p>

    const description =
        typeof book.description === "string"
            ? book.description
            : book.description?.value || "Описание отсутствует."

    const coverUrl = book.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
        : null

    return (
        <section className="book-page">
            <div className="book-page-cover">
                {coverUrl && (
                    <img src={coverUrl} alt={`Обложка: ${book.title}`} />
                )}
            </div>

            <div className="book-page-content">
                <div className="section-label">КНИГА</div>
                <h1>{book.title || "Без названия"}</h1>

                {book.authorNames.length > 0 && (
                    <p>Автор: {book.authorNames.join(", ")}</p>
                )}

                {book.genreNames.length > 0 && (
                    <p>Жанры: {book.genreNames.join(", ")}</p>
                )}

                <div className="book-meta">
                    {book.first_publish_date && (
                        <span>{book.first_publish_date}</span>
                    )}
                </div>

                <div className="description">
                    <h3>Об этой книге</h3>
                    <p>{description}</p>
                </div>

                <div className="modal-actions">
                    <button className="primary-button">Читать</button>
                    <button className="secondary-button">♡ Сохранить</button>
                </div>
            </div>
        </section>
    )
}

export default Book