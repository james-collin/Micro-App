import React, { useState, useEffect } from "react";

import NavButtons from "./NavButtons";
import colors from "../assets/api/colors.json";
import fugaColors from "../assets/api/fugaColors.json";
import TileMap from "./structures";

let tiles;

const ColorModal = ({
  colors,
  visible,
  colorName,
  setVisible,
  onChange,
  checked,
  ...props
}) => {
  const classname = visible ? "color-modal visible" : "color-modal";

  return (
    <div className={classname}>
      <div className="border">
        <h3>{colorName}</h3>
        <div className="color-grid">
          {Object.keys(colors).map(color => (
            <label className="color-column" onChange={onChange}>
              <input
                type="radio"
                name="color-selector"
                className="color-selector"
                value={color}
                checked={checked === color ? true : false}
              />
              <div
                className="color-fill"
                style={{ background: colors[color] }}
              />
            </label>
          ))}
        </div>
        <button className="outline-btn" onClick={() => setVisible(false)}>
          Ok
        </button>
      </div>
    </div>
  );
};

const SchemeVisualization = ({
  order,
  setOrder,
  changePage,
  setOrderImage,
  ...props
}) => {
  const [paper, setPaper] = useState({});
  const [colorModal, setColorModal] = useState({
    name: "Color 1",
    checked: "white",
    colors: colors,
    type: "color",
    id: 0
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setPaper(initSvg(order));
  }, [order]);

  useEffect(() => {
    initControls();
  }, []);

  const openModal = (color, colorId, type) => e => {
    setColorModal({
      type,
      id: colorId,
      name: type === "color" ? `Color ${colorId + 1}: ${color}` : `Fuga: ${color}`,
      checked: color,
      colors: type === "color" ? colors : fugaColors
    });
    setModalVisible(true);
  };

  const onChange = e => {
    if (colorModal.type === "color") {
      order.colors[colorModal.id] = e.target.value;

      setColorModal({
        ...colorModal,
        checked: e.target.value,
        name: `Color ${colorModal.id + 1}: ${e.target.value}`,
      });

    } else if (colorModal.type === "fuga") {
      order.fugaColor = e.target.value;

      setColorModal({
        ...colorModal,
        checked: e.target.value,
        name: `Fuga: ${e.target.value}`,
      });
    }

    tiles.update(order);
    setOrder(tiles.updateOrder());
  };

  return (
    <div id="page-visualization" {...props}>
      <div className="reset-button">
        <button id="reset" className="outline-btn">
          Reset
        </button>
      </div>
      <div id="color-modals">
        <ColorModal
          colorName={colorModal.name}
          colors={colorModal.colors}
          visible={modalVisible}
          setVisible={setModalVisible}
          onChange={onChange}
          checked={colorModal.checked}
        />
      </div>
      <div id="tiles-layout">
        <h2>{order.schemeTitle}</h2>
        <h3>{order.schemeColorTitle}</h3>
        <div className="color-selectors">
          {order.colors.map((el, id) => (
            <div className="color" key={id}>
              <span>{`Color ${id + 1}`}</span>
              <div
                onClick={openModal(el, id, "color")}
                className="color-fill"
                style={{
                  background: colors[el]
                }}
              />
            </div>
          ))}
          <div className="color color-fuga">
            <span>{`Fuga / Joint`}</span>
            <div
              onClick={openModal(order.fugaColor, 0, "fuga")}
              className="color-fill"
              style={{
                background: fugaColors[order.fugaColor]
              }}
            />
          </div>
        </div>
        <div className="order-sizes">
          <span>{`width - larghezza: ${order.width}cm`}</span>
          <span>{`height - altezza: ${order.height}cm`}</span>
        </div>
      </div>
      <svg id="tiles" />
      <svg id="svg-pivot">
        <circle id="pivot" className="pivot" cx="0" cy="0" r="6" />
      </svg>
      <NavButtons
        onBack={() => changePage(-1)}
        onNext={async () => {
          paper.attr({ viewBox: "0 0 2600 1400" });
          const orderImageData = await svgString2Image(
            paper.toDataURL(),
            1300,
            700
          );
          setOrderImage(orderImageData);
          changePage(+1);
        }}
      />
    </div>
  );
};

export default SchemeVisualization;

function initSvg(order) {
  let paper = window.Snap("#tiles");
  paper.attr({ viewBox: "0 0 2600 1400" });

  let tilesGroup = paper.group();
  tilesGroup.attr({ id: "tiles-group" });

  render();

  return paper;

  function render() {
    let xi = 210;
    let yi = 100;

    //gui.clear();
    let s = paper.select("#tiles-group");
    s.clear();

    /*
    fuga = s.rect(xi + 100, yi + 100, xCursorPos * 10, yCursorPos * 10).attr({
      fill: fugaColors[order.fugaColor]
    });*/

    renderTiles(s, xi + 100, yi + 100);
    renderGrid(s, xi, yi);
    document.querySelector("#reset").click();
  }

  function renderTiles(s, xi, yi) {
    tiles = new TileMap(xi, yi, order);

    tiles.draw(s);
    order = tiles.updateOrder();
  }

  function renderGrid(s, xi, yi) {
    // Axis lines
    let xLine = s.line(xi, yi, xi + 2100, yi).attr({
      stroke: "#888",
      strokeWidth: 2,
      strokeLinecap: "round"
    });

    let yLine = s.line(xi, yi, xi, yi + 1100).attr({
      stroke: "#888",
      strokeWidth: 2,
      strokeLinecap: "round"
    });

    // Area layout lines

    let xCursorPos = order.width > 200 ? 200 : order.width;
    let yCursorPos = order.height > 100 ? 100 : order.height;

    let x1CursorLine = s.line(xi + 100, yi, xi + 100, yi + 1100).attr({
      stroke: "#444",
      strokeWidth: 5,
      strokeLinecap: "round",
      "stroke-dasharray": 20 + " " + 20
    });

    let x2CursorLine = s
      .line(
        xCursorPos * 10 + xi + 100,
        yi,
        xCursorPos * 10 + xi + 100,
        yi + 1100
      )
      .attr({
        stroke: "#444",
        strokeWidth: 5,
        strokeLinecap: "round",
        "stroke-dasharray": 20 + " " + 20
      });

    let xCursorPosText = s
      .text(xCursorPos * 10 + xi + 100, yi - 50, xCursorPos + "cm")
      .attr({
        "font-size": 50
      });
    let xCursor = s.circle(xCursorPos * 10 + xi + 100, yi, 30).attr({
      fill: "#ccc",
      stroke: "#888",
      strokeWidth: 2
    });

    let y1CursorLine = s.line(xi, yi + 100, xi + 2100, yi + 100).attr({
      stroke: "#444",
      strokeWidth: 5,
      strokeLinecap: "round",
      "stroke-dasharray": 20 + " " + 20
    });

    let y2CursorLine = s
      .line(
        xi,
        yi + yCursorPos * 10 + 100,
        xi + 2100,
        yi + 100 + yCursorPos * 10
      )
      .attr({
        stroke: "#444",
        strokeWidth: 5,
        strokeLinecap: "round",
        "stroke-dasharray": 20 + " " + 20
      });

    let yCursorPosText = s
      .text(xi - 200, yi + yCursorPos * 10 + 100, yCursorPos + "cm")
      .attr({
        "font-size": 50
      });
    let yCursor = s.circle(xi, yi + yCursorPos * 10 + 100, 30).attr({
      fill: "#ccc",
      stroke: "#888",
      strokeWidth: 2
    });
  }
}

const initControls = () => {
  let svg = document.querySelector("#tiles");
  let reset = document.querySelector("#reset");
  let pivot = document.querySelector("#pivot");
  let proxy = document.createElement("div");
  let viewport = document.querySelector("#tiles-group");

  let rotateThreshold = 4;
  let reachedThreshold = false;

  let point = svg.createSVGPoint();
  let startClient = svg.createSVGPoint();
  let startGlobal = svg.createSVGPoint();

  let viewBox = svg.viewBox.baseVal;

  let cachedViewBox = {
    x: viewBox.x,
    y: viewBox.y,
    width: viewBox.width,
    height: viewBox.height
  };

  let zoom = {
    animation: new window.TimelineLite(),
    scaleFactor: 1.6,
    duration: 0.5,
    ease: window.Power2.easeOut
  };

  window.TweenLite.set(pivot, { scale: 0 });

  let resetAnimation = new window.TimelineLite();
  let pivotAnimation = window.TweenLite.to(pivot, 0.1, {
    alpha: 1,
    scale: 1,
    paused: true
  });

  let pannable = new window.Draggable(proxy, {
    throwResistance: 3000,
    trigger: viewport,
    throwProps: true,
    onPress: selectDraggable,
    onDrag: updateViewBox,
    onThrowUpdate: updateViewBox
  });

  let rotatable = new window.Draggable(viewport, {
    type: "rotation",
    trigger: svg,
    throwProps: true,
    liveSnap: true,
    snap: checkThreshold,
    onPress: selectDraggable
  });

  rotatable.disable();

  reset.addEventListener("click", resetViewport);
  svg.addEventListener("wheel", onWheel);
  window.addEventListener("resize", function() {
    pivotAnimation.reverse();
  });

  //
  // ON WHEEL
  // ===========================================================================
  function onWheel(event) {
    event.preventDefault();

    pivotAnimation.reverse();

    let normalized;
    let delta = event.wheelDelta;

    if (delta) {
      normalized = delta % 120 == 0 ? delta / 120 : delta / 12;
    } else {
      delta = event.deltaY || event.detail || 0;
      normalized = -(delta % 3 ? delta * 10 : delta / 3);
    }

    let scaleDelta = normalized > 0 ? 1 / zoom.scaleFactor : zoom.scaleFactor;

    point.x = event.clientX;
    point.y = event.clientY;

    if (
      (viewBox.width * scaleDelta > 2600 ||
        viewBox.height * scaleDelta > 1400) &&
      delta < 0
    ) {
      scaleDelta = 2600 / viewBox.width;
      scaleDelta = 1400 / viewBox.height;
    }

    let startPoint = point.matrixTransform(svg.getScreenCTM().inverse());

    let fromVars = {
      ease: zoom.ease,
      x: viewBox.x,
      y: viewBox.y,
      width: viewBox.width,
      height: viewBox.height
    };

    viewBox.x -= (startPoint.x - viewBox.x) * (scaleDelta - 1);
    viewBox.y -= (startPoint.y - viewBox.y) * (scaleDelta - 1);
    viewBox.width *= scaleDelta;
    viewBox.height *= scaleDelta;

    zoom.animation = window.TweenLite.from(viewBox, zoom.duration, fromVars);
  }

  //
  // SELECT DRAGGABLE
  // ===========================================================================
  function selectDraggable(event) {
    if (resetAnimation.isActive()) {
      resetAnimation.kill();
    }

    startClient.x = this.pointerX;
    startClient.y = this.pointerY;

    startGlobal = startClient.matrixTransform(svg.getScreenCTM().inverse());

    window.TweenLite.set(proxy, {
      x: this.pointerX,
      y: this.pointerY
    });

    rotatable.disable();
    pannable
      .enable()
      .update()
      .startDrag(event);
    pivotAnimation.reverse();
  }

  //
  // RESET VIEWPORT
  // ===========================================================================
  function resetViewport() {
    let duration = 0.8;
    let ease = window.Power3.easeOut;

    pivotAnimation.reverse();

    if (pannable.tween) {
      pannable.tween.kill();
    }

    if (rotatable.tween) {
      rotatable.tween.kill();
    }

    resetAnimation
      .clear()
      .to(
        viewBox,
        duration,
        {
          x: cachedViewBox.x,
          y: cachedViewBox.y,
          width: cachedViewBox.width,
          height: cachedViewBox.height,
          ease: ease
        },
        0
      )
      .to(
        viewport,
        duration,
        {
          attr: { transform: "matrix(1,0,0,1,0,0)" },
          // rotation: "0_short",
          smoothOrigin: false,
          svgOrigin: "0 0",
          ease: ease
        },
        0
      );
  }

  //
  // CHECK THRESHOLD
  // ===========================================================================
  function checkThreshold(value) {
    if (reachedThreshold) {
      return value;
    }

    let dx = Math.abs(this.pointerX - startClient.x);
    let dy = Math.abs(this.pointerY - startClient.y);

    if (dx > rotateThreshold || dy > rotateThreshold || this.isThrowing) {
      reachedThreshold = true;
      return value;
    }

    return this.rotation;
  }

  //
  // UPDATE VIEWBOX
  // ===========================================================================
  function updateViewBox() {
    if (zoom.animation.isActive()) {
      return;
    }

    point.x = this.x;
    point.y = this.y;

    let moveGlobal = point.matrixTransform(svg.getScreenCTM().inverse());

    viewBox.x -= moveGlobal.x - startGlobal.x;
    viewBox.y -= moveGlobal.y - startGlobal.y;
  }
};

function svgString2Image(svgString, width, height, format, callback) {
  return new Promise((resolve, reject) => {
    // set default for format parameter
    format = format ? format : "png";
    // SVG data URL from SVG string
    var svgData = svgString;
    // create canvas in memory(not in DOM)
    var canvas = document.createElement("canvas");
    // get canvas context for drawing on canvas
    var context = canvas.getContext("2d");
    // set canvas size
    canvas.width = width;
    canvas.height = height;
    // create image in memory(not in DOM)
    var image = new Image();
    // later when image loads run this
    image.onload = function() {
      // async (happens later)
      // clear canvas
      context.clearRect(0, 0, width, height);
      // draw image with SVG data to canvas
      context.drawImage(image, 0, 0, width, height);
      // snapshot canvas as png
      var pngData = canvas.toDataURL("image/" + format);
      // pass png data URL to callback
      resolve(pngData);
    }; // end async
    image.onerror = e => {
      console.log(e);
    };
    // start loading SVG data into in memory image
    image.src = svgData;
  });
}
