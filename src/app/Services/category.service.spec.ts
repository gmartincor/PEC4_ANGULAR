import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService, deleteResponse } from './category.service';
import { SharedService } from './shared.service';
import { CategoryDTO } from '../Models/category.dto';
import { throwError } from 'rxjs';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  let sharedService: SharedService;
  
  // Mock data
  const userId = '123';
  const categoryId = '456';
  const nonExistingCategoryId = '999';
  const mockCategories: CategoryDTO[] = [
    { categoryId: '1', title: 'Category 1', description: 'Description 1', css_color: '#FF0000', userId: '123' },
    { categoryId: '2', title: 'Category 2', description: 'Description 2', css_color: '#00FF00', userId: '123' }
  ];
  const mockCategory: CategoryDTO = { 
    categoryId: '456', 
    title: 'New Category', 
    description: 'New Description', 
    css_color: '#0000FF', 
    userId: '123' 
  };
  const mockDeleteResponse: deleteResponse = { affected: 1 };
  const mockEmptyDeleteResponse: deleteResponse = { affected: 0 };
  const mockErrorResponse = { status: 500, statusText: 'Server Error' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService, SharedService]
    });
    
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
    sharedService = TestBed.inject(SharedService);
    
    // Spy on the SharedService's handleError method
    spyOn(sharedService, 'handleError').and.callFake((error) => throwError(error));
  });

  afterEach(() => {
    // Verify that there are no outstanding requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCategoriesByUserId', () => {
    it('should return categories for a user and use GET method', () => {
      // Call the service method
      service.getCategoriesByUserId(userId).subscribe(categories => {
        expect(categories).toEqual(mockCategories);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/users/categories/${userId}`);
      expect(req.request.method).toEqual('GET');
      
      // Provide a mock response
      req.flush(mockCategories);
    });
    
    it('should return empty array when no categories exist', () => {
      service.getCategoriesByUserId(userId).subscribe(categories => {
        expect(categories).toEqual([]);
        expect(categories.length).toBe(0);
      });

      const req = httpMock.expectOne(`http://localhost:3000/users/categories/${userId}`);
      req.flush([]);
    });
    
    it('should handle error when API returns error', () => {
      service.getCategoriesByUserId(userId).subscribe(
        () => fail('should have failed with error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/users/categories/${userId}`);
      req.flush('Server error', mockErrorResponse);
    });
    
    it('should handle error with invalid userId', () => {
      service.getCategoriesByUserId('').subscribe(
        () => fail('should have failed with error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpMock.expectOne('http://localhost:3000/users/categories/');
      req.flush('Server error', mockErrorResponse);
    });
  });

  describe('createCategory', () => {
    it('should create a new category and use POST method', () => {
      // Call the service method
      service.createCategory(mockCategory).subscribe(category => {
        expect(category).toEqual(mockCategory);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne('http://localhost:3000/categories');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(mockCategory);
      
      // Provide a mock response
      req.flush(mockCategory);
    });
    
    it('should handle error when category creation fails', () => {
      service.createCategory(mockCategory).subscribe(
        () => fail('should have failed with error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpMock.expectOne('http://localhost:3000/categories');
      req.flush('Error creating category', mockErrorResponse);
    });
    
    it('should handle validation errors', () => {
      const invalidCategory = { ...mockCategory, title: '' }; // Invalid title
      
      service.createCategory(invalidCategory as CategoryDTO).subscribe(
        () => fail('should have failed with validation error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
        }
      );

      const req = httpMock.expectOne('http://localhost:3000/categories');
      req.flush('Validation error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getCategoryById', () => {
    it('should return a specific category and use GET method', () => {
      // Call the service method
      service.getCategoryById(categoryId).subscribe(category => {
        expect(category).toEqual(mockCategory);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`);
      expect(req.request.method).toEqual('GET');
      
      // Provide a mock response
      req.flush(mockCategory);
    });
    
    it('should handle 404 when category not found', () => {
      service.getCategoryById(nonExistingCategoryId).subscribe(
        () => fail('should have failed with 404'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/categories/${nonExistingCategoryId}`);
      req.flush('Category not found', { status: 404, statusText: 'Not Found' });
    });
    
    it('should handle server error', () => {
      service.getCategoryById(categoryId).subscribe(
        () => fail('should have failed with server error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`);
      req.flush('Server error', mockErrorResponse);
    });
  });

  describe('updateCategory', () => {
    it('should update a category and use PUT method', () => {
      // Call the service method
      service.updateCategory(categoryId, mockCategory).subscribe(category => {
        expect(category).toEqual(mockCategory);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(mockCategory);
      
      // Provide a mock response
      req.flush(mockCategory);
    });
    
    it('should handle 404 when category not found for update', () => {
      service.updateCategory(nonExistingCategoryId, mockCategory).subscribe(
        () => fail('should have failed with 404'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/categories/${nonExistingCategoryId}`);
      req.flush('Category not found', { status: 404, statusText: 'Not Found' });
    });
    
    it('should handle validation errors during update', () => {
      const invalidCategory = { ...mockCategory, css_color: 'invalid-color' };
      
      service.updateCategory(categoryId, invalidCategory as CategoryDTO).subscribe(
        () => fail('should have failed with validation error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`);
      req.flush('Validation error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category and use DELETE method', () => {
      // Call the service method
      service.deleteCategory(categoryId).subscribe(response => {
        expect(response).toEqual(mockDeleteResponse);
        expect(response.affected).toBe(1);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`);
      expect(req.request.method).toEqual('DELETE');
      
      // Provide a mock response
      req.flush(mockDeleteResponse);
    });
    
    it('should handle no affected rows when category not found', () => {
      service.deleteCategory(nonExistingCategoryId).subscribe(response => {
        expect(response).toEqual(mockEmptyDeleteResponse);
        expect(response.affected).toBe(0);
      });

      const req = httpMock.expectOne(`http://localhost:3000/categories/${nonExistingCategoryId}`);
      req.flush(mockEmptyDeleteResponse);
    });
    
    it('should handle server error during deletion', () => {
      service.deleteCategory(categoryId).subscribe(
        () => fail('should have failed with server error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`);
      req.flush('Server error', mockErrorResponse);
    });
    
    it('should handle unauthorized deletion attempt', () => {
      service.deleteCategory(categoryId).subscribe(
        () => fail('should have failed with unauthorized error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`);
      req.flush('Unauthorized', { status: 403, statusText: 'Forbidden' });
    });
  });
  
  describe('URL construction', () => {
    it('should use correct base URL for all endpoints', () => {
      // Test each method to ensure the base URL is correct
      service.getCategoriesByUserId(userId).subscribe();
      httpMock.expectOne(`http://localhost:3000/users/categories/${userId}`).flush([]);
      
      service.createCategory(mockCategory).subscribe();
      httpMock.expectOne('http://localhost:3000/categories').flush(mockCategory);
      
      service.getCategoryById(categoryId).subscribe();
      httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`).flush(mockCategory);
      
      service.updateCategory(categoryId, mockCategory).subscribe();
      httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`).flush(mockCategory);
      
      service.deleteCategory(categoryId).subscribe();
      httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`).flush(mockDeleteResponse);
    });
  });
  
  describe('error handling', () => {
    it('should use sharedService.handleError for error handling', () => {
      service.getCategoriesByUserId(userId).subscribe(
        () => fail('should have failed with error'),
        () => {
          expect(sharedService.handleError).toHaveBeenCalled();
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/users/categories/${userId}`);
      req.error(new ErrorEvent('Network error'));
    });
  });
});
