const MIME_TYPES = { png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', svg:'image/svg+xml', gif:'image/gif', webp:'image/webp', mp3:'audio/mpeg', wav:'audio/wav', ogg:'audio/ogg', json:'application/json', txt:'text/plain', html:'text/html', css:'text/css', js:'text/javascript' }
export default function mime(ext) { return MIME_TYPES[String(ext).toLowerCase()] || 'application/octet-stream' }
