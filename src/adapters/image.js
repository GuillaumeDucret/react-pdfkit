export default function(element, context, next) {
    const {children, src, x, y, width = 0, height = 0, gravity, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y, width, height, gravity})

    doc.image(src, position.x, position.y, {width: position.width, height: position.height, ...props})
	doc.y = !position.height && doc.y || position.y

    position.after()
}
