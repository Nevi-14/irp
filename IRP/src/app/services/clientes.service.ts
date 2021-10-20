import { Injectable } from '@angular/core';
import { Clientes } from '../models/clientes';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ClientesService {
clientes: Clientes[]=[];
clientesRutas = [];
isChecked = false;
clientesArray = [];
  constructor(private http: HttpClient) { }


  getIRPURL( api: string, provincia: string , canton:string , distrito: string ,id: string ){
    let test: string = '';


    const URL = environment.preURL  + environment.postURL + api + environment.provinciaID+provincia+ environment.cantonID+canton+ environment.distritoID+distrito+ id;
console.log(URL)
    return URL;
  }
  private getClientes(provincia, canton, distrito  ){
    this.clientes = [];
    const URL = this.getIRPURL( environment.clientesURL, provincia,canton,distrito,'');
    return this.http.get<Clientes[]>( URL );
  }

  syncClientes(provincia, canton, distrito ){
    this.getClientes(provincia, canton, distrito).subscribe(
      resp =>{
        this.clientes = resp.slice(0);
       console.log(this.clientes)
       this.syncClientesArray();
      }

    );
  }

  syncClientesArray(){
    this.clientesArray = [];
    this.isChecked = false;
    for(let i = 0; i < this.clientes.length; i++){
      const objectElement = {
        cliente:this.clientes[i],
        select:this.isChecked
      }
    this.clientesArray.push(objectElement)
    console.log('cleintes array',this.clientesArray);
    }
  }


}


