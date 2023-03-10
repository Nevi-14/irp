import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RutaZonaService } from '../../services/ruta-zona.service';

@Component({
  selector: 'app-lista-rutas-zonas-modal',
  templateUrl: './lista-rutas-zonas-modal.page.html',
  styleUrls: ['./lista-rutas-zonas-modal.page.scss'],
})
export class ListaRutasZonasModalPage implements OnInit {
textoBuscar = '';
rutas = []
 
  constructor(

    public modalCtrl: ModalController,
    public rutaZonas: RutaZonaService

  ) { }

  ngOnInit() {
    this.rutaZonas.syncRutas();
    console.log(this.rutaZonas.rutasZonasArray, 'array')
  }
  retornarRuta(ev:any){
if(ev.currentTarget.checked){
  this.rutas.push(ev.target.value)
}else{
let i = this.rutas.findIndex(ruta => ruta.RUTA == ev.target.value.RUTA)
this.rutas.splice(i,1)

}
console.log('this.rutas', this.rutas)
 
  /**
   *   this.modalCtrl.dismiss({

      ruta: ev.target.value
     });
   */

  }

  onSearchChange(event){
this.textoBuscar = event.detail.value
  }

  devolverRutas(){
    this.modalCtrl.dismiss({

      rutas: this.rutas
     });
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
