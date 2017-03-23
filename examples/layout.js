import fs from 'fs'
import React from 'react'
import ReactPDF from '../'
import lorem from './resources/lorem'

const styles = {
    rect: {
        fillOpacity: 0.2
    }
}

const doc = (
    <document
        title='Layout'
        author='@ducret201'>
        <page margin={20}>
            <text align='center'>~ Lorem ipsum 1 ~</text>
            <image
                src='examples/resources/img/react.png'
                x={200}
                y={300}
                width={200} />
            <linearLayout
                margins={({top: 20, bottom: 20})}>
                <rect
                    width={50}
                    height={50}
                    {...styles.rect} />
                <text>{lorem.short}</text>
                <rect
                    width='50%'
                    height='100%'
                    {...styles.rect} />
            </linearLayout>
            <text align='center'>~ Lorem ipsum 1 ~</text>
        </page>
        <page margin={20}>
            <text align='center'>~ Lorem ipsum 2 ~</text>
            <image
                src='examples/resources/img/react.png'
                x={200}
                y={300}
                width={200} />
            <linearLayout
                orientation='horizontal'
                margins={({top: 20, bottom: 20})}>
                <rect
                    width={50}
                    height={50}
                    {...styles.rect} />
                <text width='30%'>{lorem.short}</text>
                <rect
                    width='30%'
                    height='100%'
                    {...styles.rect} />
            </linearLayout>
            <text align='center'>~ Lorem ipsum 2 ~</text>
        </page>
        <page margin={20}>
            <text align='center'>~ Lorem ipsum 3 ~</text>
            <image
                src='examples/resources/img/react.png'
                x={200}
                y={300}
                width={200} />
            <absoluteLayout
                margins={({top: 20, bottom: 20})}>
                <rect
                    width={50}
                    height={50}
                    {...styles.rect} />
                <text
                    x={100}
                    y={100}
                    width='30%'>
                    {lorem.short}
                </text>
                <rect
                    x={300}
                    y={100}
                    width='30%'
                    height='100%'
                    {...styles.rect} />
            </absoluteLayout>
            <text align='center'>~ Lorem ipsum 3 ~</text>
        </page>
        <page margin={20}>
            <text align='center'>~ Lorem ipsum 4 ~</text>
            <image
                src='examples/resources/img/react.png'
                x={200}
                y={300}
                width={200} />
            <absoluteLayout
                margins={({top: 20, bottom: 20})}>
                <linearLayout margin={20}>
                    <text>{lorem.long}</text>
                </linearLayout>
                <rect
                    x={0}
                    y={0}
                    height='100%'
                    {...styles.rect} />
            </absoluteLayout>
            <text align='center'>~ Lorem ipsum 4 ~</text>
        </page>
    </document>
)

ReactPDF.render(doc, fs.createWriteStream('./examples/pdf/layout.pdf')).then(() => {
    console.log('Layout PDF created')
}).catch((err) => {
    console.log('Failed to create layout PDF', err)
})
