const { getWordsByPartitionKey, addOrUpdateWord } = require('./dynamo-connect');
const { setWords, getWords, deleteWords } = require('./redis-connect');

// this module provides endpoints that comprise of both redis and DynamoDB calls (i.e both caching and database updates are handled here)

const getData = async (word_start) => {
    const response = {};
    if(!word_start || word_start.length > 1)
    {
        return response;
    }
    return await getWords(word_start).then(async res => {
        if(!res || res.data === null)
        {
            let data = await getWordsByPartitionKey(word_start);
            let outputData = [];
            data.forEach(element => {
                outputData.push(element.word);
            });
            await setWords(word_start, outputData);
            response.data = outputData;
        }
        else
        {
            response.data = res.data;
        }
        return response;
    }).catch(err => {
        console.log(err);
        return response;
    });
}

const setData = async (word) => {
    return await addOrUpdateWord(word).then(async res => {
        if(res)
        {
            return await deleteWords(word.word_start).then(cacheResponse => {
                if(!cacheResponse.err)
                {
                    return true;
                }
            });
        }
        return false;
    }).catch(err => {
        console.log(err);
        return false;
    });
}

module.exports = {
    getData,
    setData,
};
