import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function createInvalidDomainValidator(hosts: {
  [name: string]: string;
}): ValidatorFn[] {
  return Object.entries(hosts).map(([k, v]) => {
    return (control: AbstractControl): ValidationErrors => {
      const value = control.value?.toLowerCase();
      if (!value) {
        return [];
      }

      const result: any = {};
      if (new RegExp(`.*@${v}$`).exec(value)) {
        result[`invalidEmailDomain${k}`] = true;
      }
      console.log(v, result, `.*@${v}$`);
      return result || null;
    };
  });
}
