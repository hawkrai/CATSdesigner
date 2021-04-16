export class helper {
  static sanitizeHtml(row: string) {
    return row.replace(/<[^>]+>/g, '');
  }
  static transformLanguageLine(line: string){
    if(line.includes("en")) return "en-gb";
    else if(line.includes("ru")) return "ru";
    else return "ru";
  }
}
