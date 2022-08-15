const fetch = require("node-fetch").default
const queryString = require('query-string');
const { prependUrl, appendUrl, generateGoogleString } = require('../utils/index.js')

const UserAgent = require('user-agents');

const userAgent = new UserAgent({ deviceCategory: 'desktop' })

const userAgents = Array(1000).fill().map(() => userAgent());



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
                if(!childSitemaps[index]) {
                    continue
                }
                nestedUrlData = await fetch(childSitemaps[index].slice(14,childSitemaps[index].length-6)).then(resp => resp.text())
                numUrls += (nestedUrlData.match(/<loc>/g) ? nestedUrlData.match(/<loc>/g).length : 0)
            }
            return numUrls
        }
        return data.match(/<loc>/g) ? data.match(/<loc>/g).length : null
    }
}


const getPage = async (req, res) => {
    const rawUrl = JSON.parse(req.body).url
    console.log(rawUrl)
    const prependedUrl = prependUrl(rawUrl)
    const appendedUrl = appendUrl(prependedUrl)
    console.log(appendedUrl)
    let numUrls;
    try {
       numUrls = await getSitemapUrls(appendedUrl)
    } catch (e) {
        console.log(e)
        numUrls = null
    }
    

    let googleString = generateGoogleString(prependedUrl);

    const args = { headers: { "Accept": "application/json" }}

    const googleData = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?cx=${process.env.SEARCH_API_CX}&exactTerms=%20&siteSearch=${rawUrl}&siteSearchFilter=i&key=${process.env.SEARCH_API_KEY}`, 
        args
    ).then(resp => resp.json())
    
    // const firstMatch = googleData.match(/<div id="result-stats">About (.*) results/g)
    // firstMatch && firstMatch[0] && firstMatch[0].slice(28)
    const numGoogleResults = googleData.queries.request[0].totalResults
    console.log(numGoogleResults)
    console.log(numUrls)
    res.status(200).json({ numUrls, numGoogleResults })
    
    
    
    
    


}

export default getPage
