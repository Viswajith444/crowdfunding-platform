import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";


const AuthContext = createContext(false);

const fallbackDomain = "https://crowdfunding-platform-7yyx.onrender.com";
const localDomain = "http://localhost:5000"; // Change the port if needed

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [backendUrl, setBackendUrl] = useState(localDomain);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(localDomain);
        if (response.ok) {
          setBackendUrl(localDomain);
        } else {
          setBackendUrl(fallbackDomain);
        }
      } catch (error) {
        console.log(error);
        setBackendUrl(fallbackDomain);
      }
    };
    checkBackendConnection();
  }, []);


  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, backendUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validate that children is a valid React node and is required
  };

export { AuthContext, AuthProvider };