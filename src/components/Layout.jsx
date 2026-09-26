import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'


const Layout = () => {
    return (
        <div className="app">
            <Sidebar />
            <div className="main">
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout
