const fetch = require("node-fetch").default
const queryString = require('query-string');
const { prependUrl, appendUrl, generateGoogleString } = require('../utils/index.js')

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'

const getSitemapUrls = async ( sitemapUrl ) => {
    const resp = await fetch(sitemapUrl)
    console.log(resp.status)
    console.log(resp.url)
    console.log(resp.redirected)
    if(resp.status === 404) {
        return null
    } else if (resp.redirected && resp.url.match(/sitemap_index/g).length) {
        const data = await resp.text()
        const urls = data.match(/<loc>http.*</g).map(url => url.slice(5, url.length -1))
        let numUrls = 0;
        let nestedUrlData;
        for (let index = 0; index < urls.length; index++) {
            nestedUrlData = await fetch(urls[index]).then(resp => resp.text())
            numUrls += nestedUrlData.match(/<loc>/g).length
        }
        return numUrls
    } else {
        const data = await resp.text()
        return data.match(/<loc>/g).length
    }
}


const getPage = async (req, res) => {
    const rawUrl = JSON.parse(req.body).url
    console.log(rawUrl)
    const prependedUrl = prependUrl(rawUrl)
    const appendedUrl = appendUrl(prependedUrl)
    const numUrls = await getSitemapUrls(appendedUrl)

    let googleString = generateGoogleString(prependedUrl);

    const args = { headers: { "user-agent": userAgent }}

    const googleData = await fetch(googleString, args).then(resp => resp.text())

    const firstMatch = googleData.match(/<div id="result-stats">About (.*) results/g)
    const numGoogleResults = firstMatch && firstMatch[0] && firstMatch[0].slice(28)
    console.log(numGoogleResults)
    console.log(numUrls)
    res.status(200).json({ numUrls, numGoogleResults })
    
    
    
    
    


}

export default getPage