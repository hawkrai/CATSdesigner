import {AbstractControl, FormGroup} from "@angular/forms";

export class FormUtils {

    public static addErrorForControl(control: AbstractControl, errorName: string): void {
        if (control.errors) {
            control.errors[errorName] = true;
        } else {
            let error = {};
            error[errorName] = true;
            control.setErrors(error);
        }
    }

    public static deleteErrorFromControl(control: AbstractControl, errorName: string): void {
        if (control.errors && control.errors[errorName]) {
            delete control.errors[errorName];
            if (Object.entries(control.errors).length === 0) {
                control.setErrors(null);
            }
        }
    }

    public static isFormValid(formGroup: FormGroup): boolean {
        return Object.keys(formGroup.controls).every(key => !formGroup.controls[key].errors || !!formGroup.controls[key].errors["warning"]);
    }

    public static highlightInvalidControls(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach(control => control.markAsTouched());
    }

    public static clearControls(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach((control: AbstractControl) => {
            control.setValue("");
            control.markAsUntouched();
        });
    }

    public static updateControls(formGroup: FormGroup, o: { [key: string]: any }): void {
        Object.keys(formGroup.controls).forEach(key => formGroup.controls[key].setValue(o[key]));
    }

    public static updateObject(o: { [key: string]: any }, formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => o[key] = formGroup.controls[key].value);
    }
}
