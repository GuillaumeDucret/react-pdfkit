import {computeMargins, computeWidth, computeHeight} from './layout'

export default function(element, context, next) {
    const {children, width, ...props} = element.props
    const {doc, layout} = context

    const position = layout({width})
    const margins = computeMargins(props)
    var innerHeight = 0

    function computeInnerHeight(height, y) {
        var newInnerHeight = 0
        if (doc.y == position.y + margins.top) {
            // doc.y didn't move
            newInnerHeight = height + y
        } else {
            // doc.y moved
            newInnerHeight = doc.y - position.y - margins.top
        }
        return newInnerHeight > innerHeight && newInnerHeight || innerHeight
    }

    function nextLayout({x = 0, y = 0, width, height}) {
        return {
            x: position.x + margins.left + x,
            y: position.y + margins.top + y,
            width: computeWidth(position, margins, width),
            height: computeHeight(innerHeight, height),
            after: function() {
                innerHeight = computeInnerHeight(this.height, y)
                doc.x = position.x + margins.left
                doc.y = position.y + margins.top
            }
        }
    }

    // before
    doc.x = position.x + margins.left
    doc.y = position.y + margins.top

    next({layout: nextLayout})

    // after
    doc.x = position.x + margins.left
    doc.y = position.y + innerHeight + margins.top + margins.bottom
    position.after()
}
