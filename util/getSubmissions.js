const { secEdgarApi } = require('sec-edgar-api');

async function getSubmissions(ticker) {
    try {
        let submissions = await secEdgarApi.getSubmissions({ symbol: ticker });
        let reports = await secEdgarApi.getReports({ symbol: ticker });
        let facts = await secEdgarApi.getFacts({ symbol: ticker });

        return { submissions, reports };
    } catch (e) {
        return e;
    }
}


module.exports = getSubmissions;