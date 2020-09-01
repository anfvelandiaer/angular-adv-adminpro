import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then((usuarios) => {
      console.log(usuarios);
    });
    // const promesa = new Promise( ( resolve, reject ) => {
    //   if ( false ) {
    //     resolve('hola mundo');
    //   } else {
    //     reject('Algo salio mal');
    //   }
    // });


    // promesa.then( (data) => {
    //   console.log(data);
    // }).catch (( error ) => {
    //   console.log(error);
    // });
    // console.log('Fin del Init');
  }

  getUsuarios() {

    const promesa = new Promise( resolve => {
      fetch('https://reqres.in/api/users')
      .then((data) => data.json())
      .then((body) => resolve(body.data));
    });

    return promesa;
  }

}
