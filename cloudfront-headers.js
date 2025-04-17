// CloudFront Function to add security headers
function handler(event) {
  var response = event.response;
  var headers = response.headers;
  
  // Add security headers
  headers['permissions-policy'] = { value: 'unload=()' };
  headers['content-security-policy'] = { value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://*.okta.com" };
  headers['strict-transport-security'] = { value: 'max-age=31536000; includeSubDomains' };
  headers['x-content-type-options'] = { value: 'nosniff' };
  headers['x-frame-options'] = { value: 'DENY' };
  headers['x-xss-protection'] = { value: '1; mode=block' };
  headers['referrer-policy'] = { value: 'same-origin' };
  
  return response;
}
