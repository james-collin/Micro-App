module.exports = order => {
  return new Promise((resolve, reject) => {
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
    order.colors.forEach((val, id) => {
      rows.header.push(
        `<td>
          Color ${id + 1}: <strong>${val}</strong> tiles
        </td>`
      );
      rows.dot.push(
        `<td>
          ${order.tilesCount.amountTilesDot[`color${parseInt(id) + 1}`]} tiles
        </td>`
      );
      rows.square.push(
        `<td>
          ${
            order.tilesCount.amountTilesSquare[`color${parseInt(id) + 1}`]
          } tiles
        </td>`
      );
      rows.rectangular.push(
        `<td>
          ${order.tilesCount.amountTilesRectangular[`color${parseInt(id) + 1}`]}
          tiles
        </td>`
      );
      rows.squarex4.push(
        `<td>
          ${
            order.tilesCount.amountTilesSquarex4[`color${parseInt(id) + 1}`]
          } tiles
        </td>`
      );
      rows.rectangularx4.push(
        `<td>
          ${
            order.tilesCount.amountTilesRectangularx4[
              `color${parseInt(id) + 1}`
            ]
          }
          tiles
        </td>`
      );
      rows.trapezes.push(
        `<td>
          ${order.tilesCount.amountTilesTrapezi[`color${parseInt(id) + 1}`]}
          tiles
        </td>`
      );
      rows.total.push(
        `<td>${
          order.tilesCount.amountTotal[`color${parseInt(id) + 1}`]
        } tiles</td>`
      );
    });

    let val = "total";

    rows.header.push(`<td>Total tiles</td>`);
    rows.dot.push(`<td>${order.tilesCount.amountTilesDot[val]} tiles</td>`);
    rows.square.push(
      `<td>${order.tilesCount.amountTilesSquare[val]} tiles</td>`
    );
    rows.rectangular.push(
      `<td>${order.tilesCount.amountTilesRectangular[val]} tiles</td>`
    );
    rows.squarex4.push(
      `<td>${order.tilesCount.amountTilesSquarex4[val]} tiles</td>`
    );
    rows.rectangularx4.push(
      `<td>${order.tilesCount.amountTilesRectangularx4[val]} tiles</td>`
    );
    rows.trapezes.push(
      `<td>${order.tilesCount.amountTilesTrapezi[val]} tiles</td>`
    );
    rows.total.push(`<td>${order.tilesCount.amountTotal[val]} tiles</td>`);

    resolve(`
      <html lang="en" class="gr__localhost">
        <head>
          <meta charset="utf-8" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="Web site created using create-react-app"
          />
          <link rel="apple-touch-icon" href="logo192.png" />
          <link rel="manifest" href="/manifest.json" />
          <title>Micro</title>
        </head>
  
        <body data-gr-c-s-loaded="true">
          <div id="root">
            <div class="App">
              <section class="container">
                <div id="ceramicax-creator" class="container">
                  <div id="order-page" class="page-section visible">
                    <div id="order-section">
                      <h2>Microtiles</h2>
                      <h2>${order.schemeTitle}</h2>
                      <h3>Schema / Scheme ${order.schemeNumber}</h3>
                      <h3>Catalogo Pag. / Catalogue Pag. ${order.schemePage}</h3>
                      <br />
                      <div class="order-content">
                        <img class="schemeImage" src=${order.schemeImg} />

                        <table class="main-table">
                          <tr>
                            <th>FORMATI / SIZES</th>
                            <td>${order.schemeSizes}</td>
                          </tr>
                          <tr>
                            <th>SPESSORE / THICKNESS</th>
                            <td>${order.schemeThickness}</td>
                          </tr>
                          <tr>
                            <th>FORNITO / DELIVERED</th>
                            <td>Su rete <br />Mesh mounted</td>
                          </tr>
                        </table>
  
                        <table class="main-table">
                          <tr>
                            <th>SCATOLA / BOX</th>
                            <th>PALLET / PALLET</th>
                            <th>STUCCO / GROUT</th>
                          </tr>
                          <tr>
                            <td>
                              <table class="second-table">
                                <tr>
                                  <th>PZ / PCS</th>
                                  <td>${order.schemeBoxPcs}</td>
                                </tr>
                                <tr>
                                  <th>MQ / Sqm</th>
                                  <td>${order.schemeBoxSqm}</td>
                                </tr>
                                <tr>
                                  <th>KG / KG</th>
                                  <td>${order.schemeBoxKg}</td>
                                </tr>
                              </table>
                            </td>
                            <td>
                              <table class="second-table">
                                <tr>
                                  <th>SCATOLE / BOXES</th>
                                  <td>${order.schemePalletBoxes}</td>
                                </tr>
                                <tr>
                                  <th>MQ / Sqm</th>
                                  <td>${order.schemePalletSqm}</td>
                                </tr>
                                <tr>
                                  <th>KG / KG</th>
                                  <td>${order.schemePalletKg}</td>
                                </tr>
                              </table>
                            </td>
                            <td>
                              <table class="second-table">
                                <tr>
                                  <th>KG / MQ</th>
                                  <td rowspan="2">${order.schemeGroutKgSqm}</td>
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
                        <table class="main-table">
                          <tr>
                            <th>SCATOLE / BOXES</th>
                            <td>${order.boxAmounts}</td>
                          </tr>
                          <tr>
                            <th>WIDTH - LARGHEZZA / HEIGHT - ALTEZZA</th>
                            <td>${order.width}cm / ${order.height}cm</td>
                          </tr>
                          <tr>
                            <th>WASTE - SFRIDO</th>
                            <td>${order.sfrido}%</td>
                          </tr>
                          <tr>
                            <th>MQ / Sqm (without sfrido)</th>
                            <td>${order.sqmWOSfrido}</td>
                          </tr>
                          <tr>
                            <th>MQ / Sqm (with sfrido)</th>
                            <td>${order.sqm}</td>
                          </tr>
                          <tr>
                            <th>KG / KG</th>
                            <td>${order.totalKgs}</td>
                          </tr>
                          <tr>
                            <th>STUCCO KG / GROUT KG</th>
                            <td>${order.groutTotalKgs}</td>
                          </tr>
                          <tr>
                            <th>STUCCO SCATOLE / GROUT BOXES</th>
                            <td>${order.groutBoxes}</td>
                          </tr>
                          <tr>
                            <th>CODICE PRODOTTO / TILES CODE</th>
                            <td>${order.orderCode}</td>
                          </tr>
                          <tr>
                            <th>STUCCO CODICE / GROUT CODE</th>
                            <td>${order.groutCode}</td>
                          </tr>
                        </table>
  
                        <h5>Order tiles</h5>
                        <table class="main-table">
                          <tr id="tiles-header">
                            <th>Tile type</th>
                            ${rows.header}
                          </tr>
                          <tr id="tiles-amount-dot">
                            <th>Dot</th>
                            ${rows.dot}
                          </tr>
                          <tr id="tiles-amount-square">
                            <th>Square</th>
                            ${rows.square}
                          </tr>
                          <tr id="tiles-amount-rectangular">
                            <th>Rectangular</th>
                            ${rows.rectangular}
                          </tr>
                          <tr id="tiles-amount-squarex4">
                            <th>Squarex4</th>
                            ${rows.squarex4}
                          </tr>
                          <tr id="tiles-amount-rectangularx4">
                            <th>Rectangularx4</th>
                            ${rows.rectangularx4}
                          </tr>
                          <tr id="tiles-amount-trapezes">
                            <th>Trapezes</th>
                            ${rows.trapezes}
                          </tr>
                          <tr id="tiles-amount-total">
                            <th>Total</th>
                            ${rows.total}
                          </tr>
                        </table>
  
                        <h5 class="order-snapshot-title">Order snapshot</h5>
                        <img class="orderImage" src=${order.orderImage} />

                        <h5>Customer information</h5>
                        <table class="main-table">
                          <tr>
                            <th>Nome / Name</th>
                            <td>
                              <input class="form-input" type="text" value="${order.customer.name}"/>
                            </td>
                          </tr>
                          <tr>
                            <th>Cognome / Surname</th>
                            <td>
                              <input class="form-input" type="text" value="${order.customer.surname}"/>
                            </td>
                          </tr>
                          <tr>
                            <th>Azienda / Company</th>
                            <td>
                              <input class="form-input" type="text" value="${order.customer.company}"/>
                            </td>
                          </tr>
                          <tr>
                            <th>Professione / Job</th>
                            <td>
                              <input class="form-input" type="text" value="${order.customer.job}"/>
                            </td>
                          </tr>
                          <tr>
                            <th>Telefono / Phone</th>
                            <td>
                              <input class="form-input" type="text" value="${order.customer.phone}"/>
                            </td>
                          </tr>
                          <tr>
                          <th>Città / City</th>
                            <td>
                              <input className="form-input" type="text" value="${order.customer.city}"/>
                            </td>
                          </tr>
                          <tr>
                            <th>Paese / Country</th>
                            <td>
                              <input className="form-input" type="text" value="${order.customer.country}" />
                            </td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td>
                              <input class="form-input" type="text" value="${order.customer.email}"/>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </body>
      </html>`);
  });
};
