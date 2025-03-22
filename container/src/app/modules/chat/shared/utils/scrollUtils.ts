import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar'

export class ScrollUtils {
  static readonly DEFAULT_SMOOTH_SPEED = 300

  static scrollToTop(
    scrollbar: PerfectScrollbarDirective,
    smooth = false
  ): void {
    if (!scrollbar) return
    const speed = smooth ? this.DEFAULT_SMOOTH_SPEED : undefined
    scrollbar.scrollToTop(0, speed)
  }

  static scrollToBottom(
    scrollbar: PerfectScrollbarDirective,
    smooth = false
  ): void {
    if (!scrollbar) return
    const speed = smooth ? this.DEFAULT_SMOOTH_SPEED : undefined
    scrollbar.scrollToBottom(0, speed)
  }

  static scrollToElement(
    scrollbar: PerfectScrollbarDirective,
    element: HTMLElement | string,
    offset = 0,
    smooth = false
  ): void {
    if (!scrollbar) return
    const speed = smooth ? this.DEFAULT_SMOOTH_SPEED : undefined
    scrollbar.scrollToElement(element, offset, speed)
  }

  static scrollTo(
    scrollbar: PerfectScrollbarDirective,
    x: number,
    y: number,
    smooth = false
  ): void {
    if (!scrollbar) return
    const speed = smooth ? this.DEFAULT_SMOOTH_SPEED : undefined
    scrollbar.scrollTo(x, y, speed)
  }

  static getFirstVisibleMessage<T>(
    scrollElement: HTMLElement,
    messages: T[]
  ): T | null {
    if (!messages?.length || !scrollElement) return null

    const containerRect = scrollElement.getBoundingClientRect()

    for (const message of messages) {
      const messageId = (message as any).id
      if (messageId === undefined) continue

      const messageElement = document.querySelector(
        `[data-message-id="${messageId}"]`
      )
      if (messageElement instanceof HTMLElement) {
        const rect = messageElement.getBoundingClientRect()
        if (rect.top >= containerRect.top - 50) {
          return message
        }
      }
    }

    return null
  }

  static preserveScrollPositionFromTop(
    element: HTMLElement,
    callback: () => void,
    offsetCorrection: number = 0
  ): void {
    if (!element) {
      callback()
      return
    }

    const scrollTop = element.scrollTop

    callback()

    requestAnimationFrame(() => {
      element.scrollTop = scrollTop + offsetCorrection
    })
  }
}
