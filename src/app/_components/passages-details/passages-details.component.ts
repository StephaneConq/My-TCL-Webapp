import {Component, Input, OnInit} from '@angular/core';
import {Stop} from "../../_models/stop";
import {Passage} from "../../_models/passage";
import {ApiService} from "../../_services/api.service";
import {UtilsService} from "../../_services/utils.service";

@Component({
  selector: 'app-passages-details',
  templateUrl: './passages-details.component.html',
  styleUrls: ['./passages-details.component.scss']
})
export class PassagesDetailsComponent implements OnInit {

  @Input() stop: Stop;
  passages = {};

  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.apiService.get('stops/passages', this.stop.id).subscribe((passages: {passages: Passage[] }) => {
      this.passages = this.utilsService.createPassages(passages.passages);
    });
  }

  getKeys(obj: Object) {
    return Object.keys(obj);
  }

  getIconUrl(line) {
    return this.utilsService.getIconUrl(line);
  }

  getTimes(passages: Passage[]) {
    return passages.map(p => p.delaipassage).join(' - ');
  }

}
