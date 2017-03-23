const TextComponent = function(tag) {
    this._tag = tag
}

const TextComponentMixin = {
    construct(element) {
        this._currentElement = element
    },

    mountComponent(transaction, nativeParent, nativeContainerInfo, context) {
        return this._currentElement
    },
  
    receiveComponent(){
    },

    getHostNode() {
    },

    unmountComponent() {
    }
}

Object.assign(
    TextComponent.prototype,
    TextComponentMixin
)

export default TextComponent
