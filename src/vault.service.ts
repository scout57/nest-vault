import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { config } from 'process';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { VaultAuth } from './types/vault-auth.type';
import { VaultEnv } from './types/vault-env.type';
import { VaultValue } from './types/vault-value.type';

@Injectable()
export class VaultService {
  static data: any = {};
  static env: VaultEnv = undefined;
  static path: string = undefined;
  static auth: VaultAuth = undefined;
  static loading = false;
  static loaded = false;

  constructor(private readonly http: HttpService) {}

  public get(key: string, defaults: VaultValue = undefined): VaultValue {
    return VaultService.data[key] ?? defaults;
  }

  public async init(): Promise<VaultService> {
    console.log('Vault: Хочу создать VaultService');

    if (VaultService.loaded || VaultService.loading) {
      console.log('Vault: Скип');
      return;
    }

    VaultService.loading = true;
    try {
      this.env();
      await this.auth();
      await this.data();

      VaultService.loaded = true;
      console.log('Vault: Получен');
    } catch (error) {
      if (error instanceof Error) {
        console.log('Vault: Ошибка - ' + error.message);
      } else {
        console.log('Vault: Ошибка');
      }
    } finally {
      VaultService.loading = false;
      return this;
    }
  }

  private env() {
    VaultService.env = JSON.parse(process.env.APP_VAULT_CONFIG);
    VaultService.path = process.env.APP_VAULT_PATH;
  }

  private async auth() {
    const url = VaultService.env.default.url + '/v1/auth/approle/login';

    const r = await this.http.axiosRef.post(url, VaultService.env.default);

    VaultService.auth = r.data;
  }

  private async data() {
    const url = VaultService.env.default.url + VaultService.path;

    const r = await this.http.axiosRef.get(url, {
      headers: {
        'X-Vault-Token': VaultService.auth.auth.client_token,
      },
    });

    VaultService.data = r.data.data.data;
  }
}
