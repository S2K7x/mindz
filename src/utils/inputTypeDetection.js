// Regular expressions for different input types
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  domain: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
  ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  geolocation: /^-?\d{1,2}\.\d+,\s*-?\d{1,3}\.\d+$/,
  md5: /^[a-fA-F0-9]{32}$/,
  sha1: /^[a-fA-F0-9]{40}$/,
  sha256: /^[a-fA-F0-9]{64}$/,
  vin: /^[A-HJ-NPR-Z0-9]{17}$/,
  phone: /^\+?[1-9]\d{1,14}$/, // International phone number format (E.164)
  image_url: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)(\?.*)?$/i,
  youtube_url: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/,
  file_url: /^https?:\/\/.+\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf|odt|ods|odp)(\?.*)?$/i,
  pdf_url: /^https?:\/\/.+\.pdf(\?.*)?$/i,
  file_hash: /^[a-fA-F0-9]{32,64}$/, // Matches MD5, SHA1, and SHA256 hashes
  eth_address: /^0x[a-fA-F0-9]{40}$/, // Ethereum address
  btc_address: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/, // Bitcoin address (including SegWit)
  tx_hash: /^0x[a-fA-F0-9]{64}$/, // Ethereum transaction hash
  crypto_address: /^(0x[a-fA-F0-9]{40}|(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39})$/ // Generic crypto address
};

export function detectInputType(input) {
  if (!input) return null;

  // Check each pattern
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(input.trim())) {
      return type;
    }
  }

  // If no specific pattern matches, return null
  return null;
}

export function parseGeolocation(input) {
  if (!input) return null;
  
  const match = input.match(/^(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)$/);
  if (match) {
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2])
    };
  }
  return null;
}

export function getRelevantTools(tools, inputType) {
  if (!inputType) return tools;

  return tools.map(category => ({
    ...category,
    tools: category.tools.filter(tool => 
      tool.inputType === inputType || 
      !tool.inputType // Include tools without specific input type
    )
  })).filter(category => category.tools.length > 0);
} 