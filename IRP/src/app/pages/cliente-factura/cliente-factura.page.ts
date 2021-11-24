import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RutaFacturas } from '../../models/rutaFacturas';

@Component({
  selector: 'app-cliente-factura',
  templateUrl: './cliente-factura.page.html',
  styleUrls: ['./cliente-factura.page.scss'],
})
export class ClienteFacturaPage implements OnInit {
@Input() cliente:RutaFacturas;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.cliente)
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}