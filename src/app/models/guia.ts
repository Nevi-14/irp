import { Marker } from "mapbox-gl";
import { PlanificacionEntregas } from "./planificacionEntregas";

export class Cliente {
    constructor(
  public id: number,
  public idGuia:string,
  public cliente: string,
  public latitud: number,
  public longitud:number,
  public distancia: number,
  public duracion:number,
  public direccion:string,
  public bultosTotales:number,
  public orden_visita: number,
  public HoraInicio:Date,
  public HoraFin:Date,

    ){}
}
export class ClientesGuia {

constructor(
    public  id: number,
    public idGuia:string,
    public nombre: string,
    public marcador:Marker,
    public seleccionado: boolean,
    public cargarFacturas:boolean,
    public color:string,
    public cambioColor:string,
    public latitud: number,
    public longitud: number,
    public frio:boolean,
    public seco:boolean,
    public frioSeco: boolean,
    public totalFrio:number,
    public totalSeco:number,
    public totalBultos:number,
    public totalPeso:number,
    public direccion:string,
     public  facturas: PlanificacionEntregas[]
   

){}
      
      
}

export class Guias {
    constructor( 
public   idGuia: string,
public  verificada:boolean,
public guiaExistente:boolean,
public zona: string,
public ruta: string,
public fecha: string,
public numClientes: number,
public totalFacturas:number,
public distancia: number,
public duracion:number,
public nombreRuta: string,
public camion: {
  numeroGuia:string,
    HoraInicio:string,
    HoraFin:string,
    chofer:string,  
    idCamion: string,
    capacidad: number,
    pesoRestante: number,
    peso: number,
    estado: string,
    HH: string,
    bultos:number,
    volumen: number,
    frio:string,
    seco:string
  },
  public  clientes:Cliente[],
  public facturas: PlanificacionEntregas[]
        
        
        ){}
}
