import PropTypes from "prop-types";
import { Link } from "react-router-dom";


function Navbar({ items }) {
    let itemElements = items.map((item, i) => (
        <li key={i} className="p-3 px-5">
            <Link to={item.link} className="text-xl">{item.text}</Link>
        </li>
    ));

    return(<>
        <nav className="navbar backdrop-blur-xs">
            <ul>
                {itemElements}
            </ul>
        </nav>
    </>
    )
}

Navbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.string,
    })
  ),
};

export default Navbar;
