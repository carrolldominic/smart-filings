const PORT = process.env.PORT || 3000;

const express = require('express');
const { engine } = require('express-handlebars');

const app = express();

app.engine('handlebars', engine({
    layoutsDir: 'views/layouts',
    defaultLayout: 'main'
  }));

var path = require ('path');

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "public"));
app.use('/scripts', (req, res, next) => {
    express.static(path.join(__dirname, 'public/scripts'))(req, res, () => {
        if (req.path.endsWith('.js')) {
            res.setHeader('Content-Type', 'text/javascript');
        }
        next();
    });
});

const filingsRoutes = require('./routes/filings');
const viewRoutes = require('./routes/view');
const tableRoutes = require('./routes/tables');
const tableViewRoutes = require('./routes/table-view');


app.use('/filings', filingsRoutes);
app.use('/view', viewRoutes);
app.use('/tables', tableRoutes);
app.use('/table-view', tableViewRoutes);


app.get('/', (req, res) => {
    res.render('index', {title: "Browse Company Information Efficiently - Smart Filings"});
});

app.listen(PORT, () => {
  console.log(`Server running at on port: ${PORT}`);
});
