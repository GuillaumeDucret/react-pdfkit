import {applyDocProperties, revertDocProperties} from './adapter'

export default function(element, context, next) {
    const {children, title, author, registerFonts, ...props} = element.props
    const {doc} = context

    Object.assign(
        doc.info,
        {
            Title: title,
            Author: author
        }
    )

    if (registerFonts) {
        Object.keys(registerFonts).forEach((name) => {
            doc.registerFont(name, registerFonts[name])
        })
    }

    applyDocProperties(doc, props)

    next()

    return doc
}
