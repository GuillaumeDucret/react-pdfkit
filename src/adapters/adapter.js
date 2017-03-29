function computeValue(value, newValue) {
    if (newValue[0] == '*') {
        const suffix = newValue.slice(1)
        if (value.endsWith(suffix)) return value
        return value + suffix
    }
    return newValue
}

export function applyDocProperties(doc, properties) {
    const revertProperties = {}

    Object.keys(properties).forEach((property) => {
        if (typeof doc[property] == 'function') {
            var propertyValue = properties[property]

            switch(property) {
                case 'font':
                    revertProperties.font = doc._font.name
                    propertyValue = computeValue(doc._font.name, propertyValue)
                    break
                case 'fontSize':
                    revertProperties.fontSize = doc._fontSize
                    break
            }

            doc[property](propertyValue)
        }
    })
    return revertProperties
}

export function revertDocProperties(doc, properties) {
    Object.keys(properties).forEach((property) => {
        if (typeof doc[property] == 'function') {
            doc[property](properties[property])
        }
    })
}