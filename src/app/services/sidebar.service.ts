import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/'},
        { titulo: 'Gráficas', url: 'grafica1'},
        { titulo: 'ProgressBar', url: 'progress'},
        { titulo: 'Promesas', url: 'promesas'},
        { titulo: 'Rxjs', url: 'rxjs'},
      ]
    }
  ];

  constructor() { }


}
