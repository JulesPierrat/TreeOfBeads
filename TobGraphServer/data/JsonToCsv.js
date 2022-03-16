function convertJsonToCSV(path) {
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
    const filter = "REMOTE SENSING";
    const DELETED_CONCEPT = [];

    // CREATE CONCEPTS NODE
    // CREATE FILE
    let concept = 'data/concept.csv';
    fs.writeFileSync(concept, 'Id,Code,Name,Description,Category\r');

    // WRITE IN FILE
    let key = 0;
    obj.concepts.forEach(c => {
        let CAT = "NONE"
        if (c.description.toUpperCase().search(filter) != -1 || c.name.toUpperCase().search(filter) != -1) {
            CAT = "REMOTE SENSING";
        } else {
            DELETED_CONCEPT.push(key);
        }
        let row = key + "," + c.code + "," + c.name.replace(/,/gi, " -").replace(/"/gi, "'") + "," + c.description.replace(/,/gi, " -").replace(/(\r\n|\n|\r)/gm, "\\r").replace(/"/gi, "'") + "," + CAT + "\r";
        fs.appendFileSync(concept, row);
        key++;
    });

    // CREATE CONTRIBUTOR
    // CREATE FILE
    let contributor = 'data/contributor.csv';
    fs.writeFileSync(contributor, 'Id,Concepts,Name,Description,Url\r');

    key = 0;
    obj.contributors.forEach(c => {
        let used = false;
        let CONCEPTS = [];
        c.concepts.forEach(cc => {
            if (!DELETED_CONCEPT.includes(cc) && !used) {
                used = true;
                CONCEPTS.push(cc);
            }
        });
        if (used) {
            let row = +key + "," + CONCEPTS.join(":") + "," + c.name.replace(/,/gi, " -").replace(/"/gi, "'") + "," + c.description.replace(/,/gi, " -").replace(/(\r\n|\n|\r)/gm, "\\r").replace(/"/gi, "'") + "," + c.url + "\r";
            fs.appendFileSync(contributor, row);
        }
        key++;
    });

    // CREATE REFERENCE
    // CREATE FILE
    let reference = 'data/reference.csv';
    fs.writeFileSync(reference, 'Id,Concepts,Name,Description,Url\r');

    key = 0;
    obj.references.forEach(c => {
        let used = false;
        let CONCEPTS = [];
        c.concepts.forEach(cc => {
            if (!DELETED_CONCEPT.includes(cc) && !used) {
                used = true;
                CONCEPTS.push(cc);
            }
        });
        if (used) {
            let row = +key + "," + CONCEPTS.join(":") + "," + c.name.replace(/,/gi, " -").replace(/"/gi, "'") + "," + c.description.replace(/,/gi, " -").replace(/(\r\n|\n|\r)/gm, "\\r").replace(/"/gi, "'") + "," + c.url + "\r";
            fs.appendFileSync(reference, row);
        }
        key++;
    });

    // CREATE RELATION
    // CREATE FILE
    let relation = 'data/relation.csv';
    fs.writeFileSync(relation, 'Id,Name,Source,Target\r');

    key = 0;
    obj.relations.forEach(r => {
        let row = key + "," + r.name.toUpperCase().replace(/ /gi, "_") + "," + r.source + "," + r.target + "\r";
        fs.appendFileSync(relation, row);
        key++;
    });

    // CREATE SKILL
    // CREATE FILE
    let skill = 'data/skill.csv';
    fs.writeFileSync(skill, 'Id,Name,Concepts\r');

    key = 0;
    obj.skills.forEach(s => {
        let used = false;
        let CONCEPTS = [];
        s.concepts.forEach(cc => {
            if (!DELETED_CONCEPT.includes(cc) && !used) {
                used = true;
                CONCEPTS.push(cc);
            }
        });
        if (used) {
            let row = +key + "," + s.name.replace(/,/gi, " -").replace(/"/gi, "'") + "," + CONCEPTS.join(":") + "\r";
            fs.appendFileSync(skill, row);
        }
        key++;

    });


}

const path = "data/current.json";
convertJsonToCSV(path);