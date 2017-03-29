import {applyDocProperties, revertDocProperties} from '../adapters/adapter'
import {computeMargins, computeGravity, computeDivider, computeWidth, computeHeight} from './layout'

export default function(element, context, next) {
    const {children, x, y, width, height, gravity, orientation, margin, margins, divider, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y, width, height, gravity})
    const computedMargins = computeMargins(margin, margins)
    const computedDivider = computeDivider(children, orientation, divider)

    var innerHeight = position.height - computedMargins.top - computedMargins.bottom
    var layoutIndex = -1

    function computeInnerHeight(height) {
        const newInnerHeight = doc.y + height - position.y - computedMargins.top
        return newInnerHeight > innerHeight && newInnerHeight || innerHeight
    }

    function nextLayout({x, y, width, height, gravity}) {
        const computedWidth = computeWidth(position, computedMargins, computedDivider, width)
        const computedHeight = computeHeight(innerHeight, height)
        const computedGravity = computeGravity(position, innerHeight, orientation, gravity, computedWidth, computedHeight)

        layoutIndex++

        if (x != null && y != null) {
            // absolute layout
            return layout({x, y, width, height})
        }

        if (orientation == 'horizontal') {
            // horizontal linear layout
            return {
                x: doc.x = doc.x + (layoutIndex > 0 && computedDivider.width),
                y: doc.y = position.y + computedMargins.top + computedGravity.top,
                width: computedWidth,
                height: computedHeight,
                after: function() {
                    innerHeight = computeInnerHeight(this.height)
                    doc.x = doc.x + this.width
                    doc.y = this.y
                }
            }
        }

        // vertical linear layout
        return {
            x: doc.x = position.x + computedMargins.left + computedGravity.left,
            y: doc.y = doc.y + (layoutIndex > 0 && computedDivider.height),
            width: computedWidth,
            height: computedHeight,
            after: function() {
                innerHeight = computeInnerHeight(this.height)
                doc.x = this.x
                doc.y = doc.y + this.height
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
