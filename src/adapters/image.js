export default function(element, context, next) {
    const {children, src, x, y, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y})

    doc.image(src, position.x, position.y, props)
    position.after()
}
