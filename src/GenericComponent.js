import adapters from './adapters'
import layouts from './layouts'
import ReactMultiChild from 'react/lib/ReactMultiChild'

const GenericComponent = function(tag) {
    this._tag = tag
    this._renderedChildren = null
    this.node = null
}

const GenericComponentMixin = {
    construct(element) {
        this._currentElement = element
    },

    getPublicInstance() {
        return this.node
    },

    mountComponent(rootId, transaction, context) {
        const element = this._currentElement
        const {children, ...props} = element.props

        const next = (parentContext, filter) => {
            const nextContext = parentContext && {...context, ...parentContext} || context
            const filteredChildren = filter && children.filter && children.filter(filter) || children

            return this.mountChildren(filteredChildren, transaction, nextContext)
        }

        const mount = adapters[element.type] || layouts[element.type]
        if (mount) {
            this.node = mount(element, context, next)
            return this.node
        }
    },

    receiveComponent(){
    },

    getHostNode() {
    },

    unmountComponent() {
    }
}

Object.assign(
    GenericComponent.prototype,
    GenericComponentMixin,
    ReactMultiChild.Mixin
)

export default GenericComponent
