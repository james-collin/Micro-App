import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowLeft,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";

const NavButtons = ({ onBack, onNext, nextText, ...rest }) => {
  return (
    <div className="nav-buttons" {...rest}>
      <button className="outline-btn nav-btn" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
        BACK
      </button>
      <button
        className="outline-btn nav-btn nav-btn-center"
        onClick={() => window.scrollTo(0, 0)}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
      <button className="outline-btn nav-btn" onClick={onNext}>
        {nextText ? nextText : "NEXT"}
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default NavButtons;
