import { Injectable } from '@nestjs/common';
import { USBSerialDeviceWatcherService } from './USBSerialDeviceWatcher.service';
import { SerialPort, ReadlineParser } from 'serialport';
import { ClientInitialHandshakeUseCase } from './clientInitialHandshake.useCase';

@Injectable()
export class ClientInitialHardwareHandshakeService {
  constructor(
    private readonly deviceWatcher: USBSerialDeviceWatcherService,
    private readonly clientInitialHandshakeUseCase: ClientInitialHandshakeUseCase,
  ) {
    this.deviceWatcher.addListenerForNewDevice(this.tryToConnectThroughSerial);
  }

  tryToConnectThroughSerial(newSerialDevicePath: string) {
    const serialPort = new SerialPort({
      path: newSerialDevicePath,
      baudRate: 9600,
    });
    const readlineParser = new ReadlineParser({ delimiter: '\n' });

    serialPort.addListener('open', () => {
      console.log('Port opened');

      serialPort.pipe(readlineParser);

      serialPort.write('ESTABLISHED');
      serialPort.drain();
    });

    readlineParser.addListener('data', async (line) => {
      const handshakeRequest = JSON.parse(line);
      const handshakeResponse = await this.clientInitialHandshakeUseCase.init(
        handshakeRequest,
      );
      const handshakeResponseJSON = JSON.stringify(handshakeResponse);

      serialPort.write(handshakeResponseJSON);
      serialPort.drain(() => serialPort.close());

      handshakeRequest.JSON.stringify(line);

      console.log('readlineParser data Listener: ', line);
    });

    serialPort.addListener('error', (error) => {
      console.log('Error on port: ', error);
    });

    serialPort.addListener('close', () => {
      console.log('Serial port closed');
    });
  }
}
