import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { process } from 'core-worker';
import { EventEmitter } from 'events';
import { differenceBetweenSetsInArray } from 'src/tools';

@Injectable()
export class USBSerialDeviceObserverService {
  private deviceScanInterval!: NodeJS.Timer;
  private deviceWatchEmitter = new EventEmitter();
  private prevSerialPortsSet!: Set<string>;

  constructor(private readonly configService: ConfigService) {
    this.getCurrentSerialDeviceSet().then((initialDeviceSet) => {
      this.prevSerialPortsSet = initialDeviceSet;
      this.deviceScanInterval = setInterval(
        () => this.updateSerialPorts(),
        3000,
      );
    });

    this.deviceWatchEmitter.on('newSerialDeviceWasAdded', (...args) => {
      console.log(
        '🚀 ~ file: usbDeviceWatcher.service.ts ~ line 20 ~ USBDeviceWatcherService ~ this.deviceWatchEmitter.on ~ args',
        args,
      );
    });
  }

  public addListenerForNewDevice(listener: newSerialDeviceListener) {
    this.deviceWatchEmitter.addListener('newSerialDeviceWasAdded', listener);
  }

  public removeListenerForNewDevice(listener: newSerialDeviceListener) {
    this.deviceWatchEmitter.removeListener('newSerialDeviceWasAdded', listener);
  }

  public destructor() {
    clearInterval(this.deviceScanInterval);
  }

  private async updateSerialPorts() {
    const serialDevicesSet = await this.getCurrentSerialDeviceSet();

    const newSerialPorts = differenceBetweenSetsInArray(
      serialDevicesSet,
      this.prevSerialPortsSet,
    );

    newSerialPorts.forEach((device) =>
      this.deviceWatchEmitter.emit('newSerialDeviceWasAdded', `/dev/${device}`),
    );
    this.prevSerialPortsSet = serialDevicesSet;
  }

  private async getCurrentSerialDeviceSet() {
    const { data } = (await process('ls -w 1 /dev').death()) as {
      data: string;
    };

    const regexpes: RegExp[] =
      this.configService.get('serialPortPatterns') || [];

    const devices = data.split('\n');

    const serialDevices = devices.filter((device) =>
      regexpes.some((regexp) => regexp.test(device)),
    );
    return new Set(serialDevices);
  }
}

type newSerialDeviceListener = (newSerialDevicePath: string) => void;
