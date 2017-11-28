const AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();

let checkKeyExists = (tablename, id, author) => {
    return new Promise((resolve, reject) => {
        if(!tablename) {
            reject('Invalid parameters, no tablename');
        }
        if(!id || !author) {
            resolve(false);
        }
        getVolume(tablename, id, author).then(item => {
            resolve(item != null);
        }).catch(err => {
            reject(err);
        });
    });    
}

let getVolume = (tablename, id, author) => {
    return new Promise((resolve, reject) => {
        if (id != null && author != null) {
            let params = {
                TableName: tablename,
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
                resolve(result);
            }, err => {
                reject(err);
            });
        } else {
            reject('Invalid primary key');            
        }
    }); 
}

module.exports = {
    checkKeyExists,
    getVolume
};
