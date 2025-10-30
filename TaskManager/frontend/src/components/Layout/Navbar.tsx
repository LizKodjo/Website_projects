import type { FC } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const Navbar: FC = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const location = useLocation()

    const handleLogout = () => {
        logout()
    }

    return <>
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">🚀 TaskFlow Pro</Link>
            </div>

            <div className="navbar-menu">
                {isAuthenticated ? (
                    <>
                        <Link to="/" className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
                        <Link to="/tasks" className={`navbar-ite ${location.pathname === '/tasks' ? 'active' : ''}`}>My Tasks</Link>
                        <div className="navbar-user">
                            <span className="user-email">{user?.email}</span>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </div>
                                            </>
                ) : (
                        <div className="navbar-auth">
                            <Link to="/login" className="navbar-item"></Link>
                            <Link to="/register" className="navbar-item register">Sign Up</Link>
                        </div>
                )}
            </div>
        </nav>
    </>
}

export default Navbar;