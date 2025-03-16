import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

function Navbar({ items }) {
    const { isLoggedIn, logout } = useContext(AuthContext);
    let itemElements = items.map((item, i) => {
        if (item.text === "Login") {
            let state = isLoggedIn;

            // item.link = "/SignIn";/
            return (
                <li
                    key={i}
                    className="p-1 transition-all duration-150  nth-last-1:ml-auto "
                >
                    <button onClick={() => logout()}>
                        <Link
                            to={state ? "/Login" : item.link}
                            className="px-3 py-2 hover:bg-gray-200 rounded-xl"
                        >
                            <span className="text-sm">
                                {state ? "Sign Out" : "Login"}
                            </span>
                        </Link>
                    </button>
                </li>
            );
        }
        return (
            <li
                key={i}
                className="p-3 transition-all duration-150 nth-last-1:ml-auto"
            >
                <Link to={item.link} className="py-2">
                    <span className= "text-sm px-3 py-2 hover:bg-gray-200  rounded-xl">{item.text}</span>
                </Link>
            </li>
        );
    });

    return (
        <>
            <nav className="navbar h-[4rem] bg-white overflow-hidden drop-shadow-md px-10 backdrop-blur-xs">
                <ul className="px-[20%]">{itemElements}</ul>
            </nav>
        </>
    );
}

Navbar.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            link: PropTypes.string,
            text: PropTypes.string,
        }),
    ),
};

export default Navbar;
