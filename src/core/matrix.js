function multiply(a, b) {
    const a00 = a[0], a10 = a[1], a20 = a[2]
    const a01 = a[3], a11 = a[4], a21 = a[5]
    const a02 = a[6], a12 = a[7], a22 = a[8]
    
    const b00 = b[0], b10 = b[1], b20 = b[2]
    const b01 = b[3], b11 = b[4], b21 = b[5]
    const b02 = b[6], b12 = b[7], b22 = b[8]

    const r00 = a00 * b00 + a10 * b01 + a20 * b02
    const r10 = a00 * b10 + a10 * b11 + a20 * b12
    const r20 = a00 * b20 + a10 * b21 + a20 * b22

    const r01 = a01 * b00 + a11 * b01 + a21 * b02
    const r11 = a01 * b10 + a11 * b11 + a21 * b12
    const r21 = a01 * b20 + a11 * b21 + a21 * b22

    const r02 = a02 * b00 + a12 * b01 + a22 * b02
    const r12 = a02 * b10 + a12 * b11 + a22 * b12
    const r22 = a02 * b20 + a12 * b21 + a22 * b22

    return [r00, r10, r20, r01, r11, r21, r02, r12, r22]
}

export function product(...matrices) {
    var result = matrices[matrices.length - 1]

    for (var i = matrices.length - 2 ; i >= 0 ; i--) {
        result = multiply(matrices[i], result)
    }
    return result
}

export function rotation(d, [x, y]) {
    const cos = Math.cos
    const sin = Math.sin
    const r = d * Math.PI / 180 // angle from degree to rad

    return [
        [
            1, 0, x,
            0, 1, y,
            0, 0, 1
        ], [
            cos(r), -sin(r), 0,
            sin(r), cos(r), 0,
            0, 0, 1
        ], [
            1, 0, -x,
            0, 1, -y,
            0, 0, 1
        ]
    ]
}

export function scaling(s) {
    return [
        s, 0, 0,
        0, s, 0,
        0, 0, 1
    ]
}

export function matrix([x, y]) {
    return [
        x, 0, 0,
        y, 0, 0,
        1, 0, 0
    ]
}

export function point(matrix) {
    return [matrix[0], matrix[3]]
}
