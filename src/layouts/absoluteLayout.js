import {applyDocProperties, revertDocProperties} from '../adapters/adapter'
import {computeMargins, computeGravity, computeWidth, computeHeight, computeScale} from './layout'

const BEFORE_PAGEBREAK_FILTER = (component) => {
    return component.props.pageBreak == 'before'
}

export default function(element, context, next) {
    const {children, x, y, width, height, gravity, margin, margins, ...props} = element.props
    const {doc, layout, pageBreak} = context

    const computedMargins = computeMargins(margin, margins)

    // init
    var position
    var innerHeight
    var snapshot

    function computeInnerHeight(height) {
        const newInnerHeight = doc.y + height - position.y - computedMargins.top
        return newInnerHeight > innerHeight && newInnerHeight || innerHeight
    }

    function nextLayout({x = 0, y = 0, width, height, gravity, scale}) {
        const computedScale = computeScale(position, computedMargins, undefined, width, scale)
        const computedWidth = computeWidth(position, computedMargins, undefined, width, computedScale)
        const computedHeight = computeHeight(innerHeight, height, computedWidth, computedScale)
        const computedGravity = computeGravity(position, innerHeight, undefined, gravity, computedWidth, computedHeight)

        return {
            x: doc.x = position.x + computedMargins.left + computedGravity.left + x,
            y: doc.y = position.y + computedMargins.top + computedGravity.top + y,
            width: computedWidth,
            height: computedHeight,
            scale: computedScale,
            after: function() {
                innerHeight = computeInnerHeight(this.height)
                doc.x = position.x + computedMargins.left
                doc.y = position.y + computedMargins.top
            }
        }
    }

    function nextPageBreak(pos, beforePageBreak, afterPageBreak) {
        return pageBreak(pos, () => {
            beforePageBreak()
            next({layout: nextLayout, pageBreak: () => false}, BEFORE_PAGEBREAK_FILTER)
            after()
        }, () => {
            before()
            afterPageBreak()
        })
    }

    function nextLayoutWithPageBreak(option) {
        var position = nextLayout(option)
        
        if (nextPageBreak(position, () => {}, () => {})) {
            position = nextLayout(option)
        }
        return position
    }

    function before() {
        position = layout({x, y, width, height, gravity})
        innerHeight = position.height - computedMargins.top - computedMargins.bottom

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
    next({layout: nextLayoutWithPageBreak, pageBreak: nextPageBreak})
    after()
}
