import fs from 'fs'
import React from 'react'
import ReactPDF from '../src/ReactPDF'
import lorem from './resources/lorem'

const doc = (
    <document
        title='style'
        author='@ducret201'>
        <page margin={20}>
            <text
                align='center'>
                ~ Lorem ipsum 1 ~
            </text>
            <image
                src='examples/resources/img/react.png'
                x={200}
                y={300}
                width={200} />
            <linearLayout
                margins={({top: 20, bottom: 20})}
                divider={10}
                fontSize={8}>
                <text
                    fontSize={18}
                    font='Times-Roman'>
                    {lorem.short}
                </text>
                <textLayout
                    gravity='center'
                    width='80%'>
                    <text
                        font='*-Bold'>
                        ~ Lorem ipsum 1 ~
                    </text>
                    <text>{lorem.short}</text>
                    <text
                        font='*-Bold'>
                        ~ Lorem ipsum 1 ~
                    </text>
                </textLayout>
                <text>{lorem.short}</text>
            </linearLayout>
            <text align='center'>
                ~ Lorem ipsum 1 ~
            </text>
        </page>
    </document>
)

ReactPDF.render(doc, fs.createWriteStream('./examples/pdf/style.pdf')).then(() => {
    console.log('Style PDF created')
}).catch((err) => {
    console.log('Failed to create style PDF', err)
})
