function capitalizeObject(object) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            object[key.charAt(0).toUpperCase() + key.substring(1)] = object[key]
            delete object[key]
        }
    }
    return object
}

export default function(element, context, next) {
    const {children, ...props} = element.props
    const {doc} = context

    Object.assign(
        doc.info,
        capitalizeObject(props)
    )

    next()

    return doc
}
