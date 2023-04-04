import Letras from "./index.js";

async function cli() {
    const letras = new Letras();
    const result = await letras.search(process.argv.slice(2).join(' '));
    if (result !== null) {
        const lyrics = await letras.getLyrics(result);
        if (lyrics !== null) {
            console.log(lyrics);
        } else {
            console.log('Error: Failed to fetch lyrics.');
        }
    } else {
        console.log('Error: Failed to search for song.');
    }
}

cli();
