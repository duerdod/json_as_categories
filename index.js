const fs = require('fs');

fs.readFile('categories.json', (err, data) => createCategories(err, JSON.parse(data)));

function createCategories(err, data) {

    const categories = data.categories.reduce((final, lv1) => {
        final += `${lv1.names[0].Value}; ${lv1.id}; ${-1};\n`
        if (lv1.categories) {
            lv1.categories.reduce((_, lv2) => {
                final += `${lv2.names[0].Value}; ${lv2.id}; ${lv1.id};\n`
                if (lv2.categories) {
                    lv2.categories.reduce((_, lv3) => {
                        final += `${lv3.names[0].Value}; ${lv3.id}; ${lv2.id};\n`
                        return final
                    }, '')
                }
                return final;
            }, '')
        }
        return final
    }, '')

    writeToJSon(categories)
    return categories
}

function writeToJSon(data) {
    fs.writeFileSync('converted_subcategories.csv', data)
}























/*
function createCategories(err, data) {

    const categories = data.categories.reduce((final, lv1) => {
        final += `${lv1.names[0].Value}; ${lv1.id}; ${-1};\n`
        if (lv1.categories) {
            lv1.categories.reduce((_, lv2) => {
                final += `${lv2.names[0].Value}; ${lv2.id}; ${lv1.id};\n`
                if (lv2.categories) {
                    lv2.categories.reduce((_, lv3) => {
                        final += `${lv3.names[0].Value}; ${lv3.id}; ${lv2.id};\n`
                        return final
                    }, '')
                }
                return final;
            }, '')
        }
        return final
    }, '')

    writeToJSon(categories)
    return categories
}

function writeToJSon(data) {
    fs.writeFileSync('converted_subcategories.csv', data)
}

*/