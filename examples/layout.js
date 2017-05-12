import fs from 'fs'
import React from 'react'
import ReactPDF from '../src/ReactPDF'
import lorem from './resources/lorem'

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
                margins={({top: 20, bottom: 20})}
                divider={10}>
                <path
                    width={100}
                    height={50}
                    path='M 0 50 A 25 25 0 0 1 100 50 Z'
                    fillOpacity={0.2} />
                <text>{lorem.short}</text>
                <rect
                    gravity='center'
                    width='50%'
                    height='100%'
                    fillOpacity={0.2} />
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
                <pathLayout
                    width={100}
                    height={50}
                    scale='30%'>
                    <path
                        path='M 0 50 A 25 25 0 0 1 100 50 Z'
                        fillOpacity={0.2} />
                    <text
                        x={100 / 2}
                        y={50 / 2}
                        width={100}
                        gravity='center'
                        align='center'>
                        ~~~~~
                    </text>
                </pathLayout>
                <text width='30%'>{lorem.short}</text>
                <rect
                    width='30%'
                    height='50%'
                    gravity='center'
                    fillOpacity={0.2} />
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
                <path
                    width={100}
                    height={50}
                    path='M 0 50 A 25 25 0 0 1 100 50 Z'
                    fillOpacity={0.2} />
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
                    fillOpacity={0.2} />
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
                    fillOpacity={0.2} />
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
