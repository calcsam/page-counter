export const prependUrl = rawUrl => (rawUrl.slice(0,7) === 'http://' || rawUrl.slice(0,8) === 'https://') ? 
rawUrl :
'https://'.concat(rawUrl)

export const appendUrl = prependedUrl => prependedUrl.indexOf(prependedUrl.length - 1) === "/" ? prependedUrl.concat('sitemap.xml') : prependedUrl.concat('/sitemap.xml')

export const generateGoogleString = prependedUrl => {
    let googleString = `https://www.google.com/search?q=${new URLSearchParams(`site:${prependedUrl}`).toString()}`
    return googleString.slice(googleString.length - 1) == "=" ? googleString.slice(0, googleString.length - 1) : googleString
}