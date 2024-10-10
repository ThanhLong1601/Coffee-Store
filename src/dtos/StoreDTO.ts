import { IsNotEmpty} from 'class-validator';

export class StoreDTO {

  @IsNotEmpty({ message: 'Name không được để trống' })
  name!: string;

  @IsNotEmpty({ message: 'Location không được để trống' })
  location!: string;
  
}