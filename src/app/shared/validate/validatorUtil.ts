import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function isEmptyInputValue(value: any): boolean {
    if (typeof value === 'string') {
      return value.trim().length === 0;
    }
    return (
      value == null ||
      ((typeof value === 'string' || Array.isArray(value)) && value.length === 0)
    );
  }
  
export function messageValidator(
    validatorFn: ValidatorFn,
    message?: string
  ): ValidatorFn {
    if (!message) return validatorFn;
    return (control: AbstractControl): ValidationErrors | null => {
      const error = validatorFn(control);
      if (error) {
        error['message'] = message;
      }
      return error;
    };
  }

export class ValidatorUtil {
    static required(message?: string): ValidatorFn {
        return messageValidator(
          requiredValidator,
          message || 'Vui lòng nhập đầy đủ thông tin'
        );
      }

  static minLength(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      return value.length >= length ? null : { minLength: true };
    };
  }

  static maxLength(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      return value.length <= length ? null : { maxLength: true };
    };
  }

  static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : { email: true };
  }
}

export function requiredValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    return isEmptyInputValue(control.value) ? { required: true } : null;
  }