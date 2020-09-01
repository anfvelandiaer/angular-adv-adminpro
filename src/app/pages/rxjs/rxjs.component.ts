import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [],
})
export class RxjsComponent implements OnDestroy{

  internalSubs: Subscription;

  constructor() {

    // this.retornaObservable().pipe(
    //   // Dentro del parentesis se escriben cuantas veces se quiere repetir
    //   retry(2)
    // ).subscribe(
    //   valor => console.log('Subs:', valor),
    //   error => console.warn('Error:', error),
    //   () => console.log('OBS Terminado'),
    // );

    this.internalSubs = this.retornaIntervalo().subscribe( console.log );
  }

  ngOnDestroy(): void {
    this.internalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number>  {
    return interval(1000)
            .pipe(
              //  take(10),
               map( valor =>  valor + 1),
               filter( valor => valor % 2 === 0) );
  }

  retornaObservable(): Observable<number> {
    let i = -1;

    const obs$ = new Observable<number>((observer) => {
      const intervalo = setInterval(() => {
        i++;
        observer.next(i);

        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2) {
          observer.error('Error');
        }

      }, 1000);
    });

    return obs$;
  }
}
