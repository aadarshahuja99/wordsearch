const express = require('express');
const router = express.Router();
const { getData, setData } = require('./data');
// const {  } = require('./redis-connect');

router.get('/:prefix', async (req,res) => {
    const { prefix } = req.params;
    if(!prefix)
    {
        return res.status(400).json({ success: false });
    }
    await getData(prefix).then(data => {
        if(!data || !data.data)
        {
            return res.status(204).json({ success: false });
        }
        res.set('content-type', 'application/json');
        return res.status(200).send(data.data);
    });
});

router.post('/', async (req, res) => {
    const { word } = req.body || {};
    const regex = /^[a-zA-Z]+$/;
    if(!word || word.length < 2 || !regex.test(word))
    {
        return res.status(400).json({ success: false, msg: "invalid word" });
    }
    var status = await setData({
        word_start: word[0],
        word: word,
    });
    if(status)
    {
        return res.status(201).json({ success: true });
    }
    return res.status(500).json({ success: false });
});

module.exports = { router };
