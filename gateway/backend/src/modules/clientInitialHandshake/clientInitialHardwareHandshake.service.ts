import { Injectable } from '@nestjs/common';
import { USBSerialDeviceObserverService } from './USBSerialDeviceObserver.service';
import { SerialPort, ReadlineParser } from 'serialport';
import { ClientInitialHandshakeUseCase } from './clientInitialHandshake.useCase';
import { InitHandshakeQuery } from 'src/types';

@Injectable()
export class ClientInitialHardwareHandshakeService {
  constructor(
    private readonly deviceObserver: USBSerialDeviceObserverService,
    private readonly clientInitialHandshakeUseCase: ClientInitialHandshakeUseCase,
  ) {
    this.deviceObserver.addListenerForNewDevice(this.tryToConnectThroughSerial);
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
      // TODO: Добавить try catch
      const handshakeRequest: InitHandshakeQuery = JSON.parse(line);
      const handshakeResponse = await this.clientInitialHandshakeUseCase.init(
        handshakeRequest,
      );
      const handshakeResponseJSON = JSON.stringify(handshakeResponse);

      // TODO: добавить валидацию выходного сообщения
      serialPort.write(handshakeResponseJSON);
      serialPort.drain(() => serialPort.close());

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
