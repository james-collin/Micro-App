import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowLeft,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";

import NavButtons from "./NavButtons";

import fugaCodes from "../assets/api/fugaCodes.json";

const SchemeOrder = ({ order, changePage, orderImage, ...props }) => {
  const schemeImg = useRef(null);
  const [customer, setCustomer] = useState({
    name: "",
    surname: "",
    company: "",
    job: "",
    phone: "",
    city: "",
    country: "",
    email: ""
  });

  const onDownloadPdf = () => {
    html2canvas(document.querySelector("#root"), {
      windowWidth: 1440,
      windowHeight: 400,
      width: 1440,
      height: 3600,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0
    }).then(canvas => {
      var pdf = new jsPDF({
        unit: "px",
        format: [1920, 3000]
      });
      pdf.addImage(canvas, "JPEG", 0, 0, 1440, 3600);

      if (
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          navigator.userAgent.toLowerCase()
        )
      ) {
        window.open(pdf.output("bloburl", { filename: "order.pdf" }));
      } else {
        pdf.save("order.pdf");
      }
    });
  };

  const onChange = e => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    });
  };

  const sendOrder = () => {
    order.customer = customer;

    const canvas = document.createElement("CANVAS");
    const ctx = canvas.getContext("2d");
    canvas.height = schemeImg.current.height;
    canvas.width = schemeImg.current.width;
    ctx.drawImage(
      schemeImg.current,
      0,
      0,
      schemeImg.current.width,
      schemeImg.current.height
    );
    order.schemeImg = canvas.toDataURL();

    order.orderImage = orderImage;

    let emptyValues = false;

    for (let val of Object.values(customer)) {
      if (val === "") emptyValues = true;
    }

    if (emptyValues) {
      alert("Please fill all customer values");
      return;
    }
    if (!validateEmail(customer.email)) {
      alert("Please enter a valid email address");
      return;
    }

    console.log(order);

    axios
      .post("/order", { order })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log("Error");
        console.log(err);
      });

    alert("Order sent, thanks!");
    changePage(-3);
    /*
    fetch("/order", {
      method: "POST", // or 'PUT'
      body: JSON.stringify({ order }), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
    alert("Order sent, thanks!");
    changePage(-3);*/
  };

  if (!order.custom) {
    order.boxAmounts = Math.ceil(order.sqm / order.schemeBoxSqm);
    order.totalKgs = Math.ceil(order.boxAmounts * order.schemeBoxKg);
    order.groutTotalKgs = Math.ceil(order.sqm * order.schemeGroutKgSqm);
    order.groutBoxes = Math.ceil(order.groutTotalKgs / 2.5);
  } else {
    order.boxAmounts = "Custom";
    order.totalKgs = "Custom";
    order.groutTotalKgs = "Custom";
    order.groutBoxes = "Custom";
  }

  order.groutCode = fugaCodes[order.fugaColor];

  let rows = {
    header: [],
    dot: [],
    square: [],
    rectangular: [],
    squarex4: [],
    rectangularx4: [],
    trapezes: [],
    total: []
  };

  // Fill tiles table
  order.colors.map((val, id) => {
    rows.header.push(
      <td>
        Color {id + 1}: <strong>{val}</strong> tiles
      </td>
    );
    rows.dot.push(
      <td>
        {order.tilesCount.amountTilesDot[`color${parseInt(id) + 1}`]} tiles
      </td>
    );
    rows.square.push(
      <td>
        {order.tilesCount.amountTilesSquare[`color${parseInt(id) + 1}`]} tiles
      </td>
    );
    rows.rectangular.push(
      <td>
        {order.tilesCount.amountTilesRectangular[`color${parseInt(id) + 1}`]}{" "}
        tiles
      </td>
    );
    rows.squarex4.push(
      <td>
        {order.tilesCount.amountTilesSquarex4[`color${parseInt(id) + 1}`]} tiles
      </td>
    );
    rows.rectangularx4.push(
      <td>
        {order.tilesCount.amountTilesRectangularx4[`color${parseInt(id) + 1}`]}
        tiles
      </td>
    );
    rows.trapezes.push(
      <td>
        {order.tilesCount.amountTilesTrapezi[`color${parseInt(id) + 1}`]}
        tiles
      </td>
    );
    rows.total.push(
      <td>{order.tilesCount.amountTotal[`color${parseInt(id) + 1}`]} tiles</td>
    );
  });

  let val = "total";

  rows.header.push(<td>Total tiles</td>);
  rows.dot.push(<td>{order.tilesCount.amountTilesDot[val]} tiles</td>);
  rows.square.push(<td>{order.tilesCount.amountTilesSquare[val]} tiles</td>);
  rows.rectangular.push(
    <td>{order.tilesCount.amountTilesRectangular[val]} tiles</td>
  );
  rows.squarex4.push(
    <td>{order.tilesCount.amountTilesSquarex4[val]} tiles</td>
  );
  rows.rectangularx4.push(
    <td>{order.tilesCount.amountTilesRectangularx4[val]} tiles</td>
  );
  rows.trapezes.push(<td>{order.tilesCount.amountTilesTrapezi[val]} tiles</td>);
  rows.total.push(<td>{order.tilesCount.amountTotal[val]} tiles</td>);

  return (
    <div id="order-page" {...props}>
      <div id="order-section">
        <h2>Microtiles</h2>
        <h2>{order.schemeTitle}</h2>
        <h3>Schema / Scheme {order.schemeNumber}</h3>
        <h3>Catalogo Pag. / Catalogue Pag. {order.schemePage}</h3>
        <br />
        <div className="order-content">
          <img className="schemeImage" src={order.schemeImg} ref={schemeImg} />

          <table className="main-table">
            <tr>
              <th>FORMATI / SIZES</th>
              <td>{order.schemeSizes}</td>
            </tr>
            <tr>
              <th>SPESSORE / THICKNESS</th>
              <td>{order.schemeThickness}</td>
            </tr>
            <tr>
              <th>FORNITO / DELIVERED</th>
              <td>
                Su rete
                <br />
                Mesh mounted
              </td>
            </tr>
          </table>

          <table className="main-table">
            <tr>
              <th>SCATOLA / BOX</th>
              <th>PALLET / PALLET</th>
              <th>STUCCO / GROUT</th>
            </tr>
            <tr>
              <td>
                <table className="second-table">
                  <tr>
                    <th>PZ / PCS</th>
                    <td>{order.schemeBoxPcs}</td>
                  </tr>
                  <tr>
                    <th>MQ / Sqm</th>
                    <td>{order.schemeBoxSqm}</td>
                  </tr>
                  <tr>
                    <th>KG / KG</th>
                    <td>{order.schemeBoxKg}</td>
                  </tr>
                </table>
              </td>

              <td>
                <table className="second-table">
                  <tr>
                    <th>SCATOLE / BOXES</th>
                    <td>{order.schemePalletBoxes}</td>
                  </tr>
                  <tr>
                    <th>MQ / Sqm</th>
                    <td>{order.schemePalletSqm}</td>
                  </tr>
                  <tr>
                    <th>KG / KG</th>
                    <td>{order.schemePalletKg}</td>
                  </tr>
                </table>
              </td>

              <td>
                <table className="second-table">
                  <tr>
                    <th>KG / MQ</th>
                    <td rowspan="2">{order.schemeGroutKgSqm}</td>
                  </tr>
                  <tr>
                    <th>KG / Sqm</th>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
        <div id="order-review">
          <h3>Order review</h3>
          <h5>Order information</h5>
          <table className="main-table">
            <tr>
              <th>SCATOLE / BOXES</th>
              <td>{order.boxAmounts}</td>
            </tr>
            <tr>
              <th>WIDTH - LARGHEZZA / HEIGHT - ALTEZZA</th>
              <td>
                {order.width}cm / {order.height}cm
              </td>
            </tr>
            <tr>
              <th>WASTE - SFRIDO</th>
              <td>{order.sfrido}%</td>
            </tr>
            <tr>
              <th>MQ / Sqm (without sfrido)</th>
              <td>{order.sqmWOSfrido}</td>
            </tr>
            <tr>
              <th>MQ / Sqm (with sfrido)</th>
              <td>{order.sqm}</td>
            </tr>
            <tr>
              <th>KG / KG</th>
              <td>{order.totalKgs}</td>
            </tr>
            <tr>
              <th>STUCCO KG / GROUT KG</th>
              <td>{order.groutTotalKgs}</td>
            </tr>
            <tr>
              <th>STUCCO SCATOLE / GROUT BOXES</th>
              <td>{order.groutBoxes}</td>
            </tr>
            <tr>
              <th>CODICE PRODOTTO / TILES CODE</th>
              <td>{order.orderCode}</td>
            </tr>
            <tr>
              <th>STUCCO CODICE / GROUT CODE</th>
              <td>{order.groutCode}</td>
            </tr>
          </table>

          <h5>Order tiles</h5>
          <table className="main-table">
            <tr id="tiles-header">
              <th>Tile type</th>
              {rows.header}
            </tr>
            <tr id="tiles-amount-dot">
              <th>Dot</th>
              {rows.dot}
            </tr>
            <tr id="tiles-amount-square">
              <th>Square</th>
              {rows.square}
            </tr>
            <tr id="tiles-amount-rectangular">
              <th>Rectangular</th>
              {rows.rectangular}
            </tr>
            <tr id="tiles-amount-squarex4">
              <th>Squarex4</th>
              {rows.squarex4}
            </tr>
            <tr id="tiles-amount-rectangularx4">
              <th>Rectangularx4</th>
              {rows.rectangularx4}
            </tr>
            <tr id="tiles-amount-trapezes">
              <th>Trapezes</th>
              {rows.trapezes}
            </tr>
            <tr id="tiles-amount-total">
              <th>Total</th>
              {rows.total}
            </tr>
          </table>

          <h5>Order snapshot</h5>
          <img className="orderImage" src={orderImage} />

          <h5>Customer information</h5>

          <table className="main-table">
            <tr>
              <th>Nome / Name</th>
              <td>
                <input
                  className="form-input"
                  type="text"
                  name="name"
                  onChange={onChange}
                />
              </td>
            </tr>
            <tr>
              <th>Cognome / Surname</th>
              <td>
                <input
                  className="form-input"
                  type="text"
                  name="surname"
                  onChange={onChange}
                />
              </td>
            </tr>
            <tr>
              <th>Azienda / Company</th>
              <td>
                <input
                  className="form-input"
                  type="text"
                  name="company"
                  onChange={onChange}
                />
              </td>
            </tr>
            <tr>
              <th>Professione / Job</th>
              <td>
                <input
                  className="form-input"
                  type="text"
                  name="job"
                  onChange={onChange}
                />
              </td>
            </tr>
            <tr>
              <th>Telefono / Phone</th>
              <td>
                <input
                  className="form-input"
                  type="text"
                  name="phone"
                  onChange={onChange}
                />
              </td>
            </tr>
            <tr>
              <th>Città / City</th>
              <td>
                <input
                  className="form-input"
                  type="text"
                  name="city"
                  onChange={onChange}
                />
              </td>
            </tr>
            <tr>
              <th>Paese / Country</th>
              <td>
                <input
                  className="form-input"
                  type="text"
                  name="country"
                  onChange={onChange}
                />
              </td>
            </tr>
            <tr>
              <th>Email</th>
              <td>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  onChange={onChange}
                />
              </td>
            </tr>
          </table>
        </div>
        <button
          className="outline-btn download-pdf"
          onClick={onDownloadPdf}
        >
          Download PDF
        </button>
      </div>

      <div className="nav-buttons">
        <button className="outline-btn nav-btn" onClick={() => changePage(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          BACK
        </button>
        <button
          className="outline-btn nav-btn nav-btn-center"
          onClick={() => window.scrollTo(0, 0)}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button className="outline-btn nav-btn" onClick={sendOrder}>
          SEND
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default SchemeOrder;

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
