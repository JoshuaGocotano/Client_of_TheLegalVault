import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    return <header> Header </header>;
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
