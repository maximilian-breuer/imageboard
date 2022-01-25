import { AuthenticationService } from 'src/app/services/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Image } from '../interfaces/image';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ImageCollectionService {
  imagePath: string = environment.backendpath + "/api/v1/images"

  constructor (private http: HttpClient, private authService: AuthenticationService){}

  addImage(source: string, tags: string[]): Observable<any> {
    const header = {
      headers: this.authService.getHeader()
    }

    return <Observable<any>> this.http.post<any>(this.imagePath, {source: source, tags: tags}, header);
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

  updateTags(_id: string, tags: string[]): Observable<any> {
    const header = {
      headers: this.authService.getHeader()
    }
    return <Observable<any>> this.http.put(this.imagePath+"/"+_id,{tags: tags}, header);
  }

  deleteImage(_id: string) {
    const header = {
      headers: this.authService.getHeader()
    }
    return <Observable<any>> this.http.delete(this.imagePath+"/"+_id, header);
  }
}
