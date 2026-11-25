import { Module } from "@nestjs/common";
import { SurveysService } from "./surveys.service";
import { SurveysController } from "./surveys.controller";
import { SlipsController } from "./slips.controller";
import { TicketsController } from "./tickets.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SurveysController, SlipsController, TicketsController],
  providers: [SurveysService],
  exports: [SurveysService],
})
export class SurveysModule {}
