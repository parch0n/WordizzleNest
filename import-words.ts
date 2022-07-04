/*import { DataSource } from 'typeorm';
import { Words } from './src/games/words.entity';
import * as fs from 'fs';

const importWords = async (connection: DataSource) => {
    const lang: string = process.argv[4] || 'eng';
    const minLength: number = parseInt(process.argv[5]) || 5;
    const maxLength: number = parseInt(process.argv[6]) || 10;
    let data: string;
    try {
        data = fs.readFileSync(`${__dirname}/${process.argv[3]}`, 'utf-8').toLowerCase();
    } catch (err) {
        console.log('File not found');
        process.exit();
    }
    //data = data.replace(/[&\/\\#,+()$~%.\n'_|!":*-?<>{}[]/g, ' ').toLowerCase();
    data = data.replace(/[`~!@#$%^&*()_|+\-=?\n;:'",.<>\{\}\[\]\\\/]/g, ' ');
    const words: string[] = [...new Set(data.split(' '))] as string[];
    const filtered: string[] = words.filter(
        (el) => el.length >= minLength && el.length <= maxLength
    );
    const filtered_json = filtered.map((el) => {
        return {
            word: el,
            lang
        };
    });

    try {
        console.log('Importing...');
        await connection.mongoManager.save(Words, filtered_json);
        console.log(`${filtered_json.length} words imported!\nImporting Completed!`);
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteWords = async (connection: DataSource) => {
    try {
        await connection.mongoManager.clear(Words);
        console.log('Words deleted');
    } catch (err) {
        console.log(err.message);
    }
    process.exit();
};

let dataSource = new DataSource({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'wordle',
    useUnifiedTopology: true,
    entities: [Words]
});

dataSource
    .initialize()
    .then(async (connection) => {
        console.log('Connection successful...');

        if (process.argv[2] == '--import') await importWords(connection);
        else if (process.argv[2] == '--delete') await deleteWords(connection);
        else {
            console.log('Missing params...exiting');
            process.exit();
        }
        process.exit();
    })
    .catch((err) => console.log(err));

// createConnection({
//     type: 'mongodb',
//     host: 'localhost',
//     port: 27017,
//     database: 'wordle',
//     useUnifiedTopology: true,
//     entities: [Words]
// })
//     .then(async (connection) => {
//         console.log('Connection successful...');

//         if (process.argv[2] == '--import') await importWords(connection);
//         else if (process.argv[2] == '--delete') deleteWords(connection);
//         else {
//             console.log('Missing params...exiting');
//             process.exit();
//         }
//         process.exit();
//     })
//     .catch((err) => console.log(err));
*/
