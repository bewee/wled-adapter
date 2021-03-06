/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

import {Device, Property} from 'gateway-addon';
import fetch from 'node-fetch';
import {WledDescription} from './wled';

export class BrightnessProperty extends Property<number> {
  // eslint-disable-next-line no-unused-vars
  constructor(device: Device, private url: string) {
    super(device, 'brightness', {
      '@type': 'BrightnessProperty',
      type: 'integer',
      title: 'Brightness',
      minimum: 0,
      maximum: 100,
    });
  }

  async setValue(value: number): Promise<number> {
    const body = {
      bri: Math.round(value / 100 * 255),
      transition: 7,
      v: true,
    };

    const response = await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (response.status != 200) {
      // eslint-disable-next-line max-len
      console.log(`Could not set value: ${response.status} (${response.statusText})`);
    }

    return super.setValue(value);
  }

  update(wledDescription: WledDescription): void {
    const brightness = wledDescription.state.bri;
    this.setCachedValueAndNotify(Math.round(brightness / 255 * 100));
  }
}
