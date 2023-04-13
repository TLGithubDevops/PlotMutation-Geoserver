require("dotenv").config();
const TLands = require("./tlandsdb.schema");
const {
  createMultiProjectsLayer,
  insertPointFeature,
  createSingleProjectLayer,
  createFeature,
  geoserverWFST,
} = require("./geoserver");
var priceData = require("./price-data.json");
const HCID = "01GPWQAET9ENJ489BQDCPNYYSB";
const HC_BCN = "01GQF2AKVGM2WP3BVPG7SDC6AZ";
const HC_ABV = "01GQF20F1W95YQWPPQ5FAPV84E";
const HC_MDV = "01GQF2DSFQ3PK8CH5X2F1F36PV";
const HC_SAM = "01GQF1WGY719VNNFHA9EJBJRJ9";
const HC_ECH = "01GQF2CBN0MCNSHB653Y23118X";
// const TCID = "01GPWQAETATYSZKT75VJVD2P32";
// const JLID = "01GPWQAETAZFJZCYD0VPNT9G7Z";

async function update_price_db_geos(orgId, projId) {
  try {
    let org = await TLands.get({ PK: "ORG", SK: orgId });
    // console.log(org); return;
    if (!org?.orgShortName) {
      console.log("orgShortName:" + org?.orgShortName);
      return;
    }
    const proj = await TLands.get({ PK: "ORG#" + orgId, SK: "PRJT#" + projId });
    if (proj) {
      const projectLabel = proj?.projGeoDataReference?.label;
      console.log({ projectLabel });
      const plots = await TLands.query("PK1")
        .eq(`PLOT#${proj.gid}`)
        .and()
        .where("SK1")
        .beginsWith(`ORG#${proj.gid}#PRJT#${proj.id}#ZONE#`)
        .exec();
      let projPriceRange = [],
        projAreaRange = [],
        totalplots = plots.length,
        availableplots = 0,
        geoserverPlots = 0,
        geoPlotsCOunt = 0;
      for await (let p of plots) {
        const { PK, SK } = p;
        const { plotPrice, plotType } = await calculatePrice(
          p.plotAreaDetails.area,
          projectLabel,
          p.plotGeoDataReference.label
        );
        const params = {
          plotPrice,
          plotGeoDataReference: p.plotGeoDataReference,
        };
        params.plotGeoDataReference.plotType = plotType;
        p = await TLands.update({ PK, SK }, { $SET: params });
        if (p?.plotStatus == "Available") {
          availableplots++;
          projPriceRange.push(plotPrice);
          projAreaRange.push(p.plotAreaDetails.area);
        }
        const dimension =
          p?.plotAreaDetails?.dimension &&
          typeof p?.plotAreaDetails?.dimension != undefined
            ? p?.plotAreaDetails?.dimension
            : null;

        //to create
        if (
          await createFeature(
            projectLabel,
            p?.plotGeoDataReference?.geom,
            p.id,
            p.plotName,
            p.plotStatus,
            "sqft",
            p.plotAreaDetails.area,
            p.plotFacing,
            p?.plotPrice,
            dimension,
            p?.plotGeoDataReference?.plotType
          )
        )
          geoPlotsCOunt++;
        // to update
        // await geoserverWFST(projectLabel, "plotid", p.id, {
        //     pname: p.plotName,
        //     area: p.plotAreaDetails.area,
        //     price: p.plotPrice,
        //     plottype: p.plotGeoDataReference.plotType,
        //     // dimension
        // })
      }
      console.log({
        projectLabel,
        totalplots,
        geoserverPlots,
        availableplots,
        geoPlotsCOunt,
      });
      const tlProject = {
        publish: proj?.projVisibility ? "SHOW" : "HIDE",
        lat: proj.projGeoDataReference.lat,
        lng: proj.projGeoDataReference.lng,
        orgid: `${proj.gid}`,
        orgname: org?.orgShortName,
        projid: `${proj.id}`,
        projname: `${proj.projName}`,
        category: `${proj.projCategory}`,
        coverimg: `${proj.projBrandDetails.coverThumbnail}`,
        address: JSON.stringify(proj.projAddress),
        launchdate: proj.projLaunchDate
          ? proj.projLaunchDate.toISOString()
          : null,
        completeddate: proj.projCompletedDate
          ? proj.projCompletedDate.toISOString()
          : null,
        status: proj.projStatus,
        pricemin: projPriceRange.length ? Math.min(...projPriceRange) : 0,
        pricemax: projPriceRange.length ? Math.max(...projPriceRange) : 0,
        areamin: projAreaRange.length ? Math.min(...projAreaRange) : 0,
        areamax: projAreaRange.length ? Math.max(...projAreaRange) : 0,
        totalplots: totalplots,
        availableplots: availableplots,
      };
      await geoserverWFST(
        process.env.TL_PRPJECTS_LAYERNAME,
        "projid",
        proj.id,
        tlProject
      );
    }
  } catch (error) {
    console.log({ error });
  }
}
async function calculatePrice(a, projLabel, plotLabel) {
  // console.log({ a, projLabel, plotLabel }); return;
  let plot_price = null,
    plotType = null,
    price = 0,
    priceConf = priceData[projLabel] ? priceData[projLabel] : null;
  if (priceConf)
    var {
      Q_Min_area,
      Q_Max_area,
      Q_plot_price,
      H_Min_area,
      H_Max_area,
      H_plot_price,
      F_Min_area,
      F_Max_area,
      F_plot_price,
      premium,
      regular,
    } = priceConf;
  if (premium && regular) {
    if (premium.plots.includes(plotLabel)) {
      price = premium.price;
      plotType = "Premium";
    } else {
      price = regular.price;
      plotType = "Regular";
    }
  } else if (a >= Q_Min_area && a <= Q_Max_area) {
    price = Q_plot_price;
    plotType = "Quarter Acre";
  } else if (a >= H_Min_area && a <= H_Max_area) {
    price = H_plot_price;
    plotType = "Half Acre";
  } else if (a >= F_Min_area && a <= F_Max_area) {
    price = F_plot_price;
    plotType = "Full Acre";
  }
  const plotPrice = Math.round(Number(a * price));
  return { plotPrice, plotType };
}
update_price_db_geos(HCID, HC_BCN);
