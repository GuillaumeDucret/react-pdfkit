import {applyDocProperties, revertDocProperties} from '../adapters/adapter'
import {computeWidth} from './layout'

function computeCentroidGravity(gravity, width) {
    if (gravity == 'center') {
        return {top: 0, left: - width / 2}
    }
    return {top: 0, left: 0}
}

export default function(element, context, next) {
    const {children, x, y, width, height, gravity, scale = 1, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y, width, height, gravity, scale})

    function nextLayout({x = 0, y = 0, width, gravity}) {
        const computedWidth = computeWidth(position, undefined, undefined, width, undefined)
        const computedGravity = computeCentroidGravity(gravity, computedWidth)

        return {
            x: doc.x = position.x + computedGravity.left + (x * position.scale),
            y: doc.y = position.y + computedGravity.top + (y * position.scale),
            width: computedWidth,
            scale: position.scale,
            after: function() {
            }
        }
    }

    // before
    doc.x = position.x
    doc.y = position.y

    doc.save()
    const snapshot = applyDocProperties(doc, props)

    next({layout: nextLayout})

    revertDocProperties(doc, snapshot)
    doc.restore()

    // after
    doc.x = position.x
    doc.y = position.y
    position.after()
}
