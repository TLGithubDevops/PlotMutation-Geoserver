const fs = require('fs');
const AWS = require("aws-sdk");


module.exports = { addDataToLocal, createLocalDynamoDBTable, deletelocalDynamoDBTable, descriptionLocalDynamoDBTable };

async function addDataToLocal(tableName, file) {
    AWS.config.update({
        region: "local",
        endpoint: "http://localhost:8000"
    });

    var dynamodb = new AWS.DynamoDB();


    let lineNum = 0;
    fs.readFileSync(file, 'utf-8').split(/\r?\n/).forEach(function (line) {
        console.log(lineNum++);
        if (line.length > 0) {
            const item = JSON.parse(line);
            let params = {
                TableName: tableName,
                Item: item.Item
            }

            dynamodb.putItem(params, function (err, data) {
                if (err) {
                    console.error("Unable to add data", JSON.stringify(err, null, 2));
                } else {
                    console.log("Able to add data", data);
                }
            })
        } else {
            console.log("empty line");
        }
    })
}

async function createLocalDynamoDBTable(tableName) {
    AWS.config.update({
        region: "local",
        endpoint: "http://localhost:8000"
    });

    let dynamodb = new AWS.DynamoDB();

    let params = {
        TableName: tableName,
        KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },  //Partition key
            { AttributeName: "SK", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "PK", AttributeType: "S" },
            { AttributeName: "SK", AttributeType: "S" },
            { AttributeName: "PK1", AttributeType: "S" },
            { AttributeName: "SK1", AttributeType: "S" },
            { AttributeName: "PK2", AttributeType: "S" },
            { AttributeName: "SK2", AttributeType: "N" },
            { AttributeName: "PK3", AttributeType: "S" },
            { AttributeName: "SK3", AttributeType: "S" }
        ],
        GlobalSecondaryIndexes:[
            {
                IndexName: "GS1",
                KeySchema: [
                    { AttributeName: "PK1", KeyType: "HASH" },
                    { AttributeName: "SK1", KeyType: "RANGE" }
                ],
                Projection: {
                    ProjectionType: "ALL"
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            },
            {
                IndexName: "GS2",
                KeySchema: [
                    { AttributeName: "PK2", KeyType: "HASH" },
                    { AttributeName: "SK2", KeyType: "RANGE" }
                ],
                Projection: {
                    ProjectionType: "ALL"
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            },
            {
                IndexName: "GS3",
                KeySchema: [
                    { AttributeName: "PK3", KeyType: "HASH" },
                    { AttributeName: "SK3", KeyType: "RANGE" }
                ],
                Projection: {
                    ProjectionType: "ALL"
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };



    dynamodb.createTable(params, function (err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}

async function deletelocalDynamoDBTable(tableName) {
    AWS.config.update({
        region: "local",
        endpoint: "http://localhost:8000"
    });

    let dynamodb = new AWS.DynamoDB();

    let params = {
        TableName: tableName
    };

    dynamodb.deleteTable(params, function (err, data) {
        if (err) {
            console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}


async function descriptionLocalDynamoDBTable(tableName) {
    AWS.config.update({
        region: "local",
        endpoint: "http://localhost:8000"
    });

    let dynamodb = new AWS.DynamoDB();

    let params = {
        TableName: tableName
    };

    dynamodb.describeTable(params, function (err, data) {
        if (err) {
            console.error("Unable to describe table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}


//delete all the data in the dynamodb table
async function deleteAllDataLocalDynamotTable(tableName){
    AWS.config.update({
        region: "local",
        endpoint: "http://localhost:8000"
    });

    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName: tableName,
        Key: {
            "PK": {
                S: "PK"
            },
            "SK": {
                S: "SK"
            }
        }
    };

    dynamodb.deleteItem(params, function (err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}

