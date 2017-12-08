import {applyDocProperties, revertDocProperties} from './adapter'

export default function(element, context, next) {
    const {children, x, y, width, height, gravity, rotate = 0, ...props} = element.props
    const {doc, layout} = context

    doc.save()
    const snapshot = applyDocProperties(doc, props)

    const childNodes = next()

    function computeHeight(width) {
        return doc.heightOfString(childNodes.join(''), {width, ...props})
    }

    const position = layout({x, y, width, height: height || computeHeight, gravity})

    doc.rotate(rotate, {origin: [position.x, position.y]})
    doc.text(childNodes.join(''), position.x, position.y, {width: position.width, ...props, ...position.option})
    doc.y = !position.height && doc.y || position.y

    revertDocProperties(doc, snapshot)
    doc.restore()

    position.after()
};
