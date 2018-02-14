import {applyDocProperties, revertDocProperties} from './adapter'

export default function(element, context) {
    const {children, x, y, width, height, gravity, scale = 1, rotate, lineWidth = 1, path, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y, width, height, gravity, scale, rotate})

    doc.save()
    const snapshot = applyDocProperties(doc, props)
    
    doc.translate(position.x, position.y)
    doc.scale(position.scale)
    doc.lineWidth(lineWidth / position.scale) // revert to initial line width
    doc.rotate(position.rotate.angle, {origin: position.rotate.origin})
    doc.path(path).fillAndStroke()

    revertDocProperties(doc, snapshot)
    doc.restore()
    
    position.after()
}
