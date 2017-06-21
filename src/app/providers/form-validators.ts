import { Validators, FormControl, FormGroup } from '@angular/forms';

export class FormValidors{

  /**
   * actNameValidator
   */
  static actNameValidator(){
    return [
      // sync
      Validators.compose([
        Validators.maxLength(30), 
        Validators.required
      ])
    ];
  }

  /**
   * descriptionValidator
   */
  static descriptionValidator(){
    return [
      // sync
      Validators.compose([
        Validators.maxLength(300)
      ])
    ];
  }

  /**
   * actTypeValidator
   */
  static actTypeValidator(){
    return [
      // sync
      Validators.compose([
        Validators.required
      ])
    ];
  }

  /**
   * startDateValidator
   */
  static startDateValidator(){
    return [
      // sync
      Validators.compose([
        Validators.required
      ])
    ];
  }

  /**
   * endDateValidator
   */
  static endDateValidator(formGroup: FormGroup){
    return [
      // sync
      [
        Validators.required,
        function (control: FormControl){
          let startDate = new Date(formGroup.value['startDate']).getTime();
          let endDate = new Date(control.value).getTime();
          if(startDate > endDate){
            return {
              'lessEndDate': {
                valid: false
              }
            };
          }else{
            return null;
          }
        }
      ]
    ]
  }

}