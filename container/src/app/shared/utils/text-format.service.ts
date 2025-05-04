import { Injectable } from '@angular/core'

export type FormatTag =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'ul'
  | 'ol'
  | 'code'
  | 'quote'
  | 'link'

export interface FormatResult {
  value: string
  start: number
  end: number
}

@Injectable({ providedIn: 'root' })
export class TextFormatService {
  private isUnordered = (l: string) => /^(\s*)([-+*])\s+/.test(l)
  private isOrdered = (l: string) => /^(\s*)\d+\.\s+/.test(l)

  private toggleUnordered(lines: string[]): string[] {
    const all = lines.every(this.isUnordered)
    return lines.map((l) =>
      all
        ? l.replace(/^(\s*)([-+*])\s+/, '$1')
        : this.isUnordered(l)
          ? l
          : l.replace(/^(\s*)/, '$1- ')
    )
  }

  private toggleOrdered(lines: string[]): string[] {
    const all = lines.every(this.isOrdered)
    return lines.map((l, i) =>
      all
        ? l.replace(/^(\s*)\d+\.\s+/, '$1')
        : this.isOrdered(l)
          ? l
          : l.replace(/^(\s*)/, `$1${i + 1}. `)
    )
  }

  private toggleInline(
    value: string,
    s: number,
    e: number,
    left: string,
    right: string = left
  ): FormatResult {
    const before = value.slice(0, s)
    const sel = value.slice(s, e)
    const after = value.slice(e)

    const hasFormat = before.endsWith(left) && after.startsWith(right)

    if (hasFormat) {
      return {
        value: before.slice(0, -left.length) + sel + after.slice(right.length),
        start: s - left.length,
        end: e - left.length,
      }
    } else {
      return {
        value: before + left + sel + right + after,
        start: s + left.length,
        end: e + left.length,
      }
    }
  }

  private toggleBlockCode(value: string, s: number, e: number): FormatResult {
    const before = value.slice(0, s)
    const sel = value.slice(s, e)
    const after = value.slice(e)
    const fence = '```'

    const hasFence =
      before.endsWith(`${fence}\n`) && after.startsWith(`\n${fence}`)

    if (hasFence) {
      return {
        value: before.slice(0, -4) + sel + after.slice(fence.length + 1),
        start: s - 4,
        end: e - 4,
      }
    } else {
      return {
        value: `${before}${fence}\n${sel}\n${fence}${after}`,
        start: s + fence.length + 1,
        end: e + fence.length + 1,
      }
    }
  }

  private toggleQuote(value: string, s: number, e: number): FormatResult {
    const needLeadingLf = s > 0 && value[s - 1] !== '\n'

    const before = value.slice(0, s)
    const selection = value.slice(s, e)
    const after = value.slice(e)

    const lines = selection.length ? selection.split('\n') : ['']
    const allQuoted = lines.every((l) => l.startsWith('> '))

    const newLines = allQuoted
      ? lines.map((l) => l.replace(/^> /, ''))
      : lines.map((l) => (l.startsWith('> ') ? l : `> ${l}`))

    const prefix = needLeadingLf ? '\n' : ''

    return {
      value: before + prefix + newLines.join('\n') + after,
      start: s + (needLeadingLf ? 1 : 0) + 2,
      end: e + (needLeadingLf ? 1 : 0) + (allQuoted ? -2 : 2),
    }
  }

  detect(value: string, s: number, e: number): Set<FormatTag> {
    const formats = new Set<FormatTag>()
    const sel = value.slice(s, e)
    const before = value.slice(0, s)
    const after = value.slice(e)
    const openFence = before.lastIndexOf('```\n')
    const closeFence = value.indexOf('\n```', e)

    if (before.endsWith('**') && after.startsWith('**')) formats.add('bold')
    if (before.endsWith('_') && after.startsWith('_')) formats.add('italic')
    if (before.endsWith('<u>') && after.startsWith('</u>'))
      formats.add('underline')
    if (before.endsWith('`') && after.startsWith('`')) formats.add('code')
    else if (
      openFence !== -1 &&
      closeFence !== -1 &&
      openFence < s &&
      closeFence >= e
    ) {
      formats.add('code')
    }
    if (
      /\[.*?\]\(.*?\)/s.test(
        before.slice(-sel.length - 3) + sel + after.slice(0, 5)
      )
    )
      formats.add('link')

    const lines = sel.length ? sel.split('\n') : ['']
    if (lines.every((l) => l.startsWith('> '))) formats.add('quote')
    if (lines.every(this.isUnordered)) formats.add('ul')
    if (lines.every(this.isOrdered)) formats.add('ol')

    return formats
  }

  format(
    tag: FormatTag,
    value: string,
    selectionStart: number,
    selectionEnd: number
  ): FormatResult {
    const before = value.slice(0, selectionStart)
    const selection = value.slice(selectionStart, selectionEnd)
    const after = value.slice(selectionEnd)

    const toLines = (s: string) => (s.length ? s.split('\n') : [''])
    const join = (parts: string[]) => parts.join('\n')

    let result = ''
    let newStart = selectionStart
    let newEnd = selectionEnd

    switch (tag) {
      case 'bold':
        return this.toggleInline(value, selectionStart, selectionEnd, '**')
      case 'italic':
        return this.toggleInline(value, selectionStart, selectionEnd, '_')
      case 'underline':
        return this.toggleInline(
          value,
          selectionStart,
          selectionEnd,
          '<u>',
          '</u>'
        )
      case 'code':
        return value.slice(selectionStart, selectionEnd).includes('\n')
          ? this.toggleBlockCode(value, selectionStart, selectionEnd)
          : this.toggleInline(value, selectionStart, selectionEnd, '`')

      case 'quote': {
        return this.toggleQuote(value, selectionStart, selectionEnd)
      }

      case 'ul': {
        const toggled = this.toggleUnordered(toLines(selection))
        result = before + join(toggled) + after
        break
      }

      case 'ol': {
        const toggled = this.toggleOrdered(toLines(selection))
        result = before + join(toggled) + after
        break
      }

      case 'link': {
        const linkText = selection || ''
        const prefix = `[${linkText}](https://)`
        result = before + prefix + after
        newStart = before.length + linkText.length + 3
        newEnd = newStart + 8
        break
      }
    }

    return { value: result, start: newStart, end: newEnd }
  }
}
