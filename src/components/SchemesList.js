import React from "react";

import schemes from "../assets/api/schemes.json";

const SchemesList = ({ schemeClicked, ...props }) => {
  return (
    <div id="page-scheme-selector" {...props}>
      <h2>Choose your scheme</h2>
      <ul id="scheme-container" className="grid-simple">
        {schemes.map((el, id) => (
          <li key={el.handle}>
            <button onClick={() => schemeClicked(el, id)}>
              <img src={el.img} />
              <h3>{el.title}</h3>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchemesList;
