import { Component, OnInit, Input } from '@angular/core';
import { Rutero } from '../../models/Rutero';
import { ModalController } from '@ionic/angular';
import { ActualizaFacLinService } from 'src/app/services/actualizaFacLin';

@Component({
  selector: 'app-clientes-rutas',
  templateUrl: './clientes-rutas.page.html',
  styleUrls: ['./clientes-rutas.page.scss'],
})
export class ClientesRutasPage implements OnInit {
@Input() cliente:any;
@Input() color:string;
@Input() imagen:string;
textoBuscar = '';
  constructor(
public modalCtrl:ModalController,
public actualizaFacLinService: ActualizaFacLinService

  ) { }

  ngOnInit() {
console.log('cliente', this.cliente)
    if(this.cliente.facturas.length > 0){

alert('hh')

    }else{
      this.actualizaFacLinService.syncActualizaFacLin(this.cliente.idGuia, this.cliente.idCliente);
    }
 
    
  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
