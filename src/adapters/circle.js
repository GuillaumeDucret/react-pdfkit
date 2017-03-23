export default function(element, context, next) {
	const {x, y, radius} = element.props
	const {doc, layout} = context

	const position = layout({x, y})

	doc.circle(position.x, position.y, radius).stroke()
	position.after()
}
