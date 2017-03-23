import {computeWidth} from '../layouts/layout'

export default function(element, context, next) {
    const {children, ...props} = element.props
    const {doc} = context

    doc.addPage(props)

    const page = doc.page
    const margins = page.margins
    const position = {
        x: 0,
        y: 0,
        width: page.width
    }

    function layout({x, y, width, height = 0}) {
        if (x != null && y != null) {
            // absolute layout
            return {
                x: position.x + margins.left + x,
                y: position.y + margins.top + y,
                width: computeWidth(position, margins, width),
                height: height,
                after: function() {
                }
            }
        }

        // linear layout
        return {
            x: position.x + margins.left,
            y: doc.y,
            width: computeWidth(position, margins, width),
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

    next({layout})

    // after
    doc.x = position.x + margins.left
    doc.y = doc.y + margins.bottom
}
