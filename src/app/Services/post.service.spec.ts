import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { SharedService } from './shared.service';
import { PostDTO } from '../Models/post.dto';
import { CategoryDTO } from '../Models/category.dto';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  
  // Mock data
  const userId = '123';
  const postId = '456';
  const mockCategories: CategoryDTO[] = [
    { categoryId: '1', title: 'Category 1', description: 'Description 1', css_color: '#FF0000', userId: '123' }
  ];
  
  const mockPosts: PostDTO[] = [
    { 
      postId: '1', 
      title: 'Post 1', 
      description: 'Description 1', 
      num_likes: 10, 
      num_dislikes: 2, 
      publication_date: new Date('2025-01-15'), 
      categories: mockCategories,
      userId: '123',
      userAlias: 'user1' 
    },
    { 
      postId: '2', 
      title: 'Post 2', 
      description: 'Description 2', 
      num_likes: 5, 
      num_dislikes: 1, 
      publication_date: new Date('2025-01-20'), 
      categories: mockCategories,
      userId: '123',
      userAlias: 'user1' 
    }
  ];
  
  const mockPost: PostDTO = { 
    postId: '456', 
    title: 'New Post', 
    description: 'New Description', 
    num_likes: 0, 
    num_dislikes: 0, 
    publication_date: new Date('2025-04-25'), 
    categories: mockCategories,
    userId: '123',
    userAlias: 'user1' 
  };
  
  const mockUpdateResponse = { affected: 1 };
  const mockDeleteResponse = { affected: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService, SharedService]
    });
    
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that there are no outstanding requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts', () => {
    it('should return all posts and use GET method', () => {
      // Call the service method
      service.getPosts().subscribe(posts => {
        expect(posts).toEqual(mockPosts);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne('http://localhost:3000/posts');
      expect(req.request.method).toEqual('GET');
      
      // Provide a mock response
      req.flush(mockPosts);
    });
  });

  describe('getPostsByUserId', () => {
    it('should return posts for a user and use GET method', () => {
      // Call the service method
      service.getPostsByUserId(userId).subscribe(posts => {
        expect(posts).toEqual(mockPosts);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/users/posts/${userId}`);
      expect(req.request.method).toEqual('GET');
      
      // Provide a mock response
      req.flush(mockPosts);
    });
  });

  describe('createPost', () => {
    it('should create a new post and use POST method', () => {
      // Call the service method
      service.createPost(mockPost).subscribe(post => {
        expect(post).toEqual(mockPost);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne('http://localhost:3000/posts');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(mockPost);
      
      // Provide a mock response
      req.flush(mockPost);
    });
  });

  describe('getPostById', () => {
    it('should return a specific post and use GET method', () => {
      // Call the service method
      service.getPostById(postId).subscribe(post => {
        expect(post).toEqual(mockPost);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/posts/${postId}`);
      expect(req.request.method).toEqual('GET');
      
      // Provide a mock response
      req.flush(mockPost);
    });
  });

  describe('updatePost', () => {
    it('should update a post and use PUT method', () => {
      // Call the service method
      service.updatePost(postId, mockPost).subscribe(post => {
        expect(post).toEqual(mockPost);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/posts/${postId}`);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(mockPost);
      
      // Provide a mock response
      req.flush(mockPost);
    });
  });

  describe('likePost', () => {
    it('should like a post and use PUT method', () => {
      // Call the service method
      service.likePost(postId).subscribe(response => {
        expect(response).toEqual(mockUpdateResponse);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/posts/like/${postId}`);
      expect(req.request.method).toEqual('PUT');
      
      // Provide a mock response
      req.flush(mockUpdateResponse);
    });
  });

  describe('dislikePost', () => {
    it('should dislike a post and use PUT method', () => {
      // Call the service method
      service.dislikePost(postId).subscribe(response => {
        expect(response).toEqual(mockUpdateResponse);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/posts/dislike/${postId}`);
      expect(req.request.method).toEqual('PUT');
      
      // Provide a mock response
      req.flush(mockUpdateResponse);
    });
  });

  describe('deletePost', () => {
    it('should delete a post and use DELETE method', () => {
      // Call the service method
      service.deletePost(postId).subscribe(response => {
        expect(response).toEqual(mockDeleteResponse);
      });

      // Set up the expected HTTP request
      const req = httpMock.expectOne(`http://localhost:3000/posts/${postId}`);
      expect(req.request.method).toEqual('DELETE');
      
      // Provide a mock response
      req.flush(mockDeleteResponse);
    });
  });
});
