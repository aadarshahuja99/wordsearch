const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_DYNAMO_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_DYNAMO_USER_SECRET_ACCESS_KEY
});

const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "words";

const addOrUpdateWord = async (data) => {
    const params = {
        TableName: TABLE_NAME,
        Item: data
    }
    var result = await dynamoDBClient.put(params).promise();
    var output = result;
    return !output.error;
}

const getWordsByPartitionKey = async (word_start) => {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'word_start = :partitionKey',
        ExpressionAttributeValues: {
            ':partitionKey': word_start,
        },
        ProjectionExpression: "word"
    };
    let items = [];
    return await (dynamoDBClient.query(params).promise()).then(async res => {
        if(!res)
        {
            return items;
        }
        items = [...items, ...res.Items];
        if(!!res.LastEvaluatedKey && !!res.LastEvaluatedKey.word_start)
        {
            let startKey = res.LastEvaluatedKey;
            while(!!startKey && !!startKey.word_start)
            {
                params.ExclusiveStartKey = startKey;
                await dynamoDBClient.query(params).promise().then(data => {
                    items = [...items, ...data.Items];
                    startKey = data.LastEvaluatedKey;
                });
            }
        }
        return items;
    });
}

module.exports = {
    addOrUpdateWord,
    getWordsByPartitionKey,
}