import { FormControl } from '@angular/forms';

export class HoursValidator {

   static isValid(control: FormControl): any {

   alert('in hours 2 - control value ' + control.value);

//allow decimals

       if(isNaN(control.value)){
        alert('nan');
           return {
               "not a number": true
           };
       }

       if(control.value % 1 !== 0){
        alert('1');
           
           return {
               "not a whole number": true
           };
       }

       if(control.value < 1){
        alert('2');
           return {
               "please enter hours": true
           };
       }

       if (control.value > 120){
        alert('3');
           return {
               "not realistic": true
           };
       }

       return null;
   }

}