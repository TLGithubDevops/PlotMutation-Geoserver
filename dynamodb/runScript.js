const dbUtiils = require('./lib');
require('dotenv').config();


 //dbUtiils.deletelocalDynamoDBTable('local_tlands');

 //dbUtiils.createLocalDynamoDBTable('local_tlands');

dbUtiils.addDataToLocal('local_tlands','./data/4/tklupyg5x4z45f4a5rdcnx37pa.json');

//dbUtiils.deletelocalDynamoDBTable('local_tlands1');
