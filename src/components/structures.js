import schemesStructures from "../assets/api/schemes_structures.json";
import colors from "../assets/api/colors.json";
import fugaColors from "../assets/api/fugaColors.json";
import code from "../assets/api/code.json";

const size = 25;

//
//  TILES CLASSES
//

//  Dot
//  2.5cm * 2.5cm
class Dot {
  constructor(s, x, y, color, colorType, r, t, fuga) {
    this.s = s;
    this.x = x;
    this.y = y;
    this.fuga = fuga;

    if (color) {
      this.draw(color, colorType);
    }
  }

  canBeDrawn(limitX, limitY) {
    return limitX <= this.x && limitY <= this.y;
  }

  draw(color, colorType) {
    this.fig = this.s.rect(this.x, this.y, size, size);
    this.colorType = colorType;

    this.fig.attr({
      fill: color
    });
  }
}

//  Square
//  5cm * 5cm
class Square {
  constructor(s, x, y, color, colorType, r, t, fuga) {
    this.s = s;
    this.x = x;
    this.y = y;
    this.fuga = fuga;

    if (color) {
      this.draw(color, colorType);
    }
  }

  canBeDrawn(limitX, limitY) {
    return (
      limitX <= this.x + size * 1 + this.fuga &&
      limitY <= this.y + size * 1 + this.fuga
    );
  }

  draw(color, colorType, r, t) {
    this.fig = this.s.rect(
      this.x,
      this.y,
      size * 2 + this.fuga,
      size * 2 + this.fuga
    );
    this.colorType = colorType;

    this.fig.attr({
      fill: color
    });
  }
}

// Rectangular
// 10cm * 5cm
class Rectangular {
  constructor(s, x, y, color, colorType, r, t, fuga) {
    this.s = s;
    this.x = x;
    this.y = y;
    this.r = r;
    this.fuga = fuga;

    if (color) {
      this.draw(color, colorType, r, t);
    }
  }

  canBeDrawn(limitX, limitY) {
    let width = size * 3 + this.fuga * 2;
    let height = size * 1 + this.fuga;

    let offSetX = this.x + (this.r === 2 ? height : width);
    let offSetY = this.y + (this.r === 2 ? width : height);

    return limitX <= offSetX && limitY <= offSetY;
  }

  draw(color, colorType, r, t) {
    this.fig = this.s.rect(
      this.x,
      this.y,
      size * 4 + this.fuga * 3,
      size * 2 + this.fuga
    );
    this.colorType = colorType;

    this.fig.attr({
      fill: color
    });

    if (r || t) {
      transform(r, t, this.fig, size + this.fuga);
    }
  }
}

// Square x4
// 10cm * 10cm
class Squarex4 {
  constructor(s, x, y, color, colorType, r, t, fuga) {
    this.s = s;
    this.x = x;
    this.y = y;
    this.fuga = fuga;

    if (color) {
      this.draw(color, colorType);
    }
  }

  canBeDrawn(limitX, limitY) {
    return (
      limitX <= this.x + size * 3 + this.fuga * 2 &&
      limitY <= this.y + size * 3 + this.fuga * 2
    );
  }

  draw(color, colorType) {
    this.fig = this.s.rect(
      this.x,
      this.y,
      size * 4 + this.fuga * 3,
      size * 4 + this.fuga * 3
    );
    this.colorType = colorType;

    this.fig.attr({
      fill: color
    });
  }
}

// Rectangular x4
// 20cm * 10cm
class Rectangularx4 {
  constructor(s, x, y, color, colorType, r, t, fuga) {
    this.s = s;
    this.x = x;
    this.y = y;
    this.r = r;
    this.fuga = fuga;

    if (color) {
      this.draw(color, colorType, r, t);
    }
  }

  canBeDrawn(limitX, limitY) {
    let offSetX = this.x + (this.r === 2 ? size * 3 : size * 8);
    let offSetY = this.y + (this.r === 2 ? size * 8 : size * 3);

    return limitX <= offSetX && limitY <= offSetY;
  }

  draw(color, colorType, r, t) {
    this.fig = this.s.rect(
      this.x,
      this.y,
      size * 8 + this.fuga * 7,
      size * 4 + this.fuga * 3
    );
    this.colorType = colorType;

    this.fig.attr({
      fill: color
    });

    if (r || t) {
      transform(r, t, this.fig, size * 2 + this.fuga * 2);
    }
  }
}

// Rectangular x4
// 20cm * 10cm
class Trapezi {
  constructor(s, x, y, color, colorType, r, t, fuga) {
    this.s = s;
    this.x = x;
    this.y = y;
    this.r = r;
    this.fuga = fuga;

    if (color) {
      this.draw(color, colorType, r, t);
    }
  }

  canBeDrawn(limitX, limitY) {
    let offSetX = this.x;
    let offSetY = this.y;

    return limitX <= offSetX && limitY <= offSetY;
  }

  draw(color, colorType, r, t) {
    this.fig = this.s.polygon([
      this.x,
      this.y,
      this.x + 34.13,
      this.y,
      this.x + 69.06,
      this.y + 104.8,
      this.x,
      this.y + 104.8
    ]);
    this.colorType = colorType;

    this.fig.attr({
      fill: color
    });

    if (r || t) {
      transform(r, t, this.fig, 8.7);
    }
  }
}

const TileObjects = {
  Dot,
  Square,
  Rectangular,
  Squarex4,
  Rectangularx4,
  Trapezi
};

// TILEMAP CLASS

export default class TileMap {
  constructor(x, y, order) {
    this.tiles = [];
    this.x = x;
    this.y = y;

    this.order = resetOrder(order);
  }

  update(order) {
    this.fuga.attr({ fill: fugaColors[order.fugaColor] });
    this.order.colors = order.colors;
    let tilesColors = getColors(this.order.colors, this);

    for (let i = 0; i < this.tiles.length; i++) {
      let key = this.tiles[i].colorType;
      this.tiles[i].fig.attr({ fill: tilesColors[key] });
    }
  }

  updateOrder() {
    this.order = calculateOrderUpdate(this.order);
    return this.order;
  }

  draw(s) {
    let xCursorPos = this.order.width > 200 ? 200 : this.order.width;
    let yCursorPos = this.order.height > 100 ? 100 : this.order.height;
    this.fuga = s.rect(this.x, this.y, xCursorPos * 10, yCursorPos * 10).attr({
      fill: fugaColors[this.order.fugaColor]
    });

    let tilesColors = getColors(this.order.colors, this);

    this.order.widthWithSfrido =
      this.order.width * (1 + this.order.sfrido / 100);
    this.order.heightWithSfrido =
      this.order.height * (1 + this.order.sfrido / 100);

    this.sizeX = this.order.widthWithSfrido / 2.5;
    this.sizeY = this.order.heightWithSfrido / 2.5;

    if (!this.order.schemeType) return;

    drawLayout(this, tilesColors, s);
  }
}

const drawLayout = (tileMap, tilesColors, s) => {
  tileMap.sizeX = tileMap.order.widthWithSfrido / 2.5;
  tileMap.sizeY = tileMap.order.heightWithSfrido / 2.5;

  const type = tileMap.order.schemeType.match(/x4/i) ? "typex4" : "type";

  let {
    tilesMap,
    tilesDesc,
    tilesColorAlgorithm,
    width,
    height,
    startPoint,
    stepHorizontalOffset,
    stepVerticalOffset,
    forcex4
  } = schemesStructures[tileMap.order.scheme];

  if (
    tilesColorAlgorithm &&
    tilesColorAlgorithm[tileMap.order.schemeColorType]
  ) {
    stepHorizontalOffset =
      tilesColorAlgorithm[tileMap.order.schemeColorType].stepHorizontalOffset;
    stepVerticalOffset =
      tilesColorAlgorithm[tileMap.order.schemeColorType].stepVerticalOffset;
  }

  if (type === "typex4" || forcex4) {
    tilesMap = tilesMap
      .map(e => {
        let amplied = [e.map(d => [d, 0]).flat()];

        return [...amplied, new Array(width * 2).fill(0)];
      })
      .flat();
    width = width * 2;
    height = height * 2;
    stepHorizontalOffset = {
      x: stepHorizontalOffset.x * 2,
      y: stepHorizontalOffset.y * 2
    };
    stepVerticalOffset = {
      x: stepVerticalOffset.x * 2,
      y: stepVerticalOffset.y * 2
    };
  }

  startPoint = startPoint[type];

  // Calculate Y point to next scheme draw
  for (
    let i = 0 - startPoint.y;
    i < tileMap.sizeY + height + 4;
    i += stepVerticalOffset.y
  ) {
    let verticalStep = Math.floor(
      (i / stepVerticalOffset.y) * stepVerticalOffset.x
    );

    // Calculate X point to next scheme draw
    for (
      let j = 0 - verticalStep - startPoint.x;
      j < tileMap.sizeX + width + 4;
      j += stepHorizontalOffset.x
    ) {
      // Loop scheme map

      for (let k = 0; k < height; k++) {
        for (let l = 0; l < width; l++) {
          let x =
            (j + l) * size +
            (j + l) * tileMap.order.fuga +
            tileMap.order.fuga +
            tileMap.x -
            106.4;
          let y =
            (i + k) * size +
            (i + k) * tileMap.order.fuga +
            tileMap.order.fuga +
            tileMap.y -
            106.4;

          let yIndex = Math.floor(k % height);
          let xIndex = Math.floor(l % width);

          const objId = tilesMap[yIndex][xIndex];

          let canBeDrawn = false;
          let tile;

          if (!tilesDesc[objId][type]) continue;

          tile = new TileObjects[tilesDesc[objId][type]](
            s,
            x,
            y,
            null,
            null,
            tilesDesc[objId].rotation,
            null,
            tileMap.order.fuga
          );
          canBeDrawn = tile.canBeDrawn(tileMap.x, tileMap.y);

          const color = tilesDesc[objId].color[tileMap.order.schemeColorType];

          let canDrawX = x - tileMap.x;
          let canDrawY = y - tileMap.y;

          if (
            tileMap.order.scheme === "trapezi" &&
            tilesDesc[objId].rotation === 8
          ) {
            canDrawX -= 25;
          }

          if (!canBeDrawn) {
            continue;
          }

          if (canDrawX > tileMap.order.widthWithSfrido * 10) {
            continue;
          }
          if (canDrawY > tileMap.order.heightWithSfrido * 10) {
            continue;
          }

          let amountTiles = "amountTiles" + tilesDesc[objId][type];
          tileMap.order.tilesCount[amountTiles][color]++;

          if (canDrawX > tileMap.order.width * 10) {
            continue;
          }
          if (canDrawY > tileMap.order.height * 10) {
            continue;
          }
          if (canDrawX > 2000 || canDrawY > 1000) {
            continue;
          }

          tile.draw(
            tilesColors[color],
            color,
            tilesDesc[objId].rotation,
            null,
            tileMap.order.fuga
          );
          tileMap.tiles.push(tile);
        }
      }
    }
  }
};

// ORDER STRUCTURE
const resetOrder = order => {
  let amountObject = {};

  for (let i in order.colors) {
    amountObject[`color${parseInt(i) + 1}`] = 0;
    amountObject[`color_glaze${parseInt(i) + 1}`] = 0;
    amountObject[`color_invglaze${parseInt(i) + 1}`] = 0;
  }

  order.tilesCount = {
    amountColors: order.colors.length,
    amountTilesDot: { ...amountObject },
    amountTilesSquare: { ...amountObject },
    amountTilesRectangular: { ...amountObject },
    amountTilesSquarex4: { ...amountObject },
    amountTilesRectangularx4: { ...amountObject },
    amountTilesTrapezi: { ...amountObject }
  };

  return order;
};

const getColors = (orderColors, e) => {
  let color1 = colors[orderColors[0]];
  let color2 = colors[orderColors[1]];
  let color3 = colors[orderColors[2]];
  let color4 = colors[orderColors[3]];
  let color5 = colors[orderColors[4]];
  let color6 = colors[orderColors[5]];

  let shadedColor = shadeColor2(color1, 0.5);
  let normalGradient = `l(1,0,0,0)${color1}-${shadedColor}`;
  let inverseGradient = `l(1,0,0,0)${shadedColor}-${color1}`;

  let color_glaze1 = normalGradient;
  let color_invglaze1 = inverseGradient;

  return {
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
    color_glaze1,
    color_invglaze1
  };
};

const calculateOrderUpdate = order => {
  order.sqm = (order.widthWithSfrido * order.heightWithSfrido) / 10000;
  order.sqmWOSfrido = (order.width * order.height) / 10000;

  let aux = Object.assign({}, order.tilesCount);

  let orderCode = "TG";

  let amountTotal = {
    total: 0
  };

  for (let [key, val] of Object.entries(aux)) {
    if (!Object.keys(val).length) continue;
    if (key === "amountTotal") continue;

    let sum = 0;

    for (let [colorName, amount] of Object.entries(val)) {
      if (colorName === "total") continue;

      let isGlazeed = false;

      if (colorName.match(/glaze/)) {
        isGlazeed = true;
        colorName = colorName.replace("_glaze", "");
        colorName = colorName.replace("_invglaze", "");
        val[colorName] += amount;
      }

      amount = parseInt(amount);

      if (!amountTotal[colorName]) amountTotal[colorName] = 0;

      amountTotal[colorName] += amount;
      sum += amount;

      if (!amount > 0) continue;

      let codeString = "";

      if (isGlazeed) codeString += "G";

      let index = parseInt(colorName.match(/color(.*)/)[1]) - 1;

      orderCode +=
        codeString +
        code.tilesCode[key.substring(11)] +
        code.colorCode[order.colors[index]];
    }

    val["total"] = sum;
    amountTotal.total += sum;
  }

  aux.amountTotal = amountTotal;

  orderCode += "." + code.schemeCode[order.scheme];

  order.orderCode = orderCode;
  order.tilesCount = aux;

  return order;
};

// UTILS FUNCTIONS
function transform(r, t, e, center) {
  let box = e.getBBox();
  let x = (box.x2 + box.x) / 2 - center;
  let y = (box.y2 + box.y) / 2;
  let query = "";

  e.node.style["transform-origin"] = x + "px " + y + "px";
  if (r === 2) {
    e.node.style.transform = "rotate(90deg)";
  } else if (r === 8) {
    e.node.style.transform = "rotate(180deg)";
  }

  if (t) {
    if (r == 2) {
      if (t == 2) {
        query += `t0,${box.height / 2}`;
      } else if (t == 8) {
        query += `t0,${-box.height / 2}`;
      } else if (t == 4) {
        query += `t${-box.height / 2},0`;
      }
    }
  }

  if (r) {
    if (r == 2) {
      query += `r90,${x},${y}`;
    } else if (r == 8) {
      query += `r270,${x},${y}`;
    } else if (r == 4) {
      query += `r180,${x},${y}`;
    }
  }

  //e.transform(query);
}

function shadeColor2(color, percent) {
  var f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}
