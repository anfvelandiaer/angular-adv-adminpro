import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare const gapi: any;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
   }

   get token() {
     return localStorage.getItem('token') || '';
   }

   get uid(): string {
     return this.usuario.uid || '';
   }

   get headers() {
     return {
      headers: {
        'x-token': this.token
      }
     }
   }

  async googleInit() {
    return new Promise( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '90615101003-psbaojgucdvg9hjkk52cok671l6n9cch.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });

        resolve();
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { email, google, nombre, role, uid, img= '' } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', google, img, role, uid);
        localStorage.setItem('token', resp.token );
        return true;
      }),
      map( resp => true),
      catchError( error => of(false) ) // of retorna un nuevo observable
    );
  }

  crearUsuario( formData: RegisterForm ) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token );
        })
      );
  }

  actualizarPerfil( data: {email: string, nombre: string, role: string} ) {

    data= {
      ...data,
      role:this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)
  }

  login( formData: LoginForm ) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token );
        })
      );
  }

  loginGoogle( token: string ) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token );
        })
      );
  }

  cargarUsuarios( desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`
    return this.http.get<CargarUsuario>(url, this.headers)
    .pipe(
      map( resp => {
        const usuarios = resp.usuarios.map( user => new Usuario(user.nombre,user.email, '', user.google, user.img, user.role, user.uid))
        return {
          total: resp.total,
          usuarios
        };
      })
    )
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`
    return this.http.delete(url, this.headers)
  }

  guardarUsuario( usuario: Usuario) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)
  }
}
