import { Controller, Get, Post, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService:ProductsService){}
    @Get()
    getProductsList(){
        return this.productService.getProducts()
    }
    @Get(':id')
    getProduct(@Param('id')id:string){
        return this.productService.getCustomProduct(id)
    }
    
}
