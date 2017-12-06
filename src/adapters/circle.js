import {applyDocProperties, revertDocProperties} from './adapter'

export default function(element, context, next) {
    const {children, x, y, radius, gravity, ...props} = element.props
    const {doc, layout} = context

    const width = radius * 2
    const height = radius * 2

    const position = layout({x, y, width, height, gravity})

    doc.save()
    const snapshot = applyDocProperties(doc, props)

    doc.circle(position.x, position.y, radius).fillAndStroke()

    revertDocProperties(doc, snapshot)
    doc.restore()
    
    position.after()
}
