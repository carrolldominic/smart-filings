const express = require('express');

const router = express.Router();
const axios = require('axios');



router.get('/:ticker/:cik/:accession/:document', async (req, res) => {
    async function fetchData(url) {
        try {
            let ran = Math.ceil(Math.random()*1000+200);
            let agent = 'Carroll' + ran + ' info@dominiccarroll.com';
            const response = await axios.get(url, {
                headers: {
                  'User-Agent': agent
                }
              });        return response.data;
        } catch (error) {
            console.error('Error fetching the URL:', error);
            return error;
          }
    }
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