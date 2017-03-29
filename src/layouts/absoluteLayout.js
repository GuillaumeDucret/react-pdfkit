import {applyDocProperties, revertDocProperties} from '../adapters/adapter'
import {computeMargins, computeWidth, computeHeight} from './layout'

export default function(element, context, next) {
    const {children, x, y, width, height, gravity, margin, margins, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y, width, height, gravity})
    const computedMargins = computeMargins(margin, margins)

    var innerHeight = position.height - computedMargins.top - computedMargins.bottom

    function computeInnerHeight(height) {
        const newInnerHeight = doc.y + height - position.y - computedMargins.top
        return newInnerHeight > innerHeight && newInnerHeight || innerHeight
    }

    function nextLayout({x = 0, y = 0, width, height}) {
        const computedWidth = computeWidth(position, computedMargins, undefined, width)
        const computedHeight = computeHeight(innerHeight, height)

        return {
            x: doc.x = position.x + computedMargins.left + x,
            y: doc.y = position.y + computedMargins.top + y,
            width: computedWidth,
            height: computedHeight,
            after: function() {
                innerHeight = computeInnerHeight(this.height)
                doc.x = position.x + computedMargins.left
                doc.y = position.y + computedMargins.top
            }
        }
    }

    // before
    doc.x = position.x + computedMargins.left
    doc.y = position.y + computedMargins.top

    doc.save()
    const snapshot = applyDocProperties(doc, props)

    next({layout: nextLayout})

    revertDocProperties(doc, snapshot)
    doc.restore()

    // after
    doc.x = position.x
    doc.y = !position.height && (position.y + innerHeight + computedMargins.top + computedMargins.bottom) || position.y
    position.after()
}
