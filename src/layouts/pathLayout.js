import {applyDocProperties, revertDocProperties} from '../adapters/adapter'
import {computeWidth, computeHeight} from './layout'

function computeCentroidGravity(gravity = '', width, height) {
    return gravity.split('|').reduce((result, gravity) => {
        switch(gravity) {
            case 'center':
            case 'center_horizontal':
                return {
                    top: result.top,
                    left: - width / 2
                }
            case 'center_vertical':
                return {
                    top: - height / 2,
                    left: result.left
                }
            default:
                return result
        }
    }, {top: 0, left: 0})
}

export default function(element, context, next) {
    const {children, x, y, width, height, gravity, scale = 1, rotate, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y, width, height, gravity, scale, rotate})

    function nextLayout({x = 0, y = 0, width, height, gravity}) {
        const computedWidth = computeWidth(position, undefined, undefined, width, undefined)
        const computedHeight = computeHeight(undefined, height, computedWidth, undefined)
        const computedGravity = computeCentroidGravity(gravity, computedWidth, computedHeight)

        return {
            x: doc.x = position.x + computedGravity.left + (x * position.scale),
            y: doc.y = position.y + computedGravity.top + (y * position.scale),
            width: computedWidth,
            height: computedHeight,
            scale: position.scale,
            rotate: position.rotate,
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
