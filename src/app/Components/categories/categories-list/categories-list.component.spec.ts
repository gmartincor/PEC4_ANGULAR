import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CategoriesListComponent } from './categories-list.component';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { CategoryDTO } from 'src/app/Models/category.dto';

describe('CategoriesListComponent', () => {
  let component: CategoriesListComponent;
  let fixture: ComponentFixture<CategoriesListComponent>;
  let categoryService: CategoryService;
  let localStorageService: LocalStorageService;
  let router: Router;
  let sharedService: SharedService;

  // Mock data
  const userId = '123';
  const categoryId = '456';
  const mockCategories: CategoryDTO[] = [
    { categoryId: '1', title: 'Category 1', description: 'Description 1', css_color: '#FF0000', userId: '123' },
    { categoryId: '2', title: 'Category 2', description: 'Description 2', css_color: '#00FF00', userId: '123' }
  ];

  // Mock services
  const categoryServiceMock = {
    getCategoriesByUserId: jasmine.createSpy('getCategoriesByUserId').and.returnValue(of(mockCategories)),
    deleteCategory: jasmine.createSpy('deleteCategory').and.returnValue(of({ affected: 1 }))
  };

  const localStorageServiceMock = {
    get: jasmine.createSpy('get').and.returnValue(userId)
  };

  const routerMock = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  const sharedServiceMock = {
    errorLog: jasmine.createSpy('errorLog')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CategoriesListComponent],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SharedService, useValue: sharedServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Reset spies before each test
    categoryServiceMock.getCategoriesByUserId.calls.reset();
    categoryServiceMock.deleteCategory.calls.reset();
    localStorageServiceMock.get.calls.reset();
    routerMock.navigateByUrl.calls.reset();
    sharedServiceMock.errorLog.calls.reset();
    
    // By default, return the mock categories
    categoryServiceMock.getCategoriesByUserId.and.returnValue(of(mockCategories));
    
    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('loadCategories', () => {
    it('should call getCategoriesByUserId and set categories correctly', () => {
      // We need to call detectChanges to trigger ngOnInit
      fixture.detectChanges();
      
      // Now we can expect the methods to have been called
      expect(localStorageServiceMock.get).toHaveBeenCalledWith('user_id');
      expect(categoryServiceMock.getCategoriesByUserId).toHaveBeenCalledWith(userId);
      expect(component.categories).toEqual(mockCategories);
    });

    it('should handle error when getCategoriesByUserId fails', () => {
      // Recreate the TestBed with the error configuration
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CategoriesListComponent],
        providers: [
          { 
            provide: CategoryService, 
            useValue: {
              getCategoriesByUserId: jasmine.createSpy('getCategoriesByUserId').and.returnValue(
                throwError({ error: 'Test error' })
              )
            } 
          },
          { 
            provide: LocalStorageService, 
            useValue: { get: jasmine.createSpy('get').and.returnValue(userId) } 
          },
          { provide: Router, useValue: routerMock },
          { 
            provide: SharedService, 
            useValue: { errorLog: jasmine.createSpy('errorLog') } 
          }
        ]
      }).compileComponents();

      // Get fresh instances with the new configuration
      fixture = TestBed.createComponent(CategoriesListComponent);
      component = fixture.componentInstance;
      const freshSharedService = TestBed.inject(SharedService);
      
      // Activate the component
      fixture.detectChanges();
      
      // Verify the error is logged
      expect(freshSharedService.errorLog).toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('should navigate to category creation page', () => {
      fixture.detectChanges();
      component.createCategory();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/category/');
    });
  });

  describe('updateCategory', () => {
    it('should navigate to category update page with correct categoryId', () => {
      fixture.detectChanges();
      component.updateCategory(categoryId);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/category/' + categoryId);
    });
  });
});
