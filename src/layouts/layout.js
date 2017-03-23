export function computeMargins({margin = 0, margins = {}}) {
    const defaultMargins = {
        top: margin,
        bottom: margin,
        left: margin,
        right: margin
    }

    return {...defaultMargins, ...margins}
}

export function computeWidth(position, margins, width) {
    if (width == null) {
        return position.width - margins.left - margins.right
    }

    if (typeof width == 'string' && width[width.length - 1] == '%') {
        const percentWidth = parseInt(width.slice(0, width.length - 1))
        return (position.width - margins.left - margins.right) * percentWidth / 100
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