const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject('I could not find that file.')
            resolve(data);

        })
    });
}

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) reject("Could not write a file")
            resolve('success');
        })
    })
}

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`breed: ${data}`);

        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);

        await writeFilePro('dog-img.txt', res.body.message);
        console.log('dog image file saved to the file!');

    } catch (err) {
        console.log(err);
    }
};
//getDogPic();

(async () => {
    try {

        console.log("1: will get dog pic");
        const x = await getDogPic();
        console.log(x);
        console.log("2: done getting dog pic");
    } catch (err) {
        console.log('ERROR');
    }

})();
/*
readFilePro(`${__dirname}/dog.txt`).then(data => {
    console.log(`breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
}).then(res => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message)

}).then(() => {
    console.log('dog image file saved to the file!');
}).catch(err => {
    console.log(err);
})

*/




