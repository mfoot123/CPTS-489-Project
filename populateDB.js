// https://cheerio.js.org/docs/basics/
// Used this to figure out a basis for scraping
// https://stackoverflow.com/questions/20664841/can-i-load-a-local-html-file-with-the-cheerio-package-in-node-js 
// Took a snippet from to figure out how to parse a local file which was line 14/15 along with importing fs/path
// https://circleci.com/blog/web-scraping-with-cheerio/ 
// This helped with further figuring out how to scrape such as using each((index, element) => {})
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const Product = require('./models/Product');

async function populateDB(category, filename) {
    try {
        const filePath = path.join(__dirname, 'public', filename);
        const $ = cheerio.load(fs.readFileSync(filePath));

        $('.product').each(async (index, element) => {
            const name = $(element).find('h2').text();
            const description = $(element).find('p').eq(0).text();
            const price = parseFloat($(element).find('p').eq(2).text().replace('Price: $', ''));
            const imageUrl = $(element).find('img').attr('src');
            const guideUrl = $(element).find('a').attr('href');
            try {
                await Product.create({ category, name, description, price, imageUrl, guideUrl })
            }
            catch(error) {
                console.error('Error inserting product:', error)
            }
        })

        console.log('Scraping and insertion completed successfully!');
    }
    catch (error) {
        console.error('Error scraping and inserting data:', error);
    }
}

module.exports = populateDB;