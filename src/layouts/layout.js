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

export function computeGravity(position, innerHeight, orientation, gravity = '', width, height) {
    return gravity.split('|').reduce((result, gravity) => {
        switch(gravity) {
            case 'center':
                return {
                    top: orientation == 'horizontal' && (innerHeight / 2 - height / 2) || result.top,
                    left: orientation != 'horizontal' && (position.width / 2 - width / 2) || result.left
                }
            case 'end':
                return {
                    top: orientation == 'horizontal' && (innerHeight - height) || result.top,
                    left: orientation != 'horizontal' && (position.width - width) || result.left
                }
            case 'right':
                return {
                    top: result.top,
                    left: position.width - width
                }
            case 'bottom':
                return {
                    top: innerHeight - height,
                    left: result.left
                }
            default:
                return result
        }
    }, {top: 0, left: 0})
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