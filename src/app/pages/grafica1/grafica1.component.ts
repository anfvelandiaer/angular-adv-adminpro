import { Component } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [],
})
export class Grafica1Component {
  labels1: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  data1: MultiDataSet = [[780, 50, 180]];
}
