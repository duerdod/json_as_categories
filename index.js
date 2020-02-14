const fs = require('fs');

/*
Create csv with Name, ID and ParentID based on json input.
Invoke with with `yarn createCategories` or `npm run createCategories`


    Globals.
*/

const FOLDER = `${__dirname}/finished`
const VERSION = () => fs.readdirSync(FOLDER).length + 1

/*
    SQL
*/

const CREATE_CATEGORY = (name, category, parent) =>
    `
    INSERT INTO tbl_Categories ([Name], [CategoryID], [LinkID]) VALUES('${name}', ${category}, ${parent})
    INSERT INTO tbl_CategoriesLocalized ([CategoryID], [Culture], [Name]) VALUES(${category}, 'sv-SE', '${name}')
    INSERT INTO tbl_CategoriesInMarkets VALUES(${category}, 1, 1)
    `

function createCategories() {
    fs.readFile('categories.json', (err, data) => generateRows(err, JSON.parse(data)));
}

function createRow(prev) {
    let row = '';
    return function (_, current) {
        const { Value } = current.names[0]
        return row += CREATE_CATEGORY(Value, current.id, prev.id)
    }
}

function generateRows(err, data) {
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

    // Print list with indexes.
    console.log(`${allCategories.split('\n').map((row, i) => `${i} ${row}\n`).join('')}`)

    // Write to csv.
    fs.writeFileSync(
        `${FOLDER}/converted_subcategories_${VERSION()}.csv`,
        `${allCategories}`
    )

    return allCategories
}

module.exports.createCategories = createCategories;