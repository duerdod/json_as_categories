const fs = require('fs');

fs.readFile('categories.json', (err, data) => createCategories(err, JSON.parse(data)));

const HEADER = ['Name', 'CategoryID', 'LinkID']

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

    console.log(`${allCategories}`)

    fs.writeFileSync(
        'converted_subcategories_v3.csv',
        `${HEADER.map(h => h).join(';')}\n${allCategories}`
    )

    return allCategories
}
