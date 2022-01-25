import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { repeat } from 'rxjs/operators';

import { environment } from "../../../../environments/environment";
import { ImageCollectionService } from "../../../services/imageCollection.service";
import { Image } from "../../../interfaces/image";
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit {
  backendpath = environment.backendpath;

  image: Image = {_id: '', tags: [], uploaded: new Date()};
  newTags: string[] = [];
  @Input() loadEvent: Observable<Image> = new Observable<Image>();
  @Input() loginEvent: Observable<boolean> = new Observable<boolean>();

  @Output() onDelete: EventEmitter<Image> = new EventEmitter<Image>();

  changed: boolean = false;
  loggedIn: boolean = false;

  constructor(private collectionService: ImageCollectionService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.loggedIn();
    this.loginEvent.pipe(repeat()).subscribe((res) => {
      this.loggedIn = res;
    });
    this.loadEvent.pipe(repeat()).subscribe((res) => {
      this.image = res;
      this.changed = false;
      this.newTags = Object.assign([],this.image.tags)
    });
  }

  tagListHandler(event: string[]) {
    this.newTags = event;
    this.changed = true;
  }

  updateTags() {
    if(!this.changed) return;
    this.collectionService.updateTags(this.image._id,this.newTags).subscribe(()=>{
      this.image.tags = this.newTags;
      this.changed = false;
    });
  }

  deleteImage() {
    this.collectionService.deleteImage(this.image._id).subscribe(() => {
      this.onDelete.emit(this.image);
    });
  }

}
