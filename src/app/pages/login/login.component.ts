import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { merge } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  currentDate: Date = new Date();
  readonly username = new FormControl('', [Validators.required, Validators.minLength(3)]);
  readonly password = new FormControl('', [Validators.required]);
  readonly usernameErrorMessage = signal('');
  readonly passwordErrorMessage = signal('');
  readonly hidePassword = signal(true);

  constructor() {
    merge(this.username.statusChanges, this.username.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateUsernameErrorMessage());
  }

  updateUsernameErrorMessage(): void {
    if (this.username.hasError('required')) {
      this.usernameErrorMessage.set('You must enter a user name');
    } else if (this.username.hasError('minlength')) {
      this.usernameErrorMessage.set('User name must be at least 3 characters');
    } else {
      this.usernameErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage(): void {
    if (this.password.hasError('required')) {
      this.passwordErrorMessage.set('You must enter a password');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  isFormInvalid(): boolean {
    return this.username.invalid || this.password.invalid;
  }

}
