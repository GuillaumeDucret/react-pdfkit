import fs from 'fs'
import React from 'react'
import ReactPDF from '../src/ReactPDF'
import lorem from './resources/lorem'

function mapCount(fnc, count) {
    var result = []
    for (var i = 0 ; i < count ; i++) {
        result.push(fnc(i))
    }
    return result
}

const doc = (
    <document
        title='example'
        author='@ducret201'>
        <page
            margin={20}
            divider={10}>
            <text align='center'>~ Lorem ipsum ~</text>
            <image
                src='examples/resources/img/react.png'
                x={200}
                y={300}
                width={200} />
            {mapCount((index) => (
                <linearLayout
                    key={index}
                    orientation='horizontal'
                    divider={10}>
                    <absoluteLayout
                        width='50%'>
                        <linearLayout margin={20}>
                            <text align='justify'>{lorem.short}</text>
                            <text align='justify'>{lorem.short}</text>
                        </linearLayout>
                        <rect
                            pageBreak='before'
                            height='100%'
                            cornerRadius={10}
                            fillOpacity={0.2} />
                        <image
                            pageBreak='before'
                            src='examples/resources/img/react.png'
                            x={4}
                            y={4}
                            width={20}/>
                    </absoluteLayout>
                    <absoluteLayout
                        width='50%'>
                        <linearLayout margin={20}>
                            <text align='justify'>{lorem.short}</text>
                            <text align='justify'>{lorem.short}</text>
                        </linearLayout>
                        <rect
                            pageBreak='before'
                            height='100%'
                            cornerRadius={10}
                            fillOpacity={0.2} />
                        <image
                            pageBreak='before'
                            src='examples/resources/img/react.png'
                            x={4}
                            y={4}
                            width={20}/>
                    </absoluteLayout>
                </linearLayout>
            ), 4)}

        </page>
    </document>
)

ReactPDF.render(doc, fs.createWriteStream('./examples/pdf/page-break.pdf')).then(() => {
    console.log('Page break PDF created')
}).catch((err) => {
    console.log('Failed to create page break PDF', err)
})
