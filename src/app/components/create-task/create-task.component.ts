import { AppService } from './../../app.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays, format } from 'date-fns';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DATE_FORMAT4, DATE_TIME_SQL_FORMAT } from 'src/app/format.constants';
import { FormUtil } from 'src/app/shared/validate/formUtil';
import { ValidatorUtil } from 'src/app/shared/validate/validatorUtil';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
  @Output() dataUpdated: EventEmitter<void> = new EventEmitter<void>();
  protected destroy$ = new Subject<void>();
  form!: FormGroup;
  formatDate = DATE_FORMAT4;
  str = localStorage.getItem('toDoList');
  toDoList: any[] = [];

  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date(this.form?.value?.dueDate)) < 0;
  optionPiority: any[] = [
    { label: 'Normal', value: 1},
    { label: 'Important', value: 2},
    { label: 'Very Important', value: 3}
  ];

  constructor(
    protected fb: FormBuilder,
    private service: AppService
  ) { }

  ngOnInit() {
    this.getData();
    this.form = this.fb.group({
      name: ['', ValidatorUtil.required()],
      description: [''],
      dueDate: [new Date()],
      piority: [1]
    });

    this.toDoList.sort(function(a, b) {return a.dueDate - b.dueDate});
  }

  getData() {
    if(this.str) {
      this.toDoList = JSON.parse(this.str);
      console.log(this.toDoList);
      
    } else {
      this.service.submitTrigger$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        console.log('list create', res.todoList);
        
        this.toDoList = res.toDoList;
      });
    }
  }

  onAdd() {
    FormUtil.validate(this.form);
    // this.getData();
    this.service.submitTrigger$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      console.log('list create', res.todoList);
      
      this.toDoList = res.toDoList;
    });
    console.log(this.toDoList);
    
    this.toDoList.push({...this.form.value, dueDate: new Date(this.form.value?.dueDate), isShow: false, checked: false, readOnly: false});
    this.toDoList.sort(function(a, b) {return a.dueDate - b.dueDate});
    localStorage.setItem("toDoList", JSON.stringify(this.toDoList));
    this.service.submitTrigger$.next({toDoList: this.toDoList});
    this.form.reset();
    this.form.patchValue({
      dueDate: format(new Date(), DATE_FORMAT4),
      piority: 1
    })
  }

}
