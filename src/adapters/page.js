import {BEFORE_PAGEBREAK_FILTER, AFTER_PAGEBREAK_FILTER, computeMargins, computeDivider, computeGravity, computeWidth, computeHeight, computeScale, computeRotate} from '../layouts/layout'
import {applyDocProperties, revertDocProperties} from './adapter'

export default function(element, context, next) {
    const {children, divider, margin, margins, ...props} = element.props
    const {doc} = context

    doc.addPage({margin: 0, ...props}) // Avoid automatic page break

    const page = doc.page
    const computedMargins = computeMargins(margin, margins)
    const computedDivider = computeDivider(children, undefined, divider)
    const position = {
        x: 0,
        y: 0,
        width: page.width,
        height: page.height
    }
    const innerHeight = position.height - computedMargins.top - computedMargins.bottom

    var linearLayoutIndex
    var snapshot

    function layout({x, y, width, height, gravity, scale, rotate}) {
        if (x != null || y != null) {
            // absolute layout
            x = x || 0
            y = y || 0
            const computedScale = computeScale(position, computedMargins, undefined, width, scale)
            const computedWidth = computeWidth(position, computedMargins, undefined, width, computedScale)
            const computedHeight = computeHeight(innerHeight, height, computedWidth, computedScale)
            const computedGravity = computeGravity(position, computedMargins, innerHeight, undefined, gravity, computedWidth, computedHeight)
            const computedRotate = computeRotate(rotate)

            return {
                x: position.x + computedMargins.left + computedGravity.left + x,
                y: position.y + computedMargins.top + computedGravity.top + y,
                width: computedWidth,
                height: computedHeight,
                scale: computedScale,
                rotate: computedRotate,
                after: function() {
                }
            }
        }

        linearLayoutIndex++

        // linear layout
        const computedScale = computeScale(position, computedMargins, computedDivider, width, scale)
        const computedWidth = computeWidth(position, computedMargins, computedDivider, width, computedScale)
        const computedHeight = computeHeight(innerHeight, height, computedWidth, computedScale)
        const computedGravity = computeGravity(position, computedMargins, innerHeight, undefined, gravity, computedWidth, computedHeight)

        return {
            x: doc.x = position.x + computedMargins.left + computedGravity.left,
            y: doc.y = doc.y + (linearLayoutIndex > 0 && computedDivider.height),
            width: computedWidth,
            height: computedHeight,
            scale: computedScale,
            after: function() {
                doc.x = this.x
                doc.y = doc.y + this.height
            }
        }
    }

    function breakPage(pos, beforePageBreak, afterPageBreak) {
        if (pos.y + pos.height > position.height - computedMargins.bottom) {
            beforePageBreak()
            next({layout: layout, breakPage: () => false}, BEFORE_PAGEBREAK_FILTER)
            after()

            // break page
            doc.addPage({margin: 0, ...props}) // Avoid automatic page break

            before()
            next({layout: layout, breakPage: () => false}, AFTER_PAGEBREAK_FILTER)
            afterPageBreak()
            return true
        }
        return false
    }

    function layoutWithPageBreak(option) {
        var position = layout(option)
        
        if (breakPage(position, () => {}, () => {})) {
            position = layout(option)
        }
        return position
    }

    function before() {
        linearLayoutIndex = -1

        doc.x = position.x + computedMargins.left
        doc.y = position.y + computedMargins.top

        doc.save()
        snapshot = applyDocProperties(doc, props)
    }

    function after() {
        revertDocProperties(doc, snapshot)
        doc.restore()

        doc.x = position.x
        doc.y = position.y + position.height
    }

    before()
    next({layout: layoutWithPageBreak, breakPage: breakPage})
    after()
}
