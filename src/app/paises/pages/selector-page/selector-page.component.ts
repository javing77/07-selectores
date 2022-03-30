import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { Pais, PasiSmall } from '../../interfaces/pais.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region    : [ '', Validators.required],
    pais      : [ '', Validators.required],
    frontera  : [ '', Validators.required],
    // frontera  : [ {value: '', disable: true}, Validators.required],
  })

  // Llenar selecotes
  regiones  : string[] = [];
  paises    : PasiSmall[] = [];
  fronteras : PasiSmall[] = []
  // fronteras : string[] = []

  //UI
  cargando: boolean = false;

  constructor( private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // Cuando cambia la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap ( (_) => {
          this.miFormulario.get('pais')?.reset('')
          this.cargando = true;
          // this.miFormulario.get('frontera')?.disable();
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion(region) )
      )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false;

      })

      // Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( (_) => {
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('')
        this.cargando = true;
        // this.miFormulario.get('frontera')?.enable();
      } ),
      switchMap ( codigo => this.paisesService.getPaisesPorCodigo(codigo ) ),
      switchMap ( pais => this.paisesService.getPaisesBorder( pais?.borders! )  )
    )
      .subscribe( paises => {
        // this.fronteras = pais?.borders || [];
        this.fronteras = paises;
        this.cargando = false;
      })

  }

  guardar(){
    console.log(this.miFormulario.value);

  }

}
