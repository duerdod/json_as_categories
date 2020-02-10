const fs = require('fs');

/*
Create csv with Name, ID and ParentID based on json input.
Not generic. Yet.
*/

const HEADERS = ['Name', 'CategoryID', 'LinkID']
const VERSION = 'test'
const FOLDER = `${__dirname}/finished`

// TODO: Add to module exports and invoke it with yarn.
fs.readFile('categories.json', (err, data) => createCategories(err, JSON.parse(data)));

function createRow(prev) {
    let row = '';
    return function (_, current) {
        const { Value } = current.names[0]
        return row += `${Value}; ${current.id}; ${prev.id}\n`
    }
}

function createCategories(e, data) {
    // Root
    let allCategories = data.categories.reduce(createRow({ id: -1 }), '')

    // Rest (if any)
    // Call recursivly since we cannot know how deep the category tree is.
    function generateCategories(categories) {
        if (!categories) return
        categories.forEach(cat => {
            if (cat.categories) {
                allCategories += cat.categories.reduce(createRow({ id: cat.id }), '')
                generateCategories(cat.categories)
            }
        })
    }

    generateCategories(data.categories)

    // Print array with indexes.
    console.log(`${allCategories.split('\n').map((row, i) => `${i} ${row}\n`).join('')}`)

    // Write to csv.
    fs.writeFileSync(
        `${FOLDER}/converted_subcategories_${VERSION}.csv`,
        `${HEADERS.map(h => h).join(';')}\n${allCategories}`
    )

    return allCategories
}
