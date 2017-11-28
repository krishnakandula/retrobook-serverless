const AWS = require('aws-sdk');
const TABLE_NAME = process.env.TABLE_NAME;
const ddbUtils = require('../dynamoutil');
let docClient = new AWS.DynamoDB.DocumentClient();

let handler = (event, context, callback) => {
    getAllBooks(event.params.querystring).then(data => {
        console.log('Successfully retrieved books');
        callback(null, {
            "items": data.Items,
            "count": data.Count,
            "token": data.LastEvaluatedKey
        });
    }, err => {
        console.error('Unable to retrieve books', err);
        callback(err, null);
    });
};

function getAllBooks(queryString) {
    let startKey = null;
    let limit = queryString.limit;
    return new Promise((resolve, reject) => {
        ddbUtils.checkKeyExists(TABLE_NAME, queryString.id, queryString.author).then(exists => {
            if (exists) {
                startKey = {
                    id: queryString.id,
                    author: queryString.author
                };
            }
    
            let params = {
                TableName: TABLE_NAME,
                ExclusiveStartKey: startKey,
                Limit: limit
            };
    
            return docClient.scan(params).promise();
            
        }).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports = {
    handler
};
