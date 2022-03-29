import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ClientesService } from '../../services/clientes.service';
import { ZonasService } from '../../services/zonas.service';
import { RutasService } from '../../services/rutas.service';
import { ClienteEspejoService } from '../../services/cliente-espejo.service';
import { RutaZonaService } from '../../services/ruta-zona.service';

import { GuiasService } from 'src/app/services/guias.service';
import { GuiasRutaPage } from '../guias-ruta/guias-ruta.page';
import { RuteroService } from '../../services/rutero.service';
import { ServicioClienteMarcadoresPage } from '../servicio-cliente-marcadores/servicio-cliente-marcadores.page';
import { AlertasService } from 'src/app/services/alertas.service';
import { ServicioClienteService } from '../../services/servicio-cliente.service';
import { ClientesRutasPage } from '../clientes-rutas/clientes-rutas.page';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
interface Marcadores {
  id: string,
  cliente: any,
  modificado: boolean,
  nuevoCliente: boolean,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?: [number, number]
}



@Component({
  selector: 'app-servicio-cliente',
  templateUrl: './servicio-cliente.page.html',
  styleUrls: ['./servicio-cliente.page.scss'],
})
export class ServicioClientePage implements OnInit {




  rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  drag = false;
  guia  = null;  
  modo = 'off'
  @ViewChild('mapa') divMapa!:ElementRef;
  result: any;
  mapa!: mapboxgl.Map;
  geocoder: any;
  zoomLevel: number = 10.5;
  array: any;
  lngLat: [number, number] = [-84.12216755918627, 10.003022709670836];
  marcadores: Marcadores[] = [];
  clientesArray = [];
  coordinates = [];
  features = [];
    constructor(
      
      public modalCtrl: ModalController, 
      public alertCtrl: AlertController, 
      public clientes: ClientesService, 
      public zonas: ZonasService, 
      public rutas: RutasService, 
      public clienteEspejo: ClienteEspejoService , 
      public popOverCrtl: PopoverController, 
      public rutaZona: RutaZonaService, 
      public guiasService:GuiasService, 
      public ruteroService: RuteroService, 
      public alertasService: AlertasService,
      public servicioClienteService: ServicioClienteService
      
      ) {


    }



    ngOnInit(){

     this.clientes.rutasClientes = [];
     this.clientes.nuevosClientes = [];

  console.log('planificacion Rutas')


    
    }

//============================================================================= 
// MODAL GESTION DE ERRORES DE CADA UNO DE LOS PROCESOS INVOLUCRADOS 
//=============================================================================


gestionErrores(){

  this.alertasService.gestorErroresModal(this.servicioClienteService.errorArray);
}


    ngAfterViewInit() {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      //Add 'implements AfterViewInit' to the class.

      this.limpiarDatos()

      
    }
         
 
    async informacionMarcadores() {

      const modal = await this.modalCtrl.create({
        component: ServicioClienteMarcadoresPage,
        cssClass: 'auto-size-modal',
        componentProps:{
          marcadores: this.features
        }
       // backdropDismiss:false
      });
      
      await modal.present();

      const {data} = await modal.onDidDismiss();
 
     if(data !=undefined){
 
        const item = data.item
 
        this.irMarcador(item)
        
 
     }
    
    }


    
            
 
async configuracionZonaRuta() {

  const modal = await this.modalCtrl.create({
    component: GuiasRutaPage,
    cssClass: 'large-modal'
  });
   await modal.present();



  const { data } = await modal.onDidDismiss();

    if(data !== undefined && data.idGuia != ''){
      
       console.log(data, 'return')

       this.guia = data
this.alertasService.presentaLoading('Cargando lista de clientes')
    const ruteros =   this.ruteroService.syncRutero(data.idGuia)
          ruteros.then(rutero =>{

  this.clientesArray = rutero;
this.coordinates = [];
this.features = [];
this.coordinates.push(this.lngLat);
  this.clientesArray.forEach(cliente =>{
const coordinate = [cliente.longitud, cliente.latitud]
this.coordinates.push(coordinate);
const feature =    {
  title:  cliente.idCliente +' '+cliente.nombre,
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [cliente.longitud, cliente.latitud]
  },
  properties: {
    title:  cliente.idCliente +' '+cliente.nombre,
    icon:   'music',
    client: cliente,
    color: null,
  }
}
this.features.push(feature)
   
  })
this.createmapa();

console.log(this.clientesArray,'this.clientesArray')

this.alertasService.loadingDissmiss();

  
          }), error =>{
            this.alertasService.loadingDissmiss();
            let errorObject = {
              titulo: 'this.ruteroService.syncRutero(data.idGuia)',
              fecha: new Date(),
              metodo:'GET',
              url:error.url,
              message:error.message,
              rutaError:'app/services/rutero-service.ts',
              json:JSON.stringify(this.clientesArray)
            }
            this.servicioClienteService.errorArray.push(errorObject)
            
            console.log(error)
           
          }
      
       
    }


  }


//============================================================================= 
// MODAL GESTION DE ERRORES DE CADA UNO DE LOS PROCESOS INVOLUCRADOS 
//=============================================================================




//============================================================================= 
//CREAR MAPA
//=============================================================================


async  getRoute(end) {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change

  let firstPart =  `https://api.mapbox.com/directions/v5/mapbox/driving/${this.lngLat}`
   let middle = '';
this.coordinates.forEach(cordinate=>{

  middle += ';'+cordinate


})
  let secondPart = `?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;

  let final = firstPart + middle +secondPart;

  const query = await fetch(
    final,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  let geojson :any = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };
  this.mapa.addLayer({
    id: 'route',
    type: 'line',
    source: {
      type: 'geojson',
      data: geojson
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#3887be',
      'line-width': 5,
      'line-opacity': 0.75
    }
})

}
createmapa() {

  
if(this.mapa){

  this.mapa.remove();

  }

let geojsonCoordinates : any = {
  'type': 'FeatureCollection',
  'features': [
  {
  'type': 'Feature',
  'properties': {},
  'geometry': {
  'coordinates': this.coordinates,
  'type': 'LineString'
  }
  }
  ]
  };
const geojson: any = {
  'type': 'FeatureCollection',
  'features': this.features
  };
  this.mapa = new mapboxgl.Map({
    container: this.divMapa.nativeElement,
    style: 'mapbox://styles/mapbox/light-v10', // Specify which map style to use
    center: this.lngLat,
    zoom: this.zoomLevel,
    interactive: true,

  });


  const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving',
    alternatives: false,
    geometries: 'geojson',
    controls: { instructions: false },

    flyTo: true,
    flyFrom:true
    });
     
    this.mapa.addControl(directions, 'top-right');
    this.mapa.scrollZoom.enable();
     


    // Create a default Marker and add it to the map.

    const newMarker = new mapboxgl.Marker({
      color:"#010203",
      draggable: false
  
  })
 
  newMarker.setLngLat(this.lngLat)
    .setPopup(new mapboxgl.Popup({closeOnClick: false, closeButton: false}).setText("DISTRIBUIDORA ISLEÑA"))
    .addTo(this.mapa)
    .togglePopup();

   
// add markers to map
for (const feature of geojson.features) {


     // Create a DOM element for each marker.
     const el = document.createElement('div');
     const elwidth = 60;
     const elheight = 60;
     el.className = 'marker';
     el.style.backgroundImage = `url(assets/icons/shipped.svg)`;
     el.style.width = `${elwidth}px`;
     el.style.height = `${elheight}px`;
     el.style.backgroundSize = '100%';
      
     el.addEventListener('click', () => {
           if(feature.properties.client.estado === 'I'){
          this.detalleClientes(feature.properties.client, color, 'url(assets/icons/shipped.svg)')
        }else{
          this.detalleClientes(feature.properties.client, color, null)
        }
     });

       // Create a DOM element for each marker.
       const store = document.createElement('div');
       const storewidth = 40;
       const storeheight = 40;
       store.className = 'marker-icon';
       store.style.backgroundImage = `url(assets/icons/store.svg)`;
       store.style.width = `${storewidth}px`;
       store.style.height = `${storeheight}px`;
       store.style.backgroundSize = '100%';

       store.addEventListener('click', () => {
        if(feature.properties.client.estado === 'I'){
          this.detalleClientes(feature.properties.client, color, 'url(assets/icons/shipped.svg)')
        }else{
          this.detalleClientes(feature.properties.client, color, null)
        }
        });


       new mapboxgl.Marker(store)
       .setLngLat(feature.geometry.coordinates)
       .addTo(this.mapa);
         
         
  const { newMarker , color } =  this.generarMarcadorColor(feature.properties.client.estado)

  feature.properties.color = color
  if(feature.properties.client.estado === 'I'){
         // Add markers to the map.
         new mapboxgl.Marker(el)
         .setLngLat(feature.geometry.coordinates)
         .addTo(this.mapa);
  }
  newMarker.setLngLat(feature.geometry.coordinates)
  .addTo(this.mapa)

  const miniPopup = new  mapboxgl.Popup();
  miniPopup.setText(feature.properties.title)

  newMarker.setPopup(miniPopup)
  //.togglePopup();
}
this.mapa.on('load', () => {

this.mapa.resize();
  });

  this.coordinates.forEach(cordinate=>{
   // alert(cordinate)
      this.getRoute([this.coordinates[this.coordinates.length-1]])

  })
}


async detalleClientes(cliente, color , imagen){
  const modal = await this.modalCtrl.create({
    component: ClientesRutasPage,
    cssClass: 'extra-large-modal',
    componentProps:{
      cliente: cliente,
      color:color,
      imagen: imagen
    }
  });
  return await modal.present();
}
generarMarcadorColor(estado){


  let color = null;
  let primary = '#428cff';
  let success = "#4BB543"
  let warning = "#EED202"
  let danger = "#FF0000"
  let dark = "#010203"
 switch(estado){
   case 'P':
color = primary
   break;

    case 'I':
     color = warning

    break;
    case 'E':
      color = success
      break;
      case 'V':
        color = danger
        break;
      default :

  


 }
  const i = this.marcadores.findIndex(marcador => marcador.color === color);

  const newMarker = new mapboxgl.Marker({
    color:color,
    draggable: false

})

  return {newMarker , color}

}
irMarcador(item) {
  if (item) {
    this.mapa.flyTo(
      { center: item, zoom: 18 }
    )

  }
}

refrescarVista(){

  const ruteros =   this.ruteroService.syncRutero(this.guia.idGuia)
        ruteros.then(rutero =>{

this.clientesArray = rutero;
this.createmapa();



        }), error =>{
     
          let errorObject = {
            titulo: 'this.ruteroService.syncRutero(data.idGuia)',
            fecha: new Date(),
            metodo:'GET',
            url:error.url,
            message:error.message,
            rutaError:'app/services/rutero-service.ts',
            json:JSON.stringify(this.clientesArray)
          }
          this.servicioClienteService.errorArray.push(errorObject)
          
          console.log(error)
         
        }
}

limpiarDatos() {
  this.guia = null;
  this.rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  this.coordinates = []
  this.features = [];
  this.createmapa();


}

}