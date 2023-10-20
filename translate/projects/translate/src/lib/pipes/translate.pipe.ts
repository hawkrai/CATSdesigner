import {Inject, Pipe, PipeTransform} from '@angular/core';
import { LOCALIZATION } from '../../tokens';


@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {

  private isShowTranslateCodes = false;

  constructor(
      @Inject(LOCALIZATION) private localizationMap: any
  ) {
    const wnd: any = (window as any);
    const hash: string = wnd.location.hash;
    const params: { [key: string]: string } = hash ? this.getSearchParams(hash.substr(hash.indexOf('?') + 1)) : this.getSearchParams(wnd.location.search.substr(1));
    this.isShowTranslateCodes = (params.translate === 'true');

  }

  get localization(): { [key: string]: string } {
      const localization = !!localStorage.getItem('locale') ? localStorage.getItem('locale') as string : 'ru';
      return this.localizationMap[localization].default;
  }

  public transform(value: string, defaultValue: string, params?: { [key: string]: string }): string {
    if (this.isShowTranslateCodes) {
      return value;
    } else {
      let localizedValue: string = this.localization[value];
      if (localizedValue != null) {
        if (params) {
          Object.keys(params).forEach((param: string) => {
            localizedValue = localizedValue.replace(new RegExp(`{${param}}`, 'gi'), params[param]);
          });
        }
        return localizedValue;
      }
      return defaultValue;
    }
  }

  private getSearchParams(search: string): { [key: string]: string } {
    return search.split('&').reduce((result, item) => {
      const parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
    }, {} as  any);
  }
}
