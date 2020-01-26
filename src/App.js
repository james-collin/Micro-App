import React, { useState, useEffect } from "react";
import "./assets/scss/style.scss";

import html2canvas from "html2canvas";

import SchemesList from "./components/SchemesList";
import SchemeConfiguration from "./components/SchemeConfiguration";
import SchemeVisualization from "./components/SchemeVisualization";
import SchemeOrder from "./components/SchemeOrder";

import classNames from "classnames";

const ORDER = {
  scheme: null,
  schemeTitle: null,
  schemeImg: null,
  schemeID: null,
  schemeType: null,
  schemeSizes: null,
  schemeThickness: null,
  schemeBoxKg: null,
  schemeBoxPcs: null,
  schemeBoxSqm: null,
  schemeColorTitle: null,
  schemeColorType: null,
  colors: ["white", "white", "white"],
  fugaColor: "bianco-ghiaccio",
  width: null,
  height: null,
  sfrido: null,
  fuga: 1.6,
  tilesCount: {
    amountColors: 3,
    amountTilesDot: new Array(4).fill(0),
    amountTilesSquare: new Array(4).fill(0),
    amountTilesRectangular: new Array(4).fill(0),
    amountTilesSquarex4: new Array(4).fill(0),
    amountTilesRectangularx4: new Array(4).fill(0),
    amountTilesTrapezi: new Array(4).fill(0),
    amountTotal: new Array(4).fill(0)
  }
};

const App = () => {
  const [orderImage, setOrderImage] = useState("");
  const [schemeSelected, setSchemeSelected] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [order, setOrder] = useState(ORDER);

  const schemeClicked = (scheme, schemeID) => {
    window.scrollTo(0, 0);
    setSchemeSelected(schemeID);
    changePage(+1);

    const newOrder = {
      scheme: scheme.handle,
      schemeID: schemeID,
      schemeNumber: parseInt(schemeID) + 1,
      schemeTitle: scheme.title,
      schemePage: scheme.page
    };

    setOrder({ ...order, ...newOrder });
  };

  const changePage = change => {
    window.scrollTo(0, 0);
    setCurrentPage(currentPage + change);
  };

  const onChangeOrder = form => {
    const newOrder = {};

    newOrder.schemeType = form.schemeType.type;
    newOrder.schemeImg = form.schemeType.img;
    newOrder.custom = form.schemeType.custom ? true : false;
    if (!form.schemeType.custom) {
      newOrder.schemeSizes = form.schemeType.info.sizes;
      newOrder.schemeThickness = form.schemeType.info.thickness;

      newOrder.schemeBoxKg = form.schemeType.info.box.kg;
      newOrder.schemeBoxPcs = form.schemeType.info.box.pcs;
      newOrder.schemeBoxSqm = form.schemeType.info.box.sqm;

      newOrder.schemePalletBoxes = form.schemeType.info.pallet.boxes;
      newOrder.schemePalletSqm = form.schemeType.info.pallet.sqm;
      newOrder.schemePalletKg = form.schemeType.info.pallet.kg;

      newOrder.schemeGroutKgSqm = form.schemeType.info.grout.kgsqm;
    } else {
      newOrder.schemeSizes = "Custom";
      newOrder.schemeThickness = "Custom";

      newOrder.schemeBoxKg = "Custom";
      newOrder.schemeBoxPcs = "Custom";
      newOrder.schemeBoxSqm = "Custom";

      newOrder.schemePalletBoxes = "Custom";
      newOrder.schemePalletSqm = "Custom";
      newOrder.schemePalletKg = "Custom";

      newOrder.schemeGroutKgSqm = "Custom";
    }

    if (newOrder.schemeColorType !== form.schemeColor.type) {
      if (form.schemeColor.type === "6_COLOR") {
        newOrder.colors = [
          order.colors[0],
          order.colors[1] || "white",
          order.colors[2] || "white",
          order.colors[3] || "white",
          order.colors[4] || "white",
          order.colors[5] || "white"
        ];
      } else if (form.schemeColor.type === "4_COLOR") {
        newOrder.colors = [
          order.colors[0],
          order.colors[1] || "white",
          order.colors[2] || "white",
          order.colors[3] || "white"
        ];
      } else if (form.schemeColor.type.match(/3/)) {
        newOrder.colors = [
          order.colors[0],
          order.colors[1] || "white",
          order.colors[2] || "white"
        ];
      } else if (form.schemeColor.type.match(/2/)) {
        newOrder.colors = [order.colors[0], order.colors[1] || "white"];
      } else if (
        form.schemeColor.type === "1_COLOR" ||
        form.schemeColor.type === "GLAZE" ||
        form.schemeColor.type === "MIX_GLAZE"
      ) {
        newOrder.colors = [order.colors[0]];
      }
    }
    newOrder.schemeColorType = form.schemeColor.type;
    newOrder.schemeColorTitle = form.schemeColor.title;
    newOrder.height = form.height;
    newOrder.width = form.width;
    newOrder.sfrido = form.sfrido;

    setOrder({ ...order, ...newOrder });
  };

  const pageVisible =
    currentPage === 0
      ? "list"
      : currentPage === 1
      ? "configuration"
      : currentPage === 2
      ? "visualization"
      : "order";

  return (
    <div className="App">
      <section className="container">
        <div id="ceramicax-creator" className="container">
          {currentPage !== 3 && (
            <div id="title" style={{ marginLeft: currentPage === 1 ? 25 : 0 }}>
              <h1>Microtiles.</h1>
              <span>
                Design
                {order.scheme === "trapezi"
                  ? " Giampaolo Benedini"
                  : " Roberto Cicchinè"}
              </span>
            </div>
          )}
          <SchemesList
            style={{ marginBottom: 50 }}
            schemeClicked={schemeClicked}
            className={classNames("page-section", {
              visible: pageVisible === "list"
            })}
          />
          <SchemeConfiguration
            order={order}
            schemeSelected={schemeSelected}
            changePage={changePage}
            onChangeOrder={onChangeOrder}
            className={classNames("page-section", {
              visible: pageVisible === "configuration"
            })}
            page={pageVisible}
          />
          <SchemeVisualization
            order={order}
            setOrder={setOrder}
            changePage={changePage}
            setOrderImage={setOrderImage}
            className={classNames("page-section", {
              visible: pageVisible === "visualization"
            })}
          />
          <SchemeOrder
            orderImage={orderImage}
            order={order}
            changePage={changePage}
            className={classNames("page-section", {
              visible: pageVisible === "order"
            })}
          />
        </div>
      </section>
    </div>
  );
};

export default App;
