import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Main from "./pages/Main"
import Search from "./pages/Search"
import Book from "./pages/Book"

const App = () => {
    return (
        <Routes>

            <Route path="/" element={<Layout />}>

                <Route index element={<Main />}></Route>
                <Route path="search" element={<Search />} />
                <Route path="book/:id" element={<Book />} />
            </Route>

        </Routes>
    )
}

export default App
