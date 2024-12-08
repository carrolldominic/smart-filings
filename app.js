const express = require('express');
const { engine } = require('express-handlebars');
const { secEdgarApi } = require('sec-edgar-api');


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
        
        // // console.log(submissions);
        // Object.values(submissions.filings).forEach(value => {
        //     // console.log(value.urlPrimaryDocument);
        // });          
        console.log(typeof submissions);
        return submissions;
    } catch (e) {
        return e;
    }
}

getSubmissions('AAPL');

app.get('/filings/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    let sub = await getSubmissions(ticker);
    let data = {
      name: ticker,
      filings: Object.values(sub.filings)
    };
  //   res.send(`Test: ${Object.values(data.filings)[0].urlPrimaryDocument}`);
    res.render('index', { data });
  } catch (error) {
    res.render('error', { error });
  }

});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
