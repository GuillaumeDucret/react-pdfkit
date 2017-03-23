export default function(element, context, next) {
    const childNodes = next()
    return childNodes.join('\r\n')
}
