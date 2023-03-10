import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Zonas } from '../models/zonas';

@Injectable({
  providedIn: 'root'
})
export class ZonasService {
  zonas: Zonas[]=[];
  zona = {
    ZONA: '', 
    NOMBRE: ''
  }
  constructor(private http: HttpClient) { }

  
  getIRPURL( api: string,id: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test + environment.postURL + api + id;
console.log(URL);
    return URL;
  }
  private getZonas( ){
    const URL = this.getIRPURL( environment.zonasURL,'');
    return this.http.get<Zonas[]>( URL );
  }

  syncZonas(){
   
    this.getZonas().subscribe(
      resp =>{
        this.zonas = resp.slice(0);
        console.log('zonas', this.zonas);

      }

    );
  }
}
