import { Component, OnInit } from '@angular/core';

import { ImageCollectionService } from "../../services/imageCollection.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file: string = "";
  tags: string[] = [];
  newTag: string = "";
  filePath: string = "";

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
    if(this.filePath === ''|| this.tags.length < 1) return;

    this.collectionService.addImage(this.file, this.tags).subscribe();
    this.filePath = "";
    this.tags = [];
    this.newTag = "";
    this.file = "";
  }

  addTag(){
    let toAdd: string = this.newTag.replace(/\s/g, "");
    if(this.tags.indexOf(toAdd)!=-1||toAdd===""){
      this.newTag = "";
      return;
    }
    this.tags.push(toAdd);
    this.tags.sort();
    this.newTag = "";
  }

  removeTag(tag: string) {
    let index: number = this.tags.indexOf(tag);
    this.tags.splice(index,1);
  }
}
