import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { VaultService } from './vault.service';

@Module({
  imports: [HttpModule],
  providers: [VaultService],
  exports: [VaultService, HttpModule],
})
export class VaultModule {}
