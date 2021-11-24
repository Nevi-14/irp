import {  Component, OnInit } from '@angular/core';
import { RutasPage } from '../rutas/rutas.page';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { MenuClientesPage } from '../menu-clientes/menu-clientes.page';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ConfiguracionRutaService } from '../../services/configuracionruta.service';
import { ZonasService } from '../../services/paginas/organizacion territorial/zonas.service';
import { RutasService } from 'src/app/services/paginas/rutas/rutas.service';
import { ClientesService } from '../../services/paginas/clientes/clientes.service';
import { ClienteEspejoService } from '../../services/paginas/clientes/cliente-espejo.service';
import { MapService } from '../../services/componentes/mapas/map.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-guardar-rutas',
  templateUrl: './guardar-rutas.page.html',
  styleUrls: ['./guardar-rutas.page.scss'],
})
export class GuardarRutasPage implements OnInit {

  mapSvg = '../assets/home/map.svg';
  imagen = '../assets/home/isa.png';
  textoBuscar = '';
  lngLat: [number,number] = [-75.92722289474008, 45.280015511264466];
  
    constructor(private global: GlobalService,private modalCtrl: ModalController, private alertCtrl: AlertController, private config: ConfiguracionRutaService, private clientes: ClientesService, private zonas: ZonasService, private rutas: RutasService, private clienteEspejo: ClienteEspejoService, private map: MapService  , route:ActivatedRoute) {
      route.params.subscribe(val => {
        this.ngOnInit();
        this.map.createMap(-84.14123589305028,9.982628288210657);
        console.log('hello guardar rutas')
       });

    }
  
    ngOnInit(){
 
     //alert('hello')
    
    }
 

  
   async menuCliente(){

if(this.rutas.ruta.RUTA === '' || this.zonas.zona.ZONA === ''){
  this.global.alert('IRP','Seleccionar Ruta y Zona');
     }else{
      const modal = await this.modalCtrl.create({
        component: MenuClientesPage,
        cssClass: 'right-modal'
      });
      return await modal.present();
     }
     
    }
  
  

  

    onSearchChange(event){
      console.log(event)
      this.textoBuscar = event.detail.value;
    }



    async detalleClientes(cliente){
      const modal = await this.modalCtrl.create({
        component: DetalleClientesPage,
        cssClass: 'modal-md',
        componentProps:{
          detalleCliente: cliente
        }
      });
      return await modal.present();
    }
  


    addValue(e, cliente): void {
  
      const isChecked = !e.currentTarget.checked;
      console.log(isChecked)
   if(isChecked=== true){
    console.log('checcliente',cliente.IdCliente)
    this.config.totalClientesRuta += 1;
    this.map.createMarker(cliente.IdCliente,cliente.LONGITUD,cliente.LATITUD);

   }else{
    this.map.removeMarker(cliente.IdCliente);
    this.config.totalClientesRuta -= 1;
   }
  
  
    }
  
    delete(cliente: any){
      console.log('cliente',cliente)
      for( let index = 0; index < this.clientes.clientesRutas.length ; index++){   
      if(this.clientes.clientesRutas[index].cliente.IdCliente === cliente.IdCliente){
        this.clientes.clientesRutas.splice(index,1);
        this.map.createMap(-84.14123589305028,9.982628288210657);

    
        
       
      }
          }
          
        }
  

  
  
        async mostrarRuta() {
          const modal = await this.modalCtrl.create({
            component: RutasPage,
            cssClass: 'right-modal',
          });
          return await modal.present();
        }
  



        postRutas(){
  
          this.clienteEspejo.presentaLoading('Guardando Rutas...');
          for(let i =0; i < this.clientes.clientesRutas.length; i++){
             if(this.clientes.clientesRutas[i].select === true){
              const espejo = {
                IdCliente:this.clientes.clientesRutas[i].cliente.IdCliente,
                Fecha: this.clientes.clientesRutas[i].Fecha,
                Usuario: this.clientes.clientesRutas[i].Usuario,
                Zona: this.clientes.clientesRutas[i].Zona,
                Ruta: this.clientes.clientesRutas[i].Ruta,
                        }
              
              this.clienteEspejo.ClienteEspejoArray.push(espejo)
             }
             console.log(this.clienteEspejo.ClienteEspejoArray)
  
          }
         
          
  this.clienteEspejo.insertarClienteEspejo(this.clienteEspejo.ClienteEspejoArray);
  this.rutas.ruta.RUTA = '';
  this.rutas.ruta.DESCRIPCION = '';
  this.zonas.zona.ZONA = '';
  this.zonas.zona.NOMBRE = '';
  this.clientes.clientesRutas = [];
  this.map.currentMarkers = [];
  this.clientes.clientesRutas = [];
  this.clienteEspejo.rutas = [];
        }
  
  
}