export function computeMargins(margin = 0, margins = {}) {
    const defaultMargins = {
        top: margin,
        bottom: margin,
        left: margin,
        right: margin
    }

    return {...defaultMargins, ...margins}
}

export function computeDivider(children, orientation, divider) {
    return {
        width: orientation == 'horizontal' && divider || 0,
        height: orientation != 'horizontal' && divider || 0,
        count: children && children.length - 1 || 0
    }
}

export function computeGravity(position, innerHeight, orientation, gravity, width, height) {
    switch(gravity) {
        case 'center':
            return {
                top: orientation == 'horizontal' && (innerHeight / 2 - height / 2) || 0,
                left: orientation != 'horizontal' && (position.width / 2 - width / 2) || 0
            }
        case 'end':
            return {
                top: orientation == 'horizontal' && (innerHeight - height) || 0,
                left: orientation != 'horizontal' && (position.width - width) || 0
            }
        default:
            return {
                top: 0,
                left: 0
            }
    }
}

export function computeWidth(position, margins, divider = {width: 0, count: 0}, width) {
    if (width == null) {
        return position.width - margins.left - margins.right
    }

    if (typeof width == 'string' && width[width.length - 1] == '%') {
        const percentWidth = parseInt(width.slice(0, width.length - 1))
        return (position.width - margins.left - margins.right - (divider.width * divider.count)) * percentWidth / 100
    }

    return width
}

export function computeHeight(innerHeight, height) {
    if (height == null) {
        return 0
    }

    if (typeof height == 'string' && height[height.length - 1] == '%') {
        const percentHeight = parseInt(height.slice(0, height.length - 1))
        return innerHeight * percentHeight / 100
    }

    return height
}