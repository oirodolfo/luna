export default function toSrc(code) { return URL.createObjectURL(new Blob([code], { type: 'text/javascript' })) }
