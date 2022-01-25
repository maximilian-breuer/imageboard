import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Image } from "../../interfaces/image";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() onUpload: EventEmitter<Image> = new EventEmitter<Image>();
  @Output() onLogin: EventEmitter<boolean> = new EventEmitter<boolean>();

  loggedIn: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  handleUpload(event: Image) {
    this.onUpload.emit(event);
  }

  handleLogin(event: boolean) {
    this.loggedIn = event;
    this.onLogin.emit(event);
  }
}
