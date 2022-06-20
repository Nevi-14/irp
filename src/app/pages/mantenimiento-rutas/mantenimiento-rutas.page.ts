import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ZonasService } from '../../services/zonas.service';
import { RutaZonaService } from '../../services/ruta-zona.service';
import { RutasService } from 'src/app/services/rutas.service';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-mantenimiento-rutas',
  templateUrl: './mantenimiento-rutas.page.html',
  styleUrls: ['./mantenimiento-rutas.page.scss'],
})
export class MantenimientoRutasPage implements OnInit {

  items: any[] = [];
  textoBuscarZona = '';
  textoBuscarRuta = '';
  zonaRuta ={
    rutaID : '',
    rutaDes:'',
    zonaID : '',
    zonaDes: '',
    zonaNewDes: ''
  }
   

  constructor(
    
    public rutas: RutasService,
    public zonas: ZonasService, 
    public modalCtrl: ModalController, 
    public rutaZonas : RutaZonaService,
    public alertasService: AlertasService

    ) { }




  ngOnInit() {

    this.rutas.syncRutas();

    this.zonas.syncZonas();

    this.rutaZonas.syncRutas();

  }

  onSearchChange(event){

    console.log(event.detail.value);

    this.textoBuscarRuta = event.detail.value;

  }

    
    
  onSearchChangeZona(event){

    console.log(event.detail.value);

    this.textoBuscarZona = event.detail.value;

  }


  async  rutaRadioButtuon(ev: any){

    const ruta = ev.target.value;

if(ruta !== undefined){


  const i = this.rutaZonas.rutasZonasArray.findIndex( zona =>  zona.Ruta === ruta.RUTA);

  if ( i >= 0 ){

    if ( this.rutaZonas.rutasZonasArray[i].Ruta === ruta.RUTA ){

      const j = this.zonas.zonas.findIndex( zona =>  zona.ZONA === this.rutaZonas.rutasZonasArray[i].Zona);
      this.zonaRuta.rutaID = ruta.RUTA;
      this.zonaRuta.rutaDes = ruta.DESCRIPCION;
      this.zonaRuta.zonaID = this.rutaZonas.rutasZonasArray[i].Zona;
      this.zonaRuta.zonaDes = this.zonas.zonas[j].NOMBRE;
      

    } else {

      this.alertasService.message('Mantenimiento de Rutas' ,'o sentimos intenta de nuevo')


    } 
    
  } else {


    this.alertasService.message('Mantenimiento de Rutas' ,'No se encontro registro de ' + ' ' + ruta.RUTA)


  }


}else{

  this.zonaRuta.zonaID = '';


}

  }
  zonaRadioButtuon(ev: any){

    const zonaValue = ev.target.value;
    const j = this.zonas.zonas.findIndex( zona =>  zona.ZONA === zonaValue);
    this.zonaRuta.zonaID = this.zonas.zonas[j].ZONA;
    this.zonaRuta.zonaNewDes = this.zonas.zonas[j].NOMBRE;


  }

  
}