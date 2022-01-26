import * as React from "react"
import { useState } from "react"
import fetch from "node-fetch"
import { prependUrl, appendUrl, generateGoogleString } from "../utils"


// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}

const inputStyles = {
  padding: 4,
  fontSize: "1.25rem",
  borderRadius: 4,
  backgroundColor: "#FFF4DB",
  width: 450,
  marginRight: 10
}

const headingAccentStyles = {
  color: "#663399",
}
const paragraphStyles = {
  marginBottom: 48,
}
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
}
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}

const docLinkStyle = {
  ...linkStyle,
  listStyleType: "none",
  marginBottom: 24,
}

const descriptionStyle = {
  color: "#232129",
  fontSize: 14,
  marginTop: 10,
  marginBottom: 0,
  lineHeight: 1.25,
}

const docLink = {
  text: "Documentation",
  url: "https://www.gatsbyjs.com/docs/",
  color: "#8954A8",
}

const badgeStyle = {
  color: "#fff",
  backgroundColor: "#088413",
  border: "1px solid #088413",
  fontSize: 11,
  fontWeight: "bold",
  letterSpacing: 1,
  borderRadius: 4,
  padding: "4px 6px",
  display: "inline-block",
  position: "relative",
  top: -2,
  marginLeft: 10,
  lineHeight: 1,
}

// data
const links = [
  {
    text: "Tutorial",
    url: "https://www.gatsbyjs.com/docs/tutorial/",
    description:
      "A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
    color: "#E95800",
  },
  {
    text: "How to Guides",
    url: "https://www.gatsbyjs.com/docs/how-to/",
    description:
      "Practical step-by-step guides to help you achieve a specific goal. Most useful when you're trying to get something done.",
    color: "#1099A8",
  },
  {
    text: "Reference Guides",
    url: "https://www.gatsbyjs.com/docs/reference/",
    description:
      "Nitty-gritty technical descriptions of how Gatsby works. Most useful when you need detailed information about Gatsby's APIs.",
    color: "#BC027F",
  },
  {
    text: "Conceptual Guides",
    url: "https://www.gatsbyjs.com/docs/conceptual/",
    description:
      "Big-picture explanations of higher-level Gatsby concepts. Most useful for building understanding of a particular topic.",
    color: "#0D96F2",
  },
  {
    text: "Plugin Library",
    url: "https://www.gatsbyjs.com/plugins",
    description:
      "Add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.",
    color: "#8EB814",
  },
  {
    text: "Build and Host",
    url: "https://www.gatsbyjs.com/cloud",
    badge: true,
    description:
      "Now you’re ready to show the world! Give your Gatsby site superpowers: Build and host on Gatsby Cloud. Get started for free!",
    color: "#663399",
  },
]

// markup

const getNumUrls = async (url) => {
  console.log(url)
  const response = await fetch('/api/get-pages', {method: 'POST', body: JSON.stringify({url}) })
  const data = await response.json();
  return { numUrls: data.numUrls, numGoogleResults: data.numGoogleResults }
}

const IndexPage = () => {
  const [inputSite, setInputSite] = useState(null);
  const [site, setSite] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [numGoogleResults, setNumGoogleResults] = useState(null);
  const [processing, setProcessing] = useState(false);

  const processClick = async () => { 
    setProcessing(true);
    const { numUrls, numGoogleResults } = await getNumUrls(inputSite); 
    setNumPages(numUrls); 
    setSite(inputSite);
    setNumGoogleResults(numGoogleResults);
    setProcessing(false);
  }
  return (
    <main style={pageStyles}>
      <title>Home Page</title>
      <h1 style={headingStyles}>
        How many pages is this site?
      </h1>
      <input onChange={(event) => {setInputSite(event.target.value)}} style={inputStyles}>
        </input>
      
      <button onClick={processClick}>
        Submit
      </button>
      <br/>
      <br/>
      
      {
        processing ? "Processing.... (usually takes about 5 seconds)" : site ? 
            <p><span style={{ fontSize: "150%" }}>
              {
                numPages ?  
                  <span>
                    {`Your site `}
                    <a href={site}>{site}</a>{` has ${numPages} pages, according to its `}
                    <a href={prependUrl(appendUrl(inputSite))}>sitemap.xml</a>&nbsp;file.&nbsp;
                  </span> :
                  <span>
                    {`Your site `}
                    <a href={prependUrl(site)}>{site}</a>{` doesn't seem to have a sitemap.xml file. `}
                  </span> 
              }
              <a href={generateGoogleString(prependUrl(inputSite))}>According to Google,</a>
              {` your site has about ${numGoogleResults}.`}
              <br/>
              <br/>
              {`If these numbers are very different, it may be due to content in multiple languages, subdomains, or some other weird reason. Check the results.`}</span>
              <br/>
              <br/>
              <span style={{ fontSize: "50%" }}><i>
              {`You can verify this by going to ${site.indexOf(site.length - 1) === "/" ? site.concat('sitemap.xml') : site.concat('/sitemap.xml')}, hitting Command-F for "find", and typing in http.`}&nbsp;<a href="/screenshot.jpg">Example</a>
              </i></span>
              </p>
          : null
      }
    </main>
  )
}

export default IndexPage
