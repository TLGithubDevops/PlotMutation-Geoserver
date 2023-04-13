const TL = require("../geo/index")

module.exports = app => {
    app.get("/geo/layers",TL.getLayers); 
    app.get("/geo/getfeatures/:layer",TL.getfeature)
    app.post("/geo/createLayer", async (req, res) => {
        const layername = req.body.layername;
        const SLDNAME = req.body.sld;
        const publish = await TL.createLayer(layername, SLDNAME);
        return res.send(publish);
    })

}