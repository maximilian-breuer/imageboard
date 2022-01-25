import { Component, OnInit, Input} from '@angular/core';
import { NgxMasonryOptions} from "ngx-masonry";
import { Observable, Subject } from 'rxjs';
import { repeat } from 'rxjs/operators';

import { environment } from "../../../environments/environment";
import { ImageCollectionService } from "../../services/imageCollection.service";
import { Image } from "../../interfaces/image";

const initialImages: number = 20;
const additionalImages: number = 10;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  backendpath = environment.backendpath;

  @Input() uploadEvent: Observable<Image> = new Observable<Image>();
  @Input() loginEvent: Observable<boolean> = new Observable<boolean>();

  filter: string = "";
  lastFilter: string = "";
  images: Image[] = [];

  loadImageViewEvent: Subject<Image> = new Subject<Image>();

  public masonryOptions: NgxMasonryOptions = {
    gutter: 0
  };

  constructor(private collectionService: ImageCollectionService) {

  }

  ngOnInit(): void {
    this.collectionService.getImages(Date.now(), initialImages, []).subscribe(data =>{
      this.images = <Image[]> data;
    });
    this.uploadEvent.pipe(repeat()).subscribe((res) => {
      this.images.unshift(res);
    });
  }

  applyFilter() {
    this.lastFilter = this.filter;
    this.collectionService.getImages(Date.now(), initialImages, this.filter.split(" ").filter(w => w.length>0)).subscribe(data =>{
      this.images = <Image[]> data;
    });
  }

  loadMoreImages() {
    var lastSeen: number = new Date(this.images[this.images.length-1].uploaded).getTime()-1;
    this.collectionService.getImages(lastSeen, additionalImages, this.filter.split(" ").filter(w => w.length>0)).subscribe(data =>{
      this.images = this.images.concat(<Image[]> data);
    });
  }

  setImageView(image: Image) {
    this.loadImageViewEvent.next(image);
  }

  deleteImage(event: Image) {
    this.images.splice(this.images.indexOf(event),1);
  }
}
