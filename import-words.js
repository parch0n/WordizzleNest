const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Word = require('./models/wordModel');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
).replace('<USER>', process.env.USER);

const connectToDb = async () => {
    await mongoose
        .connect(DB)
        .then((con) => {
            console.log('DB connection successful!');
        })
        .catch((err) => {
            console.log(err.message);
        });
};

const importWords = async () => {
    console.log('Importing...');
    const lang = process.argv[4] || 'eng';
    const minLength = process.argv[5] || 5;
    const maxLength = process.argv[6] || 10;
    let data;
    try {
        data = fs.readFileSync(`${__dirname}/${process.argv[3]}`, 'utf-8').toLowerCase();
    } catch (err) {
        console.log('File not found');
        process.exit();
    }
    //data = data.replace(/[&\/\\#,+()$~%.\n'_|!":*-?<>{}[]/g, ' ').toLowerCase();
    data = data.replace(/[`~!@#$%^&*()_|+\-=?\n;:'",.<>\{\}\[\]\\\/]/g, ' ');
    const words = [...new Set(data.split(' '))];
    const filtered = words.filter(
        (el) => el.length >= minLength && el.length <= maxLength
    );
    const filtered_json = filtered.map((el) => {
        return {
            word: el,
            lang
        };
    });

    try {
        await Word.create(filtered_json, { validateBeforeSave: true });
        console.log(`${filtered_json.length} words added!\nImporting Completed!`);
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteWords = async () => {
    try {
        await Word.deleteMany();
        console.log('Words deleted');
    } catch (err) {
        console.log(err.message);
    }
    process.exit();
};

connectToDb();
if (process.argv[2] == '--import') importWords();
else if (process.argv[2] == '--delete') deleteWords();
else {
    console.log('Missing params...exiting');
    process.exit();
}
