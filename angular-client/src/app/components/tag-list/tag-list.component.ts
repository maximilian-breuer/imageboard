import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  newTag: string = "";
  @Input() tags: string[] = [];
  @Input() loggedIn: boolean = false;
  @Output() onChange: EventEmitter<string[]> = new EventEmitter<string[]>();


  ngOnInit(): void {

  }

  removeTag(tag: string) {
    let index: number = this.tags.indexOf(tag);
    this.tags.splice(index,1);
    this.onChange.emit(this.tags);
  }

  addTag() {
    let toAdd: string = this.newTag.replace(/\s/g, "").toLowerCase();
    if(this.tags.indexOf(toAdd)!=-1||toAdd===""){
      this.newTag = "";
      return;
    }
    this.tags.push(toAdd);
    this.tags.sort();
    this.newTag = "";
    this.onChange.emit(this.tags);
  }
}
