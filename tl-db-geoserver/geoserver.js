require('dotenv').config()
var request = require('request')
// 65.1.112.65:8080
const { GEOSERVER_URL, WORKSPACE, DATASTORE, GEOSERVER_USERNAME, GEOSERVER_PASSWORD, TL_PRPJECTS_LAYERNAME } = process.env
const URL = `${GEOSERVER_URL}/geoserver/rest`
const WFS_URL = `${GEOSERVER_URL}/geoserver/wfs`
const S = "java.lang.String";
const G = "org.locationtech.jts.geom.Geometry"
const BD = "java.math.BigDecimal"
const L = "java.lang.Long"
const LAYER_PARAM = {
    method: 'POST',
    url: `${URL}/workspaces/${WORKSPACE}/datastores/${DATASTORE}/featuretypes`,
    headers: {
        'Content-type': 'text/xml',
        'Authorization': "Basic " + new Buffer.from(GEOSERVER_USERNAME + ":" + GEOSERVER_PASSWORD).toString("base64")
    }
}
const axios = require("axios");
const headers = {
    headers: {
        "Authorization": "Basic " + new Buffer.from(GEOSERVER_USERNAME + ":" + GEOSERVER_PASSWORD).toString("base64"),
        "Content-Type": "application/xml",
    }
}
exports.createSingleProjectLayer = async (layername, plotid, the_geom, name, status, area_unit, area, price, facing, dimension, plottype) => {
    // console.log({ layername, plotid, the_geom, name, status, area_unit, area, price, facing, dimension, plottype }); return;
    let config = LAYER_PARAM
    config.body = `<?xml version="1.0" encoding="UTF-8"?><featureType><name>${layername}</name><nativeName>${layername}</nativeName><namespace><name>${WORKSPACE}</name></namespace><title>${layername}</title><abstract></abstract><keywords><string>${layername}</string></keywords><metadatalinks><metadataLink><type>string</type><metadataType>string</metadataType><content>string</content></metadataLink></metadatalinks><dataLinks><metadataLink><type>string</type><content>string</content></metadataLink></dataLinks><nativeCRS>GEOGCS[&quot;WGS 84&quot;, DATUM[&quot;World Geodetic System 1984&quot;, SPHEROID[&quot;WGS 84&quot;, 6378137.0, 298.257223563, AUTHORITY[&quot;EPSG&quot;,&quot;7030&quot;]], AUTHORITY[&quot;EPSG&quot;,&quot;6326&quot;]], PRIMEM[&quot;Greenwich&quot;, 0.0, AUTHORITY[&quot;EPSG&quot;,&quot;8901&quot;]], UNIT[&quot;degree&quot;, 0.017453292519943295], AXIS[&quot;Geodetic longitude&quot;, EAST], AXIS[&quot;Geodetic latitude&quot;, NORTH], AUTHORITY[&quot;EPSG&quot;,&quot;4326&quot;]]</nativeCRS><srs>EPSG:4326</srs><store><name>${WORKSPACE}:${DATASTORE}</name><href>${URL}/workspaces/${WORKSPACE}/datastores/${DATASTORE}.json</href></store><cqlFilter>INCLUDE</cqlFilter><maxFeatures>10000</maxFeatures><numDecimals>6</numDecimals><responseSRS><string></string></responseSRS><overridingServiceSRS>true</overridingServiceSRS><skipNumberMatched>true</skipNumberMatched><circularArcPresent>true</circularArcPresent><linearizationTolerance>10</linearizationTolerance><attributes><attribute><name>${plotid}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>java.lang.String</binding><length>0</length></attribute><attribute><name>${the_geom}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>org.locationtech.jts.geom.Geometry</binding><length>0</length></attribute><attribute><name>${name}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>java.lang.String</binding><length>0</length></attribute><attribute><name>${status}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>java.lang.String</binding><length>0</length></attribute><attribute><name>${area_unit}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>java.lang.String</binding><length>0</length></attribute><attribute><name>${area}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>java.math.BigDecimal</binding><length>0</length></attribute><attribute><name>${price}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>java.lang.Long</binding><length>0</length></attribute><attribute><name>${facing}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>java.lang.String</binding><length>0</length></attribute><attribute><name>${dimension}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>java.lang.String</binding><length>0</length></attribute><attribute><name>${plottype}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>java.lang.String</binding><length>0</length></attribute></attributes></featureType>`;
    return await requesting(config)
}
async function requesting(config) {
    return new Promise((resolve, reject) => {
        request(config, function (err, res) {
            if (res?.statusCode == 201 || res?.statusCode == 200) {
                if (!res.body.includes("fid")) {
                    console.log(res?.body)
                    resolve(false)
                }
                else resolve(true)
            }
            else { if (!res.body.includes("already exists in store")) console.log(config); console.log(res.body); resolve(false) }
        })
    })
}
exports.createFeature = async (layername, coordinates, plotid, pname, status, area_unit, area, facing, price, dimension, plottype) => {
    // console.log({layername, coordinates, plotid, pname, status, area_unit, area, facing, price,dimension, plottype});return;
    let the_geom = "the_geom"
    const conf = LAYER_PARAM
    conf.url = WFS_URL
    conf.body = `<wfs:Transaction service="WFS" version="1.1.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:ne="http://www.openplans.org/ne" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd ${WFS_URL}/DescribeFeatureType?typename=${WORKSPACE}:${DATASTORE}"><wfs:Insert><${layername}><${the_geom}><gml:MultiPolygon srsName="EPSG:4326"><gml:polygonMember><gml:Polygon><gml:exterior><gml:LinearRing><gml:posList>${coordinates}</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></gml:polygonMember></gml:MultiPolygon></${the_geom}><plotid>${plotid}</plotid><pname>${pname}</pname><status>${status}</status><area_unit>${area_unit}</area_unit><area>${area}</area><price>${price}</price><facing>${facing}</facing><dimension>${dimension}</dimension><plottype>${plottype}</plottype></${layername}></wfs:Insert></wfs:Transaction>`
    return await requesting(conf)
}
const MultiProjectsLayer = () => {
    const params = {
        publish: S,
        the_geom: G,
        orgid: S,
        orgname: S,
        projid: S,
        projname: S,
        category: S,
        coverimg: S,
        lat: S,
        lng: S,
        address: S,
        launchdate: S,
        completeddate: S,
        status: S,
        pricemin: L,
        pricemax: L,
        areamin: BD,
        areamax: BD,
        availableplots: L,
        totalplots: L
    };
    const attributes = generateAttributes(params);
    return `<?xml version="1.0" encoding="UTF-8"?><featureType><name>${TL_PRPJECTS_LAYERNAME}</name><nativeName>${TL_PRPJECTS_LAYERNAME}</nativeName><namespace><name>${WORKSPACE}</name></namespace><title>${TL_PRPJECTS_LAYERNAME}</title><abstract></abstract><keywords><string>${TL_PRPJECTS_LAYERNAME}</string></keywords><metadatalinks><metadataLink><type>string</type><metadataType>string</metadataType><content>string</content></metadataLink></metadatalinks><dataLinks><metadataLink><type>string</type><content>string</content></metadataLink></dataLinks><nativeCRS>GEOGCS[&quot;WGS 84&quot;, DATUM[&quot;World Geodetic System 1984&quot;, SPHEROID[&quot;WGS 84&quot;, 6378137.0, 298.257223563, AUTHORITY[&quot;EPSG&quot;,&quot;7030&quot;]], AUTHORITY[&quot;EPSG&quot;,&quot;6326&quot;]], PRIMEM[&quot;Greenwich&quot;, 0.0, AUTHORITY[&quot;EPSG&quot;,&quot;8901&quot;]], UNIT[&quot;degree&quot;, 0.017453292519943295], AXIS[&quot;Geodetic longitude&quot;, EAST], AXIS[&quot;Geodetic latitude&quot;, NORTH], AUTHORITY[&quot;EPSG&quot;,&quot;4326&quot;]]</nativeCRS><srs>EPSG:4326</srs><store><name>${WORKSPACE}:${DATASTORE}</name><href>${URL}/workspaces/${WORKSPACE}/datastores/${DATASTORE}.json</href></store><cqlFilter>INCLUDE</cqlFilter><maxFeatures>100000</maxFeatures><numDecimals>6</numDecimals><responseSRS><string></string></responseSRS><overridingServiceSRS>true</overridingServiceSRS><skipNumberMatched>true</skipNumberMatched><circularArcPresent>true</circularArcPresent><linearizationTolerance>10</linearizationTolerance><attributes>${attributes}</attributes></featureType>`;
}
function generateAttributes(params) {
    let attributes = ``
    for (const [name, datatype] of Object.entries(params)) {
        attributes += `<attribute><name>${name}</name><minOccurs>0</minOccurs><maxOccurs>1</maxOccurs><nillable>true</nillable><binding>${datatype}</binding><length>0</length></attribute>`;
    }
    return attributes
}
exports.createMultiProjectsLayer = async () => {
    let config = LAYER_PARAM;
    config.body = MultiProjectsLayer()
    return await requesting(config)
}
exports.insertPointFeature = async (params) => {
    // console.log(params);return;
    let { the_geom, layername } = params
    let attributes = '';
    for (const [k, v] of Object.entries(params)) { attributes += `<${k}>${v}</${k}>`; }
    const conf = LAYER_PARAM
    conf.url = WFS_URL
    conf.body = `<wfs:Transaction service="WFS" version="1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:Tlands="http://www.openplans.org/${WORKSPACE}" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org/${WORKSPACE} ${WFS_URL}/DescribeFeatureType?typename=${WORKSPACE}:${layername}"><wfs:Insert><${layername}><the_geom><gml:Point srsDimension="2" srsName="urn:x-ogc:def:crs:EPSG:4326"><gml:coordinates decimal="." cs="," ts=" ">${the_geom}</gml:coordinates></gml:Point></the_geom>${attributes}</${layername}></wfs:Insert></wfs:Transaction>`;
    return await requesting(conf)
}
// exports.createProjectOutlineLayer = async () => {
//     let config = LAYER_PARAM;
//     const params = {
//         the_geom: G,
//         projid: S,
//     };
//     const attributes = generateAttributes(params);
//     config.body = `<?xml version="1.0" encoding="UTF-8"?><featureType><name>${TL_PRPJECTS_OUTLINES}</name><nativeName>${TL_PRPJECTS_OUTLINES}</nativeName><namespace><name>${WORKSPACE}</name></namespace><title>${TL_PRPJECTS_OUTLINES}</title><abstract></abstract><keywords><string>${TL_PRPJECTS_OUTLINES}</string></keywords><metadatalinks><metadataLink><type>string</type><metadataType>string</metadataType><content>string</content></metadataLink></metadatalinks><dataLinks><metadataLink><type>string</type><content>string</content></metadataLink></dataLinks><nativeCRS>GEOGCS[&quot;WGS 84&quot;, DATUM[&quot;World Geodetic System 1984&quot;, SPHEROID[&quot;WGS 84&quot;, 6378137.0, 298.257223563, AUTHORITY[&quot;EPSG&quot;,&quot;7030&quot;]], AUTHORITY[&quot;EPSG&quot;,&quot;6326&quot;]], PRIMEM[&quot;Greenwich&quot;, 0.0, AUTHORITY[&quot;EPSG&quot;,&quot;8901&quot;]], UNIT[&quot;degree&quot;, 0.017453292519943295], AXIS[&quot;Geodetic longitude&quot;, EAST], AXIS[&quot;Geodetic latitude&quot;, NORTH], AUTHORITY[&quot;EPSG&quot;,&quot;4326&quot;]]</nativeCRS><srs>EPSG:4326</srs><store><name>${WORKSPACE}:${DATASTORE}</name><href>${URL}/workspaces/${WORKSPACE}/datastores/${DATASTORE}.json</href></store><cqlFilter>INCLUDE</cqlFilter><maxFeatures>100000</maxFeatures><numDecimals>6</numDecimals><responseSRS><string></string></responseSRS><overridingServiceSRS>true</overridingServiceSRS><skipNumberMatched>true</skipNumberMatched><circularArcPresent>true</circularArcPresent><linearizationTolerance>10</linearizationTolerance><attributes>${attributes}</attributes></featureType>`;
//     return await requesting(config)
// }
exports.geoserverWFST = async (layername, key, val, params) => {
    try {
        // console.log({ layername, key, val, params });return;
        let attributes = '';
        for (const [k, v] of Object.entries(params)) {
            attributes += `<wfs:Property><wfs:Name>${k}</wfs:Name><wfs:Value>${v}</wfs:Value></wfs:Property>`;
        }
        const data = `<wfs:Transaction service="WFS" version="1.0.0" xmlns:${WORKSPACE}="http://www.openplans.org/${WORKSPACE}" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wfs="http://www.opengis.net/wfs"><wfs:Update typeName="${layername}">${attributes}<ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>${key}</ogc:PropertyName><ogc:Literal>${val}</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter></wfs:Update></wfs:Transaction>`;
        const url = `${GEOSERVER_URL}/geoserver/wfs`;

        const result = await axios.post(url, data, headers)
        if (result && result.data && result.data.includes("SUCCESS")) {
            // console.log("WFST success :" + JSON.stringify(params));
            return true;
        }
        else {
            console.log(result.data)
            return false;
        }
    } catch (error) {
        console.log(error)
        return false;
    }
}