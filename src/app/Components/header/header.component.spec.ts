import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { HeaderComponent } from './header.component';
import { BehaviorSubject } from 'rxjs';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let headerMenusService: HeaderMenusService;
  let localStorageService: LocalStorageService;
  let spy: jasmine.Spy;

  // Mock services
  const mockHeaderMenusService = {
    headerManagement: new BehaviorSubject<HeaderMenus>({
      showAuthSection: false,
      showNoAuthSection: true,
    }),
  };

  const mockLocalStorageService = {
    remove: jasmine.createSpy('remove'),
    get: jasmine.createSpy('get'),
    set: jasmine.createSpy('set'),
  };

  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: HeaderMenusService, useValue: mockHeaderMenusService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    headerMenusService = TestBed.inject(HeaderMenusService);
    localStorageService = TestBed.inject(LocalStorageService);
    
    // Create spy for router.navigateByUrl
    spy = router.navigateByUrl as jasmine.Spy;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigation tests', () => {
    it('should navigate to home route', () => {
      component.navigationTo('home');
      expect(spy).toHaveBeenCalledWith('home');
    });

    it('should navigate to login route', () => {
      component.navigationTo('login');
      expect(spy).toHaveBeenCalledWith('login');
    });

    it('should navigate to register route', () => {
      component.navigationTo('register');
      expect(spy).toHaveBeenCalledWith('register');
    });

    it('should navigate to posts route', () => {
      component.navigationTo('posts');
      expect(spy).toHaveBeenCalledWith('posts');
    });

    it('should navigate to categories route', () => {
      component.navigationTo('categories');
      expect(spy).toHaveBeenCalledWith('categories');
    });

    it('should navigate to profile route', () => {
      component.navigationTo('profile');
      expect(spy).toHaveBeenCalledWith('profile');
    });

    it('should navigate to dashboard route', () => {
      component.navigationTo('dashboard');
      expect(spy).toHaveBeenCalledWith('dashboard');
    });
  });

  describe('logout', () => {
    it('should clear localStorage, update header menu and navigate to home', () => {
      component.logout();
      
      expect(localStorageService.remove).toHaveBeenCalledWith('user_id');
      expect(localStorageService.remove).toHaveBeenCalledWith('access_token');
      expect(spy).toHaveBeenCalledWith('home');
    });
  });
});
