import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { merge } from 'rxjs';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../login/login.component.scss'],
})
export class RegisterComponent {
  currentDate: Date = new Date();
  readonly name = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(100),
  ]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly username = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50),
    Validators.pattern(/^[A-Za-z0-9._-]+$/),
  ]);
  readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(72),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=])[A-Za-z\d!@#$%^&*()_+\-=]{8,72}$/),
  ]);
  readonly confirmPassword = new FormControl('', [Validators.required]);
  readonly profileImage = new FormControl<File | null>(null);
  readonly nameErrorMessage = signal('');
  readonly emailErrorMessage = signal('');
  readonly usernameErrorMessage = signal('');
  readonly passwordValue = signal('');
  readonly profileImageErrorMessage = signal('');
  readonly profileImageName = signal('');
  readonly profileImagePreview = signal<string | null>(null);
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);

  constructor() {
    merge(this.name.statusChanges, this.name.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateNameErrorMessage());

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());

    merge(this.username.statusChanges, this.username.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateUsernameErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.passwordValue.set(this.password.value ?? '');
        this.validateConfirmPassword();
      });

    this.confirmPassword.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.validateConfirmPassword());
  }

  updateNameErrorMessage(): void {
    if (this.name.hasError('required')) {
      this.nameErrorMessage.set('Name is required');
    } else if (this.name.hasError('minlength') || this.name.hasError('maxlength')) {
      this.nameErrorMessage.set('Name must be between 2 and 100 characters');
    } else {
      this.nameErrorMessage.set('');
    }
  }

  updateEmailErrorMessage(): void {
    if (this.email.hasError('required')) {
      this.emailErrorMessage.set('Email is required');
    } else if (this.email.hasError('email')) {
      this.emailErrorMessage.set('Enter a valid email address');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updateUsernameErrorMessage(): void {
    if (this.username.hasError('required')) {
      this.usernameErrorMessage.set('Username is required');
    } else if (this.username.hasError('minlength') || this.username.hasError('maxlength')) {
      this.usernameErrorMessage.set('Username must be between 3 and 50 characters');
    } else if (this.username.hasError('pattern')) {
      this.usernameErrorMessage.set('Username can contain only letters, numbers, dots, underscores, or hyphens');
    } else {
      this.usernameErrorMessage.set('');
    }
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  toggleConfirmPasswordVisibility(event: MouseEvent): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  hasValidPasswordLength(): boolean {
    const password = this.passwordValue();
    return password.length >= 8 && password.length <= 72;
  }

  hasUppercaseLetter(): boolean {
    return /[A-Z]/.test(this.passwordValue());
  }

  hasLowercaseLetter(): boolean {
    return /[a-z]/.test(this.passwordValue());
  }

  hasNumber(): boolean {
    return /\d/.test(this.passwordValue());
  }

  hasSpecialCharacter(): boolean {
    return /[!@#$%^&*()_+\-=]/.test(this.passwordValue());
  }

  usesAllowedPasswordCharacters(): boolean {
    const password = this.passwordValue();
    return password.length > 0 && /^[A-Za-z\d!@#$%^&*()_+\-=]+$/.test(password);
  }

  passwordsMatch(): boolean {
    return this.confirmPassword.value === this.password.value;
  }

  validateConfirmPassword(): void {
    const confirmPassword = this.confirmPassword.value ?? '';

    if (!confirmPassword) {
      this.confirmPassword.setErrors({ required: true });
      return;
    }

    this.confirmPassword.setErrors(
      confirmPassword === this.password.value ? null : { passwordMismatch: true }
    );
  }

  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.profileImage.setValue(file);
    this.profileImageName.set(file?.name ?? '');

    // 1. If no file is selected, clear everything out
    if (!file) {
      this.profileImageErrorMessage.set('');
      this.profileImagePreview.set(null); // <-- Reset preview
      return;
    }

    // 2. Validate format
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      this.profileImageErrorMessage.set('Profile image must be PNG, JPG, or JPEG format');
      this.profileImagePreview.set(null); // <-- Don't show preview for invalid types
      return;
    }

    // 3. Validate size
    if (file.size > 500 * 1024) {
      this.profileImageErrorMessage.set('Profile image must be under 500KB');
      this.profileImagePreview.set(null); // <-- Don't show preview for oversized files
      return;
    }

    // If we reach this point, the file is 100% valid!
    this.profileImageErrorMessage.set('');

    // 4. GENERATE THE VISUAL PREVIEW
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  isFormInvalid(): boolean {
    return (
      this.name.invalid ||
      this.email.invalid ||
      this.username.invalid ||
      this.password.invalid ||
      this.confirmPassword.invalid ||
      !this.passwordsMatch() ||
      !!this.profileImageErrorMessage()
    );
  }
}
