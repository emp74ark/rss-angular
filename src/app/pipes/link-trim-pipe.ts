import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'linkTrim',
})
export class LinkTrimPipe implements PipeTransform {
  transform(value: string, length: number = Infinity): string {
    try {
      const parsed = URL.parse(value)
      if (!parsed) {
        throw new Error('Invalid URL')
      }
      const { host, pathname } = parsed
      return `${host}${pathname.slice(0, length) + '...'}`
    } catch (e) {
      console.error(e)
      return value.slice(0, length) + '...'
    }
  }
}
