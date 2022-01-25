import { Component } from '@angular/core';

import { Image } from "./interfaces/image";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'imageboard';

  uploadEvent: Subject<Image> = new Subject<Image>();
  loginEvent: Subject<boolean> = new Subject<boolean>();

  handleUpload(event: Image) {
    this.uploadEvent.next(event);
  }

  handleLogin(event: boolean) {
    this.loginEvent.next(event);
  }
}
