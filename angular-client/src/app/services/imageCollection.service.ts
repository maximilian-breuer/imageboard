import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Image } from '../interfaces/image';

@Injectable({
  providedIn: 'root',
})
export class ImageCollectionService {
  imagePath: string = "http://127.0.0.1:3000/api/v1/images"

  constructor (private http: HttpClient){}

  addImage(image: Image): Observable<any> {
    return <Observable<any>> this.http.post<any>(this.imagePath, image);
  }

  getImages(tags: string[] = [], lastSeen: string = ""): Observable<Image[]> {
    let options;
    if(tags.length&&tags[0]!=""){
      let tagsString = '["';
      tagsString += tags.join('","');
      tagsString += '"]'
      options = {params: new HttpParams({fromString: 'tags=' + tagsString})};
    }
    return <Observable<Image[]>> this.http.get(this.imagePath,options);
  }
}
