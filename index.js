const fs = require('fs');

fs.readFile('categories.json', (err, data) => createCategories(err, JSON.parse(data)));

function createRow(prev) {
    let row = '';
    return function (_, current) {
        const { Value } = current.names[0]
        return row += `${Value}; ${current.id}; ${prev.id};\n`
    }
}

function createCategories(e, data) {
    // Root
    let allCategories = data.categories.reduce(createRow({ id: -1 }), '')

    data.categories.forEach(({ id, categories }) => {
        // Lv2
        if (categories) {
            allCategories += categories.reduce(createRow({ id }), '')
            categories.forEach(({ id, categories }) => {
                // Lv3
                if (categories) {
                    allCategories += categories.reduce(createRow({ id }), '')
                    categories.forEach(({ id, categories }) => {
                        // Lv4
                        if (categories) {
                            allCategories += categories.reduce(createRow({ id }), '')
                        }
                    })
                }
            })
        }

    })

    console.log(allCategories)

    fs.writeFileSync('converted_subcategories_v2.csv', allCategories)
    return allCategories
}
