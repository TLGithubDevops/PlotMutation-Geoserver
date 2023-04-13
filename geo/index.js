const URL = `http://3.109.155.231:8080/geoserver/rest`;
const wfsturl = `http://3.109.155.231:8080/geoserver/wfs`;
const WORKSPACE = process.env.GEOSERVER_WORKSPACE || "tiger";
const DATASTORE = process.env.GEOSERVER_DATASTORE || "nyc";
const wfsurl = "http://3.109.155.231:8080/geoserver/web/ne/ows?";
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const base64 = require("base-64");
const config = require('./config');
const { response } = require("express");
const request = require("request");
(username = "admin"),
  (password = "geoserver"),
  (auth =
    "Basic " + new Buffer.from(username + ":" + password).toString("base64"));

const PUBLISHLAYER = `${URL}/workspaces/${WORKSPACE}/datastores/${DATASTORE}/featuretypes.xml`;

exports.getLayers = async (req,res) => {
  try {
    const options = {
      'method': "GET",
      'url': `${URL}/workspaces/${WORKSPACE}/layers`,
      'headers': {
        'accept': "application/json",
        "content-type": "application/json",
        'Authorization': auth,
      },
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      //   console.log(response);
      res.status(200).send(response.body);
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.getfeature = async (req,res) => {
    try {
        const layerName = req.params.layer;
        const options = {
            'method': "GET",
            'url': `${URL}/workspaces/${WORKSPACE}/datastores/${DATASTORE}/featuretypes/${layerName}`,
            'headers': {
              'accept': "application/json",
              "content-type": "application/json",
              'Authorization': auth,
            },
          };
          request(options, function (error, response) {
            if (error) throw new Error(error);
            res.status(200).send(response.body);
          });
    } catch (error) {
      console.log("Layer Not Found" + error);
      return false;
    }
  };
  
  exports.createLayer = async (layerName, SLDNAME=null) => {
    try {
      const layerExists = await this.getfeature(layerName);
      if (layerExists) {
        await this.styleLayer(layerName, SLDNAME);
        return true;
      }
      const options = {
        "featureType":
        {
          "name": layerName,
          "nativeCRS": "EPSG:4326",
          "srs": "EPSG:4326"
        }
      }
      const configData = config('POST');
      configData.body = JSON.stringify(options);
      const response = await fetch(PUBLISHLAYER, configData);
      if (response.ok) {
        console.log(layerName + ' published');
        await this.styleLayer(layerName, SLDNAME);
        return true;
      } else {
        const text = await response.text();
        console.log("Layer Not Created" + text);
        return false;
      }
    } catch (error) {
      console.log("create layer error : " + error);
    }
  };

  exports.styleLayer = async (layerName, SLDNAME) => {
    try {
      if(!SLDNAME) return;
      // let SLDNAME=(type==1)?SLD_PLOTS:SLD_AMENITIES;
      const style = `<layer><defaultStyle><name>${SLDNAME}</name></defaultStyle></layer>`;
      const LAYER = `${URL}/layers/${layerName}`;
      //console.log(LAYER)
      const configData = config('PUT');
      configData.body = style;
      configData.headers["Content-Type"] = "text/xml";
      const response = await fetch(LAYER, configData);
      //  console.log(response) 
      if (response.ok) { console.log('SLD APPLIED : ' + SLDNAME); return true; }
      else { console.log('SLD ERROR : ' + SLDNAME); return false; }
    } catch (error) {
      console.log(error);
      return false;
    }
  }