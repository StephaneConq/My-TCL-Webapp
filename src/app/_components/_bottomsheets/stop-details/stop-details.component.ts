import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Stop} from "../../../_models/stop";
import {BottomsheetOpenedService} from "../../../_services/bottomsheet-opened.service";
import {ApiService} from "../../../_services/api.service";
import {Passage} from "../../../_models/passage";
import {UtilsService} from "../../../_services/utils.service";

@Component({
  selector: 'app-stop-details',
  templateUrl: './stop-details.component.html',
  styleUrls: ['./stop-details.component.scss']
})
export class StopDetailsComponent implements OnInit, OnDestroy {

  passages = {};

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<StopDetailsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Stop,
    private bottomsheetOpenedService: BottomsheetOpenedService,
    private apiService: ApiService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.bottomsheetOpenedService.bottomSheetOpenedBS.next(true));
    this.apiService.get('stops/passages', this.data.id).subscribe((passages: { passages: Passage[] }) => {
      this.passages = this.utilsService.createPassages(passages.passages);
    });
  }

  ngOnDestroy(): void {
    this.bottomsheetOpenedService.bottomSheetOpenedBS.next(false);
  }

  close() {
    this._bottomSheetRef.dismiss();
  }

  getLineIcon(line) {
    return this.utilsService.getIconUrl(line);
  }

  getKeys(object) {
    return Object.keys(object);
  }

  createNextDepartures(passages: Passage[]) {
    return passages.map(p => p.delaipassage).join(' - ')
  }

}
