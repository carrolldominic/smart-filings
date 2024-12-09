const express = require('express');
const { engine } = require('express-handlebars');
const { secEdgarApi } = require('sec-edgar-api');

const yahooFinance = require('yahoo-finance2').default;

const app = express();

app.engine('handlebars', engine({
    layoutsDir: 'views/layouts',
    defaultLayout: 'main'
  }));
  
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


async function getSubmissions(ticker) {
    try {
        let submissions = await secEdgarApi.getSubmissions({ symbol: ticker });
        
        // console.log(submissions);
        Object.values(submissions).forEach(value => {
            console.log(value);
        });          
        console.log(typeof submissions);
        return submissions;
    } catch (e) {
        return e;
    }
}

app.get('/filings/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    let sub = await getSubmissions(ticker);

 
    function convertToMillions(num) {
        let millions = (num / 1000000).toFixed(1);
        
        return parseFloat(millions).toLocaleString();
    }
    const quote = await yahooFinance.quote(ticker);    

    let data = {
      name: quote.shortName,
      price: quote.regularMarketPrice,
      marketCap: convertToMillions(quote.marketCap),
      ticker: ticker,
      filings: Object.values(sub.filings)
    };
  //   res.send(`Test: ${Object.values(data.filings)[0].urlPrimaryDocument}`);
    res.render('filing', { data });
  } catch (error) {
    res.render('error', { error });
  }

});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
