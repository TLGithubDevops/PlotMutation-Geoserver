// 'use strict';
// require('dotenv').config()
// const TLands = require('./tlandsdb.schema');
// const { createMultiProjectsLayer, insertPointFeature, createSingleProjectLayer, createFeature, geoserverWFST } = require('./geoserver');

// const gid = "01GPWQAET9ENJ489BQDCPNYYSB";
// const id = "01GQF20F1W95YQWPPQ5FAPV84E";

// async function update_tl_projects() {
//     try {
//         const proj = await TLands.get({ PK: "ORG#" + gid, SK: "PRJT#" + id })
//         const projectLabel = proj?.projGeoDataReference?.label
//         const plots = await TLands.query("PK1").eq(`PLOT#${proj.gid}`).and().where("SK1").beginsWith(`ORG#${proj.gid}#PRJT#${proj.id}#ZONE#`).exec();
//         let projPriceRange = [], projAreaRange = [], totalplots = plots.length, availableplots = 0, geoserverPlots = 0;
//         for await (let p of plots) {
//             if (p?.plotStatus == "Available") {
//                 console.log(p.plotName)
//                 availableplots++;
//                 projPriceRange.push(p?.plotPrice)
//                 projAreaRange.push(p?.plotAreaDetails?.area)
//             }
//             geoserverPlots++;
//         }
//         console.log({ projectLabel, totalplots, geoserverPlots })
//         if (await geoserverWFST(process.env.TL_PRPJECTS_LAYERNAME, "projid", id, {
//             pricemin: projPriceRange.length ? Math.min(...projPriceRange) : 0,
//             pricemax: projPriceRange.length ? Math.max(...projPriceRange) : 0,
//             areamin: projAreaRange.length ? Math.min(...projAreaRange) : 0,
//             areamax: projAreaRange.length ? Math.max(...projAreaRange) : 0,
//             totalplots: totalplots,
//             availableplots: availableplots
//         }))
//             console.log("updated")
//     } catch (error) {
//         console.log({ error })
//     }
// }
// update_tl_projects()

// 'use strict';
// require('dotenv').config()
// const TLands = require('./tlandsdb.schema');
// const { createMultiProjectsLayer, insertPointFeature, createSingleProjectLayer, createFeature } = require('./geoserver');


// async function update(projectLabel, PK, SK) {
//     console.log(projectLabel)
//     const p = await TLands.get({ PK, SK })
//     console.log(p); return;
//     if (p && p?.plotGeoDataReference) {
//         let dimension = p?.plotAreaDetails?.dimension && typeof p?.plotAreaDetails?.dimension != undefined ? p?.plotAreaDetails?.dimension : null
//         if (await createFeature(projectLabel, p?.plotGeoDataReference?.geom, p.id, p.plotName, p.plotStatus, "sqft", p.plotAreaDetails.area, p.plotFacing, p?.plotPrice, dimension, p?.plotGeoDataReference?.plotType))
//             console.log("OK")
//     }
// }
// update("HC-ABV", "ORG#01GPWQAET9ENJ489BQDCPNYYSB", "PLOT#01GQF21NSR3YVMPFRP49VZ9FSW")