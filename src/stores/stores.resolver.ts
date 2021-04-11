import { SetMetadata } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateProductInput, CreateProductOutput } from './dtos/create-product.dto';
import {
  CreateStoreInput,
  CreateStoreOutput,
} from './dtos/create-store.dto';
import { DeleteProductInput, DeleteProductOutput } from './dtos/delete-product.dto';
import {
  DeleteStoreInput,
  DeleteStoreOutput,
} from './dtos/delete-store.dto';
import { EditProductInput, EditProductOutput } from './dtos/edit-product.dto';
import {
  EditStoreInput,
  EditStoreOutput,
} from './dtos/edit-store.dto';
import { MyStoreInput, MyStoreOutput } from './dtos/my-store';
import { MyStoresOutput } from './dtos/my-stores.dto';
import { StoreInput, StoreOutput } from './dtos/store.dto';
import { StoresInput, StoresOutput } from './dtos/stores.dto';
import {
  SearchStoreInput,
  SearchStoreOutput,
} from './dtos/search-store.dto';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Store } from './entities/store.entity';
import { Storeservice } from './stores.service';

@Resolver(of => Store)
export class StoreResolver {
  constructor(private readonly storeservice: Storeservice) {}

  @Mutation(returns => CreateStoreOutput)
  @Role(['Owner'])
  async createStore(
    @AuthUser() authUser: User,
    @Args('input') createStoreInput: CreateStoreInput,
  ): Promise<CreateStoreOutput> {
    return this.storeservice.createStore(
      authUser,
      createStoreInput,
    );
  }

  @Query(returns => MyStoresOutput)
  @Role(['Owner'])
  myStores(@AuthUser() owner: User): Promise<MyStoresOutput> {
    return this.storeservice.myStores(owner);
  }

  @Query(returns => MyStoreOutput)
  @Role(['Owner'])
  myStore(
    @AuthUser() owner: User,
    @Args('input') myStoreInput: MyStoreInput,
  ): Promise<MyStoreOutput> {
    return this.storeservice.myStore(owner, myStoreInput);
  }

  @Mutation(returns => EditStoreOutput)
  @Role(['Owner'])
  editStore(
    @AuthUser() owner: User,
    @Args('input') editStoreInput: EditStoreInput,
  ): Promise<EditStoreOutput> {
    return this.storeservice.editStore(owner, editStoreInput);
  }

  @Mutation(returns => DeleteStoreOutput)
  @Role(['Owner'])
  deleteStore(
    @AuthUser() owner: User,
    @Args('input') deleteStoreInput: DeleteStoreInput,
  ): Promise<DeleteStoreOutput> {
    return this.storeservice.deleteStore(
      owner,
      deleteStoreInput,
    );
  }

  @Query(returns => StoresOutput)
  stores(
    @Args('input') storesInput: StoresInput,
  ): Promise<StoresOutput> {
    return this.storeservice.allStores(storesInput);
  }

  @Query(returns => StoreOutput)
  store(
    @Args('input') storeInput: StoreInput,
  ): Promise<StoreOutput> {
    return this.storeservice.findStoreById(storeInput);
  }

  @Query(returns => SearchStoreOutput)
  searchStore(
    @Args('input') searchStoreInput: SearchStoreInput,
  ): Promise<SearchStoreOutput> {
    return this.storeservice.searchStoreByName(searchStoreInput);
  }
}

@Resolver(of => Category)
export class CategoryResolver {
  constructor(private readonly storeservice: Storeservice) {}

  @ResolveField(type => Int)
  storeCount(@Parent() category: Category): Promise<number> {
    return this.storeservice.countStores(category);
  }

  @Query(type => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.storeservice.allCategories();
  }

  @Query(type => CategoryOutput)
  category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.storeservice.findCategoryBySlug(categoryInput);
  }
}

@Resolver(of => Product)
export class ProductResolver {
  constructor(private readonly storeservice: Storeservice) {}

  @Mutation(type => CreateProductOutput)
  @Role(['Owner'])
  createProduct(
    @AuthUser() owner: User,
    @Args('input') createProductInput: CreateProductInput,
  ): Promise<CreateProductOutput> {
    return this.storeservice.createProduct(owner, createProductInput);
  }

  @Mutation(type => EditProductOutput)
  @Role(['Owner'])
  editProduct(
    @AuthUser() owner: User,
    @Args('input') editProductInput: EditProductInput,
  ): Promise<EditProductOutput> {
    return this.storeservice.editProduct(owner, editProductInput);
  }

  @Mutation(type => DeleteProductOutput)
  @Role(['Owner'])
  deleteProduct(
    @AuthUser() owner: User,
    @Args('input') deleteProductInput: DeleteProductInput,
  ): Promise<DeleteProductOutput> {
    return this.storeservice.deleteProduct(owner, deleteProductInput);
  }
}