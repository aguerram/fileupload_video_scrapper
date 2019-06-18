const express = require('express')
const app = express()
const http = require('http').Server(app)
const phantom = require('phantom');
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

let instance, page;

(async function () {
    instance = await phantom.create();
    page = await instance.createPage();
})();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static('./public'))
app.get('/video/:link', async (req, res) => {
    let link = req.params.link
    let status = await page.open(`https://www.file-up.org/embed-${link}-1110x500.html`)
    console.log(status)
    let html = await page.evaluate(function () {
        var el = document.querySelector('body a.jwdownloaddisplay')
        if(el)
        {
            return el.getAttribute('href')
        }
        return null
    });
    if(html)
    {
        res.send(html)
    }
        
    else{
        res.status(404)
        res.send('Not found')
    }
})
startServer()
function startServer()
{
    if(page)
    {
        http.listen(PORT, () => {
            console.log(`Start listening on port ${PORT}`)
        })
    }
    else{
        console.log("Server not started yet")
        setTimeout(()=>{
            startServer()
        },500)
    }
    
}

