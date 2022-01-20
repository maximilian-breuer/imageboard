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

  addImage(source: string, tags: string[]): Observable<any> {
    return <Observable<any>> this.http.post<any>(this.imagePath, {source: source, tags: tags});
  }

  getImages(startTime: number, limit: number, tags: string[]): Observable<Image[]> {
    let options = {params: new HttpParams()};
    options.params = options.params.append("startTime", startTime);
    options.params = options.params.append("limit", limit);

    if(tags.length && tags[0]!=""){
      let tagString = '["' + tags.join('","') + '"]';
      options.params = options.params.append("tags", tagString);
    }

    return <Observable<Image[]>> this.http.get(this.imagePath,options);
  }
}
