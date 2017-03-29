import fs from 'fs'
import React from 'react'
import ReactPDF from '../src/ReactPDF'
import lorem from './resources/lorem'

const styles = {
    rect: {
        fillOpacity: 0.2
    }
}

const doc = (
    <document
        title='example'
        author='@ducret201'>
        <page margin={20}>
            <text align='center'>~ Lorem ipsum ~</text>
            <image
                src='examples/resources/img/react.png'
                x={200}
                y={300}
                width={200} />
            <linearLayout
                orientation='horizontal'
                margins={({top: 20, bottom: 20})}>
                <absoluteLayout
                    width='50%'
                    margins={({right: 10})}>
                    <linearLayout margin={20}>
                        <text align='justify'>{lorem.short}</text>
                    </linearLayout>
                    <rect
                        height='100%'
                        cornerRadius={10}
                        {...styles.rect} />
                    <image
                        src='examples/resources/img/react.png'
                        x={4}
                        y={4}
                        width={20}/>
                </absoluteLayout>
                <absoluteLayout
                    width='50%'
                    margins={({left: 10})}>
                    <linearLayout margin={20}>
                        <text align='justify'>{lorem.short}</text>
                    </linearLayout>
                    <rect
                        height='100%'
                        cornerRadius={10}
                        {...styles.rect} />
                    <image
                        src='examples/resources/img/react.png'
                        x={4}
                        y={4}
                        width={20}/>
                </absoluteLayout>
            </linearLayout>
        </page>
    </document>
)

ReactPDF.render(doc, fs.createWriteStream('./examples/pdf/example.pdf')).then(() => {
    console.log('Example PDF created')
}).catch((err) => {
    console.log('Failed to create example PDF', err)
})
