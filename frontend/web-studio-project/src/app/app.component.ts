import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from "./shared/components/popup/popup.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    PopupComponent
],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
})

export class AppComponent {
  title = 'web-studio-project';
}
