import {computeDivider, computeGravity, computeWidth, computeHeight, computeScale} from '../layouts/layout'
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
    const innerHeight = position.height - margins.top - margins.bottom

    var linearLayoutIndex
    var snapshot

    function layout({x, y, width, height, gravity, scale}) {
        if (x != null || y != null) {
            // absolute layout
            x = x || 0
            y = y || 0
            const computedScale = computeScale(position, margins, undefined, width, scale)
            const computedWidth = computeWidth(position, margins, undefined, width, computedScale)
            const computedHeight = computeHeight(innerHeight, height, computedWidth, computedScale)
            const computedGravity = computeGravity(position, margins, innerHeight, undefined, gravity, computedWidth, computedHeight)

            return {
                x: position.x + margins.left + computedGravity.left + x,
                y: position.y + margins.top + computedGravity.top + y,
                width: computedWidth,
                height: computedHeight,
                scale: computedScale,
                after: function() {
                }
            }
        }

        linearLayoutIndex++

        // linear layout
        const computedScale = computeScale(position, margins, computedDivider, width, scale)
        const computedWidth = computeWidth(position, margins, computedDivider, width, computedScale)
        const computedHeight = computeHeight(innerHeight, height, computedWidth, computedScale)
        const computedGravity = computeGravity(position, margins, innerHeight, undefined, gravity, computedWidth, computedHeight)

        return {
            x: doc.x = position.x + margins.left + computedGravity.left,
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

    function pageBreak(pos, beforePageBreak, afterPageBreak) {
        if (pos.y + pos.height > position.height - margins.bottom) {
            beforePageBreak()
            after()

            // break page
            doc.addPage(props)

            before()
            afterPageBreak()
            return true
        }
        return false
    }

    function layoutWithPageBreak(option) {
        var position = layout(option)
        
        if (pageBreak(position, () => {}, () => {})) {
            position = layout(option)
        }
        return position
    }

    function before() {
        linearLayoutIndex = -1

        doc.x = position.x + margins.left
        doc.y = position.y + margins.top

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
    next({layout: layoutWithPageBreak, pageBreak: pageBreak})
    after()
}
