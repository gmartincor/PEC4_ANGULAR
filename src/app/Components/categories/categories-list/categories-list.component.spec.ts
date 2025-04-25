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
    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    localStorageService = TestBed.inject(LocalStorageService);
    router = TestBed.inject(Router);
    sharedService = TestBed.inject(SharedService);
    
    // Reset spies before each test
    categoryServiceMock.getCategoriesByUserId.calls.reset();
    categoryServiceMock.deleteCategory.calls.reset();
    localStorageServiceMock.get.calls.reset();
    routerMock.navigateByUrl.calls.reset();
    sharedServiceMock.errorLog.calls.reset();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadCategories', () => {
    it('should call getCategoriesByUserId and set categories correctly', () => {
      // loadCategories is called in the constructor, so we need to check if it was called
      expect(localStorageServiceMock.get).toHaveBeenCalledWith('user_id');
      expect(categoryServiceMock.getCategoriesByUserId).toHaveBeenCalledWith(userId);
      expect(component.categories).toEqual(mockCategories);
    });

    it('should handle error when getCategoriesByUserId fails', () => {
      const error = { error: 'Test error' };
      categoryServiceMock.getCategoriesByUserId.and.returnValue(throwError(error));
      
      // We need to create a new instance to trigger the constructor again
      component = new CategoriesListComponent(
        categoryService as any,
        router as any,
        localStorageService as any,
        sharedService as any
      );
      
      expect(sharedServiceMock.errorLog).toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('should navigate to category creation page', () => {
      component.createCategory();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/category/');
    });
  });

  describe('updateCategory', () => {
    it('should navigate to category update page with correct categoryId', () => {
      component.updateCategory(categoryId);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/category/' + categoryId);
    });
  });
});
