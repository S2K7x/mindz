/**
 * Returns a tooltip message for a given tool name
 * @param {string} toolName - The name of the tool
 * @returns {string} The tooltip message
 */
export const getTooltip = (toolName) => {
  const tooltips = {
    // Browser Search tools
    'Google Search': 'Perform a comprehensive web search using Google',
    'Bing Search': 'Search the web using Microsoft\'s Bing search engine',
    'DuckDuckGo Search': 'Privacy-focused search engine that doesn\'t track your searches',
    'Yandex Search': 'Russian search engine useful for finding non-Western content',
    'Brave Search': 'Independent search engine with its own index',
    'Archive.org (Wayback Machine)': 'View historical versions of websites and content',

    // Email OSINT tools
    'Have I Been Pwned': 'Check if an email has been compromised in known data breaches',
    'Email Format': 'Find email address formats for different companies',
    'Hunter.io': 'Find and verify professional email addresses',

    // Document & File Metadata tools
    'FOCA': 'Extract metadata and hidden information from documents',
    'Metadata2Go': 'View metadata from various file types',
    'Any.Run': 'Interactive malware analysis with public reports',
    'Joe Sandbox': 'Advanced malware analysis with detailed reports',
    'PDF Analyzer': 'Deep analysis of PDF structure and metadata',
    'ExifTool Online': 'Extract metadata from various file formats',

    // Geolocation & Mapping tools
    'Google Maps': 'Interactive mapping with street view and satellite imagery',
    'Google Earth': 'Advanced 3D mapping with historical imagery',
    'OpenStreetMap': 'Community-driven mapping with detailed local information',
    'Mapillary': 'Street-level imagery from multiple sources',
    'Wikimapia': 'Collaborative mapping with place descriptions',
    'SunCalc': 'Calculate sun position and shadows for any location',

    // Image & Video tools
    'Google Images': 'Reverse image search to find similar images',
    'TinEye': 'Specialized reverse image search engine',
    'Jeffrey\'s Exif Viewer': 'Extract and analyze image metadata',
    'FotoForensics': 'Analyze images for manipulation',
    'PimEyes': 'Facial recognition search engine',
    'YouTube DataViewer': 'Extract metadata from YouTube videos',

    // Phone Number tools
    'OSINT Industries PhoneIntel': 'Comprehensive phone number intelligence',
    'Truecaller Web Search': 'Search for phone numbers and spam reports',
    'Phone Dork Generator': 'Generate Google dorks for phone numbers',

    // Social Media tools
    'Social Searcher': 'Real-time social media search engine',
    'Social Blade': 'Track social media statistics and analytics',
    'TweetDeck': 'Advanced Twitter search and monitoring',

    // IP/Domain tools
    'Shodan': 'Search engine for Internet-connected devices',
    'VirusTotal': 'Analyze suspicious files, domains, IPs and URLs',
    'Whois': 'Domain WHOIS lookup and registration information',

    // Dark Web / Leaks / Breaches tools
    'Ahmia': 'Search engine for .onion sites',
    'DarkSearch.io': 'Advanced dark web search engine',
    'Pastebin Search': 'Search through Pastebin dumps',
    'Hastebin Search': 'Search through Hastebin pastes',
    'Exploit-DB': 'Database of exploits and vulnerabilities',
    'Leak-Lookup': 'Search through multiple data breaches',
    'DeHashed': 'Database of leaked credentials',

    // Cryptocurrency tools
    'Etherscan': 'Ethereum blockchain explorer',
    'Blockchain.com Explorer': 'Bitcoin blockchain explorer',
    'BTCScan': 'Advanced Bitcoin blockchain explorer',
    'Whale Alert': 'Track large cryptocurrency transactions',
    'OXT.me': 'Advanced Bitcoin blockchain analysis',
    'CipherTrace': 'Enterprise-grade blockchain analysis'
  };

  return tooltips[toolName] || 'No tooltip available';
}; 