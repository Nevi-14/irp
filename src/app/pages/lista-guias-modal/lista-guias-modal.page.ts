import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';

@Component({
  selector: 'app-lista-guias-modal',
  templateUrl: './lista-guias-modal.page.html',
  styleUrls: ['./lista-guias-modal.page.scss'],
})
export class ListaGuiasModalPage implements OnInit {
  image = '../assets/icons/delivery-truck.svg'
  textoBuscar = ''
  constructor(
    public controlCamionesGuiasService: ControlCamionesGuiasService,
public modalCtrl: ModalController

  ) { }

  ngOnInit() {
  
  }

  actualizar(camion){

    this.modalCtrl.dismiss({

      camion:  camion
     });

  
  }
  onSearchChange(event){
    this.textoBuscar = event.detail.value
    
      }
  cerrarModal(){
    this.modalCtrl.dismiss(); 
  }
}
