import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { HeaderComponent } from './header.component';
import { BehaviorSubject } from 'rxjs';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { By } from '@angular/platform-browser';

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

  describe('menu visibility tests', () => {
    it('should show non-authenticated menu items when not authenticated', () => {
      // Ensure non-auth section is visible
      mockHeaderMenusService.headerManagement.next({
        showAuthSection: false,
        showNoAuthSection: true
      });
      fixture.detectChanges();

      // Get all buttons in the non-auth section
      const buttons = fixture.debugElement.queryAll(By.css('div *ngIf="showNoAuthSection" button'));
      const buttonTexts = fixture.nativeElement.querySelector('div:first-of-type').textContent;
      
      // Check for presence of non-auth menu items
      expect(buttonTexts).toContain('Dashboard');
      expect(buttonTexts).toContain('Home');
      expect(buttonTexts).toContain('Login');
      expect(buttonTexts).toContain('Register');
      
      // Verify auth section is not visible
      const authSection = fixture.nativeElement.querySelector('div:last-of-type');
      expect(authSection.offsetParent).toBeNull(); // Element is not visible in DOM
    });

    it('should show authenticated menu items when authenticated', () => {
      // Set auth section to visible
      mockHeaderMenusService.headerManagement.next({
        showAuthSection: true,
        showNoAuthSection: false
      });
      fixture.detectChanges();

      // Get text content of the auth section
      const buttonTexts = fixture.nativeElement.querySelector('div:last-of-type').textContent;
      
      // Check for presence of auth menu items
      expect(buttonTexts).toContain('Dashboard');
      expect(buttonTexts).toContain('Home');
      expect(buttonTexts).toContain('Admin posts');
      expect(buttonTexts).toContain('Admin categories');
      expect(buttonTexts).toContain('Profile');
      expect(buttonTexts).toContain('Logout');
      
      // Verify non-auth section is not visible
      const nonAuthSection = fixture.nativeElement.querySelector('div:first-of-type');
      expect(nonAuthSection.offsetParent).toBeNull(); // Element is not visible in DOM
    });
  });
});
