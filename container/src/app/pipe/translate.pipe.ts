import {Pipe, PipeTransform} from "@angular/core";
import * as dataRU from '../core/translations/translations_ru.json';
import * as dataEN from '../core/translations/translations_en.json';


@Pipe({name: "translate"})
export class TranslatePipe implements PipeTransform {

  private isShowTranslateCodes: boolean = false;

  constructor() {
    const wnd: any = (<any>window);
    const hash: string = wnd.location.hash;
    const params: { [key: string]: string } = hash ? this.getSearchParams(hash.substr(hash.indexOf("?") + 1)) : this.getSearchParams(wnd.location.search.substr(1));
    this.isShowTranslateCodes = (params["translate"] === "true");
    if (localStorage.getItem("locale") === "en") {
      this._localizationMap = dataEN;
    } else {
      this._localizationMap = dataRU;
    }

  }

  private _localizationMap: { [key: string]: string } = {};

  get localizationMap(): { [key: string]: string } {
    return this._localizationMap;
  }

  set localizationMap(_localizationMap: { [key: string]: string }) {
    this._localizationMap = _localizationMap;
  }

  public transform(value: string, defaultValue: string, params?: {}): string {
    if (this.isShowTranslateCodes) {
      return value;
    } else {
      let localizedValue: string = this.localizationMap.default[value];
      if (localizedValue != null) {
        if (params) {
          Object.keys(params).forEach((param: string) => {
            localizedValue = localizedValue.replace(new RegExp(`{${param}}`, "gi"), params[param]);
          });
        }
        return localizedValue;
      }
      return defaultValue;
    }
  }

  private getSearchParams(search: string): { [key: string]: string } {
    return search.split("&").reduce((result, item) => {
      const parts = item.split("=");
      result[parts[0]] = parts[1];
      return result;
    }, {});
  }
}
