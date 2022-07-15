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
    } else {
        const data = await resp.text()
        const childSitemaps = data.match(/<sitemap>(?:\n|)<loc>(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#\/?&=]*))<\/loc>/g)
        if (childSitemaps && childSitemaps.length) {
            let numUrls = 0;
            let nestedUrlData;        
            for (let index = 0; index < childSitemaps.length; index++) {
                nestedUrlData = await fetch(childSitemaps[index].slice(14,childSitemaps[index].length-6))).then(resp => resp.text())
                numUrls += (nestedUrlData.match(/<loc>/g) ? nestedUrlData.match(/<loc>/g).length : 0)
            }
            return numUrls
        }
        return data.match(/<loc>/g).length
    }
}


const getPage = async (req, res) => {
    const rawUrl = JSON.parse(req.body).url
    console.log(rawUrl)
    const prependedUrl = prependUrl(rawUrl)
    const appendedUrl = appendUrl(prependedUrl)
    console.log(appendedUrl)
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
