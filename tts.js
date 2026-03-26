const https = require('https');
const fs = require('fs');

const chunk1 = "మాదిగమిత్ర మాట్రిమోని కు సుస్వాగతం. వధూ వరుల ప్రొఫైల్స్ ను చూడడానికి దయచేసి క్రిందకు స్క్రోల్ చేయండి.";
const chunk2 = "వధువు కొఱకు బ్రైడ్ మీద, వరునికొరకు గ్రూమ్ మీద క్లిక్ చేయండి.";
const chunk3 = "మీకు తగిన వారి కోడ్ నెంబర్ సెలెక్ట్ చేసుకొని మాకు వాట్సాప్ చేయండి.";
const chunk4 = "అప్లికేషన్ ఫారం కోసం పూర్తిగా క్రిందకు స్క్రోల్ చేయండి.";

const chunks = [chunk1, chunk2, chunk3, chunk4];

async function downloadChunk(text, filename) {
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=te&client=tw-ob`;
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => {});
            reject(err);
        });
    });
}

(async () => {
    for (let i = 0; i < chunks.length; i++) {
        await downloadChunk(chunks[i], `chunk${i}.mp3`);
    }
    // concatenate mp3 files
    const out = fs.createWriteStream('d:/matrimony/frontend/public/welcome.mp3');
    for (let i = 0; i < chunks.length; i++) {
        const data = fs.readFileSync(`chunk${i}.mp3`);
        out.write(data);
    }
    out.end();
    console.log('welcome.mp3 created successfully!');
    // cleanup
    for (let i = 0; i < chunks.length; i++) {
        fs.unlinkSync(`chunk${i}.mp3`);
    }
})();
