import {applyDocProperties} from './adapter'

export default function(element, context) {
    const {children, x, y, width, height, cornerRadius, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y, width, height})

    doc.save()
    applyDocProperties(doc, props)

    if (cornerRadius) {
        doc.roundedRect(position.x, position.y, position.width, position.height, cornerRadius).fillAndStroke()
    } else {
        doc.rect(position.x, position.y, position.width, position.height).fillAndStroke()
    }

    doc.restore()
    position.after()
}
