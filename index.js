const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./module.js/replaceTemplate");
const slugify=require('slugify');
////////////files//////////
// const textIn=fs.readFileSync('./txt/input.txt','Utf-8');
// console.log(textIn);
// const textOut=`This is what we know about avacado: ${textIn}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log("successfully written");
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>
// {
// if(err) return console.log('Error .❌');
// fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>
// {
// fs.readFile('./txt/append.txt','utf-8',(err,data3)=>
// {
// fs.writeFile('./txt/final.txt', `${data2}\n${data3}` ,err=>
// {
// console.log("you have successfully written the code");
// }
// )
// });
// });
//
// });
// console.log("first");
//////////SERVER////SERVER///////

const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempProduct = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);

const data = fs.readFileSync("./dev-data/data.json", "utf-8");

const dataObj = JSON.parse(data);
const slugs=dataObj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);

const server = http.createServer((req, res) => {

  const { query, pathname } = url.parse(req.url, true);
  /////OVERVIEW PAGE////
  if (pathname === "/" || pathname === "/Overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(" ");
    const output = tempOverview.replace(/{%product_cards%}/g, cardsHtml);

    res.end(output);
  }
  ////PRODUCT PAGE/////
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }

  ////API////
  else if (pathname == "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } ////NOT FOUND////
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own": "hello-world",
    });
    res.end("<h1>page not found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("server has started listening");
});
