import { 
  IsNotEmpty, 
  IsEmail, 
  Length, 
  Matches 
} from 'class-validator';

export class ProductDTO {

  image!: string;
  product_name!: string;
}