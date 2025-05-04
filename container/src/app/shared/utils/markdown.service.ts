import { Injectable } from '@angular/core'
import { marked, Renderer } from 'marked'
import * as DOMPurify from 'dompurify'

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  private renderer = new Renderer()

  constructor() {
    this.renderer.link = (href, title, text) => {
      const safeHref = href || ''
      const safeTitle = title ? ` title="${title}"` : ''
      return (
        `<a href="${safeHref}"${safeTitle}` +
        ` target="_blank" rel="noopener noreferrer">${text}</a>`
      )
    }
  }

  toHtml(src: string): string {
    const dirty = marked.parse(src, {
      gfm: true,
      breaks: true,
      renderer: this.renderer,
    })

    return DOMPurify.sanitize(dirty, {
      ADD_ATTR: ['target', 'rel'],
    })
  }
}
