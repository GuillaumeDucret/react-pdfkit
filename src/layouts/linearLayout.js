import {applyDocProperties, revertDocProperties} from '../adapters/adapter'
import {computeMargins, computeGravity, computeDivider, computeWidth, computeHeight, computeScale, computeRotate} from './layout'

export default function(element, context, next) {
    const {children, x, y, width, height, gravity, orientation, margin, margins, divider, ...props} = element.props
    const {doc, layout, breakPage} = context

    const computedMargins = computeMargins(margin, margins)
    const computedDivider = computeDivider(children, orientation, divider)

    // init
    var position
    var innerHeight
    var layoutIndex
    var snapshot

    function computeInnerHeight(height) {
        const newInnerHeight = doc.y + height - position.y - computedMargins.top
        return newInnerHeight > innerHeight && newInnerHeight || innerHeight
    }

    function nextLayout({x, y, width, height, gravity, scale, rotate}) {
        const computedScale = computeScale(position, computedMargins, computedDivider, width, scale)
        const computedWidth = computeWidth(position, computedMargins, computedDivider, width, computedScale)
        const computedHeight = computeHeight(innerHeight, height, computedWidth, computedScale)
        const computedGravity = computeGravity(position, computedMargins, innerHeight, orientation, gravity, computedWidth, computedHeight)
        const computedRotate = computeRotate(rotate)

        layoutIndex++

        if (x != null || y != null) {
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
                scale: computedScale,
                rotate: computedRotate,
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
            scale: computedScale,
            rotate: computedRotate,
            after: function() {
                innerHeight = computeInnerHeight(this.height)
                doc.x = this.x
                doc.y = doc.y + this.height
            }
        }
    }

    function nextBreakPage(pos, beforePageBreak, afterPageBreak) {
        return breakPage(pos, () => {
            beforePageBreak()
            after()
        }, () => {
            before()
            afterPageBreak()
        })
    }

    function nextLayoutWithPageBreak(option) {
        var position = nextLayout(option)
        
        if (nextBreakPage(position, () => {}, () => {})) {
            position = nextLayout(option)
        }
        return position
    }

    function before() {
        position = layout({x, y, width, height, gravity})
        innerHeight = position.height - computedMargins.top - computedMargins.bottom
        layoutIndex = -1

        doc.x = position.x + computedMargins.left
        doc.y = position.y + computedMargins.top

        doc.save()
        snapshot = applyDocProperties(doc, props)
    }

    function after() {
        revertDocProperties(doc, snapshot)
        doc.restore()
        
        doc.x = position.x
        doc.y = !position.height && (position.y + innerHeight + computedMargins.top + computedMargins.bottom) || position.y
        position.after()
    }

    before()
    next({layout: nextLayoutWithPageBreak, breakPage: nextBreakPage})
    after()
}
