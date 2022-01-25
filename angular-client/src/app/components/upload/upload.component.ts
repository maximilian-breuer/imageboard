import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ImageCollectionService } from "../../services/imageCollection.service";
import { Image } from "../../interfaces/image";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file: string = "";

  constructor(private collectionService: ImageCollectionService) { }
  tags: string[] = [];
  filePath: string = "";
  @Output() onUpload: EventEmitter<Image> = new EventEmitter<Image>();

  ngOnInit(): void {
  }

  fileChanged(e: any) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.file = <string> reader.result;
    }
  }

  upload() {
    if(this.filePath === ''|| this.tags.length < 1) return;

    let responseImage: Image = {_id: '', tags: Object.assign([],this.tags), uploaded: new Date()}
    this.collectionService.addImage(this.file, this.tags).subscribe(res =>{
      responseImage._id = res.Created;
      this.onUpload.emit(responseImage);
    });
    this.filePath = "";
    this.tags = [];
    this.file = "";
  }

  tagListHandler(event: string[]) {
    this.tags = event;
  }

  close() {
    this.file = "";
    this.tags = [];
    this.filePath = "";
  }
}
