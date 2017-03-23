import ReactInjection from 'react/lib/ReactInjection'
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy'
import PDFRendererReconcileTransaction from './reconcileTransaction'
import GenericComponent from './GenericComponent'
import TextComponent from './TextComponent'

function inject() {
    ReactInjection.NativeComponent.injectGenericComponentClass(GenericComponent)
    ReactInjection.NativeComponent.injectTextComponentClass(TextComponent)
    ReactInjection.Updates.injectReconcileTransaction(PDFRendererReconcileTransaction)
    ReactInjection.Updates.injectBatchingStrategy(ReactDefaultBatchingStrategy)
}

export default {inject}
