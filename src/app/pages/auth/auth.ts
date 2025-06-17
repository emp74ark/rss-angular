import {Component, model} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {MatInput} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormFieldModule,
    MatInput,
    MatCardActions,
    MatButton,
    MatCardHeader,
    FormsModule,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  formData = model({
    login: '',
    password: '',
  });

  inputHandler(field: 'login' | 'password', event: Event) {
    const {value} = event.target as HTMLInputElement;
    if (value) {
      this.formData.update(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  }

  onSubmit() {
    console.log(this.formData());
  }
}
