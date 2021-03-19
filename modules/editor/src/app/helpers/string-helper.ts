export class helper {
  static sanitizeHtml(row: string) {
    return row.replace(/<[^>]+>/g, '');
  }
}
