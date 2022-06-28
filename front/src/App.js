import { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'simplebar/dist/simplebar.min.css'
import { ThemeProvider } from 'styled-components'
import Home from './components/HomeComponent'
import Login from './components/LoginRegisterComponent/Login'
import Register from './components/LoginRegisterComponent/Register'
import { loadTheme, updateStatusResolution } from './redux/themeSlice'

function App() {
    const dispatch = useDispatch()
    const theme = useSelector(state => state.theme)
    const user = useSelector(state => state.auth.currentUser.user)

    // Load theme
    useEffect(() => {
        dispatch(loadTheme())
    }, [])

    // Change resolution
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 900)
                dispatch(updateStatusResolution({ isHidden: true }))
            else dispatch(updateStatusResolution({ isHidden: false }))
        }

        window.addEventListener('load', handleResize)
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('load', handleResize)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <ToastContainer
                    position="bottom-left"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover={false}
                    theme={theme?.colorTheme}
                />
                <Routes>
                    <Route
                        exact
                        path="/login"
                        element={user ? <Navigate to="/" /> : <Login />}
                    />
                    <Route
                        exact
                        path="/register"
                        element={user ? <Navigate to="/" /> : <Register />}
                    />
                    <Route
                        exact
                        path="/"
                        element={!user ? <Navigate to="/login" /> : <Home />}
                    />
                </Routes>
            </div>
        </ThemeProvider>
    )
}

export default memo(App)
