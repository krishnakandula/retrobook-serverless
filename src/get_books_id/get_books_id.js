const AWS = require('aws-sdk');
const ddbUtls = require('../dynamoutil');
const TABLE_NAME = process.env.TABLE_NAME;
let docClient = new AWS.DynamoDB.DocumentClient();

let handler = (event, context, callback) => {
    let id = event.params.querystring.id;
    let author = event.params.querystring.author;
    ddbUtls.getVolume(TABLE_NAME, id, author).then(vol => {
        callback(null, vol);
    }).catch(err => {
        console.error(err);
        callback(err, null);
    })
};

module.exports = {
    handler
};
