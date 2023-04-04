import axios from 'axios';
import cheerio from 'cheerio';

class Letras {
  constructor() {
    this.headers_ff_mac = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' };
    this.root_url = "https://www.letras.mus.br";
    this.search_api_root_url = "https://solr.sscdn.co/letras/m1/?callback=LetrasSug&q=";
  }

  async search(search_term) {
    const full_url = this.search_api_root_url + search_term;
    const response = await axios.get(full_url, { headers: this.headers_ff_mac });
    if (response.status === 200) {
      const raw_result = response.data;
      const clean_result = JSON.parse(raw_result.replace("LetrasSug(", "").slice(0, -2))['response']['docs'];
      if (Array.isArray(clean_result)) {
        if (clean_result.length < 1) {
          console.log("Error: No results found!");
          return null;
        }
        return clean_result[0];
      }
      return clean_result;
    }
    return null;
  }

  async getLyrics(result) {
    if ('dns' in result && 'url' in result) {
      const response = await axios.get(`${this.root_url}/${result['dns']}/${result['url']}`);
      if (response.status === 200) {
        const html_base = response.data;
        const $ = cheerio.load(html_base);
        const all_text = [];
        const lyrics = $('div.cnt-letra');
        lyrics.find('p').each((i, el) => {
          all_text.push($(el).find("br").replaceWith("\n").end().text().trim());
        });
        return all_text.join('\n');
      }
    }
    return null;
  }
}


export default Letras;
