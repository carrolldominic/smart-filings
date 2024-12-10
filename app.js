const PORT = process.env.PORT || 3000;

const express = require('express');
const { engine } = require('express-handlebars');
const { secEdgarApi } = require('sec-edgar-api');
const axios = require('axios');

const yahooFinance = require('yahoo-finance2').default;

const app = express();

app.engine('handlebars', engine({
    layoutsDir: 'views/layouts',
    defaultLayout: 'main'
  }));
  
app.set('view engine', 'handlebars');
app.set('views', './views');

var path = require ('path');
app.use(express.static(path.join(__dirname + '../public')));

app.get('/', (req, res) => {
    res.render('index');
});


async function getSubmissions(ticker) {
    try {
        let submissions = await secEdgarApi.getSubmissions({ symbol: ticker });
        let reports = await secEdgarApi.getReports({ symbol: ticker });
        // console.log(submissions);
        // Object.values(submissions).forEach(value => {
        //     console.log(value);
        // });          
        // console.log(typeof submissions);
        return { submissions, reports };
    } catch (e) {
        return e;
    }
}

app.get('/filings/:ticker', async (req, res) => {
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

async function fetchData(url) {
    try {
        const response = await axios.get(url, {
            headers: {
              'User-Agent': 'MyCustomUserAgent/1.0'  // Set your custom user agent here
            }
          });        return response.data;
    } catch (error) {
        console.error('Error fetching the URL:', error);
        return error;
      }
}

app.get('/view/:cik/:accession/:document', async (req, res) => {
    try {
      const cik = req.params.cik;
      const accession = req.params.accession.replace(/-/g, '');
      console.log(accession);
      const document = req.params.document;
      const url = "https://www.sec.gov/Archives/edgar/data/" + cik + "/" + accession + "/" + document;
    //   console.log(url);
      const html = await fetchData(url);
    //   console.log(html);
      let data = {
        cik: cik,
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
