import * as fs from 'fs';
import mongoose from 'mongoose';

const importWords = async (conn: mongoose.Connection) => {
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
        await conn.collection('words').insertMany(filtered_json);
        console.log(`${filtered_json.length} words imported!\nImporting Completed!`);
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteWords = async (conn: mongoose.Connection) => {
    try {
        await conn.collection('words').deleteMany({});
        console.log('Words deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

mongoose
    .createConnection('mongodb://localhost:27017/wordle')
    .asPromise()
    .then(async (conn) => {
        console.log('Connection successful...');
        if (process.argv[2] == '--import') await importWords(conn);
        else if (process.argv[2] == '--delete') await deleteWords(conn);
        else {
            console.log('Missing params...exiting');
            process.exit();
        }
        process.exit();
    })
    .catch((err) => console.log(err));
