import  { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="container mx-auto px-10">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-white text-2xl font-bold flex items-center gap-2 tracking-wide hover:scale-105 transition"
                    >
                        <FaTicketAlt className="text-amber-400" />
                        Bookifyr
                    </Link>

                    {/* Links */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm md:text-base">

                        <Link
                            to="/"
                            className="text-white hover:text-white transition duration-300 hover:scale-105"
                        >
                            Events
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className="text-gray-300 hover:text-white transition duration-300 hover:scale-105"
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300 shadow-md"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-white hover:text-white transition duration-300 hover:scale-105"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-amber-400/40"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;