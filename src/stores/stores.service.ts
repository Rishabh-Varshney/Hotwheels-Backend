import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Like, Raw, Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import {
  CreateProductInput,
  CreateProductOutput,
} from './dtos/create-product.dto';
import { CreateStoreInput, CreateStoreOutput } from './dtos/create-store.dto';
import {
  DeleteProductInput,
  DeleteProductOutput,
} from './dtos/delete-product.dto';
import { DeleteStoreInput, DeleteStoreOutput } from './dtos/delete-store.dto';
import { EditProductInput, EditProductOutput } from './dtos/edit-product.dto';
import { EditStoreInput, EditStoreOutput } from './dtos/edit-store.dto';
import { MyStoreInput, MyStoreOutput } from './dtos/my-store';
import { MyStoresOutput } from './dtos/my-stores.dto';
import { StoreInput, StoreOutput } from './dtos/store.dto';
import { StoresInput, StoresOutput } from './dtos/stores.dto';
import { SearchStoreInput, SearchStoreOutput } from './dtos/search-store.dto';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Store } from './entities/store.entity';
import { CategoryRepository } from './repositories/category.repository';
import {
  SearchProductInput,
  SearchProductOutput,
} from './dtos/serach-product.dto';
import { ProductInput, ProductOutput } from './dtos/product.dto';
import { ProductsInput, ProductsOutput } from './dtos/products.dto';

@Injectable()
export class Storeservice {
  constructor(
    @InjectRepository(Store)
    private readonly stores: Repository<Store>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    private readonly categories: CategoryRepository,
  ) {}

  async createStore(
    owner: User,
    createStoreInput: CreateStoreInput,
  ): Promise<CreateStoreOutput> {
    try {
      const newStore = this.stores.create(createStoreInput);
      newStore.owner = owner;
      const category = await this.categories.getOrCreate(
        createStoreInput.categoryName,
      );
      newStore.category = category;
      await this.stores.save(newStore);
      return {
        ok: true,
        storeId: newStore.id,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create store',
      };
    }
  }

  async editStore(
    owner: User,
    editStoreInput: EditStoreInput,
  ): Promise<EditStoreOutput> {
    try {
      const store = await this.stores.findOne(editStoreInput.storeId);
      if (!store) {
        return {
          ok: false,
          error: 'Store not found',
        };
      }
      if (owner.id !== store.ownerId) {
        return {
          ok: false,
          error: "You can't edit a store that you don't own",
        };
      }
      let category: Category = null;
      if (editStoreInput.categoryName) {
        category = await this.categories.getOrCreate(
          editStoreInput.categoryName,
        );
      }
      await this.stores.save([
        {
          id: editStoreInput.storeId,
          ...editStoreInput,
          ...(category && { category }),
        },
      ]);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not edit Store',
      };
    }
  }

  async deleteStore(
    owner: User,
    { storeId }: DeleteStoreInput,
  ): Promise<DeleteStoreOutput> {
    try {
      const store = await this.stores.findOne(storeId);
      if (!store) {
        return {
          ok: false,
          error: 'Store not found',
        };
      }
      if (owner.id !== store.ownerId) {
        return {
          ok: false,
          error: "You can't delete a store that you don't own",
        };
      }
      await this.stores.delete(storeId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete store.',
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }
  countProducts(category: Category) {
    return this.products.count({ category });
  }
  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      const products = await this.products.find({
        where: {
          category,
        },
        take: 25,
        skip: (page - 1) * 25,
      });
      const totalResults = await this.countProducts(category);
      return {
        ok: true,
        products,
        category,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }

  async allStores({ page }: StoresInput): Promise<StoresOutput> {
    try {
      const [stores, totalResults] = await this.stores.findAndCount({
        skip: (page - 1) * 3,
        take: 3,
        order: {
          isPromoted: 'DESC',
        },
      });
      return {
        ok: true,
        results: stores,
        totalPages: Math.ceil(totalResults / 3),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load stores',
      };
    }
  }

  async findStoreById({ storeId }: StoreInput): Promise<StoreOutput> {
    try {
      const store = await this.stores.findOne(storeId, {
        relations: ['menu'],
      });
      if (!store) {
        return {
          ok: false,
          error: 'Store not found',
        };
      }
      return {
        ok: true,
        store,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find store',
      };
    }
  }

  async searchStoreByName({
    query,
    page,
  }: SearchStoreInput): Promise<SearchStoreOutput> {
    try {
      const [stores, totalResults] = await this.stores.findAndCount({
        where: {
          name: Raw((name) => `${name} ILIKE '%${query}%'`),
        },
        skip: (page - 1) * 25,
        take: 25,
      });
      return {
        ok: true,
        stores,
        totalResults,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return { ok: false, error: 'Could not search for stores' };
    }
  }

  async createProduct(
    owner: User,
    createProductInput: CreateProductInput,
  ): Promise<CreateProductOutput> {
    try {
      const store = await this.stores.findOne(createProductInput.storeId);
      if (!store) {
        return {
          ok: false,
          error: 'Store not found',
        };
      }
      if (owner.id !== store.ownerId) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      const newProduct = await this.products.create({
        ...createProductInput,
        store,
      });

      const category = await this.categories.getOrCreate(
        createProductInput.categoryName,
      );
      newProduct.category = category;

      await this.products.save(newProduct);
      return {
        ok: true,
        productId: newProduct.id,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Could not create product',
      };
    }
  }

  async checkProductOwner(ownerId: number, productId: number) {}

  async editProduct(
    owner: User,
    editProductInput: EditProductInput,
  ): Promise<EditProductOutput> {
    try {
      const product = await this.products.findOne(editProductInput.productId, {
        relations: ['store'],
      });
      if (!product) {
        return {
          ok: false,
          error: 'Product not found',
        };
      }
      if (product.store.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      let category: Category = null;
      if (editProductInput.categoryName) {
        category = await this.categories.getOrCreate(
          editProductInput.categoryName,
        );
      }
      await this.products.save([
        {
          id: editProductInput.productId,
          ...editProductInput,
          ...(category && { category }),
        },
      ]);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete product',
      };
    }
  }

  async deleteProduct(
    owner: User,
    { productId }: DeleteProductInput,
  ): Promise<DeleteProductOutput> {
    try {
      const product = await this.products.findOne(productId, {
        relations: ['store'],
      });
      if (!product) {
        return {
          ok: false,
          error: 'Product not found',
        };
      }
      if (product.store.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      await this.products.delete(productId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete product',
      };
    }
  }

  async searchProductByName({
    query,
    page,
  }: SearchProductInput): Promise<SearchProductOutput> {
    try {
      const [products, totalResults] = await this.products.findAndCount({
        where: {
          name: Raw((name) => `${name} ILIKE '%${query}%'`),
        },
        relations: ['store'],
        skip: (page - 1) * 25,
        take: 25,
      });
      return {
        ok: true,
        products,
        totalResults,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return { ok: false, error: 'Could not search for products' };
    }
  }

  async myStores(owner: User): Promise<MyStoresOutput> {
    try {
      const stores = await this.stores.find({ owner });
      return {
        stores,
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find stores.',
      };
    }
  }
  async myStore(owner: User, { id }: MyStoreInput): Promise<MyStoreOutput> {
    try {
      const store = await this.stores.findOne(
        { owner, id },
        { relations: ['menu', 'orders'] },
      );
      return {
        store,
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find store',
      };
    }
  }

  async findProductById({ productId }: ProductInput): Promise<ProductOutput> {
    try {
      const product = await this.products.findOne(productId, {
        relations: ['store'],
      });
      if (!product) {
        return {
          ok: false,
          error: 'Product not found',
        };
      }
      return {
        ok: true,
        product,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find product',
      };
    }
  }

  async allProducts({ page }: ProductsInput): Promise<ProductsOutput> {
    try {
      const [products, totalResults] = await this.products.findAndCount({
        skip: (page - 1) * 3,
        take: 3,
      });
      return {
        ok: true,
        results: products,
        totalPages: Math.ceil(totalResults / 3),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load products',
      };
    }
  }
}
