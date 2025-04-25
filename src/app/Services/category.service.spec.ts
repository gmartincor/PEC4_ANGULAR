import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService, deleteResponse } from './category.service';
import { SharedService } from './shared.service';
import { CategoryDTO } from '../Models/category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  
  // Mock data
  const userId = '123';
  const categoryId = '456';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService, SharedService]
    });
    
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
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
  });

  describe('deleteCategory', () => {
    it('should delete a category and use DELETE method', () => {
      // Call the service method
      service.deleteCategory(categoryId).subscribe(response => {
        expect(response).toEqual(mockDeleteResponse);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/categories/${categoryId}`);
      expect(req.request.method).toEqual('DELETE');
      
      // Provide a mock response
      req.flush(mockDeleteResponse);
    });
  });
});
