import { AppService } from './../../app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DATE_FORMAT4 } from 'src/app/format.constants';
import { differenceInCalendarDays, format } from 'date-fns';
import { ValidatorUtil } from 'src/app/shared/validate/validatorUtil';
import { FormUtil } from 'src/app/shared/validate/formUtil';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit {
  protected destroy$ = new Subject<void>();

  form!: FormGroup;
  formSearch!: FormGroup;

  isShow: boolean = false;
  showBulk: boolean = false;
  formatDate = DATE_FORMAT4;
  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date(this.form?.value?.dueDate)) < 0;
  str = localStorage.getItem("toDoList");

  listTask: any[] = [];
  listTemp: any[] = [];
  listChecked: any[] = [];
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
    this.getListTask();
    this.form = this.fb.group({
      name: ['', ValidatorUtil.required()],
      description: [''],
      dueDate: [format(new Date(), DATE_FORMAT4)],
      piority: [1]
    });
    this.formSearch = this.fb.group({
      keyword: [''],
    });
    this.service.submitTrigger$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      console.log('res', res);
      this.listTask = res.toDoList;
      this.listTemp = this.listTask;
    });
  }

  getListTask() {
    if(this.str) {
      this.listTask = JSON.parse(this.str);
      this.listTemp = this.listTask;
    }
  }

  search() {

    if(this.formSearch.value.keyword === null) {
      this.formSearch.value.keyword = '';
    }
    this.listTask = this.listTemp.filter((item: any) => item.name?.toUpperCase().includes(this.formSearch.value?.keyword?.trim().toUpperCase()));

  }

  viewDetail(item: any) {
    item.isShow = !item.isShow;
    this.form.patchValue({
      name: item.name,
      description: item.description,
      dueDate: item.dueDate,
      piority: item.piority
    });
  }

  onCheck(item: any) {
    if(item.checked) {
      this.listChecked.push(item);
    } else {
      this.listChecked = this.listChecked.filter((x: any) => x.checked !== false);

    }
    if(this.listChecked.length) {
      this.showBulk = true;
    } else {
      this.showBulk = false;
    }
  }

  onRemove(item: any) {
    this.listTask = this.listTask.filter((x: any) => x !== item);

    if(!this.listTask.length) {
      localStorage.removeItem('toDoList');
    } else {
      localStorage.setItem("toDoList", JSON.stringify(this.listTask));
    }
    this.service.removeTrigger$.next({toDoList: this.listTask});
  }

  onUpdate(item: any) {
    FormUtil.validate(this.form);
    this.listTask.forEach((x: any, index: any) => {
      if(x === item) {
        this.listTask[index] = {
          ...this.form.value,
          isShow: false,
          checked: false,
          readOnly: false
        }
      }
    });
    localStorage.setItem("toDoList", JSON.stringify(this.listTask));
  }

  doneTask() {
    this.listTask.forEach((item: any, index: any) => {
      this.listChecked.forEach((x: any) => {
        if(x === item) {
          this.listTask[index] = {...item, checked: false, readOnly: true};
          this.listChecked = this.listChecked.filter((y: any) => y !== x)
        }
      })
    })
    localStorage.setItem("toDoList", JSON.stringify(this.listTask));
    this.showBulk = false;
  }

  onRemoveAll() {
    this.listTask = this.listTask.filter(item => !this.listChecked.includes(item));
    if(!this.listTask.length) {
      localStorage.removeItem('toDoList');
    } else {
      localStorage.setItem("toDoList", JSON.stringify(this.listTask));
    }
    this.service.removeTrigger$.next({toDoList: this.listTask})
    this.showBulk = false;
  }

}
