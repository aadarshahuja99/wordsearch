const { env } = require('process');
const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    url: process.env.REDIS_URL,
});

client.on('error', err => {
    console.error(err);
});

(async () => {
    // Connect to redis server
    await client.connect();
})();

const getWords = async (word_start) => {
    const response = {
        err: "",
    }
    if(!word_start)
    {
        response.err = "invalid key";
    }
    try{
        const key = `wordStart:${word_start}`
        response.data = await client.get(key);
        return response;
    }
    catch(err)
    {
        console.error(err);
    }
    return response;
}

const setWords = async (word_start,list) => {
    const response = {
        err: "",
    }
    try{
        const key = `wordStart:${word_start}`
        const value = JSON.stringify(list);
        response.data = await client.set(key,value);
        return response;
    }
    catch(err)
    {
        console.error(err);
    }
    return response;
}

const deleteWords = async (word_start) => {
    const response = {
        err: "",
    }
    try{
        const key = `wordStart:${word_start}`
        response.data = await client.del(key);
        return response;
    }
    catch(err)
    {
        console.error(err);
    }
    return response;
}

// deleteWords("a").then(res => {
//     if(res.data === undefined)
//     {
//         console.log("no reply");
//     }
//     else{
//         console.log("deleted key count ", res.data);
//     }
// });

// setWords("a",['aadarsh','ahuja','ahead']).then(res => {
//     if(res.data === undefined)
//     {
//         console.log("no reply for insertion");
//     }
//     else
//     {
//         console.log("received the following reply for insertion ", typeof(res.data));
//     }
// });

// getWords("a").then(res => {
//     if(res.data === undefined)
//     {
//         console.log("something went wrong");
//     }
//     else
//     {
//         console.log("received the data: ", res.data, typeof(res.data));
//     }
// });

module.exports = {
    setWords,
    getWords,
    deleteWords,
}
