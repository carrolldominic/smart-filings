const express = require('express');

const router = express.Router();
const getSubmissions = require('../util/getSubmissions');
const fetchData = require('../util/fetchData');

router.get('/:ticker/:data', async (req, res) => {
    let ticker = req.params.ticker;
    let raw = req.params.data;


    let sec = await getSubmissions(ticker);
    let sub = sec.submissions;
    let rep = sec.reports;

    let financialFilings = [];
    Object.values(sub.filings).forEach(value => {
        if (value.form == "10-K" || value.form == "10-Q") {
            financialFilings.push(value);
        }
    });  
  

    let data = {
        ticker: ticker,
        columnsData: raw, // to be used on the front-end to separate out tables from the whole filing html
        cik: Object.values(rep)[0].cik, 
        filings: financialFilings  // array of objects for which contain filing data and html for accordion
    };

    res.render('tables', { data, title: ticker + " - Similar Tables - Smart Filings" });
});


module.exports = router;