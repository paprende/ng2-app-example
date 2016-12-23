import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'csSearchFilterPipe'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value = [], filterargs): any {
    if (!filterargs) {
      return value;
    }
    return value.filter(v => {
      return `${ v.name }${ v.type }${ v.region }${ v.publicIP }${ v.privateIP }`
        .includes(filterargs.filter.trim().toLowerCase());
    });
  }

}
