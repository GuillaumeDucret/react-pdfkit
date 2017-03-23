export function applyDocProperties(doc, properties) {
    Object.keys(properties).forEach((property) => {
        if (typeof doc[property] == 'function') {
            doc[property](properties[property])
        }
    })
}