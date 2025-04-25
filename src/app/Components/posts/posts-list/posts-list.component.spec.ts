import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PostsListComponent } from './posts-list.component';
import { PostService } from 'src/app/Services/post.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { PostDTO } from 'src/app/Models/post.dto';
import { CategoryDTO } from 'src/app/Models/category.dto';

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;
  let postService: PostService;
  let localStorageService: LocalStorageService;
  let router: Router;
  let sharedService: SharedService;

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

  // Mock services
  const postServiceMock = {
    getPostsByUserId: jasmine.createSpy('getPostsByUserId').and.returnValue(of(mockPosts)),
    deletePost: jasmine.createSpy('deletePost').and.returnValue(of({ affected: 1 }))
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
      declarations: [PostsListComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SharedService, useValue: sharedServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    localStorageService = TestBed.inject(LocalStorageService);
    router = TestBed.inject(Router);
    sharedService = TestBed.inject(SharedService);
    
    // Reset spies before each test
    postServiceMock.getPostsByUserId.calls.reset();
    postServiceMock.deletePost.calls.reset();
    localStorageServiceMock.get.calls.reset();
    routerMock.navigateByUrl.calls.reset();
    sharedServiceMock.errorLog.calls.reset();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadPosts', () => {
    it('should call getPostsByUserId and set posts correctly', () => {
      // loadPosts is called in the constructor, so we need to check if it was called
      expect(localStorageServiceMock.get).toHaveBeenCalledWith('user_id');
      expect(postServiceMock.getPostsByUserId).toHaveBeenCalledWith(userId);
      expect(component.posts).toEqual(mockPosts);
    });

    it('should handle error when getPostsByUserId fails', () => {
      const error = { error: 'Test error' };
      postServiceMock.getPostsByUserId.and.returnValue(throwError(error));
      
      // We need to create a new instance to trigger the constructor again
      component = new PostsListComponent(
        postService as any,
        router as any,
        localStorageService as any,
        sharedService as any
      );
      
      expect(sharedServiceMock.errorLog).toHaveBeenCalled();
    });
  });

  describe('createPost', () => {
    it('should navigate to post creation page', () => {
      component.createPost();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/post/');
    });
  });

  describe('updatePost', () => {
    it('should navigate to post update page with correct postId', () => {
      component.updatePost(postId);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/post/' + postId);
    });
  });
});
