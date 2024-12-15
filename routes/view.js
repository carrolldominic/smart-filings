const express = require('express');

const router = express.Router();

const fetchData = require('../util/fetchData');

router.get('/:ticker/:cik/:accession/:document', async (req, res) => {
    
    try {
      const ticker = req.params.ticker;
      const cik = req.params.cik;
      const accession = req.params.accession.replace(/-/g, '');
      // console.log(accession);
      const document = req.params.document;
      const url = "https://www.sec.gov/Archives/edgar/data/" + cik + "/" + accession + "/" + document;

      const html = await fetchData(url);
 
    //   console.log(html);
      let data = {
        cik: cik,
        ticker: ticker,
        accession: accession,
        document: document,
        html: html
      };
    //   console.log('test');
    //   res.send(`Test: ${Object.values(data.filings)[0].urlPrimaryDocument}`);
      res.render('filingview', { data });
    } catch (error) {
      res.render('error', { error });
    }
  
});

module.exports = router;