import { Module } from "@nestjs/common";
import { PollingService } from "./polling.service";
import { PollingController } from "./polling.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PollingController],
  providers: [PollingService],
  exports: [PollingService],
})
export class PollingModule {}
