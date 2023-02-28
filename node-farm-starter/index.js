

const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplates');
const { constants } = require('buffer');

//Day 2

// Blocking and Non-blocling way of Node Js
// Reading and writing the file both in synchronous way  and asynchronousway using file system module
// Creating a Web server using http module



/////////////////////////
//File System

// Synchronous ( blocking) way of reading and writimg files using file system module)

// const text = fs.readFileSync('./txt/input.txt', 'utf-8'); // second parameter is encoding
// const textOut = `this is written :${text}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
//console.log('file written! ');



//Asynchronous(non-blocking) way of reading and writing into the file.

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     if (err) return console.log('ERROR!');
//     console.log(data);
// }); //third parameter is callback function
// console.log('file is being read');

// fs.writeFile('./txt/final.txt', `siddhant paudel `, 'utf-8', err => {
//     console.log('your file has been written.')
// })

///////////////////////////////////
//SERVER
// const replaceTemplate = (temp, product) => {
//     let output = temp.replace(/{%productname%}/g, product.productName);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%price%}/g, product.price);
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//     output = output.replace(/{%quantity%}/g, product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
//     output = output.replace(/{%ID%}/g, product.id);

//     if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//     return output;
// }

const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

// const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))
// console.log(slugs);

const server = http.createServer((req, res) => {


    const { query, pathname } = url.parse(req.url, true);



    //overview page
    if (pathname === '/overview') {

        res.writeHead(200, { 'content-type': 'text/html' })
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);;
    }

    //product page
    else if (pathname === '/product') {
        res.writeHead(200, { 'content-type': 'text/html' })
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product)
        res.end(output);
    }
    //API

    else if (pathname === '/api') {

        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(data);


    }
    //Not found
    else {
        res.writeHead(404, {
            'content-type': 'text/html'
        });
        res.end('<h1>page not found!</h1>');
    }
});


server.listen(8000, '127.0.0.1', () => {
    //console.log('Listening to the requests on port 8000');
})

// Building a very simple Api
