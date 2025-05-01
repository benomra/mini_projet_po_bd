import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Header = ({ onSearch, showSearch = true }) => {
  return (
    <div className="header">
      <h1></h1>
      {showSearch && (
        <div className="search-container">
          <div className="search-input">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search here..." 
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
