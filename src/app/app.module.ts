import { CommonModule, registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ZorroAntdModule } from './zorro-antd.module';
import { FormControlComponent } from './shared/form-control/form-control.component';
import { InputComponent } from './shared/input/input.component';
import { TextareaComponent } from './shared/textarea/textarea.component';
import { DatepickerComponent } from './shared/datepicker/datepicker.component';
import { SelectComponent } from './shared/select/select.component';
import { CheckboxComponent } from './shared/checkbox/checkbox.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    CreateTaskComponent,
    ToDoListComponent,
    FormControlComponent,
    InputComponent,
    TextareaComponent,
    DatepickerComponent,
    SelectComponent,
    CheckboxComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ZorroAntdModule

  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
