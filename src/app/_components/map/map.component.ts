import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../_services/api.service";
import {Stop} from "../../_models/stop";
import {GeocodingService} from "../../_services/geocoding.service";
import {GoogleMap} from "@angular/google-maps";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {StopDetailsComponent} from "../_bottomsheets/stop-details/stop-details.component";
import {BottomsheetOpenedService} from "../../_services/bottomsheet-opened.service";
import {UtilsService} from "../../_services/utils.service";
import {ResponsiveService} from "../../_services/responsive.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private geocodingService: GeocodingService,
    private bottomSheet: MatBottomSheet,
    private bottomsheetOpenedService: BottomsheetOpenedService,
    private utilsService: UtilsService,
    private responsiveService: ResponsiveService
  ) {
  }

  center: google.maps.LatLng = new google.maps.LatLng(45.740858, 4.819629);
  markerOptions: google.maps.MarkerOptions = {
    icon: 'assets/tcl-icon-16x16.png'
  };
  myPositionMarker = {
    options: {
      icon: 'assets/my-position-marker.png'
    },
    position: null
  }
  zoom = 11;
  stops: Stop[] = [];
  traffic = [];
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: false,
    gestureHandling: "greedy",
    minZoom: 11
  };

  displayStops = true;
  displayTraffic = false;
  displayLoader = true;

  filteredOptions: Stop[] = [];
  searchModel = '';
  bottomSheetOpened = false;
  bottomSheetRef = null;
  currentStop: Stop = null;

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.zoom = 15;
      this.myPositionMarker.position = this.center;
    }, null, {
      enableHighAccuracy: true
    });
    navigator.geolocation.watchPosition((position) => {
      this.myPositionMarker.position = this.center;
    }, null, {
      enableHighAccuracy: true,
      maximumAge        : 30000,
      timeout           : 27000
    });
    this.displayLoader = true;
    this.bottomsheetOpenedService.bottomSheetOpenedBS.subscribe(isOpened => {
      this.bottomSheetOpened = isOpened;
      if (!isOpened) {
        if (this.bottomSheetRef) {
          this.bottomSheetRef = null;
          this.resetZoom();
        }
      }
    });

    Promise.all([this.loadStops(), this.loadTraffic()]).then(() => {
      this.displayLoader = false;
    });
  }

  loadStops(): Promise<null> {
    return new Promise(resolve => {
      this.apiService.list('stops').subscribe((data: { features: any[] }) => {
        this.stops = data.features.map(f => {
          return {
            position: new google.maps.LatLng(f['geometry']['coordinates'][1], f['geometry']['coordinates'][0]),
            ...f['properties']
          }
        });
        resolve();
      });
    })
  }

  loadTraffic(): Promise<null> {
    return new Promise(resolve => {
      this.apiService.list('traffic').subscribe((data: { features: any[] }) => {
        this.traffic = data.features.map(f => {
          const options: google.maps.PolylineOptions = {
            strokeColor: MapComponent.getColor(f.properties.etat)
          };
          return {
            paths: f['geometry']['coordinates'].map(c => new google.maps.LatLng(c[1], c[0])),
            ...f['properties'],
            options
          }
        }).filter(f => f.etat !== '*');
        resolve();
      });
    })
  }

  static getColor(state) {
    switch (state) {
      case 'V':
        return 'green';
      case 'G':
        return 'red';
      case 'R':
        return 'red';
      case 'O':
        return 'orange';
      default:
        return 'black';
    }
  }

  search(value: string) {
    if (value.length === 0 || typeof value !== 'string') {
      this.filteredOptions = [];
      return;
    }
    let nbOptions = 0;
    this.filteredOptions = this.stops.filter(s => {
      const condition = s.nom.toLowerCase().includes(value.toLowerCase());
      if (nbOptions < 6 && condition) {
        nbOptions++;
        return condition;
      } else {
        return false;
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.geocodingService.geocode(this.searchModel).then(res => {
        if (res.length === 0) {
          return;
        }
        const chosen = res[0];
        this.searchModel = chosen.formatted_address;
        this.center = chosen.geometry.location;
        this.zoom = 18;
      })
    }
  }

  displayFn(option: Stop): string {
    return option && option.nom ? option.nom : '';
  }

  changeMarkerIcons(map: GoogleMap) {
    if (map.getZoom() >= 19) {
      this.markerOptions = {
        icon: 'assets/tcl-icon-48x48.png'
      }
    } else {
      this.markerOptions = {
        icon: 'assets/tcl-icon-16x16.png'
      }
    }
    this.zoom = map.getZoom();
  }

  resetZoom() {
    this.zoom = 15;
  }

  selectStop(stop: Stop) {
    this.displayLoader = true;
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
    if (this.currentStop) {
      this.currentStop = null;
    }
    setTimeout(() => {
      this.center = stop.position;
      this.zoom = 19;
      if (this.responsiveService.isMobile) {
        this.bottomSheetRef = this.bottomSheet.open(StopDetailsComponent, {
          data: stop,
          hasBackdrop: false
        });
      } else {
        this.currentStop = stop;
      }
      this.displayLoader = false;
    }, 500);
  }

  getLines(desserte: string) {
    let str = this.replaceAll(desserte, 'A', '');
    str = this.replaceAll(str, 'R', '');
    str = this.replaceAll(str, ':', '');
    const allLines = [];
    str.split(',').forEach(line => {
      if(allLines.indexOf(line) === -1) {
        allLines.push(line);
      }
    });
    return allLines;
  }

  getLineImages(lines: string[]) {
    return lines.map(l => this.utilsService.getIconUrl(l));
  }

  replaceAll(string: string, search, replace) {
    return string.split(search).join(replace);
  }

}
