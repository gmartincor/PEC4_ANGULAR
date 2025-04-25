import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
  let headerMenuSubject: BehaviorSubject<HeaderMenus>;

  // Mock services
  const headerMenus: HeaderMenus = {
    showAuthSection: false,
    showNoAuthSection: true,
  };
  
  // Setup for headerMenusService
  headerMenuSubject = new BehaviorSubject<HeaderMenus>(headerMenus);
  
  const mockHeaderMenusService = {
    headerManagement: headerMenuSubject
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
    // Reset spies and mocks
    mockRouter.navigateByUrl.calls.reset();
    mockLocalStorageService.remove.calls.reset();
    mockLocalStorageService.get.calls.reset();
    mockLocalStorageService.set.calls.reset();
    
    // Reset header menu state
    headerMenuSubject.next({
      showAuthSection: false,
      showNoAuthSection: true,
    });
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    headerMenusService = TestBed.inject(HeaderMenusService);
    localStorageService = TestBed.inject(LocalStorageService);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(component.showAuthSection).toBeFalse();
      expect(component.showNoAuthSection).toBeTrue();
    });
    
    it('should subscribe to headerManagement on init', () => {
      // Change header menu state
      headerMenuSubject.next({
        showAuthSection: true,
        showNoAuthSection: false,
      });
      
      // Trigger change detection
      fixture.detectChanges();
      
      // Check that component state was updated
      expect(component.showAuthSection).toBeTrue();
      expect(component.showNoAuthSection).toBeFalse();
    });
    
    it('should handle undefined headerInfo', () => {
      // Test with undefined value
      headerMenuSubject.next(undefined as any);
      
      // Trigger change detection
      fixture.detectChanges();
      
      // Should maintain previous state
      expect(component.showAuthSection).toBeFalse();
      expect(component.showNoAuthSection).toBeTrue();
    });
  });

  describe('navigation tests', () => {
    it('should navigate to home route', () => {
      component.navigationTo('home');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('home');
    });

    it('should navigate to login route', () => {
      component.navigationTo('login');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('login');
    });

    it('should navigate to register route', () => {
      component.navigationTo('register');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('register');
    });

    it('should navigate to posts route', () => {
      component.navigationTo('posts');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('posts');
    });

    it('should navigate to categories route', () => {
      component.navigationTo('categories');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('categories');
    });

    it('should navigate to profile route', () => {
      component.navigationTo('profile');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('profile');
    });

    it('should navigate to dashboard route', () => {
      component.navigationTo('dashboard');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('dashboard');
    });
    
    it('should handle navigation with empty route', () => {
      component.navigationTo('');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('');
    });
    
    it('should handle navigation with undefined route', () => {
      component.navigationTo(undefined as any);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(undefined);
    });
  });

  describe('logout', () => {
    it('should clear localStorage, update header menu and navigate to home', () => {
      component.logout();
      
      expect(mockLocalStorageService.remove).toHaveBeenCalledWith('user_id');
      expect(mockLocalStorageService.remove).toHaveBeenCalledWith('access_token');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('home');
    });
    
    it('should update header menu state to show non-auth section', () => {
      // First set auth section to true
      headerMenuSubject.next({
        showAuthSection: true,
        showNoAuthSection: false,
      });
      fixture.detectChanges();
      
      // Then logout
      component.logout();
      
      // Get the latest value from the subject
      let updatedHeaderMenu: HeaderMenus | undefined;
      headerMenuSubject.subscribe(menu => {
        updatedHeaderMenu = menu;
      });
      
      // Check that header menu was updated correctly
      expect(updatedHeaderMenu?.showAuthSection).toBeFalse();
      expect(updatedHeaderMenu?.showNoAuthSection).toBeTrue();
    });
  });

  describe('menu visibility tests', () => {
    it('should show non-authenticated menu items when not authenticated', () => {
      // Set non-auth section to visible
      component.showNoAuthSection = true;
      component.showAuthSection = false;
      fixture.detectChanges();
      
      // Get all buttons
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const buttonTexts = buttons.map(btn => btn.nativeElement.textContent);
      
      // Check for presence of non-auth menu items
      expect(buttonTexts).toContain('Dashboard');
      expect(buttonTexts).toContain('Home');
      expect(buttonTexts).toContain('Login');
      expect(buttonTexts).toContain('Register');
      
      // Check for absence of auth menu items
      expect(buttonTexts).not.toContain('Admin posts');
      expect(buttonTexts).not.toContain('Admin categories');
      expect(buttonTexts).not.toContain('Profile');
      expect(buttonTexts).not.toContain('Logout');
    });

    it('should show authenticated menu items when authenticated', () => {
      // Set auth section to visible
      component.showNoAuthSection = false;
      component.showAuthSection = true;
      fixture.detectChanges();
      
      // Get all buttons
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const buttonTexts = buttons.map(btn => btn.nativeElement.textContent);
      
      // Check for presence of auth menu items
      expect(buttonTexts).toContain('Dashboard');
      expect(buttonTexts).toContain('Home');
      expect(buttonTexts).toContain('Admin posts');
      expect(buttonTexts).toContain('Admin categories');
      expect(buttonTexts).toContain('Profile');
      expect(buttonTexts).toContain('Logout');
      
      // Check for absence of non-auth menu items
      expect(buttonTexts).not.toContain('Login');
      expect(buttonTexts).not.toContain('Register');
    });
    
    it('should toggle menu visibility when header menu state changes', () => {
      // Initially in non-auth state
      expect(component.showNoAuthSection).toBeTrue();
      expect(component.showAuthSection).toBeFalse();
      
      // Check non-auth menu is visible
      let buttons = fixture.debugElement.queryAll(By.css('button'));
      let buttonTexts = buttons.map(btn => btn.nativeElement.textContent);
      expect(buttonTexts).toContain('Login');
      
      // Change to auth state
      headerMenuSubject.next({
        showAuthSection: true,
        showNoAuthSection: false,
      });
      fixture.detectChanges();
      
      // Check component state updated
      expect(component.showNoAuthSection).toBeFalse();
      expect(component.showAuthSection).toBeTrue();
      
      // Check auth menu is now visible
      buttons = fixture.debugElement.queryAll(By.css('button'));
      buttonTexts = buttons.map(btn => btn.nativeElement.textContent);
      expect(buttonTexts).toContain('Admin posts');
      expect(buttonTexts).not.toContain('Login');
    });
  });
  
  describe('button click handlers', () => {
    it('should call navigationTo when dashboard button clicked', () => {
      spyOn(component, 'navigationTo');
      
      const dashboardButton = fixture.debugElement.query(By.css('button')).nativeElement;
      dashboardButton.click();
      
      expect(component.navigationTo).toHaveBeenCalledWith('dashboard');
    });
    
    it('should call logout when logout button clicked', fakeAsync(() => {
      // Set auth section to visible to show logout button
      component.showNoAuthSection = false;
      component.showAuthSection = true;
      fixture.detectChanges();
      
      spyOn(component, 'logout');
      
      // Find logout button
      const logoutButton = fixture.debugElement.queryAll(By.css('button'))
        .find(btn => btn.nativeElement.textContent.includes('Logout'))?.nativeElement;
      
      // Click it
      logoutButton.click();
      tick();
      
      expect(component.logout).toHaveBeenCalled();
    }));
  });
});
