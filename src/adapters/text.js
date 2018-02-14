import {applyDocProperties, revertDocProperties} from './adapter'

export default function(element, context, next) {
    const {children, x, y, width, height, gravity, rotate, ...props} = element.props
    const {doc, layout} = context

    doc.save()
    const snapshot = applyDocProperties(doc, props)

    const childNodes = next()

    function computeHeight(width) {
        return doc.heightOfString(childNodes.join(''), {width, ...props})
    }

    const position = layout({x, y, width, height: height || computeHeight, gravity, rotate})

    doc.rotate(position.rotate.angle, {origin: [position.x + position.rotate.origin[0], position.y + position.rotate.origin[1]]})
    doc.text(childNodes.join(''), position.x, position.y, {width: position.width, ...props, ...position.option})
    doc.y = !position.height && doc.y || position.y

    revertDocProperties(doc, snapshot)
    doc.restore()

    position.after()
};
