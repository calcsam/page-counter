const fetch = require("node-fetch").default

const getPage = async (req, res) => {
    const rawUrl = JSON.parse(req.body).url
    const url = rawUrl.indexOf(rawUrl.length - 1) === "/" ? rawUrl.concat('sitemap.xml') : rawUrl.concat('/sitemap.xml')
    const prependedUrl = (url.slice(0,7) === 'http://' || url.slice(0,8) === 'https://') ? 
        url :
        'https://'.concat(url)
    console.log(prependedUrl)
    const resp = await fetch(prependedUrl)
    console.log(resp.status)
    console.log(resp.url)
    console.log(resp.redirected)
    if(resp.status === 404) {
        res.status(200).json({ numUrls: null })
    } else if (resp.redirected && resp.url.match(/sitemap_index/g).length) {
        const data = await resp.text()
        const urls = data.match(/<loc>http.*</g).map(url => url.slice(5, url.length -1))
        let numUrls = 0;
        let nestedUrlData;
        for (let index = 0; index < urls.length; index++) {
            nestedUrlData = await fetch(urls[index]).then(resp => resp.text())
            numUrls += nestedUrlData.match(/<loc>/g).length
        }
        res.status(200).json({ numUrls })
    } else {
        const data = await resp.text()
        res.status(200).json({ numUrls: data.match(/<loc>/g).length })
    }    
}

export default getPage