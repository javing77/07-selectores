import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PasiSmall } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
  private _baseUrl : string   = 'https://restcountries.com/v2'


  get regiones(): string[]{
    return [ ...this._regiones]
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string): Observable<PasiSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=alpha3Code,name`
    return this.http.get<PasiSmall[]>(url);
  }

  getPaisesPorCodigo (codigo: string): Observable<Pais | null> {

    if(!codigo)
    {
      return of(null)
    }

    const url: string = `${this._baseUrl}/alpha/${codigo}`
    return this.http.get<Pais>(url);
  }

  getPaisesPorCodigoSmall (codigo: string): Observable<PasiSmall> {

    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=name,alpha3Code`
    return this.http.get<PasiSmall>(url);
  }

  getPaisesBorder( borders: string[] ): Observable<PasiSmall[]>{
    if( !borders){
      return of([])
    }

    const peticiones : Observable<PasiSmall>[] = []

    borders.forEach( codigo => {
      const peticion = this.getPaisesPorCodigoSmall(codigo);
      peticiones.push(peticion);
    })

    return combineLatest( peticiones );

  }

}
