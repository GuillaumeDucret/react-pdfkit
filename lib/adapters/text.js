export default function(element, context, next) {
    const {children, x, y, width, ...props} = element.props
    const {doc, layout} = context

    const childNodes = next()
    const position = layout({x, y, width})

    doc.text(childNodes[0], position.x, position.y, {...props, width: position.width})
    position.after()
};
