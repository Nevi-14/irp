import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RutaFacturas } from '../../../models/rutaFacturas';

@Injectable({
  providedIn: 'root'
})
export class RutaFacturasService {

  rutaFacturasArray: RutaFacturas[]=[];
  constructor(private http: HttpClient) { }

  getIrpUrl(api: string, id: string, fecha: Date){

    let test = '';
    if(!environment.prdMode){
      test = environment.TestURL;
    }

    const URL = environment.preURL + test  + environment.postURL + api+ environment.rutaParam + id + environment.entregaParam + this.formatDate(fecha);
    console.log(URL);
    return URL;

  }

   formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}
 
  getRutaFacturas(ruta: string, fecha:Date){
    const URL = this.getIrpUrl(environment.rutaFacturasURL,ruta, fecha);
    return this.http.get<RutaFacturas[]>(URL);
  }

syncRutaFacturas(ruta:string, fecha:Date){
  this.getRutaFacturas(ruta, fecha).subscribe(
    resp =>{
      this.rutaFacturasArray = resp;
      console.log(this.rutaFacturasArray,'rutas facturas')
    }
  )
}

}
