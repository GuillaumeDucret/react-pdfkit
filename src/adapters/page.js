import {computeDivider, computeGravity, computeWidth, computeHeight} from '../layouts/layout'
import {applyDocProperties, revertDocProperties} from './adapter'

export default function(element, context, next) {
    const {children, divider, ...props} = element.props
    const {doc} = context

    doc.addPage(props)

    const page = doc.page
    const margins = page.margins
    const computedDivider = computeDivider(children, undefined, divider)
    const position = {
        x: 0,
        y: 0,
        width: page.width,
        height: page.height
    }

    var innerHeight = position.height - margins.top - margins.bottom
    var linearLayoutIndex = -1

    function layout({x, y, width, height, gravity, scale}) {
        if (x != null || y != null) {
            // absolute layout
            x = x || 0
            y = y || 0
            const computedWidth = computeWidth(position, margins, undefined, width, scale)
            const computedHeight = computeHeight(innerHeight, height, scale)
            const computedGravity = computeGravity(position, innerHeight, undefined, gravity, computedWidth, computedHeight)

            return {
                x: position.x + margins.left + computedGravity.left + x,
                y: position.y + margins.top + computedGravity.top + y,
                width: computedWidth,
                height: computedHeight,
                after: function() {
                }
            }
        }

        linearLayoutIndex++

        // linear layout
        const computedWidth = computeWidth(position, margins, computedDivider, width, scale)
        const computedHeight = computeHeight(innerHeight, height, scale)
        const computedGravity = computeGravity(position, innerHeight, undefined, gravity, computedWidth, computedHeight)

        return {
            x: doc.x = position.x + margins.left + computedGravity.left,
            y: doc.y = doc.y + (linearLayoutIndex > 0 && computedDivider.height),
            width: computedWidth,
            height: computedHeight,
            after: function() {
                doc.x = this.x
                doc.y = doc.y + this.height
            }
        }
    }

    // before
    doc.x = position.x + margins.left
    doc.y = position.y + margins.top

    doc.save()
    const snapshot = applyDocProperties(doc, props)

    next({layout})

    revertDocProperties(doc, snapshot)
    doc.restore()

    // after
    doc.x = position.x
    doc.y = position.y + position.height
}
