import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

  public RepresentatesGrupo = [
    ['WAGNER BUENO PEREIRA DA SILVA', '054.538.999-21'],
    ['FERNANDA BURG VIANA', '028.039.049-18']
  ];

  public NomeGrupo = 'Mastersul';
  
  constructor() {}
}