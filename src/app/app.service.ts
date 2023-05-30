import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  submitTrigger$ = new Subject<any>();
  removeTrigger$ = new Subject<any>();

constructor() { }

}
