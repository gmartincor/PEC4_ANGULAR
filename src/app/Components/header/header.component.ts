import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService
  ) {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
        }
      }
    );
  }

  navigationTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  logout(): void {
    this.localStorageService.remove('user_id');
    this.localStorageService.remove('access_token');

    const headerInfo: HeaderMenus = {
      showAuthSection: false,
      showNoAuthSection: true,
    };

    this.headerMenusService.headerManagement.next(headerInfo);

    this.router.navigateByUrl('home');
  }
}
