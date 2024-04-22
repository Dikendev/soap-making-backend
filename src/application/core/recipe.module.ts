import { Module } from '@nestjs/common';
import { MeasurementSoapSolidService } from './ports/measurement-soap-solid.service';
import { RecipeController } from './adapter/recipe.controller';
import { MeasureSoapSolidRepository } from './repository/measure-soap-solid-repository';
import { PrismaModule } from '../../external/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    MeasurementSoapSolidService,
    {
      provide: MeasureSoapSolidRepository,
      useClass: MeasurementSoapSolidService,
    },
  ],
  controllers: [RecipeController],
})
export class RecipeModule {}
