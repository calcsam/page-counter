const fetch = require("node-fetch").default

const getPage = async (req, res) => {
    const rawUrl = JSON.parse(req.body).url
    const url = rawUrl.indexOf(rawUrl.length - 1) === "/" ? rawUrl.concat('sitemap.xml') : rawUrl.concat('/sitemap.xml')
    const prependedUrl = (url.slice(0,7) === 'http://' || url.slice(0,8) === 'https://') ? 
        url :
        'https://'.concat(url)
    console.log(prependedUrl)
    const resp = await fetch(prependedUrl)
    if(resp.status === 404) {
        res.status(200).json({ numUrls: null })
    } else {
        const data = await resp.text()
        res.status(200).json({ numUrls: data.match(/http/g).length })
    }    
}

export default getPage