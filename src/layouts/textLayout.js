import {applyDocProperties, revertDocProperties} from '../adapters/adapter'
import {computeMargins, computeWidth} from './layout'

export default function(element, context, next) {
    const {children, x, y, width, gravity, margin, margins, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y, width, gravity})
    const computedMargins = computeMargins(margin, margins)

    function nextLayout({width, height}) {
        const computedWidth = computeWidth(position, computedMargins, undefined, width, undefined)

        return {
            x: doc.x,
            y: doc.y,
            width: computedWidth,
            option: {
                continued: true
            },
            after: function() {
            }
        }
    }

    // before
    doc.x = position.x + computedMargins.left
    doc.y = position.y + computedMargins.top

    doc.save()
    const snapshot = applyDocProperties(doc, props)

    next({layout: nextLayout})
    doc.text(' ')

    revertDocProperties(doc, snapshot)
    doc.restore()

    // after
    doc.x = position.x
    doc.y = doc.y + computedMargins.bottom
    position.after()
}
