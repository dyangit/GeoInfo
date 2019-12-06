// Modules
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatDialogModule, MatInputModule,
   MatIconModule, MatTooltipModule, MatSnackBarModule} from '@angular/material';

// Services
import { MarkerService } from './services/marker.service';

// Components
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { DialogOptionsComponent } from './dialog-options/dialog-options.component';
import { LoginComponent } from './login/login.component';

// Others
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DialogOptionsComponent,
    LoginComponent,
  ],
  entryComponents:[
    DialogOptionsComponent,
    LoginComponent
  ],
  imports: [
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    MarkerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
