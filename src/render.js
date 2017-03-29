import pdf from 'pdfkit'
import instantiateReactComponent from 'react/lib/instantiateReactComponent'
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles'
import ReactUpdates from 'react/lib/ReactUpdates'
import ReactElement from 'react/lib/ReactElement'
import DefaultInjection from './injection'
import invariant from 'fbjs/lib/invariant'

DefaultInjection.inject()

function render(nextElement, stream) {
    return new Promise((resolve, reject) => {
        try {
            invariant(
                ReactElement.isValidElement(nextElement),
                'render(): You must pass a valid ReactElement.'
            )

            const rootId = ReactInstanceHandles.createReactRootID(0)
            const component = instantiateReactComponent(nextElement)

            ReactUpdates.batchedUpdates(() => {
                const doc = new pdf({
                    autoFirstPage: false
                })

                const transaction = ReactUpdates.ReactReconcileTransaction.getPooled()

                doc.pipe(stream)

                transaction.perform(() => {
                    // Starts mounting recursive process
                    component.mountComponent(rootId, transaction, {doc})

                    doc.end()

                    stream.on('finish', () => {
                        resolve(component.getPublicInstance())
                    })
                })
                ReactUpdates.ReactReconcileTransaction.release(transaction);
            })
        } catch(err) {
            reject(err)
        }
    })
}

export default render
