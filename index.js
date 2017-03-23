import mount from './lib/mount'

function render(element, stream) {
    return new Promise((resolve, reject) => {
        try {
            mount(element, stream, () => {
                resolve(stream)
            })
        } catch(err) {
            reject(err)
        }
    })
}

export default {render}
