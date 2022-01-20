import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxMasonryOptions} from "ngx-masonry";

import { environment } from "../../../environments/environment";
import { ImageCollectionService } from "../../services/imageCollection.service";
import { Image } from "../../interfaces/image";

const imageURL: string = "http://127.0.0.1:3000/api/v1/images";
const initialImages: number = 20;
const additionalImages: number = 10;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  backendpath = environment.backendpath;

  filter: string = "";
  lastFilter: string = "";
  images: Image[] = [];

  modalImage: Image = {_id: '', tags: [], uploaded: new Date()};
  modalRev: Image = {_id: '', tags: [], uploaded: new Date()};
  newTag: string = "";
  imageChanged: boolean = false;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 0
  };

  constructor(private collectionService: ImageCollectionService, private http: HttpClient) { }

  ngOnInit(): void {
    this.collectionService.getImages(Date.now(), initialImages, []).subscribe(data =>{
      this.images = <Image[]> data;
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

  setModalImage(image: Image){
    this.modalRev = image;
    this.modalImage = {_id: image._id, tags: Object.assign([],image.tags), uploaded: image.uploaded};
    this.modalImage.tags.sort();
    this.imageChanged = false;
  }

  removeTag(tag: string) {
    let index: number = this.modalImage.tags.indexOf(tag);
    this.modalImage.tags.splice(index,1);
    this.imageChanged = true;
  }

  addTag() {
    let toAdd: string = this.newTag.replace(/\s/g, "");
    if(this.modalImage.tags.indexOf(toAdd)!=-1||toAdd===""){
      this.newTag = "";
      return;
    }
    this.modalImage.tags.push(toAdd);
    this.modalImage.tags.sort();
    this.newTag = "";
    this.imageChanged = true;
  }

  updateTags() {
    if(!this.imageChanged) return;
    this.http.put(imageURL+"/"+this.modalImage._id,{tags: this.modalImage.tags}).subscribe();
    this.modalRev.tags = Object.assign([],this.modalImage.tags)
    this.imageChanged = false;
  }
}
