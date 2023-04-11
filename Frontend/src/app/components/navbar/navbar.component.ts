import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;

  profileInfo: any;

  constructor(private cookieService: CookieService, private tokenService: TokenService, location: Location, private element: ElementRef, private router: Router) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);

    this.tokenService.decodeToken().subscribe((data: any) => {
      console.log(`${JSON.stringify(data.decoded)}`);
      this.profileInfo = data.decoded;
      this.profileInfo.image = localStorage.getItem('ImageUser');
    });
    if (!this.profileInfo) {
      this.profileInfo = { name: 'Guest', image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' };
    }
  }



  logout() {
    this.cookieService.delete('Token');
    localStorage.removeItem('ImageUser');
    this.router.navigate(['/login']);
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }
}