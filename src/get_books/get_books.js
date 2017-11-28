const AWS = require('aws-sdk');
const TABLE_NAME = process.env.TABLE_NAME;
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
        checkKeyExists(queryString.id, queryString.author).then(exists => {
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

function checkKeyExists(id, author) {
    return new Promise((resolve, reject) => {
        if (id && author) {
            let params = {
                TableName: TABLE_NAME,
                KeyConditionExpression: '#id = :idValue and #author = :authorValue',
                ExpressionAttributeNames: {
                    "#id": "id",
                    "#author": "author"
                },
                ExpressionAttributeValues: {
                    ":idValue": id,
                    ":authorValue": author
                }
            };
    
            docClient.query(params).promise().then(result => {
                if (!result) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }, err => {
                reject(err);
            });
        }
    
        resolve(false);
    });    
}

module.exports = {
    handler
};
