import {computeWidth, computeDivider, computeGravity} from '../layouts/layout'
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
        width: page.width
    }

    var linearLayoutIndex = -1

    function layout({x, y, width, height = 0, gravity}) {
        if (x != null && y != null) {
            // absolute layout
            const computedWidth = computeWidth(position, margins, undefined, width)

            return {
                x: position.x + margins.left + x,
                y: position.y + margins.top + y,
                width: computedWidth,
                height: height,
                after: function() {
                }
            }
        }

        linearLayoutIndex++

        // linear layout
        const computedWidth = computeWidth(position, margins, computedDivider, width)
        const computedGravity = computeGravity(position, undefined, undefined, gravity, computedWidth, undefined)

        return {
            x: doc.x = position.x + margins.left + computedGravity.left,
            y: doc.y = doc.y + (linearLayoutIndex > 0 && computedDivider.height),
            width: computedWidth,
            height: height,
            after: function() {
                doc.x = this.x
                doc.y = doc.y + this.height
            }
        }
    }

    // before
    doc.x = position.x + margins.left
    doc.y = position.y + page.margins.top

    doc.save()
    const snapshot = applyDocProperties(doc, props)

    next({layout})

    revertDocProperties(doc, snapshot)
    doc.restore()

    // after
    doc.x = position.x
    doc.y = doc.y + margins.bottom
}
