const express = require('express');

const router = express.Router();
const getSubmissions = require('../util/getSubmissions');
const yahooFinance = require('yahoo-finance2').default;


router.get('/:ticker', async (req, res) => {
    try {
      const ticker = req.params.ticker.toUpperCase();
      let sec = await getSubmissions(ticker);
      let sub = sec.submissions;
      let reports = sec.reports;
  
      console.log(Object.values(reports)[0].cik);
      function convertToMillions(num) {
          let millions = (num / 1000000).toFixed(1);
          
          return parseFloat(millions).toLocaleString();
      }
      function formatPE(num) {
        if (typeof num !== undefined && typeof num !== null) {
          let formatted = Number(num).toFixed(1);
          return formatted;   
        } else {
          return "--";
        }
      }
      const quote = await yahooFinance.quote(ticker);    
      // console.log(quote);
      let financialFilings = [];
      let newsFilings = [];
  
      Object.values(sub.filings).forEach(value => {
          if (value.form == "10-K" || value.form == "10-Q") {
              financialFilings.push(value);
          } else if (value.form == "8-K") {
              newsFilings.push(value);
          }
      });      
  
      let data = {
        name: quote.shortName,
        price: quote.regularMarketPrice,
        marketCap: convertToMillions(quote.marketCap),
        ticker: ticker,
        trailingPE: formatPE(quote.trailingPE),
        forwardPE: formatPE(quote.forwardPE),
        cik: Object.values(reports)[0].cik,
        financialFilings: financialFilings,
        newsFilings: newsFilings,
      };
    //   res.send(`Test: ${Object.values(data.filings)[0].urlPrimaryDocument}`);
      res.render('filing', { data });
    } catch (error) {
      res.render('error', { error });
    }
  
  });


  module.exports = router;