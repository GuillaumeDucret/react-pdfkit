import {computeMargins, computeWidth, computeHeight} from './layout'

export default function(element, context, next) {
    const {children, width, orientation, ...props} = element.props
    const {doc, layout} = context

    const position = layout({width})
    const margins = computeMargins(props)
    var innerHeight = 0

    function computeInnerHeight(height) {
        const newInnerHeight = doc.y + height - position.y - margins.top
        return newInnerHeight > innerHeight && newInnerHeight || innerHeight
    }

    function nextLayout({x, y, width, height}) {
        if (x != null && y != null) {
            // absolute layout
            return layout({x, y, width, height})
        }

        if (orientation == 'horizontal') {
            // horizontal linear layout
            return {
                x: doc.x,
                y: position.y + margins.top,
                width: computeWidth(position, margins, width),
                height: computeHeight(innerHeight, height),
                after: function() {
                    innerHeight = computeInnerHeight(this.height)
                    doc.x = doc.x + this.width
                    doc.y = this.y
                }
            }
        }

        // vertical linear layout
        return {
            x: position.x + margins.left,
            y: doc.y,
            width: computeWidth(position, margins, width),
            height: computeHeight(innerHeight, height),
            after: function() {
                innerHeight = computeInnerHeight(this.height)
                doc.x = this.x
                doc.y = doc.y + this.height
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
