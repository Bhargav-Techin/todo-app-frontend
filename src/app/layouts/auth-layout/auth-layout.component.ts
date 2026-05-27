import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeButtonComponent } from '../../components/theme-button/theme-button.component';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, ThemeButtonComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  tasks = [
    { title: 'Plan today', subtitle: 'Review top priorities' },
    { title: 'Focus session', subtitle: 'Ship one important thing' },
    { title: 'Wrap up', subtitle: 'Move tomorrow\'s notes' }
  ];

  activeTask = 0;
}
