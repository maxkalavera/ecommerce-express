import lodash from 'lodash';
import { APIError } from '@/utils/errors';
import { ReturnData, PayloadSingle, PayloadMany } from '@/types/layers';


export class LayersReturn<
  Payload extends PayloadSingle<any> | PayloadMany<any> = PayloadSingle<any> | PayloadMany<any>,
> {
  protected data: ReturnData<Payload>;

  constructor (data: ReturnData<Payload>) {
    this.data = data;
  }

  static buildReturn<
    Payload extends PayloadSingle<any> | PayloadMany<any> = PayloadSingle<any> | PayloadMany<any>,
  > (
    returned: ReturnData<Payload>
  ) {
    return new LayersReturn<Payload>(returned);
  }

  public async onSuccess<
    Return extends LayersReturn<any> | void
  > (
    callback: (payload: Payload, options: { buildReturn: (typeof LayersReturn)['buildReturn'] }) => Promise<Return>,
    _options: Partial<{
      raiseExceptions: boolean;
    }> = {}
  ): Promise<Return>
  {
    const options = lodash.defaults(_options, {
      raiseExceptions: true,
    });
    if (this.data.success) {
      return await callback(this.data.payload, {
        buildReturn: LayersReturn.buildReturn,
      });
    }
    if (options.raiseExceptions) {
      throw this.data.error;
    }
    return (new LayersReturn<any>({
      success: false,
      error: this.data.error,
      payload: null,
    })) as Return;
  }

  public onSuccessSync<
    Return extends any
  > (
    callback: (payload: Payload) => Return
  ): void | Return 
  {
    if (this.data.success) {
      callback(this.data.payload);
    }
    return;
  }

  public isSuccess() {
    return this.data.success;
  }

  public getPayload () {
    if (this.data.success) {
      return this.data.payload;
    }
    throw new Error("Return object must be successful to get payload");
  }

  public getError () {
    if (!this.data.success) {
      return this.data.error;
    }
    throw new Error("Return object must have failed to get error");
  }
}