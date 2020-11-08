var file_system = require('fs');
var archiver = require('archiver');


var outputFileName = 'itch-dist/superfluous-laser.zip';

var output = file_system.createWriteStream(outputFileName);
const archive = archiver('zip');

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log(`Built to ${outputFileName}`);
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

var assetsFile = file_system.readFileSync('./assets/assets.json');
if (assetsFile === '') {
    console.log('empty assets.json');
    exit();
}



console.log(`zip Fixed Files`);
archive.file('index.html', { name: 'index.html' });
archive.directory('assets/css');
console.log(`zip Fixed Files Done`);

var assetsList = JSON.parse(assetsFile);

// TODO: extract filenames and call archive.file() at once
for (const [key, obj] of Object.entries(assetsList)) {
    console.log(`zip ${key}`);
    const { files } = obj;
    for (const file of files) {
        switch (file.type) {
            case 'atlasXML':
            case 'atlas': {
                const { textureURL, atlasURL } = file;
                archive.file(textureURL, { name: textureURL });
                archive.file(atlasURL, { name: atlasURL });
            } break;
            case 'image': {
                const { url } = file;
                archive.file(url, { name: url });
            } break;
            case 'audio': {
                const { url: urlList } = file;
                for (const url of urlList) {
                    archive.file(url, { name: url });
                }
            } break;
        }
    }
    console.log(`zip ${key} Done`);
}


archive.finalize();