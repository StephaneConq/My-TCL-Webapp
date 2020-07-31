import {Injectable} from '@angular/core';
import {Passage} from "../_models/passage";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {
  }

  metroMapping = {
    301: 'A',
    302: 'B',
    303: 'C',
    304: 'D',
  }

  iconImgUrl = 'https://www.tcl.fr/themes/custom/sytral_theme/img/lignes/{{LIGNE}}.svg';

  getIconUrl(ligne: string) {
    return this.metroMapping[ligne] ? this.iconImgUrl.replace('{{LIGNE}}', this.metroMapping[ligne]) :
      this.iconImgUrl.replace('{{LIGNE}}',
        ligne.replace('A', '')
          .replace('B', '')
          // .replace('C', '')
          .replace('D', ''));
  }

  createPassages(passages: Passage[]) {
    const passagesObj = {};
    passages.map(p => {
      const ligne = p.ligne
        .replace('A', '')
        .replace('B', '')
        .replace('D', '');
      if (passagesObj[ligne]) {
        passagesObj[ligne].push(p);
      } else {
        passagesObj[ligne] = [p];
      }
    });
    return passagesObj;
  }
}
