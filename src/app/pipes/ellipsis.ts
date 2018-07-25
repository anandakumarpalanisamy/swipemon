import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bcEllipsis'
})
export class EllipsisPipe implements PipeTransform {
  transform(str: string, stringLength: number = 250) {
    const withoutHtml = str.replace(/(<([^>]+)>)/ig, '');
    if (str.length >= stringLength) {
      return `${withoutHtml.slice(0, stringLength)}...`;
    }
    return withoutHtml;
  }
}
