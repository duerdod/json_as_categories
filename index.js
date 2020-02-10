const fs = require('fs');

fs.readFile('categories.json', (err, data) => createCategories(err, JSON.parse(data)));

function createLine(prev) {
    let final = '';
    function inner(_, current) {
        const { Value } = current.names[0]
        return final += `${Value}; ${current.id}; ${prev.id};\n`
    }
    return inner
}

function createCategories(e, data) {
    let allCategories = data.categories.reduce(createLine({ id: -1 }), '')

    data.categories.forEach(({ id, categories }) => {
        // Lv2
        if (categories) {
            allCategories += categories.reduce(createLine({ id }), '')
            categories.forEach(({ id, categories }) => {
                // Lv3
                if (categories) {
                    allCategories += categories.reduce(createLine({ id }), '')
                }

            })
        }

    })

    console.log(allCategories)

    // fs.writeFileSync('converted_subcategories_v2.csv', allCategories)
    return allCategories
}