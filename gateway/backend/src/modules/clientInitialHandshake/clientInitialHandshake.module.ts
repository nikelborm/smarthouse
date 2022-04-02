import { Module } from '@nestjs/common';
import { ClientInitialHandshakeUseCase } from './clientInitialHandshake.useCase';
import { USBSerialDeviceWatcherService } from './USBSerialDeviceWatcher.service';

@Module({
  providers: [ClientInitialHandshakeUseCase, USBSerialDeviceWatcherService],
  exports: [ClientInitialHandshakeUseCase],
})
export class ClientInitialHandshakeModule {}
