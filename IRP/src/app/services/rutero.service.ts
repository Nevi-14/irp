import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rutero } from '../models/Rutero';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RuteroService {

ruteroArray: Rutero[]=[];
rutertoPostArray: Rutero[]=[];

  constructor(
    public http: HttpClient
  ) { }


getRuteroURL(api, id){
let test : string = '';

if(!environment.prdMode){
  test = environment.TestURL;
}

const URL = environment.preURL + test  + environment.postURL +  api + id;

return URL;


}

private getRutero(id){

  const URL = this.getRuteroURL(environment.ruteroURL,id);
  return this.http.get<Rutero[]>(URL);

}

syncRutero(id){
this.getRutero(id).subscribe(
resp => {

  this.ruteroArray = resp;
   console.log(resp)
   //alert(resp)
}, error => {

  console.log(error)
}

);

}




private postRutero(rutero){
 const URL = this.getRuteroURL(environment.ruteroURL,'');

  const options = {
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json',
      'Access-Control-Allow-Origin':'*'
    }
  };
  console.log(URL,'URL')
console.log(JSON.stringify(rutero), 'JSON.stringify(rutero)')
  return this.http.post(URL,JSON.stringify(rutero), options);

}


insertarPostRutero(){

  this.postRutero(this.rutertoPostArray).subscribe(

    resp => {
  
      console.log(resp);
  
      this.rutertoPostArray = []
  
    }, error =>{
      console.log(error)
    }
  )

}



}