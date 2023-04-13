'use strict';
require('dotenv').config()
const TLands = require('./tlandsdb.schema');
const { createMultiProjectsLayer, insertPointFeature, createSingleProjectLayer, createFeature } = require('./geoserver');

const HCID = "01GPWQAET9ENJ489BQDCPNYYSB";
const TCID = "01GPWQAETATYSZKT75VJVD2P32";
const JLID = "01GPWQAETAZFJZCYD0VPNT9G7Z";

async function createGeoserverLayers(orgs) {
    console.log("start:", Date())
    try {
        await createMultiProjectsLayer();
        let geoserverProjects = 0;
        for await (let orgId of orgs) {
            let org = await TLands.get({ PK: "ORG", SK: orgId })
            if (!org?.orgShortName) {
                console.log("orgShortName:" + org?.orgShortName)
                continue;
            }
            // console.log(org?.orgShortName);continue;
            const projects = await TLands.query("PK1").eq(`PRJT#${orgId}`).using("GS1").exec();
            if (projects.length) {
                for await (let proj of projects) {
                    const projectLabel = proj?.projGeoDataReference?.label
                    const plots = await TLands.query("PK1").eq(`PLOT#${proj.gid}`).and().where("SK1").beginsWith(`ORG#${proj.gid}#PRJT#${proj.id}#ZONE#`).exec();
                    let projPriceRange = [], projAreaRange = [], totalplots = plots.length, availableplots = 0, geoserverPlots = 0;

                    proj.projAggregates.map(p => {

                    })
                    total_plots_count_by_status
                    console.log({ projectLabel, totalplots, geoserverPlots })
                    // if (await insertPointFeature({
                    //     layername: process.env.TL_PRPJECTS_LAYERNAME,
                    //     publish: proj?.projVisibility ? "SHOW" : "HIDE",
                    //     the_geom: `${proj.projGeoDataReference.lat},${proj.projGeoDataReference.lng}`,
                    //     lat: proj.projGeoDataReference.lat,
                    //     lng: proj.projGeoDataReference.lng,
                    //     orgid: `${proj.gid}`,
                    //     orgname: org?.orgShortName,
                    //     projid: `${proj.id}`,
                    //     projname: `${proj.projName}`,
                    //     category: `${proj.projCategory}`,
                    //     coverimg: `${proj.projBrandDetails.coverThumbnail}`,
                    //     address: JSON.stringify(proj.projAddress),
                    //     launchdate: proj.projLaunchDate ? proj.projLaunchDate.toISOString() : null,
                    //     completeddate: proj.projCompletedDate ? proj.projCompletedDate.toISOString() : null,
                    //     status: proj.projStatus,
                    //     pricemin: projPriceRange.length ? Math.min(...projPriceRange) : 0,
                    //     pricemax: projPriceRange.length ? Math.max(...projPriceRange) : 0,
                    //     areamin: projAreaRange.length ? Math.min(...projAreaRange) : 0,
                    //     areamax: projAreaRange.length ? Math.max(...projAreaRange) : 0,
                    //     totalplots: totalplots,
                    //     availableplots: availableplots
                    // }))
                    //     geoserverProjects++;
                    // else console.log("false")
                }
            }
        }
        console.log({ geoserverProjects })
    } catch (error) {
        console.log({ error })
    }
}
createGeoserverLayers([HCID, TCID, JLID])