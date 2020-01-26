import React, { useState, useEffect } from "react";

import NavButtons from "./NavButtons";
import schemes from "../assets/api/schemes.json";

const SchemeConfiguration = ({
  schemeSelected,
  changePage,
  onChangeOrder,
  page,
  ...props
}) => {
  const scheme = schemes[schemeSelected];
  const [form, setForm] = useState({
    height: 0,
    width: 0,
    sfrido: 0,
    schemeType: null,
    schemeColor: null
  });

  useEffect(() => {
    if (page === "list") {
      setForm({
        ...form,
        schemeType: null,
        schemeColor: null
      });
    }
  }, [page]);

  const handleFormChange = (e, val) => {
    let value;

    if (val) {
      value = val;
    } else {
      value = e.target.value === "" ? 0 : parseFloat(e.target.value);
      value = value ? value : 0;
    }

    setForm({
      ...form,
      [e.target.name]: value
    });
  };

  const submitOrder = () => {
    for (let [name, value] of Object.entries(form)) {
      switch (name) {
        case "height":
          if (!value && value !== 0) {
            alert("height must be a number");
            return;
          }
          if (value <= 0) {
            alert("height must be greater than 0");
            return;
          }

          break;

        case "width":
          if (!value && value !== 0) {
            alert("width must be a number");
            return;
          }
          if (value <= 0) {
            alert("width must be greater than 0");
            return;
          }

          break;

        case "sfrido":
          if (!value && value !== 0) {
            alert("sfrido must be a number");
            return;
          }
          if (value < 0) {
            alert("sfrido must be equal or greater than 0");
            return;
          }

          break;
        case "schemeType":
          if (!value) {
            alert("Missing choice in section 1");
            return;
          }

        case "schemeColor":
          if (!value) {
            alert("Missing choice in section 2");
            return;
          }
      }
    }

    onChangeOrder(form);
    changePage(+1);
  };

  return (
    <div id="page-layout-selector" {...props}>
      <ul id="layout-container">
        <li className="section-row">
          <div className="number" />
          <span id="layout-title-container">
            <h2 id="layout-title">{scheme.title}</h2>
            <h3 id="layout-description">
              SELECT ONE CHOICE IN EVERY SECTION / SELEZIONA UN OPZIONE PER
              SEZIONE
            </h3>
          </span>
        </li>
        <li className="section-row">
          <div className="number">1.</div>
          <div id="layout-scheme-list" className="grid-simple border">
            {scheme.schemeList.map((el, id) => (
              <label key={el.img}>
                <img src={el.img} />
                <input
                  type="radio"
                  name="schemeType"
                  className="scheme-type"
                  checked={el === form.schemeType}
                  onChange={e => handleFormChange(e, el)}
                />
                <div className="check-svg">
                  <img
                    src="/assets/img/layout/TickGreenSVG.svg"
                    alt="checked"
                  />
                </div>
              </label>
            ))}
            <label class="download-button">
              <a
                href={`/assets/pdf/${scheme.handle}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <img src="/assets/img/download-button.jpg" alt="Download" />
              </a>
            </label>
          </div>
        </li>
        <li className="section-row">
          <div className="number">2.</div>
          <div id="layout-scheme-color" className="grid-simple border">
            {scheme.schemeColorsList.map((color, id) => (
              <label key={color.img}>
                <img src={color.img} />
                {color.title}
                <input
                  type="radio"
                  name="schemeColor"
                  className="scheme-color"
                  checked={color === form.schemeColor}
                  onChange={e => handleFormChange(e, color)}
                />
                <div className="check-svg">
                  <img
                    src="/assets/img/layout/TickGreenSVG.svg"
                    alt="checked"
                  />
                </div>
              </label>
            ))}
          </div>
        </li>
        <li id="layout-scheme-options">
          <div className="number">3.</div>
          <div id="layout-scheme-info" className="border">
            <div className="row">
              <h4>width / larghezza</h4>
              <div className="input">
                <input
                  type="text"
                  id="scheme-width"
                  name="width"
                  value={form.width}
                  onChange={handleFormChange}
                  required
                />
                <small>cm</small>
              </div>
            </div>

            <div className="row">
              <h4>height / altezza</h4>
              <div className="input">
                <input
                  type="text"
                  id="scheme-height"
                  name="height"
                  value={form.height}
                  onChange={handleFormChange}
                  required
                />
                <small>cm</small>
              </div>
            </div>

            <div className="row">
              <h4>waste / sfrido</h4>
              <div className="input">
                <input
                  type="text"
                  id="scheme-sfrido"
                  name="sfrido"
                  value={form.sfrido}
                  onChange={handleFormChange}
                  required
                />
                <small>%</small>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <NavButtons
        style={{ marginLeft: 25 }}
        onBack={() => changePage(-1)}
        onNext={submitOrder}
      />
    </div>
  );
};

export default SchemeConfiguration;
