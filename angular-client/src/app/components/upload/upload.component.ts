import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ImageCollectionService } from "../../services/imageCollection.service";
import { Image } from "../../interfaces/image";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file: string = "";
  fileControl = new FormControl('');
  tagControl = new FormControl('');

  constructor(private collectionService: ImageCollectionService) { }

  ngOnInit(): void {
  }

  fileChanged(e: any) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      this.file = <string> reader.result;
    }
  }

  upload() {
    let tagInput: string = this.tagControl.value;
    let tags: string[] = tagInput.split(" ");

    let newImage: Image = {_id: '', source: this.file, tags: tags, uploaded: new Date()};

    this.collectionService.addImage(newImage).subscribe(data => {

    });
  }
}
