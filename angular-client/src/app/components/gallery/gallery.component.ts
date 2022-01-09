import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ImageCollectionService } from "../../services/imageCollection.service";
import { Image } from "../../interfaces/image";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  tagFilterFieldControl = new FormControl('');
  images: Image[] = [];

  constructor(private collectionService: ImageCollectionService) { }

  ngOnInit(): void {
    this.collectionService.getImages().subscribe(data =>{
      this.images = <Image[]> data;
    });
  }

  applyFilter() {
    let taginput: string = this.tagFilterFieldControl.value;
    let lastSeen: string = (Array.isArray(this.images) && this.images.length ? this.images[this.images.length-1]._id : "");
    this.collectionService.getImages(taginput.split(" "),lastSeen).subscribe(data =>{
      this.images = <Image[]> data;
    });
  }
}
