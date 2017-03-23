export default function(element, context, next) {
    const {children, x, y, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y})
    const chilNodes = next()

    doc.list(chilNodes, position.x, position.y, props)
}
