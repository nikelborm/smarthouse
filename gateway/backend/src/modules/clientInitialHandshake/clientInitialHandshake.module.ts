import { Module } from '@nestjs/common';
import { ClientInitialHandshakeUseCase } from './clientInitialHandshake.useCase';
import { ClientInitialHardwareHandshakeService } from './clientInitialHardwareHandshake.service';
import { USBSerialDeviceWatcherService } from './USBSerialDeviceWatcher.service';

@Module({
  providers: [
    ClientInitialHandshakeUseCase,
    ClientInitialHardwareHandshakeService,
    USBSerialDeviceWatcherService,
  ],
  exports: [ClientInitialHandshakeUseCase],
})
export class ClientInitialHandshakeModule {}
