export default function(element, context, next) {
    const {children, src, x, y, width, height, gravity, ...props} = element.props
    const {doc, layout} = context

    const position = layout({x, y, width, height, gravity})

    const snapshotY = doc.y
    doc.image(src, position.x, position.y, {width: position.width, height: position.height, ...props})
	doc.y = snapshotY

    position.after()
}
