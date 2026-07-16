export type DeviceType = 'WEB' | 'MOBILE';

export class DeviceTypeVO {
  private constructor(private readonly value: DeviceType) {}

  static WEB = new DeviceTypeVO('WEB');
  static MOBILE = new DeviceTypeVO('MOBILE');

  static fromString(value: string): DeviceTypeVO {
    if (value === 'WEB') return DeviceTypeVO.WEB;
    if (value === 'MOBILE') return DeviceTypeVO.MOBILE;
    throw new Error(`Invalid device type: ${value}`);
  }

  getValue(): DeviceType {
    return this.value;
  }

  isMobile(): boolean {
    return this.value === 'MOBILE';
  }
}
