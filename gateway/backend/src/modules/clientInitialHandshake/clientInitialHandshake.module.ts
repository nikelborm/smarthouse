import { Module } from '@nestjs/common';
import { DataValidatorModule } from '../dataValidator';
import { EncryptionModule } from '../encryption';
import { ClientInitialHandshakeUseCase } from './clientInitialHandshake.useCase';
import { ClientInitialHardwareHandshakeService } from './clientInitialHardwareHandshake.service';
import { USBSerialDeviceWatcherService } from './USBSerialDeviceWatcher.service';

@Module({
  imports: [EncryptionModule, DataValidatorModule],
  providers: [
    ClientInitialHandshakeUseCase,
    ClientInitialHardwareHandshakeService,
    USBSerialDeviceWatcherService,
  ],
  exports: [ClientInitialHandshakeUseCase],
})
export class ClientInitialHandshakeModule {}
