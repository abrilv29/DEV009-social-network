import { dibujarPosts, createPost } from '../src/component/feed';
import { traerPost } from '../src/controller/feedController';

jest.mock('../src/controller/feedController', () => ({
  traerPost: jest.fn().mockReturnValue({}),
}));

describe('dibujarPosts', () => {
  // Reinicie los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('is a function', () => {
    expect(typeof dibujarPosts).toBe('function');
  });
  it('Deberia dibujar los posts', async () => {
    const documentos = {
      docs: [{
        id: 'mnb12',
        data: (() => ({
          author: 'Fiorella',
          userId: '123456',
          created_date: '15 agosto 2023',
          post: 'Hola2',
          likes: '[123456]',
          counter: 0,
        })),
      }],
    };
    jest.mock('../src/component/feed', () => ({
      createPost: jest.fn().mockReturnValue({}),
    }));
    traerPost.mockImplementation(() => documentos);
    await dibujarPosts();
    expect(createPost).toHaveBeenCalledWith({});
    // expect(traerPost).toHaveBeenCalledWith({});
  });
});
