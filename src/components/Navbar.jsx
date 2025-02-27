import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Navbar({ items }) {
    let itemElements = items.map((item, i) => (
        <li
            key={i}
            className="not-first:ml-5 rounded-sm p-1 inset-ring-white blur-none hover:inset-ring-2 transition-[box-shadow] duration-150 nth-last-1:ml-auto"
        >
            <Link to={item.link} className="px-5 py-2">
                <span className="text-xl">{item.text}</span>
            </Link>
        </li>
    ));

    return (
        <>
            <nav className="navbar backdrop-blur-xs overflow-hidden px-10">
                <ul>{itemElements}</ul>
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
