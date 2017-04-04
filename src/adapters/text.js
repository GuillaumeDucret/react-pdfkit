import {applyDocProperties, revertDocProperties} from './adapter'

export default function(element, context, next) {
    const {children, x, y, width, height, gravity, ...props} = element.props
    const {doc, layout} = context

    const childNodes = next()
    const position = layout({x, y, width, height, gravity})

    doc.save()
    const snapshot = applyDocProperties(doc, props)

    doc.text(childNodes.join(''), position.x, position.y, {width: position.width, ...props, ...position.option})
    doc.y = !position.height && doc.y || position.y

    revertDocProperties(doc, snapshot)
    doc.restore()

    position.after()
};
