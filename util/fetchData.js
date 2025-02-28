const axios = require('axios');
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
module.exports = fetchData;